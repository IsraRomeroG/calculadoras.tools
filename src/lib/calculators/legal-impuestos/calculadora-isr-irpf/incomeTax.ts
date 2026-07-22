export const ISR_CANONICAL_PATH = "/legal-impuestos/calculadora-isr-irpf";

export type IncomeTaxMode = "payroll-withholding" | "annual-estimate";
export type IncomeTaxRuleMode = "official" | "manual";
export type IncomeTaxFrequency =
  | "daily"
  | "weekly"
  | "every_10_days"
  | "biweekly"
  | "monthly"
  | "annual";

export interface TaxBracket {
  lowerBound: number;
  upperBound?: number;
  fixedAmount: number;
  marginalRate: number;
}

export interface TaxFrequencyRule {
  id: IncomeTaxFrequency;
  label: string;
  tableLabel: string;
  periodsPerYear?: number;
  table: TaxBracket[];
}

export interface IncomeTaxPreset {
  id: string;
  countryCode: "MX";
  country: "México";
  taxName: "ISR";
  jurisdiction: "Federal";
  regime: "Sueldos y salarios";
  period: "2026";
  currency: "MXN";
  locale: "es-MX";
  status: "current" | "historical" | "expired" | "draft";
  effectiveFrom: string;
  reviewedAt: string;
  sourceName: string;
  sourceUrl: string;
  sourceLandingUrl: string;
  sourceVersion: string;
  frequencies: TaxFrequencyRule[];
}

export interface IncomeTaxInput {
  mode: IncomeTaxMode;
  ruleMode?: IncomeTaxRuleMode;
  frequency: IncomeTaxFrequency;
  taxableBase: number;
  comparableRetention?: number;
  manualRate?: number;
}

export interface IncomeTaxResult {
  status: "valid" | "manual" | "historical";
  mode: IncomeTaxMode;
  ruleMode: IncomeTaxRuleMode;
  frequency: TaxFrequencyRule;
  scopeLabel: string;
  taxableBase: number;
  bracket: TaxBracket | null;
  excess: number;
  taxBeforeCredits: number;
  creditsApplied: number;
  tax: number;
  marginalRate: number;
  effectiveRate: number;
  comparableRetention: number | null;
  balance: number;
  balanceLabel: "a pagar" | "a favor" | "sin diferencia" | "sin retención";
  sourceName: string;
  sourceUrl: string | null;
  warnings: string[];
}

export type ParseIncomeTaxMoneyResult =
  | { ok: true; value: number; normalized: string }
  | { ok: false; error: "required" | "invalid" | "negative" | "too_large" };

const SOURCE_URL =
  "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf";
const SOURCE_LANDING_URL =
  "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html";

const DAILY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 27.78, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 27.79, upperBound: 235.81, fixedAmount: 0.53, marginalRate: 6.4 },
  { lowerBound: 235.82, upperBound: 414.41, fixedAmount: 13.85, marginalRate: 10.88 },
  { lowerBound: 414.42, upperBound: 481.73, fixedAmount: 33.28, marginalRate: 16 },
  { lowerBound: 481.74, upperBound: 576.76, fixedAmount: 44.05, marginalRate: 17.92 },
  { lowerBound: 576.77, upperBound: 1163.25, fixedAmount: 61.08, marginalRate: 21.36 },
  { lowerBound: 1163.26, upperBound: 1833.44, fixedAmount: 186.35, marginalRate: 23.52 },
  { lowerBound: 1833.45, upperBound: 3500.35, fixedAmount: 343.98, marginalRate: 30 },
  { lowerBound: 3500.36, upperBound: 4667.13, fixedAmount: 844.05, marginalRate: 32 },
  { lowerBound: 4667.14, upperBound: 14001.38, fixedAmount: 1217.42, marginalRate: 34 },
  { lowerBound: 14001.39, fixedAmount: 4391.07, marginalRate: 35 },
];

const WEEKLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 194.46, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 194.47, upperBound: 1650.67, fixedAmount: 3.71, marginalRate: 6.4 },
  { lowerBound: 1650.68, upperBound: 2900.87, fixedAmount: 96.95, marginalRate: 10.88 },
  { lowerBound: 2900.88, upperBound: 3372.11, fixedAmount: 232.96, marginalRate: 16 },
  { lowerBound: 3372.12, upperBound: 4037.32, fixedAmount: 308.35, marginalRate: 17.92 },
  { lowerBound: 4037.33, upperBound: 8142.75, fixedAmount: 427.56, marginalRate: 21.36 },
  { lowerBound: 8142.76, upperBound: 12834.08, fixedAmount: 1304.45, marginalRate: 23.52 },
  { lowerBound: 12834.09, upperBound: 24502.45, fixedAmount: 2407.86, marginalRate: 30 },
  { lowerBound: 24502.46, upperBound: 32669.91, fixedAmount: 5908.35, marginalRate: 32 },
  { lowerBound: 32669.92, upperBound: 98009.66, fixedAmount: 8521.94, marginalRate: 34 },
  { lowerBound: 98009.67, fixedAmount: 30737.49, marginalRate: 35 },
];

const TEN_DAY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 277.8, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 277.81, upperBound: 2358.1, fixedAmount: 5.3, marginalRate: 6.4 },
  { lowerBound: 2358.11, upperBound: 4144.1, fixedAmount: 138.5, marginalRate: 10.88 },
  { lowerBound: 4144.11, upperBound: 4817.3, fixedAmount: 332.8, marginalRate: 16 },
  { lowerBound: 4817.31, upperBound: 5767.6, fixedAmount: 440.5, marginalRate: 17.92 },
  { lowerBound: 5767.61, upperBound: 11632.5, fixedAmount: 610.8, marginalRate: 21.36 },
  { lowerBound: 11632.51, upperBound: 18334.4, fixedAmount: 1863.5, marginalRate: 23.52 },
  { lowerBound: 18334.41, upperBound: 35003.5, fixedAmount: 3439.8, marginalRate: 30 },
  { lowerBound: 35003.51, upperBound: 46671.3, fixedAmount: 8440.5, marginalRate: 32 },
  { lowerBound: 46671.31, upperBound: 140013.8, fixedAmount: 12174.2, marginalRate: 34 },
  { lowerBound: 140013.81, fixedAmount: 43910.7, marginalRate: 35 },
];

const BIWEEKLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 416.7, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 416.71, upperBound: 3537.15, fixedAmount: 7.95, marginalRate: 6.4 },
  { lowerBound: 3537.16, upperBound: 6216.15, fixedAmount: 207.75, marginalRate: 10.88 },
  { lowerBound: 6216.16, upperBound: 7225.95, fixedAmount: 499.2, marginalRate: 16 },
  { lowerBound: 7225.96, upperBound: 8651.4, fixedAmount: 660.75, marginalRate: 17.92 },
  { lowerBound: 8651.41, upperBound: 17448.75, fixedAmount: 916.2, marginalRate: 21.36 },
  { lowerBound: 17448.76, upperBound: 27501.6, fixedAmount: 2795.25, marginalRate: 23.52 },
  { lowerBound: 27501.61, upperBound: 52505.25, fixedAmount: 5159.7, marginalRate: 30 },
  { lowerBound: 52505.26, upperBound: 70006.95, fixedAmount: 12660.75, marginalRate: 32 },
  { lowerBound: 70006.96, upperBound: 210020.7, fixedAmount: 18261.3, marginalRate: 34 },
  { lowerBound: 210020.71, fixedAmount: 65866.05, marginalRate: 35 },
];

const MONTHLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 844.59, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 844.6, upperBound: 7168.51, fixedAmount: 16.22, marginalRate: 6.4 },
  { lowerBound: 7168.52, upperBound: 12598.02, fixedAmount: 420.95, marginalRate: 10.88 },
  { lowerBound: 12598.03, upperBound: 14644.64, fixedAmount: 1011.68, marginalRate: 16 },
  { lowerBound: 14644.65, upperBound: 17533.64, fixedAmount: 1339.14, marginalRate: 17.92 },
  { lowerBound: 17533.65, upperBound: 35362.83, fixedAmount: 1856.84, marginalRate: 21.36 },
  { lowerBound: 35362.84, upperBound: 55736.68, fixedAmount: 5665.16, marginalRate: 23.52 },
  { lowerBound: 55736.69, upperBound: 106410.5, fixedAmount: 10457.09, marginalRate: 30 },
  { lowerBound: 106410.51, upperBound: 141880.66, fixedAmount: 25659.23, marginalRate: 32 },
  { lowerBound: 141880.67, upperBound: 425641.99, fixedAmount: 37009.69, marginalRate: 34 },
  { lowerBound: 425642, fixedAmount: 133488.54, marginalRate: 35 },
];

const ANNUAL_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 10135.11, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 10135.12, upperBound: 86022.11, fixedAmount: 194.59, marginalRate: 6.4 },
  { lowerBound: 86022.12, upperBound: 151176.19, fixedAmount: 5051.37, marginalRate: 10.88 },
  { lowerBound: 151176.2, upperBound: 175735.66, fixedAmount: 12140.13, marginalRate: 16 },
  { lowerBound: 175735.67, upperBound: 210403.69, fixedAmount: 16069.64, marginalRate: 17.92 },
  { lowerBound: 210403.7, upperBound: 424353.97, fixedAmount: 22282.14, marginalRate: 21.36 },
  { lowerBound: 424353.98, upperBound: 668840.14, fixedAmount: 67981.92, marginalRate: 23.52 },
  { lowerBound: 668840.15, upperBound: 1276925.98, fixedAmount: 125485.07, marginalRate: 30 },
  { lowerBound: 1276925.99, upperBound: 1702567.97, fixedAmount: 307910.81, marginalRate: 32 },
  { lowerBound: 1702567.98, upperBound: 5107703.92, fixedAmount: 444116.23, marginalRate: 34 },
  { lowerBound: 5107703.93, fixedAmount: 1601862.46, marginalRate: 35 },
];

export const MEXICO_ISR_FREQUENCIES: TaxFrequencyRule[] = [
  { id: "daily", label: "Por día trabajado", tableLabel: "Tabla diaria", periodsPerYear: 365, table: DAILY_TAX_BRACKETS },
  { id: "weekly", label: "Semanal (7 días)", tableLabel: "Tabla de 7 días", periodsPerYear: 52, table: WEEKLY_TAX_BRACKETS },
  { id: "every_10_days", label: "Cada 10 días", tableLabel: "Tabla de 10 días", periodsPerYear: 36.5, table: TEN_DAY_TAX_BRACKETS },
  { id: "biweekly", label: "Quincenal (15 días)", tableLabel: "Tabla de 15 días", periodsPerYear: 24, table: BIWEEKLY_TAX_BRACKETS },
  { id: "monthly", label: "Mensual", tableLabel: "Tabla mensual", periodsPerYear: 12, table: MONTHLY_TAX_BRACKETS },
  { id: "annual", label: "Anual", tableLabel: "Ejercicio 2026", periodsPerYear: 1, table: ANNUAL_TAX_BRACKETS },
];

export const MEXICO_ISR_PRESET: IncomeTaxPreset = {
  id: "mx-salarios-isr-2026",
  countryCode: "MX",
  country: "México",
  taxName: "ISR",
  jurisdiction: "Federal",
  regime: "Sueldos y salarios",
  period: "2026",
  currency: "MXN",
  locale: "es-MX",
  status: "current",
  effectiveFrom: "2026-01-01",
  reviewedAt: "2026-07-21",
  sourceName: "SAT · Anexo 8 RMF 2026",
  sourceUrl: SOURCE_URL,
  sourceLandingUrl: SOURCE_LANDING_URL,
  sourceVersion: "DOF 28-12-2025",
  frequencies: MEXICO_ISR_FREQUENCIES,
};

export function getIncomeTaxFrequency(frequency: IncomeTaxFrequency) {
  const rule = MEXICO_ISR_FREQUENCIES.find((item) => item.id === frequency);

  if (!rule) {
    throw new RangeError("Frecuencia fiscal no compatible.");
  }

  return rule;
}

export function calculateIncomeTax(
  input: IncomeTaxInput,
  preset: IncomeTaxPreset = MEXICO_ISR_PRESET,
): IncomeTaxResult {
  const ruleMode = input.ruleMode ?? "official";
  validateInput(input, ruleMode, preset);

  const frequency = getIncomeTaxFrequency(input.frequency);
  const comparableRetention = input.comparableRetention ?? null;
  const isManual = ruleMode === "manual";
  const bracket = isManual ? null : findBracket(input.taxableBase, frequency.table);
  const marginalRate = isManual ? input.manualRate ?? 0 : bracket?.marginalRate ?? 0;
  const excess = bracket ? Math.max(0, input.taxableBase - bracket.lowerBound) : 0;
  const taxBeforeCredits = isManual
    ? input.taxableBase * (marginalRate / 100)
    : bracket
      ? bracket.fixedAmount + excess * (bracket.marginalRate / 100)
      : 0;
  const creditsApplied = 0;
  const tax = Math.max(0, taxBeforeCredits - creditsApplied);
  const balance = comparableRetention === null ? tax : tax - comparableRetention;

  return {
    status: isManual ? "manual" : preset.status === "historical" ? "historical" : "valid",
    mode: input.mode,
    ruleMode,
    frequency,
    scopeLabel: input.mode === "annual-estimate" ? "ejercicio anual 2026" : `retención ${frequency.label.toLowerCase()}`,
    taxableBase: input.taxableBase,
    bracket,
    excess,
    taxBeforeCredits,
    creditsApplied,
    tax,
    marginalRate,
    effectiveRate: input.taxableBase > 0 ? tax / input.taxableBase : 0,
    comparableRetention,
    balance,
    balanceLabel:
      comparableRetention === null
        ? "sin retención"
        : Math.abs(balance) < 0.005
          ? "sin diferencia"
          : balance > 0
            ? "a pagar"
            : "a favor",
    sourceName: isManual ? "Parámetros introducidos manualmente" : preset.sourceName,
    sourceUrl: isManual ? null : preset.sourceUrl,
    warnings: [
      isManual
        ? "La tasa fue introducida manualmente y no representa una tarifa oficial vigente."
        : "El cálculo usa la tarifa seleccionada, pero no incluye deducciones personales ni otros conceptos no capturados.",
      "El resultado es informativo y no sustituye una declaración, retención oficial ni asesoría fiscal.",
    ],
  };
}

export function parseIncomeTaxMoneyInput(value: string): ParseIncomeTaxMoneyResult {
  const trimmed = value.trim();

  if (!trimmed) return { ok: false, error: "required" };
  if (/[-−]/.test(trimmed)) return { ok: false, error: "negative" };

  const cleaned = trimmed
    .replace(/\bMXN\b/gi, "")
    .replace(/[$€£¥\s]/g, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) return { ok: false, error: "invalid" };
  if (numericValue > 1_000_000_000_000) return { ok: false, error: "too_large" };

  return { ok: true, value: numericValue, normalized };
}

export function parseOptionalIncomeTaxMoneyInput(value: string): ParseIncomeTaxMoneyResult {
  return value.trim()
    ? parseIncomeTaxMoneyInput(value)
    : { ok: true, value: 0, normalized: "0" };
}

export function parseIncomeTaxRateInput(value: string): ParseIncomeTaxMoneyResult {
  const parsed = parseIncomeTaxMoneyInput(value);

  if (!parsed.ok) return parsed;
  if (parsed.value > 100) return { ok: false, error: "too_large" };

  return parsed;
}

export function formatIncomeTaxMoney(value: number): string {
  return new Intl.NumberFormat(MEXICO_ISR_PRESET.locale, {
    style: "currency",
    currency: MEXICO_ISR_PRESET.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatIncomeTaxPercent(value: number): string {
  return new Intl.NumberFormat(MEXICO_ISR_PRESET.locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildIncomeTaxShareText(result: IncomeTaxResult): string {
  const lines = [
    `ISR estimado (${result.scopeLabel}): ${formatIncomeTaxMoney(result.tax)}`,
    `Base gravable: ${formatIncomeTaxMoney(result.taxableBase)}`,
    `Tasa efectiva: ${formatIncomeTaxPercent(result.effectiveRate)}`,
    `Tasa marginal: ${formatIncomeTaxPercent(result.marginalRate / 100)}`,
  ];

  if (result.comparableRetention !== null) {
    lines.push(
      `Retención comparable: ${formatIncomeTaxMoney(result.comparableRetention)}`,
      `Saldo estimado ${result.balanceLabel}: ${formatIncomeTaxMoney(Math.abs(result.balance))}`,
    );
  }

  lines.push("Estimación informativa. Reglas: SAT · Anexo 8 RMF 2026.");
  return lines.join("\n");
}

function validateInput(
  input: IncomeTaxInput,
  ruleMode: IncomeTaxRuleMode,
  preset: IncomeTaxPreset,
) {
  if (!Number.isFinite(input.taxableBase) || input.taxableBase < 0) {
    throw new RangeError("La base gravable debe ser mayor o igual a cero.");
  }

  if (input.taxableBase > 1_000_000_000_000) {
    throw new RangeError("La base gravable es demasiado alta para este cálculo.");
  }

  if (
    input.comparableRetention !== undefined &&
    (!Number.isFinite(input.comparableRetention) || input.comparableRetention < 0)
  ) {
    throw new RangeError("La retención debe ser mayor o igual a cero.");
  }

  if (input.mode === "annual-estimate" && input.frequency !== "annual") {
    throw new RangeError("El impuesto anual debe usar la frecuencia anual.");
  }

  if (input.mode === "payroll-withholding" && input.frequency === "annual") {
    throw new RangeError("La retención de nómina debe usar una frecuencia de pago.");
  }

  if (ruleMode === "official" && preset.status !== "current" && preset.status !== "historical") {
    throw new RangeError("El preset fiscal no está disponible para calcular.");
  }

  if (ruleMode === "manual" &&
    (!Number.isFinite(input.manualRate) || (input.manualRate ?? -1) < 0 || (input.manualRate ?? 101) > 100)) {
    throw new RangeError("La tasa manual debe estar entre 0% y 100%.");
  }
}

function findBracket(base: number, brackets: TaxBracket[]) {
  if (base === 0) return null;

  const bracket = [...brackets]
    .sort((a, b) => a.lowerBound - b.lowerBound)
    .reverse()
    .find((item) => base >= item.lowerBound);

  if (!bracket) throw new RangeError("La base gravable no coincide con ningún tramo fiscal.");
  return bracket;
}

function normalizeSeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (!decimalPart || !isValidGroupedInteger(integerPart, groupingSeparator)) return undefined;
    return `${integerPart.split(groupingSeparator).join("")}.${decimalPart}`;
  }

  if (lastComma !== -1) return normalizeSingleSeparator(value, ",");
  if (lastDot !== -1) return normalizeSingleSeparator(value, ".");
  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | ".") {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionOrGroup] = parts;
    if (!integerPart || !fractionOrGroup) return undefined;
    if (fractionOrGroup.length === 3 && integerPart.length <= 3) {
      return `${integerPart}${fractionOrGroup}`;
    }
    return `${integerPart}.${fractionOrGroup}`;
  }

  if (parts.length > 2 && parts.every(Boolean) && parts.slice(1).every((part) => part.length === 3)) {
    return parts.join("");
  }

  return undefined;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);
  return /^\d{1,3}$/.test(groups[0]) && groups.slice(1).every((group) => /^\d{3}$/.test(group));
}

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
