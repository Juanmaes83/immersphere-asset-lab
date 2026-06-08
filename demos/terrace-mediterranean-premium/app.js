/**
 * Terrace Mediterranean Premium Demo
 * Carga manifest, filtra colección, renderiza landing y modal 3D.
 */

const MANIFEST_PATH = '/manifest/ikea-sample.manifest.json';

// Copy comercial: función de cada asset en la escena
const SCENE_ROLE = {
  'ikea-vittskar-armchair-outdoor-dark-grey-20575167': 'Asiento principal de comedor exterior',
  'ikea-vasman-armchair-outdoor-brown': 'Silla de apoyo para rincón de lectura',
  'ikea-nammaro-garden-table-light-brown': 'Mesa de comedor para 4-6 personas',
  'ikea-hakanskar-outdoor-coffee-table-light-brown': 'Apoyo para bebidas, libros, plantas',
  'ikea-nammaro-2-seat-outdoor-sofa-light-brown-beige-grey': 'Zona de descanso y conversación',
  'ikea-solvinden-solar-floor-lamp-outdoor-beige': 'Iluminación de ambiente al atardecer',
  'ikea-morum-indoor-outdoor-rug-beige': 'Define zona de estar, aporta calidez',
  'ikea-stjarnanis-outdoor-planter-acacia-90612029': 'Vegetación, verticalidad, vida',
  'ikea-havsten-outdoor-back-seat-cushion-beige-90542499': 'Confort, color, personalización',
  'ikea-sjalsligt-decoration-set-of-3': 'Detalle que humaniza la escena',
};

const CATEGORY_ORDER = [
  'chair', 'table', 'side-table', 'lounge', 'lighting', 'rug', 'planter', 'textile', 'decor'
];

let collectionAssets = [];

/* ── Init ───────────────────────────────────────────────────── */
(async function init() {
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    if (!Array.isArray(all)) throw new Error('Manifest no es un array');

    collectionAssets = all.filter(a =>
      a.hasRealModel === true &&
      Array.isArray(a.roomTags) &&
      (a.roomTags.includes('terrace') || a.roomTags.includes('outdoor'))
    );

    // Ordenar por categoría preferida
    collectionAssets.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.category);
      const ib = CATEGORY_ORDER.indexOf(b.category);
      if (ia !== ib) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      return a.productName.localeCompare(b.productName);
    });

    renderMiniGrid(collectionAssets);
    renderCollectionGrid(collectionAssets);
    renderProductTable(collectionAssets);
  } catch (err) {
    console.error('Demo init error:', err);
    document.getElementById('collection-grid').innerHTML =
      `<div style="grid-column:1/-1;text-align:center;color:#C67B5C">Error cargando colección: ${escapeHtml(err.message)}</div>`;
  }
})();

/* ── Render Mini Grid (Before/After) ────────────────────────── */
function renderMiniGrid(assets) {
  const container = document.getElementById('ba-mini-grid');
  if (!container) return;
  container.innerHTML = assets.map(a => {
    const src = a.previewPath ? `/${a.previewPath}` : '';
    return src
      ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(a.productName)}" loading="lazy">`
      : `<div style="background:var(--sand);border-radius:6px"></div>`;
  }).join('');
}

/* ── Render Collection Grid ─────────────────────────────────── */
function renderCollectionGrid(assets) {
  const grid = document.getElementById('collection-grid');
  if (!grid) return;
  grid.innerHTML = assets.map(a => `
    <article class="product-card" data-id="${escapeHtml(a.id)}" onclick="window.openProductModal('${escapeHtml(a.id)}')">
      <div class="card-image">
        ${a.previewPath ? `
          <img src="/${escapeHtml(a.previewPath)}" alt="${escapeHtml(a.productName)}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="preview-placeholder" style="display:none;align-items:center;justify-content:center;height:100%;color:var(--warm-grey);font-size:0.8rem">${escapeHtml(a.category)}</div>
        ` : `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--warm-grey);font-size:0.8rem">${escapeHtml(a.category)}</div>
        `}
        <div class="card-badges">
          <span class="badge badge-real">Real 3D Model</span>
          <span class="badge badge-cat">${escapeHtml(a.category)}</span>
        </div>
      </div>
      <div class="card-info">
        <h4>${escapeHtml(a.productName)}</h4>
        <p>${escapeHtml(SCENE_ROLE[a.id] || a.subcategory || a.category)}</p>
        <button class="card-btn">Ver en 3D</button>
      </div>
    </article>
  `).join('');
}

/* ── Render Product Table ───────────────────────────────────── */
function renderProductTable(assets) {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  tbody.innerHTML = assets.map(a => `
    <tr>
      <td><strong>${escapeHtml(a.productName)}</strong></td>
      <td class="cell-muted">${escapeHtml(a.category)}${a.subcategory ? ' / ' + escapeHtml(a.subcategory) : ''}</td>
      <td class="cell-muted">${escapeHtml(SCENE_ROLE[a.id] || '—')}</td>
      <td class="cell-brand">${escapeHtml(a.brand)}</td>
      <td class="cell-muted">${escapeHtml(a.color || '—')} · ${escapeHtml(a.material || '—')}</td>
      <td><span class="cell-status status-ready">GLB OK</span></td>
      <td><span class="cell-status ${a.previewPath && !a.previewPath.includes('placeholder') ? 'status-ready' : 'status-pending'}">
        ${a.previewPath && !a.previewPath.includes('placeholder') ? 'Preview OK' : 'Pending'}
      </span></td>
      <td class="cell-muted">Staging, render, tour</td>
    </tr>
  `).join('');
}

/* ── Modal ──────────────────────────────────────────────────── */
window.openProductModal = function(assetId) {
  const asset = collectionAssets.find(a => a.id === assetId);
  if (!asset) return;

  const overlay = document.getElementById('modal-overlay');
  const preview = document.getElementById('modal-preview');
  const details = document.getElementById('modal-details');

  // Preview area
  if (asset.hasRealModel && asset.modelPath) {
    const modelUrl = `/${asset.modelPath}`;
    const fallbackId = 'mv-fallback-' + Math.random().toString(36).slice(2, 8);
    preview.innerHTML = `
      <model-viewer
        src="${escapeHtml(modelUrl)}"
        alt="${escapeHtml(asset.productName)}"
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="30deg"
        environment-image="neutral"
        exposure="1"
        shadow-intensity="1"
        shadow-softness="0.5"
        style="width:100%;height:100%;"
        loading="eager"
        reveal="auto"
        onload="document.getElementById('${fallbackId}').classList.add('hidden');"
        onerror="document.getElementById('${fallbackId}').innerHTML='<div>No se pudo cargar el modelo 3D.<br><small>Verifica que el GLB exista en ${escapeHtml(modelUrl)}</small></div>';"
      ></model-viewer>
      <div id="${fallbackId}" class="mv-fallback">
        <div>Cargando modelo 3D…<br><small>${escapeHtml(asset.modelPath)}</small></div>
      </div>
    `;
  } else {
    preview.innerHTML = `
      <div style="color:var(--warm-grey);font-size:0.9rem;text-align:center;padding:1rem">
        Modelo 3D pendiente de importación autorizada
      </div>
    `;
  }

  // Details
  const dim = asset.dimensions
    ? `${fmt(asset.dimensions.width)} × ${fmt(asset.dimensions.depth)} × ${fmt(asset.dimensions.height)} ${asset.dimensions.unit}`
    : '—';

  details.innerHTML = `
    <h3>${escapeHtml(asset.productName)}</h3>
    <p class="modal-sub">${escapeHtml(asset.brand)} · ${escapeHtml(asset.collection || '—')} · SKU: ${escapeHtml(asset.sku)}</p>
    <dl class="modal-meta">
      <dt>Categoría</dt><dd>${escapeHtml(asset.category)}${asset.subcategory ? ' / ' + escapeHtml(asset.subcategory) : ''}</dd>
      <dt>Función en escena</dt><dd>${escapeHtml(SCENE_ROLE[asset.id] || '—')}</dd>
      <dt>Color</dt><dd>${escapeHtml(asset.color || '—')}</dd>
      <dt>Material</dt><dd>${escapeHtml(asset.material || '—')}</dd>
      <dt>Dimensiones</dt><dd>${escapeHtml(dim)}</dd>
      <dt>Formato</dt><dd>${escapeHtml(asset.format.toUpperCase())}${asset.fileSizeMb ? ' · ' + asset.fileSizeMb + ' MB' : ''}</dd>
      <dt>Licencia</dt><dd>${escapeHtml(asset.licenseType)}</dd>
      <dt>Uso comercial</dt><dd>${asset.commercialUseAllowed ? '✓ Permitido (demo autorizada)' : '✗ No permitido'}</dd>
      <dt>Modelo</dt><dd><code>${escapeHtml(asset.modelPath)}</code></dd>
      <dt>Preview</dt><dd><code>${escapeHtml(asset.previewPath)}</code></dd>
    </dl>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="window.closeProductModal()">Cerrar</button>
      <a class="btn btn-secondary" href="/viewer/index.html" target="_blank">Abrir en Asset Lab Viewer</a>
    </div>
  `;

  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
};

window.closeProductModal = function() {
  const overlay = document.getElementById('modal-overlay');
  overlay.hidden = true;
  document.body.style.overflow = '';
};

/* ── Event Listeners ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', window.closeProductModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeProductModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeProductModal();
  });
});

/* ── Utilities ──────────────────────────────────────────────── */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function fmt(n) {
  return n != null ? n : '—';
}
