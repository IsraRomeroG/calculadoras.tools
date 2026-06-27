# 07 - Arquitectura futura del blog i18n

## Objetivo

Definir el camino para traducir el blog sin mover contenido en fase 1 y sin publicar clusters incompletos.

## Alcance fase 1

No traducir blog en fase 1.

Cambios permitidos:

- Mantener coleccion actual `blog` como fuente espanola.
- No mostrar `Blog` en navbar inglesa hasta que exista `/en/blog`.
- Ocultar `relatedGuides` en calculadoras inglesas si no existe traduccion inglesa.
- Documentar campos futuros como `translationKey` o `contentId`.

Cambios no permitidos en fase 1:

- Mover Markdown existente.
- Crear `/en/blog` vacio.
- Traducir articulos sueltos que queden aislados.
- Enlazar desde `/en` a articulos espanoles como si fueran contenido ingles.

## Modelo futuro recomendado

Cuando se implemente blog i18n, usar contenido por locale:

```txt
src/content/blog/es/<categoria>/<slug>.md
src/content/blog/en/<category>/<slug>.md
```

Frontmatter futuro recomendado:

```yaml
translationKey: "percentage-basics"
locale: "en"
categoryId: "matematicas"
slug: "how-to-calculate-percentages"
draft: false
pubDate: 2026-06-26
```

Reglas:

- `translationKey` o `contentId` empareja articulos equivalentes.
- `categoryId` es estable; el slug de categoria se localiza con helpers.
- `slug` es localizado por idioma.
- `draft` y fecha futura excluyen la ruta del sitemap.
- `hreflang` solo incluye articulos publicados.
- No publicar articulos ingleses sin enlaces internos validos hacia calculadoras o articulos tambien publicados en ingles.

## Clusters SEO

Traducir por clusters completos:

- Hub de categoria.
- Calculadora relacionada.
- Articulos principales.
- Articulos de soporte.
- Enlaces internos entre piezas del cluster.

No publicar una traduccion si deja:

- Links internos rotos.
- Links a versiones espanolas no marcadas como cambio de idioma.
- Canonicals cruzados hacia espanol.
- `hreflang` apuntando a drafts.

## Migracion futura de rutas

Si en una fase futura se mueve contenido actual, antes de editar se debe generar un mapa completo:

```txt
/blog/<categoria>/<slug> -> /blog/es/<categoria>/<slug>
/blog/<slug-legacy> -> /blog/es/<categoria>/<slug>
```

Y entregar reglas Apache 301 en `.htaccess`.

No usar:

- Paginas Astro legacy.
- Meta refresh.
- Redirects cliente.
- Cadenas de redirects.

## Tests futuros

Agregar tests para:

- `translationKey` unico por locale.
- Slugs unicos por categoria y locale.
- `hreflang` solo para articulos publicados.
- Sitemap excluye drafts y fechas futuras.
- Legacy redirects no colisionan con categorias localizadas.

## Criterios de aceptacion futuro

- `/en/blog` solo existe cuando hay contenido ingles publicado.
- Cada articulo ingles tiene cluster minimo viable y enlaces internos correctos.
- El blog espanol conserva rutas o entrega redirects 301 si se mueve.
