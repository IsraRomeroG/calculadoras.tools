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

const calculators: CalculatorDirectoryItem[] = [
  {
    id: "calculadora-de-porcentajes",
    title: "Calculadora de porcentajes",
    description: "Calcula porcentajes y aumentos/disminuciones en valores.",
    href: "/matematicas/calculadora-de-porcentajes",
    category: "Matemáticas",
    order: 10,
  },
  {
    id: "calculadora-de-iva",
    title: "Calculadora de IVA",
    description: "Agrega o desglosa IVA con tasa editable y presets por país.",
    href: "/legal-impuestos/calculadora-de-iva",
    category: "Legal e impuestos",
    order: 20,
  },
];

export const getCalculatorCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sortCalculators = (items: CalculatorDirectoryItem[]) =>
  [...items].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export const getPublishedCalculators = () =>
  sortCalculators(calculators.filter((calculator) => !calculator.draft));

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
