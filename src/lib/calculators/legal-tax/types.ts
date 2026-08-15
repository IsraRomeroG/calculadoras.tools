export const MARKET_IDS = ["us", "gb", "ca", "au", "nz", "ie", "mx-en"] as const;
export type MarketId = (typeof MARKET_IDS)[number];

export const COUNTRY_CODES = ["US", "GB", "CA", "AU", "NZ", "IE", "MX"] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export const LEGAL_TAX_LOCALES = [
  "en-US",
  "en-GB",
  "en-CA",
  "en-AU",
  "en-NZ",
  "en-IE",
  "en-MX",
  "es-MX",
] as const;
export type LegalTaxLocale = (typeof LEGAL_TAX_LOCALES)[number];

export const LEGAL_TAX_CURRENCIES = ["USD", "GBP", "CAD", "AUD", "NZD", "EUR", "MXN"] as const;
export type LegalTaxCurrency = (typeof LEGAL_TAX_CURRENCIES)[number];

export type CalculatorFamilyId =
  | "indirect-tax"
  | "income-tax"
  | "take-home-pay"
  | "paid-leave"
  | "final-pay"
  | "termination-pay";

export type Coverage = "complete" | "partial" | "manual-only";
export type PublicationStatus = "draft" | "review" | "published" | "suspended";
export type RuleSetStatus =
  | "draft"
  | "independently-reviewed"
  | "current"
  | "historical"
  | "expired"
  | "suspended";

export interface MarketContext {
  locale: LegalTaxLocale;
  marketId: MarketId;
  countryCode: CountryCode;
  jurisdictionCode: string;
  regimeId: string;
  periodId: string;
  currency: LegalTaxCurrency;
}

export interface RoundingPolicy {
  mode: "half-up" | "half-even" | "floor" | "ceil" | "none";
  precision: number;
  stage: "component" | "total" | "none";
}

export interface LegalSource {
  id: string;
  authority: string;
  title: string;
  url: string;
  sourceVersion?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  accessedAt: string;
  appliesTo: string[];
  primary: boolean;
}

export interface OfficialFixtureRef {
  id: string;
  sourceId: string;
  periodId: string;
  description: string;
}

export interface RuleSetEnvelope<TRules = unknown> {
  id: string;
  familyId: CalculatorFamilyId;
  marketId: MarketId;
  countryCode: CountryCode;
  jurisdictionCode: string;
  regimeId: string;
  periodId: string;
  currency: LegalTaxCurrency;
  effectiveFrom: string;
  effectiveTo?: string;
  publishedAt?: string;
  reviewedAt: string;
  reviewDueAt: string;
  status: RuleSetStatus;
  coverage: Coverage;
  missingConcepts: string[];
  assumptions: string[];
  rounding: RoundingPolicy;
  sources: LegalSource[];
  officialFixtures: OfficialFixtureRef[];
  rules: TRules;
}

export interface CalculatorMarketVariant {
  familyId: CalculatorFamilyId;
  variantId: string;
  marketId: MarketId;
  supportedJurisdictions: string[];
  supportedPeriods: string[];
  canonicalPath: string;
  locale: LegalTaxLocale;
  publicationStatus: PublicationStatus;
  coverage: Coverage;
  ruleSetIds: string[];
}

export type RuleResolution<T> =
  | { status: "ready"; ruleSet: RuleSetEnvelope<T> }
  | { status: "partial"; ruleSet: RuleSetEnvelope<T>; missing: string[] }
  | { status: "unsupported"; reasonCode: string; officialHelpUrl?: string }
  | { status: "expired"; availablePeriods: string[] };

export type CalculationRowStatus = "calculated" | "manual" | "not-included" | "not-applicable";

export interface CalculationRow {
  id: string;
  amount: number;
  status: CalculationRowStatus;
  ruleRefs: string[];
}

export interface CalculationResult {
  ruleSetId: string;
  marketId: MarketId;
  jurisdictionCode: string;
  periodId: string;
  currency: LegalTaxCurrency;
  coverage: Coverage;
  rows: CalculationRow[];
  warnings: string[];
  missingConcepts: string[];
}

export interface StoredCalculation<TInputs = Record<string, unknown>> {
  schemaVersion: 1;
  variantId: string;
  ruleSetId: string;
  marketId: MarketId;
  jurisdictionCode: string;
  periodId: string;
  savedAt: string;
  inputs: TInputs;
}
