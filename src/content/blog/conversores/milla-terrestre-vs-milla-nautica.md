---
title: "Milla terrestre vs. milla náutica: diferencias y equivalencias"
seoTitle: "Milla terrestre vs. milla náutica: cuánto mide cada una"
description: "Conoce la diferencia entre milla terrestre y milla náutica, sus factores en kilómetros y cuándo se usa cada unidad."
pubDate: 2026-07-31
categorySlug: "conversores"
tags:
  - milla terrestre
  - milla náutica
  - unidades de navegación
readTime: "6 min"
relatedCalculator:
  label: "Convertir kilómetros a millas terrestres"
  href: "/conversores/kilometros-a-millas"
sources:
  - label: "NIST Guide to the SI, Appendix B.9: Conversion Factors"
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
    publisher: "National Institute of Standards and Technology"
    accessedDate: 2026-07-28
  - label: "What is the difference between a nautical mile and a knot?"
    url: "https://oceanservice.noaa.gov/facts/nautical-mile-knot.html"
    publisher: "National Oceanic and Atmospheric Administration"
    accessedDate: 2026-07-28
methodologyNote: "Las equivalencias se calculan con los factores exactos 1 mi = 1.609344 km y 1 nmi = 1.852 km. Los valores derivados se redondean solo al presentarlos."
---

## Diferencia rápida

La **milla terrestre** y la **milla náutica** son unidades de distancia distintas. No se pueden intercambiar usando el mismo factor:

| Unidad | Equivalencia exacta | Uso principal |
| --- | ---: | --- |
| Milla terrestre (`mi`) | 1.609344 km | Distancias sobre tierra |
| Milla náutica (`nmi`) | 1.852 km | Navegación marítima y aérea |

La milla náutica es más larga: supera a la terrestre en `0.242656 km`, es decir, unos `243 metros`. Una milla náutica equivale aproximadamente a `1.15078 mi`.

> **Importante:** el [conversor de kilómetros a millas](/conversores/kilometros-a-millas) trabaja con millas terrestres (`mi`). No acepta millas náuticas (`nmi`).

Cuando una señal de carretera, una carrera o una distancia recorrida por tierra indica simplemente “millas”, normalmente se refiere a millas terrestres. En cartas náuticas, rutas marítimas y navegación aérea, el contexto puede indicar millas náuticas.

## Qué es una milla terrestre

La milla terrestre, también llamada milla internacional o *statute mile* en algunos documentos en inglés, es la unidad habitual para expresar distancias por carretera en países como Estados Unidos y Reino Unido.

Su equivalencia exacta es:

```txt
1 mi = 1.609344 km
```

Por ejemplo, una distancia de `10 mi` corresponde a:

```txt
10 × 1.609344 = 16.09344 km
```

En este artículo usamos el símbolo `mi`. Las convenciones pueden variar entre publicaciones, pero indicar la unidad de forma explícita evita confundirla con la milla náutica.

Si necesitas ver la operación inversa, la guía sobre [cómo convertir kilómetros a millas](/blog/conversores/como-convertir-kilometros-a-millas) explica las fórmulas y el redondeo para la milla terrestre.

## Qué es una milla náutica

La milla náutica es una unidad de distancia empleada en navegación marítima y aérea. Su equivalencia internacional exacta es:

```txt
1 nmi = 1.852 km = 1852 m
```

La [NOAA](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html) explica que esta unidad se relaciona con las coordenadas de latitud y longitud: una milla náutica corresponde a un minuto de latitud. Esa relación la hace práctica para trabajar con cartas y posiciones geográficas.

En este artículo mantenemos el símbolo `nmi` para distinguirla con claridad. En cartas, instrumentos o reglamentos también pueden aparecer otras convenciones, como `NM`; conviene comprobar siempre la leyenda o documentación del sistema utilizado.

No introduzcas una cantidad en millas náuticas en una calculadora configurada para millas terrestres. Si escribieras `10 nmi` como si fueran `10 mi`, obtendrías `16.09344 km` en vez de los `18.52 km` correctos.

## Tabla de equivalencias

La siguiente tabla aplica por separado los factores exactos del [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9):

| Cantidad | Millas terrestres a kilómetros | Millas náuticas a kilómetros |
| ---: | ---: | ---: |
| 1 | 1 mi = 1.609344 km | 1 nmi = 1.852 km |
| 5 | 5 mi = 8.04672 km | 5 nmi = 9.26 km |
| 10 | 10 mi = 16.09344 km | 10 nmi = 18.52 km |
| 50 | 50 mi = 80.4672 km | 50 nmi = 92.6 km |
| 100 | 100 mi = 160.9344 km | 100 nmi = 185.2 km |

Para calcular cualquier otro valor:

```txt
kilómetros = millas terrestres × 1.609344
kilómetros = millas náuticas × 1.852
```

La operación inversa también depende de la unidad de origen:

```txt
millas terrestres = kilómetros / 1.609344
millas náuticas = kilómetros / 1.852
```

Como referencia, `100 km` equivalen aproximadamente a `62.1371 mi` o `53.9957 nmi`. Ambos resultados describen la misma distancia, pero con unidades diferentes.

## Milla náutica y nudo no son lo mismo

Una milla náutica mide **distancia**. Un nudo mide **velocidad**:

```txt
1 nudo = 1 milla náutica por hora
```

Por tanto, una embarcación que avanza a `10 nudos` recorre `10 nmi` en una hora si mantiene esa velocidad constante. Expresado en kilómetros por hora:

```txt
10 × 1.852 = 18.52 km/h
```

No es correcto decir que una ruta “mide 10 nudos”, porque el nudo no indica longitud. Del mismo modo, `10 nmi` no describen por sí solas una velocidad: falta conocer el tiempo empleado.

## Cómo elegir el factor correcto

Antes de convertir, identifica el contexto y el símbolo:

- En carreteras, automóviles, atletismo y distancias cotidianas en el sistema anglosajón, utiliza la milla terrestre (`mi`).
- En rutas marítimas, cartas náuticas y navegación aérea, comprueba si la distancia está expresada en millas náuticas (`nmi`).
- Si aparece un valor en nudos, se trata de una velocidad y no de una distancia.
- Si un documento solo dice “milla”, revisa su leyenda, fuente o contexto antes de elegir un factor.

Usar `1.609344` en lugar de `1.852` genera una diferencia de aproximadamente `13.1 %` respecto de la distancia náutica real. El error aumenta con la cantidad: para `100` unidades, la diferencia entre ambos resultados es de `24.2656 km`.

Para entender cómo encajan estas unidades con el sistema métrico, consulta la comparación general de [kilómetros y millas](/blog/conversores/kilometros-vs-millas-diferencias).

## Convierte millas terrestres a kilómetros

Si tu distancia está expresada en `mi`, puedes [convertir millas terrestres a kilómetros](/conversores/kilometros-a-millas) con la calculadora. Introduce la cantidad, selecciona la conversión correspondiente y revisa el resultado con la precisión que necesites.

La calculadora utiliza el factor de la milla terrestre:

```txt
1 mi = 1.609344 km
```

No la uses para valores en `nmi`. Para convertir una distancia náutica manualmente, multiplica las millas náuticas por `1.852`.

## Preguntas frecuentes

### ¿Cuántos kilómetros tiene una milla náutica?

Una milla náutica internacional equivale exactamente a `1.852 km`, o `1852 m`.

### ¿Una milla náutica es más larga que una milla terrestre?

Sí. Una milla náutica mide `1.852 km` y una milla terrestre mide `1.609344 km`. La diferencia es de `0.242656 km`, unos `243 m`.

### ¿Qué diferencia hay entre milla náutica y nudo?

La milla náutica (`nmi`) es una unidad de distancia. El nudo es una unidad de velocidad equivalente a una milla náutica por hora.

### ¿La calculadora de kilómetros a millas convierte nmi?

No. La calculadora convierte kilómetros y millas terrestres (`mi`). Para pasar millas náuticas a kilómetros, multiplica el valor en `nmi` por `1.852`.

### ¿Qué milla se usa en una carretera?

En contextos de carretera, “milla” normalmente significa milla terrestre (`mi`). La milla náutica se reserva para contextos de navegación marítima y aérea.
