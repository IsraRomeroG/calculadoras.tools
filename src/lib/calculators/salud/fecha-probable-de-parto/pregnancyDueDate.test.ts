import { describe, expect, it } from "vitest";
import {
  buildMethodComparisons,
  calculateFromAssistedReproduction,
  calculateFromLmp,
  calculateFromOfficialDueDate,
  calculateFromOvulation,
  calculateFromUltrasound,
  formatGestationalAge,
  parseIsoDate,
} from "./pregnancyDueDate";

describe("pregnancy due date calculations", () => {
  const today = { year: 2026, month: 4, day: 25 };

  it("calculates FPP from LMP with Naegele's 280 days", () => {
    const result = calculateFromLmp({
      lmpDate: { year: 2025, month: 7, day: 15 },
      today,
    });

    expect(result.dueDate).toEqual({ year: 2026, month: 4, day: 21 });
    expect(result.gestationalAge).toEqual({
      totalDays: 284,
      weeks: 40,
      days: 4,
    });
    expect(result.daysUntilDueDate).toBe(-4);
    expect(result.termWindows[0]).toMatchObject({
      startDate: { year: 2026, month: 3, day: 10 },
      endDate: { year: 2026, month: 3, day: 30 },
    });
    expect(result.termWindows[2]).toMatchObject({
      startDate: { year: 2026, month: 4, day: 14 },
      endDate: { year: 2026, month: 4, day: 27 },
    });
  });

  it("adjusts LMP due date for cycle length and optional luteal phase", () => {
    const byCycle = calculateFromLmp({
      lmpDate: { year: 2025, month: 7, day: 15 },
      cycleLength: 32,
      today,
    });
    const byLutealPhase = calculateFromLmp({
      lmpDate: { year: 2025, month: 7, day: 15 },
      cycleLength: 32,
      lutealPhase: 14,
      today,
    });

    expect(byCycle.dueDate).toEqual({ year: 2026, month: 4, day: 25 });
    expect(byLutealPhase.dueDate).toEqual(byCycle.dueDate);
  });

  it("calculates FPP from ovulation or conception date", () => {
    const result = calculateFromOvulation({
      conceptionDate: { year: 2025, month: 7, day: 28 },
      today,
    });

    expect(result.dueDate).toEqual({ year: 2026, month: 4, day: 20 });
    expect(result.estimatedLmp).toEqual({ year: 2025, month: 7, day: 14 });
    expect(result.confidence).toBe("Media");
  });

  it("marks intercourse dates as lower confidence", () => {
    const result = calculateFromOvulation({
      conceptionDate: { year: 2025, month: 7, day: 28 },
      source: "intercourse",
      today,
    });

    expect(result.confidence).toBe("Baja");
    expect(result.warnings[0]).toContain("espermatozoides");
  });

  it("calculates FPP from ultrasound gestational age", () => {
    const result = calculateFromUltrasound({
      scanDate: { year: 2025, month: 10, day: 10 },
      weeks: 12,
      days: 3,
      today,
    });

    expect(result.dueDate).toEqual({ year: 2026, month: 4, day: 21 });
    expect(result.estimatedLmp).toEqual({ year: 2025, month: 7, day: 15 });
    expect(result.confidence).toBe("Alta");
  });

  it("calculates FPP from embryo transfer day 5", () => {
    const result = calculateFromAssistedReproduction({
      date: { year: 2026, month: 1, day: 10 },
      kind: "transfer",
      embryoAgeDays: 5,
      today: { year: 2026, month: 1, day: 10 },
    });

    expect(result.dueDate).toEqual({ year: 2026, month: 9, day: 28 });
    expect(result.estimatedLmp).toEqual({ year: 2025, month: 12, day: 22 });
    expect(result.confidence).toBe("Alta");
  });

  it("uses official FPP as the primary date", () => {
    const result = calculateFromOfficialDueDate({
      dueDate: { year: 2026, month: 4, day: 21 },
      today,
    });

    expect(result.estimatedLmp).toEqual({ year: 2025, month: 7, day: 15 });
    expect(formatGestationalAge(result.gestationalAge)).toBe(
      "40 semanas y 4 días",
    );
  });

  it("builds method comparison differences against the primary result", () => {
    const principal = calculateFromLmp({
      lmpDate: { year: 2025, month: 7, day: 15 },
      today,
    });
    const ovulation = calculateFromOvulation({
      conceptionDate: { year: 2025, month: 7, day: 28 },
      today,
    });

    expect(buildMethodComparisons(principal, [principal, ovulation])).toEqual([
      expect.objectContaining({ method: "lmp", differenceDays: 0 }),
      expect.objectContaining({ method: "ovulation", differenceDays: -1 }),
    ]);
  });

  it("parses ISO dates and rejects invalid leap dates", () => {
    expect(parseIsoDate("2024-02-29")).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
    expect(parseIsoDate("2025-02-29")).toBeNull();
  });
});
