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
2. Confirma que `category` coincide con la categoria publica deseada.
3. Mueve el archivo desde `src/content/pending/<grupo>/<fecha>/<archivo>.md` hacia `src/content/blog/<categoria-blog>/<archivo>.md`.
4. Si no existe la carpeta destino, creala.
5. Ejecuta `npm.cmd run build` para validar que el contenido compila.

Ejemplo:

```txt
src/content/pending/salud/2026-05-27/que-es-el-imc-y-como-se-calcula.md
src/content/blog/salud/que-es-el-imc-y-como-se-calcula.md
```

La carpeta destino debe representar la categoria publica del articulo. No necesariamente coincide con la carpeta editorial de `pending`. Por ejemplo, algunos articulos bajo `pending/prestamo` usan `category: "Finanzas"`, asi que su destino publicado debe ser `src/content/blog/finanzas`.

## Campos obligatorios del frontmatter

El schema de `src/content.config.ts` requiere estos campos:

```yaml
title: "Titulo del articulo"
description: "Descripcion breve para SEO y listados"
pubDate: 2026-05-27
category: "Nombre de categoria"
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

Las categorias de articulos no estan registradas en una constante manual. Se descubren automaticamente a partir del frontmatter de los articulos publicados.

El flujo esta en `src/lib/blog.ts`:

- `getPublishedBlogPosts()` obtiene los articulos de `src/content/blog` que no son borrador y cuya `pubDate` no es futura.
- `getBlogCategories(posts)` agrupa por `post.data.category`.
- `getCategorySlug(category)` convierte el nombre a slug.
- `getCategoryUrl(category)` genera `/blog/categoria/<slug>`.

Las paginas dinamicas del blog usan esa informacion para generar:

- `/blog`
- `/blog/pagina/<page>`
- `/blog/<slug-del-articulo>`
- `/blog/categoria/<slug-categoria>`
- `/blog/categoria/<slug-categoria>/pagina/<page>`

Por eso, para una categoria nueva de blog, el cambio minimo es publicar al menos un articulo con `category: "Nueva categoria"` dentro de `src/content/blog/<slug-categoria>/`.

## Crear una categoria nueva de articulos

Para una categoria nueva exclusivamente del blog, no hace falta tocar codigo.

Pasos:

1. Decide el nombre publico de la categoria, por ejemplo `Salud` o `Inmuebles`.
2. Usa ese nombre en el frontmatter: `category: "Salud"`.
3. Crea la carpeta organizativa con el slug normalizado: `src/content/blog/salud`.
4. Mueve el articulo a esa carpeta.
5. Corre `npm.cmd run build`.
6. Verifica que el build genere la pagina de categoria esperada, por ejemplo `/blog/categoria/salud`.

El slug se calcula automaticamente: minusculas, sin acentos y con guiones. Ejemplos:

| Categoria | URL de categoria |
|---|---|
| `Salud` | `/blog/categoria/salud` |
| `Legal e impuestos` | `/blog/categoria/legal-e-impuestos` |
| `Matematicas financieras` | `/blog/categoria/matematicas-financieras` |

## Cuando si hay cambios de codigo

Aunque una categoria nueva del blog se crea solo con contenido, puede haber cambios adicionales si la categoria tambien debe existir en otras partes del sitio.

### Si la categoria necesita calculadoras

Las categorias de calculadoras son independientes del blog. Se derivan de `src/lib/constants/calculators.ts` y se muestran en rutas como `/categoria/<slug>`.

Para que una categoria exista en el directorio de calculadoras:

1. Agrega una calculadora publicada en `src/lib/constants/calculators.ts` con `category: "Nueva categoria"`.
2. Si quieres una descripcion especifica para la pagina `/categoria/<slug>`, agrega una entrada en `calculatorCategoryDescriptions` dentro de `src/lib/calculator-directory.ts`.
3. Crea o confirma la pagina de la calculadora en `src/pages/<categoria>/<calculadora>.astro`.

Sin una calculadora publicada, la categoria de calculadoras no se genera aunque existan articulos del blog con ese nombre.

### Si el articulo enlaza una calculadora relacionada

Si el frontmatter incluye:

```yaml
relatedCalculator:
  label: "Calculadora nueva"
  href: "/nueva-categoria/calculadora-nueva"
```

la ruta debe existir en `src/pages`. El blog no valida automaticamente que ese enlace exista.

### Si se requiere copy SEO personalizado por categoria

Actualmente las paginas de categoria del blog construyen titulo y descripcion de forma generica en `src/pages/blog/categoria/[category].astro` y en su paginacion.

Si una categoria nueva necesita texto SEO personalizado, habria que introducir una fuente de metadatos para categorias del blog y usarla en esas paginas. Ese patron no existe todavia.

## Checklist antes de publicar

- El archivo esta en `src/content/blog/<categoria>/`.
- El frontmatter cumple el schema.
- `category` usa el nombre publico correcto y consistente.
- El archivo no tiene `draft: true`, salvo que se quiera mantener oculto.
- `pubDate` es la fecha editorial desde la que el articulo puede publicarse.
- Los enlaces internos apuntan a articulos ya publicados o a rutas que existiran en el mismo despliegue.
- `relatedCalculator.href`, si existe, apunta a una ruta real.
- `npm.cmd run build` se ejecuta en la fecha de `pubDate` o despues y termina correctamente.
