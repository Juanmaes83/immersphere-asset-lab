# Control de Licencias · Immersphere Asset Lab

## Principio fundamental

**Todo asset 3D requiere un registro de licencia antes de cualquier uso.**

Sin documento de autorización, el asset está en estado `unknown` y no puede usarse en producción comercial.

---

## Tipos de licencia

| Tipo | Uso comercial | Redistribución | Reventa | Uso marca | Requiere documento |
|---|---|---|---|---|---|
| `unknown` | ❌ | ❌ | ❌ | ❌ | — |
| `personal-only` | ❌ | ❌ | ❌ | ❌ | Sí (ToS estándar) |
| `editorial` | ⚠️ Solo editorial | ❌ | ❌ | ⚠️ Limitado | Sí |
| `commercial-demo` | ✅ Solo demo interno | ❌ | ❌ | ✅ Limitado | Sí |
| `authorized-commercial` | ✅ Sí | Según contrato | Según contrato | Según contrato | **Sí, firmado** |
| `internal` | ✅ Solo interno | ❌ | ❌ | ❌ | Sí |
| `expired` | ❌ | ❌ | ❌ | ❌ | Requiere renovación |

---

## Permisos por asset (campos booleanos)

### `commercialUseAllowed`
¿Se puede usar este asset en un render, tour o staging comercial para un cliente de Immersphere?

- ✅ `true` — El asset puede aparecer en propiedades de clientes.
- ❌ `false` — Solo uso interno o demo no comercial.

### `redistributionAllowed`
¿Se puede redistribuir el archivo GLB fuera de la plataforma Immersphere?

- ❌ Normalmente `false`. Solo el equipo Immersphere puede acceder al archivo.
- ⚠️ Si `true`, requiere cláusula explícita en contrato.

### `resaleAllowed`
¿Se puede vender el asset como parte de un pack o marketplace?

- ❌ Normalmente `false`.
- ⚠️ Si `true`, requiere acuerdo de revenue share con la marca.

### `brandUsageAllowed`
¿Se puede usar el nombre/logo de la marca en campañas comerciales?

- ⚠️ Normalmente requiere trademark license separado.
- ✅ Si `true`, la campaña puede decir "Amueblado con IKEA".

### `attributionRequired`
¿Se debe mencionar la marca en el entregable?

- ✅ Si `true`, el render/tour debe incluir disclaimer: "Mobiliario [Marca] utilizado bajo licencia comercial".

---

## Permisos por marca (BrandPartner)

Para cada marca con la que se negocie, se crea un registro `BrandPartner` con:

- `name` — Nombre de la marca
- `contractUrl` — URL/ruta al contrato firmado (PDF)
- `contractSignedAt` — Fecha de firma
- `contractExpiresAt` — Fecha de expiración (alerta 30 días antes)
- `commercialUseAllowed` — Permiso global de uso comercial
- `redistributionAllowed` — Permiso global de redistribución
- `resaleAllowed` — Permiso global de reventa
- `status` — `pending`, `active`, `suspended`, `expired`

---

## Documento de autorización (permissionDocumentRef)

Formatos aceptados:
- PDF escaneado del contrato firmado
- Email autorizado de representante legal con poder
- Acuerdo de partnership digital firmado (DocuSign/Adobe Sign)

**NO aceptados:**
- WhatsApp
- SMS
- Llamada verbal
- Email de empleado sin poder de firma

---

## Flujo de aprobación de licencia

```
Asset importado
    ↓
Licencia registrada (licenseType, permisos booleanos)
    ↓
Documento de autorización subido (permissionDocumentRef)
    ↓
Revisión legal (abogado o responsable de compliance)
    ↓
Aprobado → qaStatus: approved
    ↓
Asset disponible para uso en demos y producción
```

---

## Restricciones comunes por marca

| Restricción | Descripción | Ejemplo IKEA |
|---|---|---|
| **Geográfica** | Solo ciertos países | `spain`, `europe` |
| **Temporal** | Fecha de expiración | 31/12/2027 |
| **Sectorial** | Solo ciertos sectores | Inmobiliarias, NO hospitality |
| **Volumétrica** | Límite de renders/propiedades | Máx 100 propiedades/año |
| **Atribución** | Disclaimer obligatorio | "Mobiliario IKEA bajo licencia" |
| **Modificación** | No modificar modelo | No alterar geometría |
| **Standalone** | No usar fuera de contexto | Siempre dentro de escena completa |
