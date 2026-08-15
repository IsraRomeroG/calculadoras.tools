import { describe, expect, it } from "vitest";
import {
  VAT_COUNTRY_PRESETS,
  calculateVatFromBase,
} from "./calculadora-de-iva/vat.en";
import {
  ISR_CANONICAL_PATH,
  buildIncomeTaxShareText,
  calculateIncomeTax,
} from "./calculadora-isr-irpf/incomeTax.en";
import { calculateNetSalary } from "./calculadora-de-salario-neto/netSalary.en";

describe("English legal and tax calculator localization", () => {
  it("localizes VAT presets without changing the calculation", () => {
    expect(VAT_COUNTRY_PRESETS[0]).toMatchObject({
      country: "Mexico",
      label: "Mexico",
      locale: "en-US",
    });
    expect(VAT_COUNTRY_PRESETS[0].rates[0].label).toBe("Standard");
    expect(calculateVatFromBase(500, 16)).toEqual({
      base: 500,
      tax: 80,
      total: 580,
      rate: 16,
    });
  });

  it("localizes income-tax results and share text", () => {
    const result = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "monthly",
      taxableBase: 20_000,
      comparableRetention: 2_000,
    });

    expect(ISR_CANONICAL_PATH).toBe("/en/legal-tax/mexico-income-tax-calculator");
    expect(result.frequency.label).toBe("Monthly");
    expect(result.balanceLabel).toBe("amount due");
    expect(result.warnings.join(" ")).toContain("The calculation uses");
    expect(buildIncomeTaxShareText(result)).toContain("Estimated income tax");
  });

  it("localizes net-salary breakdowns and warnings", () => {
    const result = calculateNetSalary({
      gross: 20_000,
      salaryBasis: "monthly",
      frequency: "monthly",
    });

    expect(result.frequency.label).toBe("Monthly");
    expect(result.breakdown[0].label).toBe("Cash income");
    expect(result.warnings.join(" ")).toContain(
      "does not automatically calculate IMSS",
    );
  });
});
