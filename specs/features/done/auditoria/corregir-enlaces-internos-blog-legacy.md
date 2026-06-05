# Spec: corregir enlaces internos legacy del blog

## Contexto

El blog usa rutas canonicas por categoria:

```text
/blog/<categorySlug>/<articleSlug>
```

El helper actual `getBlogPostUrl(post)` en `src/lib/blog.ts` construye esas
rutas a partir de `categorySlug` y del slug del articulo.

Ejemplos canonicos:

- `/blog/salud/que-es-el-imc-y-como-se-calcula`
- `/blog/matematicas/regla-de-tres`
- `/blog/legal-impuestos/como-calcular-iva`
- `/blog/finanzas/cat-vs-tasa-interes`

Durante la auditoria se encontraron muchos enlaces Markdown que todavia usan la
ruta legacy de un solo segmento:

```text
/blog/<articleSlug>
```

Produccion cuenta con un archivo `.htaccess` con redirecciones 301 bien
mapeadas, por lo que estas URLs legacy no generan 404 en produccion. Aun asi,
los enlaces dentro del contenido publicado deben apuntar directamente a las
URLs canonicas para evitar saltos de redirect y mantener una arquitectura de
enlazado interno limpia.

## Problema

Los articulos publicados contienen enlaces internos que apuntan a URLs legacy.
Aunque esas URLs redirigen correctamente en produccion mediante `.htaccess`, no
son la forma canonica del proyecto.

Ejemplos observados:

- `src/content/blog/salud/tabla-peso-saludable-150-195.md` enlaza a
  `/blog/cuanto-debo-pesar-si-mido-150`.
- `src/content/blog/salud/formula-imc-excel-google-sheets.md` enlaza a
  `/blog/que-es-el-imc-y-como-se-calcula`.
- `src/content/blog/finanzas/cat-vs-tasa-interes.md` enlaza a
  `/blog/comision-apertura-prestamo`.
- `src/content/blog/legal-impuestos/tasas-de-iva-por-pais.md` enlaza a
  `/blog/iva-mexico`.

Esto afecta:

- Limpieza de enlazado interno.
- SEO tecnico, porque obliga a los rastreadores a seguir redirects internos
  evitables.
- Rendimiento percibido en navegacion interna por el salto adicional de 301.
- Autoridad interna entre clusters editoriales.
- Mantenibilidad, porque nuevos articulos pueden copiar el patron legacy.

## Objetivo

Reemplazar los enlaces internos legacy por URLs canonicas del blog, manteniendo
los redirects 301 existentes en `.htaccess` como proteccion para trafico externo
y enlaces antiguos.

Tambien se debe dejar una validacion que impida que el patron legacy vuelva a
aparecer en contenido publicado.

## Alcance

- Revisar todos los archivos bajo `src/content/blog`.
- Corregir enlaces Markdown de articulo que sigan el patron `/blog/<slug>`.
- Mantener sin cambios enlaces validos a:
  - `/blog`
  - `/blog/<categorySlug>`
  - `/blog/<categorySlug>/pagina/<page>`
  - `/blog/<categorySlug>/<articleSlug>`
- Agregar o actualizar una prueba/script que detecte enlaces internos de blog
  que no apunten a rutas canonicas.

## Fuera de alcance

- Cambiar slugs canonicos de articulos.
- Cambiar `categorySlug` del frontmatter.
- Cambiar el diseno visual del blog.
- Reescribir contenido editorial que no afecte URLs.
- Eliminar o reemplazar los redirects 301 existentes en `.htaccess`.
- Crear paginas Astro legacy, catch-all redirects, meta refresh o redirects
  client-side para este caso.
- Considerar estos enlaces como incidente de 404 en produccion, porque las
  redirecciones ya estan mapeadas.

## Cambios tecnicos esperados

1. Construir un mapa de articulos publicados:

   ```text
   articleSlug -> /blog/<categorySlug>/<articleSlug>
   ```

2. Buscar referencias legacy:

   ```powershell
   rg -n "\(/blog/[^/)#?]+\)" src/content/blog
   ```

3. Reemplazar cada enlace legacy con su URL canonica.

4. Cuando un slug no exista en el mapa de articulos publicados, clasificarlo:
   - Enlace legacy cubierto por `.htaccess`.
   - Error real de enlace.
   - Enlace a categoria.
   - Enlace pendiente a contenido no publicado.

5. Confirmar que la correccion no requiere tocar `.htaccess`, salvo que se
   descubra un slug legacy no mapeado.

6. Agregar validacion para enlaces internos del blog. Puede ser:
   - Un test unitario que lea Markdown y compare contra rutas generadas.
   - Un script de link-check interno.
   - Un test de build/link-check posterior.

## Criterios de aceptacion

- No quedan enlaces Markdown publicados con patron `/blog/<articleSlug>` cuando
  el articulo vive bajo `/blog/<categorySlug>/<articleSlug>`.
- Los enlaces a categorias del blog se mantienen como `/blog/<categorySlug>`.
- Los enlaces a articulos apuntan siempre a la URL canonica con categoria.
- Los redirects 301 existentes en `.htaccess` se mantienen para compatibilidad
  con trafico externo y URLs antiguas.
- La validacion automatizada falla si se agrega un nuevo enlace interno de
  articulo usando el patron legacy.
- `npm.cmd run test:unit:run` pasa sin errores.
- `npm.cmd run build` pasa sin errores.

## Pruebas manuales sugeridas

- Abrir articulos representativos de cada cluster:
  - Salud.
  - Matematicas.
  - Legal e impuestos.
  - Finanzas.
  - Inmuebles.
- Hacer click en enlaces internos y confirmar que llegan directamente a la URL
  canonica, sin depender de un redirect 301 intermedio.
- Probar una URL legacy en produccion o preview con redirects habilitados y
  confirmar que el `.htaccess` la sigue redirigiendo a su canonica.
- Revisar que los breadcrumbs y canonicals sigan usando la ruta con categoria.
