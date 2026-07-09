# 13 - SEO, QA y release incremental

## Objetivo

Definir validaciones tecnicas, revision manual y proceso de release para publicar i18n EN por lotes sin romper rutas existentes ni indexar contenido incompleto.

## Alcance

- Canonicals.
- `hreflang`.
- Sitemap.
- Links internos.
- Rutas Astro.
- Directorio de calculadoras.
- Blog.
- Shell global.
- QA visual y funcional.
- Checklist de release.

## Validaciones automaticas

Ejecutar como validacion principal:

```powershell
npm.cmd run test:unit:run
```

No ejecutar salvo pedido explicito:

```powershell
npm run dev
npm run build
```

## Tests i18n esperados

Mantener o agregar tests para:

- `messages.es` y `messages.en` tienen las mismas keys.
- `getLocaleFromPathname` detecta ES/EN.
- `buildCanonicalUrl` elimina search, hash y trailing slash.
- `buildAlternateLinks` no inventa locales.
- Slugs de categorias son unicos por locale.
- Slugs de calculadoras son unicos por categoria/locale.
- No hay links EN a rutas no publicadas.
- No hay trailing slash en links internos.
- Blog EN excluye drafts y fechas futuras.
- Sitemap incluye solo rutas publicadas.
- Footer EN no enlaza paginas legales ES.
- Calculadoras EN publicadas tienen wrapper Astro.

## Checklist por ruta

Para cada ruta EN nueva:

```txt
[ ] Renderiza con locale="en"
[ ] html lang correcto
[ ] canonical absoluto correcto
[ ] hreflang correcto
[ ] title EN
[ ] meta description EN
[ ] H1 EN
[ ] breadcrumbs EN
[ ] CTAs EN
[ ] errores/estados vacios EN
[ ] JSON-LD EN
[ ] links internos EN
[ ] no trailing slash
[ ] aparece en sitemap si corresponde
[ ] no aparece si esta en draft
```

## QA funcional de calculadoras

Para cada calculadora migrada:

```txt
[ ] Inputs aceptan ejemplos esperados
[ ] Validaciones muestran mensajes EN
[ ] Resultado numerico coincide con ES para los mismos valores
[ ] Formato visual EN es correcto
[ ] Boton copiar funciona y copia texto EN
[ ] Historial/localStorage no mezcla idiomas
[ ] Export CSV/text usa headers EN
[ ] FAQs y JSON-LD usan contenido EN
[ ] Related guides no apuntan a ES
[ ] Mobile no rompe layout por textos mas largos
```

## QA de blog

Para cada post EN:

```txt
[ ] Frontmatter completo
[ ] Slug revisado
[ ] categoryId estable
[ ] translationKey si hay equivalente ES
[ ] Fuentes revisadas
[ ] Links internos EN
[ ] Related calculator EN
[ ] No links rotos
[ ] No canonical cruzado a ES
[ ] hreflang solo a equivalentes publicados
```

## QA de shell

Revisar en:

```txt
/en
/en/math
/en/math/percentage-calculator
/en/blog
/en/contact
/en/privacy
```

segun existan.

Checklist:

```txt
[ ] Navbar sin rutas no publicadas
[ ] Footer sin rutas ES no autorizadas
[ ] Banner de anuncios localizado o ausente
[ ] Links legales EN correctos
[ ] Selector de idioma solo apunta a alternates publicados
```

## Release incremental

Publicar por lotes pequenos:

1. Categoria + una calculadora.
2. Guias relacionadas.
3. Links desde home/categoria/blog.
4. Shell/legal si aplica.

No publicar un lote si introduce:

- Ruta EN huerfana.
- Link EN roto.
- Alternate hacia draft.
- Metadata publicada sin pagina.
- Pagina publicada sin metadata.

## Monitoreo post-release

Despues de publicar:

- Revisar 404.
- Revisar sitemap generado.
- Revisar indexacion en Search Console.
- Revisar paginas con canonical inesperado.
- Revisar errores de datos estructurados.
- Revisar busquedas internas si aplica.

## Rollback

Si una ruta EN sale mal:

1. Quitar `published: true` en metadata EN.
2. Ocultar links internos EN.
3. Mantener ruta si ya fue indexada solo si puede corregirse rapido.
4. Si se remueve una ruta EN ya publicada externamente, decidir si requiere 301 hacia alternativa relevante.

No tocar rutas ES para resolver un problema EN salvo que el bug este compartido.

## Criterios de aceptacion

- Los tests unitarios pasan.
- Las rutas ES actuales no cambian.
- El lote EN no publica contenido incompleto.
- Sitemap, canonical y alternates son coherentes.
- QA manual no detecta UI mixta.
