import {
  calculateBrickEstimate as calculateBrickEstimateEs,
  type BrickEstimateInput,
  type BrickEstimateResult,
  type BrickPreset,
  type BrickPresetConfig,
  parseBrickNumberInput,
} from "./bricks";

export const BRICK_CANONICAL_PATH = "/en/construction/brick-calculator";
export { parseBrickNumberInput };

export const BRICK_PRESET_CONFIG: Record<BrickPreset, BrickPresetConfig> = {
  custom: { label: "Custom", shortLabel: "Custom", note: "Enter any size" },
  "red-brick": {
    label: "Common red brick",
    shortLabel: "Red brick",
    lengthCm: 20,
    heightCm: 10,
    thicknessCm: 6,
    note: "Generic reference",
  },
  "block-10": {
    label: "4-inch block",
    shortLabel: "4-inch block",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 10,
    note: "Concrete block",
  },
  "block-12": {
    label: "5-inch block",
    shortLabel: "5-inch block",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 12,
    note: "Concrete block",
  },
  "block-15": {
    label: "6-inch block",
    shortLabel: "6-inch block",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 15,
    note: "Concrete block",
  },
  "block-20": {
    label: "8-inch block",
    shortLabel: "8-inch block",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 20,
    note: "Concrete block",
  },
};

export function calculateBrickEstimate(input: BrickEstimateInput) {
  try {
    const result = calculateBrickEstimateEs(input);
    return { ...result, warnings: result.warnings.map(translateWarning) };
  } catch {
    throw new RangeError("Check the entered values.");
  }
}

export function formatBrickNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatBrickFixedNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatBrickCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildBrickShareText(
  result: BrickEstimateResult,
  input: BrickEstimateInput,
) {
  const preset = BRICK_PRESET_CONFIG[input.piece.preset];
  const lines = [
    "Brick calculator:",
    `Gross wall area: ${formatBrickFixedNumber(result.wallArea)} m²`,
    `Opening area: ${formatBrickFixedNumber(result.openingArea)} m²`,
    `Net area: ${formatBrickFixedNumber(result.netArea)} m²`,
    `Unit: ${preset.shortLabel} (${formatBrickFixedNumber(result.module.lengthMeters * 100, 1)} × ${formatBrickFixedNumber(result.module.heightMeters * 100, 1)} cm)`,
    `Joint: ${formatBrickFixedNumber(result.module.verticalJointMeters * 100, 1)} cm vertical / ${formatBrickFixedNumber(result.module.horizontalJointMeters * 100, 1)} cm horizontal`,
    `Waste allowance: ${formatBrickNumber(input.wastePercentage)}%`,
    `Net units: ${result.netPieces}`,
    `Units to buy: ${result.purchasePieces}`,
  ];
  if (typeof result.packages === "number" && typeof result.piecesPerPackage === "number") {
    lines.push(
      `Packages: ${result.packages} of ${result.piecesPerPackage} units`,
      `Package-rounded units: ${result.roundedPurchasePieces}`,
    );
  }
  if (typeof result.estimatedCost === "number") {
    lines.push(`Estimated cost: ${formatBrickCurrency(result.estimatedCost)}`);
  }
  if (result.mortar) {
    lines.push(
      `Approximate mortar: ${formatBrickFixedNumber(result.mortar.purchaseVolume, 3)} m³`,
    );
  }
  if (result.warnings.length) {
    lines.push("", "Warnings:", ...result.warnings.map((warning) => `- ${warning}`));
  }
  lines.push(
    "",
    "Planning estimate only. Check actual dimensions, bond pattern, cuts and site conditions before buying.",
  );
  return lines.join("\n");
}

export function buildBrickCsv(result: BrickEstimateResult) {
  const rows: string[][] = [
    ["type", "name", "quantity", "width_m", "height_m", "area_m2"],
    ...result.walls.map((wall) => areaRow("wall", wall)),
    ...result.openings.map((opening) => areaRow("opening", opening)),
    ["SUMMARY", "gross_wall_area", "", "", "", csvNumber(result.wallArea)],
    ["SUMMARY", "opening_area", "", "", "", csvNumber(result.openingArea)],
    ["SUMMARY", "net_area", "", "", "", csvNumber(result.netArea)],
    ["SUMMARY", "units_per_m2", "", "", "", csvNumber(result.module.piecesPerM2)],
    ["SUMMARY", "net_units", String(result.netPieces), "", "", ""],
    ["SUMMARY", "units_to_buy", String(result.purchasePieces), "", "", ""],
    ["SUMMARY", "rounded_units", String(result.roundedPurchasePieces), "", "", ""],
  ];
  if (typeof result.packages === "number") {
    rows.push(["SUMMARY", "packages", String(result.packages), "", "", ""]);
  }
  if (typeof result.estimatedCost === "number") {
    rows.push(["SUMMARY", "estimated_cost", csvNumber(result.estimatedCost), "", "", ""]);
  }
  if (result.mortar) {
    rows.push(["SUMMARY", "mortar_m3", csvNumber(result.mortar.purchaseVolume), "", "", ""]);
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function translateWarning(warning: string) {
  const translations: Record<string, string> = {
    "El area de aberturas supera el area de muros; revisa las medidas.":
      "The opening area exceeds the wall area; check the measurements.",
    "El area neta es cero, por eso no se sugieren piezas.":
      "The net area is zero, so no units are suggested.",
    "El desperdicio es mayor a 30%; revisa si el margen es intencional.":
      "The waste allowance is above 30%; check that this margin is intentional.",
    "La junta supera 2 cm; revisa si la medida es correcta.":
      "The joint is wider than 2 cm; check that the measurement is correct.",
    "El mortero para blocks huecos puede variar por celdas, refuerzos y colocacion.":
      "Mortar use for hollow blocks may vary with cells, reinforcement and installation.",
  };
  return translations[warning] ?? "Check the measurements and assumptions.";
}

function areaRow(
  type: string,
  item: BrickEstimateResult["walls"][number],
): string[] {
  return [
    type,
    item.name,
    String(item.quantity),
    csvNumber(item.widthMeters),
    csvNumber(item.heightMeters),
    csvNumber(item.area),
  ];
}

function csvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
