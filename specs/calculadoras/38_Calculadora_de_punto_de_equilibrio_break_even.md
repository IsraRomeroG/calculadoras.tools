# Especificación v1 - Calculadora de punto de equilibrio / break-even

## Descripción general

Herramienta para calcular cuántas unidades, ventas o clientes necesita un
negocio para cubrir costos fijos y variables. Debe servir para productos,
servicios, emprendimientos, campañas o negocios pequeños.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular punto de equilibrio en unidades y dinero.
- Mostrar margen de contribución por unidad.
- Estimar unidades necesarias para una utilidad objetivo.
- Detectar si el precio no cubre el costo variable.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Precio por unidad.
- Costo variable por unidad.
- Costos fijos mensuales.
- Utilidad objetivo opcional.
- Resultado: unidades de equilibrio, ventas necesarias y margen de contribución.
- Tabla de escenarios con unidades, ventas, costos y utilidad.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Modo servicios por horas o clientes.
- Costos fijos por periodo configurable.
- Comparador de precios.
- Historial en `sessionStorage`.
- Gráfica simple de utilidad vs unidades.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-punto-de-equilibrio` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-punto-de-equilibrio.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-punto-de-equilibrio/breakEven.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-punto-de-equilibrio/breakEven.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Inputs en una sola columna en móvil.
- Resultado principal visible antes de la tabla de escenarios.
- Mostrar advertencia clara si el margen de contribución es cero o negativo.
- Tabla con `overflow-x-auto`.
- Usar unidades enteras para el resultado práctico y mostrar cálculo exacto en detalle.

---

## Flujo principal MVP

**Ejemplo:** Vendo un producto a `$250`, me cuesta `$100` producirlo y tengo
costos fijos de `$30,000` al mes. ¿Cuántas unidades debo vender para no perder?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio por unidad | Texto numérico | `> 0` | vacío |
| Costo variable por unidad | Texto numérico | `>= 0` | vacío |
| Costos fijos | Texto numérico | `>= 0` | vacío |
| Utilidad objetivo | Texto numérico opcional | `>= 0` | `0` |
| Periodo | Selector | `Mensual`, `Anual`, `Proyecto` | `Mensual` |

### Outputs principales

- Margen de contribución por unidad.
- Punto de equilibrio exacto.
- Unidades mínimas redondeadas hacia arriba.
- Ventas necesarias.
- Unidades para utilidad objetivo.
- Tabla de escenarios.

---

## Fórmulas

```text
margen_contribucion = precio_unitario - costo_variable_unitario
punto_equilibrio_unidades = costos_fijos / margen_contribucion
unidades_practicas = ceil(punto_equilibrio_unidades)
ventas_equilibrio = unidades_practicas * precio_unitario
```

Con utilidad objetivo:

```text
unidades_utilidad = ceil((costos_fijos + utilidad_objetivo) / margen_contribucion)
ventas_utilidad = unidades_utilidad * precio_unitario
```

Utilidad para una fila de escenario:

```text
utilidad = unidades * margen_contribucion - costos_fijos
```

---

## Validaciones y estados

- Precio por unidad debe ser mayor que cero.
- Costo variable no puede ser negativo.
- Si `margen_contribucion <= 0`, no calcular equilibrio y mostrar advertencia.
- Costos fijos pueden ser cero; en ese caso el equilibrio puede ser cero unidades.
- Redondear unidades hacia arriba para resultados accionables.
- Redondear moneda a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de punto de equilibrio / break-even` |
| Meta description | `Calcula cuántas unidades necesitas vender para cubrir costos y alcanzar una utilidad objetivo.` |
| H1 | `Calculadora de punto de equilibrio` |
| Keyword principal | `calculadora punto de equilibrio` |
| Keywords secundarias | `break even calculadora`, `punto de equilibrio formula`, `margen de contribucion` |

### FAQs sugeridas

- ¿Qué es el punto de equilibrio?
- ¿Qué es margen de contribución?
- ¿Por qué se redondean las unidades hacia arriba?
- ¿Qué pasa si mi costo variable supera el precio?

---

## Pruebas sugeridas

- Precio `250`, costo variable `100`, costos fijos `30000` produce `200` unidades.
- Margen de contribución cero muestra error.
- Utilidad objetivo suma al numerador.
- Costos fijos cero produce equilibrio cero o una unidad según presentación.
- Escenarios calculan utilidad correctamente.

