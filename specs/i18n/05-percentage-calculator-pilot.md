# 05 - Piloto calculadora de porcentajes

## Objetivo

Publicar `/en/math/percentage-calculator` reutilizando la logica de la calculadora espanola, con contenido, SEO, formato y script cliente localizados.

## Alcance

- `src/components/calculators/PercentageCalculatorPage.astro`
- `src/pages/matematicas/calculadora-de-porcentajes.astro`
- `src/pages/en/math/percentage-calculator.astro`
- `src/lib/i18n/calculators/percentage.ts`
- `src/lib/calculators/matematicas/calculadora-de-porcentajes/percentage.ts`
- Tests existentes de `percentage.ts`

## Rutas

La ruta espanola actual no cambia:

- `/matematicas/calculadora-de-porcentajes`

Crear ruta inglesa:

- `/en/math/percentage-calculator`

No crear redirects en fase 1.

## Componente compartido

Extraer la pagina actual a:

```txt
src/components/calculators/PercentageCalculatorPage.astro
```

Props:

```ts
interface Props {
  locale: Locale;
  canonical: string;
  alternates: AlternateLink[];
}
```

Wrappers:

- `src/pages/matematicas/calculadora-de-porcentajes.astro`
  - Renderiza `<PercentageCalculatorPage locale="es" canonical="/matematicas/calculadora-de-porcentajes" ... />`.
- `src/pages/en/math/percentage-calculator.astro`
  - Renderiza `<PercentageCalculatorPage locale="en" canonical="/en/math/percentage-calculator" ... />`.

## Contenido localizado

Crear:

```txt
src/lib/i18n/calculators/percentage.ts
```

Modelo:

```ts
export interface PercentageCalculatorContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    description: string;
  };
  breadcrumbs: {
    home: string;
    category: string;
    current: string;
  };
  tabs: Record<PercentageMode, string>;
  fields: Record<string, { label: string; placeholder?: string; hint?: string }>;
  client: Record<string, string>;
  faq: Array<{ question: string; answer: string }>;
  examples: Array<{ title: string; description: string; href?: string }>;
  relatedGuides: Array<{ title: string; description: string; href: string; published: boolean }>;
  quickReference: Array<{ label: string; value: string }>;
}

export const percentageCalculatorContent: Record<Locale, PercentageCalculatorContent>;
```

Reglas:

- Title y description SEO deben ser revisados por humano.
- FAQs, ejemplos y tablas no viven en `messages.ts`; viven en este contenido localizado.
- `relatedGuides` en ingles se oculta si no hay articulos ingleses publicados.
- No enlazar desde la version inglesa a `/blog/...` en espanol.
- No cambiar formulas.

## Script cliente

El script actual importa helpers TS dentro del cliente. Mantener ese patron como script procesado por Astro.

No usar `define:vars` para esta calculadora. Para evitar romper imports o bundling del script cliente, pasar contenido localizado mediante JSON seguro o atributos `data-*`.

Opciones permitidas para pasar textos al cliente:

1. JSON seguro:

```astro
<script
  id="percentage-calculator-i18n"
  type="application/json"
  set:html={JSON.stringify({
    locale,
    ui: percentageCalculatorContent[locale].client,
  })}
></script>
```

El script cliente lee y parsea ese JSON por ID.

2. Atributos `data-*` en el contenedor raiz para strings simples.

Reglas:

- No interpolar strings sin escape dentro del script.
- No hardcodear frases espanolas o inglesas en funciones cliente.
- Los mensajes de error, resultados, copy, historial y estados vacios vienen de `client`.

## Formato numerico

Actualizar helpers en `percentage.ts` para aceptar opciones de formato sin romper llamadas actuales.

Modelo recomendado:

```ts
export interface PercentageFormatOptions {
  formatLocale?: string;
  currencySymbol?: string;
}

export function formatNumber(value: number, options?: PercentageFormatOptions): string;
export function formatCurrency(value: number, options?: PercentageFormatOptions): string;
export function formatPercent(value: number, options?: PercentageFormatOptions): string;
```

Reglas:

- Default compatible: `formatLocale = "es-MX"` y `currencySymbol = "$"`.
- Para ingles usar `LOCALE_CONFIG.en.formatLocale`, inicialmente `en-US`, y simbolo `$`.
- Mantener `parseNumericInput` tolerante a coma y punto como hoy.
- No usar `Locale` directamente como region de formato; pasar `formatLocale`.

## SEO

La pagina espanola:

- Canonical: `/matematicas/calculadora-de-porcentajes`.
- Alternates: `es-MX`, `en`, `x-default`.

La pagina inglesa:

- Canonical: `/en/math/percentage-calculator`.
- Alternates: `es-MX`, `en`, `x-default`.

Ambas deben renderizar JSON-LD con contenido del locale actual.

## Tests

Actualizar `src/lib/calculators/matematicas/calculadora-de-porcentajes/percentage.test.ts`.

Casos:

- Calculos no cambian.
- Formato espanol se conserva por default.
- Formato ingles usa separadores esperados.
- `parseNumericInput` sigue aceptando coma y punto.

Agregar tests de contenido si se crea helper:

- `percentageCalculatorContent.es` y `.en` tienen las mismas secciones obligatorias.
- `relatedGuides` ingles no contiene URLs `/blog/...` espanolas publicadas como si fueran inglesas.

## Criterios de aceptacion

- `/matematicas/calculadora-de-porcentajes` sigue funcionando.
- `/en/math/percentage-calculator` renderiza calculadora inglesa.
- No hay textos espanoles visibles en la version inglesa.
- La calculadora inglesa no enlaza a articulos espanoles.
- Las formulas y resultados numericos siguen correctos.
