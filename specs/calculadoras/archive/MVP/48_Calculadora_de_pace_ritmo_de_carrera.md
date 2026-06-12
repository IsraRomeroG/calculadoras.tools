# Especificación v2 - Calculadora de pace / ritmo de carrera

## Descripción general

Herramienta para analizar una carrera o caminata, planear un tiempo objetivo y
calcular la distancia recorrida a ritmo constante. A partir de dos variables
entre distancia, tiempo y ritmo, calcula la tercera y muestra equivalencias,
velocidad y un plan de pasos parciales o `splits`.

La calculadora está enfocada en running y caminata deportiva. No presenta sus
resultados como predicciones de rendimiento: las proyecciones suponen que la
persona mantiene exactamente el mismo ritmo durante toda la distancia.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Promesa de producto

> Calcula tu ritmo, tiempo o distancia y obtén un plan de paso para tu carrera.

La herramienta debe responder rápidamente preguntas como:

- Corrí `10 km` en `50:00`. ¿Cuál fue mi ritmo?
- Quiero terminar un medio maratón en `1:45:00`. ¿Qué ritmo necesito?
- Si corro durante `60 min` a `6:00 min/km`, ¿qué distancia completaré?
- ¿En qué tiempo debería pasar por cada kilómetro para cumplir mi objetivo?

---

## Objetivos de producto

- Calcular ritmo por kilómetro y por milla.
- Convertir entre ritmo, velocidad, distancia y tiempo.
- Ayudar a planear una carrera mediante splits acumulados.
- Mostrar tiempos equivalentes para distancias populares a ritmo constante.
- Diferenciar claramente una proyección matemática de una predicción deportiva.
- Mantener una experiencia rápida, accesible y mobile-first.
- Generar una página estática optimizada para SEO en Astro.

## Fuera de alcance

- Predecir el rendimiento en otra distancia según fatiga o condición física.
- Ajustar resultados por desnivel, clima, superficie, pausas o estrategia.
- Recomendar zonas de entrenamiento o intensidad.
- Sustituir una medición GPS o un plan de entrenamiento.
- Posicionar ciclismo como caso de uso principal.

Para estimar rendimiento entre distancias se debe enlazar a la calculadora de
predicción de tiempo de carrera, que utiliza una fórmula deportiva específica.

---

## Alcance recomendado

### MVP

- Tres modos orientados a la intención:
  - `Analizar carrera`: distancia + tiempo → ritmo.
  - `Planear objetivo`: distancia + tiempo objetivo → ritmo necesario.
  - `Calcular distancia`: tiempo + ritmo → distancia.
- Distancia personalizada en km o mi.
- Distancias rápidas: 1K, 5K, 10K, medio maratón y maratón.
- Tiempo en horas, minutos y segundos.
- Ritmo en min/km o min/mi.
- Resultado principal y conversiones secundarias.
- Equivalencias para distancias populares a ritmo constante.
- Splits acumulados con selector de intervalo.
- Copiar resultado y limpiar formulario.

### Fase 2

- Comparador de objetivo frente a resultado real.
- Estrategias de splits positivos, uniformes o negativos.
- Historial en `sessionStorage`.
- Exportar plan de splits a CSV.
- Compartir resultado mediante URL con parámetros.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canónica | `/salud/calculadora-de-pace-ritmo-de-carrera` |
| Archivo Astro | `src/pages/salud/calculadora-de-pace-ritmo-de-carrera.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-de-pace-ritmo-de-carrera/runningPace.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-de-pace-ritmo-de-carrera/runningPace.test.ts` |
| Categoría | `salud` |
| Locale base | `es-MX` |

La ruta se considera canónica desde el lanzamiento. Si cambia en el futuro, se
debe mover la página y crear una redirección Apache 301 desde la URL anterior.

---

## Experiencia mobile-first

### Orden del contenido

El primer viewport debe priorizar la tarea principal:

1. H1 y descripción de una línea.
2. Control segmentado para elegir modo.
3. Chips de distancias rápidas cuando el modo requiera distancia.
4. Campos requeridos para el modo activo.
5. Botón principal de ancho completo.
6. Resultado principal grande.
7. Conversiones secundarias compactas.

Después del resultado principal deben aparecer:

1. Equivalencias para distancias populares.
2. Plan de splits.
3. Explicación, fórmulas y FAQs.

### Reglas de interacción

- Mostrar únicamente los campos relevantes para el modo activo.
- Conservar valores compatibles al cambiar de modo o unidad.
- Usar etiquetas visibles; no depender de placeholders.
- Usar `inputmode="decimal"` para distancia y `inputmode="numeric"` para tiempo.
- Usar controles táctiles de al menos `44 × 44 px`.
- Mostrar errores junto al campo correspondiente.
- Anunciar el resultado mediante una región `aria-live`.
- Mantener el botón principal visible sin exigir desplazamiento innecesario.
- No mostrar una tabla larga en el primer viewport.
- En móvil, mostrar inicialmente hasta cinco splits y un botón `Ver todos`.
- Evitar tablas horizontales para equivalencias; usar tarjetas o filas apiladas.

---

## Flujo principal MVP

### Modos e inputs

| Modo | Pregunta principal | Campos requeridos | Resultado principal |
|------|--------------------|-------------------|---------------------|
| Analizar carrera | ¿A qué ritmo corrí? | distancia, tiempo | ritmo |
| Planear objetivo | ¿Qué ritmo necesito? | distancia, tiempo objetivo | ritmo necesario |
| Calcular distancia | ¿Qué distancia recorreré? | tiempo, ritmo | distancia |

Aunque `Analizar carrera` y `Planear objetivo` comparten fórmula, deben presentar
copys y resultados contextuales diferentes.

### Campos

| Campo | Tipo | Valores válidos | Valor inicial |
|-------|------|-----------------|---------------|
| Distancia | Texto numérico | `> 0` | vacío |
| Unidad de distancia | Selector | `km`, `mi` | `km` |
| Tiempo | Campos separados | horas `>= 0`, minutos y segundos `0-59` | vacío |
| Ritmo | Campos separados | minutos `>= 0`, segundos `0-59` | vacío |
| Unidad de ritmo | Selector | `min/km`, `min/mi` | `min/km` |
| Intervalo de splits | Selector | `1 km`, `5 km`, `1 mi` | `1 km` |

### Distancias rápidas

| Etiqueta | Distancia interna |
|----------|-------------------|
| 1K | `1 km` |
| 5K | `5 km` |
| 10K | `10 km` |
| Medio maratón | `21.0975 km` |
| Maratón | `42.195 km` |

Al seleccionar una distancia rápida, se debe actualizar el campo de distancia y
su unidad visible sin perder precisión interna.

---

## Resultados

### Resultado principal

El resultado principal depende del modo:

- `Analizar carrera`: `Tu ritmo fue 5:00 min/km`.
- `Planear objetivo`: `Necesitas mantener 4:59 min/km`.
- `Calcular distancia`: `Recorrerías 10.00 km`.

### Resultados secundarios

Mostrar siempre que sean calculables:

- Ritmo equivalente en la otra unidad.
- Velocidad en km/h y mph.
- Tiempo total.
- Distancia total.

Ejemplo para `10 km` en `50:00`:

```text
Ritmo: 5:00 min/km
Equivalente: 8:03 min/mi
Velocidad: 12.00 km/h · 7.46 mph
```

### Equivalencias a ritmo constante

Mostrar el tiempo que tomarían las distancias populares si se mantuviera el
mismo ritmo:

| Distancia | Resultado a `5:00 min/km` |
|-----------|----------------------------|
| 1K | `5:00` |
| 5K | `25:00` |
| 10K | `50:00` |
| Medio maratón | `1:45:29` |
| Maratón | `3:30:59` |

Incluir junto al bloque:

> Estas equivalencias suponen un ritmo constante. No predicen tu rendimiento en
> distancias más largas o cortas.

### Plan de splits

Los splits deben mostrar tiempo acumulado, no únicamente el tiempo del tramo.

Ejemplo para medio maratón a `5:00 min/km`, con intervalo de `5 km`:

| Distancia acumulada | Tiempo acumulado |
|---------------------|------------------|
| 5 km | `25:00` |
| 10 km | `50:00` |
| 15 km | `1:15:00` |
| 20 km | `1:40:00` |
| 21.0975 km | `1:45:29` |

- Incluir siempre el tramo parcial final.
- No duplicar la fila final si coincide exactamente con un intervalo.
- En móvil, renderizar los primeros cinco splits y permitir expandir el resto.

---

## Unidades, fórmulas y precisión

### Conversión base

Usar exactamente:

```text
1 mi = 1.609344 km
```

Normalizar internamente:

- Todas las distancias a kilómetros.
- Todos los tiempos y ritmos a segundos.

No redondear valores durante los cálculos. Redondear únicamente al formatear el
resultado visible.

### Fórmulas base

```text
distancia_mi = distancia_km / 1.609344

pace_seg_por_km = tiempo_segundos / distancia_km
pace_seg_por_mi = tiempo_segundos / distancia_mi

velocidad_kmh = distancia_km / (tiempo_segundos / 3600)
velocidad_mph = distancia_mi / (tiempo_segundos / 3600)
```

Calcular tiempo:

```text
tiempo_segundos = pace_seg_por_unidad * distancia_en_la_misma_unidad
```

Calcular distancia:

```text
distancia_en_unidad = tiempo_segundos / pace_seg_por_unidad
```

Generar split:

```text
tiempo_acumulado_split = pace_seg_por_km * distancia_acumulada_km
```

### Formato y redondeo

- Formatear ritmo redondeado al segundo más cercano como `m:ss`.
- Formatear tiempo menor de una hora como `m:ss`.
- Formatear tiempo igual o mayor de una hora como `h:mm:ss`.
- Acarrear correctamente segundos redondeados; nunca mostrar valores como `4:60`.
- Mostrar distancia con hasta cuatro decimales cuando sean significativos.
- Mostrar velocidad con dos decimales.
- Conservar precisión interna para todas las distancias y splits.

---

## Validaciones y estados

### Reglas de validación

- Distancia, tiempo y ritmo deben ser finitos y mayores que cero cuando apliquen.
- Minutos y segundos de los campos de tiempo deben ser enteros entre `0` y `59`.
- Los segundos del ritmo deben ser enteros entre `0` y `59`.
- El total combinado de un tiempo o ritmo no puede ser cero.
- Aceptar punto o coma como separador decimal en distancia.
- Rechazar valores no numéricos, infinitos o fuera de límites seguros.
- Permitir distancias de hasta `10,000 km`.
- Mostrar advertencia, sin bloquear el cálculo, si la distancia supera `500 km`.
- Bloquear cálculos cuyo tiempo total supere `10,000 horas`.
- No mostrar `NaN`, `Infinity` ni resultados parciales inválidos.

### Estados de interfaz

- Estado inicial con ejemplo breve, sin resultados inventados.
- Estado válido con resultado, equivalencias y splits.
- Estado inválido con mensajes específicos junto a los campos.
- Estado extremo válido con advertencia visible.
- Estado limpio después de usar `Limpiar`.

### Mensajes sugeridos

- `Ingresa una distancia mayor que cero.`
- `Ingresa al menos un minuto o segundo.`
- `Los segundos deben estar entre 0 y 59.`
- `La distancia es inusualmente larga; revisa que la unidad sea correcta.`

---

## Acciones

### Copiar resultado

El texto copiado debe incluir contexto y unidades. Ejemplo:

```text
10 km en 50:00
Ritmo: 5:00 min/km (8:03 min/mi)
Velocidad: 12.00 km/h
Calculado en calculadoras.tools
```

### Limpiar

- Restaurar el modo inicial `Analizar carrera`.
- Restaurar unidades a km y min/km.
- Vaciar campos, errores y resultados.
- Devolver el foco al primer campo editable.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de pace y ritmo de carrera` |
| Meta description | `Calcula tu ritmo por kilómetro o milla, tiempo, velocidad y splits para planear carreras de 5K, 10K, medio maratón o maratón.` |
| H1 | `Calculadora de pace y ritmo de carrera` |
| Keyword principal | `calculadora de pace` |
| Keywords secundarias | `ritmo de carrera`, `min por km`, `calculadora running`, `splits de carrera` |

### Contenido explicativo mínimo

- Qué significa pace o ritmo de carrera.
- Diferencia entre ritmo y velocidad.
- Cómo usar splits para planear una carrera.
- Diferencia entre equivalencia a ritmo constante y predicción de rendimiento.
- Enlace contextual a la calculadora de predicción de tiempo de carrera.

### FAQs sugeridas

- ¿Qué es pace en running?
- ¿Cómo convierto min/km a km/h?
- ¿Qué ritmo necesito para correr 10K en 50 minutos?
- ¿Cómo calculo mis splits para una carrera?
- ¿Por qué una equivalencia no es una predicción de carrera?
- ¿La calculadora funciona con millas?

---

## Analítica recomendada

Registrar únicamente eventos agregados y sin valores personales:

- Modo utilizado.
- Unidad seleccionada.
- Distancia rápida seleccionada.
- Uso de `Ver todos` en splits.
- Uso de copiar resultado.
- Enlace abierto hacia predicción de carrera.

---

## Pruebas sugeridas

### Cálculos base

- `10 km` en `50:00` produce `5:00 min/km`.
- `10 km` en `50:00` produce aproximadamente `8:03 min/mi`.
- `5:00 min/km` para `10 km` produce `50:00`.
- `60:00` a `6:00 min/km` produce `10 km`.
- Maratón a `5:00 min/km` produce `3:30:59`.
- Entradas equivalentes en km y mi producen el mismo resultado interno.

### Splits y equivalencias

- Medio maratón genera un tramo parcial final de `0.0975 km`.
- Una distancia exacta no duplica el split final.
- Los splits acumulados no pierden precisión por redondeo intermedio.
- Equivalencias populares usan ritmo constante, no fórmula de predicción.

### Formato y validación

- Un resultado de `4:59.6` se muestra como `5:00`, nunca como `4:60`.
- Distancia con coma decimal se interpreta correctamente.
- Minutos o segundos mayores de `59` muestran error.
- Tiempo o ritmo total igual a cero muestra error.
- Valores vacíos, no finitos y no numéricos no producen resultados visibles.
- Distancia superior a `500 km` calcula y muestra advertencia.
- Distancia superior al límite seguro bloquea el cálculo.

### Interacción y accesibilidad

- Cambiar de km a mi conserva el mismo valor físico.
- Cambiar de modo conserva valores compatibles.
- Seleccionar un preset actualiza distancia y unidad.
- El resultado se anuncia mediante `aria-live`.
- `Limpiar` restaura estado y foco.
- El texto copiado incluye contexto y unidades.
