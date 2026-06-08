# Cocina Mediterranea Modular

## Vision de coleccion

`kitchen-mediterranean-modular` es la coleccion activa de cocina para Decor Asset Lab. Cubre una cocina modular KNOXHULT con armarios altos, bajos, pared, esquina, puertas correderas y almacenaje.

## Cobertura

- Estado: active
- Room type: kitchen
- Objetivo: 21 assets reales
- Cobertura actual: 21/21
- Uso: staging visual, reformas, catalogo interactivo, Room Designer Lite y propuestas comerciales de cocina equipada

## Assets integrados

| Producto | Categoria |
| --- | --- |
| KNOXHULT Ab cajones - blanco | kitchen-base-cabinet |
| KNOXHULT armario alto con puerta - blanco estructura | kitchen-tall-cabinet |
| KNOXHULT armario alto con puerta - blanco | kitchen-tall-cabinet |
| KNOXHULT armario alto con puerta - efecto roble | kitchen-tall-cabinet |
| KNOXHULT armario alto con puerta - gris oscuro | kitchen-tall-cabinet |
| KNOXHULT armario bajo cocina esquina - blanco | kitchen-corner-cabinet |
| KNOXHULT armario bajo con puertas y cajon - blanco estructura | kitchen-base-cabinet |
| KNOXHULT Armario bajo con puertas y cajon - blanco | kitchen-base-cabinet |
| KNOXHULT armario bajo con puertas y cajon - efecto roble | kitchen-base-cabinet |
| KNOXHULT armario bajo con puertas y cajon - gris oscuro | kitchen-base-cabinet |
| KNOXHULT armario bajo+puerta y hueco - blanco | kitchen-base-cabinet |
| KNOXHULT armario bajo+puerta y hueco - efecto roble | kitchen-base-cabinet |
| KNOXHULT Armario de pared con puerta - blanco | kitchen-wall-cabinet |
| KNOXHULT Armario de pared con puertas - blanco | kitchen-wall-cabinet |
| KNOXHULT armario de pared con puertas - blanco estructura | kitchen-wall-cabinet |
| KNOXHULT armario de pared con puertas - efecto roble | kitchen-wall-cabinet |
| KNOXHULT armario de pared con puertas - gris oscuro | kitchen-wall-cabinet |
| KNOXHULT armario de pared&puertas correderas - blanco | kitchen-sliding-wall-cabinet |
| KNOXHULT armario de pared&puertas correderas - efecto roble | kitchen-sliding-wall-cabinet |
| KNOXHULT modulo almacenaje cocina - efecto roble | kitchen-storage |
| KNOXHULT modulo almacenaje cocina - gris oscuro | kitchen-storage |

## Categorias

- `kitchen-base-cabinet`: 7
- `kitchen-tall-cabinet`: 4
- `kitchen-corner-cabinet`: 1
- `kitchen-wall-cabinet`: 5
- `kitchen-sliding-wall-cabinet`: 2
- `kitchen-storage`: 2

## Uso comercial

- Visualizacion de cocinas equipadas para promociones inmobiliarias.
- Propuestas rapidas de reforma con modulos reales.
- Demo de catalogo modular para interioristas y constructoras.
- Room Designer Lite para composiciones de cocina sin mezclar comedor, dormitorio o exterior.

## Notas de QA

- Los 21 GLB proceden de descarga manual autorizada.
- Se excluyeron duplicados evidentes con sufijo `(1)` y `(2)` cuando existia version base equivalente.
- Las dimensiones quedan en `null` hasta revision de escala.
- Previews generadas con `npm run generate-previews`.
- Las categorias de cocina se aceptan en importer, schema y validador.
- La coleccion debe aparecer en viewer, composer, empty-room-staging y room-designer.
