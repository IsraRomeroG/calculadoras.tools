# Especificación v1 - Calculadora de calificación ponderada

## Descripción general

Herramienta para calcular una calificación final a partir de actividades,
exámenes, tareas o proyectos con diferentes pesos. Debe ser clara para sistemas
de evaluación por porcentajes.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular calificación ponderada con varias evaluaciones.
- Validar que los pesos sumen 100% o mostrar pendiente.
- Permitir escalas comunes y personalizada.
- Mostrar contribución de cada evaluación.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de evaluaciones.
- Nombre, calificación y peso.
- Escala 0-10, 0-100 o personalizada.
- Resultado: calificación ponderada, peso usado, peso pendiente.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Evaluaciones pendientes con nota estimada.
- Escenarios alternativos.
- Historial en `sessionStorage`.
- Importar desde texto o CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-calificacion-ponderada` |
| URL futura si existe Educación | `/educacion/calculadora-calificacion-ponderada` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-calificacion-ponderada.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-calificacion-ponderada/weightedGrade.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-calificacion-ponderada/weightedGrade.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Cada evaluación debe editarse como bloque en móvil.
- Mostrar calificación final y peso pendiente arriba.
- Botones de agregar, duplicar y eliminar evaluación.
- Si los pesos no suman 100%, mostrar advertencia clara.
- Evitar depender solo del color para pesos incompletos.

---

## Flujo principal MVP

**Ejemplo:** Tareas `30%` con `9`, examen `40%` con `8` y proyecto `30%` con
`10`. ¿Cuál es la calificación final?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `Personalizada` | `0-10` |
| Máximo personalizado | Texto numérico | `> 0` | vacío |
| Nombre de evaluación | Texto | 1-60 caracteres | `Evaluación 1` |
| Calificación | Texto numérico | dentro de escala | vacío |
| Peso (%) | Texto numérico | `0-100` | vacío |

### Outputs principales

- Calificación ponderada.
- Peso total usado.
- Peso pendiente o excedente.
- Contribución por evaluación.
- Estado de pesos.

---

## Fórmulas

```text
contribucion = calificacion * (peso / 100)
calificacion_ponderada = suma(contribucion)
peso_total = suma(peso)
```

Si el peso total no es 100%, mostrar resultado parcial y opcionalmente una
calificación normalizada:

```text
calificacion_normalizada = suma(calificacion * peso) / suma(peso)
```

---

## Validaciones y estados

- Debe existir al menos una evaluación válida.
- Calificación debe estar dentro de escala.
- Peso no puede ser negativo.
- Si peso total supera 100%, mostrar advertencia de excedente.
- Si peso total es menor a 100%, mostrar peso pendiente.
- Redondear a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de calificación ponderada` |
| Meta description | `Calcula tu calificación final con actividades, exámenes y proyectos de distinto peso porcentual.` |
| H1 | `Calculadora de calificación ponderada` |
| Keyword principal | `calculadora calificacion ponderada` |
| Keywords secundarias | `promedio ponderado notas`, `calificacion final`, `peso de evaluaciones` |

### FAQs sugeridas

- ¿Qué significa calificación ponderada?
- ¿Los pesos deben sumar 100%?
- ¿Qué pasa si tengo evaluaciones pendientes?
- ¿Puedo usar escala de 0 a 100?

---

## Pruebas sugeridas

- `9*30% + 8*40% + 10*30%` produce `8.9`.
- Peso total `80%` muestra pendiente `20%`.
- Peso total `120%` muestra excedente.
- Calificación fuera de escala muestra error.
- Normalización se calcula si se decide mostrarla.

