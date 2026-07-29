# Spec de artículo: Tabla de kilómetros a millas para distancias comunes

## Archivo objetivo

- Ruta futura: `src/content/blog/conversores/tabla-kilometros-a-millas-distancias-comunes.md`
- URL pública: `/blog/conversores/tabla-kilometros-a-millas-distancias-comunes`
- Categoría: `conversores`
- Prioridad: P0
- Rol en el cluster: referencia escaneable para equivalencias frecuentes
- Calculadora primaria: `/conversores/kilometros-a-millas`

## Metadata sugerida

```yaml
title: "Tabla de kilómetros a millas: equivalencias de 1 a 100 km"
seoTitle: "Tabla de kilómetros a millas y millas a kilómetros"
description: "Consulta equivalencias frecuentes entre kilómetros y millas, incluidas distancias de carretera, 5K, 10K, medio maratón y maratón."
pubDate: 2026-XX-XX
categorySlug: "conversores"
tags:
  - tabla kilómetros a millas
  - equivalencias de distancia
  - conversiones frecuentes
readTime: "5 min"
relatedCalculator:
  label: "Convertir kilómetros a millas"
  href: "/conversores/kilometros-a-millas"
```

## Intención SEO

- Keyword principal: `tabla de kilómetros a millas`.
- Secundarias: `1 km a millas`, `10 km a millas`, `100 km a millas`, `tabla de
  millas a kilómetros`.
- Intención: consultar un valor rápidamente y comprobarlo con una herramienta.
- Fragmento objetivo: una tabla HTML con equivalencias aproximadas a dos
  decimales.

## Promesa y respuesta inicial

Presentar una tabla visible antes de la explicación. Indicar que los valores se
redondean a dos decimales y que la calculadora permite cambiar la precisión.

Tabla mínima de kilómetros a millas:

| Kilómetros | Millas aprox. |
| ---: | ---: |
| 1 | 0.62 |
| 2 | 1.24 |
| 5 | 3.11 |
| 10 | 6.21 |
| 15 | 9.32 |
| 20 | 12.43 |
| 30 | 18.64 |
| 42.195 | 26.22 |
| 50 | 31.07 |
| 100 | 62.14 |

Añadir una tabla inversa con 1, 2, 5, 10, 15, 20, 30, 50 y 100 millas, más
42.195 km como referencia especial de maratón.

## Estructura recomendada

1. `## Tabla de kilómetros a millas`
2. `## Tabla de millas a kilómetros`
3. `## Equivalencias de carrera`
4. `## Equivalencias de carretera`
5. `## Cómo se calculan estos valores`
6. `## Comprueba cualquier distancia`
7. `## Preguntas frecuentes`

## Requisitos de contenido

- Separar tablas de distancia general, carrera y carretera para facilitar la
  lectura móvil.
- Incluir 5K = 3.11 mi, 10K = 6.21 mi, medio maratón = 13.11 mi y maratón =
  26.22 mi.
- Indicar que 42.195 km es la distancia estándar del maratón; verificar la
  referencia con World Athletics.
- Mostrar una nota “aproximado” en los encabezados o en el texto introductorio.
- No generar una página independiente por cada valor de la tabla.
- La tabla debe aportar más cobertura y organización que la tabla breve ya
  presente en la calculadora; si no, convertirla en una sección del artículo
  pilar y no publicarla como URL independiente.

## Enlaces internos

- `/conversores/kilometros-a-millas` — CTA principal: “convertir otra distancia”.
- `/blog/conversores/como-convertir-kilometros-a-millas` — explicación del
  factor y del redondeo.
- `/blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla` — solo desde
  “equivalencias de carrera”.

## FAQ sugeridas

- ¿Cuántas millas son 5 kilómetros?
- ¿Cuántas millas son 10 kilómetros?
- ¿Cuántos kilómetros son 50 millas?
- ¿Cuántas millas tiene un maratón?
- ¿La tabla muestra valores exactos?

## Fuentes y notas

- Usar [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b9)
  para el factor exacto.
- Contrastar las equivalencias de carretera con la [tabla del Highway Code de
  GOV.UK](https://www.gov.uk/guidance/the-highway-code/other-information).
- Verificar 42.195 km con [World Athletics](https://worldathletics.org/disciplines/road-running-event/marathon).

## Criterios de aceptación

- Las dos direcciones de conversión tienen tablas propias.
- Se incluyen los valores de carrera obligatorios.
- Los valores coinciden con la calculadora a la precisión publicada.
- La tabla funciona como contenido HTML accesible, no como imagen.
- La pieza tiene un valor editorial adicional frente a la tabla de la página
  pilar.

