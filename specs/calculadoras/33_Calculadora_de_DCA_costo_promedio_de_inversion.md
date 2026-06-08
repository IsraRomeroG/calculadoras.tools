# Especificación v1 - Calculadora de DCA: costo promedio de inversión

## Descripción general

Herramienta para estimar el costo promedio de inversión cuando el usuario compra
un activo en diferentes momentos y precios. Debe funcionar con acciones,
criptomonedas, fondos, ETFs o cualquier activo capturado manualmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular unidades acumuladas y precio promedio de compra.
- Mostrar inversión total, comisiones, valor actual y ganancia/pérdida.
- Permitir capturar compras manuales sin depender de precios en vivo.
- Ayudar a entender la estrategia DCA sin prometer rendimientos.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Tabla editable de compras.
- Cada fila incluye fecha opcional, monto invertido, precio por unidad y comisión.
- Precio actual opcional para calcular valor presente.
- Resumen: total invertido, unidades, costo promedio, comisiones y P/L.
- Agregar, duplicar y eliminar filas.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Modo de aportación periódica con precio inicial/final estimado.
- Comparador contra compra única.
- Importar CSV pegado desde hoja de cálculo.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-dca-costo-promedio` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-dca-costo-promedio.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-dca-costo-promedio/dca.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-dca-costo-promedio/dca.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- En móvil, cada compra debe mostrarse como bloque editable, no como tabla rígida.
- En desktop puede usarse una tabla con filas editables.
- El resumen debe estar siempre antes de la tabla detallada.
- Usar botones claros para agregar compra y limpiar todo.
- Si el precio actual está vacío, ocultar ganancia/pérdida y mostrar solo costo promedio.

---

## Flujo principal MVP

**Ejemplo:** Compré `$1,000` a precio `$50`, después `$1,000` a precio `$40` y
después `$1,000` a precio `$60`. ¿Cuál es mi costo promedio?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Nombre del activo | Texto opcional | 1-40 caracteres | vacío |
| Fecha de compra | Fecha opcional | fecha válida | vacío |
| Monto invertido | Texto numérico | `> 0` | vacío |
| Precio por unidad | Texto numérico | `> 0` | vacío |
| Comisión | Texto numérico | `>= 0` | `0` |
| Precio actual | Texto numérico opcional | `> 0` | vacío |

### Outputs principales

- Total invertido bruto.
- Comisiones totales.
- Inversión neta usada para comprar.
- Unidades acumuladas.
- Costo promedio por unidad.
- Valor actual.
- Ganancia o pérdida no realizada.
- Rendimiento porcentual.

---

## Fórmulas

```text
monto_neto_fila = monto_invertido - comision
unidades_fila = monto_neto_fila / precio_por_unidad
total_invertido = suma(monto_invertido)
total_comisiones = suma(comision)
total_neto = suma(monto_neto_fila)
unidades_totales = suma(unidades_fila)
costo_promedio = total_neto / unidades_totales
```

Si hay precio actual:

```text
valor_actual = unidades_totales * precio_actual
ganancia = valor_actual - total_invertido
rendimiento = (ganancia / total_invertido) * 100
```

---

## Validaciones y estados

- Requerir al menos una fila válida para calcular.
- La comisión no puede ser igual o mayor al monto invertido.
- Precio por unidad debe ser mayor que cero.
- Si una fila está incompleta, marcarla sin afectar filas válidas.
- Si el precio actual es menor al costo promedio, mostrar pérdida sin ocultarla.
- Redondear unidades con precisión configurable, por defecto 6 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora DCA - Costo promedio de inversión` |
| Meta description | `Calcula tu costo promedio de compra, unidades acumuladas, comisiones y ganancia o pérdida con datos manuales.` |
| H1 | `Calculadora de DCA` |
| Keyword principal | `calculadora dca` |
| Keywords secundarias | `costo promedio inversion`, `dollar cost averaging`, `precio promedio acciones` |

### FAQs sugeridas

- ¿Qué significa DCA?
- ¿Cómo se calcula el costo promedio?
- ¿La calculadora usa precios en vivo?
- ¿Debo incluir comisiones?

---

## Pruebas sugeridas

- Tres compras de igual monto a precios distintos calculan unidades correctas.
- Comisión reduce unidades compradas.
- Precio actual vacío no produce error.
- Comisión mayor al monto muestra error.
- Rendimiento se calcula contra total invertido bruto.
- Exportación CSV conserva filas de compra.

