import { describe, expect, it } from "vitest";
import {
  MeetingCostValidationError,
  buildMeetingCsv,
  buildMeetingSummary,
  calculateMeetingCost,
  formatMeetingCurrency,
  formatMeetingDuration,
  parseMeetingNumber,
  type MeetingCostInput,
} from "./meetingCost";

const baseInput: MeetingCostInput = {
  durationMinutes: 60,
  roles: [
    {
      name: "Participante",
      people: 5,
      hourlyRate: 500,
    },
  ],
  frequency: "once",
};

describe("meeting cost calculation", () => {
  it("calculates the main example", () => {
    const result = calculateMeetingCost(baseInput);

    expect(result).toMatchObject({
      totalDurationMinutes: 60,
      totalPeople: 5,
      totalCost: 2500,
      costPerMinute: 2500 / 60,
      personHours: 5,
      isZeroCost: false,
    });
    expect(result.roles[0]).toMatchObject({
      cost: 2500,
      personHours: 5,
      costPerPerson: 500,
    });
  });

  it("halves the cost for a 30 minute meeting", () => {
    const result = calculateMeetingCost({
      ...baseInput,
      durationMinutes: 30,
    });

    expect(result.totalCost).toBe(1250);
    expect(result.personHours).toBe(2.5);
  });

  it("sums several roles correctly", () => {
    const result = calculateMeetingCost({
      durationMinutes: 90,
      roles: [
        { name: "Direccion", people: 2, hourlyRate: 800 },
        { name: "Equipo", people: 4, hourlyRate: 300 },
      ],
      frequency: "once",
    });

    expect(result.totalPeople).toBe(6);
    expect(result.personHours).toBe(9);
    expect(result.totalCost).toBe(4200);
  });

  it("supports zero cost roles and prioritizes person-hours", () => {
    const result = calculateMeetingCost({
      durationMinutes: 45,
      roles: [{ name: "Voluntarios", people: 3, hourlyRate: 0 }],
      frequency: "once",
    });

    expect(result.totalCost).toBe(0);
    expect(result.costPerMinute).toBe(0);
    expect(result.personHours).toBe(2.25);
    expect(result.isZeroCost).toBe(true);
    expect(result.insights.map((insight) => insight.code)).toContain(
      "zero_money_cost",
    );
  });

  it("adds preparation and follow-up to the calculated duration", () => {
    const result = calculateMeetingCost({
      ...baseInput,
      durationMinutes: 30,
      preparationMinutes: 15,
      followUpMinutes: 15,
    });

    expect(result.totalDurationMinutes).toBe(60);
    expect(result.totalCost).toBe(2500);
  });
});

describe("recurrence and insights", () => {
  it("annualizes a weekly meeting", () => {
    const result = calculateMeetingCost({
      ...baseInput,
      frequency: "weekly",
      occurrencesPerWeek: 1,
    });

    expect(result.recurrence.weeklyCost).toBe(2500);
    expect(result.recurrence.monthlyCost).toBeCloseTo((2500 * 52) / 12);
    expect(result.recurrence.annualCost).toBe(2500 * 52);
  });

  it("multiplies monthly occurrences", () => {
    const result = calculateMeetingCost({
      ...baseInput,
      frequency: "monthly",
      occurrencesPerMonth: 2,
    });

    expect(result.recurrence.monthlyCost).toBe(5000);
    expect(result.recurrence.annualCost).toBe(60000);
  });

  it("annualizes a biweekly meeting", () => {
    const result = calculateMeetingCost({
      ...baseInput,
      frequency: "biweekly",
    });

    expect(result.recurrence.monthlyCost).toBeCloseTo((2500 * 26) / 12);
    expect(result.recurrence.annualCost).toBe(2500 * 26);
  });

  it("calculates savings for minutes, headcount, and recurrence", () => {
    const result = calculateMeetingCost({
      durationMinutes: 60,
      roles: [
        { name: "Direccion", people: 1, hourlyRate: 900 },
        { name: "Equipo", people: 6, hourlyRate: 250 },
      ],
      frequency: "weekly",
      occurrencesPerWeek: 2,
    });
    const reduceMinutes = result.insights.find(
      (insight) => insight.code === "reduce_15_min",
    );
    const removePerson = result.insights.find(
      (insight) => insight.code === "remove_person",
    );
    const reduceRepetition = result.insights.find(
      (insight) => insight.code === "reduce_repetition",
    );

    expect(reduceMinutes?.amount).toBe(600);
    expect(removePerson).toMatchObject({
      roleName: "Direccion",
      amount: 900,
    });
    expect(reduceRepetition?.amount).toBe(2400);
  });

  it("caps the 15 minute savings when the meeting is shorter", () => {
    const result = calculateMeetingCost({
      durationMinutes: 10,
      roles: [{ name: "Equipo", people: 1, hourlyRate: 600 }],
      frequency: "once",
    });

    expect(result.insights.find((insight) => insight.code === "reduce_15_min"))
      .toMatchObject({
        minutes: 10,
        amount: 100,
      });
  });
});

describe("formatting, parsing, and exports", () => {
  it("parses numeric text inputs", () => {
    expect(parseMeetingNumber("$1,250.50")).toEqual({
      ok: true,
      value: 1250.5,
      normalized: "1250.50",
    });
    expect(parseMeetingNumber("1.250,50")).toEqual({
      ok: true,
      value: 1250.5,
      normalized: "1250.50",
    });
    expect(parseMeetingNumber("2.5", { integer: true })).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
    expect(parseMeetingNumber("-1")).toEqual({
      ok: false,
      error: "negative",
    });
  });

  it("formats money and duration", () => {
    expect(formatMeetingCurrency(2500)).toBe("$2,500.00");
    expect(formatMeetingDuration(75)).toBe("1 h 15 min");
    expect(formatMeetingDuration(45)).toBe("45 min");
  });

  it("builds a copy summary with annual impact when recurring", () => {
    const summary = buildMeetingSummary(
      calculateMeetingCost({
        ...baseInput,
        frequency: "weekly",
        occurrencesPerWeek: 1,
      }),
    );

    expect(summary).toContain("Reunion de 60 min con 5 personas");
    expect(summary).toContain("Costo estimado: $2,500.00");
    expect(summary).toContain("Impacto anual estimado: $130,000.00");
  });

  it("builds a CSV export with roles", () => {
    const csv = buildMeetingCsv(calculateMeetingCost(baseInput));

    expect(csv).toContain("Tipo,Concepto,Personas");
    expect(csv).toContain('Rol,Participante,5,500.00,5.00,"2,500.00"');
  });
});

describe("validation", () => {
  it("rejects invalid duration and missing roles", () => {
    expect(() =>
      calculateMeetingCost({ ...baseInput, durationMinutes: 0 }),
    ).toThrow(MeetingCostValidationError);
    expect(() => calculateMeetingCost({ ...baseInput, roles: [] })).toThrow(
      /al menos un rol/i,
    );
  });

  it("rejects invalid role and recurrence values", () => {
    expect(() =>
      calculateMeetingCost({
        ...baseInput,
        roles: [{ name: "", people: 1, hourlyRate: 100 }],
      }),
    ).toThrow(/nombre del rol/i);
    expect(() =>
      calculateMeetingCost({
        ...baseInput,
        frequency: "weekly",
        occurrencesPerWeek: 8,
      }),
    ).toThrow(/veces por semana/i);
    expect(() =>
      calculateMeetingCost({
        ...baseInput,
        frequency: "monthly",
        occurrencesPerMonth: 32,
      }),
    ).toThrow(/veces por mes/i);
  });
});
