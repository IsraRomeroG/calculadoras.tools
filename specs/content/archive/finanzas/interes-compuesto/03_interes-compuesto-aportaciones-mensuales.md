# Spec de articulo: Interes compuesto con aportaciones mensuales

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/interes-compuesto-aportaciones-mensuales.md`
- URL publica: `/blog/interes-compuesto-aportaciones-mensuales`
- Categoria: `Finanzas`
- Prioridad: P1
- Rol en el cluster: long-tail transaccional/informacional

## Metadata sugerida

```yaml
title: "Interes compuesto con aportaciones mensuales"
description: "Aprende como crece una inversion cuando agregas aportaciones mensuales y como calcular el monto final."
pubDate: 2026-05-20
category: "Finanzas"
tags:
  - interes compuesto
  - aportaciones mensuales
  - ahorro
readTime: "6 min"
seoTitle: "Interes compuesto con aportaciones mensuales: formula y ejemplo"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
```

## Intencion SEO

- Keyword principal: `interes compuesto aportaciones mensuales`
- Keywords secundarias: `interes compuesto mensual`, `calculadora interes compuesto aportaciones`, `ahorro mensual interes compuesto`
- Intencion: el usuario ya entiende algo del concepto y quiere proyectar ahorro recurrente.

## Promesa del articulo

Explicar por que las aportaciones mensuales cambian tanto el resultado, como se calculan de forma aproximada y por que una calculadora reduce errores cuando hay distintas frecuencias.

## Estructura recomendada

1. `## Por que las aportaciones mensuales cambian el resultado`
   - Cada aportacion empieza a generar rendimiento desde que se invierte.
2. `## Ejemplo: capital inicial mas ahorro mensual`
   - `$10,000` iniciales, `$500` mensuales, `8%`, `20 anos`.
   - Usar resultado esperado de la calculadora: monto final aproximado `$343,778.24`.
3. `## Aportar al inicio o al final del mes`
   - Explicar la diferencia.
   - Dar ejemplo de que aportar al inicio suele generar un poco mas.
4. `## Formula de referencia para aportaciones mensuales`
   - Mostrar formula de anualidad si frecuencia coincide.
   - Aclarar que no cubre todos los escenarios.
5. `## Tabla de crecimiento ano a ano`
   - Mostrar filas clave: ano 1, 5, 10, 20.
6. `## Errores comunes`
   - Pensar que aportacion total = rendimiento.
   - No separar total aportado e intereses.
   - Usar tasa mensual como si fuera anual.
7. `## Simula tus aportaciones`
   - CTA a la calculadora.

## Formula de referencia

Si la aportacion ocurre al final de cada periodo y coincide con la capitalizacion:

```txt
VF = P x (1 + i)^m + A x (((1 + i)^m - 1) / i)
```

Donde:

- `P`: capital inicial.
- `A`: aportacion periodica.
- `i`: tasa por periodo.
- `m`: numero de periodos.

## Enlaces internos

- Principal: `/finanzas/calculadora-de-interes-compuesto`
- Relacionado: `/blog/formula-interes-compuesto`
- Relacionado: `/blog/cuanto-ahorrar-al-mes-para-una-meta`
- Relacionado: `/blog/errores-calculadora-interes-compuesto`

## FAQs sugeridas

- Conviene aportar al inicio o al final del mes?
- Que pasa si no tengo capital inicial?
- Las aportaciones mensuales siempre generan interes compuesto?
- La formula cambia si aporto cada ano?

## Fuentes y notas

- Basarse en la logica implementada en `src/lib/calculators/compoundInterest.ts`.
- Usar la calculadora como fuente de resultados para evitar discrepancias.
- Evitar comparar productos financieros concretos.

## Criterios de aceptacion

- Explica la diferencia entre total aportado e intereses generados.
- Incluye ejemplo con aportaciones mensuales.
- Menciona el momento de aportacion.
- Enlaza a la calculadora y a la spec/post de metas de ahorro.
