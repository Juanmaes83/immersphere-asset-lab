# Immersphere Asset Lab

## Decor Asset Lab · Laboratorio Interno Premium de Assets 3D

**Ubicación:** `C:\Users\temp123\repos\immersphere-asset-lab`  
**Producto:** Immersphere Asset Lab (módulo comercial: Decor Asset Lab)  
**Estado:** Inicialización local · Fase 0  
**Fecha:** 2026-06-07

---

## ¿Qué es?

**Immersphere Asset Lab** es un laboratorio interno premium para gestionar assets 3D autorizados de marcas de mobiliario, iluminación, decoración, cocinas, baños, textiles y materiales.

Es la cuarta pata del ecosistema Immersphere:
- Immersphere Pro SaaS (tours, propiedades, visor)
- Immersphere Pro Inmobiliarias (web comercial, renders, campañas)
- Immersphere Pro CRM Leads (captación, pipeline, propuestas)
- **Immersphere Asset Lab** ← **tú estás aquí**

---

## Alcance actual (Fase 0)

- **Servicio interno premium.** No es SaaS todavía.
- **No es marketplace todavía.**
- **No está integrado** en Immersphere Pro SaaS todavía.
- **No está integrado** en CRM todavía.
- **No incluye assets reales** en el repositorio.
- Los archivos pesados (GLB, texturas) deben ir fuera de Git o en storage autorizado.

---

## Flujo de trabajo

```
Asset autorizado por marca
    ↓
Registro de metadata → manifest.json
    ↓
Generación de preview (thumbnail)
    ↓
Validación GLB + QA visual
    ↓
Visor local → demo comercial
    ↓
Uso en cliente (renders, tours, staging)
    ↓
Futura integración SaaS + CRM + marketplace
```

---

## Estructura del repositorio

```
immersphere-asset-lab/
├── README.md                 ← Este archivo
├── package.json              ← Scripts y metadatos
├── .gitignore                ← Exclusión de assets pesados
├── assets/                   ← Carpeta de assets 3D
│   ├── ikea/                 ← Assets por marca
│   │   ├── living-room/
│   │   ├── bedroom/
│   │   ├── lighting/
│   │   ├── tables/
│   │   ├── chairs/
│   │   └── decor/
│   └── _placeholder/         ← Placeholders GLB vacíos
├── previews/                 ← Thumbnails WebP/PNG
│   ├── ikea/
│   └── _placeholder/
├── manifest/                 ← Schemas y manifests
│   ├── manifest.schema.json  ← Schema de validación
│   └── ikea-sample.manifest.json ← Manifest demo (20 items)
├── viewer/                   ← Visor local premium
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── docs/                     ← Documentación estratégica
│   ├── strategy.md
│   ├── taxonomy.md
│   ├── licensing.md
│   ├── workflow.md
│   └── qa-checklist.md
├── scripts/                  ← Scripts de utilidad
│   └── validate-manifest.js
└── examples/                 ← Ejemplos comerciales
    ├── empty-apartment-demo.md
    └── product-list-sample.md
```

---

## Scripts disponibles

```bash
# Validar manifest
npm run check

# Ingestar asset real desde metadata JSON
npm run ingest -- --metadata path/to/asset.json

# Preflight de seguridad antes de commit
npm run preflight

# Iniciar visor local (servidor estático)
npm start
```

---

## Manual Asset Ingestion

Este repositorio **no guarda archivos GLB en Git**. Los GLB viven localmente (o en storage autorizado futuro).

Para añadir un asset real al catálogo:

1. **Colocar el GLB** en `assets/{brand}/{category}/` (ej. `assets/ikea/chairs/`).
2. **Crear metadata JSON** copiando `templates/asset-metadata.template.json`.
3. **Ejecutar ingesta:**
   ```bash
   npm run ingest -- --metadata path/to/tu-asset.json
   ```
4. **Validar:**
   ```bash
   npm run check
   npm run preflight
   ```
5. **Probar viewer:**
   ```bash
   npm start
   # Abrir http://localhost:3456/viewer/
   ```
6. **Commitear solo metadata/código/documentación.** El GLB nunca entra en Git.

Documentación completa: [`docs/manual-ingestion.md`](docs/manual-ingestion.md)

---

## Asset Previews

Las cards del viewer pueden mostrar **previews reales** (miniaturas) de los assets 3D.

- Si existe una preview real ligera (PNG/JPG/WebP ≤ 512 KB), la card la muestra.
- Si no existe, la card muestra un **placeholder** con el nombre de la categoría.
- Los assets reales sin preview muestran el badge **"Preview pending"**.
- Los assets reales con preview muestran el badge **"Real Preview"**.

### Generar una preview manualmente

1. Abre el viewer local: `npm start` → http://localhost:3456/viewer/
2. Busca un asset con GLB real (badge "Real Model").
3. Abre la ficha, orienta el modelo en 3D.
4. Pulsa **"📸 Generar preview"** — se descarga una imagen PNG.
5. Mueve la imagen a `previews/{brand}/{category}/`.
6. Actualiza `previewPath` en el manifest.
7. Ejecuta `npm run check` y `npm run preflight`.
8. Commitea la preview ligera + manifest. **NO commitees el GLB.**

### Generar previews automáticamente

Si tienes Playwright y Chromium instalados:

```bash
npm run generate-previews
```

Esto genera previews PNG para todos los assets reales que aún usen placeholder, actualiza el manifest, y deja las imágenes listas para commitear.

Opciones:
```bash
npm run generate-previews -- --asset ikea-vittskar-armchair-outdoor-dark-grey-20575167
npm run generate-previews -- --force
npm run generate-previews -- --dry-run
```

Documentación completa: [`docs/preview-generation.md`](docs/preview-generation.md)

---

## Colección: Terrace Mediterranean Premium

Primera colección comercial del **Decor Asset Lab**: un set de 10 assets IKEA para construir una terraza mediterránea premium aspiracional.

**Objetivo:** preparar assets 3D autorizados para la demo comercial *"Piso vacío → Piso amueblado con catálogo IKEA"*.

**Cobertura actual:** ✅ 10 / 10 assets reales completados
- ✅ VITTSKÄR — silla exterior principal
- ✅ VÄSMAN — sillón exterior secundario
- ✅ NÄMMARÖ — mesa de jardín
- ✅ HÅKANSKÄR — mesa de centro exterior
- ✅ NÄMMARÖ — sofá de 2 plazas exterior
- ✅ SOLVINDEN — lámpara solar exterior
- ✅ MORUM — alfombra interior/exterior
- ✅ STJÄRNANIS — jardinera exterior
- ✅ HAVSTEN — cojín exterior
- ✅ SJÄLSLIGT — adorno juego de 3

**Documentación:**
- [`docs/collections/terrace-mediterranean-premium.md`](docs/collections/terrace-mediterranean-premium.md) — Visión, narrativa y set completo.
- [`docs/collections/terrace-download-checklist.md`](docs/collections/terrace-download-checklist.md) — Checklist de descarga manual desde IKEA.
- [`examples/terrace-mediterranean-premium-intake/`](examples/terrace-mediterranean-premium-intake/) — Plantillas de metadata listas para rellenar.

---

## Commercial demo: Terrace Mediterranean Premium

Demo comercial interactiva que muestra cómo un espacio vacío se transforma en una terraza mediterránea premium amueblada con productos reales de catálogo autorizado.

**URL local:**
```bash
npm run start
# → http://localhost:3456/demos/terrace-mediterranean-premium/
```

**Qué incluye la demo:**
- Landing premium con hero, before/after conceptual, features y CTAs.
- Grid de 10 assets reales con previews, badges y botón "Ver en 3D".
- Modal 3D interactivo con `model-viewer` por cada producto.
- Tabla comercial con función en escena, marca, estado y uso recomendado.
- Paquetes de servicio sugeridos (Basic, Premium, Developer, Brand).
- CTA final para solicitar staging o integrar marca.

**Documentación comercial:**
- [`docs/commercial/terrace-mediterranean-premium-dossier.md`](docs/commercial/terrace-mediterranean-premium-dossier.md) — Dossier de venta completo.
- [`docs/commercial/terrace-product-list.md`](docs/commercial/terrace-product-list.md) — Listado técnico-comercial de los 10 productos.

---

## Sales Kit

Material comercial listo para enviar a clientes, presentar en reuniones o imprimir.

**One-pager comercial (imprimible / exportable a PDF):**
- [`sales/decor-asset-lab-one-pager.html`](sales/decor-asset-lab-one-pager.html) — Versión HTML premium, A4 vertical.
- [`sales/decor-asset-lab-one-pager.css`](sales/decor-asset-lab-one-pager.css) — Estilos del one-pager.
- [`docs/commercial/decor-asset-lab-one-pager.md`](docs/commercial/decor-asset-lab-one-pager.md) — Versión texto para PDF/email/presentación.

**Guiones de venta:**
- [`docs/commercial/decor-asset-lab-pitch-script.md`](docs/commercial/decor-asset-lab-pitch-script.md) — Pitches de 15s, 30s, 60s por segmento.

**Argumentario comercial:**
- [`docs/commercial/decor-asset-lab-objections-and-answers.md`](docs/commercial/decor-asset-lab-objections-and-answers.md) — Objeciones y respuestas por tipo de cliente.

**Checklist de capturas:**
- [`docs/commercial/decor-asset-lab-capture-checklist.md`](docs/commercial/decor-asset-lab-capture-checklist.md) — Qué pantallazos y clips grabar para vender la demo.

---

## Export Sales Kit

Genera automáticamente material comercial listo para enviar a clientes (PDF + capturas PNG).

```bash
npm run export-sales-kit
# alias:
npm run export
```

**Salida:** `exports/sales-kit/decor-asset-lab/`

| Archivo | Uso |
|---|---|
| `decor-asset-lab-one-pager.pdf` | Documento adjunto en email, handout impreso |
| `01-demo-hero.png` | Portada de email, LinkedIn, web |
| `02-before-after.png` | Presentación, narrativa de transformación |
| `03-product-grid.png` | Prueba de catálogo real |
| `04-product-modal-3d.png` | Diferenciador: interactividad 3D |
| `05-commercial-packages.png` | Cierre comercial con precios |
| `06-final-cta.png` | Última diapositiva, cierre de vídeo |
| `07-one-pager-preview.png` | Thumbnail de descarga |

**Workflow completo:** [`docs/commercial/sales-kit-export-workflow.md`](docs/commercial/sales-kit-export-workflow.md)

> Nota: `exports/` está en `.gitignore`. Los archivos generados son outputs locales y no deben commitearse.

---

## Scene Composer MVP

Herramienta estatica 2.5D para crear propuestas visuales rapidas con productos reales del catalogo.

**URL local:**
```bash
npm run start
# -> http://localhost:3456/scenes/composer/
```

**URL publica esperada:**
```text
https://immersphere-asset-lab.vercel.app/scenes/composer/
```

**Que permite hacer:**
- Subir una imagen de una estancia vacia.
- Colocar previews de productos reales del catalogo.
- Mover, escalar, rotar, eliminar y ordenar productos.
- Guardar la ultima escena en el navegador.
- Exportar composicion PNG cuando el navegador lo permite.
- Exportar proyecto JSON.
- Descargar listado de productos usados.

**Que no hace todavia:**
- No carga GLB dentro de la escena.
- No calibra camara ni escala real.
- No genera sombras, oclusion ni depth map.
- No sustituye una escena 3D calibrada.
- No usa backend ni crea marketplace.

**Relacion con el catalogo multiestancia:**
El composer consume el manifest actual y queda preparado para crecer con `collections/collections.json`, donde cada nueva estancia se escala en bloques controlados de 10 assets reales.

Documentacion:
- [`docs/collections/multiroom-catalog-strategy.md`](docs/collections/multiroom-catalog-strategy.md)
- [`docs/scenes/scene-composer-roadmap.md`](docs/scenes/scene-composer-roadmap.md)

---

## Reglas del repositorio

1. **NO subir assets reales a Git.** Usar `.gitignore` para GLB, GLTF, FBX, OBJ, USDZ, BLEND, ZIP.
2. **NO subir previews pesados.** Thumbnails máximo 512×512 px.
3. **NO subir credenciales.** Usar `.env` local (ignorado por Git).
4. **NO hacer push sin autorización.** Este repo es local hasta nueva orden.
5. **Todo asset real requiere registro de licencia** en el manifest antes de uso.

---

## Contacto

**Immersphere Studio · Rubik SOTA**  
*Laboratorio interno · Uso autorizado*
