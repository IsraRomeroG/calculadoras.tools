# Spec de articulo: Formula Mifflin-St Jeor

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/formula-mifflin-st-jeor.md`
- URL publica: `/blog/formula-mifflin-st-jeor`
- Categoria: `Salud`
- Prioridad: P2
- Rol en el cluster: soporte tecnico y fuente de confianza para la calculadora

## Metadata sugerida

```yaml
title: "Formula Mifflin-St Jeor: como calcula la TMB"
seoTitle: "Formula Mifflin-St Jeor para TMB: ecuaciones y ejemplo"
description: "Conoce la formula Mifflin-St Jeor para estimar la tasa metabolica basal y como se usa despues para calcular TDEE."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - mifflin st jeor
  - tmb
  - tdee
readTime: "7 min"
relatedCalculator:
  label: "Calculadora de calorias diarias (TDEE)"
  href: "/salud/calculadora-de-calorias-diarias-tdee"
```

## Intencion SEO

- Keyword principal: `formula mifflin st jeor`
- Secundarias: `mifflin st jeor calculadora`, `formula tmb`, `calcular metabolismo basal`
- Intencion: el usuario busca la ecuacion o quiere entender que formula usa la calculadora.

## Promesa del articulo

Mostrar las ecuaciones Mifflin-St Jeor para hombres y mujeres, resolver un
ejemplo y explicar como esa TMB se convierte en TDEE al aplicar actividad.

## Formulas obligatorias

```txt
TMB hombre = 10 x peso_kg + 6.25 x altura_cm - 5 x edad + 5
TMB mujer = 10 x peso_kg + 6.25 x altura_cm - 5 x edad - 161
```

Luego:

```txt
TDEE = TMB x factor de actividad
```

## Estructura recomendada

1. `## Que es la formula Mifflin-St Jeor`
2. `## Formula para hombres`
3. `## Formula para mujeres`
4. `## Ejemplo paso a paso`
5. `## Como pasar de TMB a TDEE`
6. `## Limitaciones de la formula`
7. `## Calcula tu resultado automaticamente`
8. `## Preguntas frecuentes`

## Ejemplo obligatorio

- Mujer, `28` anos, `65 kg`, `165 cm`.
- Calculo:

```txt
10 x 65 + 6.25 x 165 - 5 x 28 - 161 = 1,380.25
```

- Si actividad moderada: `1,380.25 x 1.55 = 2,139.39 kcal/dia`.

## Enlaces internos

- `/salud/calculadora-de-calorias-diarias-tdee`
- `/blog/tmb-vs-tdee-diferencias`
- `/blog/que-es-tdee-calorias-diarias`
- `/blog/como-elegir-nivel-de-actividad-tdee`

## FAQ sugeridas

- La formula Mifflin-St Jeor calcula TMB o TDEE?
- Es mejor que Harris-Benedict?
- Sirve para deportistas?
- Sirve si conozco mi porcentaje de grasa?

## Fuentes y notas

- Citar el estudio original de Mifflin-St Jeor:
  `https://pubmed.ncbi.nlm.nih.gov/2305711/`
- Si se compara con otras formulas, hacerlo sin afirmar superioridad absoluta en
  todos los casos.

## Criterios de aceptacion

- Debe incluir ambas ecuaciones completas.
- Debe resolver al menos un ejemplo numerico.
- Debe aclarar que Mifflin calcula TMB, no TDEE directamente.
- Debe enlazar a la calculadora TDEE.
