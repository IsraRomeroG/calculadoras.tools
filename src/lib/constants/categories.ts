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
  "eventos",
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
  eventos: {
    slug: "eventos",
    label: "Eventos",
    description:
      "Herramientas para estimar presupuestos, costos por persona, pagos y partidas de bodas, fiestas y celebraciones.",
    legacySlugs: ["eventos-sociales"],
  },
  restaurantes: {
    slug: "restaurantes",
    label: "Restaurantes",
    description:
      "Herramientas para calcular propinas, dividir cuentas y revisar pagos compartidos en restaurantes.",
  },
  vehiculos: {
    slug: "vehiculos",
    label: "Vehiculos",
    description:
      "Herramientas para estimar rendimiento, costos, depreciacion y datos utiles para manejar con mas claridad.",
  },
  construccion: {
    slug: "construccion",
    label: "Construccion",
    description:
      "Calculadoras para estimar superficies, materiales y cantidades utiles en proyectos de obra, pintura y mejoras del hogar.",
  },
} as const satisfies Record<CategorySlug, CategoryMetadata>;

const ENGLISH_CATEGORIES: Record<CategoryId, LocalizedCategoryMetadata> = {
  finanzas: {
    slug: "finance",
    label: "Finance",
    description:
      "Calculators for estimating loans, interest, savings and investment scenarios before making financial decisions.",
  },
  inmuebles: {
    slug: "real-estate",
    label: "Real Estate",
    description:
      "Tools for estimating payments, financing and common home or real estate scenarios.",
  },
  "legal-impuestos": {
    slug: "legal-tax",
    label: "Legal & Taxes",
    description:
      "Tools for reviewing taxes, take-home amounts and other legal or tax-related estimates with clear assumptions.",
  },
  matematicas: {
    slug: "math",
    label: "Math",
    description:
      "Calculators for percentages, proportions, geometry and everyday math problems.",
  },
  "probabilidad-estadistica": {
    slug: "probability-statistics",
    label: "Probability & Statistics",
    description:
      "Calculators for probability, counting and statistics with clear formulas and step-by-step explanations.",
  },
  programacion: {
    slug: "programming",
    label: "Programming",
    description:
      "Calculators and converters for number systems, data and common software development tasks.",
  },
  geometria: {
    slug: "geometry",
    label: "Geometry",
    description:
      "Calculators for areas, perimeters, triangles and other geometric measurements with clear formulas.",
  },
  salud: {
    slug: "health",
    label: "Health",
    description:
      "Reference calculators for reviewing personal indicators and understanding general health and wellness estimates.",
  },
  "fecha-tiempo": {
    slug: "date-time",
    label: "Date & Time",
    description:
      "Tools for calculating ages, intervals, working time and important dates with clear results.",
  },
  conversores: {
    slug: "converters",
    label: "Converters",
    description:
      "Fast converters for everyday units with clear results, formulas and useful reference values.",
  },
  mascotas: {
    slug: "pets",
    label: "Pets",
    description:
      "Reference tools for estimating useful information about dogs and cats with clear care-related context.",
  },
  cocina: {
    slug: "cooking",
    label: "Cooking",
    description:
      "Tools for scaling recipes, converting cooking measurements and planning preparation times.",
  },
  eventos: {
    slug: "events",
    label: "Events",
    description:
      "Tools for estimating budgets, per-person costs and shared expenses for weddings, parties and celebrations.",
  },
  restaurantes: {
    slug: "restaurants",
    label: "Restaurants",
    description:
      "Tools for calculating tips, splitting bills and reviewing shared restaurant payments.",
  },
  vehiculos: {
    slug: "vehicles",
    label: "Vehicles",
    description:
      "Tools for estimating fuel economy, driving costs, depreciation and common vehicle expenses.",
  },
  construccion: {
    slug: "construction",
    label: "Construction",
    description:
      "Calculators for estimating areas, materials and quantities for building, painting and home improvement projects.",
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
