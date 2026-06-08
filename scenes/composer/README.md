# Scene Composer MVP 2.5D

## URL local

`http://localhost:3456/scenes/composer/`

## Objetivo

Permite subir una imagen de una estancia vacia y colocar encima previews de productos reales del catalogo Decor Asset Lab. Es una herramienta conceptual para propuestas comerciales rapidas.

## Que hace

- Carga `/manifest/ikea-sample.manifest.json`.
- Filtra assets con `hasRealModel === true`.
- Muestra previews, nombre, categoria y coleccion.
- Permite anadir productos a una escena 2.5D.
- Permite mover, escalar, rotar, eliminar y ordenar capas.
- Guarda la ultima escena en `localStorage`.
- Exporta composicion PNG cuando el navegador lo permite.
- Exporta proyecto JSON.
- Exporta listado de productos usados.

## Que no hace todavia

- No calibra camara.
- No usa Three.js.
- No carga GLB dentro de la escena.
- No calcula escala real.
- No genera sombras u oclusion.
- No sustituye una escena 3D calibrada.
- No usa backend.

## Relacion con el catalogo multiestancia

El composer trabaja con el catalogo actual y queda preparado para crecer cuando `collections/collections.json` active nuevas estancias de 10 assets reales.
