import { MARKET_DEFINITIONS } from "../markets";
import type { CalculatorMarketVariant, MarketId } from "../types";
import { INCOME_TAX_RULE_SETS, PAYROLL_RULE_SETS } from "./rules";

export interface TaxPageDefinition { marketId: MarketId; path: string; title: string; heading: string; description: string }
export const INCOME_TAX_PAGE_DEFINITIONS: TaxPageDefinition[] = [
  { marketId: "us", path: "/en/legal-tax/us-federal-income-tax-calculator", title: "US federal income tax calculator 2026", heading: "US federal income tax calculator", description: "Estimate 2026 US federal income tax using the selected filing status and standard deduction; state and local tax are excluded." },
  { marketId: "gb", path: "/en/legal-tax/uk-income-tax-calculator", title: "UK income tax calculator 2026–27", heading: "UK income tax calculator", description: "Estimate 2026–27 employment Income Tax after choosing Scotland or the rest-of-UK rate bands." },
  { marketId: "ca", path: "/en/legal-tax/canada-income-tax-calculator", title: "Canada income tax calculator 2026 — Ontario", heading: "Canada income tax calculator", description: "Estimate 2026 federal and Ontario base income tax; Ontario surtax and Health Premium are listed as excluded." },
  { marketId: "au", path: "/en/legal-tax/australia-income-tax-calculator", title: "Australia income tax calculator 2026–27", heading: "Australia income tax calculator", description: "Estimate resident individual income tax for the 2026–27 Australian income year." },
  { marketId: "nz", path: "/en/legal-tax/new-zealand-income-tax-calculator", title: "New Zealand income tax calculator 2026–27", heading: "New Zealand income tax calculator", description: "Estimate individual income tax for New Zealand's 2026–27 income year." },
  { marketId: "ie", path: "/en/legal-tax/ireland-income-tax-calculator", title: "Ireland income tax calculator 2026", heading: "Ireland income tax calculator", description: "Estimate 2026 PAYE Income Tax using a supported assessment profile and standard credits." },
];
export const PAYROLL_PAGE_DEFINITIONS: TaxPageDefinition[] = [
  { marketId: "us", path: "/en/legal-tax/us-paycheck-calculator", title: "US paycheck calculator 2026 — federal projection", heading: "US paycheck calculator", description: "Project federal income tax and employee FICA; exact Form W-4 and state/local withholding are excluded." },
  { marketId: "gb", path: "/en/legal-tax/uk-take-home-pay-calculator", title: "UK take-home pay calculator 2026–27", heading: "UK take-home pay calculator", description: "Project PAYE Income Tax and employee National Insurance category A for 2026–27." },
  { marketId: "ca", path: "/en/legal-tax/canada-paycheck-calculator", title: "Canada paycheck calculator 2026 — Ontario", heading: "Canada paycheck calculator", description: "Project federal/Ontario base tax, CPP/CPP2 and EI for an Ontario employee." },
  { marketId: "au", path: "/en/legal-tax/australia-take-home-pay-calculator", title: "Australia take-home pay calculator 2026–27", heading: "Australia take-home pay calculator", description: "Project resident income tax and the full-rate Medicare levy; PAYG schedule differences are disclosed." },
  { marketId: "nz", path: "/en/legal-tax/new-zealand-pay-calculator", title: "New Zealand pay calculator 2026–27", heading: "New Zealand pay calculator", description: "Project income tax and the ACC earners' levy; KiwiSaver and student loan remain optional exclusions." },
  { marketId: "ie", path: "/en/legal-tax/ireland-take-home-pay-calculator", title: "Ireland take-home pay calculator 2026", heading: "Ireland take-home pay calculator", description: "Project PAYE Income Tax, USC and employee PRSI Class A for the selected 2026 pay-date phase." },
];

const variants = (familyId: "income-tax" | "take-home-pay", pages: TaxPageDefinition[]) => pages.map((page): CalculatorMarketVariant => {
  const sets = (familyId === "income-tax" ? INCOME_TAX_RULE_SETS : PAYROLL_RULE_SETS).filter((item) => item.marketId === page.marketId);
  return { familyId, variantId: `${page.marketId}-${familyId}`, marketId: page.marketId, supportedJurisdictions: sets.map((item) => item.jurisdictionCode), supportedPeriods: [...new Set(sets.map((item) => item.periodId))], canonicalPath: page.path, locale: MARKET_DEFINITIONS[page.marketId].locale, publicationStatus: "published", coverage: "partial", ruleSetIds: sets.map((item) => item.id) };
});
export const INCOME_TAX_VARIANTS = variants("income-tax", INCOME_TAX_PAGE_DEFINITIONS);
export const PAYROLL_VARIANTS = variants("take-home-pay", PAYROLL_PAGE_DEFINITIONS);
