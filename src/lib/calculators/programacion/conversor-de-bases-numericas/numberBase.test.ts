import { describe, expect, it } from "vitest";
import {
  MAX_NUMBER_BASE_INPUT_DIGITS,
  buildPositionalExplanation,
  convertNumberBase,
  convertToCommonNumberBases,
  formatBigIntInBase,
  getNumberBaseErrorMessage,
  groupNumberBaseDigits,
  parseNumberBaseInput,
} from "./numberBase";

describe("number base conversion", () => {
  it("converts common bases exactly", () => {
    expect(convertNumberBase("FF", 16, 10).result).toBe("255");
    expect(convertNumberBase("255", 10, 2).result).toBe("11111111");
    expect(convertNumberBase("1010", 2, 10).result).toBe("10");
    expect(convertNumberBase("Z", 36, 10).result).toBe("35");
  });

  it("keeps integers above Number.MAX_SAFE_INTEGER exact", () => {
    const value = "9007199254740993";
    const parsed = parseNumberBaseInput(value, 10);

    expect(parsed).toEqual(
      expect.objectContaining({
        ok: true,
        value: 9007199254740993n,
        normalized: value,
      }),
    );
    expect(convertNumberBase(value, 10, 16).result).toBe("20000000000001");
    expect(convertNumberBase(value, 10, 2).result).toBe(
      "100000000000000000000000000000000000000000000000000001",
    );
  });

  it("preserves negative signs and normalizes zero", () => {
    expect(convertNumberBase("-FF", 16, 10).result).toBe("-255");
    expect(convertNumberBase("-0", 10, 2).result).toBe("0");
    expect(convertNumberBase("+000", 10, 16).parsed.normalized).toBe("0");
  });

  it("returns a normalized value when both bases are equal", () => {
    expect(convertNumberBase("00ff", 16, 16).result).toBe("FF");
  });

  it("returns every common equivalence", () => {
    expect(convertToCommonNumberBases(255n)).toEqual({
      2: "11111111",
      8: "377",
      10: "255",
      16: "FF",
    });
  });
});

describe("number base normalization", () => {
  it("accepts lowercase letters, outer spaces, and compatible prefixes", () => {
    expect(parseNumberBaseInput("  ff  ", 16)).toEqual(
      expect.objectContaining({
        ok: true,
        normalized: "FF",
        value: 255n,
      }),
    );
    expect(parseNumberBaseInput("0xFF", 16)).toEqual(
      expect.objectContaining({
        ok: true,
        prefix: "0x",
        normalized: "FF",
      }),
    );
    expect(parseNumberBaseInput("-0B1010", 2)).toEqual(
      expect.objectContaining({
        ok: true,
        prefix: "0b",
        normalized: "-1010",
        value: -10n,
      }),
    );
  });

  it("accepts internal spaces and underscores between digits", () => {
    const spaced = parseNumberBaseInput("1010 1100", 2);
    const underscored = parseNumberBaseInput("1010_1100", 2);

    expect(spaced).toEqual(
      expect.objectContaining({
        ok: true,
        normalized: "10101100",
        value: 172n,
      }),
    );
    expect(underscored).toEqual(
      expect.objectContaining({
        ok: true,
        normalized: "10101100",
        value: 172n,
      }),
    );
  });

  it("rejects incompatible prefixes", () => {
    const result = parseNumberBaseInput("0xFF", 10);

    expect(result).toEqual({
      ok: false,
      error: "prefix_mismatch",
      base: 10,
      expectedBase: 16,
      position: 1,
    });
  });
});

describe("number base validation", () => {
  it("reports invalid digits with their input position", () => {
    const binary = parseNumberBaseInput("102", 2);
    const hexadecimal = parseNumberBaseInput("12G", 16);

    expect(binary).toEqual({
      ok: false,
      error: "invalid_digit",
      base: 2,
      character: "2",
      position: 3,
    });
    expect(hexadecimal).toEqual({
      ok: false,
      error: "invalid_digit",
      base: 16,
      character: "G",
      position: 3,
    });

    if (!hexadecimal.ok) {
      expect(getNumberBaseErrorMessage(hexadecimal)).toBe(
        'El carácter "G" no es válido en base 16 (posición 3).',
      );
    }
  });

  it("distinguishes empty inputs, signs, prefixes, and invalid characters", () => {
    expect(parseNumberBaseInput("", 10)).toEqual({
      ok: false,
      error: "empty",
      base: 10,
    });
    expect(parseNumberBaseInput("-", 10)).toEqual({
      ok: false,
      error: "sign_without_digits",
      base: 10,
    });
    expect(parseNumberBaseInput("0x", 16)).toEqual({
      ok: false,
      error: "prefix_without_digits",
      base: 16,
    });
    expect(parseNumberBaseInput("12.5", 10)).toEqual({
      ok: false,
      error: "invalid_character",
      base: 10,
      character: ".",
      position: 3,
    });
  });

  it("rejects misplaced or repeated separators", () => {
    expect(parseNumberBaseInput("_1010", 2)).toEqual(
      expect.objectContaining({
        ok: false,
        error: "invalid_separator",
        position: 1,
      }),
    );
    expect(parseNumberBaseInput("1010_", 2)).toEqual(
      expect.objectContaining({
        ok: false,
        error: "invalid_separator",
        position: 5,
      }),
    );
    expect(parseNumberBaseInput("10__10", 2)).toEqual(
      expect.objectContaining({
        ok: false,
        error: "invalid_separator",
        position: 3,
      }),
    );
  });

  it("rejects invalid bases and inputs above the operating limit", () => {
    expect(parseNumberBaseInput("10", 1)).toEqual({
      ok: false,
      error: "invalid_base",
      base: 1,
    });
    expect(parseNumberBaseInput("10", 37)).toEqual({
      ok: false,
      error: "invalid_base",
      base: 37,
    });

    const tooLong = parseNumberBaseInput(
      "1".repeat(MAX_NUMBER_BASE_INPUT_DIGITS + 1),
      2,
    );

    expect(tooLong).toEqual({
      ok: false,
      error: "too_long",
      base: 2,
      digitCount: MAX_NUMBER_BASE_INPUT_DIGITS + 1,
    });
  });
});

describe("number base presentation helpers", () => {
  it("groups digits from the right without changing the value", () => {
    expect(groupNumberBaseDigits("11111111")).toBe("1111 1111");
    expect(groupNumberBaseDigits("-10101100")).toBe("-1010 1100");
    expect(groupNumberBaseDigits("101")).toBe("101");
    expect(() => groupNumberBaseDigits("1010", 0)).toThrow(
      "entero positivo",
    );
  });

  it("builds a positional explanation for short inputs", () => {
    const parsed = parseNumberBaseInput("FF", 16);

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      expect(buildPositionalExplanation(parsed)).toEqual({
        available: true,
        formula: "FF₁₆ = 15 × 16¹ + 15 × 16⁰ = 255₁₀",
      });
    }
  });

  it("omits long positional explanations while preserving conversion", () => {
    const parsed = parseNumberBaseInput("1".repeat(17), 2);

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      expect(buildPositionalExplanation(parsed)).toEqual(
        expect.objectContaining({
          available: false,
        }),
      );
    }
  });

  it("validates output bases", () => {
    expect(formatBigIntInBase(35n, 36)).toBe("Z");
    expect(() => formatBigIntInBase(10n, 1)).toThrow("entre 2 y 36");
  });
});
