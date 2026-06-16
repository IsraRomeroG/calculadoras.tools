export type ReadingInputMode = "text" | "words";

export type ReadingPresetId = "slow" | "average" | "fast";

export type ReadingTimeWarningCode = "text_too_long";

export type ReadingTimeErrorCode =
  | "invalid_mode"
  | "invalid_word_count"
  | "invalid_words_per_minute"
  | "invalid_date";

export interface ReadingPreset {
  id: ReadingPresetId;
  label: string;
  wordsPerMinute: number;
}

export interface ReadingTimeInput {
  mode: ReadingInputMode;
  text?: string;
  manualWords?: number;
  wordsPerMinute: number;
  now?: Date;
  locale?: string;
  timeZone?: string;
}

export interface ReadingPresetEstimate {
  preset: ReadingPreset;
  seconds: number;
  formattedDuration: string;
}

export interface ReadingTextMetrics {
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  wordsPerSentence: number | null;
}

export interface ReadingTimeResult {
  mode: ReadingInputMode;
  words: number;
  wordsPerMinute: number;
  seconds: number;
  formattedDuration: string;
  finishAt: Date;
  finishTime: string;
  rangeSeconds: {
    fast: number;
    slow: number;
  };
  formattedRange: string;
  metrics: ReadingTextMetrics;
  presetEstimates: ReadingPresetEstimate[];
  warnings: ReadingTimeWarningCode[];
}

export type ParseReadingIntegerResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "decimal";
    };

type WordSegment = {
  segment: string;
  isWordLike?: boolean;
};

type SegmenterLike = {
  segment(value: string): Iterable<WordSegment>;
};

type SegmenterConstructor = new (
  locale: string,
  options: { granularity: "word" },
) => SegmenterLike;

export class ReadingTimeValidationError extends RangeError {
  code: ReadingTimeErrorCode;

  constructor(code: ReadingTimeErrorCode, message: string) {
    super(message);
    this.name = "ReadingTimeValidationError";
    this.code = code;
  }
}

export const READING_PRESETS: readonly ReadingPreset[] = [
  { id: "slow", label: "Lento", wordsPerMinute: 150 },
  { id: "average", label: "Promedio", wordsPerMinute: 220 },
  { id: "fast", label: "Rapido", wordsPerMinute: 300 },
] as const;

export const DEFAULT_WORDS_PER_MINUTE = 220;
export const MIN_WORDS_PER_MINUTE = 50;
export const MAX_WORDS_PER_MINUTE = 1000;
export const MAX_MANUAL_WORDS = 100_000;
export const MAX_TEXT_CHARACTERS = 100_000;

const wordFallbackPattern = /[\p{L}\p{N}]+(?:[''-][\p{L}\p{N}]+)*/gu;

export function calculateReadingTime(
  input: ReadingTimeInput,
): ReadingTimeResult {
  const settings = validateInput(input);
  const text = settings.text ?? "";
  const locale = settings.locale ?? "es-MX";
  const now = settings.now ?? new Date();
  const words =
    settings.mode === "words"
      ? settings.manualWords ?? 0
      : countWords(text, locale);
  const seconds = Math.round((words / settings.wordsPerMinute) * 60);
  const finishAt = new Date(now.getTime() + seconds * 1000);
  const fastSeconds = estimateSeconds(words, getPreset("fast").wordsPerMinute);
  const slowSeconds = estimateSeconds(words, getPreset("slow").wordsPerMinute);
  const metrics = buildTextMetrics(text, settings.mode === "text" ? words : 0);
  const presetEstimates = READING_PRESETS.map((preset) => ({
    preset,
    seconds: estimateSeconds(words, preset.wordsPerMinute),
    formattedDuration: formatReadingDuration(
      estimateSeconds(words, preset.wordsPerMinute),
    ),
  }));

  return {
    mode: settings.mode,
    words,
    wordsPerMinute: settings.wordsPerMinute,
    seconds,
    formattedDuration: formatReadingDuration(seconds),
    finishAt,
    finishTime: formatFinishTime(finishAt, locale, settings.timeZone),
    rangeSeconds: {
      fast: fastSeconds,
      slow: slowSeconds,
    },
    formattedRange: `${formatReadingDuration(fastSeconds)} a ${formatReadingDuration(slowSeconds)}`,
    metrics,
    presetEstimates,
    warnings:
      settings.mode === "text" && text.length > MAX_TEXT_CHARACTERS
        ? ["text_too_long"]
        : [],
  };
}

export function countWords(text: string, locale = "es-MX"): number {
  const normalizedText = text.trim();

  if (!normalizedText) return 0;

  const Segmenter = (
    Intl as typeof Intl & { Segmenter?: SegmenterConstructor }
  ).Segmenter;

  if (typeof Segmenter === "function") {
    const segmenter = new Segmenter(locale, { granularity: "word" });
    let count = 0;

    for (const segment of segmenter.segment(normalizedText)) {
      if (segment.isWordLike) count += 1;
    }

    return count;
  }

  return normalizedText.match(wordFallbackPattern)?.length ?? 0;
}

export function countSentences(text: string, wordCount?: number): number {
  const words = wordCount ?? countWords(text);

  if (words === 0) return 0;

  const sentenceMatches = text.trim().match(/[.!?]+/g);

  return sentenceMatches?.length ?? 1;
}

export function buildTextMetrics(
  text: string,
  wordCount = countWords(text),
): ReadingTextMetrics {
  const sentences = countSentences(text, wordCount);

  return {
    charactersWithSpaces: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, "").length,
    sentences,
    wordsPerSentence: sentences > 0 ? wordCount / sentences : null,
  };
}

export function formatReadingDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new RangeError("La duracion debe ser finita y no negativa.");
  }

  const roundedSeconds = Math.round(seconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  if (roundedSeconds < 60) return `${roundedSeconds} s`;
  if (hours > 0) {
    if (minutes === 0) return `${hours} h`;

    return `${hours} h ${minutes} min`;
  }
  if (remainingSeconds === 0) return `${minutes} min`;

  return `${minutes} min ${remainingSeconds} s`;
}

export function formatFinishTime(
  date: Date,
  locale = "es-MX",
  timeZone?: string,
): string {
  if (!Number.isFinite(date.getTime())) {
    throw new ReadingTimeValidationError(
      "invalid_date",
      "La fecha base no es valida.",
    );
  }

  const rounded = roundUpToMinute(date);

  if (!timeZone) {
    return `${String(rounded.getHours()).padStart(2, "0")}:${String(
      rounded.getMinutes(),
    ).padStart(2, "0")}`;
  }

  const parts = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    hourCycle: "h23",
    hour12: false,
    minute: "2-digit",
    timeZone,
  }).formatToParts(rounded);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${hour}:${minute}`;
}

export function formatReadingNumber(value: number, locale = "es-MX"): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);
}

export function parseReadingInteger(
  value: string,
  options: { optional?: boolean } = {},
): ParseReadingIntegerResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return options.optional
      ? { ok: true, value: 0, normalized: "" }
      : { ok: false, error: "required" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  if (!/^\d+$/.test(trimmed)) {
    const groupedPattern = /^\d{1,3}([,.\s]\d{3})*$/;

    if (!groupedPattern.test(trimmed)) {
      return /[,.]\d{1,2}$/.test(trimmed)
        ? { ok: false, error: "decimal" }
        : { ok: false, error: "invalid" };
    }
  }

  const normalized = trimmed.replace(/[,\s.]/g, "");
  const valueAsNumber = Number(normalized);

  if (!Number.isSafeInteger(valueAsNumber)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: valueAsNumber, normalized };
}

export function buildReadingSummary(
  result: ReadingTimeResult,
  locale = "es-MX",
): string {
  return [
    `Tiempo de lectura: ${result.formattedDuration} | ${formatReadingNumber(result.words, locale)} palabras | ${result.wordsPerMinute} ppm`,
    `Rango estimado: ${result.formattedRange} | Terminaria aprox. a las ${result.finishTime}`,
    "Calculado en calculadoras.tools",
  ].join("\n");
}

function validateInput(input: ReadingTimeInput): ReadingTimeInput {
  if (input.mode !== "text" && input.mode !== "words") {
    throw new ReadingTimeValidationError(
      "invalid_mode",
      "Selecciona un modo valido.",
    );
  }

  validateIntegerRange(
    input.wordsPerMinute,
    MIN_WORDS_PER_MINUTE,
    MAX_WORDS_PER_MINUTE,
    "invalid_words_per_minute",
    `La velocidad debe estar entre ${MIN_WORDS_PER_MINUTE} y ${MAX_WORDS_PER_MINUTE} ppm.`,
  );

  if (input.mode === "words") {
    validateIntegerRange(
      input.manualWords,
      0,
      MAX_MANUAL_WORDS,
      "invalid_word_count",
      `El numero de palabras debe estar entre 0 y ${MAX_MANUAL_WORDS}.`,
    );
  }

  if (input.now !== undefined && !Number.isFinite(input.now.getTime())) {
    throw new ReadingTimeValidationError(
      "invalid_date",
      "La fecha base no es valida.",
    );
  }

  return input;
}

function validateIntegerRange(
  value: unknown,
  min: number,
  max: number,
  code: ReadingTimeErrorCode,
  message: string,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new ReadingTimeValidationError(code, message);
  }
}

function getPreset(id: ReadingPresetId): ReadingPreset {
  return READING_PRESETS.find((preset) => preset.id === id) ?? READING_PRESETS[0];
}

function estimateSeconds(words: number, wordsPerMinute: number): number {
  return Math.round((words / wordsPerMinute) * 60);
}

function roundUpToMinute(date: Date): Date {
  const rounded = new Date(date.getTime());

  if (rounded.getSeconds() > 0 || rounded.getMilliseconds() > 0) {
    rounded.setMinutes(rounded.getMinutes() + 1, 0, 0);
  }

  return rounded;
}
