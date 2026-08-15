import {
  type DietPreset,
  type DietPresetOption,
  type MacroGoal,
  type MacroGoalOption,
  type MacroResult,
  roundTo,
} from "./macros";

export type * from "./macros";
export {
  CALORIE_RANGE,
  CARB_LIMIT_RANGE,
  FAT_PERCENT_RANGE,
  GOAL_DEFAULTS,
  KCAL_PER_GRAM,
  PERCENTAGE_TOLERANCE,
  PROTEIN_G_PER_KG_RANGE,
  WEIGHT_KG_RANGE,
  WEIGHT_LB_RANGE,
  calculateKetoMacros,
  calculateMealDistribution,
  calculatePercentageMacros,
  calculateProteinFirstMacros,
  convertKgToLb,
  convertLbToKg,
  getDietPresetDefaults,
  getGoalDefaults,
  parseHealthInput,
  roundTo,
  validateMeals,
  validatePercentageInput,
  validateProteinFirstInput,
} from "./macros";

export const MACRO_GOAL_OPTIONS: MacroGoalOption[] = [
  { key: "lose-fat", label: "Lose fat", description: "Higher protein and moderate fat as a starting point." },
  { key: "maintain", label: "Maintain weight", description: "A balanced distribution for maintenance." },
  { key: "gain-muscle", label: "Build muscle", description: "Adequate protein with more room for carbohydrates." },
  { key: "performance", label: "Athletic performance", description: "Higher carbohydrates to support training." },
  { key: "recomposition", label: "Body recomposition", description: "Higher protein with controlled calories." },
];

export const DIET_PRESET_OPTIONS: DietPresetOption[] = [
  { key: "balanced", label: "Standard / balanced", description: "A flexible general starting point." },
  { key: "high-protein", label: "High protein", description: "Raises protein and slightly reduces fat." },
  { key: "keto", label: "Keto / ketogenic", description: "Sets carbohydrates in grams and assigns remaining calories to fat.", isRestrictive: true },
  { key: "low-carb", label: "Low carb", description: "Reduces carbohydrates without modeling ketosis.", isRestrictive: true },
  { key: "vegetarian", label: "Vegetarian", description: "Keeps a flexible distribution with additional attention to protein." },
  { key: "vegan", label: "Vegan", description: "Slightly raises protein and emphasizes varied plant sources." },
  { key: "mediterranean", label: "Mediterranean", description: "Slightly higher fat within a flexible dietary pattern." },
  { key: "paleo", label: "Paleo", description: "Higher protein and fat while restricting some food groups.", isRestrictive: true },
  { key: "intermittent-fasting", label: "Intermittent fasting", description: "Does not change macros; only meal timing." },
];

export function getGoalOption(goal: MacroGoal): MacroGoalOption {
  return MACRO_GOAL_OPTIONS.find((option) => option.key === goal) ?? MACRO_GOAL_OPTIONS[1];
}

export function getDietPresetOption(preset: DietPreset): DietPresetOption {
  return DIET_PRESET_OPTIONS.find((option) => option.key === preset) ?? DIET_PRESET_OPTIONS[0];
}

const calorieFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const gramFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatCalories(value: number): string { return `${calorieFormatter.format(roundTo(value, 0))} kcal`; }
export function formatDailyCalories(value: number): string { return `${calorieFormatter.format(roundTo(value, 0))} kcal/day`; }
export function formatGrams(value: number): string { return `${gramFormatter.format(roundTo(value, 0))} g`; }
export function formatMealGrams(value: number): string { return `${oneDecimalFormatter.format(roundTo(value, 1))} g`; }
export function formatPercent(value: number): string { return `${oneDecimalFormatter.format(roundTo(value, 1))}%`; }
export function formatWeight(value: number, unit: "kg" | "lb"): string { return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`; }

export function buildMacroCopyText({ inputLabel, result, meals }: { inputLabel: string[]; result: MacroResult; meals: number }): string {
  return [
    "Macro Calculator - calculadoras.tools",
    ...inputLabel,
    `Protein: ${formatGrams(result.protein.grams)}/day (${formatCalories(result.protein.calories)}, ${formatPercent(result.protein.percent)})`,
    `Carbohydrates: ${formatGrams(result.carbs.grams)}/day (${formatCalories(result.carbs.calories)}, ${formatPercent(result.carbs.percent)})`,
    `Fat: ${formatGrams(result.fat.grams)}/day (${formatCalories(result.fat.calories)}, ${formatPercent(result.fat.percent)})`,
    `Meals: ${meals}`,
  ].join("\n");
}
