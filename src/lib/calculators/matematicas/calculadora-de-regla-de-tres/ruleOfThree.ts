export type ProportionType = "direct" | "inverse";

export type ParseRuleOfThreeInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid";
    };

export interface RuleOfThreeInput {
  type: ProportionType;
  a: number;
  b: number;
  c: number;
  decimals?: number;
  firstUnit?: string;
  secondUnit?: string;
}

export interface RuleOfThreeResult {
  x: number;
  formula: string;
  substitution: string;
  fraction: string | null;
  steps: string[];
  verification: string[];
}

const DEFAULT_DECIMALS = 2;
const MAX_FRACTION_DENOMINATOR = 10000;

export function calculateDirectRuleOfThree(
  a: number,
  b: number,
  c: number,
): number {
  return (b * c) / a;
}

export function calculateInverseRuleOfThree(
  a: number,
  b: number,
  c: number,
): number {
  return (a * b) / c;
}

export function calculateRuleOfThree(
  input: RuleOfThreeInput,
): RuleOfThreeResult {
  assertValidRuleOfThreeInput(input);

  const decimals = normalizeDecimals(input.decimals);
  const x =
    input.type === "direct"
      ? calculateDirectRuleOfThree(input.a, input.b, input.c)
      : calculateInverseRuleOfThree(input.a, input.b, input.c);

  if (!Number.isFinite(x)) {
    throw new RangeError("El resultado no es finito.");
  }

  const formula =
    input.type === "direct" ? "X = (B × C) / A" : "X = (A × B) / C";
  const substitution =
    input.type === "direct"
      ? `X = (${formatFlexibleNumber(input.b)} × ${formatFlexibleNumber(input.c)}) / ${formatFlexibleNumber(input.a)}`
      : `X = (${formatFlexibleNumber(input.a)} × ${formatFlexibleNumber(input.b)}) / ${formatFlexibleNumber(input.c)}`;

  const result: RuleOfThreeResult = {
    x,
    formula,
    substitution,
    fraction: buildExactFraction(input),
    steps: [],
    verification: [],
  };

  result.steps = buildRuleOfThreeSteps(input, result);
  result.verification = verifyRuleOfThree(input, result);

  return {
    ...result,
    steps: result.steps.map((step) => interpolateResult(step, x, decimals)),
    verification: result.verification.map((step) =>
      interpolateResult(step, x, decimals),
    ),
  };
}

export function buildRuleOfThreeSteps(
  input: RuleOfThreeInput,
  result: Pick<RuleOfThreeResult, "x" | "formula" | "substitution">,
): string[] {
  const relation =
    input.type === "direct"
      ? "Como la proporción es directa, al cambiar la primera magnitud la segunda cambia en el mismo sentido."
      : "Como la proporción es inversa, al aumentar una magnitud la otra disminuye en la misma proporción.";

  return [
    `Identificamos los valores: A = ${formatValueWithUnit(input.a, input.firstUnit)}, B = ${formatValueWithUnit(input.b, input.secondUnit)}, C = ${formatValueWithUnit(input.c, input.firstUnit)} y X es el valor que buscamos.`,
    `${relation}`,
    `Usamos la fórmula: ${result.formula}.`,
    `Sustituimos: ${result.substitution}.`,
    `Resultado: X = __RESULT__.`,
  ];
}

export function verifyRuleOfThree(
  input: RuleOfThreeInput,
  result: Pick<RuleOfThreeResult, "x">,
): string[] {
  if (input.type === "direct") {
    const left = input.a * result.x;
    const right = input.c * input.b;

    return [
      "Comprobación directa: A × X = C × B.",
      `${formatFlexibleNumber(input.a)} × __RESULT_VALUE__ = ${formatFlexibleNumber(input.c)} × ${formatFlexibleNumber(input.b)}.`,
      `${formatFlexibleNumber(left)} = ${formatFlexibleNumber(right)}.`,
    ];
  }

  const left = input.a * input.b;
  const right = input.c * result.x;

  return [
    "Comprobación inversa: A × B = C × X.",
    `${formatFlexibleNumber(input.a)} × ${formatFlexibleNumber(input.b)} = ${formatFlexibleNumber(input.c)} × __RESULT_VALUE__.`,
    `${formatFlexibleNumber(left)} = ${formatFlexibleNumber(right)}.`,
  ];
}

export function parseRuleOfThreeInput(
  value: string,
): ParseRuleOfThreeInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const cleaned = trimmed
    .replaceAll("−", "-")
    .replace(/[$%\s]/g, "");

  if (!cleaned || !/^-?[0-9.,]+$/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!normalized || !/^-?\d+(\.\d+)?$/.test(normalized)) {
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

export function simplifyFraction(
  numerator: number,
  denominator: number,
): string | null {
  if (
    !Number.isInteger(numerator) ||
    !Number.isInteger(denominator) ||
    denominator === 0
  ) {
    return null;
  }

  if (numerator === 0) {
    return "0";
  }

  const sign = Math.sign(numerator) * Math.sign(denominator) < 0 ? "-" : "";
  const absoluteNumerator = Math.abs(numerator);
  const absoluteDenominator = Math.abs(denominator);
  const divisor = greatestCommonDivisor(absoluteNumerator, absoluteDenominator);
  const simplifiedNumerator = absoluteNumerator / divisor;
  const simplifiedDenominator = absoluteDenominator / divisor;

  if (simplifiedDenominator === 1) {
    return null;
  }

  if (simplifiedDenominator > MAX_FRACTION_DENOMINATOR) {
    return null;
  }

  return `${sign}${simplifiedNumerator}/${simplifiedDenominator}`;
}

export function formatRuleNumber(value: number, decimals = DEFAULT_DECIMALS) {
  const safeDecimals = normalizeDecimals(decimals);

  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleNumber(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(roundToDecimals(value, maximumFractionDigits));
}

export function formatRuleResult(
  value: number,
  options: { decimals?: number; unit?: string } = {},
) {
  return formatValueWithUnit(
    roundToDecimals(value, normalizeDecimals(options.decimals)),
    options.unit,
    normalizeDecimals(options.decimals),
  );
}

function assertValidRuleOfThreeInput(input: RuleOfThreeInput) {
  const values = [input.a, input.b, input.c];

  if (!["direct", "inverse"].includes(input.type)) {
    throw new RangeError("El tipo de proporción no es válido.");
  }

  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError("Todos los valores deben ser números finitos.");
  }

  if (input.a === 0) {
    throw new RangeError("El valor A no puede ser cero.");
  }

  if (input.type === "inverse" && input.c === 0) {
    throw new RangeError(
      "El valor C no puede ser cero en una proporción inversa.",
    );
  }
}

function buildExactFraction(input: RuleOfThreeInput): string | null {
  const a = numberToRational(input.a);
  const b = numberToRational(input.b);
  const c = numberToRational(input.c);

  if (!a || !b || !c) {
    return null;
  }

  const numerator =
    input.type === "direct"
      ? b.numerator * c.numerator * a.denominator
      : a.numerator * b.numerator * c.denominator;

  const denominator =
    input.type === "direct"
      ? b.denominator * c.denominator * a.numerator
      : a.denominator * b.denominator * c.numerator;

  return simplifyFraction(numerator, denominator);
}

function numberToRational(value: number) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const stringValue = value.toString();

  if (stringValue.includes("e")) {
    return null;
  }

  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const [integerPart, decimalPart = ""] = absolute.toString().split(".");
  const denominator = 10 ** decimalPart.length;
  const numerator = Number(`${integerPart}${decimalPart}`) * sign;
  const divisor = greatestCommonDivisor(Math.abs(numerator), denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function formatValueWithUnit(value: number, unit = "", decimals?: number) {
  const trimmedUnit = unit.trim();
  const format = (number: number) =>
    typeof decimals === "number"
      ? formatRuleNumber(number, decimals)
      : formatFlexibleNumber(number);
  const formatted = format(value);

  if (!trimmedUnit) {
    return formatted;
  }

  if (["$", "€", "£", "¥"].includes(trimmedUnit)) {
    const sign = value < 0 ? "-" : "";

    return `${sign}${trimmedUnit}${format(Math.abs(value))}`;
  }

  if (trimmedUnit === "%") {
    return `${formatted}%`;
  }

  return `${formatted} ${trimmedUnit}`;
}

function interpolateResult(step: string, value: number, decimals: number) {
  const formatted = formatRuleNumber(value, decimals);

  return step
    .replaceAll("__RESULT__", formatted)
    .replaceAll("__RESULT_VALUE__", formatFlexibleNumber(value));
}

function normalizeSeparators(value: string): string {
  const sign = value.startsWith("-") ? "-" : "";
  const unsignedValue = sign ? value.slice(1) : value;
  const lastComma = unsignedValue.lastIndexOf(",");
  const lastDot = unsignedValue.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return `${sign}${unsignedValue
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".")}`;
  }

  if (lastComma !== -1) {
    return `${sign}${normalizeSingleSeparator(unsignedValue, ",")}`;
  }

  if (lastDot !== -1) {
    return `${sign}${normalizeSingleSeparator(unsignedValue, ".")}`;
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (
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
    parts[0].length <= 3 &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return value;
}

function normalizeDecimals(decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(4, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function greatestCommonDivisor(a: number, b: number): number {
  let x = a;
  let y = b;

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x || 1;
}
