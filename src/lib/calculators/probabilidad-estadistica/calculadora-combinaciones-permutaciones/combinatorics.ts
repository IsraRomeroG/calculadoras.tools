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
  "/probabilidad-estadistica/calculadora-combinaciones-permutaciones";
export const MAX_COMBINATORICS_INPUT = 10_000;
export const READABLE_RESULT_DIGITS = 24;
export const MAX_VISIBLE_FACTORS = 12;

export const COMBINATORICS_EXAMPLES: CombinatoricsExample[] = [
  {
    id: "committee",
    label: "Comité",
    description:
      "Elegir 3 personas entre 10 cuando el orden no cambia el grupo.",
    orderMatters: false,
    repetitionAllowed: false,
    n: 10,
    k: 3,
  },
  {
    id: "podium",
    label: "Podio",
    description:
      "Asignar oro, plata y bronce entre 10 participantes sin repetir.",
    orderMatters: true,
    repetitionAllowed: false,
    n: 10,
    k: 3,
  },
  {
    id: "flavors",
    label: "Sabores",
    description:
      "Elegir 3 bolas entre 5 sabores, permitiendo repetir sabores.",
    orderMatters: false,
    repetitionAllowed: true,
    n: 5,
    k: 3,
  },
  {
    id: "pin",
    label: "PIN",
    description:
      "Crear un PIN de 4 posiciones usando 10 dígitos que pueden repetirse.",
    orderMatters: true,
    repetitionAllowed: true,
    n: 10,
    k: 4,
  },
];

const MODE_METADATA: Record<CombinatoricsMode, ModeMetadata> = {
  combination: {
    label: "Combinación sin repetición",
    notation: "C(n, k)",
    formula: "C(n, k) = n! / (k! × (n − k)!)",
  },
  arrangement: {
    label: "Arreglo sin repetición",
    notation: "P(n, k)",
    formula: "P(n, k) = n! / (n − k)!",
  },
  "combination-repetition": {
    label: "Combinación con repetición",
    notation: "CR(n, k)",
    formula: "CR(n, k) = C(n + k − 1, k)",
  },
  "arrangement-repetition": {
    label: "Arreglo con repetición",
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
    field === "n" ? "Elementos disponibles (n)" : "Elementos elegidos (k)";

  if (!value) {
    return {
      ok: false,
      error: "required",
      message: `Completa ${label.toLowerCase()}.`,
    };
  }

  if (!/^\d+$/.test(value)) {
    return {
      ok: false,
      error: "invalid",
      message: `${label} debe ser un entero no negativo, sin decimales ni exponentes.`,
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
      message: `${label} no puede superar ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
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
      message: `Elementos disponibles (n) debe ser un entero entre 0 y ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
    });
  }

  if (
    !Number.isInteger(input.k) ||
    input.k < 0 ||
    input.k > MAX_COMBINATORICS_INPUT
  ) {
    errors.push({
      field: "k",
      message: `Elementos elegidos (k) debe ser un entero entre 0 y ${formatInteger(MAX_COMBINATORICS_INPUT)}.`,
    });
  }

  if (errors.length > 0) {
    return errors;
  }

  if (!input.repetitionAllowed && input.k > input.n) {
    errors.push({
      field: "k",
      message:
        "Para elegir sin repetición, k no puede ser mayor que n.",
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
        "Para combinar con repetición debe existir al menos un elemento disponible cuando k es mayor que 0.",
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
    isLongResult ? `un entero de ${digitCount} dígitos` : exact,
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
      "Debe existir al menos un elemento disponible cuando k es mayor que 0.",
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
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatScientificFromExact(exact: string): string {
  if (!/^\d+$/.test(exact)) {
    throw new TypeError("El valor exacto debe contener únicamente dígitos.");
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
      return "El orden no importa y cada elemento puede usarse una sola vez.";
    case "arrangement":
      return "El orden sí importa y cada elemento puede usarse una sola vez.";
    case "combination-repetition":
      return "El orden no importa y los elementos pueden repetirse.";
    case "arrangement-repetition":
      return "El orden sí importa y cada posición puede repetir elementos.";
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
      return `Hay ${resultText} ${forms} de elegir ${k} elementos entre ${n} cuando el orden no importa y no se permiten repeticiones.`;
    case "arrangement":
      return `Hay ${resultText} ${forms} de ordenar ${k} posiciones usando ${n} elementos sin repetirlos.`;
    case "combination-repetition":
      return `Hay ${resultText} ${forms} de elegir ${k} elementos entre ${n} cuando el orden no importa y se permiten repeticiones.`;
    case "arrangement-repetition":
      return `Hay ${resultText} ${forms} de llenar ${k} posiciones con ${n} opciones por posición, permitiendo repeticiones.`;
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
      "Elegir o llenar cero posiciones produce una única posibilidad: no elegir ningún elemento.",
      `El resultado es ${exact}.`,
    ];
  }

  switch (mode) {
    case "combination": {
      const r = Math.min(k, n - k);

      return [
        `Usamos la simetría C(${n}, ${k}) = C(${n}, ${r}) para reducir operaciones.`,
        buildCombinationProductLine(n, r),
        `El resultado exacto es ${exact}.`,
      ];
    }
    case "arrangement":
      return [
        "Multiplicamos una opción menos en cada posición porque no se permiten repeticiones.",
        buildArrangementProductLine(n, k),
        `El resultado exacto es ${exact}.`,
      ];
    case "combination-repetition": {
      const transformedN = n + k - 1;
      const r = Math.min(k, transformedN - k);

      return [
        `Transformamos el problema en C(${transformedN}, ${k}).`,
        buildCombinationProductLine(transformedN, r),
        `El resultado exacto es ${exact}.`,
      ];
    }
    case "arrangement-repetition":
      return [
        `Cada una de las ${k} posiciones tiene ${n} opciones.`,
        k === 1
          ? `${n} (1 factor) = ${exact}.`
          : `${n} × ${n}${k > 2 ? ` × … × ${n}` : ""} (${k} factores) = ${exact}.`,
      ];
  }
}

function buildCombinationProductLine(n: number, r: number): string {
  if (r === 0) {
    return "El producto multiplicativo está vacío, por lo que vale 1.";
  }

  if (r > MAX_VISIBLE_FACTORS) {
    return `Se aplica el producto multiplicativo con r = ${r}, dividiendo exactamente en cada paso para conservar precisión.`;
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
    return `Se multiplican ${k} factores consecutivos, desde ${n} hasta ${n - k + 1}.`;
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
    throw new RangeError("n y k deben ser enteros no negativos.");
  }

  if (
    n > MAX_COMBINATORICS_INPUT ||
    k > MAX_COMBINATORICS_INPUT
  ) {
    throw new RangeError(
      `n y k no pueden superar ${MAX_COMBINATORICS_INPUT}.`,
    );
  }

  if (!repetitionAllowed && k > n) {
    throw new RangeError("k no puede ser mayor que n sin repetición.");
  }
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("es-MX").format(value);
}
