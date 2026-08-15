import type {
  EstimateQuality,
  OneRepMaxFormula,
  OneRepMaxResult,
  PlannerSelection,
  WeightUnit,
} from "./oneRepMax";

export * from "./oneRepMax";

export const QUALITY_LABELS: Record<EstimateQuality, string> = {
  lifted: "Actual 1RM lifted",
  better: "Better basis for estimation",
  orientation: "General estimate",
  low: "Lower precision",
};

export const FORMULA_LABELS: Record<OneRepMaxFormula, string> = {
  epley: "Epley",
  brzycki: "Brzycki",
};

export function formatWeight(value: number, unit: WeightUnit): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`;
}

export function buildOneRepMaxCopyText(
  result: OneRepMaxResult,
  planner?: PlannerSelection,
): string {
  const rirLabel = result.input.rir === "unknown" ? "Unknown" : String(result.input.rir);
  const lines = [
    "One-rep max calculator - calculadoras.tools",
    `Set: ${formatWeight(result.input.weight, result.input.unit)} × ${result.input.repetitions} repetitions`,
    `RIR: ${rirLabel}`,
    `Effective repetitions: ${result.effectiveRepetitions}`,
    `Primary formula: ${FORMULA_LABELS[result.input.primaryFormula]}`,
    `Primary 1RM: ${formatWeight(result.estimate.primary, result.input.unit)}`,
    `Epley: ${formatWeight(result.estimate.epley, result.input.unit)}`,
    `Brzycki: ${formatWeight(result.estimate.brzycki, result.input.unit)}`,
    `Range between formulas: ${formatWeight(result.estimate.min, result.input.unit)}-${formatWeight(result.estimate.max, result.input.unit)}`,
    `Contextual quality: ${QUALITY_LABELS[result.quality]}`,
    `Available increment: ${formatWeight(result.input.increment, result.input.unit)}`,
  ];

  if (planner) {
    const target = planner.mode === "repetitions"
      ? `${planner.target} repetitions`
      : `${planner.target}% of 1RM`;
    lines.push(
      `Next load for ${target}: ${formatWeight(planner.load.nearest, result.input.unit)} practical (${formatWeight(planner.load.exact, result.input.unit)} mathematical)`,
    );
  }

  lines.push(
    "General estimate: the load does not guarantee completion of a specific number of repetitions.",
  );
  return lines.join("\n");
}
