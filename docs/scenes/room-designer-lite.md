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
- No carga GLB dentro de la escena (usa previews).
- No calibra perspectiva ni escala física.
- No genera sombras reales ni oclusión.
- Las vistas son representaciones visuales simplificadas, no proyecciones 3D exactas.

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

### Fase 4H.4 — Panel de producto avanzado (próxima)
- Ficha lateral de producto con más metadatos.
- Variantes visuales del producto si existen.
- "Sustituir por similar" con sugerencias del catálogo.
- "Combina bien con" recomendaciones.
- Añadir a presupuesto con cantidad editable.
- Listado de productos usados más comercial con precios (cuando estén disponibles).

### Fase 4H.5 — Vistas avanzadas y miniaturas (próxima)
- Miniaturas de vistas en barra lateral.
- Guardar cámara/vista preferida.
- Vista superior más clara con grid.
- Vista lateral izquierda/derecha con perspectiva refinada.
- Modo casa de muñecas más pulido con sombras ambientales.

### Fase 4H.6 — Materiales y pintura avanzada (próxima)
- Pintar pared principal y pared lateral por separado.
- Cambiar suelo con más opciones y texturas.
- Guardar presets de estilo personalizados.
- Paletas por estancia: mood mediterráneo, nórdico, minimal, industrial.
- Aplicar mood con un solo clic.

## URLs

- Local: `http://localhost:3456/scenes/room-designer/`
- Pública: `https://immersphere-asset-lab.vercel.app/scenes/room-designer/`

## Estado

MVP funcional. Listo para QA y commit local.
