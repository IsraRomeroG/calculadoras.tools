# Especificación v2 - Calculadora de horas de estudio necesarias

## Descripción general

Herramienta para estimar cuántas horas de estudio necesita una persona antes de
una fecha objetivo o cómo distribuir horas disponibles entre días. Debe ayudar a
planear exámenes, certificaciones, cursos y entregas académicas con un plan
semanal accionable, realista y fácil de ajustar desde móvil.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular horas diarias necesarias para completar una meta.
- Calcular fecha estimada si se estudia una cantidad fija por día.
- Considerar días concretos de estudio, no solo un número de días por semana.
- Calcular días efectivos de estudio de forma exacta.
- Mostrar un plan semanal simple con sesiones por día.
- Indicar si la carga de estudio parece sostenible, moderada, exigente o muy
  alta.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Horas por día` y `Fecha estimada`.
- Horas totales objetivo.
- Horas ya estudiadas como campo opcional.
- Fecha de inicio con valor por defecto `hoy`.
- Fecha límite u horas por día según modo.
- Selector de días de estudio: `L`, `M`, `X`, `J`, `V`, `S`, `D`.
- Duración de sesión sugerida.
- Resultado: horas por día, sesiones por día, carga estimada y plan semanal.
- Copiar resumen y limpiar formulario.

### Fase 2

- Varias materias con prioridades.
- Días bloqueados o fechas específicas sin estudio.
- Margen de repaso configurable antes del examen o entrega.
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
- Inputs mínimos en el primer viewport: horas objetivo, fecha/ritmo y días.
- Selector de días como control segmentado de una fila.
- Opciones secundarias en una sección plegable: horas ya estudiadas, duración
  de sesión y fecha de inicio.
- Mostrar plan semanal como lista compacta, no como tabla.
- Mostrar primero la recomendación accionable: horas, minutos y sesiones.
- Evitar calendarios complejos en el MVP.
- Integrar sugerencia de sesiones con Pomodoro sin forzarla.

---

## Flujo principal MVP

**Ejemplo:** Necesito estudiar `60` horas antes del `2026-08-15` y puedo estudiar
de lunes a viernes. ¿Cuántas horas por día necesito?

### Inputs del modo horas por día

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Horas totales objetivo | Texto numérico | `> 0` | vacío |
| Horas ya estudiadas | Texto numérico | `>= 0` y menor que horas objetivo | `0` |
| Fecha de inicio | Fecha | fecha válida | hoy |
| Fecha límite | Fecha | futura | vacío |
| Días de estudio | Selector de días | al menos 1 día | `L-V` |
| Duración de sesión | Texto numérico | `15-240 min` | `50` |

### Inputs del modo fecha estimada

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Horas totales objetivo | Texto numérico | `> 0` | vacío |
| Horas ya estudiadas | Texto numérico | `>= 0` y menor que horas objetivo | `0` |
| Horas por día | Texto numérico | `> 0` | vacío |
| Días de estudio | Selector de días | al menos 1 día | `L-V` |
| Fecha de inicio | Fecha | fecha válida | hoy |
| Duración de sesión | Texto numérico | `15-240 min` | `50` |

### Outputs principales

- Horas por día necesarias o fecha estimada.
- Días efectivos de estudio.
- Sesiones por día.
- Horas por semana.
- Carga estimada: sostenible, moderada, exigente o muy alta.
- Recomendación textual accionable.
- Plan semanal sugerido con días de estudio y descanso.

### Resultado recomendado

El resultado debe decir algo útil sin exigir interpretación adicional. Ejemplo:

```text
Necesitas estudiar 2 h 45 min por día.
Son 4 sesiones de 50 min en tus días seleccionados.
Carga moderada: parece razonable si mantienes descansos.
```

Si la carga es alta, sugerir una alternativa:

```text
Este plan requiere más de 8 h al día. Para bajarlo, aumenta días de estudio,
amplía la fecha límite o reduce las horas pendientes.
```

---

## Fórmulas y algoritmo

Definiciones:

```text
horas_pendientes = max(horas_totales - horas_ya_estudiadas, 0)
dias_seleccionados = conjunto de días de semana elegidos por el usuario
fecha_inicio = fecha elegida por el usuario, por defecto hoy
```

Para el MVP, la fecha límite se considera el último día disponible de estudio si
ese día coincide con un día seleccionado. En Fase 2 se puede añadir un margen de
repaso o una opción para excluir el día del examen/entrega.

Modo horas por día:

```text
dias_estudio_efectivos = contar_fechas(fecha_inicio, fecha_limite, dias_seleccionados)
horas_por_dia = horas_pendientes / dias_estudio_efectivos
sesiones_por_dia = ceil((horas_por_dia * 60) / duracion_sesion_min)
horas_por_semana = horas_por_dia * cantidad(dias_seleccionados)
```

Modo fecha estimada:

```text
dias_estudio_necesarios = ceil(horas_pendientes / horas_por_dia)
fecha_estimada = avanzar_fechas_de_estudio(fecha_inicio, dias_seleccionados, dias_estudio_necesarios)
sesiones_por_dia = ceil((horas_por_dia * 60) / duracion_sesion_min)
horas_por_semana = horas_por_dia * cantidad(dias_seleccionados)
```

Plan semanal:

```text
para cada día de L a D:
  si día está en dias_seleccionados:
    mostrar horas_por_dia y sesiones_por_dia
  si no:
    mostrar "Descanso"
```

Formato de tiempo:

```text
horas_decimales = 2.75
mostrar = "2 h 45 min"
```

---

## Validaciones y estados

- Fecha límite debe ser futura.
- Horas totales deben ser mayores que cero.
- Horas ya estudiadas no pueden ser negativas ni superar las horas objetivo.
- Debe seleccionarse al menos un día de estudio.
- Si quedan cero días efectivos, mostrar error.
- Redondear horas por día a 2 decimales para cálculo y mostrar también en
  formato `h min`.
- Si horas pendientes son `0`, mostrar estado completado.
- Si horas por día superan `8`, mostrar advertencia de carga muy alta.

### Niveles de carga

| Nivel | Condición | Mensaje sugerido |
|-------|-----------|------------------|
| Sostenible | `<= 2 h/día` | Ritmo ligero y fácil de mantener. |
| Moderada | `> 2` y `<= 4 h/día` | Ritmo razonable si mantienes constancia. |
| Exigente | `> 4` y `<= 8 h/día` | Requiere bloques largos y descansos. |
| Muy alta | `> 8 h/día` | Conviene cambiar fecha, días o meta. |

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de horas de estudio necesarias` |
| Meta description | `Calcula cuántas horas estudiar al día, cuántas sesiones hacer y cómo repartir tu plan semanal antes de una fecha límite.` |
| H1 | `Calculadora de horas de estudio` |
| Keyword principal | `calculadora horas de estudio` |
| Keywords secundarias | `plan de estudio`, `cuanto estudiar al dia`, `horas para examen`, `calcular tiempo de estudio` |

### FAQs sugeridas

- ¿Cuántas horas debo estudiar al día?
- ¿Cómo distribuir horas de estudio?
- ¿La calculadora considera descansos?
- ¿Puedo estudiar menos días por semana?
- ¿Cómo hago un plan de estudio antes de un examen?

---

## Pruebas sugeridas

- `60 horas`, inicio `2026-07-01`, límite `2026-07-30`, días `L-V`
  cuenta `22` días efectivos y produce cerca de `2.73 h/día`.
- `60 horas`, `10 horas ya estudiadas` usa `50 horas` como horas pendientes.
- Días `L-D` usa todos los días calendario dentro del rango.
- Fecha pasada muestra error.
- Horas por día altas muestran advertencia.
- Sesiones por día redondean hacia arriba.
- Si no hay días seleccionados, muestra error.
- Si horas ya estudiadas son iguales a horas objetivo, muestra estado completado.

