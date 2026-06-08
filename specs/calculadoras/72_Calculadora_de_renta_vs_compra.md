# Especificación v1 - Calculadora de renta vs compra

## Descripción general

Herramienta para comparar el costo financiero estimado de rentar una vivienda
frente a comprarla durante un periodo definido. Debe usar supuestos editables y
presentar el resultado como escenario, no como recomendación financiera.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Comparar costo acumulado de renta y compra.
- Considerar hipoteca, enganche, costos de compra, mantenimiento y plusvalía.
- Considerar aumento anual de renta y rendimiento alternativo del enganche.
- Mostrar año aproximado de equilibrio.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Renta mensual y aumento anual.
- Precio de vivienda, enganche, tasa y plazo.
- Costos de compra/venta editables.
- Mantenimiento e impuestos anuales editables.
- Plusvalía y rendimiento alternativo manuales.
- Comparación anual y punto de equilibrio.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Inflación y seguros separados.
- Pagos extra a hipoteca.
- Comparador de escenarios.
- Historial en `sessionStorage`.
- Gráfica de patrimonio neto.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-renta-vs-compra` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-renta-vs-compra.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-renta-vs-compra/rentVsBuy.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-renta-vs-compra/rentVsBuy.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Separar inputs en bloques `Rentar`, `Comprar` y `Supuestos`.
- Resultado comparativo visible antes de tabla anual.
- Mostrar la opción de menor costo estimado sin presentarla como recomendación.
- Tabla anual con `overflow-x-auto`.
- Mantener los supuestos editables y visibles en el resumen.

---

## Flujo principal MVP

**Ejemplo:** Comparar renta de `$18,000` mensuales contra comprar una vivienda de
`$3,500,000` durante `10 años`.

### Inputs principales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Renta mensual | Texto numérico | `> 0` | vacío |
| Aumento anual de renta (%) | Texto numérico | `0%-50%` | `4` |
| Precio de vivienda | Texto numérico | `> 0` | vacío |
| Enganche (%) | Texto numérico | `0%-100%` | `20` |
| Tasa hipotecaria anual (%) | Texto numérico | `0%-100%` | vacío |
| Plazo hipotecario | Texto numérico | `1-40 años` | `20` |
| Horizonte de comparación | Texto numérico | `1-40 años` | `10` |
| Costos de compra (%) | Texto numérico | `0%-30%` | `5` |
| Costos de venta (%) | Texto numérico | `0%-20%` | `5` |
| Mantenimiento anual (%) | Texto numérico | `0%-20%` | `1` |
| Plusvalía anual (%) | Texto numérico | `-20%-50%` | `3` |
| Rendimiento alternativo (%) | Texto numérico | `0%-100%` | `5` |

### Outputs principales

- Costo neto estimado de rentar.
- Costo neto estimado de comprar.
- Patrimonio acumulado por compra.
- Diferencia entre escenarios.
- Año estimado de equilibrio.
- Tabla anual.

---

## Fórmulas y algoritmo

Hipoteca con cuota fija:

```text
prestamo = precio - enganche
tasa_mensual = tasa_anual / 12 / 100
n = plazo_años * 12
cuota = prestamo * (tasa_mensual * (1+tasa_mensual)^n) / ((1+tasa_mensual)^n - 1)
```

Renta:

```text
renta_mes_año = renta_inicial * (1 + aumento_renta)^año
costo_renta_acumulado += renta_mes_año * 12
capital_alternativo = capital_alternativo * (1 + rendimiento_alternativo) + diferencia_de_flujos
```

Compra:

```text
valor_vivienda = precio * (1 + plusvalia)^año
costo_mantenimiento = valor_vivienda * mantenimiento_anual
patrimonio = valor_vivienda - saldo_hipoteca
costo_neto_compra = enganche + costos_compra + pagos + mantenimiento - patrimonio + costos_venta
```

Documentar claramente las decisiones exactas del algoritmo durante implementación.

---

## Validaciones y estados

- Precio y renta deben ser mayores que cero.
- Enganche no puede superar 100%.
- Horizonte puede ser menor o mayor que plazo hipotecario.
- Si tasa es cero, dividir préstamo entre meses.
- Permitir plusvalía negativa.
- Mostrar advertencia: los resultados dependen fuertemente de supuestos.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora renta vs compra` |
| Meta description | `Compara el costo estimado de rentar o comprar vivienda con hipoteca, enganche, plusvalía y supuestos editables.` |
| H1 | `Calculadora renta vs compra` |
| Keyword principal | `renta vs compra calculadora` |
| Keywords secundarias | `rentar o comprar casa`, `comparar renta hipoteca`, `punto equilibrio vivienda` |

### FAQs sugeridas

- ¿Qué costos incluye comprar vivienda?
- ¿Cómo influye la plusvalía?
- ¿Qué es el rendimiento alternativo del enganche?
- ¿La calculadora recomienda comprar o rentar?

---

## Pruebas sugeridas

- Tasa hipotecaria cero calcula cuota sin intereses.
- Renta aumenta anualmente según tasa.
- Plusvalía negativa reduce valor de vivienda.
- Enganche de 100% produce préstamo cero.
- Punto de equilibrio se detecta al cambiar signo de diferencia.

