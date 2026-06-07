# Roadmap · Immersphere Asset Lab

## Fase 0: Fundación (Día 0–7) — ✅ COMPLETADA

- [x] Repo base creado
- [x] Manifest schema JSON con 30+ campos
- [x] Manifest sample con 20 placeholders validados
- [x] Visor local premium (grid, filtros, búsqueda, modal)
- [x] Documentación estratégica (strategy, taxonomy, licensing, workflow, QA)
- [x] Script de validación Node sin dependencias
- [x] Ejemplos comerciales (demo piso vacío, listado de productos)
- [x] Git local inicializado con commits

**Entregable:** Laboratorio funcional con metadata completa, sin assets reales.

---

## Fase 1: Assets Reales Autorizados (Día 8–30)

### Semana 2: Negociación y primeros assets

- [ ] Contactar IKEA Business Sales España (o marca piloto alternativa)
- [ ] Obtener permiso escrito (mínimo: uso comercial en renders, alcance España)
- [ ] Descargar/importar 5–10 assets reales con permiso
- [ ] Procesar cada asset:
  - [ ] Validar GLB (glTF-Transform)
  - [ ] Generar preview real (512×512 WebP)
  - [ ] QA visual completo
  - [ ] Actualizar manifest: `qaStatus: approved`, `licenseType: authorized-commercial`
- [ ] Reemplazar placeholders en viewer con assets reales aprobados

### Semana 3–4: Demo comercial

- [ ] Crear escena "Piso vacío → amueblado" con assets reales
- [ ] Generar renders fotorrealistas (Blender / Three.js)
- [ ] Crear dossier PDF de ejemplo con listado de productos
- [ ] Grabar video demo (walkthrough de la escena)
- [ ] Landing page demo (estática, para presentar a clientes)

**Entregable:** 5–10 assets reales + demo comercial visual + dossier PDF.

---

## Fase 2: Integración Parcial SaaS (Día 31–60)

### Semana 5–6: Backend y schema

- [ ] Extender schema Prisma de Immersphere Pro SaaS:
  - [ ] `AssetCatalog` (tabla de assets)
  - [ ] `SpaceAsset` (many-to-many con posicionamiento 3D)
  - [ ] `BrandPartner` (marcas con permisos)
- [ ] Migrar manifest JSON a PostgreSQL (script de importación)
- [ ] API endpoints:
  - [ ] `POST /api/assets/import` (subida GLB + JSON)
  - [ ] `GET /api/assets/catalog` (listado con filtros)
  - [ ] `GET /api/assets/:id` (detalle)

### Semana 7–8: Frontend SaaS

- [ ] Panel "Biblioteca 3D" en dashboard de tenant
- [ ] Grid con filtros (igual que viewer local, pero integrado)
- [ ] Drag-and-drop de asset a hotspot en editor de espacios
- [ ] Nuevo tipo de hotspot: `PRODUCT`
- [ ] Hotspot muestra card con nombre, precio, link a producto

**Entregable:** Asset Library integrada en Immersphere Pro SaaS, usable en tours 3D.

---

## Fase 3: Módulo Comercial Inmobiliarias + CRM (Día 61–90)

### Semana 9–10: Immersphere Pro Inmobiliarias

- [ ] Sección "Decor Asset Lab" en landing
- [ ] Demo interactiva: "Amuebla tu piso virtualmente"
- [ ] CTA: "Solicitar staging con catálogo real"
- [ ] Case studies: renders antes/después con mobiliario real

### Semana 11–12: CRM Leads

- [ ] Línea de presupuesto: "Mobiliario incluido" con SKU y precio
- [ ] Plantilla de propuesta: reforma + mobiliario
- [ ] Pipeline: lead interesado en "reforma integral con mobiliario"
- [ ] Botón: generar propuesta PDF con listado de assets

### Semana 11–12: Marcas adicionales

- [ ] Negociar con 2ª marca (ej. iluminación: Flos, Vibia)
- [ ] Construir importer batch autorizado (categoría completa)
- [ ] Importar lote de 20–50 assets de nueva marca
- [ ] Catalogar por marca en viewer

**Entregable:** Asset Lab como producto comercial visible + integración CRM + 2 marcas.

---

## Fase 4: Marketplace (Futuro, +90 días)

- [ ] Biblioteca pública de packs por estilo ("Nordic Living", "Industrial Loft")
- [ ] Packs de pago via Stripe
- [ ] Revenue share con marcas (70/30 Immersphere/marca)
- [ ] Dashboard para marcas: analytics de uso de sus productos
- [ ] API pública para partners (tasa limitada)

**Entregable:** Marketplace de assets 3D para PropTech.

---

## Calendario visual

```
Jun 2026              Jul 2026              Aug 2026              Sep 2026
├─ Fase 0 ─┤        ├────── Fase 1 ──────┤  ├────── Fase 2 ──────┤  ├─ F3 ─┤
Día 0────7          Día 8────────────30    Día 31────────────60    Día 61──90

Fase 0: ✅ Repo + manifest + viewer + docs
Fase 1: 🔄 Assets reales + demo comercial
Fase 2: 🔄 Integración SaaS (AssetCatalog + hotspots)
Fase 3: 🔄 Inmobiliarias + CRM + 2 marcas
Fase 4: ⏳ Marketplace (futuro)
```

---

## Gates de decisión

| Gate | Cuándo | Decisión |
|---|---|---|
| **Gate 0** | Día 7 | ¿Repo base funciona? → Sí, continuar. |
| **Gate 1** | Día 30 | ¿Tenemos permiso de marca + 5 assets reales? → Sí: Fase 2. No: pivotar a marca alternativa o open source. |
| **Gate 2** | Día 60 | ¿Integración SaaS funciona con assets reales? → Sí: Fase 3. No: quedar como servicio interno. |
| **Gate 3** | Día 90 | ¿Hay demanda comercial + 2 marcas? → Sí: Fase 4. No: consolidar como feature de SaaS. |

---

## Dependencias críticas

| Dependencia | Bloquea | Mitigación |
|---|---|---|
| Permiso IKEA (o marca piloto) | Fase 1 completa | Contactar IKEA Business Sales ya. Fallback: marca más pequeña. |
| Acceso a repo SaaS | Fase 2 | Juanma debe dar acceso a `immersphere-pro`. |
| Recursos 3D artist | QA visual | Contratar freelance o asignar horas internas. |
| Budget desarrollo | Fases 2–4 | Definir presupuesto para 60–90 días de desarrollo. |

---

## Estado actual

- **Fase 0:** ✅ Completada
- **Fase 1:** 🔄 Pendiente de permiso legal
- **Fase 2:** ⏳ Bloqueada por Fase 1
- **Fase 3:** ⏳ Bloqueada por Fase 2
- **Fase 4:** ⏳ Bloqueada por Fase 3

**Próximo paso inmediato:** Contactar IKEA Business Sales España para iniciar negociación de permiso comercial.
