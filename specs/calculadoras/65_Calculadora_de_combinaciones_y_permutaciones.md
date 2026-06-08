# Especificación v1 - Calculadora de combinaciones y permutaciones

## Descripción general

Herramienta para calcular combinaciones, permutaciones y arreglos con o sin
repetición. Debe ayudar a resolver ejercicios de conteo, probabilidad, sorteos y
selección de elementos.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular combinaciones `nCk`.
- Calcular permutaciones `nPk`.
- Incluir variantes con repetición en MVP.
- Mostrar fórmula y sustitución de valores.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Inputs `n` y `k`.
- Tipo de cálculo: combinación, permutación, combinación con repetición, permutación con repetición.
- Resultado exacto cuando sea seguro.
- Fórmula usada.
- Copiar resultado y limpiar formulario.

### Fase 2

- Factoriales paso a paso.
- Soporte BigInt para resultados muy grandes.
- Ejemplos de lotería/cartas.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-combinaciones-permutaciones` |
| URL futura si existe Estadística | `/estadistica/calculadora-combinaciones-permutaciones` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-combinaciones-permutaciones.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-combinaciones-permutaciones/combinatorics.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-combinaciones-permutaciones/combinatorics.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `estadistica` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Selector de tipo de cálculo con etiquetas cortas.
- Resultado principal grande.
- Fórmula en bloque secundario.
- Inputs `n` y `k` alineados en desktop, apilados en móvil.
- Mostrar advertencia cuando el resultado sea enorme.

---

## Flujo principal MVP

**Ejemplo:** ¿Cuántas formas hay de elegir `3` personas de un grupo de `10`?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| n | Texto numérico entero | `0-170` | vacío |
| k | Texto numérico entero | `0-170` | vacío |
| Tipo | Selector | ver tabla | `Combinación` |

### Tipos de cálculo

| Tipo | Fórmula |
|------|---------|
| Combinación sin repetición | `n! / (k!(n-k)!)` |
| Permutación sin repetición | `n! / (n-k)!` |
| Combinación con repetición | `(n+k-1)! / (k!(n-1)!)` |
| Permutación con repetición | `n^k` |

---

## Fórmulas

Factorial:

```text
factorial(0) = 1
factorial(n) = n * factorial(n - 1)
```

Combinación:

```text
C(n, k) = n! / (k! * (n-k)!)
```

Permutación:

```text
P(n, k) = n! / (n-k)!
```

Combinación con repetición:

```text
CR(n, k) = C(n + k - 1, k)
```

Permutación con repetición:

```text
PR(n, k) = n^k
```

---

## Validaciones y estados

- `n` y `k` deben ser enteros no negativos.
- En cálculos sin repetición, `k <= n`.
- En combinación con repetición, `n > 0`.
- Limitar factorial con `Number` a `170`; para valores mayores proponer BigInt en fase 2.
- Mostrar resultado en notación científica si supera longitud razonable.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de combinaciones y permutaciones` |
| Meta description | `Calcula combinaciones y permutaciones con o sin repetición. Incluye fórmula y resultado paso a paso.` |
| H1 | `Calculadora de combinaciones y permutaciones` |
| Keyword principal | `calculadora combinaciones permutaciones` |
| Keywords secundarias | `nck calculadora`, `permutaciones formula`, `combinaciones con repeticion` |

### FAQs sugeridas

- ¿Cuál es la diferencia entre combinación y permutación?
- ¿Qué significa con repetición?
- ¿Qué pasa si k es mayor que n?
- ¿Para qué sirve el factorial?

---

## Pruebas sugeridas

- `C(10, 3)` produce `120`.
- `P(10, 3)` produce `720`.
- `CR(5, 3)` produce `35`.
- `PR(5, 3)` produce `125`.
- `k > n` sin repetición muestra error.

