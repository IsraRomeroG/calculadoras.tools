import {
  convertKgToLb,
  type DailyProteinResult,
  type ProteinActivity,
  type ProteinGoal,
  type ProteinRange,
  type ProteinUnit,
} from "./dailyProtein";

export * from "./dailyProtein";

export const PROTEIN_GOAL_LABELS: Record<ProteinGoal, string> = {
  maintain: "Maintain health and weight",
  "lose-fat": "Lose fat",
  "gain-muscle": "Gain muscle",
};

export const PROTEIN_ACTIVITY_LABELS: Record<ProteinActivity, string> = {
  unstructured: "No structured training",
  regular: "Regular activity or training",
  strength: "Regular strength training",
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
const oneDecimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatProteinRange(range: ProteinRange): string {
  return `${numberFormatter.format(range.min)}-${numberFormatter.format(range.max)} g`;
}

export function formatProteinPerKg(range: ProteinRange): string {
  return `${oneDecimalFormatter.format(range.min)}-${oneDecimalFormatter.format(range.max)} g/kg`;
}

export function formatProteinWeight(weightKg: number, unit: ProteinUnit): string {
  const value = unit === "metric" ? weightKg : convertKgToLb(weightKg);
  return `${oneDecimalFormatter.format(Math.round(value * 10) / 10)} ${unit === "metric" ? "kg" : "lb"}`;
}

export function buildDailyProteinCopyText(
  result: DailyProteinResult,
  unit: ProteinUnit,
): string {
  const lines = [
    "Daily protein calculator - calculadoras.tools",
    `Weight: ${formatProteinWeight(result.input.weightKg, unit)}`,
    `Goal: ${PROTEIN_GOAL_LABELS[result.input.goal]}`,
    `Activity: ${PROTEIN_ACTIVITY_LABELS[result.input.activity]}`,
    `Educational range: ${formatProteinRange(result.displayedDailyGrams)}/day`,
    `Reference used: ${formatProteinPerKg(result.gramsPerKg)}`,
  ];

  if (result.requiresIndividualGuidance) {
    lines.push("This range is educational information. Prioritize individualized professional guidance.");
  } else {
    lines.push(
      `Practical starting point: ${numberFormatter.format(result.displayedPracticalGrams)} g/day`,
      `Across ${result.input.meals} ${result.input.meals === 1 ? "meal" : "meals"}: about ${numberFormatter.format(result.displayedGramsPerMeal)} g per meal`,
    );
  }

  lines.push("Educational reference only; it is not a prescription or a guarantee of results.");
  return lines.join("\n");
}
