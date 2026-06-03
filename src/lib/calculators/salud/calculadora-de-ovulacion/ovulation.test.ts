import { describe, expect, it } from "vitest";
import {
  buildOvulationCopyText,
  calculateFromCycleHistory,
  calculateFromCycleRange,
  calculateFromDetectedOvulation,
  calculateStandardCycle,
  formatOvulationDateRange,
  getCycleDay,
  parseIsoDate,
} from "./ovulation";

describe("ovulation calculations", () => {
  const lmpDate = { year: 2026, month: 4, day: 1 };
  const today = { year: 2026, month: 4, day: 25 };

  it("calculates standard fertile window and inclusive cycle day", () => {
    const result = calculateStandardCycle({
      lmpDate,
      cycleLength: 28,
      periodLength: 5,
      lutealPhase: 14,
      today,
    });

    expect(result.nextPeriodDate).toEqual({ year: 2026, month: 4, day: 29 });
    expect(result.ovulationStart).toEqual({ year: 2026, month: 4, day: 15 });
    expect(result.ovulationEnd).toEqual({ year: 2026, month: 4, day: 15 });
    expect(result.fertileStart).toEqual({ year: 2026, month: 4, day: 10 });
    expect(result.fertileEnd).toEqual({ year: 2026, month: 4, day: 15 });
    expect(result.observationEnd).toEqual({ year: 2026, month: 4, day: 16 });
    expect(getCycleDay(lmpDate, result.ovulationStart)).toBe(15);
    expect(result.todayStatus).toMatchObject({
      kind: "luteal",
      cycleDay: 25,
      phase: "Fase lútea",
    });
    expect(result.confidence).toBe("Media");
  });

  it("keeps the day after ovulation as observation margin", () => {
    const result = calculateStandardCycle({
      lmpDate,
      today,
    });

    expect(result.fertilityRows.at(-1)).toMatchObject({
      date: { year: 2026, month: 4, day: 16 },
      relation: "O + 1",
      level: "Margen bajo",
      isObservationMargin: true,
    });
  });

  it("handles short cycles where the fertile window starts near menstruation", () => {
    const result = calculateStandardCycle({
      lmpDate,
      cycleLength: 21,
      today: { year: 2026, month: 4, day: 3 },
    });

    expect(result.ovulationStart).toEqual({ year: 2026, month: 4, day: 8 });
    expect(result.fertileStart).toEqual({ year: 2026, month: 4, day: 3 });
    expect(result.todayStatus.kind).toBe("menstruation");
  });

  it("marks long cycles as lower confidence", () => {
    const result = calculateStandardCycle({
      lmpDate,
      cycleLength: 45,
      today,
    });

    expect(result.ovulationStart).toEqual({ year: 2026, month: 5, day: 2 });
    expect(result.confidence).toBe("Baja");
    expect(result.warnings).toContain(
      "Los ciclos largos pueden hacer menos precisa la predicción.",
    );
  });

  it("calculates irregular windows from historical period starts", () => {
    const result = calculateFromCycleHistory({
      lmpDate,
      previousPeriodStartDates: [
        { year: 2026, month: 1, day: 5 },
        { year: 2026, month: 2, day: 2 },
        { year: 2026, month: 3, day: 3 },
      ],
      today,
    });

    expect(result.cycleRange).toMatchObject({
      shortest: 28,
      longest: 29,
      cycleCount: 3,
      spread: 1,
    });
    expect(result.confidence).toBe("Alta");
    expect(result.ovulationStart).toEqual({ year: 2026, month: 4, day: 15 });
    expect(result.ovulationEnd).toEqual({ year: 2026, month: 4, day: 16 });
  });

  it("calculates irregular windows from shortest and longest cycle", () => {
    const result = calculateFromCycleRange({
      lmpDate,
      shortestCycle: 25,
      longestCycle: 32,
      today,
    });

    expect(result.ovulationStart).toEqual({ year: 2026, month: 4, day: 12 });
    expect(result.ovulationEnd).toEqual({ year: 2026, month: 4, day: 19 });
    expect(result.fertileStart).toEqual({ year: 2026, month: 4, day: 7 });
    expect(result.fertileEnd).toEqual({ year: 2026, month: 4, day: 19 });
    expect(result.observationEnd).toEqual({ year: 2026, month: 4, day: 20 });
    expect(result.confidence).toBe("Media");
  });

  it("treats equal shortest and longest cycles as regular", () => {
    const result = calculateFromCycleRange({
      lmpDate,
      shortestCycle: 30,
      longestCycle: 30,
      today,
    });

    expect(result.mode).toBe("standard");
    expect(result.ovulationStart).toEqual({ year: 2026, month: 4, day: 17 });
  });

  it("uses source confidence for detected ovulation", () => {
    const lh = calculateFromDetectedOvulation({
      ovulationDate: { year: 2026, month: 4, day: 15 },
      source: "lh",
      today,
    });
    const clinical = calculateFromDetectedOvulation({
      ovulationDate: { year: 2026, month: 4, day: 15 },
      source: "clinical",
      today,
    });

    expect(lh.confidence).toBe("Media");
    expect(clinical.confidence).toBe("Alta");
    expect(lh.nextPeriodDate).toEqual({ year: 2026, month: 4, day: 29 });
  });

  it("formats ranges and copy text", () => {
    const result = calculateStandardCycle({ lmpDate, today });

    expect(formatOvulationDateRange(result.fertileStart, result.fertileEnd)).toBe(
      "10 al 15 de abril de 2026",
    );
    expect(buildOvulationCopyText(result)).toContain(
      "Ventana fértil estimada: 10 al 15 de abril de 2026",
    );
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
