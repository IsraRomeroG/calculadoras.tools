# Especificación v2 — Calculadora de hipoteca

## Descripción general

Herramienta para estimar la cuota mensual de una hipoteca o crédito
hipotecario, el total pagado, el total de intereses y la tabla de amortización.
Debe ser clara, confiable y cómoda en móvil, ya que es una calculadora con alta
intención de compra y los resultados se usan para tomar decisiones financieras.

La calculadora debe explicar que los resultados son estimaciones orientativas.
La cuota calculada corresponde al crédito, es decir, capital e intereses. No
incluye seguros, gastos notariales, avalúos, impuestos, comisiones bancarias ni
otros costos asociados a la compra de vivienda.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular la cuota mensual de una hipoteca de forma rápida y comprensible.
- Mostrar cuánto se paga de capital e intereses durante la vida del préstamo.
- Permitir revisar la amortización mes a mes sin romper la experiencia móvil.
- Ayudar a comparar escenarios sin presentar el resultado como asesoría
  financiera.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal:

- Calcular cuota mensual.
- Permitir entrada por `precio + enganche` o por `monto del préstamo`.
- Mostrar resumen: cuota mensual, monto del préstamo, total pagado, intereses.
- Mostrar tabla de amortización paginada.
- Permitir pago extra mensual opcional.
- Exportar amortización a CSV.
- Copiar resumen.
- Limpiar formulario.
- Incluir aviso legal visible.

### Fase 2

- Modo “¿cuánto puedo pedir prestado?”.
- Comparador de escenarios.
- Historial de los últimos 5 cálculos en `sessionStorage`.
- Vista de impresión con `window.print()`.
- Selector de país y moneda.

### Fase 3

- Gráfica de amortización.
- Rangos orientativos de tasas por país.
- Contenido específico por país.
- Inputs avanzados para seguros, comisiones u otros costos mensuales.

> No implementar tasa variable en el MVP. Una tasa variable real requiere un
> calendario de cambios de tasa y supuestos adicionales.

---

## Ruta y archivo sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-hipoteca` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-hipoteca.astro` |
| Lógica de cálculo | `src/lib/calculators/mortgage.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |
| Lógica cliente | JavaScript o TypeScript vanilla |

> Si se prefiere una URL corta como `/calculadora-hipoteca`, debe definirse si
> será ruta principal, alias o redirección.

---

## Comportamiento mobile-first

- La calculadora debe aparecer como experiencia principal en el primer viewport.
- En móvil, usar una sola columna: datos de entrada, resultado principal,
  detalles y tabla.
- En pantallas medianas o grandes, se puede usar un layout de dos columnas:
  formulario a la izquierda y resumen/acciones a la derecha.
- No usar una landing page antes de la herramienta.
- Los controles táctiles deben tener una altura mínima aproximada de `44px`.
- La tabla debe vivir dentro de un contenedor con `overflow-x-auto`.
- Los resultados largos deben permitir salto de línea sin romper el layout.
- Evitar que la tabla completa empuje el resumen demasiado abajo en móvil.
- Mostrar primero una tabla resumida o paginada de 12 meses por página.
- Usar tarjetas solo para resultados concretos, no para envolver secciones
  completas dentro de otras tarjetas.

---

## Flujo principal — Calcular cuota mensual

Modo por defecto al cargar la página.

**Ejemplo:** Quiero financiar `$2,000,000` a `20 años` con una tasa anual de
`9%`. ¿Cuánto pago al mes?

### Tipo de entrada

Usar un control segmentado con dos opciones:

| Opción | Comportamiento |
|--------|----------------|
| `Precio + enganche` | El usuario captura precio del inmueble y enganche. El monto del préstamo se calcula automáticamente. |
| `Solo préstamo` | El usuario captura directamente el monto del préstamo. Se ocultan precio y enganche. |

Esta decisión evita ambigüedad entre precio, enganche y monto editable.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tipo de entrada | Segmentado | `Precio + enganche` / `Solo préstamo` | `Precio + enganche` |
| Precio del inmueble | Texto numérico | `> 0` | vacío |
| Tipo de enganche | Segmentado | `%` / `$` | `%` |
| Enganche (%) | Texto numérico | `0–100%` | `20` |
| Enganche (monto) | Texto numérico | `0–precio` | calculado |
| Monto del préstamo | Texto numérico o calculado | `> 0` | calculado |
| Tasa de interés anual (%) | Texto numérico | `0–30%` | vacío |
| Plazo del préstamo (años) | Selector o texto numérico | `1–30` | `20` |
| Pago extra mensual | Texto numérico opcional | `>= 0` | `0` |

### Reglas de sincronización

- Si el tipo de entrada es `Precio + enganche`, el monto del préstamo es:

```text
monto_prestamo = precio_inmueble - enganche_monto
```

- Si el usuario edita `Enganche (%)`, se recalcula `Enganche (monto)`.
- Si el usuario edita `Enganche (monto)`, se recalcula `Enganche (%)`.
- Si el tipo de entrada es `Solo préstamo`, no se muestran precio ni enganche.
- Si el enganche es `100%`, mostrar estado informativo:

```text
No hay préstamo que calcular porque el enganche cubre el precio completo.
```

---

## Fórmulas

### Variables

```text
monto = monto del préstamo
tasa_mensual = tasa_anual / 12 / 100
n = plazo_años * 12
```

### Cuota mensual

Si `tasa_mensual > 0`:

```text
cuota = monto * (tasa_mensual * (1 + tasa_mensual)^n)
              / ((1 + tasa_mensual)^n - 1)
```

Si `tasa_mensual = 0`:

```text
cuota = monto / n
```

### Total pagado

```text
total_pagado = suma de todas las cuotas reales del calendario
```

> No usar solamente `cuota * n` cuando hay pago extra o última cuota ajustada.

### Total de intereses

```text
total_intereses = total_pagado - monto
```

### Porcentaje de intereses sobre total pagado

```text
porcentaje_intereses = total_intereses / total_pagado * 100
porcentaje_capital = monto / total_pagado * 100
```

---

## Output principal

Para el ejemplo `monto = 2,000,000`, `tasa = 9%`, `plazo = 20 años`, sin pago
extra:

| Resultado | Valor esperado |
|-----------|----------------|
| Cuota mensual | `$17,994.52` |
| Monto del préstamo | `$2,000,000.00` |
| Total pagado | `$4,318,684.59` |
| Total de intereses | `$2,318,684.59` |
| Relación intereses / capital | `53.69% intereses — 46.31% capital` |

Mostrar una explicación breve:

```text
Con una tasa anual de 9% durante 20 años, pagarías aproximadamente $17,994.52 al mes. Al final del plazo habrás pagado $2,318,684.59 en intereses.
```

---

## Pago extra mensual

El pago extra se suma cada mes al pago programado y reduce directamente el
saldo pendiente después de cubrir los intereses del mes.

**Ejemplo:** préstamo de `$2,000,000`, `9%`, `20 años`, con `$2,000` extra al
mes.

| Resultado | Valor esperado aproximado |
|-----------|---------------------------|
| Cuota base | `$17,994.52` |
| Pago mensual con extra | `$19,994.52` |
| Nuevo plazo efectivo | `15 años 6 meses` |
| Meses ahorrados | `54 meses` |
| Intereses con pago extra | `$1,711,832.41` |
| Ahorro en intereses | `$606,852.18` |

### Reglas

- El pago extra no cambia la cuota base; se muestra como un adicional.
- Si el pago extra es `0`, no mostrar bloque de ahorro.
- Si el pago extra es mayor que la cuota base, mostrar advertencia informativa,
  pero permitir el cálculo.
- Si el pago extra liquida el saldo antes del plazo, cortar la tabla en el mes
  de liquidación.
- La última cuota debe ajustarse para no cobrar más del saldo pendiente.

---

## Tabla de amortización

La tabla muestra el detalle mes a mes de capital, intereses y saldo pendiente.

### Columnas

| Columna | Descripción |
|---------|-------------|
| Mes | Número de mes, de `1` hasta liquidación |
| Pago | Pago real del mes, incluyendo extra si aplica |
| Capital | Parte del pago que reduce saldo |
| Intereses | Interés generado por el saldo del mes anterior |
| Saldo pendiente | Saldo después del pago |

### Reglas de cálculo

Para cada mes:

```text
interes_mes = saldo_anterior * tasa_mensual
pago_planeado = cuota_base + pago_extra
capital_mes = min(pago_planeado - interes_mes, saldo_anterior)
pago_real = interes_mes + capital_mes
saldo_nuevo = saldo_anterior - capital_mes
```

Si `tasa_mensual = 0`:

```text
interes_mes = 0
capital_mes = min(cuota_base + pago_extra, saldo_anterior)
pago_real = capital_mes
```

### Presentación

- Mostrar 12 filas por página.
- Incluir selector de página o selector por año.
- Incluir resumen debajo de la tabla:
  - total capital;
  - total intereses;
  - total pagado;
  - meses reales de duración.
- Exportar CSV con todas las filas, no solo la página visible.
- En móvil, permitir desplazamiento horizontal de la tabla.

---

## Modo fase 2 — ¿Cuánto puedo pedir prestado?

**Ejemplo:** Puedo pagar `$15,000` al mes. ¿Cuánto me pueden prestar a `20 años`
con `9%` anual?

### Inputs

- Cuota mensual máxima.
- Tasa de interés anual.
- Plazo del préstamo.

### Fórmula

Si `tasa_mensual > 0`:

```text
monto = cuota * ((1 + tasa_mensual)^n - 1)
              / (tasa_mensual * (1 + tasa_mensual)^n)
```

Si `tasa_mensual = 0`:

```text
monto = cuota * n
```

### Output esperado

Para `cuota = 15,000`, `tasa = 9%`, `plazo = 20 años`:

| Resultado | Valor esperado |
|-----------|----------------|
| Monto máximo del préstamo | `$1,667,174.31` |
| Total pagado | `$3,600,000.00` |
| Total de intereses | `$1,932,825.69` |

---

## Modo fase 2 — Comparador de escenarios

**Ejemplo:** ¿Qué conviene más: `15 años al 8.5%` o `20 años al 9%`?

### Inputs

- Monto del préstamo.
- Escenario A: tasa + plazo.
- Escenario B: tasa + plazo.
- Escenario C opcional: tasa + plazo.

### Output

| Concepto | Escenario A | Escenario B | Escenario C |
|----------|-------------|-------------|-------------|
| Plazo | `15 años` | `20 años` | `25 años` |
| Tasa anual | `8.5%` | `9.0%` | `9.5%` |
| Cuota mensual | `$19,694.79` | `$17,994.52` | `$17,473.93` |
| Total pagado | `$3,545,062.41` | `$4,318,684.59` | `$5,242,179.97` |
| Total intereses | `$1,545,062.41` | `$2,318,684.59` | `$3,242,179.97` |
| Ahorro vs peor caso | `$1,697,117.56` | `$923,495.38` | `—` |

Destacar visualmente el escenario con menor total pagado. No depender solo del
color; incluir una etiqueta como `Menor costo total`.

---

## Parsing y validación de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite aceptar valores pegados con símbolos comunes.

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `1000` | `1000` |
| `1,000.50` | `1000.5` |
| `$1,000.50` | `1000.5` |
| `1.000,50` | `1000.5` |
| `20%` | `20` |
| ` 20 % ` | `20` |

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Campo vacío | No calcular; mostrar estado neutral o error si el campo ya fue tocado. |
| Precio `<= 0` | Error: `Ingresa un precio mayor a cero.` |
| Monto del préstamo `<= 0` | Error o estado informativo si el enganche cubre el 100%. |
| Enganche `< 0` | Error: `El enganche no puede ser negativo.` |
| Enganche `> precio` | Error: `El enganche no puede superar el precio del inmueble.` |
| Tasa `< 0` | Error: `La tasa no puede ser negativa.` |
| Tasa `= 0` | Permitida; calcular sin intereses. |
| Tasa `> 30%` | Mostrar advertencia y bloquear cálculo. |
| Plazo `< 1` o `> 30` | Bloquear cálculo. |
| Plazo con decimales | Redondear no; mostrar error y pedir años completos en MVP. |
| Pago extra `< 0` | Error. |
| Pago extra `> cuota base` | Advertencia informativa; permitir cálculo. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos o defaults, sin error. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar resumen, explicación, tabla y acciones. |
| Inválido | Mostrar mensaje específico y no actualizar tabla ni historial. |
| Sin préstamo | Mostrar mensaje informativo cuando el enganche cubre el precio completo. |
| Con pago extra | Mostrar comparación entre plazo original y plazo efectivo. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Exportando CSV | Generar archivo en cliente con Blob API. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo | Formato |
|------|---------|
| Moneda | `$17,994.52`, siempre con 2 decimales en resultados financieros. |
| Porcentaje | Máximo 2 decimales: `53.69%`. |
| Meses | Número entero. |
| Plazo efectivo | `15 años 6 meses`; si es menor a un año, `6 meses`. |
| CSV | Valores sin símbolo de moneda, con punto decimal. |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar resultados.
- Ajustar la última fila de amortización para que el saldo final mostrado sea
  `$0.00`.

---

## Acciones del MVP

### Copiar resultado

- Copia un resumen en texto plano.
- Debe incluir: monto, tasa, plazo, cuota, total pagado e intereses.
- Si hay pago extra, incluir plazo efectivo y ahorro estimado.
- Si `navigator.clipboard` no está disponible, usar fallback o mostrar error.

### Limpiar

- Restaura los valores por defecto.
- Limpia errores y resultados.
- No debe recargar la página.

### Exportar CSV

- Exporta la tabla completa de amortización.
- Nombre sugerido:

```text
amortizacion-hipoteca.csv
```

- Encabezados sugeridos:

```text
mes,pago,capital,intereses,saldo_pendiente
```

---

## Features fuera del MVP

### Historial de cálculos

- Guardar los últimos 5 escenarios válidos en `sessionStorage`.
- No guardar cálculos inválidos.
- No guardar duplicados consecutivos idénticos.
- Al hacer clic en un escenario, restaurar inputs y recalcular.
- No usar `localStorage` para evitar persistencia innecesaria.

### Gráfica de amortización

No usar Chart.js en el MVP. Si se implementa después:

- Preferir una visualización ligera con SVG o canvas propio.
- Mostrar capital, intereses y saldo pendiente.
- Incluir tooltip o detalle accesible.
- Verificar que no afecte el rendimiento en móvil.

### Tasas de referencia por país

Las tasas hipotecarias cambian con frecuencia. Si se muestran, deben tratarse
como contenido editorial y revisarse periódicamente.

| País | Tasa orientativa |
|------|------------------|
| México | Revisar manualmente antes de publicar |
| España | Revisar manualmente antes de publicar |
| Colombia | Revisar manualmente antes de publicar |
| Chile | Revisar manualmente antes de publicar |
| Perú | Revisar manualmente antes de publicar |
| EE.UU. | Revisar manualmente antes de publicar |

Mostrar aviso:

```text
Esta tasa es orientativa. Consulta con tu banco para obtener una tasa personalizada.
```

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- Los controles segmentados deben comunicar estado activo con texto, color y
  atributos ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro con Tailwind.
- La tabla debe tener `caption`, encabezados con `scope` y orden lógico.
- No depender únicamente del color para comunicar error, ahorro o mejor
  escenario.
- La navegación debe funcionar con teclado.

---

## SEO y contenido

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Hipoteca Online — Cuota Mensual y Amortización` |
| Description | `Calcula tu cuota hipotecaria al instante. Conoce cuánto pagarás al mes, el total de intereses y la tabla de amortización. Gratis y sin registro.` |
| Canonical | URL final de la calculadora |

### Estructura sugerida

- `h1`: Calculadora de hipoteca
- Intro breve orientada a uso.
- Calculadora interactiva.
- Explicación de qué incluye y qué no incluye la cuota.
- Ejemplo de cálculo.
- Explicación de la tabla de amortización.
- FAQ.

### FAQ sugeridas

- ¿Cómo se calcula la cuota mensual de una hipoteca?
- ¿Qué es la tabla de amortización?
- ¿Qué incluye la cuota de esta calculadora?
- ¿Cuánto debo dar de enganche para una hipoteca?
- ¿Conviene más un plazo corto o largo?
- ¿Qué pasa si hago pagos extra?
- ¿La calculadora incluye seguros, impuestos o comisiones?

### Schema.org

Agregar JSON-LD para `FAQPage` si el contenido de FAQ está visible en la
página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/finanzas/calculadora-de-hipoteca.astro
src/lib/calculators/mortgage.ts
src/lib/calculators/mortgage.test.ts
```

### Criterios técnicos

- La página debe ser estática y usar Astro SSG.
- La UI se construye con Astro + Tailwind.
- La lógica interactiva puede vivir en un `<script>` de la página o importarse
  desde un módulo cliente.
- La lógica matemática debe separarse en funciones puras.
- No introducir React, Vue, Svelte ni librerías adicionales para esta
  calculadora.
- No usar backend.
- No hacer llamadas de red.
- No añadir Chart.js en el MVP.

### Funciones puras sugeridas

```ts
calculateMonthlyPayment(principal, annualRate, years)
calculateLoanAmountFromPayment(payment, annualRate, years)
buildAmortizationSchedule({ principal, annualRate, years, extraPayment })
calculateMortgageSummary(schedule, principal)
calculateExtraPaymentSavings(baseSchedule, extraSchedule)
compareMortgageScenarios(scenarios)
parseMortgageInput(value)
formatCurrency(value)
formatPercent(value)
formatDuration(months)
```

### Tipos sugeridos

```ts
interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface MortgageSummary {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
  months: number;
  interestShare: number;
  principalShare: number;
}
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Tasa `0%` | Cuota = `monto / meses`; tabla sin intereses. |
| Plazo `1 año` | Tabla de 12 filas; cálculo normal. |
| Enganche `0%` | El préstamo equivale al precio completo. |
| Enganche `100%` | Estado informativo: no hay préstamo que calcular. |
| Pago extra mayor que saldo final | Última cuota ajustada; saldo final `$0.00`. |
| Pago extra muy alto | Liquidar anticipadamente y mostrar mes de liquidación. |
| Monto muy grande | No romper layout; resultados hacen wrap. |
| Plazo máximo `30 años` | Máximo 360 filas; paginar correctamente. |
| Tasa alta permitida | Calcular hasta `30%`; más de eso bloquea con advertencia. |
| Valores pegados con `$`, `%`, espacios o separadores | Normalizar si el formato es reconocible. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Cuota básica | `2,000,000`, `9%`, `20 años` | Cuota `$17,994.52`; total `$4,318,684.59`; intereses `$2,318,684.59`. |
| Tasa cero | `120,000`, `0%`, `1 año` | Cuota `$10,000.00`; intereses `$0.00`; 12 filas. |
| Enganche completo | Precio `$1,000,000`, enganche `100%` | Mostrar estado “no hay préstamo que calcular”. |
| Pago extra | `2,000,000`, `9%`, `20 años`, extra `$2,000` | Liquidación aproximada en `186` meses; ahorro aproximado `$606,852.18`. |
| Monto desde cuota | Cuota `$15,000`, `9%`, `20 años` | Monto máximo `$1,667,174.31`. |
| CSV | Hipoteca válida | CSV contiene todas las filas de amortización. |
| Último saldo | Cualquier hipoteca válida | Última fila muestra saldo `$0.00`. |
| Input inválido | Tasa `31%` | Bloquear cálculo y mostrar error específico. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest u otro runner de pruebas:

- Fórmula de cuota mensual con tasa positiva.
- Fórmula de cuota mensual con tasa `0`.
- Fórmula inversa para monto máximo desde cuota.
- Construcción de tabla de amortización.
- Ajuste de última cuota.
- Pago extra y liquidación anticipada.
- Redondeo y formato.
- Parsing de formatos comunes.

### E2E con Playwright

- Cambiar entre tipo de entrada `Precio + enganche` y `Solo préstamo`.
- Sincronizar enganche en porcentaje y monto.
- Escribir valores y ver resultado en tiempo real.
- Ver tabla paginada en móvil.
- Exportar CSV.
- Copiar resultado.
- Limpiar formulario.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Aviso legal

Texto visible debajo de los resultados:

```text
Los resultados son estimaciones orientativas. La cuota calculada incluye capital e intereses del crédito, pero no contempla seguros, impuestos, gastos notariales, avalúos, comisiones ni otros costos. Las condiciones reales dependen de la entidad financiera, tu perfil crediticio y la regulación aplicable.
```
