# Spec de articulo: Cuanto puedo pedir prestado para comprar casa

## Archivo objetivo

- Ruta futura: `src/content/blog/inmuebles/cuanto-puedo-pedir-prestado-para-casa.md`
- URL publica: `/blog/cuanto-puedo-pedir-prestado-para-casa`
- Categoria: `Inmuebles`
- Prioridad: P1
- Rol en el cluster: puente a capacidad de pago y fase futura de calculadora

## Metadata sugerida

```yaml
title: "Cuanto puedo pedir prestado para comprar casa"
seoTitle: "Cuanto puedo pedir de hipoteca segun mi mensualidad"
description: "Aprende a estimar cuanto podrias pedir prestado para una casa segun la mensualidad que puedes pagar, la tasa y el plazo."
pubDate: 2026-XX-XX
category: "Inmuebles"
tags:
  - capacidad de pago
  - hipoteca
  - vivienda
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca"
```

## Intencion SEO

- Keyword principal: `cuanto puedo pedir prestado para casa`
- Secundarias: `cuanto me prestan para una casa`, `capacidad de pago hipoteca`, `monto maximo credito hipotecario`
- Intencion: estimar monto de credito a partir de una mensualidad posible.

## Promesa del articulo

Explicar que el monto de credito depende de mensualidad disponible, tasa, plazo,
ingresos, deudas y politicas de la institucion. Debe presentar una formula
orientativa sin prometer aprobacion.

## Formula sugerida

```txt
monto = cuota x [(1 + r)^n - 1] / [r(1 + r)^n]
```

Si la tasa mensual es 0:

```txt
monto = cuota x n
```

## Estructura recomendada

1. `## De que depende cuanto te pueden prestar`
2. `## Formula para estimar el monto desde una mensualidad`
3. `## Ejemplo con $15,000 al mes`
4. `## Por que el banco puede aprobar menos`
5. `## Como usar la calculadora actual`
6. `## Errores comunes al estimar capacidad de pago`
7. `## Preguntas frecuentes`

## Ejemplo obligatorio

- Mensualidad maxima: `$15,000`
- Tasa anual: `9%`
- Plazo: `20 anos`
- Monto estimado esperado: `$1,667,174.31`

## Enlaces internos

- `/inmuebles/calculadora-de-hipoteca`
- `/blog/como-calcular-cuota-mensual-hipoteca`
- `/blog/enganche-para-casa-hipoteca`
- `/blog/comparar-creditos-hipotecarios`

## FAQ sugeridas

- Como saber cuanto me presta el banco?
- Que porcentaje de mi ingreso deberia destinar a vivienda?
- La calculadora garantiza aprobacion?
- Por que mi capacidad baja si sube la tasa?

## Fuentes y notas

- No dar reglas universales de endeudamiento sin fuente.
- Aclarar que la aprobacion depende de historial, ingresos, deudas y politicas.

## Criterios de aceptacion

- Incluye formula inversa y ejemplo.
- Deja claro que es una estimacion.
- CTA a probar escenarios en la calculadora actual.
- No promete aprobacion ni monto garantizado.
