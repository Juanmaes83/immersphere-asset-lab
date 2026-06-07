# Immersphere Asset Lab

## Decor Asset Lab · Laboratorio Interno Premium de Assets 3D

**Ubicación:** `C:\Users\temp123\repos\immersphere-asset-lab`  
**Producto:** Immersphere Asset Lab (módulo comercial: Decor Asset Lab)  
**Estado:** Inicialización local · Fase 0  
**Fecha:** 2026-06-07

---

## ¿Qué es?

**Immersphere Asset Lab** es un laboratorio interno premium para gestionar assets 3D autorizados de marcas de mobiliario, iluminación, decoración, cocinas, baños, textiles y materiales.

Es la cuarta pata del ecosistema Immersphere:
- Immersphere Pro SaaS (tours, propiedades, visor)
- Immersphere Pro Inmobiliarias (web comercial, renders, campañas)
- Immersphere Pro CRM Leads (captación, pipeline, propuestas)
- **Immersphere Asset Lab** ← **tú estás aquí**

---

## Alcance actual (Fase 0)

- **Servicio interno premium.** No es SaaS todavía.
- **No es marketplace todavía.**
- **No está integrado** en Immersphere Pro SaaS todavía.
- **No está integrado** en CRM todavía.
- **No incluye assets reales** en el repositorio.
- Los archivos pesados (GLB, texturas) deben ir fuera de Git o en storage autorizado.

---

## Flujo de trabajo

```
Asset autorizado por marca
    ↓
Registro de metadata → manifest.json
    ↓
Generación de preview (thumbnail)
    ↓
Validación GLB + QA visual
    ↓
Visor local → demo comercial
    ↓
Uso en cliente (renders, tours, staging)
    ↓
Futura integración SaaS + CRM + marketplace
```

---

## Estructura del repositorio

```
immersphere-asset-lab/
├── README.md                 ← Este archivo
├── package.json              ← Scripts y metadatos
├── .gitignore                ← Exclusión de assets pesados
├── assets/                   ← Carpeta de assets 3D
│   ├── ikea/                 ← Assets por marca
│   │   ├── living-room/
│   │   ├── bedroom/
│   │   ├── lighting/
│   │   ├── tables/
│   │   ├── chairs/
│   │   └── decor/
│   └── _placeholder/         ← Placeholders GLB vacíos
├── previews/                 ← Thumbnails WebP/PNG
│   ├── ikea/
│   └── _placeholder/
├── manifest/                 ← Schemas y manifests
│   ├── manifest.schema.json  ← Schema de validación
│   └── ikea-sample.manifest.json ← Manifest demo (20 items)
├── viewer/                   ← Visor local premium
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── docs/                     ← Documentación estratégica
│   ├── strategy.md
│   ├── taxonomy.md
│   ├── licensing.md
│   ├── workflow.md
│   └── qa-checklist.md
├── scripts/                  ← Scripts de utilidad
│   └── validate-manifest.js
└── examples/                 ← Ejemplos comerciales
    ├── empty-apartment-demo.md
    └── product-list-sample.md
```

---

## Scripts disponibles

```bash
# Validar manifest
node scripts/validate-manifest.js

# Iniciar visor local (servidor estático)
npm start
```

---

## Reglas del repositorio

1. **NO subir assets reales a Git.** Usar `.gitignore` para GLB, GLTF, FBX, OBJ, USDZ, BLEND, ZIP.
2. **NO subir previews pesados.** Thumbnails máximo 512×512 px.
3. **NO subir credenciales.** Usar `.env` local (ignorado por Git).
4. **NO hacer push sin autorización.** Este repo es local hasta nueva orden.
5. **Todo asset real requiere registro de licencia** en el manifest antes de uso.

---

## Contacto

**Immersphere Studio · Rubik SOTA**  
*Laboratorio interno · Uso autorizado*
