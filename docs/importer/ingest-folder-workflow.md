# Importer asistido por carpeta

## Que hace

`npm run ingest-folder` prepara una ingesta por lote de GLB descargados manualmente. Lee una carpeta de entrada, detecta archivos `.glb`, propone categoria por heuristica, genera metadata draft y, si se usa `--apply`, mueve archivos conocidos a `assets/ikea/{category}/`.

## Que NO hace

- No descarga modelos.
- No hace scraping.
- No entra en IKEA.
- No actualiza el manifest automaticamente.
- No completa licencia, SKU, nombre comercial o preview.
- No publica assets sin revision humana.

## Flujo recomendado

1. Descargar manualmente los GLB autorizados.
2. Colocarlos en `imports/inbox/`.
3. Ejecutar:
   ```bash
   npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --dry-run
   ```
4. Revisar el resumen.
5. Ejecutar:
   ```bash
   npm run ingest-folder -- --collection living-room-nordic-premium --room living-room --apply
   ```
6. Revisar los JSON creados en `imports/metadata-drafts/`.
7. Completar metadata: SKU, `productName`, licencia, permisos y `previewPath`.
8. Ingerir oficialmente con el flujo manual existente.
9. Generar previews si procede.
10. Validar:
    ```bash
    npm run check
    npm run preflight
    ```

## Dry-run vs apply

`--dry-run` no mueve archivos, no escribe drafts y no toca manifest. Solo lista lo que haria.

`--apply` escribe drafts y mueve GLB:

- Categoria conocida: `assets/ikea/{category}/`.
- Categoria desconocida: `imports/rejected/`.

## Metadata draft

Cada draft se crea como:

`imports/metadata-drafts/{slug}.metadata.json`

El draft conserva campos pendientes:

- `sku: "PENDING-SKU"`
- `productName: "PENDING product name"`
- `license: "PENDING"`
- `previewPath: "PENDING"`

Mientras esos campos sigan pendientes, el asset no debe entrar en manifest.

## Evitar duplicados

El script avisa si detecta coincidencias probables con:

- `id`
- `modelPath`
- slug parecido a SKU

Tambien evita sobrescribir archivos en destino usando sufijo seguro.

## Preparar una coleccion de 10 assets

Para una coleccion nueva:

1. Elegir estancia y coleccion en `collections/collections.json`.
2. Descargar manualmente 10 GLB autorizados.
3. Ponerlos en `imports/inbox/`.
4. Ejecutar dry-run.
5. Ejecutar apply.
6. Revisar 10 drafts.
7. Completar metadata y licencias.
8. Ingerir oficialmente.
9. Generar previews.
10. Validar manifest y preflight.
