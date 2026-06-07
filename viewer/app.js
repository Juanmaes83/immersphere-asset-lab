/**
 * Immersphere Asset Lab · Viewer
 * Visor local premium para catálogo de assets 3D autorizados.
 * Vanilla JS. Sin dependencias externas. Sin backend.
 */

(async function init() {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  const MANIFEST_PATH = '../manifest/ikea-sample.manifest.json';

  // ── State ──────────────────────────────────────────────────────
  let allAssets = [];
  let filteredAssets = [];

  // ── DOM References ─────────────────────────────────────────────
  const grid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const roomFilter = document.getElementById('room-filter');
  const styleFilter = document.getElementById('style-filter');
  const licenseFilter = document.getElementById('license-filter');
  const qaFilter = document.getElementById('qa-filter');
  const resultCount = document.getElementById('result-count');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalDetails = document.getElementById('modal-details');

  // ── Load Manifest ──────────────────────────────────────────────
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allAssets = await res.json();
    if (!Array.isArray(allAssets)) throw new Error('Manifest is not an array');
    filteredAssets = [...allAssets];
    renderGrid(filteredAssets);
    updateCount(filteredAssets.length);
  } catch (err) {
    grid.innerHTML = `<div class="error-message">Error loading manifest: ${escapeHtml(err.message)}</div>`;
    console.error('Asset Lab Viewer:', err);
  }

  // ── Event Listeners ────────────────────────────────────────────
  searchInput.addEventListener('input', debounce(applyFilters, 150));
  categoryFilter.addEventListener('change', applyFilters);
  roomFilter.addEventListener('change', applyFilters);
  styleFilter.addEventListener('change', applyFilters);
  licenseFilter.addEventListener('change', applyFilters);
  qaFilter.addEventListener('change', applyFilters);

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

  function buildCardHtml(asset) {
    const licenseBadge = getLicenseBadge(asset.licenseType);
    const qaBadge = getQaBadge(asset.qaStatus);
    const dim = asset.dimensions
      ? `${asset.dimensions.width}×${asset.dimensions.depth}×${asset.dimensions.height} ${asset.dimensions.unit}`
      : '—';

    return `
      <div class="card-preview">
        <div class="preview-placeholder">
          <span class="preview-label">${asset.category}</span>
        </div>
        <div class="card-badges">
          <span class="badge-pill ${licenseBadge.class}">${licenseBadge.label}</span>
          <span class="badge-pill ${qaBadge.class}">${qaBadge.label}</span>
          ${asset.hasRealModel ? '<span class="badge-pill badge-real">Real Model</span>' : ''}
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

      ${asset.notes ? `
      <div class="modal-section">
        <h4>Notes</h4>
        <p class="modal-notes">${escapeHtml(asset.notes)}</p>
      </div>` : ''}
    `;

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  // ── Filters ────────────────────────────────────────────────────
  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categoryFilter.value;
    const room = roomFilter.value;
    const style = styleFilter.value;
    const lic = licenseFilter.value;
    const qa = qaFilter.value;

    filteredAssets = allAssets.filter(asset => {
      if (q && !matchesSearch(asset, q)) return false;
      if (cat && asset.category !== cat) return false;
      if (room && !(asset.roomTags || []).includes(room)) return false;
      if (style && !(asset.styleTags || []).includes(style)) return false;
      if (lic && !asset.licenseType.toLowerCase().includes(lic)) return false;
      if (qa && asset.qaStatus !== qa) return false;
      return true;
    });

    renderGrid(filteredAssets);
    updateCount(filteredAssets.length);
  }

  function matchesSearch(asset, q) {
    const fields = [
      asset.productName,
      asset.brand,
      asset.category,
      asset.subcategory,
      asset.sku,
      asset.color,
      asset.material,
      asset.collection,
      ...(asset.styleTags || []),
      ...(asset.roomTags || [])
    ];
    return fields.some(f => f && f.toLowerCase().includes(q));
  }

  // ── Utilities ──────────────────────────────────────────────────
  function updateCount(n) {
    resultCount.textContent = n;
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
