#!/usr/bin/env node
/**
 * Immersphere Asset Lab · Sales Kit Exporter
 *
 * Exporta material comercial listo para enviar a clientes:
 *   - PDF del one-pager
 *   - Capturas PNG de la demo
 *
 * Uso:
 *   npm run export-sales-kit
 *   npm run export
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = path.join(ROOT, 'exports', 'sales-kit', 'decor-asset-lab');

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`  ✅ ${msg}`); }
function warn(msg) { console.log(`  ⚠️  ${msg}`); }
function err(msg) { console.log(`  ❌ ${msg}`); }
function info(msg) { console.log(`  ℹ️  ${msg}`); }

// ── Server helpers ───────────────────────────────────────────
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
      if (text.includes('EADDRINUSE')) {
        if (!resolved) { resolved = true; resolve(null); }
        return;
      }
      if (!resolved) { resolved = true; reject(new Error(text)); }
    });

    setTimeout(() => {
      if (!resolved) { resolved = true; resolve(null); }
    }, 2000);
  });
}

async function stopServer(proc) {
  if (proc && !proc.killed) proc.kill('SIGTERM');
}

// ── Export PDF ───────────────────────────────────────────────
async function exportPDF(browser) {
  const url = `${BASE_URL}/sales/decor-asset-lab-one-pager.html`;
  const outPath = path.join(OUT_DIR, 'decor-asset-lab-one-pager.pdf');
  info(`Exporting PDF: ${url}`);

  const page = await browser.newPage({
    viewport: { width: 1200, height: 1600 }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    const size = fs.statSync(outPath).size;
    ok(`PDF saved: ${path.relative(ROOT, outPath)} (${(size / 1024).toFixed(1)} KB)`);
    return { name: path.basename(outPath), path: outPath, size };
  } catch (e) {
    err(`PDF export failed: ${e.message}`);
    return { name: path.basename(outPath), path: outPath, error: e.message };
  } finally {
    await page.close();
  }
}

// ── Capture screenshot of an element or full page ────────────
async function captureScreenshot(browser, url, fileName, options = {}) {
  const { selector, clip, scrollTo, clickSelector, waitForSelector, waitTimeout = 3000 } = options;
  const outPath = path.join(OUT_DIR, fileName);
  info(`Capturing: ${fileName}`);

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);

    if (scrollTo) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
      }, scrollTo);
      await page.waitForTimeout(400);
    }

    if (clickSelector) {
      const btn = await page.locator(clickSelector).first();
      if (btn) {
        await btn.click();
        await page.waitForTimeout(800);
      }
    }

    if (waitForSelector) {
      try { await page.waitForSelector(waitForSelector, { timeout: 5000 }); } catch (e) { warn(`Selector not found: ${waitForSelector}`); }
    }

    if (selector) {
      const el = await page.locator(selector).first();
      if (el) {
        await el.screenshot({ path: outPath, type: 'png' });
      } else {
        throw new Error(`Element not found: ${selector}`);
      }
    } else if (clip) {
      await page.screenshot({ path: outPath, type: 'png', clip });
    } else {
      await page.screenshot({ path: outPath, type: 'png', fullPage: true });
    }

    const size = fs.statSync(outPath).size;
    ok(`Saved: ${fileName} (${(size / 1024).toFixed(1)} KB)`);
    return { name: fileName, path: outPath, size };
  } catch (e) {
    err(`Capture failed: ${fileName} — ${e.message}`);
    return { name: fileName, path: outPath, error: e.message };
  } finally {
    await page.close();
  }
}

// ── Generate README ──────────────────────────────────────────
function generateREADME(files) {
  const date = new Date().toISOString();
  const rows = files
    .filter(f => !f.error)
    .map(f => `| ${f.name} | ${(f.size / 1024).toFixed(1)} KB | ${f.usage || '—'} |`)
    .join('\n');

  const content = `# Sales Kit Export — Decor Asset Lab

**Fecha de generación:** ${date}

**Nota:** Este directorio contiene material comercial generado automáticamente.  
No incluye archivos GLB. Las capturas son de la demo local.

---

## Archivos generados

| Archivo | Tamaño | Uso recomendado |
|---|---|---|
${rows}

## Qué enviar por email

- **PDF del one-pager** como documento adjunto principal.
- **1-2 capturas PNG** (hero + modal 3D) en el cuerpo del email para despertar interés.

## Qué usar para presentación

- **Capturas 01-06** como diapositivas de soporte.
- **PDF del one-pager** como handout impreso o documento dejado en reunión.

## Qué usar para web / redes

- **Hero (01)** para portada de landing o post de LinkedIn.
- **Modal 3D (04)** para demostrar interactividad.
- **One-pager preview (07)** para thumbnail de descarga.

## Regeneración

Para regenerar este kit:

\`\`\`bash
cd ${ROOT}
npm run export-sales-kit
\`\`\`

---

*Generado por Immersphere Asset Lab · Uso comercial autorizado*
`;

  const readmePath = path.join(OUT_DIR, 'README.md');
  fs.writeFileSync(readmePath, content, 'utf-8');
  ok(`README saved: ${path.relative(ROOT, readmePath)}`);
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Immersphere Asset Lab · Sales Kit Exporter');
  console.log('═══════════════════════════════════════════════════════════════\n');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  info(`Output directory: ${path.relative(ROOT, OUT_DIR)}`);

  // Start server
  let serverProc = null;
  try {
    serverProc = await startServer(PORT);
    if (serverProc) ok(`Local server started on ${BASE_URL}`);
    else info(`Using existing server on ${BASE_URL}`);
  } catch (e) {
    err(`Could not start server: ${e.message}`);
    process.exit(1);
  }

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

  const demoUrl = `${BASE_URL}/demos/terrace-mediterranean-premium/index.html`;
  const results = [];

  // PDF
  results.push(await exportPDF(browser));

  // Demo captures
  const captures = [
    { file: '01-demo-hero.png', scrollTo: '.hero', usage: 'Email, web, LinkedIn' },
    { file: '02-before-after.png', scrollTo: '.before-after', usage: 'Presentación, one-pager' },
    { file: '03-product-grid.png', scrollTo: '#coleccion', usage: 'Presentación, web' },
    {
      file: '04-product-modal-3d.png',
      scrollTo: '#coleccion',
      clickSelector: '.product-card:first-child .card-btn',
      waitForSelector: '#modal-overlay:not([hidden])',
      usage: 'Email, presentación, vídeo'
    },
    { file: '05-commercial-packages.png', scrollTo: '#paquetes', usage: 'Presentación, email de cierre' },
    { file: '06-final-cta.png', scrollTo: '.cta-final', usage: 'Última diapositiva, cierre de vídeo' },
  ];

  for (const cap of captures) {
    const res = await captureScreenshot(browser, demoUrl, cap.file, {
      scrollTo: cap.scrollTo,
      clickSelector: cap.clickSelector,
      waitForSelector: cap.waitForSelector
    });
    res.usage = cap.usage;
    results.push(res);
  }

  // One-pager screenshot
  const onePagerUrl = `${BASE_URL}/sales/decor-asset-lab-one-pager.html`;
  const onePagerRes = await captureScreenshot(browser, onePagerUrl, '07-one-pager-preview.png', { fullPage: true });
  onePagerRes.usage = 'Thumbnail, web, email';
  results.push(onePagerRes);

  await browser.close();
  await stopServer(serverProc);

  // Generate README
  generateREADME(results);

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  EXPORT SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  let totalSize = 0;
  for (const r of results) {
    if (r.error) {
      console.log(`  ❌ ${r.name}: ERROR — ${r.error}`);
    } else {
      totalSize += r.size;
      console.log(`  ✅ ${r.name}: ${(r.size / 1024).toFixed(1)} KB`);
    }
  }
  console.log(`  ───────────────────────────────────────────────────────────`);
  console.log(`  Total: ${results.filter(r => !r.error).length} files, ${(totalSize / 1024).toFixed(1)} KB`);
  console.log(`  Output: ${path.relative(ROOT, OUT_DIR)}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  process.exit(results.some(r => r.error) ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
