# Especificación v2 - Calculadora de capacidad de compra de vivienda

## Descripción general

Herramienta para estimar el precio máximo de vivienda que una persona podría
considerar según ingreso, deudas, efectivo inicial, enganche, tasa, plazo,
costos mensuales de vivienda y porcentaje máximo de obligaciones sobre ingreso.

La calculadora debe ayudar a responder dos preguntas:

- ¿Cuánta vivienda podría pagar con mis datos actuales?
- Si ya tengo una vivienda objetivo, ¿qué me limita: ingreso mensual, deudas,
  enganche, efectivo inicial, costos iniciales, tasa o plazo?

No debe presentarse como aprobación crediticia, elegibilidad garantizada ni
recomendación financiera personalizada.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Estimar pago hipotecario mensual disponible.
- Calcular monto aproximado de préstamo por capacidad de pago.
- Calcular precio máximo estimado considerando enganche, gastos iniciales y
  financiamiento máximo.
- Comparar contra una vivienda objetivo opcional.
- Identificar la limitante principal del escenario: ingreso, deudas, efectivo
  inicial, enganche mínimo, tasa/plazo o costos mensuales.
- Mostrar supuestos y advertencias para evitar resultados demasiado optimistas.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Ingreso mensual bruto.
- Deudas mensuales.
- Ratio máximo de obligaciones/ingreso editable.
- Presets de ratio: prudente `28%`, estándar `35%` y ajustado `45%`.
- Efectivo total disponible para compra.
- Enganche como monto o porcentaje.
- Financiamiento máximo editable, por ejemplo `80%`, `90%` o `95%`.
- Tasa anual y plazo.
- Costos mensuales adicionales editables, por ejemplo seguros, predial,
  mantenimiento o cuotas.
- Costos iniciales editables como porcentaje y/o monto fijo, por ejemplo
  escrituración, avalúo, comisiones y mudanza.
- Vivienda objetivo opcional.
- Resultado: precio máximo estimado, pago disponible, préstamo aproximado,
  enganche estimado, costos iniciales estimados, efectivo inicial requerido y
  limitante principal.
- Comparación contra vivienda objetivo cuando el usuario capture precio.
- Copiar resultado y limpiar formulario.
- Aviso financiero visible.

### Fase 2

- Comparador de tasas/plazos.
- Sensibilidad de tasa: escenario base, +1 punto porcentual y -1 punto
  porcentual.
- Historial en `sessionStorage`.
- Enlace contextual a la calculadora de hipoteca con los supuestos cargados.
- Enlace contextual a calculadora de gastos de escrituración.
- Compartir resultado por enlace local, sin persistir datos personales.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-capacidad-compra-vivienda` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-capacidad-compra-vivienda.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-capacidad-compra-vivienda/homeAffordability.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-capacidad-compra-vivienda/homeAffordability.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Diferencia contra la calculadora de hipoteca

La calculadora de hipoteca responde: "si la vivienda cuesta X, ¿cuánto pagaría
al mes?". Esta calculadora responde: "con mi ingreso, deudas y efectivo inicial,
¿qué precio de vivienda podría considerar y qué me limita?".

Por eso debe priorizar capacidad de pago, efectivo inicial, restricciones y
comparación contra vivienda objetivo. La calculadora de hipoteca debe quedar
como herramienta relacionada para profundizar en amortización, intereses y pagos
extra.

---

## Comportamiento mobile-first

- El primer bloque útil en mobile debe ser el resultado principal, actualizado
  conforme se capturan datos.
- Resultado principal: precio máximo estimado.
- Debajo del resultado principal mostrar cuatro métricas compactas:
  pago hipotecario disponible, préstamo aproximado, efectivo inicial requerido
  y limitante principal.
- Usar `inputmode="decimal"` en campos numéricos y controles táctiles de al
  menos `44px` de alto.
- Evitar tablas horizontales dentro del módulo principal en mobile; las métricas
  deben apilarse en una sola columna o en una cuadrícula de dos columnas.
- Mostrar una barra o desglose visual de ingreso mensual:
  deudas actuales, costos de vivienda, pago hipotecario y restante.
- Agrupar inputs en bloques cortos: ingresos, deudas, compra, crédito y costos.
- Costos mensuales e iniciales deben estar en un bloque secundario, pero con un
  resumen visible para que no parezcan omitidos.
- La vivienda objetivo debe ser opcional y aparecer como bloque de comparación,
  no como requisito para calcular.
- Acciones principales al final del formulario en mobile: copiar resultado y
  limpiar.
- No usar lenguaje de aprobación, elegibilidad garantizada o recomendación de
  compra.
- Enlazar a calculadora de hipoteca y gastos de escrituración como herramientas
  relacionadas.

---

## Flujo principal MVP

**Ejemplo:** Ingreso bruto mensual `$60,000`, deudas `$5,000`, ratio máximo
`35%`, efectivo disponible `$500,000`, enganche `20%`, costos iniciales `6%`,
tasa `10%`, plazo `20 años` y costos mensuales adicionales `$2,000`.

La calculadora debe:

1. Estimar cuánto pago hipotecario cabe dentro del ratio elegido.
2. Convertir ese pago en un préstamo aproximado.
3. Estimar el precio máximo por capacidad de pago.
4. Revisar si el efectivo inicial alcanza para enganche y costos iniciales.
5. Tomar el menor precio entre las restricciones aplicables.
6. Indicar qué restricción fue la limitante principal.
7. Si hay vivienda objetivo, comparar el objetivo contra el resultado máximo.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ingreso mensual bruto | Texto numérico | `> 0` | vacío |
| Deudas mensuales | Texto numérico | `>= 0` | `0` |
| Perfil de capacidad | Control segmentado | prudente `28%` / estándar `35%` / ajustado `45%` | estándar |
| Ratio máximo obligaciones/ingreso (%) | Texto numérico | `1%-100%` | `35` |
| Efectivo total disponible para compra | Texto numérico | `>= 0` | `0` |
| Tipo de enganche | Control segmentado | porcentaje / monto | porcentaje |
| Enganche (%) | Texto numérico | `0%-100%` | `20` |
| Enganche disponible en monto | Texto numérico | `>= 0` | `0` |
| Financiamiento máximo (%) | Texto numérico | `1%-100%` | `80` |
| Tasa anual (%) | Texto numérico | `0%-100%` | vacío |
| Plazo | Texto numérico | `1-40 años` | `20` |
| Costos mensuales adicionales | Texto numérico | `>= 0` | `0` |
| Costos iniciales (%) | Texto numérico | `0%-30%` | `6` |
| Costos iniciales monto fijo | Texto numérico | `>= 0` | `0` |
| Precio de vivienda objetivo | Texto numérico opcional | `>= 0` | vacío |

### Outputs principales

- Precio máximo estimado.
- Pago hipotecario mensual disponible.
- Monto aproximado de préstamo.
- Enganche estimado o requerido.
- Efectivo inicial requerido.
- Costos iniciales estimados.
- Limitante principal.
- Ratio actual de deudas.
- Ratio total estimado con vivienda.
- Ingreso restante después de deudas, costos y pago hipotecario.

### Outputs con vivienda objetivo

- Indicación clara: dentro de rango, por encima del rango o incompleto por falta
  de datos.
- Pago hipotecario estimado para la vivienda objetivo.
- Ratio total estimado para la vivienda objetivo.
- Efectivo inicial requerido para la vivienda objetivo.
- Faltante mensual, si el pago objetivo supera el pago disponible.
- Faltante de efectivo inicial, si el efectivo disponible no alcanza.
- Ingreso bruto aproximado requerido para ese objetivo con el ratio elegido.

---

## Fórmulas

Pago mensual disponible:

```text
limite_obligaciones = ingreso_mensual * (ratio_maximo / 100)
obligaciones_actuales = deudas_mensuales
pago_vivienda_total = max(0, limite_obligaciones - obligaciones_actuales)
pago_hipoteca = max(0, pago_vivienda_total - costos_mensuales_adicionales)
```

Monto de préstamo desde cuota:

```text
r = tasa_anual / 12 / 100
n = plazo_años * 12
prestamo_por_ingreso = pago_hipoteca * ((1 + r)^n - 1) / (r * (1 + r)^n)
```

Si tasa es cero:

```text
prestamo_por_ingreso = pago_hipoteca * n
```

Enganche mínimo por financiamiento máximo:

```text
enganche_minimo_pct = max(0, 100 - financiamiento_maximo_pct)
enganche_pct_efectivo = max(enganche_usuario_pct, enganche_minimo_pct)
```

Precio máximo por capacidad de pago cuando el enganche se captura como
porcentaje:

```text
precio_por_ingreso = prestamo_por_ingreso / (1 - enganche_pct_efectivo / 100)
```

Precio máximo por efectivo inicial cuando el enganche se captura como
porcentaje:

```text
porcentaje_inicial_total = (enganche_pct_efectivo + costos_iniciales_pct) / 100
precio_por_efectivo = max(0, (efectivo_disponible - costos_iniciales_monto) / porcentaje_inicial_total)
```

Precio máximo por enganche fijo:

```text
precio_por_ingreso = prestamo_por_ingreso + enganche_monto
precio_por_ltv = enganche_monto / (enganche_minimo_pct / 100)
precio_por_costos_iniciales = max(0, (efectivo_disponible - enganche_monto - costos_iniciales_monto) / (costos_iniciales_pct / 100))
```

Cuando algún denominador sea cero, ignorar esa restricción si no aplica o
marcarla como inválida si impide calcular el resultado.

Precio máximo final:

```text
precio_por_efectivo_o_costos_iniciales =
  si tipo_enganche = porcentaje: precio_por_efectivo
  si tipo_enganche = monto: precio_por_costos_iniciales

precio_maximo = min(
  precio_por_ingreso,
  precio_por_efectivo_o_costos_iniciales,
  precio_por_ltv_si_aplica
)

enganche_estimado =
  si tipo_enganche = porcentaje: precio_maximo * (enganche_pct_efectivo / 100)
  si tipo_enganche = monto: min(enganche_monto, precio_maximo)

prestamo_estimado = max(0, min(prestamo_por_ingreso, precio_maximo - enganche_estimado))
costos_iniciales_estimados = precio_maximo * (costos_iniciales_pct / 100) + costos_iniciales_monto
efectivo_inicial_requerido = enganche_estimado + costos_iniciales_estimados
```

Limitante principal:

```text
limitante_principal = restriccion_con_menor_precio_valido
```

Ratio total con vivienda:

```text
ratio_deudas_actuales = deudas_mensuales / ingreso_mensual * 100
ratio_total_vivienda = (deudas_mensuales + costos_mensuales_adicionales + pago_hipoteca) / ingreso_mensual * 100
ingreso_restante = ingreso_mensual - deudas_mensuales - costos_mensuales_adicionales - pago_hipoteca
```

Vivienda objetivo:

```text
prestamo_objetivo = max(0, precio_objetivo - enganche_objetivo)
pago_hipoteca_objetivo = PMT(prestamo_objetivo, tasa_anual, plazo_años)
costos_iniciales_objetivo = precio_objetivo * (costos_iniciales_pct / 100) + costos_iniciales_monto
efectivo_inicial_objetivo = enganche_objetivo + costos_iniciales_objetivo
ratio_total_objetivo = (deudas_mensuales + costos_mensuales_adicionales + pago_hipoteca_objetivo) / ingreso_mensual * 100
faltante_mensual = max(0, pago_hipoteca_objetivo - pago_hipoteca)
faltante_efectivo = max(0, efectivo_inicial_objetivo - efectivo_disponible)
ingreso_requerido_objetivo = (deudas_mensuales + costos_mensuales_adicionales + pago_hipoteca_objetivo) / (ratio_maximo / 100)
```

---

## Validaciones y estados

- Ingreso debe ser mayor que cero.
- Deudas, enganche, efectivo disponible, costos mensuales y costos iniciales no
  pueden ser negativos.
- Si deudas superan el límite de obligaciones, pago disponible es cero.
- Ratio máximo debe estar entre `1%` y `100%`.
- Mostrar advertencia si ratio supera `50%`.
- Tasa anual debe estar entre `0%` y `100%`.
- Plazo debe estar entre `1` y `40` años.
- Financiamiento máximo debe estar entre `1%` y `100%`.
- Si el enganche elegido es menor al mínimo por financiamiento máximo, ajustar el
  cálculo al enganche mínimo y mostrar advertencia.
- Si el efectivo disponible no alcanza para enganche y costos iniciales, mostrar
  advertencia y marcar efectivo inicial como limitante.
- Si costos iniciales son `0`, mostrar nota de que el resultado no descuenta
  gastos de compra.
- Si la vivienda objetivo supera el precio máximo, mostrar qué falta: pago
  mensual, efectivo inicial o ambos.
- Resultado es estimación, no aprobación bancaria.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de capacidad de compra de vivienda` |
| Meta description | `Estima cuánto podrías pagar por una casa según ingreso, deudas, enganche, gastos iniciales, tasa y plazo hipotecario.` |
| H1 | `Calculadora de capacidad de compra de vivienda` |
| Keyword principal | `cuanto puedo pagar por una casa` |
| Keywords secundarias | `capacidad compra vivienda`, `hipoteca segun ingreso`, `precio maximo casa`, `cuanta casa puedo comprar` |

### FAQs sugeridas

- ¿Cómo se calcula cuánto puedo pagar por una casa?
- ¿Qué es el ratio deuda/ingreso?
- ¿Qué gastos iniciales debo considerar además del enganche?
- ¿Qué significa que mi limitante sea el ingreso o el efectivo inicial?
- ¿La calculadora garantiza aprobación?
- ¿Debo incluir seguros, predial, mantenimiento e impuestos?

---

## Pruebas sugeridas

- Deudas mayores al límite producen pago disponible cero.
- Tasa cero calcula préstamo como cuota por meses.
- Costos mensuales adicionales reducen cuota disponible.
- Costos iniciales reducen el precio máximo cuando el efectivo disponible es la
  limitante.
- Financiamiento máximo obliga a respetar enganche mínimo.
- Enganche en porcentaje calcula precio máximo por ingreso y por efectivo.
- Enganche en monto calcula restricción por ingreso, LTV y costos iniciales.
- Precio máximo final usa la menor restricción válida.
- Limitante principal corresponde a la restricción más baja.
- Ratio alto muestra advertencia.
- Vivienda objetivo dentro de rango no muestra faltante.
- Vivienda objetivo fuera de rango muestra faltante mensual y/o efectivo.
- Costos iniciales en cero muestran nota de resultado optimista.
