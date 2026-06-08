# Especificación v1 - Calculadora de precio por metro cuadrado

## Descripción general

Herramienta para calcular el precio por metro cuadrado de una propiedad, terreno
o espacio, y comparar varias opciones usando precio total y superficie.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular precio por metro cuadrado.
- Calcular precio total desde superficie y precio por m².
- Comparar hasta varias propiedades con datos manuales.
- Convertir superficies entre m², ft², hectáreas y acres.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modos `Precio por m²` y `Precio total`.
- Precio total, superficie y unidad.
- Resultado principal y conversiones.
- Comparador opcional de propiedades.
- Copiar resultado, limpiar formulario y exportar CSV.

### Fase 2

- Comparar precio por m² construido y de terreno.
- Costos adicionales editables.
- Historial en `sessionStorage`.
- Tabla de escenarios.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/inmuebles/calculadora-precio-por-metro-cuadrado` |
| Archivo Astro recomendado | `src/pages/inmuebles/calculadora-precio-por-metro-cuadrado.astro` |
| Lógica de cálculo | `src/lib/calculators/inmuebles/calculadora-precio-por-metro-cuadrado/pricePerArea.ts` |
| Pruebas unitarias | `src/lib/calculators/inmuebles/calculadora-precio-por-metro-cuadrado/pricePerArea.test.ts` |
| Categoría | `inmuebles` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Usar control segmentado para los dos modos.
- Resultado principal visible antes de conversiones.
- Comparador como bloques editables en móvil.
- Mantener unidades visibles junto a cada input.
- No sugerir que el menor precio por m² es automáticamente la mejor compra.

---

## Flujo principal MVP

**Ejemplo:** Una vivienda cuesta `$3,000,000` y tiene `120 m²`. ¿Cuál es su
precio por metro cuadrado?

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Modo | Selector | `Precio por superficie`, `Precio total` | `Precio por superficie` |
| Precio total | Texto numérico | `> 0` | vacío |
| Superficie | Texto numérico | `> 0` | vacío |
| Unidad de superficie | Selector | `m²`, `ft²`, `ha`, `acre` | `m²` |
| Precio por unidad | Texto numérico | `> 0` | vacío |

### Outputs principales

- Precio por m².
- Precio por ft².
- Precio total calculado.
- Superficie convertida.
- Comparación relativa entre propiedades.

---

## Fórmulas

Convertir superficie a metros cuadrados:

```text
ft2_a_m2 = ft2 * 0.09290304
ha_a_m2 = ha * 10000
acre_a_m2 = acre * 4046.8564224
```

Precio por superficie:

```text
precio_por_m2 = precio_total / superficie_m2
```

Precio total:

```text
precio_total = superficie_m2 * precio_por_m2
```

---

## Validaciones y estados

- Precio y superficie deben ser mayores que cero.
- No permitir división entre cero.
- Redondear moneda a 2 decimales.
- Conservar precisión interna en conversiones.
- Si se comparan propiedades con unidades distintas, normalizar a m².

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de precio por metro cuadrado` |
| Meta description | `Calcula el precio por metro cuadrado de una propiedad o terreno y compara opciones con distintas superficies.` |
| H1 | `Calculadora de precio por metro cuadrado` |
| Keyword principal | `precio por metro cuadrado calculadora` |
| Keywords secundarias | `precio m2`, `calcular valor por metro cuadrado`, `comparar propiedades` |

### FAQs sugeridas

- ¿Cómo se calcula el precio por metro cuadrado?
- ¿Se usa superficie construida o terreno?
- ¿Puedo comparar propiedades de distinto tamaño?
- ¿La calculadora estima el valor de mercado?

---

## Pruebas sugeridas

- `$3,000,000 / 120 m²` produce `$25,000/m²`.
- `1000 ft²` se convierte a `92.90304 m²`.
- Modo precio total multiplica correctamente.
- Superficie cero muestra error.
- Comparaciones normalizan unidades.

