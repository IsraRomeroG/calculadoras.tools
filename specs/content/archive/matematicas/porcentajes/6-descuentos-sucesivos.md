# Spec de contenido - Descuentos sucesivos

## Objetivo

Crear un articulo financiero-practico sobre descuentos acumulados para capturar busquedas de compras, promociones, cupones y rebajas encadenadas.

## Archivo final sugerido

- Ruta: `src/content/blog/finanzas/descuentos-sucesivos.md`
- URL esperada: `/blog/descuentos-sucesivos`
- Categoria: `Finanzas`
- Calculadora relacionada: `/matematicas/calculadora-de-porcentajes`

## Frontmatter sugerido

```yaml
---
title: "Descuentos sucesivos: por que 20% + 10% no es 30%"
seoTitle: "Descuentos sucesivos: formula para calcular rebajas acumuladas"
description: "Aprende como calcular descuentos sucesivos y por que dos rebajas se aplican una despues de otra, no sumando porcentajes."
pubDate: 2026-XX-XX
category: "Finanzas"
tags:
  - descuentos
  - compras
  - porcentajes
readTime: "5 min"
relatedCalculator:
  label: "Usar calculadora de porcentajes"
  href: "/matematicas/calculadora-de-porcentajes"
---
```

## Intencion de busqueda

- Principal: calcular el precio final con dos o mas descuentos.
- Secundarias: descuentos acumulados, cupones, promociones, rebajas encadenadas.
- Nivel: basico-intermedio.

## Keywords

- Primaria: `descuentos sucesivos`
- Secundarias: `descuentos acumulados`, `calcular descuentos encadenados`, `20% mas 10% descuento`, `precio final con dos descuentos`

## Mensaje central

Los descuentos sucesivos se aplican sobre el precio que queda despues del descuento anterior. Por eso 20% y 10% no equivalen a 30%, sino a 28% de descuento total.

## Estructura recomendada

1. Introduccion: ejemplo de tienda con "20% + 10% adicional".
2. `## Que son los descuentos sucesivos`
   - Definir descuento sobre precio reducido.
3. `## Formula para calcular descuentos sucesivos`
   - `final = precio * (1 - d1/100) * (1 - d2/100)`.
4. `## Ejemplo: 20% y luego 10%`
   - `1,000 * 0.80 * 0.90 = 720`.
   - Descuento efectivo: 28%.
5. `## Como calcular el descuento total equivalente`
   - `1 - (final / precio inicial)`.
6. `## Tabla con combinaciones comunes`
   - 10% + 10%, 20% + 10%, 30% + 20%, 50% + 10%.
7. `## Errores comunes al comparar promociones`
   - Sumar porcentajes.
   - No revisar si el cupon aplica antes o despues de impuestos/envio.
8. `## Calculalo con la calculadora`
   - Explicar que se puede usar el modo "Restar %" en pasos.
9. `## Preguntas frecuentes`

## Ejemplos obligatorios

- 1,000 con 20% y 10% -> 720.
- 500 con 10% y 10% -> 405.
- 2,000 con 30% y 20% -> 1,120.
- 800 con 50% y 10% -> 360.

## Enlaces internos

- `/blog/porcentaje-de-descuento`
- `/blog/como-restar-un-porcentaje`
- `/blog/porcentaje-inverso`
- `/matematicas/calculadora-de-porcentajes`

## FAQ sugeridas

- Como se calculan dos descuentos seguidos?
- Por que 20% + 10% no es 30%?
- Que es el descuento efectivo?
- Conviene mas un descuento unico o descuentos sucesivos?

## Criterios de aceptacion

- Debe incluir formula con multiplicadores.
- Debe explicar descuento efectivo.
- Debe incluir tabla comparativa.
- Debe mantener tono de compra inteligente, no de matematicas abstractas.
