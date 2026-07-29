# Spec de artículo: Milla terrestre vs. milla náutica

## Archivo objetivo

- Ruta futura: `src/content/blog/conversores/milla-terrestre-vs-milla-nautica.md`
- URL pública: `/blog/conversores/milla-terrestre-vs-milla-nautica`
- Categoría: `conversores`
- Prioridad: P1
- Rol en el cluster: desambiguación de la palabra “milla”
- Calculadora primaria: `/conversores/kilometros-a-millas` para milla terrestre

## Metadata sugerida

```yaml
title: "Milla terrestre vs. milla náutica: diferencias y equivalencias"
seoTitle: "Milla terrestre vs. milla náutica: cuánto mide cada una"
description: "Conoce la diferencia entre milla terrestre y milla náutica, sus factores en kilómetros y cuándo se usa cada unidad."
pubDate: 2026-XX-XX
categorySlug: "conversores"
tags:
  - milla terrestre
  - milla náutica
  - unidades de navegación
readTime: "6 min"
relatedCalculator:
  label: "Convertir kilómetros a millas terrestres"
  href: "/conversores/kilometros-a-millas"
```

## Intención SEO

- Keyword principal: `milla terrestre vs milla náutica`.
- Secundarias: `cuánto mide una milla náutica`, `1 milla náutica a km`, `milla
  terrestre a kilómetros`, `qué es un nudo`.
- Intención: elegir la unidad correcta para carretera, navegación marítima o
  aviación y evitar aplicar un factor equivocado.
- Fragmento objetivo: `1 mi terrestre = 1.609344 km; 1 nmi = 1.852 km`.

## Promesa y respuesta inicial

La primera sección debe dejar claro:

| Unidad | Equivalencia | Uso principal |
| --- | ---: | --- |
| Milla terrestre (`mi`) | 1.609344 km | Distancias sobre tierra |
| Milla náutica (`nmi`) | 1.852 km | Navegación marítima y aérea |

Indicar que la calculadora pilar convierte millas terrestres (`mi`) y no debe
usarse para introducir `nmi`.

## Estructura recomendada

1. `## Diferencia rápida`
2. `## Qué es una milla terrestre`
3. `## Qué es una milla náutica`
4. `## Tabla de equivalencias`
5. `## Milla náutica y nudo no son lo mismo`
6. `## Cómo elegir el factor correcto`
7. `## Convierte millas terrestres a kilómetros`
8. `## Preguntas frecuentes`

## Requisitos de contenido

- Usar `mi` para milla terrestre y `nmi` para milla náutica; explicar que las
  convenciones de símbolos pueden variar en documentos, pero el artículo debe
  mantener una nomenclatura consistente.
- Incluir tabla para 1, 5, 10, 50 y 100 unidades terrestres y náuticas.
- Definir el nudo como una unidad de velocidad igual a una milla náutica por
  hora; no presentarlo como unidad de distancia.
- Explicar que “milla” sin calificativo suele referirse a la terrestre en
  contextos de carretera, pero el contexto náutico o aeronáutico cambia la
  interpretación.
- Añadir aviso visible: la calculadora pilar no acepta millas náuticas.

## Enlaces internos

- `/conversores/kilometros-a-millas` — anchor: “convertir millas terrestres a
  kilómetros”.
- `/blog/conversores/como-convertir-kilometros-a-millas` — fórmula de la milla
  terrestre.
- `/blog/conversores/kilometros-vs-millas-diferencias` — contexto general de
  unidades.

No enlazar la calculadora con anchors como “convertir millas náuticas” ni crear
la expectativa de que procesa `nmi`.

## FAQ sugeridas

- ¿Cuántos kilómetros tiene una milla náutica?
- ¿Una milla náutica es más larga que una milla terrestre?
- ¿Qué diferencia hay entre milla náutica y nudo?
- ¿La calculadora de kilómetros a millas convierte nmi?
- ¿Qué milla se usa en una carretera?

## Fuentes y notas

- [NIST, factores para milla internacional y milla náutica](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b9).
- [NOAA, diferencia entre milla náutica y nudo](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html).
- Si se mencionan usos regulatorios concretos de aviación o navegación,
  verificar la fuente de la autoridad correspondiente antes de publicar.

## Criterios de aceptación

- Las dos equivalencias aparecen en el primer bloque.
- La tabla distingue claramente `mi` y `nmi`.
- Se define el nudo como velocidad.
- La CTA solo lleva a la calculadora para millas terrestres.
- No se limita a repetir el FAQ de la página pilar.

