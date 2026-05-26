import { CALCULATORS } from "@lib/constants/calculators";

export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  order: number;
  draft?: boolean;
}

export interface CalculatorCategory {
  label: string;
  slug: string;
  count: number;
}

const calculatorCategoryDescriptions: Record<string, string> = {
  finanzas:
    "Calculadoras para estimar préstamos, intereses y escenarios de inversión antes de comprometer tu dinero.",
  "legal-e-impuestos":
    "Herramientas para agregar o desglosar impuestos, revisar montos con IVA y preparar cifras útiles para facturas o presupuestos.",
  matematicas:
    "Calculadoras para porcentajes, proporciones y reglas de tres, con resultados directos para tareas, compras y trabajo.",
  salud:
    "Calculadoras de referencia para revisar indicadores personales y entender mejor tus resultados de bienestar.",
};

export const getCalculatorCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCalculatorCategoryUrl = (category: string) =>
  `/categoria/${getCalculatorCategorySlug(category)}`;

export const getCalculatorCategoryDescription = (category: string) =>
  calculatorCategoryDescriptions[getCalculatorCategorySlug(category)] ??
  "Calculadoras seleccionadas para resolver operaciones frecuentes con resultados claros y fáciles de revisar.";

export const sortCalculators = (items: CalculatorDirectoryItem[]) =>
  [...items].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export const getPublishedCalculators = () =>
  sortCalculators(CALCULATORS.filter((calculator) => !calculator.draft));

export const getCalculatorCategories = (
  items: CalculatorDirectoryItem[],
): CalculatorCategory[] => {
  const categories = new Map<string, CalculatorCategory>();

  items.forEach((item) => {
    const label = item.category;
    const slug = getCalculatorCategorySlug(label);
    const category = categories.get(slug);

    if (category) {
      category.count += 1;
      return;
    }

    categories.set(slug, { label, slug, count: 1 });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );
};
