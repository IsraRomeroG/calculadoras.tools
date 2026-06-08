# Especificación v1 - Calculadora de calorías quemadas por ejercicio

## Descripción general

Herramienta para estimar calorías quemadas durante una actividad física usando
peso, duración y METs. Debe presentar el resultado como aproximación, porque el
gasto real depende de intensidad, técnica, condición física y mediciones
individuales.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. La lista de actividades se define con
datos locales.

---

## Objetivo de producto

- Estimar calorías quemadas por actividad y duración.
- Permitir elegir actividad desde una lista local o ingresar MET manual.
- Mostrar calorías por minuto y por sesión.
- Comparar intensidad baja, media y alta cuando aplique.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Peso.
- Actividad con MET predefinido.
- MET manual opcional.
- Duración en minutos.
- Resultado: calorías estimadas, kcal/min y equivalencia por hora.
- Copiar resultado y limpiar formulario.
- Aviso de estimación visible.

### Fase 2

- Lista ampliada de actividades.
- Entrenamiento por intervalos con varias actividades.
- Historial en `sessionStorage`.
- Exportar sesión a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/salud/calculadora-calorias-quemadas-ejercicio` |
| URL futura si existe Fitness | `/fitness/calculadora-calorias-quemadas-ejercicio` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-calorias-quemadas-ejercicio.astro` |
| Lógica de cálculo | `src/lib/calculators/salud/calculadora-calorias-quemadas-ejercicio/exerciseCalories.ts` |
| Pruebas unitarias | `src/lib/calculators/salud/calculadora-calorias-quemadas-ejercicio/exerciseCalories.test.ts` |
| Categoría inmediata | `salud` |
| Categoría futura opcional | `fitness` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Inputs principales visibles sin tabla extensa.
- Selector de actividad con búsqueda simple si la lista crece.
- Resultado principal en kcal por sesión.
- Tabla de actividades frecuentes como bloque secundario.
- No presentar las calorías como exactas.

---

## Flujo principal MVP

**Ejemplo:** Peso `70 kg`, corro a intensidad moderada durante `30 minutos`.
¿Cuántas calorías quemé aproximadamente?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Peso | Texto numérico | `20-250 kg` | vacío |
| Unidad de peso | Selector | `kg`, `lb` | `kg` |
| Actividad | Selector | lista local | `Caminar` |
| MET manual | Texto numérico opcional | `1-25` | vacío |
| Duración | Texto numérico | `1-1440 min` | `30` |

### Actividades iniciales sugeridas

| Actividad | MET |
|-----------|-----|
| Caminar suave | `2.8` |
| Caminar rápido | `4.3` |
| Correr moderado | `9.8` |
| Bicicleta moderada | `7.5` |
| Natación moderada | `5.8` |
| Entrenamiento de fuerza general | `3.5` |
| Yoga | `2.5` |

---

## Fórmulas

```text
kcal = MET * 3.5 * peso_kg / 200 * minutos
kcal_por_minuto = kcal / minutos
kcal_por_hora = kcal_por_minuto * 60
```

Si el usuario ingresa MET manual, usar ese valor sobre el MET de la actividad.

---

## Validaciones y estados

- Peso debe estar entre `20` y `250 kg`.
- Duración debe estar entre `1` y `1440 minutos`.
- MET debe estar entre `1` y `25`.
- Mostrar advertencia si duración supera `240 minutos`.
- Redondear kcal al entero más cercano.
- No usar para estimar déficit calórico clínico.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de calorías quemadas por ejercicio` |
| Meta description | `Estima calorías quemadas por actividad física usando peso, duración y METs. Incluye kcal por sesión, minuto y hora.` |
| H1 | `Calculadora de calorías quemadas` |
| Keyword principal | `calculadora calorias quemadas ejercicio` |
| Keywords secundarias | `calorias por actividad`, `MET ejercicio`, `calorias quemadas correr caminar` |

### FAQs sugeridas

- ¿Qué es un MET?
- ¿Por qué mi reloj da otro resultado?
- ¿Las calorías quemadas son exactas?
- ¿Puedo ingresar un MET manual?

---

## Referencias sugeridas

- CDC: recursos de actividad física e intensidad.
- Compendio de actividades físicas para valores MET si se documenta editorialmente.

---

## Pruebas sugeridas

- `70 kg`, MET `10`, `30 min` produce `367.5 kcal`.
- `154 lb` se convierte a `69.85 kg`.
- MET manual reemplaza actividad.
- Duración `0` muestra error.
- Kcal por hora se calcula desde kcal por minuto.

