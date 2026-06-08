# Especificación v1 - Calculadora de ROI: retorno de inversión

## Descripción general

Herramienta para calcular el retorno de inversión de un proyecto, compra,
campaña, activo o negocio usando datos ingresados por el usuario. Debe mostrar
ganancia, ROI porcentual, multiplicador y punto de equilibrio de forma simple.

**Arquitectura:** todo el cálculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas.

---

## Objetivo de producto

- Calcular ROI simple con inversión inicial y retorno final.
- Permitir un modo de ingresos y costos para negocios o campañas.
- Mostrar utilidad, ROI, margen sobre ingresos y múltiplo de inversión.
- Explicar cuándo el resultado es ganancia, pérdida o punto de equilibrio.
- Generar una página estática optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Modo `ROI simple`: inversión inicial y valor/retorno final.
- Modo `Ingresos y costos`: ingresos, costos variables, costos fijos y otros.
- Plazo opcional para calcular ROI anualizado.
- Resultado principal con ROI porcentual.
- Bloque de interpretación: pérdida, equilibrio, rendimiento positivo.
- Copiar resumen, limpiar formulario y exportar escenario a CSV.

### Fase 2

- Comparador de hasta 3 inversiones.
- Sensibilidad por escenarios conservador/base/optimista.
- Historial de cálculos en `sessionStorage`.
- Gráfica simple de punto de equilibrio.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL pública recomendada | `/finanzas/calculadora-de-roi` |
| Archivo Astro recomendado | `src/pages/finanzas/calculadora-de-roi.astro` |
| Lógica de cálculo | `src/lib/calculators/finanzas/calculadora-de-roi/roi.ts` |
| Pruebas unitarias | `src/lib/calculators/finanzas/calculadora-de-roi/roi.test.ts` |
| Categoría | `finanzas` |
| Locale base | `es-MX` |
| Moneda base | `MXN`, símbolo `$` |

---

## Comportamiento mobile-first

- Mostrar un control segmentado con los dos modos.
- En móvil, inputs primero y resultado principal inmediatamente después.
- Mantener tarjetas de resultado compactas: ROI, ganancia, múltiplo y total.
- Evitar tablas grandes en el MVP.
- Usar `inputmode="decimal"` en campos monetarios y porcentuales.

---

## Flujo principal MVP

**Ejemplo:** Invierto `$25,000` en equipo y genero `$38,000` netos. ¿Cuál fue
mi ROI?

### Inputs del modo ROI simple

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Inversión inicial | Texto numérico | `> 0` | vacío |
| Retorno o valor final | Texto numérico | `>= 0` | vacío |
| Plazo | Texto numérico opcional | `> 0` | vacío |
| Unidad de plazo | Selector | `Días`, `Meses`, `Años` | `Meses` |

### Inputs del modo ingresos y costos

| Campo | Tipo | Rango válido | Valor por defecto |
|-------|------|--------------|-------------------|
| Ingresos | Texto numérico | `>= 0` | vacío |
| Costos fijos | Texto numérico | `>= 0` | `0` |
| Costos variables | Texto numérico | `>= 0` | `0` |
| Inversión inicial | Texto numérico | `> 0` | vacío |
| Otros costos | Texto numérico | `>= 0` | `0` |

### Outputs principales

- ROI porcentual.
- Ganancia o pérdida neta.
- Total invertido.
- Múltiplo de inversión.
- ROI anualizado si hay plazo.
- Estado: pérdida, equilibrio o ganancia.

---

## Fórmulas

### ROI simple

```text
ganancia = retorno_final - inversion_inicial
roi = (ganancia / inversion_inicial) * 100
multiplo = retorno_final / inversion_inicial
```

### Modo ingresos y costos

```text
total_costos = inversion_inicial + costos_fijos + costos_variables + otros_costos
ganancia = ingresos - total_costos
roi = (ganancia / total_costos) * 100
margen_sobre_ingresos = ingresos > 0 ? (ganancia / ingresos) * 100 : null
```

### ROI anualizado

```text
años = plazo_convertido_a_años
roi_anualizado = ((retorno_final / inversion_inicial) ^ (1 / años) - 1) * 100
```

No calcular ROI anualizado si `retorno_final <= 0` o `años <= 0`.

---

## Validaciones y estados

- La inversión inicial debe ser mayor que cero.
- Aceptar retorno final igual a cero para escenarios de pérdida total.
- Si ROI es `0`, mostrar "punto de equilibrio".
- Si ingresos son menores a costos, mostrar pérdida y no ocultar el resultado.
- Evitar división entre cero en margen sobre ingresos.
- Redondear porcentajes a 2 decimales, pero conservar precisión interna.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de ROI - Retorno de inversión` |
| Meta description | `Calcula el ROI de una inversión, campaña o proyecto con ganancia, pérdida, múltiplo y retorno anualizado opcional.` |
| H1 | `Calculadora de ROI` |
| Keyword principal | `calculadora roi` |
| Keywords secundarias | `retorno de inversion`, `como calcular roi`, `roi formula` |

### FAQs sugeridas

- ¿Cuál es la fórmula del ROI?
- ¿Qué significa un ROI negativo?
- ¿ROI y margen de ganancia son lo mismo?
- ¿Cuándo conviene usar ROI anualizado?

---

## Pruebas sugeridas

- Inversión `1000` y retorno `1500` produce ROI `50%`.
- Retorno igual a inversión produce ROI `0%`.
- Retorno `0` produce ROI `-100%`.
- Modo ingresos y costos suma todos los costos antes de calcular ROI.
- ROI anualizado no se calcula con plazo vacío.
- Inputs con `$`, comas y espacios se parsean correctamente.

