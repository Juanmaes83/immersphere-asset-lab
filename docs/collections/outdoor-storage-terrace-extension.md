# Exterior Storage / Terraza ampliada

## Vision

Coleccion exterior para completar escenas de terraza, patio y jardin con piezas reales de almacenaje, privacidad, bancos, mesas y asientos. Complementa `terrace-mediterranean-premium` sin duplicar los modelos que ya estaban activos.

## Identificador

- Collection ID: `outdoor-storage-terrace-extension`
- Room: `outdoor`
- Assets reales: 17
- Placeholders: 0

## Categorias

| Categoria | Total | Uso |
| --- | ---: | --- |
| `outdoor-cabinet` | 1 | Armario exterior cerrado |
| `storage-shelf` | 4 | Estanterias exterior/interior |
| `outdoor-storage` | 1 | Modulo de almacenaje exterior |
| `outdoor-chair` | 1 | Silla exterior |
| `outdoor-sofa` | 1 | Sofa exterior |
| `outdoor-table` | 2 | Mesas auxiliares o centro exterior |
| `outdoor-bench` | 3 | Bancos de jardin o terraza |
| `deck-box` | 1 | Baul exterior |
| `privacy-screen` | 2 | Pantallas y separadores de privacidad |
| `outdoor-stool` | 1 | Taburete exterior |

## Assets integrados

| Producto | Categoria |
| --- | --- |
| KOLBJORN armario para interior o exterior - beige | `outdoor-cabinet` |
| KOLBJORN estanteria con 2 armarios - beige | `storage-shelf` |
| KOLBJORN estanteria con armario - beige | `storage-shelf` |
| KOLBJORN estanteria de interior y exterior - 80x35x162 cm | `storage-shelf` |
| KOLBJORN estanteria de interior y exterior - beige | `storage-shelf` |
| KOLBJORN mueble de almacenaje - beige exteriorinterior | `outdoor-storage` |
| LACKO silla con reposabrazos exterior - gris oscuro | `outdoor-chair` |
| LACKO sofa 2 plazas exterior - gris | `outdoor-sofa` |
| LAGASKAR mesa de centro exterior - beige | `outdoor-table` |
| MABARSSKAR mesa de centro - exterior interiorblanco | `outdoor-table` |
| NAMMARO banco con respaldo de exterior - tinte marron claro | `outdoor-bench` |
| NAMMARO Banco jardin - tinte marron claro | `outdoor-bench` |
| NAMMARO baul - tinte marron claro interiorexterior | `deck-box` |
| NAMMARO caja y pantalla privacidad - exteriortinte marron claro | `privacy-screen` |
| NAMMARO pantalla para privacidad - tinte marron claro interiorexterior | `privacy-screen` |
| NAMMARO taburete de exterior - plegabletinte marron claro | `outdoor-stool` |
| PARONHOLMEN banco con respaldo de exterior - rojo | `outdoor-bench` |

## Integracion

- `manifest/ikea-sample.manifest.json` contiene los 17 registros con `hasRealModel: true`.
- `collections/collections.json` expone la coleccion como activa.
- Viewer, Composer, Empty Room Staging y Room Designer incluyen filtros y etiquetas para las categorias outdoor.
- Las previews se generaron en `previews/ikea/`.

## QA esperado

- `npm run check`
- `npm run preflight`
- `npm run export-sales-kit`
- `node --check` en viewer, composer, staging y room designer
