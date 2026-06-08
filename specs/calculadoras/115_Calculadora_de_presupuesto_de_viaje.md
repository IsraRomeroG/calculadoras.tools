# Especificación v1 - Calculadora de presupuesto de viaje

## Descripción general

Herramienta para crear un presupuesto de viaje mediante personas, días,
categorías de gasto, pagos realizados y contingencia.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
precios externos ni conversión automática de monedas.

---

## Objetivo de producto

- Sumar gastos fijos, por persona, por día y por evento.
- Calcular presupuesto total y costo por viajero.
- Separar importes pagados y pendientes.
- Añadir contingencia manual.
- Mostrar claramente moneda y supuestos.

---

## Alcance recomendado

### MVP

- Viajeros, días y moneda manual.
- Lista editable de gastos.
- Frecuencia del gasto.
- Contingencia y presupuesto disponible.
- Total, costo por persona y saldo pendiente.
- Copiar resumen y exportar CSV.

### Fase 2

- Presupuesto por día.
- Comparador de destinos.
- Tipo de cambio manual entre monedas.
- Guardado en `localStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/viajes/calculadora-presupuesto-viaje` |
| Archivo Astro recomendado | `src/pages/viajes/calculadora-presupuesto-viaje.astro` |
| Lógica de cálculo | `src/lib/calculators/viajes/calculadora-presupuesto-viaje/travelBudget.ts` |
| Pruebas unitarias | `src/lib/calculators/viajes/calculadora-presupuesto-viaje/travelBudget.test.ts` |
| Categoría | `viajes` |
| Locale base | `es-MX` |
| Moneda base | Manual, inicialmente `MXN` |

---

## Comportamiento mobile-first

- Mostrar total y costo por persona arriba.
- Cada gasto como bloque editable.
- Mostrar pagado y pendiente como resultados secundarios.
- Mantener moneda visible.
- No mezclar monedas sin una conversión manual explícita.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Viajeros | Texto numérico entero | `>= 1` | `1` |
| Días de viaje | Texto numérico entero | `>= 1` | vacío |
| Presupuesto disponible | Texto numérico opcional | `>= 0` | vacío |
| Nombre del gasto | Texto | 1-80 caracteres | `Gasto 1` |
| Categoría | Selector | transporte, alojamiento, comida, actividades, seguro, otro | otro |
| Costo unitario | Texto numérico | `>= 0` | vacío |
| Frecuencia | Selector | una vez, por persona, por día, por persona/día, por evento | una vez |
| Eventos | Texto numérico | `>= 0` | `1` |
| Importe pagado | Texto numérico | `>= 0` | `0` |
| Contingencia (%) | Texto numérico | `0%-100%` | `10%` |

### Outputs principales

- Subtotal.
- Contingencia.
- Presupuesto total.
- Costo por viajero.
- Costo por día.
- Pagado, pendiente y diferencia contra presupuesto.

---

## Fórmulas

```text
una_vez = costo
por_persona = costo * viajeros
por_dia = costo * dias
por_persona_dia = costo * viajeros * dias
por_evento = costo * eventos
subtotal = suma(gastos)
contingencia_monto = subtotal * contingencia
total = subtotal + contingencia_monto
costo_por_persona = total / viajeros
costo_por_dia = total / dias
pendiente = total - pagado
```

---

## Validaciones y estados

- Viajeros y días deben ser enteros positivos.
- Costos y pagos no pueden ser negativos.
- Pago mayor al gasto muestra advertencia.
- Presupuesto vacío oculta comparación.
- Todos los importes deben usar la misma moneda.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de presupuesto de viaje` |
| Meta description | `Crea un presupuesto de viaje con gastos por persona, día, pagos, contingencia y costo por viajero.` |
| H1 | `Calculadora de presupuesto de viaje` |
| Keyword principal | `presupuesto de viaje` |
| Keywords secundarias | `calculadora gastos viaje`, `costo viaje por persona`, `planificar presupuesto viaje` |

---

## Pruebas sugeridas

- Gasto por persona multiplica por viajeros.
- Gasto por persona/día multiplica por ambos factores.
- Contingencia aumenta el subtotal.
- Presupuesto vacío no genera diferencia.
- Monedas distintas requieren conversión manual.

