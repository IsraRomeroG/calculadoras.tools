# 11 - Clusters de traduccion del blog

## Objetivo

Traducir y publicar blog EN mediante releases editoriales declaradas y conectadas a calculadoras EN, evitando articulos huerfanos, enlaces cruzados incorrectos y `hreflang` hacia contenido no publicado. Un cluster editorial es un agregado verificable, no una cuota informal de posts.

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

Modelo recomendado:

```txt
1 calculadora EN publicada
1 categoria EN publicada
requiredPostIds declarados por decision editorial
optionalPostIds declarados
links internos bidireccionales entre miembros publicados
```

Una release de calculadora puede publicarse sin posts si no los enlaza y la decision editorial no los declara requeridos. En ese caso no se considera un cluster editorial completo. No crear articulos solo para alcanzar una cuota numerica.

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

La convencion actual usa el slug localizado de categoria como carpeta. Agregar un check que confirme que `en/math` corresponde al `categoryId` y slug localizados declarados; el runtime no debe ignorar silenciosamente una carpeta incorrecta.

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
translationGroupId: "percentages-how-to-calculate"
translationKind: "equivalent"
pubDate: 2026-06-28
updatedDate: 2026-06-28
draft: false
relatedCalculatorId: "calculadora-de-porcentajes"
```

Reglas:

- `locale: "en"` es obligatorio en contenido EN.
- `categoryId` usa ID estable, no slug EN.
- `slug` define el slug publico EN.
- `translationGroupId` empareja solo versiones semanticamente equivalentes.
- `translationKind` es `equivalent`, `adaptation` u `original`.
- `relatedCalculatorId` se resuelve por locale contra el manifest; no guardar `{ label, href }` ni un path manual.
- `draft: true` excluye rutas, sitemap y alternates.
- Las fechas futuras no deben publicarse.
- Definir una zona editorial unica para `pubDate`; no inferirla desde locale.

El schema actual debe migrarse de `translationKey | contentId` y `relatedCalculator: { label, href }` a este modelo, o introducir una compatibilidad temporal validada. No permitir dos identificadores de equivalencia con valores distintos.

## Equivalencias y alternates

`hreflang` entre posts se genera solo si:

- Ambos posts comparten `translationGroupId`.
- Ambos declaran `translationKind: "equivalent"`.
- Ambos posts estan publicados.
- Ambos posts tienen categoria valida.
- La ruta generada no colisiona.

No crear alternate cruzado si:

- El post EN es una adaptacion sin equivalente directo.
- El post ES existe pero no comparte `translationGroupId`.
- El post EN esta en draft.

Un grupo contiene como maximo una entrada por locale. Las adaptaciones y originales pueden emitir alternate propio del locale actual si la politica SEO lo requiere, pero no se emparejan con otra pieza como traduccion directa.

## Links internos

Reglas para contenido EN:

- Links a calculadoras deben apuntar a `/en/...` cuando exista version EN.
- Links a posts relacionados deben apuntar a `/en/blog/...`.
- Si se enlaza una pagina ES como fuente o cambio de idioma, el texto debe dejarlo claro.
- No usar `/blog/...` en contenido EN como si fuera interno del mismo idioma.
- No enlazar a rutas EN que no existan.

Los links Markdown libres se validan contra `PublishedRouteManifest`. Las relaciones estructuradas usan IDs y se resuelven centralmente.

## Related guides en calculadoras

Para cada calculadora EN:

- `relatedGuideRefs` solo resuelve articulos EN publicados.
- Si un articulo relacionado no esta listo, el resolver lo excluye; no duplicar `published: false` en el diccionario de calculadora.
- No basta con traducir el label y conservar un href ES. Nunca conservar un href ES salvo cambio de idioma explicito.
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
- `translationGroupId` tiene como maximo una entrada por locale.
- Solo `translationKind: equivalent` genera alternates cruzados.
- Alternates no apuntan a drafts.
- Contenido EN no contiene links `/blog/...` no autorizados.
- Sitemap excluye drafts y fechas futuras.
- Carpeta localizada, locale, `categoryId` y slug de categoria son coherentes.
- `relatedCalculatorId` y posts relacionados resuelven rutas publicadas en el mismo locale.
- JSON-LD incluye `inLanguage` y usa serializacion segura.

## Criterios de aceptacion

- `/en/blog` existe solo con contenido EN publicado.
- Cada post EN pertenece a una release/cluster declarado o queda explicitamente marcado como original independiente con justificacion editorial.
- Los links internos EN son coherentes.
- Los alternates se generan solo entre equivalentes publicados.
- El blog ES conserva sus rutas, archivos y canonicals.
