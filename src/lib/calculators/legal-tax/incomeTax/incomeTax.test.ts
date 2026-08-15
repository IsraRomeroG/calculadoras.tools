import { describe, expect, it } from "vitest";
import { calculateAnnualIncomeTax, calculateTakeHomePay } from "./calculator";
import { LegalTaxRegistry } from "../registry";
import { INCOME_TAX_RULE_SETS, PAYROLL_RULE_SETS } from "./rules";
import { INCOME_TAX_VARIANTS, PAYROLL_VARIANTS } from "./variants";

describe("market-specific income tax", () => {
  it("applies the US 2026 standard deduction and federal brackets", () => {
    const result = calculateAnnualIncomeTax({ ruleSetId: "us-federal-income-tax-2026", profileId: "single", annualIncome: 66_500 });
    expect(result.allowance).toBe(16_100);
    expect(result.taxableIncome).toBe(50_400);
    expect(result.tax).toBe(5_800);
    expect(result.missingConcepts).toContain("State and local income tax");
  });

  it("uses different UK bands for Scotland and the rest of the UK", () => {
    const rest = calculateAnnualIncomeTax({ ruleSetId: "gb-income-tax-2026-27", profileId: "rest-of-uk", annualIncome: 60_000 });
    const scotland = calculateAnnualIncomeTax({ ruleSetId: "gb-income-tax-2026-27", profileId: "scotland", annualIncome: 60_000 });
    expect(rest.allowance).toBe(12_570);
    expect(scotland.tax).not.toBe(rest.tax);
  });

  it("separates Canadian federal and Ontario components", () => {
    const result = calculateAnnualIncomeTax({ ruleSetId: "ca-on-income-tax-2026", profileId: "ontario", annualIncome: 80_000 });
    expect(result.components.map((item) => item.id)).toEqual(["federal-income-tax", "ontario-income-tax"]);
    expect(result.coverage).toBe("partial");
  });

  it.each([
    ["au-income-tax-2026-27", "resident", 45_000, 4_020],
    ["nz-income-tax-2026-27", "resident-primary", 53_500, 8_270.5],
    ["ie-income-tax-2026", "single", 44_000, 4_800],
  ])("reproduces a published boundary for %s", (ruleSetId, profileId, income, expected) => {
    expect(calculateAnnualIncomeTax({ ruleSetId, profileId, annualIncome: income }).tax).toBeCloseTo(expected, 2);
  });
});

describe("market-specific take-home pay", () => {
  it("calculates US FICA separately from federal income tax", () => {
    const result = calculateTakeHomePay({ payrollRuleSetId: "us-federal-paycheck-2026", ruleSetId: "us-federal-income-tax-2026", profileId: "single", annualIncome: 200_000, frequency: "monthly" });
    expect(result.contributions.map((item) => item.id)).toEqual(["social-security", "medicare", "additional-medicare"]);
    expect(result.contributions[0].amount).toBe(11_439);
    expect(result.netPerPeriod).toBeGreaterThan(0);
  });

  it("caps Canada CPP, CPP2 and EI at published 2026 limits", () => {
    const result = calculateTakeHomePay({ payrollRuleSetId: "ca-on-paycheck-2026", ruleSetId: "ca-on-income-tax-2026", profileId: "ontario", annualIncome: 100_000, frequency: "annual" });
    expect(result.contributions.map((item) => item.amount)).toEqual([4_230.45, 416, 1_123.07]);
  });

  it("caps the New Zealand ACC levy", () => {
    const result = calculateTakeHomePay({ payrollRuleSetId: "nz-take-home-2026-27", ruleSetId: "nz-income-tax-2026-27", profileId: "resident-primary", annualIncome: 200_000, frequency: "annual" });
    expect(result.contributions[0].amount).toBe(2_741.22);
  });

  it("requires the applicable Irish PRSI phase", () => {
    const input = { payrollRuleSetId: "ie-take-home-2026", ruleSetId: "ie-income-tax-2026", profileId: "single", annualIncome: 50_000, frequency: "weekly" as const };
    expect(() => calculateTakeHomePay(input)).toThrow(/PRSI/);
    expect(calculateTakeHomePay({ ...input, contributionVariantId: "oct-dec" }).contributions.map((item) => item.id)).toEqual(["usc", "prsi"]);
  });

  it("never accepts a payroll rule set from another market", () => {
    expect(() => calculateTakeHomePay({ payrollRuleSetId: "gb-take-home-2026-27", ruleSetId: "us-federal-income-tax-2026", profileId: "single", annualIncome: 50_000, frequency: "annual" })).toThrow(/not compatible/);
  });

  it("registers all published tax and payroll variants against current market data", () => {
    const registry = new LegalTaxRegistry(
      [...INCOME_TAX_RULE_SETS, ...PAYROLL_RULE_SETS],
      [...INCOME_TAX_VARIANTS, ...PAYROLL_VARIANTS],
    );
    expect(registry.getPublishedVariants()).toHaveLength(12);
  });
});
