# Políticas, recuperación y precisión

## Problemas

La recuperación de fase 2 usa siempre la fórmula exacta, aunque la política active
redondeo institucional. Además, la API de fase 2 redondea porcentajes numéricos con
más de cuatro decimales en vez de rechazarlos.

## Contrato de porcentaje

Todo punto de entrada que acepte un porcentaje debe compartir el contrato de la
spec 02:

- rango `0..100`;
- máximo de cuatro decimales;
- sin signos, exponentes, separadores de miles ni valores no finitos;
- representación escalada determinista `P`;
- un valor numérico como `80.12345` debe producir error, no convertirse en `80.1235`.

Si se acepta un objeto de porcentaje, deben validarse conjuntamente `value`,
`scaled` y la representación textual normalizada. No basta con confiar en `scaled`.

## Predicado común

La política debe exponer un predicado único `meetsPolicy(attended, total)` y usarlo
para estado actual, mínimo final, disponibilidad, imposibilidad y recuperación.

Para política exacta se conserva la aritmética racional de la spec 02. Para una
política con redondeo, la recuperación debe obtener el menor `n >= 0` que satisfaga:

```text
meetsPolicy(attended + n, total + n)
```

La búsqueda puede ser analítica o monotónica con duplicación y búsqueda binaria,
pero no puede tener un límite artificial de 1000.

La regla de recuperación imposible para 100% con faltas solo aplica a la política
exacta. Una política de redondeo puede alcanzar una evaluación de 100% aunque el
porcentaje real sea menor.

## Casos mínimos

- `T=2, A=1, p=66.67`, redondeo a 2 decimales: recuperación `1`.
- `T=2, A=1, p=66.67`, política exacta: recuperación `2`.
- `T=3, A=2, p=100`, redondeo a 0 decimales: recuperación finita; no devolver
  automáticamente `impossible`.
- `T=1000, A=0, p=99.9999`, política exacta: conservar recuperación `999999000`.
- `80.12345`, `80.00000` y valores no finitos: error de precisión/formato.

## Aceptación

1. El mismo predicado decide el estado actual, el estado final y la recuperación.
2. Las pruebas de política cubren mínimos `0`, `100`, redondeos de 0/1/2 decimales,
   denominadores efectivos cero y retardos.
3. Ningún adaptador numérico acepta más precisión que el parser textual.
4. El resultado exportado conserva la política y la recuperación calculadas con esa
   política.
