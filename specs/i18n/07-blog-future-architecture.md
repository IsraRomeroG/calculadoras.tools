# 07 - Arquitectura futura del blog i18n

## Objetivo

Definir el camino para traducir el blog sin mover contenido en fase 1 y sin publicar clusters incompletos.

## Alcance fase 1

No traducir blog en fase 1.

Cambios permitidos:

- Mantener coleccion actual `blog` como fuente espanola.
- Mantener rutas espanolas actuales bajo `/blog/...`, sin prefijo de locale.
- Agregar metadatos futuros al contenido espanol solo si son aditivos y no cambian rutas, slugs ni ubicacion de archivos.
- No mostrar `Blog` en navbar inglesa hasta que exista `/en/blog`.
- Ocultar `relatedGuides` en calculadoras inglesas si no existe traduccion inglesa.
- Documentar campos futuros como `translationKey` o `contentId`.

Cambios no permitidos en fase 1:

- Mover Markdown existente.
- Mover contenido espanol a carpetas `es` o publicar rutas `/blog/es/...`.
- Cambiar slugs, categorias, canonicals o enlaces internos espanoles actuales.
- Crear `/en/blog` vacio.
- Traducir articulos sueltos que queden aislados.
- Enlazar desde `/en` a articulos espanoles como si fueran contenido ingles.

## Modelo futuro recomendado

Cuando se implemente blog i18n, usar un modelo donde el espanol sigue siendo el idioma base sin prefijo y los idiomas nuevos viven en una estructura separada por locale:

```txt
src/content/blog/<categoria>/<slug>.md
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
- En contenido espanol existente, `translationKey`, `contentId`, `locale` y `slug` son opcionales y solo pueden agregarse sin cambiar la ruta publicada.
- `categoryId` es estable; el slug de categoria se localiza con helpers solo para idiomas nuevos.
- `slug` es localizado por idioma nuevo; en espanol sigue derivando del archivo y categoria actuales.
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

No se debe migrar el blog espanol actual. Las URLs espanolas existentes bajo `/blog/<categoria>/<slug>` son canonicas y deben conservarse.

Si en una fase futura se agregan idiomas nuevos, sus rutas deben usar prefijo del idioma nuevo sin crear una variante espanola con prefijo:

```txt
/en/blog/<category>/<slug>
```

Solo se deben entregar reglas Apache 301 en `.htaccess` cuando una ruta ya publicada cambie. Agregar ingles nuevo no requiere redirects desde rutas espanolas.

No usar:

- Paginas Astro legacy.
- Meta refresh.
- Redirects cliente.
- Cadenas de redirects.

## Tests futuros

Agregar tests para:

- `translationKey` unico por locale.
- Slugs unicos por categoria en espanol y por categoria/locale en idiomas nuevos.
- `hreflang` solo para articulos publicados.
- Sitemap excluye drafts y fechas futuras.
- No existe `/blog/es` ni redirects desde `/blog/...` hacia `/blog/es/...`.

## Criterios de aceptacion futuro

- `/en/blog` solo existe cuando hay contenido ingles publicado.
- Cada articulo ingles tiene cluster minimo viable y enlaces internos correctos.
- El blog espanol conserva rutas, archivos, slugs, categorias, canonicals y enlaces internos actuales sin moverlos a `/blog/es/...`.
