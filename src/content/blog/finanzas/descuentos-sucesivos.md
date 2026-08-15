---
title: "Descuentos sucesivos: por qué 20% + 10% no es 30%"
seoTitle: "Descuentos sucesivos: fórmula para calcular rebajas acumuladas"
description: "Aprende cómo calcular descuentos sucesivos y por qué dos rebajas se aplican una después de otra, no sumando porcentajes."
pubDate: 2026-04-18
categorySlug: "finanzas"
translationKey: "successive-discounts"
tags:
  - descuentos
  - compras
  - porcentajes
readTime: "5 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---

Los descuentos sucesivos aparecen cuando una tienda anuncia algo como "20% de descuento + 10% adicional". Suena tentador pensar que el descuento total es 30%, pero no funciona así.

Cada rebaja se calcula sobre el precio que queda después de aplicar la anterior. Por eso, si un producto cuesta $1,000, primero baja a $800 con 20% de descuento y después baja a $720 con el 10% adicional.

El precio final es $720. El descuento real no fue 30%, sino 28%.

## Qué son los descuentos sucesivos

Los descuentos sucesivos son rebajas que se aplican una después de otra. El primer descuento usa como base el precio original. El segundo usa como base el precio ya rebajado. Si hay un tercer descuento, se aplica sobre el resultado anterior, y así sucesivamente.

La idea clave es que el segundo porcentaje no se calcula sobre el precio inicial, sino sobre una cantidad menor. Por eso dos descuentos no se suman de forma directa.

Por ejemplo, 20% + 10% no significa quitar 30% del precio original. Significa quitar 20% y luego quitar 10% de lo que quedó.

## Fórmula para calcular descuentos sucesivos

La forma más clara de calcular descuentos sucesivos es convertir cada descuento en un multiplicador.

```txt
final = precio x (1 - d1 / 100) x (1 - d2 / 100)
```

Si hay más descuentos, agregas más multiplicadores:

```txt
final = precio x (1 - d1 / 100) x (1 - d2 / 100) x (1 - d3 / 100)
```

Donde `d1`, `d2` y `d3` son los porcentajes de descuento. Un descuento de 20% se convierte en `0.80`; uno de 10% se convierte en `0.90`; uno de 50% se convierte en `0.50`.

## Ejemplo: 20% y luego 10%

Supongamos que un producto cuesta $1,000 y tiene 20% de descuento más 10% adicional.

Primero aplica el 20%:

```txt
1,000 x 0.80 = 800
```

Después aplica el 10% sobre los $800:

```txt
800 x 0.90 = 720
```

También puedes hacerlo en una sola línea:

```txt
1,000 x 0.80 x 0.90 = 720
```

El precio final es $720. Si el precio original era $1,000, el ahorro fue de $280.

```txt
1,000 - 720 = 280
```

Eso equivale a 28% de descuento total, no 30%.

## Cómo calcular el descuento total equivalente

El descuento total equivalente, también llamado descuento efectivo, indica qué porcentaje del precio original se descontó realmente después de aplicar todas las rebajas.

La fórmula es:

```txt
descuento efectivo = 1 - (precio final / precio inicial)
```

Con el ejemplo anterior:

```txt
1 - (720 / 1,000) = 0.28
```

Convertido a porcentaje:

```txt
0.28 x 100 = 28%
```

Ese 28% es el descuento único que produciría el mismo precio final. Es decir, aplicar 20% y luego 10% equivale a aplicar un solo descuento de 28%.

## Tabla con combinaciones comunes

Estas combinaciones muestran por que conviene mirar el precio final y no solo sumar los porcentajes del anuncio.

| Precio inicial | Descuentos sucesivos |             Cálculo | Precio final | Descuento efectivo |
| -------------: | -------------------: | ------------------: | -----------: | -----------------: |
|           $500 |            10% + 10% |   500 x 0.90 x 0.90 |         $405 |                19% |
|         $1,000 |            20% + 10% | 1,000 x 0.80 x 0.90 |         $720 |                28% |
|         $2,000 |            30% + 20% | 2,000 x 0.70 x 0.80 |       $1,120 |                44% |
|           $800 |            50% + 10% |   800 x 0.50 x 0.90 |         $360 |                55% |

Observa que en todos los casos el descuento efectivo es menor que la suma simple, excepto cuando alguno de los descuentos es 0%. En compras reales, esa diferencia puede ser importante si comparas promociones parecidas.

## Errores comunes al comparar promociones

El error más común es sumar los porcentajes. Si ves 30% + 20%, no significa que pagarás la mitad. En realidad:

```txt
precio x 0.70 x 0.80 = precio x 0.56
```

Eso deja el precio en 56% del original, así que el descuento efectivo es 44%.

Otro error es no revisar en qué orden aplica el cupón. A veces el descuento adicional se calcula después de una rebaja de temporada; otras veces solo aplica a ciertos productos, a una categoría o a un máximo de descuento.

También conviene revisar si el cupón se aplica antes o después de impuestos, envío, comisiones o meses con intereses. El porcentaje puede verse muy atractivo, pero el dato que decide la compra suele ser el total final que vas a pagar.

Si solo tienes un descuento directo, puedes usar la guía de [cómo calcular un descuento](/blog/finanzas/porcentaje-de-descuento). Si quieres repasar la operación básica, también sirve ver [cómo restar un porcentaje](/blog/matematicas/como-restar-un-porcentaje).

## Calcúlalo con la calculadora

Puedes usar la [calculadora de porcentajes](/matematicas/calculadora-de-porcentajes) en modo "Restar %" y aplicar los descuentos en pasos.

Por ejemplo, para calcular $1,000 con 20% y 10%:

1. Escribe 1,000 como cantidad base y resta 20%. El resultado es 800.
2. Usa 800 como nueva base y resta 10%. El resultado es 720.
3. Compara 720 contra el precio original para saber el descuento efectivo.

Si quieres recuperar el precio original desde un precio ya rebajado, el tema relacionado es el [porcentaje inverso](/blog/matematicas/porcentaje-inverso), porque ahí se divide entre el multiplicador que produjo el descuento.

## Preguntas frecuentes

**¿Cómo se calculan dos descuentos seguidos?**

Multiplica el precio por el multiplicador del primer descuento y luego por el multiplicador del segundo. Por ejemplo, con 20% y 10%: `precio x 0.80 x 0.90`.

**¿Por qué 20% + 10% no es 30%?**

Porque el 10% adicional se calcula sobre el precio que quedó después del 20%, no sobre el precio original. En un precio de $1,000, el resultado es $720, que equivale a 28% de descuento total.

**¿Qué es el descuento efectivo?**

Es el descuento único equivalente a todos los descuentos sucesivos. Se calcula con `1 - (precio final / precio inicial)`. Si un producto baja de $1,000 a $720, el descuento efectivo es 28%.

**¿Conviene más un descuento único o descuentos sucesivos?**

Depende del porcentaje efectivo y del precio final. Un descuento único de 30% conviene más que 20% + 10%, porque 30% sobre $1,000 deja $700, mientras que 20% + 10% deja $720.
