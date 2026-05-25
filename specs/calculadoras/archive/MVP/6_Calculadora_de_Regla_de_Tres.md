# Especificación v2: Calculadora de Regla de Tres

## Descripción general

Herramienta para resolver proporciones de forma rápida, clara y educativa. La
calculadora está pensada para estudiantes, docentes, personas que escalan
recetas, compradores que comparan precios, profesionales que calculan mezclas y
cualquier usuario que necesite encontrar un valor desconocido a partir de tres
valores conocidos.

La experiencia principal debe resolver regla de tres simple directa e inversa.
El usuario puede elegir manualmente el tipo de proporción y ver el resultado con
un paso a paso que explique cómo se planteó, despejó y comprobó la operación.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Resolver reglas de tres simples directas e inversas con el menor esfuerzo
  posible.
- Mostrar un procedimiento educativo y verificable, útil para tareas escolares.
- Evitar confusión entre proporción directa e inversa mediante ejemplos,
  etiquetas claras y una explicación breve.
- Ofrecer una experiencia mobile-first, con la calculadora como elemento
  principal del primer viewport.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

La primera versión debe enfocarse en el flujo principal:

- Calcular el cuarto valor `X` a partir de `A`, `B` y `C`.
- Permitir proporción `Directa` o `Inversa`.
- Calcular en tiempo real cuando los campos sean válidos.
- Mostrar resultado principal, fórmula usada y paso a paso.
- Verificar el resultado sustituyendo `X` en la proporción.
- Mostrar resultado decimal configurable de `0` a `4` decimales.
- Mostrar resultado como fracción simplificada cuando sea razonable.
- Permitir etiquetas de unidad para la primera y segunda magnitud.
- Copiar resultado y procedimiento.
- Limpiar formulario.
- Incluir contenido SEO, ejemplos resueltos y FAQ.

### Fase 2

- Detector orientativo de proporción directa/inversa por texto.
- Plantillas de contexto: precios, recetas, trabajo-tiempo, velocidad-tiempo,
  escalas, porcentajes y mezclas.
- Historial de los últimos 5 cálculos válidos en `sessionStorage`.
- Vista de impresión con `window.print()`.
- Resolver cualquier posición desconocida, no solo `X`.

### Fase 3

- Regla de tres compuesta con varias magnitudes.
- Comparador visual entre proporción directa e inversa.
- Mini gráfica accesible de crecimiento directo vs relación inversa.
- Ejercicios guiados con respuesta oculta para estudiantes.

> No implementar regla de tres compuesta en el MVP. Aunque es valiosa para SEO,
> su interfaz y validaciones requieren una estructura distinta para no complicar
> la calculadora principal.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-de-regla-de-tres` |
| Alias opcional | `/regla-de-tres` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-de-regla-de-tres.astro` |
| Lógica de cálculo | `src/lib/calculators/ruleOfThree.ts` |
| Pruebas unitarias | `src/lib/calculators/ruleOfThree.test.ts` |
| Locale base | `es-MX` |
| Layout | `BaseLayout.astro` |
| Estilos | Tailwind CSS |
| Lógica cliente | JavaScript o TypeScript vanilla |

> Si se usa el alias corto, definir si será redirección o página canónica
> duplicada. La página debe exponer un `canonical` único.

---

## Comportamiento mobile-first

- La calculadora debe aparecer como experiencia principal en el primer viewport.
- En móvil, usar una sola columna: tipo de proporción, datos, resultado,
  acciones y paso a paso.
- En pantallas medianas o grandes, usar dos columnas: formulario a la izquierda
  y resultado/procedimiento a la derecha.
- No usar una landing page antes de la herramienta.
- Los controles táctiles deben tener una altura mínima aproximada de `44px`.
- El layout visual `A -> B / C -> X` debe adaptarse a móvil sin romperse.
- En móvil, complementar la matriz con una frase editable:

```text
Si [A] [unidad A] equivalen a [B] [unidad B],
entonces [C] [unidad A] equivalen a X [unidad B].
```

- Usar controles segmentados para `Directa` e `Inversa`.
- Los resultados largos deben hacer salto de línea sin romper el layout.
- No depender únicamente del color para errores, advertencias o tipo de
  proporción.
- Usar tarjetas solo para resultados concretos, no para envolver secciones
  completas dentro de otras tarjetas.

---

## Flujo principal MVP: regla de tres simple

Modo por defecto al cargar la página.

**Ejemplo directo:** Si `3 kg` cuestan `$150`, ¿cuánto cuestan `7 kg`?

```text
A = 3
B = 150
C = 7
Tipo = Directa
X = 350
```

**Ejemplo inverso:** Si `4 obreros` terminan una obra en `12 días`, ¿cuántos
días tardarán `6 obreros`?

```text
A = 4
B = 12
C = 6
Tipo = Inversa
X = 8
```

### Modelo visual

```text
Magnitud 1      Magnitud 2
A               B
C               X
```

En la UI:

```text
[ 3 kg ]        [ $150 ]
[ 7 kg ]        [ X    ]
```

---

## Conceptos matemáticos base

### Regla de tres simple directa

Se usa cuando dos magnitudes son directamente proporcionales: si una aumenta,
la otra también aumenta en la misma proporción; si una disminuye, la otra
también disminuye.

```text
A -> B
C -> X
```

Fórmula:

```text
X = (B × C) / A
```

Donde:

- `A` es el valor conocido de la primera magnitud.
- `B` es el valor conocido de la segunda magnitud.
- `C` es el nuevo valor de la primera magnitud.
- `X` es el valor desconocido de la segunda magnitud.

Ejemplo:

```text
X = (150 × 7) / 3
X = 1,050 / 3
X = 350
```

### Regla de tres simple inversa

Se usa cuando dos magnitudes son inversamente proporcionales: si una aumenta,
la otra disminuye en la misma proporción.

```text
A -> B
C -> X
```

Fórmula:

```text
X = (A × B) / C
```

Ejemplo:

```text
X = (4 × 12) / 6
X = 48 / 6
X = 8
```

---

## Regla de tres compuesta fuera del MVP

La regla de tres compuesta se usa cuando intervienen más de dos magnitudes
relacionadas. Debe implementarse en una fase posterior con una UI de filas
dinámicas donde cada magnitud indique si es directa o inversa respecto al
resultado.

### Fórmula recomendada para fase 3

```text
X = B × producto(factores)
```

Para cada magnitud adicional:

```text
Si la relación es directa:
factor = C / A

Si la relación es inversa:
factor = A / C
```

Ejemplo:

```text
Si 4 obreros construyen 3 casas en 12 días,
¿cuántos días tardarán 6 obreros en construir 5 casas?

Base:
B = 12 días

Obreros respecto a días = inversa
factor = 4 / 6

Casas respecto a días = directa
factor = 5 / 3

X = 12 × (4 / 6) × (5 / 3)
X = 13.3333 días
```

---

## Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Tipo de proporción | Segmentado | `Directa` / `Inversa` | `Directa` |
| Valor A | Texto numérico | Distinto de `0` | vacío |
| Valor B | Texto numérico | Cualquier real | vacío |
| Valor C | Texto numérico | Distinto de `0` si es inversa | vacío |
| Unidad de la primera magnitud | Texto corto | Hasta 20 caracteres | vacío |
| Unidad de la segunda magnitud | Texto corto | Hasta 20 caracteres | vacío |
| Decimales en resultado | Selector | `0`, `1`, `2`, `3`, `4` | `2` |

### Tipo de input

Usar `input type="text"` con:

```html
inputmode="decimal"
autocomplete="off"
```

Esto permite aceptar valores pegados con símbolos comunes y normalizarlos antes
del cálculo.

---

## Parsing y normalización

Aceptar y normalizar formatos comunes:

| Entrada | Valor interno |
|---------|---------------|
| `1000` | `1000` |
| `1,000.50` | `1000.5` |
| `$1,000.50` | `1000.5` |
| `1.000,50` | `1000.5` |
| `3,5` | `3.5` |
| ` 20 % ` | `20` |

### Reglas

| Regla | Comportamiento esperado |
|-------|-------------------------|
| Campo vacío | No calcular; mostrar estado neutral o error si el campo ya fue tocado. |
| Caracteres ambiguos | Error: `Ingresa un número válido.` |
| `A = 0` | Bloquear cálculo: `El valor A no puede ser cero.` |
| Proporción inversa con `C = 0` | Bloquear cálculo: `El valor C no puede ser cero en una proporción inversa.` |
| Proporción directa con `C = 0` | Permitido; resultado `0`. |
| `B = 0` | Permitido; resultado `0`. |
| Valores negativos | Permitir y mostrar advertencia informativa. |
| Resultado no finito | Bloquear y mostrar error genérico de cálculo. |

> No aceptar expresiones como `1/2`, `sqrt(2)` o `2+3` en el MVP. La
> calculadora trabaja con valores numéricos decimales ya resueltos.

---

## Estados de la calculadora

| Estado | Comportamiento |
|--------|----------------|
| Inicial | Mostrar campos vacíos, tipo directa y sin errores. |
| Incompleto | No mostrar resultado final; indicar qué falta si el usuario ya interactuó. |
| Válido | Mostrar resultado, explicación, paso a paso y acciones. |
| Inválido | Mostrar mensaje específico y no actualizar historial. |
| Resultado negativo | Mostrar resultado con advertencia textual, no solo con color. |
| Resultado cero | Mostrar como resultado válido. |
| Copiado | Confirmación visual durante 2 segundos y anuncio accesible. |
| Verificado | Mostrar comprobación matemática de la igualdad. |

---

## Formato de outputs

Usar `Intl.NumberFormat` con locale `es-MX`.

| Tipo | Formato |
|------|---------|
| Resultado decimal | Configurable de `0` a `4` decimales. |
| Números grandes | Separador de miles: `1,250,000`. |
| Fracción | Mostrar `numerador/denominador` si se puede simplificar de forma estable. |
| Unidades | Mostrar la unidad de la segunda magnitud junto a `X`. |
| Resultado negativo | Mostrar advertencia: `El resultado es negativo; revisa si tiene sentido en este contexto.` |

### Redondeo

- Usar precisión completa para cálculos internos.
- Redondear solo al mostrar resultados.
- La fracción debe generarse a partir del valor exacto cuando los inputs puedan
  representarse como enteros tras normalización decimal.
- Si la fracción requiere denominadores demasiado grandes, ocultarla y mostrar
  solo el decimal.

---

## Output principal del MVP

### Directa

Para `A = 3`, `B = 150`, `C = 7`, unidades `kg` y `$`:

| Resultado | Valor esperado |
|-----------|----------------|
| X | `$350.00` |
| Fórmula | `X = (B × C) / A` |
| Sustitución | `X = (150 × 7) / 3` |
| Verificación | `3 × 350 = 7 × 150` |

Texto sugerido:

```text
Si 3 kg equivalen a $150, entonces 7 kg equivalen a $350.
```

### Inversa

Para `A = 4`, `B = 12`, `C = 6`, unidades `obreros` y `días`:

| Resultado | Valor esperado |
|-----------|----------------|
| X | `8 días` |
| Fórmula | `X = (A × B) / C` |
| Sustitución | `X = (4 × 12) / 6` |
| Verificación | `4 × 12 = 6 × 8` |

Texto sugerido:

```text
Si 4 obreros tardan 12 días, entonces 6 obreros tardan 8 días.
```

---

## Paso a paso educativo

El paso a paso debe estar visible debajo del resultado en el MVP. Debe ser
compacto, legible en móvil y útil para estudiantes.

### Ejemplo para regla de tres directa

```text
Paso 1. Identificamos los valores.
A = 3 kg
B = $150
C = 7 kg
X = ?

Paso 2. Como la proporción es directa, usamos:
X = (B × C) / A

Paso 3. Sustituimos:
X = (150 × 7) / 3

Paso 4. Calculamos:
X = 1,050 / 3
X = 350

Resultado:
7 kg equivalen a $350.
```

### Ejemplo para regla de tres inversa

```text
Paso 1. Identificamos los valores.
A = 4 obreros
B = 12 días
C = 6 obreros
X = ?

Paso 2. Como la proporción es inversa, usamos:
X = (A × B) / C

Paso 3. Sustituimos:
X = (4 × 12) / 6

Paso 4. Calculamos:
X = 48 / 6
X = 8

Resultado:
6 obreros tardarán 8 días.
```

---

## Verificación del resultado

El botón `Verificar` sustituye `X` en la proporción original y confirma que la
relación se cumple.

### Directa

```text
Comprobación:
A × X = C × B
3 × 350 = 7 × 150
1,050 = 1,050
```

### Inversa

```text
Comprobación:
A × B = C × X
4 × 12 = 6 × 8
48 = 48
```

En cálculo con decimales, comparar con una tolerancia pequeña para evitar
errores visuales por coma flotante.

---

## Resultado como fracción

Para usuarios que necesiten el resultado exacto, mostrar una fracción
simplificada cuando sea viable.

Ejemplo:

```text
A = 3
B = 11
C = 1
Tipo = Directa

X = 11 / 3
X = 3.6667
```

### Reglas

- Simplificar con el máximo común divisor.
- Mostrar la fracción como complemento, no como resultado único.
- No mostrar fracción si el denominador simplificado es excesivamente grande.
- No convertir resultados con símbolos o texto; solo el valor numérico.

---

## Acciones del MVP

### Copiar resultado

- Copia un resumen en texto plano.
- Debe incluir tipo de proporción, valores, resultado y paso a paso.
- Si `navigator.clipboard` no está disponible, usar fallback o mostrar error.
- Mostrar confirmación accesible durante 2 segundos.

Ejemplo de texto copiado:

```text
Calculadora de regla de tres - calculadoras.tools
Tipo: Directa
A = 3 kg
B = $150
C = 7 kg
Resultado: X = $350
Fórmula: X = (150 × 7) / 3
```

### Limpiar

- Restaura tipo `Directa`, decimales `2` y campos vacíos.
- Limpia errores, verificación y resultado.
- No debe recargar la página.

### Invertir valores

- Intercambia `A` y `C`.
- Conserva `B`, unidades, tipo de proporción y decimales.
- Recalcula automáticamente si el nuevo estado es válido.

---

## Features fuera del MVP

### Detector automático de tipo de proporción

El usuario describe la situación en lenguaje natural y la calculadora sugiere si
parece directa o inversa. Este modo es orientativo y siempre debe permitir
cambiar manualmente el tipo.

**Input:**

- Campo de texto libre. Ejemplo: `Si más trabajadores hacen el trabajo más rápido`.

**Palabras clave directas:**

- `más... más`
- `menos... menos`
- `a mayor... mayor`
- `precio`
- `cantidad`
- `escala`
- `receta`
- `distancia` con velocidad constante

**Palabras clave inversas:**

- `más... menos`
- `menos... más`
- `a mayor... menor`
- `trabajadores`
- `tiempo`
- `velocidad`
- `rendimiento`

**Output sugerido:**

```text
Parece una proporción inversa: al aumentar los trabajadores, los días disminuyen.
```

### Historial de cálculos

- Guardar los últimos 5 cálculos válidos en `sessionStorage`.
- No guardar cálculos inválidos.
- No guardar duplicados consecutivos idénticos.
- Al hacer clic en un cálculo, restaurar inputs y recalcular.
- No usar `localStorage` para evitar persistencia innecesaria.

### Vista de impresión

- Usar `window.print()`.
- Incluir valores, resultado, paso a paso y verificación.
- Ocultar navegación, botones y controles irrelevantes para impresión.

---

## Accesibilidad

- Todos los inputs deben tener `label` visible.
- Los errores deben asociarse con `aria-describedby`.
- El resultado principal debe estar en una región con `aria-live="polite"`.
- Los controles segmentados deben comunicar estado activo con texto, color y
  atributos ARIA.
- Los botones de icono deben incluir `aria-label`.
- El foco visible debe ser claro con Tailwind.
- No depender únicamente del color para comunicar error, advertencia o tipo de
  proporción.
- La navegación debe funcionar con teclado.
- Las acciones de copiar y verificar deben informar éxito o error sin depender
  de alertas del navegador.

---

## SEO y contenido de la página

### Meta información

| Campo | Valor |
|-------|-------|
| Title | `Calculadora de Regla de Tres Online - Directa e Inversa` |
| Description | `Resuelve reglas de tres directas e inversas al instante. Calcula proporciones con explicación paso a paso, verificación y resultado como fracción. Gratis y sin registro.` |
| Canonical | `/matematicas/calculadora-de-regla-de-tres` |

### Estructura sugerida

- `h1`: Calculadora de regla de tres
- Intro breve orientada a uso.
- Calculadora interactiva.
- Explicación de regla de tres directa.
- Explicación de regla de tres inversa.
- Ejemplos resueltos.
- Cuándo usar directa vs inversa.
- FAQ.

### URLs relacionadas o futuras

- `/regla-de-tres`
- `/matematicas/regla-de-tres-directa`
- `/matematicas/regla-de-tres-inversa`
- `/matematicas/regla-de-tres-compuesta`
- `/matematicas/calculadora-de-proporciones`

### FAQ sugeridas

- ¿Qué es la regla de tres y cómo se calcula?
- ¿Cuál es la fórmula de la regla de tres?
- ¿Cuál es la diferencia entre regla de tres directa e inversa?
- ¿Cómo sé si una proporción es directa o inversa?
- ¿Qué significa `A`, `B`, `C` y `X`?
- ¿Qué pasa si el resultado sale negativo?
- ¿La calculadora sirve para tareas escolares?
- ¿Qué es la regla de tres compuesta?

### Schema.org

Agregar JSON-LD para `FAQPage` si el contenido de FAQ está visible en la
página.

---

## Implementación en Astro + Tailwind

### Estructura recomendada

```text
src/pages/matematicas/calculadora-de-regla-de-tres.astro
src/lib/calculators/ruleOfThree.ts
src/lib/calculators/ruleOfThree.test.ts
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
- Mantener consistencia visual con las páginas existentes: `BaseLayout`,
  `Breadcrumb`, fondo oscuro y acentos sobrios.
- Agregar la calculadora al directorio en `src/lib/constants/calculators.ts`.

### Funciones puras sugeridas

```ts
type ProportionType = "direct" | "inverse";

interface RuleOfThreeInput {
  type: ProportionType;
  a: number;
  b: number;
  c: number;
  decimals: number;
  firstUnit?: string;
  secondUnit?: string;
}

interface RuleOfThreeResult {
  x: number;
  formula: string;
  substitution: string;
  fraction: string | null;
  steps: string[];
  verification: string[];
}

calculateDirectRuleOfThree(a, b, c)
calculateInverseRuleOfThree(a, b, c)
calculateRuleOfThree(input)
buildRuleOfThreeSteps(input, result)
verifyRuleOfThree(input, result)
parseRuleOfThreeInput(value)
simplifyFraction(numerator, denominator)
formatRuleNumber(value, decimals)
formatRuleResult(value, options)
```

---

## Casos extremos

| Caso | Comportamiento esperado |
|------|-------------------------|
| `A = 0` | Bloquear cálculo con error específico. |
| Directa con `C = 0` | Resultado `0`, válido. |
| Inversa con `C = 0` | Bloquear cálculo con error específico. |
| `B = 0` | Resultado `0`, válido. |
| Todos los valores iguales | `X = B`, válido. |
| Valores negativos | Permitir y mostrar advertencia informativa. |
| Resultado negativo | Mostrar resultado y nota de contexto. |
| Resultado muy grande | Usar separadores y permitir wrap. |
| Decimales largos | Redondear solo al mostrar. |
| Coma decimal `3,5` | Normalizar a `3.5`. |
| Símbolos pegados `$150` o `20%` | Normalizar si el formato es reconocible. |
| Entrada ambigua `1,2,3` | Bloquear con error de número inválido. |

---

## Criterios de aceptación

| Caso | Inputs | Resultado esperado |
|------|--------|--------------------|
| Directa básica | `A=3`, `B=150`, `C=7` | `X=350` |
| Inversa básica | `A=4`, `B=12`, `C=6` | `X=8` |
| Directa con `C=0` | `A=3`, `B=150`, `C=0` | `X=0` |
| Directa con `A=0` | `A=0`, `B=150`, `C=7` | Error: `El valor A no puede ser cero.` |
| Inversa con `C=0` | `A=4`, `B=12`, `C=0` | Error: `El valor C no puede ser cero en una proporción inversa.` |
| Coma decimal | `A=1,5`, `B=3`, `C=2`, directa | `X=4` |
| Resultado fraccionario | `A=3`, `B=11`, `C=1`, directa | Decimal `3.6667`, fracción `11/3` |
| Negativos | `A=2`, `B=-10`, `C=3`, directa | `X=-15` con advertencia |
| Copiar resultado | Cálculo válido | Portapapeles contiene resultado y fórmula. |
| Limpiar | Cualquier estado | Campos vacíos, tipo directa, decimales `2`. |
| Verificar directa | `3`, `150`, `7` | Muestra `3 × 350 = 7 × 150`. |
| Verificar inversa | `4`, `12`, `6` | Muestra `4 × 12 = 6 × 8`. |

---

## Pruebas recomendadas

### Unitarias

Si se añade Vitest u otro runner de pruebas:

- Fórmula directa con enteros.
- Fórmula inversa con enteros.
- Fórmula directa con decimales.
- Fórmula inversa con decimales.
- Validación de `A = 0`.
- Validación de inversa con `C = 0`.
- Resultado `0`.
- Valores negativos.
- Parsing de formatos comunes.
- Simplificación de fracciones.
- Construcción de pasos.
- Verificación directa e inversa.
- Formato de número y unidades.

### E2E con Playwright

- Escribir valores y ver resultado en tiempo real.
- Cambiar entre directa e inversa.
- Ver paso a paso en móvil.
- Verificar resultado.
- Copiar resultado.
- Limpiar formulario.
- Validar mensajes de error.
- Validar navegación con teclado.
- Revisar layout en móvil y desktop.

---

## Aviso educativo

Texto visible cerca del paso a paso:

```text
Esta calculadora es una herramienta educativa. El resultado depende de que los
valores capturados realmente formen una proporción directa o inversa. Si tienes
dudas, revisa el paso a paso y la verificación antes de usar el resultado.
```
