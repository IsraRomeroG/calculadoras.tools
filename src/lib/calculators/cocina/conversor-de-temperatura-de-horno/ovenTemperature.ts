import {
  findClosestGasMark,
  getGasMarkEntry,
  normalizeGasMark,
  type GasMark,
  type GasMarkEntry,
} from "./gasMarks";

export const OVEN_TEMPERATURE_UNITS = ["c", "f", "gas", "k"] as const;

export type OvenTemperatureUnit = (typeof OVEN_TEMPERATURE_UNITS)[number];

export interface OvenTemperatureUnitMetadata {
  label: string;
  shortLabel: string;
  symbol: string;
  advanced: boolean;
}

export const OVEN_TEMPERATURE_UNIT_METADATA = {
  c: { label: "Celsius", shortLabel: "°C", symbol: "°C", advanced: false },
  f: { label: "Fahrenheit", shortLabel: "°F", symbol: "°F", advanced: false },
  gas: { label: "Marca de gas", shortLabel: "Gas", symbol: "gas", advanced: false },
  k: { label: "Kelvin", shortLabel: "K", symbol: "K", advanced: true },
} as const satisfies Record<OvenTemperatureUnit, OvenTemperatureUnitMetadata>;

export type ParseOvenTemperatureInputResult =
  | {
      ok: true;
      normalized: string;
      value?: number;
      detectedUnit?: OvenTemperatureUnit;
      gasMark?: GasMark;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid" | "unsupported-gas";
    };

export type OvenTemperatureReading =
  | {
      unit: Exclude<OvenTemperatureUnit, "gas">;
      value: number;
    }
  | {
      unit: "gas";
      gasMark: GasMark;
    };

export interface OvenBaseTemperature {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  sourceGasMark?: GasMarkEntry;
}

export interface OvenPracticalSetting {
  celsius: number;
  fahrenheit: number;
  gasMark: GasMarkEntry | null;
}

export interface OvenConvectionSuggestion extends OvenPracticalSetting {
  note: string;
}

export interface OvenEquivalences {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  gasMark: GasMarkEntry | null;
  sourceWasGasMark: boolean;
}

export type OvenConversionResult =
  | {
      unit: Exclude<OvenTemperatureUnit, "gas">;
      value: number;
      approximate: boolean;
    }
  | {
      unit: "gas";
      gasMark: GasMarkEntry | null;
      approximate: true;
    };

const ABSOLUTE_ZERO_C = -273.15;
const ABSOLUTE_ZERO_F = -459.67;
const OVEN_RANGE_MIN_C = 50;
const OVEN_RANGE_MAX_C = 300;
const NUMBER_PATTERN = "[+-]?(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)";

export function isOvenTemperatureUnit(
  value: string,
): value is OvenTemperatureUnit {
  return OVEN_TEMPERATURE_UNITS.includes(value as OvenTemperatureUnit);
}

export function parseOvenTemperatureInput(
  rawValue: string,
): ParseOvenTemperatureInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (/^[+-]?(?:[.,])?$/.test(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const gasInput = parseGasMarkInput(trimmed);

  if (gasInput) {
    return gasInput;
  }

  const gasMarkOnly = normalizeGasMark(trimmed);

  if (gasMarkOnly && trimmed.includes("/")) {
    return {
      ok: true,
      normalized: gasMarkOnly,
      detectedUnit: "gas",
      gasMark: gasMarkOnly,
    };
  }

  const match = trimmed.match(
    new RegExp(
      `^(${NUMBER_PATTERN})\\s*(?:(?:°\\s*)?(c|f)|k|kelvin|celsius|fahrenheit)?$`,
      "i",
    ),
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimal(match[1]);
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized,
    ...(detectTemperatureUnit(match[2] ?? match[0]) ? { detectedUnit: detectTemperatureUnit(match[2] ?? match[0]) } : {}),
  };
}

export function createOvenTemperatureReading(
  parsed: Extract<ParseOvenTemperatureInputResult, { ok: true }>,
  fallbackUnit: OvenTemperatureUnit,
): OvenTemperatureReading {
  const unit = parsed.detectedUnit ?? fallbackUnit;

  if (unit === "gas") {
    const gasMark =
      parsed.gasMark ??
      (typeof parsed.value === "number"
        ? normalizeGasMark(String(parsed.value))
        : undefined);

    if (!gasMark) {
      throw new RangeError("Marca de gas no soportada. Usa 1/4, 1/2 o 1 a 9.");
    }

    return { unit: "gas", gasMark };
  }

  if (typeof parsed.value !== "number") {
    throw new RangeError("Escribe una temperatura numerica.");
  }

  validatePhysicalTemperature(parsed.value, unit);

  return {
    unit,
    value: parsed.value,
  };
}

export function getOvenBaseTemperature(
  reading: OvenTemperatureReading,
): OvenBaseTemperature {
  if (reading.unit === "gas") {
    const entry = getGasMarkEntry(reading.gasMark);

    return {
      celsius: entry.celsius,
      fahrenheit: entry.fahrenheit,
      kelvin: celsiusToKelvin(entry.celsius),
      sourceGasMark: entry,
    };
  }

  const celsius = toCelsius(reading.value, reading.unit);
  const fahrenheit = celsiusToFahrenheit(celsius);

  validatePhysicalTemperature(celsius, "c");

  return {
    celsius,
    fahrenheit,
    kelvin: celsiusToKelvin(celsius),
  };
}

export function convertOvenTemperature(
  reading: OvenTemperatureReading,
  destination: OvenTemperatureUnit,
): OvenConversionResult {
  const base = getOvenBaseTemperature(reading);

  if (destination === "gas") {
    return {
      unit: "gas",
      gasMark: findClosestGasMark(base.celsius),
      approximate: true,
    };
  }

  if (destination === "c") {
    return {
      unit: "c",
      value: base.celsius,
      approximate: reading.unit === "gas",
    };
  }

  if (destination === "f") {
    return {
      unit: "f",
      value: base.fahrenheit,
      approximate: reading.unit === "gas",
    };
  }

  return {
    unit: "k",
    value: base.kelvin,
    approximate: reading.unit === "gas",
  };
}

export function getOvenEquivalences(
  reading: OvenTemperatureReading,
): OvenEquivalences {
  const base = getOvenBaseTemperature(reading);

  return {
    celsius: base.celsius,
    fahrenheit: base.fahrenheit,
    kelvin: base.kelvin,
    gasMark: findClosestGasMark(base.celsius),
    sourceWasGasMark: reading.unit === "gas",
  };
}

export function getPracticalOvenSetting(
  reading: OvenTemperatureReading,
): OvenPracticalSetting {
  const base = getOvenBaseTemperature(reading);

  if (base.sourceGasMark) {
    return {
      celsius: base.sourceGasMark.celsius,
      fahrenheit: base.sourceGasMark.fahrenheit,
      gasMark: base.sourceGasMark,
    };
  }

  const practicalCelsius = roundToNearest(base.celsius, 10);
  const practicalFahrenheit = roundToNearest(base.fahrenheit, 25);

  return {
    celsius: practicalCelsius,
    fahrenheit: practicalFahrenheit,
    gasMark: findClosestGasMark(base.celsius),
  };
}

export function getConvectionSuggestion(
  reading: OvenTemperatureReading,
): OvenConvectionSuggestion {
  const practical = getPracticalOvenSetting(reading);
  const celsius = practical.celsius - 20;
  const fahrenheit = practical.fahrenheit - 25;

  return {
    celsius,
    fahrenheit,
    gasMark: findClosestGasMark(celsius),
    note: "Orientativo: el ajuste real depende del horno, fabricante y receta.",
  };
}

export function getOvenRangeWarning(
  reading: OvenTemperatureReading,
): string | undefined {
  const base = getOvenBaseTemperature(reading);

  if (base.celsius < OVEN_RANGE_MIN_C || base.celsius > OVEN_RANGE_MAX_C) {
    return "Esta temperatura esta fuera del rango habitual de un horno domestico; la conversion es matematica.";
  }

  return undefined;
}

export function formatOvenTemperature(
  value: number,
  unit: Exclude<OvenTemperatureUnit, "gas">,
  decimals = 2,
): string {
  return `${formatOvenNumber(value, decimals)} ${OVEN_TEMPERATURE_UNIT_METADATA[unit].symbol}`;
}

export function formatGasMark(entry: GasMarkEntry | null): string {
  return entry ? `gas ${entry.mark}` : "sin marca de gas cercana";
}

export function formatOvenConversionResult(
  result: OvenConversionResult,
  decimals = 2,
): string {
  if (result.unit === "gas") {
    return formatGasMark(result.gasMark);
  }

  return formatOvenTemperature(result.value, result.unit, decimals);
}

export function formatOvenNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("La temperatura debe ser un numero finito.");
  }

  const safeDecimals = Math.min(3, Math.max(0, Math.trunc(decimals)));
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

function parseGasMarkInput(
  value: string,
): ParseOvenTemperatureInputResult | undefined {
  const gasPrefix = value.match(
    /^(?:gas(?:\s*mark)?|mark|marca(?:\s+de)?\s+gas)\s+(.+)$/i,
  );
  const gasSuffix = value.match(
    /^(.+?)\s+(?:gas(?:\s*mark)?|mark|marca(?:\s+de)?\s+gas)$/i,
  );
  const rawGasMark = gasPrefix?.[1] ?? gasSuffix?.[1];

  if (!rawGasMark) {
    return undefined;
  }

  const gasMark = normalizeGasMark(rawGasMark);

  if (!gasMark) {
    return { ok: false, error: "unsupported-gas" };
  }

  return {
    ok: true,
    normalized: gasMark,
    detectedUnit: "gas",
    gasMark,
  };
}

function detectTemperatureUnit(value: string): OvenTemperatureUnit | undefined {
  const normalized = value.toLowerCase().replace(/\s/g, "");

  if (normalized.endsWith("c") || normalized.endsWith("celsius")) {
    return "c";
  }

  if (normalized.endsWith("f") || normalized.endsWith("fahrenheit")) {
    return "f";
  }

  if (normalized.endsWith("k") || normalized.endsWith("kelvin")) {
    return "k";
  }

  return undefined;
}

function toCelsius(
  value: number,
  unit: Exclude<OvenTemperatureUnit, "gas">,
): number {
  validatePhysicalTemperature(value, unit);

  if (unit === "c") {
    return value;
  }

  if (unit === "f") {
    return ((value - 32) * 5) / 9;
  }

  return value - 273.15;
}

function validatePhysicalTemperature(
  value: number,
  unit: Exclude<OvenTemperatureUnit, "gas">,
) {
  if (!Number.isFinite(value)) {
    throw new RangeError("La temperatura debe ser un numero finito.");
  }

  if (
    (unit === "k" && value < 0) ||
    (unit === "c" && value < ABSOLUTE_ZERO_C) ||
    (unit === "f" && value < ABSOLUTE_ZERO_F)
  ) {
    throw new RangeError("Esta temperatura es inferior al cero absoluto.");
  }
}

function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

function celsiusToKelvin(celsius: number): number {
  return celsius - ABSOLUTE_ZERO_C;
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

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function roundToDecimals(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

