import { INDIRECT_TAX_PAGE_DEFINITIONS } from "./indirectTax/variants";
import { INCOME_TAX_PAGE_DEFINITIONS, PAYROLL_PAGE_DEFINITIONS } from "./incomeTax/variants";
import { EMPLOYMENT_PAGE_DEFINITIONS } from "./employment/variants";
import { MARKET_DEFINITIONS } from "./markets";

export type LegalTaxTaskGroup = "indirect-tax" | "income-tax" | "take-home-pay" | "employment";

export interface LegalTaxDirectoryEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  categoryId: "legal-impuestos";
  categorySlug: "legal-impuestos";
  order: number;
  taskGroup: LegalTaxTaskGroup;
  countryLabel: string;
}

const pageItems = (pages: typeof INCOME_TAX_PAGE_DEFINITIONS, order: number, family: string, taskGroup: LegalTaxTaskGroup): LegalTaxDirectoryEntry[] => pages.map((page, index) => ({
  id: `${page.marketId}-${family}`,
  title: page.heading,
  description: page.description,
  href: page.path,
  categoryId: "legal-impuestos",
  categorySlug: "legal-impuestos",
  order: order + (index + 1) / 100,
  taskGroup,
  countryLabel: MARKET_DEFINITIONS[page.marketId].countryName,
}));

export const LEGAL_TAX_MARKET_DIRECTORY_ITEMS: LegalTaxDirectoryEntry[] = [
  ...INDIRECT_TAX_PAGE_DEFINITIONS.map((page, index) => ({
    id: `${page.marketId}-indirect-tax`,
    title: page.heading,
    description: page.description,
    href: page.path,
    categoryId: "legal-impuestos",
    categorySlug: "legal-impuestos",
    order: 20.1 + index / 100,
    taskGroup: "indirect-tax" as const,
    countryLabel: MARKET_DEFINITIONS[page.marketId].countryName,
  })),
  { id: "income-tax-market-hub", title: "Income tax calculators by country", description: "Choose the country and rule period before estimating annual income tax.", href: "/en/legal-tax/income-tax-calculators", categoryId: "legal-impuestos", categorySlug: "legal-impuestos", order: 21, taskGroup: "income-tax", countryLabel: "Choose a country" },
  ...pageItems(INCOME_TAX_PAGE_DEFINITIONS, 21, "income-tax", "income-tax"),
  { id: "take-home-pay-market-hub", title: "Take-home pay calculators by country", description: "Choose the country and jurisdiction before projecting taxes, employee contributions and net pay.", href: "/en/legal-tax/take-home-pay-calculators", categoryId: "legal-impuestos", categorySlug: "legal-impuestos", order: 22, taskGroup: "take-home-pay", countryLabel: "Choose a country" },
  ...pageItems(PAYROLL_PAGE_DEFINITIONS, 22, "take-home-pay", "take-home-pay"),
  ...EMPLOYMENT_PAGE_DEFINITIONS.map((page, index) => ({
    id: page.variantId,
    title: page.heading,
    description: page.description,
    href: page.path,
    categoryId: "legal-impuestos" as const,
    categorySlug: "legal-impuestos" as const,
    order: 23 + (index + 1) / 100,
    taskGroup: "employment" as const,
    countryLabel: MARKET_DEFINITIONS[page.marketId].countryName,
  })),
];
