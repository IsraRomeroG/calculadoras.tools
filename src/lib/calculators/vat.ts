export type VatMode = "addVat" | "extractVat";

export type ParseVatInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface VatBreakdown {
  base: number;
  tax: number;
  total: number;
  rate: number;
}

export interface VatCountryPreset {
  id: string;
  country: string;
  label: string;
  locale: string;
  currency: string;
  symbol: string;
  defaultRate: number | null;
  rates: Array<{
    label: string;
    value: number;
    note?: string;
  }>;
  sourceName?: string;
  lastReviewed?: string;
  notes?: string;
}

export const VAT_COUNTRY_PRESETS: VatCountryPreset[] = [
  {
    id: "mexico",
    country: "México",
    label: "México",
    locale: "es-MX",
    currency: "MXN",
    symbol: "$",
    defaultRate: 16,
    rates: [
      { label: "General", value: 16 },
      { label: "Región fronteriza", value: 8 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "SAT / Ley del IVA",
    lastReviewed: "2026-05-15",
    notes: "La región fronteriza y la tasa 0% aplican solo en casos específicos.",
  },
  {
    id: "espana",
    country: "España",
    label: "España",
    locale: "es-ES",
    currency: "EUR",
    symbol: "€",
    defaultRate: 21,
    rates: [
      { label: "General", value: 21 },
      { label: "Reducido", value: 10 },
      { label: "Superreducido", value: 4 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "Agencia Tributaria",
    lastReviewed: "2026-05-15",
    notes: "Los tipos reducido y superreducido dependen del bien o servicio.",
  },
  {
    id: "argentina",
    country: "Argentina",
    label: "Argentina",
    locale: "es-AR",
    currency: "ARS",
    symbol: "$",
    defaultRate: 21,
    rates: [
      { label: "General", value: 21 },
      { label: "Reducida", value: 10.5 },
      { label: "Especial", value: 27 },
    ],
    sourceName: "ARCA",
    lastReviewed: "2026-05-15",
    notes: "Algunas operaciones tienen alícuotas especiales.",
  },
  {
    id: "colombia",
    country: "Colombia",
    label: "Colombia",
    locale: "es-CO",
    currency: "COP",
    symbol: "$",
    defaultRate: 19,
    rates: [
      { label: "General", value: 19 },
      { label: "Reducida", value: 5 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "DIAN",
    lastReviewed: "2026-05-15",
    notes: "Existen bienes exentos y excluidos del IVA.",
  },
  {
    id: "chile",
    country: "Chile",
    label: "Chile",
    locale: "es-CL",
    currency: "CLP",
    symbol: "$",
    defaultRate: 19,
    rates: [
      { label: "General", value: 19 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "SII",
    lastReviewed: "2026-05-15",
  },
  {
    id: "peru",
    country: "Perú",
    label: "Perú",
    locale: "es-PE",
    currency: "PEN",
    symbol: "S/",
    defaultRate: 18,
    rates: [
      { label: "General", value: 18 },
      { label: "Reducida temporal", value: 10.5 },
    ],
    sourceName: "SUNAT",
    lastReviewed: "2026-05-15",
    notes: "La tasa general corresponde a IGV + IPM.",
  },
  {
    id: "ecuador",
    country: "Ecuador",
    label: "Ecuador",
    locale: "es-EC",
    currency: "USD",
    symbol: "$",
    defaultRate: 15,
    rates: [
      { label: "General", value: 15 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "SRI",
    lastReviewed: "2026-05-15",
  },
  {
    id: "guatemala",
    country: "Guatemala",
    label: "Guatemala",
    locale: "es-GT",
    currency: "GTQ",
    symbol: "Q",
    defaultRate: 12,
    rates: [
      { label: "General", value: 12 },
      { label: "Tasa 0%", value: 0 },
    ],
    sourceName: "SAT Guatemala",
    lastReviewed: "2026-05-15",
  },
  {
    id: "costa-rica",
    country: "Costa Rica",
    label: "Costa Rica",
    locale: "es-CR",
    currency: "CRC",
    symbol: "₡",
    defaultRate: 13,
    rates: [
      { label: "General", value: 13 },
      { label: "Reducida", value: 4 },
      { label: "Reducida", value: 2 },
      { label: "Reducida", value: 1 },
    ],
    sourceName: "Ministerio de Hacienda",
    lastReviewed: "2026-05-15",
  },
  {
    id: "uruguay",
    country: "Uruguay",
    label: "Uruguay",
    locale: "es-UY",
    currency: "UYU",
    symbol: "$",
    defaultRate: 22,
    rates: [
      { label: "Básica", value: 22 },
      { label: "Mínima", value: 10 },
    ],
    sourceName: "DGI",
    lastReviewed: "2026-05-15",
  },
  {
    id: "estados-unidos",
    country: "Estados Unidos",
    label: "EE.UU.",
    locale: "en-US",
    currency: "USD",
    symbol: "$",
    defaultRate: null,
    rates: [],
    sourceName: "IRS / USAGov",
    lastReviewed: "2026-05-15",
    notes: "No hay IVA nacional. Usa una tasa manual de sales tax estatal o local.",
  },
];

export function calculateVatFromBase(base: number, rate: number): VatBreakdown {
  const tax = base * (rate / 100);

  return {
    base,
    tax,
    total: base + tax,
    rate,
  };
}

export function calculateVatFromTotal(
  total: number,
  rate: number,
): VatBreakdown {
  const divisor = 1 + rate / 100;
  const base = divisor === 0 ? 0 : total / divisor;
  const tax = total - base;

  return {
    base,
    tax,
    total,
    rate,
  };
}

export function parseMoneyInput(value: string): ParseVatInputResult {
  return parseNumericInput(value, {
    maxDecimals: 4,
    preferDecimal: false,
  });
}

export function parseRateInput(value: string): ParseVatInputResult {
  return parseNumericInput(value, {
    maxDecimals: 4,
    preferDecimal: true,
  });
}

export function formatMoney(
  value: number,
  locale = "es-MX",
  currency = "MXN",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatNumber(value: number, locale = "es-MX"): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 4,
  }).format(roundToFour(value));
}

export function formatRate(value: number, locale = "es-MX"): string {
  return `${formatNumber(value, locale)}%`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundToFour(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseVatInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, options.preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > options.maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "");
}

function normalizeSeparators(value: string, preferDecimal: boolean): string {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",", preferDecimal);
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".", preferDecimal);
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
  preferDecimal: boolean,
): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (
      !preferDecimal &&
      separator === "," &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return value;
}
