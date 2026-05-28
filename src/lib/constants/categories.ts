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
  "salud",
  "fecha-tiempo",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

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
} as const satisfies Record<CategorySlug, CategoryMetadata>;

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  CATEGORY_SLUGS.includes(slug as CategorySlug);

export const getCategory = (slug: CategorySlug) => CATEGORIES[slug];

export const getCategoryByLabel = (label: string) =>
  CATEGORY_SLUGS.map((slug) => CATEGORIES[slug]).find(
    (category) => category.label === label,
  );

export const getCategoryBySlugOrLegacySlug = (slug: string) =>
  CATEGORY_SLUGS.map((key) => CATEGORIES[key]).find(
    (category) =>
      category.slug === slug || category.legacySlugs?.includes(slug),
  );

export const getCategoryLegacySlugs = (slug: CategorySlug) =>
  CATEGORIES[slug].legacySlugs ?? [];

