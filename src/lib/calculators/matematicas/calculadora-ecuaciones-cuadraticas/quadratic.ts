export type QuadraticSolutionType =
  | "two_real_roots"
  | "double_real_root"
  | "complex_roots";

export type ParseQuadraticInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "incomplete" | "invalid";
    };

export interface QuadraticInput {
  a: number;
  b: number;
  c: number;
  decimals?: number;
}

export interface QuadraticRoot {
  label: string;
  value: number | null;
  display: string;
  exact: string;
}

export interface QuadraticVertex {
  x: number;
  y: number;
  display: string;
}

export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  solutionType: QuadraticSolutionType;
  solutionLabel: string;
  interpretation: string;
  equation: string;
  roots: QuadraticRoot[];
  vertex: QuadraticVertex;
  formula: string;
  substitution: string;
  steps: string[];
  copyText: string;
}

const DEFAULT_DECIMALS = 4;
const DISCRIMINANT_EPSILON = 1e-10;

export const QUADRATIC_EXAMPLES = [
  {
    label: "x² - 5x + 6",
    a: "1",
    b: "-5",
    c: "6",
  },
  {
    label: "x² + 2x + 1",
    a: "1",
    b: "2",
    c: "1",
  },
  {
    label: "x² + 1",
    a: "1",
    b: "0",
    c: "1",
  },
] as const;

export function parseQuadraticInput(
  value: string,
): ParseQuadraticInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const cleaned = trimmed.replaceAll("−", "-").replace(/\s/g, "");

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

  const numericValue = normalizeNegativeZero(Number(normalized));

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function calculateQuadraticEquation(
  input: QuadraticInput,
): QuadraticResult {
  assertValidQuadraticInput(input);

  const decimals = normalizeDecimals(input.decimals);
  const a = normalizeNegativeZero(input.a);
  const b = normalizeNegativeZero(input.b);
  const c = normalizeNegativeZero(input.c);
  const rawDiscriminant = b ** 2 - 4 * a * c;
  const discriminant = normalizeDiscriminant(rawDiscriminant);
  const equation = formatQuadraticEquation(a, b, c);
  const vertexX = normalizeNegativeZero(-b / (2 * a));
  const vertexY = normalizeNegativeZero(a * vertexX ** 2 + b * vertexX + c);
  const vertex = {
    x: vertexX,
    y: vertexY,
    display: `(${formatQuadraticNumber(vertexX, decimals)}, ${formatQuadraticNumber(
      vertexY,
      decimals,
    )})`,
  };

  const baseResult = {
    a,
    b,
    c,
    discriminant,
    equation,
    vertex,
    formula: "x = (-b ± sqrt(D)) / (2a)",
    substitution: `x = (${formatSignedTerm(-b)} ± sqrt(${formatFlexibleQuadraticNumber(
      discriminant,
    )})) / (${formatFlexibleQuadraticNumber(2 * a)})`,
  };

  if (discriminant > 0) {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const plusRoot = normalizeNegativeZero((-b + sqrtDiscriminant) / (2 * a));
    const minusRoot = normalizeNegativeZero((-b - sqrtDiscriminant) / (2 * a));
    const signedRoots = [
      {
        sign: "+",
        value: plusRoot,
        exact: buildExactRealRoot(a, b, discriminant, "+"),
      },
      {
        sign: "-",
        value: minusRoot,
        exact: buildExactRealRoot(a, b, discriminant, "-"),
      },
    ].sort((left, right) => left.value - right.value);
    const roots = signedRoots.map((root, index) => ({
      label: `x${index + 1}`,
      value: root.value,
      display: formatQuadraticNumber(root.value, decimals),
      exact: root.exact,
    }));
    const result: QuadraticResult = {
      ...baseResult,
      solutionType: "two_real_roots",
      solutionLabel: "Dos raíces reales distintas",
      interpretation:
        "La parábola corta el eje X en dos puntos porque el discriminante es positivo.",
      roots,
      steps: [],
      copyText: "",
    };

    return finalizeResult(result, decimals);
  }

  if (discriminant === 0) {
    const root = normalizeNegativeZero(-b / (2 * a));
    const rootDisplay = formatQuadraticNumber(root, decimals);
    const roots = [
      {
        label: "x",
        value: root,
        display: rootDisplay,
        exact: buildExactRealRoot(a, b, discriminant, "+"),
      },
    ];
    const result: QuadraticResult = {
      ...baseResult,
      solutionType: "double_real_root",
      solutionLabel: "Raíz real doble",
      interpretation:
        "La parábola toca el eje X en un solo punto porque el discriminante es cero.",
      roots,
      steps: [],
      copyText: "",
    };

    return finalizeResult(result, decimals);
  }

  const realPart = normalizeNegativeZero(-b / (2 * a));
  const imaginaryPart = normalizeNegativeZero(
    Math.sqrt(Math.abs(discriminant)) / Math.abs(2 * a),
  );
  const realDisplay = formatQuadraticNumber(realPart, decimals);
  const imaginaryDisplay = formatQuadraticNumber(imaginaryPart, decimals);
  const exact = buildExactComplexRootParts(a, b, discriminant);
  const roots = [
    {
      label: "x1",
      value: null,
      display: formatComplexRoot(realDisplay, imaginaryDisplay, "+"),
      exact: formatComplexRoot(exact.real, exact.imaginary, "+"),
    },
    {
      label: "x2",
      value: null,
      display: formatComplexRoot(realDisplay, imaginaryDisplay, "-"),
      exact: formatComplexRoot(exact.real, exact.imaginary, "-"),
    },
  ];
  const result: QuadraticResult = {
    ...baseResult,
    solutionType: "complex_roots",
    solutionLabel: "Dos raíces complejas",
    interpretation:
      "La parábola no corta el eje X porque el discriminante es negativo.",
    roots,
    steps: [],
    copyText: "",
  };

  return finalizeResult(result, decimals);
}

export function formatQuadraticEquation(a: number, b: number, c: number) {
  const terms = [
    formatEquationTerm(a, "x²", true),
    formatEquationTerm(b, "x", false),
    formatEquationTerm(c, "", false),
  ].filter((term): term is string => Boolean(term));

  return `${terms.length > 0 ? terms.join(" ") : "0"} = 0`;
}

export function formatQuadraticNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
) {
  const safeDecimals = normalizeDecimals(decimals);

  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleQuadraticNumber(
  value: number,
  maximumFractionDigits = 6,
) {
  const roundedValue = roundToDecimals(value, maximumFractionDigits);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(roundedValue);
}

export function normalizeQuadraticDecimals(decimals: number) {
  return normalizeDecimals(decimals);
}

function finalizeResult(
  result: Omit<QuadraticResult, "steps" | "copyText"> & {
    steps: string[];
    copyText: string;
  },
  decimals: number,
): QuadraticResult {
  const steps = buildQuadraticSteps(result, decimals);
  const copyText = buildQuadraticCopyText({ ...result, steps, copyText: "" });

  return {
    ...result,
    steps,
    copyText,
  };
}

function buildQuadraticSteps(result: QuadraticResult, decimals: number) {
  const discriminant = formatFlexibleQuadraticNumber(result.discriminant);
  const rootLines = result.roots
    .map((root) => `${root.label} = ${root.exact} ≈ ${root.display}`)
    .join("; ");

  return [
    `Partimos de la ecuación ${result.equation}.`,
    `Calculamos el discriminante: D = b² - 4ac = ${formatFlexibleQuadraticNumber(
      result.b,
    )}² - 4(${formatFlexibleQuadraticNumber(result.a)})(${formatFlexibleQuadraticNumber(
      result.c,
    )}) = ${discriminant}.`,
    `${result.interpretation}`,
    `Sustituimos en la fórmula general: ${result.substitution}.`,
    `Raíces: ${rootLines}.`,
    `Vértice: xv = -b / (2a), yv = a*xv² + b*xv + c; vértice = (${formatQuadraticNumber(
      result.vertex.x,
      decimals,
    )}, ${formatQuadraticNumber(result.vertex.y, decimals)}).`,
  ];
}

function buildQuadraticCopyText(result: QuadraticResult) {
  return [
    "Calculadora de ecuaciones cuadráticas - calculadoras.tools",
    `Ecuación: ${result.equation}`,
    `Discriminante: ${formatFlexibleQuadraticNumber(result.discriminant)}`,
    `Tipo de solución: ${result.solutionLabel}`,
    result.interpretation,
    ...result.roots.map(
      (root) => `${root.label}: ${root.exact} ≈ ${root.display}`,
    ),
    `Vértice: ${result.vertex.display}`,
    "",
    "Procedimiento:",
    ...result.steps,
  ].join("\n");
}

function assertValidQuadraticInput(input: QuadraticInput) {
  if (![input.a, input.b, input.c].every(Number.isFinite)) {
    throw new RangeError("Todos los coeficientes deben ser números finitos.");
  }

  if (input.a === 0) {
    throw new RangeError("El coeficiente a no puede ser cero.");
  }
}

function buildExactRealRoot(
  a: number,
  b: number,
  discriminant: number,
  sign: "+" | "-",
) {
  if (isSafeIntegerCoefficient(a, b, discriminant)) {
    const denominator = 2 * a;

    if (discriminant === 0) {
      return simplifyFraction(-b, denominator);
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);

    if (Number.isInteger(sqrtDiscriminant)) {
      const numerator = sign === "+" ? -b + sqrtDiscriminant : -b - sqrtDiscriminant;

      return simplifyFraction(numerator, denominator);
    }

    return `(${formatSignedTerm(-b)} ${sign} √${formatFlexibleQuadraticNumber(
      discriminant,
    )}) / ${formatFlexibleQuadraticNumber(denominator)}`;
  }

  return `(${formatSignedTerm(-b)} ${sign} sqrt(${formatFlexibleQuadraticNumber(
    discriminant,
  )})) / ${formatFlexibleQuadraticNumber(2 * a)}`;
}

function buildExactComplexRootParts(
  a: number,
  b: number,
  discriminant: number,
) {
  const realDenominator = 2 * a;
  const imaginaryDenominator = Math.abs(2 * a);
  const absDiscriminant = Math.abs(discriminant);

  if (isSafeIntegerCoefficient(a, b, absDiscriminant)) {
    return {
      real: simplifyFraction(-b, realDenominator),
      imaginary: simplifyImaginaryPart(absDiscriminant, imaginaryDenominator),
    };
  }

  return {
    real: formatFlexibleQuadraticNumber(-b / realDenominator),
    imaginary: formatFlexibleQuadraticNumber(
      Math.sqrt(absDiscriminant) / imaginaryDenominator,
    ),
  };
}

function simplifyImaginaryPart(discriminant: number, denominator: number) {
  const sqrtDiscriminant = Math.sqrt(discriminant);

  if (Number.isInteger(sqrtDiscriminant)) {
    return simplifyFraction(sqrtDiscriminant, denominator);
  }

  if (denominator === 1) {
    return `√${formatFlexibleQuadraticNumber(discriminant)}`;
  }

  return `√${formatFlexibleQuadraticNumber(discriminant)} / ${formatFlexibleQuadraticNumber(
    denominator,
  )}`;
}

function simplifyFraction(numerator: number, denominator: number) {
  if (denominator < 0) {
    return simplifyFraction(-numerator, -denominator);
  }

  if (denominator === 0) {
    throw new RangeError("El denominador no puede ser cero.");
  }

  if (numerator === 0) {
    return "0";
  }

  const divisor = greatestCommonDivisor(Math.abs(numerator), Math.abs(denominator));
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = denominator / divisor;

  if (simplifiedDenominator === 1) {
    return String(simplifiedNumerator);
  }

  return `${simplifiedNumerator}/${simplifiedDenominator}`;
}

function formatComplexRoot(
  realPart: string,
  imaginaryPart: string,
  sign: "+" | "-",
) {
  if (realPart === "0" || realPart === "0.0000") {
    return `${sign === "-" ? "-" : ""}${formatImaginaryPart(imaginaryPart)}i`;
  }

  return `${realPart} ${sign} ${formatImaginaryPart(imaginaryPart)}i`;
}

function formatImaginaryPart(value: string) {
  return value === "1" || value === "1.0000" ? "" : value;
}

function formatEquationTerm(
  coefficient: number,
  variable: string,
  isFirst: boolean,
) {
  const value = normalizeNegativeZero(coefficient);

  if (value === 0) {
    return null;
  }

  const sign = value < 0 ? "-" : "+";
  const absoluteValue = Math.abs(value);
  const coefficientText =
    variable && absoluteValue === 1
      ? ""
      : formatFlexibleQuadraticNumber(absoluteValue);
  const body = `${coefficientText}${variable}`;

  if (isFirst) {
    return sign === "-" ? `-${body}` : body;
  }

  return `${sign} ${body}`;
}

function normalizeDiscriminant(value: number) {
  return Math.abs(value) < DISCRIMINANT_EPSILON
    ? 0
    : normalizeNegativeZero(value);
}

function normalizeDecimals(decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(8, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
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

function formatSignedTerm(value: number) {
  return formatFlexibleQuadraticNumber(normalizeNegativeZero(value));
}

function isSafeIntegerCoefficient(...values: number[]) {
  return values.every(Number.isSafeInteger);
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

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}
