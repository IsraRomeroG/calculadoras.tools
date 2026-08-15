import { EXERCISE_ACTIVITIES as SPANISH_ACTIVITIES } from "./activities";

export type {
  ExerciseActivity,
  ExerciseIntensity,
  ExerciseVariant,
} from "./activities";

const ACTIVITY_LABELS: Record<string, string> = {
  walking: "Walking",
  running: "Running",
  cycling: "Cycling",
  strength: "Strength training",
  swimming: "Swimming",
  yoga: "Yoga",
  elliptical: "Elliptical",
  rowing: "Stationary rowing",
  stairs: "Stair climbing",
  hiit: "HIIT",
  dancing: "Dancing",
  soccer: "Soccer",
};

const VARIANT_TEXT: Record<string, [label: string, description: string]> = {
  "walking-slow": ["Slow", "2.0-2.4 mph (3.2-3.9 km/h), level surface"],
  "walking-moderate": ["Moderate", "2.8-3.4 mph (4.5-5.5 km/h), level surface"],
  "walking-brisk": ["Brisk", "3.5-3.9 mph (5.6-6.3 km/h), level surface"],
  "walking-hills": ["Uphill", "6-10% incline at a moderate-to-brisk pace"],
  "running-8-kmh": ["5 mph (8 km/h)", "Approximate pace of 12:04 min/mi (7:30 min/km)"],
  "running-10-kmh": ["6.2 mph (10 km/h)", "Approximate pace of 9:39 min/mi (6:00 min/km)"],
  "running-10-8-kmh": ["6.7 mph (10.8 km/h)", "Approximate pace of 8:56 min/mi (5:33 min/km)"],
  "running-12-kmh": ["7.5 mph (12 km/h)", "Approximate pace of 8:03 min/mi (5:00 min/km)"],
  "cycling-easy": ["Easy ride", "Self-selected easy pace"],
  "cycling-moderate": ["Moderate pace", "Self-selected moderate pace"],
  "cycling-vigorous": ["Vigorous pace", "Self-selected vigorous pace"],
  "cycling-spin": ["Spin class", "Stationary bike, group class"],
  "strength-general": ["General workout", "Several exercises, 8-15 repetitions"],
  "strength-compound": ["Squats or deadlifts", "Slow or explosive effort"],
  "strength-vigorous": ["Vigorous effort", "Free weights, machines, or bodybuilding"],
  "swimming-leisure": ["Recreational", "Leisure swimming without continuous laps"],
  "swimming-freestyle-slow": ["Slow freestyle", "Freestyle laps at a recreational pace"],
  "swimming-crawl-medium": ["Medium crawl", "Approximately 50 yd/min (46 m/min)"],
  "swimming-freestyle-fast": ["Fast freestyle", "Freestyle laps at a vigorous effort"],
  "yoga-hatha": ["Hatha", "Hatha yoga practice"],
  "yoga-general": ["General", "General yoga practice"],
  "yoga-vinyasa": ["Vinyasa", "Vinyasa yoga practice"],
  "yoga-power": ["Power yoga", "Higher-effort yoga practice"],
  "elliptical-moderate": ["Moderate", "Elliptical trainer, moderate effort"],
  "elliptical-vigorous": ["Vigorous", "Elliptical trainer, vigorous effort"],
  "rowing-moderate": ["Under 100 W", "Moderate effort"],
  "rowing-vigorous": ["100-149 W", "Vigorous effort"],
  "rowing-fast": ["150-199 W", "High vigorous effort"],
  "stairs-slow": ["Slow pace", "Climbing stairs slowly"],
  "stairs-general": ["General pace", "Climbing stairs"],
  "stairs-fast": ["Fast pace", "One step at a time"],
  "hiit-moderate": ["Moderate", "Moderate-intensity interval exercise"],
  "hiit-vigorous": ["Vigorous", "Burpees, mountain climbers, jumps, or Tabata"],
  "dancing-slow": ["Slow dancing", "Waltz, foxtrot, or slow dancing"],
  "dancing-moderate": ["Moderate dancing", "Folk dancing at moderate effort"],
  "dancing-vigorous": ["Vigorous dancing", "Nightclub or vigorous folk dancing"],
  "soccer-walking": ["Walking soccer", "Game played without running"],
  "soccer-casual": ["Casual game", "General noncompetitive play"],
  "soccer-competitive": ["Competitive", "Competitive match"],
};

export const EXERCISE_ACTIVITIES = SPANISH_ACTIVITIES.map((activity) => ({
  ...activity,
  label: ACTIVITY_LABELS[activity.id],
  variants: activity.variants.map((item) => ({
    ...item,
    label: VARIANT_TEXT[item.id][0],
    description: VARIANT_TEXT[item.id][1],
  })),
}));

export const POPULAR_EXERCISE_ACTIVITIES = EXERCISE_ACTIVITIES.filter(
  (activity) => activity.popular,
);

export const getExerciseActivity = (id: string) =>
  EXERCISE_ACTIVITIES.find((activity) => activity.id === id);

export const getExerciseVariant = (activityId: string, variantId: string) =>
  getExerciseActivity(activityId)?.variants.find((item) => item.id === variantId);
