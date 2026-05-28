# Spec: rutas del blog por categoria sin prefijo

## Contexto

El blog tiene actualmente estas familias de rutas publicas:

- Indice del blog: `/blog`
- Paginacion del indice: `/blog/pagina/<page>`
- Articulos individuales: `/blog/<slug-del-articulo>`
- Categorias del blog: `/blog/categoria/<category-slug>`
- Paginacion de categorias:
  `/blog/categoria/<category-slug>/pagina/<page>`

Las categorias se descubren automaticamente desde el frontmatter de los
articulos publicados. El flujo vive en `src/lib/blog.ts`:

- `getPublishedBlogPosts()` obtiene articulos publicables.
- `getBlogCategories(posts)` agrupa por `post.data.category`.
- `getCategorySlug(category)` deriva el slug desde el label.
- `getCategoryUrl(category)` genera `/blog/categoria/<slug>`.
- `getCategoryPageUrl(category, page)` genera la paginacion de categoria.
- `getBlogPostSlug(post)` obtiene el slug del articulo desde el archivo.
- `getBlogPostUrl(post)` genera `/blog/<slug-del-articulo>`.

El nuevo requerimiento cambia dos cosas al mismo tiempo:

1. Las categorias dejan de vivir bajo `/blog/categoria/...`.
2. Los articulos dejan de vivir directamente bajo `/blog/...` y pasan a vivir
   dentro de su categoria.

## Objetivo

Cambiar las URLs canonicas del blog a una jerarquia por categoria:

```txt
/blog/<category-slug>
/blog/<category-slug>/<slug-del-articulo>
/blog/<category-slug>/pagina/<page>
```

La palabra `categoria` debe eliminarse de las rutas publicas del blog.

Los labels visibles de categorias no cambian. Los slugs de articulos tampoco
deben cambiar; solo se agrega el segmento de categoria antes del slug del
articulo.

## URLs esperadas

### Categorias

| Categoria visible | Slug actual | URL actual | URL nueva |
| --- | --- | --- | --- |
| `Finanzas` | `finanzas` | `/blog/categoria/finanzas` | `/blog/finanzas` |
| `Inmuebles` | `inmuebles` | `/blog/categoria/inmuebles` | `/blog/inmuebles` |
| `Legal e impuestos` | `legal-e-impuestos` | `/blog/categoria/legal-e-impuestos` | `/blog/legal-e-impuestos` |
| `Matematicas` | `matematicas` | `/blog/categoria/matematicas` | `/blog/matematicas` |
| `Salud` | `salud` | `/blog/categoria/salud` | `/blog/salud` |

Nota: esta spec no cambia la estrategia de slug del blog. Por eso
`Legal e impuestos` sigue generando `legal-e-impuestos` en el blog. Homologar
ese slug con la categoria de calculadoras `legal-impuestos` seria otra
migracion.

### Articulos

Los articulos deben pasar de:

```txt
/blog/<slug-del-articulo>
```

a:

```txt
/blog/<category-slug>/<slug-del-articulo>
```

Ejemplos:

| Articulo | Categoria | URL actual | URL nueva |
| --- | --- | --- | --- |
| `como-calcular-iva` | `legal-e-impuestos` | `/blog/como-calcular-iva` | `/blog/legal-e-impuestos/como-calcular-iva` |
| `regla-de-tres` | `matematicas` | `/blog/regla-de-tres` | `/blog/matematicas/regla-de-tres` |
| `que-es-interes-compuesto` | `finanzas` | `/blog/que-es-interes-compuesto` | `/blog/finanzas/que-es-interes-compuesto` |

## Analisis de routing

El requerimiento anterior de mover categorias a `/blog/<category-slug>` podia
chocar con articulos, porque los articulos tambien vivian en `/blog/<slug>`.

Con el nuevo requerimiento, el namespace queda mas claro:

- `/blog/<category-slug>` es una pagina de categoria.
- `/blog/<category-slug>/<slug-del-articulo>` es un articulo.
- `/blog/<category-slug>/pagina/<page>` es paginacion de categoria.
- `/blog/pagina/<page>` sigue siendo paginacion del indice general.

Esto reduce colisiones entre categorias y articulos, pero introduce nuevas
reglas:

- `pagina` sigue reservado como slug de categoria, porque `/blog/pagina/<page>`
  ya pertenece a la paginacion del indice.
- `categoria` queda reservado por compatibilidad legacy.
- Dentro de cada categoria, `pagina` debe reservarse como slug de articulo para
  evitar confusion con `/blog/<category-slug>/pagina/<page>`.
- Un articulo no debe publicarse si su `category` genera un slug que no coincide
  con la categoria bajo la que se generara su URL.

## Opcion recomendada

Implementar rutas explicitas por tipo de pagina:

```txt
src/pages/blog/[category].astro
src/pages/blog/[category]/[slug].astro
src/pages/blog/[category]/pagina/[page].astro
```

Y eliminar las rutas canonicas antiguas:

```txt
src/pages/blog/[...slug].astro
src/pages/blog/categoria/[category].astro
src/pages/blog/categoria/[category]/pagina/[page].astro
```

`src/pages/blog/pagina/[page].astro` se conserva para la paginacion del indice
general.

Esta opcion mantiene separados los templates de:

- Categoria.
- Articulo.
- Paginacion de categoria.
- Paginacion del indice.

Tambien hace que la URL final de un articulo sea una funcion clara de dos
valores existentes: `post.data.category` y el slug del archivo.

## Alcance

- Actualizar `getCategoryUrl(category)` en `src/lib/blog.ts` para generar
  `/blog/<category-slug>`.
- Actualizar `getCategoryPageUrl(category, page)` para generar:
  - pagina 1: `/blog/<category-slug>`
  - pagina 2+: `/blog/<category-slug>/pagina/<page>`
- Actualizar `getBlogPostUrl(post)` para generar
  `/blog/<category-slug>/<slug-del-articulo>`.
- Ajustar el tipo de `getBlogPostUrl()` para recibir tambien la categoria del
  post, no solo el `id`.
- Mover la pagina de articulo de `src/pages/blog/[...slug].astro` a
  `src/pages/blog/[category]/[slug].astro`.
- Mover la pagina 1 de categoria de
  `src/pages/blog/categoria/[category].astro` a
  `src/pages/blog/[category].astro`.
- Mover la paginacion de categoria de
  `src/pages/blog/categoria/[category]/pagina/[page].astro` a
  `src/pages/blog/[category]/pagina/[page].astro`.
- Mantener `src/pages/blog/pagina/[page].astro` para paginacion del indice.
- Actualizar canonicals, JSON-LD, `rel="prev"`, `rel="next"`, breadcrumbs,
  chips de categoria, cards y enlaces de articulo para usar las nuevas URLs.
- Agregar redirects desde rutas antiguas hacia las nuevas.
- Agregar validaciones para slugs reservados y colisiones.
- Actualizar documentacion editorial del blog que mencione URLs de categoria o
  articulos.

## Fuera de alcance

- Cambiar el slug de articulos existentes.
- Cambiar el label visible de categorias.
- Cambiar el slug generado para `Legal e impuestos` de `legal-e-impuestos` a
  `legal-impuestos`.
- Crear metadata explicita para categorias del blog.
- Cambiar las URLs de categorias de calculadoras.
- Cambiar el diseno visual del blog.
- Cambiar el tamano de pagina de la paginacion.

## Cambios tecnicos esperados

### Helpers de URL

Cambiar:

```ts
export const getCategoryUrl = (category: string) =>
  `/blog/categoria/${getCategorySlug(category)}`;
```

por:

```ts
export const getCategoryUrl = (category: string) =>
  `/blog/${getCategorySlug(category)}`;
```

`getCategoryPageUrl()` debe seguir delegando en `getCategoryUrl()`:

```ts
export const getCategoryPageUrl = (category: string, page: number) =>
  page <= 1
    ? getCategoryUrl(category)
    : `${getCategoryUrl(category)}/pagina/${page}`;
```

Cambiar `getBlogPostUrl()` de:

```ts
export const getBlogPostUrl = (post: Pick<BlogPost, "id">) =>
  `/blog/${getBlogPostSlug(post)}`;
```

a:

```ts
export const getBlogPostUrl = (
  post: Pick<BlogPost, "id" | "data">,
) => `/blog/${getCategorySlug(post.data.category)}/${getBlogPostSlug(post)}`;
```

Si se prefiere evitar que helpers de URL dependan de todo `post.data`, se puede
extraer un helper intermedio:

```ts
export const getBlogPostCategorySlug = (
  post: Pick<BlogPost, "data">,
) => getCategorySlug(post.data.category);
```

### Rutas Astro

#### Articulos

Mover:

```txt
src/pages/blog/[...slug].astro
```

a:

```txt
src/pages/blog/[category]/[slug].astro
```

`getStaticPaths()` debe generar params con categoria y slug:

```ts
return posts.map((post) => ({
  params: {
    category: getCategorySlug(post.data.category),
    slug: getBlogPostSlug(post),
  },
  props: { post },
}));
```

El canonical del articulo debe usar `getBlogPostUrl(post)`.

#### Categorias

Mover:

```txt
src/pages/blog/categoria/[category].astro
```

a:

```txt
src/pages/blog/[category].astro
```

#### Paginacion de categorias

Mover:

```txt
src/pages/blog/categoria/[category]/pagina/[page].astro
```

a:

```txt
src/pages/blog/[category]/pagina/[page].astro
```

Despues del move, eliminar las rutas antiguas para que no generen paginas
canonicas bajo `/blog/categoria/...` ni articulos bajo `/blog/<slug>`.

## Redirects

### Categorias antiguas

Redirigir:

```txt
/blog/categoria/<category-slug> -> /blog/<category-slug>
/blog/categoria/<category-slug>/pagina/<page> -> /blog/<category-slug>/pagina/<page>
```

Si Astro/config soporta parametros dinamicos confiables para la salida actual,
se puede usar:

```js
redirects: {
  "/blog/categoria/[category]": "/blog/[category]",
  "/blog/categoria/[category]/pagina/[page]": "/blog/[category]/pagina/[page]"
}
```

Si no, usar redirects estaticos explicitos para las categorias y paginas
paginadas existentes.

### Articulos antiguos

Tambien se deben redirigir las URLs antiguas de articulos:

```txt
/blog/<slug-del-articulo> -> /blog/<category-slug>/<slug-del-articulo>
```

Este redirect no puede resolverse solo con una regla generica simple, porque el
destino depende de la categoria de cada articulo. La implementacion debe elegir
una de estas opciones:

1. Generar redirects estaticos explicitos para todos los articulos publicados
   actuales.
2. Crear una ruta legacy de un segmento que emita redirects para slugs de
   articulos antiguos sin generar paginas canonicas.
3. Generar una tabla de redirects en build a partir de `src/content/blog`.

La opcion elegida debe confirmar que no vuelve a crear conflicto con
`/blog/<category-slug>` para categorias.

La implementacion final debe confirmar en `dist` que las rutas antiguas son
redirects con `noindex` y canonical hacia la URL nueva.

## Validacion de colisiones

Agregar una utilidad pura o test que revise:

- Slugs de categorias generados por `getBlogCategories(posts)`.
- Slugs de articulos generados por `getBlogPostSlug(post)`.
- Slugs reservados de categoria: `pagina`, `categoria`.
- Slugs reservados de articulo dentro de categoria: `pagina`.

Reglas esperadas:

1. Ninguna categoria puede tener slug `pagina`.
2. Ninguna categoria puede tener slug `categoria`.
3. Ningun articulo puede tener slug `pagina`.
4. Dentro de una misma categoria no puede haber dos articulos con el mismo slug.
5. Las URLs generadas por `getBlogPostUrl(post)` deben ser unicas.
6. Las URLs de categorias y las URLs de articulos no deben duplicarse.

Ejemplo conceptual:

```ts
export const getBlogRouteConflicts = (posts: BlogPost[]) => {
  // Devuelve conflictos de categoria, articulo y URL final.
};
```

La validacion puede vivir como prueba unitaria o ejecutarse en build. Si se
ejecuta en build, debe lanzar errores claros, por ejemplo:

```txt
Blog article route "/blog/salud/pagina" is reserved for pagination.
```

## Criterios de aceptacion

- En `/blog`, los chips de categoria apuntan a `/blog/<category-slug>`.
- El enlace de categoria del articulo destacado apunta a
  `/blog/<category-slug>`.
- En articulos individuales, el `kickerHref` de categoria apunta a
  `/blog/<category-slug>`.
- Las cards de articulos apuntan a
  `/blog/<category-slug>/<slug-del-articulo>`.
- `/blog/finanzas` se genera durante el build.
- `/blog/legal-e-impuestos` se genera durante el build.
- `/blog/salud` se genera durante el build.
- `/blog/salud` muestra solo articulos publicados de Salud.
- `/blog/legal-e-impuestos/como-calcular-iva` genera el articulo
  `como-calcular-iva`.
- `/blog/matematicas/regla-de-tres` genera el articulo `regla-de-tres`.
- `/blog/finanzas/que-es-interes-compuesto` genera el articulo
  `que-es-interes-compuesto`.
- Si una categoria tiene pagina 2, la URL canonica es
  `/blog/<category-slug>/pagina/2`.
- `/blog/pagina/2` conserva la paginacion del indice general.
- `/blog/categoria/salud` redirige a `/blog/salud`.
- `/blog/categoria/legal-e-impuestos` redirige a
  `/blog/legal-e-impuestos`.
- `/blog/categoria/salud/pagina/2` redirige a
  `/blog/salud/pagina/2` cuando esa pagina existe.
- `/blog/como-calcular-iva` redirige a
  `/blog/legal-e-impuestos/como-calcular-iva`.
- `/blog/regla-de-tres` redirige a `/blog/matematicas/regla-de-tres`.
- `/blog/que-es-interes-compuesto` redirige a
  `/blog/finanzas/que-es-interes-compuesto`.
- El sitemap incluye `/blog/<category-slug>/` para categorias.
- El sitemap incluye `/blog/<category-slug>/<slug-del-articulo>/` para
  articulos.
- El sitemap no incluye `/blog/categoria/<category-slug>/` como URL canonica
  de categorias.
- El sitemap no incluye `/blog/<slug-del-articulo>/` como URL canonica de
  articulos.
- El build falla o las pruebas fallan si se genera una URL duplicada.
- `npm.cmd run test:unit:run` termina sin errores.
- `npm.cmd run build` termina sin errores.

## Pruebas sugeridas

- Agregar pruebas unitarias para:
  - `getCategoryUrl("Salud") === "/blog/salud"`.
  - `getCategoryPageUrl("Salud", 1) === "/blog/salud"`.
  - `getCategoryPageUrl("Salud", 2) === "/blog/salud/pagina/2"`.
  - `getBlogPostUrl(postDeIva) === "/blog/legal-e-impuestos/como-calcular-iva"`.
  - `getBlogPostUrl(postDeReglaDeTres) === "/blog/matematicas/regla-de-tres"`.
  - no hay URLs duplicadas entre categorias, articulos y paginacion.
  - `pagina` y `categoria` no se aceptan como slugs de categoria.
  - `pagina` no se acepta como slug de articulo.
- Ejecutar `npm.cmd run test:unit:run`.
- Ejecutar `npm.cmd run build`.
- Revisar manualmente `/blog`.
- Revisar manualmente `/blog/salud`.
- Revisar manualmente una categoria paginada, por ejemplo
  `/blog/salud/pagina/2` si existe.
- Revisar manualmente articulos:
  - `/blog/legal-e-impuestos/como-calcular-iva`
  - `/blog/matematicas/regla-de-tres`
  - `/blog/finanzas/que-es-interes-compuesto`
- Revisar manualmente redirects desde:
  - `/blog/categoria/salud`
  - `/blog/categoria/legal-e-impuestos`
  - `/blog/categoria/salud/pagina/2`
  - `/blog/como-calcular-iva`
  - `/blog/regla-de-tres`
- Revisar `dist/sitemap-0.xml` y confirmar que las categorias del blog ya no
  aparecen bajo `/blog/categoria/` y los articulos ya no aparecen bajo
  `/blog/<slug-del-articulo>/`.

## Documentacion a actualizar

Actualizar `specs/publicacion-articulos-blog.md` porque hoy documenta:

- `getCategoryUrl(category)` genera `/blog/categoria/<slug>`.
- las paginas dinamicas del blog incluyen `/blog/categoria/<slug-categoria>`.
- los articulos individuales viven bajo `/blog/<slug-del-articulo>`.
- para una categoria nueva se espera `/blog/categoria/salud`.

Despues del cambio debe documentar:

- `getCategoryUrl(category)` genera `/blog/<slug>`.
- las paginas dinamicas del blog incluyen `/blog/<slug-categoria>`.
- los articulos individuales viven bajo
  `/blog/<slug-categoria>/<slug-del-articulo>`.
- una categoria nueva debe verificarse en `/blog/<slug>`.

