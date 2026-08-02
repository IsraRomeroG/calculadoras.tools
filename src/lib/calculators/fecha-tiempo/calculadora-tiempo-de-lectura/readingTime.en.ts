import * as base from "./readingTime";
import type { ReadingTimeInput, ReadingTimeResult } from "./readingTime";

export type {
  ParseReadingIntegerResult,
  ReadingInputMode,
  ReadingPreset,
  ReadingPresetEstimate,
  ReadingPresetId,
  ReadingTextMetrics,
  ReadingTimeErrorCode,
  ReadingTimeInput,
  ReadingTimeResult,
  ReadingTimeWarningCode,
} from "./readingTime";

export const ReadingTimeValidationError = base.ReadingTimeValidationError;
export const READING_PRESETS = [
  { id: "slow", label: "Slow", wordsPerMinute: 150 },
  { id: "average", label: "Average", wordsPerMinute: 220 },
  { id: "fast", label: "Fast", wordsPerMinute: 300 },
] as const;
export const DEFAULT_WORDS_PER_MINUTE = base.DEFAULT_WORDS_PER_MINUTE;
export const MIN_WORDS_PER_MINUTE = base.MIN_WORDS_PER_MINUTE;
export const MAX_WORDS_PER_MINUTE = base.MAX_WORDS_PER_MINUTE;
export const MAX_MANUAL_WORDS = base.MAX_MANUAL_WORDS;
export const MAX_TEXT_CHARACTERS = base.MAX_TEXT_CHARACTERS;
export const countSentences = base.countSentences;
export const buildTextMetrics = base.buildTextMetrics;
export const parseReadingInteger = base.parseReadingInteger;

export function countWords(text: string, locale = "en-US") {
  return base.countWords(text, locale);
}

export function calculateReadingTime(input: ReadingTimeInput): ReadingTimeResult {
  try {
    const result = base.calculateReadingTime({ ...input, locale: input.locale ?? "en-US" });
    return {
      ...result,
      formattedRange: `${formatReadingDuration(result.rangeSeconds.fast)} to ${formatReadingDuration(result.rangeSeconds.slow)}`,
      presetEstimates: result.presetEstimates.map((estimate) => ({
        ...estimate,
        preset: READING_PRESETS.find((preset) => preset.id === estimate.preset.id) ?? READING_PRESETS[0],
      })),
    };
  } catch (error) {
    if (error instanceof base.ReadingTimeValidationError) {
      throw new base.ReadingTimeValidationError(error.code, readingErrorMessage(error.code));
    }
    throw error;
  }
}

export function formatReadingDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError("Duration must be finite and non-negative.");
  return base.formatReadingDuration(seconds);
}

export function formatFinishTime(date: Date, locale = "en-US", timeZone?: string) {
  try {
    return base.formatFinishTime(date, locale, timeZone);
  } catch {
    throw new base.ReadingTimeValidationError("invalid_date", "The base date is invalid.");
  }
}

export function formatReadingNumber(value: number, locale = "en-US") {
  return base.formatReadingNumber(value, locale);
}

export function buildReadingSummary(result: ReadingTimeResult, locale = "en-US") {
  return [
    `Reading time: ${result.formattedDuration} | ${formatReadingNumber(result.words, locale)} words | ${result.wordsPerMinute} wpm`,
    `Estimated range: ${result.formattedRange} | Approximate finish: ${result.finishTime}`,
    "Calculated at calculadoras.tools",
  ].join("\n");
}

function readingErrorMessage(code: import("./readingTime").ReadingTimeErrorCode) {
  return {
    invalid_mode: "Select a valid mode.",
    invalid_word_count: `Word count must be between 0 and ${MAX_MANUAL_WORDS}.`,
    invalid_words_per_minute: `Reading speed must be between ${MIN_WORDS_PER_MINUTE} and ${MAX_WORDS_PER_MINUTE} wpm.`,
    invalid_date: "The base date is invalid.",
  }[code];
}
