import { describe, expect, it } from "vitest";
import {
  ASCII_SYMBOLS,
  MAX_PASSWORD_LENGTH,
  analyzePassword,
  getAttackScenario,
  parseAttemptsPerSecond,
} from "./passwordEntropy";

const getSignalIds = (password: string) =>
  analyzePassword(password).signals.map((signal) => signal.id);

describe("password entropy", () => {
  it("calculates theoretical entropy from length and character set", () => {
    const result = analyzePassword("Abc123!@#");
    const expectedCharset = 26 + 26 + 10 + ASCII_SYMBOLS.length;

    expect(result.length).toBe(9);
    expect(result.characterSetSize).toBe(expectedCharset);
    expect(result.entropyBits).toBeCloseTo(9 * Math.log2(expectedCharset), 8);
    expect(result.characterSets).toEqual({
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: true,
      spaces: false,
      unicodeOther: false,
    });
  });

  it("counts Unicode by code point and marks non ASCII characters", () => {
    const result = analyzePassword("niño2026");

    expect(result.length).toBe(Array.from("niño2026").length);
    expect(result.characterSets.unicodeOther).toBe(true);
    expect(result.signals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "unicode-detected" }),
      ]),
    );
  });

  it("detects common passwords and local Spanish variants", () => {
    const english = analyzePassword("Password1!");
    const spanish = analyzePassword("Contraseña1!");

    expect(getSignalIds("Password1!")).toContain("common-password");
    expect(getSignalIds("Contraseña1!")).toContain("common-password");
    expect(english.strengthLevel).toBe("very-weak");
    expect(spanish.strengthLevel).toBe("very-weak");
  });

  it("detects repetition, sequences, keyboard patterns and dates", () => {
    expect(getSignalIds("aaaaaaaa")).toContain("strong-repetition");
    expect(getSignalIds("abcabcabc")).toContain("strong-repetition");
    expect(getSignalIds("abcd1234")).toEqual(
      expect.arrayContaining(["sequence"]),
    );
    expect(getSignalIds("qwerty123")).toEqual(
      expect.arrayContaining(["keyboard-pattern", "sequence"]),
    );
    expect(getSignalIds("2024-01-01")).toContain("probable-date");
  });

  it("detects obvious substitutions before stripping symbols", () => {
    const signalIds = getSignalIds("P@ssw0rd2026");

    expect(signalIds).toEqual(
      expect.arrayContaining(["common-word", "obvious-substitution"]),
    );
  });

  it("keeps theoretical bits separate from practical score", () => {
    const repeated = analyzePassword("aaaaaaaaaaaaaaaa");
    const varied = analyzePassword("correct horse battery staple");

    expect(repeated.entropyBits).toBeGreaterThan(60);
    expect(repeated.strengthLevel).toBe("weak");
    expect(varied.signals).toContainEqual(
      expect.objectContaining({ id: "length-strong" }),
    );
    expect(varied.characterSets.spaces).toBe(true);
  });

  it("handles empty input without throwing", () => {
    const result = analyzePassword("");

    expect(result.length).toBe(0);
    expect(result.entropyBits).toBe(0);
    expect(result.strengthLevel).toBe("empty");
    expect(result.signals).toEqual([
      expect.objectContaining({ id: "empty" }),
    ]);
  });

  it("accepts scientific notation for custom attack speeds", () => {
    expect(parseAttemptsPerSecond("1e9")).toBe(1e9);
    expect(parseAttemptsPerSecond("0")).toBeNull();
    expect(parseAttemptsPerSecond("-1")).toBeNull();
  });

  it("uses attack scenarios to estimate time", () => {
    const scenario = getAttackScenario("online-limited");
    const result = analyzePassword("correct horse battery staple", {
      attemptsPerSecond: scenario.attemptsPerSecond,
    });

    expect(result.attack.attemptsPerSecond).toBe(scenario.attemptsPerSecond);
    expect(result.attack.averageLabel).not.toBe("");
  });

  it("exposes the UI length limit", () => {
    expect(MAX_PASSWORD_LENGTH).toBe(256);
  });
});
