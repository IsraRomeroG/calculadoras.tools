import { describe, expect, it } from "vitest";
import {
  COMBINATORICS_CANONICAL_PATH,
  calculateArrangement,
  calculateArrangementWithRepetition,
  calculateCombination,
  calculateCombinationWithRepetition,
  calculateCombinatorics,
  calculateCombinatoricsFromInput,
  formatScientificFromExact,
  getCombinatoricsMode,
  parseCombinatoricsInteger,
} from "./combinatorics";

describe("combinatorics calculations", () => {
  it("calculates the four MVP modes", () => {
    expect(calculateCombination(10, 3)).toBe(120n);
    expect(calculateArrangement(10, 3)).toBe(720n);
    expect(calculateCombinationWithRepetition(5, 3)).toBe(35n);
    expect(calculateArrangementWithRepetition(5, 3)).toBe(125n);
  });

  it("keeps large combinations exact with BigInt", () => {
    expect(calculateCombination(100, 50)).toBe(
      100891344545564193334812497256n,
    );
  });

  it("supports documented zero identities", () => {
    expect(calculateCombination(0, 0)).toBe(1n);
    expect(calculateCombination(12, 0)).toBe(1n);
    expect(calculateCombination(12, 12)).toBe(1n);
    expect(calculateArrangement(0, 0)).toBe(1n);
    expect(calculateArrangement(12, 0)).toBe(1n);
    expect(calculateCombinationWithRepetition(1, 8)).toBe(1n);
    expect(calculateArrangementWithRepetition(12, 0)).toBe(1n);
    expect(calculateArrangementWithRepetition(0, 0)).toBe(1n);
    expect(calculateArrangementWithRepetition(0, 8)).toBe(0n);
  });

  it("rejects impossible calculations without repetition", () => {
    expect(() => calculateCombination(3, 4)).toThrow(
      "k no puede ser mayor que n",
    );
    expect(() => calculateArrangement(3, 4)).toThrow(
      "k no puede ser mayor que n",
    );
  });

  it("rejects combination with repetition when there are no options", () => {
    expect(() => calculateCombinationWithRepetition(0, 2)).toThrow(
      "Debe existir al menos un elemento",
    );
  });

  it("supports the transformed range for combinations with repetition", () => {
    expect(calculateCombinationWithRepetition(10000, 2)).toBe(50005000n);
  });
});

describe("mode selection and presentation", () => {
  it("maps order and repetition decisions to the correct modes", () => {
    expect(getCombinatoricsMode(false, false)).toBe("combination");
    expect(getCombinatoricsMode(true, false)).toBe("arrangement");
    expect(getCombinatoricsMode(false, true)).toBe(
      "combination-repetition",
    );
    expect(getCombinatoricsMode(true, true)).toBe(
      "arrangement-repetition",
    );
  });

  it("builds an educational result and copy text", () => {
    const result = calculateCombinatorics({
      orderMatters: false,
      repetitionAllowed: false,
      n: 10,
      k: 3,
    });

    expect(result.modeLabel).toBe("Combinación sin repetición");
    expect(result.substitution).toBe(
      "C(10, 3) = 10! / (3! × 7!) = 120",
    );
    expect(result.interpretation).toContain(
      "el orden no importa",
    );
    expect(result.copyText).toContain("C(10, 3) = 120");
  });

  it("marks long results and derives scientific notation from exact digits", () => {
    const result = calculateCombinatorics({
      orderMatters: false,
      repetitionAllowed: false,
      n: 100,
      k: 50,
    });

    expect(result.isLongResult).toBe(true);
    expect(result.digitCount).toBe(30);
    expect(result.compact).toBe("1.0089 × 10^29");
    expect(result.exact).toBe("100891344545564193334812497256");
    expect(result.substitution).toContain("≈ 1.0089 × 10^29");
    expect(result.substitution).not.toContain(result.exact);
    expect(result.interpretation).toContain("aproximadamente");
  });

  it("formats exact digit strings without converting to Number", () => {
    expect(
      formatScientificFromExact("100891344545564193334812497256"),
    ).toBe("1.0089 × 10^29");
    expect(formatScientificFromExact("1000000000000000000000000")).toBe(
      "1 × 10^24",
    );
    expect(formatScientificFromExact("0")).toBe("0");
  });

  it("uses the probability and statistics canonical route", () => {
    expect(COMBINATORICS_CANONICAL_PATH).toBe(
      "/probabilidad-estadistica/calculadora-combinaciones-permutaciones",
    );
  });
});

describe("input parsing and validation", () => {
  it("parses decimal integers and normalizes leading zeros", () => {
    expect(parseCombinatoricsInteger("00010", "n")).toEqual({
      ok: true,
      value: 10,
      normalized: "10",
    });
  });

  it.each(["-1", "1.5", "1e3", "+4", "1,000", "abc"])(
    "rejects invalid integer input %s",
    (value) => {
      expect(parseCombinatoricsInteger(value, "n")).toMatchObject({
        ok: false,
        error: "invalid",
      });
    },
  );

  it("rejects empty and above-limit values", () => {
    expect(parseCombinatoricsInteger("", "k")).toMatchObject({
      ok: false,
      error: "required",
    });
    expect(parseCombinatoricsInteger("10001", "n")).toMatchObject({
      ok: false,
      error: "above-limit",
    });
  });

  it("returns field-specific errors from raw input", () => {
    expect(
      calculateCombinatoricsFromInput({
        orderMatters: false,
        repetitionAllowed: false,
        n: "3",
        k: "4",
      }),
    ).toEqual({
      ok: false,
      errors: [
        {
          field: "k",
          message:
            "Para elegir sin repetición, k no puede ser mayor que n.",
        },
      ],
    });
  });

  it("calculates directly from valid raw input", () => {
    const result = calculateCombinatoricsFromInput({
      orderMatters: true,
      repetitionAllowed: true,
      n: "10",
      k: "4",
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.calculation.result).toBe(10000n);
    }
  });
});
