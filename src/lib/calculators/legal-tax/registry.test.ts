import { describe, expect, it } from "vitest";
import { canRestoreCalculation } from "./core/history";
import { resolveRuleSet } from "./core/ruleResolution";
import { LegalTaxRegistry } from "./registry";
import type { MarketContext, RuleSetEnvelope } from "./types";

const makeRuleSet = (overrides: Partial<RuleSetEnvelope> = {}): RuleSetEnvelope => ({
  id: "gb-income-tax-2026-27",
  familyId: "income-tax",
  marketId: "gb",
  countryCode: "GB",
  jurisdictionCode: "GB-RUK",
  regimeId: "employee",
  periodId: "2026-27",
  currency: "GBP",
  effectiveFrom: "2026-04-06",
  effectiveTo: "2027-04-05",
  publishedAt: "2026-04-06",
  reviewedAt: "2026-04-06",
  reviewDueAt: "2027-03-01",
  status: "current",
  coverage: "partial",
  missingConcepts: ["capital-gains"],
  assumptions: ["employment income only"],
  rounding: { mode: "half-up", precision: 2, stage: "total" },
  sources: [{ id: "gov-uk", authority: "HMRC", title: "Rates", url: "https://www.gov.uk/", accessedAt: "2026-04-06", appliesTo: ["brackets"], primary: true }],
  officialFixtures: [{ id: "gb-boundary", sourceId: "gov-uk", periodId: "2026-27", description: "Published bracket boundary" }],
  rules: { bands: [] },
  ...overrides,
});

describe("legal-tax registry and resolution", () => {
  it("keeps market separate from locale and resolves a complete context", () => {
    const gb = makeRuleSet();
    const mx = makeRuleSet({
      id: "mx-income-tax-2026",
      marketId: "mx-en",
      countryCode: "MX",
      jurisdictionCode: "MX",
      periodId: "2026",
      currency: "MXN",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-12-31",
      officialFixtures: [{ id: "mx-boundary", sourceId: "gov-uk", periodId: "2026", description: "Characterization boundary" }],
    });
    const registry = new LegalTaxRegistry([gb, mx]);
    expect(registry.getRuleSet(gb.id)?.id).not.toBe(registry.getRuleSet(mx.id)?.id);

    const context: MarketContext = { locale: "en-GB", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB-RUK", regimeId: "employee", periodId: "2026-27", currency: "GBP" };
    expect(resolveRuleSet(context, registry.getRuleSets(), "2026-08-15")).toMatchObject({ status: "partial", missing: ["capital-gains"] });
  });

  it("blocks an unsupported jurisdiction instead of falling back to Mexico", () => {
    const context: MarketContext = { locale: "en-US", marketId: "us", countryCode: "US", jurisdictionCode: "US-CA", regimeId: "employee", periodId: "2026", currency: "USD" };
    expect(resolveRuleSet(context, [makeRuleSet()], "2026-08-15")).toEqual({ status: "unsupported", reasonCode: "jurisdiction-or-regime-not-supported" });
  });

  it("rejects incomplete current data and stale saved calculations", () => {
    expect(() => new LegalTaxRegistry([makeRuleSet({ publishedAt: undefined })])).toThrow(/publishedAt/);
    const context: MarketContext = { locale: "en-GB", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB-RUK", regimeId: "employee", periodId: "2026-27", currency: "GBP" };
    const stored = { schemaVersion: 1 as const, variantId: "gb-income", ruleSetId: "old", marketId: "gb" as const, jurisdictionCode: "GB-RUK", periodId: "2025-26", savedAt: "2026-01-01", inputs: {} };
    expect(canRestoreCalculation(stored, context, "gb-income", "gb-income-tax-2026-27")).toBe(false);
  });
});
