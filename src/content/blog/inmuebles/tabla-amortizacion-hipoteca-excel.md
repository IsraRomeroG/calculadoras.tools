---
title: "Cómo hacer una tabla de amortización hipotecaria en Excel"
seoTitle: "Tabla de amortización hipotecaria en Excel: fórmulas paso a paso"
description: "Aprende a crear una tabla de amortización hipotecaria en Excel o Google Sheets con fórmulas para pago, interés, capital y saldo."
pubDate: 2026-05-25
categorySlug: "inmuebles"
tags:
  - tabla de amortización
  - excel
  - hipoteca
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de hipoteca"
  href: "/inmuebles/calculadora-de-hipoteca"
---

Crear una tabla de amortización hipotecaria en Excel o Google Sheets te ayuda a validar cómo se divide cada pago entre capital e intereses. También sirve para revisar redondeos y entender por qué el saldo baja lentamente al inicio.

Si solo quieres el resultado rápido, puedes generar y exportar la tabla desde la [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca).

## Datos iniciales

Necesitas:

- Monto del préstamo.
- Tasa anual.
- Plazo en años.
- Pago extra mensual, si aplica.

Después calcula:

```txt
tasa mensual = tasa anual / 12 / 100
número de pagos = años x 12
```

## Fórmula de pago mensual

En una hoja de cálculo, la cuota puede calcularse con la función financiera de pago. En español suele aparecer como `PAGO`, aunque el nombre puede variar según idioma o configuración.

La idea es:

```txt
pago mensual = PAGO(tasa_mensual, numero_pagos, -monto)
```

El signo negativo del monto se usa porque la función distingue entradas y salidas de dinero.

## Columnas de la tabla

Usa estas columnas:

| Columna       | Descripción                           |
| ------------- | ------------------------------------- |
| Mes           | Número de pago                        |
| Saldo inicial | Saldo antes del pago                  |
| Pago          | Cuota del mes                         |
| Interés       | Interés calculado sobre saldo inicial |
| Capital       | Pago menos interés                    |
| Saldo final   | Saldo inicial menos capital           |

Si agregas pago extra, inclúyelo como columna adicional o súmalo al pago planeado.

## Fórmulas para interés, capital y saldo

Para cada fila:

```txt
interés = saldo_anterior x tasa_mensual
capital = pago - interés
saldo_nuevo = saldo_anterior - capital
```

Si hay pago extra:

```txt
pago_planeado = cuota_base + pago_extra
capital = pago_planeado - interés
```

La última fila debe ajustarse para no dejar saldo negativo.

## Ejemplo de primeras filas

Para `$2,000,000`, `9%` anual y `20 años`, la cuota es `$17,994.52`.

| Mes |       Pago |   Capital |    Interés |         Saldo |
| --: | ---------: | --------: | ---------: | ------------: |
|   1 | $17,994.52 | $2,994.52 | $15,000.00 | $1,997,005.48 |
|   2 | $17,994.52 | $3,016.98 | $14,977.54 | $1,993,988.50 |
|   3 | $17,994.52 | $3,039.61 | $14,954.91 | $1,990,948.90 |

## Errores comunes en Excel

Evita:

- Usar tasa anual directamente en una fórmula mensual.
- Olvidar dividir entre 100.
- Usar signo incorrecto en la función de pago.
- Redondear cada fila antes de calcular la siguiente.
- No ajustar la última cuota.
- Olvidar pagos extra.

Si tu tabla no termina en cero, probablemente hay un problema de redondeo o fórmula.

## Exporta o valida con la calculadora

La [calculadora de hipoteca](/inmuebles/calculadora-de-hipoteca) permite exportar CSV con la amortización completa. Puedes usarlo para comparar tu hoja de cálculo o como punto de partida.

También puedes revisar la guía sobre [sistema francés en una hipoteca](/blog/inmuebles/sistema-frances-hipoteca) para entender la lógica detrás de la cuota fija.

## Preguntas frecuentes

### Qué función de Excel calcula la cuota?

La función suele ser `PAGO` en español, pero puede variar por idioma. Verifica la documentación de tu versión.

### Cómo calculo intereses por mes?

Multiplica el saldo anterior por la tasa mensual en decimal.

### Por qué mi tabla no llega a cero?

Por redondeos, signos incorrectos o porque la última cuota no está ajustada.

### Puedo exportar CSV desde la calculadora?

Sí. La calculadora exporta todas las filas de amortización.

## Fuentes consultadas

- [CONDUSEF: Simulador de crédito hipotecario](https://phpapps.condusef.gob.mx/condusefhipotecario/index.php?amp=1)
- [Banco de México: indicadores básicos de créditos a la vivienda](https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-a-la-vivienda/rib-creditos-vivienda--tasas-.html)
