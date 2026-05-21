---
title: "Fórmulas de porcentajes en Excel y Google Sheets"
seoTitle: "Porcentajes en Excel y Google Sheets: fórmulas útiles"
description: "Aprende fórmulas para calcular porcentajes, descuentos, aumentos y variaciones en Excel y Google Sheets."
pubDate: 2026-05-26
category: "Matemáticas"
tags:
  - excel
  - google sheets
  - porcentajes
readTime: "6 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---

Excel y Google Sheets usan el mismo enfoque para calcular porcentajes básicos: escribes una fórmula en una celda, usas referencias como `A2` o `B2`, y aplicas formato de porcentaje solo cuando quieres mostrar el resultado como porcentaje.

La clave es distinguir entre una celda que contiene `20%` y una celda que contiene `20`. Para una hoja de cálculo, `20%` equivale a `0.20`. En cambio, `20` es veinte unidades completas. Esa diferencia explica muchos errores cuando se calculan descuentos, aumentos o variaciones.

## Tabla rápida de fórmulas

| Caso | Fórmula | Ejemplo |
|---|---:|---:|
| Calcular 20% de 100 | `=100*20%` | 20 |
| Sacar qué porcentaje es 45 de 200 | `=45/200` y formato porcentaje | 22.5% |
| Variación de 100 a 120 | `=(120-100)/100` y formato porcentaje | 20% |
| Descuento de 15% sobre 500 | `=500*(1-15%)` | 425 |
| Aumento de 16% sobre 500 | `=500*(1+16%)` | 580 |

Estas fórmulas funcionan igual en Excel y en Google Sheets para operaciones básicas. Lo que puede cambiar según tu configuración regional es el separador decimal, pero no la lógica del cálculo.

## Calcular el porcentaje de un número

Si tienes la cantidad base en `A2` y el porcentaje en `B2`, la fórmula es:

```txt
=A2*B2
```

Por ejemplo, si `A2` contiene `100` y `B2` contiene `20%`, el resultado es `20`.

También puedes escribir el porcentaje directamente en la fórmula:

```txt
=A2*20%
```

O con números fijos:

```txt
=100*20%
```

Resultado:

```txt
20
```

Si tu celda `B2` contiene `20` en vez de `20%`, entonces debes dividir entre 100:

```txt
=A2*B2/100
```

Ese ajuste es importante. Con `A2 = 100`, la fórmula `=A2*20%` da `20`, pero `=A2*20` da `2,000`.

## Saber qué porcentaje representa una cantidad

Para saber qué porcentaje representa una cantidad respecto a otra, divide la parte entre el total.

Si la parte está en `A2` y el total está en `B2`, usa:

```txt
=A2/B2
```

Después aplica formato de porcentaje a la celda del resultado.

Por ejemplo:

```txt
=45/200
```

El resultado interno es `0.225`. Con formato de porcentaje se muestra como:

```txt
22.5%
```

Esta es la misma operación explicada en la guía de [qué porcentaje es una cantidad de otra](/blog/que-porcentaje-es-una-cantidad-de-otra). En una hoja de cálculo, solo cambias los números por referencias de celda.

Si no quieres usar formato de porcentaje, puedes multiplicar por 100:

```txt
=A2/B2*100
```

En ese caso el resultado será un número como `22.5`, no una celda formateada como `22.5%`.

## Calcular aumento o disminución porcentual

Para calcular cuánto cambió un valor inicial frente a un valor nuevo, usa:

```txt
=(B2-A2)/A2
```

Donde:

- `A2` es el valor inicial.
- `B2` es el valor nuevo.

Después aplica formato de porcentaje.

Ejemplo con un aumento de 100 a 120:

```txt
=(120-100)/100
```

El resultado interno es `0.20`, que con formato de porcentaje se muestra como:

```txt
20%
```

Si el resultado es positivo, hubo aumento. Si es negativo, hubo disminución. Para ver la lógica con más detalle, puedes revisar las guías de [aumento porcentual](/blog/aumento-porcentual) y [diferencia porcentual vs variación porcentual](/blog/diferencia-porcentual-vs-variacion-porcentual).

## Sumar un porcentaje

Para sumar un porcentaje a una cantidad, multiplica la base por `1 + porcentaje`.

Si la cantidad está en `A2` y el porcentaje está en `B2`, usa:

```txt
=A2*(1+B2)
```

Por ejemplo, si quieres aumentar 500 en 16%:

```txt
=500*(1+16%)
```

Resultado:

```txt
580
```

El `1` representa el 100% de la cantidad original. El `16%` representa la parte adicional. Por eso `1 + 16%` equivale a `1.16`.

Si `B2` contiene `16` como número normal y no `16%`, usa:

```txt
=A2*(1+B2/100)
```

Para más ejemplos de este caso, puedes leer [cómo sumar un porcentaje](/blog/como-sumar-un-porcentaje).

## Restar un porcentaje o calcular descuento

Para restar un porcentaje, multiplica la base por `1 - porcentaje`.

Si la cantidad está en `A2` y el descuento está en `B2`, usa:

```txt
=A2*(1-B2)
```

Por ejemplo, para calcular un descuento de 15% sobre 500:

```txt
=500*(1-15%)
```

Resultado:

```txt
425
```

El `1` representa el precio completo y el `15%` representa la parte que se quita. Por eso `1 - 15%` equivale a `0.85`.

Si el descuento está escrito como `15` y no como `15%`, usa:

```txt
=A2*(1-B2/100)
```

Este mismo método sirve para rebajas, retenciones o reducciones. Si quieres verlo sin referencias de celda, revisa la guía de [cómo restar un porcentaje](/blog/como-restar-un-porcentaje).

## Formato porcentaje: cuándo usarlo

El formato porcentaje cambia cómo se ve el número, no la lógica matemática que escribiste.

Por ejemplo, esta fórmula:

```txt
=45/200
```

devuelve `0.225`. Si aplicas formato de porcentaje, la hoja lo muestra como `22.5%`.

El error aparece cuando haces las dos cosas a la vez: multiplicar por 100 y además aplicar formato de porcentaje. Por ejemplo:

```txt
=45/200*100
```

Esa fórmula devuelve `22.5`. Si luego aplicas formato de porcentaje, se mostrará como `2250%`, porque la hoja interpreta `22.5` como veintidós unidades y media, no como `0.225`.

Una regla práctica:

- Usa `=A2/B2` si vas a aplicar formato de porcentaje.
- Usa `=A2/B2*100` si quieres un número sin símbolo `%`.

## Errores comunes en hojas de cálculo

Un error frecuente es escribir `20` cuando querías escribir `20%`. Si una celda contiene `20`, la hoja no asume que significa veinte por ciento. Para que se interprete como porcentaje, escribe `20%` o usa `20/100` en la fórmula.

Otro error es aplicar formato de porcentaje a una celda que ya fue multiplicada por 100. Si el cálculo ya devuelve `22.5`, no conviene formatearlo como porcentaje. Si quieres ver `22.5%`, la fórmula debe devolver `0.225`.

También conviene revisar las divisiones entre cero. En fórmulas como `=A2/B2` o `=(B2-A2)/A2`, la base no puede ser cero. Si el total o el valor inicial es cero, el porcentaje no está definido.

Por último, revisa que las referencias estén en el orden correcto. En una variación porcentual, no es lo mismo `(nuevo - inicial) / inicial` que `(inicial - nuevo) / nuevo`. Cambiar la base cambia el resultado.

## Cuándo conviene usar la calculadora online

Excel y Google Sheets son ideales cuando tienes una tabla con muchos datos o necesitas repetir la fórmula en varias filas. La [calculadora de porcentajes](/matematicas/calculadora-de-porcentajes) conviene cuando quieres resolver un caso rápido, validar un resultado o revisar la operación antes de copiarla a una hoja.

Por ejemplo, puedes calcular primero un descuento o aumento en la calculadora y después replicar la fórmula en Excel o Google Sheets. Así reduces errores de referencia, formato o interpretación del porcentaje.

## Preguntas frecuentes

**¿Cómo calcular 20% en Excel?**

Para calcular 20% de una cantidad en `A2`, usa `=A2*20%`. Si el porcentaje está en `B2` y esa celda contiene `20%`, usa `=A2*B2`.

**¿Cómo sacar porcentaje entre dos celdas?**

Divide la parte entre el total. Si la parte está en `A2` y el total en `B2`, usa `=A2/B2` y aplica formato de porcentaje al resultado.

**¿Cómo calcular descuento en Excel?**

Usa `=A2*(1-B2)` si `B2` contiene el descuento como porcentaje, por ejemplo `15%`. Si `B2` contiene `15` como número, usa `=A2*(1-B2/100)`.

**¿Las fórmulas son iguales en Google Sheets?**

Sí. Para estas operaciones básicas, Excel y Google Sheets usan la misma lógica: multiplicar, dividir, sumar o restar referencias de celda. La diferencia principal está en el formato de número y en cómo escribes el porcentaje.

**¿Por qué mi porcentaje aparece multiplicado por 100?**

Suele pasar cuando multiplicas la fórmula por 100 y además aplicas formato de porcentaje. Si quieres que `45/200` se vea como `22.5%`, usa `=45/200` y luego formato de porcentaje.
