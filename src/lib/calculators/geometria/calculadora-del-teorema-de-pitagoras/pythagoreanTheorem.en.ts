import {
  AREA_PERIMETER_UNITS,
  MEASUREMENT_UNIT_METADATA,
  formatLinearMeasurement,
  formatMeasurementNumber,
  isMeasurementUnit,
} from "../calculadora-de-area-y-perimetro/areaPerimeter.en";
import type {
  PythagoreanDecimalSetting,
  PythagoreanExplanation,
  PythagoreanExplanationOptions,
  PythagoreanMode,
  PythagoreanShareState,
  PythagoreanUnit,
  PythagoreanValues,
  ResolvedRightTriangle,
} from "./pythagoreanTheorem";

export * from "./pythagoreanTheorem";

export const PYTHAGOREAN_UNITS = AREA_PERIMETER_UNITS;
export const PYTHAGOREAN_UNIT_METADATA = MEASUREMENT_UNIT_METADATA;
export const PYTHAGOREAN_CANONICAL =
  "/en/geometry/pythagorean-theorem-calculator";
export const AREA_PERIMETER_TRIANGLE_URL =
  "/en/geometry/area-perimeter-calculator";

const DEFAULT_UNIT: PythagoreanUnit = "none";
const DEFAULT_DECIMALS: PythagoreanDecimalSetting = "auto";
const EPSILON = 1e-10;

export function formatLength(
  value: number,
  unit: PythagoreanUnit = DEFAULT_UNIT,
  decimals: PythagoreanDecimalSetting = DEFAULT_DECIMALS,
): string {
  return formatLinearMeasurement(value, unit, decimals);
}

export function isPythagoreanUnit(value: string): value is PythagoreanUnit {
  return isMeasurementUnit(value);
}

export function buildPythagoreanExplanation(
  mode: PythagoreanMode,
  values: PythagoreanValues,
  resultValue: number,
  options: PythagoreanExplanationOptions = {},
): PythagoreanExplanation {
  const unit = options.unit ?? DEFAULT_UNIT;
  const decimals = options.decimals ?? DEFAULT_DECIMALS;
  const resultLabel = mode === "hypotenuse" ? "Hypotenuse" : "Missing leg";
  const resultSymbol = mode === "hypotenuse" ? "c" : "b";
  const result = `${resultSymbol} = ${formatLength(resultValue, unit, decimals)}`;
  const isApproximate = shouldUseApproximation(resultValue, decimals);

  if (mode === "hypotenuse") {
    const { a, b } = values as { a: number; b: number };
    const radicand = a ** 2 + b ** 2;
    const exactness = isApproximate ? "≈" : "=";
    const formula = "c = √(a² + b²)";
    const substitution = `c = √(${formatOperand(a)}² + ${formatOperand(b)}²)`;
    const operation = `c = √${formatOperand(radicand)}`;
    const verification = [
      `Check: ${formatOperand(a)}² + ${formatOperand(b)}² ${exactness} ${formatOperand(resultValue)}²`,
      `${formatOperand(a ** 2)} + ${formatOperand(b ** 2)} ${exactness} ${formatOperand(resultValue ** 2)}`,
    ];

    return {
      resultLabel,
      formula,
      substitution,
      operation,
      result,
      verification,
      copyText: [
        "Pythagorean theorem",
        `Leg a: ${formatLength(a, unit, decimals)}`,
        `Leg b: ${formatLength(b, unit, decimals)}`,
        `Formula: ${formula}`,
        `Substitution: ${substitution}`,
        `Calculation: ${operation}`,
        `Result: ${result}`,
        verification.join("\n"),
      ].join("\n"),
      isApproximate,
    };
  }

  const { c, a } = values as { c: number; a: number };
  const radicand = c ** 2 - a ** 2;
  const exactness = isApproximate ? "≈" : "=";
  const formula = "b = √(c² - a²)";
  const substitution = `b = √(${formatOperand(c)}² - ${formatOperand(a)}²)`;
  const operation = `b = √${formatOperand(radicand)}`;
  const verification = [
    `Check: ${formatOperand(a)}² + ${formatOperand(resultValue)}² ${exactness} ${formatOperand(c)}²`,
    `${formatOperand(a ** 2)} + ${formatOperand(resultValue ** 2)} ${exactness} ${formatOperand(c ** 2)}`,
  ];

  return {
    resultLabel,
    formula,
    substitution,
    operation,
    result,
    verification,
    copyText: [
      "Pythagorean theorem",
      `Hypotenuse c: ${formatLength(c, unit, decimals)}`,
      `Known leg a: ${formatLength(a, unit, decimals)}`,
      `Formula: ${formula}`,
      `Substitution: ${substitution}`,
      `Calculation: ${operation}`,
      `Result: ${result}`,
      verification.join("\n"),
    ].join("\n"),
    isApproximate,
  };
}

export function buildPythagoreanShareUrl(
  state: PythagoreanShareState,
  basePath = PYTHAGOREAN_CANONICAL,
): string {
  const url = new URL(basePath, "https://calculadoras.tools");
  url.searchParams.set("calculate", state.mode);

  if (state.mode === "hypotenuse") {
    setOptionalParam(url, "a", state.a);
    setOptionalParam(url, "b", state.b);
  } else {
    setOptionalParam(url, "c", state.c);
    setOptionalParam(url, "a", state.a);
  }

  if (state.unit && isPythagoreanUnit(state.unit)) {
    url.searchParams.set("unit", state.unit);
  }

  if (state.decimals !== undefined && state.decimals !== DEFAULT_DECIMALS) {
    url.searchParams.set("decimals", String(state.decimals));
  }

  return `${url.pathname}${url.search}`;
}

export function buildAreaPerimeterUrl(
  triangle: ResolvedRightTriangle,
  basePath = AREA_PERIMETER_TRIANGLE_URL,
): string {
  const url = new URL(basePath, "https://calculadoras.tools");
  url.searchParams.set("shape", "triangle");
  url.searchParams.set("mode", "three-sides");
  setOptionalParam(url, "a", triangle.a);
  setOptionalParam(url, "b", triangle.b);
  setOptionalParam(url, "c", triangle.c);

  if (triangle.unit && isPythagoreanUnit(triangle.unit)) {
    url.searchParams.set("unit", triangle.unit);
  }

  if (
    triangle.decimals !== undefined &&
    triangle.decimals !== DEFAULT_DECIMALS
  ) {
    url.searchParams.set("decimals", String(triangle.decimals));
  }

  return `${url.pathname}${url.search}`;
}

function shouldUseApproximation(
  value: number,
  decimals: PythagoreanDecimalSetting,
) {
  const safeDecimals = decimals === "auto" ? 2 : normalizeDecimals(decimals);
  const factor = 10 ** safeDecimals;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;

  return Math.abs(value - rounded) > EPSILON * Math.max(1, Math.abs(value));
}

function formatOperand(value: number) {
  return formatMeasurementNumber(value, Number.isInteger(value) ? 0 : 6);
}

function setOptionalParam(
  url: URL,
  name: string,
  value: number | string | undefined,
) {
  if (value !== undefined && value !== "") {
    url.searchParams.set(name, String(value));
  }
}

function normalizeDecimals(decimals: number) {
  return Number.isFinite(decimals)
    ? Math.min(6, Math.max(0, Math.trunc(decimals)))
    : 2;
}
