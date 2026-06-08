const MANIFEST_URL = "/manifest/ikea-sample.manifest.json";
const SAMPLE_ROOM_URL = "/demos/empty-room-staging/assets/empty-room-placeholder.svg";
const PRODUCT_TYPE_GROUPS = {
  sofas: ["sofa"],
  armchairs: ["armchair", "chair"],
  chairs: ["chair"],
  tables: ["coffee-table", "table", "side-table"],
  benches: ["bench"],
  sideboards: ["sideboard"],
  "display-cabinets": ["display-cabinet"],
  "tv-unit": ["tv-unit"],
  lighting: ["lighting", "lamp"],
  rugs: ["rug"],
  decor: ["decor", "planter", "textile"],
  beds: ["bed"],
  "bedside-tables": ["bedside-table"],
  dressers: ["dresser"],
  wardrobes: ["wardrobe"],
  vanities: ["vanity"],
  mirrors: ["mirror"],
};

const state = {
  catalog: [],
  filteredCatalog: [],
  layers: [],
  selectedId: null,
  backgroundUrl: "",
  drag: null,
  zCounter: 10,
};

const els = {
  catalogStatus: document.querySelector("#catalogStatus"),
  catalogSearch: document.querySelector("#catalogSearch"),
  collectionFilter: document.querySelector("#collectionFilter"),
  productTypeFilter: document.querySelector("#productTypeFilter"),
  productList: document.querySelector("#productList"),
  sampleRoomBtn: document.querySelector("#sampleRoomBtn"),
  roomUpload: document.querySelector("#roomUpload"),
  stage: document.querySelector("#stage"),
  backgroundImage: document.querySelector("#backgroundImage"),
  layerRoot: document.querySelector("#layerRoot"),
  selectionStatus: document.querySelector("#selectionStatus"),
  selectedName: document.querySelector("#selectedName"),
  scaleInput: document.querySelector("#scaleInput"),
  rotationInput: document.querySelector("#rotationInput"),
  deleteBtn: document.querySelector("#deleteBtn"),
  clearSceneBtn: document.querySelector("#clearSceneBtn"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportProjectBtn: document.querySelector("#exportProjectBtn"),
  exportListBtn: document.querySelector("#exportListBtn"),
  usedProductsList: document.querySelector("#usedProductsList"),
  terracePresetBtn: document.querySelector("#terracePresetBtn"),
  livingPresetBtn: document.querySelector("#livingPresetBtn"),
};

init();

async function init() {
  bindEvents();
  await loadCatalog();
  renderCatalog();
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function bindEvents() {
  els.catalogSearch.addEventListener("input", filterCatalog);
  els.collectionFilter.addEventListener("change", filterCatalog);
  els.productTypeFilter.addEventListener("change", filterCatalog);
  els.sampleRoomBtn.addEventListener("click", useSampleRoom);
  els.roomUpload.addEventListener("change", handleUpload);
  els.clearSceneBtn.addEventListener("click", clearScene);
  els.exportPngBtn.addEventListener("click", exportPng);
  els.exportProjectBtn.addEventListener("click", exportProjectJson);
  els.exportListBtn.addEventListener("click", exportUsedProductsJson);
  els.scaleInput.addEventListener("input", () => updateSelected({ scale: Number(els.scaleInput.value) }));
  els.rotationInput.addEventListener("input", () => updateSelected({ rotation: Number(els.rotationInput.value) }));
  els.deleteBtn.addEventListener("click", deleteSelected);
  els.terracePresetBtn.addEventListener("click", () => applyPreset("terrace"));
  els.livingPresetBtn.addEventListener("click", () => applyPreset("living"));
  els.stage.addEventListener("pointerdown", (event) => {
    if (event.target === els.stage || event.target === els.layerRoot || event.target === els.backgroundImage) {
      selectLayer(null);
    }
  });
}

async function loadCatalog() {
  try {
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    state.catalog = manifest.filter((asset) => asset.hasRealModel === true);
    state.filteredCatalog = [...state.catalog];
    populateCollectionFilter();
    updateCatalogStatus();
  } catch (error) {
    els.catalogStatus.textContent = `No se pudo cargar el catalogo: ${error.message}`;
  }
}

function filterCatalog() {
  const query = els.catalogSearch.value.trim().toLowerCase();
  const collection = els.collectionFilter.value;
  const productType = els.productTypeFilter.value;
  state.filteredCatalog = state.catalog.filter((asset) => {
    if (collection && getCollectionKey(asset) !== collection) return false;
    if (productType && !matchesProductType(asset, productType)) return false;
    if (query && !matchesSearch(asset, query)) return false;
    return true;
  });
  renderCatalog();
  updateCatalogStatus();
}

function renderCatalog() {
  if (!state.filteredCatalog.length) {
    els.productList.innerHTML = `<div class="used-item">No hay productos reales para este filtro.</div>`;
    return;
  }
  els.productList.innerHTML = state.filteredCatalog.map((asset) => `
    <article class="product-card">
      <img src="${escapeAttr(normalizePath(asset.previewPath))}" alt="${escapeAttr(asset.productName)}" loading="lazy">
      <div>
        <h4>${escapeHtml(asset.productName)}</h4>
        <p>${escapeHtml(categoryLabel(asset.category) || "sin categoria")} · SKU ${escapeHtml(asset.sku || "N/A")}</p>
        <button type="button" data-add-asset="${escapeAttr(asset.id)}">Anadir</button>
      </div>
    </article>
  `).join("");
  els.productList.querySelectorAll("[data-add-asset]").forEach((button) => {
    button.addEventListener("click", () => addAsset(button.dataset.addAsset));
  });
}

function useSampleRoom() {
  state.backgroundUrl = SAMPLE_ROOM_URL;
  els.backgroundImage.src = state.backgroundUrl;
  els.stage.classList.add("has-background");
}

function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    alert("Usa JPG, PNG o WebP.");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.backgroundUrl = String(reader.result || "");
    els.backgroundImage.src = state.backgroundUrl;
    els.stage.classList.add("has-background");
  });
  reader.readAsDataURL(file);
}

function applyPreset(type) {
  useSampleRoom();
  state.layers = [];
  const categoryHints = type === "terrace"
    ? ["sofa", "table", "chair", "rug", "planter", "lighting"]
    : ["sofa", "table", "chair", "rug", "decor"];
  const positions = [
    { x: 50, y: 66, scale: 1.35, rotation: 0 },
    { x: 36, y: 70, scale: .9, rotation: -4 },
    { x: 64, y: 70, scale: .9, rotation: 4 },
    { x: 50, y: 82, scale: 1.6, rotation: 0 },
    { x: 77, y: 66, scale: .75, rotation: 0 },
    { x: 23, y: 62, scale: .7, rotation: 0 },
  ];
  const picked = [];
  categoryHints.forEach((hint) => {
    const found = state.catalog.find((asset) => !picked.includes(asset.id) && [asset.category, asset.subcategory, asset.productName].join(" ").toLowerCase().includes(hint));
    if (found) picked.push(found.id);
  });
  picked.slice(0, positions.length).forEach((assetId, index) => {
    state.layers.push({
      id: makeLayerId(),
      assetId,
      ...positions[index],
      z: ++state.zCounter,
    });
  });
  state.selectedId = state.layers.at(-1)?.id || null;
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function addAsset(assetId) {
  const asset = getAsset(assetId);
  if (!asset) return;
  state.layers.push({
    id: makeLayerId(),
    assetId: asset.id,
    x: 50,
    y: 64,
    scale: 1,
    rotation: 0,
    z: ++state.zCounter,
  });
  state.selectedId = state.layers.at(-1).id;
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function renderLayers() {
  els.layerRoot.innerHTML = "";
  state.layers.slice().sort((a, b) => a.z - b.z).forEach((layer) => {
    const asset = getAsset(layer.assetId);
    if (!asset) return;
    const item = document.createElement("div");
    item.className = `scene-item${layer.id === state.selectedId ? " is-selected" : ""}`;
    item.dataset.layerId = layer.id;
    item.style.left = `${layer.x}%`;
    item.style.top = `${layer.y}%`;
    item.style.zIndex = String(layer.z);
    item.style.transform = `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`;
    item.innerHTML = `<img src="${escapeAttr(normalizePath(asset.previewPath))}" alt="${escapeAttr(asset.productName)}">`;
    item.addEventListener("pointerdown", startDrag);
    item.addEventListener("mousedown", startMouseDrag);
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      selectLayer(layer.id);
    });
    els.layerRoot.appendChild(item);
  });
}

function startDrag(event) {
  if (state.drag) return;
  event.preventDefault();
  const layerId = event.currentTarget.dataset.layerId;
  const layer = getLayer(layerId);
  if (!layer) return;
  state.selectedId = layerId;
  renderInspector();
  state.drag = {
    layerId,
    startX: event.clientX,
    startY: event.clientY,
    originalX: layer.x,
    originalY: layer.y,
    rect: els.stage.getBoundingClientRect(),
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", stopDrag, { once: true });
}

function startMouseDrag(event) {
  if (state.drag) return;
  event.preventDefault();
  const layerId = event.currentTarget.dataset.layerId;
  const layer = getLayer(layerId);
  if (!layer) return;
  state.selectedId = layerId;
  renderInspector();
  state.drag = {
    layerId,
    startX: event.clientX,
    startY: event.clientY,
    originalX: layer.x,
    originalY: layer.y,
    rect: els.stage.getBoundingClientRect(),
  };
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", stopDrag, { once: true });
}

function onDragMove(event) {
  if (!state.drag) return;
  const layer = getLayer(state.drag.layerId);
  if (!layer) return;
  const dx = ((event.clientX - state.drag.startX) / state.drag.rect.width) * 100;
  const dy = ((event.clientY - state.drag.startY) / state.drag.rect.height) * 100;
  layer.x = clamp(state.drag.originalX + dx, 0, 100);
  layer.y = clamp(state.drag.originalY + dy, 0, 100);
  renderLayers();
}

function stopDrag() {
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("mousemove", onDragMove);
  state.drag = null;
  renderInspector();
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
}

function deleteSelected() {
  if (!state.selectedId) return;
  state.layers = state.layers.filter((layer) => layer.id !== state.selectedId);
  state.selectedId = null;
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function clearScene() {
  state.layers = [];
  state.selectedId = null;
  state.backgroundUrl = "";
  els.backgroundImage.removeAttribute("src");
  els.stage.classList.remove("has-background");
  renderLayers();
  renderInspector();
  renderUsedProducts();
}

function renderInspector() {
  const layer = getLayer(state.selectedId);
  const asset = layer ? getAsset(layer.assetId) : null;
  els.selectionStatus.textContent = asset ? "Producto seleccionado" : "Ningun producto seleccionado.";
  els.selectedName.textContent = asset ? asset.productName : "";
  els.scaleInput.disabled = !layer;
  els.rotationInput.disabled = !layer;
  els.deleteBtn.disabled = !layer;
  els.scaleInput.value = layer?.scale ?? 1;
  els.rotationInput.value = layer?.rotation ?? 0;
}

function renderUsedProducts() {
  const products = getUsedProducts();
  if (!products.length) {
    els.usedProductsList.textContent = "Sin productos en escena.";
    return;
  }
  els.usedProductsList.innerHTML = products.map((item) => `
    <article class="used-item">
      <strong>${escapeHtml(item.productName)} x ${item.quantity}</strong>
      ${escapeHtml(item.brand)} · ${escapeHtml(item.category)}<br>
      SKU: ${escapeHtml(item.sku || "N/A")}
    </article>
  `).join("");
}

function getUsedProducts() {
  const grouped = new Map();
  state.layers.forEach((layer) => {
    const asset = getAsset(layer.assetId);
    if (!asset) return;
    const key = asset.sku || asset.id;
    const item = grouped.get(key) || {
      id: asset.id,
      productName: asset.productName,
      brand: asset.brand || "",
      category: asset.category || "",
      sku: asset.sku || "",
      quantity: 0,
    };
    item.quantity += 1;
    grouped.set(key, item);
  });
  return Array.from(grouped.values());
}

async function exportPng() {
  const rect = els.stage.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(rect.width * window.devicePixelRatio);
  canvas.height = Math.round(rect.height * window.devicePixelRatio);
  const ctx = canvas.getContext("2d");
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.fillStyle = "#0d141d";
  ctx.fillRect(0, 0, rect.width, rect.height);
  try {
    if (state.backgroundUrl) {
      const bg = await loadImage(state.backgroundUrl);
      drawContain(ctx, bg, 0, 0, rect.width, rect.height);
    }
    for (const layer of state.layers.slice().sort((a, b) => a.z - b.z)) {
      const asset = getAsset(layer.assetId);
      if (!asset) continue;
      const img = await loadImage(normalizePath(asset.previewPath));
      const width = 126 * layer.scale;
      const height = width * (img.naturalHeight / img.naturalWidth || 1);
      const x = (layer.x / 100) * rect.width;
      const y = (layer.y / 100) * rect.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
    downloadBlob(await canvasToBlob(canvas), `empty-room-staging-${Date.now()}.png`);
  } catch (error) {
    alert(`No se pudo exportar PNG: ${error.message}`);
  }
}

function exportProjectJson() {
  downloadJson({
    version: "0.1.0",
    type: "empty-room-staging-demo-2.5d",
    exportedAt: new Date().toISOString(),
    backgroundIncluded: Boolean(state.backgroundUrl),
    layers: state.layers,
    usedProducts: getUsedProducts(),
  }, `empty-room-staging-project-${Date.now()}.json`);
}

function exportUsedProductsJson() {
  downloadJson({
    exportedAt: new Date().toISOString(),
    products: getUsedProducts(),
  }, `empty-room-staging-products-${Date.now()}.json`);
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
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed")), "image/png");
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

function drawContain(ctx, img, x, y, width, height) {
  const ratio = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  ctx.drawImage(img, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function getAsset(assetId) {
  return state.catalog.find((asset) => asset.id === assetId);
}

function getLayer(layerId) {
  return state.layers.find((layer) => layer.id === layerId);
}

function makeLayerId() {
  return `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function populateCollectionFilter() {
  const firstOption = els.collectionFilter.options[0];
  els.collectionFilter.innerHTML = "";
  els.collectionFilter.appendChild(firstOption);
  Array.from(new Set(state.catalog.map(getCollectionKey).filter(Boolean))).sort().forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = collectionLabel(value);
    els.collectionFilter.appendChild(option);
  });
}

function matchesSearch(asset, query) {
  return [
    asset.productName,
    asset.sku,
    asset.category,
    categoryLabel(asset.category),
    asset.brand,
    asset.collection,
    asset.collectionId,
    collectionLabel(getCollectionKey(asset)),
    asset.demoScene,
    asset.roomType,
  ].join(" ").toLowerCase().includes(query);
}

function matchesProductType(asset, productType) {
  const categories = PRODUCT_TYPE_GROUPS[productType] || [];
  return categories.includes(asset.category);
}

function getCollectionKey(asset) {
  return asset.collectionId || asset.demoScene || "";
}

function collectionLabel(value) {
  const labels = {
    "terrace-mediterranean-premium": "Terraza Mediterranea Premium",
    "living-room-nordic-premium": "Salon Nordico Premium",
    "master-bedroom-premium": "Dormitorio Principal Premium",
    "dining-room-mediterranean-premium": "Comedor Mediterraneo Premium",
  };
  return labels[value] || value;
}

function categoryLabel(value) {
  const labels = {
    "tv-unit": "Mueble TV",
    "coffee-table": "Mesa centro",
    armchair: "Sillon",
    sofa: "Sofa",
    rug: "Alfombra",
    lighting: "Iluminacion",
    chair: "Silla",
    table: "Mesa",
    decor: "Decoracion",
    planter: "Macetero",
    textile: "Textil",
    lounge: "Lounge",
    "side-table": "Mesa auxiliar",
    bed: "Cama",
    "bedside-table": "Mesita",
    dresser: "Comoda",
    wardrobe: "Armario",
    vanity: "Tocador",
    mirror: "Espejo",
    bench: "Banco",
    sideboard: "Aparador",
    "display-cabinet": "Vitrina",
  };
  return labels[value] || value;
}

function updateCatalogStatus() {
  els.catalogStatus.textContent = `${state.filteredCatalog.length} productos reales disponibles.`;
}

function normalizePath(path) {
  if (!path) return "/previews/_placeholder/demo-preview.svg";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `/${path}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
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
