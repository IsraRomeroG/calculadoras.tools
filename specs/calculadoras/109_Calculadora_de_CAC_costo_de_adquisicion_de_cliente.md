# Especificación v1 - Calculadora de CAC

## Descripción general

Herramienta para calcular el costo de adquisición de cliente a partir de gastos
de marketing y ventas y nuevos clientes adquiridos en el mismo periodo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
integraciones con CRM o plataformas publicitarias.

---

## Objetivo de producto

- Calcular CAC total y por canal.
- Separar costos de marketing y ventas.
- Evitar comparar periodos incompatibles.
- Planificar presupuesto o clientes necesarios.
- Permitir comparar CAC con LTV capturado manualmente.

---

## Alcance recomendado

### MVP

- Periodo de análisis visible.
- Lista editable de costos.
- Nuevos clientes adquiridos.
- CAC combinado.
- LTV opcional y relación LTV:CAC.
- Modos inversos de presupuesto y objetivo.

### Fase 2

- CAC por canal.
- CAC pagado y orgánico.
- Comparador entre periodos.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/marketing/calculadora-cac` |
| Archivo Astro recomendado | `src/pages/marketing/calculadora-cac.astro` |
| Lógica de cálculo | `src/lib/calculators/marketing/calculadora-cac/cac.ts` |
| Pruebas unitarias | `src/lib/calculators/marketing/calculadora-cac/cac.test.ts` |
| Categoría | `marketing` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar CAC como resultado principal.
- Mantener periodo y clientes adquiridos visibles.
- Costos como lista editable por categoría.
- Etiquetar LTV:CAC como comparación opcional.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Periodo | Texto / selector | periodo definido | mensual |
| Nombre del costo | Texto | 1-80 caracteres | `Publicidad` |
| Categoría del costo | Selector | marketing, ventas, herramientas, otro | marketing |
| Importe | Texto numérico | `>= 0` | vacío |
| Nuevos clientes | Texto numérico entero | `>= 0` | vacío |
| LTV opcional | Texto numérico | `>= 0` | vacío |
| CAC objetivo opcional | Texto numérico | `> 0` | vacío |

### Outputs principales

- Costos totales de adquisición.
- CAC.
- Desglose de costos.
- Relación LTV:CAC opcional.
- Clientes necesarios para CAC objetivo.

---

## Fórmulas

```text
costos_adquisicion = suma(costos_marketing + ventas + herramientas + otros)
CAC = nuevos_clientes > 0 ? costos_adquisicion / nuevos_clientes : null
LTV_CAC = CAC > 0 ? LTV / CAC : null
clientes_necesarios = ceil(costos_adquisicion / CAC_objetivo)
```

---

## Validaciones y estados

- Costos y clientes no pueden ser negativos.
- Cero clientes muestra CAC no disponible.
- Todos los costos y clientes deben pertenecer al mismo periodo.
- No presentar LTV:CAC si las definiciones o moneda no son compatibles.
- Aclarar qué costos se incluyeron en el resultado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de CAC` |
| Meta description | `Calcula el costo de adquisición de cliente con gastos de marketing, ventas y nuevos clientes del mismo periodo.` |
| H1 | `Calculadora de costo de adquisición de cliente` |
| Keyword principal | `calculadora CAC` |
| Keywords secundarias | `costo adquisición cliente`, `LTV CAC`, `CAC marketing` |

---

## Pruebas sugeridas

- Costos `10000` y `100` clientes producen CAC `100`.
- Cero clientes muestra CAC no disponible.
- Varios costos se suman correctamente.
- LTV `300` y CAC `100` producen relación `3`.
- Clientes necesarios se redondean hacia arriba.

