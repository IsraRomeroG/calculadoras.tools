export const DEFAULT_COLOR_HEX = "#0EA5E9";
export const DEFAULT_VARIABLE_NAME = "primary";

export const COLOR_SCALE_STEPS = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
] as const;

export type ColorScaleStep = (typeof COLOR_SCALE_STEPS)[number];
export type ColorFormat = "hex" | "rgb" | "hsl";
export type ContrastLevel = "fail" | "aa-large" | "aa-normal" | "aaa";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface ParsedColor {
  format: ColorFormat;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
}

export type ColorParseErrorCode =
  | "empty"
  | "invalid_hex"
  | "invalid_rgb"
  | "invalid_hsl"
  | "unsupported_format";

export interface ColorParseSuccess {
  ok: true;
  color: ParsedColor;
}

export interface ColorParseFailure {
  ok: false;
  error: ColorParseErrorCode;
}

export type ColorParseResult = ColorParseSuccess | ColorParseFailure;

export type ColorScale = Record<ColorScaleStep, ParsedColor>;

export interface ContrastResult {
  ratio: number;
  level: ContrastLevel;
  passesAALarge: boolean;
  passesAANormal: boolean;
  passesAAA: boolean;
}

export interface TextColorRecommendation {
  color: "#000000" | "#FFFFFF";
  contrast: ContrastResult;
  blackContrast: ContrastResult;
  whiteContrast: ContrastResult;
  passesAANormal: boolean;
}

const HEX_PATTERN = /^#?[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const RGB_FUNCTION_PATTERN = /^rgb\((.*)\)$/i;
const HSL_FUNCTION_PATTERN = /^hsl\((.*)\)$/i;

const SCALE_MIX_AMOUNTS: Record<ColorScaleStep, number> = {
  50: 0.92,
  100: 0.84,
  200: 0.68,
  300: 0.52,
  400: 0.28,
  500: 0,
  600: 0.12,
  700: 0.28,
  800: 0.44,
  900: 0.6,
};

export function parseColorInput(rawValue: string): ColorParseResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, error: "empty" };
  }

  if (looksLikeRgbFunction(value)) {
    return parseRgbFunction(value);
  }

  if (looksLikeHslFunction(value)) {
    return parseHslFunction(value);
  }

  if (value.startsWith("#") || /^[0-9a-f]+$/i.test(value)) {
    return parseHexColor(value);
  }

  return { ok: false, error: "unsupported_format" };
}

export function parseHexColor(rawValue: string): ColorParseResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, error: "empty" };
  }

  if (!HEX_PATTERN.test(value)) {
    return { ok: false, error: "invalid_hex" };
  }

  const hexDigits = value.replace(/^#/, "");
  const expanded =
    hexDigits.length === 3
      ? hexDigits
          .split("")
          .map((digit) => `${digit}${digit}`)
          .join("")
      : hexDigits;
  const hex = `#${expanded.toUpperCase()}`;
  const rgb = hexToRgb(hex);

  return {
    ok: true,
    color: {
      format: "hex",
      hex,
      rgb,
      hsl: rgbToHsl(rgb),
    },
  };
}

export function createColorFromRgb(rgb: RgbColor): ParsedColor {
  const normalized = normalizeRgb(rgb);
  const hex = rgbToHex(normalized);

  return {
    format: "rgb",
    hex,
    rgb: normalized,
    hsl: rgbToHsl(normalized),
  };
}

export function createColorFromHsl(hsl: HslColor): ParsedColor {
  const normalized = normalizeHsl(hsl);
  const rgb = hslToRgb(normalized);

  return {
    format: "hsl",
    hex: rgbToHex(rgb),
    rgb,
    hsl: normalized,
  };
}

export function hexToRgb(hex: string): RgbColor {
  const normalized = hex.replace(/^#/, "");

  if (!/^[0-9A-F]{6}$/i.test(normalized)) {
    throw new RangeError("HEX must contain exactly 6 hexadecimal digits.");
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex(rgb: RgbColor): string {
  const normalized = normalizeRgb(rgb);

  return `#${toHexChannel(normalized.r)}${toHexChannel(
    normalized.g,
  )}${toHexChannel(normalized.b)}`;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const { r, g, b } = normalizeRgb(rgb);
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: roundToInt(lightness * 100) };
  }

  const saturation =
    lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);
  let hue = 0;

  if (max === r1) {
    hue = (g1 - b1) / delta + (g1 < b1 ? 6 : 0);
  } else if (max === g1) {
    hue = (b1 - r1) / delta + 2;
  } else {
    hue = (r1 - g1) / delta + 4;
  }

  return {
    h: normalizeHue(roundToInt(hue * 60)),
    s: roundToInt(saturation * 100),
    l: roundToInt(lightness * 100),
  };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const { h, s, l } = normalizeHsl(hsl);
  const h1 = h / 360;
  const s1 = s / 100;
  const l1 = l / 100;

  if (s1 === 0) {
    const channel = roundToInt(l1 * 255);

    return { r: channel, g: channel, b: channel };
  }

  const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
  const p = 2 * l1 - q;

  return {
    r: roundToInt(hueToRgb(p, q, h1 + 1 / 3) * 255),
    g: roundToInt(hueToRgb(p, q, h1) * 255),
    b: roundToInt(hueToRgb(p, q, h1 - 1 / 3) * 255),
  };
}

export function formatRgbClassic(rgb: RgbColor): string {
  const normalized = normalizeRgb(rgb);

  return `rgb(${normalized.r}, ${normalized.g}, ${normalized.b})`;
}

export function formatRgbModern(rgb: RgbColor): string {
  const normalized = normalizeRgb(rgb);

  return `rgb(${normalized.r} ${normalized.g} ${normalized.b})`;
}

export function formatRgbChannels(rgb: RgbColor): string {
  const normalized = normalizeRgb(rgb);

  return `${normalized.r} ${normalized.g} ${normalized.b}`;
}

export function formatHslClassic(hsl: HslColor): string {
  const normalized = normalizeHsl(hsl);

  return `hsl(${normalized.h}, ${normalized.s}%, ${normalized.l}%)`;
}

export function formatHslModern(hsl: HslColor): string {
  const normalized = normalizeHsl(hsl);

  return `hsl(${normalized.h} ${normalized.s}% ${normalized.l}%)`;
}

export function formatHslChannels(hsl: HslColor): string {
  const normalized = normalizeHsl(hsl);

  return `${normalized.h} ${normalized.s}% ${normalized.l}%`;
}

export function generateColorScale(color: ParsedColor): ColorScale {
  return Object.fromEntries(
    COLOR_SCALE_STEPS.map((step) => {
      if (step === 500) {
        return [step, color];
      }

      const amount = SCALE_MIX_AMOUNTS[step];
      const target = step < 500 ? WHITE_RGB : BLACK_RGB;
      const rgb = mixRgb(color.rgb, target, amount);

      return [step, createColorFromRgb(rgb)];
    }),
  ) as ColorScale;
}

export function calculateContrast(
  first: RgbColor,
  second: RgbColor,
): ContrastResult {
  const firstLuminance = getRelativeLuminance(first);
  const secondLuminance = getRelativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  const ratio = roundTo((lighter + 0.05) / (darker + 0.05), 2);

  return {
    ratio,
    level: getContrastLevel(ratio),
    passesAALarge: ratio >= 3,
    passesAANormal: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}

export function getRelativeLuminance(rgb: RgbColor): number {
  const { r, g, b } = normalizeRgb(rgb);
  const [rLinear, gLinear, bLinear] = [r, g, b].map((channel) => {
    const srgb = channel / 255;

    return srgb <= 0.03928
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

export function recommendTextColor(background: RgbColor): TextColorRecommendation {
  const blackContrast = calculateContrast(background, BLACK_RGB);
  const whiteContrast = calculateContrast(background, WHITE_RGB);
  const useBlack = blackContrast.ratio >= whiteContrast.ratio;
  const contrast = useBlack ? blackContrast : whiteContrast;

  return {
    color: useBlack ? "#000000" : "#FFFFFF",
    contrast,
    blackContrast,
    whiteContrast,
    passesAANormal: contrast.passesAANormal,
  };
}

export function buildCssVariables(
  color: ParsedColor,
  variableName = DEFAULT_VARIABLE_NAME,
): string {
  const name = sanitizeCssVariableName(variableName);
  const scale = generateColorScale(color);
  const recommendation = recommendTextColor(color.rgb);
  const lines = [
    ":root {",
    `  --color-${name}: ${color.hex};`,
    `  --color-${name}-rgb: ${formatRgbChannels(color.rgb)};`,
    `  --color-${name}-hsl: ${formatHslChannels(color.hsl)};`,
  ];

  COLOR_SCALE_STEPS.forEach((step) => {
    lines.push(`  --color-${name}-${step}: ${scale[step].hex};`);
  });

  lines.push("}", "");
  lines.push(`.button-${name} {`);
  lines.push(`  background: var(--color-${name});`);
  lines.push(`  color: ${recommendation.color};`);
  lines.push("}");

  return lines.join("\n");
}

export function sanitizeCssVariableName(rawName: string): string {
  const normalized = rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/-{2,}/g, "-");

  if (!normalized) {
    return DEFAULT_VARIABLE_NAME;
  }

  if (/^[0-9]/.test(normalized)) {
    return `${DEFAULT_VARIABLE_NAME}-${normalized}`;
  }

  return normalized;
}

export function getColorErrorMessage(failure: ColorParseFailure): string {
  switch (failure.error) {
    case "empty":
      return "";
    case "invalid_hex":
      return "Usa HEX de 3 o 6 digitos, por ejemplo #0EA5E9.";
    case "invalid_rgb":
      return "Usa RGB con canales entre 0 y 255, por ejemplo rgb(14 165 233).";
    case "invalid_hsl":
      return "Usa HSL con H entre 0 y 360 y S/L entre 0% y 100%.";
    case "unsupported_format":
      return "Usa un color HEX, rgb(...) o hsl(...).";
  }
}

function parseRgbFunction(value: string): ColorParseResult {
  const match = value.match(RGB_FUNCTION_PATTERN);
  const content = match?.[1];

  if (content === undefined || content.includes("/")) {
    return { ok: false, error: "invalid_rgb" };
  }

  const parts = splitCssColorFunction(content);

  if (parts.length !== 3) {
    return { ok: false, error: "invalid_rgb" };
  }

  const channels = parts.map((part) => parseNumberToken(part));

  if (
    channels.some(
      (channel) =>
        channel === null ||
        !Number.isInteger(channel) ||
        channel < 0 ||
        channel > 255,
    )
  ) {
    return { ok: false, error: "invalid_rgb" };
  }

  const [r, g, b] = channels as [number, number, number];
  const color = createColorFromRgb({ r, g, b });

  return { ok: true, color: { ...color, format: "rgb" } };
}

function parseHslFunction(value: string): ColorParseResult {
  const match = value.match(HSL_FUNCTION_PATTERN);
  const content = match?.[1];

  if (content === undefined || content.includes("/")) {
    return { ok: false, error: "invalid_hsl" };
  }

  const parts = splitCssColorFunction(content);

  if (parts.length !== 3) {
    return { ok: false, error: "invalid_hsl" };
  }

  const h = parseNumberToken(parts[0]);
  const s = parsePercentageToken(parts[1]);
  const l = parsePercentageToken(parts[2]);

  if (
    h === null ||
    s === null ||
    l === null ||
    h < 0 ||
    h > 360 ||
    s < 0 ||
    s > 100 ||
    l < 0 ||
    l > 100
  ) {
    return { ok: false, error: "invalid_hsl" };
  }

  const color = createColorFromHsl({ h, s, l });

  return { ok: true, color: { ...color, format: "hsl" } };
}

function splitCssColorFunction(content: string): string[] {
  const trimmed = content.trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.includes(",")) {
    return trimmed.split(",").map((part) => part.trim());
  }

  return trimmed.split(/\s+/).map((part) => part.trim());
}

function parseNumberToken(token: string): number | null {
  if (!/^\d+(?:\.\d+)?$/.test(token)) {
    return null;
  }

  const value = Number(token);

  return Number.isFinite(value) ? value : null;
}

function parsePercentageToken(token: string): number | null {
  if (!/^\d+(?:\.\d+)?%$/.test(token)) {
    return null;
  }

  return parseNumberToken(token.slice(0, -1));
}

function normalizeRgb(rgb: RgbColor): RgbColor {
  return {
    r: clampChannel(rgb.r),
    g: clampChannel(rgb.g),
    b: clampChannel(rgb.b),
  };
}

function normalizeHsl(hsl: HslColor): HslColor {
  return {
    h: normalizeHue(hsl.h),
    s: clampPercent(hsl.s),
    l: clampPercent(hsl.l),
  };
}

function normalizeHue(hue: number): number {
  if (!Number.isFinite(hue)) {
    return 0;
  }

  if (hue === 360) {
    return 360;
  }

  return ((roundToInt(hue) % 360) + 360) % 360;
}

function clampChannel(value: number): number {
  return clamp(roundToInt(value), 0, 255);
}

function clampPercent(value: number): number {
  return clamp(roundToInt(value), 0, 100);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toHexChannel(channel: number): string {
  return channel.toString(16).padStart(2, "0").toUpperCase();
}

function roundToInt(value: number): number {
  return Math.round(value);
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
}

function hueToRgb(p: number, q: number, rawT: number): number {
  let t = rawT;

  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }

  if (t < 1 / 2) {
    return q;
  }

  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }

  return p;
}

function mixRgb(first: RgbColor, second: RgbColor, amount: number): RgbColor {
  return {
    r: first.r + (second.r - first.r) * amount,
    g: first.g + (second.g - first.g) * amount,
    b: first.b + (second.b - first.b) * amount,
  };
}

function getContrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) {
    return "aaa";
  }

  if (ratio >= 4.5) {
    return "aa-normal";
  }

  if (ratio >= 3) {
    return "aa-large";
  }

  return "fail";
}

function looksLikeRgbFunction(value: string): boolean {
  return RGB_FUNCTION_PATTERN.test(value);
}

function looksLikeHslFunction(value: string): boolean {
  return HSL_FUNCTION_PATTERN.test(value);
}

const BLACK_RGB: RgbColor = { r: 0, g: 0, b: 0 };
const WHITE_RGB: RgbColor = { r: 255, g: 255, b: 255 };
