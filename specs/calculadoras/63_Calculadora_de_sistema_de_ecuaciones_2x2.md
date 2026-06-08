# Especificación v1 - Calculadora de sistema de ecuaciones 2x2

## Descripción general

Herramienta para resolver sistemas lineales de dos ecuaciones con dos incógnitas:
`a1x + b1y = c1` y `a2x + b2y = c2`. Debe mostrar solución única, sin solución o
infinitas soluciones.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Resolver sistemas 2x2 por determinantes.
- Mostrar procedimiento con regla de Cramer y/o eliminación.
- Identificar sistemas incompatibles o dependientes.
- Permitir coeficientes negativos y decimales.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Inputs para 6 coeficientes.
- Resultado `x` e `y`.
- Determinantes `D`, `Dx`, `Dy`.
- Estado del sistema.
- Copiar resultado y limpiar formulario.
- Ejemplos rápidos.

### Fase 2

- Parser de ecuaciones escritas en texto.
- Método de eliminación paso a paso.
- Gráfica simple de rectas en SVG.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-sistema-ecuaciones-2x2` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-sistema-ecuaciones-2x2.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-sistema-ecuaciones-2x2/linearSystem2x2.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-sistema-ecuaciones-2x2/linearSystem2x2.test.ts` |
| Categoría | `matematicas` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Mostrar cada ecuación como una fila compacta en desktop y bloques en móvil.
- Inputs pequeños pero con labels claras: `a1`, `b1`, `c1`.
- Resultado principal antes del procedimiento.
- Procedimiento en acordeón.
- No usar gráfica en el MVP.

---

## Flujo principal MVP

**Ejemplo:** Resolver:

```text
2x + 3y = 13
x - y = 1
```

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| a1 | Texto numérico | cualquier número real | vacío |
| b1 | Texto numérico | cualquier número real | vacío |
| c1 | Texto numérico | cualquier número real | vacío |
| a2 | Texto numérico | cualquier número real | vacío |
| b2 | Texto numérico | cualquier número real | vacío |
| c2 | Texto numérico | cualquier número real | vacío |
| Decimales | Selector | `0-8` | `4` |

### Outputs principales

- Estado: solución única, sin solución o infinitas soluciones.
- Valor de `x`.
- Valor de `y`.
- Determinantes.
- Procedimiento.

---

## Fórmulas

Determinante principal:

```text
D = a1*b2 - a2*b1
```

Determinantes de Cramer:

```text
Dx = c1*b2 - c2*b1
Dy = a1*c2 - a2*c1
```

Si `D != 0`:

```text
x = Dx / D
y = Dy / D
```

Si `D = 0`:

```text
Dx = 0 y Dy = 0 => infinitas soluciones
Dx != 0 o Dy != 0 => sin solución
```

---

## Validaciones y estados

- Requerir todos los coeficientes.
- Aceptar decimales y negativos.
- Si ambas ecuaciones tienen todos los coeficientes de variables en cero, mostrar estado especial.
- Usar tolerancia pequeña para comparar con cero si hay decimales: `1e-10`.
- Evitar mostrar `-0`.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de sistema de ecuaciones 2x2` |
| Meta description | `Resuelve sistemas de dos ecuaciones con dos incógnitas usando determinantes y regla de Cramer.` |
| H1 | `Calculadora de sistema 2x2` |
| Keyword principal | `calculadora sistema ecuaciones 2x2` |
| Keywords secundarias | `regla de cramer`, `resolver sistema lineal`, `dos ecuaciones dos incognitas` |

### FAQs sugeridas

- ¿Qué es un sistema 2x2?
- ¿Qué significa que el determinante sea cero?
- ¿Qué es la regla de Cramer?
- ¿Puede haber infinitas soluciones?

---

## Pruebas sugeridas

- `2x + 3y = 13`, `x - y = 1` produce `x=3.2`, `y=2.2`.
- Sistema `x + y = 2`, `2x + 2y = 4` produce infinitas soluciones.
- Sistema `x + y = 2`, `2x + 2y = 5` produce sin solución.
- Decimales se calculan con tolerancia.
- Coeficientes vacíos muestran error.

