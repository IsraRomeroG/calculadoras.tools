export type CombinatoricsMode =
  | "combination"
  | "arrangement"
  | "combination-repetition"
  | "arrangement-repetition";

export type CombinatoricsInputField = "n" | "k";

export type CombinatoricsParseError =
  | "required"
  | "invalid"
  | "above-limit";

export interface ParsedCombinatoricsInteger {
  ok: true;
  value: number;
  normalized: string;
}

export interface InvalidCombinatoricsInteger {
  ok: false;
  error: CombinatoricsParseError;
  message: string;
}

export type ParseCombinatoricsIntegerResult =
  | ParsedCombinatoricsInteger
  | InvalidCombinatoricsInteger;

export interface CombinatoricsInput {
  orderMatters: boolean;
  repetitionAllowed: boolean;
  n: number;
  k: number;
}

export interface CombinatoricsInputError {
  field: CombinatoricsInputField;
  message: string;
}

export interface CombinatoricsCalculation {
  mode: CombinatoricsMode;
  modeLabel: string;
  notation: string;
  n: number;
  k: number;
  result: bigint;
  exact: string;
  formattedExact: string;
  digitCount: number;
  isLongResult: boolean;
  compact: string;
  formula: string;
  substitution: string;
  decisionExplanation: string;
  interpretation: string;
  procedure: string[];
  copyText: string;
}

export type CalculateCombinatoricsFromInputResult =
  | {
      ok: true;
      calculation: CombinatoricsCalculation;
    }
  | {
      ok: false;
      errors: CombinatoricsInputError[];
    };

export interface CombinatoricsExample {
  id: string;
  label: string;
  description: string;
  orderMatters: boolean;
  repetitionAllowed: boolean;
  n: number;
  k: number;
}

interface ModeMetadata {
  label: string;
  notation: string;
  formula: string;
}

export const COMBINATORICS_CANONICAL_PATH =
  "/en/probability-statistics/combinations-permutations-calculator";
export const MAX_COMBINATORICS_INPUT = 10_000;
export const READABLE_RESULT_DIGITS = 24;
export const MAX_VISIBLE_FACTORS = 12;

export const COMBINATORICS_EXAMPLES: CombinatoricsExample[] = [
  {
    id: "committee",
    label: "Committee",
    description:
      "Choose 3 people from 10 when order does not change the group.",
    orderMatters: false,
    repetitionAllowed: false,
    n: 10,
    k: 3,
  },
  {
    id: "podium",
    label: "Podio",
    description:
      "Assign gold, silver and bronze among 10 participants without repetition.",
    orderMatters: true,
    repetitionAllowed: false,
    n: 10,
    k: 3,
  },
  {
    id: "flavors",
    label: "Sabores",
    description:
      "Choose 3 scoops from 5 flavors, allowing flavors to repeat.",
    orderMatters: false,
    repetitionAllowed: true,
    n: 5,
    k: 3,
  },
  {
    id: "pin",
    label: "PIN",
    description:
      "Create a 4-position PIN using 10 digits that can repeat.",
    orderMatters: true,
    repetitionAllowed: true,
    n: 10,
    k: 4,
  },
];

const MODE_METADATA: Record<CombinatoricsMode, ModeMetadata> = {
  combination: {
    label: "Combination without repetition",
    notation: "C(n, k)",
    formula: "C(n, k) = n! / (k! × (n − k)!)",
  },
  arrangement: {
    label: "Arrangement without repetition",
    notation: "P(n, k)",
    formula: "P(n, k) = n! / (n − k)!",
  },
  "combination-repetition": {
    label: "Combination with repetition",
    notation: "CR(n, k)",
    formula: "CR(n, k) = C(n + k − 1, k)",
  },
  "arrangement-repetition": {
    label: "Arrangement with repetition",
    notation: "AR(n, k)",
    formula: "AR(n, k) = n^k",
  },
};

export function getCombinatoricsMode(
  orderMatters: boolean,
  repetitionAllowed: boolean,
): CombinatoricsMode {
  if (orderMatters && repetitionAllowed) {
    return "arrangement-repetition";
  }

  if (orderMatters) {
    return "arrangement";
  }

  if (repetitionAllowed) {
    return "combination-repetition";
  }

  return "combination";
}

export function getCombinatoricsModeMetadata(
  mode: CombinatoricsMode,
): ModeMetadata {
  return MODE_METADATA[mode];
}

export function parseCombinatoricsInteger(
  rawValue: string,
  field: CombinatoricsInputField,
): ParseCombinatoricsIntegerResult {
  const value = rawValue.trim();
  const label =
    field === "n" ? "Available elements (n)" : "Chosen elements (k)";

  if (!value) {
    return {
      ok: false,
      error: "required",
      message: `Complete ${label.toLowerCase()}.`,
    };
  }

  if (!/^\d+$/.test(value)) {
    return {
      ok: false,
      error: "invalid",
      message: `${label} must be a nonnegative integer without decimals or exponents.`,
    };
  }

  const normalized = value.replace(/^0+(?=\d)/, "");
  const numericValue = Number(normalized);

  if (
    !Number.isSafeInteger(numericValue) ||
    numericValue > MAX_COMBINATORICS_INPUT
  ) {
    return {
      ok: false,
      error: "above-limit",
      message: `${label} cannot exceed ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
    };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function calculateCombinatoricsFromInput(input: {
  orderMatters: boolean;
  repetitionAllowed: boolean;
  n: string;
  k: string;
}): CalculateCombinatoricsFromInputResult {
  const parsedN = parseCombinatoricsInteger(input.n, "n");
  const parsedK = parseCombinatoricsInteger(input.k, "k");
  const errors: CombinatoricsInputError[] = [];

  if (!parsedN.ok) {
    errors.push({ field: "n", message: parsedN.message });
  }

  if (!parsedK.ok) {
    errors.push({ field: "k", message: parsedK.message });
  }

  if (errors.length > 0 || !parsedN.ok || !parsedK.ok) {
    return { ok: false, errors };
  }

  const validationErrors = validateCombinatoricsInput({
    orderMatters: input.orderMatters,
    repetitionAllowed: input.repetitionAllowed,
    n: parsedN.value,
    k: parsedK.value,
  });

  if (validationErrors.length > 0) {
    return { ok: false, errors: validationErrors };
  }

  return {
    ok: true,
    calculation: calculateCombinatorics({
      orderMatters: input.orderMatters,
      repetitionAllowed: input.repetitionAllowed,
      n: parsedN.value,
      k: parsedK.value,
    }),
  };
}

export function validateCombinatoricsInput(
  input: CombinatoricsInput,
): CombinatoricsInputError[] {
  const errors: CombinatoricsInputError[] = [];

  if (
    !Number.isInteger(input.n) ||
    input.n < 0 ||
    input.n > MAX_COMBINATORICS_INPUT
  ) {
    errors.push({
      field: "n",
      message: `Available elements (n) must be an integer from 0 to ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
    });
  }

  if (
    !Number.isInteger(input.k) ||
    input.k < 0 ||
    input.k > MAX_COMBINATORICS_INPUT
  ) {
    errors.push({
      field: "k",
      message: `Chosen elements (k) must be an integer from 0 to ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
    });
  }

  if (errors.length > 0) {
    return errors;
  }

  if (!input.repetitionAllowed && input.k > input.n) {
    errors.push({
      field: "k",
      message:
        "When choosing without repetition, k cannot be greater than n.",
    });
  }

  if (
    !input.orderMatters &&
    input.repetitionAllowed &&
    input.n === 0 &&
    input.k > 0
  ) {
    errors.push({
      field: "n",
      message:
        "For combinations with repetition, at least one element must be available when k is greater than 0.",
    });
  }

  return errors;
}

export function calculateCombinatorics(
  input: CombinatoricsInput,
): CombinatoricsCalculation {
  const errors = validateCombinatoricsInput(input);

  if (errors.length > 0) {
    throw new RangeError(errors[0].message);
  }

  const mode = getCombinatoricsMode(
    input.orderMatters,
    input.repetitionAllowed,
  );
  const metadata = getCombinatoricsModeMetadata(mode);
  const result = calculateByMode(mode, input.n, input.k);
  const exact = result.toString();
  const digitCount = exact.length;
  const isLongResult = digitCount > READABLE_RESULT_DIGITS;
  const formattedExact = isLongResult ? exact : formatBigInt(result);
  const compact = formatScientificFromExact(exact);
  const visibleResult = isLongResult ? `≈ ${compact}` : exact;
  const substitution = buildSubstitution(
    mode,
    input.n,
    input.k,
    visibleResult,
  );
  const decisionExplanation = buildDecisionExplanation(mode);
  const interpretation = buildInterpretation(
    mode,
    input.n,
    input.k,
    isLongResult ? `aproximadamente ${compact}` : formattedExact,
  );
  const procedure = buildProcedure(
    mode,
    input.n,
    input.k,
    isLongResult ? `an integer with ${digitCount} digits` : exact,
  );
  const copyText = [
    metadata.label,
    `n = ${input.n}, k = ${input.k}`,
    `${buildAppliedNotation(mode, input.n, input.k)} = ${exact}`,
    buildInterpretation(mode, input.n, input.k, exact),
  ].join("\n");

  return {
    mode,
    modeLabel: metadata.label,
    notation: metadata.notation,
    n: input.n,
    k: input.k,
    result,
    exact,
    formattedExact,
    digitCount,
    isLongResult,
    compact,
    formula: metadata.formula,
    substitution,
    decisionExplanation,
    interpretation,
    procedure,
    copyText,
  };
}

export function calculateCombination(n: number, k: number): bigint {
  assertValidDirectCalculation(n, k, false);

  return calculateCombinationCore(n, k);
}

function calculateCombinationCore(n: number, k: number): bigint {
  const r = Math.min(k, n - k);
  let result = 1n;

  for (let i = 1; i <= r; i += 1) {
    result =
      (result * BigInt(n - r + i)) /
      BigInt(i);
  }

  return result;
}

export function calculateArrangement(n: number, k: number): bigint {
  assertValidDirectCalculation(n, k, false);
  let result = 1n;

  for (let i = 0; i < k; i += 1) {
    result *= BigInt(n - i);
  }

  return result;
}

export function calculateCombinationWithRepetition(
  n: number,
  k: number,
): bigint {
  assertValidDirectCalculation(n, k, true);

  if (k === 0) {
    return 1n;
  }

  if (n === 0) {
    throw new RangeError(
      "At least one element must be available when k is greater than 0.",
    );
  }

  return calculateCombinationCore(n + k - 1, k);
}

export function calculateArrangementWithRepetition(
  n: number,
  k: number,
): bigint {
  assertValidDirectCalculation(n, k, true);

  return BigInt(n) ** BigInt(k);
}

export function formatBigInt(value: bigint): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatScientificFromExact(exact: string): string {
  if (!/^\d+$/.test(exact)) {
    throw new TypeError("The exact value must contain digits only.");
  }

  if (exact === "0") {
    return "0";
  }

  const significant = exact.slice(0, 5).padEnd(Math.min(5, exact.length), "0");
  const decimals = significant.slice(1).replace(/0+$/, "");
  const mantissa = decimals ? `${significant[0]}.${decimals}` : significant[0];

  return `${mantissa} × 10^${exact.length - 1}`;
}

function calculateByMode(
  mode: CombinatoricsMode,
  n: number,
  k: number,
): bigint {
  switch (mode) {
    case "combination":
      return calculateCombination(n, k);
    case "arrangement":
      return calculateArrangement(n, k);
    case "combination-repetition":
      return calculateCombinationWithRepetition(n, k);
    case "arrangement-repetition":
      return calculateArrangementWithRepetition(n, k);
  }
}

function buildDecisionExplanation(mode: CombinatoricsMode): string {
  switch (mode) {
    case "combination":
      return "Order does not matter and each element can be used once.";
    case "arrangement":
      return "Order matters and each element can be used once.";
    case "combination-repetition":
      return "Order does not matter and elements can repeat.";
    case "arrangement-repetition":
      return "Order matters and each position can repeat elements.";
  }
}

function buildSubstitution(
  mode: CombinatoricsMode,
  n: number,
  k: number,
  exact: string,
): string {
  switch (mode) {
    case "combination":
      return `C(${n}, ${k}) = ${n}! / (${k}! × ${n - k}!) = ${exact}`;
    case "arrangement":
      return `P(${n}, ${k}) = ${n}! / ${n - k}! = ${exact}`;
    case "combination-repetition":
      return `CR(${n}, ${k}) = C(${n + k - 1}, ${k}) = ${exact}`;
    case "arrangement-repetition":
      return `AR(${n}, ${k}) = ${n}^${k} = ${exact}`;
  }
}

function buildAppliedNotation(
  mode: CombinatoricsMode,
  n: number,
  k: number,
): string {
  switch (mode) {
    case "combination":
      return `C(${n}, ${k})`;
    case "arrangement":
      return `P(${n}, ${k})`;
    case "combination-repetition":
      return `CR(${n}, ${k})`;
    case "arrangement-repetition":
      return `AR(${n}, ${k})`;
  }
}

function buildInterpretation(
  mode: CombinatoricsMode,
  n: number,
  k: number,
  resultText: string,
): string {
  const forms = resultText === "1" ? "forma" : "formas";

  switch (mode) {
    case "combination":
      return `There are ${resultText} ${forms} to choose ${k} elements from ${n} when order does not matter and repetition is not allowed.`;
    case "arrangement":
      return `There are ${resultText} ${forms} to arrange ${k} positions using ${n} elements without repeating them.`;
    case "combination-repetition":
      return `There are ${resultText} ${forms} to choose ${k} elements from ${n} when order does not matter and repetition is allowed.`;
    case "arrangement-repetition":
      return `There are ${resultText} ${forms} to fill ${k} positions with ${n} options per position, allowing repetition.`;
  }
}

function buildProcedure(
  mode: CombinatoricsMode,
  n: number,
  k: number,
  exact: string,
): string[] {
  if (k === 0) {
    return [
      "Choosing or filling zero positions produces one possibility: choosing no elements.",
      `The result is ${exact}.`,
    ];
  }

  switch (mode) {
    case "combination": {
      const r = Math.min(k, n - k);

      return [
        `We use the symmetry C(${n}, ${k}) = C(${n}, ${r}) to reduce operations.`,
        buildCombinationProductLine(n, r),
        `The exact result is ${exact}.`,
      ];
    }
    case "arrangement":
      return [
        "We multiply one fewer option at each position because repetition is not allowed.",
        buildArrangementProductLine(n, k),
        `The exact result is ${exact}.`,
      ];
    case "combination-repetition": {
      const transformedN = n + k - 1;
      const r = Math.min(k, transformedN - k);

      return [
        `Transform the problem into C(${transformedN}, ${k}).`,
        buildCombinationProductLine(transformedN, r),
        `The exact result is ${exact}.`,
      ];
    }
    case "arrangement-repetition":
      return [
        `Each of the ${k} positions has ${n} options.`,
        k === 1
          ? `${n} (1 factor) = ${exact}.`
          : `${n} × ${n}${k > 2 ? ` × … × ${n}` : ""} (${k} factores) = ${exact}.`,
      ];
  }
}

function buildCombinationProductLine(n: number, r: number): string {
  if (r === 0) {
    return "The multiplicative product is empty, so it equals 1.";
  }

  if (r > MAX_VISIBLE_FACTORS) {
    return `Apply the multiplicative product with r = ${r}, dividing exactly at each step to preserve precision.`;
  }

  const numerator = Array.from(
    { length: r },
    (_, index) => n - r + index + 1,
  ).join(" × ");
  const denominator = Array.from(
    { length: r },
    (_, index) => index + 1,
  ).join(" × ");

  return `Producto: (${numerator}) / (${denominator}).`;
}

function buildArrangementProductLine(n: number, k: number): string {
  if (k > MAX_VISIBLE_FACTORS) {
    return `Multiply ${k} consecutive factors, from ${n} through ${n - k + 1}.`;
  }

  return `Producto: ${Array.from(
    { length: k },
    (_, index) => n - index,
  ).join(" × ")}.`;
}

function assertValidDirectCalculation(
  n: number,
  k: number,
  repetitionAllowed: boolean,
) {
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    n < 0 ||
    k < 0
  ) {
    throw new RangeError("n and k must be nonnegative integers.");
  }

  if (
    n > MAX_COMBINATORICS_INPUT ||
    k > MAX_COMBINATORICS_INPUT
  ) {
    throw new RangeError(
      `n and k cannot exceed ${MAX_COMBINATORICS_INPUT}.`,
    );
  }

  if (!repetitionAllowed && k > n) {
    throw new RangeError("k cannot be greater than n without repetition.");
  }
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
