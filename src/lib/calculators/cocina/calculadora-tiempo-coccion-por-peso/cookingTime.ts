export const KG_TO_LB = 2.2046226218;

export const COOKING_WEIGHT_UNITS = ["kg", "lb"] as const;
export const COOKING_RATE_UNITS = ["min/kg", "min/lb"] as const;

export type CookingWeightUnit = (typeof COOKING_WEIGHT_UNITS)[number];
export type CookingRateUnit = (typeof COOKING_RATE_UNITS)[number];
export type CookingNumberRounding = "floor" | "ceil" | "nearest";

export interface CookingRateRange {
  rateUnit: CookingRateUnit;
  minMinutesPerUnit: number;
  maxMinutesPerUnit: number;
}

export interface CookingTimeInput {
  weight: number;
  weightUnit: CookingWeightUnit;
  rate: CookingRateRange;
  extraCookMinutes?: number;
  restMinutes?: number;
  startTimeMinutes?: number;
}

export interface CookingMinutesRange {
  min: number;
  max: number;
}

export interface TimeOfDayResult {
  minutesOfDay: number;
  dayOffset: number;
}

export interface TimeOfDayRange {
  min: TimeOfDayResult;
  max: TimeOfDayResult;
}

export interface CookingTimeResult {
  weightInRateUnit: number;
  activeMinutes: CookingMinutesRange;
  totalMinutes: CookingMinutesRange;
  reviewFromMinutes: number;
  reviewFromTime?: TimeOfDayResult;
  finishCookingTime?: TimeOfDayRange;
  serveTime?: TimeOfDayRange;
  warning?: "active-over-24h";
}

export type ParseCookingNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      interpretation?: string;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid";
    };

export type ParseTimeOfDayResult =
  | {
      ok: true;
      minutes: number;
    }
  | {
      ok: false;
      error: "empty" | "invalid";
    };

export function isCookingWeightUnit(
  value: string,
): value is CookingWeightUnit {
  return COOKING_WEIGHT_UNITS.includes(value as CookingWeightUnit);
}

export function isCookingRateUnit(value: string): value is CookingRateUnit {
  return COOKING_RATE_UNITS.includes(value as CookingRateUnit);
}

export function parseCookingNumber(
  rawValue: string,
): ParseCookingNumberResult {
  const trimmed = rawValue.trim().replaceAll("\u2212", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (/^[+-]?(?:[.,])?$/.test(trimmed) || /^[+-]?\d+[\d.,\s]*[.,]$/.test(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const normalized = normalizeLocalizedNumber(trimmed);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalized.value);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: formatCookingNumber(value, 8),
    ...(normalized.interpretation
      ? { interpretation: normalized.interpretation }
      : {}),
  };
}

export function parseTimeOfDay(rawValue: string): ParseTimeOfDayResult {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  const match = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    minutes: Number(match[1]) * 60 + Number(match[2]),
  };
}

export function calculateCookingTime(
  input: CookingTimeInput,
): CookingTimeResult {
  validatePositiveFinite(input.weight, "El peso");
  validateWeightUnit(input.weightUnit);
  validateRateUnit(input.rate.rateUnit);
  validatePositiveFinite(input.rate.minMinutesPerUnit, "La tasa minima");
  validatePositiveFinite(input.rate.maxMinutesPerUnit, "La tasa maxima");

  if (input.rate.minMinutesPerUnit > input.rate.maxMinutesPerUnit) {
    throw new RangeError("La tasa minima no puede ser mayor que la maxima.");
  }

  const extraCookMinutes = input.extraCookMinutes ?? 0;
  const restMinutes = input.restMinutes ?? 0;

  validateNonNegativeFinite(extraCookMinutes, "Los minutos extra de coccion");
  validateNonNegativeFinite(restMinutes, "El reposo");

  if (typeof input.startTimeMinutes === "number") {
    validateStartTime(input.startTimeMinutes);
  }

  const weightInRateUnit = getWeightInRateUnit(
    input.weight,
    input.weightUnit,
    input.rate.rateUnit,
  );
  const activeMinutes = {
    min: weightInRateUnit * input.rate.minMinutesPerUnit + extraCookMinutes,
    max: weightInRateUnit * input.rate.maxMinutesPerUnit + extraCookMinutes,
  };
  const totalMinutes = {
    min: activeMinutes.min + restMinutes,
    max: activeMinutes.max + restMinutes,
  };
  const warning =
    activeMinutes.max > 24 * 60 ? "active-over-24h" : undefined;

  return {
    weightInRateUnit,
    activeMinutes,
    totalMinutes,
    reviewFromMinutes: activeMinutes.min,
    ...(typeof input.startTimeMinutes === "number"
      ? {
          reviewFromTime: addMinutesToTimeOfDay(
            input.startTimeMinutes,
            activeMinutes.min,
            "floor",
          ),
          finishCookingTime: buildTimeRange(
            input.startTimeMinutes,
            activeMinutes,
          ),
          serveTime: buildTimeRange(input.startTimeMinutes, totalMinutes),
        }
      : {}),
    ...(warning ? { warning } : {}),
  };
}

export function convertWeight(
  weight: number,
  fromUnit: CookingWeightUnit,
  toUnit: CookingWeightUnit,
): number {
  validatePositiveFinite(weight, "El peso");
  validateWeightUnit(fromUnit);
  validateWeightUnit(toUnit);

  if (fromUnit === toUnit) {
    return weight;
  }

  return fromUnit === "kg" ? weight * KG_TO_LB : weight / KG_TO_LB;
}

export function getWeightInRateUnit(
  weight: number,
  weightUnit: CookingWeightUnit,
  rateUnit: CookingRateUnit,
): number {
  const targetUnit = rateUnit === "min/kg" ? "kg" : "lb";

  return convertWeight(weight, weightUnit, targetUnit);
}

export function addMinutesToTimeOfDay(
  startMinutes: number,
  durationMinutes: number,
  rounding: CookingNumberRounding = "nearest",
): TimeOfDayResult {
  validateStartTime(startMinutes);
  validateNonNegativeFinite(durationMinutes, "La duracion");

  const roundedDuration = roundDisplayMinutes(durationMinutes, rounding);
  const total = startMinutes + roundedDuration;

  return {
    minutesOfDay: positiveModulo(total, 24 * 60),
    dayOffset: Math.floor(total / (24 * 60)),
  };
}

export function formatCookingDuration(
  minutes: number,
  rounding: CookingNumberRounding = "nearest",
  locale: "es" | "en" = "es",
): string {
  validateNonNegativeFinite(minutes, "La duracion");

  const roundedMinutes = roundDisplayMinutes(minutes, rounding);
  const days = Math.floor(roundedMinutes / (24 * 60));
  const hours = Math.floor((roundedMinutes % (24 * 60)) / 60);
  const remainingMinutes = roundedMinutes % 60;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(
      locale === "en"
        ? `${days} ${days === 1 ? "day" : "days"}`
        : `${days} d`,
    );
  }

  if (hours > 0) {
    parts.push(`${hours} h`);
  }

  if (remainingMinutes > 0 || parts.length === 0) {
    parts.push(`${remainingMinutes} min`);
  }

  return parts.join(" ");
}

export function formatCookingDurationRange(
  range: CookingMinutesRange,
  locale: "es" | "en" = "es",
): string {
  validateRange(range);

  if (isSameMinuteRange(range)) {
    return formatCookingDuration(range.min, "nearest", locale);
  }

  return `${formatCookingDuration(range.min, "floor", locale)} ${locale === "en" ? "to" : "a"} ${formatCookingDuration(range.max, "ceil", locale)}`;
}

export function formatTimeOfDay(
  time: TimeOfDayResult,
  locale: "es" | "en" = "es",
): string {
  const hours = Math.floor(time.minutesOfDay / 60);
  const minutes = time.minutesOfDay % 60;
  const base = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  if (time.dayOffset === 0) {
    return base;
  }

  if (time.dayOffset === 1) {
    return `${base} (+1 ${locale === "en" ? "day" : "dia"})`;
  }

  return `${base} (+${time.dayOffset} ${locale === "en" ? "days" : "dias"})`;
}

export function formatTimeRange(
  range: TimeOfDayRange,
  locale: "es" | "en" = "es",
): string {
  if (
    range.min.minutesOfDay === range.max.minutesOfDay &&
    range.min.dayOffset === range.max.dayOffset
  ) {
    return formatTimeOfDay(range.min, locale);
  }

  return `${formatTimeOfDay(range.min, locale)} ${locale === "en" ? "to" : "a"} ${formatTimeOfDay(range.max, locale)}`;
}

export function formatCookingNumber(
  value: number,
  decimals = 2,
  locale: "es" | "en" = "es",
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("El valor debe ser un numero finito.");
  }

  const safeDecimals = Math.min(8, Math.max(0, Math.trunc(decimals)));
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

function buildTimeRange(
  startMinutes: number,
  durationRange: CookingMinutesRange,
): TimeOfDayRange {
  if (isSameMinuteRange(durationRange)) {
    const value = addMinutesToTimeOfDay(
      startMinutes,
      durationRange.min,
      "nearest",
    );

    return { min: value, max: value };
  }

  return {
    min: addMinutesToTimeOfDay(startMinutes, durationRange.min, "floor"),
    max: addMinutesToTimeOfDay(startMinutes, durationRange.max, "ceil"),
  };
}

function roundDisplayMinutes(
  minutes: number,
  rounding: CookingNumberRounding,
): number {
  if (rounding === "floor") {
    return Math.floor(minutes);
  }

  if (rounding === "ceil") {
    return Math.ceil(minutes);
  }

  return Math.round(minutes);
}

function validateRange(range: CookingMinutesRange) {
  validateNonNegativeFinite(range.min, "El limite inferior");
  validateNonNegativeFinite(range.max, "El limite superior");

  if (range.min > range.max) {
    throw new RangeError("El limite inferior no puede ser mayor que el superior.");
  }
}

function isSameMinuteRange(range: CookingMinutesRange) {
  return Math.abs(range.max - range.min) < 1e-9;
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser cero o mayor.`);
  }
}

function validateWeightUnit(value: CookingWeightUnit) {
  if (!isCookingWeightUnit(value)) {
    throw new RangeError("Unidad de peso no soportada.");
  }
}

function validateRateUnit(value: CookingRateUnit) {
  if (!isCookingRateUnit(value)) {
    throw new RangeError("Unidad de tasa no soportada.");
  }
}

function validateStartTime(value: number) {
  if (!Number.isFinite(value) || value < 0 || value >= 24 * 60) {
    throw new RangeError("La hora de inicio debe estar entre 00:00 y 23:59.");
  }
}

function normalizeLocalizedNumber(
  rawValue: string,
): { value: string; interpretation?: string } | undefined {
  const value = rawValue.replace(/\s/g, "");
  const lastComma = value.lastIndexOf(",");
  const lastPoint = value.lastIndexOf(".");
  const hasComma = lastComma !== -1;
  const hasPoint = lastPoint !== -1;

  if (!/^[+-]?[\d.,]+$/.test(value)) {
    return undefined;
  }

  const sign = value.startsWith("-") || value.startsWith("+") ? value[0] : "";
  const unsignedValue = sign ? value.slice(1) : value;

  if (hasComma && hasPoint) {
    const decimalSeparator = lastComma > lastPoint ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = unsignedValue.lastIndexOf(decimalSeparator);
    const integerPart = unsignedValue.slice(0, decimalIndex);
    const decimalPart = unsignedValue.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return {
      value: `${sign}${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`,
    };
  }

  if (hasComma || hasPoint) {
    const separator = hasComma ? "," : ".";
    const parts = unsignedValue.split(separator);

    if (parts.length > 2) {
      if (!isValidGroupedInteger(unsignedValue, separator)) {
        return undefined;
      }

      const interpreted = `${sign}${stripGrouping(unsignedValue, separator)}`;

      return {
        value: interpreted,
        interpretation: `Interpretado como ${interpreted}`,
      };
    }

    const [integerPart, decimalPart] = parts;

    if (!decimalPart) {
      return undefined;
    }

    if (
      decimalPart.length === 3 &&
      integerPart.length >= 1 &&
      isValidGroupedInteger(unsignedValue, separator)
    ) {
      const interpreted = `${sign}${stripGrouping(unsignedValue, separator)}`;

      return {
        value: interpreted,
        interpretation: `Interpretado como ${interpreted}`,
      };
    }

    return {
      value: `${sign}${integerPart || "0"}.${decimalPart}`,
    };
  }

  return /^\d+$/.test(unsignedValue)
    ? { value: `${sign}${unsignedValue}` }
    : undefined;
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

function positiveModulo(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
