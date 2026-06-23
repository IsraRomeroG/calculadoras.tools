# Spec de articulo: Tabla de amortizacion en Excel

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/tabla-amortizacion-excel.md`
- URL publica: `/blog/tabla-amortizacion-excel`
- Categoria: `Finanzas`
- Prioridad: P2
- Rol en el cluster: soporte practico, spreadsheet y captura de busquedas

## Metadata sugerida

```yaml
title: "Como hacer una tabla de amortizacion en Excel"
seoTitle: "Tabla de amortizacion en Excel: formulas de pago, interes y capital"
description: "Aprende a crear una tabla de amortizacion en Excel o Google Sheets con formulas para pago, intereses, capital y saldo."
pubDate: 2026-XX-XX
category: "Finanzas"
tags:
  - tabla de amortizacion
  - excel
  - prestamo
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de prestamo"
  href: "/finanzas/calculadora-de-prestamo"
```

## Intencion SEO

- Keyword principal: `tabla de amortizacion Excel`
- Secundarias: `hacer tabla de amortizacion`, `formula PAGO Excel`, `tabla de pagos prestamo Excel`
- Intencion: construir o validar una tabla manualmente.

## Promesa del articulo

Mostrar una estructura sencilla para crear una tabla de amortizacion en hoja de
calculo y explicar cuando conviene usar la calculadora para evitar errores.

## Estructura recomendada

1. `## Datos iniciales`
2. `## Formula de pago mensual`
3. `## Columnas de la tabla`
4. `## Formulas para interes, capital y saldo`
5. `## Ejemplo de primeras filas`
6. `## Errores comunes en Excel`
7. `## Exporta o valida con la calculadora`

## Formulas sugeridas

Usar nombres genericos, no depender de idioma de Excel si no se verifica:

```txt
pago mensual = PAGO(tasa_mensual, numero_pagos, -monto)
interes = saldo_anterior x tasa_mensual
capital = pago - interes
saldo = saldo_anterior - capital
```

## Enlaces internos

- `/finanzas/calculadora-de-prestamo`
- `/blog/tabla-amortizacion-prestamo`
- `/blog/sistema-frances-amortizacion`
- `/blog/como-calcular-cuota-mensual-prestamo`

## FAQ sugeridas

- Que funcion de Excel calcula la cuota?
- Como calculo intereses por mes?
- Por que mi tabla no llega a cero?
- Puedo exportar la tabla desde la calculadora?

## Fuentes y notas

- Verificar nombres de funciones en Excel/Google Sheets en espanol antes de
  publicar si se incluyen formulas exactas.
- La calculadora ya ofrece exportacion CSV; usarlo como CTA natural.

## Criterios de aceptacion

- Incluye estructura de columnas.
- Incluye formulas basicas.
- Menciona errores de redondeo.
- CTA hacia exportar CSV desde la calculadora.
