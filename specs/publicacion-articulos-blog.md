# Publicacion de articulos del blog

Este documento describe como pasar articulos desde `src/content/pending` a `src/content/blog` y que revisar cuando el articulo pertenece a una categoria nueva.

## Idea principal

Astro publica solamente la coleccion `blog` definida en `src/content.config.ts`. Esa coleccion carga archivos `md` y `mdx` desde:

```txt
src/content/blog/**/*.md
src/content/blog/**/*.mdx
```

La carpeta `src/content/pending` no forma parte de la coleccion publicada. Sirve como backlog editorial organizado por tema y fecha.

Importante: `pubDate` tambien funciona como criterio de publicacion durante el build. Si un archivo esta dentro de `src/content/blog` pero su `pubDate` es futura, no aparece en listados ni genera ruta publica hasta que se ejecute un nuevo build en esa fecha o despues.

## Publicar un articulo de una categoria existente

1. Revisa el frontmatter del articulo pendiente.
2. Confirma que `categorySlug` coincide con la categoria publica deseada.
3. Mueve el archivo desde `src/content/pending/<grupo>/<fecha>/<archivo>.md` hacia `src/content/blog/<slug-categoria>/<archivo>.md`.
4. Si no existe la carpeta destino, creala.
5. Ejecuta `npm.cmd run build` para validar que el contenido compila.

Ejemplo:

```txt
src/content/pending/salud/2026-05-27/que-es-el-imc-y-como-se-calcula.md
src/content/blog/salud/que-es-el-imc-y-como-se-calcula.md
```

La carpeta destino debe representar el slug canonico de la categoria publica del articulo. No necesariamente coincide con la carpeta editorial de `pending`. Por ejemplo, algunos articulos bajo `pending/prestamo` usan `categorySlug: "finanzas"`, asi que su destino publicado debe ser `src/content/blog/finanzas`.

## Campos obligatorios del frontmatter

El schema de `src/content.config.ts` requiere estos campos:

```yaml
title: "Titulo del articulo"
description: "Descripcion breve para SEO y listados"
pubDate: 2026-05-27
categorySlug: "slug-categoria"
tags:
  - tema
```

Campos opcionales usados por el blog:

```yaml
updatedDate: 2026-05-28
readTime: "5 min"
featured: true
draft: true
seoTitle: "Titulo SEO alternativo"
relatedCalculator:
  label: "Calculadora relacionada"
  href: "/ruta/de/la/calculadora"
```

`draft: true` excluye el articulo de los listados y rutas publicadas porque `getPublishedBlogPosts()` filtra borradores. Un `pubDate` futuro tambien excluye el articulo, aunque `draft` no este declarado.

## Que pasa con las categorias del blog

Las categorias de articulos usan la metadata compartida de `src/lib/constants/categories.ts`. El frontmatter guarda el slug canonico y el label visible se obtiene desde esa metadata.

El flujo esta en `src/lib/blog.ts`:

- `getPublishedBlogPosts()` obtiene los articulos de `src/content/blog` que no son borrador y cuya `pubDate` no es futura.
- `getBlogCategories(posts)` agrupa por `post.data.categorySlug`.
- `getBlogPostCategory(post)` obtiene label y metadata desde `CATEGORIES`.
- `getCategoryUrl(categorySlug)` genera `/blog/<slug>`.
- `getBlogPostUrl(post)` genera
  `/blog/<slug-categoria>/<slug-del-articulo>`.

Las paginas dinamicas del blog usan esa informacion para generar:

- `/blog`
- `/blog/pagina/<page>`
- `/blog/<slug-categoria>`
- `/blog/<slug-categoria>/pagina/<page>`
- `/blog/<slug-categoria>/<slug-del-articulo>`

Por eso, para una categoria nueva de blog, primero debe existir una entrada en
`src/lib/constants/categories.ts`; despues se publica al menos un articulo con
`categorySlug: "<slug-categoria>"` dentro de `src/content/blog/<slug-categoria>/`.

## Crear una categoria nueva de articulos

Para una categoria nueva del blog, hay que registrar primero la metadata
compartida de categoria.

Pasos:

1. Decide el nombre publico de la categoria, por ejemplo `Salud` o `Inmuebles`.
2. Agrega o confirma la categoria en `src/lib/constants/categories.ts`.
3. Usa el slug canonico en el frontmatter: `categorySlug: "salud"`.
4. Crea la carpeta organizativa con el slug canonico: `src/content/blog/salud`.
5. Mueve el articulo a esa carpeta.
6. Corre `npm.cmd run build`.
7. Verifica que el build genere la pagina de categoria esperada, por ejemplo `/blog/salud`, y la pagina del articulo bajo esa categoria, por ejemplo `/blog/salud/que-es-el-imc-y-como-se-calcula`.

El slug no se calcula desde el label visible; se toma de `CATEGORIES`. Ejemplos:

| Categoria | URL de categoria |
|---|---|
| `Salud` | `/blog/salud` |
| `Legal e impuestos` | `/blog/legal-impuestos` |
| `Fecha y tiempo` | `/blog/fecha-tiempo` |

## Cuando si hay cambios de codigo

Aunque una categoria nueva del blog puede no tener calculadoras, siempre debe existir en la metadata compartida antes de publicar contenido.

### Si la categoria necesita calculadoras

Las categorias de calculadoras y blog comparten metadata en `src/lib/constants/categories.ts`. Las categorias de calculadoras se derivan de `src/lib/constants/calculators.ts` y se muestran en rutas como `/<slug>`.

Para que una categoria exista en el directorio de calculadoras:

1. Agrega o confirma la categoria en `src/lib/constants/categories.ts`.
2. Agrega una calculadora publicada en `src/lib/constants/calculators.ts` con `categorySlug: "<slug>"`.
3. Crea o confirma la pagina de la calculadora en `src/pages/<categoria>/<calculadora>.astro`.

Sin una calculadora publicada, la categoria de calculadoras no se genera aunque existan articulos del blog con ese slug.

### Si el articulo enlaza una calculadora relacionada

Si el frontmatter incluye:

```yaml
relatedCalculator:
  label: "Calculadora nueva"
  href: "/nueva-categoria/calculadora-nueva"
```

la ruta debe existir en `src/pages`. El blog no valida automaticamente que ese enlace exista.

### Si se requiere copy SEO personalizado por categoria

Actualmente las paginas de categoria del blog construyen titulo y descripcion de forma generica en `src/pages/blog/[category].astro` y en su paginacion.

Si una categoria nueva necesita texto SEO personalizado, se puede extender la metadata compartida con un campo especifico para blog y usarlo en esas paginas.

## Checklist antes de publicar

- El archivo esta en `src/content/blog/<slug-categoria>/`.
- El frontmatter cumple el schema.
- `categorySlug` usa un slug definido en `src/lib/constants/categories.ts`.
- El archivo no tiene `draft: true`, salvo que se quiera mantener oculto.
- `pubDate` es la fecha editorial desde la que el articulo puede publicarse.
- Los enlaces internos apuntan a articulos ya publicados o a rutas que existiran en el mismo despliegue.
- `relatedCalculator.href`, si existe, apunta a una ruta real.
- `npm.cmd run build` se ejecuta en la fecha de `pubDate` o despues y termina correctamente.
