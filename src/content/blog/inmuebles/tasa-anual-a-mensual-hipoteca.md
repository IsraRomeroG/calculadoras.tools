---
title: "Cómo convertir tasa anual a mensual en una hipoteca"
seoTitle: "Tasa anual a mensual en hipoteca: fórmula y ejemplo"
description: "Aprende cómo convertir una tasa anual a mensual para estimar la cuota de una hipoteca y evitar errores comunes."
pubDate: 2026-06-11
categorySlug: "inmuebles"
tags:
  - tasa anual
  - tasa mensual
  - hipoteca
readTime: "5 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca/"
---

Para calcular una hipoteca con pagos mensuales necesitas una tasa mensual. Pero muchas cotizaciones muestran la tasa de interés en términos anuales. Por eso hay que convertirla antes de usarla en la fórmula de cuota.

Esta conversión parece pequeña, pero un error de tasa puede cambiar completamente la mensualidad estimada.

## Por qué se necesita una tasa mensual

Una hipoteca normalmente se paga mes a mes. Si la tabla de amortización calcula intereses mensuales, la tasa que se aplica al saldo pendiente también debe ser mensual.

La [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca/) pide tasa anual porque es el dato más común para el usuario, pero internamente la convierte a tasa mensual.

## Fórmula simple para convertir tasa anual

Para una simulación simple de tasa nominal anual, la conversión es:

```txt
tasa mensual = tasa anual / 12 / 100
```

Por ejemplo:

```txt
tasa anual = 9%
tasa mensual = 9 / 12 / 100
tasa mensual = 0.0075
```

Ese `0.0075` equivale a `0.75%` mensual.

## Ejemplo con tasa anual de 9%

Supongamos una hipoteca de `$2,000,000`:

```txt
saldo inicial = $2,000,000
tasa mensual = 0.0075
interés del primer mes = 2,000,000 x 0.0075
interés del primer mes = $15,000
```

Si la cuota mensual es `$17,994.52`, entonces en el primer mes:

```txt
capital = $17,994.52 - $15,000
capital = $2,994.52
```

Ese es el principio de la [tabla de amortización hipotecaria](/blog/inmuebles/tabla-amortizacion-hipoteca/).

## Diferencia entre tasa, CAT y tasa efectiva

No confundas estos conceptos:

| Concepto | Qué indica |
|---|---|
| Tasa de interés | Costo del dinero prestado |
| Tasa mensual | Tasa usada para calcular intereses del periodo |
| CAT | Indicador de costo anual total bajo metodología oficial |
| Tasa efectiva | Puede incluir capitalización según definición |

La calculadora usa tasa anual de interés para estimar capital e intereses. No usa CAT como tasa de cálculo.

Si estás comparando ofertas, revisa la guía sobre [CAT vs tasa en un crédito hipotecario](/blog/inmuebles/cat-vs-tasa-credito-hipotecario/).

## Errores comunes

Evita:

- Escribir `9` como si fuera tasa mensual.
- Usar `0.09` como tasa mensual en vez de anual decimal.
- Dividir el CAT como si fuera tasa de interés.
- Mezclar tasa fija con tasa variable sin supuestos.
- Redondear demasiado pronto.

El redondeo debe hacerse al mostrar resultados, no en cada paso interno.

## Usa la calculadora para evitar redondeos

La [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca/) convierte la tasa anual a mensual, calcula la cuota y genera la amortización con precisión interna. Solo redondea al mostrar los resultados.

Si quieres replicarlo en una hoja de cálculo, revisa la guía de [fórmula de cuota de hipoteca en Excel y Google Sheets](/blog/inmuebles/formula-cuota-hipoteca-excel-google-sheets/).

## Preguntas frecuentes

### La tasa anual siempre se divide entre 12?

Para esta simulación de tasa fija simple, sí. Otros productos pueden usar definiciones distintas, por eso debes revisar la oferta formal.

### Puedo usar el CAT como tasa anual?

No conviene. El CAT y la tasa de interés no son lo mismo. Usa la tasa de interés para la cuota y el CAT para comparar costo anual total.

### Qué pasa si la tasa es 0%?

La cuota se calcula dividiendo el monto entre el número de meses. No hay intereses.

### Cuántos decimales conviene usar?

Usa suficiente precisión en los cálculos internos y redondea solo al presentar los resultados.

## Fuentes consultadas

- [Banco de México: indicadores básicos de créditos a la vivienda](https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-a-la-vivienda/rib-creditos-vivienda--tasas-.html)
- [CONDUSEF: Simulador de crédito hipotecario](https://www.condusef.gob.mx/?p=simulador_hipoteca)
