import { describe, expect, it } from "vitest";
import {
  buildCopyText,
  buildSpeedComparison,
  convertSizeToBytes,
  convertSpeedToBps,
  estimateDownloadTime,
  estimateRequiredSpeed,
  formatDuration,
  formatSizeFromBytes,
  formatSpeed,
  parseLocalizedNumber,
} from "./downloadSpeed";

describe("download speed calculator", () => {
  it("estimates download time with decimal units", () => {
    const result = estimateDownloadTime({
      sizeValue: 1,
      sizeUnit: "GB",
      speedValue: 100,
      speedUnit: "Mbps",
      efficiencyPercent: 100,
    });

    expect(result.secondsEstimated).toBe(80);
    expect(formatDuration(result.secondsEstimated)).toBe("1 min 20 s");
  });

  it("applies efficiency to estimated time", () => {
    const result = estimateDownloadTime({
      sizeValue: 5,
      sizeUnit: "GB",
      speedValue: 100,
      speedUnit: "Mbps",
      efficiencyPercent: 90,
    });

    expect(result.secondsEstimated).toBeCloseTo(444.4444, 4);
    expect(formatDuration(result.secondsEstimated)).toBe("7 min 24 s");
    expect(formatSpeed(result.effectiveSpeedBps, "MB/s")).toBe("11.3 MB/s");
  });

  it("keeps binary size units distinct from decimal units", () => {
    const gib = estimateDownloadTime({
      sizeValue: 1,
      sizeUnit: "GiB",
      speedValue: 100,
      speedUnit: "Mbps",
      efficiencyPercent: 100,
    });

    expect(convertSizeToBytes(1, "GiB")).toBe(1_073_741_824);
    expect(gib.secondsEstimated).toBeCloseTo(85.8993, 4);
    expect(formatSizeFromBytes(gib.sizeBytes, "binary")).toBe("1 GiB");
  });

  it("converts byte-based speed units to bits per second", () => {
    expect(convertSpeedToBps(100, "Mbps")).toBe(100_000_000);
    expect(convertSpeedToBps(10, "MB/s")).toBe(80_000_000);
    expect(convertSpeedToBps(10, "MiB/s")).toBe(83_886_080);
    expect(formatSpeed(100_000_000, "MB/s")).toBe("12.5 MB/s");
  });

  it("estimates the nominal speed required for a target time", () => {
    const ideal = estimateRequiredSpeed({
      sizeValue: 1,
      sizeUnit: "GB",
      targetSeconds: 80,
      efficiencyPercent: 100,
    });
    const realistic = estimateRequiredSpeed({
      sizeValue: 1,
      sizeUnit: "GB",
      targetSeconds: 80,
      efficiencyPercent: 90,
    });

    expect(ideal.nominalRequiredBps).toBe(100_000_000);
    expect(realistic.nominalRequiredBps).toBeCloseTo(111_111_111.1111, 4);
    expect(formatSpeed(realistic.nominalRequiredBps, "Mbps")).toBe(
      "111 Mbps",
    );
  });

  it("builds a speed comparison using the active efficiency", () => {
    const comparison = buildSpeedComparison({
      sizeValue: 5,
      sizeUnit: "GB",
      efficiencyPercent: 90,
    });

    expect(comparison).toHaveLength(6);
    expect(comparison[2].label).toBe("100 Mbps");
    expect(comparison[2].secondsEstimated).toBeCloseTo(444.4444, 4);
  });

  it("validates positive values and efficiency range", () => {
    expect(() => convertSizeToBytes(0, "GB")).toThrow("mayor que cero");
    expect(() =>
      estimateDownloadTime({
        sizeValue: 1,
        sizeUnit: "GB",
        speedValue: 100,
        speedUnit: "Mbps",
        efficiencyPercent: 0,
      }),
    ).toThrow("entre 1 y 100");
    expect(() =>
      estimateDownloadTime({
        sizeValue: 1,
        sizeUnit: "GB",
        speedValue: 100,
        speedUnit: "Mbps",
        efficiencyPercent: 101,
      }),
    ).toThrow("entre 1 y 100");
    expect(() =>
      estimateRequiredSpeed({
        sizeValue: 1,
        sizeUnit: "GB",
        targetSeconds: 0,
        efficiencyPercent: 100,
      }),
    ).toThrow("mayor que cero");
  });

  it("parses localized decimal input conservatively", () => {
    expect(parseLocalizedNumber("1,5")).toBe(1.5);
    expect(parseLocalizedNumber("1.5")).toBe(1.5);
    expect(parseLocalizedNumber("1,2,3")).toBeNull();
    expect(parseLocalizedNumber("-1")).toBeNull();
  });

  it("copies a self-contained summary", () => {
    const result = estimateDownloadTime({
      sizeValue: 5,
      sizeUnit: "GB",
      speedValue: 100,
      speedUnit: "Mbps",
      efficiencyPercent: 90,
    });

    expect(buildCopyText(result)).toContain(
      "Descargar 5 GB a 100 Mbps con 90% de eficiencia",
    );
    expect(buildCopyText(result)).toContain("7 min 24 s");
  });
});
