export const DEPRECIATION_MODES = [
  "porcentaje",
  "lineal",
  "valor-observado",
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
  validatePositiveFinite(input.initialValue, "valor inicial");
  validatePositiveInteger(input.years, "plazo");

  if (input.years > 50) {
    throw new RangeError("plazo debe ser menor o igual a 50.");
  }

  if (input.mode === "porcentaje") {
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
  validatePositiveFinite(input.initialValue, "valor inicial");
  validatePositiveInteger(input.years, "plazo");

  if (input.annualRatePercent === undefined) {
    throw new RangeError("tasa anual es requerida.");
  }

  const annualRate = normalizePercent(input.annualRatePercent, "tasa anual");
  const firstYearRate =
    input.firstYearRatePercent === undefined
      ? undefined
      : normalizePercent(input.firstYearRatePercent, "tasa del primer ano");
  const values = [input.initialValue];

  for (let year = 1; year <= input.years; year += 1) {
    const previousValue = values[year - 1];
    const rate = year === 1 && firstYearRate !== undefined ? firstYearRate : annualRate;

    values.push(previousValue * (1 - rate));
  }

  return buildResult({
    mode: "porcentaje",
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
  validatePositiveFinite(input.initialValue, "valor inicial");
  validatePositiveInteger(input.years, "plazo");

  if (input.residualValue === undefined) {
    throw new RangeError("valor residual es requerido.");
  }

  validateNonNegativeFinite(input.residualValue, "valor residual");

  if (input.residualValue > input.initialValue) {
    throw new RangeError("valor residual no puede superar valor inicial.");
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
  validatePositiveFinite(input.initialValue, "valor inicial");
  validatePositiveInteger(input.years, "anos transcurridos");

  if (input.currentValue === undefined) {
    throw new RangeError("valor actual es requerido.");
  }

  validateNonNegativeFinite(input.currentValue, "valor actual");

  if (input.currentValue > input.initialValue) {
    throw new RangeError("valor actual no puede superar valor inicial.");
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
    mode: "valor-observado",
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
  validatePositiveFinite(initialValue, "valor inicial");
  validateNonNegativeFinite(finalValue, "valor final");
  validatePositiveInteger(years, "plazo");

  if (finalValue > initialValue) {
    throw new RangeError("valor final no puede superar valor inicial.");
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
  validatePositiveFinite(initialValue, "valor inicial");
  validatePositiveInteger(years, "plazo");

  const step = normalizePercent(stepPercent, "sensibilidad");
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
    return new Intl.NumberFormat("es-MX", {
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
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "percent",
  }).format(value);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function buildVehicleDepreciationShareText(
  result: VehicleDepreciationResult,
): string {
  const lines = [
    "Depreciacion del vehiculo:",
    `Metodo: ${getModeLabel(result.mode)}`,
    `Valor inicial: ${formatDepreciationCurrency(result.initialValue, result.currency)}`,
    `Plazo: ${result.years} anos`,
    `Valor estimado final: ${formatDepreciationCurrency(
      result.finalValue,
      result.currency,
    )}`,
    `Perdida acumulada: ${formatDepreciationCurrency(
      result.accumulatedLoss,
      result.currency,
    )}`,
    `Porcentaje depreciado: ${formatDepreciationPercent(
      result.depreciatedPercent / 100,
    )}`,
    `Depreciacion promedio anual: ${formatDepreciationCurrency(
      result.averageAnnualLoss,
      result.currency,
    )}`,
    `Tasa anual equivalente: ${formatDepreciationPercent(
      result.equivalentAnnualRate,
    )}`,
  ];

  if (result.annualRate !== undefined) {
    lines.push(`Tasa anual capturada: ${formatDepreciationPercent(result.annualRate)}`);
  }

  if (result.firstYearRate !== undefined) {
    lines.push(
      `Tasa del primer ano: ${formatDepreciationPercent(result.firstYearRate)}`,
    );
  }

  if (result.residualValue !== undefined) {
    lines.push(
      `Valor residual: ${formatDepreciationCurrency(
        result.residualValue,
        result.currency,
      )}`,
    );
  }

  if (result.currentValue !== undefined) {
    lines.push(
      `Valor actual capturado: ${formatDepreciationCurrency(
        result.currentValue,
        result.currency,
      )}`,
    );
  }

  lines.push(
    "",
    "Estimacion orientativa. No sustituye un avaluo ni una oferta real de mercado.",
  );

  return lines.join("\n");
}

export function buildVehicleDepreciationCsv(
  result: VehicleDepreciationResult,
): string {
  const headers = [
    "Ano",
    "Valor estimado",
    "Perdida del ano",
    "Perdida acumulada",
    "Porcentaje depreciado",
    "Porcentaje restante",
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
    throw new RangeError(`${label} debe estar entre 0 y 100.`);
  }

  return value / 100;
}

function validateMode(mode: string): asserts mode is DepreciationMode {
  if (!DEPRECIATION_MODES.includes(mode as DepreciationMode)) {
    throw new RangeError("modo de depreciacion no soportado.");
  }
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser un numero finito mayor a cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser un numero finito no negativo.`);
  }
}

function validatePositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} debe ser un entero mayor o igual a uno.`);
  }
}

function getModeLabel(mode: DepreciationMode): string {
  if (mode === "lineal") return "Lineal";
  if (mode === "valor-observado") return "Valor observado";
  return "Porcentaje anual";
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
