import {
  calculateRunningPace as calculateRunningPaceBase,
  formatDuration,
  formatPace,
  type DistanceUnit,
  type RunningPaceInput,
  type RunningPaceResult,
} from "./runningPace";

export {
  KM_PER_MILE,
  RUNNING_PACE_LIMITS,
  RunningPaceCalculationError,
  combinePaceParts,
  combineTimeParts,
  convertDistance,
  convertPace,
  formatDuration,
  formatPace,
  generateSplits,
  parseLocalizedNumber,
  validateRunningPaceInput,
} from "./runningPace";

export type {
  DistanceUnit,
  PaceUnit,
  PopularDistance,
  RunningPaceEquivalent,
  RunningPaceField,
  RunningPaceInput,
  RunningPaceMode,
  RunningPaceResult,
  RunningPaceSplit,
  RunningPaceValidationError,
  RunningPaceValidationResult,
  RunningPaceWarning,
  SplitInterval,
} from "./runningPace";

export const POPULAR_DISTANCES = [
  { id: "1k", label: "1K", distanceKm: 1 },
  { id: "5k", label: "5K", distanceKm: 5 },
  { id: "10k", label: "10K", distanceKm: 10 },
  { id: "half", label: "Half marathon", distanceKm: 21.0975 },
  { id: "marathon", label: "Marathon", distanceKm: 42.195 },
] as const;

export function calculateRunningPace(input: RunningPaceInput): RunningPaceResult {
  const result = calculateRunningPaceBase(input);
  return {
    ...result,
    equivalents: result.equivalents.map((equivalent) => ({
      ...equivalent,
      label: POPULAR_DISTANCES.find((distance) => distance.id === equivalent.id)!.label,
    })),
  };
}

export function formatDistance(
  distanceKm: number,
  unit: DistanceUnit,
  maximumFractionDigits = 4,
): string {
  const value = unit === "km" ? distanceKm : distanceKm / 1.609344;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value)} ${unit}`;
}

export function formatSpeed(value: number, unit: "km/h" | "mph"): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${unit}`;
}

export function buildRunningPaceCopyText(result: RunningPaceResult): string {
  return [
    `${formatDistance(result.distanceKm, "km")} in ${formatDuration(result.timeSeconds)}`,
    `Pace: ${formatPace(result.paceSecondsPerKm)} min/km (${formatPace(result.paceSecondsPerMi)} min/mi)`,
    `Speed: ${formatSpeed(result.speedKmh, "km/h")}`,
    "Calculated at calculadoras.tools",
  ].join("\n");
}
