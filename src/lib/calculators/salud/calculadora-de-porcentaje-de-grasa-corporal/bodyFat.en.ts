import { type BodyFatFormula, type BodyFatInput, type BodyFatResult, type BodyFatUnit } from "./bodyFat";
import { roundTo } from "../calculadora-de-imc/bmi";

export type * from "./bodyFat";
export { BODY_FAT_LIMITS, SENSITIVITY_DELTA_CM, BodyFatCalculationError, calculateBodyFatPercentage, calculateBodyFatResult, calculateBodyFatSensitivity, convertCmToIn, convertInToCm, convertKgToLb, convertLbToKg, validateBodyFatInput } from "./bodyFat";

const percentageFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const measurementFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatBodyFatPercentage(value: number): string { return `${percentageFormatter.format(roundTo(value, 1))}%`; }
export function formatBodyFatMass(value: number, unit: "kg" | "lb"): string { return `${measurementFormatter.format(roundTo(value, 1))} ${unit}`; }
export function getBodyFatFormulaLabel(formula: BodyFatFormula): string { return formula === "male" ? "Male formula" : "Female formula"; }

export function formatBodyFatMeasurementSummary(input: BodyFatInput, unit: BodyFatUnit): string {
  const factor = unit === "metric" ? 1 : 1 / 2.54;
  const suffix = unit === "metric" ? "cm" : "in";
  const parts = [
    `Height ${measurementFormatter.format(input.heightCm * factor)} ${suffix}`,
    `neck ${measurementFormatter.format(input.neckCm * factor)} ${suffix}`,
    `waist ${measurementFormatter.format(input.waistCm * factor)} ${suffix}`,
  ];
  if (input.formula === "female" && input.hipCm) parts.push(`hips ${measurementFormatter.format(input.hipCm * factor)} ${suffix}`);
  return parts.join(", ");
}

export function buildBodyFatCopyText(result: BodyFatResult, unit: BodyFatUnit): string {
  const lines = [
    "Body Fat Percentage Calculator - calculadoras.tools",
    `Formula: ${getBodyFatFormulaLabel(result.input.formula)}`,
    `Estimated body fat: ${formatBodyFatPercentage(result.percentage)}`,
  ];
  if (result.composition) {
    const massUnit = unit === "metric" ? "kg" : "lb";
    const factor = unit === "metric" ? 1 : 1 / 0.45359237;
    lines.push(`Estimated fat mass: ${formatBodyFatMass(result.composition.fatMassKg * factor, massUnit)}`, `Estimated fat-free mass: ${formatBodyFatMass(result.composition.fatFreeMassKg * factor, massUnit)}`);
  }
  lines.push(`Measurements: ${formatBodyFatMeasurementSummary(result.input, unit)}`, "Circumference-based estimate for educational use; not a clinical body-composition measurement.");
  return lines.join("\n");
}
