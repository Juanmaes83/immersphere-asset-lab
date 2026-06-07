# Ingesta Manual de Assets · Immersphere Asset Lab

## Visión

Este documento describe el flujo repetible para añadir assets 3D reales al catálogo de Immersphere Asset Lab de forma controlada, segura y trazable.

**Regla de oro:** Los archivos `.glb` **nunca** se suben a Git. Solo metadata, código y documentación viajan por Git.

---

## Flujo paso a paso

### 1. Descargar GLB autorizado

- Obtén el modelo 3D directamente de la marca con permiso explícito.
- Valida que tienes derecho de uso comercial antes de descargar.
- NO descargues sin permiso documentado.

### 2. Renombrar con naming estándar

Convierte el nombre original a formato limpio:

```
{brand}-{product}-{category}-{color-variant}.glb
```

Ejemplo:
```
VITTSKÄR silla con reposabrazos - ratán de plástico exterior gris oscuro.glb
↓
vittskar-armchair-outdoor-dark-grey.glb
```

Reglas:
- Todo en minúsculas.
- Sin espacios (usa guiones).
- Sin acentos ni caracteres especiales.
- Incluye SKU si es útil: `vittskar-20575167-armchair.glb`.

### 3. Colocar en carpeta de marca/categoría

```
assets/{brand}/{category}/
```

Ejemplo:
```
assets/ikea/chairs/vittskar-armchair-outdoor-dark-grey.glb
```

Crea la carpeta si no existe:
```bash
mkdir -p assets/ikea/chairs
```

### 4. Crear metadata JSON

Copia la plantilla:
```bash
cp templates/asset-metadata.template.json mi-asset.json
```

Rellena todos los campos. Referencia rápida:

| Campo | Qué poner | Ejemplo |
|---|---|---|
| `id` | único, descriptivo | `ikea-vittskar-armchair-outdoor-dark-grey-20575167` |
| `sku` | SKU interno Immersphere | `20575167` |
| `modelPath` | ruta relativa al GLB | `assets/ikea/chairs/vittskar-armchair-outdoor-dark-grey.glb` |
| `hasRealModel` | `true` si hay GLB real | `true` |
| `isPlaceholder` | `false` si hay GLB real | `false` |
| `fileSizeMb` | tamaño en MB (redondeado) | `2.2` |
| `dimensions` | ancho × alto × fondo en cm | `{"width": 64, "height": 95, "depth": 59, "unit": "cm"}` |
| `licenseType` | tipo de licencia | `authorized-commercial-demo` |
| `permissionDocumentRef` | ref al permiso | `permissions/README.md` |
| `capturedAt` | ISO 8601 | `2026-06-07T12:00:00Z` |

### 5. Ejecutar ingesta

```bash
npm run ingest -- --metadata mi-asset.json
```

El script validará:
- Campos obligatorios.
- Unicidad de `id` y `sku`.
- Existencia del GLB en disco.
- Coherencia de `fileSizeMb`.
- Que el GLB no esté trackeado por Git.
- Reglas de licencia.

### 6. Validar manifest

```bash
npm run check
```

Debe mostrar:
```
✅ ALL CHECKS PASSED
   N item(s) validated
   N unique id(s)
   N unique sku(s)
```

### 7. Ejecutar preflight de seguridad

```bash
npm run preflight
```

Debe mostrar:
```
✅ ALL PREFLIGHT CHECKS PASSED — Safe to commit.
```

### 8. Probar en viewer local

```bash
npm start
```

Abre: http://localhost:3456/viewer/

Verifica:
- El asset aparece en el grid.
- El badge "Real Model" está visible.
- Al abrir la ficha, el modelo 3D se carga.
- Se puede rotar y hacer zoom.
- Los placeholders siguen funcionando.

### 9. Verificar que GLB no está en Git

```bash
git ls-files | grep -i '\.glb'
```

**Debe devolver vacío.** Si devuelve algo, NO hagas commit. Revisa `.gitignore`.

### 10. Commit controlado

```bash
git add manifest/ikea-sample.manifest.json
# Si modificaste viewer/docs/scripts, añádelos también:
git add viewer/ docs/ scripts/ templates/ package.json README.md
# NO hagas:
# git add assets/**/*.glb   ← ESTO ESTÁ PROHIBIDO

git commit -m "ingest: add {brand} {product} (SKU {sku})"
```

---

## Checklist rápido de ingesta

- [ ] GLB descargado con permiso.
- [ ] Nombre limpio (`brand-product-category-color.glb`).
- [ ] Ubicado en `assets/{brand}/{category}/`.
- [ ] Metadata JSON creada desde plantilla.
- [ ] `npm run ingest` pasó sin errores.
- [ ] `npm run check` pasó.
- [ ] `npm run preflight` pasó.
- [ ] Viewer local muestra el modelo 3D.
- [ ] `git ls-files | grep -i '\.glb'` devuelve vacío.
- [ ] Commit solo de metadata/código/documentación.

---

## ⚠️ NO HACER

| Prohibición | Por qué |
|---|---|
| **Subir GLB desde GitHub web** (`Add file → Upload files`) | GitHub no es storage de binarios pesados. Rompe el repo. |
| **Usar `git add` para archivos `.glb`** | Los GLB deben permanecer locales. |
| **Modificar `.gitignore` para permitir GLB** | Destruiría la protección del repo. |
| **Meter contratos privados en `permissions/` sin cuidado** | Los PDF de contratos pueden contener PII. |
| **Usar assets sin permiso registrado** | Riesgo legal para Immersphere y el cliente. |
| **Ingestar sin `npm run preflight`** | Puede dejar el repo en estado inseguro. |
| **Hacer push con errores de preflight** | Puede subir metadata inválida o binarios. |

---

## Solución de problemas

### "Duplicate id" al ingestar
El `id` ya existe en el manifest. Usa uno único, por ejemplo añadiendo fecha o SKU.

### "GLB not found on disk"
El `modelPath` en el JSON no coincide con la ruta real. Verifica:
```bash
ls assets/marca/categoria/archivo.glb
```

### "fileSizeMb mismatch"
El tamaño declarado difiere del real en más de 1 MB. Actualiza el campo en el JSON.

### Preflight falla por "commercialUseAllowed=true but no permissionDocumentRef"
Añade `permissionDocumentRef` apuntando al contrato o a `permissions/README.md` si aún no hay contrato firmado.

### El modelo no carga en el viewer
- Verifica que `npm start` está corriendo.
- Abre DevTools → Network y busca el request al `.glb`.
- Verifica que la ruta es accesible: `http://localhost:3456/assets/.../archivo.glb`.
- Comprueba que el archivo no esté corrupto.

---

## Referencias

- `templates/asset-metadata.template.json` — Plantilla de metadata.
- `scripts/ingest-asset.js` — Script de ingesta.
- `scripts/preflight-assets.js` — Script de seguridad pre-commit.
- `scripts/validate-manifest.js` — Validador de manifest.
- `docs/qa-checklist.md` — Checklist completo de QA.
- `docs/licensing-guide.md` — Guía de licencias.
