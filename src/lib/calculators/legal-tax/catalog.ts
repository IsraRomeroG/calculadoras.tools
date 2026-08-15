import { INDIRECT_TAX_PAGE_DEFINITIONS } from "./indirectTax/variants";

export interface LegalTaxDirectoryEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  categoryId: "legal-impuestos";
  categorySlug: "legal-impuestos";
  order: number;
}

export const LEGAL_TAX_MARKET_DIRECTORY_ITEMS: LegalTaxDirectoryEntry[] =
  INDIRECT_TAX_PAGE_DEFINITIONS.map((page, index) => ({
    id: `${page.marketId}-indirect-tax`,
    title: page.heading,
    description: page.description,
    href: page.path,
    categoryId: "legal-impuestos",
    categorySlug: "legal-impuestos",
    order: 20.1 + index / 100,
  }));
