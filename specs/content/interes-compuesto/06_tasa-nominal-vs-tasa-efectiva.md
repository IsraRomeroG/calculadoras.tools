# Spec de articulo: Tasa nominal vs tasa efectiva

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/tasa-nominal-vs-tasa-efectiva.md`
- URL publica: `/blog/tasa-nominal-vs-tasa-efectiva`
- Categoria: `Finanzas`
- Prioridad: P2
- Rol en el cluster: explicacion de capitalizacion

## Metadata sugerida

```yaml
title: "Tasa nominal vs tasa efectiva: cual es la diferencia"
description: "Entiende la diferencia entre tasa nominal y tasa efectiva, y por que la capitalizacion cambia el rendimiento real."
pubDate: 2026-05-23
category: "Finanzas"
tags:
  - tasa nominal
  - tasa efectiva
  - interes compuesto
readTime: "6 min"
seoTitle: "Tasa nominal vs efectiva: formula, ejemplos y capitalizacion"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
```

## Intencion SEO

- Keyword principal: `tasa nominal vs tasa efectiva`
- Keywords secundarias: `tasa efectiva anual`, `tasa nominal anual capitalizacion mensual`, `TEA vs tasa nominal`
- Intencion: comprender por que dos tasas anunciadas pueden no ser comparables directamente.

## Promesa del articulo

Explicar que la tasa nominal no siempre refleja el rendimiento anual final cuando hay capitalizacion dentro del ano. La tasa efectiva ayuda a comparar en la misma base.

## Formula principal

```txt
tasa efectiva anual = (1 + r / n) ^ n - 1
```

Donde:

- `r`: tasa nominal anual en decimal.
- `n`: capitalizaciones por ano.

## Estructura recomendada

1. `## Diferencia rapida`
   - Nominal: tasa anunciada sin incorporar totalmente el efecto de capitalizacion.
   - Efectiva: tasa que refleja el crecimiento anual real por capitalizacion.
2. `## Ejemplo con capitalizacion mensual`
   - Tasa nominal `12%`, mensual.
   - `TEA = (1 + 0.12/12)^12 - 1 = 12.68%`.
3. `## Por que importa al comparar productos`
   - Depositos, cuentas, inversiones, prestamos.
   - Advertir que comisiones/impuestos pueden cambiar rendimiento neto.
4. `## Capitalizacion anual, mensual y diaria`
   - Tabla comparativa con mismo `r`.
5. `## Como lo muestra la calculadora`
   - Conectar con comparador de frecuencias.
6. `## Errores comunes`
   - Comparar tasa mensual con anual.
   - Ignorar comisiones.
   - Confundir tasa efectiva con rendimiento garantizado.

## Tabla sugerida

Ejemplo con tasa nominal anual de `12%`:

| Capitalizacion | Veces al ano | Tasa efectiva aproximada |
|---|---:|---:|
| Anual | 1 | 12.00% |
| Mensual | 12 | 12.68% |
| Diaria | 365 | 12.75% |

## Enlaces internos

- Principal: `/finanzas/calculadora-de-interes-compuesto`
- Relacionado: `/blog/formula-interes-compuesto`
- Relacionado: `/blog/errores-calculadora-interes-compuesto`
- Relacionado: `/blog/cagr-tasa-crecimiento-anual-compuesto`

## FAQs sugeridas

- Cual tasa debo usar en la calculadora?
- La tasa efectiva incluye impuestos?
- Por que la capitalizacion mensual da mas que anual?
- TEA y TAE son lo mismo?

## Fuentes y notas

- Usar Banxico Educa para definicion general de tasa de interes y capitalizacion.
- Si se mencionan siglas por pais, aclarar que pueden variar en uso legal.
- Evitar afirmaciones regulatorias especificas sin fuente oficial vigente.

## Criterios de aceptacion

- Explica la diferencia en el primer bloque.
- Incluye formula de tasa efectiva anual.
- Tiene ejemplo numerico completo.
- Conecta con el comparador de capitalizacion de la calculadora.
