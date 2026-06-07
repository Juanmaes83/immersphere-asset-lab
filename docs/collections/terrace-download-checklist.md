# Checklist de Descarga · Terraza Mediterránea Premium

## ✅ ESTADO: COMPLETO

Todos los 10 assets de la colección **Terraza Mediterránea Premium** han sido descargados e ingeridos.

---

## Instrucciones generales

Esta guía documenta el proceso usado para descargar manualmente los 8 assets IKEA restantes de la colección.

**Reglas de oro:**

- Solo descargar con permiso de uso comercial documentado.
- Usar Tampermonkey/userscript autorizado para extracción de GLB.
- Nunca subir el GLB a GitHub.
- Siempre pasar el GLB por el pipeline de ingesta (`npm run ingest`, `npm run check`, `npm run preflight`).

---

## Tabla de descarga

| # | Pieza | Asset real | Categoría | Carpeta destino | Estado | Notas |
|---|---|---|---|---|---|---|
| 1 | Silla exterior principal | VITTSKÄR | `chair` | `assets/ikea/chairs/` | ✅ | Ingerido en fase anterior |
| 2 | Sillón exterior secundario | VÄSMAN | `chair` | `assets/ikea/chairs/` | ✅ | Ingerido en fase anterior |
| 3 | Mesa exterior principal | NÄMMARÖ mesa jardín | `table` | `assets/ikea/tables/` | ✅ | Ingerido |
| 4 | Mesa auxiliar | HÅKANSKÄR mesa centro | `side-table` | `assets/ikea/side-tables/` | ✅ | Ingerido |
| 5 | Sofá / lounge exterior | NÄMMARÖ sofá 2 plazas | `lounge` | `assets/ikea/lounge/` | ✅ | Ingerido |
| 6 | Lámpara exterior | SOLVINDEN lámpara solar | `lighting` | `assets/ikea/lighting/` | ✅ | Ingerido |
| 7 | Alfombra exterior | MORUM alfombra | `rug` | `assets/ikea/rugs/` | ✅ | Ingerido |
| 8 | Macetero / jardinera | STJÄRNANIS jardinera | `planter` | `assets/ikea/planters/` | ✅ | Ingerido |
| 9 | Cojín / textil exterior | HAVSTEN cojín | `textile` | `assets/ikea/textile/` | ✅ | Ingerido |
| 10 | Decoración / bandeja / accesorio | SJÄLSLIGT adorno juego 3 | `decor` | `assets/ikea/decor/` | ✅ | Ingerido |

---

## Flujo de descarga paso a paso

### Paso 1 — Buscar en IKEA

1. Ve a https://www.ikea.com/es/es/
2. Busca el producto sugerido en la tabla.
3. Abre la ficha del producto.
4. Verifica que tenga botón **"Ver en 3D"** o modelo 3D interactivo.

### Paso 2 — Descargar GLB

1. Activa el script/userscript autorizado en Tampermonkey.
2. En la ficha del producto, busca la opción de descarga del modelo GLB.
3. Guarda el archivo en:
   ```
   C:\Users\temp123\Downloads\
   ```
4. **No muevas el GLB todavía.**

### Paso 3 — Renombrar con naming limpio

Convierte el nombre descargado al patrón:

```
{producto-ikea}-{categoria}-{color-variante}.glb
```

Ejemplo:
```
ÄPPLARÖ mesa exterior - marrón teñido.glb
↓
applaro-table-outdoor-brown-stained.glb
```

### Paso 4 — Mover al repo

```bash
mv "C:\Users\temp123\Downloads\applaro-table-outdoor-brown-stained.glb" \
   "C:\Users\temp123\repos\immersphere-asset-lab\assets\ikea\tables\"
```

### Paso 5 — Rellenar metadata

1. Abre la plantilla correspondiente en:
   ```
   examples/terrace-mediterranean-premium-intake/pending-*.metadata.json
   ```
2. Reemplaza todos los valores `PENDING` por datos reales.
3. Guarda como archivo nuevo con el `id` del asset.

### Paso 6 — Ingestar

```bash
cd C:\Users\temp123\repos\immersphere-asset-lab
npm run ingest -- --metadata examples/terrace-mediterranean-premium-intake/tu-asset.metadata.json
```

### Paso 7 — Generar preview

```bash
npm run generate-previews -- --asset tu-asset-id
```

O regenerar todas:
```bash
npm run generate-previews
```

### Paso 8 — Validar

```bash
npm run check
npm run preflight
```

### Paso 9 — Commitear

```bash
git add manifest/ikea-sample.manifest.json
git add previews/ikea/tables/*.png   # o la carpeta correspondiente
# NO git add assets/**/*.glb

git commit -m "ingest: add IKEA {producto} to terrace collection"
```

---

## Criterios de aceptación antes de ingesta

- [ ] El GLB abre correctamente en el viewer local.
- [ ] El producto encaja visualmente con VITTSKÄR y VÄSMAN.
- [ ] El color/material no choca con la paleta mediterránea.
- [ ] Las dimensiones del producto coinciden con el catálogo IKEA.
- [ ] Se tiene permiso o licencia documentada para uso comercial.
- [ ] El SKU IKEA está correctamente registrado.

---

## Qué NO hacer

| Prohibición | Razón |
|---|---|
| Descargar sin permiso | Riesgo legal para Immersphere y clientes |
| Usar script de scraping no autorizado | Violación de ToS de IKEA |
| Subir GLB a GitHub | Corrompe el repo y filtra assets |
| Ingresar metadata incompleta | Rompe `npm run check` |
| Añadir assets que no encajen visualmente | Rompe la coherencia de la colección |
