# Spec de articulo: Formula del IMC en Excel y Google Sheets

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/formula-imc-excel-google-sheets.md`
- URL publica: `/blog/formula-imc-excel-google-sheets`
- Categoria: `Salud`
- Prioridad: P2
- Rol en el cluster: articulo practico de formulas

## Metadata sugerida

```yaml
title: "Formula del IMC en Excel y Google Sheets"
seoTitle: "Como calcular el IMC en Excel y Google Sheets"
description: "Aprende formulas para calcular el IMC en Excel o Google Sheets con peso en kg, altura en metros o centimetros."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - imc
  - excel
  - google sheets
readTime: "5 min"
relatedCalculator:
  label: "Calculadora de IMC"
  href: "/salud/calculadora-de-imc"
```

## Intencion SEO

- Keyword principal: `imc excel`
- Secundarias: `formula imc Excel`, `calcular imc Google Sheets`, `IMC hoja de calculo`
- Intencion: copiar formulas para hojas de calculo.

## Promesa del articulo

Dar formulas listas para copiar segun si la altura esta en metros o en
centimetros.

## Estructura recomendada

1. `## Formula del IMC en Excel`
2. `## Si la altura esta en metros`
3. `## Si la altura esta en centimetros`
4. `## Clasificar el resultado con SI`
5. `## Errores comunes`
6. `## Verifica tu resultado con la calculadora`

## Ejemplos obligatorios

- `=A2/(B2^2)` con altura en metros.
- `=A2/((B2/100)^2)` con altura en centimetros.
- Ejemplo 75 kg y 172 cm.

## Enlaces internos

- `/salud/calculadora-de-imc`
- `/blog/que-es-el-imc-y-como-se-calcula`
- `/blog/tabla-imc-adultos-rangos-categorias`

## Fuentes y notas

- Verificar funciones de Excel/Sheets si se usan formulas condicionales.

## Criterios de aceptacion

- Debe incluir formulas listas para copiar.
- Debe distinguir metros y centimetros.
- Debe enlazar a calculadora como verificador rapido.
