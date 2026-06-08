# Especificación v1 - Calculadora de costo de alojamiento por noche

## Descripción general

Herramienta para calcular costo total y costo efectivo por noche de un
alojamiento, incluyendo habitaciones, huéspedes, cargos, impuestos y descuentos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No consulta precios ni
disponibilidad y no requiere backend.

---

## Objetivo de producto

- Calcular noches entre fechas o capturarlas manualmente.
- Estimar costo total del alojamiento.
- Separar tarifa nocturna, cargos e impuestos.
- Mostrar costo efectivo por noche y por persona.
- Comparar con un presupuesto disponible.

---

## Alcance recomendado

### MVP

- Fechas o número manual de noches.
- Habitaciones y huéspedes.
- Tarifa por habitación/noche.
- Cargos únicos, cargos nocturnos, impuestos y descuentos.
- Total y costos efectivos.

### Fase 2

- Tarifas distintas por noche.
- Comparador de alojamientos.
- División de costo entre grupos.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/viajes/calculadora-costo-alojamiento-noche` |
| Archivo Astro recomendado | `src/pages/viajes/calculadora-costo-alojamiento-noche.astro` |
| Lógica de cálculo | `src/lib/calculators/viajes/calculadora-costo-alojamiento-noche/lodgingCost.ts` |
| Pruebas unitarias | `src/lib/calculators/viajes/calculadora-costo-alojamiento-noche/lodgingCost.test.ts` |
| Categoría | `viajes` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar total y costo efectivo por noche arriba.
- Hacer visible el número de noches calculado.
- Separar tarifa base, cargos, impuestos y descuentos.
- No confundir días de estancia con noches facturables.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo de noches | Selector | fechas, manual | fechas |
| Entrada | Fecha | fecha válida | vacío |
| Salida | Fecha | posterior a entrada | vacío |
| Noches manuales | Texto numérico entero | `>= 1` | vacío |
| Habitaciones | Texto numérico entero | `>= 1` | `1` |
| Huéspedes | Texto numérico entero | `>= 1` | `1` |
| Tarifa por habitación/noche | Texto numérico | `>= 0` | vacío |
| Cargos por noche | Texto numérico | `>= 0` | `0` |
| Cargos únicos | Texto numérico | `>= 0` | `0` |
| Impuestos (%) | Texto numérico | `>= 0` | `0` |
| Descuentos | Texto numérico | `>= 0` | `0` |

### Outputs principales

- Noches facturables.
- Subtotal de alojamiento.
- Cargos e impuestos.
- Total.
- Costo efectivo por noche.
- Costo por persona y por persona/noche.

---

## Fórmulas

```text
noches = diferencia_en_dias(fecha_salida, fecha_entrada)
tarifa_base = tarifa_noche * habitaciones * noches
cargos_nocturnos = cargo_noche * habitaciones * noches
subtotal = tarifa_base + cargos_nocturnos + cargos_unicos - descuentos
impuestos = base_imponible_manual * tasa_impuesto
total = subtotal + impuestos
costo_noche = total / noches
costo_persona_noche = total / huespedes / noches
```

---

## Validaciones y estados

- Salida debe ser posterior a entrada.
- Noches, habitaciones y huéspedes deben ser enteros positivos.
- Importes no pueden ser negativos.
- Descuento mayor al subtotal muestra advertencia.
- Mostrar claramente la base de impuestos.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de costo de alojamiento por noche` |
| Meta description | `Calcula el costo total, por noche y por persona de un alojamiento con cargos, impuestos y descuentos.` |
| H1 | `Calculadora de alojamiento por noche` |
| Keyword principal | `costo alojamiento por noche` |
| Keywords secundarias | `calculadora hotel`, `precio por persona noche`, `costo estancia` |

---

## Pruebas sugeridas

- Entrada lunes y salida martes producen una noche.
- Dos habitaciones duplican tarifa base.
- Cargo único no se multiplica por noches.
- Descuento reduce subtotal.
- Fechas inválidas muestran error.

