# Inventario de traducción ES → EN

> Seguimiento editorial del proyecto de traducción completa del sitio. Actualizado: 2026-07-28.

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
| Hubs y categorías del blog | 7 | 2 | 5 |
| Categorías de calculadoras | 16 | 1 | 15 |
| Calculadoras | 91 | 1 | 90 |
| Artículos del blog ES | 118 | 3 equivalentes EN | 115 (+ 4 programados ES) |
| **Total de unidades** | **242** | **17** | **225** |

Nota: los 4 artículos españoles con fecha posterior al 2026-07-28 están incluidos como `🟡 Programada en ES`. Las tres traducciones EN existentes son artículos independientes publicados en `src/content/blog/en/math/`.

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
| /blog/conversores | Por definir | ⬜ Pendiente | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/finanzas | Por definir | ⬜ Pendiente | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/inmuebles | Por definir | ⬜ Pendiente | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/legal-impuestos | Por definir | ⬜ Pendiente | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/matematicas | /en/blog/math | ✅ Traducida / publicada | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |
| /blog/salud | Por definir | ⬜ Pendiente | `src/pages/blog/[category].astro + src/pages/en/blog/[category].astro` |

## 3. Categorías del directorio de calculadoras

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /finanzas | /en/finance | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /inmuebles | /en/real-estate | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /legal-impuestos | /en/legal-tax | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /matematicas | /en/math | ✅ Traducida / publicada | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /probabilidad-estadistica | /en/probability-statistics | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /programacion | /en/programming | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /geometria | /en/geometry | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /salud | /en/health | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /fecha-tiempo | /en/date-time | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /conversores | /en/converters | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /mascotas | /en/pets | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /cocina | /en/cooking | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /eventos | /en/events | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /restaurantes | /en/restaurants | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /vehiculos | /en/vehicles | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |
| /construccion | /en/construction | ⬜ Pendiente | `src/lib/constants/categories.ts + src/pages/[category].astro` |

## 4. Calculadoras

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /cocina/calculadora-tiempo-coccion-por-peso | Por definir | ⬜ Pendiente | `src/pages/cocina/calculadora-tiempo-coccion-por-peso.astro` |
| /cocina/conversor-de-medidas-culinarias | Por definir | ⬜ Pendiente | `src/pages/cocina/conversor-de-medidas-culinarias.astro` |
| /cocina/conversor-de-temperatura-de-horno | Por definir | ⬜ Pendiente | `src/pages/cocina/conversor-de-temperatura-de-horno.astro` |
| /cocina/escalar-receta-por-porciones | Por definir | ⬜ Pendiente | `src/pages/cocina/escalar-receta-por-porciones.astro` |
| /construccion/calculadora-cantidad-ladrillos | Por definir | ⬜ Pendiente | `src/pages/construccion/calculadora-cantidad-ladrillos.astro` |
| /construccion/calculadora-piso-azulejo-superficie | Por definir | ⬜ Pendiente | `src/pages/construccion/calculadora-piso-azulejo-superficie.astro` |
| /construccion/calculadora-presupuesto-remodelacion | Por definir | ⬜ Pendiente | `src/pages/construccion/calculadora-presupuesto-remodelacion.astro` |
| /construccion/calculadora-volumen-concreto-cemento | Por definir | ⬜ Pendiente | `src/pages/construccion/calculadora-volumen-concreto-cemento.astro` |
| /construccion/metros-cuadrados-de-pintura | Por definir | ⬜ Pendiente | `src/pages/construccion/metros-cuadrados-de-pintura.astro` |
| /conversores/conversor-de-area-m2-ft2-hectareas-acres | Por definir | ⬜ Pendiente | `src/pages/conversores/conversor-de-area-m2-ft2-hectareas-acres.astro` |
| /conversores/conversor-de-peso | Por definir | ⬜ Pendiente | `src/pages/conversores/conversor-de-peso.astro` |
| /conversores/conversor-de-temperatura | Por definir | ⬜ Pendiente | `src/pages/conversores/conversor-de-temperatura.astro` |
| /conversores/conversor-de-volumen | Por definir | ⬜ Pendiente | `src/pages/conversores/conversor-de-volumen.astro` |
| /conversores/conversor-tallas-de-ropa | Por definir | ⬜ Pendiente | `src/pages/conversores/conversor-tallas-de-ropa.astro` |
| /conversores/kilometros-a-millas | Por definir | ⬜ Pendiente | `src/pages/conversores/kilometros-a-millas.astro` |
| /conversores/litros-a-galones | Por definir | ⬜ Pendiente | `src/pages/conversores/litros-a-galones.astro` |
| /eventos/calculadora-costo-por-persona-evento | Por definir | ⬜ Pendiente | `src/pages/eventos/calculadora-costo-por-persona-evento.astro` |
| /eventos/calculadora-presupuesto-boda | Por definir | ⬜ Pendiente | `src/pages/eventos/calculadora-presupuesto-boda.astro` |
| /fecha-tiempo/calculadora-costo-reunion | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-costo-reunion.astro` |
| /fecha-tiempo/calculadora-de-edad | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-de-edad.astro` |
| /fecha-tiempo/calculadora-de-horas-trabajadas | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-de-horas-trabajadas.astro` |
| /fecha-tiempo/calculadora-fecha-limite-countdown | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-fecha-limite-countdown.astro` |
| /fecha-tiempo/calculadora-pomodoro | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-pomodoro.astro` |
| /fecha-tiempo/calculadora-tiempo-de-lectura | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/calculadora-tiempo-de-lectura.astro` |
| /fecha-tiempo/diferencia-entre-fechas | Por definir | ⬜ Pendiente | `src/pages/fecha-tiempo/diferencia-entre-fechas.astro` |
| /finanzas/calculadora-dca-costo-promedio | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-dca-costo-promedio.astro` |
| /finanzas/calculadora-de-ahorro-para-un-objetivo | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-ahorro-para-un-objetivo.astro` |
| /finanzas/calculadora-de-inflacion-poder-adquisitivo | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-inflacion-poder-adquisitivo.astro` |
| /finanzas/calculadora-de-interes-compuesto | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-interes-compuesto.astro` |
| /finanzas/calculadora-de-interes-simple | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-interes-simple.astro` |
| /finanzas/calculadora-de-margen-y-markup | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-margen-y-markup.astro` |
| /finanzas/calculadora-de-precio-de-proyecto-freelance | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-precio-de-proyecto-freelance.astro` |
| /finanzas/calculadora-de-prestamo | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-prestamo.astro` |
| /finanzas/calculadora-de-punto-de-equilibrio | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-punto-de-equilibrio.astro` |
| /finanzas/calculadora-de-roi | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-roi.astro` |
| /finanzas/calculadora-de-tarifa-por-hora-freelance | Por definir | ⬜ Pendiente | `src/pages/finanzas/calculadora-de-tarifa-por-hora-freelance.astro` |
| /finanzas/plan-de-pago-de-deudas | Por definir | ⬜ Pendiente | `src/pages/finanzas/plan-de-pago-de-deudas.astro` |
| /geometria/calculadora-de-area-y-perimetro | Por definir | ⬜ Pendiente | `src/pages/geometria/calculadora-de-area-y-perimetro.astro` |
| /geometria/calculadora-del-teorema-de-pitagoras | Por definir | ⬜ Pendiente | `src/pages/geometria/calculadora-del-teorema-de-pitagoras.astro` |
| /inmuebles/calculadora-cap-rate-rentabilidad | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-cap-rate-rentabilidad.astro` |
| /inmuebles/calculadora-capacidad-compra-vivienda | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-capacidad-compra-vivienda.astro` |
| /inmuebles/calculadora-de-hipoteca | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-de-hipoteca.astro` |
| /inmuebles/calculadora-gastos-escrituracion | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-gastos-escrituracion.astro` |
| /inmuebles/calculadora-plusvalia-estimada | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-plusvalia-estimada.astro` |
| /inmuebles/calculadora-precio-por-metro-cuadrado | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-precio-por-metro-cuadrado.astro` |
| /inmuebles/calculadora-renta-vs-compra | Por definir | ⬜ Pendiente | `src/pages/inmuebles/calculadora-renta-vs-compra.astro` |
| /legal-impuestos/calculadora-de-iva | Por definir | ⬜ Pendiente | `src/pages/legal-impuestos/calculadora-de-iva.astro` |
| /legal-impuestos/calculadora-isr-irpf | Por definir | ⬜ Pendiente | `src/pages/legal-impuestos/calculadora-isr-irpf.astro` |
| /legal-impuestos/calculadora-salario-neto | Por definir | ⬜ Pendiente | `src/pages/legal-impuestos/calculadora-salario-neto.astro` |
| /mascotas/calorias-diarias-para-perro-o-gato | Por definir | ⬜ Pendiente | `src/pages/mascotas/calorias-diarias-para-perro-o-gato.astro` |
| /mascotas/edad-de-mascota-en-anos-humanos | Por definir | ⬜ Pendiente | `src/pages/mascotas/edad-de-mascota-en-anos-humanos.astro` |
| /matematicas/calculadora-calificacion-ponderada | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-calificacion-ponderada.astro` |
| /matematicas/calculadora-de-estadistica-basica | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-de-estadistica-basica.astro` |
| /matematicas/calculadora-de-porcentajes | /en/math/percentage-calculator | ✅ Traducida / publicada | `src/pages/matematicas/calculadora-de-porcentajes.astro` |
| /matematicas/calculadora-de-regla-de-tres | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-de-regla-de-tres.astro` |
| /matematicas/calculadora-ecuaciones-cuadraticas | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-ecuaciones-cuadraticas.astro` |
| /matematicas/calculadora-horas-de-estudio | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-horas-de-estudio.astro` |
| /matematicas/calculadora-mcd-mcm | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-mcd-mcm.astro` |
| /matematicas/calculadora-nota-minima-para-aprobar | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-nota-minima-para-aprobar.astro` |
| /matematicas/calculadora-porcentaje-asistencia-escolar | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro` |
| /matematicas/calculadora-promedio-escolar-gpa | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-promedio-escolar-gpa.astro` |
| /matematicas/calculadora-sistema-ecuaciones-2x2 | Por definir | ⬜ Pendiente | `src/pages/matematicas/calculadora-sistema-ecuaciones-2x2.astro` |
| /probabilidad-estadistica/calculadora-combinaciones-permutaciones | Por definir | ⬜ Pendiente | `src/pages/probabilidad-estadistica/calculadora-combinaciones-permutaciones.astro` |
| /probabilidad-estadistica/calculadora-distribucion-normal-z-score | Por definir | ⬜ Pendiente | `src/pages/probabilidad-estadistica/calculadora-distribucion-normal-z-score.astro` |
| /probabilidad-estadistica/calculadora-probabilidad-basica | Por definir | ⬜ Pendiente | `src/pages/probabilidad-estadistica/calculadora-probabilidad-basica.astro` |
| /programacion/calculadora-entropia-contrasena | Por definir | ⬜ Pendiente | `src/pages/programacion/calculadora-entropia-contrasena.astro` |
| /programacion/calculadora-velocidad-descarga | Por definir | ⬜ Pendiente | `src/pages/programacion/calculadora-velocidad-descarga.astro` |
| /programacion/conversor-de-bases-numericas | Por definir | ⬜ Pendiente | `src/pages/programacion/conversor-de-bases-numericas.astro` |
| /programacion/paleta-hex-rgb-hsl | Por definir | ⬜ Pendiente | `src/pages/programacion/paleta-hex-rgb-hsl.astro` |
| /restaurantes/calculadora-de-propina | Por definir | ⬜ Pendiente | `src/pages/restaurantes/calculadora-de-propina.astro` |
| /restaurantes/dividir-cuenta-en-restaurante | Por definir | ⬜ Pendiente | `src/pages/restaurantes/dividir-cuenta-en-restaurante.astro` |
| /salud/calculadora-1rm-repeticion-maxima | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-1rm-repeticion-maxima.astro` |
| /salud/calculadora-de-agua-diaria | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-agua-diaria.astro` |
| /salud/calculadora-de-calorias-diarias-tdee | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-calorias-diarias-tdee.astro` |
| /salud/calculadora-de-calorias-quemadas-por-ejercicio | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-calorias-quemadas-por-ejercicio.astro` |
| /salud/calculadora-de-frecuencia-cardiaca-maxima | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-frecuencia-cardiaca-maxima.astro` |
| /salud/calculadora-de-imc | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-imc.astro` |
| /salud/calculadora-de-macros | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-macros.astro` |
| /salud/calculadora-de-ovulacion | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-ovulacion.astro` |
| /salud/calculadora-de-pace-ritmo-de-carrera | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-pace-ritmo-de-carrera.astro` |
| /salud/calculadora-de-porcentaje-de-grasa-corporal | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-porcentaje-de-grasa-corporal.astro` |
| /salud/calculadora-de-proteina-diaria | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-proteina-diaria.astro` |
| /salud/calculadora-de-zonas-de-frecuencia-cardiaca | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-de-zonas-de-frecuencia-cardiaca.astro` |
| /salud/calculadora-deficit-calorico | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-deficit-calorico.astro` |
| /salud/calculadora-prediccion-tiempo-carrera | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-prediccion-tiempo-carrera.astro` |
| /salud/calculadora-vo2-max | Por definir | ⬜ Pendiente | `src/pages/salud/calculadora-vo2-max.astro` |
| /salud/fecha-probable-de-parto | Por definir | ⬜ Pendiente | `src/pages/salud/fecha-probable-de-parto.astro` |
| /vehiculos/calculadora-de-consumo-de-gasolina | Por definir | ⬜ Pendiente | `src/pages/vehiculos/calculadora-de-consumo-de-gasolina.astro` |
| /vehiculos/calculadora-de-costo-por-kilometro | Por definir | ⬜ Pendiente | `src/pages/vehiculos/calculadora-de-costo-por-kilometro.astro` |
| /vehiculos/calculadora-de-depreciacion-del-vehiculo | Por definir | ⬜ Pendiente | `src/pages/vehiculos/calculadora-de-depreciacion-del-vehiculo.astro` |
| /vehiculos/calculadora-de-gastos-anuales-del-vehiculo | Por definir | ⬜ Pendiente | `src/pages/vehiculos/calculadora-de-gastos-anuales-del-vehiculo.astro` |

Todas las calculadoras ES listadas tienen implementación en `src/pages/` y están pendientes de una metadata EN, contenido localizado, ruta EN y revisión antes de publicar, excepto la calculadora de porcentajes.

## 5. Artículos del blog

| Ruta ES | Ruta EN | Estado | Origen |
| --- | --- | --- | --- |
| /blog/conversores/como-convertir-kilometros-a-millas | Por definir | ⬜ Pendiente | `src/content/blog/conversores/como-convertir-kilometros-a-millas.md` |
| /blog/conversores/como-convertir-kilometros-a-millas-en-excel | Por definir | 🟡 Programada en ES | `src/content/blog/conversores/como-convertir-kilometros-a-millas-en-excel.md` |
| /blog/conversores/kilometros-vs-millas-diferencias | Por definir | 🟡 Programada en ES | `src/content/blog/conversores/kilometros-vs-millas-diferencias.md` |
| /blog/conversores/milla-terrestre-vs-milla-nautica | Por definir | 🟡 Programada en ES | `src/content/blog/conversores/milla-terrestre-vs-milla-nautica.md` |
| /blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla | Por definir | 🟡 Programada en ES | `src/content/blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla.md` |
| /blog/conversores/tabla-kilometros-a-millas-distancias-comunes | Por definir | ⬜ Pendiente | `src/content/blog/conversores/tabla-kilometros-a-millas-distancias-comunes.md` |
| /blog/finanzas/cagr-tasa-crecimiento-anual-compuesto | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/cagr-tasa-crecimiento-anual-compuesto.md` |
| /blog/finanzas/cat-vs-tasa-interes | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/cat-vs-tasa-interes.md` |
| /blog/finanzas/cetes-interes-compuesto-reinversion | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/cetes-interes-compuesto-reinversion.md` |
| /blog/finanzas/comision-apertura-prestamo | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/comision-apertura-prestamo.md` |
| /blog/finanzas/como-calcular-cuota-mensual-prestamo | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/como-calcular-cuota-mensual-prestamo.md` |
| /blog/finanzas/como-calcular-intereses-prestamo | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/como-calcular-intereses-prestamo.md` |
| /blog/finanzas/comparar-dos-prestamos | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/comparar-dos-prestamos.md` |
| /blog/finanzas/credito-automotriz-calcular-mensualidad | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/credito-automotriz-calcular-mensualidad.md` |
| /blog/finanzas/cuanto-ahorrar-al-mes-para-una-meta | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/cuanto-ahorrar-al-mes-para-una-meta.md` |
| /blog/finanzas/cuanto-puedo-pedir-prestado-segun-ingreso | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/cuanto-puedo-pedir-prestado-segun-ingreso.md` |
| /blog/finanzas/descuentos-sucesivos | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/descuentos-sucesivos.md` |
| /blog/finanzas/errores-calculadora-interes-compuesto | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/errores-calculadora-interes-compuesto.md` |
| /blog/finanzas/formula-interes-compuesto | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/formula-interes-compuesto.md` |
| /blog/finanzas/inflacion-interes-compuesto-valor-real | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/inflacion-interes-compuesto-valor-real.md` |
| /blog/finanzas/interes-compuesto-aportaciones-mensuales | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/interes-compuesto-aportaciones-mensuales.md` |
| /blog/finanzas/interes-compuesto-retiro | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/interes-compuesto-retiro.md` |
| /blog/finanzas/interes-simple-vs-compuesto | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/interes-simple-vs-compuesto.md` |
| /blog/finanzas/microcreditos-apps-prestamos-caros | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/microcreditos-apps-prestamos-caros.md` |
| /blog/finanzas/pagos-extra-prestamo-abono-capital | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/pagos-extra-prestamo-abono-capital.md` |
| /blog/finanzas/porcentaje-de-descuento | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/porcentaje-de-descuento.md` |
| /blog/finanzas/porcentaje-de-ganancia-y-margen | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/porcentaje-de-ganancia-y-margen.md` |
| /blog/finanzas/prestamo-12-24-36-48-meses | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/prestamo-12-24-36-48-meses.md` |
| /blog/finanzas/prestamo-nomina-vs-prestamo-personal | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/prestamo-nomina-vs-prestamo-personal.md` |
| /blog/finanzas/prestamo-personal-vs-tarjeta-credito | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/prestamo-personal-vs-tarjeta-credito.md` |
| /blog/finanzas/prestamos-entre-particulares | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/prestamos-entre-particulares.md` |
| /blog/finanzas/que-es-interes-compuesto | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/que-es-interes-compuesto.md` |
| /blog/finanzas/regla-del-72 | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/regla-del-72.md` |
| /blog/finanzas/seguro-mensual-credito | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/seguro-mensual-credito.md` |
| /blog/finanzas/sistema-frances-amortizacion | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/sistema-frances-amortizacion.md` |
| /blog/finanzas/tabla-amortizacion-excel | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/tabla-amortizacion-excel.md` |
| /blog/finanzas/tabla-amortizacion-prestamo | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/tabla-amortizacion-prestamo.md` |
| /blog/finanzas/tasa-anual-mensual-diaria-prestamo | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/tasa-anual-mensual-diaria-prestamo.md` |
| /blog/finanzas/tasa-nominal-vs-tasa-efectiva | Por definir | ⬜ Pendiente | `src/content/blog/finanzas/tasa-nominal-vs-tasa-efectiva.md` |
| /blog/inmuebles/amortizacion-anticipada-reducir-plazo-o-cuota | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/amortizacion-anticipada-reducir-plazo-o-cuota.md` |
| /blog/inmuebles/apoyo-infonavit-hipoteca-bancaria | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/apoyo-infonavit-hipoteca-bancaria.md` |
| /blog/inmuebles/cat-vs-tasa-credito-hipotecario | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/cat-vs-tasa-credito-hipotecario.md` |
| /blog/inmuebles/como-calcular-cuota-mensual-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/como-calcular-cuota-mensual-hipoteca.md` |
| /blog/inmuebles/comparar-creditos-hipotecarios | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/comparar-creditos-hipotecarios.md` |
| /blog/inmuebles/credito-hipotecario-banco-vs-infonavit | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/credito-hipotecario-banco-vs-infonavit.md` |
| /blog/inmuebles/cuanto-puedo-pedir-prestado-para-casa | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/cuanto-puedo-pedir-prestado-para-casa.md` |
| /blog/inmuebles/enganche-para-casa-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/enganche-para-casa-hipoteca.md` |
| /blog/inmuebles/errores-comunes-al-calcular-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/errores-comunes-al-calcular-hipoteca.md` |
| /blog/inmuebles/formula-cuota-hipoteca-excel-google-sheets | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/formula-cuota-hipoteca-excel-google-sheets.md` |
| /blog/inmuebles/gastos-notariales-avaluo-impuestos-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/gastos-notariales-avaluo-impuestos-hipoteca.md` |
| /blog/inmuebles/hipoteca-15-20-25-30-anos | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/hipoteca-15-20-25-30-anos.md` |
| /blog/inmuebles/pagos-extra-hipoteca-abono-capital | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/pagos-extra-hipoteca-abono-capital.md` |
| /blog/inmuebles/precio-enganche-monto-prestamo-hipotecario | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/precio-enganche-monto-prestamo-hipotecario.md` |
| /blog/inmuebles/que-incluye-cuota-hipotecaria | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/que-incluye-cuota-hipotecaria.md` |
| /blog/inmuebles/sistema-frances-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/sistema-frances-hipoteca.md` |
| /blog/inmuebles/tabla-amortizacion-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/tabla-amortizacion-hipoteca.md` |
| /blog/inmuebles/tabla-amortizacion-hipoteca-excel | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/tabla-amortizacion-hipoteca-excel.md` |
| /blog/inmuebles/tasa-anual-a-mensual-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/tasa-anual-a-mensual-hipoteca.md` |
| /blog/inmuebles/tasa-fija-vs-variable-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/tasa-fija-vs-variable-hipoteca.md` |
| /blog/inmuebles/total-intereses-hipoteca | Por definir | ⬜ Pendiente | `src/content/blog/inmuebles/total-intereses-hipoteca.md` |
| /blog/legal-impuestos/como-calcular-iva | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/como-calcular-iva.md` |
| /blog/legal-impuestos/como-desglosar-iva | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/como-desglosar-iva.md` |
| /blog/legal-impuestos/como-sumar-iva-a-un-precio | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/como-sumar-iva-a-un-precio.md` |
| /blog/legal-impuestos/errores-comunes-al-calcular-iva | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/errores-comunes-al-calcular-iva.md` |
| /blog/legal-impuestos/igv-peru | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/igv-peru.md` |
| /blog/legal-impuestos/iva-colombia | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/iva-colombia.md` |
| /blog/legal-impuestos/iva-espana | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/iva-espana.md` |
| /blog/legal-impuestos/iva-incluido-vs-sin-iva | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/iva-incluido-vs-sin-iva.md` |
| /blog/legal-impuestos/iva-mexico | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/iva-mexico.md` |
| /blog/legal-impuestos/tasas-de-iva-por-pais | Por definir | ⬜ Pendiente | `src/content/blog/legal-impuestos/tasas-de-iva-por-pais.md` |
| /blog/matematicas/aumento-porcentual | /en/blog/math/percentage-increase | ✅ Traducida / publicada | `src/content/blog/matematicas/aumento-porcentual.md → src/content/blog/en/math/percentage-increase.md` |
| /blog/matematicas/calificaciones-con-porcentajes | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/calificaciones-con-porcentajes.md` |
| /blog/matematicas/como-calcular-porcentajes | /en/blog/math/how-to-calculate-percentages | ✅ Traducida / publicada | `src/content/blog/matematicas/como-calcular-porcentajes.md → src/content/blog/en/math/how-to-calculate-percentages.md` |
| /blog/matematicas/como-restar-un-porcentaje | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/como-restar-un-porcentaje.md` |
| /blog/matematicas/como-sumar-un-porcentaje | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/como-sumar-un-porcentaje.md` |
| /blog/matematicas/convertir-fracciones-decimales-a-porcentajes | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/convertir-fracciones-decimales-a-porcentajes.md` |
| /blog/matematicas/diferencia-porcentual-vs-variacion-porcentual | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/diferencia-porcentual-vs-variacion-porcentual.md` |
| /blog/matematicas/disminucion-porcentual | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/disminucion-porcentual.md` |
| /blog/matematicas/formulas-porcentajes-excel-google-sheets | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/formulas-porcentajes-excel-google-sheets.md` |
| /blog/matematicas/porcentaje-inverso | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/porcentaje-inverso.md` |
| /blog/matematicas/porcentaje-vs-puntos-porcentuales | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/porcentaje-vs-puntos-porcentuales.md` |
| /blog/matematicas/que-porcentaje-es-una-cantidad-de-otra | /en/blog/math/what-percentage-is-one-number-of-another | ✅ Traducida / publicada | `src/content/blog/matematicas/que-porcentaje-es-una-cantidad-de-otra.md → src/content/blog/en/math/what-percentage-is-one-number-of-another.md` |
| /blog/matematicas/regla-de-tres | Por definir | ⬜ Pendiente | `src/content/blog/matematicas/regla-de-tres.md` |
| /blog/salud/bajar-subir-peso-segun-imc | Por definir | ⬜ Pendiente | `src/content/blog/salud/bajar-subir-peso-segun-imc.md` |
| /blog/salud/bajo-peso-segun-imc-menor-18-5 | Por definir | ⬜ Pendiente | `src/content/blog/salud/bajo-peso-segun-imc-menor-18-5.md` |
| /blog/salud/calcular-imc-libras-pies-pulgadas | Por definir | ⬜ Pendiente | `src/content/blog/salud/calcular-imc-libras-pies-pulgadas.md` |
| /blog/salud/calorias-de-mantenimiento | Por definir | ⬜ Pendiente | `src/content/blog/salud/calorias-de-mantenimiento.md` |
| /blog/salud/calorias-diarias-e-imc | Por definir | ⬜ Pendiente | `src/content/blog/salud/calorias-diarias-e-imc.md` |
| /blog/salud/como-elegir-nivel-de-actividad-tdee | Por definir | ⬜ Pendiente | `src/content/blog/salud/como-elegir-nivel-de-actividad-tdee.md` |
| /blog/salud/como-interpretar-resultado-imc | Por definir | ⬜ Pendiente | `src/content/blog/salud/como-interpretar-resultado-imc.md` |
| /blog/salud/cuantas-calorias-necesito-al-dia | Por definir | ⬜ Pendiente | `src/content/blog/salud/cuantas-calorias-necesito-al-dia.md` |
| /blog/salud/cuantas-calorias-para-bajar-de-peso | Por definir | ⬜ Pendiente | `src/content/blog/salud/cuantas-calorias-para-bajar-de-peso.md` |
| /blog/salud/cuantas-calorias-para-subir-de-peso | Por definir | ⬜ Pendiente | `src/content/blog/salud/cuantas-calorias-para-subir-de-peso.md` |
| /blog/salud/cuanto-deberia-pesar-segun-estatura | Por definir | ⬜ Pendiente | `src/content/blog/salud/cuanto-deberia-pesar-segun-estatura.md` |
| /blog/salud/formula-imc-excel-google-sheets | Por definir | ⬜ Pendiente | `src/content/blog/salud/formula-imc-excel-google-sheets.md` |
| /blog/salud/formula-mifflin-st-jeor | Por definir | ⬜ Pendiente | `src/content/blog/salud/formula-mifflin-st-jeor.md` |
| /blog/salud/imc-18-20-22-25-27-30-35-40 | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-18-20-22-25-27-30-35-40.md` |
| /blog/salud/imc-30-o-mas-que-significa | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-30-o-mas-que-significa.md` |
| /blog/salud/imc-adultos-mayores | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-adultos-mayores.md` |
| /blog/salud/imc-embarazo | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-embarazo.md` |
| /blog/salud/imc-hombres-mujeres | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-hombres-mujeres.md` |
| /blog/salud/imc-masa-muscular-ejercicio | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-masa-muscular-ejercicio.md` |
| /blog/salud/imc-menor-a-16-que-significa | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-menor-a-16-que-significa.md` |
| /blog/salud/imc-ninos-adolescentes-percentiles | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-ninos-adolescentes-percentiles.md` |
| /blog/salud/imc-normal-rango-saludable-adultos | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-normal-rango-saludable-adultos.md` |
| /blog/salud/imc-vs-indice-cintura-altura | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-vs-indice-cintura-altura.md` |
| /blog/salud/imc-vs-porcentaje-grasa-corporal | Por definir | ⬜ Pendiente | `src/content/blog/salud/imc-vs-porcentaje-grasa-corporal.md` |
| /blog/salud/limitaciones-del-imc | Por definir | ⬜ Pendiente | `src/content/blog/salud/limitaciones-del-imc.md` |
| /blog/salud/obesidad-clase-1-2-3-imc | Por definir | ⬜ Pendiente | `src/content/blog/salud/obesidad-clase-1-2-3-imc.md` |
| /blog/salud/peso-ideal-vs-peso-saludable | Por definir | ⬜ Pendiente | `src/content/blog/salud/peso-ideal-vs-peso-saludable.md` |
| /blog/salud/peso-saludable-segun-estatura | Por definir | ⬜ Pendiente | `src/content/blog/salud/peso-saludable-segun-estatura.md` |
| /blog/salud/por-que-mi-peso-no-cambia-si-como-mi-tdee | Por definir | ⬜ Pendiente | `src/content/blog/salud/por-que-mi-peso-no-cambia-si-como-mi-tdee.md` |
| /blog/salud/que-es-el-imc-y-como-se-calcula | Por definir | ⬜ Pendiente | `src/content/blog/salud/que-es-el-imc-y-como-se-calcula.md` |
| /blog/salud/que-es-tdee-calorias-diarias | Por definir | ⬜ Pendiente | `src/content/blog/salud/que-es-tdee-calorias-diarias.md` |
| /blog/salud/sobrepeso-segun-imc-25-29-9 | Por definir | ⬜ Pendiente | `src/content/blog/salud/sobrepeso-segun-imc-25-29-9.md` |
| /blog/salud/tabla-imc-adultos-rangos-categorias | Por definir | ⬜ Pendiente | `src/content/blog/salud/tabla-imc-adultos-rangos-categorias.md` |
| /blog/salud/tdee-y-macros-como-se-relacionan | Por definir | ⬜ Pendiente | `src/content/blog/salud/tdee-y-macros-como-se-relacionan.md` |
| /blog/salud/tmb-vs-tdee-diferencias | Por definir | ⬜ Pendiente | `src/content/blog/salud/tmb-vs-tdee-diferencias.md` |

## 6. Superficies dinámicas y compartidas

| Superficie | Estado actual | Regla de seguimiento |
| --- | --- | --- |
| Paginación del blog ES | Paginación EN | ⬜ Pendiente | ``src/pages/blog/pagina/[page].astro` y variantes EN; cada página hereda el estado del hub y de sus artículos.` |
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
