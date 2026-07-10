# 10 - Categorias, slugs y URLs localizadas

## Objetivo

Completar la localizacion de categorias y slugs EN de forma estable, revisable y compatible con las URLs espanolas existentes.

## Alcance

- `src/lib/constants/categories.ts`
- `src/lib/constants/calculators.ts`
- `src/lib/calculator-directory.ts`
- Rutas dinamicas:
  - `src/pages/[category].astro`
  - `src/pages/en/[category].astro`
- Tests de directorio, rutas y links internos.

No incluye traducir calculadoras completas, aunque desbloquea su publicacion.

## Regla de identidad

El `categoryId` no se traduce. Durante la fase actual puede conservar el identificador basado en la categoria espanola existente:

```txt
matematicas
finanzas
salud
```

El slug publico si se localiza:

```txt
es: /matematicas
en: /en/math
```

El ID debe tratarse como identidad inmutable, no como URL. La arquitectura futura no debe exigir `categoryId === locales.es.slug`; si alguna URL ES cambia con su 301, el ID debe poder permanecer estable.

## Mapeo EN recomendado

Propuesta inicial de slugs EN:

```txt
finanzas -> finance
inmuebles -> real-estate
legal-impuestos -> tax
matematicas -> math
probabilidad-estadistica -> probability-statistics
programacion -> programming
geometria -> geometry
salud -> health
fecha-tiempo -> date-time
conversores -> converters
mascotas -> pets
cocina -> cooking
restaurantes -> restaurants
vehiculos -> vehicles
construccion -> construction
```

Estos slugs deben revisarse antes de publicarse. En especial:

- `tax` puede ser demasiado corto si el cluster incluye temas legales no fiscales.
- `real-estate` puede variar segun intencion SEO.
- `date-time` es claro, pero validar contra busquedas esperadas.
- `vehicles` puede competir con `automotive`; elegir uno y mantenerlo.

## Publicacion de categorias

Una categoria EN puede tener metadata lista en estado no publicado aunque no tenga calculadoras publicadas. Metadata disponible y ruta publicada son conceptos distintos.

Reglas:

- `getCategoryLocale(id, "en")` puede existir antes de que haya calculadoras EN.
- `getCalculatorCategories(getPublishedCalculators("en"), "en")` solo muestra categorias con calculadoras publicadas.
- No crear paginas EN vacias para categorias sin calculadoras.
- No enlazar categorias EN desde home si no tienen contenido.
- No emitir alternate EN desde la categoria ES solo porque exista metadata EN.
- `buildCategoryPath()` construye un candidato; `getPublishedCategoryPath()` comprueba que la superficie exista en `PublishedRouteManifest`.
- La superficie de directorio `/en/<category>` y la superficie de blog `/en/blog/<category>` tienen disponibilidad independiente.

## Slugs de calculadoras

Cada slug EN debe cumplir:

- ASCII lowercase.
- Palabras separadas por guion.
- Sin trailing slash.
- Sin acentos.
- Sin colision dentro de su categoria EN.
- Sin segmentos reservados.
- Descriptivo para SEO.
- Regex estricta: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- No puede producir colision de ruta completa con otra pagina emitida.

Ejemplos:

```txt
calculadora-de-porcentajes -> percentage-calculator
calculadora-de-regla-de-tres -> rule-of-three-calculator
calculadora-de-imc -> bmi-calculator
calculadora-de-prestamo -> loan-calculator
conversor-de-temperatura -> temperature-converter
```

## Segmentos reservados y namespaces

Los reservados se definen por locale y profundidad. No usar como slug de categoria raiz un segmento que colisione con una ruta estatica/global, por ejemplo:

```txt
en
es
blog
page
pagina
category
categoria
404
robots.txt
sitemap.xml
privacy
contact
about
methodology
editorial-policy
corrections
```

Para ES se deben considerar tambien sus rutas reales como `contacto`, `privacidad`, `acerca-de`, `metodologia`, `politica-editorial` y `correcciones`. Incluir asimismo artefactos publicos relevantes como `sitemap-index.xml` cuando el regex del namespace los permita.

No aplicar una lista global ciegamente a slugs de calculadora: `/en/math/blog` no colisiona necesariamente con `/en/blog`. La validacion final se hace sobre rutas completas del manifest y el route tree de Astro. Si se agregan rutas globales nuevas, actualizar la definicion central y sus tests, no varias listas copiadas.

## Canonicals y alternates

Para una calculadora publicada en ambos idiomas:

```txt
ES canonical: /matematicas/calculadora-de-porcentajes
EN canonical: /en/math/percentage-calculator
```

Alternates:

```txt
hreflang es-MX -> ES canonical
hreflang en -> EN canonical
hreflang x-default -> ES canonical
```

Si solo existe ES:

- No crear alternate EN.
- No crear ruta EN.
- No listar en home EN.

La existencia se consulta en `PublishedRouteManifest`, no se infiere de metadata localizada ni de un helper capaz de construir el path.

Si solo existe EN en el futuro:

- Se permite solo si no es traduccion directa y tiene razon editorial.
- `x-default` debe revisarse caso por caso.

## Redirects

Agregar rutas EN nuevas no requiere redirects.

Cambiar cualquier URL publica existente, ES o EN, requiere:

1. Mapa old -> new.
2. Actualizar imports, links, breadcrumbs, canonicals, sitemap y tests.
3. Remover route files legacy.
4. Agregar reglas Apache `.htaccess` 301.
5. Buscar old slugs en `src` y `specs`.

Registrar por locale `firstPublishedAt` e historial de rutas/legacy slugs para distinguir un slug aun no publicado de una URL que ya requiere redirect. Los redirects viven en Apache `.htaccess`; no conservar wrappers Astro legacy.

No se permiten:

- Paginas Astro duplicadas como redirects.
- Meta refresh.
- Redirects cliente.
- Cadenas de redirects.

Agregar tests que analicen las reglas `.htaccess` y detecten targets que tambien sean sources, duplicados o cadenas.

## Tests recomendados

Agregar o extender tests para:

- Slugs de categoria unicos por locale.
- Slugs de calculadora unicos por categoria y locale.
- No usar segmentos reservados.
- `getCalculatorCategoryUrl("matematicas", "en") -> "/en/math"`.
- Categorias EN sin calculadoras no aparecen en home EN.
- Categorias ES no emiten alternate EN si la superficie EN no esta publicada.
- Rutas ES actuales no cambian.
- Rutas EN publicadas no tienen trailing slash.
- Slugs cumplen regex y no colisionan por ruta completa/namespace.
- Historial de URLs publicadas tiene su correspondiente 301 sin cadenas.

## Criterios de aceptacion

- Todas las categorias tienen propuesta EN revisable.
- Ninguna URL ES cambia.
- Las categorias EN se publican solo con contenido.
- Los helpers generan URLs; no se escriben rutas localizadas a mano salvo wrappers Astro.
- Construccion de path y disponibilidad publica son APIs distintas.
- Sitemap, alternates y links consumen rutas publicadas, no metadata candidata.
