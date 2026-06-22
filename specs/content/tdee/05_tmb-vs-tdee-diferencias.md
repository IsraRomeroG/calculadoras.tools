# Spec de articulo: TMB vs TDEE

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/tmb-vs-tdee-diferencias.md`
- URL publica: `/blog/salud/tmb-vs-tdee-diferencias`
- Categoria: `Salud`
- Prioridad: P1
- Rol en el cluster: diferenciacion conceptual y soporte a la calculadora

## Metadata sugerida

```yaml
title: "TMB vs TDEE: diferencias y para que sirve cada dato"
seoTitle: "TMB vs TDEE: diferencia entre metabolismo basal y calorias diarias"
description: "Conoce la diferencia entre TMB y TDEE, como se calculan y por que el TDEE suele usarse para estimar calorias diarias."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - tmb
  - tdee
  - metabolismo
readTime: "6 min"
relatedCalculator:
  label: "Calculadora de calorias diarias (TDEE)"
  href: "/salud/calculadora-de-calorias-diarias-tdee"
```

## Intencion SEO

- Keyword principal: `tmb vs tdee`
- Secundarias: `diferencia entre tmb y tdee`, `metabolismo basal y tdee`, `bmr vs tdee`
- Intencion: el usuario quiere saber que numero usar para sus calorias.

## Promesa del articulo

Explicar que la TMB estima energia en reposo, mientras TDEE estima gasto diario
total al sumar actividad. Debe aclarar que para calorias diarias practicas se
suele usar TDEE, no TMB aislada.

## Estructura recomendada

1. `## Diferencia rapida entre TMB y TDEE`
2. `## Que es la TMB`
3. `## Que es el TDEE`
4. `## Formula: de TMB a TDEE`
5. `## Ejemplo comparativo`
6. `## Cual debes usar para tus calorias diarias`
7. `## Calcula ambos valores automaticamente`
8. `## Preguntas frecuentes`

## Tabla obligatoria

| Concepto | Que estima | Uso principal |
|----------|------------|---------------|
| TMB | Energia en reposo | Base del calculo |
| TDEE | Energia total diaria | Calorias de mantenimiento aproximadas |

## Ejemplo obligatorio

- TMB: `1,600 kcal/dia`.
- Factor de actividad moderado: `1.55`.
- TDEE: `1,600 x 1.55 = 2,480 kcal/dia`.

## Enlaces internos

- `/salud/calculadora-de-calorias-diarias-tdee`
- `/blog/salud/que-es-tdee-calorias-diarias`
- `/blog/salud/formula-mifflin-st-jeor`
- `/blog/salud/calorias-de-mantenimiento`

## FAQ sugeridas

- TMB y TDEE son lo mismo?
- Debo comer mi TMB?
- Por que mi TDEE es mayor que mi TMB?
- Que formula se usa para calcular TMB?

## Criterios de aceptacion

- Debe dejar claro que TMB no equivale a calorias de mantenimiento.
- Debe incluir formula `TDEE = TMB x factor de actividad`.
- Debe enlazar a la calculadora TDEE.
- Debe evitar recomendar comer por debajo de TMB como regla.
