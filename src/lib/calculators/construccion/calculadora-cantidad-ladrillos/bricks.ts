export const BRICK_CANONICAL_PATH =
  "/construccion/calculadora-cantidad-ladrillos";

export const BRICK_UNITS = ["m", "cm"] as const;
export const BRICK_PRESETS = [
  "custom",
  "red-brick",
  "block-10",
  "block-12",
  "block-15",
  "block-20",
] as const;

export type BrickUnit = (typeof BRICK_UNITS)[number];
export type BrickPreset = (typeof BRICK_PRESETS)[number];

export interface BrickDimension {
  value: number;
  unit: BrickUnit;
}

export interface BrickWallInput {
  name: string;
  width: BrickDimension;
  height: BrickDimension;
  quantity: number;
}

export interface BrickOpeningInput {
  name: string;
  width: BrickDimension;
  height: BrickDimension;
  quantity: number;
}

export interface BrickPieceInput {
  preset: BrickPreset;
  length: BrickDimension;
  height: BrickDimension;
  thickness?: BrickDimension;
  horizontalJoint: BrickDimension;
  verticalJoint: BrickDimension;
}

export interface BrickEstimateInput {
  walls: BrickWallInput[];
  openings: BrickOpeningInput[];
  piece: BrickPieceInput;
  wastePercentage: number;
  pricePerPiece?: number;
  piecesPerPackage?: number;
  estimateMortar?: boolean;
  mortarWastePercentage?: number;
}

export interface BrickAreaItemResult {
  name: string;
  widthMeters: number;
  heightMeters: number;
  quantity: number;
  area: number;
}

export interface BrickModuleResult {
  lengthMeters: number;
  heightMeters: number;
  thicknessMeters?: number;
  horizontalJointMeters: number;
  verticalJointMeters: number;
  moduleWidthMeters: number;
  moduleHeightMeters: number;
  moduleArea: number;
  piecesPerM2: number;
}

export interface BrickMortarResult {
  netVolume: number;
  purchaseVolume: number;
  wastePercentage: number;
}

export interface BrickEstimateResult {
  walls: BrickAreaItemResult[];
  openings: BrickAreaItemResult[];
  wallArea: number;
  openingArea: number;
  netArea: number;
  module: BrickModuleResult;
  netPieces: number;
  purchasePieces: number;
  piecesPerPackage?: number;
  packages?: number;
  roundedPurchasePieces: number;
  estimatedCost?: number;
  mortar?: BrickMortarResult;
  warnings: string[];
}

export type ParseBrickNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export interface BrickPresetConfig {
  label: string;
  shortLabel: string;
  lengthCm?: number;
  heightCm?: number;
  thicknessCm?: number;
  note: string;
}

export const BRICK_PRESET_CONFIG: Record<BrickPreset, BrickPresetConfig> = {
  custom: {
    label: "Personalizado",
    shortLabel: "Personalizado",
    note: "Captura libre",
  },
  "red-brick": {
    label: "Ladrillo rojo comun",
    shortLabel: "Ladrillo rojo",
    lengthCm: 20,
    heightCm: 10,
    thicknessCm: 6,
    note: "Referencia generica",
  },
  "block-10": {
    label: "Block 10",
    shortLabel: "Block 10",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 10,
    note: "Bloque de concreto",
  },
  "block-12": {
    label: "Block 12",
    shortLabel: "Block 12",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 12,
    note: "Bloque de concreto",
  },
  "block-15": {
    label: "Block 15",
    shortLabel: "Block 15",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 15,
    note: "Bloque de concreto",
  },
  "block-20": {
    label: "Block 20",
    shortLabel: "Block 20",
    lengthCm: 40,
    heightCm: 20,
    thicknessCm: 20,
    note: "Bloque de concreto",
  },
};

export function convertBrickLengthToMeters(
  value: number,
  unit: BrickUnit,
  options: { allowZero?: boolean } = {},
): number {
  if (!Number.isFinite(value) || value < 0 || (!options.allowZero && value === 0)) {
    throw new RangeError(
      options.allowZero
        ? "La medida debe ser un numero finito mayor o igual a cero."
        : "La medida debe ser un numero finito mayor a cero.",
    );
  }

  if (unit === "m") {
    return value;
  }

  if (unit === "cm") {
    return value / 100;
  }

  throw new RangeError("Unidad no soportada.");
}

export function calculateBrickEstimate(
  input: BrickEstimateInput,
): BrickEstimateResult {
  validateBrickEstimateInput(input);

  const walls = input.walls.map((wall) => calculateAreaItem(wall));
  const openings = input.openings.map((opening) => calculateAreaItem(opening));
  const wallArea = sum(walls.map((wall) => wall.area));
  const openingArea = sum(openings.map((opening) => opening.area));
  const netArea = Math.max(0, wallArea - openingArea);
  const module = calculateBrickModule(input.piece);
  const netPieces = netArea > 0 ? ceilWithTolerance(netArea / module.moduleArea) : 0;
  const purchasePieces = ceilWithTolerance(
    netPieces * (1 + input.wastePercentage / 100),
  );
  const roundedPurchasePieces =
    typeof input.piecesPerPackage === "number"
      ? ceilWithTolerance(purchasePieces / input.piecesPerPackage) *
        input.piecesPerPackage
      : purchasePieces;

  const result: BrickEstimateResult = {
    walls,
    openings,
    wallArea,
    openingArea,
    netArea,
    module,
    netPieces,
    purchasePieces,
    ...(typeof input.piecesPerPackage === "number"
      ? {
          piecesPerPackage: input.piecesPerPackage,
          packages: ceilWithTolerance(purchasePieces / input.piecesPerPackage),
        }
      : {}),
    roundedPurchasePieces,
    ...(typeof input.pricePerPiece === "number"
      ? { estimatedCost: roundedPurchasePieces * input.pricePerPiece }
      : {}),
    warnings: buildBrickWarnings(input, wallArea, openingArea, netArea, module),
  };

  if (input.estimateMortar) {
    result.mortar = calculateMortarEstimate(input, module, netArea, netPieces);
  }

  return result;
}

export function parseBrickNumberInput(value: string): ParseBrickNumberResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const compact = trimmed.replace(/\s+/g, "");

  if (/[^0-9.,]/.test(compact)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimalSeparators(compact);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatBrickNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function formatBrickFixedNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatBrickCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildBrickShareText(
  result: BrickEstimateResult,
  input: BrickEstimateInput,
) {
  const preset = BRICK_PRESET_CONFIG[input.piece.preset];
  const lines = [
    "Calculadora de ladrillos:",
    `Area bruta de muros: ${formatBrickFixedNumber(result.wallArea)} m2`,
    `Area de aberturas: ${formatBrickFixedNumber(result.openingArea)} m2`,
    `Area neta: ${formatBrickFixedNumber(result.netArea)} m2`,
    `Pieza: ${preset.shortLabel} (${formatBrickFixedNumber(
      result.module.lengthMeters * 100,
      1,
    )} x ${formatBrickFixedNumber(result.module.heightMeters * 100, 1)} cm)`,
    `Junta: ${formatBrickFixedNumber(
      result.module.verticalJointMeters * 100,
      1,
    )} cm vertical / ${formatBrickFixedNumber(
      result.module.horizontalJointMeters * 100,
      1,
    )} cm horizontal`,
    `Desperdicio: ${formatBrickNumber(input.wastePercentage)}%`,
    `Piezas netas: ${result.netPieces}`,
    `Piezas a comprar: ${result.purchasePieces}`,
  ];

  if (typeof result.packages === "number" && typeof result.piecesPerPackage === "number") {
    lines.push(
      `Paquetes: ${result.packages} de ${result.piecesPerPackage} piezas`,
      `Piezas redondeadas por paquete: ${result.roundedPurchasePieces}`,
    );
  }

  if (typeof result.estimatedCost === "number") {
    lines.push(`Costo estimado: ${formatBrickCurrency(result.estimatedCost)}`);
  }

  if (result.mortar) {
    lines.push(
      `Mortero aproximado: ${formatBrickFixedNumber(
        result.mortar.purchaseVolume,
        3,
      )} m3`,
    );
  }

  if (result.warnings.length) {
    lines.push("", "Advertencias:");
    result.warnings.forEach((warning) => lines.push(`- ${warning}`));
  }

  lines.push(
    "",
    "Estimacion orientativa. Revisa medidas reales, aparejo, cortes y condiciones de obra antes de comprar.",
  );

  return lines.join("\n");
}

export function buildBrickCsv(result: BrickEstimateResult) {
  const rows = [
    ["tipo", "nombre", "cantidad", "ancho_m", "alto_m", "area_m2"],
    ...result.walls.map((wall) => areaItemToCsvRow("muro", wall)),
    ...result.openings.map((opening) => areaItemToCsvRow("abertura", opening)),
    ["RESUMEN", "area_bruta_muros", "", "", "", formatCsvNumber(result.wallArea)],
    ["RESUMEN", "area_aberturas", "", "", "", formatCsvNumber(result.openingArea)],
    ["RESUMEN", "area_neta", "", "", "", formatCsvNumber(result.netArea)],
    ["RESUMEN", "piezas_por_m2", "", "", "", formatCsvNumber(result.module.piecesPerM2)],
    ["RESUMEN", "piezas_netas", String(result.netPieces), "", "", ""],
    ["RESUMEN", "piezas_a_comprar", String(result.purchasePieces), "", "", ""],
    [
      "RESUMEN",
      "piezas_redondeadas",
      String(result.roundedPurchasePieces),
      "",
      "",
      "",
    ],
  ];

  if (typeof result.packages === "number") {
    rows.push(["RESUMEN", "paquetes", String(result.packages), "", "", ""]);
  }

  if (typeof result.estimatedCost === "number") {
    rows.push([
      "RESUMEN",
      "costo_estimado",
      formatCsvNumber(result.estimatedCost),
      "",
      "",
      "",
    ]);
  }

  if (result.mortar) {
    rows.push([
      "RESUMEN",
      "mortero_m3",
      formatCsvNumber(result.mortar.purchaseVolume),
      "",
      "",
      "",
    ]);
  }

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function calculateAreaItem(item: BrickWallInput | BrickOpeningInput): BrickAreaItemResult {
  const widthMeters = convertBrickLengthToMeters(item.width.value, item.width.unit);
  const heightMeters = convertBrickLengthToMeters(item.height.value, item.height.unit);
  validateQuantity(item.quantity, "cantidad");

  return {
    name: normalizeAreaItemName(item.name),
    widthMeters,
    heightMeters,
    quantity: item.quantity,
    area: widthMeters * heightMeters * item.quantity,
  };
}

function calculateBrickModule(piece: BrickPieceInput): BrickModuleResult {
  validateBrickPreset(piece.preset);

  const lengthMeters = convertBrickLengthToMeters(piece.length.value, piece.length.unit);
  const heightMeters = convertBrickLengthToMeters(piece.height.value, piece.height.unit);
  const thicknessMeters = piece.thickness
    ? convertBrickLengthToMeters(piece.thickness.value, piece.thickness.unit)
    : undefined;
  const horizontalJointMeters = convertBrickLengthToMeters(
    piece.horizontalJoint.value,
    piece.horizontalJoint.unit,
    { allowZero: true },
  );
  const verticalJointMeters = convertBrickLengthToMeters(
    piece.verticalJoint.value,
    piece.verticalJoint.unit,
    { allowZero: true },
  );
  const moduleWidthMeters = lengthMeters + verticalJointMeters;
  const moduleHeightMeters = heightMeters + horizontalJointMeters;
  const moduleArea = moduleWidthMeters * moduleHeightMeters;

  return {
    lengthMeters,
    heightMeters,
    ...(typeof thicknessMeters === "number" ? { thicknessMeters } : {}),
    horizontalJointMeters,
    verticalJointMeters,
    moduleWidthMeters,
    moduleHeightMeters,
    moduleArea,
    piecesPerM2: 1 / moduleArea,
  };
}

function calculateMortarEstimate(
  input: BrickEstimateInput,
  module: BrickModuleResult,
  netArea: number,
  netPieces: number,
): BrickMortarResult {
  if (typeof module.thicknessMeters !== "number") {
    throw new RangeError("El espesor de pieza es obligatorio para estimar mortero.");
  }

  const wastePercentage = input.mortarWastePercentage ?? 0;
  validatePercentage(wastePercentage, "desperdicio de mortero");

  const wallVolume = netArea * module.thicknessMeters;
  const pieceVolume =
    netPieces * module.lengthMeters * module.heightMeters * module.thicknessMeters;
  const netVolume = Math.max(0, wallVolume - pieceVolume);

  return {
    netVolume,
    purchaseVolume: netVolume * (1 + wastePercentage / 100),
    wastePercentage,
  };
}

function validateBrickEstimateInput(input: BrickEstimateInput) {
  if (!input.walls.length) {
    throw new RangeError("Agrega al menos un muro.");
  }

  validatePercentage(input.wastePercentage, "desperdicio");

  if (typeof input.pricePerPiece === "number") {
    validateNonNegativeFinite(input.pricePerPiece, "precio por pieza");
  }

  if (typeof input.piecesPerPackage === "number") {
    validateQuantity(input.piecesPerPackage, "piezas por paquete");
  }
}

function buildBrickWarnings(
  input: BrickEstimateInput,
  wallArea: number,
  openingArea: number,
  netArea: number,
  module: BrickModuleResult,
) {
  const warnings: string[] = [];

  if (openingArea > wallArea) {
    warnings.push("El area de aberturas supera el area de muros; revisa las medidas.");
  }

  if (netArea === 0) {
    warnings.push("El area neta es cero, por eso no se sugieren piezas.");
  }

  if (input.wastePercentage > 30) {
    warnings.push("El desperdicio es mayor a 30%; revisa si el margen es intencional.");
  }

  if (module.horizontalJointMeters > 0.02 || module.verticalJointMeters > 0.02) {
    warnings.push("La junta supera 2 cm; revisa si la medida es correcta.");
  }

  if (input.estimateMortar && input.piece.preset.startsWith("block")) {
    warnings.push("El mortero para blocks huecos puede variar por celdas, refuerzos y colocacion.");
  }

  return warnings;
}

function validateBrickPreset(preset: BrickPreset) {
  if (!BRICK_PRESETS.includes(preset)) {
    throw new RangeError("Preset de pieza no soportado.");
  }
}

function validateQuantity(value: number, label: string) {
  if (
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 1000
  ) {
    throw new RangeError(`${label} debe ser un entero entre 1 y 1000.`);
  }
}

function validatePercentage(value: number, label: string) {
  validateNonNegativeFinite(value, label);

  if (value > 100) {
    throw new RangeError(`${label} no puede superar 100%.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser un numero finito mayor o igual a cero.`);
  }
}

function normalizeAreaItemName(name: string) {
  const normalized = name.trim();

  if (!normalized) {
    throw new RangeError("El nombre es obligatorio.");
  }

  if (normalized.length > 60) {
    throw new RangeError("El nombre no puede superar 60 caracteres.");
  }

  return normalized;
}

function normalizeDecimalSeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
): string | undefined {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, decimalOrGroupPart] = parts;

    if (!integerPart || !decimalOrGroupPart) {
      return undefined;
    }

    if (
      decimalOrGroupPart.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
    ) {
      return `${integerPart}${decimalOrGroupPart}`;
    }

    return `${integerPart}.${decimalOrGroupPart}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return undefined;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function ceilWithTolerance(value: number) {
  const rounded = Math.round(value);

  if (Math.abs(value - rounded) < 1e-9) {
    return rounded;
  }

  return Math.ceil(value);
}

function areaItemToCsvRow(type: string, item: BrickAreaItemResult) {
  return [
    type,
    item.name,
    String(item.quantity),
    formatCsvNumber(item.widthMeters),
    formatCsvNumber(item.heightMeters),
    formatCsvNumber(item.area),
  ];
}

function formatCsvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}
