# Especificación v1 - Calculadora de margen de ganancia y markup

## Descripción general

Herramienta para calcular margen de ganancia, markup y precio de venta a partir
de costos. Está pensada para freelancers, tiendas, e-commerce, servicios y
pequeños negocios que necesitan entender la diferencia entre margen y markup.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular margen y markup desde costo y precio.
- Calcular precio de venta a partir de un margen objetivo.
- Calcular precio de venta a partir de un markup objetivo.
- Mostrar utilidad bruta y explicar la diferencia entre métricas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Tres modos: `Costo y precio`, `Margen objetivo`, `Markup objetivo`.
- Costo base, precio, margen o markup según modo.
- Costos extra opcionales: comisión, envío, empaque u otros.
- Resultado con precio sugerido, utilidad, margen y markup.
- Copiar resumen y limpiar formulario.

### Fase 2

- Impuestos y descuentos.
- Tabla de escenarios por margen.
- Comparador de productos.
- Historial en `sessionStorage`.
- Exportar tabla a CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-margen-y-markup` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-margen-y-markup.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-margen-y-markup/marginMarkup.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-margen-y-markup/marginMarkup.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Usar tabs o control segmentado con tres modos.
- Mantener solo los campos relevantes visibles por modo.
- Mostrar resultado principal en una tarjeta compacta: precio, utilidad, margen.
- Incluir explicación breve: margen se calcula sobre precio, markup sobre costo.
- Evitar tablas en el primer viewport.

---

## Flujo principal MVP

**Ejemplo:** Un producto cuesta `$300` y se vende en `$500`. ¿Cuál es el margen
y cuál es el markup?

### Inputs por modo

| Modo | Campos requeridos |
|------|-------------------|
| Costo y precio | costo base, precio de venta |
| Margen objetivo | costo base, margen deseado (%) |
| Markup objetivo | costo base, markup deseado (%) |

### Inputs comunes opcionales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Comisión por venta | Texto numérico | `>= 0` | `0` |
| Envío / empaque | Texto numérico | `>= 0` | `0` |
| Otros costos | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Costo total.
- Precio de venta.
- Utilidad bruta.
- Margen de ganancia.
- Markup.
- Precio mínimo para no perder.

---

## Fórmulas

```text
costo_total = costo_base + comision + envio_empaque + otros_costos
utilidad = precio_venta - costo_total
margen = (utilidad / precio_venta) * 100
markup = (utilidad / costo_total) * 100
```

Precio por margen objetivo:

```text
precio_venta = costo_total / (1 - margen_objetivo / 100)
```

Precio por markup objetivo:

```text
precio_venta = costo_total * (1 + markup_objetivo / 100)
```

---

## Validaciones y estados

- Costo base debe ser mayor que cero.
- Precio de venta debe ser mayor que cero.
- Margen objetivo debe ser menor que `100%`.
- Markup objetivo puede ser `0%` o mayor.
- Si utilidad es negativa, mostrar pérdida.
- No dividir entre cero si precio es `0`.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de margen de ganancia y markup` |
| Meta description | `Calcula margen, markup, utilidad y precio de venta a partir de tus costos. Ideal para productos, servicios y e-commerce.` |
| H1 | `Calculadora de margen y markup` |
| Keyword principal | `calculadora margen ganancia` |
| Keywords secundarias | `markup calculadora`, `margen vs markup`, `precio de venta con margen` |

### FAQs sugeridas

- ¿Cuál es la diferencia entre margen y markup?
- ¿Cómo calculo precio con margen objetivo?
- ¿Qué pasa si vendo por debajo del costo?
- ¿Debo incluir comisiones y envío?

---

## Pruebas sugeridas

- Costo `300`, precio `500` produce utilidad `200`, margen `40%`, markup `66.67%`.
- Margen objetivo `40%` sobre costo `300` produce precio `500`.
- Markup `50%` sobre costo `300` produce precio `450`.
- Margen objetivo `100%` muestra error.
- Costos extra se suman al costo total.

