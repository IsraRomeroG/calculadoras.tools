---
title: "Cómo calcular los intereses de un préstamo"
seoTitle: "Cómo calcular intereses de un préstamo: fórmula y ejemplo"
description: "Aprende cómo se calculan los intereses de un préstamo sobre saldo pendiente y cómo estimar el interés total a pagar."
pubDate: 2026-05-06
categorySlug: "finanzas"
tags:
  - intereses
  - préstamo
  - amortización
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de préstamo"
  href: "/finanzas/calculadora-de-prestamo"
---

Los intereses de un préstamo no siempre se calculan sobre el monto original. En muchos esquemas de amortización, se calculan sobre el saldo pendiente. Esa diferencia explica por qué al inicio pagas más intereses y por qué los pagos extra pueden reducir el costo total.

La idea base es sencilla: cada periodo, la institución calcula intereses sobre lo que todavía debes. Después, el resto de la cuota reduce capital.

## Diferencia entre interés mensual e interés total

El interés mensual es el costo financiero de un periodo específico. El interés total es la suma de todos los intereses pagados durante la vida del préstamo.

Por ejemplo, en un préstamo de `$50,000` a `24%` anual y `24 meses`, el interés del primer mes puede ser `$1,000`, pero el interés total durante todo el plazo sería aproximadamente `$13,445.32`.

La diferencia aparece porque cada mes cambia el saldo pendiente.

## Fórmula para calcular intereses del mes

La fórmula básica es:

```txt
interés del mes = saldo pendiente x tasa mensual
```

Si la tasa anual es de `24%`, una conversión mensual simple para la simulación sería:

```txt
24% / 12 = 2% mensual
2% = 0.02
```

Entonces, si el saldo pendiente es de `$50,000`:

```txt
interés del mes = 50000 x 0.02
interés del mes = 1000
```

## Ejemplo con saldo pendiente

Supongamos un préstamo de `$50,000`, tasa anual de `24%` y cuota mensual estimada de `$2,643.55`.

En el primer mes:

```txt
saldo inicial = 50000
interés = 50000 x 0.02 = 1000
capital = 2643.55 - 1000 = 1643.55
saldo nuevo = 50000 - 1643.55 = 48356.45
```

En el segundo mes, el interés ya no se calcula sobre `$50,000`, sino sobre `$48,356.45`:

```txt
interés = 48356.45 x 0.02 = 967.13
```

Así, cada mes baja el interés y sube el abono a capital, siempre que la cuota se mantenga fija y no cambien las condiciones.

## Por qué los intereses bajan en una tabla de amortización

La [tabla de amortización](/blog/finanzas/tabla-amortizacion-prestamo) deja ver este movimiento con claridad. Al inicio, el saldo pendiente es alto, así que el interés del mes también es alto. Conforme pagas capital, el saldo disminuye.

En el ejemplo anterior, los primeros meses se comportan así:

| Mes | Pago | Capital | Intereses | Saldo pendiente |
|---:|---:|---:|---:|---:|
| 1 | $2,643.55 | $1,643.55 | $1,000.00 | $48,356.45 |
| 2 | $2,643.55 | $1,676.43 | $967.13 | $46,680.02 |
| 3 | $2,643.55 | $1,709.95 | $933.60 | $44,970.06 |

Esto no significa que te estén cobrando "intereses por adelantado". Significa que el interés se calcula sobre un saldo que al principio es mayor.

## Cómo calcular el interés total del préstamo

Para estimar el interés total, suma los intereses de todos los periodos. En una hoja de cálculo o tabla de amortización, sería la suma de la columna "Intereses".

También puedes estimarlo así:

```txt
interés total = total pagado en cuotas - capital recibido
```

Si no hay seguros ni cargos integrados en las cuotas:

```txt
interés total = 63445.32 - 50000
interés total = 13445.32
```

Si hay seguro mensual, el total pagado en cuotas ya incluye ese seguro, así que conviene separar intereses y seguros para no confundirlos.

## Cómo reducir intereses con pagos extra

Un pago extra puede reducir intereses si se aplica a capital. Al bajar el saldo pendiente antes de tiempo, los intereses de los meses siguientes se calculan sobre una base menor.

Por ejemplo, con un préstamo de `$50,000` a `24%` anual y `24 meses`, la cuota base estimada es `$2,643.55`. Si además haces un pago extra mensual de `$1,000`, el plazo podría bajar a `17 meses` y el ahorro estimado en intereses sería de aproximadamente `$4,407.89`.

Antes de hacerlo, revisa si tu contrato permite pagos anticipados, si hay comisiones y si el pago se aplicará a capital. Puedes simularlo en la [calculadora de préstamo](/finanzas/calculadora-de-prestamo) usando el campo de pago extra mensual.

## Preguntas frecuentes

### Los intereses se calculan sobre el monto inicial o el saldo pendiente?

En muchos préstamos amortizables se calculan sobre el saldo pendiente. Aun así, revisa las condiciones del producto porque pueden existir esquemas distintos.

### Cómo convierto tasa anual a mensual?

Para una estimación simple, divide la tasa anual entre 12. Por ejemplo, 24% anual equivale a 2% mensual aproximado. Para más detalle, revisa [tasa anual, mensual y diaria](/blog/finanzas/tasa-anual-mensual-diaria-prestamo).

### Por qué pago más intereses al inicio?

Porque al inicio debes más capital. El interés se calcula sobre un saldo pendiente alto, y ese saldo baja gradualmente.

### Un pago extra reduce intereses?

Sí, si se aplica a capital y no hay penalizaciones que anulen el beneficio. El ahorro depende de la tasa, el plazo y el momento del pago.

## Fuentes consultadas

- [Banxico: Calculadora del Costo Anual Total](https://www.banxico.org.mx/CAT/Calculo_CAT.jsp)
- [CONDUSEF: Simulador de Crédito Personal y Nómina](https://phpapps.condusef.gob.mx/condusef_personalnomina/)
