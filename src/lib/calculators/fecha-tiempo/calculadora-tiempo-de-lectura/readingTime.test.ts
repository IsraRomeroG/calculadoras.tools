import { describe, expect, it } from "vitest";
import {
  ReadingTimeValidationError,
  buildReadingSummary,
  calculateReadingTime,
  countWords,
  formatReadingDuration,
  parseReadingInteger,
} from "./readingTime";

describe("reading time calculator", () => {
  it("calculates 1200 words at 220 ppm as about 5 min 27 s", () => {
    const result = calculateReadingTime({
      mode: "words",
      manualWords: 1200,
      wordsPerMinute: 220,
      now: new Date("2026-01-01T14:30:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.words).toBe(1200);
    expect(result.seconds).toBe(327);
    expect(result.formattedDuration).toBe("5 min 27 s");
    expect(result.finishTime).toBe("14:36");
  });

  it("counts words across line breaks and punctuation", () => {
    expect(countWords("Hola mundo\n\nEsto es una prueba.")).toBe(6);
  });

  it("counts Spanish text with accents and opening punctuation", () => {
    const result = calculateReadingTime({
      mode: "text",
      text: "\u00BFCuanto tarda leer rapido? \u00A1Depende del texto!",
      wordsPerMinute: 220,
      now: new Date("2026-01-01T00:00:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.words).toBe(7);
    expect(result.metrics.sentences).toBe(2);
    expect(result.metrics.wordsPerSentence).toBe(3.5);
  });

  it("uses manual words only in words mode", () => {
    const result = calculateReadingTime({
      mode: "words",
      text: "solo dos",
      manualWords: 1200,
      wordsPerMinute: 220,
      now: new Date("2026-01-01T00:00:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.words).toBe(1200);
    expect(result.metrics.sentences).toBe(0);
  });

  it("uses textarea words only in text mode", () => {
    const result = calculateReadingTime({
      mode: "text",
      text: "uno dos tres",
      manualWords: 1200,
      wordsPerMinute: 220,
      now: new Date("2026-01-01T00:00:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.words).toBe(3);
  });

  it("parses grouped integer word counts", () => {
    expect(parseReadingInteger("1,200")).toEqual({
      ok: true,
      value: 1200,
      normalized: "1200",
    });
    expect(parseReadingInteger("1.200")).toEqual({
      ok: true,
      value: 1200,
      normalized: "1200",
    });
    expect(parseReadingInteger("1.5")).toEqual({
      ok: false,
      error: "decimal",
    });
  });

  it("rejects invalid speed and manual word ranges", () => {
    expect(() =>
      calculateReadingTime({
        mode: "words",
        manualWords: 1200,
        wordsPerMinute: 20,
      }),
    ).toThrow(ReadingTimeValidationError);

    expect(() =>
      calculateReadingTime({
        mode: "words",
        manualWords: 100001,
        wordsPerMinute: 220,
      }),
    ).toThrow(/palabras/i);
  });

  it("formats durations below a minute in seconds", () => {
    expect(formatReadingDuration(20)).toBe("20 s");
  });

  it("builds fast-to-slow ranges and a copy summary", () => {
    const result = calculateReadingTime({
      mode: "words",
      manualWords: 1200,
      wordsPerMinute: 220,
      now: new Date("2026-01-01T14:30:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.rangeSeconds).toEqual({
      fast: 240,
      slow: 480,
    });
    expect(result.formattedRange).toBe("4 min a 8 min");
    expect(buildReadingSummary(result)).toContain("Tiempo de lectura");
  });

  it("keeps empty text as an empty calculation state", () => {
    const result = calculateReadingTime({
      mode: "text",
      text: "   ",
      wordsPerMinute: 220,
      now: new Date("2026-01-01T00:00:00.000Z"),
      timeZone: "UTC",
    });

    expect(result.words).toBe(0);
    expect(result.formattedDuration).toBe("0 s");
  });
});
