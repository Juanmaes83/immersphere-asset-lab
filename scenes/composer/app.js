const MANIFEST_URL = "/manifest/ikea-sample.manifest.json";
const STORAGE_KEY = "immersphere.assetLab.sceneComposer.v1";

const state = {
  catalog: [],
  filteredCatalog: [],
  layers: [],
  selectedId: null,
  backgroundDataUrl: "",
  drag: null,
  zCounter: 10,
};

const els = {
  catalogStatus: document.querySelector("#catalogStatus"),
  catalogSearch: document.querySelector("#catalogSearch"),
  productList: document.querySelector("#productList"),
  roomUpload: document.querySelector("#roomUpload"),
  stage: document.querySelector("#stage"),
  backgroundImage: document.querySelector("#backgroundImage"),
  layerRoot: document.querySelector("#layerRoot"),
  selectionStatus: document.querySelector("#selectionStatus"),
  inspectorFields: document.querySelector("#inspectorFields"),
  selectedName: document.querySelector("#selectedName"),
  scaleInput: document.querySelector("#scaleInput"),
  rotationInput: document.querySelector("#rotationInput"),
  xInput: document.querySelector("#xInput"),
  yInput: document.querySelector("#yInput"),
  deleteBtn: document.querySelector("#deleteBtn"),
  frontBtn: document.querySelector("#frontBtn"),
  backBtn: document.querySelector("#backBtn"),
  usedProductsList: document.querySelector("#usedProductsList"),
  loadLastBtn: document.querySelector("#loadLastBtn"),
  clearSceneBtn: document.querySelector("#clearSceneBtn"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportProjectBtn: document.querySelector("#exportProjectBtn"),
  exportListBtn: document.querySelector("#exportListBtn"),
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
  els.catalogSearch.addEventListener("input", () => {
    const query = els.catalogSearch.value.trim().toLowerCase();
    state.filteredCatalog = state.catalog.filter((asset) => {
      const haystack = [
        asset.productName,
        asset.category,
        asset.collection,
        asset.sku,
        asset.brand,
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
    renderCatalog();
  });

  els.roomUpload.addEventListener("change", handleBackgroundUpload);
  els.scaleInput.addEventListener("input", () => updateSelected({ scale: Number(els.scaleInput.value) }));
  els.rotationInput.addEventListener("input", () => updateSelected({ rotation: Number(els.rotationInput.value) }));
  els.xInput.addEventListener("input", () => updateSelected({ x: clamp(Number(els.xInput.value), 0, 100) }));
  els.yInput.addEventListener("input", () => updateSelected({ y: clamp(Number(els.yInput.value), 0, 100) }));
  els.deleteBtn.addEventListener("click", deleteSelected);
  els.frontBtn.addEventListener("click", () => moveSelectedZ("front"));
  els.backBtn.addEventListener("click", () => moveSelectedZ("back"));
  els.clearSceneBtn.addEventListener("click", clearScene);
  els.loadLastBtn.addEventListener("click", loadLastScene);
  els.exportPngBtn.addEventListener("click", exportPng);
  els.exportProjectBtn.addEventListener("click", exportProjectJson);
  els.exportListBtn.addEventListener("click", exportUsedProductsJson);

  els.stage.addEventListener("pointerdown", (event) => {
    if (event.target === els.stage || event.target === els.layerRoot || event.target === els.backgroundImage) {
      selectLayer(null);
    }
  });
}

async function loadCatalog() {
  try {
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
    const manifest = await response.json();
    state.catalog = manifest.filter((asset) => asset.hasRealModel === true);
    state.filteredCatalog = [...state.catalog];
    els.catalogStatus.textContent = `${state.catalog.length} productos reales disponibles.`;
  } catch (error) {
    els.catalogStatus.textContent = `No se pudo cargar el catalogo: ${error.message}`;
  }
}

function renderCatalog() {
  if (!state.filteredCatalog.length) {
    els.productList.innerHTML = `<div class="used-item">No hay productos reales que coincidan con el filtro.</div>`;
    return;
  }

  els.productList.innerHTML = state.filteredCatalog.map((asset) => {
    const preview = normalizePath(asset.previewPath);
    return `
      <article class="product-card">
        <img src="${escapeAttr(preview)}" alt="${escapeAttr(asset.productName)}" loading="lazy">
        <div>
          <h3>${escapeHtml(asset.productName)}</h3>
          <p>${escapeHtml(asset.brand || "")} · ${escapeHtml(asset.category || "sin categoria")}<br>${escapeHtml(asset.collection || "sin coleccion")}</p>
          <button type="button" data-add-asset="${escapeAttr(asset.id)}">Anadir a escena</button>
        </div>
      </article>
    `;
  }).join("");

  els.productList.querySelectorAll("[data-add-asset]").forEach((button) => {
    button.addEventListener("click", () => addAssetToScene(button.dataset.addAsset));
  });
}

function handleBackgroundUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    alert("Formato no soportado. Usa JPG, PNG o WebP.");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.backgroundDataUrl = String(reader.result || "");
    els.backgroundImage.src = state.backgroundDataUrl;
    els.stage.classList.add("has-background");
    saveScene();
  });
  reader.readAsDataURL(file);
}

function addAssetToScene(assetId) {
  const asset = state.catalog.find((item) => item.id === assetId);
  if (!asset) return;
  const layer = {
    id: `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    assetId: asset.id,
    x: 50,
    y: 58,
    scale: 1,
    rotation: 0,
    z: ++state.zCounter,
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
      item.innerHTML = `<img src="${escapeAttr(normalizePath(asset.previewPath))}" alt="${escapeAttr(asset.productName)}">`;
      item.addEventListener("pointerdown", startDrag);
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        selectLayer(layer.id);
      });
      els.layerRoot.appendChild(item);
    });

  if (state.backgroundDataUrl) {
    els.backgroundImage.src = state.backgroundDataUrl;
    els.stage.classList.add("has-background");
  }
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
  els.selectionStatus.textContent = asset ? "Editando producto colocado." : "Ningun elemento seleccionado.";
  els.selectedName.value = asset?.productName || "";
  els.scaleInput.value = layer?.scale ?? 1;
  els.rotationInput.value = layer?.rotation ?? 0;
  els.xInput.value = layer ? round(layer.x) : "";
  els.yInput.value = layer ? round(layer.y) : "";
}

function renderUsedProducts() {
  if (!state.layers.length) {
    els.usedProductsList.textContent = "Sin productos en escena.";
    return;
  }
  const grouped = getUsedProducts();
  els.usedProductsList.innerHTML = grouped.map((item) => `
    <article class="used-item">
      <strong>${escapeHtml(item.productName)} × ${item.quantity}</strong>
      ${escapeHtml(item.brand)} · ${escapeHtml(item.category)}<br>
      SKU: ${escapeHtml(item.sku || "N/A")}<br>
      Uso en escena: ${escapeHtml(item.useInScene)}
    </article>
  `).join("");
}

function getUsedProducts() {
  const map = new Map();
  state.layers.forEach((layer) => {
    const asset = getAsset(layer.assetId);
    if (!asset) return;
    const key = asset.sku || asset.id;
    const existing = map.get(key) || {
      id: asset.id,
      productName: asset.productName,
      brand: asset.brand || "",
      category: asset.category || "",
      sku: asset.sku || "",
      quantity: 0,
      useInScene: "Composicion visual 2.5D",
    };
    existing.quantity += 1;
    map.set(key, existing);
  });
  return Array.from(map.values());
}

function saveScene() {
  const payload = {
    backgroundDataUrl: state.backgroundDataUrl,
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
    state.backgroundDataUrl = payload.backgroundDataUrl || "";
    state.layers = Array.isArray(payload.layers) ? payload.layers : [];
    state.zCounter = Number(payload.zCounter) || 10;
    state.selectedId = null;
    renderLayers();
    renderInspector();
    renderUsedProducts();
  } catch (error) {
    alert(`No se pudo cargar la escena: ${error.message}`);
  }
}

function clearScene() {
  if (!confirm("Limpiar la escena actual?")) return;
  state.layers = [];
  state.selectedId = null;
  state.backgroundDataUrl = "";
  els.backgroundImage.removeAttribute("src");
  els.stage.classList.remove("has-background");
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
  ctx.fillStyle = "#0d141d";
  ctx.fillRect(0, 0, rect.width, rect.height);

  try {
    if (state.backgroundDataUrl) {
      const bg = await loadImage(state.backgroundDataUrl);
      drawContain(ctx, bg, 0, 0, rect.width, rect.height);
    }

    const ordered = state.layers.slice().sort((a, b) => a.z - b.z);
    for (const layer of ordered) {
      const asset = getAsset(layer.assetId);
      if (!asset) continue;
      const img = await loadImage(normalizePath(asset.previewPath));
      const baseWidth = 130;
      const width = baseWidth * layer.scale;
      const height = width * (img.naturalHeight / img.naturalWidth || 1);
      const x = (layer.x / 100) * rect.width;
      const y = (layer.y / 100) * rect.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    }

    downloadBlob(await canvasToBlob(canvas), `scene-composer-${Date.now()}.png`);
  } catch (error) {
    alert(`No se pudo exportar PNG: ${error.message}`);
  }
}

function exportProjectJson() {
  downloadJson({
    version: "0.1.0",
    type: "scene-composer-2.5d",
    exportedAt: new Date().toISOString(),
    backgroundIncluded: Boolean(state.backgroundDataUrl),
    layers: state.layers,
    usedProducts: getUsedProducts(),
  }, `scene-project-${Date.now()}.json`);
}

function exportUsedProductsJson() {
  downloadJson({
    exportedAt: new Date().toISOString(),
    products: getUsedProducts(),
  }, `scene-products-${Date.now()}.json`);
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
