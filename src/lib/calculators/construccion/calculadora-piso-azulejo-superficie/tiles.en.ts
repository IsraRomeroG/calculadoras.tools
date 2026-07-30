import {
  calculateTileEstimate as calculateTileEstimateEs,
  type TileEstimateInput,
  type TileEstimateResult,
  type TilePattern,
  type TilePatternConfig,
  parseTileNumberInput,
} from "./tiles";

export const TILE_CANONICAL_PATH = "/en/construction/tile-calculator";
export { parseTileNumberInput };

export const TILE_PATTERN_CONFIG: Record<TilePattern, TilePatternConfig> = {
  straight: {
    label: "Straight",
    suggestedWastePercentage: 10,
    note: "Common baseline",
  },
  diagonal: {
    label: "Diagonal",
    suggestedWastePercentage: 15,
    note: "More perimeter cuts",
  },
  herringbone: {
    label: "Herringbone",
    suggestedWastePercentage: 18,
    note: "Pattern with more cuts",
  },
  "many-cuts": {
    label: "Many cuts",
    suggestedWastePercentage: 20,
    note: "Irregular or narrow areas",
  },
  custom: {
    label: "Custom",
    note: "Keep the entered value",
  },
};

export function calculateTileEstimate(input: TileEstimateInput) {
  try {
    const result = calculateTileEstimateEs(input);
    return { ...result, warnings: result.warnings.map(translateWarning) };
  } catch {
    throw new RangeError("Check the entered values.");
  }
}

export function formatTileNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatTileFixedNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatTileCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildTileShareText(
  result: TileEstimateResult,
  input: TileEstimateInput,
) {
  const pattern = TILE_PATTERN_CONFIG[input.pattern];
  const boxLabel =
    input.box.mode === "pieces"
      ? `${input.box.piecesPerBox} pieces per box`
      : `${formatTileFixedNumber(input.box.areaPerBoxM2)} m² per box`;
  const lines = [
    "Floor and wall tile calculator:",
    `Boxes to buy: ${result.boxes}`,
    `Net area: ${formatTileFixedNumber(result.netArea)} m²`,
    `Area with waste: ${formatTileFixedNumber(result.purchaseArea)} m²`,
    `Required pieces: ${result.requiredPieces}`,
    `Purchased coverage: ${formatTileFixedNumber(result.purchasedArea)} m²`,
    `Estimated surplus: ${formatTileFixedNumber(result.surplusArea)} m²`,
    `Tile: ${formatTileFixedNumber(input.piece.lengthCm, 1)} × ${formatTileFixedNumber(input.piece.widthCm, 1)} cm`,
    `Pattern: ${pattern.label}`,
    `Waste allowance: ${formatTileNumber(input.wastePercentage)}%`,
    `Box: ${boxLabel}`,
  ];
  if (typeof result.surplusPieces === "number") {
    lines.push(`Surplus pieces: ${result.surplusPieces}`);
  } else if (typeof result.estimatedSurplusPieces === "number") {
    lines.push(`Estimated surplus pieces: ${result.estimatedSurplusPieces}`);
  }
  if (typeof result.totalCost === "number") {
    lines.push(`Total cost: ${formatTileCurrency(result.totalCost)}`);
  }
  if (result.warnings.length) {
    lines.push("", "Warnings:", ...result.warnings.map((warning) => `- ${warning}`));
  }
  lines.push(
    "",
    "Planning estimate only. Check cuts, batch, shade, broken pieces and site conditions before buying.",
  );
  return lines.join("\n");
}

export function buildTileCsv(
  result: TileEstimateResult,
  _input: TileEstimateInput,
) {
  const rows: string[][] = [
    ["type", "name", "mode", "quantity", "length_m", "width_m", "area_m2"],
    ...result.surfaces.map((surface) => areaRow("surface", surface)),
    ...result.deductions.map((deduction) => areaRow("deduction", deduction)),
    ["SUMMARY", "gross_area_m2", "", "", "", "", csvNumber(result.grossArea)],
    ["SUMMARY", "deduction_area_m2", "", "", "", "", csvNumber(result.deductionArea)],
    ["SUMMARY", "net_area_m2", "", "", "", "", csvNumber(result.netArea)],
    ["SUMMARY", "area_with_waste_m2", "", "", "", "", csvNumber(result.purchaseArea)],
    ["SUMMARY", "required_pieces", String(result.requiredPieces), "", "", "", ""],
    ["SUMMARY", "boxes", String(result.boxes), "", "", "", ""],
    ["SUMMARY", "purchased_coverage_m2", "", "", "", "", csvNumber(result.purchasedArea)],
    ["SUMMARY", "surplus_m2", "", "", "", "", csvNumber(result.surplusArea)],
  ];
  if (typeof result.totalCost === "number") {
    rows.push(["SUMMARY", "total_cost", csvNumber(result.totalCost), "", "", "", ""]);
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function translateWarning(warning: string) {
  if (warning.includes("area de descuentos supera")) {
    return "The deduction area exceeds the surface area; check the measurements.";
  }
  if (warning.includes("area neta es cero")) {
    return "The net area is zero, so no pieces are suggested.";
  }
  if (warning.includes("desperdicio es mayor")) {
    return "The waste allowance is above 30%; check that this margin is intentional.";
  }
  if (warning.includes("desperdicio es menor")) {
    return "The waste allowance is below the suggestion for this pattern.";
  }
  if (warning.includes("tamano de pieza")) {
    return "The tile size looks unusual; check its dimensions.";
  }
  if (warning.includes("cobertura por caja")) {
    return "The coverage per box looks unusual; check the product label.";
  }
  return "Check the measurements and assumptions.";
}

function areaRow(
  type: string,
  item: TileEstimateResult["surfaces"][number],
): string[] {
  return [
    type,
    item.name,
    item.mode,
    String(item.quantity),
    typeof item.lengthMeters === "number" ? csvNumber(item.lengthMeters) : "",
    typeof item.widthMeters === "number" ? csvNumber(item.widthMeters) : "",
    csvNumber(item.area),
  ];
}

function csvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
