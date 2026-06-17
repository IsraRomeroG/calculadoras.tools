import { describe, expect, it } from "vitest";
import {
  advanceStudyDates,
  buildStudyHoursSummary,
  calculateStudyHours,
  countStudyDates,
  formatStudyDuration,
  parseStudyHoursNumber,
} from "./studyHours";

describe("study hours calculator", () => {
  it("counts exact selected weekdays and calculates hours per day", () => {
    const result = calculateStudyHours({
      mode: "hoursPerDay",
      totalHours: 60,
      completedHours: 0,
      startDate: "2026-07-01",
      deadlineDate: "2026-07-30",
      selectedWeekdays: [1, 2, 3, 4, 5],
      sessionMinutes: 50,
      referenceDate: "2026-06-16",
    });

    expect(result.effectiveStudyDays).toBe(22);
    expect(result.hoursPerDay).toBe(2.73);
    expect(result.sessionsPerDay).toBe(4);
    expect(result.hoursPerWeek).toBe(13.64);
    expect(result.load.level).toBe("moderate");
  });

  it("uses completed hours as already covered progress", () => {
    const result = calculateStudyHours({
      mode: "hoursPerDay",
      totalHours: 60,
      completedHours: 10,
      startDate: "2026-07-01",
      deadlineDate: "2026-07-30",
      selectedWeekdays: [1, 2, 3, 4, 5],
      sessionMinutes: 50,
      referenceDate: "2026-06-16",
    });

    expect(result.pendingHours).toBe(50);
    expect(result.hoursPerDay).toBe(2.27);
  });

  it("uses all calendar days when every weekday is selected", () => {
    expect(
      countStudyDates("2026-07-01", "2026-07-30", [0, 1, 2, 3, 4, 5, 6]),
    ).toBe(30);
  });

  it("estimates an end date from fixed daily hours", () => {
    const result = calculateStudyHours({
      mode: "estimatedDate",
      totalHours: 20,
      completedHours: 0,
      dailyHours: 2,
      startDate: "2026-07-01",
      selectedWeekdays: [1, 2, 3, 4, 5],
      sessionMinutes: 50,
    });

    expect(result.effectiveStudyDays).toBe(10);
    expect(result.estimatedDate).toBe("2026-07-14");
    expect(result.sessionsPerDay).toBe(3);
  });

  it("returns completed state when pending hours are zero", () => {
    const result = calculateStudyHours({
      mode: "estimatedDate",
      totalHours: 20,
      completedHours: 20,
      dailyHours: 2,
      startDate: "2026-07-01",
      selectedWeekdays: [1, 2, 3, 4, 5],
    });

    expect(result.pendingHours).toBe(0);
    expect(result.load.level).toBe("completed");
    expect(result.recommendation).toContain("completaste");
  });

  it("marks very high load over 8 hours per day", () => {
    const result = calculateStudyHours({
      mode: "hoursPerDay",
      totalHours: 30,
      startDate: "2026-07-01",
      deadlineDate: "2026-07-03",
      selectedWeekdays: [3, 4, 5],
      sessionMinutes: 50,
      referenceDate: "2026-06-16",
    });

    expect(result.hoursPerDay).toBe(10);
    expect(result.load.level).toBe("very_high");
  });

  it("throws when there are no study days in the range", () => {
    expect(() =>
      calculateStudyHours({
        mode: "hoursPerDay",
        totalHours: 10,
        startDate: "2026-07-04",
        deadlineDate: "2026-07-05",
        selectedWeekdays: [1, 2, 3, 4, 5],
        referenceDate: "2026-06-16",
      }),
    ).toThrow("No hay dias efectivos");
  });

  it("throws when the deadline is not future relative to reference date", () => {
    expect(() =>
      calculateStudyHours({
        mode: "hoursPerDay",
        totalHours: 10,
        startDate: "2026-07-01",
        deadlineDate: "2026-07-10",
        selectedWeekdays: [1, 2, 3, 4, 5],
        referenceDate: "2026-07-10",
      }),
    ).toThrow("fecha limite debe ser futura");
  });

  it("throws when no weekdays are selected", () => {
    expect(() =>
      calculateStudyHours({
        mode: "estimatedDate",
        totalHours: 10,
        dailyHours: 1,
        startDate: "2026-07-01",
        selectedWeekdays: [],
      }),
    ).toThrow("Selecciona al menos un dia");
  });

  it("advances study dates inclusively from the start date", () => {
    expect(advanceStudyDates("2026-07-01", [1, 2, 3, 4, 5], 1)).toBe(
      "2026-07-01",
    );
    expect(advanceStudyDates("2026-07-04", [1], 1)).toBe("2026-07-06");
  });

  it("formats duration and copy summary", () => {
    const result = calculateStudyHours({
      mode: "hoursPerDay",
      totalHours: 60,
      startDate: "2026-07-01",
      deadlineDate: "2026-07-30",
      selectedWeekdays: [1, 2, 3, 4, 5],
      sessionMinutes: 50,
      referenceDate: "2026-06-16",
    });

    expect(formatStudyDuration(2.75)).toBe("2 h 45 min");
    expect(buildStudyHoursSummary(result)).toContain("Plan semanal");
  });
});

describe("study hours number parsing", () => {
  it("parses decimal comma", () => {
    expect(parseStudyHoursNumber("2,5")).toMatchObject({
      ok: true,
      value: 2.5,
    });
  });

  it("parses optional empty input as NaN", () => {
    expect(parseStudyHoursNumber("", { required: false })).toMatchObject({
      ok: true,
      normalized: "",
    });
  });

  it("rejects too many decimals", () => {
    expect(parseStudyHoursNumber("2.12345")).toMatchObject({
      ok: false,
      error: "too_many_decimals",
    });
  });
});
