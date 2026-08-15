import { describe, expect, it } from "vitest";
import { LegalTaxRegistry } from "../registry";
import { calculateIndirectTax } from "./calculator";
import { INDIRECT_TAX_RULE_SETS } from "./rules";
import { INDIRECT_TAX_VARIANTS } from "./variants";

describe("market-specific indirect tax", () => {
  it.each([
    ["gb-vat-2026", "vat-standard", 20],
    ["au-gst-2026", "gst-standard", 10],
    ["nz-gst-2026-27", "gst-standard", 15],
    ["ie-vat-2026", "vat-standard", 23],
    ["ca-on-hst-2026", "hst-standard", 13],
    ["ca-ns-hst-2026", "hst-standard", 14],
    ["ca-nb-hst-2026", "hst-standard", 15],
  ])("adds and extracts the published rate for %s", (ruleSetId, rateId, percent) => {
    const added = calculateIndirectTax({ ruleSetId, rateId, mode: "add", amount: 100 });
    expect(added.tax).toBe(percent);
    expect(added.total).toBe(100 + percent);
    expect(calculateIndirectTax({ ruleSetId, rateId, mode: "extract", amount: added.total }).base).toBeCloseTo(100);
  });

  it("keeps GST separate from excluded PST and QST", () => {
    const bc = calculateIndirectTax({ ruleSetId: "ca-bc-gst-2026", rateId: "gst-standard", mode: "add", amount: 100 });
    expect(bc.tax).toBe(5);
    expect(bc.coverage).toBe("partial");
    expect(bc.missingConcepts).toContain("British Columbia PST");
  });

  it("does not invent a US national rate and marks a manual district component", () => {
    const result = calculateIndirectTax({ ruleSetId: "us-ca-sales-tax-2026-h2", rateId: "ca-statewide-standard", mode: "add", amount: 100, manualAdditionalRatePercent: 1.5 });
    expect(result.tax).toBe(8.75);
    expect(result.components[1]).toMatchObject({ status: "manual", rate: 0.015 });
    expect(result.missingConcepts).toContain("Other US states and localities");
  });

  it("rejects unsupported rule sets and manual additions where not allowed", () => {
    expect(() => calculateIndirectTax({ ruleSetId: "missing", rateId: "standard", mode: "add", amount: 100 })).toThrow(/not available/);
    expect(() => calculateIndirectTax({ ruleSetId: "gb-vat-2026", rateId: "vat-standard", mode: "add", amount: 100, manualAdditionalRatePercent: 1 })).toThrow(/does not accept/);
  });

  it("registers every published market variant against current isolated data", () => {
    const registry = new LegalTaxRegistry(INDIRECT_TAX_RULE_SETS, INDIRECT_TAX_VARIANTS);
    expect(registry.getPublishedVariants()).toHaveLength(6);
    expect(new Set(registry.getPublishedVariants().map((variant) => variant.marketId))).toEqual(new Set(["us", "gb", "ca", "au", "nz", "ie"]));
    expect(INDIRECT_TAX_RULE_SETS.some((ruleSet) => ruleSet.marketId === "mx-en")).toBe(true);
  });
});
