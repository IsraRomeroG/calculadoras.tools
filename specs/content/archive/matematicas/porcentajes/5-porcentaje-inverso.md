# Spec de contenido - Porcentaje inverso

## Objetivo

Crear un articulo sobre como recuperar el valor original cuando ya se conoce un valor final despues de aplicar un porcentaje, especialmente despues de descuentos, aumentos o impuestos.

## Archivo final sugerido

- Ruta: `src/content/blog/matematicas/porcentaje-inverso.md`
- URL esperada: `/blog/porcentaje-inverso`
- Categoria: `Matemáticas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Porcentaje inverso: como encontrar el valor original"
seoTitle: "Porcentaje inverso: calcular el precio original"
description: "Aprende como calcular el valor original antes de un descuento, aumento o impuesto usando porcentaje inverso."
pubDate: 2026-XX-XX
category: "Matemáticas"
tags:
  - porcentaje inverso
  - descuentos
  - valor original
readTime: "5 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---
```

## Intencion de busqueda

- Principal: hallar el precio o valor inicial a partir del valor final.
- Secundarias: precio original antes de descuento, base antes de IVA, valor antes de aumento.
- Nivel: intermedio.

## Keywords

- Primaria: `porcentaje inverso`
- Secundarias: `precio original antes del descuento`, `calcular valor original porcentaje`, `quitar descuento inverso`, `calcular base antes de aumento`

## Mensaje central

No se recupera el valor original sumando o restando el mismo porcentaje al resultado final. Se divide entre el multiplicador que produjo el cambio.

## Estructura recomendada

1. Introduccion con problema: "pague 800 con 20% de descuento, cual era el precio original?".
2. `## Que es el porcentaje inverso`
   - Definicion simple.
3. `## Formula si hubo descuento`
   - `original = precio final / (1 - descuento / 100)`.
4. `## Formula si hubo aumento`
   - `original = precio final / (1 + aumento / 100)`.
5. `## Ejemplo con descuento`
   - `800 / 0.80 = 1,000`.
6. `## Ejemplo con aumento o impuesto`
   - `1,160 / 1.16 = 1,000`.
7. `## Error comun: sumar el porcentaje al valor final`
   - Mostrar por que `800 + 20% = 960`, no 1,000.
8. `## Cuando usar la calculadora`
   - Explicar como aproximarlo con los modos de sumar/restar y que podria requerir calculo manual.
9. `## Preguntas frecuentes`

## Ejemplos obligatorios

- Final 800 con 20% de descuento -> original 1,000.
- Final 1,160 con 16% de aumento -> original 1,000.
- Final 450 con 10% de descuento -> original 500.
- Final 1,500 despues de aumentar 25% -> original 1,200.

## Enlaces internos

- `/matematicas/calculadora-de-porcentajes`
- `/blog/como-restar-un-porcentaje`
- `/blog/como-sumar-un-porcentaje`
- `/blog/porcentaje-de-descuento`
- `/blog/como-desglosar-iva`

## FAQ sugeridas

- Como calcular el precio original antes de un descuento?
- Por que no basta con sumar el porcentaje al precio final?
- Como encontrar el valor antes de un aumento?
- El porcentaje inverso sirve para IVA incluido?

## Criterios de aceptacion

- Debe explicar claramente el uso de multiplicadores.
- Debe incluir ejemplos de descuento y aumento.
- Debe advertir el error de sumar/restar el porcentaje al valor final.
- Debe enlazar al contenido de IVA incluido como caso relacionado.
