---
title: "Cómo hacer una tabla de amortización en Excel"
seoTitle: "Tabla de amortización en Excel: fórmulas de pago, interés y capital"
description: "Aprende a crear una tabla de amortización en Excel o Google Sheets con fórmulas para pago, intereses, capital y saldo."
pubDate: 2026-06-01
categorySlug: "finanzas"
tags:
  - tabla de amortización
  - excel
  - préstamo
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de préstamo"
  href: "/finanzas/calculadora-de-prestamo"
---

Hacer una tabla de amortización en Excel o Google Sheets te permite ver cómo se paga un préstamo mes a mes: cuota, intereses, capital y saldo pendiente.

También sirve para validar una simulación, revisar pagos extra o entender por qué al inicio una parte grande del pago se va a intereses.

## Datos iniciales

Antes de construir la tabla, define estas celdas:

| Dato               |  Ejemplo |
| ------------------ | -------: |
| Monto del préstamo |  $50,000 |
| Tasa anual         |      24% |
| Plazo              | 24 meses |
| Tasa mensual       |       2% |

La tasa mensual se calcula así:

```txt
tasa mensual = tasa anual / 12
```

Con tasa anual de `24%`:

```txt
24% / 12 = 2%
```

## Fórmula de pago mensual

En Excel en español, la función `PAGO` calcula el pago periódico de un préstamo con pagos constantes y tasa constante.

Una forma genérica de escribirlo es:

```txt
pago mensual = PAGO(tasa_mensual, numero_pagos, -monto)
```

El signo negativo en el monto ayuda a que el resultado salga positivo, porque las hojas de cálculo distinguen entradas y salidas de dinero.

Microsoft documenta la función como:

```txt
PAGO(tasa,nper,va,vf,tipo)
```

Google Sheets también tiene la función `PAGO` con argumentos equivalentes.

## Columnas de la tabla

Crea columnas como estas:

| Mes |    Pago | Interés | Capital | Saldo pendiente |
| --: | ------: | ------: | ------: | --------------: |
|   1 | fórmula | fórmula | fórmula |         fórmula |
|   2 | fórmula | fórmula | fórmula |         fórmula |

El saldo inicial del mes 1 es el monto del préstamo. Después, cada fila usa el saldo final de la fila anterior.

## Fórmulas para interés, capital y saldo

Las fórmulas básicas son:

```txt
interés = saldo_anterior x tasa_mensual
capital = pago - interés
saldo = saldo_anterior - capital
```

Con un préstamo de `$50,000`, tasa mensual de `2%` y pago de `$2,643.55`, el primer mes sería:

```txt
interés = 50000 x 0.02 = 1000
capital = 2643.55 - 1000 = 1643.55
saldo = 50000 - 1643.55 = 48356.45
```

El segundo mes usa `$48,356.45` como saldo anterior.

## Ejemplo de primeras filas

| Mes |      Pago |   Interés |   Capital | Saldo pendiente |
| --: | --------: | --------: | --------: | --------------: |
|   1 | $2,643.55 | $1,000.00 | $1,643.55 |      $48,356.45 |
|   2 | $2,643.55 |   $967.13 | $1,676.43 |      $46,680.02 |
|   3 | $2,643.55 |   $933.60 | $1,709.95 |      $44,970.06 |

Si la última fila no llega exactamente a cero, puede ser por redondeos. En ese caso, ajusta el último pago para liquidar el saldo pendiente.

## Errores comunes en Excel

Los errores más frecuentes son:

- Usar tasa anual donde la fórmula necesita tasa mensual.
- Poner `24` en vez de `24%` o `0.24`.
- No usar el mismo periodo para tasa y pagos.
- Redondear cada fila en vez de redondear solo al mostrar.
- No ajustar el último pago.
- Mezclar seguro mensual con intereses.

Si agregas seguro, mantenlo en una columna separada para no confundirlo con interés.

## Exporta o valida con la calculadora

La forma más rápida de validar tu tabla es usar la [calculadora de préstamo](/finanzas/calculadora-de-prestamo). Captura los mismos datos y compara la tabla de amortización.

La calculadora también permite exportar CSV, así que puedes generar el archivo y abrirlo en Excel o Google Sheets para revisarlo sin construir todas las fórmulas desde cero.

Para repasar el concepto, lee [tabla de amortización de un préstamo](/blog/finanzas/tabla-amortizacion-prestamo), [sistema francés de amortización](/blog/finanzas/sistema-frances-amortizacion) y [cómo calcular la cuota mensual](/blog/finanzas/como-calcular-cuota-mensual-prestamo).

## Preguntas frecuentes

### Qué función de Excel calcula la cuota?

La función `PAGO` calcula el pago periódico de un préstamo con tasa constante y pagos constantes.

### Cómo calculo intereses por mes?

Multiplica el saldo pendiente del mes anterior por la tasa mensual.

### Por qué mi tabla no llega a cero?

Normalmente por redondeos. Usa más decimales en los cálculos internos y ajusta el último pago si hace falta.

### Puedo exportar la tabla desde la calculadora?

Sí. La calculadora de préstamo permite exportar la tabla en CSV para abrirla en una hoja de cálculo.

## Fuentes consultadas

- [Microsoft Support: Función PAGO](https://support.microsoft.com/es-es/office/funci%C3%B3n-pago-0214da64-9a63-4996-bc20-214433fa6441)
- [Google Docs Editors Help: PAGO](https://support.google.com/docs/answer/3093185?hl=es-419)
- [CONDUSEF: Simulador de Crédito Personal y Nómina](https://phpapps.condusef.gob.mx/condusef_personalnomina/)
