# Spec de articulo: TDEE y macros

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/tdee-y-macros-como-se-relacionan.md`
- URL publica: `/blog/salud/tdee-y-macros-como-se-relacionan`
- Categoria: `Salud`
- Prioridad: P2
- Rol en el cluster: puente entre calculadora TDEE y calculadora de macros

## Metadata sugerida

```yaml
title: "TDEE y macros: como se relacionan"
seoTitle: "TDEE y macros: de calorias diarias a proteina, grasas y carbohidratos"
description: "Aprende como el TDEE ayuda a estimar calorias diarias y como esas calorias se pueden distribuir en macros."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - tdee
  - macros
  - calorias
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de calorias diarias (TDEE)"
  href: "/salud/calculadora-de-calorias-diarias-tdee"
```

## Intencion SEO

- Keyword principal: `tdee y macros`
- Secundarias: `calcular macros desde tdee`, `calorias y macronutrientes`, `tdee para macros`
- Intencion: el usuario ya conoce o quiere calcular calorias y necesita convertirlas en macros.

## Promesa del articulo

Explicar que TDEE estima el total de calorias diarias y que los macros reparten
esas calorias entre proteina, carbohidratos y grasas segun objetivo y
preferencias.

## Estructura recomendada

1. `## Diferencia rapida entre TDEE y macros`
2. `## Paso 1: estima tus calorias con TDEE`
3. `## Paso 2: decide objetivo calorico`
4. `## Paso 3: reparte calorias en proteina, grasas y carbohidratos`
5. `## Ejemplo practico`
6. `## Errores comunes`
7. `## Calculadoras relacionadas`
8. `## Preguntas frecuentes`

## Ejemplo obligatorio

- TDEE: `2,200 kcal/dia`.
- Objetivo mantenimiento: `2,200 kcal`.
- Mostrar ejemplo simple de distribucion:
  - Proteina: `120 g`.
  - Grasas: `70 g`.
  - Carbohidratos: resto de calorias.
- Aclarar que los macros no son receta medica y deben adaptarse.

## Enlaces internos

- `/salud/calculadora-de-calorias-diarias-tdee`
- `/blog/salud/que-es-tdee-calorias-diarias`
- `/blog/salud/cuantas-calorias-necesito-al-dia`
- `/blog/salud/calorias-de-mantenimiento`
- Futuro: `/salud/calculadora-de-macros`
- Futuro: `/blog/salud/cuantas-calorias-para-bajar-de-peso`

## FAQ sugeridas

- Necesito saber mi TDEE para calcular macros?
- Los macros cambian si quiero bajar de peso?
- Que macro se calcula primero?
- TDEE y macros son lo mismo?
- Puedo usar porcentajes para calcular macros?

## Fuentes y notas

- Coordinar esta pieza con la spec de la calculadora de macros.
- Evitar convertir el articulo en una dieta cerrada.
- Si la calculadora de macros no existe al publicar, usar enlace textual futuro
  solo en la spec, no en el articulo final.

## Criterios de aceptacion

- Debe explicar calorias antes que macros.
- Debe enlazar a la calculadora TDEE.
- Debe preparar el puente hacia macros sin enlazar rutas inexistentes en el
  articulo publicado.
- Debe incluir un ejemplo numerico sencillo.
