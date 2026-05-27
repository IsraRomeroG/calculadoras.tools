# Spec de articulo: Inflacion e interes compuesto

## Archivo objetivo

- Ruta futura: `src/content/blog/finanzas/inflacion-interes-compuesto-valor-real.md`
- URL publica: `/blog/inflacion-interes-compuesto-valor-real`
- Categoria: `Finanzas`
- Prioridad: P2
- Rol en el cluster: valor real y poder adquisitivo

## Metadata sugerida

```yaml
title: "Inflacion e interes compuesto: calcula el valor real"
description: "Aprende como la inflacion reduce el poder adquisitivo de tus ahorros y como estimar el valor real de una inversion."
pubDate: 2026-05-24
category: "Finanzas"
tags:
  - inflacion
  - interes compuesto
  - poder adquisitivo
readTime: "6 min"
seoTitle: "Inflacion e interes compuesto: valor nominal vs valor real"
relatedCalculator:
  label: "Calculadora de interes compuesto"
  href: "/finanzas/calculadora-de-interes-compuesto"
```

## Intencion SEO

- Keyword principal: `inflacion interes compuesto`
- Keywords secundarias: `valor real inversion`, `inflacion ahorros`, `poder adquisitivo ahorro`
- Intencion: entender por que un monto futuro no equivale al mismo poder de compra.

## Promesa del articulo

Explicar valor nominal vs valor real y mostrar como descontar inflacion para interpretar mejor una proyeccion de ahorro o inversion.

## Formula principal

```txt
valor real = monto futuro / (1 + inflacion) ^ anos
```

Formula de tasa real aproximada:

```txt
tasa real = ((1 + tasa nominal) / (1 + inflacion)) - 1
```

## Estructura recomendada

1. `## Valor nominal vs valor real`
   - Nominal: dinero futuro en pesos/euros/dolares del futuro.
   - Real: poder adquisitivo aproximado en dinero de hoy.
2. `## Como afecta la inflacion a tus ahorros`
   - Explicar perdida de poder de compra.
3. `## Formula para calcular valor real`
   - Mostrar formula y ejemplo.
4. `## Ejemplo con interes compuesto`
   - Monto futuro `$343,778.24`, inflacion `4%`, `20 anos`.
   - Valor real aproximado `$156,895.90`.
5. `## Cuando la inflacion supera la tasa`
   - El dinero puede crecer nominalmente pero perder valor real.
6. `## Que no incluye este calculo`
   - Impuestos, comisiones, inflacion variable, riesgo de mercado.
7. `## Simula con inflacion`
   - CTA a calculadora.

## Enlaces internos

- Principal: `/finanzas/calculadora-de-interes-compuesto`
- Relacionado: `/blog/regla-del-72`
- Relacionado: `/blog/que-es-interes-compuesto`
- Relacionado: `/blog/errores-calculadora-interes-compuesto`

## FAQs sugeridas

- Que es valor real?
- Una tasa mayor que la inflacion garantiza ganancia real?
- Debo usar inflacion historica o esperada?
- La calculadora usa inflacion fija?

## Fuentes y notas

- Condusef: inflacion como aumento generalizado de precios y perdida de poder de compra.
- Banxico: estabilidad del poder adquisitivo y objetivo de inflacion, si se requiere contexto mexicano.
- Si se mencionan tasas de inflacion actuales, verificar con fuente oficial el dia de redaccion.

## Criterios de aceptacion

- Define nominal y real sin tecnicismos.
- Incluye formula y ejemplo numerico.
- Incluye advertencia de tasa real negativa si inflacion > rendimiento.
- Evita recomendar instrumentos especificos.
