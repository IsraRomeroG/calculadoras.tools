import { describe, expect, it } from "vitest";
import {
  buildCopyText,
  calculateClosingCosts,
  formatCurrency,
  parseLocalizedNumber,
} from "./closingCosts";

describe("closing costs calculator", () => {
  it("calculates a percent item from the property price", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      items: [
        {
          name: "Impuesto / derecho",
          type: "percent",
          value: 5,
          responsible: "buyer",
        },
      ],
    });

    expect(result.items[0].amount).toBe(150_000);
    expect(result.buyerCosts).toBe(150_000);
    expect(formatCurrency(result.buyerCosts)).toBe("$150,000.00");
  });

  it("adds fixed amounts without applying a percentage", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      items: [
        {
          name: "Avaluo",
          type: "fixed",
          value: 8_000,
          responsible: "buyer",
        },
      ],
    });

    expect(result.items[0].amount).toBe(8_000);
    expect(result.totalCostPercent).toBeCloseTo(0.2666667, 5);
  });

  it("separates buyer and seller items", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      items: [
        {
          name: "Gastos comprador",
          type: "percent",
          value: 5,
          responsible: "buyer",
        },
        {
          name: "Comision de venta",
          type: "percent",
          value: 3,
          responsible: "seller",
        },
      ],
    });

    expect(result.buyerCosts).toBe(150_000);
    expect(result.sellerCosts).toBe(90_000);
    expect(result.sellerNet).toBe(2_910_000);
    expect(result.totalCosts).toBe(240_000);
  });

  it("adds reserve margin to the buyer cash required", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      downPayment: 600_000,
      reservePercent: 10,
      items: [
        {
          name: "Escrituracion estimada",
          type: "percent",
          value: 5,
          responsible: "buyer",
        },
      ],
    });

    expect(result.reserveAmount).toBe(15_000);
    expect(result.additionalCashToDownPayment).toBe(165_000);
    expect(result.buyerCashRequired).toBe(765_000);
  });

  it("allows an empty item list and produces zero costs", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      items: [],
    });

    expect(result.buyerCosts).toBe(0);
    expect(result.sellerCosts).toBe(0);
    expect(result.totalCosts).toBe(0);
    expect(result.warnings[0]).toContain("No hay partidas");
  });

  it("validates invalid prices, negative items and reserve range", () => {
    expect(() =>
      calculateClosingCosts({
        propertyPrice: 0,
      }),
    ).toThrow("precio");

    expect(() =>
      calculateClosingCosts({
        propertyPrice: 3_000_000,
        items: [
          {
            name: "Registro",
            type: "fixed",
            value: -1,
            responsible: "buyer",
          },
        ],
      }),
    ).toThrow("negativo");

    expect(() =>
      calculateClosingCosts({
        propertyPrice: 3_000_000,
        reservePercent: 31,
      }),
    ).toThrow("30");
  });

  it("warns about unusually high percentages and large down payments", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      downPayment: 3_100_000,
      items: [
        {
          name: "Partida alta",
          type: "percent",
          value: 16,
          responsible: "buyer",
        },
      ],
    });

    expect(result.warnings.join(" ")).toContain("enganche supera");
    expect(result.warnings.join(" ")).toContain("Partida alta");
  });

  it("orders impact items by amount without changing totals", () => {
    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      items: [
        {
          name: "Registro",
          type: "fixed",
          value: 8_000,
          responsible: "buyer",
        },
        {
          name: "Impuesto",
          type: "percent",
          value: 5,
          responsible: "buyer",
        },
      ],
    });

    expect(result.impactItems[0].name).toBe("Impuesto");
    expect(result.totalCosts).toBe(158_000);
  });

  it("parses localized money and builds copy-ready summaries", () => {
    expect(parseLocalizedNumber("$3,000,000")).toBe(3_000_000);
    expect(parseLocalizedNumber("3 000 000")).toBe(3_000_000);
    expect(parseLocalizedNumber("5%")).toBe(5);
    expect(parseLocalizedNumber("1.234,56")).toBe(1_234.56);

    const result = calculateClosingCosts({
      propertyPrice: 3_000_000,
      downPayment: 600_000,
      items: [
        {
          name: "Impuesto",
          type: "percent",
          value: 5,
          responsible: "buyer",
        },
      ],
    });

    expect(buildCopyText(result)).toContain("Adicional al enganche");
    expect(buildCopyText(result, "seller")).toContain("Neto estimado");
  });
});
