#!/usr/bin/env node
/**
 * Immersphere Asset Lab · Automated Preview Generation
 *
 * Uso:
 *   npm run generate-previews
 *   npm run generate-previews -- --asset <id>
 *   npm run generate-previews -- --force
 *   npm run generate-previews -- --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest', 'ikea-sample.manifest.json');
const RENDERER_PATH = '/scripts/preview-renderer.html';

// ── Parse CLI ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const targetAsset = parseArg('--asset');
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

function parseArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

function isPlaceholderPreview(previewPath) {
  return !previewPath || previewPath.includes('placeholder') || previewPath.includes('_placeholder');
}

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`  ✅ ${msg}`); }
function warn(msg) { console.log(`  ⚠️  ${msg}`); }
function err(msg) { console.log(`  ❌ ${msg}`); }
function info(msg) { console.log(`  ℹ️  ${msg}`); }

// ── Start local server ─────────────────────────────────────────
async function startServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['scripts/serve.js'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let resolved = false;
    proc.stdout.on('data', (data) => {
      const text = data.toString();
      if (!resolved && text.includes(`localhost:${port}`)) {
        resolved = true;
        resolve(proc);
      }
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      // Ignore EADDRINUSE if another server is already running
      if (text.includes('EADDRINUSE')) {
        if (!resolved) {
          resolved = true;
          resolve(null); // another server is running
        }
        return;
      }
      if (!resolved) {
        resolved = true;
        reject(new Error(text));
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null); // assume existing server
      }
    }, 2000);
  });
}

async function stopServer(proc) {
  if (proc && !proc.killed) {
    proc.kill('SIGTERM');
  }
}

// ── Generate preview for one asset ─────────────────────────────
async function generatePreview(browser, baseUrl, asset) {
  const safeId = asset.id.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const previewDir = path.join(ROOT, 'previews', asset.brand.toLowerCase(), asset.category.toLowerCase());
  const previewFileName = `${safeId}-preview.png`;
  const previewPath = path.join(previewDir, previewFileName);
  const relativePreviewPath = path.posix.join('previews', asset.brand.toLowerCase(), asset.category.toLowerCase(), previewFileName);

  if (!force && !isPlaceholderPreview(asset.previewPath) && fs.existsSync(previewPath)) {
    info(`Skipping "${asset.id}" — real preview already exists`);
    return { status: 'skipped', path: relativePreviewPath };
  }

  const modelUrl = `${baseUrl}/${asset.modelPath.replace(/\\/g, '/')}`;
  const rendererUrl = `${baseUrl}${RENDERER_PATH}?model=${encodeURIComponent(modelUrl)}`;

  info(`Rendering "${asset.id}" → ${rendererUrl}`);

  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 1
  });

  try {
    await page.goto(rendererUrl, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for model-viewer to signal ready via document title
    try {
      await page.waitForFunction(() => document.title === 'READY' || document.title === 'ERROR' || document.title === 'TIMEOUT', { timeout: 30000 });
    } catch (e) {
      warn(`Timeout waiting for model load on "${asset.id}"`);
    }

    const title = await page.title();
    if (title === 'ERROR' || title === 'TIMEOUT') {
      throw new Error(`Model failed to load (title: ${title})`);
    }

    // Additional wait for render frame
    await page.waitForTimeout(1500);

    if (!dryRun) {
      fs.mkdirSync(previewDir, { recursive: true });
      await page.screenshot({ path: previewPath, type: 'png', omitBackground: true });
      const stats = fs.statSync(previewPath);
      ok(`Saved preview: ${relativePreviewPath} (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      ok(`[DRY-RUN] Would save: ${relativePreviewPath}`);
    }

    return { status: 'success', path: relativePreviewPath, size: dryRun ? 0 : fs.statSync(previewPath).size };
  } catch (e) {
    err(`Failed to render "${asset.id}": ${e.message}`);
    return { status: 'error', error: e.message };
  } finally {
    await page.close();
  }
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Immersphere Asset Lab · Preview Generation');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(MANIFEST_PATH)) {
    err(`Manifest not found: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (e) {
    err(`Invalid manifest JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(manifest)) {
    err('Manifest root must be an array');
    process.exit(1);
  }

  const PORT = 3456;
  const BASE_URL = `http://localhost:${PORT}`;

  // Start server if not running
  let serverProc = null;
  try {
    serverProc = await startServer(PORT);
    if (serverProc) {
      ok(`Local server started on ${BASE_URL}`);
    } else {
      info(`Using existing server on ${BASE_URL}`);
    }
  } catch (e) {
    err(`Could not start server: ${e.message}`);
    process.exit(1);
  }

  // Give server a moment
  await new Promise(r => setTimeout(r, 500));

  // Launch browser
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    ok('Browser launched');
  } catch (e) {
    err(`Could not launch browser: ${e.message}`);
    await stopServer(serverProc);
    process.exit(1);
  }

  // Filter assets to process
  const candidates = manifest.filter(a => {
    if (a.hasRealModel !== true) return false;
    if (a.isPlaceholder !== false) return false;
    const modelFullPath = path.join(ROOT, a.modelPath);
    if (!fs.existsSync(modelFullPath)) return false;
    if (targetAsset && a.id !== targetAsset) return false;
    return true;
  });

  if (candidates.length === 0) {
    info('No real assets found needing preview generation');
    await browser.close();
    await stopServer(serverProc);
    process.exit(0);
  }

  info(`Found ${candidates.length} asset(s) to process`);

  const results = [];
  let updated = false;

  for (const asset of candidates) {
    const result = await generatePreview(browser, BASE_URL, asset);
    results.push({ id: asset.id, ...result });

    if (result.status === 'success' && !dryRun) {
      // Update manifest previewPath
      const idx = manifest.findIndex(a => a.id === asset.id);
      if (idx !== -1) {
        manifest[idx].previewPath = result.path;
        updated = true;
      }
    }
  }

  await browser.close();
  await stopServer(serverProc);

  // Write manifest if updated
  if (updated) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
    ok(`Manifest updated: ${MANIFEST_PATH}`);
  } else if (!dryRun) {
    info('No manifest changes needed');
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  const success = results.filter(r => r.status === 'success').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;
  console.log(`  Success:  ${success}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  for (const r of results) {
    const size = r.size ? `(${(r.size / 1024).toFixed(1)} KB)` : '';
    console.log(`    ${r.id}: ${r.status} ${r.path || ''} ${size}`);
  }
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (dryRun) {
    console.log('  📝 DRY RUN — no files were written.\n');
  }

  process.exit(errors > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
