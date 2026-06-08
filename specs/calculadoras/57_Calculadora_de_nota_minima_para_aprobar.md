# Especificación v1 - Calculadora de nota mínima para aprobar

## Descripción general

Herramienta para calcular qué nota necesita un estudiante en un examen, proyecto
o evaluación final para alcanzar una calificación objetivo o aprobar el curso.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular nota mínima necesaria en la evaluación pendiente.
- Considerar calificación actual y peso restante.
- Indicar si el objetivo es alcanzable.
- Permitir escalas 0-10, 0-100 y personalizada.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Calificación actual.
- Peso ya evaluado o peso de la evaluación final.
- Calificación objetivo.
- Escala de calificación.
- Resultado: nota mínima necesaria y estado alcanzable/no alcanzable.
- Copiar resultado y limpiar formulario.

### Fase 2

- Varias evaluaciones pendientes.
- Tabla de escenarios.
- Historial en `sessionStorage`.
- Integración con calificación ponderada.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-nota-minima-para-aprobar` |
| URL futura si existe Educación | `/educacion/calculadora-nota-minima-para-aprobar` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-nota-minima-para-aprobar.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-nota-minima-para-aprobar/minimumGrade.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-nota-minima-para-aprobar/minimumGrade.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar resultado principal como "Necesitas X".
- Usar inputs de porcentaje con ayuda clara.
- Evitar tablas en el MVP.
- Mostrar estado alcanzable, imposible o ya asegurado sin depender solo del color.
- Permitir cambiar escala sin recargar.

---

## Flujo principal MVP

**Ejemplo:** Tengo `7.5` de promedio actual, eso vale `70%` del curso y necesito
`8.0` final. ¿Qué nota necesito en el examen final?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `Personalizada` | `0-10` |
| Máximo personalizado | Texto numérico | `> 0` | vacío |
| Calificación actual | Texto numérico | dentro de escala | vacío |
| Peso ya evaluado (%) | Texto numérico | `0-100` | `70` |
| Calificación objetivo | Texto numérico | dentro de escala | vacío |

### Outputs principales

- Nota mínima necesaria en lo restante.
- Peso restante.
- Estado: alcanzable, imposible, ya asegurado.
- Fórmula con sustitución.

---

## Fórmulas

```text
peso_actual = peso_evaluado / 100
peso_restante = 1 - peso_actual
nota_necesaria = (objetivo - calificacion_actual * peso_actual) / peso_restante
```

Estados:

```text
nota_necesaria <= 0 => ya asegurado
0 < nota_necesaria <= escala_maxima => alcanzable
nota_necesaria > escala_maxima => imposible con la escala actual
```

---

## Validaciones y estados

- Peso ya evaluado debe ser mayor que `0` y menor que `100`.
- Calificaciones deben estar dentro de la escala.
- Objetivo no puede superar el máximo de la escala.
- Si peso restante es cero, no calcular nota pendiente.
- Redondear nota necesaria a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de nota mínima para aprobar` |
| Meta description | `Calcula qué nota necesitas en el examen final o evaluación pendiente para aprobar o alcanzar tu objetivo.` |
| H1 | `Calculadora de nota mínima` |
| Keyword principal | `calculadora nota minima` |
| Keywords secundarias | `nota final para aprobar`, `calcular nota examen final`, `nota necesaria` |

### FAQs sugeridas

- ¿Cómo se calcula la nota mínima?
- ¿Qué pasa si el resultado supera la nota máxima?
- ¿Puedo usar escala de 0 a 100?
- ¿Sirve para varias evaluaciones pendientes?

---

## Pruebas sugeridas

- Actual `7.5`, peso `70%`, objetivo `8` produce `9.17`.
- Nota necesaria mayor al máximo marca imposible.
- Nota necesaria menor o igual a cero marca ya asegurado.
- Peso `100%` muestra error.
- Escala 0-100 funciona correctamente.

