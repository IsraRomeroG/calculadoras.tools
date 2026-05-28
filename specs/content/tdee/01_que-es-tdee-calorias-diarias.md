# Spec de articulo: Que es TDEE y calorias diarias

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/que-es-tdee-calorias-diarias.md`
- URL publica: `/blog/que-es-tdee-calorias-diarias`
- Categoria: `Salud`
- Prioridad: P0
- Rol en el cluster: articulo pilar informacional del cluster TDEE

## Metadata sugerida

```yaml
title: "Que es TDEE y como se calculan tus calorias diarias"
seoTitle: "Que es TDEE: formula, ejemplo y calculadora de calorias diarias"
description: "Aprende que significa TDEE, como se calcula el gasto energetico diario y como usarlo como punto de partida para tus calorias."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - tdee
  - calorias
  - metabolismo
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de calorias diarias (TDEE)"
  href: "/salud/calculadora-de-calorias-diarias-tdee"
```

## Intencion SEO

- Keyword principal: `que es tdee`
- Secundarias: `calorias diarias`, `gasto energetico total diario`, `calcular tdee`
- Intencion: el usuario quiere entender el concepto y saber como calcularlo.
- Fragmento objetivo: definicion breve de TDEE y formula `TDEE = TMB x factor de actividad`.

## Promesa del articulo

Explicar TDEE en lenguaje sencillo, mostrar como se calcula a partir de TMB y
actividad, resolver un ejemplo numerico y llevar al usuario a la calculadora para
obtener su estimacion personalizada.

## Formula principal

```txt
TDEE = TMB x factor de actividad
```

Donde:

- `TMB`: tasa metabolica basal.
- `factor de actividad`: multiplicador que aproxima movimiento, ejercicio y
  actividad diaria.

## Estructura recomendada

1. `## Que significa TDEE`
2. `## Para que sirve conocer tus calorias diarias`
3. `## Formula basica del TDEE`
4. `## Ejemplo de calculo de TDEE`
5. `## Por que el resultado no es exacto`
6. `## Como usar tu TDEE como punto de partida`
7. `## Calcula tus calorias diarias automaticamente`
8. `## Preguntas frecuentes`

## Ejemplo obligatorio

- Mujer, `28` anos, `65 kg`, `165 cm`, actividad moderada.
- TMB aproximada con Mifflin-St Jeor: `1,380 kcal/dia`.
- TDEE aproximado con factor `1.55`: `2,139 kcal/dia`.
- Aclarar que el redondeo puede variar ligeramente por formula y datos.

## Enlaces internos

- `/salud/calculadora-de-calorias-diarias-tdee`
- `/blog/cuantas-calorias-necesito-al-dia`
- `/blog/como-elegir-nivel-de-actividad-tdee`
- `/blog/tmb-vs-tdee-diferencias`
- `/blog/calorias-diarias-e-imc`

## FAQ sugeridas

- Que significa TDEE?
- El TDEE son mis calorias exactas?
- Cada cuanto debo recalcular mi TDEE?
- El TDEE sirve para bajar o subir de peso?
- Que diferencia hay entre TMB y TDEE?

## Fuentes y notas

- Verificar formula Mifflin-St Jeor con PubMed antes de publicar.
- Usar el articulo para educar, no para prescribir dietas.
- Evitar promesas de perdida o ganancia de peso.

## Criterios de aceptacion

- La definicion de TDEE debe aparecer en el primer parrafo.
- La formula debe aparecer en el primer tercio del articulo.
- Debe incluir ejemplo paso a paso.
- Debe enlazar a la calculadora TDEE con CTA claro antes del cierre.
- Debe mencionar que el resultado debe ajustarse segun evolucion real.
