# Spec de contenido - Como restar un porcentaje a una cantidad

## Objetivo

Crear un articulo que capture busquedas sobre quitar un porcentaje de una cantidad, especialmente descuentos, rebajas, retenciones y reducciones simples.

## Archivo final sugerido

- Ruta: `src/content/blog/matematicas/como-restar-un-porcentaje.md`
- URL esperada: `/blog/como-restar-un-porcentaje`
- Categoria: `Matemáticas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Como restar un porcentaje a una cantidad"
seoTitle: "Como restar un porcentaje: formula y ejemplos"
description: "Aprende como quitar un porcentaje de una cantidad para calcular descuentos, rebajas y reducciones sin errores."
pubDate: 2026-XX-XX
category: "Matemáticas"
tags:
  - porcentajes
  - descuentos
  - reducciones
readTime: "4 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---
```

## Intencion de busqueda

- Principal: obtener el resultado final despues de descontar un porcentaje.
- Secundarias: calcular rebajas, retenciones, reducciones y precios finales.
- Nivel: basico.

## Keywords

- Primaria: `restar porcentaje`
- Secundarias: `quitar porcentaje`, `restar 20 por ciento`, `calcular precio final con descuento`, `formula para restar porcentaje`

## Mensaje central

Para restar un porcentaje, calcula el descuento y restalo de la base, o multiplica directamente por `1 - porcentaje / 100`.

## Estructura recomendada

1. Introduccion con ejemplo "1,000 - 20%".
2. `## Formula para restar un porcentaje`
   - Metodo 1: `descuento = base * porcentaje / 100`; `final = base - descuento`.
   - Metodo 2: `final = base * (1 - porcentaje / 100)`.
3. `## Ejemplo paso a paso`
   - `1,000 - 20% = 800`.
4. `## Tabla de descuentos comunes`
   - 5%, 10%, 15%, 20%, 25%, 50%.
5. `## Cuándo se usa`
   - Rebajas en tiendas.
   - Retenciones.
   - Reduccion de presupuesto.
   - Disminucion de una cantidad.
6. `## Diferencia entre restar porcentaje y calcular disminucion porcentual`
   - Restar porcentaje parte de la base y produce un valor final.
   - Disminucion porcentual compara valor inicial vs valor final.
7. `## Calculalo con la calculadora`
   - CTA al modo "Restar %".
8. `## Preguntas frecuentes`

## Ejemplos obligatorios

- `1,000 - 20% = 800`
- `750 - 15% = 637.50`
- `500 - 8% = 460`
- `2,400 - 25% = 1,800`

## Enlaces internos

- `/matematicas/calculadora-de-porcentajes`
- `/blog/porcentaje-de-descuento`
- `/blog/disminucion-porcentual`
- `/blog/descuentos-sucesivos`

## FAQ sugeridas

- Como quitar el 20% a una cantidad?
- Por que no es lo mismo restar 20 que restar 20%?
- Como calcular el precio final con descuento?
- Puede quedar un resultado negativo al restar un porcentaje?

## Criterios de aceptacion

- Debe diferenciar claramente "descuento" de "disminucion porcentual".
- Debe incluir tabla de descuentos comunes.
- Debe usar ejemplos de dinero, pero explicar que aplica a cualquier cantidad.
- Debe enlazar al post `porcentaje-de-descuento`.
