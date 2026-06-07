# QA Checklist · Immersphere Asset Lab

## Pre-ingesta (antes de subir el asset)

- [ ] **Permiso verificado.** El asset tiene documento de autorización o licencia clara.
- [ ] **SKU único.** No hay colisión con otro asset en el catálogo.
- [ ] **Metadata completa.** Todos los campos obligatorios del schema están rellenos.
- [ ] **Categoría correcta.** La categoría ICS coincide con el tipo de producto.

---

## Validación técnica (automática)

- [ ] **GLB válido.** El archivo pasa `gltf-transform validate` sin errores críticos.
- [ ] **No es ejecutable.** MIME type es `model/gltf-binary` o `model/gltf+json`.
- [ ] **Sin malware.** El archivo no contiene scripts embebidos (JS en GLB).
- [ ] **Texturas presentes.** Si el modelo debería tener texturas, están incluidas.
- [ ] **Sin geometría corrupta.** No hay NaNs, Infinity, o índices fuera de rango.

---

## QA visual (manual)

- [ ] **Abre correctamente.** El modelo se ve bien en model-viewer / Three.js / Blender.
- [ ] **Escala correcta.** Las dimensiones coinciden con el producto real (cm).
- [ ] **Proporciones realistas.** No está deformado ni escala uniforme incorrecta.
- [ ] **Texturas visibles.** Los materiales se ven correctos (no grises, no missing).
- [ ] **UVs correctas.** Las texturas se mapean bien (no stretching, no flipping).
- [ ] **Sin artefactos.** No hay z-fighting, holes, o geometría flotante.
- [ ] **Orientación correcta.** El modelo está en posición natural (sofa horizontal, lámpara vertical).
- [ ] **Centrado en origen.** El pivot está razonablemente centrado para facilitar colocación.

---

## Rendimiento

- [ ] **Peso aceptable.**
  - Ideal: < 5 MB
  - Aceptable: < 15 MB
  - Máximo: < 50 MB (requiere justificación)
- [ ] **Polygon count razonable.**
  - Decoración pequeña: < 5k polígonos
  - Silla / mesa: < 15k polígonos
  - Sofá / cama: < 30k polígonos
  - Armario grande: < 50k polígonos
- [ ] **Draw calls mínimos.** Preferiblemente un solo mesh o pocos sub-meshes.
- [ ] **Texturas optimizadas.**
  - Máximo 2048×2048
  - Preferible 1024×1024 o menor
  - Formatos comprimidos (WebP, KTX2 si aplica)

---

## Metadata y licencia

- [ ] **Nombre correcto.** El `productName` coincide con el catálogo de la marca.
- [ ] **SKU real.** El `externalSku` coincide con el SKU de la marca (si aplica).
- [ ] **Color y material.** Coinciden con la variante del producto.
- [ ] **Dimensiones registradas.** Las dimensiones en el manifest coinciden con las del modelo 3D.
- [ ] **Licencia registrada.** `licenseType` y permisos booleanos están configurados.
- [ ] **Documento vinculado.** `permissionDocumentRef` apunta al contrato/documento correcto.
- [ ] **Preview generada.** Thumbnail existe y representa el modelo.

---

## Aprobación final

- [ ] **QA reviewer asignado.** Alguien ha revisado visualmente el asset.
- [ ] **Notas de QA.** `qaNotes` documenta cualquier observación.
- [ ] **Estado actualizado.** `qaStatus` cambia a `approved`.
- [ ] **Fecha de aprobación.** `optimizedAt` registra la fecha.
- [ ] **Asset movido.** El archivo está en su ubicación definitiva (no en `/tmp` ni `/downloads`).

---

## Rechazo

Si el asset NO pasa QA:
- [ ] `qaStatus` → `rejected`
- [ ] `qaNotes` explica el motivo del rechazo
- [ ] Notificación al responsable de captura
- [ ] Si es corregible: vuelve a `pending` tras corrección
- [ ] Si no es corregible: se descarta y se registra en `notes`
