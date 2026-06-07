# Permisos y Licencias · Immersphere Asset Lab

## Regla de oro

**Ningún asset se procesa, visualiza ni se usa comercialmente sin permiso legal escrito verificado.**

Este directorio contiene la documentación contractual de los permisos de uso de assets 3D.

---

## Estructura de permisos por marca

```
permissions/
├── README.md                    ← Este archivo
├── .gitkeep                     ← Mantiene directorio en Git
├── {brand-name}/                ← Un subdirectorio por marca
│   ├── contract.pdf             ← Contrato firmado
│   ├── email-confirmation.pdf   ← Email autorizando el uso
│   ├── addendum-{date}.pdf      ← Añadidos o extensiones
│   └── README.md                ← Resumen del alcance del permiso
└── ...
```

---

## Estado de permisos por marca

| Marca | Estado | Permiso comercial | Redistribución | Reventa | Documento | Vigente hasta |
|---|---|---|---|---|---|---|
| IKEA | `pending` | — | — | — | — | — |
| ... | — | — | — | — | — | — |

**Leyenda:**
- `pending`: negociación en curso, sin permiso todavía
- `active`: permiso vigente, se pueden usar assets
- `expired`: permiso caducado, revisar renovación
- `suspended`: permiso suspendido temporalmente

---

## Tipos de permisos

### 1. Uso comercial en renders (`commercial-use`)
Permite usar el modelo 3D en renders y visualizaciones para clientes finales.

### 2. Redistribución en tours (`redistribution`)
Permite incluir el modelo en tours 3D entregables al cliente.

### 3. Reventa como pack (`resale`)
Permite vender el modelo como parte de un pack de assets (requiere licencia especial).

### 4. Uso de marca (`brand-usage`)
Permite mostrar el logo/nombre de la marca en el catálogo y en los renders.

---

## Checklist antes de importar cualquier asset

- [ ] ¿Existe un `PermissionDocument` activo para esta marca?
- [ ] ¿El permiso cubre el SKU/producto específico?
- [ ] ¿El permiso cubre el territorio geográfico del proyecto?
- [ ] ¿El permiso cubre el tipo de uso (render, tour, reventa)?
- [ ] ¿El permiso no ha expirado?
- [ ] ¿Se ha subido el documento a `permissions/{brand}/`?

---

## Riesgos legales detectados

### IKEA
- **Términos de Servicio de IKEA Home Planner:** prohiben extracción standalone, uso comercial sin permiso, ingeniería inversa.
- **Conclusión:** NO usar sin contrato firmado con IKEA Business Sales.
- **Ruta recomendada:** contactar `ikea.es/business` para programa de partners.

---

## Proceso de negociación

1. **Identificar contacto:** Business Sales o Partnerships de la marca.
2. **Enviar brief:** Explicar quién es Immersphere, qué hacemos, cómo usamos los assets.
3. **Solicitar permiso:** Uso comercial en renders y tours para inmobiliarias.
4. **Negociar alcance:** Territorio, duración, tipos de uso, revenue share.
5. **Obtener documento firmado:** Contrato, email autorizado, o addendum.
6. **Subir a este directorio:** Guardar PDF + actualizar tabla de estado.
7. **Actualizar assets:** Marcar assets con `licenseType: authorized-commercial`.

---

## Contactos de marcas (plantilla)

```markdown
### IKEA España
- **Web:** https://www.ikea.es/business
- **Email:** business@ikea.es (verificar)
- **Contacto:** —
- **Estado:** Sin contactar todavía
- **Notas:** Programa de Business Sales existe. Requiere registro como empresa.
```

---

## Documentación relacionada

- `docs/licensing-guide.md` — Guía completa de licencias 3D
- `docs/workflow.md` — Workflow de aprobación legal
- `manifest/manifest.schema.json` — Schema con campos de licencia
