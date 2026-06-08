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
- Resultado de raíces.
- Discriminante.
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
- Resultado principal antes del procedimiento.
- Usar formato matemático textual claro sin depender de LaTeX externo.
- Procedimiento en sección colapsable.
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

### Outputs principales

- Discriminante.
- Tipo de solución.
- Raíz 1.
- Raíz 2.
- Vértice opcional como dato secundario.
- Procedimiento paso a paso.

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
parte_imaginaria = sqrt(abs(D)) / (2a)
x1 = parte_real + parte_imaginaria i
x2 = parte_real - parte_imaginaria i
```

Vértice:

```text
xv = -b / (2a)
yv = a*xv^2 + b*xv + c
```

---

## Validaciones y estados

- `a` no puede ser `0`; si lo es, indicar que no es cuadrática.
- Aceptar coeficientes decimales.
- Si `D = 0`, mostrar raíz doble.
- Si `D < 0`, mostrar solución compleja.
- Redondear solo para presentación.
- Evitar `-0` en resultados.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ecuaciones cuadráticas` |
| Meta description | `Resuelve ecuaciones cuadráticas con fórmula general, discriminante, raíces reales o complejas y procedimiento paso a paso.` |
| H1 | `Calculadora de ecuaciones cuadráticas` |
| Keyword principal | `calculadora ecuaciones cuadraticas` |
| Keywords secundarias | `formula general`, `resolver ax2 bx c`, `discriminante cuadratica` |

### FAQs sugeridas

- ¿Qué es el discriminante?
- ¿Qué pasa si el discriminante es negativo?
- ¿Por qué `a` no puede ser cero?
- ¿La calculadora muestra raíces complejas?

---

## Pruebas sugeridas

- `a=1, b=-5, c=6` produce raíces `3` y `2`.
- `a=1, b=2, c=1` produce raíz doble `-1`.
- `a=1, b=0, c=1` produce raíces complejas `±i`.
- `a=0` muestra error.
- Coeficientes decimales se calculan correctamente.

