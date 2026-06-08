# Room Designer Lite

## Objetivo

Crear un módulo MVP visual para diseñar estancias base personalizables sin necesidad de subir una imagen. El usuario selecciona una plantilla, personaliza paredes y suelo, elige una vista y coloca productos reales del catálogo Decor Asset Lab.

## Qué problema resuelve

- **Scene Composer** requiere que el usuario suba una foto de una estancia vacía.
- **Empty Room Staging** es una demo guiada sobre imagen subida.
- **Room Designer Lite** elimina la fricción de la imagen: genera una estancia visual base lista para amueblar.

## Diferencias clave

| Herramienta | Entrada | Salida | Uso principal |
|---|---|---|---|
| Scene Composer | Imagen vacía subida | Composición 2.5D | Propuestas rápidas sobre foto real |
| Empty Room Staging | Imagen vacía subida + guía | Demo comercial | Venta de staging visual |
| Room Designer Lite | Plantilla generada | Estancia base personalizada | Exploración de catálogo, moodboards, primeras propuestas |

## Funcionalidades MVP

### Plantillas de estancia
- Salón
- Terraza
- Dormitorio
- Comedor
- Home Office

### Personalización de paredes
- Blanco cálido
- Gris claro
- Arena
- Negro grafito
- Terracota
- Verde oliva
- Azul mediterráneo
- Beige piedra

### Personalización de suelo
- Madera clara
- Madera oscura
- Cemento suave
- Piedra mediterránea
- Baldosa clara
- Exterior terraza

### Vistas
- Casa de muñecas (perspectiva)
- Vista frontal
- Vista superior
- Vista lateral izquierda
- Vista lateral derecha

### Catálogo integrado
- Carga automática desde `manifest/ikea-sample.manifest.json`
- Filtrado por colección: Terraza Mediterránea Premium, Salón Nórdico Premium
- Filtrado por tipo: sofás, sillones, mesas, muebles TV, lámparas, alfombras, decoración, sillas, textil
- Búsqueda por nombre, SKU, categoría, marca

### Colocación de productos
- Añadir desde catálogo
- Mover con ratón
- Escalar
- Rotar
- Traer al frente / enviar atrás
- Eliminar

### Listado de productos usados
- Producto, marca, categoría, colección, SKU, cantidad
- Agrupación de duplicados

### Exportaciones
- Imagen PNG de la escena
- Proyecto JSON (plantilla, colores, vista, capas, productos)
- Listado de productos JSON
- Guardar / cargar en localStorage
- Limpiar escena

## Limitaciones

- Es un MVP visual 2.5D. No sustituye un planner 3D calibrado con medidas reales.
- No carga GLB dentro de la escena (usa previews PNG).
- No calibra perspectiva ni escala física real.
- No genera sombras 3D reales ni oclusión.
- Las vistas son representaciones 2.5D visuales simplificadas, no proyecciones 3D exactas.
- Los suelos son patrones CSS, no texturas fotográficas.
- No hay escala física real ni medición en metros.
- No hay precios reales ni checkout.
- "Sustituir por similar" y "Combina bien con" usan reglas simples por categoría, no IA.

## Roadmap

1. **Calibración de perspectiva:** ajuste fino de la escena a fotos reales.
2. **Medidas:** mostrar dimensiones aproximadas de productos colocados.
3. **Paredes editables:** añadir/quitar ventanas, puertas, molduras.
4. **Sombras:** sombras simples bajo productos para anclaje visual.
5. **Profundidad:** modo pseudo-3D con ordenación por profundidad.
6. **Integración GLB real:** visor ligero de modelos en modal.
7. **Export comercial:** generar PDF de propuesta con precios.
8. **Presets por cliente:** guardar configuraciones de marca/inmobiliaria.

### Fase 4H.3 completada — Mejoras visuales y de interacción
- ✅ Sombra elíptica bajo cada producto.
- ✅ Contorno de selección mejorado (azul premium + glow).
- ✅ Mini menú flotante con acciones rápidas: girar, duplicar, traer al frente, enviar atrás, eliminar.
- ✅ Panel de producto más comercial (preview, marca, categoría, colección, SKU, badge "Producto real 3D disponible").
- ✅ Botón "Añadir a propuesta" con toggle.
- ✅ Resumen de propuesta con cards visuales, contador y agrupación.
- ✅ Enlace "Ver en catálogo 3D" al viewer.

### Fase 4H.4 completada — Panel de producto avanzado
- ✅ Ficha lateral de producto con preview, marca, SKU, categoría, colección, badge "Producto real 3D disponible".
- ✅ "Sustituir por similar" — lista compacta de productos de la misma categoría, reemplazo manteniendo posición/escala/rotación.
- ✅ "Combina bien con" — recomendaciones por reglas de categoría (hasta 6 productos).
- ✅ Botón "Añadir a propuesta" con toggle y estado visual.
- ✅ Resumen de propuesta con contador, cards visuales y productos excluidos marcados.

### Fase 4H.5 completada — Vistas avanzadas y miniaturas
- ✅ Barra de miniaturas de vista bajo la escena (Casa de muñecas, Frontal, Superior, Izquierda, Derecha).
- ✅ Guardar vista actual en localStorage (template, colores, suelo, vista, layers).
- ✅ Listar, cargar y eliminar vistas guardadas.
- ✅ Vista superior más limpia (plano 2D sin paredes).
- ✅ Vistas laterales con perspectiva refinada y énfasis en profundidad.
- ✅ Modo casa de muñecas más pulido con sombras ambientales en suelo.

### Fase 4H.6 completada — Materiales y pintura avanzada
- ✅ Color de pared principal y pared lateral por separado (8 colores cada uno).
- ✅ Suelos mejorados con patrones CSS y orientación visual.
- ✅ Presets de estilo rápidos: Mediterráneo claro, Nórdico premium, Minimal cálido, Urbano grafito, Natural soft.
- ✅ Guardar estilo personalizado en localStorage con nombre automático.
- ✅ Listar, cargar y eliminar estilos guardados.

## URLs

- Local: `http://localhost:3456/scenes/room-designer/`
- Pública: `https://immersphere-asset-lab.vercel.app/scenes/room-designer/`

## Estado

MVP funcional. Listo para QA y commit local.
