import {
  calculateVo2Result as calculateVo2ResultBase,
  type DataQuality,
  type Vo2Input,
  type Vo2Result,
  type WeightUnit,
} from "./vo2Max";

export {
  KG_TO_LB,
  METERS_PER_MILE,
  VO2_LIMITS,
  Vo2CalculationError,
  calculateCooperVo2,
  calculateRockportVo2,
  convertDistance,
  convertWeight,
  distanceFromLaps,
  parseVo2Number,
  validateVo2Input,
} from "./vo2Max";

export type {
  CooperInput,
  DataQuality,
  DistanceUnit,
  FormulaSex,
  ProtocolChecks,
  RockportInput,
  Vo2Field,
  Vo2Input,
  Vo2Method,
  Vo2Result,
  Vo2ValidationError,
  Vo2ValidationResult,
  Vo2Warning,
  WeightUnit,
} from "./vo2Max";

export const QUALITY_LABELS: Record<DataQuality, string> = {
  good: "Good",
  acceptable: "Acceptable",
  review: "Review protocol",
};

export function calculateVo2Result(input: Vo2Input): Vo2Result {
  const result = calculateVo2ResultBase(input);
  let summary: string[];
  if (input.method === "cooper") {
    const meters = input.distanceUnit === "m"
      ? input.distance
      : input.distanceUnit === "km"
        ? input.distance * 1000
        : input.distance * 1609.344;
    summary = [`Distance: ${formatDistance(meters)}`, "Duration: 12:00"];
  } else {
    summary = [
          `Age: ${input.age} years`,
          `Weight: ${formatWeight(input.weight, input.weightUnit)}`,
          `Time: ${formatTime(input.minutes + input.seconds / 60)}`,
          `Final pulse: ${input.finalPulse} bpm`,
    ];
  }

  return { ...result, summary };
}

export function formatVo2(value: number): string {
  return `${formatNumber(value, 1, 1)} ml/kg/min`;
}

export function formatPace(value: number): string {
  return `${formatTime(value)} min/km`;
}

export function formatDistance(meters: number): string {
  return `${formatNumber(meters, 0)} m`;
}

export function formatWeight(value: number, unit: WeightUnit): string {
  return `${formatNumber(value, 0, 1)} ${unit}`;
}

export function formatTime(totalMinutes: number): string {
  let minutes = Math.floor(totalMinutes);
  let seconds = Math.round((totalMinutes - minutes) * 60);
  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatSignedVo2(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 1, 1)} ml/kg/min`;
}

export function buildVo2CopyText(result: Vo2Result, comparison?: number): string {
  const lines = [
    "VO2 max calculator - calculadoras.tools",
    `Estimated VO2 max: ${formatVo2(result.vo2Max)}`,
    `Method: ${result.method === "cooper" ? "12-minute Cooper test" : "Rockport walk test"}`,
    `Data quality: ${QUALITY_LABELS[result.quality]}`,
    `Average pace: ${formatPace(result.paceMinutesPerKm)}`,
    ...result.summary,
  ];

  if (comparison !== undefined) {
    lines.push(`Difference from your previous result using the same method: ${formatSignedVo2(comparison)}`);
  }
  if (result.warnings.length > 0) lines.push("The result includes warnings that should be reviewed.");
  lines.push("Field estimate only; it does not replace a laboratory test or professional assessment.");
  return lines.join("\n");
}

function formatNumber(value: number, minimumFractionDigits: number, maximumFractionDigits = minimumFractionDigits): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits, maximumFractionDigits }).format(value);
}
