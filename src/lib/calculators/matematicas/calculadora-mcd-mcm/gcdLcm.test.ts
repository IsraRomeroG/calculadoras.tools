import { describe, expect, it } from "vitest";
import {
  buildGcdLcmExplanation,
  buildGcdLcmSummary,
  buildLcmProcedureLines,
  buildVerificationLines,
  calculateGcdLcm,
  calculateGcdLcmFromInput,
  gcdBigInt,
  lcmBigInt,
  parseIntegerList,
} from "./gcdLcm";

describe("gcd and lcm calculations", () => {
  it("calculates gcd and lcm for a common list", () => {
    const result = calculateGcdLcm([12n, 18n, 30n]);

    expect(result.gcd).toBe(6n);
    expect(result.lcm).toBe(180n);
    expect(result.gcdSteps).toHaveLength(2);
    expect(result.lcmSteps).toHaveLength(2);
  });

  it("calculates coprime numbers", () => {
    const result = calculateGcdLcm([7n, 13n]);

    expect(result.gcd).toBe(1n);
    expect(result.lcm).toBe(91n);
    expect(buildVerificationLines(result)).toContain(
      "El MCD es 1; no hay un divisor común mayor que 1 para todos los números.",
    );
  });

  it("handles zero with the documented rules", () => {
    const result = calculateGcdLcm([0n, 12n]);

    expect(result.gcd).toBe(12n);
    expect(result.lcm).toBe(0n);
    expect(result.warnings).toContain("La lista contiene 0; el MCM se muestra como 0.");
  });

  it("scopes warnings to the selected mode", () => {
    const result = calculateGcdLcm([0n, 12n], "gcd");

    expect(result.gcd).toBe(12n);
    expect(result.warnings.some((warning) => warning.includes("MCM"))).toBe(false);
  });

  it("handles all zeros with a convention note", () => {
    const result = calculateGcdLcm([0n, 0n]);

    expect(result.gcd).toBe(0n);
    expect(result.lcm).toBe(0n);
    expect(result.warnings[0]).toContain("por convención");
    expect(buildLcmProcedureLines(result)[0]).toBe(
      "MCM(0, 0) = 0 porque al menos uno de los valores es 0",
    );
  });

  it("uses absolute values for negatives", () => {
    const result = calculateGcdLcm([-24n, 36n]);

    expect(result.gcd).toBe(12n);
    expect(result.lcm).toBe(72n);
    expect(result.normalizedInput).toBe("24, 36");
    expect(result.warnings).toContain(
      "Hay números negativos; se usaron sus valores absolutos para calcular.",
    );
  });

  it("keeps duplicates and warns about them", () => {
    const result = calculateGcdLcm([12n, 12n, 18n]);

    expect(result.gcd).toBe(6n);
    expect(result.lcm).toBe(36n);
    expect(result.warnings.some((warning) => warning.includes("duplicados"))).toBe(true);
  });

  it("calculates values above Number.MAX_SAFE_INTEGER with BigInt", () => {
    const result = calculateGcdLcm([9007199254740993n, 3n]);

    expect(result.gcd).toBe(3n);
    expect(result.lcm).toBe(9007199254740993n);
    expect(result.warnings.some((warning) => warning.includes("BigInt"))).toBe(true);
  });

  it("exposes direct gcd and lcm helpers", () => {
    expect(gcdBigInt(54n, 24n)).toBe(6n);
    expect(lcmBigInt(21n, 6n)).toBe(42n);
    expect(lcmBigInt(21n, 0n)).toBe(0n);
  });
});

describe("integer list parsing", () => {
  it("accepts commas, spaces and line breaks", () => {
    expect(parseIntegerList("12, 18\n30 42")).toMatchObject({
      ok: true,
      values: [12n, 18n, 30n, 42n],
    });
  });

  it("interprets 1,5 as two integers because comma is a separator", () => {
    expect(parseIntegerList("1,5")).toMatchObject({
      ok: true,
      values: [1n, 5n],
    });
  });

  it("accepts plus signs and normalizes unicode minus", () => {
    expect(parseIntegerList("+12, −18")).toMatchObject({
      ok: true,
      values: [12n, -18n],
    });
  });

  it("rejects decimals with point", () => {
    expect(parseIntegerList("1.5, 3")).toMatchObject({
      ok: false,
      error: "decimal",
    });
  });

  it("rejects empty comma separators", () => {
    expect(parseIntegerList("12,,18")).toMatchObject({
      ok: false,
      error: "empty_separator",
    });
  });

  it("rejects text mixed into the list", () => {
    expect(parseIntegerList("12 a 18")).toMatchObject({
      ok: false,
      error: "invalid_token",
      token: "a",
    });
  });

  it("rejects lists above the value limit", () => {
    const value = Array.from({ length: 51 }, (_, index) => index + 1).join(",");

    expect(parseIntegerList(value)).toMatchObject({
      ok: false,
      error: "too_many_values",
    });
  });

  it("requires at least two numbers for a calculation", () => {
    expect(calculateGcdLcmFromInput("12")).toMatchObject({
      ok: false,
      error: "not_enough_values",
    });
  });
});

describe("educational outputs", () => {
  it("builds prime factor details for small values", () => {
    const result = calculateGcdLcm([12n, 18n, 30n]);

    expect(result.primeFactors.available).toBe(true);
    expect(result.primeFactors.rows.map((row) => row.text)).toContain(
      "12 = 2² × 3",
    );
    expect(result.primeFactors.gcdText).toBe("2 × 3 = 6");
    expect(result.primeFactors.lcmText).toBe("2² × 3² × 5 = 180");
  });

  it("omits prime factors when an input is too large", () => {
    const result = calculateGcdLcm([1_000_001n, 2n]);

    expect(result.primeFactors.available).toBe(false);
    expect(result.primeFactors.note).toContain("se omite");
  });

  it("builds copy text for selected outputs", () => {
    const result = calculateGcdLcm([12n, 18n, 30n]);

    expect(buildGcdLcmSummary(result, "gcd")).toContain("MCD: 6");
    expect(buildGcdLcmSummary(result, "gcd")).not.toContain("MCM:");
    expect(buildGcdLcmExplanation(result, "both")).toContain("Comprobación:");
    expect(buildGcdLcmExplanation(result, "both")).toContain(
      "180 es divisible entre 12, 18, 30.",
    );
  });
});
