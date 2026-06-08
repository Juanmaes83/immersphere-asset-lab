const MANIFEST_URL = "/manifest/ikea-sample.manifest.json";
const STORAGE_KEY = "immersphere.assetLab.roomDesignerLite.v1";
const VIEWS_STORAGE_KEY = "immersphere.assetLab.roomDesignerLite.views.v1";
const PRESETS_STORAGE_KEY = "immersphere.assetLab.roomDesignerLite.presets.v1";
const DEMO_REQUEST_EMAIL = "demo@immersphere.pro";

const TEMPLATES = {
  "living-room": { name: "Salón", defaultWall: "warm-white", defaultWallSide: "light-grey", defaultFloor: "light-wood", hasWindow: true, hasDoor: false },
  terrace: { name: "Terraza", defaultWall: "sand", defaultWallSide: "stone-beige", defaultFloor: "terrace-exterior", hasWindow: true, hasDoor: false },
  bedroom: { name: "Dormitorio", defaultWall: "light-grey", defaultWallSide: "warm-white", defaultFloor: "dark-wood", hasWindow: true, hasDoor: true },
  "dining-room": { name: "Comedor", defaultWall: "stone-beige", defaultWallSide: "warm-white", defaultFloor: "light-tile", hasWindow: true, hasDoor: false },
  "home-office": { name: "Home Office", defaultWall: "warm-white", defaultWallSide: "light-grey", defaultFloor: "soft-cement", hasWindow: true, hasDoor: false },
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
  front: { name: "Frontal", icon: "▭" },
  top: { name: "Superior", icon: "▢" },
  left: { name: "Izquierda", icon: "◧" },
  right: { name: "Derecha", icon: "◨" },
};

const TYPE_MAP = {
  sofas: ["sofa"],
  armchairs: ["armchair", "lounge-chair"],
  poufs: ["pouf"],
  footstools: ["footstool"],
  tables: ["table", "coffee-table", "side-table", "dining-table"],
  benches: ["bench"],
  sideboards: ["sideboard"],
  "display-cabinets": ["display-cabinet"],
  cabinets: ["cabinet"],
  "kitchen-cabinets": ["kitchen-wall-cabinet", "kitchen-base-cabinet", "kitchen-tall-cabinet", "kitchen-corner-cabinet", "kitchen-sliding-wall-cabinet", "kitchen-storage", "kitchen-cabinet"],
  "tv-units": ["tv-unit"],
  lighting: ["lighting", "lamp"],
  rugs: ["rug"],
  decor: ["decor", "planter"],
  chairs: ["chair"],
  textile: ["textile"],
  beds: ["bed"],
  "bedside-tables": ["bedside-table"],
  dressers: ["dresser"],
  wardrobes: ["wardrobe"],
  vanities: ["vanity"],
  mirrors: ["mirror"],
};

const COMBINES_RULES = {
  sofa: ["coffee-table", "rug", "lighting", "textile", "decor"],
  armchair: ["coffee-table", "rug", "lighting", "decor"],
  "lounge-chair": ["footstool", "coffee-table", "rug", "lighting"],
  pouf: ["sofa", "armchair", "lounge-chair", "rug"],
  footstool: ["lounge-chair", "armchair", "sofa"],
  cabinet: ["sofa", "armchair", "decor", "lighting"],
  "tv-unit": ["sofa", "armchair", "decor", "lighting"],
  "coffee-table": ["sofa", "armchair", "rug", "decor"],
  rug: ["sofa", "armchair", "coffee-table"],
  lighting: ["sofa", "armchair", "decor"],
  chair: ["table", "side-table", "decor"],
  table: ["chair", "lighting", "decor"],
  bench: ["table", "rug", "decor"],
  sideboard: ["table", "chair", "decor"],
  "display-cabinet": ["table", "chair", "decor"],
  "kitchen-wall-cabinet": ["kitchen-base-cabinet", "kitchen-tall-cabinet", "kitchen-storage"],
  "kitchen-base-cabinet": ["kitchen-wall-cabinet", "kitchen-tall-cabinet", "kitchen-storage"],
  "kitchen-tall-cabinet": ["kitchen-base-cabinet", "kitchen-wall-cabinet", "kitchen-storage"],
  "kitchen-corner-cabinet": ["kitchen-base-cabinet", "kitchen-wall-cabinet"],
  "kitchen-sliding-wall-cabinet": ["kitchen-base-cabinet", "kitchen-storage"],
  "kitchen-storage": ["kitchen-base-cabinet", "kitchen-wall-cabinet"],
  bed: ["side-table", "lighting", "rug", "wardrobe"],
  "bedside-table": ["bed", "lighting", "mirror", "vanity"],
  dresser: ["mirror", "lighting", "decor", "bed"],
  wardrobe: ["bed", "dresser", "mirror"],
  vanity: ["mirror", "lighting", "bedside-table"],
  mirror: ["vanity", "dresser", "bedside-table"],
  desk: ["chair", "lighting", "shelf"],
  decor: ["sofa", "armchair", "table", "lighting"],
  planter: ["decor", "table"],
  textile: ["sofa", "armchair", "chair"],
  lounge: ["coffee-table", "rug", "lighting"],
  "side-table": ["sofa", "armchair", "decor"],
  "dining-table": ["chair", "lighting", "decor"],
};

const STYLE_PRESETS = {
  mediterranean: {
    name: "Mediterráneo claro",
    icon: "☀️",
    template: "terrace",
    wallColor: "warm-white",
    wallSideColor: "sand",
    floorType: "mediterranean-stone",
    collectionFilter: "terrace-mediterranean-premium",
  },
  nordic: {
    name: "Nórdico premium",
    icon: "🌲",
    template: "living-room",
    wallColor: "light-grey",
    wallSideColor: "warm-white",
    floorType: "light-wood",
    collectionFilter: "living-room-nordic-premium",
  },
  minimal: {
    name: "Minimal cálido",
    icon: "⬜",
    template: "living-room",
    wallColor: "warm-white",
    wallSideColor: "warm-white",
    floorType: "soft-cement",
    collectionFilter: "",
  },
  urban: {
    name: "Urbano grafito",
    icon: "🏙",
    template: "home-office",
    wallColor: "graphite",
    wallSideColor: "light-grey",
    floorType: "dark-wood",
    collectionFilter: "",
  },
  natural: {
    name: "Natural soft",
    icon: "🌿",
    template: "bedroom",
    wallColor: "stone-beige",
    wallSideColor: "sand",
    floorType: "light-wood",
    collectionFilter: "",
  },
  bedroom: {
    name: "Dormitorio premium",
    icon: "🛏",
    template: "bedroom",
    wallColor: "stone-beige",
    wallSideColor: "warm-white",
    floorType: "light-wood",
    collectionFilter: "master-bedroom-premium",
  },
};

const state = {
  catalog: [],
  filteredCatalog: [],
  template: "living-room",
  wallColor: "warm-white",
  wallSideColor: "light-grey",
  floorType: "light-wood",
  view: "dollhouse",
  layers: [],
  selectedId: null,
  drag: null,
  zCounter: 10,
  savedViews: [],
  savedPresets: [],
  proposalData: {
    projectName: "Proyecto Room Designer",
    clientName: "Cliente pendiente",
    email: "",
    phone: "",
    notes: "",
  },
};

const els = {
  templateGrid: document.querySelector("#templateGrid"),
  wallColorGrid: document.querySelector("#wallColorGrid"),
  wallSideColorGrid: document.querySelector("#wallSideColorGrid"),
  floorGrid: document.querySelector("#floorGrid"),
  viewGrid: document.querySelector("#viewGrid"),
  presetGrid: document.querySelector("#presetGrid"),
  savedViewsList: document.querySelector("#savedViewsList"),
  savedPresetsList: document.querySelector("#savedPresetsList"),
  viewThumbnails: document.querySelector("#viewThumbnails"),
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
  similarSection: document.querySelector("#similarSection"),
  similarList: document.querySelector("#similarList"),
  combinesSection: document.querySelector("#combinesSection"),
  combinesList: document.querySelector("#combinesList"),
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

  projectNameInput: document.querySelector("#projectNameInput"),
  clientNameInput: document.querySelector("#clientNameInput"),
  clientEmailInput: document.querySelector("#clientEmailInput"),
  clientPhoneInput: document.querySelector("#clientPhoneInput"),
  proposalNotesInput: document.querySelector("#proposalNotesInput"),
  proposalTotals: document.querySelector("#proposalTotals"),

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
  loadSavedViews();
  loadSavedPresets();
  renderControls();
  bindEvents();
  await loadCatalog();
  updateRoomVisuals();
  renderLayers();
  renderInspector();
  renderUsedProducts();
  renderViewThumbnails();
  renderProposalData();
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

  // Wall colors (main)
  els.wallColorGrid.innerHTML = Object.entries(WALL_COLORS).map(([key, col]) => `
    <button type="button" class="swatch-btn${state.wallColor === key ? " is-active" : ""}" data-wall="${escapeAttr(key)}" title="${escapeAttr(col.name)}" style="background:${col.value};${key==="warm-white"||key==="sand"||key==="light-grey"||key==="stone-beige"?"border-color:rgba(0,0,0,.15)":""}"></button>
  `).join("");
  els.wallColorGrid.querySelectorAll("[data-wall]").forEach((btn) => {
    btn.addEventListener("click", () => setWallColor(btn.dataset.wall));
  });

  // Wall side colors
  els.wallSideColorGrid.innerHTML = Object.entries(WALL_COLORS).map(([key, col]) => `
    <button type="button" class="swatch-btn${state.wallSideColor === key ? " is-active" : ""}" data-wall-side="${escapeAttr(key)}" title="${escapeAttr(col.name)}" style="background:${col.value};${key==="warm-white"||key==="sand"||key==="light-grey"||key==="stone-beige"?"border-color:rgba(0,0,0,.15)":""}"></button>
  `).join("");
  els.wallSideColorGrid.querySelectorAll("[data-wall-side]").forEach((btn) => {
    btn.addEventListener("click", () => setWallSideColor(btn.dataset.wallSide));
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

  // Style presets
  els.presetGrid.innerHTML = Object.entries(STYLE_PRESETS).map(([key, preset]) => `
    <button type="button" class="preset-btn" data-preset="${escapeAttr(key)}">
      <span class="preset-icon">${preset.icon}</span>
      <span>${escapeHtml(preset.name)}</span>
    </button>
  `).join("");
  els.presetGrid.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
  });

  renderSavedViews();
  renderSavedPresets();
}

function bindEvents() {
  on(els.catalogSearch, "input", applyCatalogFilters);
  on(els.collectionFilter, "change", applyCatalogFilters);
  on(els.typeFilter, "change", applyCatalogFilters);

  on(els.scaleInput, "input", () => updateSelected({ scale: Number(els.scaleInput.value) }));
  on(els.rotationInput, "input", () => updateSelected({ rotation: Number(els.rotationInput.value) }));
  on(els.xInput, "input", () => updateSelected({ x: clamp(Number(els.xInput.value), 0, 100) }));
  on(els.yInput, "input", () => updateSelected({ y: clamp(Number(els.yInput.value), 0, 100) }));
  on(els.deleteBtn, "click", deleteSelected);
  on(els.frontBtn, "click", () => moveSelectedZ("front"));
  on(els.backBtn, "click", () => moveSelectedZ("back"));
  on(els.proposalToggleBtn, "click", toggleProposal);

  on(els.clearSceneBtn, "click", clearScene);
  on(els.saveSceneBtn, "click", saveScene);

  on(els.projectNameInput, "input", updateProposalData);
  on(els.clientNameInput, "input", updateProposalData);
  on(els.clientEmailInput, "input", updateProposalData);
  on(els.clientPhoneInput, "input", updateProposalData);
  on(els.proposalNotesInput, "input", updateProposalData);
  on(els.loadSceneBtn, "click", loadLastScene);
  on(els.exportPngBtn, "click", exportPng);
  on(els.exportProjectBtn, "click", exportProjectJson);
  on(els.exportListBtn, "click", exportUsedProductsJson);

  const exportCommercialBtn = document.querySelector("#exportCommercialBtn");
  const printProposalBtn = document.querySelector("#printProposalBtn");
  const exportHtmlBtn = document.querySelector("#exportHtmlBtn");
  const requestDemoBtn = document.querySelector("#requestDemoBtn");
  if (exportCommercialBtn) exportCommercialBtn.addEventListener("click", exportCommercialJson);
  if (printProposalBtn) printProposalBtn.addEventListener("click", openPrintableProposal);
  if (exportHtmlBtn) exportHtmlBtn.addEventListener("click", exportProposalHtml);
  if (requestDemoBtn) requestDemoBtn.addEventListener("click", requestDemo);

  on(els.stage, "pointerdown", (event) => {
    if (event.target === els.stage || event.target === els.layerRoot || event.target === els.roomScene || event.target === els.roomShell || event.target.classList.contains("wall-back") || event.target.classList.contains("room-floor")) {
      selectLayer(null);
    }
  });
}

function setTemplate(key) {
  if (!TEMPLATES[key]) return;
  state.template = key;
  state.wallColor = TEMPLATES[key].defaultWall;
  state.wallSideColor = TEMPLATES[key].defaultWallSide;
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

function setWallSideColor(key) {
  if (!WALL_COLORS[key]) return;
  state.wallSideColor = key;
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
  renderViewThumbnails();
  updateRoomVisuals();
}

function applyPreset(key) {
  const preset = STYLE_PRESETS[key];
  if (!preset) return;
  state.template = preset.template;
  state.wallColor = preset.wallColor;
  state.wallSideColor = preset.wallSideColor;
  state.floorType = preset.floorType;
  if (preset.collectionFilter) {
    els.collectionFilter.value = preset.collectionFilter;
    applyCatalogFilters();
  }
  renderControls();
  updateRoomVisuals();
  saveScene();
}

function updateRoomVisuals() {
  const tpl = TEMPLATES[state.template];
  const wall = WALL_COLORS[state.wallColor];
  const wallSide = WALL_COLORS[state.wallSideColor];
  const floor = FLOOR_TYPES[state.floorType];
  const view = VIEWS[state.view];

  els.sceneLabel.textContent = `${tpl.name} · ${view.name}`;
  els.roomScene.className = "room-scene view-" + state.view;
  els.roomShell.className = "room-shell tpl-" + state.template;

  els.wallBack.style.background = wall.value;
  els.wallLeft.style.background = wallSide.value;
  els.wallRight.style.background = wallSide.value;
  els.roomFloor.style.background = floor.style;
}

async function loadCatalog() {
  try {
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
    const manifest = await response.json();
    state.catalog = manifest.filter((asset) => asset.hasRealModel === true);
    if (!state.catalog.length) {
      state.filteredCatalog = [];
      renderCatalogMessage("No hay productos reales disponibles en el manifest.");
      updateCatalogStatus();
      return;
    }
    normalizeCatalogFilters();
    applyCatalogFilters();
  } catch (error) {
    state.catalog = [];
    state.filteredCatalog = [];
    renderCatalogMessage("No se pudo cargar el catalogo. Revisa manifest/ikea-sample.manifest.json.");
    if (els.catalogStatus) els.catalogStatus.textContent = `No se pudo cargar el catalogo: ${error.message}`;
  }
}

function applyCatalogFilters() {
  try {
  const query = (els.catalogSearch?.value || "").trim().toLowerCase();
  const collection = normalizeFilterValue(els.collectionFilter?.value);
  const type = normalizeFilterValue(els.typeFilter?.value);

  state.filteredCatalog = state.catalog.filter((asset) => {
    if (collection && getCollectionKey(asset) !== collection) return false;
    if (type) {
      const allowed = TYPE_MAP[type] || [];
      if (!allowed.includes(asset.category)) return false;
    }
    if (query && !matchesSearch(asset, query)) return false;
    return true;
  });

  renderCatalog();
  updateCatalogStatus();
  } catch (error) {
    console.error("Room Designer catalog render failed:", error);
    renderCatalogMessage(`Error renderizando catalogo: ${error.message}`);
    if (els.catalogStatus) els.catalogStatus.textContent = "Error renderizando catalogo.";
  }
}

function renderCatalog() {
  try {
  if (!state.filteredCatalog.length) {
    renderCatalogMessage("No hay productos reales que coincidan.");
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
  } catch (error) {
    console.error("Room Designer renderCatalog failed:", error);
    renderCatalogMessage(`Error renderizando catalogo: ${error.message}`);
  }
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
  els.similarSection.classList.toggle("is-disabled", !layer);
  els.combinesSection.classList.toggle("is-disabled", !layer);
  els.selectionStatus.textContent = asset ? `Editando: ${asset.productName}` : "Selecciona un producto de la escena para ver sus detalles.";

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
    renderSimilar();
    renderCombines();
  } else {
    els.inspectorPreview.style.display = "none";
    els.inspectorPreview.src = "";
    els.inspectorBadge.style.display = "none";
    els.inspectorMeta.innerHTML = "";
    els.viewerLink.style.display = "none";
    els.proposalToggleBtn.style.display = "none";
    els.similarList.innerHTML = "Selecciona un producto para ver similares.";
    els.combinesList.innerHTML = "Selecciona un producto para ver recomendaciones.";
  }

  els.scaleInput.value = layer?.scale ?? 1;
  els.rotationInput.value = layer?.rotation ?? 0;
  els.xInput.value = layer ? round(layer.x) : "";
  els.yInput.value = layer ? round(layer.y) : "";
}

function renderSimilar() {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  const asset = getAsset(layer.assetId);
  if (!asset) return;
  const similars = state.catalog.filter((a) => a.id !== asset.id && a.category === asset.category).slice(0, 6);
  if (!similars.length) {
    els.similarList.innerHTML = `<div class="proposal-empty">No hay productos similares disponibles.</div>`;
    return;
  }
  els.similarList.innerHTML = similars.map((a) => `
    <div class="compact-item" data-similar="${escapeAttr(a.id)}">
      <img src="${escapeAttr(normalizePath(a.previewPath))}" alt="${escapeAttr(a.productName)}">
      <div class="info">
        <p class="name">${escapeHtml(a.productName)}</p>
        <p class="meta">${escapeHtml(a.brand)} · ${escapeHtml(categoryLabel(a.category))}</p>
      </div>
      <span class="action">↻</span>
    </div>
  `).join("");
  els.similarList.querySelectorAll("[data-similar]").forEach((item) => {
    item.addEventListener("click", () => substituteAsset(item.dataset.similar));
  });
}

function substituteAsset(newAssetId) {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  const newAsset = state.catalog.find((a) => a.id === newAssetId);
  if (!newAsset) return;
  layer.assetId = newAsset.id;
  renderLayers();
  renderInspector();
  renderUsedProducts();
  saveScene();
}

function renderCombines() {
  const layer = getLayer(state.selectedId);
  if (!layer) return;
  const asset = getAsset(layer.assetId);
  if (!asset) return;
  const relatedCats = COMBINES_RULES[asset.category] || [];
  if (!relatedCats.length) {
    els.combinesList.innerHTML = `<div class="proposal-empty">No hay recomendaciones para esta categoría.</div>`;
    return;
  }
  const recommendations = state.catalog
    .filter((a) => a.id !== asset.id && relatedCats.includes(a.category))
    .slice(0, 6);
  if (!recommendations.length) {
    els.combinesList.innerHTML = `<div class="proposal-empty">No hay productos recomendados disponibles.</div>`;
    return;
  }
  els.combinesList.innerHTML = recommendations.map((a) => `
    <div class="compact-item" data-combine="${escapeAttr(a.id)}">
      <img src="${escapeAttr(normalizePath(a.previewPath))}" alt="${escapeAttr(a.productName)}">
      <div class="info">
        <p class="name">${escapeHtml(a.productName)}</p>
        <p class="meta">${escapeHtml(a.brand)} · ${escapeHtml(categoryLabel(a.category))}</p>
      </div>
      <span class="action">+</span>
    </div>
  `).join("");
  els.combinesList.querySelectorAll("[data-combine]").forEach((item) => {
    item.addEventListener("click", () => addAssetToScene(item.dataset.combine));
  });
}

function renderUsedProducts() {
  const proposalLayers = state.layers.filter((l) => l.includedInProposal !== false);
  const excludedLayers = state.layers.filter((l) => l.includedInProposal === false);
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
  let html = grouped.map((item) => `
    <article class="proposal-card">
      <img src="${escapeAttr(normalizePath(item.previewPath))}" alt="${escapeAttr(item.productName)}">
      <div class="info">
        <p class="name">${escapeHtml(item.productName)}</p>
        <p class="meta">${escapeHtml(item.brand)} · ${escapeHtml(categoryLabel(item.category))} · SKU: ${escapeHtml(item.sku || "N/A")}</p>
      </div>
      <span class="qty">×${item.quantity}</span>
    </article>
  `).join("");
  if (excludedLayers.length) {
    html += `<div class="proposal-empty" style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px;"><strong>En escena, fuera de propuesta:</strong> ${excludedLayers.length} producto(s)</div>`;
  }
  els.usedProductsList.innerHTML = html;
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

function renderViewThumbnails() {
  els.viewThumbnails.innerHTML = Object.entries(VIEWS).map(([key, vw]) => `
    <button type="button" class="view-thumb-btn${state.view === key ? " is-active" : ""}" data-thumb="${escapeAttr(key)}">
      <span class="view-thumb-icon"></span>
      <span>${escapeHtml(vw.name)}</span>
    </button>
  `).join("") + `
    <div class="view-thumb-actions">
      <button type="button" id="saveViewBtn">Guardar vista</button>
    </div>
  `;
  els.viewThumbnails.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.thumb));
  });
  const saveBtn = els.viewThumbnails.querySelector("#saveViewBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentView);
}

function saveCurrentView() {
  const name = prompt("Nombre de la vista guardada:", `Vista ${state.savedViews.length + 1}`);
  if (!name) return;
  const view = {
    id: `view-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    template: state.template,
    wallColor: state.wallColor,
    wallSideColor: state.wallSideColor,
    floorType: state.floorType,
    view: state.view,
    layers: JSON.parse(JSON.stringify(state.layers)),
    zCounter: state.zCounter,
    savedAt: new Date().toISOString(),
  };
  state.savedViews.push(view);
  persistSavedViews();
  renderSavedViews();
}

function loadView(viewId) {
  const view = state.savedViews.find((v) => v.id === viewId);
  if (!view) return;
  state.template = view.template;
  state.wallColor = view.wallColor;
  state.wallSideColor = view.wallSideColor || view.wallColor;
  state.floorType = view.floorType;
  state.view = view.view;
  state.layers = JSON.parse(JSON.stringify(view.layers));
  state.zCounter = view.zCounter || 10;
  state.selectedId = null;
  renderControls();
  updateRoomVisuals();
  renderViewThumbnails();
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function deleteView(viewId) {
  state.savedViews = state.savedViews.filter((v) => v.id !== viewId);
  persistSavedViews();
  renderSavedViews();
}

function renderSavedViews() {
  if (!state.savedViews.length) {
    els.savedViewsList.innerHTML = "Ninguna guardada.";
    return;
  }
  els.savedViewsList.innerHTML = state.savedViews.map((v) => `
    <div class="saved-item">
      <div>
        <span class="name">${escapeHtml(v.name)}</span>
        <span class="meta">${escapeHtml(TEMPLATES[v.template]?.name || v.template)} · ${escapeHtml(VIEWS[v.view]?.name || v.view)}</span>
      </div>
      <div class="actions">
        <button type="button" data-load-view="${escapeAttr(v.id)}">Cargar</button>
        <button type="button" class="danger" data-delete-view="${escapeAttr(v.id)}">×</button>
      </div>
    </div>
  `).join("");
  els.savedViewsList.querySelectorAll("[data-load-view]").forEach((btn) => {
    btn.addEventListener("click", () => loadView(btn.dataset.loadView));
  });
  els.savedViewsList.querySelectorAll("[data-delete-view]").forEach((btn) => {
    btn.addEventListener("click", () => deleteView(btn.dataset.deleteView));
  });
}

function loadSavedViews() {
  try {
    const raw = localStorage.getItem(VIEWS_STORAGE_KEY);
    if (raw) state.savedViews = JSON.parse(raw);
  } catch {
    state.savedViews = [];
  }
}

function persistSavedViews() {
  localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(state.savedViews));
}

function saveCurrentPreset() {
  const name = prompt("Nombre del estilo guardado:", `Estilo guardado ${state.savedPresets.length + 1}`);
  if (!name) return;
  const preset = {
    id: `preset-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    template: state.template,
    wallColor: state.wallColor,
    wallSideColor: state.wallSideColor,
    floorType: state.floorType,
    view: state.view,
    savedAt: new Date().toISOString(),
  };
  state.savedPresets.push(preset);
  persistSavedPresets();
  renderSavedPresets();
}

function applyCustomPreset(presetId) {
  const preset = state.savedPresets.find((p) => p.id === presetId);
  if (!preset) return;
  state.template = preset.template;
  state.wallColor = preset.wallColor;
  state.wallSideColor = preset.wallSideColor || preset.wallColor;
  state.floorType = preset.floorType;
  state.view = preset.view;
  renderControls();
  updateRoomVisuals();
  renderViewThumbnails();
  saveScene();
}

function deletePreset(presetId) {
  state.savedPresets = state.savedPresets.filter((p) => p.id !== presetId);
  persistSavedPresets();
  renderSavedPresets();
}

function renderSavedPresets() {
  if (!state.savedPresets.length) {
    els.savedPresetsList.innerHTML = `
      Ninguno guardado.
      <div style="margin-top:8px;"><button type="button" id="saveCustomPresetBtn" style="padding:5px 10px;border-radius:6px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--text);font-size:11px;cursor:pointer">Guardar estilo actual</button></div>
    `;
    const btn = els.savedPresetsList.querySelector("#saveCustomPresetBtn");
    if (btn) btn.addEventListener("click", saveCurrentPreset);
    return;
  }
  els.savedPresetsList.innerHTML = state.savedPresets.map((p) => `
    <div class="saved-item">
      <div>
        <span class="name">${escapeHtml(p.name)}</span>
        <span class="meta">${escapeHtml(TEMPLATES[p.template]?.name || p.template)} · ${escapeHtml(WALL_COLORS[p.wallColor]?.name || p.wallColor)} · ${escapeHtml(FLOOR_TYPES[p.floorType]?.name || p.floorType)}</span>
      </div>
      <div class="actions">
        <button type="button" data-load-preset="${escapeAttr(p.id)}">Cargar</button>
        <button type="button" class="danger" data-delete-preset="${escapeAttr(p.id)}">×</button>
      </div>
    </div>
  `).join("") + `
    <div style="margin-top:8px;"><button type="button" id="saveCustomPresetBtn" style="padding:5px 10px;border-radius:6px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--text);font-size:11px;cursor:pointer">Guardar estilo actual</button></div>
  `;
  els.savedPresetsList.querySelectorAll("[data-load-preset]").forEach((btn) => {
    btn.addEventListener("click", () => applyCustomPreset(btn.dataset.loadPreset));
  });
  els.savedPresetsList.querySelectorAll("[data-delete-preset]").forEach((btn) => {
    btn.addEventListener("click", () => deletePreset(btn.dataset.deletePreset));
  });
  const btn = els.savedPresetsList.querySelector("#saveCustomPresetBtn");
  if (btn) btn.addEventListener("click", saveCurrentPreset);
}

function loadSavedPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (raw) state.savedPresets = JSON.parse(raw);
  } catch {
    state.savedPresets = [];
  }
}

function persistSavedPresets() {
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(state.savedPresets));
}

function saveScene() {
  const payload = {
    template: state.template,
    wallColor: state.wallColor,
    wallSideColor: state.wallSideColor,
    floorType: state.floorType,
    view: state.view,
    layers: state.layers,
    zCounter: state.zCounter,
    proposalData: state.proposalData,
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
    state.wallSideColor = payload.wallSideColor || payload.wallColor || "warm-white";
    state.floorType = payload.floorType || "light-wood";
    state.view = payload.view || "dollhouse";
    state.layers = Array.isArray(payload.layers) ? payload.layers : [];
    state.layers.forEach((layer) => {
      if (layer.includedInProposal === undefined) layer.includedInProposal = true;
    });
    state.zCounter = Number(payload.zCounter) || 10;
    state.proposalData = payload.proposalData || {
      projectName: "Proyecto Room Designer",
      clientName: "Cliente pendiente",
      email: "",
      phone: "",
      notes: "",
    };
    state.selectedId = null;
    renderControls();
    updateRoomVisuals();
    renderViewThumbnails();
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

  ctx.fillStyle = "#0a0f1a";
  ctx.fillRect(0, 0, rect.width, rect.height);

  const wall = WALL_COLORS[state.wallColor];
  const floor = FLOOR_TYPES[state.floorType];

  ctx.fillStyle = wall.value;
  ctx.fillRect(0, 0, rect.width, rect.height * 0.62);

  ctx.fillStyle = "#0a0f1a";
  ctx.fillRect(0, rect.height * 0.62, rect.width, rect.height * 0.38);

  ctx.fillStyle = extractBaseColor(floor.style) || "#d4a574";
  ctx.fillRect(0, rect.height * 0.62, rect.width, rect.height * 0.38);

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
      // skip
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
    wallSideColor: state.wallSideColor,
    floorType: state.floorType,
    view: state.view,
    layers: state.layers,
    proposalData: state.proposalData,
    usedProducts: getUsedProducts(),
    commercialSummary: buildCommercialSummary(),
  }, `room-project-${Date.now()}.json`);
}

function exportUsedProductsJson() {
  downloadJson({
    exportedAt: new Date().toISOString(),
    template: state.template,
    products: getUsedProducts(),
  }, `room-products-${Date.now()}.json`);
}

function buildCommercialSummary() {
  const grouped = getUsedProducts(true);
  let total = 0;
  let pendingCount = 0;
  const lines = grouped.map((item) => {
    const price = getAssetPrice(item.id);
    const lineTotal = price !== null ? price * item.quantity : null;
    if (lineTotal !== null) total += lineTotal;
    else pendingCount += item.quantity;
    return {
      assetId: item.id,
      name: item.productName,
      brand: item.brand,
      category: item.category,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: price,
      lineTotal,
    };
  });
  return {
    projectName: state.proposalData.projectName,
    clientName: state.proposalData.clientName,
    lineItems: lines,
    totalAmount: total,
    pendingValuationCount: pendingCount,
    generatedAt: new Date().toISOString(),
  };
}

function getAssetPrice(assetId) {
  const asset = getAsset(assetId);
  if (!asset) return null;
  const candidates = [asset.price, asset.priceEUR, asset.unitPrice, asset.priceValue];
  for (const v of candidates) {
    if (v !== undefined && v !== null && v !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return null;
}

function renderProposalData() {
  const pd = state.proposalData;
  if (els.projectNameInput) els.projectNameInput.value = pd.projectName || "";
  if (els.clientNameInput) els.clientNameInput.value = pd.clientName || "";
  if (els.clientEmailInput) els.clientEmailInput.value = pd.email || "";
  if (els.clientPhoneInput) els.clientPhoneInput.value = pd.phone || "";
  if (els.proposalNotesInput) els.proposalNotesInput.value = pd.notes || "";
}

function updateProposalData() {
  state.proposalData = {
    projectName: els.projectNameInput?.value?.trim() || "Proyecto Room Designer",
    clientName: els.clientNameInput?.value?.trim() || "Cliente pendiente",
    email: els.clientEmailInput?.value?.trim() || "",
    phone: els.clientPhoneInput?.value?.trim() || "",
    notes: els.proposalNotesInput?.value?.trim() || "",
  };
}

function adjustQuantity(assetId, delta) {
  const layers = state.layers.filter((l) => l.assetId === assetId && l.includedInProposal !== false);
  if (!layers.length) return;
  if (delta > 0) {
    const first = layers[0];
    const asset = getAsset(assetId);
    const layer = {
      id: crypto.randomUUID ? crypto.randomUUID() : `l-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      assetId,
      x: first.x + (Math.random() * 10 - 5),
      y: first.y + (Math.random() * 10 - 5),
      scale: first.scale,
      rotation: first.rotation,
      z: ++state.zCounter,
      includedInProposal: true,
    };
    state.layers.push(layer);
  } else if (delta < 0 && layers.length > 1) {
    const toRemove = layers[layers.length - 1];
    state.layers = state.layers.filter((l) => l.id !== toRemove.id);
    if (state.selectedId === toRemove.id) state.selectedId = null;
  }
  renderLayers();
  renderUsedProducts();
  renderInspector();
}

function locateProductInScene(assetId) {
  const layer = state.layers.find((l) => l.assetId === assetId);
  if (!layer) return;
  state.selectedId = layer.id;
  renderLayers();
  renderInspector();
  const rect = els.stage.getBoundingClientRect();
  const x = (layer.x / 100) * rect.width;
  const y = (layer.y / 100) * rect.height;
  els.stage.scrollTo({
    left: x - rect.width / 2,
    top: y - rect.height / 2,
    behavior: "smooth",
  });
}

function renderProposalTotals(grouped) {
  if (!els.proposalTotals) return;
  let total = 0;
  let pendingCount = 0;
  for (const item of grouped) {
    const price = getAssetPrice(item.id);
    if (price !== null) total += price * item.quantity;
    else pendingCount += item.quantity;
  }
  const totalRow = total > 0
    ? `<div class="total-row"><span>Total estimado</span><span class="total-amount">${total.toFixed(2)} €</span></div>`
    : "";
  const pendingRow = pendingCount > 0
    ? `<div class="total-row pending"><span>${pendingCount} producto(s) pendiente(s) de valoración</span><span>—</span></div>`
    : "";
  els.proposalTotals.innerHTML = totalRow + pendingRow;
  els.proposalTotals.style.display = totalRow || pendingRow ? "block" : "none";
}

function exportCommercialJson() {
  const summary = buildCommercialSummary();
  downloadJson(summary, `propuesta-${Date.now()}.json`);
}

function openPrintableProposal() {
  const grouped = getUsedProducts(true);
  const pd = state.proposalData;
  let total = 0;
  let pendingCount = 0;
  const rows = grouped.map((item) => {
    const price = getAssetPrice(item.id);
    const lineTotal = price !== null ? price * item.quantity : null;
    if (lineTotal !== null) total += lineTotal;
    else pendingCount += item.quantity;
    const priceCell = price !== null
      ? `<td>${price.toFixed(2)} €</td><td>${lineTotal.toFixed(2)} €</td>`
      : `<td colspan="2" style="font-style:italic;color:#666;">Precio pendiente de valoración</td>`;
    return `
      <tr>
        <td>${escapeHtml(item.productName)}</td>
        <td>${escapeHtml(item.brand)}</td>
        <td>${escapeHtml(item.sku || "N/A")}</td>
        <td>${item.quantity}</td>
        ${priceCell}
      </tr>
    `;
  }).join("");
  const totalRow = total > 0 ? `<tr><td colspan="5" style="text-align:right;font-weight:bold;">Total estimado: ${total.toFixed(2)} €</td></tr>` : "";
  const pendingNotice = pendingCount > 0 ? `<p style="margin-top:12px;font-style:italic;color:#666;">* ${pendingCount} producto(s) pendiente(s) de valoración por parte del equipo comercial.</p>` : "";
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Propuesta comercial</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:40px auto;max-width:900px;color:#111;line-height:1.5}
h1{margin-bottom:4px} .meta{color:#555;margin-bottom:24px}
table{width:100%;border-collapse:collapse;margin-top:12px} th,td{border:1px solid #ddd;padding:8px;text-align:left} th{background:#f5f5f5}
.total{font-weight:bold;background:#fafafa} .footer{margin-top:32px;color:#777;font-size:12px}
@media print{body{margin:20px} .no-print{display:none}}
</style></head>
<body>
<h1>${escapeHtml(pd.projectName || "Propuesta comercial")}</h1>
<div class="meta">
  <div><strong>Cliente:</strong> ${escapeHtml(pd.clientName || "—")}</div>
  <div><strong>Email:</strong> ${escapeHtml(pd.email || "—")}</div>
  <div><strong>Teléfono:</strong> ${escapeHtml(pd.phone || "—")}</div>
  <div><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</div>
</div>
${pd.notes ? `<p style="white-space:pre-wrap;margin-bottom:16px;">${escapeHtml(pd.notes)}</p>` : ""}
<table>
  <thead>
    <tr><th>Producto</th><th>Marca</th><th>SKU</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
  </thead>
  <tbody>${rows}${totalRow}</tbody>
</table>
${pendingNotice}
<div class="footer">Generado por Immersphere Asset Lab · Room Designer Lite</div>
<button class="no-print" onclick="window.print()" style="margin-top:20px;padding:10px 18px;font-size:16px;cursor:pointer;">Imprimir / Guardar como PDF</button>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

function exportProposalHtml() {
  const grouped = getUsedProducts(true);
  const pd = state.proposalData;
  let total = 0;
  let pendingCount = 0;
  const rows = grouped.map((item) => {
    const price = getAssetPrice(item.id);
    const lineTotal = price !== null ? price * item.quantity : null;
    if (lineTotal !== null) total += lineTotal;
    else pendingCount += item.quantity;
    const priceCell = price !== null
      ? `<td>${price.toFixed(2)} €</td><td>${lineTotal.toFixed(2)} €</td>`
      : `<td colspan="2" style="font-style:italic;color:#666;">Precio pendiente de valoración</td>`;
    return `
      <tr>
        <td>${escapeHtml(item.productName)}</td>
        <td>${escapeHtml(item.brand)}</td>
        <td>${escapeHtml(item.sku || "N/A")}</td>
        <td>${item.quantity}</td>
        ${priceCell}
      </tr>
    `;
  }).join("");
  const totalRow = total > 0 ? `<tr><td colspan="5" style="text-align:right;font-weight:bold;">Total estimado: ${total.toFixed(2)} €</td></tr>` : "";
  const pendingNotice = pendingCount > 0 ? `<p style="margin-top:12px;font-style:italic;color:#666;">* ${pendingCount} producto(s) pendiente(s) de valoración por parte del equipo comercial.</p>` : "";
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Propuesta comercial</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:40px auto;max-width:900px;color:#111;line-height:1.5}
h1{margin-bottom:4px} .meta{color:#555;margin-bottom:24px}
table{width:100%;border-collapse:collapse;margin-top:12px} th,td{border:1px solid #ddd;padding:8px;text-align:left} th{background:#f5f5f5}
.total{font-weight:bold;background:#fafafa} .footer{margin-top:32px;color:#777;font-size:12px}
</style></head>
<body>
<h1>${escapeHtml(pd.projectName || "Propuesta comercial")}</h1>
<div class="meta">
  <div><strong>Cliente:</strong> ${escapeHtml(pd.clientName || "—")}</div>
  <div><strong>Email:</strong> ${escapeHtml(pd.email || "—")}</div>
  <div><strong>Teléfono:</strong> ${escapeHtml(pd.phone || "—")}</div>
  <div><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</div>
</div>
${pd.notes ? `<p style="white-space:pre-wrap;margin-bottom:16px;">${escapeHtml(pd.notes)}</p>` : ""}
<table>
  <thead>
    <tr><th>Producto</th><th>Marca</th><th>SKU</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
  </thead>
  <tbody>${rows}${totalRow}</tbody>
</table>
${pendingNotice}
<div class="footer">Generado por Immersphere Asset Lab · Room Designer Lite</div>
</body></html>`;
  downloadBlob(new Blob([html], { type: "text/html" }), `propuesta-${Date.now()}.html`);
}

function requestDemo() {
  const pd = state.proposalData;
  const subject = encodeURIComponent(`Solicitud demo privada · ${pd.projectName || "Room Designer"}`);
  const body = encodeURIComponent(`Hola equipo de Immersphere,

Solicito una demostración privada de Room Designer para el siguiente proyecto:

Proyecto: ${pd.projectName || "—"}
Cliente: ${pd.clientName || "—"}
Email: ${pd.email || "—"}
Teléfono: ${pd.phone || "—"}

Notas:
${pd.notes || "Ninguna"}

Productos en escena: ${state.layers.length}

Por favor contacten conmigo para coordinar la sesión.

Gracias.`);
  window.location.href = `mailto:${DEMO_REQUEST_EMAIL}?subject=${subject}&body=${body}`;
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
    bed: "Cama",
    "bedside-table": "Mesita",
    dresser: "Comoda",
    wardrobe: "Armario",
    vanity: "Tocador",
    mirror: "Espejo",
    bench: "Banco",
    sideboard: "Aparador",
    "display-cabinet": "Vitrina",
    "lounge-chair": "Butaca lounge",
    pouf: "Puf",
    footstool: "Reposapies",
    cabinet: "Armario salon",
    "kitchen-wall-cabinet": "Armario pared cocina",
    "kitchen-base-cabinet": "Armario bajo cocina",
    "kitchen-tall-cabinet": "Armario alto cocina",
    "kitchen-corner-cabinet": "Armario esquina cocina",
    "kitchen-sliding-wall-cabinet": "Armario pared correderas",
    "kitchen-storage": "Almacenaje cocina",
    "kitchen-cabinet": "Modulo cocina",
  };
  return labels[value] || value;
}

function updateCatalogStatus() {
  if (els.catalogStatus) els.catalogStatus.textContent = `${state.filteredCatalog.length} productos disponibles.`;
}

function on(element, eventName, handler) {
  if (!element) {
    console.warn(`Room Designer: missing DOM element for ${eventName} listener`);
    return;
  }
  element.addEventListener(eventName, handler);
}

function normalizeCatalogFilters() {
  resetInvalidSelect(els.collectionFilter, ["", "all", "terrace-mediterranean-premium", "living-room-nordic-premium", "master-bedroom-premium", "dining-room-mediterranean-premium", "kitchen-mediterranean-modular", "living-room-lounge-extension"]);
  resetInvalidSelect(els.typeFilter, ["", "all", ...Object.keys(TYPE_MAP)]);
  if (els.catalogSearch && typeof els.catalogSearch.value !== "string") els.catalogSearch.value = "";
}

function resetInvalidSelect(select, allowedValues) {
  if (!select) return;
  if (!allowedValues.includes(select.value)) select.value = "";
}

function normalizeFilterValue(value) {
  if (!value || value === "all") return "";
  return value;
}

function getCollectionKey(asset) {
  return asset.collectionId || asset.demoScene || "";
}

function renderCatalogMessage(message) {
  if (els.productList) {
    els.productList.innerHTML = `<div class="used-item">${escapeHtml(message)}</div>`;
  }
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
