# Modelo de Datos · Immersphere Asset Lab

## Visión

Documentación del modelo de datos futuro. **NO se implementa Prisma todavía.**

Este documento sirve como blueprint para cuando se integre con Immersphere Pro SaaS.

---

## Entidades principales

### 1. Asset

**Objetivo:** Representa un producto 3D individual con toda su metadata, licencia y estado de QA.

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único interno |
| `brand` | String | Marca del producto (ej. "IKEA") |
| `productName` | String | Nombre legible |
| `collection` | String | Colección o serie |
| `category` | Enum | Categoría ICS (sofa, lamp, etc.) |
| `subcategory` | String | Subcategoría opcional |
| `sku` | String | SKU interno Immersphere (único) |
| `externalSku` | String | SKU original de la marca |
| `productUrl` | String | URL pública del producto |
| `sourceUrl` | String | URL desde donde se importó |
| `modelUrl` | String | URL/ruta del archivo 3D |
| `previewUrl` | String | URL/ruta del thumbnail |
| `format` | Enum | glb, gltf, fbx, obj, usdz |
| `fileSizeMb` | Float | Tamaño en MB |
| `polygonCount` | Int | Número de polígonos |
| `textureCount` | Int | Número de texturas |
| `dimensions` | JSON | {width, height, depth, unit} |
| `color` | String | Color principal |
| `material` | String | Material principal |
| `styleTags` | String[] | Tags de estilo |
| `roomTags` | String[] | Tags de estancia |
| `useCases` | String[] | Casos de uso |
| `licenseType` | Enum | Tipo de licencia |
| `commercialUseAllowed` | Boolean | ¿Uso comercial? |
| `redistributionAllowed` | Boolean | ¿Redistribución? |
| `resaleAllowed` | Boolean | ¿Reventa? |
| `brandUsageAllowed` | Boolean | ¿Uso de marca? |
| `attributionRequired` | Boolean | ¿Atribución? |
| `permissionDocumentRef` | String | Referencia al contrato |
| `permissionScope` | String | Alcance geográfico |
| `capturedAt` | DateTime | Fecha de importación |
| `optimizedAt` | DateTime | Fecha de optimización |
| `qaStatus` | Enum | pending, in-review, approved, rejected, deprecated |
| `qaNotes` | String | Notas de QA |
| `notes` | String | Notas generales |

**Relaciones:**
- Pertenece a `BrandPartner` (muchos Assets ↔ una Brand)
- Tiene muchos `AssetVariant` (color, material, tamaño)
- Tiene muchos `AssetUsage` (dónde se usó)
- Pertenece a muchos `DemoScene` (many-to-many)
- Pertenece a muchos `Space` en futura integración SaaS (via `SpaceAsset`)

---

### 2. BrandPartner

**Objetivo:** Marca con la que Immersphere tiene acuerdo de uso de assets.

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `name` | String | Nombre de la marca (único) |
| `slug` | String | Slug URL (único) |
| `website` | String | Web oficial |
| `contactEmail` | String | Email de contacto |
| `commercialUseAllowed` | Boolean | Permiso global comercial |
| `redistributionAllowed` | Boolean | Permiso global redistribución |
| `resaleAllowed` | Boolean | Permiso global reventa |
| `contractUrl` | String | URL al contrato firmado |
| `contractSignedAt` | DateTime | Fecha de firma |
| `contractExpiresAt` | DateTime | Fecha de expiración |
| `status` | Enum | pending, active, suspended, expired |
| `notes` | String | Notas |

**Relaciones:**
- Tiene muchos `Asset`
- Tiene muchos `PermissionDocument`

---

### 3. PermissionDocument

**Objetivo:** Documento de autorización firmado por la marca.

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `brandPartnerId` | UUID | Marca asociada |
| `documentType` | Enum | contract, email, addendum, renewal |
| `fileUrl` | String | URL al PDF |
| `signedBy` | String | Quién firmó |
| `signedAt` | DateTime | Fecha de firma |
| `expiresAt` | DateTime | Fecha de expiración |
| `scope` | String | global, europe, spain, etc. |
| `notes` | String | Notas |

**Relaciones:**
- Pertenece a `BrandPartner`
- Referenciado por muchos `Asset` (via `permissionDocumentRef`)

---

### 4. AssetVariant

**Objetivo:** Variante de un producto (color, material, tamaño diferente).

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `assetId` | UUID | Asset padre |
| `variantName` | String | "Dark Grey", "Oak Veneer" |
| `color` | String | Color de la variante |
| `material` | String | Material de la variante |
| `modelUrl` | String | Archivo 3D de esta variante |
| `previewUrl` | String | Preview de esta variante |
| `sku` | String | SKU de la variante |

**Relaciones:**
- Pertenece a `Asset`

---

### 5. AssetUsage

**Objetivo:** Registro de dónde se usó un asset (auditoría y trazabilidad).

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `assetId` | UUID | Asset usado |
| `projectId` | String | ID del proyecto/propiedad |
| `projectName` | String | Nombre del proyecto |
| `usageType` | Enum | render, tour, staging, dossier |
| `usedAt` | DateTime | Fecha de uso |
| `usedBy` | String | Quién lo usó |
| `notes` | String | Notas |

**Relaciones:**
- Pertenece a `Asset`

---

### 6. DemoScene

**Objetivo:** Escena de demo comercial (ej. "Piso vacío → amueblado").

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `name` | String | Nombre de la escena |
| `description` | String | Descripción |
| `roomType` | Enum | living-room, bedroom, etc. |
| `assets` | JSON | Array de {assetId, position, rotation, scale} |
| `createdAt` | DateTime | Fecha de creación |
| `status` | Enum | draft, ready, archived |

**Relaciones:**
- Tiene muchos `Asset` (many-to-many)

---

### 7. QAReview

**Objetivo:** Revisión de calidad de un asset.

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `assetId` | UUID | Asset revisado |
| `reviewer` | String | Quién revisó |
| `reviewedAt` | DateTime | Fecha |
| `status` | Enum | approved, rejected, pending |
| `checksPassed` | Int | Cuántos checks pasaron |
| `checksFailed` | Int | Cuántos fallaron |
| `notes` | String | Notas detalladas |

**Relaciones:**
- Pertenece a `Asset`

---

### 8. ImportBatch

**Objetivo:** Lote de importación (batch de assets).

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `brandPartnerId` | UUID | Marca importada |
| `sourceType` | Enum | api, manual, batch-script |
| `startedAt` | DateTime | Inicio |
| `completedAt` | DateTime | Fin |
| `totalAssets` | Int | Total intentados |
| `successfulAssets` | Int | Exitosos |
| `failedAssets` | Int | Fallidos |
| `status` | Enum | running, completed, failed |
| `logUrl` | String | URL al log |

**Relaciones:**
- Tiene muchos `ImportLog`

---

### 9. ImportLog

**Objetivo:** Log individual de cada asset importado en un batch.

**Campos principales:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador |
| `importBatchId` | UUID | Batch padre |
| `assetId` | UUID | Asset resultante (si exitoso) |
| `sourceUrl` | String | URL origen |
| `status` | Enum | success, failed, skipped |
| `errorMessage` | String | Mensaje de error |
| `processedAt` | DateTime | Fecha de procesamiento |

**Relaciones:**
- Pertenece a `ImportBatch`

---

## Futura integración SaaS

Cuando se integre con Immersphere Pro SaaS, se añaden estas entidades al schema Prisma existente:

### AssetCatalog
Extiende `Asset` con relaciones al SaaS.

### SpaceAsset (many-to-many)
Relaciona `Space` con `AssetCatalog` con posicionamiento 3D.

| Campo | Tipo | Descripción |
|---|---|---|
| `spaceId` | UUID | Espacio de la propiedad |
| `assetId` | UUID | Asset |
| `position` | JSON | {x, y, z} |
| `rotation` | JSON | {x, y, z} |
| `scale` | JSON | {x, y, z} |
| `addedBy` | String | Quién lo añadió |
| `addedAt` | DateTime | Fecha |

### ProductHotspot
Nuevo tipo de hotspot en el viewer SaaS.

| Campo | Tipo | Descripción |
|---|---|---|
| `assetId` | UUID | Asset asociado |
| `type` | String | "PRODUCT" |
| `label` | String | Nombre del producto |
| `body` | String | Descripción + precio |
| `ctaLabel` | String | "Buy now", "View details" |
| `productUrl` | String | Link al producto |

---

## Relación completa (diagrama texto)

```
BrandPartner 1───* Asset
BrandPartner 1───* PermissionDocument
Asset 1───* AssetVariant
Asset 1───* AssetUsage
Asset 1───* QAReview
Asset *───* DemoScene
ImportBatch 1───* ImportLog
ImportBatch ────> BrandPartner

(Futuro SaaS)
AssetCatalog *───* Space (via SpaceAsset)
AssetCatalog 1───* ProductHotspot
Space 1───* ProductHotspot
```
