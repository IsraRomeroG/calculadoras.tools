# Spec de articulo: IMC vs indice cintura-altura

## Archivo objetivo

- Ruta futura: `src/content/blog/salud/imc-vs-indice-cintura-altura.md`
- URL publica: `/blog/imc-vs-indice-cintura-altura`
- Categoria: `Salud`
- Prioridad: P2
- Rol en el cluster: comparativa y puente a metrica fase 2

## Metadata sugerida

```yaml
title: "IMC vs indice cintura-altura"
seoTitle: "IMC vs indice cintura-altura: diferencias y como interpretarlos"
description: "Conoce la diferencia entre el IMC y el indice cintura-altura, y por que pueden complementarse."
pubDate: 2026-XX-XX
category: "Salud"
tags:
  - imc
  - cintura altura
  - salud
readTime: "5 min"
relatedCalculator:
  label: "Calculadora de IMC"
  href: "/salud/calculadora-de-imc"
```

## Intencion SEO

- Keyword principal: `imc vs indice cintura altura`
- Secundarias: `indice cintura altura`, `cintura altura salud`, `imc cintura`
- Intencion: comparar IMC con una metrica adicional.

## Promesa del articulo

Explicar que el IMC compara peso y altura, mientras el indice cintura-altura
aporta informacion sobre distribucion abdominal.

## Estructura recomendada

1. `## Que es el IMC`
2. `## Que es el indice cintura-altura`
3. `## Formula del indice cintura-altura`
4. `## Diferencias y usos`
5. `## Cuando conviene mirar ambos`
6. `## Calcula tu IMC`

## Ejemplos obligatorios

- ICA = cintura_cm / altura_cm.
- Ejemplo con cintura 85 cm y altura 170 cm.

## Enlaces internos

- `/salud/calculadora-de-imc`
- `/blog/limitaciones-del-imc`
- `/blog/imc-vs-porcentaje-grasa-corporal`

## FAQ sugeridas

- Que mide mejor la grasa abdominal?
- El indice cintura-altura reemplaza al IMC?
- Como se mide la cintura?

## Criterios de aceptacion

- Debe incluir formula ICA.
- Debe evitar prometer diagnostico.
- Debe preparar el terreno para una futura feature de la calculadora.
