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

La restriccion anterior aplica al trabajo local del agente. No es un criterio de release. El pipeline de CI/deploy debe obligatoriamente:

1. Ejecutar tests unitarios.
2. Compilar el sitio.
3. Obtener el conjunto de rutas/HTML emitidos.
4. Compararlo con `PublishedRouteManifest`.
5. Hacer crawl de links, canonical, alternates y sitemap del artefacto.

Vitest en Node no compila ni renderiza por si solo los `.astro`; una suite verde no sustituye estos gates.

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
- Calculadoras EN publicadas tienen componente registrado y ruta Astro emitida; las no publicadas no la emiten.
- Paridad exacta entre rutas emitidas y `PublishedRouteManifest`.
- Ninguna entidad hidden/draft genera una respuesta 200.
- Alternates solo apuntan a rutas publicadas y son reciprocos.
- Sitemap contiene solo canonicals 200, no redirects ni rutas no publicadas.
- Links internos resuelven exactamente contra el manifest, no contra una denylist manual.
- Serializacion de JSON/JSON-LD neutraliza `</script>` y conserva round-trip.
- Slugs cumplen regex y no colisionan por ruta completa/namespace.
- Reglas `.htaccess` no crean duplicados ni cadenas de redirects.
- No hay fallback silencioso ES en render EN.

## Checklist por ruta

Para cada ruta EN nueva:

```txt
[ ] Renderiza con locale="en"
[ ] html lang correcto
[ ] canonical absoluto correcto
[ ] hreflang correcto
[ ] hreflang reciproco y solo a rutas publicadas
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
[ ] pertenece al PublishedRouteManifest
[ ] no da 200 cuando no esta publicada
[ ] JSON embebido usa serializacion segura
```

## QA funcional de calculadoras

Para cada calculadora migrada:

```txt
[ ] Inputs aceptan ejemplos esperados
[ ] Validaciones muestran mensajes EN
[ ] Resultado numerico coincide con ES para los mismos valores
[ ] Formato visual EN es correcto
[ ] Parsing de separadores ambiguos sigue la politica declarada
[ ] Boton copiar funciona y copia texto EN
[ ] Historial/localStorage no mezcla idiomas
[ ] Export CSV/text usa headers EN
[ ] FAQs y JSON-LD usan contenido EN
[ ] Related guides no apuntan a ES
[ ] Mobile no rompe layout por textos mas largos
[ ] aria-label, sr-only, live regions y mensajes no visibles estan en EN
[ ] AdSlot/proveedor se omite si canServeAds(...) es false
```

## QA de blog

Para cada post EN:

```txt
[ ] Frontmatter completo
[ ] Slug revisado
[ ] categoryId estable
[ ] translationGroupId y translationKind si hay equivalente ES
[ ] Fuentes revisadas
[ ] Links internos EN
[ ] Related calculator EN
[ ] No links rotos
[ ] No canonical cruzado a ES
[ ] hreflang solo a equivalentes publicados
[ ] JSON-LD incluye inLanguage
[ ] relatedCalculatorId resuelve una calculadora EN publicada
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
[ ] 404 bajo /en conserva status 404 y usa shell EN
[ ] Consentimiento y AdSlot respetan capacidades centrales
```

## Release incremental

Implementar por lotes pequenos, pero desplegar cada release de forma atomica:

1. Preparar categoria, calculadora y contenido en estado no publicado.
2. Completar guias requeridas y relaciones por ID.
3. Completar shell/legal/ads si son dependencias.
4. Ejecutar revisiones y gates sobre el artefacto.
5. Activar publicacion como ultimo cambio junto con home/categoria/blog, alternates y sitemap.

No publicar un lote si introduce:

- Ruta EN huerfana.
- Link EN roto.
- Alternate hacia draft.
- Metadata publicada sin pagina.
- Pagina publicada sin metadata.
- Ruta emitida que no pertenece al manifest.
- Release parcialmente activada entre despliegues.

## Monitoreo post-release

Despues de publicar:

- Revisar 404.
- Revisar sitemap generado.
- Revisar indexacion en Search Console.
- Revisar paginas con canonical inesperado.
- Revisar errores de datos estructurados.
- Revisar busquedas internas si aplica.

Definir owner, ventana de observacion y umbrales para 404, errores de datos estructurados, canonicals inesperados e indexacion. Registrar `firstPublishedAt` para distinguir rutas experimentales de URLs publicas que ya requieren preservacion.

## Rollback

Si una ruta EN sale mal:

1. Preferir redeploy del ultimo artefacto bueno o fix-forward inmediato.
2. No asumir que quitar `published: true` despublica un wrapper Astro estatico; verificar ruta emitida y sitemap.
3. Si se desactiva desde un router dinamico, comprobar que deja de responder 200 y retirar links/alternates/sitemap en la misma release.
4. Si la URL ya fue publica, mantener la ultima version correcta cuando sea posible.
5. Si debe removerse, decidir explicitamente entre 301 a alternativa realmente equivalente o respuesta 404/410; no redirigir todo a home.
6. Registrar cualquier old -> new de cualquier locale en `.htaccess`, remover route files legacy y evitar cadenas.

No tocar rutas ES para resolver un problema EN salvo que el bug este compartido.

## Criterios de aceptacion

- Los tests unitarios pasan.
- Las rutas ES actuales no cambian.
- El lote EN no publica contenido incompleto.
- Sitemap, canonical y alternates son coherentes.
- QA manual no detecta UI mixta.
- CI compila y valida el HTML/rutas emitidas contra el manifest.
- El flip a publicado fue el ultimo paso de una release atomica.
- Existe procedimiento de rollback que actua sobre el artefacto real, no solo sobre metadata.
