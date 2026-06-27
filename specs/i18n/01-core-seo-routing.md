# 01 - Core SEO y routing i18n

## Objetivo

Crear la base i18n compartida para detectar locales, construir rutas localizadas, renderizar SEO correcto y servir textos comunes sin publicar contenido incompleto.

## Alcance

- `src/lib/i18n/config.ts`
- `src/lib/i18n/routing.ts`
- `src/lib/i18n/messages.ts`
- `src/layouts/BaseLayout.astro`
- Tests unitarios de helpers i18n

No incluye refactor del directorio, shell completo, home inglesa ni calculadoras.

## Configuracion de locales

Crear `src/lib/i18n/config.ts`.

```ts
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface LocaleConfig {
  locale: Locale;
  htmlLang: string;
  formatLocale: string;
  urlPrefix: "" | "/en";
  label: string;
  defaultCurrency?: string;
}

export const DEFAULT_LOCALE = "es" satisfies Locale;

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  es: {
    locale: "es",
    htmlLang: "es-MX",
    formatLocale: "es-MX",
    urlPrefix: "",
    label: "Espanol",
    defaultCurrency: "MXN",
  },
  en: {
    locale: "en",
    htmlLang: "en",
    formatLocale: "en-US",
    urlPrefix: "/en",
    label: "English",
    defaultCurrency: "USD",
  },
};
```

Reglas:

- `Locale` significa idioma de UI/contenido, no pais.
- `formatLocale` controla separadores, fechas y formato visual.
- `defaultCurrency` es una ayuda visual, no una regla financiera o fiscal.
- `es` no lleva prefijo.
- `en` siempre lleva `/en`.
- No inferir locale desde IP.
- No redirigir por `Accept-Language`.
- Una URL sin prefijo siempre se interpreta como `es`.

## Helpers de rutas

Crear `src/lib/i18n/routing.ts`.

Responsabilidades:

- Normalizar path sin trailing slash, excepto `/`.
- Detectar locale desde `Astro.url.pathname`.
- Construir paths con prefijo de locale.
- Construir canonicals absolutos usando `Astro.site`.
- Construir alternates para `hreflang`.

API esperada:

```ts
export interface AlternateLink {
  locale: Locale | "x-default";
  hreflang: string;
  href: string;
}

export function normalizePath(path: string): string;
export function getLocaleFromPathname(pathname: string): Locale;
export function prefixLocalePath(locale: Locale, path: string): string;
export function buildCanonicalUrl(path: string, site: URL | string): string;
export function buildAlternateLinks(
  pathsByLocale: Partial<Record<Locale, string>>,
  site: URL | string,
): AlternateLink[];
```

Reglas de `buildAlternateLinks`:

- Incluir solo locales con ruta publicada.
- Usar `LOCALE_CONFIG[locale].htmlLang` como `hreflang`.
- Agregar `x-default` apuntando a la ruta `es` cuando exista.
- No inventar alternates para traducciones en `draft`.
- Normalizar todas las URLs sin trailing slash.

## Diccionarios compartidos

Crear `src/lib/i18n/messages.ts`.

Usar diccionarios tipados para UI compartida. Empezar con keys necesarias para fase 1:

- `site.brandName`
- `nav.home`
- `nav.blog`
- `nav.contact`
- `footer.tagline`
- `footer.rights`
- `footer.privacy`
- `footer.contact`
- `footer.about`
- `footer.methodology`
- `footer.editorialPolicy`
- `footer.corrections`
- `footer.adPreferences`
- `breadcrumbs.home`
- `common.use`
- `common.readArticle`
- `common.search`
- `common.calculators`
- `common.categories`
- `common.result`
- `common.results`
- `home.title`
- `home.description`
- `home.heroTitle`
- `home.heroAccent`
- `home.heroDescription`
- `home.searchLabel`
- `home.searchPlaceholder`
- `home.viewAll`
- `home.availableCalculators`
- `home.selectTool`
- `home.resultsFor`
- `adConsent.title`
- `adConsent.body`
- `adConsent.privacyLink`
- `adConsent.accept`
- `adConsent.reject`

API:

```ts
type MessageKey = keyof typeof messages.es;

export function t(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string;
```

Reglas:

- Si falta una key en un locale, fallar en test.
- Las interpolaciones usan `{name}`.
- No usar diccionarios para contenido editorial largo; ese contenido vive en metadata o Markdown localizado.

## BaseLayout

Actualizar `src/layouts/BaseLayout.astro`.

Props:

```ts
interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  locale?: Locale;
  alternates?: AlternateLink[];
}
```

Comportamiento:

- `locale` default: `getLocaleFromPathname(Astro.url.pathname)`.
- `<html lang={LOCALE_CONFIG[locale].htmlLang}>`.
- Canonical absoluto sin trailing slash.
- Renderizar alternates recibidos:
  - `hreflang="es-MX"`
  - `hreflang="en"`
  - `hreflang="x-default"`
- Pasar `locale` a `Navbar`, `Footer` y `AdConsentBanner`.
- Si `canonical` no se pasa, no inventarlo desde `Astro.url` en esta fase.

No cambiar el formato global del `<title>` salvo que el locale requiera texto localizado para el sufijo. En fase 1 puede mantenerse `Calculadoras.Tools`.

## Tests

Crear `src/lib/i18n/routing.test.ts`.

Casos minimos:

- `getLocaleFromPathname("/") -> "es"`
- `getLocaleFromPathname("/matematicas") -> "es"`
- `getLocaleFromPathname("/en") -> "en"`
- `getLocaleFromPathname("/en/math") -> "en"`
- `prefixLocalePath("es", "/matematicas") -> "/matematicas"`
- `prefixLocalePath("en", "/math") -> "/en/math"`
- `normalizePath("/en/") -> "/en"`
- canonical absoluto sin trailing slash.
- alternates incluyen `es-MX`, `en` y `x-default` cuando ambas rutas existen.
- alternates no incluyen locales sin ruta publicada.

Agregar test de `messages` para garantizar que `en` y `es` tienen las mismas keys.

## Criterios de aceptacion

- Las rutas espanolas siguen interpretandose como `es`.
- Las rutas `/en` se interpretan como `en`.
- `BaseLayout` puede renderizar `lang`, canonical y alternates por locale.
- No se crean rutas nuevas todavia.
- No se ejecuta `npm run dev` ni `npm run build`.
