import {
  AREA_PERIMETER_UNITS,
  MEASUREMENT_UNIT_METADATA,
  formatLinearMeasurement,
  formatMeasurementNumber,
  isMeasurementUnit,
  parseMeasurement,
  validatePositiveMeasurement,
  type DecimalSetting,
  type MeasurementUnit,
  type ParseMeasurementResult,
} from "../calculadora-de-area-y-perimetro/areaPerimeter";

export type PythagoreanMode = "hypotenuse" | "leg";
export type PythagoreanUnit = MeasurementUnit;
export type PythagoreanDecimalSetting = DecimalSetting;

export interface HypotenuseValues {
  a: number;
  b: number;
}

export interface MissingLegValues {
  c: number;
  a: number;
}

export type PythagoreanValues = HypotenuseValues | MissingLegValues;

export interface PythagoreanExplanationOptions {
  unit?: PythagoreanUnit;
  decimals?: PythagoreanDecimalSetting;
}

export interface PythagoreanExplanation {
  resultLabel: string;
  formula: string;
  substitution: string;
  operation: string;
  result: string;
  verification: string[];
  copyText: string;
  isApproximate: boolean;
}

export type PositiveLengthValidation =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: "non_finite" | "non_positive";
    };

export type HypotenuseLegValidation =
  | {
      ok: true;
      hypotenuse: number;
      leg: number;
    }
  | {
      ok: false;
      error: "non_finite" | "non_positive" | "not_larger";
    };

export interface PythagoreanShareState {
  mode: PythagoreanMode;
  a?: number | string;
  b?: number | string;
  c?: number | string;
  unit?: PythagoreanUnit;
  decimals?: PythagoreanDecimalSetting;
}

export interface ResolvedRightTriangle {
  a: number | string;
  b: number | string;
  c: number | string;
  unit?: PythagoreanUnit;
  decimals?: PythagoreanDecimalSetting;
}

export const PYTHAGOREAN_UNITS = AREA_PERIMETER_UNITS;
export const PYTHAGOREAN_UNIT_METADATA = MEASUREMENT_UNIT_METADATA;

export const PYTHAGOREAN_PRESETS = [
  { a: 3, b: 4, c: 5 },
  { a: 5, b: 12, c: 13 },
  { a: 8, b: 15, c: 17 },
  { a: 7, b: 24, c: 25 },
] as const;

export const PYTHAGOREAN_CANONICAL =
  "/geometria/calculadora-del-teorema-de-pitagoras/";
export const AREA_PERIMETER_TRIANGLE_URL =
  "/geometria/calculadora-de-area-y-perimetro";

const DEFAULT_UNIT: PythagoreanUnit = "none";
const DEFAULT_DECIMALS: PythagoreanDecimalSetting = "auto";
const EPSILON = 1e-10;

export function calculateHypotenuse(a: number, b: number): number {
  assertPositiveLength(a);
  assertPositiveLength(b);

  return Math.hypot(a, b);
}

export function calculateMissingLeg(hypotenuse: number, knownLeg: number): number {
  assertHypotenuseAndLeg(hypotenuse, knownLeg);

  return Math.sqrt((hypotenuse - knownLeg) * (hypotenuse + knownLeg));
}

export function validatePositiveLength(
  value: number,
): PositiveLengthValidation {
  return validatePositiveMeasurement(value);
}

export function validateHypotenuseAndLeg(
  hypotenuse: number,
  leg: number,
): HypotenuseLegValidation {
  const hypotenuseValidation = validatePositiveLength(hypotenuse);
  const legValidation = validatePositiveLength(leg);

  if (!hypotenuseValidation.ok) {
    return { ok: false, error: hypotenuseValidation.error };
  }

  if (!legValidation.ok) {
    return { ok: false, error: legValidation.error };
  }

  if (hypotenuse <= leg) {
    return { ok: false, error: "not_larger" };
  }

  return { ok: true, hypotenuse, leg };
}

export function parseLengthInput(value: string): ParseMeasurementResult {
  return parseMeasurement(value);
}

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
  const resultLabel = mode === "hypotenuse" ? "Hipotenusa" : "Cateto faltante";
  const resultSymbol = mode === "hypotenuse" ? "c" : "b";
  const result = `${resultSymbol} = ${formatLength(resultValue, unit, decimals)}`;
  const isApproximate = shouldUseApproximation(resultValue, decimals);

  if (mode === "hypotenuse") {
    const { a, b } = values as HypotenuseValues;
    const radicand = a ** 2 + b ** 2;
    const exactness = isApproximate ? "≈" : "=";
    const formula = "c = √(a² + b²)";
    const substitution = `c = √(${formatOperand(a)}² + ${formatOperand(b)}²)`;
    const operation = `c = √${formatOperand(radicand)}`;
    const verification = [
      `Verificación: ${formatOperand(a)}² + ${formatOperand(b)}² ${exactness} ${formatOperand(resultValue)}²`,
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
        "Teorema de Pitágoras",
        `Cateto a: ${formatLength(a, unit, decimals)}`,
        `Cateto b: ${formatLength(b, unit, decimals)}`,
        `Fórmula: ${formula}`,
        `Sustituyendo: ${substitution}`,
        `Operando: ${operation}`,
        `Resultado: ${result}`,
        verification.join("\n"),
      ].join("\n"),
      isApproximate,
    };
  }

  const { c, a } = values as MissingLegValues;
  const radicand = c ** 2 - a ** 2;
  const exactness = isApproximate ? "≈" : "=";
  const formula = "b = √(c² - a²)";
  const substitution = `b = √(${formatOperand(c)}² - ${formatOperand(a)}²)`;
  const operation = `b = √${formatOperand(radicand)}`;
  const verification = [
    `Verificación: ${formatOperand(a)}² + ${formatOperand(resultValue)}² ${exactness} ${formatOperand(c)}²`,
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
      "Teorema de Pitágoras",
      `Hipotenusa c: ${formatLength(c, unit, decimals)}`,
      `Cateto conocido a: ${formatLength(a, unit, decimals)}`,
      `Fórmula: ${formula}`,
      `Sustituyendo: ${substitution}`,
      `Operando: ${operation}`,
      `Resultado: ${result}`,
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

  url.searchParams.set(
    "calcular",
    state.mode === "hypotenuse" ? "hipotenusa" : "cateto",
  );

  if (state.mode === "hypotenuse") {
    setOptionalParam(url, "a", state.a);
    setOptionalParam(url, "b", state.b);
  } else {
    setOptionalParam(url, "c", state.c);
    setOptionalParam(url, "a", state.a);
  }

  if (state.unit && isPythagoreanUnit(state.unit)) {
    url.searchParams.set("unidad", state.unit);
  }

  if (state.decimals !== undefined && state.decimals !== DEFAULT_DECIMALS) {
    url.searchParams.set("decimales", String(state.decimals));
  }

  return `${url.pathname}${url.search}`;
}

export function buildAreaPerimeterUrl(
  triangle: ResolvedRightTriangle,
  basePath = AREA_PERIMETER_TRIANGLE_URL,
): string {
  const url = new URL(basePath, "https://calculadoras.tools");

  url.searchParams.set("figura", "triangulo");
  url.searchParams.set("modo", "tres-lados");
  setOptionalParam(url, "a", triangle.a);
  setOptionalParam(url, "b", triangle.b);
  setOptionalParam(url, "c", triangle.c);

  if (triangle.unit && isPythagoreanUnit(triangle.unit)) {
    url.searchParams.set("unidad", triangle.unit);
  }

  if (
    triangle.decimals !== undefined &&
    triangle.decimals !== DEFAULT_DECIMALS
  ) {
    url.searchParams.set("decimales", String(triangle.decimals));
  }

  return `${url.pathname}${url.search}`;
}

function assertPositiveLength(value: number) {
  const validation = validatePositiveLength(value);

  if (!validation.ok) {
    throw new RangeError(
      validation.error === "non_finite"
        ? "La longitud debe ser un número finito."
        : "La longitud debe ser mayor que cero.",
    );
  }
}

function assertHypotenuseAndLeg(hypotenuse: number, leg: number) {
  const validation = validateHypotenuseAndLeg(hypotenuse, leg);

  if (!validation.ok) {
    throw new RangeError(
      validation.error === "not_larger"
        ? "La hipotenusa debe ser mayor que el cateto conocido."
        : validation.error === "non_finite"
          ? "La longitud debe ser un número finito."
          : "La longitud debe ser mayor que cero.",
    );
  }
}

function shouldUseApproximation(
  value: number,
  decimals: PythagoreanDecimalSetting,
) {
  const safeDecimals = decimals === "auto" ? 2 : normalizeDecimals(decimals);

  return !nearlyEqual(value, roundToDecimals(value, safeDecimals));
}

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
}

function formatOperand(value: number) {
  if (Number.isInteger(value)) {
    return formatMeasurementNumber(value, 0);
  }

  return formatMeasurementNumber(value, 6);
}

function setOptionalParam(
  url: URL,
  name: string,
  value: number | string | undefined,
) {
  if (value === undefined || value === "") {
    return;
  }

  url.searchParams.set(name, String(value));
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return 2;
  }

  return Math.min(6, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
