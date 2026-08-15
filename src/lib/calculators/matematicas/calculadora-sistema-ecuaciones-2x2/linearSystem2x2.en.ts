


export type LinearSystem2x2Status =
  | "unique_solution"
  | "no_solution"
  | "infinite_solutions";

export type ParseLinearSystemInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "incomplete" | "invalid";
    };

export interface LinearSystem2x2Input {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
  decimals?: number;
}

export interface LinearSystem2x2Solution {
  x: number;
  y: number;
  xDisplay: string;
  yDisplay: string;
  xExact: string | null;
  yExact: string | null;
}

export interface LinearSystem2x2Result {
  coefficients: Required<Omit<LinearSystem2x2Input, "decimals">>;
  equations: {
    first: string;
    second: string;
  };
  determinants: {
    d: number;
    dx: number;
    dy: number;
  };
  status: LinearSystem2x2Status;
  statusLabel: string;
  interpretation: string;
  detail: string;
  solution: LinearSystem2x2Solution | null;
  steps: string[];
  verification: string[];
  copyText: string;
}

interface Rational {
  numerator: number;
  denominator: number;
}

type EquationKind = "identity" | "impossible" | "line";

const DEFAULT_DECIMALS = 4;
const EPSILON = 1e-10;
const MAX_EXACT_DENOMINATOR = 10000;
const MAX_EXACT_ABSOLUTE_NUMERATOR = 100000000;

export const LINEAR_SYSTEM_2X2_EXAMPLES = [
  {
    label: "Unique solution",
    a1: "2",
    b1: "3",
    c1: "13",
    a2: "1",
    b2: "-1",
    c2: "1",
  },
  {
    label: "Parallel lines",
    a1: "1",
    b1: "1",
    c1: "2",
    a2: "2",
    b2: "2",
    c2: "5",
  },
  {
    label: "Same line",
    a1: "1",
    b1: "1",
    c1: "2",
    a2: "2",
    b2: "2",
    c2: "4",
  },
  {
    label: "With decimals",
    a1: "0.5",
    b1: "1",
    c1: "4",
    a2: "1",
    b2: "-0.25",
    c2: "1",
  },
  {
    label: "0 = 0",
    a1: "1",
    b1: "1",
    c1: "2",
    a2: "0",
    b2: "0",
    c2: "0",
  },
] as const;

export function parseLinearSystemInput(
  value: string,
): ParseLinearSystemInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const cleaned = trimmed.replaceAll("\u2212", "-").replace(/\s/g, "");

  if (/^[+-]?[.,]?$/.test(cleaned)) {
    return { ok: false, error: "incomplete" };
  }

  if (!/^[+-]?[0-9.,]+$/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const numericValue = normalizeNearZero(Number(normalized));

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function calculateLinearSystem2x2(
  input: LinearSystem2x2Input,
): LinearSystem2x2Result {
  assertValidLinearSystemInput(input);

  const decimals = normalizeDecimals(input.decimals);
  const coefficients = {
    a1: normalizeNearZero(input.a1),
    b1: normalizeNearZero(input.b1),
    c1: normalizeNearZero(input.c1),
    a2: normalizeNearZero(input.a2),
    b2: normalizeNearZero(input.b2),
    c2: normalizeNearZero(input.c2),
  };
  const equations = {
    first: formatLinearEquation(coefficients.a1, coefficients.b1, coefficients.c1),
    second: formatLinearEquation(
      coefficients.a2,
      coefficients.b2,
      coefficients.c2,
    ),
  };
  const determinants = {
    d: normalizeNearZero(
      coefficients.a1 * coefficients.b2 - coefficients.a2 * coefficients.b1,
    ),
    dx: normalizeNearZero(
      coefficients.c1 * coefficients.b2 - coefficients.c2 * coefficients.b1,
    ),
    dy: normalizeNearZero(
      coefficients.a1 * coefficients.c2 - coefficients.a2 * coefficients.c1,
    ),
  };
  const firstKind = classifyEquation(
    coefficients.a1,
    coefficients.b1,
    coefficients.c1,
  );
  const secondKind = classifyEquation(
    coefficients.a2,
    coefficients.b2,
    coefficients.c2,
  );
  const base = {
    coefficients,
    equations,
    determinants,
  };

  if (firstKind === "impossible" || secondKind === "impossible") {
    return finalizeResult(
      {
        ...base,
        status: "no_solution",
        statusLabel: "No solution",
        interpretation: buildImpossibleInterpretation(firstKind, secondKind),
        detail: "degenerate_impossible_equation",
        solution: null,
      },
      decimals,
    );
  }

  if (firstKind === "identity" && secondKind === "identity") {
    return finalizeResult(
      {
        ...base,
        status: "infinite_solutions",
        statusLabel: "Infinitely many solutions",
        interpretation:
          "Both equations are true for every pair (x, y); there are infinitely many solutions across the plane.",
        detail: "both_equations_identity",
        solution: null,
      },
      decimals,
    );
  }

  if (firstKind === "identity" || secondKind === "identity") {
    return finalizeResult(
      {
        ...base,
        status: "infinite_solutions",
        statusLabel: "Infinitely many solutions",
        interpretation:
          "One equation is 0 = 0 and adds no restriction; the solutions are all points on the other line.",
        detail:
          firstKind === "identity"
            ? "first_equation_identity"
            : "second_equation_identity",
        solution: null,
      },
      decimals,
    );
  }

  if (!isZero(determinants.d)) {
    const x = normalizeNearZero(determinants.dx / determinants.d);
    const y = normalizeNearZero(determinants.dy / determinants.d);
    const exact = buildExactSolutionFractions(coefficients);

    return finalizeResult(
      {
        ...base,
        status: "unique_solution",
        statusLabel: "Unique solution",
        interpretation:
          "The two lines intersect at one point; that point is the system's solution.",
        detail: "intersecting_lines",
        solution: {
          x,
          y,
          xDisplay: formatLinearSystemNumber(x, decimals),
          yDisplay: formatLinearSystemNumber(y, decimals),
          xExact: exact.x,
          yExact: exact.y,
        },
      },
      decimals,
    );
  }

  if (isZero(determinants.dx) && isZero(determinants.dy)) {
    return finalizeResult(
      {
        ...base,
        status: "infinite_solutions",
        statusLabel: "Infinitely many solutions",
        interpretation:
          "Both equations represent the same line, so there is no single solution point.",
        detail: "same_line",
        solution: null,
      },
      decimals,
    );
  }

  return finalizeResult(
    {
      ...base,
      status: "no_solution",
      statusLabel: "No solution",
      interpretation:
        "The lines are distinct and parallel; no pair (x, y) satisfies both equations.",
      detail: "parallel_lines",
      solution: null,
    },
    decimals,
  );
}

export function formatLinearEquation(a: number, b: number, c: number) {
  const terms = [
    formatEquationTerm(a, "x", true),
    formatEquationTerm(b, "y", false),
  ].filter((term): term is string => Boolean(term));

  return `${terms.length > 0 ? terms.join(" ") : "0"} = ${formatFlexibleLinearSystemNumber(
    c,
  )}`;
}

export function formatLinearSystemNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
) {
  const safeDecimals = normalizeDecimals(decimals);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleLinearSystemNumber(
  value: number,
  maximumFractionDigits = 6,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(roundToDecimals(value, maximumFractionDigits));
}

function finalizeResult(
  result: Omit<LinearSystem2x2Result, "steps" | "verification" | "copyText">,
  decimals: number,
): LinearSystem2x2Result {
  const steps = buildSteps(result, decimals);
  const verification = buildVerification(result, decimals);
  const copyText = buildCopyText({ ...result, steps, verification, copyText: "" });

  return {
    ...result,
    steps,
    verification,
    copyText,
  };
}

function buildSteps(
  result: Omit<LinearSystem2x2Result, "steps" | "verification" | "copyText">,
  decimals: number,
) {
  const { coefficients, determinants } = result;
  const dText = formatFlexibleLinearSystemNumber(determinants.d);
  const dxText = formatFlexibleLinearSystemNumber(determinants.dx);
  const dyText = formatFlexibleLinearSystemNumber(determinants.dy);
  const steps = [
    `Start with the system: ${result.equations.first}; ${result.equations.second}.`,
  ];

  if (result.detail.includes("identity") || result.detail.includes("impossible")) {
    steps.push(
      "First, check whether either equation has 0x + 0y because it may be true for every value or impossible.",
    );
  }

  steps.push(
    `Calculate D = a1*b2 - a2*b1 = ${formatFlexibleLinearSystemNumber(
      coefficients.a1,
    )}*${formatFlexibleLinearSystemNumber(
      coefficients.b2,
    )} - ${formatFlexibleLinearSystemNumber(
      coefficients.a2,
    )}*${formatFlexibleLinearSystemNumber(coefficients.b1)} = ${dText}.`,
    `Calculate Dx = c1*b2 - c2*b1 = ${formatFlexibleLinearSystemNumber(
      coefficients.c1,
    )}*${formatFlexibleLinearSystemNumber(
      coefficients.b2,
    )} - ${formatFlexibleLinearSystemNumber(
      coefficients.c2,
    )}*${formatFlexibleLinearSystemNumber(coefficients.b1)} = ${dxText}.`,
    `Calculate Dy = a1*c2 - a2*c1 = ${formatFlexibleLinearSystemNumber(
      coefficients.a1,
    )}*${formatFlexibleLinearSystemNumber(
      coefficients.c2,
    )} - ${formatFlexibleLinearSystemNumber(
      coefficients.a2,
    )}*${formatFlexibleLinearSystemNumber(coefficients.c1)} = ${dyText}.`,
  );

  if (result.solution) {
    steps.push(
      `Because D is not 0, apply Cramer's rule: x = Dx / D = ${dxText} / ${dText} = ${result.solution.xDisplay}; y = Dy / D = ${dyText} / ${dText} = ${result.solution.yDisplay}.`,
      result.interpretation,
    );
    return steps;
  }

  if (result.status === "infinite_solutions") {
    steps.push(
      "Because D = 0, the system does not determine a unique point.",
      result.interpretation,
    );
    return steps;
  }

  if (result.detail.includes("impossible")) {
    steps.push(
      "Because at least one equation requires 0 = c with c not equal to 0, the condition is impossible.",
      result.interpretation,
    );
    return steps;
  }

  steps.push(
    "Because D = 0 and at least one of Dx or Dy is not 0, the system is inconsistent.",
    result.interpretation,
  );

  return steps.map((step) =>
    step.replaceAll(formatLinearSystemNumber(0, decimals), "0"),
  );
}

function buildVerification(
  result: Omit<LinearSystem2x2Result, "steps" | "verification" | "copyText">,
  decimals: number,
) {
  if (!result.solution) {
    return [];
  }

  const { coefficients, solution } = result;

  return [
    `First equation: ${formatSubstitution(
      coefficients.a1,
      coefficients.b1,
      solution.x,
      solution.y,
      decimals,
    )} = ${formatRoundedFlexible(coefficients.c1, decimals)}.`,
    `Second equation: ${formatSubstitution(
      coefficients.a2,
      coefficients.b2,
      solution.x,
      solution.y,
      decimals,
    )} = ${formatRoundedFlexible(coefficients.c2, decimals)}.`,
  ];
}

function buildCopyText(result: LinearSystem2x2Result) {
  const lines = [
    "2x2 system of equations calculator - calculadoras.tools",
    "System:",
    result.equations.first,
    result.equations.second,
    "",
    `Status: ${result.statusLabel}`,
    result.interpretation,
  ];

  if (result.solution) {
    lines.push(
      `x = ${formatSolutionLine(result.solution.xExact, result.solution.xDisplay)}`,
      `y = ${formatSolutionLine(result.solution.yExact, result.solution.yDisplay)}`,
    );
  }

  lines.push(
    "",
    "Determinants:",
    `D = ${formatFlexibleLinearSystemNumber(result.determinants.d)}`,
    `Dx = ${formatFlexibleLinearSystemNumber(result.determinants.dx)}`,
    `Dy = ${formatFlexibleLinearSystemNumber(result.determinants.dy)}`,
  );

  if (result.verification.length > 0) {
    lines.push("", "Check:", ...result.verification);
  }

  lines.push("", "Steps:", ...result.steps);

  return lines.join("\n");
}

function formatSolutionLine(exact: string | null, display: string) {
  return exact ? `${exact} = ${display}` : display;
}

function buildImpossibleInterpretation(
  firstKind: EquationKind,
  secondKind: EquationKind,
) {
  if (firstKind === "impossible" && secondKind === "impossible") {
    return "Both equations have the form 0 = c with c not equal to 0, so the system has no solution.";
  }

  return "One equation has the form 0 = c with c not equal to 0; that condition is impossible and the system has no solution.";
}

function classifyEquation(a: number, b: number, c: number): EquationKind {
  if (!isZero(a) || !isZero(b)) {
    return "line";
  }

  return isZero(c) ? "identity" : "impossible";
}

function buildExactSolutionFractions(
  coefficients: Required<Omit<LinearSystem2x2Input, "decimals">>,
) {
  const rationals = [
    coefficients.a1,
    coefficients.b1,
    coefficients.c1,
    coefficients.a2,
    coefficients.b2,
    coefficients.c2,
  ].map(numberToRational);

  if (rationals.some((rational) => rational === null)) {
    return { x: null, y: null };
  }

  const [a1, b1, c1, a2, b2, c2] = rationals as Rational[];
  const d = subtractRational(multiplyRational(a1, b2), multiplyRational(a2, b1));

  if (!d || d.numerator === 0) {
    return { x: null, y: null };
  }

  const dx = subtractRational(multiplyRational(c1, b2), multiplyRational(c2, b1));
  const dy = subtractRational(multiplyRational(a1, c2), multiplyRational(a2, c1));

  if (!dx || !dy) {
    return { x: null, y: null };
  }

  return {
    x: formatUsefulFraction(divideRational(dx, d)),
    y: formatUsefulFraction(divideRational(dy, d)),
  };
}

function numberToRational(value: number): Rational | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const text = normalizeNearZero(value).toString();

  if (text.includes("e")) {
    return null;
  }

  const sign = text.startsWith("-") ? -1 : 1;
  const unsigned = sign === -1 ? text.slice(1) : text;
  const [integerPart, decimalPart = ""] = unsigned.split(".");
  const denominator = 10 ** decimalPart.length;
  const numerator = Number(`${integerPart}${decimalPart}`) * sign;

  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    return null;
  }

  return makeRational(numerator, denominator);
}

function makeRational(numerator: number, denominator: number): Rational | null {
  if (denominator === 0) {
    return null;
  }

  const sign = denominator < 0 ? -1 : 1;
  const safeNumerator = numerator * sign;
  const safeDenominator = Math.abs(denominator);
  const divisor = greatestCommonDivisor(
    Math.abs(safeNumerator),
    safeDenominator,
  );

  return {
    numerator: safeNumerator / divisor,
    denominator: safeDenominator / divisor,
  };
}

function multiplyRational(left: Rational, right: Rational): Rational | null {
  const numerator = left.numerator * right.numerator;
  const denominator = left.denominator * right.denominator;

  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    return null;
  }

  return makeRational(numerator, denominator);
}

function subtractRational(
  left: Rational | null,
  right: Rational | null,
): Rational | null {
  if (!left || !right) {
    return null;
  }

  const numerator =
    left.numerator * right.denominator - right.numerator * left.denominator;
  const denominator = left.denominator * right.denominator;

  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    return null;
  }

  return makeRational(numerator, denominator);
}

function divideRational(
  left: Rational | null,
  right: Rational | null,
): Rational | null {
  if (!left || !right || right.numerator === 0) {
    return null;
  }

  const numerator = left.numerator * right.denominator;
  const denominator = left.denominator * right.numerator;

  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) {
    return null;
  }

  return makeRational(numerator, denominator);
}

function formatUsefulFraction(rational: Rational | null) {
  if (!rational || rational.denominator === 1) {
    return null;
  }

  if (
    rational.denominator > MAX_EXACT_DENOMINATOR ||
    Math.abs(rational.numerator) > MAX_EXACT_ABSOLUTE_NUMERATOR
  ) {
    return null;
  }

  return `${rational.numerator}/${rational.denominator}`;
}

function formatEquationTerm(
  coefficient: number,
  variable: string,
  isFirst: boolean,
) {
  const value = normalizeNearZero(coefficient);

  if (isZero(value)) {
    return null;
  }

  const sign = value < 0 ? "-" : "+";
  const absoluteValue = Math.abs(value);
  const coefficientText =
    isCloseTo(absoluteValue, 1) ? "" : formatFlexibleLinearSystemNumber(absoluteValue);
  const body = `${coefficientText}${variable}`;

  if (isFirst) {
    return sign === "-" ? `-${body}` : body;
  }

  return `${sign} ${body}`;
}

function formatSubstitution(
  a: number,
  b: number,
  x: number,
  y: number,
  decimals: number,
) {
  const terms = [
    formatSubstitutionTerm(a, x, true, decimals),
    formatSubstitutionTerm(b, y, false, decimals),
  ].filter((term): term is string => Boolean(term));

  return terms.length > 0 ? terms.join(" ") : "0";
}

function formatSubstitutionTerm(
  coefficient: number,
  value: number,
  isFirst: boolean,
  decimals: number,
) {
  if (isZero(coefficient)) {
    return null;
  }

  const sign = coefficient < 0 ? "-" : "+";
  const absoluteCoefficient = Math.abs(coefficient);
  const valueText = formatRoundedFlexible(value, decimals);
  const body = isCloseTo(absoluteCoefficient, 1)
    ? valueText
    : `${formatFlexibleLinearSystemNumber(absoluteCoefficient)}(${valueText})`;

  if (isFirst) {
    return sign === "-" ? `-${body}` : body;
  }

  return `${sign} ${body}`;
}

function formatRoundedFlexible(value: number, decimals: number) {
  return formatFlexibleLinearSystemNumber(roundToDecimals(value, decimals), decimals);
}

function assertValidLinearSystemInput(input: LinearSystem2x2Input) {
  const values = [input.a1, input.b1, input.c1, input.a2, input.b2, input.c2];

  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError("All coefficients must be finite numbers.");
  }
}

function normalizeSeparators(value: string): string {
  const sign = value.startsWith("-") || value.startsWith("+") ? value[0] : "";
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

  return Math.min(8, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return normalizeNearZero(Math.round((value + Number.EPSILON) * factor) / factor);
}

function normalizeNearZero(value: number) {
  if (Object.is(value, -0) || Math.abs(value) < EPSILON) {
    return 0;
  }

  return value;
}

function isZero(value: number) {
  return Math.abs(value) < EPSILON;
}

function isCloseTo(left: number, right: number) {
  return Math.abs(left - right) < EPSILON;
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




