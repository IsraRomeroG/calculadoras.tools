# Especificación v1 - Calculadora de ROAS

## Descripción general

Herramienta para calcular el retorno sobre gasto publicitario mediante ingresos
atribuidos y gasto en anuncios, con análisis opcional de margen.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
conexiones con plataformas publicitarias.

---

## Objetivo de producto

- Calcular ROAS como razón y porcentaje.
- Diferenciar ROAS de ROI y rentabilidad.
- Estimar beneficio después del gasto publicitario.
- Calcular ROAS de equilibrio con margen manual.
- Planificar ingresos necesarios para una meta.

---

## Alcance recomendado

### MVP

- Gasto publicitario e ingresos atribuidos.
- Margen bruto opcional.
- ROAS, ingresos por unidad gastada y beneficio estimado.
- ROAS de equilibrio.
- Modo de planificación por ROAS objetivo.

### Fase 2

- Comparador de campañas.
- Costos adicionales de campaña.
- Atribución ajustable.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/marketing/calculadora-roas` |
| Archivo Astro recomendado | `src/pages/marketing/calculadora-roas.astro` |
| Lógica de cálculo | `src/lib/calculators/marketing/calculadora-roas/roas.ts` |
| Pruebas unitarias | `src/lib/calculators/marketing/calculadora-roas/roas.test.ts` |
| Categoría | `marketing` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar ROAS como razón y porcentaje.
- Mantener gasto e ingresos atribuidos junto al resultado.
- Separar ROAS de beneficio y ROI.
- Ocultar métricas de margen cuando no se capture.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Gasto publicitario | Texto numérico | `> 0` | vacío |
| Ingresos atribuidos | Texto numérico | `>= 0` | vacío |
| Margen bruto (%) | Texto numérico opcional | `0%-100%` | vacío |
| ROAS objetivo | Texto numérico opcional | `>= 0` | vacío |

### Outputs principales

- ROAS como `x`.
- ROAS porcentual.
- Ingresos por unidad monetaria gastada.
- Beneficio después de publicidad, si hay margen.
- ROAS de equilibrio.
- Ingresos necesarios para ROAS objetivo.

---

## Fórmulas

```text
ROAS_x = ingresos_atribuidos / gasto_publicitario
ROAS_porcentaje = ROAS_x * 100
beneficio_despues_ads = ingresos_atribuidos * margen_bruto - gasto_publicitario
ROAS_equilibrio = margen_bruto > 0 ? 1 / margen_bruto : null
ingresos_objetivo = gasto_publicitario * ROAS_objetivo
```

---

## Validaciones y estados

- Gasto publicitario debe ser mayor que cero.
- Ingresos no pueden ser negativos.
- Margen debe estar entre `0%` y `100%`.
- No calcular ROAS de equilibrio con margen cero.
- Aclarar que atribución y costos no incluidos pueden cambiar rentabilidad.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ROAS` |
| Meta description | `Calcula ROAS, ingresos por gasto publicitario y ROAS de equilibrio con margen bruto opcional.` |
| H1 | `Calculadora de ROAS` |
| Keyword principal | `calculadora ROAS` |
| Keywords secundarias | `retorno gasto publicitario`, `ROAS objetivo`, `ROAS de equilibrio` |

---

## Pruebas sugeridas

- Gasto `1000` e ingresos `5000` producen ROAS `5x`.
- ROAS `5x` equivale a `500%`.
- Margen `25%` produce ROAS de equilibrio `4x`.
- Gasto cero muestra error.
- Meta de `3x` calcula ingresos necesarios.

