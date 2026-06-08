# Especificación v1 - Calculadora de tiempo de vuelo estimado

## Descripción general

Herramienta para estimar duración de vuelo usando una distancia manual,
velocidad promedio, efecto del viento y tiempos adicionales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No calcula rutas reales,
distancias entre aeropuertos ni horarios y no requiere backend.

---

## Objetivo de producto

- Convertir distancia y velocidad en tiempo de vuelo.
- Incluir viento y tiempos de rodaje o aproximación.
- Admitir escalas manuales.
- Mostrar tiempo en formato legible.
- Explicar los supuestos del cálculo.

---

## Alcance recomendado

### MVP

- Distancia manual y unidad.
- Velocidad de crucero y unidad.
- Viento a favor o en contra.
- Tiempo adicional y escalas.
- Duración estimada total.

### Fase 2

- Varios tramos.
- Comparador de velocidades.
- Conversión entre unidades ampliada.
- Exportación de itinerario estimado.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/viajes/calculadora-tiempo-vuelo-estimado` |
| Archivo Astro recomendado | `src/pages/viajes/calculadora-tiempo-vuelo-estimado.astro` |
| Lógica de cálculo | `src/lib/calculators/viajes/calculadora-tiempo-vuelo-estimado/flightTime.ts` |
| Pruebas unitarias | `src/lib/calculators/viajes/calculadora-tiempo-vuelo-estimado/flightTime.test.ts` |
| Categoría | `viajes` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar duración total en horas y minutos.
- Separar tiempo en aire y tiempos adicionales.
- Mantener distancia y velocidad efectiva visibles.
- Mostrar aviso de que no representa un itinerario real.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Distancia | Texto numérico | `> 0` | vacío |
| Unidad de distancia | Selector | km, millas náuticas, millas | km |
| Velocidad de crucero | Texto numérico | `> 0` | vacío |
| Unidad de velocidad | Selector | km/h, nudos, mph | km/h |
| Viento neto | Texto numérico con signo | velocidad compatible | `0` |
| Tiempo adicional | Horas/minutos | `>= 0` | `30 min` |
| Escalas | Lista editable | duración `>= 0` | vacío |

### Outputs principales

- Velocidad efectiva sobre tierra.
- Tiempo estimado en aire.
- Tiempo adicional.
- Tiempo en escalas.
- Duración total estimada.

---

## Fórmulas

Normalizar distancia a kilómetros y velocidad a km/h:

```text
velocidad_tierra = velocidad_crucero + viento_neto
tiempo_aire_horas = distancia_km / velocidad_tierra_kmh
tiempo_total = tiempo_aire + tiempo_adicional + suma(escalas)
```

Un viento positivo representa viento a favor y uno negativo, viento en contra.

---

## Validaciones y estados

- Distancia y velocidad deben ser mayores que cero.
- Velocidad sobre tierra debe permanecer mayor que cero.
- Tiempos adicionales y escalas no pueden ser negativos.
- No inferir distancia, ruta, retrasos ni restricciones operativas.
- Mostrar resultado como estimación matemática.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de tiempo de vuelo estimado` |
| Meta description | `Estima la duración de un vuelo con distancia manual, velocidad, viento, tiempos adicionales y escalas.` |
| H1 | `Calculadora de tiempo de vuelo` |
| Keyword principal | `tiempo de vuelo estimado` |
| Keywords secundarias | `calcular duración vuelo`, `distancia velocidad vuelo`, `tiempo en aire` |

---

## Pruebas sugeridas

- `1000 km` a `500 km/h` producen `2 horas` en aire.
- Viento a favor reduce tiempo.
- Viento que anula velocidad muestra error.
- Escalas se suman al total.
- Conversión entre nudos y km/h es coherente.

