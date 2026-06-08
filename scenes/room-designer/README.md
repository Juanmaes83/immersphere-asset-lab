# Room Designer Lite

Módulo de diseño de estancias base personalizables para el catálogo Decor Asset Lab.

## Qué es

Room Designer Lite permite crear una estancia base, cambiar paredes, suelo y vista, y colocar productos reales del catálogo.

## Diferencia con otras herramientas

- **Scene Composer:** parte de una imagen subida por el usuario.
- **Empty Room Staging:** demo comercial guiada sobre imagen vacía.
- **Room Designer Lite:** genera la estancia visualmente sin subir imagen.

## URLs

- Local: `http://localhost:3456/scenes/room-designer/`
- Pública: `https://immersphere-asset-lab.vercel.app/scenes/room-designer/`

## Estructura

- `index.html` — Estructura de la aplicación.
- `styles.css` — Estilos y representación visual de estancias.
- `app.js` — Lógica de catálogo, colocación, exportación y localStorage.
- `README.md` — Este archivo.

## Funciones comerciales (FASE 4H.7)

- **Resumen comercial editable:** cantidades ajustables con +/-, localización rápida en escena.
- **Precios defensivos:** soporta `price`, `priceEUR`, `unitPrice`, `priceValue`. Si no hay precio, muestra "Precio pendiente".
- **Datos de propuesta:** nombre de proyecto, cliente, email, teléfono y notas.
- **Export JSON comercial:** descarga `propuesta-{timestamp}.json` con líneas, totales y pendientes.
- **PDF / Imprimir:** abre ventana con tabla imprimible y botón de impresión nativo.
- **Export HTML:** descarga archivo HTML autónomo con la propuesta formateada.
- **Solicitar demo privada:** enlace `mailto:` pre-rellenado con datos del proyecto.
- **Totales en panel:** calcula total estimado y cuenta productos pendientes de valoración.
