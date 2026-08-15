import { describe, expect, it } from "vitest";
import {
  VacationValidationError,
  calculateProportionalVacation,
  formatVacationDate,
  formatVacationDays,
  parseDaysInput,
  parseOptionalDaysInput,
} from "./proportionalVacation";
import {
  MEXICO_VACATION_RULE_2023,
  getMexicoLegalVacationDays,
} from "./rules/mx/2023";

describe("Mexico vacation entitlement", () => {
  it.each([
    [1, 12],
    [2, 14],
    [3, 16],
    [4, 18],
    [5, 20],
    [6, 22],
    [10, 22],
    [11, 24],
    [15, 24],
    [16, 26],
    [30, 30],
    [31, 32],
    [50, 38],
  ])("returns %i service-year days", (serviceYear, expected) => {
    expect(getMexicoLegalVacationDays(serviceYear)).toBe(expected);
  });

  it("rejects invalid service years", () => {
    expect(() => getMexicoLegalVacationDays(0)).toThrow(RangeError);
    expect(() => getMexicoLegalVacationDays(1.5)).toThrow(RangeError);
  });

  it("keeps official source and review metadata", () => {
    expect(MEXICO_VACATION_RULE_2023.effectiveFrom).toBe("2023-01-01");
    expect(MEXICO_VACATION_RULE_2023.reviewedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(MEXICO_VACATION_RULE_2023.sources.length).toBeGreaterThanOrEqual(2);
  });
});

describe("proportional vacation calculation", () => {
  it("calculates 181 inclusive days during the first service year", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2025-01-01",
      endDate: "2025-06-30",
    });

    expect(result.completedYears).toBe(0);
    expect(result.elapsedCycleDays).toBe(181);
    expect(result.totalCycleDays).toBe(365);
    expect(result.cycleProgress).toBeCloseTo((12 * 181) / 365);
    expect(result.availableDays).toBe(0);
    expect(result.mainDays).toBe(0);
  });

  it("moves a completed year into acquired entitlement", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2024-01-01",
      endDate: "2024-12-31",
    });

    expect(result.completedYears).toBe(1);
    expect(result.lastCompletedEntitlement).toBe(12);
    expect(result.elapsedCycleDays).toBe(0);
    expect(result.availableDays).toBe(12);
    expect(result.cycleProgress).toBe(0);
  });

  it("uses the next service-year entitlement for current progress", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2024-01-01",
      endDate: "2025-06-30",
      usedDays: 4,
    });

    expect(result.completedYears).toBe(1);
    expect(result.currentServiceYear).toBe(2);
    expect(result.currentCycleEntitlement).toBe(14);
    expect(result.elapsedCycleDays).toBe(181);
    expect(result.cycleProgress).toBeCloseTo((14 * 181) / 365);
    expect(result.availableDays).toBe(8);
  });

  it("includes proportional progress only in termination mode", () => {
    const active = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2025-01-01",
      endDate: "2025-06-30",
    });
    const terminated = calculateProportionalVacation({
      mode: "terminatedEmployment",
      hireDate: "2025-01-01",
      endDate: "2025-06-30",
    });

    expect(active.mainDays).toBe(0);
    expect(terminated.mainDays).toBeCloseTo((12 * 181) / 365);
  });

  it("uses 366 days for a cycle containing February 29", () => {
    const result = calculateProportionalVacation({
      mode: "terminatedEmployment",
      hireDate: "2023-07-01",
      endDate: "2024-01-01",
    });

    expect(result.totalCycleDays).toBe(366);
  });

  it("clamps February 29 anniversaries in non-leap years", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2024-02-29",
      endDate: "2025-02-27",
    });

    expect(result.completedYears).toBe(1);
    expect(result.currentCycleStart).toBe("2025-02-28");
    expect(result.nextAnniversary).toBe("2026-02-28");
  });

  it("adds prior balance and subtracts used days once", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2024-01-01",
      endDate: "2025-01-31",
      priorBalance: 3,
      usedDays: 5,
    });

    expect(result.acquiredBalanceRaw).toBe(10);
    expect(result.availableDays).toBe(10);
  });

  it("reports advanced days without a negative main result", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2025-01-01",
      endDate: "2025-03-01",
      usedDays: 3,
    });

    expect(result.mainDays).toBe(0);
    expect(result.advancedDays).toBe(3);
  });

  it("allows contract benefits only when they meet legal minimums", () => {
    const result = calculateProportionalVacation({
      mode: "activeEmployment",
      hireDate: "2024-01-01",
      endDate: "2025-01-31",
      lastCompletedEntitlementOverride: 15,
      currentCycleEntitlementOverride: 18,
    });

    expect(result.lastCompletedEntitlement).toBe(15);
    expect(result.currentCycleEntitlement).toBe(18);
    expect(result.usesContractOverride).toBe(true);

    expect(() =>
      calculateProportionalVacation({
        mode: "activeEmployment",
        hireDate: "2024-01-01",
        endDate: "2025-01-31",
        currentCycleEntitlementOverride: 10,
      }),
    ).toThrowError(
      expect.objectContaining<VacationValidationError>({
        code: "contract_below_legal",
      }),
    );
  });

  it("rejects invalid dates, unsupported periods and numbers", () => {
    expect(() =>
      calculateProportionalVacation({
        mode: "activeEmployment",
        hireDate: "2025-02-30",
        endDate: "2025-03-01",
      }),
    ).toThrowError(expect.objectContaining({ code: "invalid_hire_date" }));

    expect(() =>
      calculateProportionalVacation({
        mode: "activeEmployment",
        hireDate: "2025-02-01",
        endDate: "2025-01-31",
      }),
    ).toThrowError(expect.objectContaining({ code: "end_before_hire" }));

    expect(() =>
      calculateProportionalVacation({
        mode: "activeEmployment",
        hireDate: "2022-01-01",
        endDate: "2022-12-31",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "unsupported_rule_period" }),
    );

    expect(() =>
      calculateProportionalVacation({
        mode: "activeEmployment",
        hireDate: "2025-01-01",
        endDate: "2025-02-01",
        priorBalance: Number.NaN,
      }),
    ).toThrowError(expect.objectContaining({ code: "invalid_number" }));
  });
});

describe("input and output helpers", () => {
  it("parses integer and decimal day values", () => {
    expect(parseDaysInput("12")).toEqual({
      ok: true,
      value: 12,
      normalized: "12",
    });
    expect(parseDaysInput("1,5")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
    });
    expect(parseOptionalDaysInput(" ")).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
  });

  it("rejects malformed, negative and overly precise values", () => {
    expect(parseDaysInput("")).toEqual({ ok: false, error: "required" });
    expect(parseDaysInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseDaysInput("1.2.3")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseDaysInput("1.234")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats days and civil dates without timezone shifts", () => {
    expect(formatVacationDays(5.95068)).toBe("5.95");
    expect(formatVacationDays(12)).toBe("12");
    expect(formatVacationDate("2025-01-01")).toBe("1 de enero de 2025");
  });
});
