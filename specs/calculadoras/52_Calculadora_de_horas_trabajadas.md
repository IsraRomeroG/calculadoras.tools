# Especificación v1 - Calculadora de horas trabajadas

## Descripción general

Herramienta para sumar horas trabajadas a partir de entradas y salidas, descansos
y tarifa opcional. Debe servir para turnos, freelance por hora, hojas de tiempo y
revisión rápida de jornadas.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular horas trabajadas por día o por varios turnos.
- Restar descansos.
- Calcular pago estimado si se ingresa tarifa por hora.
- Soportar turnos que cruzan medianoche.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de turnos.
- Hora de entrada, hora de salida y descanso.
- Tarifa por hora opcional.
- Multiplicador de horas extra opcional.
- Resultado: horas totales, horas normales, horas extra y pago estimado.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Semana laboral configurable.
- Guardar plantilla en `localStorage`.
- Separar días de la semana.
- Exportar a hoja de cálculo.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/fecha-tiempo/calculadora-de-horas-trabajadas` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-de-horas-trabajadas.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-de-horas-trabajadas/workHours.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-de-horas-trabajadas/workHours.test.ts` |
| Categoría | `fecha-tiempo` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- En móvil, cada turno debe mostrarse como bloque editable.
- Botones claros para agregar, duplicar y eliminar turno.
- Resultado total visible antes del detalle por turno.
- Usar inputs `type="time"` cuando sea posible.
- Tabla de turnos con `overflow-x-auto` solo en desktop o resumen secundario.

---

## Flujo principal MVP

**Ejemplo:** Trabajo de `09:00` a `18:00` con `60` minutos de descanso. ¿Cuántas
horas trabajé?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Hora de entrada | Hora | hora válida | vacío |
| Hora de salida | Hora | hora válida | vacío |
| Descanso | Texto numérico | `0-720` minutos | `0` |
| Tarifa por hora | Texto numérico opcional | `>= 0` | vacío |
| Límite de horas normales | Texto numérico | `0-24` por día | `8` |
| Multiplicador horas extra | Texto numérico | `1-5` | `1.5` |

### Outputs principales

- Horas netas trabajadas.
- Horas normales.
- Horas extra.
- Pago normal.
- Pago extra.
- Total estimado.

---

## Fórmulas y algoritmo

Convertir hora a minutos desde inicio del día:

```text
entrada_min = hora_entrada * 60 + minuto_entrada
salida_min = hora_salida * 60 + minuto_salida
```

Si salida es menor o igual que entrada, asumir turno que cruza medianoche:

```text
duracion_bruta = salida_min - entrada_min
if duracion_bruta <= 0:
  duracion_bruta += 1440
```

Restar descanso:

```text
duracion_neta_min = max(0, duracion_bruta - descanso_min)
horas_netas = duracion_neta_min / 60
horas_normales = min(horas_netas, limite_horas_normales)
horas_extra = max(0, horas_netas - limite_horas_normales)
pago = horas_normales * tarifa + horas_extra * tarifa * multiplicador
```

---

## Validaciones y estados

- Entrada y salida son obligatorias por turno.
- Descanso no puede ser mayor que duración bruta.
- Si un turno supera `24 horas`, mostrar advertencia; el MVP no debe soportarlo.
- Tarifa vacía oculta cálculos de pago.
- Multiplicador debe ser al menos `1`.
- Redondear horas a 2 decimales y mostrar formato `h:mm` como apoyo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de horas trabajadas` |
| Meta description | `Suma horas trabajadas, resta descansos y estima pago por hora con turnos normales o que cruzan medianoche.` |
| H1 | `Calculadora de horas trabajadas` |
| Keyword principal | `calculadora horas trabajadas` |
| Keywords secundarias | `sumar horas laborales`, `calcular horas extra`, `horas de trabajo calculadora` |

### FAQs sugeridas

- ¿Cómo calculo horas si el turno cruza medianoche?
- ¿La calculadora resta descansos?
- ¿Puedo calcular pago por hora?
- ¿La calculadora aplica leyes laborales?

---

## Pruebas sugeridas

- `09:00-18:00` con `60 min` produce `8 horas`.
- `22:00-06:00` produce `8 horas`.
- Descanso mayor que duración muestra error.
- Tarifa vacía no calcula pago.
- Horas extra se calculan después del límite diario.

