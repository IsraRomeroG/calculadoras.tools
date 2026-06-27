import {
  CALCULATOR_DEFINITIONS,
  type CalculatorDefinition,
} from "@lib/constants/calculators";
import {
  getCategory,
  getCategoryLocale,
  isCategorySlug,
  type CategoryId,
  type CategorySlug,
} from "@lib/constants/categories";
import { DEFAULT_LOCALE, LOCALE_CONFIG, type Locale } from "@lib/i18n/config";
import { prefixLocalePath } from "@lib/i18n/routing";

export type CalculatorCategorySlug = CategorySlug;

export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  categoryId: CategoryId;
  categorySlug: CalculatorCategorySlug;
  order: number;
  draft?: boolean;
}

export interface CalculatorCategory {
  id: CategoryId;
  slug: string;
  label: string;
  description: string;
  count: number;
}

export const getCalculatorCategory = (
  id: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => getCategory(id, locale);

export const getCalculatorCategoryUrl = (
  id: CategoryId | string,
  locale: Locale = DEFAULT_LOCALE,
) => {
  if (!isCategorySlug(id)) {
    return null;
  }

  const category = getCategoryLocale(id, locale);

  return category ? prefixLocalePath(locale, `/${category.slug}`) : null;
};

export const getCalculatorCategoryDescription = (
  id: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => getCalculatorCategory(id, locale).description;

export const getCalculatorUrl = (
  calculator: CalculatorDefinition,
  locale: Locale = DEFAULT_LOCALE,
) => {
  if (calculator.draft) {
    return null;
  }

  const category = getCategoryLocale(calculator.categoryId, locale);
  const metadata = calculator.locales[locale];

  if (!category || !metadata?.published) {
    return null;
  }

  return prefixLocalePath(locale, `/${category.slug}/${metadata.slug}`);
};

export const sortCalculators = (
  items: CalculatorDirectoryItem[],
  locale: Locale = DEFAULT_LOCALE,
) =>
  [...items].sort(
    (a, b) =>
      a.order - b.order ||
      a.title.localeCompare(b.title, LOCALE_CONFIG[locale].formatLocale),
  );

export const getPublishedCalculators = (
  locale: Locale = DEFAULT_LOCALE,
): CalculatorDirectoryItem[] =>
  sortCalculators(
    CALCULATOR_DEFINITIONS.flatMap((calculator) => {
      const metadata = calculator.locales[locale];
      const href = getCalculatorUrl(calculator, locale);

      if (!metadata?.published || !href) {
        return [];
      }

      return [
        {
          id: calculator.id,
          title: metadata.title,
          description: metadata.description,
          href,
          categoryId: calculator.categoryId,
          categorySlug: calculator.categoryId,
          order: calculator.order,
          ...(calculator.draft ? { draft: calculator.draft } : {}),
        },
      ];
    }),
    locale,
  );

export const getCalculatorsByCategorySlug = (
  items: CalculatorDirectoryItem[],
  categorySlug: string,
) => items.filter((item) => item.categorySlug === categorySlug);

export const getCalculatorsByCategoryId = (
  items: CalculatorDirectoryItem[],
  categoryId: CategoryId,
) => items.filter((item) => item.categoryId === categoryId);

export const getCalculatorCategories = (
  items: CalculatorDirectoryItem[],
  locale: Locale = DEFAULT_LOCALE,
): CalculatorCategory[] => {
  const categories = new Map<CategoryId, CalculatorCategory>();

  items.forEach((item) => {
    const id = item.categoryId;
    const category = categories.get(id);

    if (category) {
      category.count += 1;
      return;
    }

    const metadata = getCategoryLocale(id, locale);

    if (!metadata) {
      return;
    }

    categories.set(id, {
      id,
      slug: metadata.slug,
      label: metadata.label,
      description: metadata.description,
      count: 1,
    });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, LOCALE_CONFIG[locale].formatLocale),
  );
};
