import * as base from "./vat";
import type { VatCountryPreset } from "./vat";

export type {
  ParseVatInputResult,
  VatBreakdown,
  VatCountryPreset,
  VatMode,
} from "./vat";

const rateLabels: Record<string, string> = {
  General: "Standard",
  "Región fronteriza": "Border region",
  "Tasa 0%": "Zero rate",
  Reducido: "Reduced",
  Superreducido: "Super-reduced",
  Reducida: "Reduced",
  "Reducida temporal": "Temporary reduced rate",
  Especial: "Special",
  Básica: "Standard",
  Mínima: "Minimum",
};

const countryNotes: Record<string, string> = {
  mexico:
    "The border-region and zero rates apply only in specific cases.",
  espana:
    "Reduced and super-reduced rates depend on the product or service.",
  argentina: "Some transactions have special rates.",
  colombia: "Some goods are exempt from or excluded from VAT.",
  peru: "The standard rate includes IGV and IPM.",
  "estados-unidos":
    "There is no national VAT. Enter a state or local sales-tax rate manually.",
};

export const VAT_COUNTRY_PRESETS: VatCountryPreset[] =
  base.VAT_COUNTRY_PRESETS.map((country) => ({
    ...country,
    country: country.id === "mexico"
      ? "Mexico"
      : country.id === "espana"
        ? "Spain"
        : country.id === "peru"
          ? "Peru"
          : country.id === "estados-unidos"
            ? "United States"
            : country.country,
    label: country.id === "mexico"
      ? "Mexico"
      : country.id === "espana"
        ? "Spain"
        : country.id === "peru"
          ? "Peru"
          : country.id === "estados-unidos"
            ? "United States"
            : country.label,
    locale: "en-US",
    rates: country.rates.map((rate) => ({
      ...rate,
      label: rateLabels[rate.label] ?? rate.label,
    })),
    notes: countryNotes[country.id] ?? country.notes,
  }));

export const calculateVatFromBase = base.calculateVatFromBase;
export const calculateVatFromTotal = base.calculateVatFromTotal;
export const parseMoneyInput = base.parseMoneyInput;
export const parseRateInput = base.parseRateInput;
export const roundCurrency = base.roundCurrency;

export function formatMoney(
  value: number,
  locale = "en-US",
  currency = "USD",
) {
  return base.formatMoney(value, locale, currency);
}

export function formatNumber(value: number, locale = "en-US") {
  return base.formatNumber(value, locale);
}

export function formatRate(value: number, locale = "en-US") {
  return base.formatRate(value, locale);
}
