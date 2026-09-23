# Historial versionado en `sessionStorage`

## Problema

El lector de historial rechaza cualquier snapshot cuyo esquema o versión de reglas
no coincida exactamente con la versión actual. Eso impide distinguir un resultado
histórico de su recálculo actual y hace inútil la versionación declarada.

## Requisito de lectura

El lector debe aceptar snapshots de versiones estructuralmente compatibles y
conservar sus campos `schemaVersion` y `rulesVersion`. Debe distinguir:

- snapshot con esquema incompatible: se rechaza de forma segura;
- snapshot con esquema compatible pero reglas antiguas: se muestra como histórico;
- snapshot con esquema y reglas actuales: se muestra como vigente.

Una versión de reglas diferente no debe romper la lectura ni eliminar silenciosamente
el snapshot. Si no es posible migrarla, debe seguir siendo consultable como resultado
histórico y no debe presentarse como recalculado actual.

## Restauración

Restaurar siempre debe:

1. cargar las entradas guardadas mediante una acción explícita;
2. recalcular con las reglas actuales;
3. distinguir visualmente el resultado histórico almacenado del resultado recalculado,
   cuando las versiones difieran;
4. validar otra vez los datos antes de alimentar el motor.

El resultado histórico no debe sobreescribir el resultado activo sin la acción de
restaurar.

## Seguridad y tolerancia

- Validar esquema, tipos, límites, política, eventos, IDs y nombres al leer.
- Rechazar o aislar snapshots corruptos sin impedir el cálculo actual.
- No ejecutar contenido guardado ni insertarlo como HTML.
- Usar únicamente `sessionStorage` para historial; no usar `localStorage` como
  fallback silencioso.
- Mantener máximo 50 snapshots y pedir borrar uno antes de guardar el número 51.

## Aceptación

1. Un snapshot con `rulesVersion` antigua se lista con una marca de reglas históricas.
2. Restaurarlo recalcula con las reglas actuales y conserva una indicación de que
   difiere del resultado guardado.
3. Un snapshot con esquema incompatible o datos corruptos no rompe la calculadora.
4. Un historial lleno no elimina snapshots automáticamente.
5. Borrar todo elimina únicamente la clave de historial de esta calculadora.
