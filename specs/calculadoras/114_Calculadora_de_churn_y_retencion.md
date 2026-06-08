# Especificación v1 - Calculadora de churn y retención

## Descripción general

Herramienta para calcular pérdida y retención de clientes o ingresos durante un
periodo, distinguiendo churn de clientes y churn de ingresos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
integración con sistemas de suscripción.

---

## Objetivo de producto

- Calcular churn y retención de clientes.
- Calcular churn de ingresos opcional.
- Separar clientes nuevos de la cohorte inicial.
- Estimar vida media simple desde churn.
- Hacer visible el periodo de análisis.

---

## Alcance recomendado

### MVP

- Clientes al inicio, nuevos, perdidos y al final.
- Ingreso recurrente inicial y perdido opcional.
- Churn y retención.
- Verificación de conciliación de clientes.
- Vida media simple estimada.

### Fase 2

- Churn neto de ingresos con expansión.
- Comparador de periodos.
- Cohortes.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/negocios/calculadora-churn-retencion` |
| Archivo Astro recomendado | `src/pages/negocios/calculadora-churn-retencion.astro` |
| Lógica de cálculo | `src/lib/calculators/negocios/calculadora-churn-retencion/churnRetention.ts` |
| Pruebas unitarias | `src/lib/calculators/negocios/calculadora-churn-retencion/churnRetention.test.ts` |
| Categoría | `negocios` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar churn y retención del periodo arriba.
- Etiquetar siempre si la métrica usa clientes o ingresos.
- Mostrar conciliación de clientes como comprobación.
- No extrapolar automáticamente churn de un periodo a otro.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Periodo | Selector/texto | periodo definido | mensual |
| Clientes al inicio | Texto numérico entero | `>= 0` | vacío |
| Clientes nuevos | Texto numérico entero | `>= 0` | `0` |
| Clientes perdidos | Texto numérico entero | `>= 0` | vacío |
| Clientes al final | Texto numérico entero opcional | `>= 0` | vacío |
| Ingreso recurrente inicial | Texto numérico opcional | `>= 0` | vacío |
| Ingreso recurrente perdido | Texto numérico opcional | `>= 0` | vacío |

### Outputs principales

- Churn de clientes.
- Retención de clientes.
- Clientes retenidos.
- Diferencia de conciliación.
- Churn de ingresos opcional.
- Vida media simple estimada.

---

## Fórmulas

```text
clientes_retenidos = clientes_inicio - clientes_perdidos
churn_clientes = clientes_inicio > 0 ? clientes_perdidos / clientes_inicio * 100 : null
retencion_clientes = clientes_inicio > 0 ? clientes_retenidos / clientes_inicio * 100 : null
final_esperado = clientes_inicio - clientes_perdidos + clientes_nuevos
diferencia_conciliacion = clientes_final - final_esperado
churn_ingresos = ingreso_inicial > 0 ? ingreso_perdido / ingreso_inicial * 100 : null
vida_media_simple = churn_decimal > 0 ? 1 / churn_decimal : null
```

---

## Validaciones y estados

- Valores no pueden ser negativos.
- Clientes perdidos no deben superar clientes iniciales.
- Clientes nuevos no se cuentan como retenidos.
- Churn más retención debe sumar `100%` solo bajo la misma cohorte y definición.
- Vida media simple debe etiquetarse como aproximación.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de churn y retención` |
| Meta description | `Calcula churn, retención, clientes retenidos y churn de ingresos durante un periodo definido.` |
| H1 | `Calculadora de churn y retención` |
| Keyword principal | `calculadora churn` |
| Keywords secundarias | `tasa de retención`, `customer churn`, `churn de ingresos` |

---

## Pruebas sugeridas

- `100` iniciales y `5` perdidos producen churn `5%` y retención `95%`.
- Clientes nuevos no alteran retención de la cohorte inicial.
- Final inconsistente muestra diferencia de conciliación.
- Churn cero oculta vida media simple.
- Clientes perdidos mayores al inicio muestran error.

