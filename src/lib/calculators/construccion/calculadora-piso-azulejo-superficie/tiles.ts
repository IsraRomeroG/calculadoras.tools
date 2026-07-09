export const TILE_CANONICAL_PATH =
  "/construccion/calculadora-piso-azulejo-superficie";

export const TILE_SURFACE_MODES = ["dimensions", "area"] as const;
export const TILE_BOX_MODES = ["pieces", "area"] as const;
export const TILE_PATTERNS = [
  "straight",
  "diagonal",
  "herringbone",
  "many-cuts",
  "custom",
] as const;

export type TileSurfaceMode = (typeof TILE_SURFACE_MODES)[number];
export type TileBoxMode = (typeof TILE_BOX_MODES)[number];
export type TilePattern = (typeof TILE_PATTERNS)[number];

export interface TilePatternConfig {
  label: string;
  suggestedWastePercentage?: number;
  note: string;
}

export const TILE_PATTERN_CONFIG: Record<TilePattern, TilePatternConfig> = {
  straight: {
    label: "Recto",
    suggestedWastePercentage: 10,
    note: "Base comun",
  },
  diagonal: {
    label: "Diagonal",
    suggestedWastePercentage: 15,
    note: "Mas cortes en perimetro",
  },
  herringbone: {
    label: "Espiga",
    suggestedWastePercentage: 18,
    note: "Patron con mas recortes",
  },
  "many-cuts": {
    label: "Muchos cortes",
    suggestedWastePercentage: 20,
    note: "Areas irregulares o estrechas",
  },
  custom: {
    label: "Personalizado",
    note: "Mantener valor capturado",
  },
};

export interface TileAreaInput {
  name: string;
  mode: TileSurfaceMode;
  quantity: number;
  lengthMeters?: number;
  widthMeters?: number;
  areaM2?: number;
}

export interface TilePieceInput {
  lengthCm: number;
  widthCm: number;
}

export type TileBoxInput =
  | {
      mode: "pieces";
      piecesPerBox: number;
    }
  | {
      mode: "area";
      areaPerBoxM2: number;
    };

export interface TileEstimateInput {
  surfaces: TileAreaInput[];
  deductions: TileAreaInput[];
  piece: TilePieceInput;
  pattern: TilePattern;
  wastePercentage: number;
  box: TileBoxInput;
  pricePerBox?: number;
}

export interface TileAreaItemResult {
  name: string;
  mode: TileSurfaceMode;
  quantity: number;
  area: number;
  lengthMeters?: number;
  widthMeters?: number;
}

export interface TileEstimateResult {
  surfaces: TileAreaItemResult[];
  deductions: TileAreaItemResult[];
  grossArea: number;
  deductionArea: number;
  netArea: number;
  purchaseArea: number;
  pieceLengthMeters: number;
  pieceWidthMeters: number;
  pieceArea: number;
  basePieces: number;
  requiredPieces: number;
  boxMode: TileBoxMode;
  boxes: number;
  piecesPerBox?: number;
  areaPerBoxM2?: number;
  purchasedPieces?: number;
  estimatedPurchasedPieces?: number;
  purchasedArea: number;
  surplusPieces?: number;
  estimatedSurplusPieces?: number;
  surplusArea: number;
  totalCost?: number;
  costPerNetM2?: number;
  costPerPurchasedM2?: number;
  pattern: TilePattern;
  wastePercentage: number;
  warnings: string[];
}

export type ParseTileNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export function calculateTileEstimate(
  input: TileEstimateInput,
): TileEstimateResult {
  validateTileEstimateInput(input);

  const surfaces = input.surfaces.map((surface) => calculateAreaItem(surface));
  const deductions = input.deductions.map((deduction) =>
    calculateAreaItem(deduction),
  );
  const grossArea = sum(surfaces.map((surface) => surface.area));
  const deductionArea = sum(deductions.map((deduction) => deduction.area));
  const netArea = Math.max(0, grossArea - deductionArea);
  const pieceLengthMeters = input.piece.lengthCm / 100;
  const pieceWidthMeters = input.piece.widthCm / 100;
  const pieceArea = pieceLengthMeters * pieceWidthMeters;
  const purchaseArea = netArea * (1 + input.wastePercentage / 100);
  const basePieces = netArea > 0 ? ceilWithTolerance(netArea / pieceArea) : 0;
  const requiredPieces =
    purchaseArea > 0 ? ceilWithTolerance(purchaseArea / pieceArea) : 0;
  const boxResult = calculateBoxResult(input.box, requiredPieces, purchaseArea, pieceArea);
  const costResult = calculateCostResult(
    input.pricePerBox,
    boxResult.boxes,
    netArea,
    boxResult.purchasedArea,
  );

  const result: TileEstimateResult = {
    surfaces,
    deductions,
    grossArea,
    deductionArea,
    netArea,
    purchaseArea,
    pieceLengthMeters,
    pieceWidthMeters,
    pieceArea,
    basePieces,
    requiredPieces,
    boxMode: input.box.mode,
    ...boxResult,
    ...costResult,
    pattern: input.pattern,
    wastePercentage: input.wastePercentage,
    warnings: [],
  };

  result.warnings = buildTileWarnings(input, result);

  return result;
}

export function parseTileNumberInput(value: string): ParseTileNumberResult {
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

export function formatTileNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function formatTileFixedNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatTileCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
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
      ? `${input.box.piecesPerBox} piezas por caja`
      : `${formatTileFixedNumber(input.box.areaPerBoxM2)} m2 por caja`;
  const lines = [
    "Calculadora de piso y azulejo:",
    `Cajas a comprar: ${result.boxes}`,
    `Area neta: ${formatTileFixedNumber(result.netArea)} m2`,
    `Area con desperdicio: ${formatTileFixedNumber(result.purchaseArea)} m2`,
    `Piezas requeridas: ${result.requiredPieces}`,
    `Cobertura comprada: ${formatTileFixedNumber(result.purchasedArea)} m2`,
    `Sobrante estimado: ${formatTileFixedNumber(result.surplusArea)} m2`,
    `Pieza: ${formatTileFixedNumber(input.piece.lengthCm, 1)} x ${formatTileFixedNumber(
      input.piece.widthCm,
      1,
    )} cm`,
    `Patron: ${pattern.label}`,
    `Desperdicio: ${formatTileNumber(input.wastePercentage)}%`,
    `Caja: ${boxLabel}`,
  ];

  if (typeof result.surplusPieces === "number") {
    lines.push(`Piezas sobrantes: ${result.surplusPieces}`);
  } else if (typeof result.estimatedSurplusPieces === "number") {
    lines.push(`Piezas sobrantes estimadas: ${result.estimatedSurplusPieces}`);
  }

  if (typeof result.totalCost === "number") {
    lines.push(`Costo total: ${formatTileCurrency(result.totalCost)}`);
  }

  if (result.warnings.length) {
    lines.push("", "Advertencias:");
    result.warnings.forEach((warning) => lines.push(`- ${warning}`));
  }

  lines.push(
    "",
    "Estimacion orientativa. Revisa cortes, lote, tono, piezas rotas y condiciones de obra antes de comprar.",
  );

  return lines.join("\n");
}

export function buildTileCsv(
  result: TileEstimateResult,
  input: TileEstimateInput,
) {
  const rows = [
    ["tipo", "nombre", "modo", "cantidad", "largo_m", "ancho_m", "area_m2"],
    ...result.surfaces.map((surface) => areaItemToCsvRow("superficie", surface)),
    ...result.deductions.map((deduction) => areaItemToCsvRow("descuento", deduction)),
    ["RESUMEN", "area_bruta_m2", "", "", "", "", formatCsvNumber(result.grossArea)],
    [
      "RESUMEN",
      "area_descuentos_m2",
      "",
      "",
      "",
      "",
      formatCsvNumber(result.deductionArea),
    ],
    ["RESUMEN", "area_neta_m2", "", "", "", "", formatCsvNumber(result.netArea)],
    [
      "RESUMEN",
      "area_con_desperdicio_m2",
      "",
      "",
      "",
      "",
      formatCsvNumber(result.purchaseArea),
    ],
    ["RESUMEN", "piezas_requeridas", String(result.requiredPieces), "", "", "", ""],
    ["RESUMEN", "cajas", String(result.boxes), "", "", "", ""],
    [
      "RESUMEN",
      "cobertura_comprada_m2",
      "",
      "",
      "",
      "",
      formatCsvNumber(result.purchasedArea),
    ],
    [
      "RESUMEN",
      "sobrante_m2",
      "",
      "",
      "",
      "",
      formatCsvNumber(result.surplusArea),
    ],
    ["SUPUESTO", "patron", TILE_PATTERN_CONFIG[input.pattern].label, "", "", "", ""],
    [
      "SUPUESTO",
      "desperdicio_porcentaje",
      formatCsvNumber(input.wastePercentage),
      "",
      "",
      "",
      "",
    ],
    [
      "SUPUESTO",
      "pieza_cm",
      `${formatCsvNumber(input.piece.lengthCm)}x${formatCsvNumber(input.piece.widthCm)}`,
      "",
      "",
      "",
      "",
    ],
  ];

  if (typeof result.purchasedPieces === "number") {
    rows.push([
      "RESUMEN",
      "piezas_compradas",
      String(result.purchasedPieces),
      "",
      "",
      "",
      "",
    ]);
  }

  if (typeof result.estimatedPurchasedPieces === "number") {
    rows.push([
      "RESUMEN",
      "piezas_compradas_estimadas",
      String(result.estimatedPurchasedPieces),
      "",
      "",
      "",
      "",
    ]);
  }

  if (typeof result.totalCost === "number") {
    rows.push([
      "RESUMEN",
      "costo_total",
      formatCsvNumber(result.totalCost),
      "",
      "",
      "",
      "",
    ]);
  }

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function calculateAreaItem(item: TileAreaInput): TileAreaItemResult {
  validateSurfaceMode(item.mode);
  validateQuantity(item.quantity, "cantidad");

  const name = normalizeAreaItemName(item.name);

  if (item.mode === "dimensions") {
    validatePositiveFinite(item.lengthMeters, "largo");
    validatePositiveFinite(item.widthMeters, "ancho");

    return {
      name,
      mode: item.mode,
      quantity: item.quantity,
      lengthMeters: item.lengthMeters,
      widthMeters: item.widthMeters,
      area: item.lengthMeters * item.widthMeters * item.quantity,
    };
  }

  validatePositiveFinite(item.areaM2, "area");

  return {
    name,
    mode: item.mode,
    quantity: item.quantity,
    area: item.areaM2 * item.quantity,
  };
}

function calculateBoxResult(
  box: TileBoxInput,
  requiredPieces: number,
  purchaseArea: number,
  pieceArea: number,
) {
  if (box.mode === "pieces") {
    validateQuantity(box.piecesPerBox, "piezas por caja");

    const boxes =
      requiredPieces > 0
        ? ceilWithTolerance(requiredPieces / box.piecesPerBox)
        : 0;
    const purchasedPieces = boxes * box.piecesPerBox;
    const purchasedArea = purchasedPieces * pieceArea;

    return {
      boxes,
      piecesPerBox: box.piecesPerBox,
      purchasedPieces,
      purchasedArea,
      surplusPieces: purchasedPieces - requiredPieces,
      surplusArea: Math.max(0, purchasedArea - purchaseArea),
    };
  }

  validatePositiveFinite(box.areaPerBoxM2, "m2 por caja");

  const boxes =
    purchaseArea > 0 ? ceilWithTolerance(purchaseArea / box.areaPerBoxM2) : 0;
  const purchasedArea = boxes * box.areaPerBoxM2;
  const estimatedPurchasedPieces = Math.floor(purchasedArea / pieceArea);

  return {
    boxes,
    areaPerBoxM2: box.areaPerBoxM2,
    estimatedPurchasedPieces,
    purchasedArea,
    estimatedSurplusPieces: Math.max(0, estimatedPurchasedPieces - requiredPieces),
    surplusArea: Math.max(0, purchasedArea - purchaseArea),
  };
}

function calculateCostResult(
  pricePerBox: number | undefined,
  boxes: number,
  netArea: number,
  purchasedArea: number,
) {
  if (typeof pricePerBox !== "number") {
    return {};
  }

  validateNonNegativeFinite(pricePerBox, "precio por caja");

  const totalCost = boxes * pricePerBox;

  return {
    totalCost,
    ...(netArea > 0 ? { costPerNetM2: totalCost / netArea } : {}),
    ...(purchasedArea > 0 ? { costPerPurchasedM2: totalCost / purchasedArea } : {}),
  };
}

function validateTileEstimateInput(input: TileEstimateInput) {
  if (!input.surfaces.length) {
    throw new RangeError("Agrega al menos una superficie.");
  }

  validatePattern(input.pattern);
  validatePositiveFinite(input.piece.lengthCm, "largo de pieza");
  validatePositiveFinite(input.piece.widthCm, "ancho de pieza");
  validatePercentage(input.wastePercentage, "desperdicio");

  if (typeof input.pricePerBox === "number") {
    validateNonNegativeFinite(input.pricePerBox, "precio por caja");
  }
}

function buildTileWarnings(
  input: TileEstimateInput,
  result: TileEstimateResult,
) {
  const warnings: string[] = [];

  if (result.deductionArea > result.grossArea) {
    warnings.push(
      "El area descontada supera el area bruta; revisa las medidas capturadas.",
    );
  }

  if (result.netArea === 0) {
    warnings.push("El area neta es cero, por eso no se sugieren piezas.");
  }

  if (input.wastePercentage > 30) {
    warnings.push("El desperdicio es mayor a 30%; revisa si el margen es intencional.");
  }

  if (
    input.box.mode === "area" &&
    result.areaPerBoxM2 !== undefined &&
    result.areaPerBoxM2 < result.pieceArea
  ) {
    warnings.push(
      "El m2 por caja es menor que el area de una pieza; revisa el rendimiento del empaque.",
    );
  }

  if (
    result.requiredPieces > 0 &&
    ((typeof result.surplusPieces === "number" && result.surplusPieces < 1) ||
      (typeof result.surplusPieces !== "number" &&
        result.surplusArea < result.pieceArea))
  ) {
    warnings.push(
      "El sobrante queda muy justo; considera si necesitas una caja extra para reposiciones.",
    );
  }

  if (arrangementMayNeedMorePieces(input, result)) {
    warnings.push(
      "Algunas medidas pueden requerir mas piezas por cortes o franjas estrechas que el calculo por area no refleja.",
    );
  }

  return warnings;
}

function arrangementMayNeedMorePieces(
  input: TileEstimateInput,
  result: TileEstimateResult,
) {
  const rectangularSurfaces = input.surfaces.filter(
    (surface) =>
      surface.mode === "dimensions" &&
      typeof surface.lengthMeters === "number" &&
      typeof surface.widthMeters === "number",
  );

  if (!rectangularSurfaces.length || result.basePieces === 0) {
    return false;
  }

  const arrangementPieces = rectangularSurfaces.reduce((total, surface) => {
    const straight =
      ceilWithTolerance(surface.lengthMeters! / result.pieceLengthMeters) *
      ceilWithTolerance(surface.widthMeters! / result.pieceWidthMeters);
    const rotated =
      ceilWithTolerance(surface.lengthMeters! / result.pieceWidthMeters) *
      ceilWithTolerance(surface.widthMeters! / result.pieceLengthMeters);

    return total + Math.min(straight, rotated) * surface.quantity;
  }, 0);
  const areaPieces = ceilWithTolerance(
    sum(rectangularSurfaces.map((surface) => surface.lengthMeters! * surface.widthMeters! * surface.quantity)) /
      result.pieceArea,
  );

  return arrangementPieces > areaPieces && arrangementPieces / areaPieces > 1.15;
}

function validateSurfaceMode(mode: TileSurfaceMode) {
  if (!TILE_SURFACE_MODES.includes(mode)) {
    throw new RangeError("Modo de superficie no soportado.");
  }
}

function validatePattern(pattern: TilePattern) {
  if (!TILE_PATTERNS.includes(pattern)) {
    throw new RangeError("Patron de colocacion no soportado.");
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

function validatePositiveFinite(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser un numero finito mayor a cero.`);
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

  if (normalized.length > 40) {
    throw new RangeError("El nombre no puede superar 40 caracteres.");
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

function areaItemToCsvRow(type: string, item: TileAreaItemResult) {
  return [
    type,
    item.name,
    item.mode,
    String(item.quantity),
    typeof item.lengthMeters === "number" ? formatCsvNumber(item.lengthMeters) : "",
    typeof item.widthMeters === "number" ? formatCsvNumber(item.widthMeters) : "",
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
