export const DEPRECIATION_MODES = [
  "percentage",
  "lineal",
  "observed-value",
] as const;

export type DepreciationMode = (typeof DEPRECIATION_MODES)[number];

export type ParseDecimalResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export interface DepreciationYearRow {
  year: number;
  value: number;
  lossThisYear: number;
  accumulatedLoss: number;
  depreciatedPercent: number;
  remainingPercent: number;
}

export interface SensitivityScenario {
  id: "conservador" | "base" | "agresivo";
  label: string;
  annualRate: number;
  finalValue: number;
  accumulatedLoss: number;
  depreciatedPercent: number;
}

export interface VehicleDepreciationInput {
  mode: DepreciationMode;
  initialValue: number;
  years: number;
  annualRatePercent?: number;
  firstYearRatePercent?: number;
  residualValue?: number;
  currentValue?: number;
  sensitivityStepPercent?: number;
  currency?: string;
}

export interface VehicleDepreciationResult {
  mode: DepreciationMode;
  initialValue: number;
  years: number;
  finalValue: number;
  accumulatedLoss: number;
  depreciatedPercent: number;
  averageAnnualLoss: number;
  equivalentAnnualRate: number;
  annualRate?: number;
  firstYearRate?: number;
  residualValue?: number;
  currentValue?: number;
  rows: DepreciationYearRow[];
  scenarios: SensitivityScenario[];
  currency: string;
}

export function calculateVehicleDepreciation(
  input: VehicleDepreciationInput,
): VehicleDepreciationResult {
  validateMode(input.mode);
  validatePositiveFinite(input.initialValue, "initial value");
  validatePositiveInteger(input.years, "term");

  if (input.years > 50) {
    throw new RangeError("term must be less than or equal to 50.");
  }

  if (input.mode === "percentage") {
    return calculatePercentageDepreciation(input);
  }

  if (input.mode === "lineal") {
    return calculateLinearDepreciation(input);
  }

  return calculateObservedDepreciation(input);
}

export function calculatePercentageDepreciation(
  input: VehicleDepreciationInput,
): VehicleDepreciationResult {
  validatePositiveFinite(input.initialValue, "initial value");
  validatePositiveInteger(input.years, "term");

  if (input.annualRatePercent === undefined) {
    throw new RangeError("annual rate is required.");
  }

  const annualRate = normalizePercent(input.annualRatePercent, "annual rate");
  const firstYearRate =
    input.firstYearRatePercent === undefined
      ? undefined
      : normalizePercent(input.firstYearRatePercent, "first-year rate");
  const values = [input.initialValue];

  for (let year = 1; year <= input.years; year += 1) {
    const previousValue = values[year - 1];
    const rate = year === 1 && firstYearRate !== undefined ? firstYearRate : annualRate;

    values.push(previousValue * (1 - rate));
  }

  return buildResult({
    mode: "percentage",
    initialValue: input.initialValue,
    years: input.years,
    values,
    annualRate,
    firstYearRate,
    sensitivityStepPercent: input.sensitivityStepPercent,
    currency: input.currency,
  });
}

export function calculateLinearDepreciation(
  input: VehicleDepreciationInput,
): VehicleDepreciationResult {
  validatePositiveFinite(input.initialValue, "initial value");
  validatePositiveInteger(input.years, "term");

  if (input.residualValue === undefined) {
    throw new RangeError("residual value is required.");
  }

  validateNonNegativeFinite(input.residualValue, "residual value");

  if (input.residualValue > input.initialValue) {
    throw new RangeError("residual value cannot exceed initial value.");
  }

  const yearlyDepreciation = (input.initialValue - input.residualValue) / input.years;
  const values = Array.from({ length: input.years + 1 }, (_, year) =>
    Math.max(input.residualValue ?? 0, input.initialValue - yearlyDepreciation * year),
  );

  return buildResult({
    mode: "lineal",
    initialValue: input.initialValue,
    years: input.years,
    values,
    residualValue: input.residualValue,
    sensitivityStepPercent: input.sensitivityStepPercent,
    currency: input.currency,
  });
}

export function calculateObservedDepreciation(
  input: VehicleDepreciationInput,
): VehicleDepreciationResult {
  validatePositiveFinite(input.initialValue, "initial value");
  validatePositiveInteger(input.years, "elapsed years");

  if (input.currentValue === undefined) {
    throw new RangeError("current value is required.");
  }

  validateNonNegativeFinite(input.currentValue, "current value");

  if (input.currentValue > input.initialValue) {
    throw new RangeError("current value cannot exceed initial value.");
  }

  const equivalentAnnualRate = calculateEquivalentAnnualRate(
    input.initialValue,
    input.currentValue,
    input.years,
  );
  const values = Array.from({ length: input.years + 1 }, (_, year) =>
    input.initialValue * (1 - equivalentAnnualRate) ** year,
  );
  values[input.years] = input.currentValue;

  return buildResult({
    mode: "observed-value",
    initialValue: input.initialValue,
    years: input.years,
    values,
    currentValue: input.currentValue,
    sensitivityStepPercent: input.sensitivityStepPercent,
    currency: input.currency,
  });
}

export function calculateEquivalentAnnualRate(
  initialValue: number,
  finalValue: number,
  years: number,
): number {
  validatePositiveFinite(initialValue, "initial value");
  validateNonNegativeFinite(finalValue, "final value");
  validatePositiveInteger(years, "term");

  if (finalValue > initialValue) {
    throw new RangeError("final value cannot exceed initial value.");
  }

  if (finalValue === 0) {
    return 1;
  }

  return 1 - (finalValue / initialValue) ** (1 / years);
}

export function calculateSensitivityScenarios(
  initialValue: number,
  years: number,
  baseAnnualRate: number,
  stepPercent = 5,
): SensitivityScenario[] {
  validatePositiveFinite(initialValue, "initial value");
  validatePositiveInteger(years, "term");

  const step = normalizePercent(stepPercent, "sensitivity");
  const scenarios = [
    {
      id: "conservador" as const,
      label: "Conservador",
      annualRate: Math.max(0, baseAnnualRate - step),
    },
    {
      id: "base" as const,
      label: "Base",
      annualRate: baseAnnualRate,
    },
    {
      id: "agresivo" as const,
      label: "Agresivo",
      annualRate: Math.min(1, baseAnnualRate + step),
    },
  ];

  return scenarios.map((scenario) => {
    const finalValue = initialValue * (1 - scenario.annualRate) ** years;
    const accumulatedLoss = initialValue - finalValue;

    return {
      ...scenario,
      finalValue,
      accumulatedLoss,
      depreciatedPercent: (accumulatedLoss / initialValue) * 100,
    };
  });
}

export function parseMoneyInput(value: string): ParseDecimalResult {
  return parseDecimalInput(value);
}

export function parsePercentInput(value: string): ParseDecimalResult {
  return parseDecimalInput(value);
}

export function formatDepreciationCurrency(value: number, currency = "MXN"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
    }).format(value);
  } catch {
    return `${formatCompactNumber(value, 2)} ${currency}`;
  }
}

export function formatDepreciationPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "percent",
  }).format(value);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function buildVehicleDepreciationShareText(
  result: VehicleDepreciationResult,
): string {
  const lines = [
    "Vehicle depreciation:",
    `Method: ${getModeLabel(result.mode)}`,
    `Initial value: ${formatDepreciationCurrency(result.initialValue, result.currency)}`,
    `Term: ${result.years} years`,
    `Estimated final value: ${formatDepreciationCurrency( result.finalValue, result.currency, )}`,
    `Accumulated loss: ${formatDepreciationCurrency(
      result.accumulatedLoss,
      result.currency,
    )}`,
    `Depreciated percentage: ${formatDepreciationPercent( result.depreciatedPercent / 100, )}`,
    `Average annual depreciation: ${formatDepreciationCurrency( result.averageAnnualLoss, result.currency, )}`,
    `Equivalent annual rate: ${formatDepreciationPercent( result.equivalentAnnualRate, )}`,
  ];

  if (result.annualRate !== undefined) {
    lines.push(`Entered annual rate: ${formatDepreciationPercent(result.annualRate)}`);
  }

  if (result.firstYearRate !== undefined) {
    lines.push(
      `First-year rate: ${formatDepreciationPercent(result.firstYearRate)}`,
    );
  }

  if (result.residualValue !== undefined) {
    lines.push(
      `Residual value: ${formatDepreciationCurrency( result.residualValue, result.currency, )}`,
    );
  }

  if (result.currentValue !== undefined) {
    lines.push(
      `Entered current value: ${formatDepreciationCurrency( result.currentValue, result.currency, )}`,
    );
  }

  lines.push(
    "",
    "Illustrative estimate. It does not replace an appraisal or an actual market offer.",
  );

  return lines.join("\n");
}

export function buildVehicleDepreciationCsv(
  result: VehicleDepreciationResult,
): string {
  const headers = [
    "Ano",
    "Estimated value",
    "Loss for the year",
    "Accumulated loss",
    "Depreciated percentage",
    "Remaining percentage",
  ];
  const rows = result.rows.map((row) =>
    [
      row.year,
      row.value,
      row.lossThisYear,
      row.accumulatedLoss,
      row.depreciatedPercent,
      row.remainingPercent,
    ]
      .map(csvCell)
      .join(","),
  );

  return [headers.map(csvCell).join(","), ...rows].join("\n");
}

function buildResult({
  mode,
  initialValue,
  years,
  values,
  annualRate,
  firstYearRate,
  residualValue,
  currentValue,
  sensitivityStepPercent,
  currency,
}: {
  mode: DepreciationMode;
  initialValue: number;
  years: number;
  values: number[];
  annualRate?: number;
  firstYearRate?: number;
  residualValue?: number;
  currentValue?: number;
  sensitivityStepPercent?: number;
  currency?: string;
}): VehicleDepreciationResult {
  const finalValue = values[values.length - 1] ?? initialValue;
  const accumulatedLoss = initialValue - finalValue;
  const equivalentAnnualRate = calculateEquivalentAnnualRate(
    initialValue,
    finalValue,
    years,
  );

  return {
    mode,
    initialValue,
    years,
    finalValue,
    accumulatedLoss,
    depreciatedPercent: (accumulatedLoss / initialValue) * 100,
    averageAnnualLoss: accumulatedLoss / years,
    equivalentAnnualRate,
    annualRate,
    firstYearRate,
    residualValue,
    currentValue,
    rows: buildRows(initialValue, values),
    scenarios: calculateSensitivityScenarios(
      initialValue,
      years,
      equivalentAnnualRate,
      sensitivityStepPercent,
    ),
    currency: currency ?? "MXN",
  };
}

function buildRows(initialValue: number, values: number[]): DepreciationYearRow[] {
  return values.map((value, year) => {
    const previousValue = year === 0 ? initialValue : values[year - 1] ?? initialValue;
    const accumulatedLoss = initialValue - value;

    return {
      year,
      value,
      lossThisYear: year === 0 ? 0 : previousValue - value,
      accumulatedLoss,
      depreciatedPercent: (accumulatedLoss / initialValue) * 100,
      remainingPercent: (value / initialValue) * 100,
    };
  });
}

function parseDecimalInput(value: string): ParseDecimalResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const compact = trimmed.replace(/\s+/g, "");

  if (/[^0-9.,]/.test(compact)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimalSeparators(compact);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
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

function normalizePercent(value: number, label: string): number {
  validateNonNegativeFinite(value, label);

  if (value > 100) {
    throw new RangeError(`${label} must be between 0 and 100.`);
  }

  return value / 100;
}

function validateMode(mode: string): asserts mode is DepreciationMode {
  if (!DEPRECIATION_MODES.includes(mode as DepreciationMode)) {
    throw new RangeError("Unsupported depreciation mode.");
  }
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a finite number greater than zero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite nonnegative number.`);
  }
}

function validatePositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be an integer greater than or equal to one.`);
  }
}

function getModeLabel(mode: DepreciationMode): string {
  if (mode === "lineal") return "Straight-line";
  if (mode === "observed-value") return "Observed value";
  return "Annual percentage";
}

function normalizeDecimalSeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
): string | undefined {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, decimalOrGroupPart] = parts;

    if (!integerPart || !decimalOrGroupPart) {
      return undefined;
    }

    if (
      decimalOrGroupPart.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
    ) {
      return `${integerPart}${decimalOrGroupPart}`;
    }

    return `${integerPart}.${decimalOrGroupPart}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return undefined;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function csvCell(value: unknown) {
  return `"${String(value).replaceAll('"', '""')}"`;
}
