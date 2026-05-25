# Especificación v2 — Calculadora de Interés Compuesto

## Descripción general

Herramienta para estimar el crecimiento de una inversión o ahorro mediante
interés compuesto. La página debe ser clara, educativa y cómoda en móvil: el
usuario debe poder introducir pocos datos, ver el monto final al instante y
entender cuánto proviene de aportaciones y cuánto de rendimientos.

Orientada a tres perfiles:

- Ahorradores que quieren proyectar una meta.
- Inversores que comparan escenarios de rendimiento.
- Estudiantes que aprenden el concepto de interés compuesto.

La calculadora debe explicar que los resultados son estimaciones. Asume una
tasa constante y no contempla impuestos, comisiones, cambios de tasa ni
variaciones de mercado.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular cuánto podría crecer una inversión con capital inicial,
  aportaciones periódicas y tasa anual.
- Separar visualmente capital aportado e intereses generados.
- Mostrar el efecto de la frecuencia de capitalización sin abrumar al usuario.
- Permitir ajustar por inflación para mostrar valor real aproximado.
- Generar una página estática optimizada para SEO en Astro.
- Mantener una experiencia mobile-first: la calculadora es el primer producto
  visible, no una landing antes de la herramienta.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal:

- Modo principal: `¿Cuánto crecerá mi dinero?`
- Capital inicial.
- Tasa de interés anual.
- Plazo en años o meses.
- Frecuencia de capitalización.
- Aportación periódica opcional.
- Frecuencia de aportación mensual o anual.
- Aportación al inicio o al final del período.
- Inflación anual opcional.
- Resumen: monto final, aportaciones totales, intereses, valor real.
- Regla del 72.
- Tabla de crecimiento año a año.
- Comparador de frecuencias usando los mismos inputs, mostrado como bloque
  secundario o acordeón.
- Copiar resultado.
- Limpiar formulario.
- Exportar tabla anual a CSV.
- Aviso legal visible.

### Fase 2

- Modo inverso: `¿Cuánto necesito invertir hoy?`
- Modo inverso: `¿Cuánto tiempo necesito?`
- Modo inverso: `¿Qué tasa necesito?`
- Simulador de escenarios conservador / base / optimista.
- Historial de las últimas 5 simulaciones en `sessionStorage`.
- Selector de moneda y locale.

### Fase 3

- Gráfica interactiva de crecimiento.
- Exportar vista imprimible con `window.print()`.
- Contenido editorial con benchmarks por país.
- Comparador avanzado de escenarios guardados.

> No implementar Chart.js en el MVP. Si se añade una gráfica después, preferir
> SVG o canvas propio para mantener la página ligera en móvil.

---

## Ruta y archivo sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-interes-compuesto` |
| Alias opcional | `/calculadora-interes-compuesto` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-interes-compuesto.astro` |
| Lógica de cálculo | `src/lib/calculators/compoundInterest.ts` |
| Pruebas unitarias | `src/lib/calculators/compoundInterest.test.ts` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |
| Lógica cliente | JavaScript o TypeScript vanilla |

---

## Comportamiento mobile-first

- La calculadora debe aparecer en el primer viewport.
- En móvil, usar una sola columna: inputs, resultado principal, detalles,
  acciones y tabla.
- En pantallas medianas o grandes, se puede usar un layout de dos columnas:
  formulario a la izquierda y resumen a la derecha.
- Evitar cinco modos visibles como tabs en el MVP; en móvil eso complica la
  decisión inicial. Los modos inversos deben quedar para fase 2.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- Usar `input type="text"` con `inputmode="decimal"` para aceptar valores
  pegados con `$`, `%`, espacios y separadores.
- La tabla debe estar dentro de un contenedor con `overflow-x-auto`.
- Los resultados largos deben permitir salto de línea sin romper el layout.
- No usar cards dentro de cards. Las cards deben reservarse para resultados
  concretos o elementos repetidos.
- No depender solo del color para comunicar advertencias o mejores escenarios.

---

## MVP — ¿Cuánto crecerá mi dinero?

**Ejemplo:** Tengo `$10,000` hoy, aporto `$500` al mes, invierto al `8%` anual
con capitalización mensual durante `20 años`. ¿Cuánto tendré?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Capital inicial | Texto numérico | `>= 0` | vacío |
| Tasa de interés anual (%) | Texto numérico | `0%–100%` | vacío |
| Plazo | Texto numérico | `1 mes–100 años` | vacío |
| Unidad de plazo | Selector | `Meses` / `Años` | `Años` |
| Frecuencia de capitalización | Selector | ver tabla | `Mensual` |
| Aportación periódica | Texto numérico opcional | `>= 0` | `0` |
| Frecuencia de aportación | Selector | `Mensual` / `Anual` | `Mensual` |
| Momento de aportación | Selector | `Al inicio` / `Al final` | `Al final` |
| Inflación anual opcional (%) | Texto numérico opcional | `0%–30%` | vacío |

### Frecuencias de capitalización disponibles

| Frecuencia | Valor interno |
|------------|---------------|
| Anual | `1` |
| Semestral | `2` |
| Trimestral | `4` |
| Mensual | `12` |
| Quincenal | `24` |
| Semanal | `52` |
| Diaria | `365` |
| Continua | `continuous` |

---

## Fórmulas y algoritmo

### Variables

```text
P = capital inicial
r = tasa anual nominal en decimal
t = tiempo en años
n = frecuencia de capitalización por año
A = aportación periódica
M = monto final
```

### Factor de crecimiento

Si la capitalización es finita:

```text
factor(r, n, años) = (1 + r / n) ^ (n * años)
```

Si la capitalización es continua:

```text
factor(r, continuous, años) = e ^ (r * años)
```

Si `r = 0`:

```text
factor = 1
```

### Sin aportaciones periódicas

```text
M = P * factor(r, n, t)
```

### Con aportaciones periódicas

Para evitar errores cuando la frecuencia de aportación no coincide con la
frecuencia de capitalización, usar un algoritmo por eventos:

```text
monto_final = P * factor(r, n, plazo_años)

para cada aportación:
  años_restantes = plazo_años - año_en_que_ocurre_la_aportación
  monto_final += A * factor(r, n, años_restantes)
```

Reglas:

- Si la aportación es mensual, generar una aportación por cada mes del plazo.
- Si es anual, generar una aportación por cada año completo correspondiente.
- Si es `Al final`, una aportación mensual ocurre al final del mes y no genera
  interés durante ese mismo mes.
- Si es `Al inicio`, una aportación mensual ocurre al inicio del mes y sí genera
  interés durante ese mes.
- Para plazos en años, convertir internamente a meses:

```text
plazo_meses = round(plazo_años * 12)
```

> La fórmula cerrada de anualidad solo debe usarse cuando la frecuencia de
> aportación coincide con la frecuencia de capitalización. El algoritmo por
> eventos es más claro y cubre todos los casos del MVP.

### Fórmula cerrada de referencia

Si la aportación ocurre al final de cada período y coincide con la
capitalización:

```text
M = P * (1 + r/n)^(n*t)
  + A * (((1 + r/n)^(n*t) - 1) / (r/n))
```

Si la aportación ocurre al inicio de cada período:

```text
M = P * (1 + r/n)^(n*t)
  + A * (((1 + r/n)^(n*t) - 1) / (r/n)) * (1 + r/n)
```

Para `r = 0`, no usar división entre cero:

```text
M = P + aportaciones_totales
```

---

## Output principal del MVP

Para el ejemplo:

```text
P = 10,000
r = 8%
t = 20 años
n = 12
A = 500 mensuales
aportación = al final del mes
```

| Resultado | Valor esperado |
|-----------|----------------|
| Capital inicial | `$10,000.00` |
| Aportaciones totales | `$120,000.00` |
| Total aportado | `$130,000.00` |
| Intereses generados | `$213,778.24` |
| Monto final | `$343,778.24` |
| Multiplicador sobre total aportado | `2.6×` |
| Rentabilidad sobre total aportado | `+164.44%` |

Texto sugerido:

```text
Si inviertes $10,000.00 y aportas $500.00 al mes durante 20 años a una tasa anual de 8%, podrías llegar a $343,778.24. De ese total, $213,778.24 serían intereses generados.
```

---

## Ajuste por inflación

El ajuste por inflación es opcional. Si el usuario captura inflación anual, se
muestra el poder adquisitivo aproximado en dinero de hoy.

### Fórmulas

```text
valor_real = monto_futuro / (1 + inflacion)^t
perdida_poder_adquisitivo = monto_futuro - valor_real
tasa_real_aproximada = ((1 + tasa_nominal) / (1 + inflacion)) - 1
```

### Output esperado

Para `monto_futuro = $343,778.24`, inflación `4%` y plazo `20 años`:

| Resultado | Valor esperado |
|-----------|----------------|
| Monto nominal | `$343,778.24` |
| Valor real aproximado | `$156,895.90` |
| Pérdida de poder adquisitivo | `$186,882.34` |
| Tasa real aproximada | `3.85%` |

Si la inflación es mayor que la tasa nominal, mostrar advertencia:

```text
Tu dinero crecería en términos nominales, pero perdería poder adquisitivo en términos reales.
```

---

## Regla del 72

Mostrar junto a los resultados cuando la tasa anual sea mayor que `0`.

### Fórmula

```text
años_para_duplicar = 72 / tasa_anual_porcentual
```

### Ejemplo

```text
A una tasa anual de 8%, tu dinero se duplica aproximadamente cada 9 años.
```

Si `tasa = 0`, no mostrar la regla o mostrar:

```text
Con una tasa de 0%, el dinero no se duplica por intereses.
```

---

## Tabla de crecimiento año a año

La tabla debe generarse desde los mismos datos del cálculo principal.

### Columnas

| Columna | Descripción |
|---------|-------------|
| Año | Año de la simulación |
| Aportaciones del año | Aportaciones realizadas durante ese año |
| Total aportado | Capital inicial + aportaciones acumuladas |
| Intereses acumulados | Monto acumulado - total aportado |
| Total acumulado | Monto al cierre del año |

### Ejemplo esperado

Para `$10,000`, `8%`, `$500` mensuales al final del mes, capitalización
mensual:

| Año | Aportaciones del año | Total aportado | Intereses acumulados | Total acumulado |
|-----|----------------------|----------------|----------------------|-----------------|
| 1 | `$6,000.00` | `$16,000.00` | `$1,054.96` | `$17,054.96` |
| 2 | `$6,000.00` | `$22,000.00` | `$2,695.47` | `$24,695.47` |
| 5 | `$6,000.00` | `$40,000.00` | `$11,636.89` | `$51,636.89` |
| 10 | `$6,000.00` | `$70,000.00` | `$43,669.42` | `$113,669.42` |
| 20 | `$6,000.00` | `$130,000.00` | `$213,778.24` | `$343,778.24` |

### Presentación

- Mostrar todas las filas anuales hasta `100` años.
- En móvil, permitir scroll horizontal.
- Resaltar años hito cuando el monto alcance `2×`, `3×`, `5×` del total
  aportado.
- Exportar CSV con todas las filas, no solo las visibles.

---

## Comparador de frecuencias de capitalización

En el MVP, mostrarlo como sección secundaria usando capital inicial, tasa y
plazo del formulario principal. Para evitar ambigüedad, el comparador de
frecuencias debe calcularse **sin aportaciones periódicas** o debe explicar que
la comparación ignora aportaciones.

Ejemplo: `$10,000`, `8%`, `10 años`.

| Frecuencia | Veces/año | Monto final | Intereses | Diferencia vs anual |
|------------|-----------|-------------|-----------|---------------------|
| Anual | `1` | `$21,589.25` | `$11,589.25` | `—` |
| Semestral | `2` | `$21,911.23` | `$11,911.23` | `+$321.98` |
| Trimestral | `4` | `$22,080.40` | `$12,080.40` | `+$491.15` |
| Mensual | `12` | `$22,196.40` | `$12,196.40` | `+$607.15` |
| Quincenal | `24` | `$22,225.82` | `$12,225.82` | `+$636.57` |
| Semanal | `52` | `$22,241.73` | `$12,241.73` | `+$652.48` |
| Diaria | `365` | `$22,253.46` | `$12,253.46` | `+$664.21` |
| Continua | `∞` | `$22,255.41` | `$12,255.41` | `+$666.16` |

Reglas:

- Destacar la fila de mayor rendimiento con texto, por ejemplo
  `Mayor rendimiento`.
- Mostrar nota:

```text
La capitalización continua es un límite matemático teórico.
```

---

## Modos inversos — Fase 2

### ¿Cuánto necesito invertir hoy?

**Ejemplo:** Quiero tener `$1,000,000` en `15 años` con tasa anual `10%` y
capitalización anual.

#### Inputs

- Monto objetivo.
- Tasa de interés anual.
- Plazo.
- Frecuencia de capitalización.

#### Fórmula

```text
P = M / factor(r, n, t)
```

#### Output esperado

| Resultado | Valor esperado |
|-----------|----------------|
| Capital inicial necesario | `$239,392.05` |
| Intereses que trabajarán por ti | `$760,607.95` |
| Porcentaje del objetivo generado por intereses | `76.06%` |

### ¿Cuánto tiempo necesito?

**Ejemplo:** Tengo `$20,000` y quiero llegar a `$100,000` con tasa anual `7%` y
capitalización anual.

#### Sin aportaciones

```text
t = log(M / P) / (n * log(1 + r/n))
```

Para el ejemplo, el tiempo esperado es aproximadamente:

```text
23 años y 9 meses
```

La fecha estimada debe calcularse con la fecha actual del navegador:

```text
fecha_estimada = mes_año_actual + duración
```

#### Con aportaciones

No usar la fórmula logarítmica. Resolver por búsqueda numérica o simulación por
meses hasta `1200` meses:

```text
para mes = 1 hasta 1200:
  calcular monto acumulado en ese mes
  si monto >= objetivo:
    devolver mes
```

Si no se alcanza el objetivo dentro de `100 años`, mostrar:

```text
Con estos datos no se alcanza el objetivo dentro del plazo máximo de 100 años.
```

### ¿Qué tasa necesito?

**Ejemplo:** Tengo `$50,000` y quiero `$200,000` en `10 años` con capitalización
anual.

#### Fórmula

```text
r = n * ((M / P) ^ (1 / (n * t)) - 1)
```

#### Output esperado

| Resultado | Valor esperado |
|-----------|----------------|
| Tasa anual nominal necesaria | `14.87%` |
| Tasa mensual equivalente aproximada | `1.16%` |

Si hay aportaciones periódicas, resolver tasa por búsqueda numérica. No usar la
fórmula directa.

---

## Simulador de escenarios — Fase 2

Mostrar tres escenarios a partir de la tasa ingresada:

- Conservador: `tasa - 2 puntos porcentuales`, mínimo `0%`.
- Base: tasa ingresada.
- Optimista: `tasa + 2 puntos porcentuales`.

Ejemplo para `$10,000`, `$500` mensuales, `20 años`, capitalización mensual:

| Escenario | Tasa | Monto final | Intereses |
|-----------|------|-------------|-----------|
| Conservador | `6%` | `$264,122` | `$134,122` |
| Base | `8%` | `$343,778` | `$213,778` |
| Optimista | `10%` | `$452,965` | `$322,965` |

No depender solo del color; incluir etiquetas textuales.

---

## Benchmarks de referencia — Fase 3

Los benchmarks financieros cambian con frecuencia. No deben tratarse como datos
permanentes dentro del MVP.

Si se muestran, deben ser contenido editorial con:

- Fecha visible de actualización.
- Fuente revisada manualmente.
- País o mercado explícito.
- Aviso de que son referencias aproximadas.

Texto sugerido:

```text
Estos rangos son referencias educativas y pueden cambiar. Los rendimientos pasados no garantizan rendimientos futuros.
```

No incluir valores fechados como `2024–2025` sin un proceso de revisión antes de
publicar.

---

## Parsing y validación de inputs

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `1000` | `1000` |
| `1,000.50` | `1000.5` |
| `$1,000.50` | `1000.5` |
| `1.000,50` | `1000.5` |
| `8%` | `8` |
| ` 8 % ` | `8` |

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Campo vacío | No calcular; mostrar estado neutral o error si el campo ya fue tocado. |
| Capital inicial `< 0` | Error: `El capital inicial no puede ser negativo.` |
| Capital inicial `= 0` | Permitido si hay aportaciones periódicas. |
| Capital inicial + aportaciones `= 0` | Error: `Ingresa capital inicial o aportaciones.` |
| Tasa `< 0` | Error: `La tasa no puede ser negativa.` |
| Tasa `= 0` | Permitida; monto final = capital + aportaciones. |
| Tasa `> 100%` | Bloquear cálculo. |
| Tasa `> 50%` | Mostrar advertencia de tasa inusualmente alta, pero permitir si `<= 100%`. |
| Plazo `< 1 mes` | Bloquear cálculo. |
| Plazo `> 100 años` | Bloquear cálculo. |
| Aportación `< 0` | Error. |
| Inflación `< 0` | Error. |
| Inflación `> 30%` | Bloquear cálculo. |
| Inflación `> 20%` | Advertencia informativa. |
| Objetivo `<= capital inicial` | Error en modos inversos. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos o defaults de selectores; sin error. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar resumen, explicación, tabla y acciones. |
| Inválido | Mostrar error específico y no actualizar tabla ni historial. |
| Tasa cero | Mostrar resultado sin intereses y ocultar Regla del 72. |
| Inflación mayor que tasa | Mostrar advertencia de poder adquisitivo. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Exportando CSV | Generar archivo en cliente con Blob API. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo | Formato |
|------|---------|
| Moneda | `$343,778.24`, siempre con 2 decimales en resultados financieros. |
| Porcentaje | Máximo 2 decimales: `14.87%`. |
| Tiempo | `23 años y 9 meses`; si es menor a un año, `9 meses`. |
| Multiplicador | 1 decimal: `2.6×`. |
| Fechas estimadas | Mes y año: `febrero 2050`. |
| CSV | Valores sin símbolo de moneda, con punto decimal. |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar resultados.
- Para pruebas unitarias, comparar con tolerancia cuando aplique.

---

## Acciones del MVP

### Copiar resultado

Debe copiar un resumen en texto plano con:

- Capital inicial.
- Aportación periódica.
- Tasa anual.
- Plazo.
- Frecuencia de capitalización.
- Monto final.
- Aportaciones totales.
- Intereses generados.
- Valor real si hay inflación.

Si `navigator.clipboard` no está disponible, usar fallback o mostrar error.

### Limpiar

- Restaura los valores por defecto.
- Limpia errores y resultados.
- No recarga la página.

### Exportar CSV

Exporta la tabla anual completa.

Nombre sugerido:

```text
interes-compuesto.csv
```

Encabezados sugeridos:

```text
anio,aportaciones_anio,total_aportado,intereses_acumulados,total_acumulado
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
- No depender únicamente del color para comunicar error, advertencia o mejor
  escenario.
- La navegación debe funcionar con teclado.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Interés Compuesto — Simula tu Inversión` |
| Description | `Calcula cuánto puede crecer tu dinero con interés compuesto. Simula aportaciones, inflación y crecimiento año a año. Gratis y sin registro.` |
| Canonical | URL final de la calculadora |

### Estructura sugerida

- `h1`: Calculadora de interés compuesto.
- Intro breve orientada a uso.
- Calculadora interactiva.
- Explicación corta de resultados.
- Tabla de crecimiento.
- Comparador de frecuencias.
- Explicación de interés compuesto vs interés simple.
- FAQ.
- Aviso legal.

### FAQ sugeridas

- ¿Qué es el interés compuesto?
- ¿Cómo se calcula el interés compuesto?
- ¿Cuál es la diferencia entre interés simple e interés compuesto?
- ¿Qué es la regla del 72?
- ¿Qué frecuencia de capitalización conviene más?
- ¿Cómo afectan las aportaciones periódicas?
- ¿Cómo afecta la inflación a mis ahorros?
- ¿La calculadora considera impuestos o comisiones?

### Schema.org

Agregar JSON-LD para `FAQPage` si el contenido de FAQ está visible en la página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/finanzas/calculadora-de-interes-compuesto.astro
src/lib/calculators/compoundInterest.ts
src/lib/calculators/compoundInterest.test.ts
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
- Reutilizar, si conviene, patrones ya existentes de parsing, formato,
  historial y accesibilidad de la calculadora de porcentajes.

### Funciones puras sugeridas

```ts
calculateGrowthFactor(rate, compoundingFrequency, years)
calculateCompoundInterest(input)
buildContributionEvents(input)
buildAnnualGrowthRows(input)
compareCompoundingFrequencies(input)
calculateInflationAdjustment(futureValue, inflationRate, years)
calculateRuleOf72(annualRate)
calculatePresentValue(targetAmount, annualRate, years, compoundingFrequency)
calculateRequiredRate(input)
calculateTimeToTarget(input)
parseCompoundInput(value)
formatCurrency(value)
formatPercent(value)
formatDuration(months)
```

### Tipos sugeridos

```ts
type CompoundingFrequency =
  | "annual"
  | "semiannual"
  | "quarterly"
  | "monthly"
  | "biweekly"
  | "weekly"
  | "daily"
  | "continuous";

type ContributionFrequency = "monthly" | "annual";
type ContributionTiming = "beginning" | "end";

interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  durationMonths: number;
  compoundingFrequency: CompoundingFrequency;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
  inflationRate?: number;
}

interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInvested: number;
  interestEarned: number;
  investedMultiplier: number;
  returnOnInvested: number;
  realValue?: number;
  purchasingPowerLoss?: number;
  realRate?: number;
}

interface AnnualGrowthRow {
  year: number;
  annualContributions: number;
  totalInvested: number;
  interestEarned: number;
  totalValue: number;
}
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Capital inicial `0` con aportaciones `> 0` | Válido, calcular normal. |
| Capital inicial `0` y aportaciones `0` | Bloquear cálculo. |
| Tasa `0%` | Monto final = capital + aportaciones; intereses `$0.00`. |
| Plazo `1 mes` | Mostrar resultado de un período y tabla con el primer año parcial si aplica. |
| Inflación > tasa nominal | Mostrar tasa real negativa y advertencia. |
| Tiempo `100 años` | Calcular sin romper layout; usar formato compacto si el monto es enorme. |
| Aportación al inicio vs al final | Calcular diferencia correctamente. |
| Capitalización continua | Usar `Math.exp(r * years)`. |
| Monto objetivo menor o igual al capital inicial | Error claro en modos inversos. |
| Tasa muy alta | Advertir si `> 50%`; bloquear si `> 100%`. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Sin aportaciones | `$10,000`, `8%`, `20 años`, mensual | Monto final `$49,268.03`; intereses `$39,268.03`. |
| Aportación mensual al final | `$10,000`, `8%`, `20 años`, mensual, `$500/mes` | Monto final `$343,778.24`; intereses `$213,778.24`. |
| Aportación mensual al inicio | `$10,000`, `8%`, `20 años`, mensual, `$500/mes` | Monto final `$345,741.64`; intereses `$215,741.64`. |
| Capital inicial cero | `$0`, `8%`, `20 años`, mensual, `$500/mes` | Monto final `$294,510.21`; intereses `$174,510.21`. |
| Tasa cero | `$10,000`, `0%`, `20 años`, `$500/mes` | Monto final `$130,000.00`; intereses `$0.00`. |
| Inflación | Monto `$343,778.24`, inflación `4%`, `20 años` | Valor real `$156,895.90`. |
| Valor presente | Objetivo `$1,000,000`, `10%`, `15 años`, anual | Capital necesario `$239,392.05`. |
| Tiempo sin aportaciones | `$20,000` a `$100,000`, `7%`, anual | `23 años y 9 meses` aprox. |
| Tasa necesaria | `$50,000` a `$200,000`, `10 años`, anual | `14.87%` anual. |
| Comparador mensual | `$10,000`, `8%`, `10 años`, mensual | `$22,196.40`. |
| CSV | Cálculo válido | CSV contiene todas las filas anuales. |
| Input inválido | Tasa `101%` | Bloquear cálculo y mostrar error específico. |

---

## Pruebas recomendadas

### Unitarias

- Factor de crecimiento con capitalización anual, mensual y continua.
- Cálculo sin aportaciones.
- Cálculo con aportaciones al final del período.
- Cálculo con aportaciones al inicio del período.
- Capital inicial cero con aportaciones.
- Tasa cero.
- Inflación.
- Regla del 72.
- Comparador de frecuencias.
- Valor presente.
- Tasa requerida sin aportaciones.
- Tiempo requerido sin aportaciones.
- Búsqueda por meses cuando hay aportaciones.
- Parsing de valores con `$`, `%`, coma, punto y espacios.
- Formato de moneda, porcentajes y duración.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Cambiar frecuencia de capitalización.
- Cambiar aportación al inicio/final y verificar que cambia el resultado.
- Activar inflación y ver valor real.
- Exportar CSV.
- Copiar resultado.
- Limpiar formulario.
- Revisar tabla en móvil.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Aviso legal

Texto visible debajo de los resultados:

```text
Esta calculadora es una herramienta educativa. Los resultados son estimaciones y asumen una tasa constante. No contemplan impuestos, comisiones, cambios de tasa, inflación variable ni fluctuaciones de mercado. Consulta a un asesor financiero certificado antes de tomar decisiones de inversión.
```
