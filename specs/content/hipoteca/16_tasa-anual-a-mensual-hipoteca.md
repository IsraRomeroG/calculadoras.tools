# Spec de articulo: Como convertir tasa anual a mensual en una hipoteca

## Archivo objetivo

- Ruta futura: `src/content/blog/inmuebles/tasa-anual-a-mensual-hipoteca.md`
- URL publica: `/blog/tasa-anual-a-mensual-hipoteca`
- Categoria: `Inmuebles`
- Prioridad: P2
- Rol en el cluster: soporte tecnico para formulas y hojas de calculo

## Metadata sugerida

```yaml
title: "Como convertir tasa anual a mensual en una hipoteca"
seoTitle: "Tasa anual a mensual en hipoteca: formula y ejemplo"
description: "Aprende como convertir una tasa anual a mensual para estimar la cuota de una hipoteca y evitar errores comunes."
pubDate: 2026-XX-XX
category: "Inmuebles"
tags:
  - tasa anual
  - tasa mensual
  - hipoteca
readTime: "5 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca"
```

## Intencion SEO

- Keyword principal: `tasa anual a mensual hipoteca`
- Secundarias: `convertir tasa anual a mensual`, `tasa mensual credito hipotecario`, `formula tasa mensual hipoteca`
- Intencion: usar una tasa anual en calculos mensuales.

## Promesa del articulo

Explicar la conversion simple usada por la calculadora para tasa nominal anual y
advertir que tasas efectivas, CAT u otros indicadores no deben mezclarse sin
entender su definicion.

## Formula principal

```txt
tasa mensual = tasa anual / 12 / 100
```

## Estructura recomendada

1. `## Por que se necesita una tasa mensual`
2. `## Formula simple para convertir tasa anual`
3. `## Ejemplo con tasa anual de 9%`
4. `## Diferencia entre tasa, CAT y tasa efectiva`
5. `## Errores comunes`
6. `## Usa la calculadora para evitar redondeos`
7. `## Preguntas frecuentes`

## Enlaces internos

- `/inmuebles/calculadora-de-hipoteca`
- `/blog/como-calcular-cuota-mensual-hipoteca`
- `/blog/cat-vs-tasa-credito-hipotecario`
- `/blog/formula-cuota-hipoteca-excel-google-sheets`

## FAQ sugeridas

- La tasa anual siempre se divide entre 12?
- Puedo usar el CAT como tasa anual?
- Que pasa si la tasa es 0%?
- Cuantos decimales conviene usar?

## Fuentes y notas

- Mantener distincion entre tasa nominal, efectiva y CAT.
- Verificar definiciones si se profundiza en tasas efectivas.

## Criterios de aceptacion

- Incluye formula y ejemplo.
- Advierte no mezclar CAT con tasa de interes.
- Enlaza a la formula de cuota mensual.
- CTA hacia la calculadora.
