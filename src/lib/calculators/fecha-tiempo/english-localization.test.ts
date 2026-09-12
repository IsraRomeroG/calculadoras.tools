import { describe, expect, it } from "vitest";
import {
  buildMeetingSummary,
  calculateMeetingCost,
} from "./calculadora-costo-reunion/meetingCost.en";
import {
  buildAgeCopyText,
  calculateAgeResult,
  formatAgeDifference,
} from "./calculadora-de-edad/age.en";
import {
  buildWorkHoursSummary,
  calculateWorkHours,
} from "./calculadora-de-horas-trabajadas/workHours.en";
import {
  buildCopyText,
  buildCountdownHeadline,
  calculateCountdown,
} from "./calculadora-fecha-limite-countdown/countdown.en";
import {
  buildPomodoroSummary,
  calculatePomodoroPlan,
} from "./calculadora-pomodoro/pomodoro.en";
import {
  buildReadingSummary,
  calculateReadingTime,
} from "./calculadora-tiempo-de-lectura/readingTime.en";
import {
  buildDateDifferenceCopyText,
  calculateDateDifference,
  formatCompactDuration,
  formatFullPlainDate,
} from "./diferencia-entre-fechas/date-difference.en";

describe("English date and time calculator localization", () => {
  it("localizes age and date-difference output", () => {
    const birthDate = { year: 1990, month: 3, day: 15 };
    const referenceDate = { year: 2026, month: 4, day: 25 };
    const age = calculateAgeResult({
      birthDate,
      referenceDate,
      today: referenceDate,
    });
    const difference = calculateDateDifference({
      startDate: { year: 2026, month: 1, day: 15 },
      endDate: { year: 2026, month: 9, day: 30 },
    });

    expect(formatAgeDifference(age.age)).toBe(
      "36 years, 1 month, and 10 days",
    );
    expect(buildAgeCopyText({ birthDate, referenceDate, result: age })).toContain(
      "Date of birth: March 15, 1990",
    );
    expect(formatFullPlainDate({ year: 2026, month: 9, day: 30 })).toContain(
      "Wednesday, September 30, 2026",
    );
    expect(formatCompactDuration(difference.calendar)).toBe(
      "8 months, and 15 days",
    );
    expect(difference.startWeekday).toBe("Thursday");
    expect(difference.endWeekday).toBe("Wednesday");
    expect(
      buildDateDifferenceCopyText({
        startDate: { year: 2026, month: 1, day: 15 },
        endDate: { year: 2026, month: 9, day: 30 },
        result: difference,
      }),
    ).toContain("Weekdays (holidays not excluded; standard): 184");
  });

  it("localizes deadline and work-hours output", () => {
    const targetDate = { year: 2026, month: 9, day: 30 };
    const countdown = calculateCountdown({
      mode: "date-only",
      targetDate,
      nowMs: new Date(2026, 8, 25, 12).getTime(),
    });
    const workday = calculateWorkHours({
      shifts: [
        {
          label: "",
          start: "09:00",
          end: "18:00",
          breakMinutes: 60,
        },
      ],
      regularHoursLimit: 8,
      overtimeMultiplier: 1.5,
    });

    expect(buildCountdownHeadline(countdown, "Launch")).toBe(
      "5 calendar days remaining.",
    );
    expect(
      buildCopyText({
        name: "Launch",
        mode: "date-only",
        targetDate,
        result: countdown,
      }),
    ).toContain("Date: Wednesday, September 30, 2026");
    expect(workday.shifts[0]?.label).toBe("Shift 1");
    expect(buildWorkHoursSummary(workday)).toContain("Total worked: 8 h 00 min");
  });

  it("localizes Pomodoro, meeting-cost and reading-time output", () => {
    const pomodoro = calculatePomodoroPlan({
      mode: "pomodoros",
      pomodoros: 2,
      focusMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 20,
      longBreakEvery: 4,
      startTime: "09:00",
    });
    const meeting = calculateMeetingCost({
      durationMinutes: 60,
      roles: [{ name: "", people: 5, hourlyRate: 100 }],
      frequency: "once",
    });
    const reading = calculateReadingTime({
      mode: "words",
      manualWords: 1_200,
      wordsPerMinute: 220,
      now: new Date("2026-01-01T14:30:00.000Z"),
      timeZone: "UTC",
    });

    expect(pomodoro.blocks[0]?.label).toBe("Focus 1");
    expect(buildPomodoroSummary(pomodoro)).toContain("Pomodoro plan: 2 pomodoros");
    expect(meeting.roles[0]?.name).toBe("Role 1");
    expect(buildMeetingSummary(meeting)).toContain("Estimated cost:");
    expect(reading.presetEstimates[0]?.preset.label).toBe("Slow");
    expect(buildReadingSummary(reading)).toContain("Estimated range:");
  });
});
