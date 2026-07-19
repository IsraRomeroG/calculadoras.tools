import { describe, expect, it } from "vitest";
import {
  buildVehicleAnnualCostsCsv,
  buildVehicleAnnualCostsShareText,
  calculateVehicleAnnualCosts,
  parseVehicleAnnualCostNumberInput,
} from "./vehicleAnnualCosts";

describe("vehicle annual costs formulas", () => {
  it("multiplies monthly expenses by 12", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 12000,
      items: [
        {
          id: "parking",
          name: "Estacionamiento",
          category: "estacionamiento_peajes",
          amount: 1000,
          frequency: "mensual",
        },
      ],
    });

    expect(result.totalAnnualAverage).toBe(12000);
    expect(result.practicalAnnualReserve).toBe(12000);
    expect(result.averageMonthlyCost).toBe(1000);
  });

  it("uses one theoretical and practical event for annual expenses", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 12000,
      items: [
        {
          id: "insurance",
          name: "Seguro",
          category: "seguro",
          amount: 9000,
          frequency: "anual",
          interval: 99,
        },
      ],
    });

    expect(result.items[0].eventsTheoretical).toBe(1);
    expect(result.items[0].eventsPractical).toBe(1);
    expect(result.items[0].interval).toBeUndefined();
  });

  it("calculates theoretical and practical events for kilometer intervals", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 15000,
      items: [
        {
          id: "service",
          name: "Servicio",
          category: "servicio",
          amount: 3000,
          frequency: "cada_n_km",
          interval: 10000,
        },
      ],
    });

    expect(result.items[0].eventsTheoretical).toBe(1.5);
    expect(result.items[0].eventsPractical).toBe(2);
    expect(result.totalAnnualAverage).toBe(4500);
    expect(result.practicalAnnualReserve).toBe(6000);
    expect(result.hasPracticalDifference).toBe(true);
  });

  it("returns null cost per km when annual kilometers are zero", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 0,
      items: [
        {
          id: "insurance",
          name: "Seguro",
          category: "seguro",
          amount: 9000,
          frequency: "anual",
        },
      ],
    });

    expect(result.averageCostPerKm).toBeNull();
    expect(result.practicalCostPerKm).toBeNull();
  });

  it("rejects kilometer interval expenses when annual kilometers are zero", () => {
    expect(() =>
      calculateVehicleAnnualCosts({
        annualKilometers: 0,
        items: [
          {
            id: "service",
            name: "Servicio",
            category: "servicio",
            amount: 3000,
            frequency: "cada_n_km",
            interval: 10000,
          },
        ],
      }),
    ).toThrow("kilometros anuales");
  });

  it("sums breakdowns by group and category", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 10000,
      items: [
        {
          id: "service",
          name: "Servicio",
          category: "servicio",
          amount: 3000,
          frequency: "anual",
        },
        {
          id: "insurance",
          name: "Seguro",
          category: "seguro",
          amount: 9000,
          frequency: "anual",
        },
      ],
    });

    expect(result.groupBreakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "mantenimiento",
          subtotalAverage: 3000,
          percentageOfAverageTotal: 25,
        }),
        expect.objectContaining({
          id: "propiedad",
          subtotalAverage: 9000,
          percentageOfAverageTotal: 75,
        }),
      ]),
    );
    expect(result.categoryBreakdown[0]).toMatchObject({
      id: "seguro",
      subtotalAverage: 9000,
    });
  });

  it("sorts top items by average annual cost", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 10000,
      items: [
        {
          id: "wash",
          name: "Lavado",
          category: "lavado_accesorios",
          amount: 300,
          frequency: "mensual",
        },
        {
          id: "insurance",
          name: "Seguro",
          category: "seguro",
          amount: 9000,
          frequency: "anual",
        },
        {
          id: "service",
          name: "Servicio",
          category: "servicio",
          amount: 3000,
          frequency: "anual",
        },
        {
          id: "verification",
          name: "Verificacion",
          category: "impuestos_verificacion",
          amount: 700,
          frequency: "cada_n_meses",
          interval: 6,
        },
      ],
    });

    expect(result.topItems.map((item) => item.name)).toEqual([
      "Seguro",
      "Lavado",
      "Servicio",
    ]);
  });

  it("rejects zero intervals for interval frequencies", () => {
    expect(() =>
      calculateVehicleAnnualCosts({
        annualKilometers: 10000,
        items: [
          {
            id: "tires",
            name: "Llantas",
            category: "llantas",
            amount: 12000,
            frequency: "cada_n_meses",
            interval: 0,
          },
        ],
      }),
    ).toThrow("intervalo");
  });

  it("marks missing amounts as incomplete while counting them as zero", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 10000,
      items: [
        {
          id: "service",
          name: "",
          category: "servicio",
          amount: 0,
          amountMissing: true,
          frequency: "anual",
        },
      ],
    });

    expect(result.items[0].name).toBe("Gasto 1");
    expect(result.items[0].incomplete).toBe(true);
    expect(result.incompleteItems).toHaveLength(1);
    expect(result.isEmptyEstimate).toBe(true);
  });

  it("keeps percentages null when the total is zero", () => {
    const result = calculateVehicleAnnualCosts({
      annualKilometers: 10000,
      items: [
        {
          id: "service",
          name: "Servicio",
          category: "servicio",
          amount: 0,
          frequency: "anual",
        },
      ],
    });

    expect(result.groupBreakdown).toHaveLength(0);
    expect(result.categoryBreakdown).toHaveLength(0);
  });
});

describe("vehicle annual costs parsing and output", () => {
  it("accepts Mexico-style money inputs", () => {
    expect(parseVehicleAnnualCostNumberInput("$3,000")).toEqual({
      ok: true,
      value: 3000,
      normalized: "3000",
    });
    expect(parseVehicleAnnualCostNumberInput("3,000.50")).toEqual({
      ok: true,
      value: 3000.5,
      normalized: "3000.50",
    });
    expect(parseVehicleAnnualCostNumberInput("3000.50")).toEqual({
      ok: true,
      value: 3000.5,
      normalized: "3000.50",
    });
  });

  it("rejects invalid money inputs", () => {
    expect(parseVehicleAnnualCostNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseVehicleAnnualCostNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseVehicleAnnualCostNumberInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds copyable text and CSV without currency symbols in numeric CSV cells", () => {
    const result = calculateVehicleAnnualCosts({
      vehicleName: "Auto familiar",
      annualKilometers: 15000,
      items: [
        {
          id: "service",
          name: "Servicio",
          category: "servicio",
          amount: 3000,
          frequency: "cada_n_km",
          interval: 10000,
        },
      ],
    });
    const text = buildVehicleAnnualCostsShareText(result);
    const csv = buildVehicleAnnualCostsCsv(result);

    expect(text).toContain("Reserva mensual sugerida: $500.00");
    expect(csv).toContain("nombre,categoria,grupo,costo_evento");
    expect(csv).toContain("Servicio,Servicio,Mantenimiento,3000");
    expect(csv).toContain("reserva_anual_practica,6000");
  });
});
