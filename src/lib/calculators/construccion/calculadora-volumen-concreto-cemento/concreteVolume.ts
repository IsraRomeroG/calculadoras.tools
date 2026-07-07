export const CONCRETE_VOLUME_CANONICAL_PATH =
  "/construccion/calculadora-volumen-concreto-cemento";

export const CONCRETE_UNITS = ["m", "cm", "ft", "in"] as const;
export const CONCRETE_SHAPES = ["rectangular-prism", "cylinder"] as const;
export const CONCRETE_PRESETS = [
  "slab",
  "rectangular-column",
  "circular-column",
  "beam",
  "custom",
] as const;
export const CONCRETE_ESTIMATE_MODES = ["ready-mix", "bags"] as const;

export type ConcreteUnit = (typeof CONCRETE_UNITS)[number];
export type ConcreteShape = (typeof CONCRETE_SHAPES)[number];
export type ConcretePreset = (typeof CONCRETE_PRESETS)[number];
export type ConcreteEstimateMode = (typeof CONCRETE_ESTIMATE_MODES)[number];

export interface ConcreteDimension {
  value: number;
  unit: ConcreteUnit;
}

export interface ConcreteSectionInput {
  name: string;
  preset: ConcretePreset;
  shape: ConcreteShape;
  quantity: number;
  first: ConcreteDimension;
  second: ConcreteDimension;
  third?: ConcreteDimension;
}

export interface ConcreteEstimateInput {
  sections: ConcreteSectionInput[];
  wastePercentage: number;
  mode: ConcreteEstimateMode;
  bagYield?: number;
  pricePerM3?: number;
  pricePerBag?: number;
}

export interface ConcreteSectionResult {
  name: string;
  preset: ConcretePreset;
  shape: ConcreteShape;
  quantity: number;
  firstMeters: number;
  secondMeters: number;
  thirdMeters?: number;
  volume: number;
  sharePercentage: number;
}

export interface ConcreteVolumeResult {
  sections: ConcreteSectionResult[];
  netVolume: number;
  totalVolume: number;
  volumeFt3: number;
  volumeYd3: number;
  bagCount?: number;
  boughtVolumeFromBags?: number;
  bagSurplus?: number;
  concreteCost?: number;
  bagCost?: number;
  warnings: string[];
}

export type ParseConcreteNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export interface ConcretePresetConfig {
  label: string;
  defaultName: string;
  shape: ConcreteShape;
  dimensionLabels: readonly [string, string, string?];
  defaultUnits: readonly [ConcreteUnit, ConcreteUnit, ConcreteUnit?];
}

export const CONCRETE_PRESET_CONFIG: Record<
  ConcretePreset,
  ConcretePresetConfig
> = {
  slab: {
    label: "Losa",
    defaultName: "Losa",
    shape: "rectangular-prism",
    dimensionLabels: ["Largo", "Ancho", "Espesor"],
    defaultUnits: ["m", "m", "cm"],
  },
  "rectangular-column": {
    label: "Columna rectangular",
    defaultName: "Columna",
    shape: "rectangular-prism",
    dimensionLabels: ["Ancho", "Fondo", "Altura"],
    defaultUnits: ["cm", "cm", "m"],
  },
  "circular-column": {
    label: "Columna circular",
    defaultName: "Columna circular",
    shape: "cylinder",
    dimensionLabels: ["Diámetro", "Altura"],
    defaultUnits: ["cm", "m"],
  },
  beam: {
    label: "Viga",
    defaultName: "Viga",
    shape: "rectangular-prism",
    dimensionLabels: ["Largo", "Ancho", "Alto"],
    defaultUnits: ["m", "cm", "cm"],
  },
  custom: {
    label: "Otro",
    defaultName: "Sección",
    shape: "rectangular-prism",
    dimensionLabels: ["Largo", "Ancho", "Alto"],
    defaultUnits: ["m", "m", "m"],
  },
};

export function convertLengthToMeters(
  value: number,
  unit: ConcreteUnit,
): number {
  validatePositiveFinite(value, "medida");

  if (unit === "m") {
    return value;
  }

  if (unit === "cm") {
    return value / 100;
  }

  if (unit === "ft") {
    return value * 0.3048;
  }

  if (unit === "in") {
    return value * 0.0254;
  }

  throw new RangeError("Unidad no soportada.");
}

export function calculateConcreteSectionVolume(
  section: ConcreteSectionInput,
): Omit<ConcreteSectionResult, "sharePercentage"> {
  validateSection(section);

  const firstMeters = convertLengthToMeters(
    section.first.value,
    section.first.unit,
  );
  const secondMeters = convertLengthToMeters(
    section.second.value,
    section.second.unit,
  );

  if (section.shape === "cylinder") {
    const radius = firstMeters / 2;
    const volume = Math.PI * radius ** 2 * secondMeters * section.quantity;

    return {
      name: normalizeSectionName(section.name),
      preset: section.preset,
      shape: section.shape,
      quantity: section.quantity,
      firstMeters,
      secondMeters,
      volume,
    };
  }

  if (!section.third) {
    throw new RangeError("La tercera dimensión es obligatoria para prismas.");
  }

  const thirdMeters = convertLengthToMeters(
    section.third.value,
    section.third.unit,
  );
  const volume = firstMeters * secondMeters * thirdMeters * section.quantity;

  return {
    name: normalizeSectionName(section.name),
    preset: section.preset,
    shape: section.shape,
    quantity: section.quantity,
    firstMeters,
    secondMeters,
    thirdMeters,
    volume,
  };
}

export function calculateConcreteVolume(
  input: ConcreteEstimateInput,
): ConcreteVolumeResult {
  validateWaste(input.wastePercentage);

  if (!CONCRETE_ESTIMATE_MODES.includes(input.mode)) {
    throw new RangeError("Modo de estimación no soportado.");
  }

  if (!input.sections.length) {
    throw new RangeError("Agrega al menos una sección.");
  }

  const rawSections = input.sections.map(calculateConcreteSectionVolume);
  const netVolume = rawSections.reduce((total, section) => total + section.volume, 0);
  const totalVolume = netVolume * (1 + input.wastePercentage / 100);
  const sections = rawSections.map((section) => ({
    ...section,
    sharePercentage: netVolume > 0 ? (section.volume / netVolume) * 100 : 0,
  }));
  const result: ConcreteVolumeResult = {
    sections,
    netVolume,
    totalVolume,
    volumeFt3: totalVolume * 35.3146667,
    volumeYd3: totalVolume * 1.30795062,
    warnings: buildConcreteWarnings(input, rawSections, totalVolume),
  };

  if (typeof input.pricePerM3 === "number") {
    validateNonNegativeFinite(input.pricePerM3, "precio por m³");
    result.concreteCost = totalVolume * input.pricePerM3;
  }

  if (input.mode === "bags" && typeof input.bagYield === "number") {
    validatePositiveFinite(input.bagYield, "rendimiento por saco");

    const bagCount = Math.ceil(totalVolume / input.bagYield);
    const boughtVolumeFromBags = bagCount * input.bagYield;

    result.bagCount = bagCount;
    result.boughtVolumeFromBags = boughtVolumeFromBags;
    result.bagSurplus = Math.max(0, boughtVolumeFromBags - totalVolume);

    if (typeof input.pricePerBag === "number") {
      validateNonNegativeFinite(input.pricePerBag, "precio por saco");
      result.bagCost = bagCount * input.pricePerBag;
    }
  } else if (typeof input.pricePerBag === "number") {
    validateNonNegativeFinite(input.pricePerBag, "precio por saco");
  }

  return result;
}

export function parseConcreteNumberInput(
  value: string,
): ParseConcreteNumberResult {
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

export function formatConcreteNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatConcreteCompactNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function formatConcreteCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildConcreteShareText(
  result: ConcreteVolumeResult,
  input: ConcreteEstimateInput,
) {
  const lines = [
    "Calculadora de concreto:",
    `Volumen neto: ${formatConcreteNumber(result.netVolume)} m³`,
    `Desperdicio: ${formatConcreteCompactNumber(input.wastePercentage)}%`,
    `Volumen a considerar: ${formatConcreteNumber(result.totalVolume)} m³`,
  ];

  if (input.mode === "bags" && typeof result.bagCount === "number") {
    lines.push(`Compra estimada: ${result.bagCount} sacos`);

    if (typeof result.boughtVolumeFromBags === "number") {
      lines.push(
        `Volumen comprado: ${formatConcreteNumber(
          result.boughtVolumeFromBags,
        )} m³`,
      );
    }

    if (typeof result.bagSurplus === "number") {
      lines.push(
        `Sobrante estimado: ${formatConcreteNumber(result.bagSurplus)} m³`,
      );
    }
  } else {
    lines.push(`Pedido sugerido: ${formatConcreteNumber(result.totalVolume)} m³`);
  }

  if (typeof result.concreteCost === "number") {
    lines.push(`Costo por m³: ${formatConcreteCurrency(result.concreteCost)}`);
  }

  if (typeof result.bagCost === "number") {
    lines.push(`Costo por sacos: ${formatConcreteCurrency(result.bagCost)}`);
  }

  lines.push("", "Secciones:");
  result.sections.forEach((section) => {
    lines.push(
      `- ${section.name}: ${formatConcreteNumber(section.volume)} m³ (${section.quantity}x)`,
    );
  });

  if (result.warnings.length) {
    lines.push("", "Advertencias:");
    result.warnings.forEach((warning) => lines.push(`- ${warning}`));
  }

  lines.push(
    "",
    "Estimación orientativa. Revisa el rendimiento del fabricante y consulta a un profesional para elementos estructurales.",
  );

  return lines.join("\n");
}

export function buildConcreteCsv(result: ConcreteVolumeResult) {
  const rows = [
    [
      "seccion",
      "forma",
      "cantidad",
      "volumen_m3",
      "porcentaje_del_total",
    ],
    ...result.sections.map((section) => [
      section.name,
      section.shape === "cylinder" ? "cilindro" : "prisma rectangular",
      String(section.quantity),
      formatCsvNumber(section.volume),
      formatCsvNumber(section.sharePercentage),
    ]),
    ["TOTAL_NETO", "", "", formatCsvNumber(result.netVolume), "100"],
    ["TOTAL_CON_DESPERDICIO", "", "", formatCsvNumber(result.totalVolume), ""],
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function buildConcreteWarnings(
  input: ConcreteEstimateInput,
  sections: Array<Omit<ConcreteSectionResult, "sharePercentage">>,
  totalVolume: number,
) {
  const warnings: string[] = [];

  if (totalVolume > 50) {
    warnings.push("El volumen supera 50 m³; conviene revisar medidas y logística de suministro.");
  }

  if (input.wastePercentage > 30) {
    warnings.push("El desperdicio es mayor a 30%; revisa si el margen es intencional.");
  }

  sections.forEach((section) => {
    if (
      section.preset === "slab" &&
      typeof section.thirdMeters === "number" &&
      (section.thirdMeters < 0.05 || section.thirdMeters > 0.4)
    ) {
      warnings.push(
        `${section.name}: el espesor de losa parece inusual (${formatConcreteCompactNumber(
          section.thirdMeters * 100,
        )} cm).`,
      );
    }
  });

  if (
    typeof input.bagYield === "number" &&
    (input.bagYield < 0.005 || input.bagYield > 0.2)
  ) {
    warnings.push("El rendimiento por saco parece inusual; revisa la ficha del fabricante.");
  }

  return warnings;
}

function validateSection(section: ConcreteSectionInput) {
  if (!CONCRETE_PRESETS.includes(section.preset)) {
    throw new RangeError("Preset no soportado.");
  }

  if (!CONCRETE_SHAPES.includes(section.shape)) {
    throw new RangeError("Forma no soportada.");
  }

  if (
    !Number.isFinite(section.quantity) ||
    !Number.isInteger(section.quantity) ||
    section.quantity < 1 ||
    section.quantity > 10000
  ) {
    throw new RangeError("La cantidad debe ser un entero entre 1 y 10000.");
  }
}

function validateWaste(value: number) {
  validateNonNegativeFinite(value, "desperdicio");

  if (value > 100) {
    throw new RangeError("El desperdicio no puede superar 100%.");
  }
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser un número finito mayor a cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser un número finito mayor o igual a cero.`);
  }
}

function normalizeSectionName(name: string) {
  const normalized = name.trim();

  if (!normalized) {
    throw new RangeError("El nombre de la sección es obligatorio.");
  }

  if (normalized.length > 60) {
    throw new RangeError("El nombre de la sección no puede superar 60 caracteres.");
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

function formatCsvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}
