import {
  calculateConcreteVolume as calculateConcreteVolumeEs,
  type ConcreteEstimateInput,
  type ConcretePreset,
  type ConcretePresetConfig,
  type ConcreteVolumeResult,
  parseConcreteNumberInput,
} from "./concreteVolume";

export const CONCRETE_VOLUME_CANONICAL_PATH =
  "/en/construction/concrete-volume-calculator";

export { parseConcreteNumberInput };

export const CONCRETE_PRESET_CONFIG: Record<
  ConcretePreset,
  ConcretePresetConfig
> = {
  slab: {
    label: "Slab",
    defaultName: "Slab",
    shape: "rectangular-prism",
    dimensionLabels: ["Length", "Width", "Thickness"],
    defaultUnits: ["m", "m", "cm"],
  },
  "rectangular-column": {
    label: "Rectangular column",
    defaultName: "Column",
    shape: "rectangular-prism",
    dimensionLabels: ["Width", "Depth", "Height"],
    defaultUnits: ["cm", "cm", "m"],
  },
  "circular-column": {
    label: "Circular column",
    defaultName: "Circular column",
    shape: "cylinder",
    dimensionLabels: ["Diameter", "Height"],
    defaultUnits: ["cm", "m"],
  },
  beam: {
    label: "Beam",
    defaultName: "Beam",
    shape: "rectangular-prism",
    dimensionLabels: ["Length", "Width", "Height"],
    defaultUnits: ["m", "cm", "cm"],
  },
  custom: {
    label: "Other",
    defaultName: "Section",
    shape: "rectangular-prism",
    dimensionLabels: ["Length", "Width", "Height"],
    defaultUnits: ["m", "m", "m"],
  },
};

export function calculateConcreteVolume(
  input: ConcreteEstimateInput,
): ConcreteVolumeResult {
  try {
    const result = calculateConcreteVolumeEs(input);
    return {
      ...result,
      warnings: result.warnings.map(translateConcreteWarning),
    };
  } catch {
    throw new RangeError("Check the entered values.");
  }
}

export function formatConcreteNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatConcreteCompactNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function formatConcreteCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildConcreteShareText(
  result: ConcreteVolumeResult,
  input: ConcreteEstimateInput,
) {
  const lines = [
    "Concrete calculator:",
    `Net volume: ${formatConcreteNumber(result.netVolume)} m³`,
    `Waste allowance: ${formatConcreteCompactNumber(input.wastePercentage)}%`,
    `Volume to order: ${formatConcreteNumber(result.totalVolume)} m³`,
  ];

  if (input.mode === "bags" && typeof result.bagCount === "number") {
    lines.push(`Estimated purchase: ${result.bagCount} bags`);
    if (typeof result.boughtVolumeFromBags === "number") {
      lines.push(
        `Purchased volume: ${formatConcreteNumber(result.boughtVolumeFromBags)} m³`,
      );
    }
    if (typeof result.bagSurplus === "number") {
      lines.push(
        `Estimated surplus: ${formatConcreteNumber(result.bagSurplus)} m³`,
      );
    }
  } else {
    lines.push(`Suggested order: ${formatConcreteNumber(result.totalVolume)} m³`);
  }

  if (typeof result.concreteCost === "number") {
    lines.push(`Ready-mix cost: ${formatConcreteCurrency(result.concreteCost)}`);
  }
  if (typeof result.bagCost === "number") {
    lines.push(`Bag cost: ${formatConcreteCurrency(result.bagCost)}`);
  }

  lines.push("", "Sections:");
  result.sections.forEach((section) => {
    lines.push(
      `- ${section.name}: ${formatConcreteNumber(section.volume)} m³ (${section.quantity}x)`,
    );
  });
  if (result.warnings.length) {
    lines.push("", "Warnings:", ...result.warnings.map((warning) => `- ${warning}`));
  }
  lines.push(
    "",
    "Planning estimate only. Check the manufacturer's yield and consult a professional for structural work.",
  );
  return lines.join("\n");
}

export function buildConcreteCsv(result: ConcreteVolumeResult) {
  const rows = [
    ["section", "shape", "quantity", "volume_m3", "percent_of_total"],
    ...result.sections.map((section) => [
      section.name,
      section.shape === "cylinder" ? "cylinder" : "rectangular prism",
      String(section.quantity),
      csvNumber(section.volume),
      csvNumber(section.sharePercentage),
    ]),
    ["NET_TOTAL", "", "", csvNumber(result.netVolume), "100"],
    ["TOTAL_WITH_WASTE", "", "", csvNumber(result.totalVolume), ""],
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function translateConcreteWarning(warning: string) {
  if (warning.startsWith("El volumen supera 50")) {
    return "The volume exceeds 50 m³; double-check the measurements and delivery logistics.";
  }
  if (warning.startsWith("El desperdicio es mayor")) {
    return "The waste allowance is above 30%; check that this margin is intentional.";
  }
  if (warning.includes("el espesor de losa parece inusual")) {
    return warning
      .replace(": el espesor de losa parece inusual", ": the slab thickness looks unusual")
      .replace(",", ".");
  }
  if (warning.startsWith("El rendimiento por saco")) {
    return "The yield per bag looks unusual; check the manufacturer's specifications.";
  }
  return "Check the measurements and assumptions.";
}

function csvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
