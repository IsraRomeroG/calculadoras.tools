---
title: "Tabla de amortización de una hipoteca: qué es y cómo leerla"
seoTitle: "Tabla de amortización hipotecaria: capital, intereses y saldo"
description: "Conoce qué muestra una tabla de amortización hipotecaria, cómo se divide cada pago entre capital e intereses y cómo usarla para comparar escenarios."
pubDate: 2026-05-28
categorySlug: "inmuebles"
tags:
  - amortización
  - hipoteca
  - intereses
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca/"
---

Una tabla de amortización hipotecaria muestra cómo se paga una hipoteca mes a mes. No solo indica la mensualidad: separa cuánto va a intereses, cuánto reduce capital y cuánto queda como saldo pendiente después de cada pago.

Esto ayuda a entender por qué una hipoteca puede sentirse lenta al inicio. En los primeros meses, una parte importante del pago se destina a intereses porque el saldo pendiente todavía es alto.

## Qué es una tabla de amortización hipotecaria

La amortización es el proceso de pagar una deuda con pagos periódicos. En una hipoteca de cuota fija, el pago mensual base se mantiene estable si la tasa no cambia, pero la mezcla interna sí cambia:

- Al inicio se paga más interés.
- Con el tiempo aumenta el abono a capital.
- El saldo pendiente baja después de cada pago.

La [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca/) genera esta tabla con 12 meses por página y permite exportarla en CSV.

## Qué significa cada columna

Una tabla de amortización básica suele incluir estas columnas:

| Columna | Qué significa |
|---|---|
| Mes | Número de pago dentro del plazo |
| Pago | Pago real del mes, incluyendo pago extra si aplica |
| Capital | Parte del pago que reduce la deuda |
| Intereses | Costo financiero generado por el saldo del mes anterior |
| Saldo pendiente | Deuda restante después del pago |

La columna de saldo pendiente es especialmente útil. Si haces pagos extra y se aplican a capital, el saldo baja más rápido y los intereses futuros pueden disminuir.

## Ejemplo de tabla con 6 meses

Supongamos una hipoteca de `$2,000,000`, tasa anual de `9%` y plazo de `20 años`. La cuota mensual base estimada es `$17,994.52`.

Los primeros seis meses se verían así:

| Mes | Pago | Capital | Intereses | Saldo pendiente |
|---:|---:|---:|---:|---:|
| 1 | $17,994.52 | $2,994.52 | $15,000.00 | $1,997,005.48 |
| 2 | $17,994.52 | $3,016.98 | $14,977.54 | $1,993,988.50 |
| 3 | $17,994.52 | $3,039.61 | $14,954.91 | $1,990,948.90 |
| 4 | $17,994.52 | $3,062.40 | $14,932.12 | $1,987,886.50 |
| 5 | $17,994.52 | $3,085.37 | $14,909.15 | $1,984,801.12 |
| 6 | $17,994.52 | $3,108.51 | $14,886.01 | $1,981,692.61 |

Observa que el pago se mantiene igual, pero los intereses bajan poco a poco y el capital sube. Esto ocurre porque los intereses se calculan sobre el saldo pendiente.

## Por qué al inicio pagas más intereses

El interés del mes se calcula así:

```txt
interés del mes = saldo anterior x tasa mensual
```

En el primer mes:

```txt
$2,000,000 x 0.0075 = $15,000
```

Después del primer pago, el saldo ya no es `$2,000,000`, sino `$1,997,005.48`. Por eso el interés del segundo mes es un poco menor.

Este comportamiento es típico de un esquema de cuota fija. Si quieres ver la lógica con más detalle, revisa la guía sobre [sistema francés en una hipoteca](/blog/inmuebles/sistema-frances-hipoteca/).

## Cómo cambia la tabla con pagos extra

Cuando agregas un pago extra mensual, ese dinero se suma al pago programado y reduce el saldo después de cubrir los intereses del mes. En la práctica, esto puede:

- Acortar el plazo real.
- Reducir intereses futuros.
- Hacer que la última cuota sea menor.
- Cambiar la fecha de liquidación.

Por ejemplo, en una hipoteca de `$2,000,000` a `9%` durante `20 años`, un pago extra de `$2,000` al mes puede reducir la duración aproximada de `240` a `186` meses. La estimación depende de que el pago extra se aplique a capital.

## Cómo generar tu tabla de amortización

Puedes generar una tabla completa con la [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca/). Ingresa precio y enganche, o captura directamente el monto del préstamo. Después agrega tasa, plazo y pago extra si aplica.

La herramienta muestra el resumen de capital, intereses, total pagado y duración real. Si prefieres trabajar en hoja de cálculo, revisa la guía para crear una [tabla de amortización hipotecaria en Excel](/blog/inmuebles/tabla-amortizacion-hipoteca-excel/).

## Preguntas frecuentes

### Para qué sirve una tabla de amortización hipotecaria?

Sirve para revisar cómo se distribuye cada pago entre capital e intereses, y cuánto saldo queda después de cada mes.

### Qué es saldo insoluto?

Es el saldo pendiente de pago. En una hipoteca, los intereses del mes suelen calcularse sobre ese saldo.

### Por qué los intereses bajan cada mes?

Porque el saldo pendiente baja conforme pagas capital. Si la tasa se mantiene igual, un saldo menor genera menos intereses.

### Puedo exportar la tabla de amortización?

Sí. La calculadora permite exportar CSV con todas las filas de la tabla, no solo la página visible.

## Fuentes consultadas

- [CONDUSEF: Simulador de crédito hipotecario](https://phpapps.condusef.gob.mx/condusefhipotecario/index.php?amp=1)
- [Banco de México: indicadores básicos de créditos a la vivienda](https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-a-la-vivienda/rib-creditos-vivienda--tasas-.html)
