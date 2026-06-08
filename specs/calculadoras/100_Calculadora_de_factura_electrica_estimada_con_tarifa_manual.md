# Especificación v1 - Calculadora de factura eléctrica estimada con tarifa manual

## Descripción general

Herramienta para estimar el importe de una factura eléctrica usando consumo en
kWh, tarifas manuales por bloque, cargos fijos, impuestos y otros conceptos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No consulta tarifas
oficiales ni requiere backend; todos los precios y cargos son editables.

---

## Objetivo de producto

- Convertir consumo eléctrico en costo estimado.
- Admitir tarifa única o bloques de consumo.
- Separar energía, cargos fijos, impuestos y otros conceptos.
- Mostrar claramente los supuestos manuales utilizados.
- Evitar presentar el resultado como una factura oficial.

---

## Alcance recomendado

### MVP

- Periodo de facturación y consumo total.
- Modos `Tarifa única` y `Tarifa por bloques`.
- Lista editable de bloques.
- Cargos fijos, impuestos y descuentos manuales.
- Total estimado y desglose.

### Fase 2

- Comparador de tarifas.
- Escenarios de ahorro.
- Integración con consumo del hogar.
- Exportación de resumen.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/energia/calculadora-factura-electrica` |
| Archivo Astro recomendado | `src/pages/energia/calculadora-factura-electrica.astro` |
| Lógica de cálculo | `src/lib/calculators/energia/calculadora-factura-electrica/electricBill.ts` |
| Pruebas unitarias | `src/lib/calculators/energia/calculadora-factura-electrica/electricBill.test.ts` |
| Categoría | `energia` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Total estimado visible arriba.
- Mostrar tarifa y consumo usados junto al resultado.
- Bloques tarifarios como filas editables y ordenadas.
- Desglose secundario de energía, cargos e impuestos.
- Incluir aviso visible de tarifa manual.

---

## Flujo principal MVP

**Ejemplo:** Consumo de `250 kWh`, tarifa única de `$1.20/kWh`, cargo fijo e
impuesto manual.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Consumo del periodo | Texto numérico | `>= 0 kWh` | vacío |
| Periodo | Selector | mensual, bimestral, personalizado | mensual |
| Tipo de tarifa | Selector | única, por bloques | única |
| Precio por kWh | Texto numérico | `>= 0` | vacío |
| Límite del bloque | Texto numérico | `> 0 kWh` o sin límite | vacío |
| Cargo fijo | Texto numérico | `>= 0` | `0` |
| Impuestos (%) | Texto numérico | `>= 0` | `0` |
| Otros cargos / descuentos | Lista editable | importe con signo | vacío |

### Outputs principales

- Cargo por energía.
- Cargos fijos y adicionales.
- Impuestos.
- Total estimado.
- Costo efectivo por kWh.
- Desglose por bloque.

---

## Fórmulas

Tarifa única:

```text
cargo_energia = consumo_kWh * precio_kWh
```

Tarifa por bloques:

```text
cargo_bloque = consumo_asignado_al_bloque * precio_bloque
cargo_energia = suma(cargo_bloque)
```

Total:

```text
subtotal = cargo_energia + cargo_fijo + otros_cargos - descuentos
impuestos = base_imponible_manual * tasa_impuesto
total = subtotal + impuestos
costo_efectivo_kWh = consumo_kWh > 0 ? total / consumo_kWh : null
```

---

## Validaciones y estados

- Consumo, tarifas y cargos no pueden ser negativos.
- Los límites de bloques deben estar ordenados y sin superposición.
- El último bloque puede quedar sin límite superior.
- Impuestos deben indicar su base manualmente.
- Consumo cero oculta costo efectivo por kWh.
- Aclarar que subsidios, redondeos y conceptos reales pueden diferir.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de factura eléctrica estimada` |
| Meta description | `Estima tu factura eléctrica con consumo en kWh, tarifa manual, bloques, cargos fijos e impuestos editables.` |
| H1 | `Calculadora de factura eléctrica` |
| Keyword principal | `calculadora factura eléctrica` |
| Keywords secundarias | `calcular recibo de luz`, `costo por kWh`, `tarifa eléctrica manual` |

---

## Pruebas sugeridas

- `100 kWh` a `$2/kWh` producen `$200` antes de cargos.
- Los bloques asignan cada kWh una sola vez.
- Cargo fijo se suma aunque el consumo sea cero.
- Descuento reduce el total.
- Bloques superpuestos muestran error.

