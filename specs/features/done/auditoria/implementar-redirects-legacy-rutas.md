# Spec: implementar redirects legacy de rutas

## Contexto

Varias specs marcadas como completadas documentan cambios de rutas canonicas:

- Categorias de calculadoras pasaron de `/categoria/<slug>` a `/<slug>`.
- Categorias del blog pasaron de `/blog/categoria/<slug>` a `/blog/<slug>`.
- Articulos del blog pasaron de `/blog/<articleSlug>` a
  `/blog/<categorySlug>/<articleSlug>`.

Durante la auditoria no se encontro una implementacion visible de redirects en
el repo:

- No se encontro `.htaccess`.
- No se encontro `vercel.json`.
- No se encontro `netlify.toml`.
- No se encontro pagina Astro catch-all legacy en `src/pages/blog`.

## Problema

Si produccion no tiene redirects externos configurados, las URLs legacy pueden
responder 404.

Esto afecta:

- Trafico organico antiguo.
- Enlaces externos.
- Enlaces internos que aun no hayan sido corregidos.
- Transferencia SEO desde rutas antiguas hacia rutas canonicas.

## Objetivo

Implementar redirects 301 para las rutas legacy relevantes sin crear paginas
duplicadas activas dentro de `src/pages`.

## Alcance

Cubrir al menos estas familias de rutas:

### Categorias de calculadoras

```text
/categoria/fecha-tiempo -> /fecha-tiempo
/categoria/finanzas -> /finanzas
/categoria/inmuebles -> /inmuebles
/categoria/legal-impuestos -> /legal-impuestos
/categoria/matematicas -> /matematicas
/categoria/salud -> /salud
/categoria/legal-e-impuestos -> /legal-impuestos
/categoria/fecha-y-tiempo -> /fecha-tiempo
```

### Categorias del blog

```text
/blog/categoria/<categorySlug> -> /blog/<categorySlug>
/blog/categoria/<categorySlug>/pagina/<page> -> /blog/<categorySlug>/pagina/<page>
```

### Articulos legacy del blog

```text
/blog/<articleSlug> -> /blog/<categorySlug>/<articleSlug>
```

## Fuera de alcance

- Cambiar rutas canonicas actuales.
- Mantener paginas legacy Astro duplicadas.
- Usar meta refresh o redirects client-side como solucion principal.

## Estrategia recomendada

Si el hosting soporta Apache rules, agregar `.htaccess` con `RewriteRule` o
`Redirect 301`.

Si el hosting usa otra plataforma, implementar el equivalente de redirects 301
en su archivo de configuracion o panel de produccion, y documentarlo en el repo.

Para articulos legacy del blog, generar la lista desde los Markdown publicados:

```text
src/content/blog/<categorySlug>/<articleSlug>.md
```

Cada archivo publicado debe producir un redirect:

```text
/blog/<articleSlug> -> /blog/<categorySlug>/<articleSlug>
```

## Criterios de aceptacion

- Las rutas legacy de categorias de calculadoras redirigen con 301 a la ruta
  canonica.
- Las rutas legacy de categorias del blog redirigen con 301 a la ruta canonica.
- Las rutas legacy de articulos del blog redirigen con 301 a la ruta canonica
  con categoria.
- No se agregan paginas Astro legacy duplicadas para resolver este problema.
- El sitemap sigue incluyendo solo rutas canonicas.
- `npm.cmd run build` pasa sin errores.

## Pruebas manuales sugeridas

Probar estas URLs en entorno local/preview o produccion segun donde vivan los
redirects:

- `/categoria/legal-impuestos`
- `/categoria/legal-e-impuestos`
- `/blog/categoria/salud`
- `/blog/categoria/salud/pagina/2`
- `/blog/que-es-el-imc-y-como-se-calcula`
- `/blog/como-calcular-iva`

Cada una debe responder con redirect 301 hacia su URL canonica.

