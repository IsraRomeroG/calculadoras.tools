import { describe, expect, it } from "vitest";
import {
  SIZE_CHARTS,
  convertClothingSize,
  estimateClothingSize,
  formatMeasurementRange,
  getAvailableSizes,
} from "./sizeCharts";

describe("clothing size charts", () => {
  it("keeps every record identifiable and editorially versioned", () => {
    expect(SIZE_CHARTS.length).toBeGreaterThan(0);

    SIZE_CHARTS.forEach((record) => {
      expect(record.id).toMatch(/^(mujer|hombre)-(top|pantalon|vestido)-\d{2}$/);
      expect(record.revisedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.sourceNote).toBeTruthy();
    });
  });

  it("returns available sizes for the selected profile, garment and region", () => {
    expect(
      getAvailableSizes({
        profile: "mujer",
        garment: "top",
        region: "international",
      }),
    ).toEqual(["XS", "S", "M", "L", "XL"]);

    expect(
      getAvailableSizes({
        profile: "hombre",
        garment: "pantalon",
        region: "us",
      }),
    ).toEqual(["28", "30", "32", "34", "36"]);
  });
});

describe("conversion by known size", () => {
  it("converts a known size and returns the same editorial row", () => {
    const result = convertClothingSize({
      profile: "mujer",
      garment: "top",
      originRegion: "international",
      originSize: "M",
      destinationRegion: "eu",
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.primaryLabel).toBe("EU 40-42");
    expect(result.record.labels.mx).toBe("M");
    expect(result.neighbors.map((neighbor) => neighbor.label)).toEqual([
      "Int. S",
      "Int. L",
    ]);
    expect(result.confidence).toBe("media");
  });

  it("supports destination 'all' without inferring values outside the table", () => {
    const result = convertClothingSize({
      profile: "hombre",
      garment: "pantalon",
      originRegion: "mx",
      originSize: "32",
      destinationRegion: "all",
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.primaryLabel).toBe("Int. M");
    expect(result.allLabels).toEqual({
      international: "M",
      us: "32",
      eu: "48",
      uk: "32",
      mx: "32",
    });
  });

  it("does not invent equivalences when the origin size is not in the table", () => {
    const result = convertClothingSize({
      profile: "mujer",
      garment: "vestido",
      originRegion: "us",
      originSize: "99",
      destinationRegion: "mx",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "no-origin-match",
      }),
    );
  });

  it("uses optional measurements only to refine confidence and guidance", () => {
    const base = convertClothingSize({
      profile: "mujer",
      garment: "top",
      originRegion: "international",
      originSize: "M",
      destinationRegion: "mx",
      fitPreference: "regular",
    });
    const refined = convertClothingSize({
      profile: "mujer",
      garment: "top",
      originRegion: "international",
      originSize: "M",
      destinationRegion: "mx",
      fitPreference: "holgado",
      measurements: { chest: 93 },
    });

    expect(base.ok).toBe(true);
    expect(refined.ok).toBe(true);

    if (!base.ok || !refined.ok) {
      return;
    }

    expect(refined.primaryLabel).toBe(base.primaryLabel);
    expect(refined.guide).toContain("revisa también Int. L");
  });
});

describe("estimation by measurements", () => {
  it("finds the closest row when measurements fall inside a range", () => {
    const result = estimateClothingSize({
      profile: "mujer",
      garment: "pantalon",
      destinationRegion: "mx",
      measurements: {
        waist: 73,
        hip: 100,
      },
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.primaryLabel).toBe("MX 29-30");
    expect(result.record.labels.international).toBe("M");
  });

  it("accepts inch inputs and displays ranges in inches", () => {
    const result = estimateClothingSize({
      profile: "hombre",
      garment: "pantalon",
      destinationRegion: "us",
      measurementUnit: "in",
      measurements: {
        waist: 32,
      },
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.primaryLabel).toBe("US 32");
    expect(
      result.measurements.find((measurement) => measurement.key === "waist")
        ?.value,
    ).toBe("31.9-33.9 in");
  });

  it("does not extrapolate when measurements are outside available ranges", () => {
    const result = estimateClothingSize({
      profile: "mujer",
      garment: "top",
      destinationRegion: "mx",
      measurements: {
        chest: 130,
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "no-measurement-match",
      }),
    );
  });

  it("rejects implausible measurements before matching", () => {
    const result = estimateClothingSize({
      profile: "mujer",
      garment: "top",
      destinationRegion: "mx",
      measurements: {
        chest: 20,
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "invalid-measurement",
      }),
    );
  });
});

describe("measurement formatting", () => {
  it("formats ranges in centimeters and inches", () => {
    expect(formatMeasurementRange({ minCm: 89, maxCm: 94 }, "cm")).toBe(
      "89-94 cm",
    );
    expect(formatMeasurementRange({ minCm: 89, maxCm: 94 }, "in")).toBe(
      "35-37 in",
    );
  });
});
