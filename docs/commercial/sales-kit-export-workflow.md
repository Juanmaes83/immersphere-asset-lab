# Sales Kit Export Workflow

## Qué hace el exportador

El comando `npm run export-sales-kit` genera automáticamente material comercial listo para enviar a clientes:

- **PDF del one-pager** imprimible en A4.
- **6 capturas PNG** de la demo interactiva (hero, before/after, grid, modal 3D, paquetes, CTA).
- **1 captura PNG** del one-pager como thumbnail.
- **README.md** con instrucciones de uso y listado de archivos.

Todo se genera desde la demo local ejecutándose en `http://localhost:3456`.

---

## Comando

```bash
cd C:\Users\temp123\repos\immersphere-asset-lab
npm run export-sales-kit
```

Alias disponible:

```bash
npm run export
```

---

## Dónde genera archivos

```
exports/
└── sales-kit/
    └── decor-asset-lab/
        ├── decor-asset-lab-one-pager.pdf
        ├── 01-demo-hero.png
        ├── 02-before-after.png
        ├── 03-product-grid.png
        ├── 04-product-modal-3d.png
        ├── 05-commercial-packages.png
        ├── 06-final-cta.png
        ├── 07-one-pager-preview.png
        └── README.md
```

---

## Qué archivo enviar a cliente

| Situación | Archivo recomendado |
|---|---|
| Email de prospección fría | PDF del one-pager + 1 captura (hero o modal 3D) en el cuerpo |
| Reunión presencial | PDF impreso + presentación con capturas 01-06 |
| Follow-up post-reunión | PDF del one-pager adjunto + link a demo online |
| Post de LinkedIn | Captura 01 (hero) + enlace a landing demo |

---

## Qué capturas usar para presentación

Orden sugerido de diapositivas:

1. **01-demo-hero.png** — Hook visual y claim principal.
2. **02-before-after.png** — El problema que resolvemos.
3. **03-product-grid.png** — Prueba de catálogo real y variado.
4. **04-product-modal-3d.png** — Diferenciador: interactividad 3D.
5. **05-commercial-packages.png** — Propuesta de valor con precios.
6. **06-final-cta.png** — Cierre con contacto claro.

---

## Cómo regenerar el kit

Cada vez que se actualice la demo, el one-pager o la colección:

```bash
npm run export-sales-kit
```

El exportador sobrescribe los archivos anteriores en `exports/sales-kit/decor-asset-lab/`.

---

## Qué NO hacer

- **NO subir `exports/` a Git.** Está en `.gitignore` por diseño. Los PDFs y PNGs generados son outputs locales.
- **NO commitear exports si son pesados.** El repo debe mantenerse ligero.
- **NO editar el PDF como fuente principal.** Si hay cambios de copy, modificar `sales/decor-asset-lab-one-pager.html` y regenerar.
- **NO enviar el PDF sin revisar visualmente.** Abrir el PDF generado y comprobar que las imágenes se ven correctamente.
- **NO incluir GLB en el material de venta.** Las capturas son suficientes; el GLB se muestra solo en la demo interactiva local.

---

*Documento interno de Immersphere Studio · Uso comercial autorizado · 2026*
