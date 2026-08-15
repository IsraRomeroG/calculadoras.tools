---
title: "Tasa nominal vs tasa efectiva: cuál es la diferencia"
description: "Entiende la diferencia entre tasa nominal y tasa efectiva, y por qué la capitalización cambia el rendimiento real."
pubDate: 2026-03-25
categorySlug: "finanzas"
translationKey: "nominal-vs-effective-interest-rate"
tags:
  - tasa nominal
  - tasa efectiva
  - interés compuesto
readTime: "6 min"
seoTitle: "Tasa nominal vs efectiva: fórmula, ejemplos y capitalización"
relatedCalculator:
  label: "Calculadora de interés compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
---

## Diferencia rápida

La tasa nominal es la tasa anunciada antes de convertir todo el efecto de la capitalización a un rendimiento anual final. Por eso suele aparecer acompañada de una frecuencia, por ejemplo: `12% anual capitalizable mensualmente`.

La tasa efectiva, en cambio, muestra cuánto crece realmente el dinero durante un año después de considerar que los intereses se van sumando al capital y generan nuevos intereses. Si dos productos usan frecuencias de capitalización distintas, la tasa efectiva anual ayuda a compararlos en la misma base.

En pocas palabras: la tasa nominal describe la tasa de referencia; la tasa efectiva muestra el resultado anual de esa tasa cuando se capitaliza.

## Fórmula de la tasa efectiva anual

La fórmula para convertir una tasa nominal anual a tasa efectiva anual es:

```txt
tasa efectiva anual = (1 + r / n) ^ n - 1
```

Donde `r` es la tasa nominal anual expresada en decimal y `n` es el número de capitalizaciones por año.

Si la tasa nominal es 12%, se usa como `0.12`. Si capitaliza mensualmente, `n` es `12`. Si capitaliza diariamente, normalmente se usa `365`.

## Ejemplo con capitalización mensual

Imagina una inversión con tasa nominal anual de 12% y capitalización mensual. Primero se divide la tasa anual entre los 12 meses:

```txt
0.12 / 12 = 0.01
```

Eso significa que cada mes se aplica 1% sobre el saldo acumulado. Como los intereses de un mes se suman al capital para el siguiente, el cálculo anual queda así:

```txt
TEA = (1 + 0.12 / 12) ^ 12 - 1
TEA = 0.1268
TEA = 12.68%
```

Aunque la tasa nominal anunciada sea 12%, la tasa efectiva anual aproximada es 12.68% por el efecto de la capitalización mensual.

Con $10,000, una capitalización anual al 12% daría $11,200 al final del año. Con capitalización mensual, el resultado aproximado sería $11,268.25. La diferencia no viene de una tasa "extra", sino de que los intereses se reinvierten dentro del mismo año.

## Por qué importa al comparar productos

La diferencia entre tasa nominal y tasa efectiva importa cuando comparas depósitos, cuentas de ahorro, inversiones, préstamos o cualquier producto donde la tasa se aplique más de una vez al año.

Por ejemplo, una opción con 12% nominal capitalizable mensualmente no es igual a otra con 12% efectivo anual. La primera termina cerca de 12.68% efectivo anual; la segunda ya está expresando el rendimiento anual final como 12%.

En créditos ocurre algo parecido, pero desde el lado del costo. Una frecuencia de capitalización mayor puede elevar el costo efectivo si todo lo demás se mantiene igual. Además, comisiones, impuestos, seguros u otros cargos pueden cambiar el resultado neto, así que la tasa efectiva no siempre cuenta toda la historia del producto.

También conviene tener cuidado con las siglas. TEA, TAE, CAT u otros nombres pueden variar por país y no siempre incluyen los mismos conceptos legales. Para tomar decisiones formales, revisa la metodología oficial aplicable a tu país y al producto específico.

## Capitalización anual, mensual y diaria

Con la misma tasa nominal anual de 12%, la tasa efectiva cambia según la frecuencia de capitalización.

| Capitalización | Veces al año | Tasa efectiva aproximada |
| -------------- | -----------: | -----------------------: |
| Anual          |            1 |                   12.00% |
| Mensual        |           12 |                   12.68% |
| Diaria         |          365 |                   12.75% |

La diferencia entre mensual y diaria puede parecer pequeña en un solo año, pero puede acumularse en plazos largos. Esa es una de las razones por las que el interés compuesto se vuelve más visible con el tiempo.

Si quieres repasar la base matemática, puedes revisar la [fórmula del interés compuesto](/blog/finanzas/formula-interes-compuesto). La lógica es la misma: el saldo crece, los intereses se agregan y el siguiente cálculo parte de una base mayor.

## Cómo lo muestra la calculadora

En la [calculadora de interés compuesto](/finanzas/calculadora-de-interes-compuesto) puedes cambiar la frecuencia de capitalización y ver cómo se mueve el monto final con la misma tasa anual y el mismo plazo.

El comparador de capitalización de la herramienta aísla ese efecto: toma el capital, la tasa y el plazo, y compara frecuencias como anual, mensual, semanal o diaria sin mezclar aportaciones periódicas. Así es más fácil ver cuánto aporta la capitalización por sí sola.

Esto es útil cuando una tasa parece atractiva, pero no sabes si está expresada como nominal o efectiva. Si solo conoces la tasa nominal y la frecuencia, puedes estimar la tasa efectiva anual con la fórmula anterior y después simular el plazo completo.

## Errores comunes

Un error frecuente es comparar una tasa mensual con una tasa anual como si fueran equivalentes. Una tasa de 1% mensual no es simplemente "parecida" a 12% anual efectivo; si se capitaliza cada mes, equivale aproximadamente a 12.68% efectivo anual.

Otro error es ignorar comisiones, impuestos o retenciones. La tasa efectiva anual ayuda a comparar el efecto de la capitalización, pero no necesariamente representa el rendimiento neto que llegará a tu bolsillo.

También es común confundir tasa efectiva con rendimiento garantizado. La fórmula convierte tasas bajo supuestos matemáticos, pero no elimina riesgos de mercado, cambios de tasa, incumplimientos, inflación ni condiciones particulares del producto.

Para revisar otros fallos típicos antes de simular escenarios, puedes consultar los [errores comunes al usar una calculadora de interés compuesto](/blog/finanzas/errores-calculadora-interes-compuesto).

## Preguntas frecuentes

**¿Cuál tasa debo usar en la calculadora?** Si el producto te da una tasa anual y una frecuencia de capitalización, úsala como tasa anual y elige la frecuencia correspondiente. Si ya tienes una tasa efectiva anual y quieres evitar doble conteo, compárala en base anual.

**¿La tasa efectiva incluye impuestos?** No necesariamente. En este artículo la tasa efectiva anual solo mide el efecto de la capitalización. Impuestos, comisiones y otros cargos deben revisarse aparte.

**¿Por qué la capitalización mensual da más que la anual?** Porque los intereses se suman al saldo durante el año. En el siguiente mes, el interés se calcula sobre capital más intereses acumulados, no solo sobre el capital inicial.

**¿TEA y TAE son lo mismo?** En uso cotidiano pueden parecer similares porque ambas buscan expresar una tasa anual comparable, pero su significado legal y los conceptos que incluyen pueden variar por país. Conviene revisar la definición oficial del mercado donde se use.

## Antes de comparar tasas

Para comparar bien, lleva todas las opciones a la misma base: anual contra anual, efectiva contra efectiva, y con la misma consideración de comisiones e impuestos. Si una oferta solo muestra la tasa nominal, conviértela a tasa efectiva anual antes de compararla con otra.

Si lo que quieres comparar es el crecimiento entre un valor inicial y uno final durante varios años, el concepto relacionado es el [CAGR o tasa de crecimiento anual compuesto](/blog/finanzas/cagr-tasa-crecimiento-anual-compuesto).

Como apoyo conceptual, Banxico Educa explica que el interés compuesto calcula intereses sobre el capital y sobre intereses acumulados, y que los intereses pueden capitalizarse con distintas frecuencias. Puedes revisar su material de [tasa de interés](https://educa.banxico.org.mx/contactobanxico/recursos/tasa-de-interes.html) para profundizar en la diferencia entre interés simple, interés compuesto y capitalización.
