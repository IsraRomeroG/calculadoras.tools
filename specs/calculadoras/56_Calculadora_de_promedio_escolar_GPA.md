# Especificación v1 - Calculadora de promedio escolar / GPA

## Descripción general

Herramienta para calcular promedio escolar simple, promedio ponderado y GPA a
partir de materias, calificaciones y créditos. Debe ser flexible para escalas
comunes como 0-10, 0-100 y 0-4.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular promedio simple y ponderado.
- Calcular GPA aproximado en escala 4.0 con conversión configurable.
- Permitir materias con créditos o pesos.
- Mostrar estado de aprobación si hay nota mínima.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Lista editable de materias.
- Calificación por materia.
- Créditos/peso opcional.
- Escala de entrada: 0-10, 0-100, 0-4 o personalizada.
- Nota mínima aprobatoria opcional.
- Resultado: promedio, GPA aproximado, materias aprobadas/reprobadas.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Conversor avanzado entre escalas.
- Semestres guardados en `localStorage`.
- Comparador de escenarios.
- Importar CSV pegado desde hoja de cálculo.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-promedio-escolar-gpa` |
| URL futura si existe Educación | `/educacion/calculadora-promedio-escolar-gpa` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-promedio-escolar-gpa.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-promedio-escolar-gpa/gpa.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-promedio-escolar-gpa/gpa.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `educacion` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Cada materia debe editarse como bloque compacto en móvil.
- Resultado general visible antes de la tabla completa.
- Botones claros para agregar, duplicar y eliminar materia.
- No exigir créditos; si están vacíos, usar promedio simple.
- Mostrar conversión GPA como aproximada.

---

## Flujo principal MVP

**Ejemplo:** Tengo 5 materias con calificaciones y créditos distintos. ¿Cuál es
mi promedio ponderado y GPA aproximado?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Escala | Selector | `0-10`, `0-100`, `0-4`, `Personalizada` | `0-10` |
| Máximo personalizado | Texto numérico | `> 0` | vacío |
| Nota mínima aprobatoria | Texto numérico opcional | dentro de escala | vacío |
| Nombre de materia | Texto | 1-60 caracteres | `Materia 1` |
| Calificación | Texto numérico | dentro de escala | vacío |
| Créditos / peso | Texto numérico opcional | `> 0` | `1` |

### Outputs principales

- Promedio simple.
- Promedio ponderado.
- GPA aproximado 4.0.
- Créditos totales.
- Materias aprobadas/reprobadas si hay nota mínima.
- Mejor y peor materia.

---

## Fórmulas

Promedio simple:

```text
promedio_simple = suma(calificaciones) / cantidad_materias
```

Promedio ponderado:

```text
promedio_ponderado = suma(calificacion * creditos) / suma(creditos)
```

Conversión aproximada a GPA:

```text
calificacion_normalizada = promedio_ponderado / escala_maxima
gpa = calificacion_normalizada * 4
```

Limitar GPA entre `0` y `4`.

---

## Validaciones y estados

- Debe existir al menos una materia válida.
- Calificación debe estar dentro de la escala.
- Créditos deben ser mayores que cero si se capturan.
- Si todos los créditos están vacíos, usar `1` para cada materia.
- Nota mínima debe estar dentro de la escala.
- Redondear promedios a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de promedio escolar y GPA` |
| Meta description | `Calcula promedio simple, promedio ponderado y GPA aproximado con materias, calificaciones y créditos.` |
| H1 | `Calculadora de promedio escolar` |
| Keyword principal | `calculadora promedio escolar` |
| Keywords secundarias | `calculadora gpa`, `promedio ponderado`, `calcular promedio materias` |

### FAQs sugeridas

- ¿Cómo se calcula el promedio ponderado?
- ¿Qué son créditos o pesos?
- ¿La conversión a GPA es exacta?
- ¿Puedo usar escala de 0 a 100?

---

## Pruebas sugeridas

- Calificaciones `8, 9, 10` producen promedio simple `9`.
- Créditos ponderan correctamente el promedio.
- Escala 0-100 convierte GPA aproximado.
- Calificación fuera de escala muestra error.
- Créditos vacíos se tratan como `1`.

