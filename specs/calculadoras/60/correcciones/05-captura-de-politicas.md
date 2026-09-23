# Captura manual de justificadas y retardos

## Problema

La interfaz permite elegir una política para faltas justificadas y retardos, pero
en el origen de totales manuales no permite introducir la cantidad `J` de
justificadas ni `L` de retardos. La política seleccionada queda sin efecto o puede
crear una expectativa falsa.

## Requisito

Cuando el origen sea manual, añadir campos explícitos y opcionales para:

- faltas justificadas `J`, entero `0..F`;
- clases con retardo `L`, entero `0..A`;
- mantener la regla `k` de conversión de retardos, entero `1..100`, o desactivada.

Los campos deben:

- pertenecer a la materia activa;
- guardarse y restaurarse junto con las demás entradas;
- validarse solo cuando sean relevantes para el origen seleccionado;
- mostrar errores asociados y límites en ES/EN;
- no cambiar los totales originales, solo su interpretación efectiva.

En origen calendario, `J` y `L` deben derivarse de los eventos y no duplicarse con
campos manuales. Cambiar de origen debe conservar cada conjunto separado y usar solo
el origen activo.

## Reglas

- Justificadas en modo base: cuentan como faltas.
- Exclusión: `T' = T - J`, `A' = A`.
- Crédito: `T' = T`, `A' = A + J`.
- Retardos: descontar `floor(L/k)` de asistencias efectivas y mostrar `L mod k`.
- Nunca permitir que una clase sea simultáneamente falta y retardo.

## Aceptación

1. `T=10, A=8, J=1` produce 80% en base, `8/9` en exclusión y 90% en crédito.
2. `T=10, A=9, L=3, k=3` produce 80% efectiva.
3. `L=2, k=3` no descuenta ninguna asistencia.
4. `J>F`, `L>A`, fracciones, signos y valores fuera de límites producen errores.
5. Cambiar de manual a calendario no suma `J` o `L` manuales a los eventos.
6. Historial y CSV incluyen las entradas/política usadas para interpretar el resultado.
