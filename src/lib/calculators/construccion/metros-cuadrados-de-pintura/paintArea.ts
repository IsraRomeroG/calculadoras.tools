export const PAINT_AREA_CANONICAL_PATH =
  "/construccion/metros-cuadrados-de-pintura";

export const PAINT_COVERAGE_PRESETS = [8, 10, 12] as const;
export const PAINT_CONTAINER_PRESETS = [1, 4, 10, 19] as const;
export const PAINT_MODES = ["habitacion", "manual"] as const;
export const OPENING_UNITS = ["m", "cm"] as const;

export type PaintMode = (typeof PAINT_MODES)[number];
export type OpeningUnit = (typeof OPENING_UNITS)[number];

export type ParseMeasurementResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export interface OpeningGroup {
  quantity: number;
  width: number;
  height: number;
  unit?: OpeningUnit;
}

export interface PaintLitersResult {
  netArea: number;
  coats: number;
  coverage: number;
  marginPercentage: number;
  accumulatedArea: number;
  litersBase: number;
  litersWithMargin: number;
}

export interface PaintContainersResult {
  containerSize: number;
  containers: number;
  litersBought: number;
  litersSurplus: number;
}

export interface RoomPaintAreaInput {
  length: number;
  width: number;
  height: number;
  paintWalls: boolean;
  paintCeiling: boolean;
  doorArea?: number;
  windowArea?: number;
}

export interface RoomPaintAreaResult {
  roomPerimeter: number;
  wallArea: number;
  ceilingArea: number;
  openingArea: number;
  netWallArea: number;
  netCeilingArea: number;
  netArea: number;
}

export interface ShareUrlInput {
  mode: PaintMode;
  length?: number;
  width?: number;
  height?: number;
  manualArea?: number;
  manualOpenings?: number;
  paintWalls?: boolean;
  paintCeiling?: boolean;
  doorArea?: number;
  windowArea?: number;
  coats?: number;
  coverage?: number;
  marginPercentage?: number;
  containerSize?: number;
}

export interface PaintShareTextInput {
  netArea: number;
  coats: number;
  accumulatedArea: number;
  coverage: number;
  litersBase: number;
  marginPercentage: number;
  litersWithMargin: number;
  wallArea?: number;
  ceilingArea?: number;
  openingArea?: number;
  containers?: PaintContainersResult;
}

export function calculateRoomPerimeter(length: number, width: number): number {
  validatePositiveFinite(length, "largo");
  validatePositiveFinite(width, "ancho");

  return 2 * (length + width);
}

export function calculateWallArea(
  length: number,
  width: number,
  height: number,
): number {
  validatePositiveFinite(height, "altura");

  return calculateRoomPerimeter(length, width) * height;
}

export function calculateCeilingArea(length: number, width: number): number {
  validatePositiveFinite(length, "largo");
  validatePositiveFinite(width, "ancho");

  return length * width;
}

export function calculateOpeningArea(openings: OpeningGroup[]): number {
  return openings.reduce((total, opening) => {
    validateNonNegativeFinite(opening.quantity, "cantidad");
    validatePositiveFinite(opening.width, "ancho de abertura");
    validatePositiveFinite(opening.height, "alto de abertura");

    const unit = opening.unit ?? "m";
    const width = normalizeOpeningMeasurement(opening.width, unit);
    const height = normalizeOpeningMeasurement(opening.height, unit);

    return total + width * height * opening.quantity;
  }, 0);
}

export function calculateNetWallArea(
  wallArea: number,
  openingArea: number,
): number {
  validateNonNegativeFinite(wallArea, "area de paredes");
  validateNonNegativeFinite(openingArea, "area de aberturas");

  if (openingArea >= wallArea) {
    throw new RangeError("Las aberturas deben ser menores al area de paredes.");
  }

  return wallArea - openingArea;
}

export function calculateNetPaintArea(
  wallArea: number,
  ceilingArea: number,
  openingArea: number,
  paintWalls: boolean,
  paintCeiling: boolean,
): number {
  if (!paintWalls && !paintCeiling) {
    throw new RangeError("Selecciona al menos una superficie para pintar.");
  }

  const netWallArea = paintWalls ? calculateNetWallArea(wallArea, openingArea) : 0;
  const netCeilingArea = paintCeiling ? ceilingArea : 0;

  validateNonNegativeFinite(netCeilingArea, "area de techo");

  return netWallArea + netCeilingArea;
}

export function calculateRoomPaintArea(
  input: RoomPaintAreaInput,
): RoomPaintAreaResult {
  if (!input.paintWalls && !input.paintCeiling) {
    throw new RangeError("Selecciona al menos una superficie para pintar.");
  }

  const roomPerimeter = calculateRoomPerimeter(input.length, input.width);
  const wallArea = input.paintWalls
    ? calculateWallArea(input.length, input.width, input.height)
    : 0;
  const ceilingArea = calculateCeilingArea(input.length, input.width);
  const openingArea = (input.doorArea ?? 0) + (input.windowArea ?? 0);
  validateNonNegativeFinite(openingArea, "area de aberturas");

  const netWallArea = input.paintWalls
    ? calculateNetWallArea(wallArea, openingArea)
    : 0;
  const netCeilingArea = input.paintCeiling ? ceilingArea : 0;

  return {
    roomPerimeter,
    wallArea,
    ceilingArea,
    openingArea,
    netWallArea,
    netCeilingArea,
    netArea: netWallArea + netCeilingArea,
  };
}

export function calculateManualPaintArea(
  totalArea: number,
  openingArea = 0,
): number {
  validatePositiveFinite(totalArea, "area total");
  validateNonNegativeFinite(openingArea, "area de aberturas");

  if (openingArea >= totalArea) {
    throw new RangeError("Las aberturas deben ser menores al area total.");
  }

  return totalArea - openingArea;
}

export function calculatePaintLiters(
  netArea: number,
  coats: number,
  coverage: number,
  marginPercentage: number,
): PaintLitersResult {
  validatePositiveFinite(netArea, "area neta");
  validateCoats(coats);
  validatePositiveFinite(coverage, "rendimiento");
  validateMargin(marginPercentage);

  const accumulatedArea = netArea * coats;
  const litersBase = accumulatedArea / coverage;
  const litersWithMargin = litersBase * (1 + marginPercentage / 100);

  return {
    netArea,
    coats,
    coverage,
    marginPercentage,
    accumulatedArea,
    litersBase,
    litersWithMargin,
  };
}

export function calculatePaintContainers(
  liters: number,
  containerSize: number,
): PaintContainersResult {
  validatePositiveFinite(liters, "litros");
  validatePositiveFinite(containerSize, "tamano de envase");

  const containers = Math.ceil(liters / containerSize);
  const litersBought = containers * containerSize;

  return {
    containerSize,
    containers,
    litersBought,
    litersSurplus: calculatePaintSurplus(liters, containers, containerSize),
  };
}

export function calculatePaintSurplus(
  litersWithMargin: number,
  containerCount: number,
  containerSize: number,
): number {
  validatePositiveFinite(litersWithMargin, "litros");
  validatePositiveFinite(containerCount, "envases");
  validatePositiveFinite(containerSize, "tamano de envase");

  return containerCount * containerSize - litersWithMargin;
}

export function normalizeOpeningMeasurement(
  value: number,
  unit: OpeningUnit,
): number {
  validatePositiveFinite(value, "medida de abertura");

  if (unit === "m") {
    return value;
  }

  if (unit === "cm") {
    return value / 100;
  }

  throw new RangeError("Unidad de abertura no soportada.");
}

export function parseMeasurementInput(value: string): ParseMeasurementResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
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

export function parseOpeningMeasurementInput(
  value: string,
): ParseMeasurementResult & { unit?: OpeningUnit } {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const unitMatch = trimmed.match(/\s*(cm|m)$/);
  const unit = unitMatch?.[1] as OpeningUnit | undefined;
  const numericPart = unit ? trimmed.slice(0, unitMatch.index).trim() : trimmed;
  const parsed = parseMeasurementInput(numericPart);

  if (!parsed.ok) {
    return parsed;
  }

  return {
    ...parsed,
    unit,
  };
}

export function formatPaintNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatPaintCompactNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function buildPaintShareText(input: PaintShareTextInput): string {
  const lines = [
    "Metros cuadrados de pintura:",
    `Superficie neta: ${formatPaintNumber(input.netArea)} m²`,
    `${input.coats} mano${input.coats === 1 ? "" : "s"}: ${formatPaintNumber(
      input.accumulatedArea,
    )} m² acumulados`,
    `Rendimiento: ${formatPaintNumber(input.coverage)} m²/l`,
    `Pintura base: ${formatPaintNumber(input.litersBase)} l`,
    `Con margen de ${formatPaintCompactNumber(
      input.marginPercentage,
    )}%: ${formatPaintNumber(input.litersWithMargin)} l`,
  ];

  if (typeof input.wallArea === "number") {
    lines.splice(1, 0, `Paredes: ${formatPaintNumber(input.wallArea)} m²`);
  }

  if (typeof input.ceilingArea === "number" && input.ceilingArea > 0) {
    lines.splice(2, 0, `Techo: ${formatPaintNumber(input.ceilingArea)} m²`);
  }

  if (typeof input.openingArea === "number" && input.openingArea > 0) {
    lines.splice(3, 0, `Puertas y ventanas: -${formatPaintNumber(input.openingArea)} m²`);
  }

  if (input.containers) {
    lines.push(
      `Compra estimada: ${input.containers.containers} envase${
        input.containers.containers === 1 ? "" : "s"
      } de ${formatPaintCompactNumber(input.containers.containerSize)} l`,
      `Total comprado: ${formatPaintNumber(input.containers.litersBought)} l`,
      `Sobrante estimado: ${formatPaintNumber(input.containers.litersSurplus)} l`,
    );
  }

  lines.push(
    "Es una estimacion. Revisa el rendimiento indicado por el fabricante antes de comprar.",
  );

  return lines.join("\n");
}

export function buildPaintShareUrl(input: ShareUrlInput): string {
  const params = new URLSearchParams();
  const mode = PAINT_MODES.includes(input.mode) ? input.mode : "habitacion";

  params.set("modo", mode);

  addNumberParam(params, "largo", input.length);
  addNumberParam(params, "ancho", input.width);
  addNumberParam(params, "altura", input.height);
  addNumberParam(params, "area", input.manualArea);
  addNumberParam(params, "aberturas", input.manualOpenings);
  addNumberParam(params, "puertas", input.doorArea);
  addNumberParam(params, "ventanas", input.windowArea);
  addNumberParam(params, "manos", input.coats);
  addNumberParam(params, "rendimiento", input.coverage);
  addNumberParam(params, "margen", input.marginPercentage);
  addNumberParam(params, "envase", input.containerSize);

  if (typeof input.paintWalls === "boolean") {
    params.set("paredes", input.paintWalls ? "1" : "0");
  }

  if (typeof input.paintCeiling === "boolean") {
    params.set("techo", input.paintCeiling ? "1" : "0");
  }

  const query = params.toString();

  return query ? `${PAINT_AREA_CANONICAL_PATH}?${query}` : PAINT_AREA_CANONICAL_PATH;
}

function addNumberParam(
  params: URLSearchParams,
  key: string,
  value: number | undefined,
) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return;
  }

  params.set(key, String(value));
}

function validateCoats(coats: number) {
  if (!Number.isInteger(coats) || !Number.isFinite(coats) || coats < 1) {
    throw new RangeError("Las manos deben ser un entero mayor o igual a 1.");
  }

  if (coats > 10) {
    throw new RangeError("Revisa el numero de manos capturado.");
  }
}

function validateMargin(marginPercentage: number) {
  validateNonNegativeFinite(marginPercentage, "margen");

  if (marginPercentage > 100) {
    throw new RangeError("Revisa el margen capturado.");
  }
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser un numero finito mayor a cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser un numero finito mayor o igual a cero.`);
  }
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
