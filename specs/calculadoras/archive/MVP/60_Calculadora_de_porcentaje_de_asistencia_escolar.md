# Especificación v1 - Calculadora de porcentaje de asistencia escolar

## Descripción general

Herramienta para calcular porcentaje de asistencia escolar y estimar cuántas
faltas puede tener un estudiante antes de bajar de un mínimo requerido. Debe ser
útil para cursos, materias, talleres y programas con requisito de asistencia.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular porcentaje de asistencia con clases asistidas y faltas.
- Estimar faltas permitidas con un mínimo requerido.
- Calcular cuántas clases seguidas debe asistir para recuperar porcentaje.
- Soportar clases futuras restantes.
- Convertir el resultado en una recomendación accionable para el estudiante.
- Indicar si todavía es posible cumplir el mínimo al final del curso.
- Mostrar cuántas clases debe asistir de las clases restantes.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Total de clases realizadas.
- Clases asistidas o faltas.
- Mínimo de asistencia requerido.
- Clases restantes opcionales.
- Resultado: porcentaje actual, estado, faltas disponibles y acción recomendada.
- Estado de viabilidad al final del curso.
- Clases mínimas a asistir de las clases restantes.
- Margen frente al mínimo requerido en puntos porcentuales.
- Copiar resumen y limpiar formulario.

### Fase 2

- Varias materias.
- Calendario simple de faltas.
- Historial en `sessionStorage`.
- Exportar resumen a CSV.
- Opciones avanzadas para políticas escolares: faltas justificadas, retardos y reglas de redondeo.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-porcentaje-asistencia-escolar` |
| URL futura si existe Educación | `/educacion/calculadora-porcentaje-asistencia-escolar` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Resultado principal como recomendación accionable.
- Porcentaje actual y estado como apoyo visual inmediato.
- Inputs alternativos: capturar asistencias o faltas.
- Mostrar faltas disponibles como resultado destacado.
- Mostrar "debes asistir X de Y clases restantes" cuando aplique.
- Mostrar si el objetivo aún es posible, imposible o ya está cumplido.
- Usar selector segmentado para alternar entre `Asistidas` y `Faltas`.
- Evitar tablas en el primer viewport.
- No usar lenguaje punitivo; mantener tono práctico.
- Priorizar una lectura rápida en una sola columna: formulario, resultado principal,
  resumen y detalles secundarios.

### Jerarquía visual recomendada en mobile

1. Resultado accionable: "Puedes faltar X clases más", "Asiste a las próximas
   X clases" o "Ya no es posible llegar al mínimo con las clases restantes".
2. Porcentaje actual y estado frente al mínimo.
3. Faltas acumuladas, faltas máximas al final del curso y faltas disponibles.
4. Clases que debe asistir de las restantes.
5. Detalles y explicación del cálculo.

---

## Flujo principal MVP

**Ejemplo:** El curso lleva `40` clases, asistí a `34` y necesito mínimo `80%`.
¿Cuántas faltas puedo tener?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Total de clases realizadas | Texto numérico | `1-1000` | vacío |
| Modo de captura | Selector | `Asistidas`, `Faltas` | `Asistidas` |
| Clases asistidas | Texto numérico | `0-total` | vacío |
| Faltas | Texto numérico | `0-total` | vacío |
| Mínimo requerido (%) | Texto numérico | `0-100` | `80` |
| Clases restantes | Texto numérico opcional | `0-1000` | `0` |

### Outputs principales

- Porcentaje de asistencia actual.
- Estado: cumple/no cumple mínimo actual.
- Acción recomendada en lenguaje natural.
- Margen frente al mínimo en puntos porcentuales.
- Faltas acumuladas.
- Faltas máximas permitidas al final del curso.
- Faltas disponibles considerando clases restantes.
- Clases mínimas que debe asistir de las clases restantes.
- Clases consecutivas necesarias para recuperar el mínimo.
- Estado de viabilidad:
  - `cumple`: ya cumple el mínimo actual.
  - `recuperable`: no cumple ahora, pero puede cumplir con clases restantes.
  - `imposible`: no puede llegar al mínimo aunque asista a todas las clases restantes.

### Microcopy recomendada para resultados

- Si cumple y tiene margen: `Puedes faltar {faltas_disponibles} clases más y seguir cumpliendo el {minimo}% requerido.`
- Si cumple sin margen: `Cumples el mínimo, pero no tienes faltas disponibles.`
- Si no cumple y es recuperable: `Necesitas asistir al menos {asistir_restantes} de las {clases_restantes} clases restantes.`
- Si no cumple y no es recuperable: `Aunque asistas a todas las clases restantes, llegarías a {porcentaje_maximo_posible}%.`
- Si no hay clases restantes y no cumple: `Con las clases registradas estás por debajo del mínimo requerido.`

---

## Fórmulas

Asistencia actual:

```text
asistidas = modo_asistidas ? input_asistidas : total_realizadas - faltas
faltas = total_realizadas - asistidas
porcentaje_actual = (asistidas / total_realizadas) * 100
```

Faltas máximas permitidas:

```text
minimo = minimo_requerido / 100
total_final = total_realizadas + clases_restantes
asistencias_minimas_final = ceil(total_final * minimo)
faltas_maximas_final = total_final - asistencias_minimas_final
faltas_actuales = faltas
faltas_disponibles = faltas_maximas_final - faltas_actuales
```

Margen frente al mínimo:

```text
margen_puntos = porcentaje_actual - minimo_requerido
```

Asistencias necesarias de las clases restantes:

```text
asistencias_necesarias_final = max(0, asistencias_minimas_final - asistidas)
asistir_restantes = min(asistencias_necesarias_final, clases_restantes)
es_posible_final = asistencias_necesarias_final <= clases_restantes
```

Porcentaje máximo posible:

```text
porcentaje_maximo_posible = ((asistidas + clases_restantes) / total_final) * 100
```

Clases seguidas necesarias para recuperar:

```text
buscar n mínimo donde:
(asistidas + n) / (total_realizadas + n) >= minimo
```

Limitar búsqueda a `1000` clases en MVP.

Casos especiales:

- Si `minimo_requerido = 0`, siempre cumple y no requiere clases para recuperar.
- Si `minimo_requerido = 100` y ya existen faltas, no puede recuperar el 100%
  con clases futuras; solo puede acercarse.
- Si `clases_restantes = 0`, la viabilidad final es igual al estado actual.

---

## Validaciones y estados

- Total de clases debe ser mayor que cero.
- Asistidas y faltas no pueden superar el total.
- Mínimo debe estar entre `0` y `100`.
- Si faltas disponibles es negativo, mostrar cuántas faltas exceden el límite.
- Si el mínimo ya se cumple, clases necesarias para recuperar es `0`.
- Si el objetivo es imposible con las clases restantes, mostrar el porcentaje
  máximo posible y evitar sugerir clases necesarias como si bastaran.
- Si `asistir_restantes` es mayor que `clases_restantes`, marcar como imposible.
- Si `faltas_disponibles` es `0`, indicar que no hay margen para faltar más.
- Si hay faltas disponibles positivas, redondearlas como entero hacia abajo.
- Redondear porcentaje a 2 decimales.

### Etiquetas recomendadas para evitar confusión

- `Faltas acumuladas`: faltas que ya tiene el estudiante.
- `Faltas máximas al final`: faltas totales permitidas considerando el curso completo.
- `Faltas disponibles`: faltas adicionales que todavía puede tener.
- `Clases restantes`: clases futuras que aún no se han realizado.
- `Clases necesarias`: clases restantes que debe asistir para cumplir el mínimo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de porcentaje de asistencia escolar` |
| Meta description | `Calcula tu porcentaje de asistencia, faltas disponibles y clases necesarias para cumplir un mínimo requerido.` |
| H1 | `Calculadora de asistencia escolar` |
| Keyword principal | `calculadora asistencia escolar` |
| Keywords secundarias | `porcentaje de asistencia`, `faltas permitidas`, `calcular asistencia clases` |

### FAQs sugeridas

- ¿Cómo se calcula el porcentaje de asistencia?
- ¿Cuántas faltas puedo tener?
- ¿Qué pasa si estoy por debajo del mínimo?
- ¿Puedo considerar clases restantes?
- ¿Qué significa que ya no sea posible llegar al mínimo?
- ¿Las faltas justificadas cuentan para el porcentaje?

---

## Pruebas sugeridas

- Total `40`, asistidas `34` produce `85%`.
- Modo faltas calcula asistidas correctamente.
- Mínimo `80%` y total final `50` requiere `40` asistencias.
- Faltas disponibles negativas muestran excedente.
- Recuperación por clases seguidas converge o muestra advertencia.
- Si el alumno puede recuperarse, muestra cuántas clases debe asistir de las restantes.
- Si el alumno no puede recuperarse, muestra porcentaje máximo posible.
- Mínimo `100%` con faltas existentes se marca como imposible de recuperar.
- Mínimo `0%` siempre cumple.

