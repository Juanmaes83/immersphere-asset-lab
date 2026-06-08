/**
 * Immersphere Asset Lab · Viewer
 * Visor local premium para catálogo de assets 3D autorizados.
 * Vanilla JS. Sin dependencias externas. Sin backend.
 */

(async function init() {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  const MANIFEST_PATH = '/manifest/ikea-sample.manifest.json';

  // ── State ──────────────────────────────────────────────────────
  let allAssets = [];
  let filteredAssets = [];

  // ── DOM References ─────────────────────────────────────────────
  const grid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-input');
  const collectionFilter = document.getElementById('collection-filter');
  const categoryFilter = document.getElementById('category-filter');
  const roomFilter = document.getElementById('room-filter');
  const styleFilter = document.getElementById('style-filter');
  const licenseFilter = document.getElementById('license-filter');
  const qaFilter = document.getElementById('qa-filter');
  const realOnlyFilter = document.getElementById('real-only-filter');
  const resetFilters = document.getElementById('reset-filters');
  const resultCount = document.getElementById('result-count');
  const totalCount = document.getElementById('total-count');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalDetails = document.getElementById('modal-details');

  // ── Load Manifest ──────────────────────────────────────────────
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allAssets = await res.json();
    if (!Array.isArray(allAssets)) throw new Error('Manifest is not an array');
    populateCatalogFilters();
    filteredAssets = [...allAssets];
    renderGrid(filteredAssets);
    updateCount(filteredAssets.length, allAssets.length);
  } catch (err) {
    grid.innerHTML = `<div class="error-message">Error loading manifest: ${escapeHtml(err.message)}</div>`;
    console.error('Asset Lab Viewer:', err);
  }

  // ── Event Listeners ────────────────────────────────────────────
  searchInput.addEventListener('input', debounce(applyFilters, 150));
  collectionFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  roomFilter.addEventListener('change', applyFilters);
  styleFilter.addEventListener('change', applyFilters);
  licenseFilter.addEventListener('change', applyFilters);
  qaFilter.addEventListener('change', applyFilters);
  realOnlyFilter.addEventListener('change', applyFilters);
  resetFilters.addEventListener('click', () => {
    searchInput.value = '';
    collectionFilter.value = '';
    categoryFilter.value = '';
    roomFilter.value = '';
    styleFilter.value = '';
    licenseFilter.value = '';
    qaFilter.value = '';
    realOnlyFilter.checked = false;
    applyFilters();
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Render Grid ────────────────────────────────────────────────
  function renderGrid(assets) {
    grid.innerHTML = '';
    if (assets.length === 0) {
      grid.innerHTML = '<div class="empty-state">No assets match the current filters.</div>';
      return;
    }

    for (const asset of assets) {
      const card = document.createElement('article');
      card.className = 'asset-card';
      card.dataset.id = asset.id;
      card.innerHTML = buildCardHtml(asset);
      card.addEventListener('click', () => openModal(asset));
      grid.appendChild(card);
    }
  }

  function resolvePreviewUrl(asset) {
    if (!asset.previewPath) return null;
    return '/' + asset.previewPath;
  }

  function isPlaceholderPreview(asset) {
    return !asset.previewPath || asset.previewPath.includes('placeholder') || asset.previewPath.includes('_placeholder');
  }

  function buildCardHtml(asset) {
    const licenseBadge = getLicenseBadge(asset.licenseType);
    const qaBadge = getQaBadge(asset.qaStatus);
    const dim = asset.dimensions
      ? `${asset.dimensions.width ?? '—'}×${asset.dimensions.depth ?? '—'}×${asset.dimensions.height ?? '—'} ${asset.dimensions.unit}`
      : '—';
    const previewUrl = resolvePreviewUrl(asset);
    const placeholderPreview = isPlaceholderPreview(asset);

    let previewBadge = '';
    if (asset.hasRealModel && !placeholderPreview) {
      previewBadge = '<span class="badge-pill badge-preview-real">Real Preview</span>';
    } else if (asset.hasRealModel && placeholderPreview) {
      previewBadge = '<span class="badge-pill badge-preview-pending">Preview pending</span>';
    }

    return `
      <div class="card-preview">
        ${previewUrl ? `
          <img class="card-preview-img" src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.productName)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="preview-placeholder" style="display:none">
            <span class="preview-label">${asset.category}</span>
          </div>
        ` : `
          <div class="preview-placeholder">
            <span class="preview-label">${asset.category}</span>
          </div>
        `}
        <div class="card-badges">
          <span class="badge-pill ${licenseBadge.class}">${licenseBadge.label}</span>
          <span class="badge-pill ${qaBadge.class}">${qaBadge.label}</span>
          ${asset.hasRealModel ? '<span class="badge-pill badge-real">Real Model</span>' : ''}
          ${previewBadge}
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(asset.productName)}</h3>
        <p class="card-brand">${escapeHtml(asset.brand)} · ${escapeHtml(asset.category)}${asset.hasRealModel ? ' · <strong>Modelo real</strong>' : ''}</p>
        <div class="card-meta">
          <span class="meta-item">${escapeHtml(asset.color || '—')}</span>
          <span class="meta-sep">·</span>
          <span class="meta-item">${escapeHtml(asset.material || '—')}</span>
        </div>
        <div class="card-dim">${escapeHtml(dim)}</div>
      </div>
      <div class="card-footer">
        <button class="card-btn">View details</button>
      </div>
    `;
  }

  // ── Modal ──────────────────────────────────────────────────────
  function openModal(asset) {
    const dim = asset.dimensions
      ? `${asset.dimensions.width} × ${asset.dimensions.depth} × ${asset.dimensions.height} ${asset.dimensions.unit}`
      : '—';

    // Build preview area dynamically
    const previewContainer = document.getElementById('modal-preview');
    previewContainer.innerHTML = buildModalPreview(asset);

    modalDetails.innerHTML = `
      <h2 class="modal-title">${escapeHtml(asset.productName)}</h2>
      <p class="modal-subtitle">${escapeHtml(asset.brand)} · ${escapeHtml(asset.collection || '—')} · SKU: ${escapeHtml(asset.sku)}</p>

      <div class="modal-section">
        <h4>Product</h4>
        <dl class="modal-dl">
          <dt>Category</dt><dd>${escapeHtml(asset.category)}${asset.subcategory ? ' / ' + escapeHtml(asset.subcategory) : ''}</dd>
          <dt>Color</dt><dd>${escapeHtml(asset.color || '—')}</dd>
          <dt>Material</dt><dd>${escapeHtml(asset.material || '—')}</dd>
          <dt>Dimensions</dt><dd>${escapeHtml(dim)}</dd>
          <dt>Format</dt><dd>${escapeHtml(asset.format.toUpperCase())}${asset.fileSizeMb ? ' · ' + asset.fileSizeMb + ' MB' : ''}</dd>
        </dl>
      </div>

      <div class="modal-section">
        <h4>License & QA</h4>
        <dl class="modal-dl">
          <dt>License</dt><dd>${escapeHtml(asset.licenseType)}</dd>
          <dt>Commercial Use</dt><dd>${asset.commercialUseAllowed ? '✓ Allowed' : '✗ Not allowed'}</dd>
          <dt>Redistribution</dt><dd>${asset.redistributionAllowed ? '✓ Allowed' : '✗ Not allowed'}</dd>
          <dt>Brand Usage</dt><dd>${asset.brandUsageAllowed ? '✓ Allowed' : '✗ Not allowed'}</dd>
          <dt>QA Status</dt><dd>${escapeHtml(asset.qaStatus)}</dd>
          <dt>Scope</dt><dd>${escapeHtml(asset.permissionScope || '—')}</dd>
          ${asset.hasRealModel !== undefined ? `<dt>Real Model</dt><dd>${asset.hasRealModel ? '✓ Yes — GLB on disk' : '✗ Placeholder only'}</dd>` : ''}
          ${asset.scaleChecked !== undefined ? `<dt>Scale Checked</dt><dd>${asset.scaleChecked ? '✓ Yes' : 'Pending'}</dd>` : ''}
          ${asset.optimized !== undefined ? `<dt>Optimized</dt><dd>${asset.optimized ? '✓ Yes' : 'No'}</dd>` : ''}
        </dl>
      </div>

      <div class="modal-section">
        <h4>Tags</h4>
        <div class="tag-list">
          ${(asset.styleTags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          ${(asset.roomTags || []).map(t => `<span class="tag tag-room">${escapeHtml(t)}</span>`).join('')}
          ${(asset.useCases || []).map(t => `<span class="tag tag-use">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4>Paths</h4>
        <dl class="modal-dl">
          <dt>Model</dt><dd><code>${escapeHtml(asset.modelPath)}</code></dd>
          <dt>Preview</dt><dd><code>${escapeHtml(asset.previewPath)}</code></dd>
          <dt>Permission Doc</dt><dd>${asset.permissionDocumentRef ? `<code>${escapeHtml(asset.permissionDocumentRef)}</code>` : '—'}</dd>
        </dl>
      </div>

      <div class="modal-section">
        <h4>Preview</h4>
        ${asset.hasRealModel ? `
          <div class="preview-actions">
            <button class="btn-generate-preview" id="btn-generate-preview">📸 Generar preview</button>
            <p class="preview-hint">Orienta el modelo, pulsa el botón y guarda la imagen en <code>previews/ikea/{category}/</code></p>
          </div>
        ` : `
          <p class="preview-hint">Modelo 3D pendiente de importación autorizada. No se puede generar preview sin GLB real.</p>
        `}
      </div>

      ${asset.notes ? `
      <div class="modal-section">
        <h4>Notes</h4>
        <p class="modal-notes">${escapeHtml(asset.notes)}</p>
      </div>` : ''}
    `;

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';

    // Attach generate preview handler after modal is in DOM
    if (asset.hasRealModel) {
      const btn = document.getElementById('btn-generate-preview');
      if (btn) {
        btn.addEventListener('click', () => capturePreview(asset));
      }
    }
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  function capturePreview(asset) {
    const mv = document.querySelector('model-viewer');
    if (!mv) {
      alert('Model viewer not found. Open a real asset first.');
      return;
    }

    // Try to get canvas from model-viewer's shadow DOM
    let canvas = null;
    try {
      canvas = mv.shadowRoot.querySelector('canvas');
    } catch (e) {
      console.error('Could not access model-viewer canvas:', e);
    }

    if (!canvas) {
      alert('Canvas not ready yet. Wait for the 3D model to finish loading, then try again.');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeName = asset.id.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      link.download = `${safeName}-preview.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show instructions
      const hint = document.querySelector('.preview-hint');
      if (hint) {
        hint.innerHTML = `
          ✅ Imagen descargada como <strong>${safeName}-preview.png</strong>.<br>
          Mueve el archivo a:<br>
          <code>previews/ikea/${escapeHtml(asset.category)}/${safeName}-preview.png</code><br>
          Luego actualiza <code>previewPath</code> en el manifest y ejecuta <code>npm run check</code>.
        `;
        hint.style.color = 'var(--accent-green)';
      }
    } catch (e) {
      alert('Failed to capture preview: ' + e.message);
      console.error(e);
    }
  }

  function buildModalPreview(asset) {
    if (asset.hasRealModel && asset.modelPath) {
      const modelUrl = '/' + asset.modelPath;
      const fallbackId = 'mv-fallback-' + Math.random().toString(36).slice(2, 8);
      return `
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
          onerror="document.getElementById('${fallbackId}').innerHTML='<div>Failed to load 3D model.<br><small>Check that the GLB exists at ${escapeHtml(modelUrl)}</small></div>';"
        ></model-viewer>
        <div id="${fallbackId}" class="model-viewer-fallback">
          <div>Loading 3D model…<br><small>${escapeHtml(asset.modelPath)}</small></div>
        </div>
      `;
    }

    return `
      <div class="placeholder-block">
        Modelo 3D pendiente de importación autorizada
        <small>${escapeHtml(asset.modelPath || '')}</small>
      </div>
    `;
  }

  // ── Filters ────────────────────────────────────────────────────
  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const collection = collectionFilter.value;
    const cat = categoryFilter.value;
    const room = roomFilter.value;
    const style = styleFilter.value;
    const lic = licenseFilter.value;
    const qa = qaFilter.value;
    const realOnly = realOnlyFilter.checked;

    filteredAssets = allAssets.filter(asset => {
      if (q && !matchesSearch(asset, q)) return false;
      if (collection && getCollectionKey(asset) !== collection) return false;
      if (cat && asset.category !== cat) return false;
      if (room && getRoomKey(asset) !== room && !(asset.roomTags || []).includes(room)) return false;
      if (style && !(asset.styleTags || []).includes(style)) return false;
      if (lic && !asset.licenseType.toLowerCase().includes(lic)) return false;
      if (qa && asset.qaStatus !== qa) return false;
      if (realOnly && asset.hasRealModel !== true) return false;
      return true;
    });

    renderGrid(filteredAssets);
    updateCount(filteredAssets.length, allAssets.length);
  }

  function matchesSearch(asset, q) {
    const fields = [
      asset.productName,
      asset.brand,
      asset.category,
      categoryLabel(asset.category),
      asset.subcategory,
      asset.sku,
      asset.color,
      asset.material,
      asset.collection,
      asset.collectionId,
      collectionLabel(getCollectionKey(asset)),
      asset.demoScene,
      asset.roomType,
      roomLabel(getRoomKey(asset)),
      ...(asset.styleTags || []),
      ...(asset.roomTags || [])
    ];
    return fields.some(f => f && f.toLowerCase().includes(q));
  }

  // ── Utilities ──────────────────────────────────────────────────
  function populateCatalogFilters() {
    fillSelect(collectionFilter, uniqueValues(allAssets.map(getCollectionKey)).map(value => [value, collectionLabel(value)]));
    fillSelect(roomFilter, uniqueValues(allAssets.map(getRoomKey)).map(value => [value, roomLabel(value)]));
    fillSelect(categoryFilter, uniqueValues(allAssets.map(asset => asset.category)).map(value => [value, categoryLabel(value)]));
  }

  function fillSelect(select, entries) {
    const first = select.options[0];
    select.innerHTML = '';
    select.appendChild(first);
    for (const [value, label] of entries) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    }
  }

  function uniqueValues(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function getCollectionKey(asset) {
    return asset.collectionId || asset.demoScene || '';
  }

  function getRoomKey(asset) {
    if (asset.roomType) return asset.roomType;
    const tags = asset.roomTags || [];
    if (tags.includes('terrace') || tags.includes('outdoor') || tags.includes('garden')) return 'terrace';
    if (tags.includes('living-room') || tags.includes('salon')) return 'living-room';
    if (tags.includes('bedroom') || tags.includes('master-bedroom')) return 'bedroom';
    return tags[0] || '';
  }

  function collectionLabel(value) {
    const labels = {
      'terrace-mediterranean-premium': 'Terraza Mediterranea Premium',
      'living-room-nordic-premium': 'Salon Nordico Premium',
      'master-bedroom-premium': 'Dormitorio Principal Premium',
      'dining-room-mediterranean-premium': 'Comedor Mediterraneo Premium',
      'kitchen-mediterranean-modular': 'Cocina Mediterranea Modular',
      'living-room-lounge-extension': 'Salon Lounge Premium'
    };
    return labels[value] || value;
  }

  function roomLabel(value) {
    const labels = { terrace: 'Terraza', 'living-room': 'Salon', bedroom: 'Dormitorio', 'dining-room': 'Comedor', kitchen: 'Cocina' };
    return labels[value] || value;
  }

  function categoryLabel(value) {
    const labels = {
      'tv-unit': 'Mueble TV',
      'coffee-table': 'Mesa centro',
      armchair: 'Sillon',
      sofa: 'Sofa',
      rug: 'Alfombra',
      lighting: 'Iluminacion',
      chair: 'Silla',
      table: 'Mesa',
      decor: 'Decoracion',
      planter: 'Macetero',
      textile: 'Textil',
      lounge: 'Lounge',
      'side-table': 'Mesa auxiliar'
      , bed: 'Cama'
      , 'bedside-table': 'Mesita'
      , dresser: 'Comoda'
      , wardrobe: 'Armario'
      , vanity: 'Tocador'
      , mirror: 'Espejo'
      , bench: 'Banco'
      , sideboard: 'Aparador'
      , 'display-cabinet': 'Vitrina'
      , 'lounge-chair': 'Butaca lounge'
      , pouf: 'Puf'
      , footstool: 'Reposapies'
      , cabinet: 'Armario salon'
      , 'kitchen-wall-cabinet': 'Armario pared cocina'
      , 'kitchen-base-cabinet': 'Armario bajo cocina'
      , 'kitchen-tall-cabinet': 'Armario alto cocina'
      , 'kitchen-corner-cabinet': 'Armario esquina cocina'
      , 'kitchen-sliding-wall-cabinet': 'Armario pared correderas'
      , 'kitchen-storage': 'Almacenaje cocina'
      , 'kitchen-cabinet': 'Modulo cocina'
    };
    return labels[value] || value;
  }

  function updateCount(n, total) {
    resultCount.textContent = n;
    totalCount.textContent = total;
  }

  function getLicenseBadge(type) {
    const map = {
      'authorized-commercial': { label: 'Commercial', class: 'badge-commercial' },
      'authorized-commercial-demo': { label: 'Commercial', class: 'badge-commercial' },
      'commercial-demo': { label: 'Demo', class: 'badge-demo' },
      'personal-only': { label: 'Personal', class: 'badge-personal' },
      'editorial': { label: 'Editorial', class: 'badge-editorial' },
      'internal': { label: 'Internal', class: 'badge-internal' },
      'unknown': { label: 'Unknown', class: 'badge-unknown' }
    };
    return map[type] || map['unknown'];
  }

  function getQaBadge(status) {
    const map = {
      'approved': { label: 'Approved', class: 'badge-approved' },
      'pending': { label: 'Pending', class: 'badge-pending' },
      'in-review': { label: 'In Review', class: 'badge-review' },
      'rejected': { label: 'Rejected', class: 'badge-rejected' },
      'deprecated': { label: 'Deprecated', class: 'badge-rejected' }
    };
    return map[status] || map['pending'];
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }
})();
