# Spec: paginacion del blog

## Contexto

El blog ya acumula suficientes articulos como para que los listados queden
demasiado largos cuando se muestran en una sola pagina.

Hoy existen dos superficies principales de listado:

- `/blog`, que muestra una guia destacada y despues todos los articulos
  restantes.
- `/blog/categoria/[category]`, que muestra todos los articulos publicados de
  una categoria.

Los articulos individuales viven bajo `/blog/{slug}` mediante
`src/pages/blog/[...slug].astro`, asi que la paginacion debe evitar rutas que
puedan confundirse con slugs de articulos.

## Objetivo

Agregar paginacion estatica para los listados del blog, manteniendo las URLs de
articulos existentes y mejorando la navegacion cuando una categoria o el indice
general tenga muchos posts.

## Alcance

- Pagina afectada: `src/pages/blog.astro`.
- Pagina afectada: `src/pages/blog/categoria/[category].astro`.
- Nuevas rutas esperadas para paginas 2+:
  - `/blog/pagina/2`
  - `/blog/pagina/3`
  - `/blog/categoria/{categoria}/pagina/2`
  - `/blog/categoria/{categoria}/pagina/3`
- Nuevo componente recomendado:
  `src/components/shared/Pagination.astro`.
- Helpers recomendados en `@lib/blog` para construir URLs y dividir listados.
- No se requiere JavaScript en cliente.

## Convencion de URLs

Para evitar conflictos con `src/pages/blog/[...slug].astro`, no usar rutas del
tipo `/blog/2`.

La primera pagina conserva las rutas existentes:

- `/blog`
- `/blog/categoria/{categoria}`

Las paginas posteriores usan el segmento reservado `pagina`:

- `/blog/pagina/{page}`
- `/blog/categoria/{categoria}/pagina/{page}`

No debe generarse ni enlazarse `/blog/pagina/1`. La pagina 1 canonica siempre
es `/blog`.

No debe generarse ni enlazarse
`/blog/categoria/{categoria}/pagina/1`. La pagina 1 canonica siempre es
`/blog/categoria/{categoria}`.

## Requisitos funcionales

1. El listado principal del blog debe mostrar solo un numero limitado de posts
   por pagina.
2. La pagina 1 de `/blog` debe conservar:
   - hero actual
   - chips de categorias
   - articulo destacado, si existe
   - seccion de ultimos articulos paginada
3. El articulo destacado no debe duplicarse dentro del grid de articulos.
4. Las paginas `/blog/pagina/{page}` deben mostrar la continuacion del listado
   de articulos, respetando el orden actual de `getPublishedBlogPosts()`.
5. Las categorias deben paginar solo los articulos publicados de esa categoria.
6. Las paginas de categoria deben respetar el orden actual de posts, del mas
   reciente al mas antiguo.
7. La paginacion debe aparecer solo cuando exista mas de una pagina.
8. Los controles deben permitir navegar a:
   - pagina anterior, cuando exista
   - pagina siguiente, cuando exista
   - paginas numeradas cercanas a la pagina actual
9. La pagina actual debe indicarse visualmente y con `aria-current="page"`.
10. Si una pagina solicitada queda fuera de rango, no debe generarse en
    `getStaticPaths()`.
11. Las URLs existentes de articulos individuales, categorias y `/blog` no deben
    cambiar.

## Tamano de pagina

Usar un valor unico y explicito para el tamano de pagina, por ejemplo:

```ts
export const BLOG_POSTS_PER_PAGE = 12;
```

El valor debe vivir en `@lib/blog` o en un helper cercano para evitar numeros
magicos repetidos entre el indice y las categorias.

## Notas tecnicas

- Agregar helpers de URL:
  - `getBlogIndexPageUrl(page: number)`
  - `getCategoryPageUrl(category: string, page: number)`
- `getBlogIndexPageUrl(1)` debe devolver `/blog`.
- `getBlogIndexPageUrl(2)` debe devolver `/blog/pagina/2`.
- `getCategoryPageUrl("Salud", 1)` debe devolver `/blog/categoria/salud`.
- `getCategoryPageUrl("Salud", 2)` debe devolver
  `/blog/categoria/salud/pagina/2`.
- Reutilizar `getCategorySlug()` para construir URLs de categoria.
- Extraer una utilidad pequena para paginar arreglos, por ejemplo:
  `paginateItems(items, currentPage, pageSize)`.
- Crear rutas explicitas para paginas 2+:
  - `src/pages/blog/pagina/[page].astro`
  - `src/pages/blog/categoria/[category]/pagina/[page].astro`
- Las rutas nuevas pueden compartir un helper de datos con las paginas 1 para
  evitar duplicar la logica de filtrado y orden.
- Mantener `BlogPostCard` como componente de card del listado.
- Mantener `PageHero`, `Container` y `PageShell` para conservar la estructura
  visual actual.

## Componente de paginacion

El componente recomendado `Pagination.astro` debe recibir datos ya resueltos,
por ejemplo:

- `currentPage`
- `totalPages`
- `getPageUrl` o una lista de enlaces ya calculada
- labels opcionales para anterior y siguiente

El componente debe renderizar un `<nav aria-label="Paginacion">` con enlaces
reales. Los estados no disponibles, como "Anterior" en la pagina 1, deben
omitirse o renderizarse como texto no interactivo.

## SEO

- La pagina 1 del blog mantiene canonical `/blog`.
- Las paginas 2+ del blog usan canonical propio:
  `/blog/pagina/{page}`.
- La pagina 1 de categoria mantiene canonical
  `/blog/categoria/{categoria}`.
- Las paginas 2+ de categoria usan canonical propio:
  `/blog/categoria/{categoria}/pagina/{page}`.
- El `<title>` de paginas 2+ debe incluir el numero de pagina, por ejemplo:
  `Blog - pagina 2`.
- El `<title>` de categorias paginadas debe incluir categoria y numero de
  pagina, por ejemplo:
  `Blog de salud - pagina 2`.
- Si se agregan enlaces `rel="prev"` y `rel="next"` en el slot `head`, deben
  apuntar a las URLs canonicas correspondientes.

## Accesibilidad

- La paginacion debe ser usable con teclado.
- El foco visible debe seguir las convenciones visuales del sitio.
- Los enlaces numerados deben tener nombres accesibles claros, por ejemplo:
  `Pagina 2`.
- La pagina actual debe usar `aria-current="page"`.
- Los controles anterior/siguiente deben tener texto visible o labels claros.

## Criterios de aceptacion

- `/blog` ya no renderiza todos los articulos publicados en una sola pagina.
- `/blog` conserva el articulo destacado sin duplicarlo en el grid.
- Cuando hay suficientes articulos, `/blog` muestra un enlace a
  `/blog/pagina/2`.
- `/blog/pagina/2` muestra la siguiente tanda de articulos.
- `/blog/pagina/2` permite volver a `/blog`.
- `/blog/categoria/salud` muestra solo la primera tanda de articulos de Salud.
- Cuando Salud tiene suficientes articulos, `/blog/categoria/salud` enlaza a
  `/blog/categoria/salud/pagina/2`.
- `/blog/categoria/salud/pagina/2` muestra solo articulos de Salud.
- Las categorias sin suficientes articulos no muestran controles de paginacion.
- No se rompe ninguna URL existente de articulo, por ejemplo `/blog/{slug}`.
- El build de Astro termina sin errores.

## Pruebas sugeridas

- Ejecutar `npm run build`.
- Ejecutar las pruebas unitarias existentes si hay helpers nuevos:
  `npm run test:unit:run`.
- Revisar manualmente `/blog`.
- Revisar manualmente `/blog/pagina/2` cuando existan suficientes posts.
- Revisar manualmente una categoria con muchos posts, por ejemplo
  `/blog/categoria/salud`.
- Revisar manualmente la pagina 2 de esa categoria.
- Confirmar que los enlaces de paginacion no apuntan a `/pagina/1`.
- Confirmar que las cards mantienen el orden de publicacion esperado.

## Fuera de alcance

- Cambiar el contenido editorial del blog.
- Cambiar los slugs de articulos existentes.
- Agregar filtros o busqueda dentro del blog.
- Cambiar el diseno general del blog fuera de los controles de paginacion.
- Implementar paginacion con JavaScript en cliente.
