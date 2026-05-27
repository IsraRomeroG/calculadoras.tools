# Spec de contenido - Diferencia porcentual vs variacion porcentual

## Objetivo

Crear un articulo aclaratorio para diferenciar dos conceptos que suelen confundirse: variacion porcentual, que usa un valor inicial, y diferencia porcentual, que compara dos valores sin asumir direccion.

## Archivo final sugerido

- Ruta: `src/content/blog/matematicas/diferencia-porcentual-vs-variacion-porcentual.md`
- URL esperada: `/blog/diferencia-porcentual-vs-variacion-porcentual`
- Categoria: `Matemáticas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Diferencia porcentual vs variacion porcentual"
seoTitle: "Diferencia porcentual y variacion porcentual: diferencias"
description: "Entiende cuando usar diferencia porcentual y cuando usar variacion porcentual con formulas, ejemplos y casos comunes."
pubDate: 2026-XX-XX
category: "Matemáticas"
tags:
  - diferencia porcentual
  - variacion porcentual
  - porcentajes
readTime: "5 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---
```

## Intencion de busqueda

- Principal: entender la diferencia conceptual y de formula.
- Secundarias: reportes, datos, comparaciones entre mediciones, analisis de cambios.
- Nivel: intermedio.

## Keywords

- Primaria: `diferencia porcentual vs variacion porcentual`
- Secundarias: `diferencia porcentual`, `variacion porcentual`, `cambio porcentual`, `comparar porcentajes`

## Mensaje central

La variacion porcentual pregunta cuanto cambio un valor respecto a su punto inicial. La diferencia porcentual pregunta que tan distintos son dos valores, normalmente usando el promedio como referencia.

## Estructura recomendada

1. Introduccion: explicar que ambas usan porcentajes pero responden preguntas distintas.
2. `## Que es la variacion porcentual`
   - Formula: `(final - inicial) / inicial * 100`.
   - Tiene direccion: aumento o disminucion.
3. `## Que es la diferencia porcentual`
   - Formula sugerida: `|a - b| / ((a + b) / 2) * 100`.
   - No depende de cual valor va primero.
4. `## Ejemplo comparando ambos metodos`
   - A = 100, B = 120.
   - Variacion de 100 a 120 = 20%.
   - Diferencia porcentual = 18.18%.
5. `## Cuando usar cada una`
   - Variacion: ventas, precios, metricas con antes/despues.
   - Diferencia: comparar dos mediciones o estimaciones.
6. `## Errores comunes`
   - Llamar diferencia porcentual a todo cambio porcentual.
   - Ignorar la direccion del cambio.
7. `## Calculadora recomendada`
   - El modo "Cambio %" calcula variacion porcentual, no diferencia porcentual simetrica.
8. `## Preguntas frecuentes`

## Ejemplos obligatorios

- De 100 a 120: variacion 20%, diferencia 18.18%.
- De 120 a 100: variacion -16.67%, diferencia 18.18%.
- De 80 a 100: variacion 25%, diferencia 22.22%.

## Enlaces internos

- `/matematicas/calculadora-de-porcentajes`
- `/blog/aumento-porcentual`
- `/blog/disminucion-porcentual`
- `/blog/porcentaje-vs-puntos-porcentuales`

## FAQ sugeridas

- Diferencia porcentual y cambio porcentual son lo mismo?
- Por que el resultado cambia si invierto valor inicial y final?
- Que formula usa la calculadora de porcentajes?
- Cuando conviene usar el promedio como base?

## Criterios de aceptacion

- Debe definir ambas formulas sin ambiguedad.
- Debe aclarar que la calculadora actual resuelve variacion/cambio porcentual.
- Debe incluir al menos un ejemplo donde invertir el orden cambie la variacion.
- Debe evitar tono academico excesivo.
