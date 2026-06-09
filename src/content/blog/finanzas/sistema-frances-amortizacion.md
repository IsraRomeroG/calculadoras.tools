---
title: "Sistema francés de amortización: explicación fácil"
seoTitle: "Sistema francés de amortización: cuota fija, intereses y capital"
description: "Entiende cómo funciona el sistema francés de amortización, por qué la cuota es fija y cómo cambia la mezcla de capital e intereses."
pubDate: 2026-05-31
categorySlug: "finanzas"
tags:
  - sistema francés
  - amortización
  - préstamo
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de préstamo"
  href: "/finanzas/calculadora-de-prestamo/"
---

El sistema francés de amortización es un método de pago en el que la cuota se mantiene fija durante el plazo, siempre que la tasa y las condiciones no cambien. Cada cuota combina intereses y capital, pero la proporción cambia mes a mes.

La [calculadora de préstamo](/finanzas/calculadora-de-prestamo/) usa este esquema como supuesto principal para estimar la mensualidad y construir la tabla de amortización.

## Qué es el sistema francés

En el sistema francés, el préstamo se paga con cuotas iguales. Al inicio, una parte mayor de la cuota va a intereses porque el saldo pendiente es alto. Conforme el saldo baja, los intereses disminuyen y más dinero se aplica a capital.

Esto permite tener una mensualidad predecible, aunque el desglose interno de cada pago cambie.

No todos los créditos usan exactamente este sistema. Algunas instituciones pueden usar otros métodos, periodicidades o condiciones, así que siempre revisa la tabla formal del crédito.

## Por qué la cuota se mantiene fija

La cuota se calcula con una fórmula que distribuye el capital y los intereses durante todos los periodos:

```txt
cuota = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

Donde:

- `P` es el monto del préstamo.
- `r` es la tasa mensual en decimal.
- `n` es el número de pagos.

La fórmula busca que, si pagas cada cuota completa, el saldo llegue a cero al final del plazo.

## Por qué al inicio pagas más intereses

El interés de cada periodo se calcula sobre el saldo pendiente:

```txt
interés del mes = saldo pendiente x tasa mensual
```

Al inicio debes casi todo el préstamo, así que el interés del mes es mayor. Después de cada pago, el saldo baja y el interés del siguiente mes también baja.

Esto se ve mejor en una [tabla de amortización](/blog/finanzas/tabla-amortizacion-prestamo/), donde cada fila muestra pago, capital, intereses y saldo pendiente.

## Ejemplo con tabla de 3 meses

Supongamos un préstamo de `$50,000`, tasa anual de `24%` y plazo de `24 meses`. La cuota mensual estimada es `$2,643.55`.

| Mes |     Cuota |   Capital | Intereses | Saldo pendiente |
| --: | --------: | --------: | --------: | --------------: |
|   1 | $2,643.55 | $1,643.55 | $1,000.00 |      $48,356.45 |
|   2 | $2,643.55 | $1,676.43 |   $967.13 |      $46,680.02 |
|   3 | $2,643.55 | $1,709.95 |   $933.60 |      $44,970.06 |

La cuota es igual, pero el capital sube y el interés baja. Esa es la señal típica del sistema francés.

## Diferencia frente a otros sistemas

En otros esquemas, la cuota puede no ser fija. Por ejemplo, si el abono a capital fuera constante, la mensualidad podría empezar más alta y bajar con el tiempo porque los intereses disminuyen.

El sistema francés prioriza pagos iguales. Eso lo hace fácil de presupuestar, aunque al inicio la deuda pueda parecer lenta de bajar.

## Cómo lo usa la calculadora

Cuando capturas monto, tasa y plazo, la [calculadora de préstamo](/finanzas/calculadora-de-prestamo/) estima una cuota fija base. Luego suma seguro mensual o pago extra si los agregas.

También calcula la tabla mes a mes para que puedas ver:

- Cuánto pagas de capital.
- Cuánto pagas de intereses.
- Cuánto queda de saldo.
- Cómo cambia el plazo si haces pagos extra.

Si quieres repasar la fórmula paso a paso, lee [cómo calcular la cuota mensual de un préstamo](/blog/finanzas/como-calcular-cuota-mensual-prestamo/) y [cómo calcular intereses de un préstamo](/blog/finanzas/como-calcular-intereses-prestamo/).

## Preguntas frecuentes

### Qué significa sistema francés?

Es un método de amortización con cuota fija. Cada pago combina capital e intereses, y la mezcla cambia conforme baja el saldo.

### El sistema francés cobra intereses al inicio?

No cobra todos los intereses al inicio. Lo que ocurre es que al principio el saldo pendiente es mayor, por eso el interés del mes también es mayor.

### Es lo mismo que saldos insolutos?

Está relacionado. En este tipo de cálculo, los intereses se estiman sobre el saldo pendiente o insoluto.

### Todos los préstamos usan sistema francés?

No necesariamente. Muchos créditos usan esquemas de cuota fija, pero siempre debes revisar la tabla y contrato de tu institución.

## Fuentes consultadas

- [Banxico: Calculadora del Costo Anual Total](https://www.banxico.org.mx/CAT/Calculo_CAT.jsp)
- [CONDUSEF: Simulador de Crédito Personal y Nómina](https://phpapps.condusef.gob.mx/condusef_personalnomina/)
