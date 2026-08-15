---
title: "Cómo calcular la cuota mensual de un préstamo"
seoTitle: "Cómo calcular la cuota mensual de un préstamo: fórmula y ejemplo"
description: "Aprende cómo se calcula la mensualidad de un préstamo con monto, tasa anual y plazo, y revisa un ejemplo paso a paso."
pubDate: 2026-04-22
categorySlug: "finanzas"
translationKey: "calculate-monthly-loan-payment"
tags:
  - préstamo
  - cuota mensual
  - amortización
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de préstamo"
  href: "/finanzas/calculadora-de-prestamo"
---

Calcular la cuota mensual de un préstamo te ayuda a responder la pregunta más inmediata: si pides cierta cantidad de dinero, cuánto tendrías que pagar cada mes. Pero esa mensualidad no cuenta toda la historia. Para comparar bien también conviene revisar intereses totales, comisiones, seguros y costo total.

En esta guía veremos la fórmula de cuota fija, un ejemplo con $50,000 y las razones por las que la mensualidad de una oferta real puede cambiar frente a una simulación.

## Qué datos necesitas

Para estimar la mensualidad básica necesitas tres datos:

- Monto del préstamo.
- Tasa de interés anual.
- Plazo en meses.

Con esos datos se calcula una cuota base que combina capital e intereses. Si el crédito además tiene comisión por apertura, seguro mensual u otro cargo, esos costos deben revisarse por separado o agregarse al escenario.

Si ya tienes una oferta formal, revisa también el CAT, el pago total y la tabla de amortización. La CONDUSEF recomienda comparar no solo la tasa de interés, sino también el pago total y el Costo Anual Total cuando evalúas créditos.

## Fórmula para calcular la cuota mensual

La fórmula más común para un préstamo con cuota fija es:

```txt
cuota = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

Donde:

| Variable | Significado |
|---|---|
| `P` | Monto del préstamo |
| `r` | Tasa mensual en decimal |
| `n` | Número de pagos mensuales |

Esta fórmula asume un esquema de amortización con pagos periódicos iguales. En cada pago una parte cubre intereses y otra reduce capital. Al inicio suele pagarse más interés porque el saldo pendiente es mayor.

## Cómo convertir la tasa anual a mensual

Si la tasa está expresada como tasa anual simple para la simulación, puedes estimar la tasa mensual dividiéndola entre 12:

```txt
tasa mensual = tasa anual / 12
```

Por ejemplo:

```txt
24% anual / 12 = 2% mensual
2% = 0.02
```

La parte importante es usar la tasa mensual en decimal dentro de la fórmula. Si escribes `2` en vez de `0.02`, el resultado se dispara.

## Ejemplo: préstamo de 50000 a 24 meses

Supongamos este escenario:

- Monto: `$50,000`
- Tasa anual: `24%`
- Plazo: `24 meses`
- Tasa mensual: `2%`

Con esos datos, la cuota mensual base es aproximadamente:

```txt
cuota mensual = $2,643.55
```

Al terminar los 24 meses, el total pagado en cuotas sería de aproximadamente `$63,445.32`. De ese total, `$50,000` corresponden al capital original y cerca de `$13,445.32` a intereses.

Este resultado no incluye comisión por apertura ni seguro mensual. Si el préstamo tuviera, por ejemplo, una comisión de 2%, habría que sumar `$1,000` como costo inicial. Si además tuviera un seguro de `$200` al mes, el pago mensual total subiría a `$2,843.55`.

Puedes probar esos mismos datos en la [calculadora de préstamo](/finanzas/calculadora-de-prestamo) para ver la mensualidad, el costo total y la tabla de amortización completa.

## Por qué la cuota no siempre es el costo total

La cuota mensual responde cuánto pagas cada periodo, pero no siempre responde cuánto cuesta realmente el crédito. Dos préstamos pueden tener la misma mensualidad aproximada y costos totales distintos si cambian las comisiones, seguros o condiciones de pago anticipado.

Por eso conviene revisar:

- Cuota mensual base.
- Pago mensual total con seguros.
- Comisión por apertura.
- Total pagado en cuotas.
- Total de intereses.
- Costo total del crédito.
- CAT informado por la institución.

El CAT ayuda a comparar créditos porque resume costos bajo una metodología estandarizada. Aun así, el CAT exacto depende de la institución y de los supuestos aplicables al producto. Una calculadora independiente puede darte una estimación útil, pero no sustituye la carátula ni el contrato del crédito.

## Calcula tu cuota automáticamente

La forma más rápida de evitar errores de tasa, plazo o redondeo es usar la [calculadora de préstamo](/finanzas/calculadora-de-prestamo). Puedes capturar monto, tasa anual y plazo, y también sumar comisión por apertura, seguro mensual o pago extra.

La herramienta muestra la cuota base, el pago mensual total, intereses, costo total y una tabla de amortización. Si estás comparando ofertas, también puedes revisar la guía sobre [CAT vs tasa de interés](/blog/finanzas/cat-vs-tasa-interes) y la explicación de [cómo calcular intereses de un préstamo](/blog/finanzas/como-calcular-intereses-prestamo).

## Preguntas frecuentes

### Qué datos necesito para calcular la cuota mensual?

Necesitas el monto del préstamo, la tasa de interés anual y el plazo en meses. Para una estimación más realista también conviene agregar comisión por apertura y seguro mensual si existen.

### La tasa anual se divide entre 12?

Para una estimación mensual simple, sí: una tasa anual de 24% se convierte en 2% mensual. Algunas instituciones pueden usar metodologías específicas, así que para una oferta formal revisa la información del crédito.

### La cuota incluye seguro y comisión?

La cuota base normalmente considera capital e intereses. El seguro mensual se puede sumar al pago de cada mes y la comisión por apertura puede cobrarse al inicio o financiarse, según el contrato.

### Por qué mi banco muestra una cuota distinta?

Puede deberse a comisiones, seguros, impuestos, periodicidad de pago, fecha de corte, método de cálculo o redondeos. Usa la simulación como referencia y compárala con la carátula del crédito.

## Fuentes consultadas

- [Banxico: Calculadora del Costo Anual Total](https://www.banxico.org.mx/CAT/Calculo_CAT.jsp)
- [CONDUSEF: Simulador de Crédito Personal y Nómina](https://phpapps.condusef.gob.mx/condusef_personalnomina/)
- [CONDUSEF: comparación de crédito personal y de nómina](https://www.condusef.gob.mx/?idc=1295&idcat=1&p=contenido)
