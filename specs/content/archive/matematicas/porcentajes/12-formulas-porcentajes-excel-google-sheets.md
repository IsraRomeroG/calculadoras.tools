# Spec de contenido - Formulas de porcentajes en Excel y Google Sheets

## Objetivo

Crear un articulo practico para usuarios que quieren calcular porcentajes en hojas de calculo: porcentaje de un numero, variacion, descuentos, aumentos y formato porcentual.

## Archivo final sugerido

- Ruta: `src/content/blog/matematicas/formulas-porcentajes-excel-google-sheets.md`
- URL esperada: `/blog/formulas-porcentajes-excel-google-sheets`
- Categoria: `Matemáticas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Formulas de porcentajes en Excel y Google Sheets"
seoTitle: "Porcentajes en Excel y Google Sheets: formulas utiles"
description: "Aprende formulas para calcular porcentajes, descuentos, aumentos y variaciones en Excel y Google Sheets."
pubDate: 2026-XX-XX
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
```

## Intencion de busqueda

- Principal: obtener formulas concretas para usar en celdas.
- Secundarias: reportes, presupuestos, ventas, descuentos, variaciones mensuales.
- Nivel: basico-intermedio.

## Keywords

- Primaria: `porcentajes en Excel`
- Secundarias: `formula porcentaje Google Sheets`, `calcular descuento en Excel`, `aumento porcentual Excel`, `variacion porcentual Excel`

## Mensaje central

Las mismas formulas matematicas se pueden escribir en celdas. La diferencia practica esta en usar referencias correctas y aplicar formato de porcentaje solo cuando corresponde.

## Estructura recomendada

1. Introduccion: indicar que aplica a Excel y Google Sheets.
2. `## Calcular el porcentaje de un numero`
   - Ejemplo: `=A2*B2` si B2 ya tiene 20%.
   - Alternativa: `=A2*20%`.
3. `## Saber que porcentaje representa una cantidad`
   - `=A2/B2` y formato porcentaje.
4. `## Calcular aumento o disminucion porcentual`
   - `=(B2-A2)/A2`.
5. `## Sumar un porcentaje`
   - `=A2*(1+B2)`.
6. `## Restar un porcentaje o calcular descuento`
   - `=A2*(1-B2)`.
7. `## Errores comunes en hojas de calculo`
   - Escribir 20 en vez de 20%.
   - Aplicar formato porcentaje dos veces.
   - Dividir entre cero.
8. `## Cuando conviene usar la calculadora online`
   - Calculos rapidos, validacion de resultados, historial.
9. `## Preguntas frecuentes`

## Ejemplos obligatorios

- `=100*20%` -> 20.
- `=45/200` con formato porcentaje -> 22.5%.
- `=(120-100)/100` -> 20%.
- `=500*(1-15%)` -> 425.
- `=500*(1+16%)` -> 580.

## Enlaces internos

- `/matematicas/calculadora-de-porcentajes`
- `/blog/que-porcentaje-es-una-cantidad-de-otra`
- `/blog/como-sumar-un-porcentaje`
- `/blog/como-restar-un-porcentaje`
- `/blog/aumento-porcentual`

## Fuentes sugeridas para verificar antes de publicar

- Documentacion oficial de Microsoft Excel sobre formato de porcentaje y formulas.
- Ayuda oficial de Google Sheets sobre formato numerico y porcentajes.

## FAQ sugeridas

- Como calcular 20% en Excel?
- Como sacar porcentaje entre dos celdas?
- Como calcular descuento en Excel?
- Por que mi porcentaje aparece multiplicado por 100?

## Criterios de aceptacion

- Debe incluir formulas listas para copiar.
- Debe distinguir entre celdas con `20%` y celdas con `20`.
- Debe mencionar que Excel y Sheets usan el mismo enfoque para estas formulas basicas.
- Debe enlazar a la calculadora como verificador rapido.
