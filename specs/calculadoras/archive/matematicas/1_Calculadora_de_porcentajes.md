# Especificación v2 — Calculadora de porcentajes

## Descripción general

Herramienta multipropósito para resolver los casos de uso más frecuentes relacionados con porcentajes: obtener un porcentaje de una cantidad, saber qué porcentaje representa un valor, calcular cambio porcentual, sumar un porcentaje y restar un porcentaje.

La calculadora debe ser rápida, clara y cómoda en móvil. El usuario elige el tipo de cálculo que necesita y la interfaz muestra solo los campos relevantes para ese modo.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend, base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Resolver cálculos de porcentaje cotidianos sin fricción.
- Mostrar resultados en tiempo real con una explicación breve del cálculo.
- Mantener una interfaz mobile-first, accesible y fácil de escanear.
- Generar una página estática optimizada para SEO en Astro.

---

## Ruta y archivo sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-de-porcentajes` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-de-porcentajes.astro` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |
| Lógica cliente | JavaScript o TypeScript vanilla |

> Si se prefiere una URL corta como `/calculadora-de-porcentajes`, debe definirse explícitamente si será ruta principal o redirección.

---

## Casos de uso

### Modo 1 — ¿Cuánto es X% de un número?

Modo por defecto al cargar la página.

**Etiqueta corta para tab:** `% de número`

**Ejemplo:** ¿Cuánto es el 20% de 350?

**Inputs:**
- Porcentaje (%) → ej. `20`
- Número base → ej. `350`

**Fórmula:**

```text
resultado = (porcentaje / 100) * numero_base
```

**Output esperado:**
- El 20% de 350 es **70**

**Explicación:**

```text
350 * 0.20 = 70
```

---

### Modo 2 — ¿Qué porcentaje es X de Y?

**Etiqueta corta para tab:** `X de Y`

**Ejemplo:** ¿Qué porcentaje es 45 de 200?

**Inputs:**
- Valor parcial → ej. `45`
- Valor total → ej. `200`

**Fórmula:**

```text
resultado = (valor_parcial / valor_total) * 100
```

**Output esperado:**
- 45 es el **22.5%** de 200

**Explicación:**

```text
(45 / 200) * 100 = 22.5%
```

---

### Modo 3 — Cambio porcentual entre dos valores

Este modo cubre aumentos, disminuciones y ausencia de cambio.

**Etiqueta corta para tab:** `Cambio %`

**Ejemplo:** Un producto pasó de $80 a $100. ¿Cuánto cambió?

**Inputs:**
- Valor original → ej. `80`
- Valor nuevo → ej. `100`

**Fórmula:**

```text
resultado = ((valor_nuevo - valor_original) / valor_original) * 100
```

**Output esperado:**
- Si el resultado es positivo: **Aumentó 25%**
- Si el resultado es negativo: **Disminuyó 25%**
- Si el resultado es cero: **No hubo cambio: 0%**

**Explicación:**

```text
((100 - 80) / 80) * 100 = 25%
```

---

### Modo 4 — Sumar un porcentaje a un número

**Etiqueta corta para tab:** `Sumar %`

**Ejemplo:** $500 + 16% de IVA.

**Inputs:**
- Número base → ej. `500`
- Porcentaje a sumar (%) → ej. `16`

**Fórmulas:**

```text
incremento = (porcentaje / 100) * numero_base
resultado = numero_base + incremento
```

**Outputs esperados:**
- Incremento: **$80**
- Total con porcentaje: **$580**

**Explicación:**

```text
500 * 0.16 = 80
500 + 80 = 580
```

---

### Modo 5 — Restar un porcentaje a un número

**Etiqueta corta para tab:** `Restar %`

**Ejemplo:** $1,200 con 30% de descuento.

**Inputs:**
- Número base → ej. `1200`
- Porcentaje a restar (%) → ej. `30`

**Fórmulas:**

```text
descuento = (porcentaje / 100) * numero_base
resultado = numero_base - descuento
```

**Outputs esperados:**
- Descuento: **$360**
- Precio final: **$840**

**Explicación:**

```text
1200 * 0.30 = 360
1200 - 360 = 840
```

---

## Comportamiento mobile-first

- La calculadora debe aparecer como experiencia principal en el primer viewport.
- En móvil, usar una sola columna: selector de modo, campos, resultado, explicación e historial.
- En pantallas medianas o grandes, se puede usar un layout de dos columnas: formulario/resultado a la izquierda e historial/contenido auxiliar a la derecha.
- Los tabs deben usar etiquetas cortas para evitar overflow.
- Si los tabs no caben en una línea, deben tener scroll horizontal con `overflow-x-auto`.
- El tab activo debe ser evidente por color, peso visual y estado ARIA.
- Los botones táctiles deben tener una altura mínima aproximada de `44px`.
- Los resultados largos deben permitir ajuste de línea sin romper el layout.

---

## Selector de modos

- Los 5 modos se presentan como tabs.
- El modo por defecto es `% de número`.
- Al cambiar de tab, se muestran solo los campos del modo activo.
- Los valores del modo activo se conservan mientras el usuario navega entre tabs durante la sesión de la página.
- El botón de limpiar borra únicamente los campos del modo activo.

**Tabs:**

| Modo | Label corto | Título mostrado dentro del panel |
|------|-------------|----------------------------------|
| 1 | `% de número` | ¿Cuánto es X% de un número? |
| 2 | `X de Y` | ¿Qué porcentaje es X de Y? |
| 3 | `Cambio %` | Cambio porcentual entre dos valores |
| 4 | `Sumar %` | Sumar un porcentaje a un número |
| 5 | `Restar %` | Restar un porcentaje a un número |

---

## Validación y parsing de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite controlar mejor el parsing y aceptar valores pegados con símbolos comunes.

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Campo vacío | No calcular; mostrar estado neutral o mensaje de campo requerido cuando el usuario ya interactuó con el campo. |
| Números negativos | No permitidos en esta versión; mostrar error claro. |
| Porcentaje mayor a 100 | Permitido. Ejemplo: `150%`. |
| Porcentaje igual a 0 | Permitido. |
| Base igual a 0 | Permitida en modos donde no sea denominador. |
| Denominador igual a 0 | Mostrar error en Modo 2 y Modo 3. |
| Decimales | Aceptar hasta 2 decimales en inputs. |
| Texto pegado | Extraer número si contiene `$`, `%` o espacios. |
| Caracteres no numéricos ambiguos | Mostrar error si no se puede normalizar a un número válido. |

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `1000` | `1000` |
| `1,000.50` | `1000.5` |
| `$1,000.50` | `1000.5` |
| `20%` | `20` |
| ` 20 % ` | `20` |
| `1.000,50` | `1000.5` |

El formato `1,000.50` corresponde a separador de miles con coma y decimal con punto. El formato `1.000,50` corresponde al formato europeo/latino con punto de miles y coma decimal.

### Errores específicos

| Caso | Mensaje sugerido |
|------|------------------|
| Valor inválido | `Ingresa un número válido.` |
| Campo requerido | `Este campo es obligatorio.` |
| Número negativo | `Ingresa un número igual o mayor a cero.` |
| Modo 2: total igual a 0 | `El valor total no puede ser cero.` |
| Modo 3: valor original igual a 0 | `El valor original no puede ser cero.` |
| Más de 2 decimales | `Usa máximo 2 decimales.` |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo | Formato |
|------|---------|
| Cantidades | Separador de miles y máximo 2 decimales. Ejemplo: `1,234.56`. |
| Porcentajes | Máximo 2 decimales. Ejemplo: `22.5%` o `22.50%`, según configuración visual elegida. |
| Moneda | Prefijo fijo `$` en esta versión. |
| Resultados positivos | Usar color positivo solo cuando represente aumento o ganancia. |
| Resultados negativos | Usar color de alerta con signo negativo explícito cuando aplique. |
| Cambio igual a 0 | Usar color neutral. |

**Decisión recomendada:** mostrar hasta 2 decimales, sin ceros innecesarios. Ejemplo: `22.5%`, `25%`, `$1,234.5`.

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos, texto de ayuda breve y sin error. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar resultado, explicación paso a paso y botón de copiar. |
| Inválido | Mostrar mensaje específico y no actualizar historial. |
| Copiado | Cambiar icono/texto visualmente durante 2 segundos y anunciarlo de forma accesible. |
| Sin historial | Mostrar un estado vacío discreto. |

---

## Features

### Cálculo en tiempo real

- El resultado se actualiza automáticamente al escribir.
- No requiere botón de calcular.
- Debe evitar parpadeos o cambios bruscos de layout.

### Copiar resultado

- Mostrar un botón con icono de clipboard junto al resultado principal.
- Al hacer clic, copiar el resultado formateado al portapapeles.
- Si `navigator.clipboard` no está disponible, usar un fallback seguro o mostrar mensaje de error.
- Confirmación visual durante 2 segundos.
- Confirmación accesible con región `aria-live`.

### Limpiar

- Limpia los campos del modo activo.
- Limpia errores del modo activo.
- No borra el historial.

### Historial de cálculos

- Guardar los últimos 10 cálculos válidos.
- Guardar: modo, inputs normalizados, resultado principal, fecha/hora de sesión y texto descriptivo.
- No guardar cálculos inválidos.
- No guardar duplicados consecutivos idénticos.
- Como el cálculo es en tiempo real, guardar con debounce de 700 a 1000 ms después de la última edición válida.
- Al hacer clic en un elemento del historial, restaurar el modo y sus inputs.
- Botón para limpiar historial completo.
- Persistencia: usar `sessionStorage`. El historial sobrevive a recargas de la página dentro de la misma pestaña y se borra al cerrar la sesión de la pestaña. No usar `localStorage`.

### Explicación paso a paso

- Mostrar debajo del resultado.
- Debe usar los valores normalizados y formateados.
- Debe actualizarse junto con el resultado.
- Mantenerla breve para no saturar móvil.

### Intercambio de inputs

- Disponible solo en Modo 3.
- Intercambia `valor original` y `valor nuevo`.
- Recalcula inmediatamente.

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los mensajes de error deben asociarse con `aria-describedby`.
- El resultado debe estar en una región con `aria-live="polite"`.
- Los tabs deben implementar:
  - `role="tablist"`
  - `role="tab"`
  - `role="tabpanel"`
  - `aria-selected`
  - `aria-controls`
  - `id` relacionado entre tab y panel
- Soportar navegación de tabs con teclado:
  - flecha derecha/abajo: siguiente tab
  - flecha izquierda/arriba: tab anterior
  - Home: primer tab
  - End: último tab
- Estados focus visibles con Tailwind.
- Los botones de icono deben incluir `aria-label`.
- No depender únicamente del color para comunicar error, éxito o cambio.

---

## SEO y contenido

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Porcentajes Online — Rápida y Gratis` |
| Description | `Calcula porcentajes al instante: descuentos, aumentos, IVA y más. Sin registro y con resultado en tiempo real.` |
| Canonical | URL final de la calculadora |

### Estructura sugerida

- `h1`: Calculadora de porcentajes
- Intro breve orientada a uso.
- Calculadora interactiva.
- Ejemplos cotidianos.
- Tabla de porcentajes comunes.
- FAQ.

### FAQ sugeridas

- ¿Cómo se calcula el porcentaje de un número?
- ¿Cómo saber qué porcentaje representa una cantidad?
- ¿Cómo calcular el porcentaje de aumento entre dos valores?
- ¿Cómo calcular un descuento?
- ¿Qué fórmula se usa para sacar el porcentaje?

### Schema.org

Agregar JSON-LD para `FAQPage` si el contenido de FAQ está visible en la página.

---

## Implementación en Astro + Tailwind

### Recomendación de estructura

```text
src/pages/matematicas/calculadora-de-porcentajes.astro
src/lib/calculators/percentage.ts
src/lib/calculators/percentage.test.ts
```

### Criterios técnicos

- La página debe ser estática y usar Astro SSG.
- La UI se construye con Astro + Tailwind.
- La lógica interactiva puede vivir en un `<script>` de la página o importarse desde un módulo cliente.
- La lógica matemática debe separarse en funciones puras cuando sea posible.
- No introducir React, Vue, Svelte ni librerías adicionales para esta calculadora.
- No usar backend.
- No hacer llamadas de red.

### Funciones puras sugeridas

```ts
calculatePercentageOfNumber(percent, base)
calculateWhatPercentIs(partial, total)
calculatePercentChange(original, next)
calculateAddPercent(base, percent)
calculateSubtractPercent(base, percent)
parseNumericInput(value)
formatNumber(value)
formatCurrency(value)
formatPercent(value)
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Porcentaje = `0` | Resultado válido igual a `0`. |
| Base = `0` en Modo 1 | Resultado válido igual a `0`. |
| Base = `0` en Modo 4 | Incremento `0`; total `0`. |
| Base = `0` en Modo 5 | Descuento `0`; total `0`. |
| Modo 2: total = `0` | Error: `El valor total no puede ser cero.` |
| Modo 3: valor original = `0` | Error: `El valor original no puede ser cero.` |
| Modo 3: original = nuevo | Mostrar `No hubo cambio: 0%`. |
| Porcentaje > `100` | Calcular normalmente. |
| Restar más de `100%` | Permitirlo y mostrar resultado negativo. |
| Valores grandes | Calcular y ajustar texto sin romper layout. |
| Pegar `$1,200.50` | Normalizar a `1200.5`. |
| Pegar `30%` | Normalizar a `30`. |
| Pegar `abc` | Mostrar error de número inválido. |

---

## Criterios de aceptación

| Modo | Inputs | Resultado esperado |
|------|--------|--------------------|
| `% de número` | `20`, `350` | `70` |
| `% de número` | `0`, `350` | `0` |
| `X de Y` | `45`, `200` | `22.5%` |
| `X de Y` | `45`, `0` | Error de total cero |
| `Cambio %` | `80`, `100` | Aumentó `25%` |
| `Cambio %` | `100`, `80` | Disminuyó `20%` |
| `Cambio %` | `100`, `100` | No hubo cambio: `0%` |
| `Cambio %` | `0`, `100` | Error de valor original cero |
| `Sumar %` | `500`, `16` | Incremento `$80`, total `$580` |
| `Restar %` | `1200`, `30` | Descuento `$360`, precio final `$840` |
| `Restar %` | `100`, `150` | Descuento `$150`, precio final `-$50` |

---

## Pruebas recomendadas

### Unitarias con Vitest

- Fórmulas de los 5 modos.
- Parsing de formatos comunes.
- Validación de denominadores en cero.
- Redondeo y formato a 2 decimales.
- Casos de porcentaje mayor a 100.

### E2E con Playwright

- Cambiar entre tabs.
- Escribir valores y ver resultado en tiempo real.
- Copiar resultado.
- Limpiar modo activo.
- Guardar/restaurar historial.
- Navegar tabs con teclado.
- Validar layout en móvil.

---

## Fuera de alcance para esta versión

- Selector de moneda configurable.
- i18n multiidioma.
- Persistencia permanente con `localStorage`.
- Backend o APIs.
- Gráficas o visualizaciones avanzadas.
- Exportar historial.
