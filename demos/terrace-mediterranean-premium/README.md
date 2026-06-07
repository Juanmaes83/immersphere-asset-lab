# Terraza Mediterránea Premium — Demo Comercial

## ¿Qué es?

Demo comercial de **Decor Asset Lab by Immersphere** que muestra cómo un espacio vacío (terraza) se transforma en una experiencia amueblada premium usando productos reales de catálogo IKEA autorizado.

## URL local

```
npm run start
# → http://localhost:3456/demos/terrace-mediterranean-premium/
```

## Estructura

```
demos/terrace-mediterranean-premium/
├── index.html   ← Landing demo
├── app.js       ← Lógica: carga manifest, renderiza colección, modal 3D
├── styles.css   ← Estilos premium mediterráneos
└── README.md    ← Este archivo
```

## Funcionalidades

- **Hero comercial** con claim, subtítulo y CTAs.
- **Before / After** conceptual con mini-grid de previews reales.
- **Features** explicando el valor comercial.
- **Grid de 10 assets** con previews reales, badges y botón "Ver en 3D".
- **Modal 3D** con `model-viewer` para cada asset real.
- **Tabla comercial** de productos con función en escena, estado GLB/preview y uso recomendado.
- **Paquetes comerciales** sugeridos (Basic, Premium, Developer, Brand).
- **CTA final** con enlaces de contacto.

## Dependencias

- Servidor local de Asset Lab (`npm run start`).
- `model-viewer` v3.5.0 desde unpkg (CDN).
- Manifest: `manifest/ikea-sample.manifest.json`.

## Notas

- No incluye GLB en Git. Los modelos se sirven desde `assets/ikea/` localmente.
- Las previews PNG sí están en Git y se sirven desde `previews/ikea/`.
- Si se añaden más assets a la colección con `roomTags: ["terrace"]`, la demo los mostrará automáticamente.

## Sales Kit

Material comercial asociado a esta demo:

- [`../../sales/decor-asset-lab-one-pager.html`](../../sales/decor-asset-lab-one-pager.html) — One-pager comercial imprimible.
- [`../../docs/commercial/decor-asset-lab-pitch-script.md`](../../docs/commercial/decor-asset-lab-pitch-script.md) — Guiones de presentación.
- [`../../docs/commercial/decor-asset-lab-objections-and-answers.md`](../../docs/commercial/decor-asset-lab-objections-and-answers.md) — Argumentario por cliente.
- [`../../docs/commercial/decor-asset-lab-capture-checklist.md`](../../docs/commercial/decor-asset-lab-capture-checklist.md) — Checklist de pantallazos y clips.
