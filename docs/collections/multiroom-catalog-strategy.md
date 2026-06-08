# Estrategia de catalogo multiestancia

## Objetivo

El catalogo multiestancia convierte Decor Asset Lab en una herramienta comercial escalable: no depende de una sola terraza, sino de colecciones pequeñas, verificables y vendibles por tipo de estancia.

## Por que no descargar 50 assets todavia

No se anaden 50 assets en esta fase porque el riesgo principal no es tecnico, es operativo: peso del repositorio, licencias, QA visual, coherencia de estilo y trazabilidad comercial. Antes de ampliar, cada coleccion debe demostrar que puede vender una escena concreta con 10 piezas utiles.

## Escalado por colecciones de 10

Cada coleccion debe tener:

- 10 assets objetivo.
- Una estancia clara.
- Un estilo comercial reconocible.
- Previews ligeras.
- GLB autorizados y ubicados bajo `assets/ikea/` o la marca que corresponda.
- Manifest validado.
- Demo o escena comercial cuando tenga sentido.

## Orden recomendado

1. Terraza Mediterranea Premium: ya activa.
2. Salon Nordico Premium: mayor uso comercial en vivienda residencial.
3. Comedor Mediterraneo: narrativa familiar y aspiracional.
4. Dormitorio Principal Minimal: venta emocional y descanso.
5. Home Office Warm: diferenciacion por teletrabajo.
6. Dormitorio Infantil Soft: venta a familias.
7. Cocina Mediterranea: exige mas control tecnico.
8. Bano Spa: exige mas precision de materiales y escala.

## Criterios de seleccion

- Relevancia comercial para inmobiliarias, promotoras, reformas e interiorismo.
- Coherencia visual dentro de la estancia.
- Peso razonable del modelo.
- Preview ligera disponible.
- Licencia o permiso documentado.
- Producto identificable por marca, SKU y categoria.
- Valor narrativo: debe ayudar a vender un espacio, no solo rellenarlo.

## Control de peso

La regla de producto es mantener el catalogo ligero. Los GLB reales deben estar optimizados, las previews no deben ser pesadas y cualquier escena publica debe evitar cargar modelos innecesarios.

## Control de licencia

Cada asset real debe conservar referencia de permiso, uso permitido, atribucion si aplica y alcance comercial. No se debe automatizar descarga ni scraping hasta que exista un flujo autorizado y auditado.

## Control de QA

Antes de activar una coleccion:

- `npm run check`
- `npm run preflight`
- Verificacion de preview.
- Verificacion de modelo en viewer.
- Revision de escala y orientacion.
- Confirmacion de que no hay GLB en raiz.

## Valor comercial

El catalogo multiestancia mejora la venta porque permite adaptar la propuesta a distintos clientes: terraza para lifestyle, salon para vivienda principal, dormitorio para emocionalidad, home office para uso flexible, cocina y bano para reformas y promotoras.
