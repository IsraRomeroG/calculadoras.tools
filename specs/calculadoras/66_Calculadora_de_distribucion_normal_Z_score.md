# Especificación v1 - Calculadora de distribución normal / Z-score

## Descripción general

Herramienta para calcular Z-score y probabilidades aproximadas de una distribución
normal estándar. Debe servir para estadística básica, percentiles, ejercicios y
comparación de valores con media y desviación estándar.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular Z-score a partir de valor, media y desviación estándar.
- Calcular probabilidad acumulada `P(Z <= z)`.
- Calcular cola derecha y probabilidad entre dos valores.
- Mostrar percentil aproximado.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `Z-score`.
- Modo `Probabilidad con z`.
- Modo `Entre dos valores`.
- Aproximación local de CDF normal estándar.
- Resultado en decimal y porcentaje.
- Copiar resultado y limpiar formulario.

### Fase 2

- Z inverso por percentil.
- Tabla Z interactiva.
- Gráfica SVG de campana normal.
- Historial en `sessionStorage`.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL inmediata recomendada | `/matematicas/calculadora-distribucion-normal-z-score` |
| URL futura si existe Estadística | `/estadistica/calculadora-distribucion-normal-z-score` |
| Archivo Astro recomendado | `src/pages/matematicas/calculadora-distribucion-normal-z-score.astro` |
| Lógica de cálculo | `src/lib/calculators/matematicas/calculadora-distribucion-normal-z-score/normalDistribution.ts` |
| Pruebas unitarias | `src/lib/calculators/matematicas/calculadora-distribucion-normal-z-score/normalDistribution.test.ts` |
| Categoría inmediata | `matematicas` |
| Categoría futura opcional | `estadistica` |
| Locale base | `es-MX` |

---

## Comportamiento mobile-first

- Usar control segmentado para modos.
- Resultado principal como probabilidad o Z-score.
- Mostrar percentil como resultado secundario.
- Explicación de cola izquierda/derecha con texto breve.
- Gráfica opcional solo en fase futura.

---

## Flujo principal MVP

**Ejemplo:** Un valor `85` en una distribución con media `70` y desviación `10`.
¿Cuál es su Z-score y percentil?

### Inputs por modo

| Modo | Campos requeridos |
|------|-------------------|
| Z-score | valor, media, desviación estándar |
| Probabilidad con z | z |
| Entre dos valores | valor inferior, valor superior, media, desviación estándar |

### Outputs principales

- Z-score.
- Probabilidad acumulada.
- Cola derecha.
- Probabilidad entre valores.
- Percentil aproximado.

---

## Fórmulas

Z-score:

```text
z = (x - media) / desviacion_estandar
```

CDF normal estándar:

```text
Phi(z) = 0.5 * (1 + erf(z / sqrt(2)))
```

Si no hay `Math.erf`, implementar aproximación numérica local.

Colas:

```text
P(Z <= z) = Phi(z)
P(Z > z) = 1 - Phi(z)
P(a <= X <= b) = Phi(z_b) - Phi(z_a)
```

---

## Validaciones y estados

- Desviación estándar debe ser mayor que cero.
- Valores pueden ser negativos.
- Para z extremo menor a `-8` o mayor a `8`, mostrar probabilidad saturada cercana a 0 o 1.
- Redondear Z a 4 decimales y probabilidades a 6 decimales.
- No presentar resultados como análisis estadístico avanzado.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de distribución normal y Z-score` |
| Meta description | `Calcula Z-score, percentil y probabilidades de la distribución normal estándar con media y desviación estándar.` |
| H1 | `Calculadora de Z-score` |
| Keyword principal | `calculadora z score` |
| Keywords secundarias | `distribucion normal calculadora`, `percentil z`, `probabilidad normal` |

### FAQs sugeridas

- ¿Qué es un Z-score?
- ¿Qué significa el percentil?
- ¿Cómo se calcula una probabilidad normal?
- ¿Qué es la desviación estándar?

---

## Pruebas sugeridas

- `x=85`, media `70`, desviación `10` produce `z=1.5`.
- `Phi(0)` produce `0.5`.
- `Phi(1.96)` produce aproximadamente `0.975`.
- Desviación `0` muestra error.
- Probabilidad entre `-1` y `1` produce aproximadamente `0.6827`.

