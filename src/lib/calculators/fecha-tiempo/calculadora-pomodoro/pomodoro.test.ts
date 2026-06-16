import { describe, expect, it } from "vitest";
import {
  PomodoroValidationError,
  buildPomodoroSummary,
  calculatePomodoroPlan,
  differenceBetweenClockTimes,
  formatClockTime,
  formatPomodoroDuration,
  parseClockTime,
  parsePomodoroNumber,
  type PomodoroPlanInput,
} from "./pomodoro";

const baseInput: PomodoroPlanInput = {
  mode: "pomodoros",
  pomodoros: 4,
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 20,
  longBreakEvery: 4,
  startTime: "09:00",
};

describe("pomodoro plan by count", () => {
  it("calculates the classic 4 pomodoro plan without a final long break", () => {
    const result = calculatePomodoroPlan(baseInput);

    expect(result).toMatchObject({
      pomodoros: 4,
      focusTotalMinutes: 100,
      breakTotalMinutes: 15,
      shortBreaks: 3,
      longBreaks: 0,
      totalMinutes: 115,
      startTime: "09:00",
      endTime: "10:55",
    });
    expect(result.blocks.at(-1)).toMatchObject({
      type: "focus",
      pomodoroNumber: 4,
    });
  });

  it("does not add a break after the last pomodoro", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      pomodoros: 2,
      longBreakEvery: 2,
    });

    expect(result.totalMinutes).toBe(55);
    expect(result.shortBreaks).toBe(1);
    expect(result.longBreaks).toBe(0);
    expect(result.blocks.map((block) => block.type)).toEqual([
      "focus",
      "short-break",
      "focus",
    ]);
  });

  it("returns only focus time for a single pomodoro", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      pomodoros: 1,
      startTime: undefined,
    });

    expect(result).toMatchObject({
      totalMinutes: 25,
      focusTotalMinutes: 25,
      breakTotalMinutes: 0,
      shortBreaks: 0,
      longBreaks: 0,
      endTime: undefined,
    });
    expect(result.blocks).toHaveLength(1);
  });

  it("calculates long breaks every 2 pomodoros", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      pomodoros: 5,
      longBreakEvery: 2,
    });

    expect(result.longBreaks).toBe(2);
    expect(result.shortBreaks).toBe(2);
    expect(result.totalMinutes).toBe(175);
    expect(result.blocks.map((block) => block.type)).toEqual([
      "focus",
      "short-break",
      "focus",
      "long-break",
      "focus",
      "short-break",
      "focus",
      "long-break",
      "focus",
    ]);
  });

  it("allows long-break frequency greater than the pomodoro count", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      pomodoros: 3,
      longBreakEvery: 10,
    });

    expect(result.longBreaks).toBe(0);
    expect(result.shortBreaks).toBe(2);
    expect(result.totalMinutes).toBe(85);
  });
});

describe("pomodoro plan by available time", () => {
  it("fits complete pomodoros inside an available block", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      mode: "time",
      pomodoros: undefined,
      availableMinutes: 120,
    });

    expect(result).toMatchObject({
      pomodoros: 4,
      totalMinutes: 115,
      focusTotalMinutes: 100,
      breakTotalMinutes: 15,
      unusedMinutes: 5,
      availableMinutes: 120,
      endTime: "10:55",
    });
  });

  it("does not add a break if no additional focus block fits afterward", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      mode: "time",
      availableMinutes: 55,
      pomodoros: undefined,
    });

    expect(result.pomodoros).toBe(2);
    expect(result.totalMinutes).toBe(55);
    expect(result.unusedMinutes).toBe(0);
    expect(result.blocks.map((block) => block.type)).toEqual([
      "focus",
      "short-break",
      "focus",
    ]);
  });

  it("returns a clear zero-pomodoro state when focus does not fit", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      mode: "time",
      availableMinutes: 20,
      pomodoros: undefined,
    });

    expect(result.pomodoros).toBe(0);
    expect(result.totalMinutes).toBe(0);
    expect(result.unusedMinutes).toBe(20);
    expect(result.warnings.map((warning) => warning.code)).toContain(
      "no_complete_pomodoro",
    );
  });

  it("can derive available time from a deadline", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      mode: "time",
      availableMinutes: undefined,
      pomodoros: undefined,
      startTime: "23:00",
      deadlineTime: "01:00",
    });

    expect(result.deadline).toMatchObject({
      availableMinutes: 120,
      status: "on_time",
      differenceMinutes: 5,
    });
    expect(result.endTime).toBe("00:55");
    expect(result.pomodoros).toBe(4);
  });
});

describe("deadline, formatting, parsing, and validation", () => {
  it("marks a fixed pomodoro plan that exceeds its deadline", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      startTime: "09:00",
      deadlineTime: "10:00",
    });

    expect(result.deadline).toEqual({
      availableMinutes: 60,
      status: "exceeded",
      differenceMinutes: -55,
    });
  });

  it("adds minutes crossing midnight", () => {
    const result = calculatePomodoroPlan({
      ...baseInput,
      pomodoros: 2,
      startTime: "23:30",
    });

    expect(result.endTime).toBe("00:25");
    expect(result.blocks.at(-1)).toMatchObject({
      startTime: "00:00",
      endTime: "00:25",
    });
  });

  it("parses and formats times and durations", () => {
    expect(parseClockTime("22:30")).toBe(1350);
    expect(parseClockTime("24:00")).toBeNull();
    expect(formatClockTime(1455)).toBe("00:15");
    expect(differenceBetweenClockTimes(23 * 60, 60)).toBe(120);
    expect(formatPomodoroDuration(115)).toBe("1 h 55 min");
    expect(formatPomodoroDuration(120)).toBe("2 h");
    expect(formatPomodoroDuration(5)).toBe("5 min");
  });

  it("parses numeric text inputs", () => {
    expect(parsePomodoroNumber("25")).toEqual({
      ok: true,
      value: 25,
      normalized: "25",
    });
    expect(parsePomodoroNumber("25,5", { integer: false })).toEqual({
      ok: true,
      value: 25.5,
      normalized: "25.5",
    });
    expect(parsePomodoroNumber("25,5")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("builds a useful copy summary", () => {
    const summary = buildPomodoroSummary(calculatePomodoroPlan(baseInput));

    expect(summary).toContain("Plan Pomodoro");
    expect(summary).toContain("4 pomodoros de 25 min");
    expect(summary).toContain("Duracion total: 1 h 55 min");
    expect(summary).toContain("Fin estimado: 10:55");
  });

  it("rejects invalid settings", () => {
    expect(() =>
      calculatePomodoroPlan({ ...baseInput, focusMinutes: 0 }),
    ).toThrow(PomodoroValidationError);
    expect(() =>
      calculatePomodoroPlan({
        ...baseInput,
        mode: "time",
        pomodoros: undefined,
        availableMinutes: 0,
      }),
    ).toThrow(/tiempo disponible/i);
    expect(() =>
      calculatePomodoroPlan({ ...baseInput, startTime: "9:00" }),
    ).toThrow(/HH:mm/i);
  });
});
