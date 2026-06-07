#!/usr/bin/env node
/**
 * Immersphere Asset Lab · Ingesta Manual Controlada
 *
 * Uso:
 *   node scripts/ingest-asset.js --metadata path/to/asset.json
 *
 * Añade un asset al manifest tras validar metadata, unicidad y seguridad.
 * NO copia GLB. Asume que el GLB ya está en su carpeta destino.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest', 'ikea-sample.manifest.json');

// ── Parse CLI ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const metadataFlag = args.indexOf('--metadata');
if (metadataFlag === -1 || !args[metadataFlag + 1]) {
  console.error('\n❌ Uso: node scripts/ingest-asset.js --metadata <ruta-al-json>\n');
  process.exit(1);
}
const metadataPath = path.resolve(args[metadataFlag + 1]);

// ── Helper: print ──────────────────────────────────────────────
function ok(msg)  { console.log(`  ✅ ${msg}`); }
function warn(msg){ console.log(`  ⚠️  ${msg}`); }
function err(msg) { console.error(`  ❌ ${msg}`); }
function fatal(msg) { console.error(`\n❌ FATAL: ${msg}\n`); process.exit(1); }
function info(msg) { console.log(`  ℹ️  ${msg}`); }

// ── Step 1: Read metadata file ─────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Immersphere Asset Lab · Ingesta Manual');
console.log('═══════════════════════════════════════════════════════════════\n');

if (!fs.existsSync(metadataPath)) {
  fatal(`Metadata file not found: ${metadataPath}`);
}
info(`Metadata file: ${metadataPath}`);

let metadata;
try {
  const raw = fs.readFileSync(metadataPath, 'utf-8');
  metadata = JSON.parse(raw);
} catch (e) {
  fatal(`Invalid JSON in metadata file: ${e.message}`);
}

// ── Step 2: Load manifest ──────────────────────────────────────
if (!fs.existsSync(MANIFEST_PATH)) {
  fatal(`Manifest not found: ${MANIFEST_PATH}`);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
} catch (e) {
  fatal(`Manifest JSON invalid: ${e.message}`);
}

if (!Array.isArray(manifest)) {
  fatal('Manifest root must be an array');
}

// ── Step 3: Strip internal keys ────────────────────────────────
const asset = {};
for (const [k, v] of Object.entries(metadata)) {
  if (k.startsWith('_')) continue;
  asset[k] = v;
}

// ── Step 4: Validate required fields ───────────────────────────
console.log('\n── Validación de campos obligatorios ─────────────────────────');
const REQUIRED = ['id', 'brand', 'productName', 'category', 'sku', 'modelPath', 'previewPath', 'format', 'licenseType', 'qaStatus'];
const missing = REQUIRED.filter(f => asset[f] === undefined || asset[f] === null || asset[f] === '');
if (missing.length > 0) {
  fatal(`Missing required fields: ${missing.join(', ')}`);
}
ok(`All ${REQUIRED.length} required fields present`);

// ── Step 5: Validate uniqueness ────────────────────────────────
console.log('\n── Validación de unicidad ────────────────────────────────────');
const dupId = manifest.find(a => a.id === asset.id);
if (dupId) fatal(`Duplicate id: "${asset.id}" already exists in manifest`);
ok(`id "${asset.id}" is unique`);

const dupSku = manifest.find(a => a.sku === asset.sku);
if (dupSku) fatal(`Duplicate sku: "${asset.sku}" already exists in manifest`);
ok(`sku "${asset.sku}" is unique`);

// ── Step 6: Validate real model rules ──────────────────────────
console.log('\n── Validación de modelo real ─────────────────────────────────');
if (asset.hasRealModel === true) {
  if (asset.isPlaceholder !== false) {
    fatal('hasRealModel=true requires isPlaceholder=false');
  }
  if (asset.format !== 'glb') {
    fatal('hasRealModel=true requires format="glb"');
  }
  if (!asset.modelPath.toLowerCase().endsWith('.glb')) {
    fatal('hasRealModel=true requires modelPath ending in .glb');
  }
  if (typeof asset.fileSizeMb !== 'number' || asset.fileSizeMb <= 0) {
    fatal('hasRealModel=true requires fileSizeMb > 0');
  }

  const fullModelPath = path.join(ROOT, asset.modelPath);
  if (!fs.existsSync(fullModelPath)) {
    fatal(`hasRealModel=true but GLB not found on disk: ${fullModelPath}`);
  }
  ok(`GLB exists on disk: ${asset.modelPath}`);

  const stat = fs.statSync(fullModelPath);
  const sizeMb = stat.size / (1024 * 1024);
  const diff = Math.abs(sizeMb - asset.fileSizeMb);
  if (diff > 1.0) {
    warn(`fileSizeMb mismatch: declared ${asset.fileSizeMb}, actual ~${sizeMb.toFixed(2)}`);
  } else {
    ok(`fileSizeMb matches actual size (~${sizeMb.toFixed(2)} MB)`);
  }
} else {
  if (asset.isPlaceholder !== true) {
    warn('hasRealModel=false but isPlaceholder is not true — setting isPlaceholder=true');
    asset.isPlaceholder = true;
  }
  ok('Placeholder asset — no GLB required');
}

// ── Step 7: Validate license rules ─────────────────────────────
console.log('\n── Validación de licencia ────────────────────────────────────');
if (asset.commercialUseAllowed === true) {
  if (!asset.permissionDocumentRef || asset.permissionDocumentRef.trim() === '') {
    fatal('commercialUseAllowed=true requires permissionDocumentRef');
  }
  ok('Permission document referenced');
} else {
  info('Commercial use not allowed — no permission doc required');
}

// ── Step 8: Git safety check ───────────────────────────────────
console.log('\n── Validación de seguridad Git ───────────────────────────────');
let gitTrackedGlb = [];
try {
  const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf-8' });
  gitTrackedGlb = tracked.split('\n').filter(f => f.toLowerCase().endsWith('.glb'));
} catch (e) {
  warn('Could not run git ls-files — ensure repo is initialized');
}

if (gitTrackedGlb.length > 0) {
  fatal(`Git tracks ${gitTrackedGlb.length} .glb file(s): ${gitTrackedGlb.join(', ')}`);
}
ok('No .glb files tracked by Git');

// ── Step 9: Append to manifest ─────────────────────────────────
console.log('\n── Actualización de manifest ─────────────────────────────────');
manifest.push(asset);

const output = JSON.stringify(manifest, null, 2);
fs.writeFileSync(MANIFEST_PATH, output + '\n', 'utf-8');
ok(`Asset appended to manifest: ${MANIFEST_PATH}`);

// ── Step 10: Re-validate manifest ──────────────────────────────
console.log('\n── Re-validación de manifest ─────────────────────────────────');
try {
  const revalidated = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  if (!Array.isArray(revalidated)) throw new Error('Not an array');

  const ids = new Set();
  const skus = new Set();
  for (const item of revalidated) {
    if (!item.id || !item.sku) throw new Error('Missing id or sku');
    if (ids.has(item.id)) throw new Error(`Duplicate id: ${item.id}`);
    if (skus.has(item.sku)) throw new Error(`Duplicate sku: ${item.sku}`);
    ids.add(item.id);
    skus.add(item.sku);
  }
  ok(`Manifest valid: ${revalidated.length} assets, ${ids.size} unique ids, ${skus.size} unique skus`);
} catch (e) {
  fatal(`Manifest re-validation failed: ${e.message}`);
}

// ── Summary ────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  ✅ INGESTA COMPLETADA');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  id:           ${asset.id}`);
console.log(`  sku:          ${asset.sku}`);
console.log(`  name:         ${asset.productName}`);
console.log(`  modelPath:    ${asset.modelPath}`);
console.log(`  realModel:    ${asset.hasRealModel ? 'YES' : 'NO'}`);
console.log(`  manifest:     ${manifest.length} assets total`);
console.log('');
console.log('  Próximos pasos:');
console.log('    1. npm run check');
console.log('    2. npm run preflight');
console.log('    3. npm start  →  abrir http://localhost:3456/viewer/');
console.log('    4. Verificar que el asset aparece y el GLB carga en 3D');
console.log('    5. git add manifest/ikea-sample.manifest.json');
console.log('    6. git commit (NO incluir .glb)');
console.log('');
console.log('  ⚠️  IMPORTANTE: NO hacer git add del archivo .glb');
console.log('     El GLB debe permanecer fuera del control de versiones.');
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(0);
