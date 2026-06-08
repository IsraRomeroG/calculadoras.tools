# Especificación v1 - Calculadora de costo por persona en evento

## Descripción general

Herramienta para calcular costo total y costo por persona de un evento a partir
de gastos fijos, gastos por invitado y cantidad de asistentes.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular costo por persona.
- Separar costos fijos y variables.
- Calcular invitados posibles con un presupuesto.
- Comparar escenarios de asistencia.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Dos modos: `Costo por persona` e `Invitados posibles`.
- Invitados o presupuesto disponible.
- Lista de gastos fijos.
- Lista de costos variables por persona.
- Contingencia opcional.
- Resultado total y por persona.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Comparador de escenarios.
- Categorías de evento.
- Guardado en `localStorage`.
- Costo por mesa.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/restaurantes/calculadora-costo-por-persona-evento` |
| URL futura si existe Eventos | `/eventos/calculadora-costo-por-persona-evento` |
| Archivo Astro recomendado | `src/pages/restaurantes/calculadora-costo-por-persona-evento.astro` |
| Lógica de cálculo | `src/lib/calculators/restaurantes/calculadora-costo-por-persona-evento/eventCost.ts` |
| Pruebas unitarias | `src/lib/calculators/restaurantes/calculadora-costo-por-persona-evento/eventCost.test.ts` |
| Categoría inmediata | `restaurantes` |
| Categoría futura opcional | `eventos` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Control segmentado para los dos modos.
- Resultado principal como costo por persona o invitados posibles.
- Gastos fijos y variables en bloques separados.
- Evitar tablas extensas en el primer viewport.
- Mostrar supuestos usados.

---

## Flujo principal MVP

**Ejemplo:** Evento de `100 personas`, costos fijos de `$50,000` y costos
variables de `$700` por persona.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | costo por persona, invitados posibles | costo por persona |
| Invitados | Texto numérico entero | `1-100000` | vacío |
| Presupuesto disponible | Texto numérico | `> 0` | vacío |
| Gasto fijo | Lista monetaria | `>= 0` | vacío |
| Costo variable por persona | Lista monetaria | `>= 0` | vacío |
| Contingencia (%) | Texto numérico | `0%-100%` | `10` |

### Outputs principales

- Costos fijos totales.
- Costo variable unitario.
- Costo variable total.
- Contingencia.
- Costo total.
- Costo por persona.
- Invitados posibles.

---

## Fórmulas

```text
fijos = suma(gastos_fijos)
variable_unitario = suma(costos_por_persona)
subtotal = fijos + variable_unitario * invitados
total = subtotal * (1 + contingencia / 100)
costo_por_persona = total / invitados
```

Invitados posibles:

```text
factor = 1 + contingencia / 100
presupuesto_base = presupuesto / factor
invitados_posibles = floor((presupuesto_base - fijos) / variable_unitario)
```

---

## Validaciones y estados

- Invitados debe ser entero positivo en el primer modo.
- Presupuesto debe ser positivo en el segundo.
- Si costo variable es cero, invitados posibles no puede determinarse solo por fórmula; mostrar estado especial.
- Costos no pueden ser negativos.
- Si presupuesto no cubre fijos, invitados posibles es cero.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo por persona en evento` |
| Meta description | `Calcula costo total, costo por persona o cuántos invitados caben en el presupuesto de un evento.` |
| H1 | `Calculadora de costo por persona` |
| Keyword principal | `costo por persona evento` |
| Keywords secundarias | `presupuesto evento`, `costo por invitado`, `cuantos invitados presupuesto` |

---

## Pruebas sugeridas

- `100` invitados, fijos `50000`, variable `700`, sin contingencia produce total `120000`.
- Costo por persona del caso anterior produce `1200`.
- Presupuesto menor a costos fijos produce cero invitados.
- Variable cero muestra estado especial.
- Contingencia se aplica al subtotal.

