# 02 - Directorio localizado

## Objetivo

Separar identidad estable, metadata traducible y rutas publicables para categorias y calculadoras. El directorio debe soportar `es` y `en` sin romper las URLs espanolas actuales.

## Alcance

- `src/lib/constants/categories.ts`
- `src/lib/constants/calculators.ts`
- `src/lib/calculator-directory.ts`
- Tests de directorio y slugs

No incluye rutas Astro nuevas ni contenido de paginas.

## Categorias

Usar un ID estable para categorias. Para reducir riesgo, el ID puede seguir siendo el slug canonico espanol actual.

Modelo recomendado:

```ts
export const CATEGORY_IDS = [
  "finanzas",
  "inmuebles",
  "legal-impuestos",
  "matematicas",
  "probabilidad-estadistica",
  "programacion",
  "geometria",
  "salud",
  "fecha-tiempo",
  "conversores",
  "mascotas",
  "cocina",
  "restaurantes",
  "vehiculos",
  "construccion",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

// Alias temporal de compatibilidad para codigo existente.
export type CategorySlug = CategoryId;

export interface LocalizedCategoryMetadata {
  slug: string;
  label: string;
  description: string;
  legacySlugs?: readonly string[];
}

export interface CategoryDefinition {
  id: CategoryId;
  locales: Partial<Record<Locale, LocalizedCategoryMetadata>>;
}
```

Reglas:

- No usar `categorySlug` para significar dos cosas. En codigo nuevo, usar `categoryId` para identidad estable y `slug` para URL localizada.
- Mantener `CATEGORY_SLUGS` como alias de compatibilidad si el codigo existente lo necesita.
- `getCategory(categoryId, locale = "es")` devuelve metadata localizada.
- `getCategoryBySlugOrLegacySlug(slug, locale = "es")` busca en slugs y legacy slugs del locale solicitado.
- `getCategoryLegacySlugs(categoryId, locale = "es")` conserva legacy slugs espanoles actuales.
- Las demas categorias pueden tener solo `es` hasta traducirse.

Datos fase 1:

```ts
{
  id: "matematicas",
  locales: {
    es: {
      slug: "matematicas",
      label: "Matematicas",
      description: "...",
    },
    en: {
      slug: "math",
      label: "Math",
      description: "Calculators for percentages, proportions, geometry and everyday math problems.",
    },
  },
}
```

## Calculadoras

Refactorizar `src/lib/constants/calculators.ts`.

Modelo recomendado:

```ts
export interface LocalizedCalculatorMetadata {
  title: string;
  description: string;
  slug: string;
  published: boolean;
}

export interface CalculatorDefinition {
  id: string;
  categoryId: CategoryId;
  order: number;
  draft?: boolean;
  locales: Partial<Record<Locale, LocalizedCalculatorMetadata>>;
}
```

Reglas:

- `id` es estable y no se traduce.
- `categoryId` apunta a una categoria estable.
- No guardar `href` manual en metadata localizada.
- `draft` desactiva la calculadora completa.
- `locales[locale].published` controla publicacion por idioma.
- `es` debe quedar publicado para las calculadoras existentes salvo las que ya sean `draft`.
- `en` solo debe existir para contenido traducido y revisado.

Datos fase 1 para porcentajes:

```ts
{
  id: "calculadora-de-porcentajes",
  categoryId: "matematicas",
  order: 10,
  locales: {
    es: {
      title: "Calculadora de porcentajes",
      description: "Calcula porcentajes y aumentos/disminuciones en valores.",
      slug: "calculadora-de-porcentajes",
      published: true,
    },
    en: {
      title: "Percentage calculator",
      description: "Calculate percentages, discounts, increases and changes between values instantly.",
      slug: "percentage-calculator",
      published: true,
    },
  },
}
```

## Helpers del directorio

`src/lib/calculator-directory.ts` debe exponer:

```ts
export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categoryId: CategoryId;
  categorySlug: CategorySlug; // alias de compatibilidad para es
  order: number;
}

export interface CalculatorCategory {
  id: CategoryId;
  slug: string;
  label: string;
  description: string;
  count: number;
}

export function getPublishedCalculators(locale?: Locale): CalculatorDirectoryItem[];
export function getCalculatorCategories(
  items: CalculatorDirectoryItem[],
  locale?: Locale,
): CalculatorCategory[];
export function getCalculatorCategoryUrl(categoryId: CategoryId, locale?: Locale): string | null;
export function getCalculatorUrl(calculator: CalculatorDefinition, locale?: Locale): string | null;
```

Reglas:

- Default `locale = "es"` para compatibilidad.
- `getPublishedCalculators("en")` solo devuelve calculadoras con `locales.en.published === true`.
- `href` se genera desde slug localizado de categoria + slug localizado de calculadora.
- Si falta categoria o calculadora publicada en ese locale, devolver `null` y excluir del listado.
- Ordenar por `order` y luego por `title` con `LOCALE_CONFIG[locale].formatLocale`.

## Validaciones de slugs

Agregar tests para:

- Slugs localizados de categoria son unicos por locale.
- Slugs localizados de calculadora son unicos dentro de cada categoria y locale.
- Slugs no colisionan con rutas reservadas: `404`, `blog`, `contacto`, `privacidad`, `robots.txt`, `pagina`, `categoria`, `en`.
- Legacy slugs espanoles actuales se conservan.
- No hay `href` manual en nuevas definiciones.

## Tests minimos

Actualizar `src/lib/calculator-directory.test.ts`.

Casos:

- Espanol conserva `/matematicas/calculadora-de-porcentajes`.
- Ingles genera `/en/math/percentage-calculator`.
- `getPublishedCalculators("en")` no incluye calculadoras sin metadata inglesa publicada.
- `getCalculatorCategoryUrl("matematicas", "en") -> "/en/math"`.
- `getCalculatorCategoryUrl("finanzas", "en") -> null` mientras no exista categoria inglesa publicada.
- Helpers antiguos siguen funcionando con default `es`.

## Criterios de aceptacion

- No cambia ninguna URL espanola.
- El directorio espanol mantiene las calculadoras actuales.
- El directorio ingles solo ve la calculadora de porcentajes y la categoria Math.
- Las funciones nuevas no requieren escribir URLs localizadas a mano.
