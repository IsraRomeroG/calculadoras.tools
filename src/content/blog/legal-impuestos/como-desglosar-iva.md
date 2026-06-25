---
title: "Cómo desglosar el IVA de un precio total"
description: "Aprende a quitar el IVA incluido de un precio final sin cometer el error de restar el porcentaje directo."
pubDate: 2026-03-18
categorySlug: "legal-impuestos"
tags:
  - iva incluido
  - desglosar iva
  - impuestos
readTime: "4 min"
seoTitle: "Cómo desglosar el IVA incluido de un precio"
relatedCalculator:
  label: "Calculadora de IVA"
  href: "/legal-impuestos/calculadora-de-iva"
---

## Qué significa desglosar IVA

Desglosar IVA significa separar un precio final en dos partes: el precio sin impuesto y el monto del impuesto. Esto es útil cuando tienes un ticket, una cotización o un precio publicado como "IVA incluido".

La clave es recordar que el IVA incluido ya forma parte del total. Por eso no se calcula restando directamente la tasa al precio final.

Si estás comparando cotizaciones, también conviene entender la diferencia entre [IVA incluido y precio sin IVA](/blog/legal-impuestos/iva-incluido-vs-sin-iva).

## La fórmula correcta

Para quitar el IVA incluido, divide el total entre `1 + tasa / 100`.

```txt
precio sin iva = precio con iva / (1 + tasa / 100)
iva = precio con iva - precio sin iva
```

Si la tasa es 16%, el divisor es `1.16`. Si la tasa es 21%, el divisor es `1.21`.

## Ejemplo con IVA de 16%

Supongamos que pagaste $580 y ese precio ya incluye IVA de 16%.

```txt
precio sin iva = 580 / 1.16 = 500
iva = 580 - 500 = 80
```

El precio sin IVA es $500 y el impuesto incluido es $80.

## Por qué no debes restar 16% directamente

Si restas 16% a $580, obtienes:

```txt
580 - 16% = 487.20
```

Ese resultado no es correcto porque estás calculando 16% sobre el total, no sobre la base original. El IVA se agregó sobre $500, no sobre $580.

La diferencia parece pequeña en compras simples, pero puede crecer cuando haces cotizaciones, presupuestos o conciliaciones.

## Tabla de referencia

| Total con IVA | Tasa | Precio sin IVA | IVA incluido |
|---:|---:|---:|---:|
| $116 | 16% | $100 | $16 |
| $580 | 16% | $500 | $80 |
| $1,210 | 21% | $1,000 | $210 |
| $2,380 | 19% | $2,000 | $380 |

## Cuándo conviene usar una calculadora

Puedes hacer el desglose a mano si el número es sencillo. Pero cuando hay decimales, importes grandes o tasas distintas por país, una calculadora reduce errores de redondeo.

La [calculadora de IVA](/legal-impuestos/calculadora-de-iva) tiene un modo de "Desglosar" pensado justo para este caso: ingresas el total, eliges o editas la tasa y obtienes el precio sin IVA, el impuesto y el total.

## Nota fiscal

El resultado es una ayuda matemática. Para facturación, declaraciones o decisiones contables, revisa la normativa vigente y confirma si el bien o servicio usa tasa general, reducida, tasa 0% o algún tratamiento especial.

Para ver el cálculo completo en ambos sentidos, revisa [cómo calcular el IVA paso a paso](/blog/legal-impuestos/como-calcular-iva). Si partes de un precio base, el caso opuesto es [sumar IVA a un precio sin impuesto](/blog/legal-impuestos/como-sumar-iva-a-un-precio).
