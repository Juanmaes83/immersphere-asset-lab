# Estrategia de Importer Batch · Immersphere Asset Lab

## Referencia conceptual (no se clona ni ejecuta)

Repo de referencia: `https://github.com/apinanaivot/IKEA-3d-model-batch-downloader`

Este documento analiza qué nos aporta ese enfoque, qué descartamos, y cómo lo traducimos a una arquitectura profesional para Immersphere Asset Lab.

---

## Diferencia entre métodos de importación

| Método | Descripción | Cuándo usar |
|---|---|---|
| **Manual Capture** | Browser extension o userscript. Un producto a la vez. | Prueba de concepto, asset único, marca sin API |
| **Batch Importer** | Script automatizado que recorre categorías y descarga en lote. | 100+ assets, categoría completa, con permiso |
| **API / Feed Autorizado** | Conector REST/GraphQL oficial de la marca. | Marca con API de partners (ideal) |
| **Manual Upload** | Drag & drop de GLB + JSON en dashboard. | Asset proporcionado directamente por la marca |

---

## Qué nos aporta el batch downloader de referencia

### Flujo por categoría
- Navega por árbol de categorías de IKEA (ej. "Furniture → Sofas").
- Extrae lista de URLs de producto para toda la categoría.

### Extracción de links de producto
- Parsea HTML o intercepta API interna para obtener IDs de producto.
- Genera lista de URLs a procesar.

### Variantes de color
- Detecta que un mismo producto tiene múltiples variantes (color, material).
- Intenta descargar todas las variantes.

### Registro de duplicados
- Mantiene registro de qué productos ya se descargaron para no repetir.
- Usa SKU o ID de producto como clave de deduplicación.

### SQLite como antecedente del manifest
- Almacena metadata en SQLite local: nombre, SKU, color, URL, estado de descarga.
- Es un precursor del manifest JSON profesional.

### Modo lote
- Procesa múltiples productos sin intervención manual.
- Útil para ingestas masivas.

---

## Qué NO copiamos directamente

| Problema del repo de referencia | Por qué no lo usamos |
|---|---|
| **Selectores frágiles** | Depende de clases CSS de IKEA (`pip-xr-button`). Se rompen con cualquier redesign. |
| **Selenium producto a producto** | Lentísimo. Abre navegador, espera renderizado, hace clic, espera descarga. No escala. |
| **Descarga sin licencia por asset** | No registra qué permiso tiene cada producto. Riesgo legal masivo. |
| **Falta de manifest profesional** | SQLite básico vs. schema JSON con 30+ campos, validación, enums. |
| **Falta de previews** | No genera thumbnails. No hay visibilidad del catálogo. |
| **Falta de QA** | No valida GLB, no revisa escala, no comprueba texturas. |
| **Falta de metadatos avanzados** | No extrae dimensiones, materiales, estilos, estancias. |
| **Uso comercial no contemplado** | Diseñado para uso personal. Sin licencias, sin contratos. |

---

## Traducción a Immersphere Asset Lab

### Importer batch futuro (autorizado)

```
Categoría seleccionada (ej. "Sofas IKEA")
    ↓
Discovery de productos (API autorizada o feed)
    ↓
Para cada producto:
    ├── Extraer metadata: nombre, SKU, dimensiones, color, material
    ├── Detectar variantes (colores, materiales)
    ├── Verificar licencia: ¿este SKU tiene permiso?
    ├── Verificar duplicado: ¿ya está en el catálogo?
    ├── Generar manifest draft
    ├── Descargar GLB (si autorizado)
    ├── Validar GLB (glTF-Transform)
    ├── Generar preview
    ├── QA visual
    └── Aprobar → manifest final
```

### Asset Registry
- Base de datos local (futuro PostgreSQL) de todos los assets.
- Índices por SKU, marca, categoría, estado de licencia, QA status.
- Deduplicación automática por SKU + model URL.

### Taxonomía aplicada en batch
- Cada asset importado se clasifica automáticamente según `taxonomy.md`.
- Inferencia de estilo, estancia y material a partir del nombre/descripción del producto.

### Control de licencia
- Antes de procesar cualquier asset, el importer consulta `BrandPartner` y `PermissionDocument`.
- Si no hay permiso válido: asset va a cola de "pendiente de autorización".

### Logs y reporting
- Cada batch genera un reporte:
  - Total procesados
  - Exitosos
  - Fallidos (con motivo)
  - Duplicados ignorados
  - Licencias pendientes

### Deduplicación
- Clave única: `brand + externalSku + variant`.
- Si un asset ya existe con mismo SKU: se actualiza metadata si cambió, se ignora si es idéntico.

---

## Campos mínimos que debe capturar un importer futuro

```json
{
  "brand": "IKEA",
  "productName": "KIVIK",
  "sku": "IKEA-KIVIK-001",
  "externalSku": "s09297568",
  "productUrl": "https://www.ikea.com/es/es/p/kivik-sofa-3-plazas...",
  "sourceUrl": "https://www.ikea.com/es/es/cat/sofas-10661/",
  "modelUrl": "https://.../kivik.glb",
  "variant": "Tallmyra beige",
  "color": "beige",
  "material": "fabric",
  "category": "sofa",
  "subcategory": "3-seat-sofa",
  "dimensions": { "width": 228, "height": 83, "depth": 95, "unit": "cm" },
  "licenseStatus": "authorized",
  "permissionReference": "PERM-IKEA-2026-001",
  "capturedAt": "2026-06-07T12:00:00Z",
  "qaStatus": "pending"
}
```

---

## Por qué NO descargamos nada en esta fase

1. **No hay permisos formales todavía.** Descargar sin contrato firmado viola ToS de la marca.
2. **El pipeline no está completo.** Falta QA automatizado, generación de previews, y storage configurado.
3. **El manifest está en evolución.** Los campos pueden cambiar. No queremos re-procesar 100 assets.
4. **Prioridad estratégica.** Primero negociar, luego construir importer, luego ejecutar batch.

---

## Arquitectura futura del importer

```
Authorized Source
    ↓
Product Discovery
    ├── API call o feed parse
    └── Output: lista de product IDs
    ↓
Variant Discovery
    ├── Para cada producto: detectar variantes (color, material, tamaño)
    └── Output: lista de variantes
    ↓
Asset URL Detection
    ├── Para cada variante: obtener URL del modelo 3D
    └── Output: map {variant → modelUrl}
    ↓
Metadata Extraction
    ├── Nombre, SKU, dimensiones, color, material, precio, categoría
    └── Output: objeto metadata
    ↓
License Check
    ├── ¿Marca activa? ¿Permiso vigente? ¿SKU cubierto?
    └── Si NO: cola "pendiente de autorización"
    ↓
Manifest Draft
    ├── Generar entrada JSON con todos los campos
    └── Guardar en `/tmp/manifest-draft-{batchId}.json`
    ↓
QA Pipeline (futuro)
    ├── Descargar GLB
    ├── Validar (glTF-Transform)
    ├── Generar preview
    ├── QA visual
    └── Aprobar / Rechazar
    ↓
Manifest Final
    └── Mover a `manifest/{brand}-{batchId}.json`
```

---

## Estado actual

- ✅ Estrategia documentada
- ✅ Schema de manifest definido
- ✅ Validador de manifest funcionando
- ✅ Taxonomía definida
- ❌ Importer batch NO implementado todavía
- ❌ Sin conexión a APIs de marcas
- ❌ Sin descargas automatizadas

**Próximo paso:** Negociar permiso con primera marca → construir importer manual → escalar a batch.
