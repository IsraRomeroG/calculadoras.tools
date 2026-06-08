# Especificación v1 - Calculadora de predicción de tiempo de carrera

## Descripción general

Herramienta para estimar el tiempo probable en una distancia objetivo a partir
de una marca reciente en otra distancia. Debe servir para 5K, 10K, medio maratón,
maratón y distancias personalizadas usando una fórmula de rendimiento.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Predecir tiempo de carrera para una distancia objetivo.
- Calcular pace objetivo por kilómetro y milla.
- Comparar distancias populares.
- Comunicar que la predicción depende de entrenamiento, terreno, clima y fatiga.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Distancia de referencia.
- Tiempo de referencia.
- Distancia objetivo.
- Fórmula Riegel por defecto.
- Resultado: tiempo previsto, pace, velocidad y diferencia contra referencia.
- Tabla de predicciones para 5K, 10K, medio maratón y maratón.
- Copiar resultado y limpiar formulario.

### Fase 2

- Exponente Riegel editable.
- Ajuste por desnivel o temperatura como dato manual.
- Integración con calculadora de pace.
- Historial en `sessionStorage`.
- Exportar predicciones a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/salud/calculadora-prediccion-tiempo-carrera` |
| URL futura si existe Fitness | `/fitness/calculadora-prediccion-tiempo-carrera` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-prediccion-tiempo-carrera.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-prediccion-tiempo-carrera/racePrediction.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-prediccion-tiempo-carrera/racePrediction.test.ts` |
| Categoría inmediata | `salud` |
| Categoría futura opcional | `fitness` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Distancias frecuentes como chips.
- Inputs de tiempo separados por horas, minutos y segundos.
- Resultado principal con tiempo previsto y pace.
- Tabla de predicciones como bloque secundario con `overflow-x-auto`.
- No presentar la predicción como garantía.

---

## Flujo principal MVP

**Ejemplo:** Corrí `10 km` en `50:00`. ¿Qué tiempo podría hacer en medio
maratón?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Distancia de referencia | Texto numérico o preset | `> 0` | `10K` |
| Tiempo de referencia | Tiempo | `> 0` | vacío |
| Distancia objetivo | Texto numérico o preset | `> 0` | `Medio maratón` |
| Unidad | Selector | `km`, `mi` | `km` |

### Distancias rápidas

| Etiqueta | Distancia |
|----------|-----------|
| 5K | `5 km` |
| 10K | `10 km` |
| Medio maratón | `21.0975 km` |
| Maratón | `42.195 km` |

---

## Fórmulas

Fórmula Riegel:

```text
tiempo_objetivo = tiempo_referencia * (distancia_objetivo / distancia_referencia) ^ 1.06
```

Pace objetivo:

```text
pace_seg_por_km = tiempo_objetivo_segundos / distancia_objetivo_km
pace_seg_por_mi = tiempo_objetivo_segundos / distancia_objetivo_mi
```

Velocidad:

```text
velocidad_kmh = distancia_objetivo_km / (tiempo_objetivo_segundos / 3600)
```

---

## Validaciones y estados

- Distancia de referencia y objetivo deben ser mayores que cero.
- Tiempo de referencia debe ser mayor que cero.
- Si distancia objetivo es más de 5 veces la referencia, mostrar advertencia de baja precisión.
- Si la referencia es muy antigua, permitir cálculo pero explicar limitación.
- Formatear tiempo como `h:mm:ss` o `mm:ss` según duración.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de predicción de tiempo de carrera` |
| Meta description | `Predice tu tiempo para 5K, 10K, medio maratón o maratón a partir de una marca reciente usando la fórmula Riegel.` |
| H1 | `Calculadora de predicción de carrera` |
| Keyword principal | `calculadora prediccion carrera` |
| Keywords secundarias | `prediccion tiempo running`, `riegel calculator`, `tiempo medio maraton desde 10k` |

### FAQs sugeridas

- ¿Qué es la fórmula Riegel?
- ¿Qué tan precisa es la predicción?
- ¿Puedo predecir maratón desde un 5K?
- ¿La calculadora considera clima o desnivel?

---

## Pruebas sugeridas

- `10 km` en `50:00` predice medio maratón alrededor de `1:53:12`.
- Misma distancia de referencia y objetivo devuelve el mismo tiempo.
- Distancia objetivo muy grande muestra advertencia.
- Pace se calcula con precisión para medio maratón.
- Conversión km/mi conserva resultados equivalentes.

