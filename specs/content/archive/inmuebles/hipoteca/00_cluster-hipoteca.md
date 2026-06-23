# Cluster de contenido - Hipoteca

## Objetivo del cluster

Construir autoridad alrededor de la calculadora de hipoteca y capturar busquedas
informacionales, comparativas y transaccionales relacionadas con cuota mensual,
enganche, monto financiado, tasa de interes, plazo, tabla de amortizacion,
pagos extra, intereses totales y costos no incluidos en el credito.

El cluster debe ayudar a que la calculadora posicione para consultas de alta
intencion como "calcular hipoteca", "cuanto pago por una hipoteca", "tabla de
amortizacion hipoteca", "enganche para casa" y "pago extra hipoteca".

## Pagina pilar

- Calculadora: `/inmuebles/calculadora-de-hipoteca`
- Categoria editorial: `Inmuebles`
- Tipo de contenido: educacion financiera e inmobiliaria, no asesoria
  financiera, legal ni fiscal
- Tono: claro, practico, prudente y orientado a comparar escenarios
- Moneda base: MXN
- Mercado base inicial: Mexico, con lenguaje entendible para otros paises
  hispanohablantes cuando no se mencionen instituciones locales

## Arquitectura recomendada

1. Articulos base: cuota mensual, formula, intereses y tabla de amortizacion.
2. Entradas de la calculadora: precio del inmueble, enganche, monto del
   prestamo, tasa anual, plazo y pago extra.
3. Casos long-tail: hipotecas de montos concretos y plazos frecuentes.
4. Costos reales: seguros, impuestos, avaluo, gastos notariales y comisiones
   que no estan incluidos en el MVP.
5. Decision y comparacion: plazo corto vs largo, tasa fija vs variable,
   comparar ofertas, banco vs Infonavit/Fovissste.
6. Optimizacion: pagos extra, abono a capital, amortizacion anticipada y ahorro
   de intereses.
7. Soporte tecnico: sistema frances, conversion de tasas, formulas y tabla en
   Excel o Google Sheets.

## Reglas editoriales globales

- No presentar resultados como aprobacion de credito ni oferta vinculante.
- Usar "estimacion", "simulacion", "escenario" y "orientativo" cuando se hable
  de resultados.
- Aclarar que la calculadora de hipoteca del MVP estima capital e intereses,
  pero no incluye seguros, impuestos, gastos notariales, avaluos, comisiones ni
  otros costos asociados a la compraventa.
- Recomendar comparar costo total, CAT, tasa, seguros, comisiones y condiciones
  de prepago, no solo la mensualidad.
- No publicar tasas "promedio" o "actuales" sin revisar fuentes oficiales o
  condiciones vigentes antes de publicar.
- Enlazar siempre a la calculadora de hipoteca con anchor contextual.
- Incluir advertencia breve cuando el articulo trate endeudamiento, compra de
  vivienda, pagos anticipados, CAT, seguros, impuestos o instituciones publicas.
- Si se habla de tasa variable, explicar que la calculadora actual trabaja con
  tasa fija; no simular tasa variable sin calendario de cambios y supuestos
  explicitos.

## Fuentes base

- CONDUSEF - Simulador de credito hipotecario:
  `https://phpapps.condusef.gob.mx/condusefhipotecario/index.php?amp=1`
- CONDUSEF - Simulador credito hipotecario:
  `https://www.condusef.gob.mx/?p=simulador_hipoteca`
- Banco de Mexico - Indicadores de credito hipotecario, CAT y tasa:
  `https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CF303&locale=es`
- Banco de Mexico - Indicadores basicos de creditos a la vivienda:
  `https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-a-la-vivienda/rib-creditos-vivienda--tasas-.html`
- Profeco - Creditos de servicios inmobiliarios, compra de vivienda:
  `https://www.gob.mx/profeco/documentos/creditos-de-servicios-inmobiliarios-compra-de-vivienda?state=published`
- Infonavit - Pagos:
  `https://portalmx.infonavit.org.mx/wps/portal/infonavitmx/mx2/derechohabientes/tengo-un-credito/pagos/`

## Enlaces internos centrales

- `/inmuebles/calculadora-de-hipoteca`
- `/blog/como-calcular-cuota-mensual-hipoteca`
- `/blog/tabla-amortizacion-hipoteca`
- `/blog/enganche-para-casa-hipoteca`
- `/blog/pagos-extra-hipoteca-abono-capital`
- `/blog/cat-vs-tasa-credito-hipotecario`
- `/blog/comparar-creditos-hipotecarios`

## Inventario de articulos

| Archivo spec | Slug futuro | Prioridad |
|---|---|---|
| `01_como-calcular-cuota-mensual-hipoteca.md` | `/blog/como-calcular-cuota-mensual-hipoteca` | P0 |
| `02_tabla-amortizacion-hipoteca.md` | `/blog/tabla-amortizacion-hipoteca` | P0 |
| `03_enganche-para-casa-hipoteca.md` | `/blog/enganche-para-casa-hipoteca` | P0 |
| `04_precio-enganche-monto-prestamo-hipotecario.md` | `/blog/precio-enganche-monto-prestamo-hipotecario` | P0 |
| `05_pagos-extra-hipoteca-abono-capital.md` | `/blog/pagos-extra-hipoteca-abono-capital` | P0 |
| `06_cat-vs-tasa-credito-hipotecario.md` | `/blog/cat-vs-tasa-credito-hipotecario` | P0 |
| `07_hipoteca-2000000-cuanto-pago.md` | `/blog/hipoteca-2000000-cuanto-pago` | P0 |
| `08_cuanto-puedo-pedir-prestado-para-casa.md` | `/blog/cuanto-puedo-pedir-prestado-para-casa` | P1 |
| `09_hipoteca-15-20-25-30-anos.md` | `/blog/hipoteca-15-20-25-30-anos` | P1 |
| `10_total-intereses-hipoteca.md` | `/blog/total-intereses-hipoteca` | P1 |
| `11_que-incluye-cuota-hipotecaria.md` | `/blog/que-incluye-cuota-hipotecaria` | P1 |
| `12_gastos-notariales-avaluo-impuestos-hipoteca.md` | `/blog/gastos-notariales-avaluo-impuestos-hipoteca` | P1 |
| `13_comparar-creditos-hipotecarios.md` | `/blog/comparar-creditos-hipotecarios` | P1 |
| `14_tasa-fija-vs-variable-hipoteca.md` | `/blog/tasa-fija-vs-variable-hipoteca` | P1 |
| `15_sistema-frances-hipoteca.md` | `/blog/sistema-frances-hipoteca` | P2 |
| `16_tasa-anual-a-mensual-hipoteca.md` | `/blog/tasa-anual-a-mensual-hipoteca` | P2 |
| `17_amortizacion-anticipada-reducir-plazo-o-cuota.md` | `/blog/amortizacion-anticipada-reducir-plazo-o-cuota` | P2 |
| `18_credito-hipotecario-banco-vs-infonavit.md` | `/blog/credito-hipotecario-banco-vs-infonavit` | P2 |
| `19_apoyo-infonavit-hipoteca-bancaria.md` | `/blog/apoyo-infonavit-hipoteca-bancaria` | P2 |
| `20_hipoteca-1000000-cuanto-pago.md` | `/blog/hipoteca-1000000-cuanto-pago` | P2 |
| `21_hipoteca-1500000-cuanto-pago.md` | `/blog/hipoteca-1500000-cuanto-pago` | P2 |
| `22_hipoteca-3000000-cuanto-pago.md` | `/blog/hipoteca-3000000-cuanto-pago` | P2 |
| `23_tabla-amortizacion-hipoteca-excel.md` | `/blog/tabla-amortizacion-hipoteca-excel` | P2 |
| `24_formula-cuota-hipoteca-excel-google-sheets.md` | `/blog/formula-cuota-hipoteca-excel-google-sheets` | P2 |
| `25_errores-comunes-al-calcular-hipoteca.md` | `/blog/errores-comunes-al-calcular-hipoteca` | P2 |

## Brief por bloque de contenido

### P0 - Captura de demanda directa

- Explicar como se calcula la cuota mensual, con formula y ejemplo numerico.
- Cubrir tabla de amortizacion y reparto capital/intereses.
- Resolver dudas sobre enganche, precio del inmueble y monto financiado.
- Atacar pagos extra y abonos a capital porque conectan directamente con la
  funcionalidad del MVP.
- Incluir CAT vs tasa para evitar que el usuario compare solo mensualidad.
- Crear un caso concreto de `$2,000,000` porque coincide con el ejemplo base de
  la calculadora y sirve para enlazado interno.

### P1 - Comparacion y costos reales

- Responder "cuanto puedo pedir prestado" como puente a una fase futura de la
  calculadora.
- Comparar plazos de 15, 20, 25 y 30 anos con ejemplos claros.
- Aclarar que la cuota del MVP no incluye gastos de compraventa ni costos
  accesorios.
- Comparar creditos hipotecarios por tasa, CAT, total pagado, seguros,
  comisiones, condiciones de prepago y penalizaciones.
- Tratar tasa fija vs variable como guia conceptual; no depender de una tasa
  variable simulada por la calculadora actual.

### P2 - Soporte tecnico y long-tail

- Documentar sistema frances y conversion de tasa anual a mensual.
- Cubrir amortizacion anticipada: reducir plazo vs reducir cuota.
- Crear long-tail por montos frecuentes para captar busquedas numericas.
- Publicar formulas y tabla en Excel/Google Sheets para usuarios que quieran
  auditar o replicar el calculo.
- Explicar errores comunes: confundir precio con monto de credito, ignorar
  enganche, comparar solo mensualidad, olvidar costos iniciales y usar tasas
  incompatibles.

## Interlinking recomendado

- Todos los articulos P0 deben enlazar a la calculadora en el primer tercio del
  contenido.
- Los articulos de enganche deben enlazar a:
  - `/blog/precio-enganche-monto-prestamo-hipotecario`
  - `/blog/como-calcular-cuota-mensual-hipoteca`
  - `/inmuebles/calculadora-de-hipoteca`
- Los articulos de amortizacion deben enlazar a:
  - `/blog/tabla-amortizacion-hipoteca`
  - `/blog/pagos-extra-hipoteca-abono-capital`
  - `/blog/sistema-frances-hipoteca`
- Los articulos de decision deben enlazar a:
  - `/blog/cat-vs-tasa-credito-hipotecario`
  - `/blog/comparar-creditos-hipotecarios`
  - `/blog/hipoteca-15-20-25-30-anos`
- Los articulos de costos reales deben enlazar a la calculadora aclarando que
  sirve para capital e intereses, y que los costos externos deben revisarse por
  separado.

## Criterios de aceptacion del cluster

- Cada articulo debe tener un CTA hacia la calculadora de hipoteca.
- Cada articulo debe tener al menos 2 enlaces internos del cluster cuando ya
  existan.
- Cada articulo debe incluir frontmatter compatible con `src/content.config.ts`.
- Los articulos deben citar o verificar fuentes oficiales cuando hablen de CAT,
  tasas vigentes, obligaciones, comisiones, seguros, impuestos, gastos
  notariales, avaluos, Infonavit, Fovissste o productos financieros concretos.
- Los articulos deben incluir aviso de estimacion cuando presenten ejemplos con
  cuota, total pagado, intereses o ahorro por pagos extra.
- Los articulos no deben sugerir que la calculadora sustituye una cotizacion
  bancaria, una oferta vinculante, una evaluacion de capacidad de pago ni
  asesoria financiera, legal o fiscal.
