# Checklist de Descarga · Terraza Mediterránea Premium

## Instrucciones generales

Esta guía sirve para descargar manualmente los 8 assets IKEA restantes de la colección **Terraza Mediterránea Premium**.

**Reglas de oro:**

- Solo descargar con permiso de uso comercial documentado.
- Usar Tampermonkey/userscript autorizado para extracción de GLB.
- Nunca subir el GLB a GitHub.
- Siempre pasar el GLB por el pipeline de ingesta (`npm run ingest`, `npm run check`, `npm run preflight`).

---

## Tabla de descarga

| # | Pieza | Búsqueda IKEA sugerida | Categoría | Carpeta destino | Metadata template | Criterio visual | Prioridad | Estado |
|---|---|---|---|---|---|---|---|---|
| 3 | Mesa exterior principal | "ÄPPLARÖ mesa exterior" / "BONDHOLMEN mesa" | `table` | `assets/ikea/tables/` | `pending-main-outdoor-table.metadata.json` | Madera acacia o gris oscuro, 4-6 comensales, superficie limpia | Alta | ⏳ |
| 4 | Mesa auxiliar | "ÄPPLARÖ mesa auxiliar" / "KROKHOLMEN mesa" | `side-table` | `assets/ikea/side-tables/` | `pending-side-table.metadata.json` | Pequeña, estable, combinable con sillas | Media | ⏳ |
| 5 | Sofá / lounge exterior | "ÄPPLARÖ sofá exterior" / "JUTHOLMEN sofá" | `lounge` | `assets/ikea/lounge/` | `pending-outdoor-lounge.metadata.json` | 2-3 plazas, cojines gruesos, proporciones bajas | Alta | ⏳ |
| 6 | Lámpara exterior | "SOLVINDEN lámpara solar" / "LEDBERG guirnalda" | `lighting` | `assets/ikea/lighting/` | `pending-ambient-lamp.metadata.json` | Luz cálida, diseño simple, resistente a exterior | Media | ⏳ |
| 7 | Alfombra exterior | "MORUM alfombra exterior" / "HÖLLVIKEN alfombra" | `rug` | `assets/ikea/rugs/` | `pending-outdoor-rug.metadata.json` | Textura plana, color natural o terracota, bajo perfil | Media | ⏳ |
| 8 | Macetero / jardinera | "GRÄSLÖK maceta" / "SOCKER macetero" | `planter` | `assets/ikea/planters/` | `pending-planter.metadata.json` | Forma simple, material terracota/metal/negro, con planta | Media | ⏳ |
| 9 | Cojín / textil exterior | "Kuddarna cojín" / "Järpön cojín" | `textile` | `assets/ikea/textile/` | `pending-outdoor-textile.metadata.json` | Cojín grueso, color tierra o terracota, con costuras | Baja | ⏳ |
| 10 | Decoración / bandeja / accesorio | "ROMANTISK bandeja" / "SOMMARVIBBAR" | `decor` | `assets/ikea/decor/` | `pending-decor-accessory.metadata.json` | Pequeño detalle: bandeja, vela, jarrón. No dominante | Baja | ⏳ |

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
