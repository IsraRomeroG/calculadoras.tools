# Especificación v1 - Calculadora de probabilidad básica

## Descripción general

Herramienta para calcular probabilidades básicas con eventos simples,
complemento, unión e intersección. Debe ser educativa y útil para clases,
ejemplos cotidianos y ejercicios introductorios de estadística.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular probabilidad de un evento con casos favorables y casos posibles.
- Calcular complemento `P(no A)`.
- Calcular unión e intersección con datos manuales.
- Mostrar resultados como fracción, decimal y porcentaje.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `Evento simple`.
- Modo `Complemento`.
- Modo `Unión de eventos`.
- Modo `Probabilidad condicional`.
- Resultado en porcentaje, decimal y fracción simplificada.
- Copiar resultado y limpiar formulario.

### Fase 2

- Árbol de probabilidad simple.
- Eventos independientes vs dependientes con explicación visual.
- Simulación con dados/monedas.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-probabilidad-basica` |
| URL futura si existe Estadística | `/estadistica/calculadora-probabilidad-basica` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-probabilidad-basica.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-probabilidad-basica/basicProbability.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-probabilidad-basica/basicProbability.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `estadistica` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Usar control segmentado para modos.
- Mostrar solo los inputs relevantes por modo.
- Resultado principal como porcentaje.
- Fracción y decimal como resultados secundarios.
- Incluir explicación breve en una sección colapsable.

---

## Flujo principal MVP

**Ejemplo:** Hay `3` casos favorables de `12` posibles. ¿Cuál es la probabilidad?

### Inputs por modo

| Modo | Campos requeridos |
|------|-------------------|
| Evento simple | casos favorables, casos posibles |
| Complemento | probabilidad de A |
| Unión | P(A), P(B), P(A y B) |
| Condicional | P(A y B), P(B) |

### Outputs principales

- Probabilidad en porcentaje.
- Probabilidad decimal.
- Fracción simplificada cuando aplique.
- Fórmula utilizada.
- Validación de coherencia.

---

## Fórmulas

Evento simple:

```text
P(A) = casos_favorables / casos_posibles
```

Complemento:

```text
P(no A) = 1 - P(A)
```

Unión:

```text
P(A o B) = P(A) + P(B) - P(A y B)
```

Condicional:

```text
P(A | B) = P(A y B) / P(B)
```

---

## Validaciones y estados

- Probabilidades deben estar entre `0` y `1` o `0%` y `100%`.
- Casos favorables no pueden superar casos posibles.
- Casos posibles deben ser mayores que cero.
- En unión, `P(A y B)` no puede ser mayor que `P(A)` ni `P(B)`.
- En condicional, `P(B)` debe ser mayor que cero.
- Redondear porcentajes a 2 decimales.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de probabilidad básica` |
| Meta description | `Calcula probabilidades simples, complemento, unión y probabilidad condicional con resultados en fracción, decimal y porcentaje.` |
| H1 | `Calculadora de probabilidad` |
| Keyword principal | `calculadora probabilidad` |
| Keywords secundarias | `probabilidad basica`, `probabilidad condicional`, `union de eventos` |

### FAQs sugeridas

- ¿Cómo se calcula una probabilidad simple?
- ¿Qué es el complemento de un evento?
- ¿Qué significa P(A o B)?
- ¿Qué es probabilidad condicional?

---

## Pruebas sugeridas

- `3/12` produce `25%`.
- Complemento de `0.25` produce `0.75`.
- Unión con `P(A)=0.4`, `P(B)=0.5`, `P(AyB)=0.2` produce `0.7`.
- Condicional con `0.2/0.5` produce `0.4`.
- Casos favorables mayores a posibles muestran error.

