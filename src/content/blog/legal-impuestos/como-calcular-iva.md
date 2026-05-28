---
title: "Cómo calcular el IVA paso a paso"
description: "Aprende a sumar y desglosar IVA con fórmulas simples, ejemplos claros y una calculadora online."
pubDate: 2026-05-16
categorySlug: "legal-impuestos"
tags:
  - iva
  - impuestos
  - porcentajes
readTime: "5 min"
seoTitle: "Cómo calcular el IVA: fórmula, ejemplos y calculadora"
relatedCalculator:
  label: "Calculadora de IVA"
  href: "/legal-impuestos/calculadora-de-iva"
---

## Qué significa calcular el IVA

Calcular el IVA significa separar o agregar el impuesto al valor agregado de un precio. En la práctica hay dos situaciones muy comunes: tienes un precio sin IVA y quieres saber el total, o tienes un precio final con IVA incluido y quieres saber cuánto corresponde al impuesto.

La lógica es la misma que con otros porcentajes: conviertes la tasa a decimal y la aplicas al precio que corresponda. Por ejemplo, una tasa de 16% se usa como `0.16`.

## Fórmula para agregar IVA

Cuando tienes un precio sin impuesto, el IVA se calcula sobre ese precio base.

```txt
iva = precio sin iva x tasa / 100
precio con iva = precio sin iva + iva
```

Ejemplo con un precio de $500 y una tasa de 16%:

```txt
iva = 500 x 16 / 100 = 80
precio con iva = 500 + 80 = 580
```

El IVA es $80 y el total con IVA es $580.

Si este es tu caso principal, puedes revisar la guía específica de [cómo sumar IVA a un precio sin impuesto](/blog/como-sumar-iva-a-un-precio).

## Fórmula para desglosar IVA incluido

Cuando el precio ya incluye IVA, no basta con restar el porcentaje directamente. Primero debes encontrar la base dividiendo el total entre `1 + tasa`.

```txt
precio sin iva = precio con iva / (1 + tasa / 100)
iva = precio con iva - precio sin iva
```

Ejemplo con un total de $580 y una tasa de 16%:

```txt
precio sin iva = 580 / 1.16 = 500
iva = 580 - 500 = 80
```

El precio base es $500 y el IVA incluido es $80.

Si partes de un precio final, también puedes ver la explicación completa de [cómo desglosar el IVA de un precio total](/blog/como-desglosar-iva).

## Ejemplos rápidos

| Precio sin IVA | Tasa | IVA | Total |
|---:|---:|---:|---:|
| $100 | 16% | $16 | $116 |
| $500 | 16% | $80 | $580 |
| $1,000 | 21% | $210 | $1,210 |
| $2,000 | 19% | $380 | $2,380 |

Estos ejemplos sirven como referencia matemática. La tasa real depende del país, el producto o servicio y la normativa vigente.

## Errores comunes al calcular IVA

El error más frecuente es intentar quitar el IVA restando la tasa al total. Si algo cuesta $116 con IVA de 16%, restar 16% a 116 da $97.44, pero el precio sin IVA correcto es $100.

Otro error común es usar una tasa general cuando aplica una tasa reducida, tasa 0% o una regla especial. Por eso conviene verificar la tasa antes de emitir facturas, cotizaciones formales o declaraciones.

Para evitar confusiones de base, revisa la diferencia entre [IVA incluido y precio sin IVA](/blog/iva-incluido-vs-sin-iva). También puede ayudarte la guía de [errores comunes al calcular IVA](/blog/errores-comunes-al-calcular-iva).

## Usa la calculadora para evitar redondeos manuales

Si solo quieres hacer una estimación rápida, puedes usar las fórmulas anteriores. Si necesitas comparar países, cambiar tasas o copiar un desglose completo, usa la [calculadora de IVA](/legal-impuestos/calculadora-de-iva).

La herramienta permite agregar IVA, desglosarlo desde un total y editar la tasa manualmente.

## Fuentes para revisar tasas

Antes de usar una tasa para fines fiscales, consulta la fuente oficial de tu país. Por ejemplo, el SAT de México publica la tasa general en la [Ley del IVA, artículo 1](https://wwwmat.sat.gob.mx/articulo/19848/articulo-1), la Agencia Tributaria de España mantiene una página de [tipos impositivos de IVA](https://sede.agenciatributaria.gob.es/Sede/iva/calculo-iva-repercutido-clientes/tipos-impositivos-iva.html), y la DIAN de Colombia publica criterios sobre la [tarifa general del IVA](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_8857_2025.htm).

Para una vista rápida de varios países, consulta la [tabla de tasas de IVA por país](/blog/tasas-de-iva-por-pais).
