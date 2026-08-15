import { describe, expect, it } from "vitest";
import { australiaNesRedundancyWeeks, calculateEmployment, redundancyWeightForAge } from "./calculator";
import { EMPLOYMENT_RULE_SETS } from "./rules";
import { EMPLOYMENT_PAGE_DEFINITIONS, EMPLOYMENT_VARIANTS } from "./variants";

const calculate = (ruleSetId: string, values: Record<string, string | number | boolean | undefined>) => calculateEmployment({ ruleSetId, values });

describe("employment jurisdiction rules", () => {
  it("keeps US PTO contractual and leaves federal legal entitlement undetermined", () => {
    const result = calculate("us-pto-contract-2026", { annualGrantHours: 120, elapsedDays: 182.5, openingBalanceHours: 10, usedHours: 20 });
    expect(result.components[0]).toMatchObject({ status: "calculated-contractual", quantity: 60 });
    expect(result.components[1]).toMatchObject({ quantity: 50 });
    expect(result.components[2].status).toBe("not-determined");
    expect(result.components[2]).not.toHaveProperty("amount");
    expect(result.warnings.join(" ")).not.toContain("federal right");
  });

  it("prorates Great Britain regular-hours holiday and enforces the 28-day cap", () => {
    const result = calculate("gb-holiday-2026-27", { daysPerWeek: 6, employmentDaysInLeaveYear: 182.5, daysInLeaveYear: 365, carriedDays: 0, usedDays: 2 });
    expect(result.components[0].quantity).toBe(14);
    expect(result.components[1].quantity).toBe(12);
  });

  it("weights Great Britain service years across ages 22 and 41 and caps pay and service", () => {
    expect(redundancyWeightForAge(21)).toBe(0.5);
    expect(redundancyWeightForAge(22)).toBe(1);
    expect(redundancyWeightForAge(41)).toBe(1.5);
    const crossing = calculate("gb-redundancy-2026-27", { genuineRedundancy: "yes", completedYears: 3, ageAtTermination: 42, weeklyPay: 1000 });
    expect(crossing.components[0].quantity).toBe(3.5);
    expect(crossing.components[1].amount).toBe(2628.5);
    const capped = calculate("gb-redundancy-2026-27", { genuineRedundancy: "yes", completedYears: 30, ageAtTermination: 65, weeklyPay: 1000 });
    expect(capped.components[0].quantity).toBe(30);
    expect(capped.components[1].amount).toBe(22530);
  });

  it("does not calculate Great Britain redundancy from dismissal alone", () => {
    const result = calculate("gb-redundancy-2026-27", { genuineRedundancy: "unsure", completedYears: 10, ageAtTermination: 50, weeklyPay: 900 });
    expect(result.components[0].status).toBe("out-of-scope");
    expect(result.components[0]).not.toHaveProperty("amount");
  });

  it("requires Canadian federal coverage and selects 4/6/8 percent vacation tiers", () => {
    const outside = calculate("ca-federal-vacation-2026", { federalRegulated: "no", completedYears: 10, grossEarnings: 50000 });
    expect(outside.components[0].status).toBe("out-of-scope");
    expect(calculate("ca-federal-vacation-2026", { federalRegulated: "yes", completedYears: 1, grossEarnings: 50000 }).components[1].amount).toBe(2000);
    expect(calculate("ca-federal-vacation-2026", { federalRegulated: "yes", completedYears: 5, grossEarnings: 50000 }).components[1].amount).toBe(3000);
    expect(calculate("ca-federal-vacation-2026", { federalRegulated: "yes", completedYears: 10, grossEarnings: 50000 }).components[1].amount).toBe(4000);
  });

  it("keeps Canadian notice and severance separate at 3 and 12 months", () => {
    const atThree = calculate("ca-federal-termination-2026", { federalRegulated: "yes", eligibleReason: "yes", serviceMonths: 3, weeklyPay: 1000 });
    expect(atThree.components[0]).toMatchObject({ quantity: 2, amount: 2000 });
    expect(atThree.components[1].status).toBe("not-applicable");
    expect(atThree.components[1]).not.toHaveProperty("amount");
    const atTwelve = calculate("ca-federal-termination-2026", { federalRegulated: "yes", eligibleReason: "yes", serviceMonths: 12, weeklyPay: 1000 });
    expect(atTwelve.components[1]).toMatchObject({ quantity: 5, amount: 1000 });
    const threeYears = calculate("ca-federal-termination-2026", { federalRegulated: "yes", eligibleReason: "yes", serviceMonths: 36, weeklyPay: 1000 });
    expect(threeYears.components[0].quantity).toBe(3);
    expect(threeYears.components[1]).toMatchObject({ quantity: 6, amount: 1200 });
  });

  it("matches every Australia NES row including the 16-to-12 week drop", () => {
    expect(Array.from({ length: 10 }, (_, index) => australiaNesRedundancyWeeks(index + 1))).toEqual([4, 6, 7, 8, 10, 11, 13, 14, 16, 12]);
    const result = calculate("au-nes-redundancy-2026-27", { nesCovered: "yes", genuineRedundancy: "yes", smallBusiness: "no", awardSpecificScheme: "no", completedYears: 10, weeklyBasePay: 1500 });
    expect(result.components[0]).toMatchObject({ quantity: 12, amount: 18000, status: "calculated-official" });
  });

  it("blocks casual Australia leave and accrues ordinary hours for covered employees", () => {
    const casual = calculate("au-nes-leave-2026-27", { nesCovered: "yes", employmentType: "casual", ordinaryHoursPerWeek: 38, serviceDays: 365.2425, usedHours: 0 });
    expect(casual.components[0].status).toBe("not-applicable");
    const permanent = calculate("au-nes-leave-2026-27", { nesCovered: "yes", employmentType: "permanent", ordinaryHoursPerWeek: 38, serviceDays: 365.2425, usedHours: 8 });
    expect(permanent.components[0].quantity).toBe(152);
    expect(permanent.components[1].quantity).toBe(144);
  });

  it("uses the greater New Zealand weekly-pay measure and separates part-year and contractual amounts", () => {
    const annual = calculate("nz-holiday-pay-2026-27", { serviceMonths: 12, unusedWeeks: 2, ordinaryWeeklyPay: 1400, averageWeeklyEarnings: 1500 });
    expect(annual.components[0].amount).toBe(3000);
    const finalPay = calculate("nz-final-pay-2026-27", { grossSinceAnniversary: 30000, holidayPayAlreadyPaid: 400 });
    expect(finalPay.components[0].amount).toBe(2000);
    expect(finalPay.components[1].status).toBe("not-determined");
    expect(finalPay.components[1]).not.toHaveProperty("amount");
    expect(finalPay.components[2].status).toBe("not-determined");
    expect(finalPay.components[2]).not.toHaveProperty("amount");
    const manual = calculate("nz-final-pay-2026-27", { grossSinceAnniversary: 30000, holidayPayAlreadyPaid: 400, contractualRedundancyAmount: 5000 });
    expect(manual.components[2]).toMatchObject({ status: "manual-scenario", amount: 5000 });
  });

  it("compares all three Ireland leave methods", () => {
    const result = calculate("ie-annual-leave-2026", { changedEmployment: "no", hoursWorked: 1500, hoursPerWeek: 39, qualifyingMonths: 12 });
    expect(result.components.slice(0, 3).map((item) => item.quantity)).toEqual([156, 156, 120]);
    expect(result.components[3].quantity).toBe(156);
    const changed = calculate("ie-annual-leave-2026", { changedEmployment: "yes", hoursWorked: 1500, hoursPerWeek: 39, qualifyingMonths: 6 });
    expect(changed.components[0].status).toBe("not-applicable");
    expect(changed.components[0]).not.toHaveProperty("quantity");
    expect(changed.components[3].quantity).toBe(120);
  });

  it("applies Ireland 104-week eligibility, weekly cap and bonus week", () => {
    const before = calculate("ie-redundancy-2026", { actualRedundancy: "yes", fullyInsurable: "yes", age: 30, serviceWeeks: 103, weeklyPay: 700 });
    expect(before.components[0].status).toBe("not-applicable");
    const eligible = calculate("ie-redundancy-2026", { actualRedundancy: "yes", fullyInsurable: "yes", age: 30, serviceWeeks: 104, weeklyPay: 700 });
    expect(eligible.components[0]).toMatchObject({ quantity: 5, amount: 3000 });
  });

  it("publishes one exact-jurisdiction page per employment variant without Mexican concepts", () => {
    expect(EMPLOYMENT_VARIANTS).toHaveLength(11);
    expect(new Set(EMPLOYMENT_PAGE_DEFINITIONS.map((item) => item.path)).size).toBe(11);
    expect(EMPLOYMENT_VARIANTS.every((item) => item.publicationStatus === "published" && item.ruleSetIds.length === 1)).toBe(true);
    expect(JSON.stringify(EMPLOYMENT_RULE_SETS).toLowerCase()).not.toMatch(/aguinaldo|prima vacacional|vacationpremium|annualbonus|threemonths|twentydays/);
  });
});
