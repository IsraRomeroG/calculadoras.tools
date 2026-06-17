# Especificación v1 - Calculadora de ecuaciones cuadráticas

## Descripción general

Herramienta para resolver ecuaciones cuadráticas de la forma `ax² + bx + c = 0`.
Debe mostrar raíces reales o complejas, discriminante y procedimiento con fórmula
general.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Resolver ecuaciones cuadráticas con coeficientes `a`, `b` y `c`.
- Mostrar discriminante y tipo de solución.
- Soportar raíces reales dobles, reales distintas y complejas.
- Mostrar fórmula sustituida paso a paso.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Inputs para `a`, `b`, `c`.
- Vista previa dinámica de la ecuación normalizada.
- Resultado de raíces.
- Discriminante.
- Interpretación del discriminante en lenguaje claro.
- Vértice como dato secundario.
- Resultado exacto cuando sea razonable, además del valor decimal.
- Procedimiento con fórmula general.
- Copiar resultado y limpiar formulario.
- Ejemplos rápidos.

### Fase 2

- Parser de ecuaciones escritas como texto.
- Forma factorizada cuando sea posible.
- Gráfica simple de parábola con SVG.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-ecuaciones-cuadraticas` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-ecuaciones-cuadraticas.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-ecuaciones-cuadraticas/quadratic.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-ecuaciones-cuadraticas/quadratic.test.ts` |
| Categoría | `matematicas` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar los tres coeficientes en una fila solo en desktop; en móvil usar columna.
- Usar inputs grandes y fáciles de tocar, con `inputmode="decimal"`.
- Aceptar coma decimal y punto decimal en los coeficientes.
- Mostrar vista previa de la ecuación justo después de los inputs.
- Resultado principal antes del procedimiento.
- Mostrar interpretación breve del resultado junto al discriminante.
- Usar formato matemático textual claro sin depender de LaTeX externo.
- Procedimiento en sección colapsable.
- Mantener los botones `Copiar` y `Limpiar` cerca del resultado.
- Usar ejemplos rápidos como chips o botones compactos.
- Evitar tablas para resultados en móvil; usar bloques o filas apiladas.
- Evitar canvas o gráfica en MVP.

---

## Flujo principal MVP

**Ejemplo:** Resolver `x² - 5x + 6 = 0`.

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Coeficiente a | Texto numérico | distinto de `0` | vacío |
| Coeficiente b | Texto numérico | cualquier número real | vacío |
| Coeficiente c | Texto numérico | cualquier número real | vacío |
| Decimales | Selector | `0-8` | `4` |

Los inputs deben aceptar valores con coma o punto decimal, por ejemplo `1,5` y
`1.5`. Para cálculo interno se normalizan a número real.

### Vista previa de ecuación

Mientras el usuario escribe, mostrar la ecuación con signos y coeficientes
normalizados:

```text
x² - 5x + 6 = 0
```

Reglas recomendadas:

- Omitir coeficiente `1` en `x²` y `x`.
- Mostrar `-x²` o `-x` cuando el coeficiente sea `-1`.
- Evitar secuencias como `+ -`, `--` o `1x²`.
- Si hay campos incompletos, mostrar una vista previa parcial o un estado neutro.

### Outputs principales

- Discriminante.
- Tipo de solución.
- Interpretación del discriminante.
- Raíz 1.
- Raíz 2.
- Valor exacto de las raíces cuando sea razonable.
- Valor decimal de las raíces según el selector de decimales.
- Vértice como dato secundario.
- Procedimiento paso a paso.

### Interpretación del resultado

La calculadora debe explicar qué significa el discriminante:

- Si `D > 0`: hay dos raíces reales distintas y la parábola corta el eje X en dos puntos.
- Si `D = 0`: hay una raíz real doble y la parábola toca el eje X en un solo punto.
- Si `D < 0`: no hay raíces reales; las raíces son complejas y la parábola no corta el eje X.

---

## Fórmulas

Discriminante:

```text
D = b^2 - 4ac
```

Raíces reales:

```text
x1 = (-b + sqrt(D)) / (2a)
x2 = (-b - sqrt(D)) / (2a)
```

Raíces complejas:

```text
parte_real = -b / (2a)
parte_imaginaria = sqrt(abs(D)) / abs(2a)
x1 = parte_real + parte_imaginaria i
x2 = parte_real - parte_imaginaria i
```

Vértice:

```text
xv = -b / (2a)
yv = a*xv^2 + b*xv + c
```

Forma exacta sugerida:

```text
x1 = (-b + sqrt(D)) / (2a)
x2 = (-b - sqrt(D)) / (2a)
```

Cuando `D` sea un cuadrado perfecto, simplificar a enteros o decimales exactos.
Cuando `D` no sea cuadrado perfecto y `D > 0`, mostrar forma con radical y valor
decimal. Para raíces complejas, mostrar parte real y parte imaginaria.

---

## Validaciones y estados

- `a` no puede ser `0`; si lo es, indicar que no es cuadrática.
- Aceptar coeficientes decimales.
- Aceptar coma decimal y punto decimal.
- Mostrar errores específicos para campos vacíos o valores no numéricos.
- No calcular si un campo contiene un valor incompleto como `-`, `+`, `.`, `,`.
- Si `D = 0`, mostrar raíz doble.
- Si `D < 0`, mostrar solución compleja.
- Tratar valores de `D` muy cercanos a cero como cero para evitar errores de precisión decimal.
- Redondear solo para presentación.
- Evitar `-0` en resultados.
- Ordenar raíces reales de menor a mayor o indicar claramente el criterio usado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ecuaciones cuadráticas` |
| Meta description | `Resuelve ecuaciones cuadráticas con fórmula general, discriminante, raíces reales o complejas y procedimiento paso a paso.` |
| H1 | `Calculadora de ecuaciones cuadráticas` |
| Keyword principal | `calculadora de ecuaciones cuadráticas` |
| Keywords secundarias | `calculadora ecuaciones cuadraticas`, `calculadora formula general`, `resolver ecuaciones de segundo grado`, `resolver ax2 bx c`, `discriminante cuadratica`, `raíces reales y complejas` |

### FAQs sugeridas

- ¿Qué es el discriminante?
- ¿Qué pasa si el discriminante es negativo?
- ¿Por qué `a` no puede ser cero?
- ¿La calculadora muestra raíces complejas?
- ¿Qué significa que una raíz sea doble?
- ¿Qué representa el vértice de la parábola?

---

## Pruebas sugeridas

- `a=1, b=-5, c=6` produce raíces `3` y `2`.
- `a=1, b=2, c=1` produce raíz doble `-1`.
- `a=1, b=0, c=1` produce raíces complejas `±i`.
- `a=0` muestra error.
- Coeficientes decimales se calculan correctamente.
- Coeficientes con coma decimal se calculan correctamente.
- La vista previa muestra `x² - 5x + 6 = 0` para `a=1, b=-5, c=6`.
- `D > 0`, `D = 0` y `D < 0` muestran interpretaciones distintas.
- Resultados no muestran `-0`.
- Valores incompletos como `-` o `,` no disparan cálculo.

