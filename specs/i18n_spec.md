# Spec tecnica: internacionalizacion

Esta spec es el indice tecnico de la implementacion i18n. El detalle operativo vive en specs pequenas bajo `specs/i18n/`.

## Contexto actual

El proyecto usa Astro con generacion estatica. Las calculadoras viven como paginas `.astro` bajo `src/pages/<categoria>/<slug>.astro`, el blog usa colecciones Markdown en `src/content/blog`, y el directorio de calculadoras se alimenta desde `src/lib/constants/calculators.ts`.

Hoy el sitio asume espanol en varios puntos:

- `BaseLayout.astro` fija `<html lang="es-MX">`.
- `Navbar.astro`, `Footer.astro`, `AdConsentBanner.astro`, home, blog y paginas de calculadora tienen textos hardcodeados.
- `src/lib/constants/categories.ts` y `src/lib/constants/calculators.ts` mezclan identidad, textos y URLs en espanol.
- Varias calculadoras usan `Intl.NumberFormat("es-MX")` o `Intl.DateTimeFormat("es-MX")`.
- El sitemap y los tests de rutas asumen rutas canonicas en espanol.

La implementacion debe introducir i18n sin mover las rutas espanolas existentes.

## Specs divididas

1. [Core SEO y routing](./i18n/01-core-seo-routing.md)
2. [Directorio localizado](./i18n/02-localized-directory.md)
3. [Shell localizado](./i18n/03-localized-shell.md)
4. [Piloto home y categoria](./i18n/04-home-category-pilot.md)
5. [Piloto calculadora de porcentajes](./i18n/05-percentage-calculator-pilot.md)
6. [Sitemap, links y validacion](./i18n/06-sitemap-links-validation.md)
7. [Arquitectura futura del blog](./i18n/07-blog-future-architecture.md)

## Decisiones no negociables

- `es` sigue en la raiz y no se duplica bajo `/es` en fase 1.
- `en` usa `/en`.
- No hay redirects nuevos en fase 1 porque no se mueve ninguna URL existente.
- Si una fase futura mueve rutas publicas, se debe entregar mapa old -> new y reglas Apache `.htaccess` 301.
- No se crean paginas Astro legacy para redirigir.
- No se redirige automaticamente por IP ni por `Accept-Language`.
- Una URL sin prefijo se interpreta como `es`.
- `x-default` apunta a la version espanola publicada cuando existe.
- No se enlaza desde `/en` a contenido no traducido, salvo alternates o selector explicito de idioma.
- No se mezclan idioma, region, moneda, unidades ni reglas regulatorias.

## Modelo global

La implementacion debe usar:

- `Locale`: idioma de contenido y UI, por ejemplo `es` o `en`.
- `htmlLang`: valor para `<html lang>`, por ejemplo `es-MX` o `en`.
- `formatLocale`: locale de formato numerico/fecha, por ejemplo `es-MX` o `en-US`.
- `urlPrefix`: prefijo de URL, por ejemplo `""` o `"/en"`.
- `defaultCurrency`: moneda visual por defecto solo cuando una herramienta realmente necesita moneda.

`Locale` no debe usarse como sustituto de pais o region. Las futuras calculadoras de impuestos, salud, finanzas, moneda y unidades deben declarar reglas regionales por separado.

## Compatibilidad

El refactor debe conservar compatibilidad con el codigo existente en espanol:

- Los slugs canonicos actuales siguen siendo los IDs o aliases de compatibilidad para `es`.
- Helpers existentes como `getCategory`, `getCategoryBySlugOrLegacySlug` y `getPublishedCalculators` deben seguir funcionando con default `es`.
- Las rutas espanolas actuales no cambian.
- Los tests actuales de slugs legacy y rutas sin trailing slash deben seguir pasando.

## Validacion

Cada spec pequena incluye sus criterios de aceptacion. La validacion agregada de fase 1 debe terminar con:

```powershell
npm.cmd run test:unit:run
```

No ejecutar `npm run dev` ni `npm run build` salvo que se pida explicitamente.
