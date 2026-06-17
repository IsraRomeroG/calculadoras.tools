export type GcdLcmMode = "gcd" | "lcm" | "both";

export type IntegerListParseError =
  | "too_many_characters"
  | "empty_separator"
  | "decimal"
  | "invalid_token"
  | "too_many_values"
  | "too_many_digits";

export type ParseIntegerListResult =
  | {
      ok: true;
      values: bigint[];
      tokens: string[];
      normalizedInput: string;
    }
  | {
      ok: false;
      error: IntegerListParseError;
      message: string;
      token?: string;
    };

export type GcdLcmInputResult =
  | {
      ok: true;
      calculation: GcdLcmCalculation;
    }
  | {
      ok: false;
      error: IntegerListParseError | "not_enough_values";
      message: string;
      token?: string;
    };

export interface EuclidStep {
  dividend: bigint;
  divisor: bigint;
  quotient: bigint;
  remainder: bigint;
}

export interface GcdPairStep {
  left: bigint;
  right: bigint;
  result: bigint;
  euclidSteps: EuclidStep[];
  note?: string;
}

export interface LcmPairStep {
  left: bigint;
  right: bigint;
  gcd: bigint;
  result: bigint;
  product: bigint;
}

export interface PrimeFactorRow {
  value: bigint;
  text: string;
}

export interface PrimeFactorDetails {
  available: boolean;
  rows: PrimeFactorRow[];
  gcdText: string;
  lcmText: string;
  note?: string;
}

export interface GcdLcmCalculation {
  mode: GcdLcmMode;
  values: bigint[];
  absoluteValues: bigint[];
  normalizedInput: string;
  gcd: bigint;
  lcm: bigint;
  gcdSteps: GcdPairStep[];
  lcmSteps: LcmPairStep[];
  warnings: string[];
  primeFactors: PrimeFactorDetails;
}

export interface GcdLcmExample {
  id: string;
  label: string;
  description: string;
  value: string;
}

export const GCD_LCM_CANONICAL_PATH =
  "/matematicas/calculadora-mcd-mcm";
export const MAX_GCD_LCM_VALUES = 50;
export const MAX_GCD_LCM_CHARACTERS = 5000;
export const MAX_INTEGER_DIGITS = 36;
export const PRIME_FACTORIZATION_LIMIT = 1_000_000n;
export const READABLE_RESULT_DIGITS = 24;
export const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

export const GCD_LCM_EXAMPLES: GcdLcmExample[] = [
  {
    id: "common",
    label: "12, 18, 30",
    description: "Caso común con MCD y MCM claros.",
    value: "12, 18, 30",
  },
  {
    id: "fractions",
    label: "8, 12, 15",
    description: "Denominadores frecuentes al buscar común denominador.",
    value: "8, 12, 15",
  },
  {
    id: "two-values",
    label: "42, 56",
    description: "Dos números con divisor común.",
    value: "42, 56",
  },
  {
    id: "coprime",
    label: "7, 13",
    description: "Números primos relativos.",
    value: "7, 13",
  },
  {
    id: "zero",
    label: "0, 12",
    description: "Regla con cero.",
    value: "0, 12",
  },
  {
    id: "negative",
    label: "-24, 36",
    description: "Uso de valores absolutos con negativos.",
    value: "-24, 36",
  },
];

export function parseIntegerList(rawValue: string): ParseIntegerListResult {
  const value = rawValue.replaceAll("−", "-");

  if (value.length > MAX_GCD_LCM_CHARACTERS) {
    return {
      ok: false,
      error: "too_many_characters",
      message: `La lista supera el límite de ${MAX_GCD_LCM_CHARACTERS} caracteres.`,
    };
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return {
      ok: true,
      values: [],
      tokens: [],
      normalizedInput: "",
    };
  }

  if (hasEmptyCommaSeparator(trimmed)) {
    return {
      ok: false,
      error: "empty_separator",
      message: "Hay separadores sin número entre ellos. Revisa la lista.",
    };
  }

  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);

  if (tokens.length > MAX_GCD_LCM_VALUES) {
    return {
      ok: false,
      error: "too_many_values",
      message: `La lista supera el límite de ${MAX_GCD_LCM_VALUES} números.`,
    };
  }

  const values: bigint[] = [];

  for (const token of tokens) {
    const parsed = parseIntegerToken(token);

    if (!parsed.ok) {
      return parsed;
    }

    values.push(parsed.value);
  }

  return {
    ok: true,
    values,
    tokens,
    normalizedInput: values.map(formatBigInt).join(", "),
  };
}

export function calculateGcdLcmFromInput(
  rawValue: string,
  mode: GcdLcmMode = "both",
): GcdLcmInputResult {
  const parsed = parseIntegerList(rawValue);

  if (!parsed.ok) {
    return parsed;
  }

  if (parsed.values.length < 2) {
    return {
      ok: false,
      error: "not_enough_values",
      message: "Escribe al menos 2 números enteros.",
    };
  }

  return {
    ok: true,
    calculation: calculateGcdLcm(parsed.values, mode),
  };
}

export function calculateGcdLcm(
  values: bigint[],
  mode: GcdLcmMode = "both",
): GcdLcmCalculation {
  if (values.length < 2) {
    throw new RangeError("La lista debe incluir al menos 2 números.");
  }

  const absoluteValues = values.map(absBigInt);
  const gcdSteps = buildGcdSteps(absoluteValues);
  const lcmSteps = buildLcmSteps(absoluteValues);
  const gcd = gcdSteps[gcdSteps.length - 1].result;
  const lcm = lcmSteps[lcmSteps.length - 1].result;

  const calculation: GcdLcmCalculation = {
    mode,
    values,
    absoluteValues,
    normalizedInput: absoluteValues.map(formatBigInt).join(", "),
    gcd,
    lcm,
    gcdSteps,
    lcmSteps,
    warnings: [],
    primeFactors: buildPrimeFactorDetails(absoluteValues, gcd, lcm),
  };

  calculation.warnings = buildWarnings(calculation, mode);

  return calculation;
}

export function gcdBigInt(left: bigint, right: bigint): bigint {
  let a = absBigInt(left);
  let b = absBigInt(right);

  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a;
}

export function lcmBigInt(left: bigint, right: bigint): bigint {
  const a = absBigInt(left);
  const b = absBigInt(right);

  if (a === 0n || b === 0n) {
    return 0n;
  }

  return absBigInt((a / gcdBigInt(a, b)) * b);
}

export function formatBigInt(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const digits = absBigInt(value).toString();

  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function includesGcd(mode: GcdLcmMode): boolean {
  return mode === "gcd" || mode === "both";
}

export function includesLcm(mode: GcdLcmMode): boolean {
  return mode === "lcm" || mode === "both";
}

export function buildVerificationLines(
  calculation: GcdLcmCalculation,
  mode: GcdLcmMode = calculation.mode,
): string[] {
  const lines: string[] = [];

  if (includesGcd(mode)) {
    if (calculation.absoluteValues.every((value) => value === 0n)) {
      lines.push(
        "El MCD de una lista formada solo por ceros no está definido de forma universal; esta calculadora muestra 0 por convención.",
      );
    } else if (calculation.gcd === 1n) {
      lines.push(
        "El MCD es 1; no hay un divisor común mayor que 1 para todos los números.",
      );
    } else {
      lines.push(
        `${formatBigInt(calculation.gcd)} divide exactamente a ${formatBigIntList(
          calculation.absoluteValues,
        )}.`,
      );
    }
  }

  if (includesLcm(mode)) {
    if (calculation.lcm === 0n) {
      lines.push(
        "El MCM es 0 porque la lista contiene al menos un 0.",
      );
    } else {
      lines.push(
        `${formatBigInt(calculation.lcm)} es divisible entre ${formatBigIntList(
          calculation.absoluteValues,
        )}.`,
      );
    }
  }

  return lines;
}

export function buildGcdProcedureLines(
  calculation: GcdLcmCalculation,
): string[] {
  return calculation.gcdSteps.map(
    (step) =>
      `MCD(${formatBigInt(step.left)}, ${formatBigInt(step.right)}) = ${formatBigInt(
        step.result,
      )}`,
  );
}

export function buildLcmProcedureLines(
  calculation: GcdLcmCalculation,
): string[] {
  return calculation.lcmSteps.map((step) => {
    if (step.left === 0n || step.right === 0n) {
      return `MCM(${formatBigInt(step.left)}, ${formatBigInt(
        step.right,
      )}) = 0 porque al menos uno de los valores es 0`;
    }

    return `MCM(${formatBigInt(step.left)}, ${formatBigInt(step.right)}) = |${formatBigInt(
        step.left,
      )} × ${formatBigInt(step.right)}| / ${formatBigInt(step.gcd)} = ${formatBigInt(
        step.result,
      )}`;
  });
}

export function buildGcdLcmSummary(
  calculation: GcdLcmCalculation,
  mode: GcdLcmMode = calculation.mode,
): string {
  const lines = [
    `Números: ${formatBigIntList(calculation.values)}`,
    `Valores usados: ${formatBigIntList(calculation.absoluteValues)}`,
  ];

  if (includesGcd(mode)) {
    lines.push(`MCD: ${formatBigInt(calculation.gcd)}`);
  }

  if (includesLcm(mode)) {
    lines.push(`MCM: ${formatBigInt(calculation.lcm)}`);
  }

  return lines.join("\n");
}

export function buildGcdLcmExplanation(
  calculation: GcdLcmCalculation,
  mode: GcdLcmMode = calculation.mode,
): string {
  const lines = [buildGcdLcmSummary(calculation, mode), "", "Procedimiento:"];

  if (includesGcd(mode)) {
    lines.push(...buildGcdProcedureLines(calculation));
  }

  if (includesLcm(mode)) {
    lines.push(...buildLcmProcedureLines(calculation));
  }

  lines.push("", "Comprobación:", ...buildVerificationLines(calculation, mode));

  if (calculation.primeFactors.available) {
    lines.push("", "Factorización:");
    lines.push(...calculation.primeFactors.rows.map((row) => row.text));

    if (includesGcd(mode)) {
      lines.push(`MCD por factores: ${calculation.primeFactors.gcdText}`);
    }

    if (includesLcm(mode)) {
      lines.push(`MCM por factores: ${calculation.primeFactors.lcmText}`);
    }
  }

  return lines.join("\n");
}

export function formatBigIntList(values: bigint[]): string {
  return values.map(formatBigInt).join(", ");
}

function parseIntegerToken(
  token: string,
):
  | { ok: true; value: bigint }
  | {
      ok: false;
      error: Exclude<
        IntegerListParseError,
        "too_many_characters" | "empty_separator" | "too_many_values"
      >;
      message: string;
      token: string;
    } {
  if (token.includes(".")) {
    return {
      ok: false,
      error: "decimal",
      message: "No se aceptan decimales. Usa solo enteros.",
      token,
    };
  }

  if (!/^[+-]?\d+$/.test(token)) {
    return {
      ok: false,
      error: "invalid_token",
      message: `Revisa este valor: "${token}". Solo se permiten enteros.`,
      token,
    };
  }

  const digits = token.replace(/^[+-]/, "").replace(/^0+(?=\d)/, "");

  if (digits.length > MAX_INTEGER_DIGITS) {
    return {
      ok: false,
      error: "too_many_digits",
      message: `El valor "${token}" es demasiado largo para esta calculadora.`,
      token,
    };
  }

  return {
    ok: true,
    value: BigInt(token.replace(/^\+/, "")),
  };
}

function buildGcdSteps(values: bigint[]): GcdPairStep[] {
  const steps: GcdPairStep[] = [];
  let current = values[0];

  for (const next of values.slice(1)) {
    const result = gcdBigInt(current, next);
    steps.push({
      left: current,
      right: next,
      result,
      ...buildEuclidDetails(current, next),
    });
    current = result;
  }

  return steps;
}

function buildLcmSteps(values: bigint[]): LcmPairStep[] {
  const steps: LcmPairStep[] = [];
  let current = values[0];

  for (const next of values.slice(1)) {
    const gcd = gcdBigInt(current, next);
    const result = lcmBigInt(current, next);

    steps.push({
      left: current,
      right: next,
      gcd,
      result,
      product: current * next,
    });
    current = result;
  }

  return steps;
}

function buildEuclidDetails(
  left: bigint,
  right: bigint,
): Pick<GcdPairStep, "euclidSteps" | "note"> {
  let a = absBigInt(left);
  let b = absBigInt(right);

  if (a === 0n && b === 0n) {
    return {
      euclidSteps: [],
      note: "Ambos valores son 0; se muestra 0 por convención.",
    };
  }

  if (a === 0n || b === 0n) {
    return {
      euclidSteps: [],
      note: `MCD(${formatBigInt(left)}, ${formatBigInt(right)}) = ${formatBigInt(
        a > b ? a : b,
      )} porque MCD(a, 0) = |a|.`,
    };
  }

  if (a < b) {
    [a, b] = [b, a];
  }

  const euclidSteps: EuclidStep[] = [];

  while (b !== 0n) {
    const quotient = a / b;
    const remainder = a % b;

    euclidSteps.push({
      dividend: a,
      divisor: b,
      quotient,
      remainder,
    });

    a = b;
    b = remainder;
  }

  return { euclidSteps };
}

function buildWarnings(
  calculation: GcdLcmCalculation,
  mode: GcdLcmMode,
): string[] {
  const warnings: string[] = [];
  const hasNegative = calculation.values.some((value) => value < 0n);
  const hasZero = calculation.absoluteValues.some((value) => value === 0n);
  const hasOnlyZeros = calculation.absoluteValues.every((value) => value === 0n);
  const hasDuplicates =
    new Set(calculation.absoluteValues.map((value) => value.toString())).size !==
    calculation.absoluteValues.length;

  if (hasNegative) {
    warnings.push(
      "Hay números negativos; se usaron sus valores absolutos para calcular.",
    );
  }

  if (hasOnlyZeros) {
    if (includesGcd(mode)) {
      warnings.push(
        "El MCD de una lista formada solo por ceros no está definido de forma universal; se muestra 0 por convención.",
      );
    }

    if (includesLcm(mode)) {
      warnings.push("El MCM es 0 porque la lista contiene al menos un 0.");
    }
  } else if (hasZero) {
    if (includesLcm(mode)) {
      warnings.push("La lista contiene 0; el MCM se muestra como 0.");
    }
  }

  if (hasDuplicates) {
    warnings.push(
      "Hay valores duplicados; no cambian el MCD ni el MCM, pero se conservaron en la lista.",
    );
  }

  if (includesLcm(mode) && calculation.lcm > MAX_SAFE_INTEGER_BIGINT) {
    warnings.push(
      "El MCM supera el rango seguro de Number; se calculó con BigInt para mantener precisión.",
    );
  }

  if (
    includesLcm(mode) &&
    calculation.lcm.toString().length > READABLE_RESULT_DIGITS
  ) {
    warnings.push(
      "El MCM tiene muchos dígitos; puede ser incómodo de leer en pantallas pequeñas.",
    );
  }

  return warnings;
}

function buildPrimeFactorDetails(
  values: bigint[],
  gcd: bigint,
  lcm: bigint,
): PrimeFactorDetails {
  if (values.some((value) => value > PRIME_FACTORIZATION_LIMIT)) {
    return {
      available: false,
      rows: [],
      gcdText: "",
      lcmText: "",
      note: `La factorización se omite si algún valor supera ${formatBigInt(
        PRIME_FACTORIZATION_LIMIT,
      )}.`,
    };
  }

  const rows = values.map((value) => ({
    value,
    text: `${formatBigInt(value)} = ${formatPrimeFactorization(value)}`,
  }));
  const hasZero = values.some((value) => value === 0n);
  const nonZeroValues = values.filter((value) => value > 0n);
  const factorMaps = nonZeroValues.map(factorizeSmallInteger);
  const note = hasZero
    ? "La factorización prima se aplica a enteros positivos; los ceros se explican con las reglas de MCD y MCM."
    : undefined;

  return {
    available: true,
    rows,
    gcdText:
      nonZeroValues.length === 0
        ? `0 (por convención) = ${formatBigInt(gcd)}`
        : `${formatFactorMap(intersectFactorMaps(factorMaps))} = ${formatBigInt(
            gcd,
          )}`,
    lcmText:
      lcm === 0n
        ? `0 (por regla con cero) = ${formatBigInt(lcm)}`
        : `${formatFactorMap(unionFactorMaps(factorMaps))} = ${formatBigInt(
            lcm,
          )}`,
    note,
  };
}

function formatPrimeFactorization(value: bigint): string {
  if (value === 0n) {
    return "0 (sin factorización prima)";
  }

  if (value === 1n) {
    return "1 (sin factores primos)";
  }

  const factors = factorizeSmallInteger(value);

  return [...factors.entries()]
    .map(([factor, exponent]) =>
      exponent === 1 ? String(factor) : `${factor}${toSuperscript(exponent)}`,
    )
    .join(" × ");
}

function factorizeSmallInteger(value: bigint): Map<number, number> {
  let remaining = Number(absBigInt(value));
  const factors = new Map<number, number>();
  let divisor = 2;

  while (divisor * divisor <= remaining) {
    while (remaining % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      remaining /= divisor;
    }

    divisor = divisor === 2 ? 3 : divisor + 2;
  }

  if (remaining > 1) {
    factors.set(remaining, (factors.get(remaining) ?? 0) + 1);
  }

  return factors;
}

function intersectFactorMaps(factorMaps: Map<number, number>[]) {
  if (factorMaps.length === 0) {
    return new Map<number, number>();
  }

  const [firstMap, ...otherMaps] = factorMaps;
  const result = new Map<number, number>();

  for (const [factor, exponent] of firstMap.entries()) {
    const minExponent = Math.min(
      exponent,
      ...otherMaps.map((map) => map.get(factor) ?? 0),
    );

    if (minExponent > 0) {
      result.set(factor, minExponent);
    }
  }

  return result;
}

function unionFactorMaps(factorMaps: Map<number, number>[]) {
  const result = new Map<number, number>();

  for (const map of factorMaps) {
    for (const [factor, exponent] of map.entries()) {
      result.set(factor, Math.max(result.get(factor) ?? 0, exponent));
    }
  }

  return new Map([...result.entries()].sort(([a], [b]) => a - b));
}

function formatFactorMap(factors: Map<number, number>): string {
  if (factors.size === 0) {
    return "1 (sin factores primos)";
  }

  return [...factors.entries()]
    .map(([factor, exponent]) =>
      exponent === 1 ? String(factor) : `${factor}${toSuperscript(exponent)}`,
    )
    .join(" × ");
}

function toSuperscript(value: number): string {
  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };

  return String(value)
    .split("")
    .map((digit) => superscripts[digit] ?? digit)
    .join("");
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function hasEmptyCommaSeparator(value: string): boolean {
  const compact = value.replace(/\s+/g, "");

  return compact.startsWith(",") || compact.endsWith(",") || compact.includes(",,");
}
