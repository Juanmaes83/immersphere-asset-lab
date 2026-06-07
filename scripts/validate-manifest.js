/**
 * Immersphere Asset Lab · Manifest Validator
 * Script Node simple, sin dependencias externas.
 * Valida que el manifest cumpla el schema mínimo.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MANIFEST_PATH = join(__dirname, '..', 'manifest', 'ikea-sample.manifest.json');

const REQUIRED_FIELDS = [
  'id',
  'brand',
  'productName',
  'category',
  'sku',
  'modelPath',
  'previewPath',
  'format',
  'licenseType',
  'qaStatus'
];

const VALID_CATEGORIES = [
  'sofa', 'armchair', 'coffee-table', 'dining-table', 'chair',
  'bed', 'wardrobe', 'lamp', 'rug', 'decor', 'shelf',
  'kitchen', 'bathroom', 'office', 'textile', 'other'
];

const VALID_FORMATS = ['glb', 'gltf', 'fbx', 'obj', 'usdz', 'blend'];

const VALID_LICENSES = [
  'unknown', 'personal-only', 'editorial', 'commercial-demo',
  'authorized-commercial-demo', 'authorized-commercial', 'internal', 'expired'
];

const VALID_QA = ['pending', 'in-review', 'approved', 'rejected', 'deprecated'];

let exitCode = 0;
const errors = [];

function log(message) {
  console.log(message);
}

function error(message) {
  console.error(`  ❌ ${message}`);
  errors.push(message);
  exitCode = 1;
}

function warn(message) {
  console.warn(`  ⚠️  ${message}`);
}

function ok(message) {
  console.log(`  ✅ ${message}`);
}

// ── Load manifest ──────────────────────────────────────────────
log('\n═══════════════════════════════════════════════════════════════');
log('  Immersphere Asset Lab · Manifest Validator');
log('═══════════════════════════════════════════════════════════════\n');

let manifest;
try {
  const raw = readFileSync(MANIFEST_PATH, 'utf-8');
  manifest = JSON.parse(raw);
  ok(`Manifest loaded: ${MANIFEST_PATH}`);
} catch (err) {
  error(`Failed to load manifest: ${err.message}`);
  process.exit(1);
}

// ── Validate root structure ────────────────────────────────────
log('\n── Root Structure ────────────────────────────────────────────');

if (!Array.isArray(manifest)) {
  error('Manifest root must be an array');
  process.exit(1);
}

if (manifest.length === 0) {
  error('Manifest array is empty');
  process.exit(1);
}

ok(`Manifest is an array with ${manifest.length} item(s)`);

// ── Validate each item ─────────────────────────────────────────
log('\n── Item Validation ───────────────────────────────────────────');

const seenIds = new Set();
const seenSkus = new Set();

for (let i = 0; i < manifest.length; i++) {
  const item = manifest[i];
  const prefix = `[${i + 1}/${manifest.length}]`;
  const itemLabel = item.id || item.sku || `#${i}`;
  log(`\n${prefix} ${itemLabel}`);

  // Must be object
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    error(`${prefix} Item is not an object`);
    continue;
  }

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in item) || item[field] === undefined || item[field] === null || item[field] === '') {
      error(`${prefix} Missing required field: "${field}"`);
    }
  }

  // Unique id
  if (item.id) {
    if (seenIds.has(item.id)) {
      error(`${prefix} Duplicate id: "${item.id}"`);
    } else {
      seenIds.add(item.id);
    }
    if (!/^[a-z0-9-]+$/.test(item.id)) {
      warn(`${prefix} id "${item.id}" should match pattern ^[a-z0-9-]+$`);
    }
  }

  // Unique sku
  if (item.sku) {
    if (seenSkus.has(item.sku)) {
      error(`${prefix} Duplicate sku: "${item.sku}"`);
    } else {
      seenSkus.add(item.sku);
    }
  }

  // Category enum
  if (item.category && !VALID_CATEGORIES.includes(item.category)) {
    error(`${prefix} Invalid category: "${item.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Format enum
  if (item.format && !VALID_FORMATS.includes(item.format)) {
    error(`${prefix} Invalid format: "${item.format}". Must be one of: ${VALID_FORMATS.join(', ')}`);
  }

  // License enum
  if (item.licenseType && !VALID_LICENSES.includes(item.licenseType)) {
    error(`${prefix} Invalid licenseType: "${item.licenseType}". Must be one of: ${VALID_LICENSES.join(', ')}`);
  }

  // QA enum
  if (item.qaStatus && !VALID_QA.includes(item.qaStatus)) {
    error(`${prefix} Invalid qaStatus: "${item.qaStatus}". Must be one of: ${VALID_QA.join(', ')}`);
  }

  // Numeric validations
  if (item.fileSizeMb !== undefined && (typeof item.fileSizeMb !== 'number' || item.fileSizeMb < 0)) {
    error(`${prefix} fileSizeMb must be a non-negative number`);
  }

  if (item.polygonCount !== undefined && item.polygonCount !== null && (!Number.isInteger(item.polygonCount) || item.polygonCount < 0)) {
    error(`${prefix} polygonCount must be a non-negative integer or null`);
  }

  if (item.textureCount !== undefined && item.textureCount !== null && (!Number.isInteger(item.textureCount) || item.textureCount < 0)) {
    error(`${prefix} textureCount must be a non-negative integer or null`);
  }

  // Dimensions object
  if (item.dimensions !== undefined && item.dimensions !== null) {
    if (typeof item.dimensions !== 'object' || Array.isArray(item.dimensions)) {
      error(`${prefix} dimensions must be an object`);
    } else {
      for (const dimKey of ['width', 'height', 'depth']) {
        if (item.dimensions[dimKey] !== undefined && item.dimensions[dimKey] !== null && typeof item.dimensions[dimKey] !== 'number') {
          error(`${prefix} dimensions.${dimKey} must be a number or null`);
        }
      }
    }
  }

  // Arrays
  for (const arrField of ['styleTags', 'roomTags', 'useCases']) {
    if (item[arrField] !== undefined && !Array.isArray(item[arrField])) {
      error(`${prefix} "${arrField}" must be an array`);
    }
  }

  // Booleans
  for (const boolField of ['commercialUseAllowed', 'redistributionAllowed', 'resaleAllowed', 'brandUsageAllowed', 'attributionRequired']) {
    if (item[boolField] !== undefined && typeof item[boolField] !== 'boolean') {
      error(`${prefix} "${boolField}" must be a boolean`);
    }
  }

  // String fields that should be strings
  for (const strField of ['productName', 'brand', 'modelPath', 'previewPath', 'color', 'material', 'notes', 'qaNotes']) {
    if (item[strField] !== undefined && item[strField] !== null && typeof item[strField] !== 'string') {
      error(`${prefix} "${strField}" must be a string`);
    }
  }
}

// ── Summary ────────────────────────────────────────────────────
log('\n═══════════════════════════════════════════════════════════════');
if (exitCode === 0) {
  log(`  ✅ ALL CHECKS PASSED`);
  log(`     ${manifest.length} item(s) validated`);
  log(`     ${seenIds.size} unique id(s)`);
  log(`     ${seenSkus.size} unique sku(s)`);
} else {
  log(`  ❌ VALIDATION FAILED`);
  log(`     ${errors.length} error(s) found`);
}
log('═══════════════════════════════════════════════════════════════\n');

process.exit(exitCode);
