# Especificación v1 - Calculadora de horas de estudio necesarias

## Descripción general

Herramienta para estimar cuántas horas de estudio necesita una persona antes de
una fecha objetivo o cómo distribuir horas disponibles entre días. Debe ayudar a
planear exámenes, certificaciones, cursos y entregas académicas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular horas diarias necesarias para completar una meta.
- Calcular fecha estimada si se estudia una cantidad fija por día.
- Considerar días disponibles por semana.
- Mostrar plan semanal simple.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Horas por día` y `Fecha estimada`.
- Horas totales objetivo.
- Fecha límite o horas por día según modo.
- Días de estudio por semana.
- Duración de sesión sugerida.
- Resultado: horas por día, sesiones por día y plan semanal.
- Copiar resumen y limpiar formulario.

### Fase 2

- Varias materias con prioridades.
- Días bloqueados.
- Plan exportable a CSV.
- Historial en `sessionStorage`.
- Integración con Pomodoro.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-horas-de-estudio` |
| URL futura si existe Educación | `/educacion/calculadora-horas-de-estudio` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-horas-de-estudio.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-horas-de-estudio/studyHours.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-horas-de-estudio/studyHours.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal como horas por día o fecha estimada.
- Inputs mínimos en el primer viewport.
- Mostrar plan semanal como lista compacta.
- Evitar calendarios complejos en el MVP.
- Integrar sugerencia de sesiones con Pomodoro sin forzarla.

---

## Flujo principal MVP

**Ejemplo:** Necesito estudiar `60` horas antes del `2026-08-15` y puedo estudiar
`5` días por semana. ¿Cuántas horas por día necesito?

### Inputs del modo horas por día

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Horas totales objetivo | Texto numérico | `> 0` | vacío |
| Fecha límite | Fecha | futura | vacío |
| Días de estudio por semana | Texto numérico | `1-7` | `5` |
| Duración de sesión | Texto numérico | `15-240 min` | `50` |

### Inputs del modo fecha estimada

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Horas totales objetivo | Texto numérico | `> 0` | vacío |
| Horas por día | Texto numérico | `> 0` | vacío |
| Días de estudio por semana | Texto numérico | `1-7` | `5` |
| Fecha de inicio | Fecha | fecha válida | hoy |

### Outputs principales

- Horas por día necesarias o fecha estimada.
- Días efectivos de estudio.
- Sesiones por día.
- Horas por semana.
- Plan semanal sugerido.

---

## Fórmulas y algoritmo

Modo horas por día:

```text
dias_calendario = diferencia_en_dias(fecha_inicio, fecha_limite)
semanas = dias_calendario / 7
dias_estudio_estimados = semanas * dias_estudio_por_semana
horas_por_dia = horas_totales / dias_estudio_estimados
sesiones_por_dia = ceil((horas_por_dia * 60) / duracion_sesion_min)
```

Modo fecha estimada:

```text
dias_estudio_necesarios = ceil(horas_totales / horas_por_dia)
semanas_necesarias = dias_estudio_necesarios / dias_estudio_por_semana
dias_calendario_estimados = ceil(semanas_necesarias * 7)
fecha_estimada = fecha_inicio + dias_calendario_estimados
```

---

## Validaciones y estados

- Fecha límite debe ser futura.
- Horas totales deben ser mayores que cero.
- Días de estudio por semana entre `1` y `7`.
- Si horas por día superan `8`, mostrar advertencia de carga alta.
- Si quedan cero días efectivos, mostrar error.
- Redondear horas por día a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de horas de estudio necesarias` |
| Meta description | `Calcula cuántas horas estudiar al día para llegar a una fecha límite o cuándo terminarás con tus horas disponibles.` |
| H1 | `Calculadora de horas de estudio` |
| Keyword principal | `calculadora horas de estudio` |
| Keywords secundarias | `plan de estudio`, `cuanto estudiar al dia`, `horas para examen` |

### FAQs sugeridas

- ¿Cuántas horas debo estudiar al día?
- ¿Cómo distribuir horas de estudio?
- ¿La calculadora considera descansos?
- ¿Puedo estudiar menos días por semana?

---

## Pruebas sugeridas

- `60 horas`, `30 días`, `5 días/semana` produce cerca de `2.8 h/día`.
- Días por semana `7` usa todos los días.
- Fecha pasada muestra error.
- Horas por día altas muestran advertencia.
- Sesiones por día redondean hacia arriba.

