# Plan futuro de descargas multiestancia

Este documento es una plantilla de control. No autoriza descargas ni scraping. Cada fila debe completarse solo cuando el asset tenga permiso, licencia y QA definidos.

| Coleccion | Estancia | Asset necesario | Categoria | Prioridad | Estado | Notas | Licencia | QA |
|---|---|---|---|---|---|---|---|---|
| living-room-nordic-premium | Salon | Sofa principal | sofa | Alta | planned | Pieza ancla de escena | Pendiente | Pendiente |
| living-room-nordic-premium | Salon | Mesa de centro | table | Alta | planned | Debe combinar con sofa | Pendiente | Pendiente |
| living-room-nordic-premium | Salon | Alfombra neutra | rug | Media | planned | Controlar peso de texturas | Pendiente | Pendiente |
| mediterranean-dining-room | Comedor | Mesa comedor | dining-table | Alta | planned | Pieza central | Pendiente | Pendiente |
| mediterranean-dining-room | Comedor | Sillas comedor | chair | Alta | planned | Buscar set coherente | Pendiente | Pendiente |
| master-bedroom-minimal | Dormitorio | Cama principal | bed | Alta | planned | Escala critica | Pendiente | Pendiente |
| master-bedroom-minimal | Dormitorio | Mesilla | bedside-table | Media | planned | Pairing con cama | Pendiente | Pendiente |
| kids-bedroom-soft | Infantil | Cama infantil | kids-bed | Alta | planned | Estilo suave | Pendiente | Pendiente |
| home-office-warm | Oficina | Escritorio | desk | Alta | planned | Pieza ancla | Pendiente | Pendiente |
| home-office-warm | Oficina | Silla de trabajo | office-chair | Alta | planned | Ergonomia visual | Pendiente | Pendiente |
| kitchen-mediterranean | Cocina | Taburete | stool | Media | planned | Evitar modelos pesados | Pendiente | Pendiente |
| bathroom-spa | Bano | Mueble lavabo | vanity | Alta | planned | Fase futura exigente | Pendiente | Pendiente |

## Criterio de avance

Una coleccion pasa de `planned` a `active` solo cuando tenga 10 assets reales autorizados, previews disponibles, manifest validado y QA visual completado.

## Flujo con ingest-folder

Ejemplo para preparar la coleccion `living-room-nordic-premium`:

1. Descargar manualmente 10 GLB autorizados para Salon Nordico Premium.
2. Colocarlos en `imports/inbox/`.
3. Ejecutar dry-run:
   ```bash
   npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --dry-run
   ```
4. Revisar categorias detectadas, posibles duplicados y rutas propuestas.
5. Ejecutar apply:
   ```bash
   npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --apply
   ```
6. Revisar los drafts en `imports/metadata-drafts/`.
7. Completar SKU, nombre, licencia, permisos y preview.
8. Ingerir oficialmente en manifest cuando todos los campos criticos esten completos.
9. Generar previews.
10. Validar:
    ```bash
    npm run check
    npm run preflight
    ```

El importer no descarga assets, no hace scraping y no publica nada automaticamente.
