import { DEFAULT_LOCALE, type Locale } from "@lib/i18n/config";

export interface CategoryMetadata {
  slug: string;
  label: string;
  description: string;
  legacySlugs?: readonly string[];
}

export const CATEGORY_SLUGS = [
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

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
export type CategoryId = CategorySlug;

export const CATEGORY_IDS = CATEGORY_SLUGS;

export type LocalizedCategoryMetadata = CategoryMetadata;

export interface CategoryDefinition {
  id: CategoryId;
  locales: Partial<Record<Locale, LocalizedCategoryMetadata>>;
}

export const CATEGORIES = {
  finanzas: {
    slug: "finanzas",
    label: "Finanzas",
    description:
      "Calculadoras para estimar préstamos, intereses y escenarios de inversión antes de comprometer tu dinero.",
  },
  inmuebles: {
    slug: "inmuebles",
    label: "Inmuebles",
    description:
      "Herramientas para estimar pagos, financiamiento y escenarios relacionados con vivienda e inmuebles.",
  },
  "legal-impuestos": {
    slug: "legal-impuestos",
    label: "Legal e impuestos",
    description:
      "Herramientas para agregar o desglosar impuestos, revisar montos con IVA y preparar cifras útiles para facturas o presupuestos.",
    legacySlugs: ["legal-e-impuestos"],
  },
  matematicas: {
    slug: "matematicas",
    label: "Matemáticas",
    description:
      "Calculadoras para porcentajes, proporciones y reglas de tres, con resultados directos para tareas, compras y trabajo.",
  },
  "probabilidad-estadistica": {
    slug: "probabilidad-estadistica",
    label: "Probabilidad y estadística",
    description:
      "Calculadoras para resolver problemas de probabilidad, conteo y estadística con fórmulas claras, resultados exactos y explicaciones paso a paso.",
  },
  programacion: {
    slug: "programacion",
    label: "Programación",
    description:
      "Calculadoras y conversores para sistemas numéricos, datos y tareas habituales de programación y desarrollo de software.",
  },
  geometria: {
    slug: "geometria",
    label: "Geometría",
    description:
      "Calculadoras para resolver áreas, perímetros, triángulos y otras medidas geométricas con fórmulas claras.",
  },
  salud: {
    slug: "salud",
    label: "Salud",
    description:
      "Calculadoras de referencia para revisar indicadores personales y entender mejor tus resultados de bienestar.",
  },
  "fecha-tiempo": {
    slug: "fecha-tiempo",
    label: "Fecha y tiempo",
    description:
      "Herramientas para calcular edades, intervalos, cumpleaños y fechas importantes con claridad.",
    legacySlugs: ["fecha-y-tiempo"],
  },
  conversores: {
    slug: "conversores",
    label: "Conversores",
    description:
      "Conversores rápidos para transformar unidades cotidianas con resultados claros y referencias útiles.",
  },
  mascotas: {
    slug: "mascotas",
    label: "Mascotas",
    description:
      "Herramientas orientativas para estimar datos utiles sobre perros y gatos, con contexto claro para cuidar mejor a tu mascota.",
  },
  cocina: {
    slug: "cocina",
    label: "Cocina",
    description:
      "Herramientas para ajustar recetas, convertir medidas culinarias y cocinar con cantidades más claras.",
  },
  restaurantes: {
    slug: "restaurantes",
    label: "Restaurantes",
    description:
      "Herramientas para calcular propinas, dividir cuentas y revisar pagos compartidos en restaurantes.",
    legacySlugs: ["eventos-sociales"],
  },
  vehiculos: {
    slug: "vehiculos",
    label: "Vehiculos",
    description:
      "Herramientas para estimar rendimiento de combustible, trayectos y datos utiles para manejar con mas claridad.",
  },
  construccion: {
    slug: "construccion",
    label: "Construccion",
    description:
      "Calculadoras para estimar superficies, materiales y cantidades utiles en proyectos de obra, pintura y mejoras del hogar.",
  },
} as const satisfies Record<CategorySlug, CategoryMetadata>;

const ENGLISH_CATEGORIES: Partial<Record<CategoryId, LocalizedCategoryMetadata>> = {
  matematicas: {
    slug: "math",
    label: "Math",
    description:
      "Calculators for percentages, proportions, geometry and everyday math problems.",
  },
};

export const CATEGORY_DEFINITIONS = Object.fromEntries(
  CATEGORY_IDS.map((id) => [
    id,
    {
      id,
      locales: {
        es: CATEGORIES[id],
        ...(ENGLISH_CATEGORIES[id]
          ? { en: ENGLISH_CATEGORIES[id] }
          : {}),
      },
    },
  ]),
) as Record<CategoryId, CategoryDefinition>;

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  CATEGORY_SLUGS.includes(slug as CategorySlug);

export const getCategoryLocale = (
  id: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => CATEGORY_DEFINITIONS[id].locales[locale];

export const getCategory = (
  id: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => getCategoryLocale(id, locale) ?? CATEGORIES[id];

export const getCategoryByLabel = (
  label: string,
  locale: Locale = DEFAULT_LOCALE,
) =>
  CATEGORY_IDS.map((id) => getCategoryLocale(id, locale))
    .filter((category): category is LocalizedCategoryMetadata =>
      Boolean(category),
    )
    .find((category) => category.label === label);

export const getCategoryBySlugOrLegacySlug = (
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
) =>
  CATEGORY_IDS.map((id) => getCategoryLocale(id, locale))
    .filter((category): category is LocalizedCategoryMetadata =>
      Boolean(category),
    )
    .find(
      (category) =>
        category.slug === slug || category.legacySlugs?.includes(slug),
    );

export const getCategoryLegacySlugs = (
  id: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => getCategoryLocale(id, locale)?.legacySlugs ?? [];
