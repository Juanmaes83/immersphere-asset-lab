# Flujo de Trabajo · Immersphere Asset Lab

## Etapas del pipeline

```
┌─────────────────┐
│  1. PERMISO     │  ← Gate crítico. Sin permiso, no avanza.
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. CAPTURA     │  ← Importación o descarga autorizada.
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. METADATA    │  ← Registro completo en manifest.json.
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. VALIDACIÓN  │  ← glTF-Transform: validate + inspect.
└────────┬────────┘
         ↓
┌─────────────────┐
│  5. PREVIEW     │  ← Thumbnail 512×512 WebP/PNG.
└────────┬────────┘
         ↓
┌─────────────────┐
│  6. QA VISUAL   │  ← Revisión manual: escala, texturas, peso.
└────────┬────────┘
         ↓
┌─────────────────┐
│  7. APROBACIÓN  │  ← qaStatus: approved. Disponible para uso.
└────────┬────────┘
         ↓
┌─────────────────┐
│  8. USO         │  ← Demo → Cliente → Producción.
└────────┬────────┘
         ↓
┌─────────────────┐
│  9. MONITOREO   │  ← Alertas de expiración, uso, feedback.
└─────────────────┘
```

---

## Etapa 1: Permiso

**Responsable:** Juanma / equipo comercial  
**Input:** Contacto con marca (IKEA Business Sales, partnership, etc.)  
**Output:** Contrato firmado o documento de autorización

**Checklist:**
- [ ] Contacto establecido con departamento correcto de la marca
- [ ] Alcance definido: uso comercial, redistribución, reventa, uso de marca
- [ ] Documento firmado por representante legal con poder
- [ ] Fecha de expiración conocida
- [ ] Restricciones geográficas/sectoriales documentadas

---

## Etapa 2: Captura / Importación

**Responsable:** Pipeline engineer / técnico  
**Input:** Permiso + SKU o URL del producto  
**Output:** Archivo GLB/GLTF en carpeta local

**Métodos posibles:**
- Descarga manual autorizada desde web de la marca
- Feed/API oficial de la marca (si existe)
- Importación desde archivo proporcionado por la marca
- Extracción autorizada por script firmado por la marca

**Prohibido:**
- Scraping no autorizado
- Reverse engineering de visores propietarios
- Uso de scripts de terceros sin permiso explícito de la marca

---

## Etapa 3: Registro de Metadata

**Responsable:** Pipeline engineer / catalog manager  
**Input:** Archivo + información del producto  
**Output:** Entrada en manifest.json

**Campos obligatorios:**
- `id` — UUID interno
- `brand` — Marca
- `productName` — Nombre legible
- `category` — Categoría ICS
- `sku` — SKU interno
- `modelPath` — Ruta del archivo
- `format` — glb/gltf/fbx/etc
- `licenseType` — Tipo de licencia
- `qaStatus` — `pending`

---

## Etapa 4: Validación Técnica

**Responsable:** Pipeline engineer  
**Herramientas:** `@gltf-transform/cli`, `gltf-validator`

**Checks:**
- [ ] El archivo abre sin errores
- [ ] No hay geometría corrupta
- [ ] Texturas están embebidas o referenciadas correctamente
- [ ] No hay materiales inválidos
- [ ] El archivo no es un ejecutable disfrazado (validación MIME)

**Reporte:** Si hay errores, se guardan en `qaNotes` y se marca `qaStatus: rejected`.

---

## Etapa 5: Generación de Preview

**Responsable:** Pipeline engineer / automatizado  
**Output:** Thumbnail 512×512 WebP o PNG

**Métodos:**
- Render headless con Three.js (Node + puppeteer/playwright)
- Screenshot de model-viewer en navegador
- Cloudinary transform (si el modelo ya está en cloud)

---

## Etapa 6: QA Visual

**Responsable:** 3D artist / QA reviewer  
**Input:** Archivo + preview + metadata  
**Output:** `qaStatus` actualizado

**Checklist:**
- [ ] El modelo se ve correctamente (sin artefactos)
- [ ] La escala es realista (cm o m)
- [ ] Las texturas se ven bien (no pixeladas, no faltan)
- [ ] El peso es aceptable (< 10 MB ideal, < 50 MB máximo)
- [ ] El nombre coincide con el producto real
- [ ] La licencia está registrada
- [ ] La preview representa fielmente el modelo

---

## Etapa 7: Aprobación

**Responsable:** Product owner / director  
**Input:** Asset con QA completo  
**Output:** `qaStatus: approved`

**Acciones:**
- Mover archivo a carpeta definitiva (`assets/brand/category/`)
- Subir preview a storage autorizado
- Actualizar manifest: `qaStatus: approved`, `optimizedAt`

---

## Etapa 8: Uso

**Responsable:** Equipo comercial / cliente  
**Uso permitido según licencia:**
- Demo interna
- Render comercial de cliente
- Tour 3D con hotspots de producto
- Dossier PDF con listado de mobiliario

**Tracking:**
- Registro de qué assets se usaron en qué propiedad/proyecto
- Feedback de clientes (¿el modelo funcionó bien?)

---

## Etapa 9: Monitoreo

**Responsable:** Sistema automatizado + compliance  
**Acciones:**
- Alerta 30 días antes de expiración de licencia
- Revisión trimestral de `qaStatus: pending` > 90 días
- Auditoría de uso: ¿algún asset se usó fuera de alcance?
- Actualización: si la marca saca nueva colección, re-ingesta
