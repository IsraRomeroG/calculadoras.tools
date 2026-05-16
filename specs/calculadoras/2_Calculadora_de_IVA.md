# Especificación v2 — Calculadora de IVA / Impuestos

## Descripción general

Herramienta para calcular IVA e impuestos sobre precios de forma rápida, clara y cómoda en móvil. El usuario puede partir de un precio sin IVA para obtener el total, o partir de un precio con IVA incluido para desglosar base e impuesto.

La calculadora debe funcionar completamente en el navegador, sin backend ni llamadas a APIs externas. Las tasas preconfiguradas son orientativas y deben poder editarse manualmente.

---

## Objetivo de producto

- Resolver los dos cálculos más frecuentes de IVA: agregar impuesto y desglosarlo desde un total.
- Mostrar siempre un desglose claro: precio sin IVA, impuesto y total con IVA.
- Reducir fricción en móvil con pocos campos, labels claros y resultados visibles sin desplazamiento excesivo.
- Permitir seleccionar país para autocompletar tasa, moneda y formato.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo 1: agregar IVA a un precio base.
- Modo 2: desglosar IVA desde un precio final.
- Selector de país y tasa editable.
- Resultado en tiempo real.
- Desglose completo en formato tabla/lista.
- Botón de copiar resultado.
- Botón de limpiar modo activo.
- Explicación breve del cálculo.
- Historial de los últimos 10 cálculos válidos en `sessionStorage`.
- FAQ visible y JSON-LD `FAQPage`.

### Fase 2

- Múltiples impuestos.
- Impresión / exportar desglose.
- Páginas SEO por país.
- Presets específicos por categoría o región fiscal.

> Decisión de producto: el antiguo "Modo 3 — Comparar precio con y sin IVA" no necesita ser un modo separado. Ese desglose debe aparecer como resultado compartido en los modos principales.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/legal-impuestos/calculadora-de-iva` |
| Archivo Astro recomendado | `src/pages/legal-impuestos/calculadora-de-iva.astro` |
| Lógica pura recomendada | `src/lib/calculators/vat.ts` |
| Pruebas recomendadas | `src/lib/calculators/vat.test.ts` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |
| Locale base | `es-MX` |

> Si se quiere conservar una URL corta como `/calculadora-de-iva`, definirla explícitamente como ruta principal o como redirección hacia `/legal-impuestos/calculadora-de-iva`.

---

## Casos de uso

### Modo 1 — Agregar IVA a un precio base

Modo por defecto al cargar la página.

**Etiqueta corta para tab:** `Agregar`

**Ejemplo:** Precio sin IVA `$500` + `16%` → ¿cuánto pago en total?

**Inputs:**
- País → ej. `México`
- Precio sin IVA → ej. `500`
- Tasa de IVA (%) → ej. `16`

**Fórmulas:**

```text
impuesto = precio_base * (tasa / 100)
precio_final = precio_base + impuesto
```

**Outputs esperados:**
- Precio sin IVA: **$500.00**
- IVA (16%): **$80.00**
- Precio con IVA: **$580.00**

**Explicación:**

```text
500 * 0.16 = 80
500 + 80 = 580
```

---

### Modo 2 — Desglosar IVA de un precio final

**Etiqueta corta para tab:** `Desglosar`

**Ejemplo:** Me cobraron `$580` con IVA incluido. ¿Cuánto es el IVA?

**Inputs:**
- País → ej. `México`
- Precio con IVA incluido → ej. `580`
- Tasa de IVA (%) → ej. `16`

**Fórmulas:**

```text
precio_base = precio_final / (1 + tasa / 100)
impuesto = precio_final - precio_base
```

**Outputs esperados:**
- Precio sin IVA: **$500.00**
- IVA desglosado (16%): **$80.00**
- Precio con IVA: **$580.00**

**Explicación:**

```text
580 / 1.16 = 500
580 - 500 = 80
```

---

### Fase 2 — Múltiples impuestos

**Etiqueta corta para tab:** `Múltiples`

**Ejemplo:** Precio base `$100` + IVA `16%` + IEPS `8%`.

**Inputs:**
- Precio base → ej. `100`
- Impuesto 1: nombre + tasa (%) → ej. `IVA`, `16`
- Impuesto 2: nombre + tasa (%) → ej. `IEPS`, `8`
- Botón para agregar hasta 3 impuestos adicionales.

**Decisión inicial recomendada:** impuestos aditivos, todos calculados sobre el precio base.

```text
impuesto_1 = precio_base * (tasa_1 / 100)
impuesto_2 = precio_base * (tasa_2 / 100)
total = precio_base + impuesto_1 + impuesto_2 + ...
```

> Si en una versión futura se soportan impuestos secuenciales, la UI debe indicarlo explícitamente porque el resultado cambia.

**Outputs esperados:**
- Desglose línea por línea de cada impuesto.
- Total final con todos los impuestos aplicados.

---

## Comportamiento mobile-first

- La calculadora debe ser la experiencia principal del primer viewport.
- En móvil, usar una sola columna: selector de modo, país/tasa, precio, resultado, explicación e historial.
- En pantallas medianas o grandes, se puede usar dos columnas: formulario/resultado a la izquierda e historial o contenido auxiliar a la derecha.
- Los tabs deben usar labels cortos: `Agregar`, `Desglosar`, `Múltiples`.
- Si los tabs no caben, usar `overflow-x-auto` con scroll horizontal.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- El resultado debe aceptar saltos de línea y no romper el layout con montos grandes.
- En móvil, el desglose debe mostrarse como lista de filas apiladas; en desktop puede mostrarse como tabla.
- Evitar secciones decorativas o hero de marketing. La herramienta debe aparecer primero.

---

## Selector de país y tasas

El selector de país autocompleta la tasa estándar, el locale y la moneda. La tasa siempre debe poder editarse manualmente.

Mostrar una nota discreta: `Las tasas son orientativas y pueden cambiar. Verifica la normativa vigente para facturación o declaraciones oficiales.`

### Datos sugeridos

```ts
interface VatCountryPreset {
  id: string;
  country: string;
  label: string;
  locale: string;
  currency: string;
  symbol: string;
  defaultRate: number | null;
  rates: Array<{
    label: string;
    value: number;
    note?: string;
  }>;
  sourceName?: string;
  sourceUrl?: string;
  lastReviewed?: string;
  notes?: string;
}
```

### Presets iniciales

| País | Tasa por defecto | Tasas alternativas | Moneda | Locale | Notas |
|------|------------------|--------------------|--------|--------|-------|
| México | 16% | 8%, 0% | MXN | es-MX | 8% en región fronteriza; 0% en casos específicos. |
| España | 21% | 10%, 4%, 0% | EUR | es-ES | Tipos reducido y superreducido. |
| Argentina | 21% | 10.5%, 27% | ARS | es-AR | Algunas operaciones tienen alícuotas especiales. |
| Colombia | 19% | 5%, 0% | COP | es-CO | Existen bienes exentos/excluidos. |
| Chile | 19% | 0% | CLP | es-CL | Tasa general de IVA. |
| Perú | 18% | 10.5% temporal para ciertos casos | PEN | es-PE | IGV + IPM; revisar tratamiento específico. |
| Ecuador | 15% | 0% | USD | es-EC | Revisar vigencia antes de publicar. |
| Guatemala | 12% | 0% | GTQ | es-GT | Tasa general de IVA. |
| Costa Rica | 13% | 4%, 2%, 1% | CRC | es-CR | Tarifas reducidas para categorías específicas. |
| Uruguay | 22% | 10% | UYU | es-UY | Tasa básica y mínima. |
| EE.UU. | Manual | — | USD | en-US | No hay IVA nacional; usar tasa manual de sales tax. |

> Las fuentes oficiales deben revisarse antes de publicar o actualizar presets. Guardar `lastReviewed` en formato `YYYY-MM-DD`.

---

## Selector de modos

- Los modos se presentan como tabs.
- El modo por defecto es `Agregar`.
- Al cambiar de tab, se muestran solo los campos relevantes.
- Los valores se conservan mientras el usuario navega entre tabs durante la sesión de la página.
- El botón de limpiar borra únicamente los campos del modo activo.

| Modo | Label corto | Título dentro del panel |
|------|-------------|-------------------------|
| 1 | `Agregar` | Agregar IVA a un precio |
| 2 | `Desglosar` | Desglosar IVA incluido |
| 3, fase 2 | `Múltiples` | Múltiples impuestos |

---

## Validación y parsing de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite controlar el parsing y aceptar valores pegados con símbolos comunes.

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Campo vacío | No calcular; mostrar estado neutral o mensaje de campo requerido cuando el usuario ya interactuó con el campo. |
| Números negativos | No permitidos; mostrar error claro. |
| Precio igual a 0 | Permitido; resultado válido igual a 0. |
| Tasa igual a 0 | Permitida; impuesto igual a 0. |
| Tasa entre 0 y 100 | Calcular normalmente. |
| Tasa mayor a 100 | Permitir, calcular y mostrar advertencia: `Tasa inusualmente alta.` |
| Decimales | Aceptar hasta 4 decimales en inputs. |
| Texto pegado | Extraer número si contiene `$`, `%`, espacios o símbolo de moneda conocido. |
| Caracteres ambiguos | Mostrar error si no se puede normalizar a un número válido. |

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `1000` | `1000` |
| `1,000.50` | `1000.5` |
| `$1,000.50` | `1000.5` |
| `16%` | `16` |
| ` 16 % ` | `16` |
| `1.000,50` | `1000.5` |
| `S/ 1,000.50` | `1000.5` |
| `€1.000,50` | `1000.5` |

### Errores y advertencias

| Caso | Mensaje sugerido |
|------|------------------|
| Valor inválido | `Ingresa un número válido.` |
| Campo requerido | `Este campo es obligatorio.` |
| Número negativo | `Ingresa un número igual o mayor a cero.` |
| Más de 4 decimales | `Usa máximo 4 decimales.` |
| Tasa mayor a 100 | `Tasa inusualmente alta. El cálculo se muestra como referencia.` |

---

## Formato de outputs

Usar `Intl.NumberFormat` con `locale` y `currency` del país seleccionado.

| Tipo | Formato |
|------|---------|
| Moneda | 2 decimales fijos. Ejemplo: `$1,250.00`. |
| Separador de miles | Según locale seleccionado. En `es-MX`: `1,000,000`. |
| Separador decimal | Según locale seleccionado. En `es-MX`: `1,234.56`. |
| Porcentaje de tasa | Mostrar junto al concepto. Ejemplo: `IVA (16%)`. |
| Resultados negativos | No aplican en los modos principales; mostrar error si ocurren por valores inválidos. |

### Redondeo

- Calcular internamente con números sin redondear intermedio.
- Redondear a 2 decimales únicamente al mostrar moneda.
- Para el desglose visual, el total mostrado debe coincidir con la suma visual de base + impuesto después del redondeo.
- Si existe diferencia de centavos por redondeo, priorizar que `precio_base + impuesto = precio_final` en la tabla visible.

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Campos vacíos, resultado neutral y sin errores. |
| Incompleto | No mostrar resultado final; indicar campo faltante si el usuario ya interactuó. |
| Válido | Mostrar desglose, explicación, copiar y guardar en historial. |
| Inválido | Mostrar mensaje específico y no actualizar historial. |
| Advertencia | Calcular pero mostrar nota, por ejemplo cuando la tasa es mayor a 100%. |
| Copiado | Cambiar texto/icono durante 2 segundos y anunciar con `aria-live`. |
| Sin historial | Mostrar estado vacío discreto. |

---

## Features

### Cálculo en tiempo real

- El resultado se actualiza automáticamente al escribir.
- No requiere botón de calcular.
- Debe evitar parpadeos o cambios bruscos de layout.

### Copiar resultado

- Mostrar botón junto al resultado.
- Copiar el desglose completo en texto plano.
- Si `navigator.clipboard` no está disponible, usar fallback seguro o mostrar error.
- Confirmación visual durante 2 segundos.
- Confirmación accesible con región `aria-live`.

**Ejemplo de texto copiado:**

```text
Precio sin IVA: $500.00
IVA (16%): $80.00
Total con IVA: $580.00
País: México
```

### Limpiar

- Limpia campos del modo activo.
- Limpia errores y advertencias del modo activo.
- No borra país seleccionado si se decide conservarlo como preferencia de sesión.
- No borra historial.

### Historial de cálculos

- Guardar los últimos 10 cálculos válidos.
- Guardar: modo, país, tasa, precio base, impuesto, total, hora de sesión y texto descriptivo.
- No guardar cálculos inválidos.
- No guardar duplicados consecutivos idénticos.
- Como el cálculo es en tiempo real, guardar con debounce de 700 a 1000 ms después de la última edición válida.
- Al hacer clic en un elemento del historial, restaurar modo, país, tasa e inputs.
- Botón para limpiar historial completo.
- Persistencia: usar `sessionStorage`. No usar `localStorage`.

### Explicación paso a paso

- Mostrar debajo del resultado.
- Usar valores normalizados y formateados.
- Mantenerla breve para no saturar móvil.

### Impresión / exportar — fase 2

- Botón `Imprimir desglose`.
- Usar una vista limpia con solo título, fecha, país, tasa y desglose.
- Debe ser útil para cotizaciones simples, no para emitir documentos fiscales.

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
  - `Home`: primer tab
  - `End`: último tab
- Estados focus visibles con Tailwind.
- Los botones de icono deben incluir `aria-label`.
- No depender solo del color para comunicar error, éxito o advertencia.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de IVA Online — Agrega o Desglosa el IVA al Instante` |
| Description | `Calcula el IVA de cualquier precio en segundos. Suma o desglosa IVA, elige tu país y obtén el detalle completo gratis.` |
| Canonical | `/legal-impuestos/calculadora-de-iva` |

### Estructura sugerida

- `h1`: Calculadora de IVA
- Intro breve orientada a uso.
- Calculadora interactiva.
- Tabla de tasas de IVA por país con nota de actualización.
- Explicación breve de qué es el IVA y cómo funciona.
- Ejemplos por categoría: servicios, productos, cotizaciones.
- FAQ visible.

### URLs SEO futuras por país

Usar slugs sin caracteres especiales:

- `/legal-impuestos/calculadora-de-iva-mexico`
- `/legal-impuestos/calculadora-de-iva-espana`
- `/legal-impuestos/calculadora-de-iva-colombia`
- `/legal-impuestos/calculadora-de-iva-argentina`

> Estas URLs deben crearse solo si tendrán contenido localizado real. Si no, mantener una sola URL principal.

### FAQ sugeridas

- ¿Cómo se calcula el IVA de un precio?
- ¿Cómo saber cuánto IVA lleva un precio que ya lo incluye?
- ¿Cuál es la tasa de IVA en México, España o Colombia?
- ¿El IVA se calcula sobre el precio con o sin impuesto?
- ¿Qué es una tasa reducida de IVA?
- ¿La calculadora sirve para facturas oficiales?

### Schema.org

Agregar JSON-LD `FAQPage` si las preguntas y respuestas están visibles en la página.

---

## Implementación en Astro + Tailwind

### Criterios técnicos

- La página debe ser estática y compatible con Astro SSG.
- La UI se construye con Astro + Tailwind.
- La lógica interactiva puede vivir en un `<script>` de la página o importarse desde un módulo cliente.
- La lógica matemática debe separarse en funciones puras cuando sea posible.
- No introducir React, Vue, Svelte ni librerías adicionales para esta calculadora.
- No usar backend.
- No hacer llamadas de red.

### Funciones puras sugeridas

```ts
calculateVatFromBase(base, rate)
calculateVatFromTotal(total, rate)
calculateMultipleTaxes(base, taxes)
parseMoneyInput(value)
parseRateInput(value)
formatMoney(value, locale, currency)
formatRate(value)
roundCurrency(value)
```

### Tipos sugeridos

```ts
type VatMode = "addVat" | "extractVat" | "multipleTaxes";

interface VatBreakdown {
  base: number;
  tax: number;
  total: number;
  rate: number;
}

interface TaxLine {
  id: string;
  name: string;
  rate: number;
  amount: number;
}
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Precio base `0`, tasa `16` | IVA `$0.00`, total `$0.00`. |
| Precio final `0`, tasa `16` | Base `$0.00`, IVA `$0.00`. |
| Tasa `0` | Impuesto `$0.00`; total igual al precio. |
| Tasa `100` | Impuesto igual al precio base. |
| Tasa `150` | Calcular con advertencia visible. |
| Precio muy grande | Calcular y ajustar texto sin romper layout. |
| Pegar `$1,200.50` | Normalizar a `1200.5`. |
| Pegar `16%` | Normalizar a `16`. |
| Pegar `1.000,50` | Normalizar a `1000.5`. |
| Pegar `abc` | Mostrar error de número inválido. |
| País EE.UU. | No autocompletar tasa; mostrar tasa manual. |
| Cambio de país | Actualizar moneda, locale y tasa por defecto, salvo que el usuario haya editado manualmente la tasa y la UI decida pedir confirmación o conservarla. |

---

## Criterios de aceptación

| Modo | Inputs | Resultado esperado |
|------|--------|--------------------|
| Agregar | Base `500`, tasa `16` | IVA `$80.00`, total `$580.00`. |
| Agregar | Base `0`, tasa `16` | IVA `$0.00`, total `$0.00`. |
| Agregar | Base `100`, tasa `0` | IVA `$0.00`, total `$100.00`. |
| Desglosar | Total `580`, tasa `16` | Base `$500.00`, IVA `$80.00`. |
| Desglosar | Total `100`, tasa `0` | Base `$100.00`, IVA `$0.00`. |
| Desglosar | Total `116`, tasa `16` | Base `$100.00`, IVA `$16.00`. |
| Validación | Base `-100` | Error de número negativo. |
| Validación | Tasa `150` | Resultado válido con advertencia. |
| Parsing | Precio `$1,000.50` | Valor interno `1000.5`. |
| Parsing | Precio `1.000,50` | Valor interno `1000.5`. |
| Historial | Cálculo válido | Se guarda con debounce y se puede restaurar. |
| Copiar | Resultado válido | Copia desglose completo en texto plano. |

---

## Pruebas recomendadas

### Unitarias con Vitest

- Fórmula de agregar IVA.
- Fórmula de desglosar IVA.
- Redondeo de moneda.
- Parsing de formatos comunes.
- Tasa `0`, `100` y mayor a `100`.
- Valores grandes.
- Múltiples impuestos cuando se implemente fase 2.

### E2E con Playwright

- Cambiar entre tabs.
- Seleccionar país y verificar tasa/autocompletado.
- Editar tasa manualmente.
- Escribir valores y ver resultado en tiempo real.
- Copiar resultado.
- Limpiar modo activo.
- Guardar/restaurar historial.
- Navegar tabs con teclado.
- Validar layout en móvil.

---

## Fuera de alcance para esta versión

- Facturación fiscal oficial.
- Cálculo automático de tasas por ubicación exacta.
- Llamadas a APIs tributarias.
- Persistencia permanente con `localStorage`.
- Soporte multiidioma completo.
- Exportar historial.
- Impuestos secuenciales.

---

## Referencias oficiales sugeridas para revisar tasas

- México: SAT / Ley del IVA.
- España: Agencia Tributaria.
- Argentina: ARCA.
- Colombia: DIAN.
- Chile: SII.
- Perú: SUNAT.
- Ecuador: SRI.
- Guatemala: SAT.
- Costa Rica: Ministerio de Hacienda.
- Uruguay: DGI.
- Estados Unidos: IRS / USAGov para sales tax estatal y local.

> Las referencias no deben consultarse en tiempo de ejecución. Sirven para actualizar manualmente los presets y la tabla de contenido cuando cambie una tasa.
