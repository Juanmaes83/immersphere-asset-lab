# Arquitectura · Immersphere Asset Lab

## Visión

Un sistema modular de gestión de assets 3D que evoluciona desde laboratorio interno hasta motor de catálogo comercial integrado en el ecosistema Immersphere.

---

## Diagrama de arquitectura (texto)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZED BRAND SOURCES                         │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌─────────────────────────┐ │
│  │ IKEA    │  │ Wayfair  │  │ Flos      │  │ Manual Upload (Dropzone)│ │
│  │ Business│  │ API      │  │ Feed      │  │                         │ │
│  │ Sales   │  │          │  │           │  │                         │ │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  └───────────┬─────────────┘ │
│       │            │              │                    │               │
│       │   contract │   API key    │   webhook          │   drag+drop   │
│       └────────────┴──────────────┴────────────────────┘               │
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         IMPORT METHODS LAYER                            │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Manual       │  │ Batch       │  │ API / Feed   │  │ Manual       │ │
│  │ Capture      │  │ Importer    │  │ Authorized   │  │ Upload       │ │
│  │ (browser     │  │ (script     │  │ (REST/GQL    │  │ (GLB + JSON  │ │
│  │  extension)  │  │  autorizado)│  │  connector)  │  │  drag+drop)  │ │
│  └──────┬───────┘  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                │                 │         │
│         │  one-by-one     │  category      │  poll / push    │  one-by │
│         │  with metadata  │  with dedup    │  with mapping   │  one    │
│         └─────────────────┴────────────────┴─────────────────┘         │
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MANIFEST DRAFT LAYER                            │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  manifest-draft.json                                                ││
│  │  • brand, productName, sku, externalSku                             ││
│  │  • category, subcategory, dimensions, color, material               ││
│  │  • modelUrl, previewUrl, sourceUrl, productUrl                      ││
│  │  • variant, styleTags, roomTags, useCases                           ││
│  │  • capturedAt, importerVersion, batchId                             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LICENSE CHECK LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ permission   │  │ BrandPartner │  │ Asset-level  │                  │
│  │ document     │  │ registry     │  │ license      │                  │
│  │ uploaded?    │  │ active?      │  │ fields       │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│         │                 │                 │                          │
│         │  if missing     │  if expired     │  if false                │
│         └─────────────────┴─────────────────┘                          │
│                    │                                                    │
│                    ▼                                                    │
│           BLOCK → qaStatus: rejected                                    │
│                    + qaNotes: license_missing                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼ (license OK)
┌─────────────────────────────────────────────────────────────────────────┐
│                         QA LAYER                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ glTF         │  │ Visual       │  │ Performance  │  │ Metadata     ││
│  │ Validation   │  │ Review       │  │ Budget       │  │ Completeness ││
│  │ (glTF-       │  │ (3D artist)  │  │ (polygon     │  │ (all fields  ││
│  │  Transform)  │  │              │  │  count, MB)  │  │  filled)     ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│
│         │                 │                 │                 │        │
│         └─────────────────┴─────────────────┴─────────────────┘        │
│                              │                                         │
│                              ▼                                         │
│                    qaStatus: approved / rejected                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼ (approved)
┌─────────────────────────────────────────────────────────────────────────┐
│                         PREVIEW LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Thumbnail generation                                               ││
│  │  • Three.js headless render 512×512                                 ││
│  │  • Cloudinary transform                                             ││
│  │  • Screenshot from model-viewer                                     ││
│  │  Output: previews/{brand}/{sku}.webp                                ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VIEWER LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Local premium viewer                                               ││
│  │  • Grid responsive                                                  ││
│  │  • Filters: category, room, style, license, qaStatus                ││
│  │  • Search full-text                                                 ││
│  │  • Modal detail with license viewer                                 ││
│  │  • Placeholder preview (SVG) until real thumbnail                   ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEMO LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Commercial demos                                                   ││
│  │  • Empty apartment → furnished apartment                            ││
│  │  • Dossier PDF with product list                                    ││
│  │  • Renders with real furniture                                      ││
│  │  • Tour 3D with product hotspots                                    ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              FUTURE: IMMERSPHERE PRO SaaS INTEGRATION                   │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  • AssetCatalog in PostgreSQL                                       ││
│  │  • SpaceAsset many-to-many (Asset ↔ Space)                        ││
│  │  • ProductHotspot in viewer (click → product card → CTA)          ││
│  │  • Drag-and-drop in editor                                        ││
│  │  • Tenant-level asset packs                                       ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              FUTURE: INMOBILIARIAS + CRM INTEGRATION                    │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Inmobiliarias:                                                     ││
│  │  • "Staging Virtual" section on landing                             ││
│  │  • Campaign: "Furnish this apartment with [Brand]"                  ││
│  │                                                                     ││
│  │  CRM Leads:                                                         ││
│  │  • Budget line items with 3D furniture                              ││
│  │  • Pipeline: lead → reform + furniture                              ││
│  │  • Proposal PDF with product SKUs                                   ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Capas principales

| Capa | Estado actual | Tecnología | Responsable |
|---|---|---|---|
| **Authorized Brand Source** | Por negociar | Contrato, API, feed | Juanma / Legal |
| **Import Methods** | Manual (futuro batch) | Browser ext, script, dropzone | Pipeline engineer |
| **Manifest Draft** | ✅ JSON schema + sample | JSON Schema, Node validation | Pipeline engineer |
| **License Check** | ✅ Campos + docs | Boolean flags, PDF refs | Legal / Compliance |
| **QA** | ✅ Checklist + validator | glTF-Transform, visual review | 3D artist / QA |
| **Preview** | Placeholder SVG | Three.js headless (futuro) | Pipeline engineer |
| **Viewer** | ✅ Vanilla JS local | HTML, CSS, JS | Frontend engineer |
| **Demo** | ✅ Briefs escritos | Renders, tours, PDF | Commercial team |
| **SaaS Integration** | Futuro | Prisma, React, Cloudinary | Full-stack engineer |
| **Inmobiliarias + CRM** | Futuro | Static HTML, JS | Full-stack engineer |

---

## Principios arquitectónicos

1. **Legal antes que código.** Cada asset pasa por License Check antes de QA.
2. **Pipeline antes que producto.** El sistema de flujo es más importante que cualquier feature individual.
3. **Manifest como fuente de verdad.** Todo deriva del JSON: viewer, QA, demos, futura BD.
4. **Sin assets reales en Git.** GLB van a storage; Git solo guarda metadata y código.
5. **Modular por capa.** Cada capa puede evolucionar independientemente.
