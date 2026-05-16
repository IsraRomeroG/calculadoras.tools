# Especificación — Calculadora de Regla de Tres

## Descripción general
Herramienta para resolver proporciones de forma rápida e intuitiva.
Es una de las calculadoras con mayor volumen de búsqueda escolar
y cotidiano del sitio: la usan estudiantes de primaria y secundaria,
amas de casa escalando recetas, profesionales calculando proporciones
de mezclas, y cualquier persona que necesite encontrar un valor
desconocido a partir de tres conocidos.

Se ofrecen dos variantes matemáticas (directa e inversa) y casos
de uso guiados por contexto para que el usuario no necesite saber
qué tipo de regla de tres aplica — la calculadora lo detecta
o lo sugiere.

---

## Conceptos matemáticos base

### Regla de tres simple directa
Cuando dos magnitudes son directamente proporcionales:
al aumentar una, la otra aumenta en la misma proporción.

> Ejemplo: Si 3 kg cuestan $150, ¿cuánto cuestan 7 kg?

Estructura:
3 kg    → $150
7 kg    → X

Fórmula:
X = (B × C) / A

Donde:
- A = valor conocido de la primera magnitud → 3
- B = valor conocido de la segunda magnitud → 150
- C = valor desconocido de la primera magnitud → 7
- X = valor a encontrar

---

### Regla de tres simple inversa
Cuando dos magnitudes son inversamente proporcionales:
al aumentar una, la otra disminuye en la misma proporción.

> Ejemplo: Si 4 obreros terminan una obra en 12 días,
> ¿cuántos días tardarán 6 obreros?

Estructura:
4 obreros → 12 días
6 obreros → X días

Fórmula:
X = (A × B) / C

---

### Regla de tres compuesta
Cuando intervienen más de dos magnitudes relacionadas.

> Ejemplo: Si 4 obreros construyen 3 casas en 12 días,
> ¿cuántos días tardarán 6 obreros en construir 5 casas?

Fórmula:
X = (C1 × C2 × ... × B) / (A1 × A2 × ...)

Ajustando signos según si cada magnitud es directa o inversa.

---

## Casos de uso (modos de cálculo)

### Modo 1 — Calculadora clásica (valor desconocido X)
> El modo principal. El usuario ingresa tres valores
> y la calculadora encuentra el cuarto.

**Layout visual:**

A          B
[ 3 ]  →  [ 150 ]
[ 7 ]  →  [  X  ]

**Output:**
- X = **33.33 días**
- Paso a paso detallado mostrando el planteamiento de la proporción
  compuesta y cada operación intermedia.

---

### Modo 4 — Detector automático de tipo de proporción
> El usuario describe la situación en lenguaje natural
> y la calculadora sugiere si es directa o inversa.

**Input:**
- Campo de texto libre → ej. "Si más trabajadores hacen el trabajo
  más rápido..."

**Lógica:**
- Palabras clave de proporción directa: "más... más", "menos... menos",
  "a mayor... mayor", precio, cantidad, distancia, velocidad constante.
- Palabras clave de proporción inversa: "más... menos", "menos... más",
  "a mayor... menor", trabajadores, tiempo, velocidad variable.

**Output:**
- Sugerencia: "Parece una proporción **inversa** ↔
  al aumentar los trabajadores, los días disminuyen."
- Botón: "Usar proporción inversa" / "Cambiar a directa"

> Nota: Este modo es orientativo. El usuario siempre puede
> anular la sugerencia manualmente.

---

## Inputs detallados

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|-------------|-------------------|
| Valor A | Numérico | ≠ 0 | — |
| Valor B | Numérico | Cualquier real | — |
| Valor C | Numérico | Cualquier real | — |
| Tipo de proporción | Selector | Directa / Inversa | Directa |
| Plantilla de contexto | Selector | Ver lista arriba | Ninguna |
| Decimales en resultado | Selector | 0 / 1 / 2 / 3 / 4 | 2 |
| Unidades (opcional) | Texto libre | Hasta 10 caracteres | — |

---

## Validaciones de inputs

| Regla | Detalle |
|-------|---------|
| Valor A ≠ 0 | Error: "El divisor no puede ser cero" |
| Valores numéricos | No aceptar letras ni caracteres especiales |
| Negativos | Permitirlos con advertencia ("resultado negativo") |
| Campos vacíos | Bloquear cálculo y resaltar campo faltante |
| División por cero | Detectar y mostrar mensaje claro antes del cálculo |

---

## Formato de outputs

| Tipo de resultado | Formato |
|-------------------|---------|
| Resultado X | Configurable: 0 a 4 decimales |
| Números grandes | Separador de miles → 1,250,000 |
| Resultado negativo | Mostrar en naranja con advertencia explicativa |
| Resultado fraccionario | Mostrar decimal Y opción de fracción simplificada |
| Unidades | Mostrar junto al resultado si el usuario las ingresó |

---

## Feature — Paso a paso educativo
Siempre visible debajo del resultado. Muestra la resolución
completa de forma clara, útil para estudiantes.

**Ejemplo para regla de tres directa:**

Paso 1: Identificamos los valores conocidos
A = 3 kg  →  B = $150
C = 7 kg  →  X = ?
Paso 2: Como es proporción directa, planteamos:
A / C = B / X
Paso 3: Despejamos X:
X = (C × B) / A
Paso 4: Sustituimos:
X = (7 × 150) / 3
X = 1,050 / 3
X = 350
Resultado: 7 kg cuestan $350

**Ejemplo para regla de tres inversa:**

Paso 1: Identificamos los valores conocidos
A = 4 obreros  →  B = 12 días
C = 6 obreros  →  X = ?
Paso 2: Como es proporción inversa, planteamos:
A × B = C × X
Paso 3: Despejamos X:
X = (A × B) / C
Paso 4: Sustituimos:
X = (4 × 12) / 6
X = 48 / 6
X = 8
Resultado: 6 obreros tardarán 8 días

---

## Feature — Verificación del resultado
Botón "Verificar" que sustituye X en la proporción original
y confirma que la igualdad se cumple.

**Output de verificación:**
- ✅ "Comprobado: 3/7 = 150/350 → 0.4286 = 0.4286 ✓"

---

## Feature — Resultado como fracción
Para usuarios que necesiten el resultado exacto sin redondeo.

**Output adicional (toggle):**
- Resultado decimal: **3.666...**
- Resultado como fracción: **11/3**
- Fracción simplificada: ya simplificada

---

## Features adicionales

### Cálculo en tiempo real
- El resultado y el paso a paso se actualizan automáticamente
  con cada tecla, sin botón de calcular.

### Etiquetas de unidades personalizables
- El usuario puede escribir las unidades de cada magnitud
  (kg, $, días, km, etc.) para que el resultado sea más legible.
- Ejemplo: "7 kg → **$350.00**" en lugar de solo "350".

### Botón de copiar resultado
- Copia el resultado y el paso a paso al portapapeles.

### Botón de invertir proporción
- Intercambia A↔C con un clic para resolver la proporción
  en sentido inverso.

### Botón de limpiar / reset
- Limpia todos los campos con un clic.

### Historial de cálculos
- Últimos 10 cálculos de la sesión.
- Muestra: tipo, valores A/B/C y resultado X.
- Clic en un resultado restaura esos valores.

### Modo oscuro / impresión
- Vista limpia del paso a paso para imprimir o capturar pantalla.
- Útil para estudiantes que deben mostrar su procedimiento.

---

## SEO y contenido de la página

### Meta información
- Title: "Calculadora de Regla de Tres Online — Directa e Inversa"
- Description: "Resuelve reglas de tres simples y compuestas al instante.
  Proporciones directas e inversas con explicación paso a paso.
  Ideal para estudiantes. Gratis."

### URLs sugeridas
- /regla-de-tres (principal)
- /regla-de-tres-directa
- /regla-de-tres-inversa
- /regla-de-tres-compuesta
- /calculadora-de-proporciones

### Preguntas frecuentes (FAQ — para rich snippets)
- ¿Qué es la regla de tres y cómo se calcula?
- ¿Cuál es la diferencia entre regla de tres directa e inversa?
- ¿Cómo sé si una proporción es directa o inversa?
- ¿Qué es la regla de tres compuesta?
- ¿Cómo se plantea una regla de tres?
- ¿Cuál es la fórmula de la regla de tres?

### Contenido de apoyo
- Explicación con ejemplos de la vida cotidiana
  (precios, recetas, velocidad, construcción).
- Tabla de ejemplos resueltos: 10 casos típicos con solución.
- Diferencia visual entre proporción directa e inversa
  con gráfica de líneas (creciente vs decreciente).

---

## Especificaciones técnicas

| Parámetro | Detalle |
|-----------|---------|
| Plataforma | Web responsive (mobile-first) |
| Sin backend | Todo el cálculo ocurre en el cliente (JS) |
| Fracciones | Algoritmo de máximo común divisor (MCD) para simplificar |
| Detector de proporción | Análisis de palabras clave en cliente (sin IA externa) |
| Accesibilidad | Labels en todos los inputs, soporte teclado completo |
| URL principal | /regla-de-tres |
| Idioma | Español (es-MX como locale base) |
| Precisión numérica | Configurable por el usuario (0–4 decimales) |

---

## Casos extremos a contemplar

- A = 0 → error claro: "El valor A no puede ser cero
  porque es el denominador de la proporción"
- Resultado = 0 → válido, mostrar sin error
- Valores negativos → permitir con nota aclaratoria
- Resultado muy grande (ej. millones) → separador de miles,
  no romper layout
- Resultado irracional (ej. √2) → mostrar decimal redondeado
  y opción de más decimales
- Todos los valores iguales → X = B, resultado trivial, válido
- Regla de tres compuesta con magnitudes contradictorias →
  advertencia: "Verifica que los tipos de proporción sean correctos"
- Usuario ingresa coma decimal europea (3,5) →
  normalizar automáticamente a punto (3.5)