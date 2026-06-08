# Especificación v1 - Calculadora de capacidad de compra de vivienda

## Descripción general

Herramienta para estimar el precio máximo de vivienda que una persona podría
considerar según ingreso, deudas, enganche, tasa, plazo y porcentaje máximo de
pago mensual. No debe presentarse como aprobación crediticia.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar pago hipotecario mensual disponible.
- Calcular monto aproximado de préstamo.
- Calcular precio estimado de vivienda con enganche.
- Considerar deudas mensuales y costos de vivienda.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Ingreso mensual bruto.
- Deudas mensuales.
- Ratio máximo de deuda/ingreso editable.
- Enganche disponible.
- Tasa anual y plazo.
- Costos mensuales adicionales editables.
- Resultado: pago disponible, préstamo y precio máximo estimado.
- Copiar resultado y limpiar formulario.
- Aviso financiero visible.

### Fase 2

- Modo con porcentaje de enganche.
- Comparador de tasas/plazos.
- Costos de cierre.
- Historial en `sessionStorage`.
- Enlace a hipoteca.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-capacidad-compra-vivienda` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-capacidad-compra-vivienda.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-capacidad-compra-vivienda/homeAffordability.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-capacidad-compra-vivienda/homeAffordability.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Resultado principal como precio máximo estimado.
- Mostrar pago mensual disponible y préstamo debajo.
- Agrupar costos adicionales en bloque secundario.
- No usar lenguaje de aprobación o elegibilidad garantizada.
- Enlazar a calculadora de hipoteca como herramienta relacionada.

---

## Flujo principal MVP

**Ejemplo:** Ingreso bruto mensual `$60,000`, deudas `$5,000`, ratio máximo `35%`,
enganche `$500,000`, tasa `10%` y plazo `20 años`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ingreso mensual bruto | Texto numérico | `> 0` | vacío |
| Deudas mensuales | Texto numérico | `>= 0` | `0` |
| Ratio máximo deuda/ingreso (%) | Texto numérico | `1%-100%` | `35` |
| Enganche disponible | Texto numérico | `>= 0` | `0` |
| Tasa anual (%) | Texto numérico | `0%-100%` | vacío |
| Plazo | Texto numérico | `1-40 años` | `20` |
| Costos mensuales adicionales | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Pago hipotecario mensual disponible.
- Monto aproximado de préstamo.
- Precio máximo estimado.
- Ratio actual de deudas.
- Ingreso restante después de obligaciones.

---

## Fórmulas

Pago mensual disponible:

```text
limite_obligaciones = ingreso_mensual * (ratio_maximo / 100)
pago_vivienda_total = max(0, limite_obligaciones - deudas_mensuales)
pago_hipoteca = max(0, pago_vivienda_total - costos_mensuales_adicionales)
```

Monto de préstamo desde cuota:

```text
r = tasa_anual / 12 / 100
n = plazo_años * 12
prestamo = pago_hipoteca * ((1 + r)^n - 1) / (r * (1 + r)^n)
```

Si tasa es cero:

```text
prestamo = pago_hipoteca * n
```

Precio máximo:

```text
precio_maximo = prestamo + enganche
```

---

## Validaciones y estados

- Ingreso debe ser mayor que cero.
- Deudas y costos no pueden ser negativos.
- Si deudas superan límite, pago disponible es cero.
- Ratio máximo debe estar entre 1% y 100%.
- Mostrar advertencia si ratio supera 50%.
- Resultado es estimación, no aprobación bancaria.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de capacidad de compra de vivienda` |
| Meta description | `Estima cuánto podrías destinar a una vivienda según ingreso, deudas, enganche, tasa y plazo hipotecario.` |
| H1 | `Calculadora de capacidad de compra de vivienda` |
| Keyword principal | `cuanto puedo pagar por una casa` |
| Keywords secundarias | `capacidad compra vivienda`, `hipoteca segun ingreso`, `precio maximo casa` |

### FAQs sugeridas

- ¿Cómo se calcula cuánto puedo pagar por una casa?
- ¿Qué es el ratio deuda/ingreso?
- ¿La calculadora garantiza aprobación?
- ¿Debo incluir seguros e impuestos?

---

## Pruebas sugeridas

- Deudas mayores al límite producen pago disponible cero.
- Tasa cero calcula préstamo como cuota por meses.
- Enganche se suma al préstamo.
- Costos mensuales adicionales reducen cuota disponible.
- Ratio alto muestra advertencia.

