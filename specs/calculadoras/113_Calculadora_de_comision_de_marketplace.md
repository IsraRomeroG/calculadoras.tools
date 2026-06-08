# Especificación v1 - Calculadora de comisión de marketplace

## Descripción general

Herramienta para estimar comisiones, cargos e ingreso neto de una venta en un
marketplace usando porcentajes y montos fijos capturados manualmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No consulta tarifas de
marketplaces ni requiere backend.

---

## Objetivo de producto

- Desglosar comisión porcentual y cargos fijos.
- Calcular ingreso neto por venta.
- Incluir costo del producto para estimar margen.
- Calcular precio necesario para alcanzar un neto objetivo.
- Mostrar todos los cargos manuales utilizados.

---

## Alcance recomendado

### MVP

- Precio de venta, envío cobrado y descuentos.
- Comisión porcentual y cargo fijo.
- Comisión de pago y otros cargos.
- Impuestos sobre comisiones opcionales.
- Neto recibido y margen estimado.

### Fase 2

- Comparador entre marketplaces.
- Varias unidades.
- Escenarios por categoría.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/e-commerce/calculadora-comision-marketplace` |
| Archivo Astro recomendado | `src/pages/e-commerce/calculadora-comision-marketplace.astro` |
| Lógica de cálculo | `src/lib/calculators/e-commerce/calculadora-comision-marketplace/marketplaceFees.ts` |
| Pruebas unitarias | `src/lib/calculators/e-commerce/calculadora-comision-marketplace/marketplaceFees.test.ts` |
| Categoría | `e-commerce` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar neto recibido como resultado principal.
- Desglosar cada comisión y su base.
- Mantener visible que las tarifas son manuales.
- Separar neto recibido de utilidad.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Precio de venta | Texto numérico | `>= 0` | vacío |
| Envío cobrado al cliente | Texto numérico | `>= 0` | `0` |
| Descuento absorbido | Texto numérico | `>= 0` | `0` |
| Base de comisión | Selector | precio, precio más envío | precio |
| Comisión marketplace (%) | Texto numérico | `0%-100%` | vacío |
| Cargo fijo | Texto numérico | `>= 0` | `0` |
| Comisión de pago (%) | Texto numérico | `0%-100%` | `0` |
| Impuesto sobre comisiones (%) | Texto numérico | `>= 0` | `0` |
| Costo del producto opcional | Texto numérico | `>= 0` | vacío |

### Outputs principales

- Ingreso bruto cobrado.
- Comisiones por concepto.
- Impuesto sobre comisiones.
- Neto recibido.
- Utilidad y margen opcionales.
- Tasa efectiva de cargos.

---

## Fórmulas

```text
ingreso_bruto = precio_venta + envio_cobrado - descuento
comision_marketplace = base_comision * tasa_marketplace
comision_pago = ingreso_bruto * tasa_pago
cargos_antes_impuesto = comision_marketplace + comision_pago + cargo_fijo
impuesto_comisiones = cargos_antes_impuesto * tasa_impuesto
neto_recibido = ingreso_bruto - cargos_antes_impuesto - impuesto_comisiones
utilidad = neto_recibido - costo_producto
margen = ingreso_bruto > 0 ? utilidad / ingreso_bruto * 100 : null
```

---

## Validaciones y estados

- Importes y tasas no pueden ser negativos.
- Tasas porcentuales de comisión no pueden superar `100%` sin advertencia.
- Mostrar la base aplicada a cada cargo.
- Neto negativo debe permanecer visible con advertencia.
- No presentar tarifas manuales como oficiales o vigentes.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de comisión de marketplace` |
| Meta description | `Estima comisiones, cargos, neto recibido y margen de una venta en marketplace con tarifas manuales.` |
| H1 | `Calculadora de comisión de marketplace` |
| Keyword principal | `comisión marketplace` |
| Keywords secundarias | `calculadora comisiones venta`, `neto marketplace`, `tarifa marketplace` |

---

## Pruebas sugeridas

- Venta `1000` con comisión `10%` produce comisión `100`.
- Cargo fijo se suma una sola vez.
- Impuesto se aplica sobre cargos definidos.
- Costo del producto vacío oculta utilidad.
- Neto negativo muestra advertencia.

