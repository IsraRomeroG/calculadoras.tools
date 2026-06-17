# Spec tecnica: internacionalizacion

## Contexto actual

El proyecto usa Astro con generacion estatica. Las calculadoras viven como paginas `.astro` bajo `src/pages/<categoria>/<slug>.astro`, el blog usa colecciones Markdown en `src/content/blog`, y el directorio de calculadoras se alimenta desde `src/lib/constants/calculators.ts`.

Hoy el sitio asume espanol en varios puntos:

- `BaseLayout.astro` fija `<html lang="es-MX">`.
- `Navbar.astro`, `Footer.astro`, home, blog y paginas de calculadora tienen textos hardcodeados.
- `src/lib/constants/categories.ts` y `src/lib/constants/calculators.ts` mezclan identidad, textos y URLs en espanol.
- Varias calculadoras usan `Intl.NumberFormat("es-MX")` o `Intl.DateTimeFormat("es-MX")`.
- El sitemap y los tests de rutas asumen rutas canonicas en espanol.

La implementacion debe introducir i18n sin mover las rutas espanolas existentes.

## Modelo de locales

Crear `src/lib/i18n/config.ts`.

```ts
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface LocaleConfig {
  locale: Locale;
  htmlLang: string;
  urlPrefix: "" | "/en";
  label: string;
  defaultCurrency: string;
}

export const DEFAULT_LOCALE = "es" satisfies Locale;

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  es: {
    locale: "es",
    htmlLang: "es-MX",
    urlPrefix: "",
    label: "Espanol",
    defaultCurrency: "MXN",
  },
  en: {
    locale: "en",
    htmlLang: "en",
    urlPrefix: "/en",
    label: "English",
    defaultCurrency: "USD",
  },
};
```

Reglas:

- `es` no lleva prefijo.
- `en` siempre lleva `/en`.
- No inferir locale desde IP.
- No redirigir automaticamente por `Accept-Language`.
- Una URL sin prefijo siempre se interpreta como `es`.

## Helpers de rutas

Crear `src/lib/i18n/routing.ts`.

Responsabilidades:

- Normalizar path sin trailing slash, excepto `/`.
- Detectar locale desde `Astro.url.pathname`.
- Construir URLs localizadas.
- Construir canonicals absolutos usando `Astro.site`.
- Construir alternates para `hreflang`.

API esperada:

```ts
export interface AlternateLink {
  locale: Locale | "x-default";
  hreflang: string;
  href: string;
}

export function getLocaleFromPathname(pathname: string): Locale;
export function prefixLocalePath(locale: Locale, path: string): string;
export function normalizePath(path: string): string;
export function buildCanonicalUrl(path: string, site: URL | string): string;
export function buildAlternateLinks(pathsByLocale: Partial<Record<Locale, string>>, site: URL | string): AlternateLink[];
```

`buildAlternateLinks` debe:

- Incluir solo locales con ruta publicada.
- Agregar `x-default` apuntando a la ruta `es` cuando exista.
- No inventar alternates para traducciones en draft.

## Diccionarios de UI

Crear `src/lib/i18n/messages.ts`.

Usar diccionarios tipados para texto compartido. Empezar con keys necesarias para la fase 1:

- `site.brandSuffix`
- `nav.home`
- `nav.blog`
- `nav.contact`
- `footer.tagline`
- `footer.rights`
- `footer.privacy`
- `footer.contact`
- `footer.adPreferences`
- `breadcrumbs.home`
- `common.use`
- `common.readArticle`
- `common.search`
- `common.calculators`
- `common.categories`
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

API:

```ts
type MessageKey = keyof typeof messages.es;

export function t(locale: Locale, key: MessageKey, params?: Record<string, string | number>): string;
```

Reglas:

- Si falta una key en un locale, fallar en test, no en runtime silencioso.
- Las interpolaciones usan `{name}`.
- No usar diccionarios para contenido editorial largo; ese contenido vive en metadata o Markdown localizado.

## Layout y SEO

Actualizar `src/layouts/BaseLayout.astro`.

Nuevas props:

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
- Renderizar:
  - `<link rel="alternate" hreflang="es-MX" href="...">`
  - `<link rel="alternate" hreflang="en" href="...">`
  - `<link rel="alternate" hreflang="x-default" href="...">`
- Pasar `locale` a `Navbar`, `Footer` y `AdConsentBanner` si necesitan textos.

No cambiar el formato del `<title>` salvo que el locale requiera texto localizado para el sufijo. En fase 1 puede mantenerse `Calculadoras.Tools`.

## Navegacion

Actualizar `src/lib/constants/menu.ts` para separar identidad y traduccion.

Modelo recomendado:

```ts
export interface MenuItemDefinition {
  id: "home" | "blog" | "contact";
  routeId: string;
  order: number;
  labels: Record<Locale, string>;
  descriptions: Partial<Record<Locale, string>>;
  paths: Partial<Record<Locale, string>>;
}
```

Para fase 1:

- `home`: `es -> /`, `en -> /en`
- `blog`: `es -> /blog`, sin `en` hasta traducir blog
- `contact`: `es -> /contacto`, sin `en` hasta traducir contacto

`Navbar.astro` debe recibir `locale` y mostrar solo items con `paths[locale]`.

`Footer.astro` debe recibir `locale` y mostrar enlaces solo si existen en ese locale.

## Categorias localizadas

Refactorizar `src/lib/constants/categories.ts` para mantener slugs canonicos espanoles y agregar slugs por locale.

Modelo:

```ts
export interface LocalizedCategoryMetadata {
  slug: string;
  label: string;
  description: string;
  legacySlugs?: readonly string[];
}

export interface CategoryDefinition {
  id: CategorySlug;
  locales: Partial<Record<Locale, LocalizedCategoryMetadata>>;
}
```

Para no romper codigo existente, conservar exports compatibles cuando sea posible:

- `CATEGORY_SLUGS`
- `CategorySlug`
- `getCategory(slug, locale = "es")`
- `getCategoryBySlugOrLegacySlug(slug, locale = "es")`
- `getCategoryLegacySlugs(slug, locale = "es")`

Datos fase 1:

- `matematicas`:
  - `es.slug = "matematicas"`
  - `en.slug = "math"`
  - `en.label = "Math"`
  - `en.description = "Calculators for percentages, proportions, geometry and everyday math problems."`

Las demas categorias pueden tener solo `es` hasta traducirse.

## Directorio de calculadoras

Refactorizar `src/lib/constants/calculators.ts`.

Separar:

- `id` estable.
- `categorySlug` estable.
- `order`.
- `draft` por calculadora completa si aplica.
- Metadata localizada por locale.

Modelo:

```ts
export interface LocalizedCalculatorMetadata {
  title: string;
  description: string;
  slug: string;
  published: boolean;
}

export interface CalculatorDefinition {
  id: string;
  categorySlug: CategorySlug;
  order: number;
  locales: Partial<Record<Locale, LocalizedCalculatorMetadata>>;
}
```

`src/lib/calculator-directory.ts` debe exponer:

```ts
export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categorySlug: CategorySlug;
  order: number;
}

export function getPublishedCalculators(locale?: Locale): CalculatorDirectoryItem[];
export function getCalculatorCategories(items: CalculatorDirectoryItem[], locale?: Locale): CalculatorCategory[];
export function getCalculatorCategoryUrl(slug: CategorySlug, locale?: Locale): string;
export function getCalculatorUrl(calculator: CalculatorDefinition, locale?: Locale): string | null;
```

Reglas:

- `getPublishedCalculators("en")` solo devuelve calculadoras con `locales.en.published === true`.
- `href` se genera desde category slug localizado + calculator slug localizado.
- No guardar `href` manual en metadata.

Datos fase 1 para porcentajes:

- `id = "calculadora-de-porcentajes"`
- `categorySlug = "matematicas"`
- `es.slug = "calculadora-de-porcentajes"`
- `en.slug = "percentage-calculator"`
- `en.title = "Percentage calculator"`
- `en.description = "Calculate percentages, discounts, increases and changes between values instantly."`
- `en.published = true`

## Home localizada

La home actual `src/pages/index.astro` debe seguir sirviendo `/`.

Crear una forma compartida para evitar duplicar markup:

- Opcion recomendada: `src/components/pages/HomePage.astro`
- Props:
  - `locale`
  - `canonical`
  - `alternates`

`src/pages/index.astro` renderiza `<HomePage locale="es" />`.

Crear `src/pages/en/index.astro` para `/en`, renderizando `<HomePage locale="en" />`.

La home debe:

- Usar `getPublishedCalculators(locale)`.
- Usar textos desde `t(locale, ...)`.
- Usar `getCalculatorCategoryUrl(category.slug, locale)`.
- Usar `Card` con CTA localizada.
- Mantener busqueda cliente, pero localizar:
  - resumen vacio
  - cantidad de resultados
  - placeholders
  - singular/plural basico

## Categoria localizada

La ruta espanola actual `src/pages/[category].astro` debe seguir generando categorias espanolas.

Crear `src/pages/en/[category].astro`.

`getStaticPaths` para ingles:

- Obtener calculadoras publicadas en `en`.
- Obtener categorias con al menos una calculadora publicada en `en`.
- Usar `getCategory(categoryId, "en").slug` como param.
- Pasar `locale: "en"`, `categoryId`, `category`, `calculators`.

La pagina debe:

- Usar canonical `/en/math`.
- Declarar alternate con `/matematicas` si existe equivalente `es`.
- No listar categorias sin calculadoras publicadas en ingles.

## Calculadora de porcentajes localizada

Extraer la pagina actual a un componente compartido:

- `src/components/calculators/PercentageCalculatorPage.astro`

Props:

```ts
interface Props {
  locale: Locale;
  canonical: string;
  alternates: AlternateLink[];
}
```

Rutas:

- `src/pages/matematicas/calculadora-de-porcentajes.astro`
  - Renderiza el componente con `locale="es"`.
  - Canonical: `/matematicas/calculadora-de-porcentajes`.
- `src/pages/en/math/percentage-calculator.astro`
  - Renderiza el componente con `locale="en"`.
  - Canonical: `/en/math/percentage-calculator`.

Contenido traducible:

- Title y description SEO.
- FAQs.
- Hero.
- Breadcrumbs.
- Tabs.
- Labels de inputs.
- Placeholders si cambian.
- Errores.
- Estados del resultado.
- Botones.
- Historial.
- Textos de copy.
- Ejemplos, guias relacionadas y tabla de porcentajes comunes.

Crear `src/lib/i18n/calculators/percentage.ts` con:

```ts
export const percentageCalculatorContent: Record<Locale, PercentageCalculatorContent>;
```

El script cliente debe recibir textos por JSON seguro:

```astro
<script define:vars={{ locale, ui: percentageCalculatorContent[locale].client }}>
  // usar ui.required, ui.invalid, etc.
</script>
```

Formato:

- Cambiar `formatNumber`, `formatCurrency`, `formatPercent` en `percentage.ts` para aceptar `locale`.
- Default: `"es-MX"` para compatibilidad.
- En ingles usar `"en"` y moneda visual `$` para fase 1.
- Mantener `parseNumericInput` tolerante a coma y punto como hoy.

No cambiar formulas.

## Blog

No traducir blog en fase 1, pero preparar la arquitectura.

Cambios minimos:

- Mantener coleccion actual `blog` como fuente espanola.
- No mostrar `Blog` en navbar inglesa hasta que exista `/en/blog`.
- En la calculadora inglesa, ocultar `relatedGuides` si no existe traduccion inglesa.
- En la metadata futura de blog, usar `translationKey` o `contentId` estable para emparejar articulos por idioma.

Modelo futuro recomendado:

```txt
src/content/blog/es/<categoria>/<slug>.md
src/content/blog/en/<category>/<slug>.md
```

Pero no mover contenido actual en fase 1. Si una fase futura mueve Markdown existente, aplicar mapeo de URLs y redirects 301 segun la guia de rutas canonicas.

## Sitemap y robots

`robots.txt` puede seguir apuntando a `sitemap-index.xml`.

Actualizar `astro.config.mjs` solo si el filtro del sitemap necesita excluir rutas inglesas no publicadas. Reglas:

- Incluir `/en` y rutas inglesas publicadas.
- No incluir rutas inglesas en draft.
- Mantener exclusion de rutas legacy del blog.
- No generar trailing slash.

Si se usa `@astrojs/sitemap`, validar que las paginas estaticas bajo `/en` entren automaticamente.

## Tests

Agregar o actualizar tests con Vitest.

### i18n routing

Archivo sugerido: `src/lib/i18n/routing.test.ts`

Casos:

- `getLocaleFromPathname("/") -> "es"`
- `getLocaleFromPathname("/matematicas") -> "es"`
- `getLocaleFromPathname("/en") -> "en"`
- `getLocaleFromPathname("/en/math") -> "en"`
- `prefixLocalePath("es", "/matematicas") -> "/matematicas"`
- `prefixLocalePath("en", "/math") -> "/en/math"`
- Canonical sin trailing slash.
- Alternates incluyen `es-MX`, `en`, `x-default`.

### directorio localizado

Actualizar `src/lib/calculator-directory.test.ts`.

Casos:

- Espanol conserva `/matematicas/calculadora-de-porcentajes`.
- Ingles genera `/en/math/percentage-calculator`.
- `getPublishedCalculators("en")` no incluye calculadoras sin metadata inglesa publicada.
- Slugs localizados de categoria son unicos por locale.

### links internos

Actualizar `src/lib/internal-links.test.ts` si detecta nuevos patrones.

Casos:

- No trailing slash en `/en`.
- No enlaces ingleses a rutas espanolas salvo alternates/cambio de idioma.

### calculadora de porcentajes

Actualizar test existente de `percentage.ts`.

Casos:

- Formato numerico espanol se conserva.
- Formato numerico ingles usa separadores esperados.
- Calculos no cambian.

Comando final:

```powershell
npm.cmd run test:unit:run
```

No ejecutar `npm run dev` ni `npm run build` salvo que se pida explicitamente.

## Orden de implementacion

1. Crear `src/lib/i18n/config.ts`, `messages.ts`, `routing.ts` y tests.
2. Actualizar `BaseLayout.astro` para `locale`, canonical y alternates.
3. Localizar `Navbar.astro` y `Footer.astro`.
4. Refactorizar categorias y directorio de calculadoras manteniendo compatibilidad con `es`.
5. Extraer la home a `HomePage.astro` y crear `/en`.
6. Crear ruta de categoria inglesa `/en/[category].astro`.
7. Extraer calculadora de porcentajes a componente compartido y crear `/en/math/percentage-calculator`.
8. Localizar textos cliente y formatters de la calculadora.
9. Ajustar sitemap/tests de enlaces.
10. Ejecutar tests unitarios.

## Compatibilidad y redirects

Fase 1 no cambia rutas existentes, por lo tanto:

- No hay redirects nuevos.
- No se eliminan paginas espanolas.
- No se duplican rutas espanolas bajo `/es`.

Si una fase futura decide mover espanol a `/es`, antes de editar se debe generar un mapa completo:

```txt
/matematicas -> /es/matematicas
/matematicas/calculadora-de-porcentajes -> /es/matematicas/calculadora-de-porcentajes
/blog/... -> /es/blog/...
```

Y entregar reglas Apache 301 en `.htaccess`. No usar paginas Astro legacy, meta refresh ni redirects cliente.

## Checklist de aceptacion

- [ ] Las URLs espanolas actuales siguen iguales.
- [ ] `/en` renderiza home inglesa.
- [ ] `/en/math` renderiza categoria inglesa.
- [ ] `/en/math/percentage-calculator` renderiza calculadora inglesa.
- [ ] La version inglesa no muestra enlaces a blog no traducido.
- [ ] Canonical y `hreflang` son correctos en cada pagina del piloto.
- [ ] El sitemap incluye solo paginas publicadas.
- [ ] Los tests unitarios pasan.

