# 08 - Inventario y modelo de publicacion i18n

## Objetivo

Crear una vista confiable y revisable del estado i18n sin introducir una fuente de verdad manual adicional. El inventario debe generarse desde fuentes tipadas y explicar que falta para publicar cada entidad, mientras un resolver comun determina exactamente que rutas pueden existir publicamente.

## Principio de arquitectura

No crear una matriz Markdown que gobierne el runtime. Cada dato tiene un unico propietario:

- Identidad y metadata localizada: registros de categorias, calculadoras y paginas estaticas.
- Contenido y workflow editorial del blog: content collection y frontmatter validado.
- Revisiones, blockers y dependencias de release: manifest tipado.
- Rutas publicas: valor derivado por helpers y resolver de publicacion.

El flujo esperado es:

```txt
registros de dominio + contenido + workflow
                    |
                    v
          publication resolver
                    |
                    v
        PublishedRouteManifest
          |       |       |
          v       v       v
       rutas   sitemap   links/alternates
                    |
                    v
        reporte de inventario generado
```

`specs/i18n/status-matrix.md` puede existir como reporte generado, pero nunca debe editarse como autoridad paralela.

## Alcance

- Categorias de calculadoras y sus superficies de directorio/blog.
- Calculadoras publicadas en espanol y localizaciones EN.
- Rutas EN existentes o candidatas.
- Articulos del blog ES y EN.
- Paginas informativas, legales y de error.
- Links globales de navbar/footer y selector de idioma.
- Estado de anuncios, consentimiento y aprobacion de politicas por locale/market.
- Clusters o releases editoriales y sus dependencias.

No incluye traducir contenido.

## Fuentes que se deben inspeccionar

- `src/lib/constants/categories.ts`
- `src/lib/constants/calculators.ts`
- `src/lib/calculator-directory.ts`
- `src/lib/i18n`
- `src/content.config.ts`
- `src/lib/blog-schema.ts`
- `src/lib/blog.ts`
- `src/lib/blog-publication.ts`
- `src/lib/blog-sitemap.mjs`
- `src/content/blog`
- `src/pages` y `src/pages/en`
- `src/lib/constants/menu.ts`
- `src/lib/i18n/shell.ts`
- `src/layouts/BaseLayout.astro`
- Componentes compartidos de calculadoras y blog.
- `src/components/ads`, `src/lib/ads` y configuracion del proveedor.
- `astro.config.mjs`, `.htaccess` y tests de rutas/SEO.

## Identidad, locale y superficie

Cada fila logica del inventario se identifica por:

```txt
entityType
entityId
locale
surface
```

`surface` evita mezclar rutas distintas de una misma entidad. Ejemplos:

- `categoryDirectory`: `/en/math`
- `blogCategory`: `/en/blog/math`
- `calculatorPage`
- `blogPost`
- `staticPage`
- `shellLink`
- `errorPage`
- `adCapability`

Agregar un locale nuevo no debe exigir columnas nuevas como `french_path`. Las rutas se derivan desde `entityId`, locale, superficie y slugs localizados.

## Modelo de workflow

Separar conceptos que no pertenecen al mismo estado lineal:

```txt
workflowStatus:
  not_started
  translating
  ready_for_review
  in_review
  approved

releaseStatus (derivado):
  hidden
  publishable
  published

blockers:
  lista independiente con codigo, razon y owner

reviews:
  tipo, revisor, fecha, version/hash revisado y resultado
```

Los tipos de revision pueden incluir `language`, `seo`, `subject_matter`, `legal`, `ads` y `qa`. Un cambio en los archivos revisados invalida la aprobacion correspondiente.

No usar `published` si falta cualquier gate obligatorio para el tipo de entidad. Los gates no son iguales para un post, una calculadora, una categoria o una pagina legal.

## Resolver de publicacion

El resolver produce `PublishedRouteManifest` y debe aplicar estas reglas:

- Metadata localizada permite construir un path candidato, pero no prueba que la ruta exista.
- Una calculadora EN requiere categoria localizada, contenido completo, componente/ruta emitible, revisiones y tests.
- La superficie `categoryDirectory` existe si tiene al menos una calculadora publicada.
- La superficie `blogCategory` existe si tiene al menos un post publicado.
- Un root fijo como `/en/blog` no puede publicarse vacio.
- Una pagina legal requiere copy aprobado; la mera presencia de un archivo no equivale a aprobacion.
- Una ruta hidden/draft no puede responder 200 en el artefacto de produccion.
- Alternates, sitemap, navbar, footer y relaciones solo consumen rutas del manifest publicado.

No existe dependencia circular entre categoria y primera calculadora: la calculadora requiere metadata localizada de categoria; la ruta de categoria se deriva al publicar la primera calculadora.

## Relaciones y dependencias

Usar IDs, no URLs o flags duplicados:

```txt
calculatorId
categoryId
postId o translationGroupId
staticPageId
clusterId
```

El resolver transforma esos IDs en `href` solo cuando el destino esta publicado en el mismo locale. `dependsOn` debe ser una lista tipada, validada contra IDs existentes y sin ciclos.

## Clusters y releases

Un cluster es un agregado, no un estado escrito manualmente. Debe declarar:

```txt
id
locale
categoryId
calculatorIds
requiredPostIds
optionalPostIds
requiredReviewTypes
```

Su estado se calcula desde sus miembros. Una release de calculadora puede no requerir posts si no los enlaza y la decision editorial lo permite; en ese caso no se debe llamar cluster editorial completo.

## Politicas y anuncios

Modelar por separado:

- Pagina de privacidad publicada.
- Aprobacion legal y version de politica.
- Market/jurisdiccion aplicable.
- Proveedores cubiertos.
- Consentimiento habilitado.
- Capacidad de servir anuncios.

`Boolean(getPrivacyPath(locale))` no es suficiente para representar aprobacion. El inventario debe exponer por que `canServeAds(...)` devuelve true o false.

## Inventario inicial esperado

Snapshot a confirmar desde codigo, no verdad durable:

- Home EN: publicada.
- Categoria Math de calculadoras: publicada.
- Percentage calculator: publicada.
- Blog EN Math: tres posts publicados en el snapshot inicial.
- Resto de calculadoras: no iniciadas o no publicadas en EN.
- Paginas legales EN: no publicadas.
- Footer legal y anuncios EN: deshabilitados.

El reporte generado debe incluir fecha y revision/commit de origen.

## Checks automaticos obligatorios

- Paridad exacta entre rutas EN emitidas y `PublishedRouteManifest`.
- Ninguna ruta hidden/draft responde 200 ni aparece en sitemap, canonical, alternates o links.
- Metadata EN publicada tiene componente/ruta y viceversa.
- Categorias de directorio/blog solo existen con contenido publicado de su superficie.
- Links y alternates resuelven destinos publicados; los alternates son reciprocos.
- No existen dependencias colgantes o ciclos.
- IDs y slugs son unicos en su namespace.
- No existen fallbacks silenciosos ES durante render EN.
- Posts localizados cumplen schema, locale, categoria, slug y equivalencia declarada.
- Relaciones a calculadoras/posts usan IDs validos y no `href` duplicado.
- Shell, paginas legales y ads cumplen sus capacidades y revisiones.
- JSON-LD, scripts cliente, aria labels, estados live y textos no visibles estan localizados.
- Las aprobaciones corresponden a la version actual de sus archivos.

Los checks no deben depender de listas manuales de rutas piloto o denylist de tres paths.

## Criterios de aceptacion

- Existe una fuente tipada para workflow/dependencias y un manifest derivado de rutas publicas.
- El inventario se genera de forma determinista y no duplica paths manualmente.
- Existe exactamente una entrada por `entityId + locale + surface`.
- Cada estado explica gates cumplidos, revisiones y blockers pendientes.
- Toda ruta EN emitida corresponde a una release publicada y viceversa.
- Navbar, footer, sitemap, alternates y validacion de enlaces consumen el mismo manifest.
- Agregar un locale nuevo no requiere cambiar el schema del inventario.
