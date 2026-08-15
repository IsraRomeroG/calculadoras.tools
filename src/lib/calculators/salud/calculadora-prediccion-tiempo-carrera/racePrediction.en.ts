import {
  calculateRacePrediction as calculateRacePredictionBase,
  evaluateReferenceQuality as evaluateReferenceQualityBase,
  formatDuration,
  formatPace,
  type RacePredictionInput,
  type RacePredictionResult,
  type ReferenceQuality,
} from "./racePrediction";

export {
  CENTRAL_RIEGEL_EXPONENT,
  KM_PER_MILE,
  RACE_PREDICTION_LIMITS,
  RacePredictionCalculationError,
  combineTimeParts,
  convertDistance,
  formatDuration,
  formatPace,
  parseLocalizedNumber,
  predictTime,
  validateRacePredictionInput,
} from "./racePrediction";

export type {
  ComparableConditions,
  DistanceUnit,
  PopularDistance,
  PopularPrediction,
  PredictionScenario,
  RacePredictionField,
  RacePredictionInput,
  RacePredictionResult,
  RacePredictionValidationError,
  RacePredictionValidationResult,
  RacePredictionWarning,
  ReferenceEffort,
  ReferenceQuality,
  ReferenceRecency,
} from "./racePrediction";

export const POPULAR_DISTANCES = [
  { id: "1k", label: "1K", distanceKm: 1 },
  { id: "1mi", label: "1 mile", distanceKm: 1.609344 },
  { id: "5k", label: "5K", distanceKm: 5 },
  { id: "10k", label: "10K", distanceKm: 10 },
  { id: "15k", label: "15K", distanceKm: 15 },
  { id: "half", label: "Half marathon", distanceKm: 21.0975 },
  { id: "marathon", label: "Marathon", distanceKm: 42.195 },
] as const;

const SCENARIO_LABELS = {
  better_retention: "Better pace retention",
  central: "Central prediction",
  greater_fatigue: "Greater fatigue",
} as const;

export function calculateRacePrediction(input: RacePredictionInput): RacePredictionResult {
  const result = calculateRacePredictionBase(input);
  const quality = evaluateReferenceQuality(input, result.distanceRatio);

  return {
    ...result,
    scenarios: result.scenarios.map((scenario) => ({
      ...scenario,
      label: SCENARIO_LABELS[scenario.id],
    })),
    popularPredictions: result.popularPredictions.map((prediction) => ({
      ...prediction,
      label: POPULAR_DISTANCES.find((distance) => distance.id === prediction.id)!.label,
    })),
    qualityReasons: quality.reasons,
  };
}

export function evaluateReferenceQuality(
  input: RacePredictionInput,
  distanceRatio: number,
): { quality: ReferenceQuality; reasons: string[] } {
  const base = evaluateReferenceQualityBase(input, distanceRatio);
  const reasons: string[] = [];

  if (distanceRatio < 0.25 || distanceRatio > 4) {
    reasons.push("The distances are far apart.");
  } else if (distanceRatio < 0.5 || distanceRatio > 2) {
    reasons.push("The difference between distances adds uncertainty.");
  }
  if (input.recency === "older") reasons.push("The reference performance is more than three months old.");
  if (input.effort === "controlled") reasons.push("The reference comes from a controlled training effort.");
  if (input.comparableConditions === "no") reasons.push("The conditions are not comparable.");

  const hasUnknownContext =
    input.recency === "unknown" ||
    input.effort === "unknown" ||
    input.comparableConditions === "unknown";
  if (hasUnknownContext) reasons.push("Optional context about the reference performance is missing.");

  if (base.quality === "good") {
    return { quality: base.quality, reasons: ["The performance is recent, all-out, and comparable."] };
  }
  if (reasons.length === 0) {
    reasons.push("The performance is useful, although it does not meet every criterion for an ideal reference.");
  }
  return { quality: base.quality, reasons };
}

export function formatDistance(
  distanceKm: number,
  unit: "km" | "mi",
  maximumFractionDigits = 4,
): string {
  const value = unit === "km" ? distanceKm : distanceKm / 1.609344;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value)} ${unit}`;
}

export function formatPaceChange(secondsPerKm: number): string {
  if (Math.abs(secondsPerKm) < 0.5) return "The target distance matches your reference distance.";
  const seconds = Math.abs(Math.round(secondsPerKm));
  return secondsPerKm > 0
    ? `The prediction adds ${seconds} sec/km compared with your reference pace.`
    : `The prediction requires a pace ${seconds} sec/km faster than your reference pace.`;
}

export function qualityLabel(quality: ReferenceQuality): string {
  if (quality === "good") return "Good reference";
  if (quality === "high_uncertainty") return "High uncertainty";
  return "Acceptable reference";
}

export function buildRacePredictionCopyText(result: RacePredictionResult): string {
  return [
    "Race time prediction",
    `Reference: ${formatDistance(result.referenceDistanceKm, result.input.referenceUnit)} in ${formatDuration(result.input.referenceTimeSeconds)}`,
    `Target: ${formatDistance(result.targetDistanceKm, result.input.targetUnit)}`,
    `Predicted time: ${formatDuration(result.targetTimeSeconds)}`,
    `Target pace: ${formatPace(result.targetPaceSecondsPerKm)} min/km (${formatPace(result.targetPaceSecondsPerMi)} min/mi)`,
    `Change from reference: ${formatSignedSeconds(result.paceChangeSecondsPerKm)} sec/km`,
    `Reference quality: ${qualityLabel(result.quality)}`,
    "",
    "Estimate based on the Riegel formula; actual performance may vary.",
    "Calculated at calculadoras.tools",
  ].join("\n");
}

function formatSignedSeconds(value: number): string {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : String(rounded);
}
