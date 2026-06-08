# Especificación v1 - Calculadora de LTV

## Descripción general

Herramienta para estimar el valor de vida del cliente con modelos de compras
recurrentes o suscripción, usando ingresos, margen, frecuencia y duración.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
datos históricos externos.

---

## Objetivo de producto

- Estimar LTV de ingresos y LTV con margen.
- Admitir modelos de e-commerce y suscripción.
- Mostrar claramente periodo y supuestos.
- Comparar LTV con CAC opcional.
- Evitar presentar la estimación como predicción garantizada.

---

## Alcance recomendado

### MVP

- Modos `Compras recurrentes` y `Suscripción`.
- Ticket promedio o ingreso medio por cliente.
- Frecuencia, vida media o churn.
- Margen bruto opcional.
- LTV y relación LTV:CAC.

### Fase 2

- LTV descontado.
- Cohortes.
- Retención variable.
- Comparador de escenarios.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/marketing/calculadora-ltv` |
| Archivo Astro recomendado | `src/pages/marketing/calculadora-ltv.astro` |
| Lógica de cálculo | `src/lib/calculators/marketing/calculadora-ltv/ltv.ts` |
| Pruebas unitarias | `src/lib/calculators/marketing/calculadora-ltv/ltv.test.ts` |
| Categoría | `marketing` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar LTV con margen como resultado principal cuando exista.
- Etiquetar periodo de frecuencia, vida media y churn.
- Alternar campos según modelo.
- Mostrar LTV:CAC solo si se captura CAC compatible.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modelo | Selector | compras recurrentes, suscripción | compras recurrentes |
| Ticket promedio / ARPU | Texto numérico | `>= 0` | vacío |
| Compras por periodo | Texto numérico | `>= 0` | vacío |
| Vida media en periodos | Texto numérico | `>= 0` | vacío |
| Churn por periodo | Texto numérico opcional | `> 0%-100%` | vacío |
| Margen bruto (%) | Texto numérico opcional | `0%-100%` | vacío |
| CAC opcional | Texto numérico | `>= 0` | vacío |

### Outputs principales

- LTV de ingresos.
- LTV con margen.
- Vida media estimada desde churn.
- Relación LTV:CAC.
- Resumen de supuestos y periodo.

---

## Fórmulas

Compras recurrentes:

```text
LTV_ingresos = ticket_promedio * compras_por_periodo * vida_media_periodos
```

Suscripción:

```text
vida_media_estimada = 1 / churn_decimal
LTV_ingresos = ARPU_por_periodo * vida_media_estimada
```

Resumen:

```text
LTV_margen = LTV_ingresos * margen_bruto
LTV_CAC = CAC > 0 ? LTV_margen_o_ingresos / CAC : null
```

---

## Validaciones y estados

- Importes, frecuencia y vida media no pueden ser negativos.
- Churn debe ser mayor que cero para derivar vida media.
- No mezclar churn mensual con ARPU anual.
- Margen debe estar entre `0%` y `100%`.
- Indicar si LTV:CAC usa LTV de ingresos o de margen.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de LTV` |
| Meta description | `Estima el valor de vida del cliente con compras recurrentes, suscripción, churn, margen y CAC opcional.` |
| H1 | `Calculadora de valor de vida del cliente` |
| Keyword principal | `calculadora LTV` |
| Keywords secundarias | `customer lifetime value`, `LTV CAC`, `valor cliente` |

---

## Pruebas sugeridas

- Ticket `100`, frecuencia `2` y vida `12` producen LTV `2400`.
- Churn mensual `5%` produce vida media simple de `20 meses`.
- Margen `50%` reduce LTV de ingresos a la mitad.
- Churn cero no permite derivar vida media.
- Periodos incompatibles muestran advertencia.

