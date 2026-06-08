# Catalog Filtering

## Objetivo

Los filtros de catalogo permiten navegar el manifest multiestancia sin duplicar datos ni tocar assets. La fuente sigue siendo `manifest/ikea-sample.manifest.json`; las pantallas solo interpretan campos existentes como `collectionId`, `demoScene`, `roomType`, `roomTags`, `category`, `sku`, `brand` y `productName`.

## Superficies

### Viewer

- Muestra todos los assets por defecto, incluidos placeholders.
- Permite filtrar por coleccion, estancia, categoria, estilo, licencia, QA y busqueda.
- Incluye el toggle `Solo modelos reales`, desactivado por defecto.
- Muestra contador `Mostrando X de Y assets`.
- Mantiene cards, modal y `model-viewer`.

### Scene Composer

- Usa solo assets con `hasRealModel === true`.
- Permite filtrar por coleccion, estancia, categoria y busqueda.
- Muestra contador `X productos disponibles`.
- Mantiene upload de estancia, colocacion 2.5D, mover, escalar, rotar, borrar, localStorage y exportaciones.

### Demo Empty Room Staging

- Usa solo assets con `hasRealModel === true`.
- Simplifica la taxonomia en filtros comerciales: sofas, sillones, mesas, muebles TV, lamparas, alfombras y decoracion.
- Permite filtrar por coleccion, tipo de producto y busqueda.
- Muestra contador `X productos reales disponibles`.
- Mantiene estancia de ejemplo, upload, presets y exportaciones.

## Etiquetas amigables

Colecciones:

- `terrace-mediterranean-premium` -> `Terraza Mediterranea Premium`
- `living-room-nordic-premium` -> `Salon Nordico Premium`

Estancias:

- `terrace` -> `Terraza`
- `living-room` -> `Salon`

Categorias:

- `tv-unit` -> `Mueble TV`
- `coffee-table` -> `Mesa centro`
- `armchair` -> `Sillon`
- `sofa` -> `Sofa`
- `rug` -> `Alfombra`
- `lighting` -> `Iluminacion`
- `chair` -> `Silla`
- `table` -> `Mesa`
- `decor` -> `Decoracion`
- `planter` -> `Macetero`
- `textile` -> `Textil`
- `lounge` -> `Lounge`
- `side-table` -> `Mesa auxiliar`

## Criterios de QA

- Viewer: 44 assets iniciales, 24 con `Solo modelos reales`, 10 reales de terraza y 14 reales de salon.
- Composer: 24 productos reales iniciales, 10 terraza, 14 salon, filtros por categoria y busqueda operativos.
- Demo staging: 24 productos reales iniciales, filtros comerciales operativos y exportaciones intactas.
- No se deben mover GLB, cambiar manifest ni introducir backend.
