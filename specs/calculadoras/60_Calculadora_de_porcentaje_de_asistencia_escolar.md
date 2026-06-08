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
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Total de clases realizadas.
- Clases asistidas o faltas.
- Mínimo de asistencia requerido.
- Clases restantes opcionales.
- Resultado: porcentaje actual, estado y faltas disponibles.
- Copiar resumen y limpiar formulario.

### Fase 2

- Varias materias.
- Calendario simple de faltas.
- Historial en `sessionStorage`.
- Exportar resumen a CSV.

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

- Resultado principal como porcentaje actual y estado.
- Inputs alternativos: capturar asistencias o faltas.
- Mostrar faltas disponibles como resultado destacado.
- Evitar tablas en el primer viewport.
- No usar lenguaje punitivo; mantener tono práctico.

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
- Faltas máximas permitidas con clases actuales.
- Faltas disponibles considerando clases restantes.
- Clases consecutivas necesarias para recuperar el mínimo.

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
faltas_disponibles = faltas_maximas_final - faltas_actuales
```

Clases seguidas necesarias para recuperar:

```text
buscar n mínimo donde:
(asistidas + n) / (total_realizadas + n) >= minimo
```

Limitar búsqueda a `1000` clases en MVP.

---

## Validaciones y estados

- Total de clases debe ser mayor que cero.
- Asistidas y faltas no pueden superar el total.
- Mínimo debe estar entre `0` y `100`.
- Si faltas disponibles es negativo, mostrar cuántas faltas exceden el límite.
- Si el mínimo ya se cumple, clases necesarias para recuperar es `0`.
- Redondear porcentaje a 2 decimales.

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

---

## Pruebas sugeridas

- Total `40`, asistidas `34` produce `85%`.
- Modo faltas calcula asistidas correctamente.
- Mínimo `80%` y total final `50` requiere `40` asistencias.
- Faltas disponibles negativas muestran excedente.
- Recuperación por clases seguidas converge o muestra advertencia.

