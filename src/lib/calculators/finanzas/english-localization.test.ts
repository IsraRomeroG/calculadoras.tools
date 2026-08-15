import { describe, expect, it } from "vitest";

import * as dca from "./calculadora-dca-costo-promedio/dca.en";
import * as savings from "./calculadora-de-ahorro-para-un-objetivo/savingsGoal.en";
import * as inflation from "./calculadora-de-inflacion-poder-adquisitivo/inflation.en";
import * as compound from "./calculadora-de-interes-compuesto/compoundInterest.en";
import * as simple from "./calculadora-de-interes-simple/simpleInterest.en";
import * as margin from "./calculadora-de-margen-y-markup/marginMarkup.en";
import * as project from "./calculadora-de-precio-de-proyecto-freelance/freelanceProjectPrice.en";
import * as loan from "./calculadora-de-prestamo/loan.en";
import * as breakEven from "./calculadora-de-punto-de-equilibrio/breakEven.en";
import * as roi from "./calculadora-de-roi/roi.en";
import * as rate from "./calculadora-de-tarifa-por-hora-freelance/freelanceRate.en";
import * as debt from "./plan-de-pago-de-deudas/debtPayoff.en";

describe("English finance calculator localization", () => {
  it("loads every localized calculator module", () => {
    const localizedCalculators = [
      dca.calculateDca,
      savings.calculateRequiredMonthlyPlan,
      inflation.calculateInflation,
      compound.calculateCompoundInterest,
      simple.calculateSimpleInterest,
      margin.analyzeSale,
      project.calculateProjectRecommendation,
      loan.calculateMonthlyPayment,
      breakEven.calculateBreakEven,
      roi.calculateSimpleRoi,
      rate.calculateFreelanceRate,
      debt.calculateDebtPlan,
    ];

    expect(localizedCalculators).toHaveLength(12);
    expect(localizedCalculators.every((calculator) => typeof calculator === "function")).toBe(true);
  });

  it("uses English labels and number formatting", () => {
    expect(compound.COMPOUNDING_FREQUENCIES.map(({ label }) => label)).toEqual([
      "Annual",
      "Semiannual",
      "Quarterly",
      "Monthly",
      "Biweekly",
      "Weekly",
      "Daily",
      "Continuous",
    ]);
    expect(loan.LOAN_TYPES[0]?.label).toBe("Bank personal loan");
    expect(loan.formatDuration(13)).toBe("1 year 1 month");
    expect(dca.formatDcaNumber(1234.5, 1)).toBe("1,234.5");
    expect(inflation.formatDuration(18)).toBe("1 year and 6 months");
  });
});
