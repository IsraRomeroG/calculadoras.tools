# Spec de contenido - Como sumar un porcentaje a una cantidad

## Objetivo

Crear un articulo orientado a usuarios que quieren agregar un porcentaje a un numero: aumentos de precio, comisiones, impuestos, propinas, recargos o incrementos salariales.

## Archivo final sugerido

- Ruta: `src/content/blog/matematicas/como-sumar-un-porcentaje.md`
- URL esperada: `/blog/como-sumar-un-porcentaje`
- Categoria: `Matemáticas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Como sumar un porcentaje a una cantidad"
seoTitle: "Como sumar un porcentaje: formula y ejemplos"
description: "Aprende como agregar un porcentaje a una cantidad con formula directa, ejemplos de precios, recargos e incrementos."
pubDate: 2026-XX-XX
category: "Matemáticas"
tags:
  - porcentajes
  - aumentos
  - recargos
readTime: "4 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---
```

## Intencion de busqueda

- Principal: saber cuanto queda una cantidad despues de sumarle X%.
- Secundarias: sumar IVA, agregar comision, aumentar precio, aplicar recargo.
- Nivel: basico-intermedio.

## Keywords

- Primaria: `sumar porcentaje`
- Secundarias: `agregar porcentaje a una cantidad`, `sumar 10 por ciento a un precio`, `aumentar una cantidad en porcentaje`, `formula para sumar porcentaje`

## Mensaje central

Hay dos formas equivalentes: calcular primero el incremento y sumarlo, o multiplicar directamente por `1 + porcentaje / 100`.

## Estructura recomendada

1. Introduccion con caso comun: "500 + 16%".
2. `## Formula para sumar un porcentaje`
   - Metodo 1: `incremento = base * porcentaje / 100`, `total = base + incremento`.
   - Metodo 2: `total = base * (1 + porcentaje / 100)`.
3. `## Ejemplo paso a paso`
   - `500 + 16% = 580`.
4. `## Atajo con multiplicadores`
   - 10% -> multiplicar por 1.10.
   - 16% -> multiplicar por 1.16.
   - 25% -> multiplicar por 1.25.
5. `## Casos de uso frecuentes`
   - Precio con recargo.
   - Salario con aumento.
   - Propina.
   - Impuestos o IVA, con enlace al articulo especifico.
6. `## Errores comunes`
   - Sumar "16" en vez de 16%.
   - Confundir sumar porcentaje con calcular que porcentaje representa una cantidad.
   - Redondear antes de terminar.
7. `## Calculalo con la calculadora`
   - CTA al modo "Sumar %".
8. `## Preguntas frecuentes`

## Ejemplos obligatorios

- `500 + 16% = 580`
- `1,200 + 10% = 1,320`
- `850 + 25% = 1,062.50`
- `300 + 8% = 324`

## Enlaces internos

- `/matematicas/calculadora-de-porcentajes`
- `/blog/aumento-porcentual`
- `/blog/como-calcular-porcentajes`
- `/blog/como-sumar-iva-a-un-precio`

## FAQ sugeridas

- Como sumar 10% a una cantidad?
- Como sumar 16% a un precio?
- Es mejor multiplicar por 1.16 o sumar el incremento?
- Que diferencia hay entre sumar porcentaje y aumento porcentual?

## Criterios de aceptacion

- Debe mostrar los dos metodos de calculo.
- Debe incluir una tabla de multiplicadores comunes.
- Debe enlazar al articulo de IVA cuando use impuestos como ejemplo.
- Debe conectar explicitamente con el modo "Sumar %" de la calculadora.
