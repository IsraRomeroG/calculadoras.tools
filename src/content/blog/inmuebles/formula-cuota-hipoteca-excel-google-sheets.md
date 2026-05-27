---
title: "Fórmula de cuota de hipoteca en Excel y Google Sheets"
seoTitle: "Fórmula para calcular hipoteca en Excel y Google Sheets"
description: "Aprende qué fórmula usar para estimar la cuota mensual de una hipoteca en Excel o Google Sheets y cómo validar el resultado."
pubDate: 2026-06-19
category: "Inmuebles"
tags:
  - fórmula hipoteca
  - excel
  - google sheets
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca"
---

Puedes calcular la cuota mensual de una hipoteca en Excel o Google Sheets usando una función financiera de pago. La clave es preparar bien los datos: monto, tasa mensual y número total de pagos.

Si necesitas una estimación rápida sin armar una hoja, usa la [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca).

## Datos que necesitas

Para calcular la cuota necesitas:

- Monto del préstamo.
- Tasa anual.
- Plazo en años.

Después conviertes:

```txt
tasa_mensual = tasa_anual / 12 / 100
numero_pagos = años x 12
```

Si la tasa anual es `9%` y el plazo es `20 años`:

```txt
tasa_mensual = 9 / 12 / 100 = 0.0075
numero_pagos = 20 x 12 = 240
```

## Fórmula financiera de cuota

La fórmula matemática es:

```txt
cuota = P x [r(1 + r)^n] / [(1 + r)^n - 1]
```

Pero en hoja de cálculo puedes usar una función financiera equivalente.

## Cómo usar PAGO en Excel o Sheets

La estructura general es:

```txt
PAGO(tasa_mensual, numero_pagos, -monto)
```

Ejemplo:

```txt
PAGO(0.0075, 240, -2000000)
```

El resultado estimado es:

```txt
$17,994.52
```

El nombre de la función puede variar según idioma o configuración. Verifica si tu hoja usa `PAGO`, `PMT` u otra localización.

## Ejemplo con $2,000,000 a 20 años

Datos:

- Monto: `$2,000,000`
- Tasa anual: `9%`
- Plazo: `20 años`

Conversiones:

```txt
tasa mensual = 0.0075
número de pagos = 240
```

Fórmula:

```txt
PAGO(0.0075, 240, -2000000)
```

Resultado:

```txt
$17,994.52
```

Ese es el mismo valor base usado por la calculadora.

## Errores comunes de signo y tasa

Errores frecuentes:

- Usar `9` como tasa mensual.
- Usar `0.09` sin dividir entre 12.
- Omitir el signo negativo del monto.
- Usar plazo en años en vez de meses.
- Redondear la tasa mensual antes de tiempo.
- Confundir tasa de interés con CAT.

Si el resultado parece enorme o negativo, revisa signo y tasa.

## Valida el resultado con la calculadora

Después de crear tu fórmula, valida el resultado con la [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca). La herramienta también genera la tabla de amortización y permite exportar CSV.

Para la tabla completa, revisa [cómo hacer una tabla de amortización hipotecaria en Excel](/blog/tabla-amortizacion-hipoteca-excel).

## Preguntas frecuentes

### Qué función calcula la mensualidad?

En muchas versiones en español se usa `PAGO`; en inglés suele ser `PMT`. Verifica tu versión.

### Por qué Excel muestra el pago negativo?

Porque las funciones financieras distinguen entradas y salidas de dinero. Puedes usar el monto en negativo para ver la cuota positiva.

### Debo usar tasa anual o mensual?

La fórmula mensual usa tasa mensual. Convierte la tasa anual antes de calcular.

### Por qué mi resultado no coincide exactamente?

Puede ser por redondeos, idioma de función, separadores decimales o uso de una tasa distinta.

## Fuentes consultadas

- [CONDUSEF: Simulador de crédito hipotecario](https://www.condusef.gob.mx/?p=simulador_hipoteca)
- [Banco de México: indicadores básicos de créditos a la vivienda](https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-a-la-vivienda/rib-creditos-vivienda--tasas-.html)
