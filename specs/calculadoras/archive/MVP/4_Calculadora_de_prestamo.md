# Especificación v2 — Calculadora de Préstamo

## Descripción general

Herramienta para estimar las condiciones de un préstamo personal, de nómina,
automotriz, de consumo o entre particulares. La calculadora debe ayudar al
usuario a entender cuánto pagará al mes, cuánto terminará pagando en total,
cuánto corresponde a intereses y cómo evoluciona el saldo durante el plazo.

A diferencia de la calculadora de hipoteca, esta página está enfocada en montos
y plazos más cortos, con una experiencia rápida y cómoda en móvil. Los
resultados son estimaciones orientativas basadas en amortización francesa
(cuota fija), no asesoría financiera.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular la cuota mensual de un préstamo de forma clara y rápida.
- Mostrar costo total, intereses, comisiones y tabla de amortización.
- Permitir explorar el impacto de pagos extra mensuales.
- Ayudar a comparar el costo real de distintas opciones sin presentar el
  resultado como aprobación, oferta bancaria o asesoría financiera.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal:

- Calcular "¿cuánto pago al mes?".
- Incluir monto, tasa anual, plazo en meses, comisión de apertura, seguro
  mensual opcional y pago extra mensual opcional.
- Mostrar resumen: cuota mensual, pago mensual total, total pagado, intereses,
  comisión, costo total y CAT aproximado.
- Mostrar tabla de amortización paginada.
- Exportar amortización a CSV.
- Copiar resumen.
- Limpiar formulario.
- Incluir aviso legal visible.

### Fase 2

- Modo "¿cuánto puedo pedir prestado?".
- Modo "¿en cuánto tiempo liquido el préstamo?".
- Comparador de préstamos.
- Préstamo entre particulares con calendario de fechas.
- Historial de los últimos 5 cálculos en `sessionStorage`.
- Vista de impresión con `window.print()`.

### Fase 3

- Simulador de refinanciamiento.
- Selector de país, moneda e indicador financiero (`CAT`, `TAE`, `CAE`).
- Gráfica de composición del costo.
- Contenido específico por país.
- PDF con resumen y tabla.

> No implementar tasa variable en el MVP. Una tasa variable real requiere un
> calendario de cambios de tasa, supuestos adicionales y mensajes de riesgo más
> específicos.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-prestamo` |
| Alias opcional | `/calculadora-de-prestamo` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-prestamo.astro` |
| Lógica de cálculo | `src/lib/calculators/loan.ts` |
| Pruebas unitarias | `src/lib/calculators/loan.test.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |

> Si se usa el alias corto, definir si será ruta principal, redirección o página
> canónica duplicada. La página debe exponer un `canonical` único.

---

## Comportamiento mobile-first

- La calculadora debe aparecer como experiencia principal en el primer viewport.
- En móvil, usar una sola columna: datos de entrada, resultado principal,
  detalles, acciones y tabla.
- En pantallas medianas o grandes, usar un layout de dos columnas: formulario a
  la izquierda y resumen/acciones a la derecha.
- No usar una landing page antes de la herramienta.
- Los controles táctiles deben tener una altura mínima aproximada de `44px`.
- Los modos futuros deben usar tabs o control segmentado con scroll horizontal
  en móvil.
- La tabla debe vivir dentro de un contenedor con `overflow-x-auto`.
- Los resultados largos deben permitir salto de línea sin romper el layout.
- Evitar que la tabla completa empuje el resumen demasiado abajo en móvil:
  mostrar 12 filas por página.
- Usar tarjetas solo para resultados concretos, no para envolver secciones
  completas dentro de otras tarjetas.
- No depender únicamente del color para indicar advertencias, errores o mejor
  opción.

---

## Flujo principal MVP — ¿Cuánto pago al mes?

Modo por defecto al cargar la página.

**Ejemplo:** Pido `$50,000` a `24 meses` con `24%` de interés anual y `2%` de
comisión de apertura. ¿Cuánto pago al mes?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tipo de préstamo | Selector | Ver tabla de tipos | `Crédito personal banco` |
| Monto del préstamo | Texto numérico | `> 0` | vacío |
| Tasa de interés anual (%) | Texto numérico | `0%–120%` | vacío |
| Plazo del préstamo | Texto numérico | `1–120` meses | `24` |
| Comisión por apertura (%) | Texto numérico | `0%–20%` | `0` |
| Seguro mensual | Texto numérico opcional | `>= 0` | `0` |
| Pago extra mensual | Texto numérico opcional | `>= 0` | `0` |

### Reglas del formulario

- El selector de tipo de préstamo solo ajusta valores sugeridos; todos los
  campos siguen siendo editables.
- El plazo del MVP se captura en meses para evitar ambigüedad.
- La tasa es anual nominal y se convierte a tasa mensual dividiendo entre 12.
- La cuota base incluye capital e intereses.
- El pago mensual total visible incluye `cuota base + seguro mensual + pago
  extra mensual`.
- La comisión por apertura se muestra como costo inicial y se suma al costo
  total del crédito, pero no modifica la cuota base salvo que en una fase futura
  se permita financiar la comisión.
- Si `tasa = 0%`, calcular sin intereses.

---

## Fórmulas del MVP

### Variables

```text
monto = monto del préstamo
tasa_mensual = tasa_anual / 12 / 100
n = plazo_meses
comision_monto = monto * (comision_porcentaje / 100)
```

### Cuota mensual base

Si `tasa_mensual > 0`:

```text
cuota = monto * (tasa_mensual * (1 + tasa_mensual)^n)
              / ((1 + tasa_mensual)^n - 1)
```

Si `tasa_mensual = 0`:

```text
cuota = monto / n
```

### Tabla de amortización

Para cada mes:

```text
interes_mes = saldo_anterior * tasa_mensual
pago_planeado_capital_interes = cuota + pago_extra
capital_mes = min(pago_planeado_capital_interes - interes_mes, saldo_anterior)
pago_real_capital_interes = interes_mes + capital_mes
pago_real_total = pago_real_capital_interes + seguro_mensual
saldo_nuevo = saldo_anterior - capital_mes
```

Si `tasa_mensual = 0`:

```text
interes_mes = 0
capital_mes = min(cuota + pago_extra, saldo_anterior)
pago_real_capital_interes = capital_mes
pago_real_total = capital_mes + seguro_mensual
```

### Totales

```text
total_pagado = suma de pago_real_total en la tabla
total_intereses = suma de interes_mes en la tabla
total_seguros = seguro_mensual * meses_reales_de_pago
costo_total_credito = total_pagado + comision_monto
porcentaje_intereses = total_intereses / costo_total_credito * 100
```

> No usar solamente `cuota * n` cuando hay pago extra o última cuota ajustada.

---

## Output principal del MVP

Para el ejemplo `monto = 50,000`, `tasa = 24%`, `plazo = 24 meses`,
`comisión = 2%`, sin seguro ni pago extra:

| Resultado | Valor esperado |
|-----------|----------------|
| Cuota mensual base | `$2,643.55` |
| Pago mensual total | `$2,643.55` |
| Total pagado en cuotas | `$63,445.32` |
| Total de intereses | `$13,445.32` |
| Comisión por apertura | `$1,000.00` |
| Costo total del crédito | `$64,445.32` |
| CAT aproximado | `29.52% sin IVA` |

Mostrar una explicación breve:

```text
Con una tasa anual de 24% durante 24 meses, pagarías aproximadamente $2,643.55 al mes. Al final del plazo habrás pagado $13,445.32 en intereses, más $1,000.00 de comisión por apertura.
```

---

## Pago extra mensual

El pago extra se suma cada mes después de cubrir intereses y reduce
directamente el saldo pendiente.

**Ejemplo:** préstamo de `$50,000`, `24%`, `24 meses`, con `$500` extra al mes y
`2%` de comisión.

| Resultado | Valor esperado aproximado |
|-----------|---------------------------|
| Cuota base | `$2,643.55` |
| Pago mensual con extra | `$3,143.55` |
| Nuevo plazo efectivo | `20 meses` |
| Meses ahorrados | `4 meses` |
| Intereses con pago extra | `$10,788.35` |
| Ahorro en intereses | `$2,656.96` |
| Costo total con comisión | `$61,788.35` |

### Reglas

- El pago extra no cambia la cuota base; se muestra como adicional.
- Si el pago extra es `0`, no mostrar bloque de ahorro.
- Si el pago extra es mayor que la cuota base, mostrar advertencia informativa,
  pero permitir el cálculo.
- Si el pago extra liquida el saldo antes del plazo, cortar la tabla en el mes
  de liquidación.
- La última cuota debe ajustarse para no cobrar más del saldo pendiente.

---

## Comisión y seguro mensual

### Comisión por apertura

- Se calcula como porcentaje del monto del préstamo.
- Se muestra separada del total pagado en cuotas.
- En el MVP se asume pagada al inicio y no financiada.
- Se incluye en el costo total del crédito.
- Se incluye en el flujo para CAT aproximado como menor monto neto recibido.

### Seguro mensual

- Se suma al pago mensual total.
- No reduce capital.
- No genera intereses.
- Se incluye en `total_pagado`, `costo_total_credito` y CAT aproximado.
- Debe aparecer como columna opcional o nota en el resumen de la tabla.

---

## Cálculo del CAT aproximado

El CAT es el indicador estándar en México para comparar el costo real de un
crédito. En esta calculadora debe mostrarse como aproximación, con una nota
visible.

### Supuesto del MVP

```text
monto_neto_recibido = monto - comision_monto
flujos_mensuales = pago_real_total de cada mes
tir_mensual = tasa que iguala monto_neto_recibido con el valor presente de flujos_mensuales
CAT_aproximado = ((1 + tir_mensual)^12 - 1) * 100
```

Implementar la TIR mensual por búsqueda binaria o Newton-Raphson con límites y
fallback seguro. Si no converge, ocultar el valor y mostrar:

```text
No fue posible estimar el CAT con estos datos.
```

### Nota visible

```text
El CAT mostrado es una aproximación sin IVA. El CAT exacto lo determina la institución financiera según comisiones, seguros, impuestos, periodicidad y condiciones específicas del crédito.
```

### Equivalentes por país, fase 3

| País o región | Indicador |
|---------------|-----------|
| México | CAT |
| España / Unión Europea | TAE |
| Chile | CAE |
| Colombia | Tasa efectiva anual |

No mostrar un selector de país en el MVP.

---

## Tabla de amortización

La tabla muestra el detalle mes a mes de capital, intereses y saldo pendiente.

### Columnas

| Columna | Descripción |
|---------|-------------|
| Mes | Número de mes, de `1` hasta liquidación |
| Pago | Pago real del mes, incluyendo seguro y extra si aplica |
| Capital | Parte del pago que reduce saldo |
| Intereses | Interés generado por el saldo del mes anterior |
| Seguro | Seguro mensual, si es mayor a `0` |
| Saldo pendiente | Saldo después del pago |

### Presentación

- Mostrar 12 filas por página.
- Incluir selector de página.
- Incluir resumen debajo de la tabla:
  - total capital;
  - total intereses;
  - total seguros;
  - total pagado;
  - meses reales de duración.
- Exportar CSV con todas las filas, no solo la página visible.
- En móvil, permitir desplazamiento horizontal de la tabla.
- La última fila debe mostrar saldo `$0.00`.

---

## Modo fase 2 — ¿Cuánto puedo pedir prestado?

**Ejemplo:** Puedo pagar `$3,000` al mes a `18 meses` con `20%` de interés
anual. ¿Cuánto me prestan?

### Inputs

- Cuota mensual máxima.
- Tasa de interés anual.
- Plazo en meses.

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

Para `cuota = 3,000`, `tasa = 20%`, `plazo = 18 meses`:

| Resultado | Valor esperado |
|-----------|----------------|
| Monto máximo del préstamo | `$46,322.60` |
| Total que pagarás | `$54,000.00` |
| Total en intereses | `$7,677.40` |

---

## Modo fase 2 — ¿En cuánto tiempo liquido el préstamo?

**Ejemplo:** Me prestaron `$30,000` al `18%` anual y puedo pagar `$1,800` al
mes. ¿Cuándo termino de pagar?

### Inputs

- Monto del préstamo.
- Tasa de interés anual.
- Cuota mensual que pagaré.
- Fecha de inicio opcional.

### Fórmula

Si `tasa_mensual > 0`:

```text
n = -log(1 - (monto * tasa_mensual / cuota))
      / log(1 + tasa_mensual)
```

Si `tasa_mensual = 0`:

```text
n = monto / cuota
```

El número teórico se redondea hacia arriba para construir el calendario, y la
última cuota se ajusta.

### Output esperado

Para `monto = 30,000`, `tasa = 18%`, `cuota = 1,800`:

| Resultado | Valor esperado |
|-----------|----------------|
| Plazo teórico | `19.32 meses` |
| Plazo efectivo | `20 meses` |
| Último pago ajustado | `$583.05` |
| Total pagado | `$34,783.05` |
| Total en intereses | `$4,783.05` |

### Validación especial

Si `cuota <= monto * tasa_mensual`, bloquear cálculo y mostrar:

```text
Con esa cuota no liquidarás el préstamo porque el pago no cubre los intereses mensuales.
```

---

## Modo fase 2 — Comparador de préstamos

**Ejemplo:** El banco A ofrece `22%` a `12 meses` con `2%` de comisión, el banco
B ofrece `19%` a `18 meses` sin comisión y el banco C ofrece `21%` a `24 meses`
con `1%` de comisión.

### Inputs

- Monto del préstamo.
- Préstamo A: tasa, plazo y comisión de apertura.
- Préstamo B: tasa, plazo y comisión de apertura.
- Préstamo C opcional: tasa, plazo y comisión de apertura.

### Output esperado

Para `monto = 40,000`:

| Concepto | Préstamo A | Préstamo B | Préstamo C |
|----------|------------|------------|------------|
| Tasa anual | `22%` | `19%` | `21%` |
| Plazo | `12 meses` | `18 meses` | `24 meses` |
| Cuota mensual | `$3,743.78` | `$2,571.34` | `$2,055.43` |
| Comisión apertura | `$800.00` | `$0.00` | `$400.00` |
| Total intereses | `$4,925.30` | `$6,284.11` | `$9,330.22` |
| Costo total | `$45,725.30` | `$46,284.11` | `$49,730.22` |
| CAT aproximado | `29.27%` | `20.75%` | `24.43%` |

- Destacar visualmente la opción con menor costo total.
- No depender solo del color; incluir una etiqueta como `Menor costo total`.
- Mostrar la nota: `Menor cuota no siempre significa menor costo total.`

---

## Modo fase 2 — Préstamo entre particulares

**Ejemplo:** Le presto `$10,000` a una persona a `6 meses` con `8%` anual.
¿Cuánto debe pagar cada mes?

### Inputs

- Monto prestado.
- Tasa de interés anual, puede ser `0%`.
- Plazo en meses.
- Fecha de inicio.

### Output esperado

Para `monto = 10,000`, `tasa = 8%`, `plazo = 6 meses`:

| Resultado | Valor esperado |
|-----------|----------------|
| Cuota mensual | `$1,705.77` |
| Total a recibir | `$10,234.63` |
| Intereses ganados | `$234.63` |

Calendario de pagos con fechas exactas:

| Pago | Fecha | Cuota | Capital | Intereses | Saldo |
|------|-------|-------|---------|-----------|-------|
| 1 | 01/06/2026 | `$1,705.77` | `$1,639.10` | `$66.67` | `$8,360.90` |
| 2 | 01/07/2026 | `$1,705.77` | `$1,650.03` | `$55.74` | `$6,710.86` |
| 3 | 01/08/2026 | `$1,705.77` | `$1,661.03` | `$44.74` | `$5,049.83` |
| 4 | 01/09/2026 | `$1,705.77` | `$1,672.11` | `$33.67` | `$3,377.73` |
| 5 | 01/10/2026 | `$1,705.77` | `$1,683.25` | `$22.52` | `$1,694.47` |
| 6 | 01/11/2026 | `$1,705.77` | `$1,694.47` | `$11.30` | `$0.00` |

### Reglas de fechas

- La fecha del primer pago es un mes después de la fecha de inicio.
- Si la fecha de inicio cae al final de mes, ajustar al último día válido del
  mes siguiente. Ejemplo: `31/01/2026` pasa a `28/02/2026`.
- Usar fechas locales, sin depender de zonas horarias UTC.
- Compartir por WhatsApp queda fuera del MVP.

---

## Modo fase 3 — Simulador de refinanciamiento

**Ejemplo:** Tengo un préstamo al `28%` y me ofrecen refinanciar al `20%`.
¿Me conviene?

### Inputs

- Saldo pendiente actual.
- Meses restantes actuales.
- Tasa actual.
- Nueva tasa ofrecida.
- Comisión por refinanciar.

### Output esperado

Para `saldo = 25,000`, `12 meses`, `tasa actual = 28%`, `nueva tasa = 20%`,
`comisión = 1.5%`:

| Resultado | Valor esperado aproximado |
|-----------|---------------------------|
| Cuota actual | `$2,412.65` |
| Cuota refinanciada | `$2,315.86` |
| Ahorro mensual | `$96.79` |
| Ahorro bruto en intereses | `$1,161.44` |
| Costo del refinanciamiento | `$375.00` |
| Ahorro neto estimado | `$786.44` |
| ¿Conviene? | `Sí, recuperas el costo en 4 meses` |

---

## Tipos de préstamo

Selector orientativo que ajusta valores por defecto de tasa y plazo. Todos los
valores deben poder editarse manualmente.

| Tipo de préstamo | Tasa referencial | Plazo típico |
|------------------|------------------|--------------|
| Crédito personal banco | `18%–36%` | `12–48 meses` |
| Préstamo de nómina | `12%–24%` | `6–36 meses` |
| Financiamiento de auto | `8%–16%` | `24–60 meses` |
| Tarjeta de crédito | `36%–60%` | `1–36 meses` |
| Crédito entre particulares | `0%–12%` | `1–24 meses` |
| Microcrédito / fintech | `40%–120%` | `1–12 meses` |

Mostrar aviso:

```text
Las tasas son orientativas. Consulta las condiciones exactas con tu institución financiera.
```

> Las tasas referenciales son contenido editorial. Si se publican como rangos
> actuales por país, deben revisarse periódicamente.

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
| Monto `<= 0` | Error: `Ingresa un monto mayor a cero.` |
| Tasa `< 0` | Error: `La tasa no puede ser negativa.` |
| Tasa `= 0` | Permitida; calcular sin intereses. |
| Tasa `> 120%` | Bloquear cálculo y advertir que la tasa es demasiado alta. |
| Tasa `> 80%` | Mostrar advertencia informativa, pero permitir hasta `120%`. |
| Plazo `< 1` o `> 120` | Bloquear cálculo. |
| Plazo con decimales | Error: `Ingresa un plazo en meses completos.` |
| Comisión `< 0` | Error: `La comisión no puede ser negativa.` |
| Comisión `> 20%` | Bloquear cálculo. |
| Comisión `> 10%` | Mostrar advertencia informativa, pero permitir hasta `20%`. |
| Seguro mensual `< 0` | Error. |
| Pago extra `< 0` | Error. |
| Pago extra `> cuota base` | Advertencia informativa; permitir cálculo. |
| Cuota insuficiente en modo liquidación | Bloquear cálculo. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos o defaults, sin error. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar resumen, explicación, tabla y acciones. |
| Inválido | Mostrar mensaje específico y no actualizar tabla ni historial. |
| Con pago extra | Mostrar comparación entre plazo original y plazo efectivo. |
| CAT no estimable | Ocultar valor y mostrar nota de cálculo no disponible. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Exportando CSV | Generar archivo en cliente con Blob API. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo | Formato |
|------|---------|
| Moneda | `$2,643.55`, siempre con 2 decimales en resultados financieros. |
| Porcentaje | Máximo 2 decimales: `29.52%`. |
| Meses | Número entero. |
| Plazo efectivo | `1 año 8 meses`; si es menor a un año, `6 meses`. |
| Fechas de pago | `01/06/2026` o `1 de junio de 2026`. |
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
- Debe incluir: monto, tasa, plazo, cuota, total pagado, intereses, comisión y
  costo total.
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
amortizacion-prestamo.csv
```

- Encabezados sugeridos:

```text
mes,pago,capital,intereses,seguro,saldo_pendiente
```

---

## Features fuera del MVP

### Historial de cálculos

- Guardar los últimos 5 escenarios válidos en `sessionStorage`.
- No guardar cálculos inválidos.
- No guardar duplicados consecutivos idénticos.
- Al hacer clic en un escenario, restaurar inputs y recalcular.
- No usar `localStorage` para evitar persistencia innecesaria.

### Gráfica de composición

No usar Chart.js en el MVP. Si se implementa después:

- Preferir una visualización ligera con SVG o canvas propio.
- Mostrar capital, intereses, comisiones y seguros.
- Incluir tooltip o detalle accesible.
- Verificar que no afecte el rendimiento en móvil.

### PDF / impresión

- Usar `window.print()` con estilos de impresión.
- Incluir resumen, aviso legal y tabla completa o paginada según el tamaño.

### Compartir por WhatsApp

- Generar un texto resumido.
- Abrir `https://wa.me/?text=...`.
- No compartir datos automáticamente sin acción explícita del usuario.

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
- No depender únicamente del color para comunicar error, ahorro o mejor opción.
- La navegación debe funcionar con teclado.
- Las acciones de copiar/exportar deben informar éxito o error sin depender de
  alertas del navegador.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Préstamo Online — Cuota, Intereses y Amortización` |
| Description | `Calcula la cuota mensual de tu préstamo personal, automotriz o entre particulares. Compara intereses, costo total y tabla de amortización. Gratis y sin registro.` |
| Canonical | URL final de la calculadora |

### Estructura sugerida

- `h1`: Calculadora de préstamo
- Intro breve orientada a uso.
- Calculadora interactiva.
- Explicación de qué incluye la cuota.
- Ejemplo de cálculo.
- Explicación de la tabla de amortización.
- Contenido sobre CAT aproximado.
- FAQ.

### FAQ sugeridas

- ¿Cómo se calcula la cuota mensual de un préstamo?
- ¿Qué es el CAT de un crédito?
- ¿Qué diferencia hay entre tasa de interés y CAT?
- ¿Cómo saber cuánto pagaré en total por un préstamo?
- ¿Conviene pagar un préstamo antes de tiempo?
- ¿Qué es la amortización de un crédito?
- ¿Qué pasa si hago pagos extra?
- ¿La calculadora incluye comisiones y seguros?

### Schema.org

Agregar JSON-LD para `FAQPage` si el contenido de FAQ está visible en la
página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/finanzas/calculadora-de-prestamo.astro
src/lib/calculators/loan.ts
src/lib/calculators/loan.test.ts
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
- Mantener consistencia visual con las páginas existentes (`BaseLayout`,
  `Breadcrumb`, fondo oscuro y acentos sobrios).

### Funciones puras sugeridas

```ts
calculateMonthlyPayment(principal, annualRate, months)
calculateLoanAmountFromPayment(payment, annualRate, months)
calculatePayoffMonths(principal, annualRate, payment)
buildAmortizationSchedule({ principal, annualRate, months, extraPayment, monthlyInsurance })
calculateLoanSummary(schedule, principal, openingFee)
calculateExtraPaymentSavings(baseSchedule, extraSchedule)
calculateApproximateCat({ principal, openingFee, schedule })
compareLoanScenarios(scenarios)
parseLoanInput(value)
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
  insurance: number;
  remainingBalance: number;
}

interface LoanSummary {
  monthlyPayment: number;
  totalMonthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalInsurance: number;
  openingFee: number;
  totalCost: number;
  months: number;
  approximateCat: number | null;
}

interface LoanScenario {
  label: string;
  principal: number;
  annualRate: number;
  months: number;
  openingFeePercent: number;
}
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Tasa `0%` | Cuota = `monto / meses`; tabla sin intereses. |
| Plazo `1 mes` | Un solo pago con interés de un mes si aplica. |
| Monto muy pequeño | Funcionar con normalidad. |
| Monto muy grande | No romper layout; resultados hacen wrap. |
| Pago extra muy alto | Liquidar anticipadamente y ajustar última cuota. |
| Pago extra mayor que cuota | Advertir, pero permitir cálculo. |
| Seguro mensual alto | Mostrarlo separado para no confundirlo con capital/interés. |
| Comisión `0%` | No mostrar como costo relevante o mostrar `$0.00` de forma discreta. |
| Cuota insuficiente | Bloquear modo de liquidación. |
| Fecha de inicio en fin de mes | Ajustar siguiente pago al último día válido del mes. |
| Último saldo residual por decimales | Forzar visualmente `$0.00` en la última fila. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Cuota básica | `$50,000`, `24%`, `24 meses` | Cuota `$2,643.55`; intereses `$13,445.32`; total cuotas `$63,445.32`. |
| Comisión | `$50,000`, `24%`, `24 meses`, comisión `2%` | Comisión `$1,000.00`; costo total `$64,445.32`; CAT aprox. `29.52%`. |
| Tasa cero | `$12,000`, `0%`, `12 meses` | Cuota `$1,000.00`; intereses `$0.00`; 12 filas. |
| Pago extra | `$50,000`, `24%`, `24 meses`, extra `$500` | Liquidación en `20` meses; ahorro aproximado `$2,656.96`. |
| Monto desde cuota | Cuota `$3,000`, `20%`, `18 meses` | Monto máximo `$46,322.60`. |
| Liquidación por cuota | `$30,000`, `18%`, cuota `$1,800` | Plazo efectivo `20` meses; último pago `$583.05`. |
| Comparador | `$40,000` con escenarios A/B/C del spec | Gana préstamo A por menor costo total. |
| CSV | Préstamo válido | CSV contiene todas las filas de amortización. |
| Último saldo | Cualquier préstamo válido | Última fila muestra saldo `$0.00`. |
| Input inválido | Tasa `121%` | Bloquear cálculo y mostrar error específico. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest:

- Fórmula de cuota mensual con tasa positiva.
- Fórmula de cuota mensual con tasa `0`.
- Fórmula inversa para monto máximo desde cuota.
- Cálculo de plazo desde cuota.
- Construcción de tabla de amortización.
- Ajuste de última cuota.
- Pago extra y liquidación anticipada.
- Comisión y seguro mensual en resumen.
- CAT aproximado con flujo simple.
- Parsing de formatos comunes.
- Formato de moneda, porcentaje y duración.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Ver tabla paginada en móvil.
- Exportar CSV.
- Copiar resultado.
- Limpiar formulario.
- Validar mensajes de error.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Aviso legal

Texto visible debajo de los resultados:

```text
Los resultados son estimaciones orientativas basadas en un sistema de amortización francés de cuota fija. La cuota calculada incluye capital e intereses; los seguros, comisiones y otros cargos se muestran según los datos capturados. Las condiciones reales dependen de la institución financiera, tu perfil crediticio, impuestos aplicables y regulación vigente. Esta herramienta no constituye asesoría financiera ni una oferta de crédito.
```
