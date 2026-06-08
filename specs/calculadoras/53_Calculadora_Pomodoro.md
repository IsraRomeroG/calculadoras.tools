# Especificación v1 - Calculadora Pomodoro

## Descripción general

Herramienta para planear sesiones Pomodoro y estimar cuánto tiempo total tomará
completar ciclos de trabajo, descansos cortos y descansos largos. Puede incluir
un temporizador básico en el navegador, pero el MVP debe priorizar el cálculo y
la planificación.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular duración total de una sesión Pomodoro.
- Estimar cuántos ciclos caben en un bloque de tiempo.
- Mostrar hora estimada de finalización.
- Ofrecer temporizador simple sin depender de backend.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Duración de foco.
- Descanso corto.
- Descanso largo.
- Número de pomodoros.
- Frecuencia de descanso largo.
- Hora de inicio opcional.
- Resultado: duración total, finalización y desglose.
- Copiar resumen y limpiar formulario.

### Fase 2

- Temporizador con pausa/reanudar.
- Sonido opcional local.
- Guardar presets en `localStorage`.
- Modo "tengo X horas, cuántos pomodoros caben".
- Estadísticas locales.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/fecha-tiempo/calculadora-pomodoro` |
| URL futura si existe Productividad | `/productividad/calculadora-pomodoro` |
| Archivo Astro recomendado | `src/pages/fecha-tiempo/calculadora-pomodoro.astro` |
| Lógica de cálculo | `src/lib/calculators/fecha-tiempo/calculadora-pomodoro/pomodoro.ts` |
| Pruebas unitarias | `src/lib/calculators/fecha-tiempo/calculadora-pomodoro/pomodoro.test.ts` |
| Categoría inmediata | `fecha-tiempo` |
| Categoría futura opcional | `productividad` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar total y hora de fin antes del desglose.
- Inputs numéricos compactos con valores por defecto.
- Temporizador, si se implementa, debe tener botones grandes de iniciar/pausar/reiniciar.
- No usar animaciones que distraigan del flujo.
- Evitar texto instructivo largo en la herramienta.

---

## Flujo principal MVP

**Ejemplo:** Quiero hacer `6` pomodoros de `25` minutos, descansos cortos de
`5` minutos y descanso largo de `20` minutos cada `4` pomodoros. ¿Cuánto tarda?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Pomodoros | Texto numérico | `1-50` | `4` |
| Minutos de foco | Texto numérico | `1-120` | `25` |
| Descanso corto | Texto numérico | `0-60` | `5` |
| Descanso largo | Texto numérico | `0-120` | `20` |
| Descanso largo cada | Texto numérico | `1-20` pomodoros | `4` |
| Hora de inicio | Hora opcional | hora válida | ahora |

### Outputs principales

- Tiempo total.
- Hora estimada de finalización.
- Tiempo de foco total.
- Tiempo de descanso total.
- Cantidad de descansos cortos y largos.
- Secuencia de bloques.

---

## Fórmulas y algoritmo

```text
foco_total = pomodoros * minutos_foco
descansos_largos = floor((pomodoros - 1) / frecuencia_descanso_largo)
descansos_cortos = max(0, pomodoros - 1 - descansos_largos)
descanso_total = descansos_cortos * descanso_corto + descansos_largos * descanso_largo
total_minutos = foco_total + descanso_total
```

Hora de fin:

```text
fin = inicio + total_minutos
```

La secuencia nunca debe agregar descanso después del último pomodoro.

---

## Validaciones y estados

- Pomodoros debe ser al menos `1`.
- Descansos pueden ser `0`.
- Si el total supera `12 horas`, mostrar advertencia de sesión larga.
- Frecuencia de descanso largo debe ser menor o igual al número de pomodoros, aunque valores mayores solo implican cero descansos largos.
- Temporizador debe usar `Date.now()` para evitar deriva excesiva.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora Pomodoro` |
| Meta description | `Planifica sesiones Pomodoro con foco, descansos cortos, descansos largos, duración total y hora de finalización.` |
| H1 | `Calculadora Pomodoro` |
| Keyword principal | `calculadora pomodoro` |
| Keywords secundarias | `temporizador pomodoro`, `tecnica pomodoro`, `cuantos pomodoros caben` |

### FAQs sugeridas

- ¿Cuánto dura un Pomodoro?
- ¿La calculadora incluye descansos largos?
- ¿Puedo cambiar la duración de foco?
- ¿Cuántos pomodoros caben en 2 horas?

---

## Pruebas sugeridas

- `4` pomodoros de `25`, descanso corto `5`, largo `20` cada `4` produce `115 min`.
- No se agrega descanso después del último pomodoro.
- `1` pomodoro produce solo tiempo de foco.
- Descanso largo cada `2` calcula descansos largos correctamente.
- Hora de fin suma minutos cruzando medianoche.

