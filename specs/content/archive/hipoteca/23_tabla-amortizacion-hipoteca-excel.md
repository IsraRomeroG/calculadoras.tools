# Spec de articulo: Tabla de amortizacion hipotecaria en Excel

## Archivo objetivo

- Ruta futura: `src/content/blog/inmuebles/tabla-amortizacion-hipoteca-excel.md`
- URL publica: `/blog/tabla-amortizacion-hipoteca-excel`
- Categoria: `Inmuebles`
- Prioridad: P2
- Rol en el cluster: soporte practico, spreadsheet y captura de busquedas

## Metadata sugerida

```yaml
title: "Como hacer una tabla de amortizacion hipotecaria en Excel"
seoTitle: "Tabla de amortizacion hipotecaria en Excel: formulas paso a paso"
description: "Aprende a crear una tabla de amortizacion hipotecaria en Excel o Google Sheets con formulas para pago, interes, capital y saldo."
pubDate: 2026-XX-XX
category: "Inmuebles"
tags:
  - tabla de amortizacion
  - excel
  - hipoteca
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca"
```

## Intencion SEO

- Keyword principal: `tabla amortizacion hipoteca Excel`
- Secundarias: `hacer tabla de amortizacion hipotecaria`, `formula hipoteca Excel`, `tabla pagos hipoteca Excel`
- Intencion: construir o validar una tabla manualmente.

## Promesa del articulo

Mostrar una estructura sencilla para crear una tabla de amortizacion hipotecaria
en hoja de calculo y explicar cuando conviene usar la calculadora para evitar
errores.

## Formulas sugeridas

Usar nombres genericos, no depender de idioma de Excel si no se verifica:

```txt
pago mensual = PAGO(tasa_mensual, numero_pagos, -monto)
interes = saldo_anterior x tasa_mensual
capital = pago - interes
saldo = saldo_anterior - capital
```

## Estructura recomendada

1. `## Datos iniciales`
2. `## Formula de pago mensual`
3. `## Columnas de la tabla`
4. `## Formulas para interes, capital y saldo`
5. `## Ejemplo de primeras filas`
6. `## Errores comunes en Excel`
7. `## Exporta o valida con la calculadora`

## Enlaces internos

- `/inmuebles/calculadora-de-hipoteca`
- `/blog/tabla-amortizacion-hipoteca`
- `/blog/sistema-frances-hipoteca`
- `/blog/como-calcular-cuota-mensual-hipoteca`

## FAQ sugeridas

- Que funcion de Excel calcula la cuota?
- Como calculo intereses por mes?
- Por que mi tabla no llega a cero?
- Puedo exportar CSV desde la calculadora?

## Fuentes y notas

- Verificar nombres de funciones en Excel/Google Sheets en espanol antes de
  publicar si se incluyen formulas exactas.
- La calculadora ya ofrece exportacion CSV; usarlo como CTA natural.

## Criterios de aceptacion

- Incluye estructura de columnas.
- Incluye formulas basicas.
- Menciona errores de redondeo.
- CTA hacia exportar CSV desde la calculadora.
