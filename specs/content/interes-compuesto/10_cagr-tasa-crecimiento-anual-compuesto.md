# Spec de articulo: CAGR o tasa de crecimiento anual compuesto

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/cagr-tasa-crecimiento-anual-compuesto.md`
- URL publica: `/blog/cagr-tasa-crecimiento-anual-compuesto`
- Categoria: `Finanzas`
- Prioridad: P3
- Rol en el cluster: concepto avanzado relacionado

## Metadata sugerida

```yaml
title: "CAGR: que es la tasa de crecimiento anual compuesto"
description: "Aprende que es el CAGR, como se calcula y por que no es lo mismo que un promedio anual simple."
pubDate: 2026-05-27
category: "Finanzas"
tags:
  - CAGR
  - rendimiento anual
  - interes compuesto
readTime: "6 min"
seoTitle: "CAGR: formula de la tasa de crecimiento anual compuesto"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
```

## Intencion SEO

- Keyword principal: `CAGR formula`
- Keywords secundarias: `tasa de crecimiento anual compuesto`, `rendimiento anual compuesto`, `CAGR que es`
- Intencion: usuario mas avanzado que compara inversiones, ventas o crecimiento de portafolio.

## Promesa del articulo

Explicar el CAGR como la tasa constante anual que llevaria un valor inicial a un valor final durante un periodo. Diferenciarlo del promedio aritmetico anual.

## Formula principal

```txt
CAGR = (valor final / valor inicial) ^ (1 / anos) - 1
```

## Estructura recomendada

1. `## Que es el CAGR`
   - Definicion corta.
2. `## Formula del CAGR`
   - Mostrar formula y variables.
3. `## Ejemplo paso a paso`
   - Valor inicial `$100,000`.
   - Valor final `$300,000`.
   - Plazo `10 anos`.
   - CAGR aproximado `11.61%`.
4. `## CAGR vs promedio anual simple`
   - Explicar que el CAGR suaviza el camino.
   - El promedio simple puede ocultar volatilidad.
5. `## Cuando usar CAGR`
   - Comparar crecimiento entre periodos.
   - Reportes de inversion.
   - Negocios y ventas.
6. `## Limites del CAGR`
   - No muestra riesgo.
   - No muestra variaciones ano a ano.
   - Puede ignorar aportaciones/retiros.
7. `## Relacion con interes compuesto`
   - CAGR es una forma de expresar crecimiento compuesto anual.

## Enlaces internos

- Principal: `/finanzas/calculadora-de-interes-compuesto`
- Relacionado: `/blog/formula-interes-compuesto`
- Relacionado: `/blog/tasa-nominal-vs-tasa-efectiva`
- Relacionado futuro: calculadora de CAGR cuando exista.

## FAQs sugeridas

- CAGR es lo mismo que interes compuesto?
- CAGR considera aportaciones?
- Por que CAGR puede ser distinto del promedio anual?
- Un CAGR alto significa que una inversion es segura?

## Fuentes y notas

- Usar fuentes de finanzas/inversion como apoyo conceptual.
- Evitar usar datos de mercado reales salvo que sean historicos y con fuente.
- No mezclar CAGR con tasa efectiva anual sin explicar diferencia de uso.

## Criterios de aceptacion

- Formula visible y explicada.
- Ejemplo calculado completo.
- Separa claramente CAGR de promedio anual.
- Incluye limites y advertencia sobre volatilidad/riesgo.
