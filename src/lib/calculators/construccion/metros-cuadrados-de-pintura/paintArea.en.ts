import {
  buildPaintShareUrl as buildPaintShareUrlEs,
  calculateManualPaintArea,
  calculateOpeningArea,
  calculatePaintContainers,
  calculatePaintLiters,
  calculateRoomPaintArea,
  type PaintShareTextInput,
  type ShareUrlInput,
  parseMeasurementInput,
  parseOpeningMeasurementInput,
} from "./paintArea";

export const PAINT_AREA_CANONICAL_PATH = "/en/construction/paint-calculator";

export {
  calculateManualPaintArea,
  calculateOpeningArea,
  calculatePaintContainers,
  calculatePaintLiters,
  calculateRoomPaintArea,
  parseMeasurementInput,
  parseOpeningMeasurementInput,
};

export function formatPaintNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatPaintCompactNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function buildPaintShareText(input: PaintShareTextInput): string {
  const lines = [
    "Paint calculator:",
    `Net area: ${formatPaintNumber(input.netArea)} m²`,
    `${input.coats} coat${input.coats === 1 ? "" : "s"}: ${formatPaintNumber(input.accumulatedArea)} m² accumulated`,
    `Coverage: ${formatPaintNumber(input.coverage)} m²/L`,
    `Base paint: ${formatPaintNumber(input.litersBase)} L`,
    `With a ${formatPaintCompactNumber(input.marginPercentage)}% margin: ${formatPaintNumber(input.litersWithMargin)} L`,
  ];

  if (typeof input.wallArea === "number") {
    lines.splice(1, 0, `Walls: ${formatPaintNumber(input.wallArea)} m²`);
  }
  if (typeof input.ceilingArea === "number" && input.ceilingArea > 0) {
    lines.splice(2, 0, `Ceiling: ${formatPaintNumber(input.ceilingArea)} m²`);
  }
  if (typeof input.openingArea === "number" && input.openingArea > 0) {
    lines.splice(
      3,
      0,
      `Doors and windows: -${formatPaintNumber(input.openingArea)} m²`,
    );
  }
  if (input.containers) {
    lines.push(
      `Estimated purchase: ${input.containers.containers} container${input.containers.containers === 1 ? "" : "s"} of ${formatPaintCompactNumber(input.containers.containerSize)} L`,
      `Total purchased: ${formatPaintNumber(input.containers.litersBought)} L`,
      `Estimated surplus: ${formatPaintNumber(input.containers.litersSurplus)} L`,
    );
  }
  lines.push(
    "This is an estimate. Check the coverage stated by the manufacturer before buying.",
  );
  return lines.join("\n");
}

export function buildPaintShareUrl(input: ShareUrlInput): string {
  const spanishPath = buildPaintShareUrlEs(input);
  const queryIndex = spanishPath.indexOf("?");
  return queryIndex === -1
    ? PAINT_AREA_CANONICAL_PATH
    : `${PAINT_AREA_CANONICAL_PATH}${spanishPath.slice(queryIndex)}`;
}
