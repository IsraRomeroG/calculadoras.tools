import { CALCULATORS } from "@lib/constants/calculators";
import { getCategory, type CategorySlug } from "@lib/constants/categories";

export type CalculatorCategorySlug = CategorySlug;

export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categorySlug: CalculatorCategorySlug;
  order: number;
  draft?: boolean;
}

export interface CalculatorCategory {
  slug: CalculatorCategorySlug;
  label: string;
  description: string;
  count: number;
}

export const getCalculatorCategory = (slug: CalculatorCategorySlug) =>
  getCategory(slug);

export const getCalculatorCategoryUrl = (slug: CalculatorCategorySlug) =>
  `/${slug}/`;

export const getCalculatorCategoryDescription = (slug: CalculatorCategorySlug) =>
  getCalculatorCategory(slug).description;

export const sortCalculators = (items: CalculatorDirectoryItem[]) =>
  [...items].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );

export const getPublishedCalculators = () =>
  sortCalculators(CALCULATORS.filter((calculator) => !calculator.draft));

export const getCalculatorsByCategorySlug = (
  items: CalculatorDirectoryItem[],
  categorySlug: CalculatorCategorySlug,
) => items.filter((item) => item.categorySlug === categorySlug);

export const getCalculatorCategories = (
  items: CalculatorDirectoryItem[],
): CalculatorCategory[] => {
  const categories = new Map<CalculatorCategorySlug, CalculatorCategory>();

  items.forEach((item) => {
    const slug = item.categorySlug;
    const category = categories.get(slug);

    if (category) {
      category.count += 1;
      return;
    }

    const metadata = getCalculatorCategory(slug);

    categories.set(slug, {
      slug,
      label: metadata.label,
      description: metadata.description,
      count: 1,
    });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );
};
