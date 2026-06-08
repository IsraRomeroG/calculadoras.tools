# Especificación v1 - Calculadora de ticket promedio

## Descripción general

Herramienta para calcular el valor promedio por pedido a partir de ventas y
número de pedidos, con ajustes manuales por reembolsos, descuentos y conceptos
excluidos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
integración con una plataforma de e-commerce.

---

## Objetivo de producto

- Calcular ticket promedio bruto y neto.
- Hacer visible qué ingresos y pedidos se incluyeron.
- Estimar pedidos o ventas necesarios para una meta.
- Comparar dos periodos.
- Evitar confundir ticket promedio con ingreso por cliente.

---

## Alcance recomendado

### MVP

- Ventas brutas, reembolsos y descuentos.
- Pedidos válidos y cancelados.
- Ticket promedio bruto y neto.
- Meta de ticket promedio.
- Planificación de ventas o pedidos.

### Fase 2

- Comparador entre periodos.
- Ticket por canal.
- Mediana y distribución manual.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/e-commerce/calculadora-ticket-promedio` |
| Archivo Astro recomendado | `src/pages/e-commerce/calculadora-ticket-promedio.astro` |
| Lógica de cálculo | `src/lib/calculators/e-commerce/calculadora-ticket-promedio/averageOrderValue.ts` |
| Pruebas unitarias | `src/lib/calculators/e-commerce/calculadora-ticket-promedio/averageOrderValue.test.ts` |
| Categoría | `e-commerce` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar ticket promedio neto como resultado principal.
- Presentar ventas y pedidos usados junto al resultado.
- Mantener ajustes en un bloque secundario.
- Etiquetar claramente ticket bruto y neto.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ventas brutas | Texto numérico | `>= 0` | vacío |
| Reembolsos | Texto numérico | `>= 0` | `0` |
| Descuentos | Texto numérico | `>= 0` | `0` |
| Otros importes excluidos | Texto numérico | `>= 0` | `0` |
| Pedidos válidos | Texto numérico entero | `>= 0` | vacío |
| Ticket objetivo | Texto numérico opcional | `> 0` | vacío |

### Outputs principales

- Ventas netas consideradas.
- Ticket promedio bruto.
- Ticket promedio neto.
- Diferencia contra objetivo.
- Pedidos necesarios para una meta de ventas.

---

## Fórmulas

```text
ventas_netas = ventas_brutas - reembolsos - descuentos - excluidos
ticket_bruto = pedidos > 0 ? ventas_brutas / pedidos : null
ticket_neto = pedidos > 0 ? ventas_netas / pedidos : null
pedidos_para_meta = ceil(meta_ventas / ticket_objetivo)
```

---

## Validaciones y estados

- Importes y pedidos no pueden ser negativos.
- Ventas netas negativas muestran advertencia.
- Cero pedidos muestra ticket no disponible.
- Definir si impuestos y envío están incluidos.
- No dividir entre clientes; esta métrica usa pedidos.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ticket promedio` |
| Meta description | `Calcula el ticket promedio bruto y neto por pedido con ventas, reembolsos y descuentos.` |
| H1 | `Calculadora de ticket promedio` |
| Keyword principal | `calculadora ticket promedio` |
| Keywords secundarias | `average order value`, `AOV`, `venta promedio por pedido` |

---

## Pruebas sugeridas

- Ventas `10000` y `100` pedidos producen ticket `100`.
- Reembolsos reducen ticket neto, no bruto.
- Cero pedidos muestra resultado no disponible.
- Ventas netas negativas muestran advertencia.
- Pedidos necesarios se redondean hacia arriba.

