#!/usr/bin/env node
/**
 * Immersphere Asset Lab · Assisted folder ingestion
 *
 * Reads manually downloaded GLB files from imports/inbox, creates metadata
 * drafts, and optionally moves known categories into assets/ikea/{category}/.
 *
 * It never updates the manifest automatically.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'manifest', 'ikea-sample.manifest.json');
const DEFAULT_INPUT = 'imports/inbox';
const DRAFT_DIR = path.join(ROOT, 'imports', 'metadata-drafts');
const REJECTED_DIR = path.join(ROOT, 'imports', 'rejected');

const VALID_CATEGORIES = new Set([
  'chair',
  'armchair',
  'sofa',
  'table',
  'side-table',
  'coffee-table',
  'tv-unit',
  'shelf',
  'bed',
  'bedside-table',
  'dresser',
  'wardrobe',
  'vanity',
  'mirror',
  'bench',
  'sideboard',
  'display-cabinet',
  'kitchen-wall-cabinet',
  'kitchen-base-cabinet',
  'kitchen-tall-cabinet',
  'kitchen-corner-cabinet',
  'kitchen-sliding-wall-cabinet',
  'kitchen-storage',
  'kitchen-cabinet',
  'desk',
  'office-chair',
  'lighting',
  'rug',
  'planter',
  'textile',
  'decor',
  'storage',
  'kitchen',
  'bathroom',
  'unknown',
]);

const CATEGORY_RULES = [
  ['kitchen-sliding-wall-cabinet', ['armario-de-pared-puertas-correderas', 'armario de pared puertas correderas', 'armario-de-pared&puertas-correderas', 'armario de pared&puertas correderas']],
  ['kitchen-corner-cabinet', ['armario-bajo-cocina-esquina', 'armario bajo cocina esquina']],
  ['kitchen-base-cabinet', ['armario-bajo-con-puertas-y-cajon', 'armario bajo con puertas y cajon', 'armario bajo con puertas y cajÃ³n', 'armario-bajo-puerta-y-hueco', 'armario bajo puerta y hueco', 'armario-bajo+puerta-y-hueco', 'armario bajo+puerta y hueco', 'ab-cajones', 'ab cajones']],
  ['kitchen-tall-cabinet', ['armario-alto-con-puerta', 'armario alto con puerta']],
  ['kitchen-wall-cabinet', ['armario-de-pared-con-puertas', 'armario de pared con puertas', 'armario-de-pared-con-puerta', 'armario de pared con puerta']],
  ['kitchen-storage', ['modulo-almacenaje-cocina', 'modulo almacenaje cocina', 'mÃ³dulo almacenaje cocina']],
  ['kitchen-cabinet', ['knoxhult']],
  ['coffee-table', ['mesa-de-centro', 'mesa de centro', 'mesa-centro', 'mesa centro', 'coffee-table', 'coffee table', 'centre table', 'center table', 'coffee']],
  ['side-table', ['mesa-auxiliar', 'mesa auxiliar', 'side']],
  ['rug', ['alfombra', 'rug']],
  ['bench', ['banco-con-almacenaje', 'banco con almacenaje', 'banco', 'bench']],
  ['sideboard', ['aparador', 'sideboard']],
  ['display-cabinet', ['vitrina', 'display cabinet', 'display-cabinet']],
  ['tv-unit', ['mueble-tv', 'mueble tv', 'tv unit', 'tv-unit']],
  ['office-chair', ['office-chair', 'silla-oficina', 'silla oficina']],
  ['bedside-table', ['mesita-de-noche', 'mesita de noche', 'mesilla', 'bedside']],
  ['dresser', ['comoda', 'cómoda', 'cajones', 'dresser']],
  ['wardrobe', ['armario-con-puertas', 'armario con puertas', 'armario', 'wardrobe']],
  ['vanity', ['tocador', 'vanity']],
  ['mirror', ['espejo', 'mirror']],
  ['armchair', ['sillon', 'sillón', 'armchair']],
  ['chair', ['silla', 'chair']],
  ['sofa', ['sofa', 'sofá']],
  ['table', ['mesa', 'table']],
  ['lighting', ['lampara', 'lámpara', 'lamp', 'lighting']],
  ['bed', ['estructura-de-cama', 'estructura de cama', 'cama-tapizada', 'cama tapizada', 'canape', 'canapé', 'cama', 'bed']],
  ['desk', ['escritorio', 'desk']],
  ['shelf', ['estanteria', 'estantería', 'shelf']],
  ['textile', ['cojin', 'cojín', 'cushion', 'textile']],
  ['planter', ['jardinera', 'planter']],
  ['decor', ['adorno', 'decor']],
  ['storage', ['storage', 'almacenaje']],
  ['kitchen', ['kitchen', 'cocina']],
  ['bathroom', ['bathroom', 'bano', 'baño']],
];

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(ROOT, options.input);
  const manifest = loadManifest();
  const summary = {
    detected: 0,
    draftsCreated: 0,
    moved: 0,
    rejected: 0,
    warnings: [],
  };

  printHeader(options, inputPath);
  ensureImportDirs();

  if (!fs.existsSync(inputPath)) {
    console.log(`\nNo existe la carpeta de entrada: ${relative(inputPath)}`);
    console.log('Crea la carpeta o usa --input <ruta>.');
    return;
  }

  const files = fs.readdirSync(inputPath)
    .filter((name) => name.toLowerCase().endsWith('.glb'))
    .map((name) => path.join(inputPath, name));

  if (files.length === 0) {
    console.log(`\nNo se encontraron archivos .glb en ${relative(inputPath)}.`);
    console.log('Coloca GLB descargados manualmente en imports/inbox/ y vuelve a ejecutar.');
    console.log('\nResumen: 0 archivos detectados, 0 drafts creados, 0 manifest updates.');
    return;
  }

  summary.detected = files.length;

  for (const sourcePath of files) {
    processGlb(sourcePath, manifest, options, summary);
  }

  printSummary(summary, options);
}

function parseArgs(args) {
  const options = {
    input: DEFAULT_INPUT,
    collection: 'PENDING-COLLECTION',
    room: 'PENDING-ROOM',
    brand: 'IKEA',
    dryRun: false,
    apply: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--input' && args[i + 1]) options.input = args[++i];
    else if (arg === '--collection' && args[i + 1]) options.collection = args[++i];
    else if (arg === '--room' && args[i + 1]) options.room = args[++i];
    else if (arg === '--brand' && args[i + 1]) options.brand = args[++i];
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--apply') options.apply = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  if (!options.apply) options.dryRun = true;
  if (options.apply && options.dryRun) {
    fatal('Usa solo uno: --dry-run o --apply.');
  }

  return options;
}

function processGlb(sourcePath, manifest, options, summary) {
  const originalName = path.basename(sourcePath);
  const baseName = originalName.replace(/\.glb$/i, '');
  const slug = slugify(baseName);
  const category = detectCategory(baseName);
  const fileSizeMb = getFileSizeMb(sourcePath);
  const targetFileName = `${slug}.glb`;
  const knownCategory = category !== 'unknown';
  const targetDir = knownCategory
    ? path.join(ROOT, 'assets', options.brand.toLowerCase(), category)
    : REJECTED_DIR;
  const finalTargetPath = getSafeTargetPath(path.join(targetDir, targetFileName));
  const duplicateWarnings = detectDuplicates(manifest, slug, category, options.brand);
  const draft = buildDraft({
    slug,
    category,
    originalName,
    targetFileName: path.basename(finalTargetPath),
    targetPath: finalTargetPath,
    fileSizeMb,
    options,
  });
  const draftPath = path.join(DRAFT_DIR, `${slug}.metadata.json`);

  console.log(`\n- ${originalName}`);
  console.log(`  slug: ${slug}`);
  console.log(`  category: ${category}`);
  console.log(`  size: ${fileSizeMb} MB`);

  if (duplicateWarnings.length > 0) {
    duplicateWarnings.forEach((warning) => {
      summary.warnings.push(`${originalName}: ${warning}`);
      console.log(`  warning: ${warning}`);
    });
  }

  if (options.dryRun) {
    console.log(`  dry-run: crearia draft ${relative(draftPath)}`);
    console.log(`  dry-run: ${knownCategory ? `moveria a ${relative(finalTargetPath)}` : `marcaria como rechazado en ${relative(finalTargetPath)}`}`);
    return;
  }

  fs.mkdirSync(DRAFT_DIR, { recursive: true });
  writeJson(draftPath, draft);
  summary.draftsCreated += 1;
  console.log(`  draft: ${relative(draftPath)}`);

  if (!knownCategory) {
    fs.mkdirSync(REJECTED_DIR, { recursive: true });
    fs.renameSync(sourcePath, finalTargetPath);
    summary.rejected += 1;
    console.log(`  rejected: ${relative(finalTargetPath)}`);
    summary.warnings.push(`${originalName}: category unknown; moved to imports/rejected/`);
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.renameSync(sourcePath, finalTargetPath);
  summary.moved += 1;
  console.log(`  moved: ${relative(finalTargetPath)}`);
}

function buildDraft({ slug, category, originalName, targetFileName, targetPath, fileSizeMb, options }) {
  return {
    id: `PENDING-${slug}`,
    sku: 'PENDING-SKU',
    brand: options.brand,
    productName: 'PENDING product name',
    collectionId: options.collection,
    roomType: options.room,
    category,
    sourceFileName: originalName,
    targetFileName,
    targetModelPath: relative(targetPath).replace(/\\/g, '/'),
    previewPath: 'PENDING',
    license: 'PENDING',
    commercialUse: false,
    redistributionAllowed: false,
    brandUsageAllowed: false,
    hasRealModel: true,
    fileSizeMb,
    scaleChecked: false,
    qaStatus: 'draft',
    notes: 'Generated by ingest-folder. Review manually before manifest ingestion.',
  };
}

function detectCategory(name) {
  const normalized = normalizeText(name);
  for (const [category, needles] of CATEGORY_RULES) {
    if (needles.some((needle) => normalized.includes(normalizeText(needle)))) {
      return category;
    }
  }
  return 'unknown';
}

function detectDuplicates(manifest, slug, category, brand) {
  const warnings = [];
  const id = `PENDING-${slug}`;
  const modelPath = `assets/${brand.toLowerCase()}/${category}/${slug}.glb`;
  if (manifest.some((asset) => asset.id === id)) warnings.push(`possible duplicate id ${id}`);
  if (manifest.some((asset) => asset.modelPath === modelPath)) warnings.push(`possible duplicate modelPath ${modelPath}`);
  if (manifest.some((asset) => String(asset.sku || '').toLowerCase() === slug)) warnings.push(`possible duplicate sku-like slug ${slug}`);
  return warnings;
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) fatal('Manifest root must be an array.');
  return parsed;
}

function getSafeTargetPath(targetPath) {
  if (!fs.existsSync(targetPath)) return targetPath;
  const dir = path.dirname(targetPath);
  const ext = path.extname(targetPath);
  const base = path.basename(targetPath, ext);
  let index = 2;
  let candidate = path.join(dir, `${base}-${index}${ext}`);
  while (fs.existsSync(candidate)) {
    index += 1;
    candidate = path.join(dir, `${base}-${index}${ext}`);
  }
  return candidate;
}

function ensureImportDirs() {
  for (const dir of [
    path.join(ROOT, 'imports', 'inbox'),
    DRAFT_DIR,
    path.join(ROOT, 'imports', 'processed'),
    REJECTED_DIR,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'asset';
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getFileSizeMb(filePath) {
  const stat = fs.statSync(filePath);
  return Number((stat.size / (1024 * 1024)).toFixed(2));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function printHeader(options, inputPath) {
  console.log('\nImmersphere Asset Lab · Assisted Folder Importer');
  console.log('------------------------------------------------');
  console.log(`mode: ${options.apply ? 'apply' : 'dry-run'}`);
  console.log(`input: ${relative(inputPath)}`);
  console.log(`collection: ${options.collection}`);
  console.log(`room: ${options.room}`);
  console.log(`brand: ${options.brand}`);
  console.log('manifest update: never automatic');
}

function printSummary(summary, options) {
  console.log('\nImport summary');
  console.log('--------------');
  console.log(`files detected: ${summary.detected}`);
  console.log(`drafts created: ${summary.draftsCreated}`);
  console.log(`files moved: ${summary.moved}`);
  console.log(`rejected: ${summary.rejected}`);
  console.log(`warnings: ${summary.warnings.length}`);
  if (summary.warnings.length > 0) {
    summary.warnings.forEach((warning) => console.log(`- ${warning}`));
  }
  if (options.dryRun) {
    console.log('\nDry-run only. No files were moved, no drafts were written, manifest was not changed.');
  } else {
    console.log('\nNext steps: review drafts, complete metadata/license, ingest officially, generate previews, run npm run check and npm run preflight.');
  }
}

function printHelp() {
  console.log(`
Usage:
  npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --dry-run
  npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --apply

Options:
  --input <path>       Input folder. Default: imports/inbox
  --collection <id>    Target collection id for draft metadata
  --room <roomType>    Target room type for draft metadata
  --brand <brand>      Brand folder/name. Default: IKEA
  --dry-run            List planned drafts and moves only
  --apply              Write drafts and move GLB files where safe
`);
}

function fatal(message) {
  console.error(`\nFATAL: ${message}\n`);
  process.exit(1);
}

main();
