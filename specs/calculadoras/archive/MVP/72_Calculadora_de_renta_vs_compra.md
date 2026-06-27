# Especificación v2 - Calculadora de renta vs compra

## Descripción general

Herramienta para comparar el resultado financiero estimado de rentar una
vivienda frente a comprarla durante un periodo definido. La comparación debe
centrarse en patrimonio neto futuro, flujo mensual y efectivo inicial requerido,
no solo en costo acumulado. Debe usar supuestos editables y presentar el
resultado como escenario, no como recomendación financiera.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Comparar patrimonio neto estimado al rentar frente a comprar.
- Mostrar costo acumulado, flujo mensual y efectivo inicial requerido.
- Considerar hipoteca, enganche, costos de compra, mantenimiento y plusvalía.
- Considerar aumento anual de renta y rendimiento alternativo del capital que no
  se usa para comprar.
- Mostrar año aproximado de equilibrio patrimonial.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Renta mensual y aumento anual.
- Precio de vivienda, enganche, tasa y plazo.
- Costos de compra/venta editables.
- Mantenimiento e impuestos/predial anuales editables.
- Plusvalía y rendimiento alternativo manuales.
- Comparación anual de patrimonio neto y punto de equilibrio.
- Efectivo inicial necesario para comprar.
- Pago mensual estimado de hipoteca.
- Diferencia mensual entre rentar y comprar.
- Total estimado de intereses pagados durante el horizonte.
- Copiar resumen, limpiar formulario y exportar CSV.

### Fase 2

- Inflación, seguros y cuota de condominio separados.
- Pagos extra a hipoteca.
- Escenarios preconfigurados: conservador, base y optimista.
- Comparador manual de escenarios.
- Historial en `sessionStorage`.
- Gráfica de patrimonio neto.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-renta-vs-compra` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-renta-vs-compra.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-renta-vs-compra/rentVsBuy.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-renta-vs-compra/rentVsBuy.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Priorizar una captura rápida con los campos esenciales visibles primero.
- Separar inputs en bloques `Tu renta`, `La vivienda`, `Hipoteca` y
  `Supuestos avanzados`.
- Mantener `Supuestos avanzados` colapsable en mobile, pero visible/editable
  cuando el usuario lo abra.
- Resultado comparativo visible antes de la tabla anual.
- Mostrar la opción con mayor patrimonio neto estimado sin presentarla como
  recomendación.
- Mostrar en el resumen el pago mensual, efectivo inicial requerido y
  diferencia mensual.
- Nombrar claramente los dos plazos:
  - `Años que planeas conservarla`: horizonte de comparación.
  - `Duración del crédito`: plazo usado para calcular la hipoteca.
- Incluir un checkbox `Usar la duración del crédito como años de comparación`
  para usuarios que quieran evaluar ambos plazos igual.
- Tabla anual con `overflow-x-auto`.
- Mantener los supuestos usados visibles en el resumen para evitar resultados
  opacos.

---

## Flujo principal MVP

**Ejemplo:** Comparar renta de `$18,000` mensuales contra comprar una vivienda de
`$3,500,000` durante `10 años`.

### Inputs principales

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Renta mensual | Texto numérico | `> 0` | vacío |
| Aumento anual de renta (%) | Texto numérico | `0%-50%` | `4` |
| Precio de vivienda | Texto numérico | `> 0` | vacío |
| Enganche (%) | Texto numérico | `0%-100%` | `20` |
| Tasa hipotecaria anual (%) | Texto numérico | `0%-100%` | vacío |
| Duración del crédito | Texto numérico | `1-40 años` | `20` |
| Años que planeas conservarla | Texto numérico | `1-40 años` | `10` |
| Usar duración del crédito como años de comparación | Checkbox | `true/false` | `false` |
| Costos de compra (%) | Texto numérico | `0%-30%` | `5` |
| Costos de venta (%) | Texto numérico | `0%-20%` | `5` |
| Mantenimiento anual (%) | Texto numérico | `0%-20%` | `1` |
| Impuestos/predial anual (%) | Texto numérico | `0%-5%` | `0.2` |
| Plusvalía anual (%) | Texto numérico | `-20%-50%` | `3` |
| Rendimiento alternativo (%) | Texto numérico | `0%-100%` | `5` |

### Outputs principales

- Patrimonio neto estimado rentando.
- Patrimonio neto estimado comprando.
- Costo neto estimado de rentar.
- Costo neto estimado de comprar.
- Efectivo inicial requerido para comprar.
- Pago mensual estimado de hipoteca.
- Diferencia mensual inicial entre renta, hipoteca y costos recurrentes de
  propiedad.
- Intereses hipotecarios pagados durante el horizonte.
- Valor estimado de la vivienda al final del horizonte.
- Saldo hipotecario pendiente al final del horizonte.
- Diferencia entre escenarios.
- Año estimado de equilibrio patrimonial.
- Tabla anual.

---

## Fórmulas y algoritmo

La comparación principal debe ser patrimonial:

```text
resultado_rentar = capital_alternativo_final
resultado_comprar = valor_vivienda_final - saldo_hipoteca_final - costos_venta_final
diferencia = resultado_comprar - resultado_rentar
```

`diferencia > 0` indica que comprar genera mayor patrimonio neto estimado en el
escenario calculado. `diferencia < 0` indica que rentar e invertir el capital
disponible genera mayor patrimonio neto estimado.

Hipoteca con cuota fija:

```text
enganche_monto = precio * enganche_porcentaje
costos_compra_monto = precio * costos_compra_porcentaje
prestamo = precio - enganche_monto
tasa_mensual = tasa_anual / 12 / 100
n = plazo_años * 12
cuota = prestamo * (tasa_mensual * (1+tasa_mensual)^n) / ((1+tasa_mensual)^n - 1)
efectivo_inicial_compra = enganche_monto + costos_compra_monto
```

Si `tasa_mensual` es `0`, la cuota mensual debe ser `prestamo / n`. Si
`prestamo` es `0`, la cuota mensual debe ser `0`.

Renta:

```text
capital_alternativo_inicial = enganche_monto + costos_compra_monto
capital_alternativo = capital_alternativo_inicial
renta_mes_año = renta_inicial * (1 + aumento_renta)^año
costo_renta_acumulado += renta_mes_año * 12
capital_alternativo = capital_alternativo * (1 + rendimiento_alternativo)
capital_alternativo += diferencia_de_flujos_anual
```

`diferencia_de_flujos_anual` debe representar la diferencia entre el costo anual
de comprar y el costo anual de rentar. Si comprar exige más flujo que rentar,
esa diferencia se invierte en el escenario de renta. Si rentar exige más flujo,
esa diferencia reduce el capital alternativo.

Compra:

```text
valor_vivienda = precio * (1 + plusvalia)^año
costo_mantenimiento = valor_vivienda * mantenimiento_anual
costo_impuestos = valor_vivienda * impuestos_anuales
costos_propiedad_anuales = costo_mantenimiento + costo_impuestos
patrimonio_bruto = valor_vivienda - saldo_hipoteca
costos_venta_monto = valor_vivienda * costos_venta_porcentaje
patrimonio_neto_compra = patrimonio_bruto - costos_venta_monto
costo_neto_compra = efectivo_inicial_compra + pagos_hipoteca + costos_propiedad - patrimonio_neto_compra
```

El saldo hipotecario debe actualizarse mes a mes para separar intereses y
capital amortizado. El total de intereses pagados debe acumularse solo durante
los meses incluidos en el horizonte de comparación.

### Punto de equilibrio

El punto de equilibrio es el primer año en que:

```text
patrimonio_neto_compra >= patrimonio_neto_renta
```

Si no ocurre dentro del horizonte, mostrar `No se alcanza en este horizonte`.

Documentar claramente las decisiones exactas del algoritmo durante
implementación.

---

## Validaciones y estados

- Precio y renta deben ser mayores que cero.
- Enganche no puede superar 100%.
- Los años que planeas conservar la vivienda pueden ser menores o mayores que
  la duración del crédito.
- Si el checkbox de sincronización está activo, los años de comparación deben
  tomar el mismo valor que la duración del crédito y el campo de comparación
  puede deshabilitarse visualmente.
- Si tasa es cero, dividir préstamo entre meses.
- Si enganche es 100%, no debe generarse pago hipotecario.
- Permitir plusvalía negativa.
- Permitir que el capital alternativo baje si el flujo de rentar supera al de
  comprar.
- Mostrar advertencia: los resultados dependen fuertemente de supuestos.
- Mostrar estado vacío útil antes del primer cálculo, sin tabla anual incompleta.
- Mostrar mensajes de error junto al campo correspondiente en mobile.

---

## Estructura recomendada de interfaz

### Orden mobile

1. Encabezado breve con H1 y una frase de contexto.
2. Bloque `Tu renta`.
3. Bloque `La vivienda`.
4. Bloque `Hipoteca`.
5. Checkbox opcional para usar la duración del crédito como años de comparación.
6. Botón principal `Calcular`.
7. Resumen comparativo.
8. Supuestos avanzados colapsables.
9. Tabla anual.
10. Acciones: copiar resumen, exportar CSV y limpiar formulario.

### Resumen comparativo

El primer resultado visible debe incluir:

- Escenario con mayor patrimonio neto estimado.
- Diferencia entre comprar y rentar.
- Pago mensual de hipoteca.
- Renta mensual inicial.
- Efectivo inicial requerido para comprar.
- Año de equilibrio patrimonial.

La copia debe evitar frases absolutas como `conviene comprar`. Usar textos como
`En este escenario, comprar termina con mayor patrimonio estimado`.

### Supuestos avanzados

Los supuestos avanzados deben agrupar:

- Costos de compra.
- Costos de venta.
- Mantenimiento anual.
- Impuestos/predial anual.
- Plusvalía anual.
- Rendimiento alternativo.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora renta vs compra` |
| Meta description | `Compara el costo estimado de rentar o comprar vivienda con hipoteca, enganche, plusvalía y supuestos editables.` |
| H1 | `Calculadora renta vs compra` |
| Keyword principal | `renta vs compra calculadora` |
| Keywords secundarias | `rentar o comprar casa`, `comparar renta hipoteca`, `punto equilibrio vivienda` |

### FAQs sugeridas

- ¿Qué costos incluye comprar vivienda?
- ¿Cómo influye la plusvalía?
- ¿Qué es el rendimiento alternativo del enganche y costos iniciales?
- ¿Por qué se compara patrimonio neto y no solo pagos mensuales?
- ¿Qué significa el punto de equilibrio patrimonial?
- ¿La calculadora recomienda comprar o rentar?

---

## Pruebas sugeridas

- Tasa hipotecaria cero calcula cuota sin intereses.
- Renta aumenta anualmente según tasa.
- Plusvalía negativa reduce valor de vivienda.
- Enganche de 100% produce préstamo cero.
- Costos de compra se incluyen en el capital alternativo inicial al rentar.
- Diferencia de flujos aumenta el capital alternativo cuando comprar cuesta más.
- Impuestos/predial aumentan el costo anual de compra.
- Costos de venta reducen el patrimonio neto de compra.
- Punto de equilibrio se detecta cuando compra iguala o supera el patrimonio de
  renta.

