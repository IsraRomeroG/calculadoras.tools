# Spec de articulo: Formula del interes compuesto paso a paso

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/formula-interes-compuesto.md`
- URL publica: `/blog/formula-interes-compuesto`
- Categoria: `Finanzas`
- Prioridad: P1
- Rol en el cluster: post de formula y snippet

## Metadata sugerida

```yaml
title: "Formula del interes compuesto paso a paso"
description: "Conoce la formula del interes compuesto, que significa cada variable y como aplicarla con ejemplos claros."
pubDate: 2026-05-19
category: "Finanzas"
tags:
  - interes compuesto
  - formulas
  - matematicas financieras
readTime: "6 min"
seoTitle: "Formula del interes compuesto: como calcularlo con ejemplos"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
```

## Intencion SEO

- Keyword principal: `formula interes compuesto`
- Keywords secundarias: `como calcular interes compuesto`, `formula valor futuro interes compuesto`, `interes compuesto formula mensual`
- Intencion: informacional matematica; el usuario quiere la formula exacta y un ejemplo.
- Fragmento objetivo: bloque de formula en texto claro.

## Promesa del articulo

Mostrar la formula base, explicar cada variable y resolver ejemplos con capitalizacion anual y mensual. Debe servir tanto para estudiantes como para usuarios que quieren validar la calculadora.

## Formula principal

```txt
VF = P x (1 + r / n) ^ (n x t)
```

Donde:

- `VF`: valor futuro o monto final.
- `P`: capital inicial.
- `r`: tasa anual en decimal.
- `n`: numero de capitalizaciones por ano.
- `t`: plazo en anos.

## Estructura recomendada

1. `## Formula del interes compuesto`
   - Mostrar la formula y definir variables.
2. `## Como convertir la tasa a decimal`
   - Ejemplo: `8% = 0.08`.
   - Advertir sobre usar tasa anual vs mensual.
3. `## Ejemplo con capitalizacion anual`
   - `$10,000`, `8%`, `5 anos`, `n = 1`.
4. `## Ejemplo con capitalizacion mensual`
   - Mismos datos, `n = 12`.
   - Comparar diferencia.
5. `## Formula con aportaciones periodicas`
   - Explicar que es mas compleja.
   - Dar formula de referencia si aportacion y capitalizacion coinciden.
   - Recomendar calculadora para aportaciones mensuales.
6. `## Errores comunes al aplicar la formula`
   - No convertir porcentaje.
   - Mezclar meses con anos.
   - Olvidar frecuencia de capitalizacion.
   - Redondear en cada paso.
7. `## Usa la calculadora para escenarios completos`
   - CTA.

## Ejemplos numericos

Ejemplo anual:

```txt
VF = 10000 x (1 + 0.08 / 1) ^ (1 x 5)
VF = 10000 x 1.08 ^ 5
VF = 14693.28
```

Ejemplo mensual:

```txt
VF = 10000 x (1 + 0.08 / 12) ^ (12 x 5)
VF = 14898.46
```

## Enlaces internos

- Principal: `/finanzas/calculadora-de-interes-compuesto`
- Relacionado: `/blog/que-es-interes-compuesto`
- Relacionado: `/blog/interes-compuesto-aportaciones-mensuales`
- Relacionado: `/blog/tasa-nominal-vs-tasa-efectiva`

## FAQs sugeridas

- Que significa `n` en la formula?
- Que pasa si la tasa es 0%?
- La formula funciona con aportaciones mensuales?
- Debo usar tasa anual o mensual?

## Fuentes y notas

- Usar la spec de la calculadora `specs/calculadoras/5_Calculadora_de_interes_compuesto.md` como referencia matematica local.
- Apoyar con fuentes educativas como Banxico Educa si se requiere definicion de interes compuesto.
- No sobrecargar con algebra avanzada.

## Criterios de aceptacion

- Incluye formula base en bloque visible.
- Explica cada variable.
- Tiene al menos dos ejemplos calculados.
- Enlaza a la calculadora para casos con aportaciones e inflacion.
- Evita presentar resultados como garantia de inversion.
