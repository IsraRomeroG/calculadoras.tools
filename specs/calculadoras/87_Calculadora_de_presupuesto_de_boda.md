# Especificación v1 - Calculadora de presupuesto de boda

## Descripción general

Herramienta para crear un presupuesto preliminar de boda mediante categorías,
partidas, invitados, contingencia y presupuesto disponible. Todos los costos se
ingresan manualmente y el resultado no sustituye cotizaciones.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Sumar partidas del presupuesto de boda.
- Calcular costo por invitado.
- Comparar costo estimado contra presupuesto disponible.
- Separar depósitos pagados y saldo pendiente.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Número de invitados.
- Presupuesto disponible opcional.
- Lista editable de partidas.
- Categoría, costo estimado, depósito y responsable opcional.
- Contingencia editable.
- Resultado: total, costo por invitado, pagado y pendiente.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Plantillas de categorías.
- Presupuesto por persona y prioridades.
- Guardado en `localStorage`.
- Vista imprimible.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/restaurantes/calculadora-presupuesto-boda` |
| URL futura si existe Eventos | `/eventos/calculadora-presupuesto-boda` |
| Archivo Astro recomendado | `src/pages/restaurantes/calculadora-presupuesto-boda.astro` |
| Lógica de cálculo | `src/lib/calculators/restaurantes/calculadora-presupuesto-boda/weddingBudget.ts` |
| Pruebas unitarias | `src/lib/calculators/restaurantes/calculadora-presupuesto-boda/weddingBudget.test.ts` |
| Categoría inmediata | `restaurantes` |
| Categoría futura opcional | `eventos` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Total y diferencia contra presupuesto visibles arriba.
- Cada partida como bloque editable.
- Categorías y pagos como desglose secundario.
- Botones claros para agregar, duplicar y eliminar.
- No incluir precios predeterminados como si fueran universales.

---

## Flujo principal MVP

**Ejemplo:** Boda para `120 invitados`, presupuesto de `$400,000` y distintas
partidas de lugar, comida, fotografía y música.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Invitados | Texto numérico entero | `1-10000` | vacío |
| Presupuesto disponible | Texto numérico opcional | `>= 0` | vacío |
| Nombre de partida | Texto | 1-80 caracteres | `Partida 1` |
| Categoría | Selector/texto | lugar, comida, foto, música, ropa, otro | `Otro` |
| Costo estimado | Texto numérico | `>= 0` | vacío |
| Depósito pagado | Texto numérico | `>= 0` | `0` |
| Contingencia (%) | Texto numérico | `0%-100%` | `10` |

### Outputs principales

- Subtotal de partidas.
- Contingencia.
- Total estimado.
- Costo por invitado.
- Total pagado.
- Saldo pendiente.
- Diferencia contra presupuesto.

---

## Fórmulas

```text
subtotal = suma(costo_estimado)
contingencia_monto = subtotal * (contingencia / 100)
total = subtotal + contingencia_monto
costo_por_invitado = total / invitados
pagado = suma(min(deposito, costo_estimado))
saldo_pendiente = total - pagado
diferencia_presupuesto = presupuesto_disponible - total
```

---

## Validaciones y estados

- Invitados debe ser entero positivo.
- Costos no pueden ser negativos.
- Depósito mayor al costo muestra advertencia.
- Presupuesto vacío oculta comparación.
- Permitir partidas con costo cero.
- Contingencia puede ser cero.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de presupuesto de boda` |
| Meta description | `Crea un presupuesto de boda con invitados, partidas, depósitos, contingencia y costo por persona.` |
| H1 | `Calculadora de presupuesto de boda` |
| Keyword principal | `calculadora presupuesto boda` |
| Keywords secundarias | `costo boda`, `presupuesto boda por invitado`, `gastos de boda` |

---

## Pruebas sugeridas

- Costo por invitado divide total entre invitados.
- Contingencia aumenta subtotal.
- Depósitos se suman correctamente.
- Presupuesto vacío no genera diferencia.
- Invitados cero muestra error.

