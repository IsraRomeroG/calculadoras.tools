# Spec de artículo: Ritmo por kilómetro vs. ritmo por milla

## Archivo objetivo

- Ruta futura: `src/content/blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla.md`
- URL pública: `/blog/conversores/ritmo-por-kilometro-vs-ritmo-por-milla`
- Categoría: `conversores`
- Prioridad: P1
- Rol en el cluster: caso de uso deportivo y puente hacia la calculadora de pace
- Calculadora primaria: `/salud/calculadora-de-pace-ritmo-de-carrera`
- Calculadora secundaria: `/conversores/kilometros-a-millas`

## Metadata sugerida

```yaml
title: "Ritmo por kilómetro y por milla: cómo convertirlos"
seoTitle: "Ritmo por km a ritmo por milla: fórmula y tabla para correr"
description: "Convierte tu ritmo de carrera entre minutos por kilómetro y minutos por milla con ejemplos, tabla y calculadora de pace."
pubDate: 2026-XX-XX
categorySlug: "conversores"
tags:
  - ritmo por kilómetro
  - ritmo por milla
  - pace de carrera
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de pace y ritmo de carrera"
  href: "/salud/calculadora-de-pace-ritmo-de-carrera"
```

## Intención SEO

- Keyword principal: `ritmo por km a ritmo por milla`.
- Secundarias: `pace por milla`, `convertir min/km a min/milla`, `tabla de ritmo
  km milla`.
- Intención: traducir un ritmo de entrenamiento o competición sin confundirlo
  con una conversión simple de distancia.
- Fragmento objetivo: `ritmo min/mi = ritmo min/km × 1.609344`.

## Promesa y respuesta inicial

Explicar que primero se convierte el tiempo a minutos decimales y después se
aplica el factor de distancia:

```txt
ritmo en min/mi = ritmo en min/km * 1.609344
ritmo en min/km = ritmo en min/mi / 1.609344
```

Ejemplos obligatorios:

- `5:00 min/km ≈ 8:03 min/mi`.
- `6:00 min/km ≈ 9:39 min/mi`.
- `8:00 min/mi ≈ 4:58 min/km`.

Explicar cómo convertir `5:30` a `5.5` minutos antes de multiplicar y cómo
volver a expresar la fracción como segundos.

## Estructura recomendada

1. `## Cómo convertir min/km a min/mi`
2. `## Cómo convertir min/mi a min/km`
3. `## Ejemplos paso a paso`
4. `## Tabla breve de ritmos equivalentes`
5. `## Ritmos para 5K, 10K, medio maratón y maratón`
6. `## Ritmo convertido no significa rendimiento idéntico`
7. `## Calcula tu pace`
8. `## Preguntas frecuentes`

## Requisitos de contenido

- Tabla de referencia desde `4:00` hasta `8:00 min/km`, en intervalos de 30
  segundos, con conversión a min/mi redondeada al segundo.
- Explicar diferencia entre ritmo (`min/km`) y velocidad (`km/h`).
- Incluir ejemplos para carreras de 5K, 10K, medio maratón y maratón, sin
  presentar un ritmo como recomendación individual.
- Aclarar que la conversión traduce unidades, no compensa desnivel, viento,
  superficie, fatiga o estrategia de carrera.
- El CTA principal debe apuntar a la calculadora de pace; la calculadora de
  kilómetros a millas debe quedar como apoyo para la distancia.

## Enlaces internos

- `/salud/calculadora-de-pace-ritmo-de-carrera` — CTA principal: “calcular mi
  ritmo de carrera”.
- `/conversores/kilometros-a-millas` — conversión de distancia.
- `/blog/conversores/tabla-kilometros-a-millas-distancias-comunes` — referencias
  de distancia de carreras.
- `/blog/conversores/como-convertir-kilometros-a-millas` — solo para explicar el
  factor de distancia, no como CTA principal.

## FAQ sugeridas

- ¿Cómo paso de min/km a min/milla?
- ¿Por qué el ritmo por milla tiene un número mayor?
- ¿5:00 min/km son exactamente 8:00 min/milla?
- ¿Ritmo y velocidad son lo mismo?
- ¿La conversión predice mi tiempo de carrera?

## Fuentes y notas

- Usar [NIST](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b9)
  para el factor de distancia.
- Verificar la distancia oficial del maratón con [World Athletics](https://worldathletics.org/disciplines/road-running-event/marathon).
- No hacer afirmaciones de entrenamiento médico ni promesas de rendimiento.

## Criterios de aceptación

- Se convierte correctamente el formato `mm:ss` mediante minutos decimales.
- La tabla redondea a segundos y explica ese redondeo.
- Se distingue pace, distancia y velocidad.
- La calculadora de pace recibe el CTA principal.
- El artículo no compite por la keyword genérica “kilómetros a millas”.

