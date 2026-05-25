# Especificación v2 — Calculadora de IMC (Índice de Masa Corporal)

## Descripción general

Herramienta para calcular el Índice de Masa Corporal (IMC) a partir del peso y
la altura de una persona. La página debe entregar un resultado rápido, claro y
responsable: mostrar el número, su categoría de referencia, el rango de peso
asociado a la altura y las limitaciones del indicador.

El IMC es una herramienta de cribado poblacional, no un diagnóstico médico. La
experiencia debe evitar lenguaje prescriptivo o estigmatizante y presentar los
resultados como orientación general. La calculadora debe estar optimizada para
uso móvil desde el primer viewport y construirse con Astro + Tailwind CSS, sin
backend ni llamadas de red.

---

## Objetivo de producto

- Calcular el IMC de adultos de forma inmediata y comprensible.
- Mostrar categoría adulta de referencia y rango de peso saludable asociado a
  la altura.
- Permitir usar sistema métrico e imperial sin reescribir los datos.
- Explicar limitaciones del IMC de forma visible y responsable.
- Conectar de forma contextual con calculadoras relacionadas del sitio, como
  TDEE, macros y déficit calórico.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal para adultos:

- Cálculo de IMC para adultos.
- Toggle de unidades: métrico (`kg/cm`) e imperial (`lb/ft/in`).
- Conversión automática de valores al cambiar de sistema.
- Inputs: peso, altura, edad opcional, sexo opcional y embarazo opcional.
- Resultado principal: IMC, categoría, explicación breve y gauge o barra visual.
- Rango de peso saludable para la altura capturada.
- Diferencia respecto al rango saludable, expresada en lenguaje neutral.
- Avisos para valores inusuales, embarazo, adultos mayores y resultados fuera
  del rango normal.
- Botón de copiar resultado.
- Botón de limpiar.
- Contenido SEO, FAQ visible y JSON-LD de `FAQPage`.
- Bloque visible de limitaciones del IMC.

### Fase 2

- Modo pediátrico para personas de `2 a 19` años usando percentiles por edad y
  sexo.
- Clasificación pediátrica con percentiles y subcategoría de obesidad severa.
- Modo de IMC objetivo.
- Índice cintura-altura (ICA) como métrica complementaria opcional.
- Tabla de peso saludable por estatura.
- Historial de los últimos cálculos válidos en `sessionStorage`, no
  `localStorage`, y solo si el usuario lo activa explícitamente.

### Fase 3

- Seguimiento histórico con fechas, gráfica y exportación CSV.
- Persistencia opcional en `localStorage` con aviso claro de privacidad.
- Comparación de fórmulas de peso ideal como contenido educativo secundario.
- Vista de impresión.
- Contenido adicional por población o país cuando existan criterios editoriales
  definidos.

> No implementar tablas pediátricas embebidas, Chart.js, historial persistente
> ni CSV en el MVP. Son features valiosas, pero aumentan el alcance, el peso de
> la página y el riesgo de tratar datos sensibles de salud sin suficiente
> contexto.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/salud/calculadora-de-imc` |
| Alias opcional | `/calculadora-imc` |
| Archivo Astro recomendado | `src/pages/salud/calculadora-de-imc.astro` |
| Lógica de cálculo | `src/lib/calculators/bmi.ts` |
| Pruebas unitarias | `src/lib/calculators/bmi.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| Contenedores UI | `PageHero`, `Container`, `SectionIntro`, `FaqSection` |
| Estilos | Tailwind CSS |

> Si se usa el alias corto, definir si será redirección o ruta canónica. La
> página debe exponer un único `canonical`.

---

## Comportamiento mobile-first

- La calculadora interactiva debe aparecer como experiencia principal en el
  primer viewport. No crear una landing page antes de la herramienta.
- En móvil, usar una sola columna: selector de unidades, inputs, resultado,
  acciones y contenido contextual.
- En pantallas medianas o grandes, usar dos columnas: formulario a la izquierda
  y resultado a la derecha.
- Los controles táctiles deben tener altura mínima aproximada de `44px`.
- El gauge o barra visual debe tener dimensiones estables con `aspect-ratio` o
  alto fijo para evitar saltos de layout.
- No depender únicamente del color para comunicar categoría o advertencias.
  Acompañar color con texto y, si aplica, icono accesible.
- Evitar tarjetas dentro de tarjetas. Usar cards solo para resultados concretos
  o bloques repetidos.
- Los resultados largos deben permitir salto de línea sin romper el layout.
- En móvil, las acciones deben ser botones de ancho completo o wrap natural.
- El contenido educativo y FAQ deben quedar debajo de la calculadora.

---

## Conceptos base

### Fórmula del IMC

```text
IMC = peso_kg / (altura_m ^ 2)
```

### Fórmula imperial

```text
IMC = (peso_lb * 703) / (altura_in ^ 2)
```

### Conversión de unidades

```text
kg = lb * 0.45359237
lb = kg / 0.45359237
cm = in * 2.54
in = cm / 2.54
altura_m = cm / 100
```

---

## Clasificación adulta

La tabla principal debe mostrarse como referencia general para adultos. Si el
proyecto decide usar fuente CDC, tratar adultos como `20+`. Si decide usar OMS
para adultos, puede aplicarse desde `18+`; en ese caso documentar la decisión
editorial para no mezclar criterios sin explicación.

Recomendación para el MVP: usar criterio adulto desde `20+` y enviar edades de
`2 a 19` a una nota de modo pediátrico no disponible todavía.

| IMC | Categoría | Severidad visual |
|-----|-----------|------------------|
| `< 16.0` | Delgadez severa | Alerta alta |
| `16.0 - 16.9` | Delgadez moderada | Alerta |
| `17.0 - 18.4` | Delgadez leve | Precaución |
| `18.5 - 24.9` | Rango saludable | Normal |
| `25.0 - 29.9` | Sobrepeso | Precaución |
| `30.0 - 34.9` | Obesidad clase 1 | Alerta |
| `35.0 - 39.9` | Obesidad clase 2 | Alerta alta |
| `>= 40.0` | Obesidad clase 3 | Alerta alta |

> Evitar el término "mórbida" en la UI. Usar "obesidad clase 3" u "obesidad
> severa" según el contexto.

---

## Flujo principal MVP — Cálculo de IMC adulto

Modo por defecto al cargar la página.

**Ejemplo:** Peso `75 kg` y mido `172 cm`. ¿Cuál es mi IMC?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Sistema de unidades | Control segmentado | Métrico / Imperial | Métrico |
| Peso kg | Texto numérico | `10 - 500 kg` | Vacío |
| Peso lb | Texto numérico | `22 - 1100 lb` | Vacío |
| Altura cm | Texto numérico | `50 - 250 cm` | Vacío |
| Altura ft | Texto numérico | `1 - 8 ft` | Vacío |
| Altura in | Texto numérico | `0 - 11.99 in` | Vacío |
| Edad | Texto numérico opcional | `2 - 120 años` | Vacío |
| Sexo | Selector opcional | Hombre / Mujer / No indicar | No indicar |
| Embarazo | Checkbox opcional | Sí / No | No |

### Reglas del formulario

- Peso y altura son obligatorios para calcular.
- Edad y sexo son opcionales en el MVP adulto; sirven para mostrar notas y para
  futura derivación al modo pediátrico.
- Si la edad es `2 - 19`, no aplicar clasificación adulta como resultado final.
  Mostrar IMC bruto y una nota indicando que el percentil pediátrico requiere
  edad y sexo con tablas específicas.
- Si la edad es menor a `2`, no calcular clasificación; mostrar recomendación
  de consultar con pediatría.
- Si embarazo está activo, calcular solo si el usuario ya ingresó datos, pero
  mostrar una nota prominente: el IMC no es un indicador adecuado durante el
  embarazo.
- El sistema imperial debe capturar pies y pulgadas como campos separados.
- Al cambiar unidades, convertir valores existentes y conservar el significado
  del cálculo.
- El cálculo se actualiza en tiempo real cuando hay valores válidos.

### Output principal

Para `75 kg` y `172 cm`:

| Resultado | Valor esperado |
|-----------|----------------|
| IMC | `25.35` |
| Categoría | `Sobrepeso` |
| Rango saludable estimado | `54.7 - 73.7 kg` |
| Diferencia respecto al rango | `1.3 kg por encima del rango saludable de referencia` |

Texto breve sugerido:

```text
Tu IMC es 25.35. Este valor se encuentra en la categoría de sobrepeso para adultos. El IMC es una referencia inicial y debe interpretarse junto con otros factores de salud.
```

### Rango de peso saludable

Usar los límites adultos `18.5` y `24.9`:

```text
peso_min = 18.5 * altura_m ^ 2
peso_max = 24.9 * altura_m ^ 2
```

Para sistema imperial, calcular internamente en kg y convertir el resultado a
lb para mostrarlo.

### Diferencia respecto al rango

```text
si peso < peso_min:
  diferencia = peso_min - peso
  texto = "{diferencia} por debajo del rango saludable de referencia"

si peso > peso_max:
  diferencia = peso - peso_max
  texto = "{diferencia} por encima del rango saludable de referencia"

si peso está dentro del rango:
  texto = "Dentro del rango saludable de referencia para tu altura"
```

Evitar frases como "debes perder" o "debes ganar". El resultado no debe sonar
como una instrucción médica.

---

## Modo fase 2 — IMC pediátrico

El IMC pediátrico no se interpreta con puntos de corte fijos. Para personas de
`2 a 19` años se usa IMC por edad y sexo, expresado como percentil.

### Inputs

- Peso.
- Altura.
- Edad exacta o edad en años y meses.
- Sexo: niño / niña.

### Cálculo

```text
IMC bruto = peso_kg / (altura_m ^ 2)
percentil = lookupPercentile(imc, edad_meses, sexo)
```

### Clasificación pediátrica CDC

| Percentil | Categoría pediátrica |
|-----------|----------------------|
| `< 5` | Bajo peso |
| `>= 5 y < 85` | Peso saludable |
| `>= 85 y < 95` | Sobrepeso |
| `>= 95` | Obesidad |
| `>= 120% del percentil 95` o `IMC >= 35` | Obesidad severa |

### Nota prominente

```text
En niñas, niños y adolescentes el IMC debe interpretarse con percentiles por edad y sexo. Para una evaluación precisa del crecimiento, consulta con su pediatra.
```

> La implementación pediátrica requiere tablas oficiales y pruebas específicas.
> No estimar percentiles con fórmulas improvisadas.

---

## Modo fase 2 — IMC objetivo

**Ejemplo:** Quiero tener un IMC de `22`. ¿Qué peso correspondería a mi altura?

### Inputs

- Altura.
- IMC objetivo o selector de categoría.
- Peso actual opcional.

### Fórmula

```text
peso_objetivo = imc_objetivo * altura_m ^ 2
```

### Output

Para `172 cm` e IMC objetivo `22`:

| Resultado | Valor esperado |
|-----------|----------------|
| Peso asociado a IMC 22 | `65.1 kg` |
| Diferencia si peso actual es 75 kg | `-9.9 kg` |

Texto sugerido:

```text
Para tu altura, un IMC de 22 corresponde aproximadamente a 65.1 kg. Tómalo como referencia matemática, no como meta médica.
```

---

## Métrica complementaria fase 2 — Índice cintura-altura

El Índice Cintura-Altura (ICA) puede mostrarse como referencia adicional de
riesgo cardiovascular, siempre como métrica complementaria y opcional.

### Input adicional

- Cintura en cm o pulgadas.

### Fórmula

```text
ICA = cintura_cm / altura_cm
```

### Clasificación orientativa

| ICA | Interpretación |
|-----|----------------|
| `< 0.40` | Bajo |
| `0.40 - 0.49` | Saludable |
| `0.50 - 0.59` | Elevado |
| `>= 0.60` | Alto |

---

## Limitaciones del IMC

Mostrar siempre un bloque informativo visible debajo del resultado o cerca del
contenido educativo.

- **No distingue masa muscular de grasa:** una persona con mucha masa muscular
  puede tener un IMC alto sin tener exceso de grasa corporal.
- **No mide distribución de grasa:** la grasa abdominal puede implicar riesgos
  distintos que el IMC no refleja.
- **Puede variar por población:** algunos grupos pueden presentar riesgos de
  salud en puntos de corte diferentes.
- **No reemplaza evaluación médica:** debe interpretarse junto con edad,
  antecedentes, composición corporal, cintura, laboratorio y otros datos.
- **No es adecuado durante embarazo:** requiere otros criterios clínicos.
- **En adultos mayores puede ser menos preciso:** pérdida de músculo y cambios
  corporales pueden alterar su interpretación.

Texto corto sugerido:

```text
El IMC es una herramienta de cribado, no un diagnóstico. Si tu resultado te preocupa o tienes síntomas, consulta con un profesional de la salud.
```

---

## Avisos de salud

### Resultado fuera del rango saludable

```text
Este resultado es orientativo. Para una evaluación completa considera consultar con un profesional de la salud.
```

### IMC menor a 16 o mayor/igual a 40

```text
Tu resultado está en un rango que puede requerir evaluación médica. Si tienes síntomas o cambios recientes de peso, busca orientación profesional.
```

### Edad mayor o igual a 65

```text
En adultos mayores el IMC puede no reflejar bien la composición corporal. Interprétalo junto con otros indicadores de salud.
```

### Embarazo

```text
Durante el embarazo el IMC actual no es un indicador adecuado para evaluar el peso. Consulta con tu profesional de salud.
```

### Edad de 2 a 19 años en MVP

```text
Para niñas, niños y adolescentes se usa percentil de IMC por edad y sexo. Esta versión muestra el IMC bruto, pero no clasifica el resultado pediátrico.
```

---

## Gauge o barra visual

### Requisitos

- Puede implementarse como SVG propio o barra horizontal segmentada.
- No usar librería externa en el MVP.
- Debe ser legible en móvil.
- Debe incluir etiquetas textuales o leyenda; no depender solo del color.
- Debe tener estado inicial neutral.
- Debe respetar `prefers-reduced-motion`.
- Si se anima, usar transiciones suaves y no bloquear el cálculo.

### Recomendación MVP

Preferir una barra segmentada sobre un velocímetro complejo. Es más liviana,
más fácil de hacer accesible y ocupa menos altura en móvil.

Rango visual sugerido:

```text
10 - 45 IMC visible
```

Si el IMC está fuera del rango visual, fijar el indicador al extremo y mostrar
texto de valor exacto.

---

## Parsing y validación de inputs

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite aceptar valores pegados con símbolos o formatos regionales.

### Normalización de valores

Aceptar y normalizar:

| Entrada | Valor interno |
|---------|---------------|
| `75` | `75` |
| `75.5` | `75.5` |
| `75,5` | `75.5` |
| `75 kg` | `75` |
| `165 lb` | `165` |
| `1.72` como altura métrica | `172 cm` si el campo acepta metros |
| `172 cm` | `172` |
| `5'8"` | Fase futura; en MVP usar ft/in separados |

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Peso vacío | No calcular; mostrar estado neutral o error si el campo fue tocado. |
| Altura vacía | No calcular; mostrar estado neutral o error si el campo fue tocado. |
| Peso `< 10 kg` o `> 500 kg` | Bloquear cálculo y mostrar error específico. |
| Peso `< 22 lb` o `> 1100 lb` | Bloquear cálculo y mostrar error específico. |
| Altura `< 50 cm` o `> 250 cm` | Bloquear cálculo y mostrar error específico. |
| Pies `< 1` o `> 8` | Bloquear cálculo. |
| Pulgadas `< 0` o `>= 12` | Bloquear cálculo. |
| Edad `< 2` | No clasificar; sugerir consulta pediátrica. |
| Edad `2 - 19` | Mostrar nota pediátrica; no aplicar categoría adulta en MVP. |
| Edad `> 120` | Bloquear cálculo y mostrar error. |
| IMC `< 10` o `> 80` | Permitir si inputs son válidos, pero mostrar advertencia de valor inusual. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |
| Valores negativos | Error específico; no calcular. |

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos, resultado neutral y sin errores. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido adulto | Mostrar IMC, categoría, rango saludable, diferencia y acciones. |
| Edad pediátrica MVP | Mostrar IMC bruto y nota; no clasificar como adulto. |
| Inválido | Mostrar errores por campo y ocultar acciones de resultado. |
| Valor inusual | Mostrar resultado y advertencia informativa. |
| Embarazo | Mostrar nota prominente junto al resultado. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Limpio | Restaurar estado inicial sin recargar la página. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo de resultado | Formato |
|-------------------|---------|
| IMC | 2 decimales: `25.35` |
| Peso saludable métrico | 1 decimal: `54.7 - 73.7 kg` |
| Peso saludable imperial | 1 decimal: `120.7 - 162.4 lb` |
| Diferencia de peso | 1 decimal con unidad: `1.3 kg` |
| Altura métrica | Entero o 1 decimal: `172 cm` |
| Altura imperial | `5 ft 8 in` |
| Percentil pediátrico fase 2 | Entero: `percentil 72` |
| Categoría | Texto + color + etiqueta accesible |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar.
- El rango saludable debe calcularse con límites `18.5` y `24.9`, no con la
  categoría redondeada del resultado.

---

## Acciones del MVP

### Copiar resultado

Debe copiar texto plano.

Ejemplo:

```text
Calculadora de IMC - calculadoras.tools
Peso: 75 kg
Altura: 172 cm
IMC: 25.35
Categoría: Sobrepeso
Rango saludable de referencia: 54.7 - 73.7 kg
```

Si `navigator.clipboard` no está disponible, usar fallback con `textarea` o
mostrar mensaje accesible de error.

### Limpiar

- Restablece valores por defecto.
- Limpia errores, advertencias y resultado.
- No recarga la página.
- Mantiene sistema métrico como default.

### Usar ejemplo

Opcional. Rellena:

```text
peso = 75 kg
altura = 172 cm
edad = 32
sexo = No indicar
```

---

## Calculadoras relacionadas

Mostrar enlaces contextuales debajo del resultado y/o al final de la página.
No presentar estos enlaces como tratamiento médico.

| Condición | Enlace sugerido |
|-----------|-----------------|
| IMC `< 18.5` | Calcula tus calorías diarias con TDEE |
| IMC `18.5 - 24.9` | Planifica tus macros |
| IMC `>= 25` | Calcula un déficit calórico orientativo |
| Siempre | Calculadora de TDEE |

Texto de seguridad:

```text
Estas herramientas son educativas y no reemplazan una evaluación profesional.
```

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de IMC Online — Índice de Masa Corporal` |
| Description | `Calcula tu IMC al instante con peso y altura. Conoce tu categoría de referencia, tu rango saludable estimado y las limitaciones del Índice de Masa Corporal.` |
| Canonical | `/salud/calculadora-de-imc` |

### Estructura sugerida

- `h1`: Calculadora de IMC
- Intro breve orientada a uso.
- Calculadora interactiva.
- Qué significa tu resultado.
- Tabla de clasificación adulta.
- Limitaciones del IMC.
- Ejemplo de cálculo.
- Rango de peso saludable por altura.
- FAQ.
- Fuentes.

### FAQ sugeridas

- ¿Cómo se calcula el IMC?
- ¿Cuál es el IMC normal en adultos?
- ¿Qué IMC se considera sobrepeso?
- ¿El IMC cambia entre hombres y mujeres?
- ¿Por qué el IMC no siempre refleja la grasa corporal?
- ¿El IMC sirve para niños y adolescentes?
- ¿El IMC sirve durante el embarazo?
- ¿Cuánto debería pesar según mi estatura?

### Schema.org

Agregar JSON-LD para `FAQPage` si las preguntas y respuestas están visibles en
la página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/salud/calculadora-de-imc.astro
src/lib/calculators/bmi.ts
src/lib/calculators/bmi.test.ts
```

### Criterios técnicos

- La página debe ser estática y compatible con Astro SSG.
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
  `PageHero`, `Container`, fondo oscuro y acentos sobrios).

### Funciones puras sugeridas

```ts
type BmiCategory =
  | "severe-thinness"
  | "moderate-thinness"
  | "mild-thinness"
  | "healthy"
  | "overweight"
  | "obesity-class-1"
  | "obesity-class-2"
  | "obesity-class-3";

interface AdultBmiResult {
  bmi: number;
  category: BmiCategory;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  differenceFromRangeKg: number;
  rangeStatus: "below" | "within" | "above";
}

calculateBmi(weightKg, heightCm)
classifyAdultBmi(bmi)
calculateHealthyWeightRange(heightCm)
calculateAdultBmiResult({ weightKg, heightCm })
convertKgToLb(kg)
convertLbToKg(lb)
convertCmToIn(cm)
convertInToCm(inches)
convertMetricToImperial({ weightKg, heightCm })
convertImperialToMetric({ weightLb, feet, inches })
parseHealthInput(value)
formatBmi(value)
formatWeight(value, unit)
formatHeight(value, unit)
buildBmiCopyText(result)
```

### Categorías adultas sugeridas en código

```ts
const ADULT_BMI_CATEGORIES = [
  { min: 0, max: 16, key: "severe-thinness", label: "Delgadez severa" },
  { min: 16, max: 17, key: "moderate-thinness", label: "Delgadez moderada" },
  { min: 17, max: 18.5, key: "mild-thinness", label: "Delgadez leve" },
  { min: 18.5, max: 25, key: "healthy", label: "Rango saludable" },
  { min: 25, max: 30, key: "overweight", label: "Sobrepeso" },
  { min: 30, max: 35, key: "obesity-class-1", label: "Obesidad clase 1" },
  { min: 35, max: 40, key: "obesity-class-2", label: "Obesidad clase 2" },
  { min: 40, max: Infinity, key: "obesity-class-3", label: "Obesidad clase 3" },
];
```

Usar comparaciones tipo `bmi >= min && bmi < max`, excepto el último rango.

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- Los controles segmentados deben comunicar estado activo con texto, color y
  atributos ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro con Tailwind.
- No depender únicamente del color para comunicar categoría, advertencia o
  error.
- El gauge o barra debe tener alternativa textual.
- La navegación debe funcionar con teclado.
- Las acciones de copiar y limpiar deben informar éxito o error sin depender de
  `alert()`.
- Respetar `prefers-reduced-motion` para animaciones del indicador.

---

## Privacidad

- El MVP no debe guardar datos de salud en `localStorage`.
- Si se implementa historial en fase futura, preferir `sessionStorage` para
  últimos cálculos no sensibles y sin persistencia prolongada.
- Si se usa `localStorage`, debe ser opt-in y mostrar texto claro: los datos se
  guardan solo en el navegador del usuario.
- No enviar peso, altura, edad, sexo ni resultados a APIs externas.
- No registrar valores personales en analytics.

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| Altura `0` | Error claro antes del cálculo. |
| Peso muy bajo con edad adulta | Bloquear si fuera de rango; si está en rango, calcular y advertir. |
| IMC `< 10` | Mostrar resultado y advertencia de valor inusual. |
| IMC `> 80` | Mostrar resultado y advertencia de valor inusual. |
| Edad `< 2` | No clasificar; recomendar consulta pediátrica. |
| Edad `2 - 19` | Mostrar IMC bruto y nota pediátrica en MVP. |
| Edad `>= 65` | Mostrar nota de interpretación en adultos mayores. |
| Embarazo activo | Mostrar nota prominente. |
| Sistema imperial con `ft = 5`, `in = 12` | Error; pulgadas deben ser menores que 12. |
| Cambio de métrico a imperial | Convertir sin perder el valor equivalente. |
| Resultado largo | Debe hacer wrap sin romper layout. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| IMC adulto básico | `75 kg`, `172 cm` | IMC `25.35`, categoría `Sobrepeso`. |
| Rango saludable | `172 cm` | `54.7 - 73.7 kg`. |
| Diferencia sobre rango | `75 kg`, `172 cm` | Aproximadamente `1.3 kg` sobre el rango. |
| Rango saludable | `65 kg`, `172 cm` | Categoría `Rango saludable`; dentro del rango. |
| Delgadez | `50 kg`, `172 cm` | IMC `16.90`, categoría `Delgadez moderada`. |
| Obesidad clase 1 | `90 kg`, `172 cm` | IMC `30.42`, categoría `Obesidad clase 1`. |
| Imperial | `165 lb`, `5 ft`, `8 in` | IMC aproximado `25.09`. |
| Edad pediátrica MVP | Edad `11`, peso y altura válidos | Mostrar IMC bruto y nota; no clasificar como adulto. |
| Embarazo | Checkbox activo | Mostrar nota de embarazo junto al resultado. |
| Edad adulta mayor | Edad `70` | Mostrar nota de adultos mayores. |
| Altura inválida | `0 cm` | Bloquear cálculo y mostrar error. |
| Peso inválido | `-75 kg` | Bloquear cálculo y mostrar error. |
| Copiar resultado | Resultado válido | Copia texto plano con IMC, categoría y rango. |
| Limpiar | Después de calcular | Campos y resultado vuelven a estado inicial. |
| Mobile | viewport `390px` | Formulario y resultado no se superponen ni desbordan. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest:

- Fórmula de IMC métrica.
- Fórmula de IMC imperial.
- Conversión kg/lb.
- Conversión cm/in.
- Clasificación adulta en cada frontera: `16`, `17`, `18.5`, `25`, `30`, `35`,
  `40`.
- Rango saludable por altura.
- Diferencia debajo, dentro y encima del rango.
- Parsing de formatos comunes.
- Manejo de valores inválidos.
- Formato de IMC, peso y altura.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Cambiar unidades y verificar conversión.
- Activar embarazo y verificar nota.
- Ingresar edad pediátrica y verificar que no se use clasificación adulta.
- Copiar resultado.
- Limpiar formulario.
- Validar mensajes de error.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Fuentes de referencia

- CDC — Adult BMI Categories:
  https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
- CDC — Using BMI-for-Age Growth Charts:
  https://www.cdc.gov/growth-chart-training/hcp/using-bmi/summary.html
- WHO — Obesity:
  https://www.who.int/health-topics/obesity/
- WHO Expert Consultation — Appropriate body-mass index for Asian populations:
  https://pubmed.ncbi.nlm.nih.gov/14726171/

---

## Aviso de salud sugerido

Texto visible cerca de los resultados:

```text
Los resultados son estimaciones orientativas basadas en el Índice de Masa Corporal. El IMC no mide directamente la grasa corporal ni reemplaza una evaluación médica. Consulta con un profesional de la salud si tienes dudas, síntomas, embarazo, cambios recientes de peso o condiciones médicas previas.
```
