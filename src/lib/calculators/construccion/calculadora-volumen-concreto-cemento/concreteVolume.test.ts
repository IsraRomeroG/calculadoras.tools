import { describe, expect, it } from "vitest";
import {
  buildConcreteCsv,
  buildConcreteShareText,
  calculateConcreteSectionVolume,
  calculateConcreteVolume,
  convertLengthToMeters,
  parseConcreteNumberInput,
} from "./concreteVolume";

describe("concrete volume formulas", () => {
  it("calculates a slab captured in meters", () => {
    const result = calculateConcreteSectionVolume({
      name: "Losa",
      preset: "slab",
      shape: "rectangular-prism",
      quantity: 1,
      first: { value: 5, unit: "m" },
      second: { value: 4, unit: "m" },
      third: { value: 0.1, unit: "m" },
    });

    expect(result.volume).toBe(2);
  });

  it("calculates a slab with thickness captured in centimeters", () => {
    const result = calculateConcreteVolume({
      mode: "ready-mix",
      wastePercentage: 10,
      sections: [
        {
          name: "Losa cochera",
          preset: "slab",
          shape: "rectangular-prism",
          quantity: 1,
          first: { value: 5, unit: "m" },
          second: { value: 4, unit: "m" },
          third: { value: 10, unit: "cm" },
        },
      ],
    });

    expect(result.netVolume).toBe(2);
    expect(result.totalVolume).toBeCloseTo(2.2);
    expect(result.volumeFt3).toBeCloseTo(77.69226674);
    expect(result.volumeYd3).toBeCloseTo(2.877491364);
  });

  it("uses diameter divided by two for cylinders", () => {
    const result = calculateConcreteSectionVolume({
      name: "Columna circular",
      preset: "circular-column",
      shape: "cylinder",
      quantity: 2,
      first: { value: 40, unit: "cm" },
      second: { value: 3, unit: "m" },
      third: { value: 99, unit: "m" },
    });

    expect(result.volume).toBeCloseTo(Math.PI * 0.2 ** 2 * 3 * 2);
    expect(result.thirdMeters).toBeUndefined();
  });

  it("rounds bags up and calculates surplus", () => {
    const result = calculateConcreteVolume({
      mode: "bags",
      wastePercentage: 10,
      bagYield: 0.021,
      sections: [
        {
          name: "Losa",
          preset: "slab",
          shape: "rectangular-prism",
          quantity: 1,
          first: { value: 5, unit: "m" },
          second: { value: 4, unit: "m" },
          third: { value: 10, unit: "cm" },
        },
      ],
    });

    expect(result.bagCount).toBe(105);
    expect(result.boughtVolumeFromBags).toBeCloseTo(2.205);
    expect(result.bagSurplus).toBeCloseTo(0.005);
  });

  it("calculates ready-mix and bag costs", () => {
    const result = calculateConcreteVolume({
      mode: "bags",
      wastePercentage: 10,
      bagYield: 0.021,
      pricePerM3: 2500,
      pricePerBag: 130,
      sections: [
        {
          name: "Losa",
          preset: "slab",
          shape: "rectangular-prism",
          quantity: 1,
          first: { value: 5, unit: "m" },
          second: { value: 4, unit: "m" },
          third: { value: 10, unit: "cm" },
        },
      ],
    });

    expect(result.concreteCost).toBeCloseTo(5500);
    expect(result.bagCost).toBe(13650);
  });

  it("converts supported length units to meters", () => {
    expect(convertLengthToMeters(100, "cm")).toBe(1);
    expect(convertLengthToMeters(1, "ft")).toBe(0.3048);
    expect(convertLengthToMeters(12, "in")).toBeCloseTo(0.3048);
  });

  it("adds warnings for unusual values", () => {
    const result = calculateConcreteVolume({
      mode: "bags",
      wastePercentage: 35,
      bagYield: 0.25,
      sections: [
        {
          name: "Losa delgada",
          preset: "slab",
          shape: "rectangular-prism",
          quantity: 1,
          first: { value: 5, unit: "m" },
          second: { value: 4, unit: "m" },
          third: { value: 3, unit: "cm" },
        },
      ],
    });

    expect(result.warnings.join(" ")).toContain("desperdicio");
    expect(result.warnings.join(" ")).toContain("espesor");
    expect(result.warnings.join(" ")).toContain("rendimiento");
  });

  it("rejects invalid prism, quantity and waste values", () => {
    expect(() =>
      calculateConcreteSectionVolume({
        name: "Viga",
        preset: "beam",
        shape: "rectangular-prism",
        quantity: 1,
        first: { value: 3, unit: "m" },
        second: { value: 20, unit: "cm" },
      }),
    ).toThrow("tercera dimensión");

    expect(() =>
      calculateConcreteVolume({
        mode: "ready-mix",
        wastePercentage: 101,
        sections: [
          {
            name: "Losa",
            preset: "slab",
            shape: "rectangular-prism",
            quantity: 1,
            first: { value: 5, unit: "m" },
            second: { value: 4, unit: "m" },
            third: { value: 10, unit: "cm" },
          },
        ],
      }),
    ).toThrow("desperdicio");
  });
});

describe("concrete parsing and exports", () => {
  it("accepts comma and point decimal values", () => {
    expect(parseConcreteNumberInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseConcreteNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("rejects invalid numeric values", () => {
    expect(parseConcreteNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseConcreteNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseConcreteNumberInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds copyable text and CSV", () => {
    const input = {
      mode: "ready-mix" as const,
      wastePercentage: 10,
      pricePerM3: 2500,
      sections: [
        {
          name: "Losa",
          preset: "slab" as const,
          shape: "rectangular-prism" as const,
          quantity: 1,
          first: { value: 5, unit: "m" as const },
          second: { value: 4, unit: "m" as const },
          third: { value: 10, unit: "cm" as const },
        },
      ],
    };
    const result = calculateConcreteVolume(input);

    expect(buildConcreteShareText(result, input)).toContain(
      "Pedido sugerido: 2.20 m³",
    );
    expect(buildConcreteCsv(result)).toContain("TOTAL_CON_DESPERDICIO");
  });
});
