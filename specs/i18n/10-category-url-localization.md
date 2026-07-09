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

El `categoryId` no se traduce. Puede seguir usando el slug espanol canonico actual:

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

Una categoria EN debe tener metadata lista aunque puede permanecer no visible si no tiene calculadoras publicadas.

Reglas:

- `getCategoryLocale(id, "en")` puede existir antes de que haya calculadoras EN.
- `getCalculatorCategories(getPublishedCalculators("en"), "en")` solo muestra categorias con calculadoras publicadas.
- No crear paginas EN vacias para categorias sin calculadoras.
- No enlazar categorias EN desde home si no tienen contenido.

## Slugs de calculadoras

Cada slug EN debe cumplir:

- ASCII lowercase.
- Palabras separadas por guion.
- Sin trailing slash.
- Sin acentos.
- Sin colision dentro de su categoria EN.
- Sin segmentos reservados.
- Descriptivo para SEO.

Ejemplos:

```txt
calculadora-de-porcentajes -> percentage-calculator
calculadora-de-regla-de-tres -> rule-of-three-calculator
calculadora-de-imc -> bmi-calculator
calculadora-de-prestamo -> loan-calculator
conversor-de-temperatura -> temperature-converter
```

## Segmentos reservados

No usar como slug de categoria o calculadora:

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

Si se agregan rutas globales nuevas, actualizar esta lista y los tests.

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

Si solo existe EN en el futuro:

- Se permite solo si no es traduccion directa y tiene razon editorial.
- `x-default` debe revisarse caso por caso.

## Redirects

Agregar rutas EN nuevas no requiere redirects.

Cambiar una ruta ES existente requiere:

1. Mapa old -> new.
2. Actualizar imports, links, breadcrumbs, canonicals, sitemap y tests.
3. Remover route files legacy.
4. Agregar reglas Apache `.htaccess` 301.
5. Buscar old slugs en `src` y `specs`.

No se permiten:

- Paginas Astro duplicadas como redirects.
- Meta refresh.
- Redirects cliente.
- Cadenas de redirects.

## Tests recomendados

Agregar o extender tests para:

- Slugs de categoria unicos por locale.
- Slugs de calculadora unicos por categoria y locale.
- No usar segmentos reservados.
- `getCalculatorCategoryUrl("matematicas", "en") -> "/en/math"`.
- Categorias EN sin calculadoras no aparecen en home EN.
- Rutas ES actuales no cambian.
- Rutas EN publicadas no tienen trailing slash.

## Criterios de aceptacion

- Todas las categorias tienen propuesta EN revisable.
- Ninguna URL ES cambia.
- Las categorias EN se publican solo con contenido.
- Los helpers generan URLs; no se escriben rutas localizadas a mano salvo wrappers Astro.
