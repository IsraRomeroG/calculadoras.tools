# 11 - Clusters de traduccion del blog

## Objetivo

Traducir y publicar blog EN por clusters completos conectados a calculadoras EN, evitando articulos aislados, enlaces cruzados incorrectos y `hreflang` hacia contenido no publicado.

## Alcance

- `src/content/blog`
- `src/content/blog/en`
- `src/lib/blog.ts`
- `src/lib/i18n/blog.ts`
- Rutas bajo:
  - `/blog/...`
  - `/en/blog/...`
- Componentes de blog y cards.
- Links desde calculadoras a guias relacionadas.

## Regla principal

El blog EN acompana calculadoras EN publicadas. No se debe publicar un post EN solo porque existe su equivalente ES. Cada post EN debe tener un lugar claro dentro de un cluster.

## Modelo de cluster

Cluster minimo recomendado:

```txt
1 calculadora EN publicada
1 categoria EN publicada
1 articulo principal EN
1-2 articulos de soporte EN, si la calculadora los enlaza
links internos bidireccionales
```

Ejemplo para porcentajes:

```txt
/en/math/percentage-calculator
/en/blog/math/how-to-calculate-percentages
/en/blog/math/percentage-increase
/en/blog/math/what-percentage-is-one-number-of-another
```

## Estructura de archivos

Mantener ES sin mover:

```txt
src/content/blog/matematicas/como-calcular-porcentajes.md
```

Usar prefijo de locale para EN:

```txt
src/content/blog/en/math/how-to-calculate-percentages.md
```

No crear:

```txt
src/content/blog/es
src/pages/blog/es
src/pages/blog/en
```

## Frontmatter EN

Campos recomendados:

```yaml
title: "How to calculate percentages"
description: "..."
locale: "en"
categoryId: "matematicas"
slug: "how-to-calculate-percentages"
translationKey: "percentages-how-to-calculate"
pubDate: 2026-06-28
updatedDate: 2026-06-28
draft: false
relatedCalculator: "/en/math/percentage-calculator"
```

Reglas:

- `locale: "en"` es obligatorio en contenido EN.
- `categoryId` usa ID estable, no slug EN.
- `slug` define el slug publico EN.
- `translationKey` empareja versiones equivalentes.
- `draft: true` excluye rutas, sitemap y alternates.
- Las fechas futuras no deben publicarse.

## Equivalencias y alternates

`hreflang` entre posts se genera solo si:

- Ambos posts comparten `translationKey` o `contentId`.
- Ambos posts estan publicados.
- Ambos posts tienen categoria valida.
- La ruta generada no colisiona.

No crear alternate si:

- El post EN es una adaptacion sin equivalente directo.
- El post ES existe pero no tiene `translationKey`.
- El post EN esta en draft.

## Links internos

Reglas para contenido EN:

- Links a calculadoras deben apuntar a `/en/...` cuando exista version EN.
- Links a posts relacionados deben apuntar a `/en/blog/...`.
- Si se enlaza una pagina ES como fuente o cambio de idioma, el texto debe dejarlo claro.
- No usar `/blog/...` en contenido EN como si fuera interno del mismo idioma.
- No enlazar a rutas EN que no existan.

## Related guides en calculadoras

Para cada calculadora EN:

- `relatedGuides` solo incluye articulos EN publicados.
- Si un articulo relacionado no esta listo, marcar `published: false` o excluirlo.
- No traducir el label pero dejar href ES.
- El CTA debe estar localizado.

## Priorizacion de clusters

Orden sugerido:

1. Math porcentajes y regla de tres.
2. Conversores simples.
3. Date/time.
4. Programacion y geometria.
5. Finanzas e inmuebles.
6. Salud.
7. Legal/impuestos.

Para salud, finanzas y legal/impuestos:

- Revisar fuentes.
- Revisar disclaimers.
- Validar que el contenido no promete reglas regionales universales.
- Evitar adaptar articulos altamente locales sin decision editorial.

## Revision humana

Antes de publicar:

- Revisar title y description.
- Revisar slug.
- Revisar terminologia tecnica.
- Revisar formulas.
- Revisar ejemplos y unidades.
- Revisar fuentes y fechas de acceso.
- Revisar enlaces internos.
- Revisar disclaimers cuando aplique.

## Tests recomendados

- Posts EN tienen `locale: "en"`.
- Posts EN tienen `categoryId`.
- Posts EN tienen `slug`.
- Slugs EN son unicos por categoria.
- `translationKey` no duplica dentro del mismo locale.
- Alternates no apuntan a drafts.
- Contenido EN no contiene links `/blog/...` no autorizados.
- Sitemap excluye drafts y fechas futuras.

## Criterios de aceptacion

- `/en/blog` existe solo con contenido EN publicado.
- Cada post EN pertenece a un cluster.
- Los links internos EN son coherentes.
- Los alternates se generan solo entre equivalentes publicados.
- El blog ES conserva sus rutas, archivos y canonicals.
