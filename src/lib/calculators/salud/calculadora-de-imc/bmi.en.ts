import {
  calculateAdultBmiResult as calculateAdultBmiResultBase,
  calculateBmi,
  calculateHealthyWeightRange,
  convertCmToIn,
  convertImperialToMetric,
  convertInToCm,
  convertKgToLb,
  convertLbToKg,
  convertMetricToImperial,
  parseHealthInput,
  roundTo,
  type AdultBmiCategory,
  type MetricValues,
} from "./bmi";

export type * from "./bmi";
export {
  calculateBmi,
  calculateHealthyWeightRange,
  convertCmToIn,
  convertImperialToMetric,
  convertInToCm,
  convertKgToLb,
  convertLbToKg,
  convertMetricToImperial,
  parseHealthInput,
  roundTo,
};

const bmiFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const oneDecimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const heightFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const ADULT_BMI_CATEGORIES: AdultBmiCategory[] = [
  { min: 0, max: 16, key: "severe-thinness", label: "Severe thinness", rangeLabel: "Below 16.0", severity: "high-alert" },
  { min: 16, max: 17, key: "moderate-thinness", label: "Moderate thinness", rangeLabel: "16.0–16.9", severity: "alert" },
  { min: 17, max: 18.5, key: "mild-thinness", label: "Mild thinness", rangeLabel: "17.0–18.4", severity: "caution" },
  { min: 18.5, max: 25, key: "healthy", label: "Healthy range", rangeLabel: "18.5–24.9", severity: "normal" },
  { min: 25, max: 30, key: "overweight", label: "Overweight", rangeLabel: "25.0–29.9", severity: "caution" },
  { min: 30, max: 35, key: "obesity-class-1", label: "Class 1 obesity", rangeLabel: "30.0–34.9", severity: "alert" },
  { min: 35, max: 40, key: "obesity-class-2", label: "Class 2 obesity", rangeLabel: "35.0–39.9", severity: "high-alert" },
  { min: 40, max: Number.POSITIVE_INFINITY, key: "obesity-class-3", label: "Class 3 obesity", rangeLabel: "40.0 or above", severity: "high-alert" },
];

export function classifyAdultBmi(bmi: number): AdultBmiCategory {
  return ADULT_BMI_CATEGORIES.find(
    (category) => bmi >= category.min && bmi < category.max,
  ) ?? ADULT_BMI_CATEGORIES[ADULT_BMI_CATEGORIES.length - 1];
}

export function calculateAdultBmiResult(input: MetricValues) {
  const result = calculateAdultBmiResultBase(input);

  return { ...result, category: classifyAdultBmi(result.bmi) };
}

export function formatBmi(value: number): string {
  return bmiFormatter.format(roundTo(value, 2));
}

export function formatWeight(value: number, unit: "kg" | "lb"): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function formatHeight(value: number, unit: "cm" | "imperial"): string {
  if (unit === "cm") {
    return `${heightFormatter.format(roundTo(value, 1))} cm`;
  }

  const feet = Math.floor(value / 12);
  const inches = roundTo(value - feet * 12, 1);

  return `${feet} ft ${heightFormatter.format(inches)} in`;
}

export function buildBmiCopyText({
  weight,
  height,
  bmi,
  category,
  healthyRange,
}: {
  weight: string;
  height: string;
  bmi: number;
  category: string;
  healthyRange: string;
}): string {
  return [
    "BMI Calculator - calculadoras.tools",
    `Weight: ${weight}`,
    `Height: ${height}`,
    `BMI: ${formatBmi(bmi)}`,
    `Category: ${category}`,
    `Healthy reference range: ${healthyRange}`,
  ].join("\n");
}
