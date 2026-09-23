import { describe, expect, it } from "vitest";
import * as en from "./attendance.en";
import {
  attemptAttendanceCopy,
  initAttendanceCalculators,
} from "./attendance-controller";
import {
  ATTENDANCE_EXAMPLES,
  buildAttendanceSummary,
  calculateAttendance,
  ceilDiv,
  parseAttendanceInteger,
  parseAttendancePercent,
  parseAttendanceRemaining,
} from "./attendance";

function calculate(
  totalClasses: number,
  attendedClasses: number,
  requiredPercent: number,
  remainingClasses: number | null,
) {
  return calculateAttendance({
    totalClasses,
    mode: "attended",
    attendedClasses,
    requiredPercent,
    remainingClasses,
  });
}

describe("exact attendance model", () => {
  it("keeps an omitted remaining count unknown", () => {
    const result = calculate(40, 34, 80, null);

    expect(result.currentPercent).toBe(85);
    expect(result.currentStatus).toBe("meets");
    expect(result.projection).toEqual({ status: "unknown", remainingClasses: null });
    expect(result.consecutiveClassesToRecover).toBe(0);
  });

  it("calculates a possible final course with available absences", () => {
    const result = calculate(40, 34, 80, 10);

    expect(result.projection).toMatchObject({
      status: "possible",
      finalTotalClasses: 50,
      minimumAttendancesFinal: 40,
      requiredAttendancesFromRemaining: 6,
      availableAbsences: 4,
      exceededAbsences: 0,
      maxPossiblePercent: 88,
    });
  });

  it("does not truncate the real need in an impossible scenario", () => {
    const result = calculate(40, 25, 80, 5);

    expect(result.projection).toMatchObject({
      status: "impossible",
      requiredAttendancesFromRemaining: 11,
      availableAbsences: 0,
      exceededAbsences: 6,
    });
    expect(result.consecutiveClassesToRecover).toBe(35);
    expect(result.presentation.neededLabel).toContain("5");
    expect(result.presentation.actionMessage).toContain("66.67%");
  });

  it("compares the exact ratio instead of its rounded display", () => {
    const parsed = parseAttendancePercent("66.67");
    if (!parsed.ok) throw new Error("Expected valid percent");
    const result = calculateAttendance({
      totalClasses: 3,
      mode: "attended",
      attendedClasses: 2,
      requiredPercent: parsed,
      remainingClasses: 0,
    });

    expect(result.currentPercent).toBeCloseTo(66.6666666667);
    expect(result.currentStatus).toBe("below");
    expect(result.projection).toMatchObject({
      status: "finished_below",
      requiredAttendancesFromRemaining: 1,
      exceededAbsences: 1,
    });
    expect(result.consecutiveClassesToRecover).toBe(1);
    expect(result.presentation.currentRoundingNotice).toContain("antes de redondear");
    expect(result.presentation.marginLabel).toContain("Déficit menor de 0.01");
  });

  it("reports a small positive exact margin", () => {
    const parsed = parseAttendancePercent("33.3332");
    if (!parsed.ok) throw new Error("Expected valid percent");
    const result = calculateAttendance({
      totalClasses: 3,
      mode: "attended",
      attendedClasses: 1,
      requiredPercent: parsed,
      remainingClasses: 0,
    });

    expect(result.currentStatus).toBe("meets");
    expect(result.presentation.marginLabel).toContain("menor de 0.01");
  });

  it.each([
    [40, 40, 80, 0, "finished_meets"],
    [40, 30, 80, 0, "finished_below"],
    [40, 40, 80, 5, "guaranteed"],
    [10, 0, 0, 5, "guaranteed"],
    [10, 9, 100, 100, "impossible"],
    [10, 10, 100, 5, "possible"],
  ] as const)("classifies projection %#", (t, a, p, r, status) => {
    expect(calculate(t, a, p, r).projection.status).toBe(status);
  });

  it("does not cap a theoretical recovery above 1000", () => {
    expect(calculate(1000, 0, 99.9, 1000).consecutiveClassesToRecover).toBe(999000);
    expect(calculate(1000, 0, 99.9999, null).consecutiveClassesToRecover).toBe(
      999999000,
    );
  });

  it("supports the maximum final total", () => {
    expect(calculate(1000, 1000, 80, 1000).projection).toMatchObject({
      finalTotalClasses: 2000,
      minimumAttendancesFinal: 1600,
      requiredAttendancesFromRemaining: 600,
      availableAbsences: 400,
    });
  });

  it.each([
    [40, 30, 80, 10, 10, 0, 0, 10, 80],
    [20, 16, 80, 4, 4, 0, 0, 0, 83.3333333333],
    [20, 16, 80, 5, 4, 1, 0, 0, 84],
    [40, 30, 80, 0, 2, 0, 2, 10, 75],
    [10, 9, 100, 100, 101, 0, 1, null, 99.09],
    [10, 10, 100, 5, 5, 0, 0, 0, 100],
  ] as const)(
    "preserves exact quantities for matrix case %#",
    (t, a, p, r, needed, available, exceeded, recovery, maximum) => {
      const result = calculate(t, a, p, r);
      expect(result.projection).toMatchObject({
        requiredAttendancesFromRemaining: needed,
        availableAbsences: available,
        exceededAbsences: exceeded,
      });
      expect(result.consecutiveClassesToRecover).toBe(recovery);
      if (result.projection.status !== "unknown") {
        expect(result.projection.maxPossiblePercent).toBeCloseTo(maximum, 2);
      }
    },
  );

  it("maintains projection and minimal-recovery invariants", () => {
    for (const t of [1, 3, 40, 1000]) {
      for (const a of [0, Math.floor(t / 2), t]) {
        for (const p of [0, 33.3332, 66.67, 80, 99.9999, 100]) {
          for (const r of [0, 1, 10, 1000]) {
            const result = calculate(t, a, p, r);
            const projection = result.projection;
            expect(result.attendedClasses + result.currentAbsences).toBe(t);
            if (projection.status === "unknown") continue;
            expect(projection.availableAbsences).toBeGreaterThanOrEqual(0);
            expect(projection.availableAbsences).toBeLessThanOrEqual(r);
            const q = projection.requiredAttendancesFromRemaining;
            if (q <= r) {
              expect(projection.availableAbsences + q).toBe(r);
              expect(projection.exceededAbsences).toBe(0);
            } else {
              expect(projection.availableAbsences).toBe(0);
              expect(projection.exceededAbsences).toBe(q - r);
            }
            if (projection.status === "guaranteed") {
              expect(result.currentStatus).toBe("meets");
            }
            if (r === 0) {
              expect(projection.status).toBe(
                result.currentStatus === "meets"
                  ? "finished_meets"
                  : "finished_below",
              );
            }
            const n = result.consecutiveClassesToRecover;
            if (n !== null && n > 0) {
              expect(((a + n) * 100) / (t + n)).toBeGreaterThanOrEqual(p);
              expect(((a + n - 1) * 100) / (t + n - 1)).toBeLessThan(p);
            }
          }
        }
      }
    }
  });

  it("calculates the same values in absences mode", () => {
    const result = calculateAttendance({
      totalClasses: 40,
      mode: "absences",
      absences: 6,
      requiredPercent: 80,
      remainingClasses: 10,
    });
    expect(result.attendedClasses).toBe(34);
    expect(result.projection).toMatchObject({ availableAbsences: 4 });
  });

  it("ignores the inactive attendance field", () => {
    expect(
      calculateAttendance({
        totalClasses: 40,
        mode: "attended",
        attendedClasses: 34,
        absences: 999,
        requiredPercent: 80,
        remainingClasses: null,
      }).currentAbsences,
    ).toBe(6);
    expect(
      calculateAttendance({
        totalClasses: 40,
        mode: "absences",
        attendedClasses: 999,
        absences: 6,
        requiredPercent: 80,
        remainingClasses: null,
      }).attendedClasses,
    ).toBe(34);
  });

  it("treats an omitted remaining count as unknown and explicit zero as finished", () => {
    const base = {
      totalClasses: 40,
      mode: "attended" as const,
      attendedClasses: 34,
      requiredPercent: 80,
    };

    expect(calculateAttendance(base).projection.status).toBe("unknown");
    expect(calculateAttendance({ ...base, remainingClasses: null }).projection.status).toBe(
      "unknown",
    );
    expect(calculateAttendance({ ...base, remainingClasses: 0 }).projection.status).toBe(
      "finished_meets",
    );
  });

  it("rejects invalid direct inputs and unknown modes", () => {
    expect(() =>
      calculateAttendance({
        totalClasses: 10.5,
        mode: "attended",
        attendedClasses: 10,
        requiredPercent: 80,
      }),
    ).toThrow();
    expect(() =>
      calculateAttendance({
        totalClasses: 10,
        mode: "other" as "attended",
        attendedClasses: 10,
        requiredPercent: 80,
      }),
    ).toThrow();
    expect(() => calculate(10, 10, 80.12345, null)).toThrow();
    expect(() => calculate(10, 10, Number.NaN, null)).toThrow();
    expect(() =>
      calculateAttendance({
        totalClasses: 10,
        mode: "attended",
        attendedClasses: 8,
        requiredPercent: { value: 80, scaled: 800000, normalized: "90" },
      }),
    ).toThrow();
  });

  it.each([
    { totalClasses: 0 },
    { totalClasses: 1001 },
    { totalClasses: Number.POSITIVE_INFINITY },
    { attendedClasses: 11 },
    { attendedClasses: 1.5 },
    { remainingClasses: -1 },
    { remainingClasses: 1001 },
    { remainingClasses: Number.NaN },
  ])("rejects invalid direct numeric input %#", (override) => {
    expect(() =>
      calculateAttendance({
        totalClasses: 10,
        mode: "attended",
        attendedClasses: 8,
        requiredPercent: 80,
        remainingClasses: null,
        ...override,
      }),
    ).toThrow();
  });

  it("rejects absences above the completed total", () => {
    expect(() =>
      calculateAttendance({
        totalClasses: 10,
        mode: "absences",
        absences: 11,
        requiredPercent: 80,
      }),
    ).toThrow();
  });

  it("uses overflow-safe integer ceiling division", () => {
    expect(ceilDiv(0, 7)).toBe(0);
    expect(ceilDiv(20, 5)).toBe(4);
    expect(ceilDiv(21, 5)).toBe(5);
    expect(ceilDiv(Number.MAX_SAFE_INTEGER, 2)).toBe(4_503_599_627_370_496);
  });
});

describe("strict attendance parsing", () => {
  it.each([
    ["80.125", 80.125, 801250],
    ["80,125", 80.125, 801250],
    ["0.001", 0.001, 10],
    ["0,001", 0.001, 10],
    ["80.000", 80, 800000],
    ["87,5%", 87.5, 875000],
    [" 87.5 % ", 87.5, 875000],
    ["99.9999", 99.9999, 999999],
  ])("parses %s as an ungrouped percentage", (text, value, scaled) => {
    expect(parseAttendancePercent(text)).toMatchObject({ ok: true, value, scaled });
  });

  it.each(["8 0", "8%0", "80%%", "80,1.2", "80..1", "1e2", ".5", ",5", "80."])(
    "rejects malformed percentage %s",
    (text) => expect(parseAttendancePercent(text)).toMatchObject({ ok: false }),
  );

  it.each(["80.12345", "80.00000"])("rejects excessive precision %s", (text) => {
    expect(parseAttendancePercent(text)).toMatchObject({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it.each(["100.0001", "-1", "NaN", "Infinity"])(
    "rejects an out-of-domain percentage %s",
    (text) => expect(parseAttendancePercent(text)).toMatchObject({ ok: false }),
  );

  it("distinguishes negative signs from other invalid signs", () => {
    expect(parseAttendancePercent("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseAttendancePercent("+1")).toEqual({ ok: false, error: "invalid" });
    expect(parseAttendanceInteger("−1")).toEqual({ ok: false, error: "negative" });
    expect(parseAttendanceInteger("+1")).toEqual({ ok: false, error: "invalid" });
  });

  it("distinguishes unknown remaining classes from a finished course", () => {
    expect(parseAttendanceRemaining("  ")).toEqual({
      ok: true,
      value: null,
      normalized: "",
    });
    expect(parseAttendanceRemaining("0")).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
    expect(parseAttendanceRemaining("-1")).toEqual({
      ok: false,
      error: "negative",
    });
  });

  it("classifies arbitrarily large percentages as above the limit", () => {
    expect(parseAttendancePercent("999999999999999999999")).toEqual({
      ok: false,
      error: "too_large",
    });
  });

  it("accepts valid thousands grouping only for class counts", () => {
    expect(parseAttendanceInteger("1,000")).toMatchObject({ ok: true, value: 1000 });
    expect(parseAttendanceInteger("1.000")).toMatchObject({ ok: true, value: 1000 });
    for (const text of ["12.5", "12,5", "1 0", "1e2"]) {
      expect(parseAttendanceInteger(text)).toMatchObject({ ok: false });
    }
  });

  it("distinguishes required and upper-limit errors for class counts", () => {
    expect(parseAttendanceInteger("   ")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseAttendanceInteger("41", { max: 40 })).toEqual({
      ok: false,
      error: "too_large",
    });
    expect(parseAttendanceInteger("999999999999999999999")).toEqual({
      ok: false,
      error: "too_large",
    });
  });
});

describe("presentation and language parity", () => {
  it("loads the shared browser controller without duplicating formulas", () => {
    expect(initAttendanceCalculators).toBeTypeOf("function");
  });
  it("includes accumulated absences and exact final need in the copy summary", () => {
    const result = calculate(40, 25, 80, 5);
    const summary = buildAttendanceSummary(result);
    expect(summary).toContain("Faltas acumuladas: 15");
    expect(summary).toContain("Asistencias necesarias de las restantes: 11");
    expect(summary).toContain("Excedente de faltas: 6");
  });

  it("presents every projection without mixing it with current status", () => {
    const unknown = calculate(40, 34, 80, null);
    expect(unknown.presentation.availabilityLabel).toBe(
      "Pendiente de clases restantes",
    );

    const finished = calculate(40, 40, 80, 0);
    expect(finished.presentation.actionMessage).toContain("El curso terminó");
    expect(finished.presentation.actionMessage).not.toContain("faltar");

    const impossible = calculate(40, 25, 80, 5);
    expect(impossible.presentation.neededLabel).toBe("No alcanzan las 5 restantes");
    expect(impossible.presentation.exceededLabel).toBe(
      "Excedes en 6 faltas el límite del curso",
    );

    const guaranteed = calculate(40, 40, 80, 5);
    expect(guaranteed.presentation.conditionMessage).toContain(
      "Siempre que no cambie",
    );
    expect(guaranteed.presentation.conditionMessage).toContain(
      "puede bajar temporalmente",
    );

    const belowPossible = calculate(40, 30, 80, 10);
    expect(belowPossible.currentStatus).toBe("below");
    expect(belowPossible.presentation.actionMessage).toContain(
      "Necesitas asistir al menos a 10 de las 10",
    );

    const oneAbsence = calculate(20, 16, 80, 5);
    expect(oneAbsence.presentation.actionMessage).toContain("Puedes faltar hasta 1");
    expect(oneAbsence.presentation.conditionMessage).toContain(
      "puede bajar temporalmente",
    );

    const allRemaining = calculate(20, 16, 80, 4);
    expect(allRemaining.presentation.actionMessage).toContain(
      "Debes asistir a las 4 clases restantes",
    );
  });

  it("pluralizes singular remaining and recovery messages", () => {
    const impossible = calculate(2, 0, 80, 1);
    expect(impossible.presentation.actionMessage).toContain("1 clase restante");
    expect(impossible.presentation.neededLabel).toBe(
      "La clase restante no alcanza",
    );

    const recovery = calculate(3, 2, 66.67, 0);
    expect(recovery.presentation.recoveryLabel).toContain("1 clase");
    expect(recovery.presentation.recoveryLabel).toContain(
      "escenario hipotético",
    );
  });

  it("preserves four-decimal minimums and warns about a rounded final maximum", () => {
    const precise = parseAttendancePercent("99.9999");
    if (!precise.ok) throw new Error("Expected valid percent");
    expect(
      buildAttendanceSummary(
        calculateAttendance({
          totalClasses: 1000,
          mode: "attended",
          attendedClasses: 1000,
          requiredPercent: precise,
          remainingClasses: null,
        }),
      ),
    ).toContain("99.9999%");

    const rounded = parseAttendancePercent("66.67");
    if (!rounded.ok) throw new Error("Expected valid percent");
    const result = calculateAttendance({
      totalClasses: 2,
      mode: "attended",
      attendedClasses: 1,
      requiredPercent: rounded,
      remainingClasses: 1,
    });
    expect(result.projection.status).toBe("impossible");
    expect(result.presentation.finalRoundingNotice).toContain("antes de redondear");
  });

  it("uses the same core states and numbers in English", () => {
    const input = {
      totalClasses: 40,
      mode: "attended" as const,
      attendedClasses: 25,
      requiredPercent: 80,
      remainingClasses: 5,
    };
    const esResult = calculateAttendance(input);
    const enResult = en.calculateAttendance(input);

    expect({ ...enResult, presentation: undefined }).toEqual({
      ...esResult,
      presentation: undefined,
    });
    expect(en.buildAttendanceSummary(enResult)).not.toMatch(
      /Asistencias|Faltas|Viabilidad/,
    );
  });

  it("keeps the interactive example data synchronized across locales", () => {
    expect(ATTENDANCE_EXAMPLES.map(({ id, values }) => ({ id, values }))).toEqual(
      en.ATTENDANCE_EXAMPLES.map(({ id, values }) => ({ id, values })),
    );
    expect(ATTENDANCE_EXAMPLES.map(({ id }) => id)).toEqual([
      "regular",
      "recover",
      "no-margin",
      "impossible",
      "unknown",
    ]);
    expect(ATTENDANCE_EXAMPLES.map(({ label }) => label)).toEqual([
      "Con margen al final",
      "Recuperar el mínimo",
      "Sin faltas disponibles",
      "No alcanzan las restantes",
      "Solo asistencia actual",
    ]);
    expect(en.ATTENDANCE_EXAMPLES.map(({ label }) => label)).toEqual([
      "Final-course margin",
      "Recover",
      "No absences available",
      "Not enough classes left",
      "Current attendance only",
    ]);
  });
});

describe("attendance copy attempts", () => {
  it("uses the Clipboard API without invoking the fallback", async () => {
    let fallbackCalls = 0;
    await expect(
      attemptAttendanceCopy({
        writeText: async () => undefined,
        legacyCopy: () => {
          fallbackCalls += 1;
          return true;
        },
        isCurrent: () => true,
      }),
    ).resolves.toBe("copied");
    expect(fallbackCalls).toBe(0);
  });

  it.each([
    [undefined, true, "copied"],
    [async () => Promise.reject(new Error("denied")), true, "copied"],
    [undefined, false, "failed"],
    [async () => Promise.reject(new Error("denied")), false, "failed"],
  ] as const)(
    "handles API/fallback copy branch %#",
    async (writeText, fallbackResult, expected) => {
      await expect(
        attemptAttendanceCopy({
          writeText,
          legacyCopy: () => fallbackResult,
          isCurrent: () => true,
        }),
      ).resolves.toBe(expected);
    },
  );

  it("treats fallback exceptions as failure", async () => {
    await expect(
      attemptAttendanceCopy({
        legacyCopy: () => {
          throw new Error("unsupported");
        },
        isCurrent: () => true,
      }),
    ).resolves.toBe("failed");
  });

  it("does not run a fallback for a stale async result", async () => {
    let finishWrite: (() => void) | undefined;
    let current = true;
    let fallbackCalls = 0;
    const pending = attemptAttendanceCopy({
      writeText: () =>
        new Promise<void>((resolve) => {
          finishWrite = resolve;
        }),
      legacyCopy: () => {
        fallbackCalls += 1;
        return true;
      },
      isCurrent: () => current,
    });

    current = false;
    finishWrite?.();
    await expect(pending).resolves.toBe("stale");
    expect(fallbackCalls).toBe(0);
  });
});
