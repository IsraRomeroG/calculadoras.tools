# Especificación v1 - Calculadora de MCD y MCM

## Descripción general

Herramienta para calcular el máximo común divisor (MCD) y mínimo común múltiplo
(MCM) de dos o más números enteros. Debe servir para tareas escolares, fracciones,
proporciones, simplificación y ejercicios básicos de aritmética.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular MCD y MCM de una lista de enteros.
- Mostrar procedimiento paso a paso con algoritmo de Euclides.
- Permitir separar números por coma, espacio o salto de línea.
- Manejar ceros, negativos y duplicados con reglas claras.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Entrada de lista de números.
- Selector de cálculo: `MCD`, `MCM` o `Ambos`.
- Resultado principal.
- Procedimiento básico.
- Copiar resultado y limpiar formulario.
- Ejemplos rápidos.

### Fase 2

- Descomposición en factores primos.
- Tabla comparativa de factores.
- Simplificar fracción usando MCD.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/matematicas/calculadora-mcd-mcm` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-mcd-mcm.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-mcd-mcm/gcdLcm.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-mcd-mcm/gcdLcm.test.ts` |
| Categoría | `matematicas` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Textarea compacto para la lista de números.
- Resultado principal arriba del procedimiento.
- Ejemplos como chips para cargar casos frecuentes.
- Procedimiento paso a paso en sección colapsable.
- No usar tablas grandes en el primer viewport.

---

## Flujo principal MVP

**Ejemplo:** Ingreso `12, 18, 30`. ¿Cuál es el MCD y MCM?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Números | Textarea | 2-50 enteros | vacío |
| Cálculo | Selector | `MCD`, `MCM`, `Ambos` | `Ambos` |

### Outputs principales

- MCD.
- MCM.
- Lista normalizada de números.
- Procedimiento con pares procesados.
- Advertencias por ceros o signos.

---

## Fórmulas y algoritmo

Normalización:

```text
numeros = tokens parseados como enteros
valores = numeros.map(abs)
```

MCD de dos números por Euclides:

```text
gcd(a, b):
  while b != 0:
    temp = b
    b = a % b
    a = temp
  return abs(a)
```

MCD de lista:

```text
mcd_lista = valores.reduce(gcd)
```

MCM de dos números:

```text
lcm(a, b) = abs(a * b) / gcd(a, b)
```

MCM de lista:

```text
mcm_lista = valores.reduce(lcm)
```

Regla con cero:

```text
gcd(a, 0) = abs(a)
lcm(a, 0) = 0
```

---

## Validaciones y estados

- Requerir al menos 2 números.
- Aceptar negativos, pero calcular con valor absoluto.
- No aceptar decimales.
- Si todos los valores son `0`, el MCD puede mostrarse como `0` con nota especial.
- Limitar a 50 números para evitar resultados enormes.
- Mostrar advertencia si el MCM supera `Number.MAX_SAFE_INTEGER`.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de MCD y MCM` |
| Meta description | `Calcula el máximo común divisor y mínimo común múltiplo de dos o más números con procedimiento paso a paso.` |
| H1 | `Calculadora de MCD y MCM` |
| Keyword principal | `calculadora mcd mcm` |
| Keywords secundarias | `maximo comun divisor`, `minimo comun multiplo`, `algoritmo de euclides` |

### FAQs sugeridas

- ¿Qué es el MCD?
- ¿Qué es el MCM?
- ¿Cómo funciona el algoritmo de Euclides?
- ¿Se pueden usar números negativos?

---

## Pruebas sugeridas

- `12, 18, 30` produce MCD `6` y MCM `180`.
- `7, 13` produce MCD `1` y MCM `91`.
- `0, 12` produce MCD `12` y MCM `0`.
- Negativos se calculan con valor absoluto.
- Decimales muestran error.

