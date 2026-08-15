import {
  calculateDailyWaterResult as calculateDailyWaterResultBase,
  type DailyWaterInput,
  type DailyWaterRange,
  type DailyWaterResult,
  type DailyWaterUnit,
  type SweatLevel,
  roundTo,
} from "./dailyWater";

export type * from "./dailyWater";
export { DAILY_WATER_LIMITS, SWEAT_RATES_ML_PER_HOUR, DailyWaterCalculationError, convertKgToLb, convertLbToKg, parseHealthInput, roundTo, validateDailyWaterInput } from "./dailyWater";

const labels = { morning: "Morning", midday: "Midday and lunch", afternoon: "Afternoon", evening: "Evening" } as const;
const literFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function calculateDailyWaterResult(input: DailyWaterInput): DailyWaterResult {
  const result = calculateDailyWaterResultBase(input);
  return { ...result, plan: result.plan.map((item) => ({ ...item, label: labels[item.key] })) };
}

export function formatLiters(valueMl: number): string { return `${literFormatter.format(roundTo(valueMl / 1000, 1))} L`; }
export function formatMl(value: number): string { return `${integerFormatter.format(Math.round(value / 50) * 50)} ml`; }
export function formatDailyWaterRange(range: DailyWaterRange): string { return `${formatLiters(range.lowMl)} to ${formatLiters(range.highMl)}`; }
export function formatDailyWaterMlRange(range: DailyWaterRange): string { return `${formatMl(range.lowMl)} to ${formatMl(range.highMl)}`; }
export function formatContainerRange(range: DailyWaterResult["containerRange"]): string { return `${oneDecimalFormatter.format(roundTo(range.low, 1))} to ${oneDecimalFormatter.format(roundTo(range.high, 1))}`; }
export function formatWeight(weightKg: number, unit: DailyWaterUnit): string {
  const value = unit === "metric" ? weightKg : weightKg / 0.45359237;
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit === "metric" ? "kg" : "lb"}`;
}
export function getSweatLevelLabel(level: SweatLevel): string { return { low: "Low", moderate: "Moderate", high: "High" }[level]; }

export function buildDailyWaterCopyText(result: DailyWaterResult, unit: DailyWaterUnit): string {
  const lines = [
    "Daily Water Intake Calculator - calculadoras.tools",
    `Weight: ${formatWeight(result.input.weightKg, unit)}`,
    `Suggested fluid range: ${formatDailyWaterRange(result.total)} (${formatDailyWaterMlRange(result.total)})`,
    `Approximate equivalent: ${formatContainerRange(result.containerRange)} containers of ${formatMl(result.input.containerMl)}`,
    `Estimated baseline: ${formatDailyWaterRange(result.base)}`,
  ];
  if (result.input.exerciseToday) lines.push(`Exercise adjustment: ${formatDailyWaterRange(result.exerciseAdjustment)} for ${result.input.exerciseMinutes} min with ${getSweatLevelLabel(result.input.sweatLevel as SweatLevel).toLowerCase()} sweating`);
  if (result.input.heatExposure) lines.push(`Heat adjustment: ${formatDailyWaterRange(result.heatAdjustment)}`);
  lines.push("Educational guidance, not an exact requirement or medical prescription.", "Other beverages and food also provide water; you do not need to force the upper end of the range.");
  return lines.join("\n");
}
