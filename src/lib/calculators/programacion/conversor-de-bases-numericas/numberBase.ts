export const NUMBER_BASE_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const MIN_NUMBER_BASE = 2;
export const MAX_NUMBER_BASE = 36;
export const MAX_NUMBER_BASE_INPUT_DIGITS = 10_000;
export const MAX_POSITIONAL_EXPLANATION_DIGITS = 16;
export const COMMON_NUMBER_BASES = [2, 8, 10, 16] as const;

export type CommonNumberBase = (typeof COMMON_NUMBER_BASES)[number];

export interface NumberBaseMetadata {
  label: string;
  shortLabel: string;
}

export const COMMON_NUMBER_BASE_METADATA = {
  2: { label: "Binario", shortLabel: "BIN" },
  8: { label: "Octal", shortLabel: "OCT" },
  10: { label: "Decimal", shortLabel: "DEC" },
  16: { label: "Hexadecimal", shortLabel: "HEX" },
} as const satisfies Record<CommonNumberBase, NumberBaseMetadata>;

export type NumberBaseParseErrorCode =
  | "empty"
  | "invalid_base"
  | "sign_without_digits"
  | "prefix_without_digits"
  | "prefix_mismatch"
  | "invalid_separator"
  | "invalid_character"
  | "invalid_digit"
  | "too_long";

export interface NumberBaseParseSuccess {
  ok: true;
  value: bigint;
  normalized: string;
  digits: string;
  base: number;
  sign: 1 | -1;
  prefix?: "0b" | "0o" | "0x";
}

export interface NumberBaseParseFailure {
  ok: false;
  error: NumberBaseParseErrorCode;
  base: number;
  character?: string;
  position?: number;
  expectedBase?: number;
  digitCount?: number;
}

export type NumberBaseParseResult =
  | NumberBaseParseSuccess
  | NumberBaseParseFailure;

export interface NumberBaseConversion {
  parsed: NumberBaseParseSuccess;
  destinationBase: number;
  result: string;
}

export interface PositionalExplanation {
  available: boolean;
  formula?: string;
  reason?: string;
}

const PREFIX_BASES = {
  "0b": 2,
  "0o": 8,
  "0x": 16,
} as const;

const SUPERSCRIPT_DIGITS: Record<string, string> = {
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

const SUBSCRIPT_DIGITS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

export function isValidNumberBase(base: number): boolean {
  return (
    Number.isInteger(base) &&
    base >= MIN_NUMBER_BASE &&
    base <= MAX_NUMBER_BASE
  );
}

export function isCommonNumberBase(base: number): base is CommonNumberBase {
  return COMMON_NUMBER_BASES.includes(base as CommonNumberBase);
}

export function getNumberBaseLabel(base: number): string {
  if (isCommonNumberBase(base)) {
    return COMMON_NUMBER_BASE_METADATA[base].label;
  }

  return `Base ${base}`;
}

export function getValidDigitsForBase(base: number): string {
  if (!isValidNumberBase(base)) {
    return "";
  }

  return NUMBER_BASE_DIGITS.slice(0, base);
}

export function parseNumberBaseInput(
  rawValue: string,
  base: number,
): NumberBaseParseResult {
  if (!isValidNumberBase(base)) {
    return { ok: false, error: "invalid_base", base };
  }

  const source = rawValue.replaceAll("−", "-");
  const leadingWhitespace = source.match(/^\s*/)?.[0].length ?? 0;
  let value = source.trim();
  let sourceOffset = leadingWhitespace;

  if (!value) {
    return { ok: false, error: "empty", base };
  }

  let sign: 1 | -1 = 1;

  if (value[0] === "+" || value[0] === "-") {
    sign = value[0] === "-" ? -1 : 1;
    value = value.slice(1);
    sourceOffset += 1;

    if (!value) {
      return { ok: false, error: "sign_without_digits", base };
    }
  }

  let prefix: NumberBaseParseSuccess["prefix"];
  const prefixCandidate = value.slice(0, 2).toLowerCase();

  if (prefixCandidate in PREFIX_BASES) {
    prefix = prefixCandidate as keyof typeof PREFIX_BASES;
    const expectedBase = PREFIX_BASES[prefix];

    if (base !== expectedBase) {
      return {
        ok: false,
        error: "prefix_mismatch",
        base,
        expectedBase,
        position: sourceOffset + 1,
      };
    }

    value = value.slice(2);
    sourceOffset += 2;

    if (!value) {
      return { ok: false, error: "prefix_without_digits", base };
    }
  }

  const normalizedDigits: string[] = [];
  const digitPositions: number[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const position = sourceOffset + index + 1;

    if (isSeparator(character)) {
      const previous = value[index - 1];
      const next = value[index + 1];

      if (!isAsciiDigit(previous) || !isAsciiDigit(next)) {
        return {
          ok: false,
          error: "invalid_separator",
          base,
          character,
          position,
        };
      }

      continue;
    }

    if (!isAsciiDigit(character)) {
      return {
        ok: false,
        error: "invalid_character",
        base,
        character,
        position,
      };
    }

    normalizedDigits.push(character.toUpperCase());
    digitPositions.push(position);
  }

  if (normalizedDigits.length === 0) {
    return {
      ok: false,
      error: prefix ? "prefix_without_digits" : "sign_without_digits",
      base,
    };
  }

  if (normalizedDigits.length > MAX_NUMBER_BASE_INPUT_DIGITS) {
    return {
      ok: false,
      error: "too_long",
      base,
      digitCount: normalizedDigits.length,
    };
  }

  let parsedValue = 0n;

  for (let index = 0; index < normalizedDigits.length; index += 1) {
    const character = normalizedDigits[index];
    const digitValue = getDigitValue(character);

    if (digitValue < 0 || digitValue >= base) {
      return {
        ok: false,
        error: "invalid_digit",
        base,
        character,
        position: digitPositions[index],
      };
    }

    parsedValue =
      parsedValue * BigInt(base) +
      BigInt(digitValue);
  }

  if (parsedValue === 0n) {
    sign = 1;
  } else if (sign === -1) {
    parsedValue = -parsedValue;
  }

  const digits = normalizedDigits.join("").replace(/^0+(?=.)/, "");
  const normalized = `${sign === -1 ? "-" : ""}${digits}`;

  return {
    ok: true,
    value: parsedValue,
    normalized,
    digits,
    base,
    sign,
    ...(prefix ? { prefix } : {}),
  };
}

export function convertNumberBase(
  rawValue: string,
  originBase: number,
  destinationBase: number,
): NumberBaseConversion {
  if (!isValidNumberBase(destinationBase)) {
    throw new RangeError("La base destino debe ser un entero entre 2 y 36.");
  }

  const parsed = parseNumberBaseInput(rawValue, originBase);

  if (!parsed.ok) {
    throw new Error(getNumberBaseErrorMessage(parsed));
  }

  return {
    parsed,
    destinationBase,
    result: formatBigIntInBase(parsed.value, destinationBase),
  };
}

export function formatBigIntInBase(value: bigint, base: number): string {
  if (!isValidNumberBase(base)) {
    throw new RangeError("La base debe ser un entero entre 2 y 36.");
  }

  return value.toString(base).toUpperCase();
}

export function convertToCommonNumberBases(
  value: bigint,
): Record<CommonNumberBase, string> {
  return Object.fromEntries(
    COMMON_NUMBER_BASES.map((base) => [
      base,
      formatBigIntInBase(value, base),
    ]),
  ) as Record<CommonNumberBase, string>;
}

export function groupNumberBaseDigits(
  value: string,
  groupSize = 4,
): string {
  if (!Number.isInteger(groupSize) || groupSize < 1) {
    throw new RangeError("El tamaño de grupo debe ser un entero positivo.");
  }

  const sign = value.startsWith("-") ? "-" : "";
  const digits = sign ? value.slice(1) : value;
  const firstGroupLength = digits.length % groupSize || groupSize;
  const groups = [digits.slice(0, firstGroupLength)];

  for (
    let index = firstGroupLength;
    index < digits.length;
    index += groupSize
  ) {
    groups.push(digits.slice(index, index + groupSize));
  }

  return `${sign}${groups.join(" ")}`;
}

export function buildPositionalExplanation(
  parsed: NumberBaseParseSuccess,
): PositionalExplanation {
  if (parsed.digits.length > MAX_POSITIONAL_EXPLANATION_DIGITS) {
    return {
      available: false,
      reason: `El desglose se muestra para entradas de hasta ${MAX_POSITIONAL_EXPLANATION_DIGITS} dígitos.`,
    };
  }

  const terms = [...parsed.digits].map((character, index) => {
    const exponent = parsed.digits.length - index - 1;

    return `${getDigitValue(character)} × ${parsed.base}${toSuperscript(exponent)}`;
  });
  const unsignedExpression = terms.join(" + ");
  const expression =
    parsed.sign === -1 ? `−(${unsignedExpression})` : unsignedExpression;
  const source = `${parsed.normalized}${toSubscript(parsed.base)}`;
  const result = `${parsed.value.toString()}${toSubscript(10)}`;

  return {
    available: true,
    formula: `${source} = ${expression} = ${result}`,
  };
}

export function getNumberBaseErrorMessage(
  failure: NumberBaseParseFailure,
): string {
  switch (failure.error) {
    case "empty":
      return "";
    case "invalid_base":
      return "La base debe ser un entero entre 2 y 36.";
    case "sign_without_digits":
      return "Escribe al menos un dígito después del signo.";
    case "prefix_without_digits":
      return "Escribe al menos un dígito después del prefijo.";
    case "prefix_mismatch":
      return `El prefijo corresponde a base ${failure.expectedBase}, no a base ${failure.base}.`;
    case "invalid_separator":
      return `El separador en la posición ${failure.position} debe estar entre dos dígitos.`;
    case "invalid_character":
      return `El carácter "${failure.character}" no es válido (posición ${failure.position}).`;
    case "invalid_digit":
      return `El carácter "${failure.character}" no es válido en base ${failure.base} (posición ${failure.position}).`;
    case "too_long":
      return `La entrada tiene ${failure.digitCount} dígitos; el máximo es ${MAX_NUMBER_BASE_INPUT_DIGITS}.`;
  }
}

export function toSubscript(value: number): string {
  return String(value)
    .split("")
    .map((digit) => SUBSCRIPT_DIGITS[digit] ?? digit)
    .join("");
}

function toSuperscript(value: number): string {
  return String(value)
    .split("")
    .map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit)
    .join("");
}

function getDigitValue(character: string): number {
  return NUMBER_BASE_DIGITS.indexOf(character.toUpperCase());
}

function isSeparator(character?: string): boolean {
  return character === "_" || Boolean(character && /\s/.test(character));
}

function isAsciiDigit(character?: string): boolean {
  return Boolean(character && /^[0-9A-Za-z]$/.test(character));
}
