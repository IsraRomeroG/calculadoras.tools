# 12 - Shell, paginas legales y anuncios en ingles

## Objetivo

Completar la experiencia global EN: navegacion, footer, selector de idioma, paginas legales/informativas, errores y consentimiento/anuncios. Ninguna solicitud bajo `/en` debe mostrar shell mixto, servir anuncios no autorizados ni enlazar rutas no publicadas.

## Alcance

- `src/lib/constants/menu.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/shell.ts`
- `src/components/template/Navbar.astro`
- `src/components/template/Footer.astro`
- `src/components/ads/AdConsentBanner.astro`
- `src/components/ads/AdSlot.astro` y `src/lib/ads`
- Selector de idioma consumiendo alternates publicados.
- Estrategia de 404 localizada para solicitudes `/en/...`.
- Paginas estaticas EN bajo `src/pages/en`
- Tests de shell y links internos.

## Paginas EN recomendadas

Crear/publicar cuando haya copy revisado y aprobacion registrada:

```txt
/en/contact
/en/privacy
/en/about
/en/methodology
/en/editorial-policy
/en/corrections
```

Rutas ES actuales se conservan:

```txt
/contacto
/privacidad
/acerca-de
/metodologia
/politica-editorial
/correcciones
```

Agregar rutas EN nuevas no requiere redirects.

La presencia de un archivo o metadata candidata no equivale a publicacion. Las paginas estaticas publicadas deben formar parte de `PublishedRouteManifest`; si se usan archivos Astro estaticos, un check de build debe exigir paridad exacta entre archivo, estado y sitemap.

## Reglas de navbar

- Logo apunta a home del locale actual.
- Mostrar solo items con path publicado para el locale.
- `Blog` aparece en EN solo si `/en/blog` tiene posts publicados.
- `Contact` aparece en EN solo si `/en/contact` existe.
- Estado activo debe respetar prefijo `/en`.
- Labels y aria labels salen de `messages.ts`.

Navbar y menu deben referenciar `staticPageId`/surface, no duplicar paths como autoridad. El `href` se resuelve desde el manifest.

## Reglas de footer

- Mostrar solo links publicados para el locale.
- No enlazar desde footer EN a paginas ES por defecto.
- Si una pagina legal EN no existe, ocultar el link.
- `Ad preferences` solo aparece si el consentimiento esta habilitado para EN.
- Mantener footer ES sin cambios de rutas.

Footer y navbar consumen la misma disponibilidad publica; no basta con comprobar que un string de path exista en su configuracion.

## Selector de idioma

- Se renderiza desde las variantes publicadas de la pagina actual, excluyendo `x-default` como opcion duplicada.
- Nunca inventa una URL traducida ni redirige automaticamente por IP o `Accept-Language`.
- Si no existe equivalente, puede ocultarse o explicar el cambio a la home del otro idioma; no debe presentarlo como traduccion directa.
- Labels, nombre del idioma y aria labels estan localizados. Mostrar `Español` con su ortografia correcta.
- `BaseLayout` debe poder compartir los mismos alternates entre `<head>` y el selector visible.

## Politica de privacidad y anuncios

Separar estas capacidades:

```txt
hasPublishedPrivacyPage
hasApprovedPolicyVersion
shouldRequestConsent
canRenderAdSlot
canLoadAdProvider
```

El banner de anuncios EN solo puede renderizarse si:

- Existe `/en/privacy`.
- El texto del banner esta en ingles.
- El link del banner apunta a `/en/privacy`.
- Los botones estan localizados.
- La decision de consentimiento aplica a proveedores configurados.
- Existe aprobacion legal registrada para la version de politica y market/jurisdiccion aplicables.

Si no existe `/en/privacy`:

- No renderizar `AdConsentBanner` en EN.
- No mostrar `Ad preferences` en footer EN.
- No cargar anuncios de terceros en paginas EN.

La capacidad se resuelve centralmente, por ejemplo `canServeAds({ locale, market, policyVersion })`. No usar `Boolean(getPrivacyPath(locale))` como sinonimo de aprobacion y no depender de que cada pagina recuerde `locale === "es"`.

`AdSlot` debe recibir locale/contexto, negarse a montar el proveedor si la capacidad es false y localizar `aria-label` y el texto visible "Advertisement". Una preferencia guardada previamente en ES no puede saltarse los gates legales EN.

## Paginas legales: contenido minimo

Cada pagina EN debe tener:

- `locale="en"`.
- Canonical EN.
- Alternates con ES si existe equivalente publicada.
- Title y description EN.
- Breadcrumb EN.
- Contenido revisado por humano.
- Revision registrada con version/hash del contenido aprobado.
- Links internos EN o cambio de idioma claro.

Contenido minimo por pagina:

- Contact: canales de contacto y proposito.
- Privacy: datos, cookies, anuncios, consentimiento, derechos de usuario.
- About: que es el sitio y alcance de las herramientas.
- Methodology: como se construyen calculadoras y articulos.
- Editorial policy: autoria, fuentes, actualizaciones y revision.
- Corrections: como reportar errores y como se corrigen.

## Disclaimers

Los disclaimers por dominio deben existir en EN antes de publicar clusters sensibles:

- Salud: informacion orientativa, no reemplaza profesional medico.
- Finanzas: informacion educativa, no asesoria financiera.
- Legal/impuestos: informacion general, no asesoria legal/fiscal.

No usar el disclaimer ES en paginas EN.

Locale no determina market o jurisdiccion. Una pagina EN puede necesitar variantes o alcance explicitamente global; esa decision debe documentarse antes de activar clusters sensibles o anuncios.

## Pagina 404 EN

Definir como Apache servira contenido EN cuando una URL `/en/...` no exista. Crear un archivo EN no es suficiente si `ErrorDocument` siempre apunta al 404 ES. La solucion debe:

- Conservar status HTTP 404.
- Renderizar `lang` y shell EN.
- No incluir canonical/alternate inventado para la URL inexistente.
- Ofrecer links a `/en` y contenido EN publicado.
- Mantener el 404 ES actual para rutas sin prefijo.

## Tests recomendados

- Navbar EN no contiene links sin ruta EN publicada.
- Footer EN no contiene `/privacidad`, `/contacto`, `/acerca-de`, `/metodologia`, `/politica-editorial` ni `/correcciones`.
- Si `shouldRequestConsent(context)` es true, existe privacidad publicada/aprobada y proveedores cubiertos.
- Tener privacidad publicada no habilita por si solo anuncios; faltan aprobacion y contexto.
- `AdSlot` EN no monta proveedor cuando `canServeAds(...)` es false, incluso con consentimiento ES previo.
- Paginas legales EN tienen canonical EN.
- Paginas legales EN no tienen textos visibles ES en shell.
- Links internos no apuntan a rutas EN inexistentes.
- Selector de idioma solo usa alternates publicados.
- Solicitudes 404 bajo `/en` muestran shell EN y conservan status 404.

## Criterios de aceptacion

- Shell EN completo sin mezcla de idiomas.
- Footer EN solo muestra links publicados.
- Consentimiento EN esta localizado o deshabilitado.
- Paginas legales EN tienen SEO y alternates correctos.
- Ads EN dependen de una capacidad central auditable, no de checks ad hoc por pagina.
- Selector de idioma y estrategia 404 EN estan implementados.
- No se cambian rutas ES.
