export type ProbabilityMode =
  | "simple"
  | "complement"
  | "union"
  | "intersection"
  | "conditional";

export type ProbabilityInputFormat = "percent" | "decimal";
export type UnionRelation = "general" | "exclusive";
export type IntersectionMethod = "independent" | "conditional";

export type ProbabilityInputField =
  | "favorableCases"
  | "possibleCases"
  | "probabilityA"
  | "probabilityB"
  | "intersection"
  | "conditionalA";

export interface BasicProbabilityRawInput {
  mode: ProbabilityMode;
  format: ProbabilityInputFormat;
  unionRelation: UnionRelation;
  intersectionMethod: IntersectionMethod;
  favorableCases: string;
  possibleCases: string;
  probabilityA: string;
  probabilityB: string;
  intersection: string;
  conditionalA: string;
}

export interface ProbabilityInputError {
  field: ProbabilityInputField;
  message: string;
}

export interface BasicProbabilityCalculation {
  mode: ProbabilityMode;
  title: string;
  value: number;
  percentage: string;
  decimal: string;
  fraction: string;
  fractionApproximate: boolean;
  interpretation: string;
  formula: string;
  substitution: string;
  note: string;
  warnings: string[];
  copyText: string;
}

export type BasicProbabilityResult =
  | { ok: true; calculation: BasicProbabilityCalculation }
  | { ok: false; errors: ProbabilityInputError[] };

export interface ProbabilityExample {
  mode: ProbabilityMode;
  label: string;
  description: string;
  format: ProbabilityInputFormat;
  unionRelation: UnionRelation;
  intersectionMethod: IntersectionMethod;
  favorableCases?: string;
  possibleCases?: string;
  probabilityA?: string;
  probabilityB?: string;
  intersection?: string;
  conditionalA?: string;
}

interface Rational {
  numerator: bigint;
  denominator: bigint;
}

interface ParsedProbability {
  rational: Rational;
  value: number;
  normalized: string;
}

const MAX_CASES = 1_000_000_000;
const MAX_INPUT_DECIMALS = 6;
const MAX_VISIBLE_DENOMINATOR = 10_000;
const EPSILON = 1e-12;

export const BASIC_PROBABILITY_CANONICAL_PATH =
  "/probabilidad-estadistica/calculadora-probabilidad-basica";

export const PROBABILITY_EXAMPLES: ProbabilityExample[] = [
  {
    mode: "simple",
    label: "Dado",
    description: "Obtener un número par al lanzar un dado equilibrado.",
    format: "percent",
    unionRelation: "general",
    intersectionMethod: "independent",
    favorableCases: "3",
    possibleCases: "6",
  },
  {
    mode: "complement",
    label: "Complemento",
    description: "Calcular la probabilidad de que A no ocurra si P(A)=25%.",
    format: "percent",
    unionRelation: "general",
    intersectionMethod: "independent",
    probabilityA: "25",
  },
  {
    mode: "union",
    label: "Unión",
    description: "Combinar dos eventos que pueden ocurrir al mismo tiempo.",
    format: "percent",
    unionRelation: "general",
    intersectionMethod: "independent",
    probabilityA: "40",
    probabilityB: "50",
    intersection: "20",
  },
  {
    mode: "intersection",
    label: "Intersección",
    description: "Calcular la coincidencia de dos eventos independientes.",
    format: "percent",
    unionRelation: "general",
    intersectionMethod: "independent",
    probabilityA: "40",
    probabilityB: "50",
  },
  {
    mode: "conditional",
    label: "Condicional",
    description: "Calcular P(A | B) con una intersección de 20% y P(B)=50%.",
    format: "percent",
    unionRelation: "general",
    intersectionMethod: "independent",
    probabilityB: "50",
    intersection: "20",
  },
];

export function calculateBasicProbabilityFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  switch (input.mode) {
    case "simple":
      return calculateSimpleFromInput(input);
    case "complement":
      return calculateComplementFromInput(input);
    case "union":
      return calculateUnionFromInput(input);
    case "intersection":
      return calculateIntersectionFromInput(input);
    case "conditional":
      return calculateConditionalFromInput(input);
  }
}

export function parseProbabilityInput(
  rawValue: string,
  format: ProbabilityInputFormat,
  label = "La probabilidad",
):
  | { ok: true; parsed: ParsedProbability }
  | { ok: false; message: string } {
  let value = rawValue.trim();

  if (!value) {
    return { ok: false, message: `Completa ${label}.` };
  }

  if (format === "decimal" && value.includes("%")) {
    return {
      ok: false,
      message:
        "Cambia el formato a porcentaje o escribe la probabilidad como decimal.",
    };
  }

  if (format === "percent") {
    value = value.replace(/\s*%\s*$/, "");
  }

  if (value.includes(",") && value.includes(".")) {
    return {
      ok: false,
      message: `${label} no puede combinar coma y punto decimal.`,
    };
  }

  const normalized = value.replace(",", ".");

  if (!/^(?:\d+|\d*\.\d+)$/.test(normalized)) {
    return {
      ok: false,
      message: `${label} debe ser un número sin signos, fracciones ni exponentes.`,
    };
  }

  const decimals = normalized.split(".")[1]?.length ?? 0;

  if (decimals > MAX_INPUT_DECIMALS) {
    return {
      ok: false,
      message: `${label} admite como máximo ${MAX_INPUT_DECIMALS} decimales.`,
    };
  }

  const rational = decimalStringToRational(normalized);
  const upperBound = format === "percent" ? rationalFromInteger(100) : rationalFromInteger(1);

  if (compareRational(rational, upperBound) > 0) {
    return {
      ok: false,
      message:
        format === "percent"
          ? `${label} debe estar entre 0% y 100%.`
          : `${label} debe estar entre 0 y 1.`,
    };
  }

  const normalizedRational =
    format === "percent"
      ? divideRational(rational, rationalFromInteger(100))
      : rational;

  return {
    ok: true,
    parsed: {
      rational: normalizedRational,
      value: rationalToNumber(normalizedRational),
      normalized: trimDecimal(normalized),
    },
  };
}

export function formatProbabilityPercentage(value: number): string {
  if (value > 0 && value * 100 < 0.01) return "< 0.01%";
  if (value < 1 && value * 100 > 99.99) return "> 99.99%";

  return `${formatNumber(value * 100, 2)}%`;
}

export function formatProbabilityDecimal(value: number): string {
  return formatNumber(value, 6);
}

export function formatProbabilityFraction(
  rational: Rational,
): { text: string; approximate: boolean } {
  const reduced = normalizeRational(rational);

  if (reduced.denominator <= BigInt(MAX_VISIBLE_DENOMINATOR)) {
    return {
      text: `${reduced.numerator}/${reduced.denominator}`,
      approximate: false,
    };
  }

  const approximation = approximateFraction(
    rationalToNumber(reduced),
    MAX_VISIBLE_DENOMINATOR,
  );

  return {
    text: `≈ ${approximation.numerator}/${approximation.denominator}`,
    approximate: true,
  };
}

function calculateSimpleFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  const favorable = parseCaseInteger(
    input.favorableCases,
    "Casos favorables",
    true,
  );
  const possible = parseCaseInteger(
    input.possibleCases,
    "Casos posibles",
    false,
  );
  const errors: ProbabilityInputError[] = [];

  if (!favorable.ok) {
    errors.push({ field: "favorableCases", message: favorable.message });
  }

  if (!possible.ok) {
    errors.push({ field: "possibleCases", message: possible.message });
  }

  if (errors.length > 0 || !favorable.ok || !possible.ok) {
    return { ok: false, errors };
  }

  if (favorable.value > possible.value) {
    return {
      ok: false,
      errors: [
        {
          field: "favorableCases",
          message:
            "Los casos favorables no pueden superar los casos posibles.",
        },
      ],
    };
  }

  const result = normalizeRational({
    numerator: BigInt(favorable.value),
    denominator: BigInt(possible.value),
  });

  return {
    ok: true,
    calculation: buildCalculation({
      mode: "simple",
      title: "Probabilidad de A",
      result,
      formula: "P(A) = casos favorables / casos posibles",
      substitution: `P(A) = ${favorable.value} / ${possible.value} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
      note: "Este cálculo supone resultados igualmente probables.",
      forceExactFraction: true,
      warnings: [
        "Confirma que todos los resultados posibles sean igualmente probables.",
      ],
    }),
  };
}

function calculateComplementFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  const probabilityA = parseProbabilityField(
    input.probabilityA,
    input.format,
    "probabilityA",
    "P(A)",
  );

  if (!probabilityA.ok) return probabilityA.result;

  const result = subtractRational(
    rationalFromInteger(1),
    probabilityA.parsed.rational,
  );

  return {
    ok: true,
    calculation: buildCalculation({
      mode: "complement",
      title: "Probabilidad de no A",
      result,
      formula: "P(no A) = 1 − P(A)",
      substitution: `P(no A) = 1 − ${formatProbabilityDecimal(probabilityA.parsed.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
      note: "El complemento reúne todos los resultados en los que A no ocurre.",
    }),
  };
}

function calculateUnionFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  const probabilityA = parseProbabilityField(
    input.probabilityA,
    input.format,
    "probabilityA",
    "P(A)",
  );
  const probabilityB = parseProbabilityField(
    input.probabilityB,
    input.format,
    "probabilityB",
    "P(B)",
  );
  const errors: ProbabilityInputError[] = [];

  if (!probabilityA.ok) errors.push(...probabilityA.result.errors);
  if (!probabilityB.ok) errors.push(...probabilityB.result.errors);

  let intersection: ParsedProbability | undefined;

  if (input.unionRelation === "general") {
    const parsedIntersection = parseProbabilityField(
      input.intersection,
      input.format,
      "intersection",
      "P(A y B)",
    );

    if (!parsedIntersection.ok) {
      errors.push(...parsedIntersection.result.errors);
    } else {
      intersection = parsedIntersection.parsed;
    }
  }

  if (
    errors.length > 0 ||
    !probabilityA.ok ||
    !probabilityB.ok
  ) {
    return { ok: false, errors };
  }

  const a = probabilityA.parsed.rational;
  const b = probabilityB.parsed.rational;

  if (input.unionRelation === "exclusive") {
    const result = addRational(a, b);

    if (compareRational(result, rationalFromInteger(1)) > 0) {
      return {
        ok: false,
        errors: [
          {
            field: "probabilityB",
            message:
              "Dos eventos que no pueden ocurrir juntos no pueden sumar más de 100%.",
          },
        ],
      };
    }

    return {
      ok: true,
      calculation: buildCalculation({
        mode: "union",
        title: "Probabilidad de A o B",
        result,
        formula: "P(A o B) = P(A) + P(B)",
        substitution: `P(A o B) = ${formatProbabilityDecimal(probabilityA.parsed.value)} + ${formatProbabilityDecimal(probabilityB.parsed.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
        note:
          "Como los eventos son mutuamente excluyentes, su intersección es 0.",
      }),
    };
  }

  if (!intersection) {
    return { ok: false, errors };
  }

  const lowerBound = maxRational(
    rationalFromInteger(0),
    subtractRational(addRational(a, b), rationalFromInteger(1)),
  );
  const upperBound = minRational(a, b);

  if (compareRational(intersection.rational, lowerBound) < 0) {
    return {
      ok: false,
      errors: [
        {
          field: "intersection",
          message: `Con P(A) = ${formatProbabilityPercentage(probabilityA.parsed.value)} y P(B) = ${formatProbabilityPercentage(probabilityB.parsed.value)}, ambos eventos deben coincidir al menos un ${formatProbabilityPercentage(rationalToNumber(lowerBound))}.`,
        },
      ],
    };
  }

  if (compareRational(intersection.rational, upperBound) > 0) {
    return {
      ok: false,
      errors: [
        {
          field: "intersection",
          message:
            "P(A y B) no puede ser mayor que P(A) ni que P(B).",
        },
      ],
    };
  }

  const result = subtractRational(
    addRational(a, b),
    intersection.rational,
  );

  return {
    ok: true,
    calculation: buildCalculation({
      mode: "union",
      title: "Probabilidad de A o B",
      result,
      formula: "P(A o B) = P(A) + P(B) − P(A y B)",
      substitution: `P(A o B) = ${formatProbabilityDecimal(probabilityA.parsed.value)} + ${formatProbabilityDecimal(probabilityB.parsed.value)} − ${formatProbabilityDecimal(intersection.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
      note: "La intersección se resta para evitar contarla dos veces.",
    }),
  };
}

function calculateIntersectionFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  const probabilityB = parseProbabilityField(
    input.probabilityB,
    input.format,
    "probabilityB",
    "P(B)",
  );

  if (input.intersectionMethod === "independent") {
    const probabilityA = parseProbabilityField(
      input.probabilityA,
      input.format,
      "probabilityA",
      "P(A)",
    );
    const errors: ProbabilityInputError[] = [];

    if (!probabilityA.ok) errors.push(...probabilityA.result.errors);
    if (!probabilityB.ok) errors.push(...probabilityB.result.errors);

    if (errors.length > 0 || !probabilityA.ok || !probabilityB.ok) {
      return { ok: false, errors };
    }

    const result = multiplyRational(
      probabilityA.parsed.rational,
      probabilityB.parsed.rational,
    );

    return {
      ok: true,
      calculation: buildCalculation({
        mode: "intersection",
        title: "Probabilidad de A y B",
        result,
        formula: "P(A y B) = P(A) × P(B)",
        substitution: `P(A y B) = ${formatProbabilityDecimal(probabilityA.parsed.value)} × ${formatProbabilityDecimal(probabilityB.parsed.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
        note:
          "La multiplicación se usa porque marcaste los eventos como independientes.",
        warnings: [
          "La calculadora usa independencia porque así lo indicaste; no puede comprobarla con estos datos.",
        ],
      }),
    };
  }

  const conditionalA = parseProbabilityField(
    input.conditionalA,
    input.format,
    "conditionalA",
    "P(A | B)",
  );
  const errors: ProbabilityInputError[] = [];

  if (!probabilityB.ok) errors.push(...probabilityB.result.errors);
  if (!conditionalA.ok) errors.push(...conditionalA.result.errors);

  if (errors.length > 0 || !probabilityB.ok || !conditionalA.ok) {
    return { ok: false, errors };
  }

  if (isZero(probabilityB.parsed.rational)) {
    return {
      ok: false,
      errors: [
        {
          field: "probabilityB",
          message:
            "P(B) debe ser mayor que cero para usar una probabilidad condicionada a B.",
        },
      ],
    };
  }

  const result = multiplyRational(
    conditionalA.parsed.rational,
    probabilityB.parsed.rational,
  );

  return {
    ok: true,
    calculation: buildCalculation({
      mode: "intersection",
      title: "Probabilidad de A y B",
      result,
      formula: "P(A y B) = P(A | B) × P(B)",
      substitution: `P(A y B) = ${formatProbabilityDecimal(conditionalA.parsed.value)} × ${formatProbabilityDecimal(probabilityB.parsed.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
      note:
        "La probabilidad condicional indica qué parte de los casos de B también pertenece a A.",
    }),
  };
}

function calculateConditionalFromInput(
  input: BasicProbabilityRawInput,
): BasicProbabilityResult {
  const probabilityB = parseProbabilityField(
    input.probabilityB,
    input.format,
    "probabilityB",
    "P(B)",
  );
  const intersection = parseProbabilityField(
    input.intersection,
    input.format,
    "intersection",
    "P(A y B)",
  );
  const errors: ProbabilityInputError[] = [];

  if (!probabilityB.ok) errors.push(...probabilityB.result.errors);
  if (!intersection.ok) errors.push(...intersection.result.errors);

  if (errors.length > 0 || !probabilityB.ok || !intersection.ok) {
    return { ok: false, errors };
  }

  if (isZero(probabilityB.parsed.rational)) {
    return {
      ok: false,
      errors: [
        {
          field: "probabilityB",
          message: "P(B) debe ser mayor que cero.",
        },
      ],
    };
  }

  if (
    compareRational(
      intersection.parsed.rational,
      probabilityB.parsed.rational,
    ) > 0
  ) {
    return {
      ok: false,
      errors: [
        {
          field: "intersection",
          message:
            "P(A y B) no puede ser mayor que P(B), porque la intersección forma parte de B.",
        },
      ],
    };
  }

  const result = divideRational(
    intersection.parsed.rational,
    probabilityB.parsed.rational,
  );

  return {
    ok: true,
    calculation: buildCalculation({
      mode: "conditional",
      title: "Probabilidad de A dado B",
      result,
      formula: "P(A | B) = P(A y B) / P(B)",
      substitution: `P(A | B) = ${formatProbabilityDecimal(intersection.parsed.value)} / ${formatProbabilityDecimal(probabilityB.parsed.value)} = ${formatProbabilityDecimal(rationalToNumber(result))}`,
      note:
        "El espacio de referencia se limita a los casos donde ocurrió B.",
    }),
  };
}

function parseProbabilityField(
  rawValue: string,
  format: ProbabilityInputFormat,
  field: ProbabilityInputField,
  label: string,
):
  | { ok: true; parsed: ParsedProbability }
  | { ok: false; result: { ok: false; errors: ProbabilityInputError[] } } {
  const parsed = parseProbabilityInput(rawValue, format, label);

  if (!parsed.ok) {
    return {
      ok: false,
      result: {
        ok: false,
        errors: [{ field, message: parsed.message }],
      },
    };
  }

  return { ok: true, parsed: parsed.parsed };
}

function parseCaseInteger(
  rawValue: string,
  label: string,
  allowZero: boolean,
):
  | { ok: true; value: number }
  | { ok: false; message: string } {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, message: `Completa ${label.toLowerCase()}.` };
  }

  if (!/^\d+$/.test(value)) {
    return {
      ok: false,
      message: `${label} debe ser un entero sin decimales ni signos.`,
    };
  }

  const numericValue = Number(value);
  const minimum = allowZero ? 0 : 1;

  if (
    !Number.isSafeInteger(numericValue) ||
    numericValue < minimum ||
    numericValue > MAX_CASES
  ) {
    return {
      ok: false,
      message: `${label} debe estar entre ${minimum} y ${new Intl.NumberFormat("es-MX").format(MAX_CASES)}.`,
    };
  }

  return { ok: true, value: numericValue };
}

function buildCalculation({
  mode,
  title,
  result,
  formula,
  substitution,
  note,
  warnings = [],
  forceExactFraction = false,
}: {
  mode: ProbabilityMode;
  title: string;
  result: Rational;
  formula: string;
  substitution: string;
  note: string;
  warnings?: string[];
  forceExactFraction?: boolean;
}): BasicProbabilityCalculation {
  const value = cleanProbability(rationalToNumber(result));
  const percentage = formatProbabilityPercentage(value);
  const decimal = formatProbabilityDecimal(value);
  const fraction = forceExactFraction
    ? {
        text: `${result.numerator}/${result.denominator}`,
        approximate: false,
      }
    : formatProbabilityFraction(result);
  const interpretation = buildInterpretation(value, result);
  const allWarnings = [...warnings];

  if (value > 0 && value * 100 < 0.01) {
    allWarnings.push(
      "La probabilidad es positiva, aunque el porcentaje mostrado sea menor que 0.01%.",
    );
  }

  const copyText = [
    title,
    "",
    `Resultado: ${percentage}`,
    `Decimal: ${decimal}`,
    `Fracción: ${fraction.text}`,
    `Interpretación: ${interpretation}`,
    "",
    `Fórmula: ${formula}`,
    `Sustitución: ${substitution}`,
    "",
    note,
    "Calculado en calculadoras.tools",
  ].join("\n");

  return {
    mode,
    title,
    value,
    percentage,
    decimal,
    fraction: fraction.text,
    fractionApproximate: fraction.approximate,
    interpretation,
    formula,
    substitution,
    note,
    warnings: allWarnings,
    copyText,
  };
}

function buildInterpretation(value: number, rational: Rational): string {
  if (Math.abs(value) < EPSILON) {
    return "El evento no ocurre en ninguno de los resultados considerados.";
  }

  if (Math.abs(value - 1) < EPSILON) {
    return "El evento ocurre en todos los resultados considerados.";
  }

  const perHundred = formatNumber(value * 100, 2);
  const reduced = normalizeRational(rational);

  if (reduced.numerator === 1n && reduced.denominator <= 10_000n) {
    return `Equivale a ${perHundred} de cada 100 resultados; es decir, 1 de cada ${reduced.denominator}.`;
  }

  const inverse = 1 / value;
  const roundedInverse = Math.round(inverse);

  if (
    roundedInverse >= 2 &&
    roundedInverse <= 10_000 &&
    Math.abs(inverse - roundedInverse) <= 0.02
  ) {
    return `Equivale a ${perHundred} de cada 100 resultados; aproximadamente 1 de cada ${roundedInverse}.`;
  }

  return `Equivale a ${perHundred} de cada 100 resultados.`;
}

function decimalStringToRational(value: string): Rational {
  const [integerPart, decimalPart = ""] = value.split(".");
  const denominator = 10n ** BigInt(decimalPart.length);
  const numerator =
    BigInt(integerPart || "0") * denominator + BigInt(decimalPart || "0");

  return normalizeRational({ numerator, denominator });
}

function rationalFromInteger(value: number): Rational {
  return { numerator: BigInt(value), denominator: 1n };
}

function normalizeRational(rational: Rational): Rational {
  if (rational.denominator === 0n) {
    throw new RangeError("El denominador no puede ser cero.");
  }

  let numerator = rational.numerator;
  let denominator = rational.denominator;

  if (denominator < 0n) {
    numerator *= -1n;
    denominator *= -1n;
  }

  const divisor = greatestCommonDivisor(
    numerator < 0n ? -numerator : numerator,
    denominator,
  );

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function greatestCommonDivisor(a: bigint, b: bigint): bigint {
  let left = a;
  let right = b;

  while (right !== 0n) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left === 0n ? 1n : left;
}

function addRational(a: Rational, b: Rational): Rational {
  return normalizeRational({
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
}

function subtractRational(a: Rational, b: Rational): Rational {
  return normalizeRational({
    numerator: a.numerator * b.denominator - b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
}

function multiplyRational(a: Rational, b: Rational): Rational {
  return normalizeRational({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

function divideRational(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) {
    throw new RangeError("No se puede dividir entre cero.");
  }

  return normalizeRational({
    numerator: a.numerator * b.denominator,
    denominator: a.denominator * b.numerator,
  });
}

function compareRational(a: Rational, b: Rational): number {
  const left = a.numerator * b.denominator;
  const right = b.numerator * a.denominator;

  return left < right ? -1 : left > right ? 1 : 0;
}

function minRational(a: Rational, b: Rational): Rational {
  return compareRational(a, b) <= 0 ? a : b;
}

function maxRational(a: Rational, b: Rational): Rational {
  return compareRational(a, b) >= 0 ? a : b;
}

function rationalToNumber(rational: Rational): number {
  return Number(rational.numerator) / Number(rational.denominator);
}

function isZero(rational: Rational): boolean {
  return rational.numerator === 0n;
}

function approximateFraction(
  value: number,
  maximumDenominator: number,
): { numerator: number; denominator: number } {
  let bestNumerator = 0;
  let bestDenominator = 1;
  let bestError = Math.abs(value);

  for (let denominator = 1; denominator <= maximumDenominator; denominator += 1) {
    const numerator = Math.round(value * denominator);
    const error = Math.abs(value - numerator / denominator);

    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;
    }

    if (error < Number.EPSILON) break;
  }

  const divisor = numberGreatestCommonDivisor(
    Math.abs(bestNumerator),
    bestDenominator,
  );

  return {
    numerator: bestNumerator / divisor,
    denominator: bestDenominator / divisor,
  };
}

function numberGreatestCommonDivisor(a: number, b: number): number {
  let left = a;
  let right = b;

  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left || 1;
}

function cleanProbability(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("La probabilidad calculada no es finita.");
  }

  if (value < -EPSILON || value > 1 + EPSILON) {
    throw new RangeError("La probabilidad calculada está fuera del rango 0-1.");
  }

  if (Math.abs(value) < EPSILON) return 0;
  if (Math.abs(value - 1) < EPSILON) return 1;
  return value;
}

function formatNumber(value: number, maximumFractionDigits: number): string {
  return new Intl.NumberFormat("es-MX", {
    useGrouping: false,
    maximumFractionDigits,
  }).format(value);
}

function trimDecimal(value: string): string {
  return value
    .replace(/^0+(?=\d)/, "")
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.0+$/, "")
    .replace(/^\./, "0.");
}
