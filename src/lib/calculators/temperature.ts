export const TEMPERATURE_SCALES = ["c", "f", "k", "r", "re"] as const;

export type TemperatureScale = (typeof TEMPERATURE_SCALES)[number];

export interface TemperatureScaleMetadata {
  label: string;
  symbol: string;
  advanced: boolean;
}

export const TEMPERATURE_SCALE_METADATA = {
  c: { label: "Celsius", symbol: "°C", advanced: false },
  f: { label: "Fahrenheit", symbol: "°F", advanced: false },
  k: { label: "Kelvin", symbol: "K", advanced: false },
  r: { label: "Rankine", symbol: "°R", advanced: true },
  re: { label: "Réaumur", symbol: "°Ré", advanced: true },
} as const satisfies Record<TemperatureScale, TemperatureScaleMetadata>;

export type ParseTemperatureInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      detectedScale?: TemperatureScale;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid";
    };

export interface TemperatureExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

const ABSOLUTE_ZERO_TOLERANCE = 1e-10;
const DEFAULT_DECIMALS = 2;
const SCIENTIFIC_NOTATION_THRESHOLD = 1_000_000;

const FORMULAS: Record<TemperatureScale, Partial<Record<TemperatureScale, string>>> = {
  c: {
    f: "°F = (°C × 9 / 5) + 32",
    k: "K = °C + 273.15",
    r: "°R = (°C + 273.15) × 9 / 5",
    re: "°Ré = °C × 4 / 5",
  },
  f: {
    c: "°C = (°F - 32) × 5 / 9",
    k: "K = (°F + 459.67) × 5 / 9",
    r: "°R = °F + 459.67",
    re: "°Ré = (°F - 32) × 4 / 9",
  },
  k: {
    c: "°C = K - 273.15",
    f: "°F = (K × 9 / 5) - 459.67",
    r: "°R = K × 9 / 5",
    re: "°Ré = (K - 273.15) × 4 / 5",
  },
  r: {
    c: "°C = (°R × 5 / 9) - 273.15",
    f: "°F = °R - 459.67",
    k: "K = °R × 5 / 9",
    re: "°Ré = ((°R × 5 / 9) - 273.15) × 4 / 5",
  },
  re: {
    c: "°C = °Ré × 5 / 4",
    f: "°F = (°Ré × 9 / 4) + 32",
    k: "K = (°Ré × 5 / 4) + 273.15",
    r: "°R = ((°Ré × 5 / 4) + 273.15) × 9 / 5",
  },
};

export function isTemperatureScale(value: string): value is TemperatureScale {
  return TEMPERATURE_SCALES.includes(value as TemperatureScale);
}

export function parseTemperatureInput(
  rawValue: string,
): ParseTemperatureInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (/^[+-]?(?:[.,])?$/.test(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+))\s*(?:(°?\s*(?:c|f|r|ré|re)|k))?$/iu,
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimal(match[1]);
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  const detectedScale = detectScale(match[2]);

  return {
    ok: true,
    value,
    normalized,
    ...(detectedScale ? { detectedScale } : {}),
  };
}

export function toKelvin(value: number, scale: TemperatureScale): number {
  assertFinite(value);

  switch (scale) {
    case "c":
      return value + 273.15;
    case "f":
      return (value + 459.67) * (5 / 9);
    case "k":
      return value;
    case "r":
      return value * (5 / 9);
    case "re":
      return value * (5 / 4) + 273.15;
  }
}

export function fromKelvin(kelvin: number, scale: TemperatureScale): number {
  const normalizedKelvin = normalizeKelvin(kelvin);

  switch (scale) {
    case "c":
      return normalizedKelvin - 273.15;
    case "f":
      return normalizedKelvin * (9 / 5) - 459.67;
    case "k":
      return normalizedKelvin;
    case "r":
      return normalizedKelvin * (9 / 5);
    case "re":
      return (normalizedKelvin - 273.15) * (4 / 5);
  }
}

export function convertTemperature(
  value: number,
  from: TemperatureScale,
  to: TemperatureScale,
): number {
  return fromKelvin(toKelvin(value, from), to);
}

export function convertAllTemperatures(
  value: number,
  from: TemperatureScale,
): Record<TemperatureScale, number> {
  const kelvin = normalizeKelvin(toKelvin(value, from));

  return Object.fromEntries(
    TEMPERATURE_SCALES.map((scale) => [scale, fromKelvin(kelvin, scale)]),
  ) as Record<TemperatureScale, number>;
}

export function convertTemperatureDifference(
  value: number,
  from: TemperatureScale,
  to: TemperatureScale,
): number {
  assertFinite(value);

  const celsiusDifference = toCelsiusDifference(value, from);

  switch (to) {
    case "c":
    case "k":
      return celsiusDifference;
    case "f":
    case "r":
      return celsiusDifference * (9 / 5);
    case "re":
      return celsiusDifference * (4 / 5);
  }
}

export function getTemperatureFormula(
  from: TemperatureScale,
  to: TemperatureScale,
): string {
  if (from === to) {
    const symbol = TEMPERATURE_SCALE_METADATA[from].symbol;

    return `${symbol} = ${symbol}`;
  }

  return FORMULAS[from][to] ?? "";
}

export function buildTemperatureExplanation(
  value: number,
  from: TemperatureScale,
  to: TemperatureScale,
  decimals = DEFAULT_DECIMALS,
): TemperatureExplanation {
  const resultValue = convertTemperature(value, from, to);
  const formula = getTemperatureFormula(from, to);
  const sourceSymbol = TEMPERATURE_SCALE_METADATA[from].symbol;
  const formattedSource = formatTemperatureNumber(value, decimals);
  const result = formatTemperature(resultValue, to, decimals);

  if (from === to) {
    return {
      formula,
      substitution: `${sourceSymbol} = ${formattedSource}`,
      result,
      steps: [
        "La escala de origen y destino es la misma.",
        `Resultado: ${result}.`,
      ],
    };
  }

  const substitution = replaceFormulaSource(
    formula,
    sourceSymbol,
    formattedSource,
  );

  return {
    formula,
    substitution,
    result,
    steps: [
      `Usamos la fórmula: ${formula}.`,
      `Sustituimos el valor: ${substitution}.`,
      `Resultado: ${result}.`,
    ],
  };
}

export function formatTemperature(
  value: number,
  scale: TemperatureScale,
  decimals = DEFAULT_DECIMALS,
): string {
  return `${formatTemperatureNumber(value, decimals)} ${TEMPERATURE_SCALE_METADATA[scale].symbol}`;
}

export function formatTemperatureNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
): string {
  assertFinite(value);

  const safeDecimals = normalizeDecimals(decimals);
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  if (Math.abs(normalizedValue) >= SCIENTIFIC_NOTATION_THRESHOLD) {
    return normalizedValue.toExponential(safeDecimals);
  }

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

function detectScale(unit?: string): TemperatureScale | undefined {
  if (!unit) {
    return undefined;
  }

  const normalizedUnit = unit.toLocaleLowerCase("es-MX").replace(/\s/g, "");

  switch (normalizedUnit) {
    case "°c":
    case "c":
      return "c";
    case "°f":
    case "f":
      return "f";
    case "k":
      return "k";
    case "°ré":
    case "ré":
    case "°re":
    case "re":
      return "re";
    default:
      return undefined;
  }
}

function normalizeDecimal(value: string): string {
  const withPoint = value.replace(",", ".");

  if (withPoint.startsWith(".")) {
    return `0${withPoint}`;
  }

  if (withPoint.startsWith("-.")) {
    return `-0${withPoint.slice(1)}`;
  }

  if (withPoint.startsWith("+.")) {
    return `+0${withPoint.slice(1)}`;
  }

  return withPoint;
}

function replaceFormulaSource(
  formula: string,
  sourceSymbol: string,
  formattedSource: string,
) {
  const escapedSymbol = sourceSymbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return formula.replace(
    new RegExp(`${escapedSymbol}(?![\\p{L}])`, "gu"),
    formattedSource,
  );
}

function normalizeKelvin(value: number): number {
  assertFinite(value);

  if (value < -ABSOLUTE_ZERO_TOLERANCE) {
    throw new RangeError(
      "Esta temperatura es inferior al cero absoluto y no es físicamente posible.",
    );
  }

  return Math.abs(value) <= ABSOLUTE_ZERO_TOLERANCE ? 0 : value;
}

function toCelsiusDifference(value: number, scale: TemperatureScale): number {
  switch (scale) {
    case "c":
    case "k":
      return value;
    case "f":
    case "r":
      return value * (5 / 9);
    case "re":
      return value * (5 / 4);
  }
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("La temperatura debe ser un número finito.");
  }
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(3, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
