# 12 - Shell, paginas legales y anuncios en ingles

## Objetivo

Completar la experiencia global EN: navegacion, footer, paginas legales/informativas y consentimiento de anuncios. Ninguna pagina `/en` debe mostrar shell mixto ni enlaces a rutas no publicadas.

## Alcance

- `src/lib/constants/menu.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/shell.ts`
- `src/components/template/Navbar.astro`
- `src/components/template/Footer.astro`
- `src/components/ads/AdConsentBanner.astro`
- Paginas estaticas EN bajo `src/pages/en`
- Tests de shell y links internos.

## Paginas EN recomendadas

Crear cuando haya copy revisado:

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

## Reglas de navbar

- Logo apunta a home del locale actual.
- Mostrar solo items con path publicado para el locale.
- `Blog` aparece en EN solo si `/en/blog` tiene posts publicados.
- `Contact` aparece en EN solo si `/en/contact` existe.
- Estado activo debe respetar prefijo `/en`.
- Labels y aria labels salen de `messages.ts`.

## Reglas de footer

- Mostrar solo links publicados para el locale.
- No enlazar desde footer EN a paginas ES por defecto.
- Si una pagina legal EN no existe, ocultar el link.
- `Ad preferences` solo aparece si el consentimiento esta habilitado para EN.
- Mantener footer ES sin cambios de rutas.

## Politica de privacidad y anuncios

El banner de anuncios EN solo puede renderizarse si:

- Existe `/en/privacy`.
- El texto del banner esta en ingles.
- El link del banner apunta a `/en/privacy`.
- Los botones estan localizados.
- La decision de consentimiento aplica a proveedores configurados.

Si no existe `/en/privacy`:

- No renderizar `AdConsentBanner` en EN.
- No mostrar `Ad preferences` en footer EN.
- No cargar anuncios de terceros en paginas EN.

## Paginas legales: contenido minimo

Cada pagina EN debe tener:

- `locale="en"`.
- Canonical EN.
- Alternates con ES si existe equivalente publicada.
- Title y description EN.
- Breadcrumb EN.
- Contenido revisado por humano.
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

## Tests recomendados

- Navbar EN no contiene links sin ruta EN publicada.
- Footer EN no contiene `/privacidad`, `/contacto`, `/acerca-de`, `/metodologia`, `/politica-editorial` ni `/correcciones`.
- Si `isAdConsentEnabled("en")` es true, `getPrivacyPath("en")` no es null.
- Paginas legales EN tienen canonical EN.
- Paginas legales EN no tienen textos visibles ES en shell.
- Links internos no apuntan a rutas EN inexistentes.

## Criterios de aceptacion

- Shell EN completo sin mezcla de idiomas.
- Footer EN solo muestra links publicados.
- Consentimiento EN esta localizado o deshabilitado.
- Paginas legales EN tienen SEO y alternates correctos.
- No se cambian rutas ES.
