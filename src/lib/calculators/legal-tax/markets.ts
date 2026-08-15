import type { CountryCode, LegalTaxCurrency, LegalTaxLocale, MarketId } from "./types";

export interface MarketDefinition {
  marketId: MarketId;
  countryCode: CountryCode;
  countryName: string;
  locale: Exclude<LegalTaxLocale, "es-MX">;
  currency: LegalTaxCurrency;
  periodLabel: string;
}

export const MARKET_DEFINITIONS: Record<MarketId, MarketDefinition> = {
  us: { marketId: "us", countryCode: "US", countryName: "United States", locale: "en-US", currency: "USD", periodLabel: "calendar year" },
  gb: { marketId: "gb", countryCode: "GB", countryName: "United Kingdom", locale: "en-GB", currency: "GBP", periodLabel: "6 April to 5 April" },
  ca: { marketId: "ca", countryCode: "CA", countryName: "Canada", locale: "en-CA", currency: "CAD", periodLabel: "calendar year" },
  au: { marketId: "au", countryCode: "AU", countryName: "Australia", locale: "en-AU", currency: "AUD", periodLabel: "1 July to 30 June" },
  nz: { marketId: "nz", countryCode: "NZ", countryName: "New Zealand", locale: "en-NZ", currency: "NZD", periodLabel: "1 April to 31 March" },
  ie: { marketId: "ie", countryCode: "IE", countryName: "Ireland", locale: "en-IE", currency: "EUR", periodLabel: "calendar year" },
  "mx-en": { marketId: "mx-en", countryCode: "MX", countryName: "Mexico", locale: "en-MX", currency: "MXN", periodLabel: "rule-specific period" },
};

export function getMarketDefinition(marketId: MarketId) {
  return MARKET_DEFINITIONS[marketId];
}
