import type { MaxHeartRateResult } from "./maxHeartRate";

export * from "./maxHeartRate";

export function buildMaxHeartRateCopyText(result: MaxHeartRateResult): string {
  return [
    "Maximum heart rate calculator - calculadoras.tools",
    `Age: ${result.age} years`,
    `Estimated maximum heart rate (Tanaka): ${result.tanakaBpm} bpm`,
    `Moderate activity (50%-70%): ${formatBpmRange(result.moderate)}`,
    `Vigorous activity (70%-85%): ${formatBpmRange(result.vigorous)}`,
    `Classic formula (220 - age): ${result.classicBpm} bpm`,
    "These figures are general estimates, not medical advice or an exercise prescription.",
  ].join("\n");
}

function formatBpmRange(range: MaxHeartRateResult["moderate"]): string {
  return `${range.minBpm}-${range.maxBpm} bpm`;
}
