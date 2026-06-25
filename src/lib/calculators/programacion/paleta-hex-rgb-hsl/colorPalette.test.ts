import { describe, expect, it } from "vitest";
import {
  COLOR_SCALE_STEPS,
  buildCssVariables,
  calculateContrast,
  createColorFromHsl,
  createColorFromRgb,
  formatHslClassic,
  formatHslModern,
  formatRgbClassic,
  formatRgbModern,
  generateColorScale,
  parseColorInput,
  parseHexColor,
  recommendTextColor,
  rgbToHex,
  rgbToHsl,
  sanitizeCssVariableName,
} from "./colorPalette";

describe("color conversion", () => {
  it("converts white and black correctly", () => {
    const white = parseColorInput("#FFFFFF");
    const black = parseColorInput("#000000");

    expect(white).toEqual(
      expect.objectContaining({
        ok: true,
      }),
    );
    expect(black).toEqual(
      expect.objectContaining({
        ok: true,
      }),
    );

    if (white.ok) {
      expect(white.color.rgb).toEqual({ r: 255, g: 255, b: 255 });
    }

    if (black.ok) {
      expect(black.color.hsl).toEqual({ h: 0, s: 0, l: 0 });
    }
  });

  it("normalizes the default blue", () => {
    const result = parseColorInput("#0EA5E9");

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
      }),
    );

    if (result.ok) {
      expect(result.color.hex).toBe("#0EA5E9");
      expect(result.color.rgb).toEqual({ r: 14, g: 165, b: 233 });
      expect(result.color.hsl).toEqual({ h: 199, s: 89, l: 48 });
    }
  });

  it("expands short HEX and accepts HEX without #", () => {
    const short = parseColorInput("#FFF");
    const bare = parseColorInput("0EA5E9");

    expect(short.ok && short.color.hex).toBe("#FFFFFF");
    expect(bare.ok && bare.color.hex).toBe("#0EA5E9");
  });

  it("converts RGB to HEX", () => {
    expect(rgbToHex({ r: 14, g: 165, b: 233 })).toBe("#0EA5E9");
    expect(createColorFromRgb({ r: 14, g: 165, b: 233 }).hex).toBe(
      "#0EA5E9",
    );
  });

  it("converts HSL to RGB within the documented rounding margin", () => {
    const color = createColorFromHsl({ h: 199, s: 89, l: 48 });

    expect(color.rgb.r).toBeGreaterThanOrEqual(12);
    expect(color.rgb.r).toBeLessThanOrEqual(16);
    expect(color.rgb.g).toBeGreaterThanOrEqual(162);
    expect(color.rgb.g).toBeLessThanOrEqual(166);
    expect(color.rgb.b).toBeGreaterThanOrEqual(231);
    expect(color.rgb.b).toBeLessThanOrEqual(234);
  });

  it("keeps a HEX -> RGB -> HSL -> RGB round trip close", () => {
    const parsed = parseHexColor("#0EA5E9");

    expect(parsed.ok).toBe(true);

    if (parsed.ok) {
      const roundTrip = createColorFromHsl(rgbToHsl(parsed.color.rgb));

      expect(Math.abs(roundTrip.rgb.r - parsed.color.rgb.r)).toBeLessThanOrEqual(
        2,
      );
      expect(Math.abs(roundTrip.rgb.g - parsed.color.rgb.g)).toBeLessThanOrEqual(
        4,
      );
      expect(Math.abs(roundTrip.rgb.b - parsed.color.rgb.b)).toBeLessThanOrEqual(
        2,
      );
    }
  });
});

describe("CSS color formats", () => {
  it("parses classic and modern RGB", () => {
    const classic = parseColorInput("rgb(14, 165, 233)");
    const modern = parseColorInput("rgb(14 165 233)");

    expect(classic.ok && classic.color.hex).toBe("#0EA5E9");
    expect(modern.ok && modern.color.hex).toBe("#0EA5E9");
  });

  it("parses classic and modern HSL", () => {
    const classic = parseColorInput("hsl(199, 89%, 48%)");
    const modern = parseColorInput("hsl(199 89% 48%)");

    expect(classic.ok && classic.color.rgb.b).toBeGreaterThanOrEqual(231);
    expect(modern.ok && modern.color.rgb.b).toBeGreaterThanOrEqual(231);
  });

  it("formats CSS values for copying", () => {
    const color = createColorFromRgb({ r: 14, g: 165, b: 233 });

    expect(formatRgbClassic(color.rgb)).toBe("rgb(14, 165, 233)");
    expect(formatRgbModern(color.rgb)).toBe("rgb(14 165 233)");
    expect(formatHslClassic(color.hsl)).toBe("hsl(199, 89%, 48%)");
    expect(formatHslModern(color.hsl)).toBe("hsl(199 89% 48%)");
  });
});

describe("validation", () => {
  it("rejects invalid RGB, HSL and HEX values", () => {
    expect(parseColorInput("rgb(256 0 0)")).toEqual({
      ok: false,
      error: "invalid_rgb",
    });
    expect(parseColorInput("hsl(199 101% 48%)")).toEqual({
      ok: false,
      error: "invalid_hsl",
    });
    expect(parseColorInput("#FFFF")).toEqual({
      ok: false,
      error: "invalid_hex",
    });
  });

  it("does not treat unsupported text as a valid color", () => {
    expect(parseColorInput("blue")).toEqual({
      ok: false,
      error: "unsupported_format",
    });
  });
});

describe("contrast", () => {
  it("returns 21 for black and white", () => {
    const contrast = calculateContrast(
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
    );

    expect(contrast.ratio).toBe(21);
    expect(contrast.level).toBe("aaa");
  });

  it("classifies WCAG levels", () => {
    expect(
      calculateContrast({ r: 0, g: 0, b: 0 }, { r: 90, g: 90, b: 90 })
        .level,
    ).toBe("aa-large");
    expect(
      calculateContrast({ r: 0, g: 0, b: 0 }, { r: 118, g: 118, b: 118 })
        .passesAANormal,
    ).toBe(true);
    expect(
      calculateContrast({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
        .passesAAA,
    ).toBe(true);
  });

  it("recommends the better text color", () => {
    const darkBackground = recommendTextColor({ r: 12, g: 74, b: 110 });
    const lightBackground = recommendTextColor({ r: 240, g: 249, b: 255 });

    expect(darkBackground.color).toBe("#FFFFFF");
    expect(lightBackground.color).toBe("#000000");
    expect(darkBackground.passesAANormal).toBe(true);
    expect(lightBackground.passesAANormal).toBe(true);
  });
});

describe("scale and export", () => {
  it("generates exactly the 50-900 scale", () => {
    const color = createColorFromRgb({ r: 14, g: 165, b: 233 });
    const scale = generateColorScale(color);

    expect(Object.keys(scale).map(Number)).toEqual(COLOR_SCALE_STEPS);
    expect(scale[500].hex).toBe("#0EA5E9");

    COLOR_SCALE_STEPS.forEach((step) => {
      expect(scale[step].hex).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it("exports CSS variables using a sanitized name", () => {
    const color = createColorFromRgb({ r: 14, g: 165, b: 233 });
    const css = buildCssVariables(color, "Primary Color");

    expect(css).toContain("--color-primary-color: #0EA5E9;");
    expect(css).toContain("--color-primary-color-rgb: 14 165 233;");
    expect(css).toContain("--color-primary-color-hsl: 199 89% 48%;");
    expect(css).toContain("--color-primary-color-50:");
    expect(css).toContain("--color-primary-color-900:");
    expect(css).toContain(".button-primary-color");
  });

  it("keeps CSS variable names valid", () => {
    expect(sanitizeCssVariableName("  Main UI  ")).toBe("main-ui");
    expect(sanitizeCssVariableName("123")).toBe("primary-123");
    expect(sanitizeCssVariableName("")).toBe("primary");
  });
});

describe("shareable URL input", () => {
  it("can initialize from a color query value without #", () => {
    const params = new URLSearchParams("?color=0EA5E9");
    const result = parseColorInput(params.get("color") ?? "");

    expect(result.ok && result.color.hex).toBe("#0EA5E9");
  });

  it("ignores invalid query values at parse level", () => {
    expect(parseColorInput("not-a-color")).toEqual({
      ok: false,
      error: "unsupported_format",
    });
  });
});
