# Especificación v1 - Calculadora de pace / ritmo de carrera

## Descripción general

Herramienta para calcular ritmo de carrera a partir de distancia y tiempo, o
para estimar tiempo final a partir de distancia y pace. Debe servir para running,
caminata deportiva, ciclismo recreativo y entrenamiento general.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular pace por kilómetro y por milla.
- Convertir entre pace, velocidad, distancia y tiempo.
- Mostrar splits útiles para distancias populares.
- Mantener una experiencia rápida para corredores.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Tres modos: `Calcular pace`, `Calcular tiempo`, `Calcular distancia`.
- Distancia en km, mi o distancia predefinida.
- Tiempo en horas, minutos y segundos.
- Pace en min/km o min/mi.
- Resultado con pace, velocidad y splits.
- Copiar resultado y limpiar formulario.

### Fase 2

- Tabla de splits por kilómetro o milla.
- Comparador de objetivo vs resultado.
- Historial en `sessionStorage`.
- Exportar plan de splits a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/salud/calculadora-de-pace-ritmo-de-carrera` |
| URL futura si existe Fitness | `/fitness/calculadora-de-pace-ritmo-de-carrera` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-pace-ritmo-de-carrera.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-pace-ritmo-de-carrera/runningPace.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-pace-ritmo-de-carrera/runningPace.test.ts` |
| Categoría inmediata | `salud` |
| Categoría futura opcional | `fitness` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Modo con control segmentado.
- Inputs de tiempo separados para evitar errores de formato.
- Resultado principal con pace y velocidad.
- Distancias rápidas como chips: 5K, 10K, medio maratón, maratón.
- No usar una tabla larga en el primer viewport.

---

## Flujo principal MVP

**Ejemplo:** Corrí `10 km` en `50 minutos`. ¿Cuál fue mi ritmo?

### Inputs por modo

| Modo | Campos requeridos |
|------|-------------------|
| Calcular pace | distancia, tiempo |
| Calcular tiempo | distancia, pace |
| Calcular distancia | tiempo, pace |

### Distancias rápidas

| Etiqueta | Distancia |
|----------|-----------|
| 5K | `5 km` |
| 10K | `10 km` |
| Medio maratón | `21.0975 km` |
| Maratón | `42.195 km` |

---

## Fórmulas

```text
pace_seg_por_km = tiempo_segundos / distancia_km
pace_seg_por_mi = tiempo_segundos / distancia_millas
velocidad_kmh = distancia_km / (tiempo_segundos / 3600)
velocidad_mph = distancia_millas / (tiempo_segundos / 3600)
```

Calcular tiempo:

```text
tiempo_segundos = pace_seg_por_unidad * distancia_en_unidad
```

Calcular distancia:

```text
distancia = tiempo_segundos / pace_seg_por_unidad
```

---

## Validaciones y estados

- Distancia debe ser mayor que cero.
- Tiempo debe ser mayor que cero.
- Pace debe ser mayor que cero.
- Distancias extremas pueden calcular, pero mostrar advertencia si superan `500 km`.
- Formatear pace como `mm:ss`.
- Conservar precisión interna para medio maratón y maratón.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de pace - Ritmo de carrera` |
| Meta description | `Calcula ritmo por kilómetro o milla, velocidad, tiempo final y splits para 5K, 10K, medio maratón y maratón.` |
| H1 | `Calculadora de pace` |
| Keyword principal | `calculadora pace` |
| Keywords secundarias | `ritmo de carrera`, `min por km`, `calculadora running` |

### FAQs sugeridas

- ¿Qué es pace en running?
- ¿Cómo convierto pace a velocidad?
- ¿Cuál es el pace para correr 10K en 50 minutos?
- ¿La calculadora funciona con millas?

---

## Pruebas sugeridas

- `10 km` en `50 min` produce `5:00 min/km`.
- `5:00 min/km` para `10 km` produce `50 min`.
- `60 min` a `6:00 min/km` produce `10 km`.
- Medio maratón conserva decimales.
- Conversión a min/mi es correcta.

