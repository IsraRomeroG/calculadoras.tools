import {
  calculateHeartRateZones as calculateHeartRateZonesBase,
  type HeartRateZoneDefinition,
  type HeartRateZonesInput,
  type HeartRateZonesResult,
} from "./heartRateZones";

export {
  MAX_KNOWN_MAX_HEART_RATE,
  MAX_RESTING_HEART_RATE,
  MIN_KNOWN_MAX_HEART_RATE,
  MIN_RESTING_HEART_RATE,
  HeartRateZonesError,
  formatHeartRateValue,
  formatHeartRateZoneRange,
  parseHeartRateInteger,
} from "./heartRateZones";

export type {
  HeartRateIntegerError,
  HeartRateSource,
  HeartRateZone,
  HeartRateZoneDefinition,
  HeartRateZoneMethod,
  HeartRateZonesErrorCode,
  HeartRateZonesInput,
  HeartRateZonesResult,
  ParseHeartRateIntegerResult,
} from "./heartRateZones";

export const HEART_RATE_ZONE_DEFINITIONS: HeartRateZoneDefinition[] = [
  { number: 1, minPercent: 50, maxPercent: 60, label: "Very easy", effort: "Very comfortable effort", talkTest: "Comfortable conversation" },
  { number: 2, minPercent: 60, maxPercent: 70, label: "Easy", effort: "Comfortable, continuous effort", talkTest: "Can speak in full sentences" },
  { number: 3, minPercent: 70, maxPercent: 80, label: "Steady", effort: "Noticeable effort", talkTest: "Conversation requires pauses" },
  { number: 4, minPercent: 80, maxPercent: 90, label: "Hard", effort: "High effort", talkTest: "Short phrases only" },
  { number: 5, minPercent: 90, maxPercent: 100, label: "Very hard", effort: "Very demanding effort", talkTest: "Speaking is difficult" },
];

export function calculateHeartRateZones(input: HeartRateZonesInput): HeartRateZonesResult {
  const result = calculateHeartRateZonesBase(input);
  return {
    ...result,
    zones: result.zones.map((zone, index) => ({
      ...zone,
      ...HEART_RATE_ZONE_DEFINITIONS[index],
    })),
  };
}

export function buildHeartRateZonesCopyText(result: HeartRateZonesResult): string {
  const sourceLine = result.source === "age"
    ? `Maximum heart rate used: ${result.maxHeartRateBpm} bpm, estimated with Tanaka for age ${result.age}`
    : `Maximum heart rate used: ${result.maxHeartRateBpm} bpm, entered as a known maximum`;
  const methodLine = result.method === "karvonen"
    ? "Method: Karvonen (% of heart rate reserve)"
    : "Method: direct percentage of maximum heart rate";
  const detailLines = result.method === "karvonen"
    ? [
        `Resting heart rate: ${result.restingHeartRate} bpm`,
        `Heart rate reserve: ${formatValue(result.reserveExact as number)} bpm`,
      ]
    : [];
  const basis = result.method === "karvonen" ? "of heart rate reserve" : "of maximum heart rate";

  return [
    "Heart rate zones calculator - calculadoras.tools",
    sourceLine,
    methodLine,
    ...detailLines,
    "",
    ...result.zones.map((zone) =>
      `Zone ${zone.number} · ${zone.label} (${zone.minPercent}%-${zone.maxPercent}% ${basis}): ${zone.minBpm}-${zone.maxBpm} bpm`,
    ),
    "",
    "These zones are general estimates, not a medical or exercise prescription.",
  ].join("\n");
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
