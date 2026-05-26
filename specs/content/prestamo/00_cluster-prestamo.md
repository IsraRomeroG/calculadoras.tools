# Cluster de contenido - Prestamo

## Objetivo del cluster

Construir autoridad alrededor de la calculadora de prestamo y capturar busquedas
informacionales, comparativas y transaccionales relacionadas con cuota mensual,
intereses, CAT, comisiones, seguros, tabla de amortizacion y pagos extra.

## Pagina pilar

- Calculadora: `/finanzas/calculadora-de-prestamo`
- Categoria editorial: `Finanzas`
- Tipo de contenido: educacion financiera y simulacion, no asesoria financiera
- Tono: claro, practico, prudente y orientado a comparar escenarios

## Arquitectura recomendada

1. Articulos base: cuota mensual, intereses, CAT, tabla de amortizacion.
2. Casos long-tail: prestamos de `$50,000` y `$100,000`.
3. Costos reales: comision por apertura, seguro mensual y costo total.
4. Decision y comparacion: plazos, prestamo personal vs tarjeta, nomina vs
   personal, comparar dos creditos.
5. Optimizacion: pagos extra, abono a capital y capacidad de pago.
6. Tipos de prestamo: automotriz, microcreditos, apps y prestamos entre
   particulares.
7. Soporte tecnico: sistema frances, conversion de tasas y tabla en Excel.

## Reglas editoriales globales

- No presentar resultados como oferta de credito ni aprobacion garantizada.
- Usar "estimacion", "simulacion" y "escenario" cuando se hable de resultados.
- Aclarar que el CAT exacto depende de la institucion, comisiones, seguros,
  impuestos, periodicidad y condiciones del contrato.
- Recomendar comparar costo total y CAT, no solo la mensualidad.
- Evitar recomendar un producto financiero especifico sin fuente y contexto.
- Enlazar siempre a la calculadora de prestamo con anchor contextual.
- Incluir advertencia breve cuando el articulo trate endeudamiento, tarjetas,
  apps de credito o consolidacion de deudas.

## Fuentes base

- Banxico - Calculadora del Costo Anual Total:
  `https://www.banxico.org.mx/CAT/`
- CONDUSEF - Simulador de credito personal y de nomina:
  `https://phpapps.condusef.gob.mx/condusef_personalnomina/index.php`
- CONDUSEF - Credito personal, CAT, comisiones, seguros y tabla:
  `https://revista.condusef.gob.mx/credito/personal/2014/02/que-nada-te-detenga/`

## Enlaces internos centrales

- `/finanzas/calculadora-de-prestamo`
- `/blog/como-calcular-cuota-mensual-prestamo`
- `/blog/tabla-amortizacion-prestamo`
- `/blog/cat-vs-tasa-interes`
- `/blog/como-calcular-intereses-prestamo`
- `/blog/pagos-extra-prestamo-abono-capital`
- `/blog/comparar-dos-prestamos`

## Inventario de articulos

| Archivo spec | Slug futuro | Prioridad |
|---|---|---|
| `01_como-calcular-cuota-mensual-prestamo.md` | `/blog/como-calcular-cuota-mensual-prestamo` | P0 |
| `02_tabla-amortizacion-prestamo.md` | `/blog/tabla-amortizacion-prestamo` | P0 |
| `03_cat-vs-tasa-interes.md` | `/blog/cat-vs-tasa-interes` | P0 |
| `04_como-calcular-intereses-prestamo.md` | `/blog/como-calcular-intereses-prestamo` | P0 |
| `05_prestamo-50000-cuanto-pago.md` | `/blog/prestamo-50000-cuanto-pago` | P0 |
| `06_prestamo-100000-cuanto-pago.md` | `/blog/prestamo-100000-cuanto-pago` | P0 |
| `07_pagos-extra-prestamo-abono-capital.md` | `/blog/pagos-extra-prestamo-abono-capital` | P1 |
| `08_comision-apertura-prestamo.md` | `/blog/comision-apertura-prestamo` | P1 |
| `09_seguro-mensual-credito.md` | `/blog/seguro-mensual-credito` | P1 |
| `10_prestamo-12-24-36-48-meses.md` | `/blog/prestamo-12-24-36-48-meses` | P1 |
| `11_prestamo-personal-vs-tarjeta-credito.md` | `/blog/prestamo-personal-vs-tarjeta-credito` | P1 |
| `12_prestamo-nomina-vs-prestamo-personal.md` | `/blog/prestamo-nomina-vs-prestamo-personal` | P1 |
| `13_cuanto-puedo-pedir-prestado-segun-ingreso.md` | `/blog/cuanto-puedo-pedir-prestado-segun-ingreso` | P1 |
| `14_sistema-frances-amortizacion.md` | `/blog/sistema-frances-amortizacion` | P2 |
| `15_tasa-anual-mensual-diaria-prestamo.md` | `/blog/tasa-anual-mensual-diaria-prestamo` | P2 |
| `16_comparar-dos-prestamos.md` | `/blog/comparar-dos-prestamos` | P2 |
| `17_credito-automotriz-calcular-mensualidad.md` | `/blog/credito-automotriz-calcular-mensualidad` | P2 |
| `18_microcreditos-apps-prestamos-caros.md` | `/blog/microcreditos-apps-prestamos-caros` | P2 |
| `19_prestamos-entre-particulares.md` | `/blog/prestamos-entre-particulares` | P2 |
| `20_tabla-amortizacion-excel.md` | `/blog/tabla-amortizacion-excel` | P2 |

## Criterios de aceptacion del cluster

- Cada articulo debe tener un CTA hacia la calculadora.
- Cada articulo debe tener al menos 2 enlaces internos del cluster cuando ya
  existan.
- Cada articulo debe incluir frontmatter compatible con `src/content.config.ts`.
- Los articulos deben citar o verificar fuentes oficiales cuando hablen de CAT,
  obligaciones, comisiones, seguros o productos financieros.
