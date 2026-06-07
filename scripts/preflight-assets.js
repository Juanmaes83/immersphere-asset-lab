#!/usr/bin/env node
/**
 * Immersphere Asset Lab · Preflight de Seguridad
 *
 * Uso:
 *   node scripts/preflight-assets.js
 *   npm run preflight
 *
 * Comprueba que el repo está seguro antes de commit/push.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest', 'ikea-sample.manifest.json');

let errors = 0;
let warnings = 0;

function ok(msg)  { console.log(`  ✅ ${msg}`); }
function warn(msg){ console.log(`  ⚠️  ${msg}`); warnings++; }
function fail(msg){ console.log(`  ❌ ${msg}`); errors++; }
function info(msg) { console.log(`  ℹ️  ${msg}`); }
function section(title) { console.log(`\n── ${title} ────────────────────────────────────────────`); }

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Immersphere Asset Lab · Preflight Security Check');
console.log('═══════════════════════════════════════════════════════════════');

// ── 1. Manifest validation ─────────────────────────────────────
section('Manifest Validation');

if (!fs.existsSync(MANIFEST_PATH)) {
  fail('Manifest file not found');
} else {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (e) {
    fail(`Manifest JSON invalid: ${e.message}`);
    manifest = null;
  }

  if (manifest) {
    if (!Array.isArray(manifest)) {
      fail('Manifest root is not an array');
    } else {
      ok(`Manifest is valid array with ${manifest.length} asset(s)`);

      const ids = new Set();
      const skus = new Set();
      let realAssets = 0;
      let placeholders = 0;

      for (const asset of manifest) {
        if (!asset.id || !asset.sku) {
          fail(`Asset missing id or sku`);
          continue;
        }
        if (ids.has(asset.id)) fail(`Duplicate id: ${asset.id}`);
        if (skus.has(asset.sku)) fail(`Duplicate sku: ${asset.sku}`);
        ids.add(asset.id);
        skus.add(asset.sku);

        if (asset.hasRealModel === true) {
          realAssets++;

          // modelPath exists
          const modelFullPath = path.join(ROOT, asset.modelPath);
          if (!fs.existsSync(modelFullPath)) {
            fail(`Real asset "${asset.id}": modelPath not found: ${asset.modelPath}`);
          }

          // fileSizeMb > 0
          if (typeof asset.fileSizeMb !== 'number' || asset.fileSizeMb <= 0) {
            fail(`Real asset "${asset.id}": fileSizeMb must be > 0`);
          }

          // isPlaceholder must be false
          if (asset.isPlaceholder !== false) {
            fail(`Real asset "${asset.id}": isPlaceholder must be false`);
          }

          // preview check: warn if still using placeholder
          if (!asset.previewPath || asset.previewPath.includes('placeholder') || asset.previewPath.includes('_placeholder')) {
            warn(`Real asset "${asset.id}" still uses placeholder preview. Generate a real preview and update previewPath.`);
          }
        } else {
          placeholders++;

          // previewPath should exist or be placeholder
          if (!asset.previewPath) {
            warn(`Placeholder asset "${asset.id}": missing previewPath`);
          }
        }

        // license check
        if (asset.commercialUseAllowed === true) {
          if (!asset.permissionDocumentRef || String(asset.permissionDocumentRef).trim() === '') {
            fail(`Asset "${asset.id}": commercialUseAllowed=true but no permissionDocumentRef`);
          }
        }
      }

      ok(`Unique ids: ${ids.size}`);
      ok(`Unique skus: ${skus.size}`);
      ok(`Real assets: ${realAssets}`);
      ok(`Placeholders: ${placeholders}`);
    }
  }
}

// ── 2. Git safety ──────────────────────────────────────────────
section('Git Safety');

let trackedGlb = [];
let stagedGlb = [];

try {
  const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  trackedGlb = tracked.split('\n').filter(f => f.toLowerCase().endsWith('.glb'));
} catch (e) {
  warn('Could not run git ls-files');
}

try {
  const staged = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  stagedGlb = staged.split('\n').filter(f => f.toLowerCase().endsWith('.glb'));
} catch (e) {
  // no commits yet or no staged files
}

if (trackedGlb.length > 0) {
  fail(`${trackedGlb.length} .glb file(s) tracked by Git: ${trackedGlb.join(', ')}`);
} else {
  ok('No .glb files tracked by Git');
}

if (stagedGlb.length > 0) {
  fail(`${stagedGlb.length} .glb file(s) staged for commit: ${stagedGlb.join(', ')}`);
} else {
  ok('No .glb files staged for commit');
}

// Check for GLB in repo root
const rootEntries = fs.readdirSync(ROOT);
const rootGlb = rootEntries.filter(f => f.toLowerCase().endsWith('.glb'));
if (rootGlb.length > 0) {
  warn(`.glb file(s) in repo root: ${rootGlb.join(', ')} (should be in assets/ subfolders)`);
} else {
  ok('No .glb files in repo root');
}

// ── 3. File structure ──────────────────────────────────────────
section('File Structure');

const requiredDirs = ['assets', 'previews', 'manifest', 'viewer', 'docs', 'scripts', 'templates'];
for (const dir of requiredDirs) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    ok(`Directory exists: ${dir}/`);
  } else {
    warn(`Directory missing: ${dir}/`);
  }
}

// ── Summary ────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  PREFLIGHT SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Assets in manifest: ${(() => {
  try {
    const m = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    return Array.isArray(m) ? m.length : '?';
  } catch { return '?'; }
})()}`);
console.log(`  Errors:   ${errors}`);
console.log(`  Warnings: ${warnings}`);
console.log('═══════════════════════════════════════════════════════════════');

if (errors > 0) {
  console.log('\n❌ PREFLIGHT FAILED — Fix errors before committing.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  PREFLIGHT PASSED WITH WARNINGS — Review warnings.\n');
  process.exit(0);
} else {
  console.log('\n✅ ALL PREFLIGHT CHECKS PASSED — Safe to commit.\n');
  process.exit(0);
}
