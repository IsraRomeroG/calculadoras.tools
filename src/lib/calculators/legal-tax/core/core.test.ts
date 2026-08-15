import { describe, expect, it } from "vitest";
import { calculateMarginalTax, validateMarginalBrackets } from "./brackets";
import { completedYears, inclusiveCivilDays } from "./civilDates";
import { addIndirectTax, extractAdditiveIndirectTax } from "./indirectTax";

const rounding = { mode: "half-up", precision: 2, stage: "component" } as const;

describe("legal-tax shared primitives", () => {
  it("calculates contiguous marginal brackets without taxing lower bands twice", () => {
    const brackets = [
      { lower: 0, upper: 10_000, rate: 0 },
      { lower: 10_000, upper: 20_000, rate: 0.1 },
      { lower: 20_000, rate: 0.2 },
    ];
    expect(calculateMarginalTax(25_000, brackets)).toMatchObject({ tax: 2_000, marginalRate: 0.2, bracketIndex: 2 });
    expect(() => validateMarginalBrackets([{ lower: 0, upper: 10, rate: 0 }, { lower: 9, rate: 0.1 }])).toThrow(/gap or overlap/);
  });

  it("adds and extracts additive indirect tax as inverse operations", () => {
    const components = [{ id: "vat", rate: 0.2, calculation: "additive" as const }];
    const added = addIndirectTax(100, components, rounding);
    expect(added).toEqual({ base: 100, taxes: [{ id: "vat", rate: 0.2, amount: 20 }], tax: 20, total: 120 });
    expect(extractAdditiveIndirectTax(added.total, components, rounding).base).toBeCloseTo(100);
  });

  it("uses civil dates and handles leap-day anniversaries deterministically", () => {
    expect(inclusiveCivilDays("2024-02-28", "2024-03-01")).toBe(3);
    expect(completedYears("2020-02-29", "2024-02-28")).toBe(3);
    expect(completedYears("2020-02-29", "2024-02-29")).toBe(4);
  });
});
