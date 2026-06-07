# Generación de Previews · Immersphere Asset Lab

## Visión

Las **cards** del viewer muestran una miniatura (preview) de cada asset. Los placeholders funcionan, pero una preview real mejora la navegación y el impacto visual del catálogo.

Este documento describe el flujo manual controlado para generar, guardar y usar previews reales.

---

## Regla de oro

- **Las previews reales sí pueden commitearse** si son ligeras (PNG/JPG/WebP ≤ 512 KB).
- **Los GLB nunca se commitean.**
- **No uses imágenes enormes.** Máximo 512×512 px, ideal 256×256 px.

---

## Flujo paso a paso

### 1. Abrir el viewer local

```bash
npm start
```

Abre: http://localhost:3456/viewer/

### 2. Buscar el asset real

Usa el buscador o filtros para encontrar el asset con GLB real (badge **"Real Model"**).

### 3. Abrir ficha del asset

Haz clic en la card para abrir el modal. Verás el modelo 3D cargado en `<model-viewer>`.

### 4. Orientar el modelo

- **Rotar:** click-drag.
- **Zoom:** scroll.
- **Posiciona** el modelo en el ángulo que mejor lo represente (generalmente ¾ frontal).

### 5. Generar preview

Pulsa el botón **"📸 Generar preview"** en la sección "Preview" del modal.

El navegador descargará automáticamente una imagen PNG, por ejemplo:
```
vittskar-armchair-outdoor-dark-grey-20575167-preview.png
```

> Si el botón dice "Canvas not ready yet", espera unos segundos a que el modelo termine de cargar y vuelve a pulsar.

### 6. Guardar la imagen en la carpeta correcta

Mueve o copia la imagen descargada desde `Downloads/` a:

```
previews/ikea/{category}/
```

Ejemplo para VITTSKÄR (categoría `chair`):
```bash
mv ~/Downloads/vittskar-armchair-outdoor-dark-grey-20575167-preview.png \
   previews/ikea/chairs/
```

### 7. Renombrar con naming limpio (si es necesario)

El archivo descargado ya tiene un nombre limpio, pero verifica que siga el patrón:
```
{asset-id}-preview.png
```

### 8. Actualizar el manifest

Edita el `previewPath` del asset en `manifest/ikea-sample.manifest.json`:

```json
{
  "id": "ikea-vittskar-armchair-outdoor-dark-grey-20575167",
  ...
  "previewPath": "previews/ikea/chairs/vittskar-armchair-outdoor-dark-grey-20575167-preview.png",
  ...
}
```

### 9. Validar

```bash
npm run check
npm run preflight
```

Deben pasar sin errores. El preflight mostrará un **warning** si un asset real sigue usando placeholder preview, pero no bloquea el commit.

### 10. Probar en viewer

Recarga http://localhost:3456/viewer/

- La card del asset debe mostrar la preview real.
- El badge debe cambiar de **"Preview pending"** a **"Real Preview"**.
- Si la imagen no se ve, verifica que la ruta en `previewPath` sea correcta y que el archivo exista.

### 11. Commit

```bash
git add manifest/ikea-sample.manifest.json
# Si creaste previews nuevas y son ligeras:
git add previews/ikea/chairs/*.png
# NO hagas:
# git add assets/**/*.glb

git commit -m "feat(previews): add real preview for VITTSKÄR"
```

---

## Automated preview generation

Si prefieres no generar previews una a una manualmente, puedes usar el generador automático basado en **Playwright**.

### Requisitos

- Node.js ≥ 18
- Playwright instalado como devDependency (ya en `package.json`)
- Navegador Chromium instalado para Playwright:
  ```bash
  npx playwright install chromium
  ```

### Generar todas las previews automáticamente

```bash
npm run generate-previews
```

Este comando:

1. Lee el manifest.
2. Detecta assets con `hasRealModel=true` y `isPlaceholder=false`.
3. Filtra los que usen preview placeholder.
4. Lanza un servidor local y un navegador headless.
5. Renderiza cada GLB en `scripts/preview-renderer.html`.
6. Aplica una cámara consistente (¾ frontal, iluminación neutral).
7. Captura un screenshot PNG de 1024×1024 px.
8. Guarda la imagen en `previews/{brand}/{category}/{id}-preview.png`.
9. Actualiza `previewPath` en el manifest.
10. Imprime resumen con éxitos, saltos y errores.

### Opciones

| Opción | Descripción |
|---|---|
| `--asset <id>` | Genera preview solo para un asset específico. |
| `--force` | Regenera previews aunque ya existan. |
| `--dry-run` | Muestra qué haría sin escribir archivos. |

Ejemplos:

```bash
# Solo VITTSKÄR
npm run generate-previews -- --asset ikea-vittskar-armchair-outdoor-dark-grey-20575167

# Forzar regeneración
npm run generate-previews -- --force

# Simular sin escribir
npm run generate-previews -- --dry-run
```

### Después de generar

```bash
npm run check
npm run preflight
npm start
# Abrir http://localhost:3456/viewer/ y verificar cards
```

### Commitear previews generadas

```bash
git add manifest/ikea-sample.manifest.json
git add previews/ikea/chairs/*.png
# NO hagas:
# git add assets/**/*.glb

git commit -m "feat(previews): add automated previews for real assets"
```

> **Las previews PNG ligeras sí pueden commitearse.** Los GLB nunca.

### Si Playwright/Chromium no está instalado

Si ves un error tipo `Could not launch browser`:

```bash
npm install
npx playwright install chromium
```

Si la red no permite descargar Chromium, usa el flujo manual del botón "Generar preview" en el viewer.

---

## Estructura de carpetas de previews

```
previews/
├── ikea/
│   ├── chairs/
│   │   ├── vittskar-armchair-outdoor-dark-grey-20575167-preview.png
│   │   └── vasman-armchair-outdoor-brown-preview.png
│   ├── sofas/
│   ├── lamps/
│   └── ...
└── _placeholder/
    └── demo-preview.svg
```

---

## Especificaciones técnicas

| Propiedad | Recomendado | Máximo |
|---|---|---|
| Formato | PNG, WebP | PNG, JPG, WebP |
| Dimensiones | 256×256 px | 512×512 px |
| Peso | < 100 KB | 512 KB |
| Fondo | Transparente o neutral | Sin distracciones |
| Nombre | `{id}-preview.{ext}` | Minúsculas, guiones |

---

## Fallback del viewer

El viewer maneja automáticamente los casos:

- **Preview existe:** la card muestra la imagen con `object-fit: cover`.
- **Preview no existe o falla carga:** la card muestra el placeholder SVG con el nombre de categoría.
- **Asset real sin preview:** badge **"Preview pending"**.
- **Asset real con preview:** badge **"Real Preview"**.
- **Placeholder:** sin badge de preview.

---

## ⚠️ NO HACER

| Prohibición | Razón |
|---|---|
| **Subir GLB junto con la preview** | El GLB nunca va en Git. |
| **Usar imágenes de > 1 MB** | Saturan el repo y ralentizan el viewer. |
| **No revisar visualmente la preview** | Puede salir cortada, oscura, o con ángulo malo. |
| **Dejar previewPath apuntando a imagen inexistente** | El viewer mostrará placeholder, pero el manifest estará desactualizado. |
| **Usar screenshots del escritorio en lugar de captura del viewer** | No garantizan consistencia de tamaño, fondo y calidad. |
| **Capturar con el modelo en movimiento (auto-rotate)** | La imagen puede salir borrosa. Detén la rotación antes de capturar. |

---

## Próximas mejoras (futuro)

- **Generación automática headless:** script Node con Puppeteer/Playwright que abre cada asset, posiciona cámara, y captura sin intervención manual.
- **Batch preview:** generar todas las previews de una categoría en un solo comando.
- **Optimización automática:** pasar cada PNG por Sharp para reducir a 256×256 WebP.
- **Cloudinary:** subir previews a CDN y servir transformaciones on-the-fly.
