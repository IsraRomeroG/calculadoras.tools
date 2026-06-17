import { describe, expect, it } from "vitest";
import {
  buildAttendanceSummary,
  calculateAttendance,
  parseAttendanceInteger,
  parseAttendancePercent,
} from "./attendance";

describe("attendance calculator", () => {
  it("calculates current percentage from attended classes", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 34,
      requiredPercent: 80,
      remainingClasses: 0,
    });

    expect(result.currentPercent).toBe(85);
    expect(result.currentAbsences).toBe(6);
    expect(result.currentStatus).toBe("meets");
    expect(result.marginPoints).toBe(5);
  });

  it("calculates attended classes from absences mode", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "absences",
      absences: 6,
      requiredPercent: 80,
      remainingClasses: 10,
    });

    expect(result.attendedClasses).toBe(34);
    expect(result.currentPercent).toBe(85);
    expect(result.maximumFinalAbsences).toBe(10);
    expect(result.availableAbsences).toBe(4);
  });

  it("calculates final minimum attendances and available absences", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 34,
      requiredPercent: 80,
      remainingClasses: 10,
    });

    expect(result.finalTotalClasses).toBe(50);
    expect(result.minimumAttendancesFinal).toBe(40);
    expect(result.maximumFinalAbsences).toBe(10);
    expect(result.availableAbsences).toBe(4);
    expect(result.actionMessage).toContain("Puedes faltar 4");
  });

  it("shows negative availability as exceeded absences", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 30,
      requiredPercent: 80,
      remainingClasses: 0,
    });

    expect(result.currentPercent).toBe(75);
    expect(result.rawAvailableAbsences).toBe(-2);
    expect(result.availableAbsences).toBe(-2);
    expect(result.exceededAbsences).toBe(2);
    expect(result.viability).toBe("imposible");
  });

  it("marks a below-minimum result as recoverable when remaining classes are enough", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 30,
      requiredPercent: 80,
      remainingClasses: 10,
    });

    expect(result.viability).toBe("recuperable");
    expect(result.minimumRemainingAttendances).toBe(10);
    expect(result.availableAbsences).toBe(0);
    expect(result.consecutiveClassesToRecover).toBe(10);
    expect(result.actionMessage).toContain("10 de las 10");
  });

  it("marks the target as impossible and shows max possible percent", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 25,
      requiredPercent: 80,
      remainingClasses: 5,
    });

    expect(result.viability).toBe("imposible");
    expect(result.minimumRemainingAttendances).toBe(5);
    expect(result.attendancesNeededFromRemaining).toBe(11);
    expect(result.maxPossiblePercent).toBe(66.67);
    expect(result.actionMessage).toContain("66.67%");
  });

  it("treats 100 percent with existing absences as impossible to recover", () => {
    const result = calculateAttendance({
      totalClasses: 10,
      mode: "attended",
      attendedClasses: 9,
      requiredPercent: 100,
      remainingClasses: 100,
    });

    expect(result.viability).toBe("imposible");
    expect(result.consecutiveClassesToRecover).toBeNull();
    expect(result.recoverySearchLimitExceeded).toBe(false);
  });

  it("treats 0 percent as always meeting the requirement", () => {
    const result = calculateAttendance({
      totalClasses: 10,
      mode: "attended",
      attendedClasses: 0,
      requiredPercent: 0,
      remainingClasses: 5,
    });

    expect(result.currentStatus).toBe("meets");
    expect(result.viability).toBe("cumple");
    expect(result.availableAbsences).toBe(5);
    expect(result.consecutiveClassesToRecover).toBe(0);
  });

  it("builds a copy summary", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "attended",
      attendedClasses: 34,
      requiredPercent: 80,
      remainingClasses: 10,
    });

    expect(buildAttendanceSummary(result)).toContain(
      "Calculadora de asistencia escolar",
    );
    expect(buildAttendanceSummary(result)).toContain("Faltas disponibles: 4");
  });
});

describe("attendance number parsing", () => {
  it("parses integer class counts with thousands separators", () => {
    expect(parseAttendanceInteger("1,000")).toMatchObject({
      ok: true,
      value: 1000,
    });
  });

  it("rejects decimal class counts", () => {
    expect(parseAttendanceInteger("12.5")).toMatchObject({
      ok: false,
      error: "invalid",
    });
  });

  it("parses percent with decimal comma", () => {
    expect(parseAttendancePercent("87,5%")).toMatchObject({
      ok: true,
      value: 87.5,
    });
  });

  it("rejects percentages above 100", () => {
    expect(parseAttendancePercent("100.1")).toMatchObject({
      ok: false,
      error: "too_large",
    });
  });
});
