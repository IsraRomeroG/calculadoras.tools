# Especificación v1 - Calculadora de coste de datos móviles por GB

## Descripción general

Herramienta para calcular el costo efectivo por GB de un plan móvil, incluyendo
precio, datos incluidos, cargos adicionales y consumo real.

**Arquitectura:** todo el cálculo ocurre en el cliente. No consulta planes ni
tarifas de operadores y no requiere backend.

---

## Objetivo de producto

- Calcular costo nominal y efectivo por GB.
- Incluir cargos y datos adicionales.
- Manejar planes ilimitados mediante consumo real estimado.
- Comparar planes manualmente.
- Mostrar claramente periodo y unidades.

---

## Alcance recomendado

### MVP

- Precio del plan y datos incluidos.
- Cargos adicionales y GB extra.
- Consumo real opcional.
- Costo por GB incluido, disponible y usado.
- Comparador de dos escenarios.

### Fase 2

- Varios planes.
- Costo anual.
- Límites de velocidad y uso justo como notas.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/telecomunicaciones/calculadora-costo-datos-moviles-gb` |
| Archivo Astro recomendado | `src/pages/telecomunicaciones/calculadora-costo-datos-moviles-gb.astro` |
| Lógica de cálculo | `src/lib/calculators/telecomunicaciones/calculadora-costo-datos-moviles-gb/mobileDataCost.ts` |
| Pruebas unitarias | `src/lib/calculators/telecomunicaciones/calculadora-costo-datos-moviles-gb/mobileDataCost.test.ts` |
| Categoría | `telecomunicaciones` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar costo efectivo por GB arriba.
- Etiquetar si usa datos incluidos, disponibles o consumidos.
- Mostrar periodo y cargos considerados.
- No presentar un plan como ilimitado sin consumo usado para el cálculo.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio del plan | Texto numérico | `>= 0` | vacío |
| Datos incluidos | Texto numérico | `>= 0 GB` o ilimitado | vacío |
| Cargos adicionales | Texto numérico | `>= 0` | `0` |
| Datos adicionales | Texto numérico | `>= 0 GB` | `0` |
| Consumo real | Texto numérico opcional | `>= 0 GB` | vacío |
| Periodo | Selector | semanal, mensual, anual, personalizado | mensual |

### Outputs principales

- Costo total del periodo.
- Datos disponibles.
- Costo nominal por GB.
- Costo efectivo por GB usado.
- Datos no utilizados.
- Equivalente mensual y anual.

---

## Fórmulas

```text
costo_total = precio_plan + cargos_adicionales
datos_disponibles = datos_incluidos + datos_adicionales
costo_por_GB_disponible =
  datos_disponibles > 0 ? costo_total / datos_disponibles : null
costo_por_GB_usado = consumo_real > 0 ? costo_total / consumo_real : null
datos_no_usados = max(0, datos_disponibles - consumo_real)
```

Para planes ilimitados, calcular únicamente costo por GB usado cuando exista
consumo real.

---

## Validaciones y estados

- Costos y datos no pueden ser negativos.
- Consumo mayor a datos disponibles muestra advertencia, no error.
- Plan ilimitado requiere consumo real para costo por GB.
- Distinguir `GB` decimal de `GiB` si se habilita conversión.
- Comparaciones deben usar el mismo periodo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo de datos móviles por GB` |
| Meta description | `Calcula el costo efectivo por GB de un plan móvil según precio, datos incluidos, cargos y consumo real.` |
| H1 | `Calculadora de costo por GB móvil` |
| Keyword principal | `costo datos móviles por GB` |
| Keywords secundarias | `comparar planes móviles`, `precio por giga`, `costo internet móvil` |

---

## Pruebas sugeridas

- Plan `500` con `10 GB` produce `50` por GB disponible.
- Cargos adicionales aumentan el costo.
- Plan ilimitado sin consumo no produce costo por GB.
- Consumo real calcula costo efectivo.
- Periodos incompatibles muestran advertencia.

