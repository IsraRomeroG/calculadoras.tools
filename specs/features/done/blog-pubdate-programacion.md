# Spec: programacion de articulos por pubDate

## Contexto

Actualmente `pubDate` se usa como fecha editorial visible y como criterio de
ordenamiento, pero no como criterio de publicacion.

La coleccion `blog` esta definida en `src/content.config.ts` y carga todos los
archivos `md` y `mdx` dentro de `src/content/blog`. El schema convierte
`pubDate` a `Date` con `z.coerce.date()`, pero esa conversion no excluye
contenido futuro.

El filtro real de articulos publicados vive en `src/lib/blog.ts`:

```ts
const posts = await getCollection("blog", ({ data }) => !data.draft);
```

Por eso, cualquier articulo dentro de `src/content/blog` aparece si no tiene
`draft: true`, aunque su `pubDate` sea posterior a la fecha actual.

## Objetivo

Usar `pubDate` como criterio central de visualizacion y generacion de rutas del
blog, de forma que los articulos con fecha futura no sean visibles ni tengan
ruta estatica generada mientras todavia no llegue su fecha de publicacion.

## Definicion de articulo publicable

Un articulo de blog es publicable cuando cumple ambas condiciones:

1. `draft` no es `true`.
2. `pubDate` es igual o anterior a la fecha editorial actual.

Un articulo con `draft: true` queda oculto siempre, aunque `pubDate` ya haya
pasado.

Un articulo con `pubDate` futura queda oculto aunque `draft` sea `false` o no
este declarado.

## Semantica de fechas

`pubDate` debe tratarse como una fecha editorial de calendario, no como una hora
exacta del dia.

La zona horaria editorial recomendada para este sitio es
`America/Mexico_City`, porque el proyecto usa contenido en espanol y formato
`es-MX`.

Ejemplos esperados:

- Si la fecha editorial actual es `2026-05-26`, un articulo con
  `pubDate: 2026-05-27` no es publicable.
- Si la fecha editorial actual es `2026-05-27`, un articulo con
  `pubDate: 2026-05-27` si es publicable.
- Si la fecha editorial actual es `2026-05-27`, un articulo con
  `pubDate: 2026-05-28` no es publicable.

La comparacion debe evitar desfases por UTC. Un `pubDate` escrito como
`YYYY-MM-DD` no debe publicarse la tarde o noche anterior en Mexico solo porque
UTC ya cambio de dia.

## Alcance

- Actualizar el criterio central de `getPublishedBlogPosts()` en
  `src/lib/blog.ts`.
- Mantener el orden actual por `pubDate` descendente para articulos ya
  publicables.
- Aplicar el filtro automaticamente a:
  - `/blog`
  - `/blog/pagina/{page}`
  - `/blog/{slug-del-articulo}`
  - `/blog/categoria/{categoria}`
  - `/blog/categoria/{categoria}/pagina/{page}`
- Excluir articulos futuros de los conteos de categoria.
- Excluir articulos futuros de la paginacion.
- Excluir articulos futuros del articulo destacado.
- Excluir articulos futuros del sitemap si el sitemap se deriva de las rutas
  estaticas generadas por Astro.

## Nota sobre despliegues estaticos

El sitio genera rutas de forma estatica durante `astro build`. Por eso, esta
feature no debe prometer que un articulo aparecera automaticamente en un build
ya desplegado cuando cambie la fecha del reloj.

El comportamiento esperado es:

- En un build ejecutado antes de `pubDate`, el articulo futuro no se genera.
- En un build ejecutado el dia de `pubDate` o despues, el articulo se genera.

Si se quiere publicacion exactamente calendarizada sin intervencion manual,
hace falta un rebuild programado externo. Esa automatizacion queda fuera del
alcance de esta spec.

## Notas tecnicas

- Centralizar la logica en `src/lib/blog.ts` para no repetir filtros en las
  paginas Astro.
- Extraer una utilidad pura y testeable, por ejemplo:

```ts
export const BLOG_PUBLICATION_TIME_ZONE = "America/Mexico_City";

export const isBlogPostPublishable = (
  data: Pick<BlogPost["data"], "draft" | "pubDate">,
  now = new Date(),
) => {
  // ...
};
```

- `getPublishedBlogPosts()` debe usar esa utilidad:

```ts
const posts = await getCollection("blog", ({ data }) =>
  isBlogPostPublishable(data),
);
```

- La utilidad debe comparar fechas normalizadas a `YYYY-MM-DD` en la zona
  horaria editorial.
- Para pruebas, permitir inyectar `now` en la utilidad pura.
- Si se decide permitir inyectar `now` tambien en `getPublishedBlogPosts()`,
  mantener el valor default en `new Date()` para que las paginas no necesiten
  cambios.
- No cambiar el schema de `pubDate`; el campo sigue siendo obligatorio y sigue
  aceptando los valores actuales del frontmatter.
- No cambiar `formatBlogDate()` salvo que sea necesario para alinear la zona
  horaria de visualizacion con la zona editorial.

## Requisitos funcionales

1. Un articulo con `pubDate` futura no debe aparecer en `/blog`.
2. Un articulo con `pubDate` futura no debe aparecer en paginas paginadas del
   blog.
3. Un articulo con `pubDate` futura no debe aparecer en paginas de categoria.
4. Un articulo con `pubDate` futura no debe contar para el total de su
   categoria.
5. Un articulo con `featured: true` y `pubDate` futura no debe mostrarse como
   articulo destacado.
6. La ruta `/blog/{slug}` no debe generarse para articulos futuros.
7. Cuando llegue la fecha de `pubDate` y se ejecute un nuevo build, el articulo
   debe aparecer sin cambiar su ubicacion ni quitar un flag manual.
8. Los articulos con `pubDate` pasada o igual a la fecha editorial actual deben
   conservar el comportamiento existente.
9. Los articulos con `draft: true` deben seguir excluidos aunque su `pubDate`
   ya haya pasado.
10. El orden de articulos publicables debe seguir siendo descendente por
    `pubDate`.

## Criterios de aceptacion

- Con fecha editorial actual `2026-05-26`, un articulo en
  `src/content/blog/salud/ejemplo.md` con `pubDate: 2026-05-27` no aparece en
  listados ni genera `/blog/ejemplo`.
- Con fecha editorial actual `2026-05-27`, ese mismo articulo si aparece y
  genera `/blog/ejemplo`.
- Un articulo futuro no modifica el numero de paginas generadas en
  `/blog/pagina/{page}`.
- Un articulo futuro no crea ni mantiene categorias vacias.
- Un articulo futuro no puede desplazar al articulo destacado vigente.
- `npm.cmd run build` termina sin errores.
- Las rutas existentes de articulos ya publicables no cambian.

## Pruebas sugeridas

- Agregar pruebas unitarias para la utilidad de publicacion:
  - `draft: true` excluye articulos con fecha pasada.
  - `pubDate` pasada incluye articulos sin `draft`.
  - `pubDate` igual a la fecha editorial actual incluye el articulo.
  - `pubDate` posterior a la fecha editorial actual excluye el articulo.
  - el limite de dia respeta `America/Mexico_City` y no UTC.
- Ejecutar `npm.cmd run test:unit:run`.
- Ejecutar `npm.cmd run build`.
- Verificar manualmente `/blog`.
- Verificar manualmente una categoria afectada, por ejemplo
  `/blog/categoria/salud`.
- Verificar que la URL individual de un articulo futuro no exista en el build.

## Fuera de alcance

- Mover automaticamente archivos desde `src/content/pending` a
  `src/content/blog`.
- Crear un job externo de deploy o rebuild calendarizado.
- Cambiar el flujo editorial de `draft`.
- Cambiar slugs de articulos existentes.
- Cambiar el diseno del blog.
- Agregar busqueda o filtros en cliente.
