const MANIFEST_URL = "/manifest/ikea-sample.manifest.json";
const STORAGE_KEY = "immersphere.assetLab.roomDesignerLite.v1";

const TEMPLATES = {
  "living-room": { name: "Salón", defaultWall: "warm-white", defaultFloor: "light-wood", hasWindow: true, hasDoor: false },
  terrace: { name: "Terraza", defaultWall: "sand", defaultFloor: "terrace-exterior", hasWindow: true, hasDoor: false },
  bedroom: { name: "Dormitorio", defaultWall: "light-grey", defaultFloor: "dark-wood", hasWindow: true, hasDoor: true },
  "dining-room": { name: "Comedor", defaultWall: "stone-beige", defaultFloor: "light-tile", hasWindow: true, hasDoor: false },
  "home-office": { name: "Home Office", defaultWall: "warm-white", defaultFloor: "soft-cement", hasWindow: true, hasDoor: false },
};

const WALL_COLORS = {
  "warm-white": { name: "Blanco cálido", value: "#f5f2eb" },
  "light-grey": { name: "Gris claro", value: "#e2e2e2" },
  sand: { name: "Arena", value: "#e6d5b8" },
  graphite: { name: "Negro grafito", value: "#333333" },
  terracotta: { name: "Terracota", value: "#c67b5c" },
  olive: { name: "Verde oliva", value: "#7a8471" },
  "mediterranean-blue": { name: "Azul mediterráneo", value: "#5b8a9a" },
  "stone-beige": { name: "Beige piedra", value: "#c4b9ac" },
};

const FLOOR_TYPES = {
  "light-wood": { name: "Madera clara", style: "linear-gradient(90deg,#d4a574 0%,#c99660 50%,#d4a574 100%)" },
  "dark-wood": { name: "Madera oscura", style: "repeating-linear-gradient(90deg,#5c3a21,#5c3a21 18px,#4a2e1a 18px,#4a2e1a 36px)" },
  "soft-cement": { name: "Cemento suave", style: "radial-gradient(circle at 30% 30%,#c4c4c4,#a8a8a8)" },
  "mediterranean-stone": { name: "Piedra mediterránea", style: "repeating-linear-gradient(45deg,#c9b99a,#c9b99a 10px,#b8a888 10px,#b8a888 20px)" },
  "light-tile": { name: "Baldosa clara", style: "repeating-linear-gradient(0deg,#f0f0f0,#f0f0f0 14px,#e0e0e0 14px,#e0e0e0 15px),repeating-linear-gradient(90deg,#f0f0f0,#f0f0f0 14px,#e0e0e0 14px,#e0e0e0 15px)" },
  "terrace-exterior": { name: "Exterior terraza", style: "repeating-linear-gradient(90deg,#a89078 0%,#9a8068 30%,#a89078 60%)" },
};

const VIEWS = {
  dollhouse: { name: "Casa de muñecas", icon: "🏠" },
  front: { name: "Vista frontal", icon: "▭" },
  top: { name: "Vista superior", icon: "▢" },
  left: { name: "Lateral izquierda", icon: "◧" },
  right: { name: "Lateral derecha", icon: "◨" },
};

const TYPE_MAP = {
  sofas: ["sofa"],
  armchairs: ["armchair"],
  tables: ["table", "coffee-table", "side-table", "dining-table"],
  "tv-units": ["tv-unit"],
  lighting: ["lighting", "lamp"],
  rugs: ["rug"],
  decor: ["decor", "planter"],
  chairs: ["chair"],
  textile: ["textile"],
};

const state = {
  catalog: [],
  filteredCatalog: [],
  template: "living-room",
  wallColor: "warm-white",
  floorType: "light-wood",
  view: "dollhouse",
  layers: [],
  selectedId: null,
  drag: null,
  zCounter: 10,
};

const els = {
  templateGrid: document.querySelector("#templateGrid"),
  wallColorGrid: document.querySelector("#wallColorGrid"),
  floorGrid: document.querySelector("#floorGrid"),
  viewGrid: document.querySelector("#viewGrid"),
  roomScene: document.querySelector("#roomScene"),
  roomShell: document.querySelector("#roomShell"),
  wallBack: document.querySelector("#wallBack"),
  wallLeft: document.querySelector("#wallLeft"),
  wallRight: document.querySelector("#wallRight"),
  roomFloor: document.querySelector("#roomFloor"),
  roomFeatures: document.querySelector("#roomFeatures"),
  layerRoot: document.querySelector("#layerRoot"),
  sceneLabel: document.querySelector("#sceneLabel"),
  stage: document.querySelector("#stage"),

  catalogStatus: document.querySelector("#catalogStatus"),
  catalogSearch: document.querySelector("#catalogSearch"),
  collectionFilter: document.querySelector("#collectionFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  productList: document.querySelector("#productList"),

  selectionStatus: document.querySelector("#selectionStatus"),
  inspectorFields: document.querySelector("#inspectorFields"),
  inspectorPreview: document.querySelector("#inspectorPreview"),
  inspectorBadge: document.querySelector("#inspectorBadge"),
  inspectorMeta: document.querySelector("#inspectorMeta"),
  scaleInput: document.querySelector("#scaleInput"),
  rotationInput: document.querySelector("#rotationInput"),
  xInput: document.querySelector("#xInput"),
  yInput: document.querySelector("#yInput"),
  deleteBtn: document.querySelector("#deleteBtn"),
  frontBtn: document.querySelector("#frontBtn"),
  backBtn: document.querySelector("#backBtn"),
  proposalToggleBtn: document.querySelector("#proposalToggleBtn"),
  viewerLink: document.querySelector("#viewerLink"),
  proposalCount: document.querySelector("#proposalCount"),

  usedProductsList: document.querySelector("#usedProductsList"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportProjectBtn: document.querySelector("#exportProjectBtn"),
  exportListBtn: document.querySelector("#exportListBtn"),
  saveSceneBtn: document.querySelector("#saveSceneBtn"),
  loadSceneBtn: document.querySelector("#loadSceneBtn"),
  clearSceneBtn: document.querySelector("#clearSceneBtn"),
};

init();

async function init() {
  renderControls();
  bindEvents();
  await loadCatalog();
  applyCatalogFilters();
  updateRoomVisuals();
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function renderControls() {
  // Templates
  els.templateGrid.innerHTML = Object.entries(TEMPLATES).map(([key, tpl]) => `
    <button type="button" class="template-btn${state.template === key ? " is-active" : ""}" data-template="${escapeAttr(key)}">
      <span class="template-icon">🏠</span>
      <span>${escapeHtml(tpl.name)}</span>
    </button>
  `).join("");
  els.templateGrid.querySelectorAll("[data-template]").forEach((btn) => {
    btn.addEventListener("click", () => setTemplate(btn.dataset.template));
  });

  // Wall colors
  els.wallColorGrid.innerHTML = Object.entries(WALL_COLORS).map(([key, col]) => `
    <button type="button" class="swatch-btn${state.wallColor === key ? " is-active" : ""}" data-wall="${escapeAttr(key)}" title="${escapeAttr(col.name)}" style="background:${col.value};${key==="warm-white"||key==="sand"||key==="light-grey"||key==="stone-beige"?"border-color:rgba(0,0,0,.15)":""}"></button>
  `).join("");
  els.wallColorGrid.querySelectorAll("[data-wall]").forEach((btn) => {
    btn.addEventListener("click", () => setWallColor(btn.dataset.wall));
  });

  // Floor types
  els.floorGrid.innerHTML = Object.entries(FLOOR_TYPES).map(([key, fl]) => `
    <button type="button" class="floor-btn${state.floorType === key ? " is-active" : ""}" data-floor="${escapeAttr(key)}">
      <span class="floor-preview" style="background:${fl.style}"></span>
      <span>${escapeHtml(fl.name)}</span>
    </button>
  `).join("");
  els.floorGrid.querySelectorAll("[data-floor]").forEach((btn) => {
    btn.addEventListener("click", () => setFloorType(btn.dataset.floor));
  });

  // Views
  els.viewGrid.innerHTML = Object.entries(VIEWS).map(([key, vw]) => `
    <button type="button" class="view-btn${state.view === key ? " is-active" : ""}" data-view="${escapeAttr(key)}">
      <span class="view-icon"></span>
      <span>${escapeHtml(vw.name)}</span>
    </button>
  `).join("");
  els.viewGrid.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });
}

function bindEvents() {
  els.catalogSearch.addEventListener("input", applyCatalogFilters);
  els.collectionFilter.addEventListener("change", applyCatalogFilters);
  els.typeFilter.addEventListener("change", applyCatalogFilters);

  els.scaleInput.addEventListener("input", () => updateSelected({ scale: Number(els.scaleInput.value) }));
  els.rotationInput.addEventListener("input", () => updateSelected({ rotation: Number(els.rotationInput.value) }));
  els.xInput.addEventListener("input", () => updateSelected({ x: clamp(Number(els.xInput.value), 0, 100) }));
  els.yInput.addEventListener("input", () => updateSelected({ y: clamp(Number(els.yInput.value), 0, 100) }));
  els.deleteBtn.addEventListener("click", deleteSelected);
  els.frontBtn.addEventListener("click", () => moveSelectedZ("front"));
  els.backBtn.addEventListener("click", () => moveSelectedZ("back"));
  els.proposalToggleBtn.addEventListener("click", toggleProposal);

  els.clearSceneBtn.addEventListener("click", clearScene);
  els.saveSceneBtn.addEventListener("click", saveScene);
  els.loadSceneBtn.addEventListener("click", loadLastScene);
  els.exportPngBtn.addEventListener("click", exportPng);
  els.exportProjectBtn.addEventListener("click", exportProjectJson);
  els.exportListBtn.addEventListener("click", exportUsedProductsJson);

  els.stage.addEventListener("pointerdown", (event) => {
    if (event.target === els.stage || event.target === els.layerRoot || event.target === els.roomScene || event.target === els.roomShell || event.target.classList.contains("wall-back") || event.target.classList.contains("room-floor")) {
      selectLayer(null);
    }
  });
}

function setTemplate(key) {
  if (!TEMPLATES[key]) return;
  state.template = key;
  state.wallColor = TEMPLATES[key].defaultWall;
  state.floorType = TEMPLATES[key].defaultFloor;
  renderControls();
  updateRoomVisuals();
}

function setWallColor(key) {
  if (!WALL_COLORS[key]) return;
  state.wallColor = key;
  renderControls();
  updateRoomVisuals();
}

function setFloorType(key) {
  if (!FLOOR_TYPES[key]) return;
  state.floorType = key;
  renderControls();
  updateRoomVisuals();
}

function setView(key) {
  if (!VIEWS[key]) return;
  state.view = key;
  renderControls();
  updateRoomVisuals();
}

function updateRoomVisuals() {
  const tpl = TEMPLATES[state.template];
  const wall = WALL_COLORS[state.wallColor];
  const floor = FLOOR_TYPES[state.floorType];
  const view = VIEWS[state.view];

  // Update scene label
  els.sceneLabel.textContent = `${tpl.name} · ${view.name}`;

  // Update view class
  els.roomScene.className = "room-scene view-" + state.view;
  els.roomShell.className = "room-shell tpl-" + state.template;

  // Update colors
  els.wallBack.style.background = wall.value;
  const sideColor = adjustBrightness(wall.value, -12);
  els.wallLeft.style.background = sideColor;
  els.wallRight.style.background = sideColor;
  els.roomFloor.style.background = floor.style;
}

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

async function loadCatalog() {
  try {
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
    const manifest = await response.json();
    state.catalog = manifest.filter((asset) => asset.hasRealModel === true);
    state.filteredCatalog = [...state.catalog];
    updateCatalogStatus();
  } catch (error) {
    els.catalogStatus.textContent = `No se pudo cargar el catálogo: ${error.message}`;
  }
}

function applyCatalogFilters() {
  const query = els.catalogSearch.value.trim().toLowerCase();
  const collection = els.collectionFilter.value;
  const type = els.typeFilter.value;

  state.filteredCatalog = state.catalog.filter((asset) => {
    if (collection && asset.demoScene !== collection) return false;
    if (type) {
      const allowed = TYPE_MAP[type] || [];
      if (!allowed.includes(asset.category)) return false;
    }
    if (query && !matchesSearch(asset, query)) return false;
    return true;
  });

  renderCatalog();
  updateCatalogStatus();
}

function renderCatalog() {
  if (!state.filteredCatalog.length) {
    els.productList.innerHTML = `<div class="used-item">No hay productos reales que coincidan.</div>`;
    return;
  }
  els.productList.innerHTML = state.filteredCatalog.map((asset) => {
    const preview = normalizePath(asset.previewPath);
    return `
      <article class="product-card">
        <img src="${escapeAttr(preview)}" alt="${escapeAttr(asset.productName)}" loading="lazy">
        <div>
          <h3>${escapeHtml(asset.productName)}</h3>
          <p>${escapeHtml(asset.brand || "")} · ${escapeHtml(categoryLabel(asset.category) || "sin categoría")}<br>${escapeHtml(asset.collection || "sin colección")}</p>
        </div>
        <button type="button" data-add-asset="${escapeAttr(asset.id)}">Añadir</button>
      </article>
    `;
  }).join("");

  els.productList.querySelectorAll("[data-add-asset]").forEach((button) => {
    button.addEventListener("click", () => addAssetToScene(button.dataset.addAsset));
  });
}

function addAssetToScene(assetId) {
  const asset = state.catalog.find((item) => item.id === assetId);
  if (!asset) return;
  const layer = {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    assetId: asset.id,
    x: 50,
    y: 70,
    scale: 1,
    rotation: 0,
    z: ++state.zCounter,
    includedInProposal: true,
  };
  state.layers.push(layer);
  renderLayers();
  selectLayer(layer.id);
  renderUsedProducts();
  saveScene();
}

function renderLayers() {
  els.layerRoot.innerHTML = "";
  state.layers
    .slice()
    .sort((a, b) => a.z - b.z)
    .forEach((layer) => {
      const asset = getAsset(layer.assetId);
      if (!asset) return;
      const item = document.createElement("div");
      item.className = `scene-item${layer.id === state.selectedId ? " is-selected" : ""}`;
      item.dataset.layerId = layer.id;
      item.style.left = `${layer.x}%`;
      item.style.top = `${layer.y}%`;
      item.style.zIndex = String(layer.z);
      item.style.transform = `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`;
      item.innerHTML = `
        <img src="${escapeAttr(normalizePath(asset.previewPath))}" alt="${escapeAttr(asset.productName)}">
        <div class="item-shadow" style="transform:translateX(-50%) scale(${layer.scale})"></div>
      `;
      item.addEventListener("pointerdown", startDrag);
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        selectLayer(layer.id);
      });
      els.layerRoot.appendChild(item);
    });
  renderMiniMenu();
}

function renderMiniMenu() {
  const existing = els.layerRoot.querySelector(".item-mini-menu");
  if (existing) existing.remove();
  if (!state.selectedId) return;
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  const menu = document.createElement("div");
  menu.className = "item-mini-menu";
  menu.style.left = `${layer.x}%`;
  menu.style.top = `${layer.y}%`;
  menu.innerHTML = `
    <button type="button" title="Girar 15°" data-action="rotate">↻</button>
    <button type="button" title="Duplicar" data-action="duplicate">⧉</button>
    <button type="button" title="Traer al frente" data-action="front">▵</button>
    <button type="button" title="Enviar atrás" data-action="back">▿</button>
    <button type="button" title="Eliminar" class="danger" data-action="delete">🗑</button>
  `;
  menu.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const action = btn.dataset.action;
      if (action === "rotate") rotateSelected();
      if (action === "duplicate") duplicateSelected();
      if (action === "front") moveSelectedZ("front");
      if (action === "back") moveSelectedZ("back");
      if (action === "delete") deleteSelected();
    });
  });
  els.layerRoot.appendChild(menu);
}

function rotateSelected() {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  layer.rotation = ((layer.rotation || 0) + 15) % 360;
  renderLayers();
  renderInspector();
  saveScene();
}

function duplicateSelected() {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  const copy = {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    assetId: layer.assetId,
    x: clamp((layer.x || 50) + 4, 0, 100),
    y: clamp((layer.y || 70) + 4, 0, 100),
    scale: layer.scale ?? 1,
    rotation: layer.rotation ?? 0,
    z: ++state.zCounter,
    includedInProposal: layer.includedInProposal !== false,
  };
  state.layers.push(copy);
  renderLayers();
  selectLayer(copy.id);
  renderUsedProducts();
  saveScene();
}

function toggleProposal() {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  layer.includedInProposal = !layer.includedInProposal;
  renderInspector();
  renderUsedProducts();
  saveScene();
}

function startDrag(event) {
  event.preventDefault();
  const layerId = event.currentTarget.dataset.layerId;
  selectLayer(layerId);
  const layer = getLayer(layerId);
  const rect = els.stage.getBoundingClientRect();
  state.drag = {
    layerId,
    startX: event.clientX,
    startY: event.clientY,
    originalX: layer.x,
    originalY: layer.y,
    rect,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", stopDrag, { once: true });
}

function onDragMove(event) {
  if (!state.drag) return;
  const dx = ((event.clientX - state.drag.startX) / state.drag.rect.width) * 100;
  const dy = ((event.clientY - state.drag.startY) / state.drag.rect.height) * 100;
  const layer = getLayer(state.drag.layerId);
  if (!layer) return;
  layer.x = clamp(state.drag.originalX + dx, 0, 100);
  layer.y = clamp(state.drag.originalY + dy, 0, 100);
  renderLayers();
  renderInspector();
}

function stopDrag() {
  window.removeEventListener("pointermove", onDragMove);
  state.drag = null;
  saveScene();
}

function selectLayer(layerId) {
  state.selectedId = layerId;
  renderLayers();
  renderInspector();
}

function updateSelected(patch) {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  Object.assign(layer, patch);
  renderLayers();
  renderInspector();
  saveScene();
}

function deleteSelected() {
  if (!state.selectedId) return;
  state.layers = state.layers.filter((layer) => layer.id !== state.selectedId);
  state.selectedId = null;
  renderLayers();
  renderInspector();
  renderUsedProducts();
  saveScene();
}

function moveSelectedZ(direction) {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  if (direction === "front") {
    layer.z = ++state.zCounter;
  } else {
    layer.z = Math.max(1, Math.min(...state.layers.map((item) => item.z)) - 1);
  }
  renderLayers();
  saveScene();
}

function renderInspector() {
  const layer = getLayer(state.selectedId);
  const asset = layer ? getAsset(layer.assetId) : null;
  els.inspectorFields.classList.toggle("is-disabled", !layer);
  els.selectionStatus.textContent = asset ? `Editando: ${asset.productName}` : "Ningún elemento seleccionado.";

  if (asset) {
    els.inspectorPreview.style.display = "block";
    els.inspectorPreview.src = normalizePath(asset.previewPath);
    els.inspectorPreview.alt = asset.productName;
    els.inspectorBadge.style.display = "inline-flex";
    els.inspectorMeta.innerHTML = `
      <strong style="color:var(--text)">${escapeHtml(asset.productName)}</strong><br>
      ${escapeHtml(asset.brand || "")} · ${escapeHtml(categoryLabel(asset.category))}<br>
      Colección: ${escapeHtml(asset.collection || "N/A")}<br>
      SKU: ${escapeHtml(asset.sku || "N/A")}
    `;
    els.viewerLink.style.display = "inline-flex";
    els.viewerLink.href = `/viewer/index.html`;
    els.proposalToggleBtn.style.display = "block";
    const isIn = layer.includedInProposal !== false;
    els.proposalToggleBtn.classList.toggle("is-included", isIn);
    els.proposalToggleBtn.textContent = isIn ? "✓ Incluido en propuesta" : "+ Añadir a propuesta";
  } else {
    els.inspectorPreview.style.display = "none";
    els.inspectorPreview.src = "";
    els.inspectorBadge.style.display = "none";
    els.inspectorMeta.innerHTML = "";
    els.viewerLink.style.display = "none";
    els.proposalToggleBtn.style.display = "none";
  }

  els.scaleInput.value = layer?.scale ?? 1;
  els.rotationInput.value = layer?.rotation ?? 0;
  els.xInput.value = layer ? round(layer.x) : "";
  els.yInput.value = layer ? round(layer.y) : "";
}

function renderUsedProducts() {
  const proposalLayers = state.layers.filter((l) => l.includedInProposal !== false);
  if (!state.layers.length) {
    els.usedProductsList.innerHTML = `<div class="proposal-empty">Sin productos en escena. Añade productos desde el catálogo.</div>`;
    els.proposalCount.textContent = "0";
    return;
  }
  if (!proposalLayers.length) {
    els.usedProductsList.innerHTML = `<div class="proposal-empty">Ningún producto incluido en la propuesta.</div>`;
    els.proposalCount.textContent = "0";
    return;
  }
  const grouped = getUsedProducts(true);
  els.proposalCount.textContent = `${grouped.length} ref. · ${proposalLayers.length} uds.`;
  els.usedProductsList.innerHTML = grouped.map((item) => `
    <article class="proposal-card">
      <img src="${escapeAttr(normalizePath(item.previewPath))}" alt="${escapeAttr(item.productName)}">
      <div class="info">
        <p class="name">${escapeHtml(item.productName)}</p>
        <p class="meta">${escapeHtml(item.brand)} · ${escapeHtml(categoryLabel(item.category))} · SKU: ${escapeHtml(item.sku || "N/A")}</p>
      </div>
      <span class="qty">×${item.quantity}</span>
    </article>
  `).join("");
}

function getUsedProducts(onlyProposal = false) {
  const map = new Map();
  state.layers.forEach((layer) => {
    if (onlyProposal && layer.includedInProposal === false) return;
    const asset = getAsset(layer.assetId);
    if (!asset) return;
    const key = asset.sku || asset.id;
    const existing = map.get(key) || {
      id: asset.id,
      productName: asset.productName,
      brand: asset.brand || "",
      category: asset.category || "",
      collection: asset.collection || "",
      sku: asset.sku || "",
      previewPath: asset.previewPath || "",
      quantity: 0,
    };
    existing.quantity += 1;
    map.set(key, existing);
  });
  return Array.from(map.values());
}

function saveScene() {
  const payload = {
    template: state.template,
    wallColor: state.wallColor,
    floorType: state.floorType,
    view: state.view,
    layers: state.layers,
    zCounter: state.zCounter,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadLastScene() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    alert("No hay una escena guardada en este navegador.");
    return;
  }
  try {
    const payload = JSON.parse(raw);
    state.template = payload.template || "living-room";
    state.wallColor = payload.wallColor || "warm-white";
    state.floorType = payload.floorType || "light-wood";
    state.view = payload.view || "dollhouse";
    state.layers = Array.isArray(payload.layers) ? payload.layers : [];
    // Backward compatibility: ensure includedInProposal exists
    state.layers.forEach((layer) => {
      if (layer.includedInProposal === undefined) layer.includedInProposal = true;
    });
    state.zCounter = Number(payload.zCounter) || 10;
    state.selectedId = null;
    renderControls();
    updateRoomVisuals();
    renderLayers();
    renderInspector();
    renderUsedProducts();
  } catch (error) {
    alert(`No se pudo cargar la escena: ${error.message}`);
  }
}

function clearScene() {
  if (!confirm("¿Limpiar la escena actual? Se perderán los productos colocados.")) return;
  state.layers = [];
  state.selectedId = null;
  localStorage.removeItem(STORAGE_KEY);
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

async function exportPng() {
  const rect = els.stage.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(rect.width * window.devicePixelRatio);
  canvas.height = Math.round(rect.height * window.devicePixelRatio);
  const ctx = canvas.getContext("2d");
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  // Background
  ctx.fillStyle = "#0a0f1a";
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Draw room shell (simplified for export)
  const wall = WALL_COLORS[state.wallColor];
  const floor = FLOOR_TYPES[state.floorType];

  ctx.fillStyle = wall.value;
  ctx.fillRect(0, 0, rect.width, rect.height * 0.62);

  ctx.fillStyle = "#0a0f1a";
  ctx.fillRect(0, rect.height * 0.62, rect.width, rect.height * 0.38);

  // Floor
  const floorY = rect.height * 0.62;
  const floorH = rect.height * 0.38;

  // Create pattern for floor
  const floorCanvas = document.createElement("canvas");
  floorCanvas.width = 40;
  floorCanvas.height = 40;
  const fctx = floorCanvas.getContext("2d");
  fctx.fillStyle = "#d4a574";
  fctx.fillRect(0, 0, 40, 40);
  // Simplified floor: use a solid color approximation
  ctx.fillStyle = extractBaseColor(floor.style) || "#d4a574";
  ctx.fillRect(0, floorY, rect.width, floorH);

  // Products
  const ordered = state.layers.slice().sort((a, b) => a.z - b.z);
  for (const layer of ordered) {
    const asset = getAsset(layer.assetId);
    if (!asset) continue;
    try {
      const img = await loadImage(normalizePath(asset.previewPath));
      const baseWidth = 120;
      const width = baseWidth * layer.scale;
      const height = width * (img.naturalHeight / img.naturalWidth || 1);
      const x = (layer.x / 100) * rect.width;
      const y = (layer.y / 100) * rect.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    } catch {
      // skip product that fails to load
    }
  }

  downloadBlob(await canvasToBlob(canvas), `room-designer-${Date.now()}.png`);
}

function extractBaseColor(style) {
  const match = style.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : null;
}

function exportProjectJson() {
  downloadJson({
    version: "0.1.0",
    type: "room-designer-lite-2.5d",
    exportedAt: new Date().toISOString(),
    template: state.template,
    wallColor: state.wallColor,
    floorType: state.floorType,
    view: state.view,
    layers: state.layers,
    usedProducts: getUsedProducts(),
  }, `room-project-${Date.now()}.json`);
}

function exportUsedProductsJson() {
  downloadJson({
    exportedAt: new Date().toISOString(),
    template: state.template,
    products: getUsedProducts(),
  }, `room-products-${Date.now()}.json`);
}

function downloadJson(data, filename) {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas export failed"));
    }, "image/png");
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

function getAsset(assetId) {
  return state.catalog.find((asset) => asset.id === assetId);
}

function getLayer(layerId) {
  return state.layers.find((layer) => layer.id === layerId);
}

function matchesSearch(asset, query) {
  return [
    asset.productName,
    asset.sku,
    asset.category,
    categoryLabel(asset.category),
    asset.brand,
    asset.collection,
    asset.demoScene,
  ].join(" ").toLowerCase().includes(query);
}

function categoryLabel(value) {
  const labels = {
    "tv-unit": "Mueble TV",
    "coffee-table": "Mesa centro",
    armchair: "Sillón",
    sofa: "Sofá",
    rug: "Alfombra",
    lighting: "Iluminación",
    lamp: "Lámpara",
    chair: "Silla",
    table: "Mesa",
    decor: "Decoración",
    planter: "Macetero",
    textile: "Textil",
    lounge: "Lounge",
    "side-table": "Mesa auxiliar",
    "dining-table": "Mesa comedor",
  };
  return labels[value] || value;
}

function updateCatalogStatus() {
  els.catalogStatus.textContent = `${state.filteredCatalog.length} productos disponibles.`;
}

function normalizePath(path) {
  if (!path) return "/previews/_placeholder/demo-preview.svg";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `/${path}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
