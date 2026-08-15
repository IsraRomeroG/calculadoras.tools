import { MARKET_DEFINITIONS } from "../markets";
import type { CalculatorMarketVariant, MarketId } from "../types";
import { INDIRECT_TAX_RULE_SETS } from "./rules";

export interface IndirectTaxPageDefinition {
  marketId: MarketId;
  path: string;
  title: string;
  heading: string;
  description: string;
}

export const INDIRECT_TAX_PAGE_DEFINITIONS: IndirectTaxPageDefinition[] = [
  { marketId: "us", path: "/en/legal-tax/us-sales-tax-calculator", title: "US sales tax calculator — California base rate", heading: "US sales tax calculator", description: "Estimate California's statewide sales tax and optionally add a district rate looked up from CDTFA." },
  { marketId: "gb", path: "/en/legal-tax/uk-vat-calculator", title: "UK VAT calculator", heading: "UK VAT calculator", description: "Add or extract UK VAT at a classification you select from HMRC's published rates." },
  { marketId: "ca", path: "/en/legal-tax/canada-gst-hst-calculator", title: "Canada GST/HST calculator", heading: "Canada GST/HST calculator", description: "Estimate GST or HST after choosing the Canadian place of supply; excluded PST or QST is shown explicitly." },
  { marketId: "au", path: "/en/legal-tax/australia-gst-calculator", title: "Australia GST calculator", heading: "Australia GST calculator", description: "Add or extract Australian GST for a simple domestic supply using the selected tax treatment." },
  { marketId: "nz", path: "/en/legal-tax/new-zealand-gst-calculator", title: "New Zealand GST calculator", heading: "New Zealand GST calculator", description: "Add or extract New Zealand GST at 15% or a confirmed zero rate for a simple domestic supply." },
  { marketId: "ie", path: "/en/legal-tax/ireland-vat-calculator", title: "Ireland VAT calculator", heading: "Ireland VAT calculator", description: "Add or extract Irish VAT after choosing a Revenue rate category." },
];

export const INDIRECT_TAX_VARIANTS: CalculatorMarketVariant[] = INDIRECT_TAX_PAGE_DEFINITIONS.map((page) => {
  const rules = INDIRECT_TAX_RULE_SETS.filter((ruleSet) => ruleSet.marketId === page.marketId);
  const market = MARKET_DEFINITIONS[page.marketId];
  return {
    familyId: "indirect-tax",
    variantId: `${page.marketId}-indirect-tax`,
    marketId: page.marketId,
    supportedJurisdictions: rules.map((ruleSet) => ruleSet.jurisdictionCode),
    supportedPeriods: [...new Set(rules.map((ruleSet) => ruleSet.periodId))],
    canonicalPath: page.path,
    locale: market.locale,
    publicationStatus: "published",
    coverage: rules.some((ruleSet) => ruleSet.coverage === "partial") ? "partial" : "complete",
    ruleSetIds: rules.map((ruleSet) => ruleSet.id),
  };
});
