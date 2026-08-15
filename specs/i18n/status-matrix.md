# Inventario de traducción ES → EN

> Seguimiento editorial del proyecto de traducción completa del sitio. Actualizado: 2026-08-09.

## Cómo usar este archivo

Este documento es un tablero de seguimiento manual; no controla las rutas de producción. Cada fila representa una unidad lógica de contenido y conserva su ruta española actual. Las rutas EN pendientes son una propuesta de trabajo y deben confirmarse antes de publicar.

Estados:

- `✅ Traducida / publicada`: existe contenido EN publicado y la ruta está implementada.
- `⬜ Pendiente`: todavía no existe una versión EN publicable.
- `🟡 Programada en ES`: el contenido fuente existe, pero su fecha española aún es futura; sigue pendiente de traducción.

Criterio: se consideran páginas las superficies de contenido publicables. Las plantillas Astro, la paginación y los componentes compartidos se registran aparte porque heredan el estado de sus contenidos.

## Resumen

| Superficie | Total | Traducidas / publicadas | Pendientes |
| --- | ---: | ---: | ---: |
| Institucionales, legales y error | 10 | 10 | 0 |
| Hubs y categorías del blog | 7 | 7 | 0 |
| Categorías de calculadoras | 16 | 16 | 0 |
| Calculadoras | 91 | 91 | 0 |
| Artículos del blog ES | 118 | 118 equivalentes EN | 0 |
| **Total de unidades** | **242** | **242** | **0** |

Nota: las 118 traducciones EN publicadas están distribuidas entre `src/content/blog/en/math/` (13), `src/content/blog/en/converters/` (6), `src/content/blog/en/finance/` (33), `src/content/blog/en/real-estate/` (21), `src/content/blog/en/legal-tax/` (10) y `src/content/blog/en/health/` (35).

## 1. Páginas institucionales, legales y de error

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| / | /en | ✅ Traducida / publicada | `src/pages/index.astro` |
| /404 | /en/404 | ✅ Traducida / publicada | `src/pages/404.astro → src/pages/en/404.astro` |
| /acerca-de | /en/about | ✅ Traducida / publicada | `src/pages/acerca-de.astro → src/pages/en/about.astro` |
| /contacto | /en/contact | ✅ Traducida / publicada | `src/pages/contacto.astro → src/pages/en/contact.astro` |
| /correcciones | /en/corrections | ✅ Traducida / publicada | `src/pages/correcciones.astro → src/pages/en/corrections.astro` |
| /metodologia | /en/methodology | ✅ Traducida / publicada | `src/pages/metodologia.astro → src/pages/en/methodology.astro` |
| /politica-editorial | /en/editorial-policy | ✅ Traducida / publicada | `src/pages/politica-editorial.astro → src/pages/en/editorial-policy.astro` |
| /privacidad | /en/privacy | ✅ Traducida / publicada | `src/pages/privacidad.astro → src/pages/en/privacy.astro` |
| /avisos/financiero-fiscal | /en/notices/financial-tax | ✅ Traducida / publicada | `src/pages/avisos/financiero-fiscal.astro → src/pages/en/notices/financial-tax.astro` |
| /avisos/salud | /en/notices/health | ✅ Traducida / publicada | `src/pages/avisos/salud.astro → src/pages/en/notices/health.astro` |

## 2. Hubs y categorías del blog

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog | /en/blog | ✅ Traducida / publicada | `src/pages/blog.astro + src/pages/en/blog.astro` |
| /blog/conversores | /en/blog/converters | ✅ Traducida / publicada | `src/pages/blog/[category].astro → src/pages/en/blog/converters.astro` |
| /blog/finanzas | /en/blog/finance | ✅ Traducida / publicada | `src/pages/blog/[category].astro → src/pages/en/blog/finance.astro` |
| /blog/inmuebles | /en/blog/real-estate | ✅ Traducida / publicada | `src/pages/blog/[category].astro → src/pages/en/blog/real-estate.astro` |
| /blog/legal-impuestos | /en/blog/legal-tax | ✅ Traducida / publicada | `src/pages/blog/[category].astro → src/pages/en/blog/legal-tax.astro` |
| /blog/matematicas | /en/blog/math | ✅ Traducida / publicada | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/salud | /en/blog/health | ✅ Traducida / publicada | `src/pages/blog/[category].astro → src/pages/en/blog/health.astro` |

## 3. Categorías del directorio de calculadoras

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /finanzas | /en/finance | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/finance.astro` |
| /inmuebles | /en/real-estate | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/real-estate.astro` |
| /legal-impuestos | /en/legal-tax | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/legal-tax.astro` |
| /matematicas | /en/math | ✅ Traducida / publicada | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /probabilidad-estadistica | /en/probability-statistics | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/probability-statistics.astro` |
| /programacion | /en/programming | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/programming.astro` |
| /geometria | /en/geometry | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/geometry.astro` |
| /salud | /en/health | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/health.astro` |
| /fecha-tiempo | /en/date-time | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/date-time.astro` |
| /conversores | /en/converters | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/converters.astro` |
| /mascotas | /en/pets | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/pets.astro` |
| /cocina | /en/cooking | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/cooking.astro` |
| /eventos | /en/events | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/events.astro` |
| /restaurantes | /en/restaurants | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/restaurants.astro` |
| /vehiculos | /en/vehicles | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/vehicles.astro` |
| /construccion | /en/construction | ✅ Traducida / publicada | `src/pages/[category].astro → src/pages/en/construction.astro` |

## 4. Calculadoras

### Cocina

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /cocina/calculadora-tiempo-coccion-por-peso | /en/cooking/cooking-time-by-weight-calculator | ✅ Traducida / publicada | `src/pages/cocina/calculadora-tiempo-coccion-por-peso.astro → src/pages/en/cooking/cooking-time-by-weight-calculator.astro` |
| /cocina/conversor-de-medidas-culinarias | /en/cooking/cooking-measurement-converter | ✅ Traducida / publicada | `src/pages/cocina/conversor-de-medidas-culinarias.astro → src/pages/en/cooking/cooking-measurement-converter.astro` |
| /cocina/conversor-de-temperatura-de-horno | /en/cooking/oven-temperature-converter | ✅ Traducida / publicada | `src/pages/cocina/conversor-de-temperatura-de-horno.astro → src/pages/en/cooking/oven-temperature-converter.astro` |
| /cocina/escalar-receta-por-porciones | /en/cooking/recipe-scaler | ✅ Traducida / publicada | `src/pages/cocina/escalar-receta-por-porciones.astro → src/pages/en/cooking/recipe-scaler.astro` |

### Construcción

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /construccion/calculadora-cantidad-ladrillos | /en/construction/brick-calculator | ✅ Traducida / publicada | `src/pages/construccion/calculadora-cantidad-ladrillos.astro → src/pages/en/construction/brick-calculator.astro` |
| /construccion/calculadora-piso-azulejo-superficie | /en/construction/tile-calculator | ✅ Traducida / publicada | `src/pages/construccion/calculadora-piso-azulejo-superficie.astro → src/pages/en/construction/tile-calculator.astro` |
| /construccion/calculadora-presupuesto-remodelacion | /en/construction/renovation-budget-calculator | ✅ Traducida / publicada | `src/pages/construccion/calculadora-presupuesto-remodelacion.astro → src/pages/en/construction/renovation-budget-calculator.astro` |
| /construccion/calculadora-volumen-concreto-cemento | /en/construction/concrete-volume-calculator | ✅ Traducida / publicada | `src/pages/construccion/calculadora-volumen-concreto-cemento.astro → src/pages/en/construction/concrete-volume-calculator.astro` |
| /construccion/metros-cuadrados-de-pintura | /en/construction/paint-calculator | ✅ Traducida / publicada | `src/pages/construccion/metros-cuadrados-de-pintura.astro → src/pages/en/construction/paint-calculator.astro` |

### Conversores

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /conversores/conversor-de-area-m2-ft2-hectareas-acres | /en/converters/area-converter | ✅ Traducida / publicada | `src/pages/conversores/conversor-de-area-m2-ft2-hectareas-acres.astro → src/pages/en/converters/area-converter.astro` |
| /conversores/conversor-de-peso | /en/converters/weight-converter | ✅ Traducida / publicada | `src/pages/conversores/conversor-de-peso.astro → src/pages/en/converters/weight-converter.astro` |
| /conversores/conversor-de-temperatura | /en/converters/temperature-converter | ✅ Traducida / publicada | `src/pages/conversores/conversor-de-temperatura.astro → src/pages/en/converters/temperature-converter.astro` |
| /conversores/conversor-de-volumen | /en/converters/volume-converter | ✅ Traducida / publicada | `src/pages/conversores/conversor-de-volumen.astro → src/pages/en/converters/volume-converter.astro` |
| /conversores/conversor-tallas-de-ropa | /en/converters/clothing-size-converter | ✅ Traducida / publicada | `src/pages/conversores/conversor-tallas-de-ropa.astro → src/pages/en/converters/clothing-size-converter.astro` |
| /conversores/kilometros-a-millas | /en/converters/kilometers-to-miles | ✅ Traducida / publicada | `src/pages/conversores/kilometros-a-millas.astro → src/pages/en/converters/kilometers-to-miles.astro` |
| /conversores/litros-a-galones | /en/converters/liters-to-gallons | ✅ Traducida / publicada | `src/pages/conversores/litros-a-galones.astro → src/pages/en/converters/liters-to-gallons.astro` |

### Eventos

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /eventos/calculadora-costo-por-persona-evento | /en/events/event-cost-per-person-calculator | ✅ Traducida / publicada | `src/pages/eventos/calculadora-costo-por-persona-evento.astro → src/pages/en/events/event-cost-per-person-calculator.astro` |
| /eventos/calculadora-presupuesto-boda | /en/events/wedding-budget-calculator | ✅ Traducida / publicada | `src/pages/eventos/calculadora-presupuesto-boda.astro → src/pages/en/events/wedding-budget-calculator.astro` |

### Fecha y tiempo

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /fecha-tiempo/calculadora-costo-reunion | /en/date-time/meeting-cost-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-costo-reunion.astro → src/pages/en/date-time/meeting-cost-calculator.astro` |
| /fecha-tiempo/calculadora-de-edad | /en/date-time/age-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-de-edad.astro → src/pages/en/date-time/age-calculator.astro` |
| /fecha-tiempo/calculadora-de-horas-trabajadas | /en/date-time/work-hours-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-de-horas-trabajadas.astro → src/pages/en/date-time/work-hours-calculator.astro` |
| /fecha-tiempo/calculadora-fecha-limite-countdown | /en/date-time/deadline-countdown-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-fecha-limite-countdown.astro → src/pages/en/date-time/deadline-countdown-calculator.astro` |
| /fecha-tiempo/calculadora-pomodoro | /en/date-time/pomodoro-timer | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-pomodoro.astro → src/pages/en/date-time/pomodoro-timer.astro` |
| /fecha-tiempo/calculadora-tiempo-de-lectura | /en/date-time/reading-time-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/calculadora-tiempo-de-lectura.astro → src/pages/en/date-time/reading-time-calculator.astro` |
| /fecha-tiempo/diferencia-entre-fechas | /en/date-time/date-difference-calculator | ✅ Traducida / publicada | `src/pages/fecha-tiempo/diferencia-entre-fechas.astro → src/pages/en/date-time/date-difference-calculator.astro` |

### Finanzas

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /finanzas/calculadora-dca-costo-promedio | /en/finance/dca-average-cost-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-dca-costo-promedio.astro → src/pages/en/finance/dca-average-cost-calculator.astro` |
| /finanzas/calculadora-de-ahorro-para-un-objetivo | /en/finance/savings-goal-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-ahorro-para-un-objetivo.astro → src/pages/en/finance/savings-goal-calculator.astro` |
| /finanzas/calculadora-de-inflacion-poder-adquisitivo | /en/finance/inflation-purchasing-power-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-inflacion-poder-adquisitivo.astro → src/pages/en/finance/inflation-purchasing-power-calculator.astro` |
| /finanzas/calculadora-de-interes-compuesto | /en/finance/compound-interest-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-interes-compuesto.astro → src/pages/en/finance/compound-interest-calculator.astro` |
| /finanzas/calculadora-de-interes-simple | /en/finance/simple-interest-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-interes-simple.astro → src/pages/en/finance/simple-interest-calculator.astro` |
| /finanzas/calculadora-de-margen-y-markup | /en/finance/margin-markup-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-margen-y-markup.astro → src/pages/en/finance/margin-markup-calculator.astro` |
| /finanzas/calculadora-de-precio-de-proyecto-freelance | /en/finance/freelance-project-pricing-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-precio-de-proyecto-freelance.astro → src/pages/en/finance/freelance-project-pricing-calculator.astro` |
| /finanzas/calculadora-de-prestamo | /en/finance/loan-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-prestamo.astro → src/pages/en/finance/loan-calculator.astro` |
| /finanzas/calculadora-de-punto-de-equilibrio | /en/finance/break-even-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-punto-de-equilibrio.astro → src/pages/en/finance/break-even-calculator.astro` |
| /finanzas/calculadora-de-roi | /en/finance/roi-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-roi.astro → src/pages/en/finance/roi-calculator.astro` |
| /finanzas/calculadora-de-tarifa-por-hora-freelance | /en/finance/freelance-hourly-rate-calculator | ✅ Traducida / publicada | `src/pages/finanzas/calculadora-de-tarifa-por-hora-freelance.astro → src/pages/en/finance/freelance-hourly-rate-calculator.astro` |
| /finanzas/plan-de-pago-de-deudas | /en/finance/debt-payoff-calculator | ✅ Traducida / publicada | `src/pages/finanzas/plan-de-pago-de-deudas.astro → src/pages/en/finance/debt-payoff-calculator.astro` |

### Geometría

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /geometria/calculadora-de-area-y-perimetro | /en/geometry/area-perimeter-calculator | ✅ Traducida / publicada | `src/pages/geometria/calculadora-de-area-y-perimetro.astro → src/pages/en/geometry/area-perimeter-calculator.astro` |
| /geometria/calculadora-del-teorema-de-pitagoras | /en/geometry/pythagorean-theorem-calculator | ✅ Traducida / publicada | `src/pages/geometria/calculadora-del-teorema-de-pitagoras.astro → src/pages/en/geometry/pythagorean-theorem-calculator.astro` |

### Inmuebles

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /inmuebles/calculadora-cap-rate-rentabilidad | /en/real-estate/cap-rate-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-cap-rate-rentabilidad.astro → src/pages/en/real-estate/cap-rate-calculator.astro` |
| /inmuebles/calculadora-capacidad-compra-vivienda | /en/real-estate/home-affordability-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-capacidad-compra-vivienda.astro → src/pages/en/real-estate/home-affordability-calculator.astro` |
| /inmuebles/calculadora-de-hipoteca | /en/real-estate/mortgage-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-de-hipoteca.astro → src/pages/en/real-estate/mortgage-calculator.astro` |
| /inmuebles/calculadora-gastos-escrituracion | /en/real-estate/closing-costs-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-gastos-escrituracion.astro → src/pages/en/real-estate/closing-costs-calculator.astro` |
| /inmuebles/calculadora-plusvalia-estimada | /en/real-estate/property-appreciation-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-plusvalia-estimada.astro → src/pages/en/real-estate/property-appreciation-calculator.astro` |
| /inmuebles/calculadora-precio-por-metro-cuadrado | /en/real-estate/price-per-area-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-precio-por-metro-cuadrado.astro → src/pages/en/real-estate/price-per-area-calculator.astro` |
| /inmuebles/calculadora-renta-vs-compra | /en/real-estate/rent-vs-buy-calculator | ✅ Traducida / publicada | `src/pages/inmuebles/calculadora-renta-vs-compra.astro → src/pages/en/real-estate/rent-vs-buy-calculator.astro` |

### Legal e impuestos

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /legal-impuestos/calculadora-de-iva | /en/legal-tax/indirect-tax-calculator | ✅ Adaptada / publicada | Hub EN con selección obligatoria de mercado; sin país implícito. |
| /legal-impuestos/calculadora-isr-irpf | /en/legal-tax/mexico-income-tax-calculator | ✅ Traducida / publicada | Variante `en-MX`; las variantes anglófonas usan rule sets propios. |
| /legal-impuestos/calculadora-salario-neto | /en/legal-tax/mexico-net-salary-calculator | ✅ Traducida / publicada | Variante `en-MX`; cobertura mexicana visible. |
| /legal-impuestos/calculadora-vacaciones-proporcionales | /en/legal-tax/mexico-proportional-vacation-calculator | ✅ Traducida / publicada | Variante `en-MX`; mínimo de la LFT visible. |
| /legal-impuestos/calculadora-finiquito-liquidacion | /en/legal-tax/mexico-termination-pay-calculator | ✅ Traducida / publicada | Variante `en-MX`; conceptos mexicanos no se reutilizan en otros mercados. |

### Mascotas

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /mascotas/calorias-diarias-para-perro-o-gato | /en/pets/pet-calorie-calculator | ✅ Traducida / publicada | `src/pages/mascotas/calorias-diarias-para-perro-o-gato.astro → src/pages/en/pets/pet-calorie-calculator.astro` |
| /mascotas/edad-de-mascota-en-anos-humanos | /en/pets/pet-age-calculator | ✅ Traducida / publicada | `src/pages/mascotas/edad-de-mascota-en-anos-humanos.astro → src/pages/en/pets/pet-age-calculator.astro` |

### Matemáticas

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /matematicas/calculadora-calificacion-ponderada | /en/math/weighted-grade-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-calificacion-ponderada.astro → src/pages/en/math/weighted-grade-calculator.astro` |
| /matematicas/calculadora-de-estadistica-basica | /en/math/basic-statistics-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-de-estadistica-basica.astro → src/pages/en/math/basic-statistics-calculator.astro` |
| /matematicas/calculadora-de-porcentajes | /en/math/percentage-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-de-porcentajes.astro` |
| /matematicas/calculadora-de-regla-de-tres | /en/math/rule-of-three-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-de-regla-de-tres.astro → src/pages/en/math/rule-of-three-calculator.astro` |
| /matematicas/calculadora-ecuaciones-cuadraticas | /en/math/quadratic-equation-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-ecuaciones-cuadraticas.astro → src/pages/en/math/quadratic-equation-calculator.astro` |
| /matematicas/calculadora-horas-de-estudio | /en/math/study-hours-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-horas-de-estudio.astro → src/pages/en/math/study-hours-calculator.astro` |
| /matematicas/calculadora-mcd-mcm | /en/math/gcd-lcm-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-mcd-mcm.astro → src/pages/en/math/gcd-lcm-calculator.astro` |
| /matematicas/calculadora-nota-minima-para-aprobar | /en/math/minimum-grade-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-nota-minima-para-aprobar.astro → src/pages/en/math/minimum-grade-calculator.astro` |
| /matematicas/calculadora-porcentaje-asistencia-escolar | /en/math/attendance-percentage-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro → src/pages/en/math/attendance-percentage-calculator.astro` |
| /matematicas/calculadora-promedio-escolar-gpa | /en/math/gpa-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-promedio-escolar-gpa.astro → src/pages/en/math/gpa-calculator.astro` |
| /matematicas/calculadora-sistema-ecuaciones-2x2 | /en/math/linear-system-2x2-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-sistema-ecuaciones-2x2.astro → src/pages/en/math/linear-system-2x2-calculator.astro` |

### Probabilidad y estadística

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /probabilidad-estadistica/calculadora-combinaciones-permutaciones | /en/probability-statistics/combinations-permutations-calculator | ✅ Traducida / publicada | `src/pages/probabilidad-estadistica/calculadora-combinaciones-permutaciones.astro → src/pages/en/probability-statistics/combinations-permutations-calculator.astro` |
| /probabilidad-estadistica/calculadora-distribucion-normal-z-score | /en/probability-statistics/normal-distribution-z-score-calculator | ✅ Traducida / publicada | `src/pages/probabilidad-estadistica/calculadora-distribucion-normal-z-score.astro → src/pages/en/probability-statistics/normal-distribution-z-score-calculator.astro` |
| /probabilidad-estadistica/calculadora-probabilidad-basica | /en/probability-statistics/basic-probability-calculator | ✅ Traducida / publicada | `src/pages/probabilidad-estadistica/calculadora-probabilidad-basica.astro → src/pages/en/probability-statistics/basic-probability-calculator.astro` |

### Programación

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /programacion/calculadora-entropia-contrasena | /en/programming/password-entropy-calculator | ✅ Traducida / publicada | `src/pages/programacion/calculadora-entropia-contrasena.astro → src/pages/en/programming/password-entropy-calculator.astro` |
| /programacion/calculadora-velocidad-descarga | /en/programming/download-time-calculator | ✅ Traducida / publicada | `src/pages/programacion/calculadora-velocidad-descarga.astro → src/pages/en/programming/download-time-calculator.astro` |
| /programacion/conversor-de-bases-numericas | /en/programming/number-base-converter | ✅ Traducida / publicada | `src/pages/programacion/conversor-de-bases-numericas.astro → src/pages/en/programming/number-base-converter.astro` |
| /programacion/paleta-hex-rgb-hsl | /en/programming/hex-rgb-hsl-color-converter | ✅ Traducida / publicada | `src/pages/programacion/paleta-hex-rgb-hsl.astro → src/pages/en/programming/hex-rgb-hsl-color-converter.astro` |

### Restaurantes

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /restaurantes/calculadora-de-propina | /en/restaurants/tip-calculator | ✅ Traducida / publicada | `src/pages/restaurantes/calculadora-de-propina.astro → src/pages/en/restaurants/tip-calculator.astro` |
| /restaurantes/dividir-cuenta-en-restaurante | /en/restaurants/restaurant-bill-split-calculator | ✅ Traducida / publicada | `src/pages/restaurantes/dividir-cuenta-en-restaurante.astro → src/pages/en/restaurants/restaurant-bill-split-calculator.astro` |

### Salud

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /salud/calculadora-1rm-repeticion-maxima | /en/health/one-rep-max-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-1rm-repeticion-maxima.astro → src/pages/en/health/one-rep-max-calculator.astro` |
| /salud/calculadora-de-agua-diaria | /en/health/daily-water-intake-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-agua-diaria.astro → src/pages/en/health/daily-water-intake-calculator.astro` |
| /salud/calculadora-de-calorias-diarias-tdee | /en/health/tdee-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-calorias-diarias-tdee.astro → src/pages/en/health/tdee-calculator.astro` |
| /salud/calculadora-de-calorias-quemadas-por-ejercicio | /en/health/exercise-calories-burned-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-calorias-quemadas-por-ejercicio.astro → src/pages/en/health/exercise-calories-burned-calculator.astro` |
| /salud/calculadora-de-frecuencia-cardiaca-maxima | /en/health/maximum-heart-rate-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-frecuencia-cardiaca-maxima.astro → src/pages/en/health/maximum-heart-rate-calculator.astro` |
| /salud/calculadora-de-imc | /en/health/bmi-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-imc.astro → src/pages/en/health/bmi-calculator.astro` |
| /salud/calculadora-de-macros | /en/health/macro-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-macros.astro → src/pages/en/health/macro-calculator.astro` |
| /salud/calculadora-de-ovulacion | /en/health/ovulation-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-ovulacion.astro → src/pages/en/health/ovulation-calculator.astro` |
| /salud/calculadora-de-pace-ritmo-de-carrera | /en/health/running-pace-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-pace-ritmo-de-carrera.astro → src/pages/en/health/running-pace-calculator.astro` |
| /salud/calculadora-de-porcentaje-de-grasa-corporal | /en/health/body-fat-percentage-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-porcentaje-de-grasa-corporal.astro → src/pages/en/health/body-fat-percentage-calculator.astro` |
| /salud/calculadora-de-proteina-diaria | /en/health/daily-protein-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-proteina-diaria.astro → src/pages/en/health/daily-protein-calculator.astro` |
| /salud/calculadora-de-zonas-de-frecuencia-cardiaca | /en/health/heart-rate-zones-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-de-zonas-de-frecuencia-cardiaca.astro → src/pages/en/health/heart-rate-zones-calculator.astro` |
| /salud/calculadora-deficit-calorico | /en/health/calorie-deficit-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-deficit-calorico.astro → src/pages/en/health/calorie-deficit-calculator.astro` |
| /salud/calculadora-prediccion-tiempo-carrera | /en/health/race-time-predictor | ✅ Traducida / publicada | `src/pages/salud/calculadora-prediccion-tiempo-carrera.astro → src/pages/en/health/race-time-predictor.astro` |
| /salud/calculadora-vo2-max | /en/health/vo2-max-calculator | ✅ Traducida / publicada | `src/pages/salud/calculadora-vo2-max.astro → src/pages/en/health/vo2-max-calculator.astro` |
| /salud/fecha-probable-de-parto | /en/health/pregnancy-due-date-calculator | ✅ Traducida / publicada | `src/pages/salud/fecha-probable-de-parto.astro → src/pages/en/health/pregnancy-due-date-calculator.astro` |

### Vehículos

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /vehiculos/calculadora-de-consumo-de-gasolina | /en/vehicles/fuel-consumption-calculator | ✅ Traducida / publicada | `src/pages/vehiculos/calculadora-de-consumo-de-gasolina.astro → src/pages/en/vehicles/fuel-consumption-calculator.astro` |
| /vehiculos/calculadora-de-costo-por-kilometro | /en/vehicles/cost-per-kilometer-calculator | ✅ Traducida / publicada | `src/pages/vehiculos/calculadora-de-costo-por-kilometro.astro → src/pages/en/vehicles/cost-per-kilometer-calculator.astro` |
| /vehiculos/calculadora-de-depreciacion-del-vehiculo | /en/vehicles/vehicle-depreciation-calculator | ✅ Traducida / publicada | `src/pages/vehiculos/calculadora-de-depreciacion-del-vehiculo.astro → src/pages/en/vehicles/vehicle-depreciation-calculator.astro` |
| /vehiculos/calculadora-de-gastos-anuales-del-vehiculo | /en/vehicles/annual-vehicle-cost-calculator | ✅ Traducida / publicada | `src/pages/vehiculos/calculadora-de-gastos-anuales-del-vehiculo.astro → src/pages/en/vehicles/annual-vehicle-cost-calculator.astro` |

Todas las calculadoras ES listadas tienen implementación publicada en inglés bajo `src/pages/en/`, metadata localizada y enlaces alternativos entre idiomas.

## 5. Artículos del blog

### Conversores

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/conversores/como-convertir-kilometros-a-millas | /en/blog/converters/how-to-convert-kilometers-to-miles | ✅ Traducida / publicada | `src/content/blog/conversores/como-convertir-kilometros-a-millas.md → src/content/blog/en/converters/how-to-convert-kilometers-to-miles.md` |
| /blog/conversores/como-convertir-kilometros-a-millas-en-excel | /en/blog/converters/how-to-convert-kilometers-to-miles-in-excel | ✅ Traducida / publicada | `src/content/blog/conversores/como-convertir-kilometros-a-millas-en-excel.md → src/content/blog/en/converters/how-to-convert-kilometers-to-miles-in-excel.md` |
| /blog/conversores/kilometros-vs-millas-diferencias | /en/blog/converters/kilometers-vs-miles | ✅ Traducida / publicada | `src/content/blog/conversores/kilometros-vs-millas-diferencias.md → src/content/blog/en/converters/kilometers-vs-miles.md` |
| /blog/conversores/milla-terrestre-vs-milla-nautica | /en/blog/converters/statute-mile-vs-nautical-mile | ✅ Traducida / publicada | `src/content/blog/conversores/milla-terrestre-vs-milla-nautica.md → src/content/blog/en/converters/statute-mile-vs-nautical-mile.md` |
| /blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla | /en/blog/converters/pace-per-kilometer-vs-mile | ✅ Traducida / publicada | `src/content/blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla.md → src/content/blog/en/converters/pace-per-kilometer-vs-mile.md` |
| /blog/conversores/tabla-kilometros-a-millas-distancias-comunes | /en/blog/converters/kilometers-to-miles-table | ✅ Traducida / publicada | `src/content/blog/conversores/tabla-kilometros-a-millas-distancias-comunes.md → src/content/blog/en/converters/kilometers-to-miles-table.md` |

### Finanzas

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/finanzas/cagr-tasa-crecimiento-anual-compuesto | /en/blog/finance/cagr-compound-annual-growth-rate | ✅ Traducida / publicada | `src/content/blog/finanzas/cagr-tasa-crecimiento-anual-compuesto.md → src/content/blog/en/finance/cagr-compound-annual-growth-rate.md` |
| /blog/finanzas/cat-vs-tasa-interes | /en/blog/finance/cat-vs-interest-rate | ✅ Traducida / publicada | `src/content/blog/finanzas/cat-vs-tasa-interes.md → src/content/blog/en/finance/cat-vs-interest-rate.md` |
| /blog/finanzas/cetes-interes-compuesto-reinversion | /en/blog/finance/cetes-reinvestment-and-compound-interest | ✅ Traducida / publicada | `src/content/blog/finanzas/cetes-interes-compuesto-reinversion.md → src/content/blog/en/finance/cetes-reinvestment-and-compound-interest.md` |
| /blog/finanzas/comision-apertura-prestamo | /en/blog/finance/loan-origination-fee | ✅ Traducida / publicada | `src/content/blog/finanzas/comision-apertura-prestamo.md → src/content/blog/en/finance/loan-origination-fee.md` |
| /blog/finanzas/como-calcular-cuota-mensual-prestamo | /en/blog/finance/calculate-monthly-loan-payment | ✅ Traducida / publicada | `src/content/blog/finanzas/como-calcular-cuota-mensual-prestamo.md → src/content/blog/en/finance/calculate-monthly-loan-payment.md` |
| /blog/finanzas/como-calcular-intereses-prestamo | /en/blog/finance/calculate-loan-interest | ✅ Traducida / publicada | `src/content/blog/finanzas/como-calcular-intereses-prestamo.md → src/content/blog/en/finance/calculate-loan-interest.md` |
| /blog/finanzas/comparar-dos-prestamos | /en/blog/finance/how-to-compare-two-loans | ✅ Traducida / publicada | `src/content/blog/finanzas/comparar-dos-prestamos.md → src/content/blog/en/finance/how-to-compare-two-loans.md` |
| /blog/finanzas/credito-automotriz-calcular-mensualidad | /en/blog/finance/car-loan-payment | ✅ Traducida / publicada | `src/content/blog/finanzas/credito-automotriz-calcular-mensualidad.md → src/content/blog/en/finance/car-loan-payment.md` |
| /blog/finanzas/cuanto-ahorrar-al-mes-para-una-meta | /en/blog/finance/how-much-to-save-each-month | ✅ Traducida / publicada | `src/content/blog/finanzas/cuanto-ahorrar-al-mes-para-una-meta.md → src/content/blog/en/finance/how-much-to-save-each-month.md` |
| /blog/finanzas/cuanto-puedo-pedir-prestado-segun-ingreso | /en/blog/finance/how-much-can-i-borrow | ✅ Traducida / publicada | `src/content/blog/finanzas/cuanto-puedo-pedir-prestado-segun-ingreso.md → src/content/blog/en/finance/how-much-can-i-borrow.md` |
| /blog/finanzas/descuentos-sucesivos | /en/blog/finance/successive-discounts | ✅ Traducida / publicada | `src/content/blog/finanzas/descuentos-sucesivos.md → src/content/blog/en/finance/successive-discounts.md` |
| /blog/finanzas/errores-calculadora-interes-compuesto | /en/blog/finance/compound-interest-calculator-mistakes | ✅ Traducida / publicada | `src/content/blog/finanzas/errores-calculadora-interes-compuesto.md → src/content/blog/en/finance/compound-interest-calculator-mistakes.md` |
| /blog/finanzas/formula-interes-compuesto | /en/blog/finance/compound-interest-formula | ✅ Traducida / publicada | `src/content/blog/finanzas/formula-interes-compuesto.md → src/content/blog/en/finance/compound-interest-formula.md` |
| /blog/finanzas/inflacion-interes-compuesto-valor-real | /en/blog/finance/inflation-and-compound-interest | ✅ Traducida / publicada | `src/content/blog/finanzas/inflacion-interes-compuesto-valor-real.md → src/content/blog/en/finance/inflation-and-compound-interest.md` |
| /blog/finanzas/interes-compuesto-aportaciones-mensuales | /en/blog/finance/compound-interest-with-monthly-contributions | ✅ Traducida / publicada | `src/content/blog/finanzas/interes-compuesto-aportaciones-mensuales.md → src/content/blog/en/finance/compound-interest-with-monthly-contributions.md` |
| /blog/finanzas/interes-compuesto-retiro | /en/blog/finance/compound-interest-for-retirement | ✅ Traducida / publicada | `src/content/blog/finanzas/interes-compuesto-retiro.md → src/content/blog/en/finance/compound-interest-for-retirement.md` |
| /blog/finanzas/interes-simple-vs-compuesto | /en/blog/finance/simple-vs-compound-interest | ✅ Traducida / publicada | `src/content/blog/finanzas/interes-simple-vs-compuesto.md → src/content/blog/en/finance/simple-vs-compound-interest.md` |
| /blog/finanzas/microcreditos-apps-prestamos-caros | /en/blog/finance/microloans-and-loan-apps | ✅ Traducida / publicada | `src/content/blog/finanzas/microcreditos-apps-prestamos-caros.md → src/content/blog/en/finance/microloans-and-loan-apps.md` |
| /blog/finanzas/pagos-extra-prestamo-abono-capital | /en/blog/finance/extra-loan-payments | ✅ Traducida / publicada | `src/content/blog/finanzas/pagos-extra-prestamo-abono-capital.md → src/content/blog/en/finance/extra-loan-payments.md` |
| /blog/finanzas/porcentaje-de-descuento | /en/blog/finance/how-to-calculate-a-discount | ✅ Traducida / publicada | `src/content/blog/finanzas/porcentaje-de-descuento.md → src/content/blog/en/finance/how-to-calculate-a-discount.md` |
| /blog/finanzas/porcentaje-de-ganancia-y-margen | /en/blog/finance/profit-margin-vs-markup | ✅ Traducida / publicada | `src/content/blog/finanzas/porcentaje-de-ganancia-y-margen.md → src/content/blog/en/finance/profit-margin-vs-markup.md` |
| /blog/finanzas/prestamo-12-24-36-48-meses | /en/blog/finance/loan-terms-12-24-36-48-months | ✅ Traducida / publicada | `src/content/blog/finanzas/prestamo-12-24-36-48-meses.md → src/content/blog/en/finance/loan-terms-12-24-36-48-months.md` |
| /blog/finanzas/prestamo-nomina-vs-prestamo-personal | /en/blog/finance/payroll-loan-vs-personal-loan | ✅ Traducida / publicada | `src/content/blog/finanzas/prestamo-nomina-vs-prestamo-personal.md → src/content/blog/en/finance/payroll-loan-vs-personal-loan.md` |
| /blog/finanzas/prestamo-personal-vs-tarjeta-credito | /en/blog/finance/personal-loan-vs-credit-card | ✅ Traducida / publicada | `src/content/blog/finanzas/prestamo-personal-vs-tarjeta-credito.md → src/content/blog/en/finance/personal-loan-vs-credit-card.md` |
| /blog/finanzas/prestamos-entre-particulares | /en/blog/finance/loans-between-individuals | ✅ Traducida / publicada | `src/content/blog/finanzas/prestamos-entre-particulares.md → src/content/blog/en/finance/loans-between-individuals.md` |
| /blog/finanzas/que-es-interes-compuesto | /en/blog/finance/compound-interest-explained | ✅ Traducida / publicada | `src/content/blog/finanzas/que-es-interes-compuesto.md → src/content/blog/en/finance/compound-interest-explained.md` |
| /blog/finanzas/regla-del-72 | /en/blog/finance/rule-of-72 | ✅ Traducida / publicada | `src/content/blog/finanzas/regla-del-72.md → src/content/blog/en/finance/rule-of-72.md` |
| /blog/finanzas/seguro-mensual-credito | /en/blog/finance/monthly-loan-insurance | ✅ Traducida / publicada | `src/content/blog/finanzas/seguro-mensual-credito.md → src/content/blog/en/finance/monthly-loan-insurance.md` |
| /blog/finanzas/sistema-frances-amortizacion | /en/blog/finance/french-amortization-system | ✅ Traducida / publicada | `src/content/blog/finanzas/sistema-frances-amortizacion.md → src/content/blog/en/finance/french-amortization-system.md` |
| /blog/finanzas/tabla-amortizacion-excel | /en/blog/finance/loan-amortization-schedule-excel | ✅ Traducida / publicada | `src/content/blog/finanzas/tabla-amortizacion-excel.md → src/content/blog/en/finance/loan-amortization-schedule-excel.md` |
| /blog/finanzas/tabla-amortizacion-prestamo | /en/blog/finance/loan-amortization-schedule | ✅ Traducida / publicada | `src/content/blog/finanzas/tabla-amortizacion-prestamo.md → src/content/blog/en/finance/loan-amortization-schedule.md` |
| /blog/finanzas/tasa-anual-mensual-diaria-prestamo | /en/blog/finance/annual-monthly-daily-loan-rates | ✅ Traducida / publicada | `src/content/blog/finanzas/tasa-anual-mensual-diaria-prestamo.md → src/content/blog/en/finance/annual-monthly-daily-loan-rates.md` |
| /blog/finanzas/tasa-nominal-vs-tasa-efectiva | /en/blog/finance/nominal-vs-effective-interest-rate | ✅ Traducida / publicada | `src/content/blog/finanzas/tasa-nominal-vs-tasa-efectiva.md → src/content/blog/en/finance/nominal-vs-effective-interest-rate.md` |

### Inmuebles

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/inmuebles/amortizacion-anticipada-reducir-plazo-o-cuota | /en/blog/real-estate/mortgage-prepayment-reduce-term-or-payment | ✅ Traducida / publicada | `src/content/blog/inmuebles/amortizacion-anticipada-reducir-plazo-o-cuota.md → src/content/blog/en/real-estate/mortgage-prepayment-reduce-term-or-payment.md` |
| /blog/inmuebles/apoyo-infonavit-hipoteca-bancaria | /en/blog/real-estate/apoyo-infonavit-bank-mortgage | ✅ Traducida / publicada | `src/content/blog/inmuebles/apoyo-infonavit-hipoteca-bancaria.md → src/content/blog/en/real-estate/apoyo-infonavit-bank-mortgage.md` |
| /blog/inmuebles/cat-vs-tasa-credito-hipotecario | /en/blog/real-estate/mortgage-cat-vs-interest-rate | ✅ Traducida / publicada | `src/content/blog/inmuebles/cat-vs-tasa-credito-hipotecario.md → src/content/blog/en/real-estate/mortgage-cat-vs-interest-rate.md` |
| /blog/inmuebles/como-calcular-cuota-mensual-hipoteca | /en/blog/real-estate/calculate-monthly-mortgage-payment | ✅ Traducida / publicada | `src/content/blog/inmuebles/como-calcular-cuota-mensual-hipoteca.md → src/content/blog/en/real-estate/calculate-monthly-mortgage-payment.md` |
| /blog/inmuebles/comparar-creditos-hipotecarios | /en/blog/real-estate/how-to-compare-mortgages | ✅ Traducida / publicada | `src/content/blog/inmuebles/comparar-creditos-hipotecarios.md → src/content/blog/en/real-estate/how-to-compare-mortgages.md` |
| /blog/inmuebles/credito-hipotecario-banco-vs-infonavit | /en/blog/real-estate/bank-mortgage-vs-infonavit | ✅ Traducida / publicada | `src/content/blog/inmuebles/credito-hipotecario-banco-vs-infonavit.md → src/content/blog/en/real-estate/bank-mortgage-vs-infonavit.md` |
| /blog/inmuebles/cuanto-puedo-pedir-prestado-para-casa | /en/blog/real-estate/how-much-mortgage-can-i-borrow | ✅ Traducida / publicada | `src/content/blog/inmuebles/cuanto-puedo-pedir-prestado-para-casa.md → src/content/blog/en/real-estate/how-much-mortgage-can-i-borrow.md` |
| /blog/inmuebles/enganche-para-casa-hipoteca | /en/blog/real-estate/home-down-payment | ✅ Traducida / publicada | `src/content/blog/inmuebles/enganche-para-casa-hipoteca.md → src/content/blog/en/real-estate/home-down-payment.md` |
| /blog/inmuebles/errores-comunes-al-calcular-hipoteca | /en/blog/real-estate/common-mortgage-calculation-mistakes | ✅ Traducida / publicada | `src/content/blog/inmuebles/errores-comunes-al-calcular-hipoteca.md → src/content/blog/en/real-estate/common-mortgage-calculation-mistakes.md` |
| /blog/inmuebles/formula-cuota-hipoteca-excel-google-sheets | /en/blog/real-estate/mortgage-payment-excel-google-sheets | ✅ Traducida / publicada | `src/content/blog/inmuebles/formula-cuota-hipoteca-excel-google-sheets.md → src/content/blog/en/real-estate/mortgage-payment-excel-google-sheets.md` |
| /blog/inmuebles/gastos-notariales-avaluo-impuestos-hipoteca | /en/blog/real-estate/mortgage-closing-costs-mexico | ✅ Traducida / publicada | `src/content/blog/inmuebles/gastos-notariales-avaluo-impuestos-hipoteca.md → src/content/blog/en/real-estate/mortgage-closing-costs-mexico.md` |
| /blog/inmuebles/hipoteca-15-20-25-30-anos | /en/blog/real-estate/mortgage-terms-15-20-25-30-years | ✅ Traducida / publicada | `src/content/blog/inmuebles/hipoteca-15-20-25-30-anos.md → src/content/blog/en/real-estate/mortgage-terms-15-20-25-30-years.md` |
| /blog/inmuebles/pagos-extra-hipoteca-abono-capital | /en/blog/real-estate/extra-mortgage-payments | ✅ Traducida / publicada | `src/content/blog/inmuebles/pagos-extra-hipoteca-abono-capital.md → src/content/blog/en/real-estate/extra-mortgage-payments.md` |
| /blog/inmuebles/precio-enganche-monto-prestamo-hipotecario | /en/blog/real-estate/property-price-down-payment-loan-amount | ✅ Traducida / publicada | `src/content/blog/inmuebles/precio-enganche-monto-prestamo-hipotecario.md → src/content/blog/en/real-estate/property-price-down-payment-loan-amount.md` |
| /blog/inmuebles/que-incluye-cuota-hipotecaria | /en/blog/real-estate/what-is-included-in-a-mortgage-payment | ✅ Traducida / publicada | `src/content/blog/inmuebles/que-incluye-cuota-hipotecaria.md → src/content/blog/en/real-estate/what-is-included-in-a-mortgage-payment.md` |
| /blog/inmuebles/sistema-frances-hipoteca | /en/blog/real-estate/french-mortgage-amortization | ✅ Traducida / publicada | `src/content/blog/inmuebles/sistema-frances-hipoteca.md → src/content/blog/en/real-estate/french-mortgage-amortization.md` |
| /blog/inmuebles/tabla-amortizacion-hipoteca | /en/blog/real-estate/mortgage-amortization-schedule | ✅ Traducida / publicada | `src/content/blog/inmuebles/tabla-amortizacion-hipoteca.md → src/content/blog/en/real-estate/mortgage-amortization-schedule.md` |
| /blog/inmuebles/tabla-amortizacion-hipoteca-excel | /en/blog/real-estate/mortgage-amortization-schedule-excel | ✅ Traducida / publicada | `src/content/blog/inmuebles/tabla-amortizacion-hipoteca-excel.md → src/content/blog/en/real-estate/mortgage-amortization-schedule-excel.md` |
| /blog/inmuebles/tasa-anual-a-mensual-hipoteca | /en/blog/real-estate/annual-to-monthly-mortgage-rate | ✅ Traducida / publicada | `src/content/blog/inmuebles/tasa-anual-a-mensual-hipoteca.md → src/content/blog/en/real-estate/annual-to-monthly-mortgage-rate.md` |
| /blog/inmuebles/tasa-fija-vs-variable-hipoteca | /en/blog/real-estate/fixed-vs-variable-mortgage-rate | ✅ Traducida / publicada | `src/content/blog/inmuebles/tasa-fija-vs-variable-hipoteca.md → src/content/blog/en/real-estate/fixed-vs-variable-mortgage-rate.md` |
| /blog/inmuebles/total-intereses-hipoteca | /en/blog/real-estate/total-mortgage-interest | ✅ Traducida / publicada | `src/content/blog/inmuebles/total-intereses-hipoteca.md → src/content/blog/en/real-estate/total-mortgage-interest.md` |

### Legal e impuestos

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/legal-impuestos/como-calcular-iva | /en/blog/legal-tax/how-to-calculate-vat | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/como-calcular-iva.md → src/content/blog/en/legal-tax/how-to-calculate-vat.md` |
| /blog/legal-impuestos/como-desglosar-iva | /en/blog/legal-tax/extract-vat-from-inclusive-price | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/como-desglosar-iva.md → src/content/blog/en/legal-tax/extract-vat-from-inclusive-price.md` |
| /blog/legal-impuestos/como-sumar-iva-a-un-precio | /en/blog/legal-tax/add-vat-to-a-price | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/como-sumar-iva-a-un-precio.md → src/content/blog/en/legal-tax/add-vat-to-a-price.md` |
| /blog/legal-impuestos/errores-comunes-al-calcular-iva | /en/blog/legal-tax/common-vat-calculation-mistakes | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/errores-comunes-al-calcular-iva.md → src/content/blog/en/legal-tax/common-vat-calculation-mistakes.md` |
| /blog/legal-impuestos/igv-peru | /en/blog/legal-tax/peru-igv | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/igv-peru.md → src/content/blog/en/legal-tax/peru-igv.md` |
| /blog/legal-impuestos/iva-colombia | /en/blog/legal-tax/colombia-vat | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/iva-colombia.md → src/content/blog/en/legal-tax/colombia-vat.md` |
| /blog/legal-impuestos/iva-espana | /en/blog/legal-tax/spain-vat | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/iva-espana.md → src/content/blog/en/legal-tax/spain-vat.md` |
| /blog/legal-impuestos/iva-incluido-vs-sin-iva | /en/blog/legal-tax/vat-inclusive-vs-exclusive | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/iva-incluido-vs-sin-iva.md → src/content/blog/en/legal-tax/vat-inclusive-vs-exclusive.md` |
| /blog/legal-impuestos/iva-mexico | /en/blog/legal-tax/mexico-vat | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/iva-mexico.md → src/content/blog/en/legal-tax/mexico-vat.md` |
| /blog/legal-impuestos/tasas-de-iva-por-pais | /en/blog/legal-tax/vat-rates-by-country | ✅ Traducida / publicada | `src/content/blog/legal-impuestos/tasas-de-iva-por-pais.md → src/content/blog/en/legal-tax/vat-rates-by-country.md` |

### Matemáticas

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/matematicas/aumento-porcentual | /en/blog/math/percentage-increase | ✅ Traducida / publicada | `src/content/blog/matematicas/aumento-porcentual.md → src/content/blog/en/math/percentage-increase.md` |
| /blog/matematicas/calificaciones-con-porcentajes | /en/blog/math/grades-with-percentages | ✅ Traducida / publicada | `src/content/blog/matematicas/calificaciones-con-porcentajes.md → src/content/blog/en/math/grades-with-percentages.md` |
| /blog/matematicas/como-calcular-porcentajes | /en/blog/math/how-to-calculate-percentages | ✅ Traducida / publicada | `src/content/blog/matematicas/como-calcular-porcentajes.md → src/content/blog/en/math/how-to-calculate-percentages.md` |
| /blog/matematicas/como-restar-un-porcentaje | /en/blog/math/subtract-a-percentage | ✅ Traducida / publicada | `src/content/blog/matematicas/como-restar-un-porcentaje.md → src/content/blog/en/math/subtract-a-percentage.md` |
| /blog/matematicas/como-sumar-un-porcentaje | /en/blog/math/add-a-percentage | ✅ Traducida / publicada | `src/content/blog/matematicas/como-sumar-un-porcentaje.md → src/content/blog/en/math/add-a-percentage.md` |
| /blog/matematicas/convertir-fracciones-decimales-a-porcentajes | /en/blog/math/fractions-decimals-percentages | ✅ Traducida / publicada | `src/content/blog/matematicas/convertir-fracciones-decimales-a-porcentajes.md → src/content/blog/en/math/fractions-decimals-percentages.md` |
| /blog/matematicas/diferencia-porcentual-vs-variacion-porcentual | /en/blog/math/percentage-difference-vs-percentage-change | ✅ Traducida / publicada | `src/content/blog/matematicas/diferencia-porcentual-vs-variacion-porcentual.md → src/content/blog/en/math/percentage-difference-vs-percentage-change.md` |
| /blog/matematicas/disminucion-porcentual | /en/blog/math/percentage-decrease | ✅ Traducida / publicada | `src/content/blog/matematicas/disminucion-porcentual.md → src/content/blog/en/math/percentage-decrease.md` |
| /blog/matematicas/formulas-porcentajes-excel-google-sheets | /en/blog/math/percentage-formulas-excel-google-sheets | ✅ Traducida / publicada | `src/content/blog/matematicas/formulas-porcentajes-excel-google-sheets.md → src/content/blog/en/math/percentage-formulas-excel-google-sheets.md` |
| /blog/matematicas/porcentaje-inverso | /en/blog/math/reverse-percentage | ✅ Traducida / publicada | `src/content/blog/matematicas/porcentaje-inverso.md → src/content/blog/en/math/reverse-percentage.md` |
| /blog/matematicas/porcentaje-vs-puntos-porcentuales | /en/blog/math/percentage-vs-percentage-points | ✅ Traducida / publicada | `src/content/blog/matematicas/porcentaje-vs-puntos-porcentuales.md → src/content/blog/en/math/percentage-vs-percentage-points.md` |
| /blog/matematicas/que-porcentaje-es-una-cantidad-de-otra | /en/blog/math/what-percentage-is-one-number-of-another | ✅ Traducida / publicada | `src/content/blog/matematicas/que-porcentaje-es-una-cantidad-de-otra.md → src/content/blog/en/math/what-percentage-is-one-number-of-another.md` |
| /blog/matematicas/regla-de-tres | /en/blog/math/rule-of-three | ✅ Traducida / publicada | `src/content/blog/matematicas/regla-de-tres.md → src/content/blog/en/math/rule-of-three.md` |

### Salud

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/salud/bajar-subir-peso-segun-imc | /en/blog/health/adjust-weight-based-on-bmi | ✅ Traducida / publicada | `src/content/blog/salud/bajar-subir-peso-segun-imc.md → src/content/blog/en/health/adjust-weight-based-on-bmi.md` |
| /blog/salud/bajo-peso-segun-imc-menor-18-5 | /en/blog/health/underweight-bmi-below-18-5 | ✅ Traducida / publicada | `src/content/blog/salud/bajo-peso-segun-imc-menor-18-5.md → src/content/blog/en/health/underweight-bmi-below-18-5.md` |
| /blog/salud/calcular-imc-libras-pies-pulgadas | /en/blog/health/calculate-bmi-pounds-feet-inches | ✅ Traducida / publicada | `src/content/blog/salud/calcular-imc-libras-pies-pulgadas.md → src/content/blog/en/health/calculate-bmi-pounds-feet-inches.md` |
| /blog/salud/calorias-de-mantenimiento | /en/blog/health/maintenance-calories | ✅ Traducida / publicada | `src/content/blog/salud/calorias-de-mantenimiento.md → src/content/blog/en/health/maintenance-calories.md` |
| /blog/salud/calorias-diarias-e-imc | /en/blog/health/daily-calories-and-bmi | ✅ Traducida / publicada | `src/content/blog/salud/calorias-diarias-e-imc.md → src/content/blog/en/health/daily-calories-and-bmi.md` |
| /blog/salud/como-elegir-nivel-de-actividad-tdee | /en/blog/health/choose-tdee-activity-level | ✅ Traducida / publicada | `src/content/blog/salud/como-elegir-nivel-de-actividad-tdee.md → src/content/blog/en/health/choose-tdee-activity-level.md` |
| /blog/salud/como-interpretar-resultado-imc | /en/blog/health/interpret-bmi-result | ✅ Traducida / publicada | `src/content/blog/salud/como-interpretar-resultado-imc.md → src/content/blog/en/health/interpret-bmi-result.md` |
| /blog/salud/cuantas-calorias-necesito-al-dia | /en/blog/health/how-many-calories-per-day | ✅ Traducida / publicada | `src/content/blog/salud/cuantas-calorias-necesito-al-dia.md → src/content/blog/en/health/how-many-calories-per-day.md` |
| /blog/salud/cuantas-calorias-para-bajar-de-peso | /en/blog/health/calories-to-lose-weight | ✅ Traducida / publicada | `src/content/blog/salud/cuantas-calorias-para-bajar-de-peso.md → src/content/blog/en/health/calories-to-lose-weight.md` |
| /blog/salud/cuantas-calorias-para-subir-de-peso | /en/blog/health/calories-to-gain-weight | ✅ Traducida / publicada | `src/content/blog/salud/cuantas-calorias-para-subir-de-peso.md → src/content/blog/en/health/calories-to-gain-weight.md` |
| /blog/salud/cuanto-deberia-pesar-segun-estatura | /en/blog/health/how-much-should-i-weigh | ✅ Traducida / publicada | `src/content/blog/salud/cuanto-deberia-pesar-segun-estatura.md → src/content/blog/en/health/how-much-should-i-weigh.md` |
| /blog/salud/formula-imc-excel-google-sheets | /en/blog/health/bmi-formula-excel-google-sheets | ✅ Traducida / publicada | `src/content/blog/salud/formula-imc-excel-google-sheets.md → src/content/blog/en/health/bmi-formula-excel-google-sheets.md` |
| /blog/salud/formula-mifflin-st-jeor | /en/blog/health/mifflin-st-jeor-equation | ✅ Traducida / publicada | `src/content/blog/salud/formula-mifflin-st-jeor.md → src/content/blog/en/health/mifflin-st-jeor-equation.md` |
| /blog/salud/imc-18-20-22-25-27-30-35-40 | /en/blog/health/bmi-values-18-20-22-25-27-30-35-40 | ✅ Traducida / publicada | `src/content/blog/salud/imc-18-20-22-25-27-30-35-40.md → src/content/blog/en/health/bmi-values-18-20-22-25-27-30-35-40.md` |
| /blog/salud/imc-30-o-mas-que-significa | /en/blog/health/bmi-30-or-higher | ✅ Traducida / publicada | `src/content/blog/salud/imc-30-o-mas-que-significa.md → src/content/blog/en/health/bmi-30-or-higher.md` |
| /blog/salud/imc-adultos-mayores | /en/blog/health/bmi-older-adults | ✅ Traducida / publicada | `src/content/blog/salud/imc-adultos-mayores.md → src/content/blog/en/health/bmi-older-adults.md` |
| /blog/salud/imc-embarazo | /en/blog/health/bmi-during-pregnancy | ✅ Traducida / publicada | `src/content/blog/salud/imc-embarazo.md → src/content/blog/en/health/bmi-during-pregnancy.md` |
| /blog/salud/imc-hombres-mujeres | /en/blog/health/bmi-men-vs-women | ✅ Traducida / publicada | `src/content/blog/salud/imc-hombres-mujeres.md → src/content/blog/en/health/bmi-men-vs-women.md` |
| /blog/salud/imc-masa-muscular-ejercicio | /en/blog/health/bmi-muscle-and-exercise | ✅ Traducida / publicada | `src/content/blog/salud/imc-masa-muscular-ejercicio.md → src/content/blog/en/health/bmi-muscle-and-exercise.md` |
| /blog/salud/imc-menor-a-16-que-significa | /en/blog/health/bmi-below-16 | ✅ Traducida / publicada | `src/content/blog/salud/imc-menor-a-16-que-significa.md → src/content/blog/en/health/bmi-below-16.md` |
| /blog/salud/imc-ninos-adolescentes-percentiles | /en/blog/health/child-teen-bmi-percentiles | ✅ Traducida / publicada | `src/content/blog/salud/imc-ninos-adolescentes-percentiles.md → src/content/blog/en/health/child-teen-bmi-percentiles.md` |
| /blog/salud/imc-normal-rango-saludable-adultos | /en/blog/health/healthy-adult-bmi-range | ✅ Traducida / publicada | `src/content/blog/salud/imc-normal-rango-saludable-adultos.md → src/content/blog/en/health/healthy-adult-bmi-range.md` |
| /blog/salud/imc-vs-indice-cintura-altura | /en/blog/health/bmi-vs-waist-to-height-ratio | ✅ Traducida / publicada | `src/content/blog/salud/imc-vs-indice-cintura-altura.md → src/content/blog/en/health/bmi-vs-waist-to-height-ratio.md` |
| /blog/salud/imc-vs-porcentaje-grasa-corporal | /en/blog/health/bmi-vs-body-fat-percentage | ✅ Traducida / publicada | `src/content/blog/salud/imc-vs-porcentaje-grasa-corporal.md → src/content/blog/en/health/bmi-vs-body-fat-percentage.md` |
| /blog/salud/limitaciones-del-imc | /en/blog/health/bmi-limitations | ✅ Traducida / publicada | `src/content/blog/salud/limitaciones-del-imc.md → src/content/blog/en/health/bmi-limitations.md` |
| /blog/salud/obesidad-clase-1-2-3-imc | /en/blog/health/obesity-classes-bmi | ✅ Traducida / publicada | `src/content/blog/salud/obesidad-clase-1-2-3-imc.md → src/content/blog/en/health/obesity-classes-bmi.md` |
| /blog/salud/peso-ideal-vs-peso-saludable | /en/blog/health/ideal-weight-vs-healthy-weight | ✅ Traducida / publicada | `src/content/blog/salud/peso-ideal-vs-peso-saludable.md → src/content/blog/en/health/ideal-weight-vs-healthy-weight.md` |
| /blog/salud/peso-saludable-segun-estatura | /en/blog/health/healthy-weight-by-height | ✅ Traducida / publicada | `src/content/blog/salud/peso-saludable-segun-estatura.md → src/content/blog/en/health/healthy-weight-by-height.md` |
| /blog/salud/por-que-mi-peso-no-cambia-si-como-mi-tdee | /en/blog/health/why-weight-does-not-change-at-tdee | ✅ Traducida / publicada | `src/content/blog/salud/por-que-mi-peso-no-cambia-si-como-mi-tdee.md → src/content/blog/en/health/why-weight-does-not-change-at-tdee.md` |
| /blog/salud/que-es-el-imc-y-como-se-calcula | /en/blog/health/what-is-bmi | ✅ Traducida / publicada | `src/content/blog/salud/que-es-el-imc-y-como-se-calcula.md → src/content/blog/en/health/what-is-bmi.md` |
| /blog/salud/que-es-tdee-calorias-diarias | /en/blog/health/what-is-tdee | ✅ Traducida / publicada | `src/content/blog/salud/que-es-tdee-calorias-diarias.md → src/content/blog/en/health/what-is-tdee.md` |
| /blog/salud/sobrepeso-segun-imc-25-29-9 | /en/blog/health/overweight-bmi-25-29-9 | ✅ Traducida / publicada | `src/content/blog/salud/sobrepeso-segun-imc-25-29-9.md → src/content/blog/en/health/overweight-bmi-25-29-9.md` |
| /blog/salud/tabla-imc-adultos-rangos-categorias | /en/blog/health/adult-bmi-chart | ✅ Traducida / publicada | `src/content/blog/salud/tabla-imc-adultos-rangos-categorias.md → src/content/blog/en/health/adult-bmi-chart.md` |
| /blog/salud/tdee-y-macros-como-se-relacionan | /en/blog/health/tdee-and-macros | ✅ Traducida / publicada | `src/content/blog/salud/tdee-y-macros-como-se-relacionan.md → src/content/blog/en/health/tdee-and-macros.md` |
| /blog/salud/tmb-vs-tdee-diferencias | /en/blog/health/bmr-vs-tdee | ✅ Traducida / publicada | `src/content/blog/salud/tmb-vs-tdee-diferencias.md → src/content/blog/en/health/bmr-vs-tdee.md` |

## 6. Superficies dinámicas y compartidas

| Superficie | Estado actual | Regla de seguimiento |
| --- | --- | --- |
| Paginación del blog ES | Paginación EN | ✅ Traducida / publicada | `src/pages/blog/pagina/[page].astro`, `src/pages/blog/[category]/pagina/[page].astro`, `src/pages/en/blog/page/[page].astro` y `src/pages/en/blog/[category]/page/[page].astro`; cada página hereda el estado del hub y de sus artículos. |
| Navbar, footer, breadcrumbs y textos comunes | Navbar, footer, breadcrumbs y textos comunes EN | ✅ Base traducida / publicada | ``src/lib/i18n/messages.ts`, `src/components/template/` y `src/components/shared/`` |
| Políticas y consentimiento publicitario | Políticas y consentimiento publicitario EN | ✅ Base traducida / publicada | `La política de privacidad y la UI de consentimiento ya tienen versión EN; la capacidad publicitaria sigue su configuración independiente.` |

Las plantillas `src/pages/en/blog/**` ya existen y permiten generar las rutas EN; no equivalen por sí solas a contenido traducido. La publicación debe seguir dependiendo de contenido EN validado.

## Fuentes revisadas

- `src/pages/` y `src/pages/en/`
- `src/lib/constants/categories.ts` y `src/lib/constants/calculators.ts`
- `src/content/blog/` y `src/content.config.ts`
- `src/lib/blog.ts`, `src/lib/blog-publication.ts` y `src/lib/i18n/`
- `specs/i18n_spec.md`, `specs/i18n_plan.md` y `specs/i18n/08-expansion-inventory.md`

Al agregar o retirar una página, actualizar la fila correspondiente y revisar también el manifest/routing tipado; este archivo no debe convertirse en una fuente paralela para el runtime.
