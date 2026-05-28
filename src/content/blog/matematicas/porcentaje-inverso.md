---
title: "Porcentaje inverso: cómo encontrar el valor original"
seoTitle: "Porcentaje inverso: calcular el precio original"
description: "Aprende cómo calcular el valor original antes de un descuento, aumento o impuesto usando porcentaje inverso."
pubDate: 2026-05-26
categorySlug: "matematicas"
tags:
  - porcentaje inverso
  - descuentos
  - valor original
readTime: "5 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---

El porcentaje inverso sirve cuando conoces el valor final, pero quieres recuperar el valor original. Por ejemplo: pagaste $800 después de un descuento de 20%. ¿Cuál era el precio antes de la rebaja?

La respuesta no se obtiene sumando 20% a 800. El descuento se calculó sobre el precio original, no sobre el precio final. Para volver al punto de partida, hay que dividir entre el multiplicador que produjo el cambio.

## Qué es el porcentaje inverso

El porcentaje inverso es el cálculo que deshace un aumento, descuento, impuesto o reducción porcentual. En vez de partir del valor original para obtener el final, partes del valor final para encontrar la base.

La idea central es esta:

```txt
valor final = valor original x multiplicador
valor original = valor final / multiplicador
```

El multiplicador depende del tipo de cambio. Si hubo descuento, el multiplicador es menor que 1. Si hubo aumento o impuesto, el multiplicador es mayor que 1.

## Fórmula si hubo descuento

Cuando un precio tiene descuento, el valor final representa la parte que quedó después de quitar el porcentaje.

```txt
original = precio final / (1 - descuento / 100)
```

Si el descuento fue de 20%, el multiplicador es `1 - 20 / 100 = 0.80`. Eso significa que el precio final equivale al 80% del precio original.

## Fórmula si hubo aumento

Cuando un valor aumentó por recargo, impuesto, comisión o incremento, el valor final incluye el 100% original más el porcentaje adicional.

```txt
original = precio final / (1 + aumento / 100)
```

Si el aumento fue de 16%, el multiplicador es `1 + 16 / 100 = 1.16`. Eso significa que el total final equivale al 116% del valor original.

## Ejemplo con descuento

Supón que pagaste $800 con 20% de descuento.

Primero convierte el descuento en multiplicador:

```txt
1 - 20 / 100 = 0.80
```

Después divide el precio final entre ese multiplicador:

```txt
800 / 0.80 = 1,000
```

El precio original era $1,000. Si lo compruebas, 20% de 1,000 es 200, y `1,000 - 200 = 800`.

## Ejemplo con aumento o impuesto

Ahora supón que el total final fue $1,160 después de aplicar un aumento de 16%, como puede ocurrir con un impuesto agregado.

El multiplicador es:

```txt
1 + 16 / 100 = 1.16
```

Entonces:

```txt
1,160 / 1.16 = 1,000
```

El valor original era $1,000. Si el caso es IVA incluido, el procedimiento es el mismo que se usa para [desglosar IVA](/blog/como-desglosar-iva): dividir el total entre `1 + tasa / 100`.

## Ejemplos comunes

| Caso                                 | Multiplicador | Cálculo inverso | Valor original |
| ------------------------------------ | ------------: | --------------: | -------------: |
| Final $800 con 20% de descuento      |          0.80 |      800 / 0.80 |         $1,000 |
| Final $450 con 10% de descuento      |          0.90 |      450 / 0.90 |           $500 |
| Final $1,160 con 16% de aumento      |          1.16 |    1,160 / 1.16 |         $1,000 |
| Final $1,500 después de aumentar 25% |          1.25 |    1,500 / 1.25 |         $1,200 |

La misma lógica aplica para promociones, impuestos, comisiones, márgenes de ajuste o cualquier cambio porcentual calculado sobre una base inicial.

## Error común: sumar el porcentaje al valor final

El error más frecuente es intentar revertir un descuento sumando el mismo porcentaje al precio final.

Si pagaste $800 después de 20% de descuento, podrías pensar:

```txt
800 + 20% = 960
```

Pero 960 no es el precio original. El problema es que ese 20% se está calculando sobre 800, no sobre 1,000.

La comprobación lo deja claro:

```txt
960 - 20% = 768
```

Si 960 fuera el precio original, después del 20% de descuento pagarías 768, no 800. Por eso el porcentaje inverso se resuelve dividiendo entre `0.80`, no sumando 20% al resultado final.

Lo mismo pasa al revés: si un precio final ya incluye un aumento de 25%, no recuperas la base restando 25% al total. Debes dividir entre `1.25`.

## Cuándo usar la calculadora

La [calculadora de porcentajes](/matematicas/calculadora-de-porcentajes) es útil para comprobar el resultado después de hacer el cálculo inverso.

Por ejemplo, si obtuviste que el original era $1,000 y el descuento era 20%, puedes usar el modo "Restar %" para confirmar que el precio final queda en $800. Si el caso fue un aumento de 16%, puedes usar "Sumar %" con $1,000 para confirmar que el total queda en $1,160.

Para encontrar directamente el valor original, usa la división manual:

```txt
valor original = valor final / multiplicador
```

El paso importante es elegir bien el multiplicador: menor que 1 si fue descuento, mayor que 1 si fue aumento.

## Temas relacionados

Si todavía estás calculando el resultado final desde una base conocida, conviene revisar [cómo restar un porcentaje](/blog/como-restar-un-porcentaje) o [cómo sumar un porcentaje](/blog/como-sumar-un-porcentaje).

Para compras con promociones, también puedes leer la guía de [porcentaje de descuento](/blog/porcentaje-de-descuento). Para impuestos incluidos en un precio final, el caso relacionado es [cómo desglosar IVA](/blog/como-desglosar-iva).

## Preguntas frecuentes

**¿Cómo calcular el precio original antes de un descuento?**

Divide el precio final entre `1 - descuento / 100`. Por ejemplo, si pagaste $800 con 20% de descuento, calcula `800 / 0.80 = 1,000`.

**¿Por qué no basta con sumar el porcentaje al precio final?**

Porque el porcentaje original se aplicó sobre la base inicial, no sobre el precio final. Si sumas 20% a 800 obtienes 960, pero 20% de descuento sobre 960 deja 768, no 800.

**¿Cómo encontrar el valor antes de un aumento?**

Divide el valor final entre `1 + aumento / 100`. Por ejemplo, si el total es $1,500 después de aumentar 25%, calcula `1,500 / 1.25 = 1,200`.

**¿El porcentaje inverso sirve para IVA incluido?**

Sí. Cuando un precio ya incluye IVA, el precio sin IVA se obtiene dividiendo el total entre `1 + tasa / 100`. Con IVA de 16%, divide entre `1.16`.
