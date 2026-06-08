# Especificación v1 - Calculadora de CPC, CPM y CPA

## Descripción general

Herramienta para calcular costos publicitarios por clic, mil impresiones y
adquisición a partir de gasto y resultados capturados manualmente.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend ni
integraciones con plataformas de anuncios.

---

## Objetivo de producto

- Calcular CPC, CPM y CPA en un mismo resumen.
- Mostrar qué volumen sustenta cada métrica.
- Planificar resultados posibles con un costo objetivo.
- Detectar denominadores vacíos o inconsistentes.
- Facilitar comparación entre campañas.

---

## Alcance recomendado

### MVP

- Gasto, impresiones, clics y adquisiciones.
- CPC, CPM y CPA.
- CTR y conversión como métricas auxiliares.
- Modos inversos con costo objetivo.
- Copiar resumen y limpiar formulario.

### Fase 2

- Comparador entre campañas.
- Lista de periodos.
- Métricas por canal.
- Exportación CSV.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/marketing/calculadora-cpc-cpm-cpa` |
| Archivo Astro recomendado | `src/pages/marketing/calculadora-cpc-cpm-cpa.astro` |
| Lógica de cálculo | `src/lib/calculators/marketing/calculadora-cpc-cpm-cpa/adCosts.ts` |
| Pruebas unitarias | `src/lib/calculators/marketing/calculadora-cpc-cpm-cpa/adCosts.test.ts` |
| Categoría | `marketing` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar CPC, CPM y CPA en tres resultados estables.
- Etiquetar métricas no disponibles cuando su denominador sea cero.
- Mantener gasto y periodo visibles.
- No marcar un costo como bueno o malo sin objetivo.

---

## Flujo principal MVP

### Inputs del MVP

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Gasto publicitario | Texto numérico | `>= 0` | vacío |
| Impresiones | Texto numérico entero | `>= 0` | vacío |
| Clics | Texto numérico entero | `>= 0` | vacío |
| Adquisiciones | Texto numérico entero | `>= 0` | vacío |
| CPC / CPM / CPA objetivo | Textos numéricos opcionales | `> 0` | vacío |

### Outputs principales

- CPC.
- CPM.
- CPA.
- CTR auxiliar.
- Conversión clic a adquisición.
- Volumen estimado según costo objetivo.

---

## Fórmulas

```text
CPC = clics > 0 ? gasto / clics : null
CPM = impresiones > 0 ? gasto / impresiones * 1000 : null
CPA = adquisiciones > 0 ? gasto / adquisiciones : null
CTR = impresiones > 0 ? clics / impresiones * 100 : null
conversion = clics > 0 ? adquisiciones / clics * 100 : null
volumen_objetivo = floor(gasto / costo_objetivo)
```

---

## Validaciones y estados

- Gasto y volúmenes no pueden ser negativos.
- Clics mayores a impresiones muestran advertencia.
- Adquisiciones mayores a clics requieren confirmación de conversiones múltiples.
- Denominador cero muestra métrica no disponible.
- Comparaciones deben usar moneda y periodo compatibles.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de CPC, CPM y CPA` |
| Meta description | `Calcula CPC, CPM, CPA, CTR y conversión usando gasto, impresiones, clics y adquisiciones.` |
| H1 | `Calculadora de costos publicitarios` |
| Keyword principal | `calculadora CPC CPM CPA` |
| Keywords secundarias | `costo por clic`, `costo por mil impresiones`, `costo por adquisición` |

---

## Pruebas sugeridas

- Gasto `1000` y `500` clics producen CPC `2`.
- Gasto `1000` y `100000` impresiones producen CPM `10`.
- Gasto `1000` y `20` adquisiciones producen CPA `50`.
- Denominador cero muestra métrica no disponible.
- Volumen objetivo se redondea hacia abajo.

