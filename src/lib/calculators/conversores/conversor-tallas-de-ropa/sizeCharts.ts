export const CLOTHING_PROFILES = ["mujer", "hombre"] as const;
export const CLOTHING_GARMENTS = ["top", "pantalon", "vestido"] as const;
export const CLOTHING_REGIONS = ["international", "us", "eu", "uk", "mx"] as const;
export const CLOTHING_DESTINATIONS = [...CLOTHING_REGIONS, "all"] as const;
export const MEASUREMENT_UNITS = ["cm", "in"] as const;
export const FIT_PREFERENCES = ["ajustado", "regular", "holgado"] as const;
export const CLOTHING_SIZE_CHART_REVISED_AT = "2026-07-09";

export type ClothingProfile = (typeof CLOTHING_PROFILES)[number];
export type ClothingGarment = (typeof CLOTHING_GARMENTS)[number];
export type ClothingRegion = (typeof CLOTHING_REGIONS)[number];
export type ClothingDestination = (typeof CLOTHING_DESTINATIONS)[number];
export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];
export type FitPreference = (typeof FIT_PREFERENCES)[number];
export type ConfidenceLevel = "alta" | "media" | "baja";
export type MeasurementKey = "chest" | "waist" | "hip" | "inseam";

export interface SizeRange {
  minCm: number;
  maxCm: number;
}

export interface SizeRecord {
  id: string;
  revisedAt: string;
  profile: ClothingProfile;
  garment: ClothingGarment;
  order: number;
  labels: Partial<Record<ClothingRegion, string>>;
  measurementsCm: Partial<Record<MeasurementKey, SizeRange>>;
  confidence: ConfidenceLevel;
  sourceNote: string;
  editorialNote?: string;
  fitNotes?: string;
}

export interface ClothingSizeInputBase {
  profile: ClothingProfile;
  garment: ClothingGarment;
  destinationRegion: ClothingDestination;
  measurementUnit?: MeasurementUnit;
  fitPreference?: FitPreference;
  measurements?: Partial<Record<MeasurementKey, number>>;
}

export interface SizeConversionInput extends ClothingSizeInputBase {
  originRegion: ClothingRegion;
  originSize: string;
}

export type SizeEstimationInput = ClothingSizeInputBase;

export interface DisplayMeasurementRange {
  key: MeasurementKey;
  label: string;
  value: string;
}

export interface NeighborSize {
  direction: "smaller" | "larger";
  label: string;
  record: SizeRecord;
}

export interface SuccessfulClothingSizeResult {
  ok: true;
  mode: "size" | "measurements";
  record: SizeRecord;
  destinationRegion: ClothingDestination;
  destinationLabel?: string;
  primaryLabel: string;
  allLabels: Partial<Record<ClothingRegion, string>>;
  neighbors: NeighborSize[];
  confidence: ConfidenceLevel;
  confidenceReason: string;
  measurements: DisplayMeasurementRange[];
  guide: string;
  warning: string;
  copyText: string;
}

export interface EmptyClothingSizeResult {
  ok: false;
  reason:
    | "missing-size"
    | "missing-measurements"
    | "invalid-measurement"
    | "no-origin-match"
    | "no-measurement-match"
    | "no-destination-match";
  message: string;
  suggestion: string;
}

export type ClothingSizeResult =
  | SuccessfulClothingSizeResult
  | EmptyClothingSizeResult;

export const PROFILE_METADATA = {
  mujer: {
    label: "Mujer",
    description: "Sistema comercial de tallaje de mujer",
  },
  hombre: {
    label: "Hombre",
    description: "Sistema comercial de tallaje de hombre",
  },
} as const satisfies Record<
  ClothingProfile,
  { label: string; description: string }
>;

export const GARMENT_METADATA = {
  top: {
    label: "Camiseta / top",
    shortLabel: "Top",
  },
  pantalon: {
    label: "Pantalón",
    shortLabel: "Pantalón",
  },
  vestido: {
    label: "Vestido",
    shortLabel: "Vestido",
  },
} as const satisfies Record<
  ClothingGarment,
  { label: string; shortLabel: string }
>;

export const REGION_METADATA = {
  international: {
    label: "Internacional",
    shortLabel: "Int.",
  },
  us: {
    label: "Estados Unidos",
    shortLabel: "US",
  },
  eu: {
    label: "Europa",
    shortLabel: "EU",
  },
  uk: {
    label: "Reino Unido",
    shortLabel: "UK",
  },
  mx: {
    label: "México",
    shortLabel: "MX",
  },
} as const satisfies Record<
  ClothingRegion,
  { label: string; shortLabel: string }
>;

export const DESTINATION_METADATA = {
  ...REGION_METADATA,
  all: {
    label: "Ver todas las regiones",
    shortLabel: "Todas",
  },
} as const satisfies Record<
  ClothingDestination,
  { label: string; shortLabel: string }
>;

export const MEASUREMENT_METADATA = {
  chest: {
    label: "Pecho",
    help: "Alrededor de la parte más amplia del torso.",
  },
  waist: {
    label: "Cintura",
    help: "Alrededor de la zona donde ajusta la prenda.",
  },
  hip: {
    label: "Cadera",
    help: "Alrededor de la parte más amplia de la cadera.",
  },
  inseam: {
    label: "Entrepierna",
    help: "Desde la entrepierna hasta el largo deseado del pantalón.",
  },
} as const satisfies Record<MeasurementKey, { label: string; help: string }>;

export const FIT_METADATA = {
  ajustado: "Ajustado",
  regular: "Regular",
  holgado: "Holgado",
} as const satisfies Record<FitPreference, string>;

const EDITORIAL_SOURCE =
  "Tabla editorial aproximada para conversión orientativa entre sistemas comerciales.";

const WARNING_MESSAGE =
  "Las tallas cambian por marca, corte, tela y temporada. Usa este resultado como punto de partida y confirma con la tabla de la marca.";

const PLAUSIBLE_MEASUREMENT_RANGES_CM = {
  chest: { minCm: 50, maxCm: 180 },
  waist: { minCm: 45, maxCm: 170 },
  hip: { minCm: 60, maxCm: 190 },
  inseam: { minCm: 40, maxCm: 115 },
} as const satisfies Record<MeasurementKey, SizeRange>;

const BASE_RECORDS: Omit<SizeRecord, "id" | "revisedAt" | "sourceNote">[] = [
  {
    profile: "mujer",
    garment: "top",
    order: 1,
    labels: { international: "XS", us: "0-2", eu: "32-34", uk: "4-6", mx: "XS" },
    measurementsCm: {
      chest: { minCm: 78, maxCm: 82 },
      waist: { minCm: 60, maxCm: 64 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "top",
    order: 2,
    labels: { international: "S", us: "4-6", eu: "36-38", uk: "8-10", mx: "S" },
    measurementsCm: {
      chest: { minCm: 83, maxCm: 88 },
      waist: { minCm: 65, maxCm: 70 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "top",
    order: 3,
    labels: { international: "M", us: "8-10", eu: "40-42", uk: "12-14", mx: "M" },
    measurementsCm: {
      chest: { minCm: 89, maxCm: 94 },
      waist: { minCm: 71, maxCm: 76 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "top",
    order: 4,
    labels: { international: "L", us: "12-14", eu: "44-46", uk: "16-18", mx: "L" },
    measurementsCm: {
      chest: { minCm: 95, maxCm: 102 },
      waist: { minCm: 77, maxCm: 84 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "top",
    order: 5,
    labels: { international: "XL", us: "16-18", eu: "48-50", uk: "20-22", mx: "XL" },
    measurementsCm: {
      chest: { minCm: 103, maxCm: 110 },
      waist: { minCm: 85, maxCm: 92 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "pantalon",
    order: 1,
    labels: { international: "XS", us: "0-2", eu: "32-34", uk: "4-6", mx: "24-26" },
    measurementsCm: {
      waist: { minCm: 60, maxCm: 64 },
      hip: { minCm: 86, maxCm: 90 },
      inseam: { minCm: 76, maxCm: 80 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "pantalon",
    order: 2,
    labels: { international: "S", us: "4-6", eu: "36-38", uk: "8-10", mx: "27-28" },
    measurementsCm: {
      waist: { minCm: 65, maxCm: 70 },
      hip: { minCm: 91, maxCm: 96 },
      inseam: { minCm: 76, maxCm: 80 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "pantalon",
    order: 3,
    labels: { international: "M", us: "8-10", eu: "40-42", uk: "12-14", mx: "29-30" },
    measurementsCm: {
      waist: { minCm: 71, maxCm: 76 },
      hip: { minCm: 97, maxCm: 102 },
      inseam: { minCm: 76, maxCm: 81 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "pantalon",
    order: 4,
    labels: { international: "L", us: "12-14", eu: "44-46", uk: "16-18", mx: "31-33" },
    measurementsCm: {
      waist: { minCm: 77, maxCm: 84 },
      hip: { minCm: 103, maxCm: 110 },
      inseam: { minCm: 77, maxCm: 82 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "pantalon",
    order: 5,
    labels: { international: "XL", us: "16-18", eu: "48-50", uk: "20-22", mx: "34-36" },
    measurementsCm: {
      waist: { minCm: 85, maxCm: 92 },
      hip: { minCm: 111, maxCm: 118 },
      inseam: { minCm: 77, maxCm: 82 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "vestido",
    order: 1,
    labels: { international: "XS", us: "0-2", eu: "32-34", uk: "4-6", mx: "XS" },
    measurementsCm: {
      chest: { minCm: 78, maxCm: 82 },
      waist: { minCm: 60, maxCm: 64 },
      hip: { minCm: 86, maxCm: 90 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "vestido",
    order: 2,
    labels: { international: "S", us: "4-6", eu: "36-38", uk: "8-10", mx: "S" },
    measurementsCm: {
      chest: { minCm: 83, maxCm: 88 },
      waist: { minCm: 65, maxCm: 70 },
      hip: { minCm: 91, maxCm: 96 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "vestido",
    order: 3,
    labels: { international: "M", us: "8-10", eu: "40-42", uk: "12-14", mx: "M" },
    measurementsCm: {
      chest: { minCm: 89, maxCm: 94 },
      waist: { minCm: 71, maxCm: 76 },
      hip: { minCm: 97, maxCm: 102 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "vestido",
    order: 4,
    labels: { international: "L", us: "12-14", eu: "44-46", uk: "16-18", mx: "L" },
    measurementsCm: {
      chest: { minCm: 95, maxCm: 102 },
      waist: { minCm: 77, maxCm: 84 },
      hip: { minCm: 103, maxCm: 110 },
    },
    confidence: "media",
  },
  {
    profile: "mujer",
    garment: "vestido",
    order: 5,
    labels: { international: "XL", us: "16-18", eu: "48-50", uk: "20-22", mx: "XL" },
    measurementsCm: {
      chest: { minCm: 103, maxCm: 110 },
      waist: { minCm: 85, maxCm: 92 },
      hip: { minCm: 111, maxCm: 118 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "top",
    order: 1,
    labels: { international: "XS", us: "XS", eu: "44", uk: "34", mx: "XS" },
    measurementsCm: {
      chest: { minCm: 84, maxCm: 88 },
      waist: { minCm: 70, maxCm: 74 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "top",
    order: 2,
    labels: { international: "S", us: "S", eu: "46", uk: "36", mx: "S" },
    measurementsCm: {
      chest: { minCm: 89, maxCm: 94 },
      waist: { minCm: 75, maxCm: 80 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "top",
    order: 3,
    labels: { international: "M", us: "M", eu: "48-50", uk: "38-40", mx: "M" },
    measurementsCm: {
      chest: { minCm: 95, maxCm: 100 },
      waist: { minCm: 81, maxCm: 86 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "top",
    order: 4,
    labels: { international: "L", us: "L", eu: "52-54", uk: "42-44", mx: "L" },
    measurementsCm: {
      chest: { minCm: 101, maxCm: 108 },
      waist: { minCm: 87, maxCm: 94 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "top",
    order: 5,
    labels: { international: "XL", us: "XL", eu: "56-58", uk: "46-48", mx: "XL" },
    measurementsCm: {
      chest: { minCm: 109, maxCm: 116 },
      waist: { minCm: 95, maxCm: 102 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "pantalon",
    order: 1,
    labels: { international: "XS", us: "28", eu: "44", uk: "28", mx: "28" },
    measurementsCm: {
      waist: { minCm: 71, maxCm: 74 },
      hip: { minCm: 86, maxCm: 90 },
      inseam: { minCm: 76, maxCm: 81 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "pantalon",
    order: 2,
    labels: { international: "S", us: "30", eu: "46", uk: "30", mx: "30" },
    measurementsCm: {
      waist: { minCm: 75, maxCm: 80 },
      hip: { minCm: 91, maxCm: 96 },
      inseam: { minCm: 77, maxCm: 82 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "pantalon",
    order: 3,
    labels: { international: "M", us: "32", eu: "48", uk: "32", mx: "32" },
    measurementsCm: {
      waist: { minCm: 81, maxCm: 86 },
      hip: { minCm: 97, maxCm: 102 },
      inseam: { minCm: 78, maxCm: 83 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "pantalon",
    order: 4,
    labels: { international: "L", us: "34", eu: "50", uk: "34", mx: "34" },
    measurementsCm: {
      waist: { minCm: 87, maxCm: 92 },
      hip: { minCm: 103, maxCm: 108 },
      inseam: { minCm: 79, maxCm: 84 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "pantalon",
    order: 5,
    labels: { international: "XL", us: "36", eu: "52", uk: "36", mx: "36" },
    measurementsCm: {
      waist: { minCm: 93, maxCm: 100 },
      hip: { minCm: 109, maxCm: 116 },
      inseam: { minCm: 80, maxCm: 85 },
    },
    confidence: "media",
  },
  {
    profile: "hombre",
    garment: "vestido",
    order: 1,
    labels: { international: "XS", us: "XS", eu: "44", uk: "34", mx: "XS" },
    measurementsCm: {
      chest: { minCm: 84, maxCm: 88 },
      waist: { minCm: 70, maxCm: 74 },
      hip: { minCm: 86, maxCm: 90 },
    },
    confidence: "baja",
    editorialNote:
      "El sistema comercial de vestido para hombre no está estandarizado; confirma siempre con la marca.",
  },
  {
    profile: "hombre",
    garment: "vestido",
    order: 2,
    labels: { international: "S", us: "S", eu: "46", uk: "36", mx: "S" },
    measurementsCm: {
      chest: { minCm: 89, maxCm: 94 },
      waist: { minCm: 75, maxCm: 80 },
      hip: { minCm: 91, maxCm: 96 },
    },
    confidence: "baja",
    editorialNote:
      "El sistema comercial de vestido para hombre no está estandarizado; confirma siempre con la marca.",
  },
  {
    profile: "hombre",
    garment: "vestido",
    order: 3,
    labels: { international: "M", us: "M", eu: "48-50", uk: "38-40", mx: "M" },
    measurementsCm: {
      chest: { minCm: 95, maxCm: 100 },
      waist: { minCm: 81, maxCm: 86 },
      hip: { minCm: 97, maxCm: 102 },
    },
    confidence: "baja",
    editorialNote:
      "El sistema comercial de vestido para hombre no está estandarizado; confirma siempre con la marca.",
  },
  {
    profile: "hombre",
    garment: "vestido",
    order: 4,
    labels: { international: "L", us: "L", eu: "52-54", uk: "42-44", mx: "L" },
    measurementsCm: {
      chest: { minCm: 101, maxCm: 108 },
      waist: { minCm: 87, maxCm: 94 },
      hip: { minCm: 103, maxCm: 110 },
    },
    confidence: "baja",
    editorialNote:
      "El sistema comercial de vestido para hombre no está estandarizado; confirma siempre con la marca.",
  },
  {
    profile: "hombre",
    garment: "vestido",
    order: 5,
    labels: { international: "XL", us: "XL", eu: "56-58", uk: "46-48", mx: "XL" },
    measurementsCm: {
      chest: { minCm: 109, maxCm: 116 },
      waist: { minCm: 95, maxCm: 102 },
      hip: { minCm: 111, maxCm: 118 },
    },
    confidence: "baja",
    editorialNote:
      "El sistema comercial de vestido para hombre no está estandarizado; confirma siempre con la marca.",
  },
];

export const SIZE_CHARTS: SizeRecord[] = BASE_RECORDS.map((record) => ({
  ...record,
  id: [
    record.profile,
    record.garment,
    String(record.order).padStart(2, "0"),
  ].join("-"),
  revisedAt: CLOTHING_SIZE_CHART_REVISED_AT,
  sourceNote: EDITORIAL_SOURCE,
}));

export function isClothingProfile(value: string): value is ClothingProfile {
  return CLOTHING_PROFILES.includes(value as ClothingProfile);
}

export function isClothingGarment(value: string): value is ClothingGarment {
  return CLOTHING_GARMENTS.includes(value as ClothingGarment);
}

export function isClothingRegion(value: string): value is ClothingRegion {
  return CLOTHING_REGIONS.includes(value as ClothingRegion);
}

export function isClothingDestination(
  value: string,
): value is ClothingDestination {
  return CLOTHING_DESTINATIONS.includes(value as ClothingDestination);
}

export function isMeasurementUnit(value: string): value is MeasurementUnit {
  return MEASUREMENT_UNITS.includes(value as MeasurementUnit);
}

export function isFitPreference(value: string): value is FitPreference {
  return FIT_PREFERENCES.includes(value as FitPreference);
}

export function getRelevantMeasurementKeys(
  garment: ClothingGarment,
): MeasurementKey[] {
  if (garment === "pantalon") {
    return ["waist", "hip", "inseam"];
  }

  if (garment === "top") {
    return ["chest", "waist"];
  }

  return ["chest", "waist", "hip"];
}

export function getSizeRecords(
  profile: ClothingProfile,
  garment: ClothingGarment,
): SizeRecord[] {
  return SIZE_CHARTS.filter(
    (record) => record.profile === profile && record.garment === garment,
  ).sort((a, b) => a.order - b.order);
}

export function getAvailableSizes(input: {
  profile: ClothingProfile;
  garment: ClothingGarment;
  region: ClothingRegion;
}): string[] {
  const seen = new Set<string>();

  return getSizeRecords(input.profile, input.garment).flatMap((record) => {
    const label = record.labels[input.region];
    const normalized = label ? normalizeSizeLabel(label) : "";

    if (!label || seen.has(normalized)) {
      return [];
    }

    seen.add(normalized);

    return [label];
  });
}

export function convertClothingSize(
  input: SizeConversionInput,
): ClothingSizeResult {
  const originSize = input.originSize.trim();

  if (!originSize) {
    return emptyResult(
      "missing-size",
      "Elige una talla de origen para ver la equivalencia.",
      "Selecciona una talla disponible para esa prenda, región y sistema comercial.",
    );
  }

  const normalizedMeasurements = normalizeMeasurements(
    input.measurements ?? {},
    input.measurementUnit ?? "cm",
  );

  if (!normalizedMeasurements.ok) {
    return normalizedMeasurements;
  }

  const records = getSizeRecords(input.profile, input.garment);
  const matches = records.filter(
    (record) =>
      normalizeSizeLabel(record.labels[input.originRegion] ?? "") ===
      normalizeSizeLabel(originSize),
  );

  if (!matches.length) {
    return emptyResult(
      "no-origin-match",
      "No tenemos una equivalencia confiable para esa talla de origen.",
      "Prueba con otra región de origen o compara directamente con la tabla de la marca.",
    );
  }

  const record = chooseBestRecord(matches, normalizedMeasurements.measurements);

  return buildSuccessfulResult({
    mode: "size",
    record,
    records,
    destinationRegion: input.destinationRegion,
    measurementUnit: input.measurementUnit ?? "cm",
    fitPreference: input.fitPreference ?? "regular",
    measurements: normalizedMeasurements.measurements,
  });
}

export function estimateClothingSize(
  input: SizeEstimationInput,
): ClothingSizeResult {
  const normalizedMeasurements = normalizeMeasurements(
    input.measurements ?? {},
    input.measurementUnit ?? "cm",
  );

  if (!normalizedMeasurements.ok) {
    return normalizedMeasurements;
  }

  const relevantMeasurements = getProvidedMeasurements(
    normalizedMeasurements.measurements,
    getRelevantMeasurementKeys(input.garment),
  );

  if (!relevantMeasurements.length) {
    return emptyResult(
      "missing-measurements",
      "Ingresa al menos una medida para estimar una talla aproximada.",
      "Puedes empezar con una sola medida, aunque la confianza mejora si agregas las medidas principales de la prenda.",
    );
  }

  const records = getSizeRecords(input.profile, input.garment);
  const matches = records.filter((record) =>
    relevantMeasurements.every(([key, value]) => {
      const range = record.measurementsCm[key];

      return Boolean(range && value >= range.minCm && value <= range.maxCm);
    }),
  );

  if (!matches.length) {
    return emptyResult(
      "no-measurement-match",
      "Tus medidas no caen dentro de los rangos disponibles para esta tabla.",
      "No vamos a inventar una talla fuera de la tabla. Compara tus medidas con la guía de la marca.",
    );
  }

  const record = matches.sort(
    (a, b) =>
      calculateMeasurementDistance(a, relevantMeasurements) -
        calculateMeasurementDistance(b, relevantMeasurements) || a.order - b.order,
  )[0];

  return buildSuccessfulResult({
    mode: "measurements",
    record,
    records,
    destinationRegion: input.destinationRegion,
    measurementUnit: input.measurementUnit ?? "cm",
    fitPreference: input.fitPreference ?? "regular",
    measurements: normalizedMeasurements.measurements,
    providedMeasurementCount: relevantMeasurements.length,
  });
}

export function formatSizeWithRegion(
  region: ClothingRegion,
  label: string,
): string {
  return `${REGION_METADATA[region].shortLabel} ${label}`;
}

export function formatAllRegionLabels(
  labels: Partial<Record<ClothingRegion, string>>,
): string {
  return CLOTHING_REGIONS.flatMap((region) => {
    const label = labels[region];

    return label ? [formatSizeWithRegion(region, label)] : [];
  }).join(" · ");
}

export function formatMeasurementRange(
  range: SizeRange,
  unit: MeasurementUnit = "cm",
): string {
  const min = unit === "cm" ? range.minCm : cmToIn(range.minCm);
  const max = unit === "cm" ? range.maxCm : cmToIn(range.maxCm);
  const decimals = unit === "cm" ? 0 : 1;

  return `${formatNumber(min, decimals)}-${formatNumber(max, decimals)} ${unit}`;
}

function buildSuccessfulResult(input: {
  mode: "size" | "measurements";
  record: SizeRecord;
  records: SizeRecord[];
  destinationRegion: ClothingDestination;
  measurementUnit: MeasurementUnit;
  fitPreference: FitPreference;
  measurements: Partial<Record<MeasurementKey, number>>;
  providedMeasurementCount?: number;
}): ClothingSizeResult {
  const destinationLabel =
    input.destinationRegion === "all"
      ? undefined
      : input.record.labels[input.destinationRegion];

  if (input.destinationRegion !== "all" && !destinationLabel) {
    return emptyResult(
      "no-destination-match",
      "Esta tabla no tiene una equivalencia confiable para la región destino.",
      "Prueba con Ver todas las regiones o consulta la guía de tallas de la marca.",
    );
  }

  const relevantKeys = getRelevantMeasurementKeys(input.record.garment);
  const neighbors = getNeighbors(input.records, input.record);
  const confidence = getResultConfidence({
    record: input.record,
    destinationRegion: input.destinationRegion,
    relevantKeys,
    measurements: input.measurements,
    mode: input.mode,
    providedMeasurementCount: input.providedMeasurementCount ?? 0,
  });
  const primaryLabel =
    input.destinationRegion === "all"
      ? formatSizeWithRegion(
          "international",
          input.record.labels.international ?? "sin equivalencia",
        )
      : formatSizeWithRegion(input.destinationRegion, destinationLabel ?? "");
  const measurements = relevantKeys.flatMap((key) => {
    const range = input.record.measurementsCm[key];

    return range
      ? [
          {
            key,
            label: MEASUREMENT_METADATA[key].label,
            value: formatMeasurementRange(range, input.measurementUnit),
          },
        ]
      : [];
  });
  const guide = buildFitGuide({
    record: input.record,
    neighbors,
    fitPreference: input.fitPreference,
    measurements: input.measurements,
    primaryLabel,
  });
  const confidenceReason = buildConfidenceReason(confidence, input.record);

  const result: SuccessfulClothingSizeResult = {
    ok: true,
    mode: input.mode,
    record: input.record,
    destinationRegion: input.destinationRegion,
    ...(destinationLabel ? { destinationLabel } : {}),
    primaryLabel,
    allLabels: input.record.labels,
    neighbors,
    confidence,
    confidenceReason,
    measurements,
    guide,
    warning: WARNING_MESSAGE,
    copyText: "",
  };

  return {
    ...result,
    copyText: buildCopyText(result),
  };
}

function getResultConfidence(input: {
  record: SizeRecord;
  destinationRegion: ClothingDestination;
  relevantKeys: MeasurementKey[];
  measurements: Partial<Record<MeasurementKey, number>>;
  mode: "size" | "measurements";
  providedMeasurementCount: number;
}): ConfidenceLevel {
  let confidence = input.record.confidence;

  if (
    input.destinationRegion !== "all" &&
    !input.record.labels[input.destinationRegion]
  ) {
    confidence = degradeConfidence(confidence);
  }

  if (
    input.relevantKeys.some((key) => !input.record.measurementsCm[key]) ||
    input.record.confidence === "baja"
  ) {
    confidence = degradeConfidence(confidence);
  }

  if (
    input.mode === "measurements" &&
    input.providedMeasurementCount > 0 &&
    input.providedMeasurementCount < Math.min(2, input.relevantKeys.length)
  ) {
    confidence = degradeConfidence(confidence);
  }

  const measurementsOutsideRecord = Object.entries(input.measurements).some(
    ([key, value]) => {
      const measurementKey = key as MeasurementKey;
      const range = input.record.measurementsCm[measurementKey];

      return (
        value !== undefined &&
        range !== undefined &&
        (value < range.minCm || value > range.maxCm)
      );
    },
  );

  if (measurementsOutsideRecord) {
    confidence = degradeConfidence(confidence);
  }

  return confidence;
}

function buildConfidenceReason(
  confidence: ConfidenceLevel,
  record: SizeRecord,
): string {
  if (confidence === "alta") {
    return "Hay equivalencia directa y rangos completos para esta prenda.";
  }

  if (confidence === "media") {
    return "Hay equivalencia directa, pero las tallas pueden solaparse entre marcas.";
  }

  return (
    record.editorialNote ??
    "La tabla es parcial o la equivalencia está menos estandarizada; confirma con la marca."
  );
}

function buildFitGuide(input: {
  record: SizeRecord;
  neighbors: NeighborSize[];
  fitPreference: FitPreference;
  measurements: Partial<Record<MeasurementKey, number>>;
  primaryLabel: string;
}): string {
  const largerNeighbor = input.neighbors.find(
    (neighbor) => neighbor.direction === "larger",
  );
  const upperLimitMeasure = getNearUpperLimitMeasurement(
    input.record,
    input.measurements,
  );

  if (input.fitPreference === "holgado" && largerNeighbor) {
    return `Empieza por ${input.primaryLabel}. Si prefieres más amplitud o la prenda es slim, revisa también ${largerNeighbor.label}.`;
  }

  if (input.fitPreference === "ajustado") {
    if (upperLimitMeasure) {
      return `Empieza por ${input.primaryLabel}, pero compara ${upperLimitMeasure} con la marca: está cerca del límite superior del rango.`;
    }

    return `Empieza por ${input.primaryLabel}. Para ajuste ceñido, revisa que pecho, cintura o cadera no queden en el límite superior.`;
  }

  return `Empieza por ${input.primaryLabel} y revisa la tabla de la marca antes de comprar.`;
}

function getNearUpperLimitMeasurement(
  record: SizeRecord,
  measurements: Partial<Record<MeasurementKey, number>>,
): string | undefined {
  const match = Object.entries(measurements).find(([key, value]) => {
    const measurementKey = key as MeasurementKey;
    const range = record.measurementsCm[measurementKey];

    if (value === undefined || !range) {
      return false;
    }

    return value >= range.minCm + (range.maxCm - range.minCm) * 0.8;
  });

  return match ? MEASUREMENT_METADATA[match[0] as MeasurementKey].label : undefined;
}

function buildCopyText(result: SuccessfulClothingSizeResult): string {
  const lines = [
    `Talla aproximada: ${result.primaryLabel}`,
    `Equivalencias: ${formatAllRegionLabels(result.allLabels)}`,
    `Tallas vecinas: ${formatNeighborList(result.neighbors)}`,
    `Rangos: ${result.measurements
      .map((measurement) => `${measurement.label} ${measurement.value}`)
      .join(", ")}`,
    `Confianza: ${result.confidence}`,
    `Revisión editorial: ${result.record.revisedAt}`,
    result.warning,
  ];

  return lines.filter(Boolean).join("\n");
}

function formatNeighborList(neighbors: NeighborSize[]): string {
  if (!neighbors.length) {
    return "sin tallas vecinas disponibles";
  }

  return neighbors.map((neighbor) => neighbor.label).join(", ");
}

function getNeighbors(records: SizeRecord[], record: SizeRecord): NeighborSize[] {
  const smaller = records.find((candidate) => candidate.order === record.order - 1);
  const larger = records.find((candidate) => candidate.order === record.order + 1);

  return [
    ...(smaller
      ? [
          {
            direction: "smaller" as const,
            label: formatSizeWithRegion(
              "international",
              smaller.labels.international ?? `orden ${smaller.order}`,
            ),
            record: smaller,
          },
        ]
      : []),
    ...(larger
      ? [
          {
            direction: "larger" as const,
            label: formatSizeWithRegion(
              "international",
              larger.labels.international ?? `orden ${larger.order}`,
            ),
            record: larger,
          },
        ]
      : []),
  ];
}

function chooseBestRecord(
  records: SizeRecord[],
  measurements: Partial<Record<MeasurementKey, number>>,
): SizeRecord {
  const providedMeasurements = getProvidedMeasurements(measurements);

  if (!providedMeasurements.length) {
    return records[0];
  }

  return [...records].sort(
    (a, b) =>
      calculateMeasurementDistance(a, providedMeasurements) -
        calculateMeasurementDistance(b, providedMeasurements) || a.order - b.order,
  )[0];
}

function calculateMeasurementDistance(
  record: SizeRecord,
  measurements: [MeasurementKey, number][],
): number {
  return measurements.reduce((distance, [key, value]) => {
    const range = record.measurementsCm[key];

    if (!range) {
      return distance + 1_000;
    }

    const center = (range.minCm + range.maxCm) / 2;
    const width = Math.max(1, range.maxCm - range.minCm);

    return distance + Math.abs(value - center) / width;
  }, 0);
}

function normalizeMeasurements(
  measurements: Partial<Record<MeasurementKey, number>>,
  unit: MeasurementUnit,
):
  | { ok: true; measurements: Partial<Record<MeasurementKey, number>> }
  | EmptyClothingSizeResult {
  const normalizedMeasurements: Partial<Record<MeasurementKey, number>> = {};

  for (const key of Object.keys(measurements) as MeasurementKey[]) {
    const rawValue = measurements[key];

    if (rawValue === undefined || Number.isNaN(rawValue)) {
      continue;
    }

    const valueCm = unit === "cm" ? rawValue : rawValue * 2.54;
    const plausibleRange = PLAUSIBLE_MEASUREMENT_RANGES_CM[key];

    if (
      !Number.isFinite(valueCm) ||
      valueCm <= 0 ||
      valueCm < plausibleRange.minCm ||
      valueCm > plausibleRange.maxCm
    ) {
      return emptyResult(
        "invalid-measurement",
        `${MEASUREMENT_METADATA[key].label} está fuera de un rango plausible.`,
        `Revisa la unidad (${unit}) y captura una medida positiva antes de continuar.`,
      );
    }

    normalizedMeasurements[key] = valueCm;
  }

  return { ok: true, measurements: normalizedMeasurements };
}

function getProvidedMeasurements(
  measurements: Partial<Record<MeasurementKey, number>>,
  keys: MeasurementKey[] = [...Object.keys(MEASUREMENT_METADATA)] as MeasurementKey[],
): [MeasurementKey, number][] {
  return keys.flatMap((key) => {
    const value = measurements[key];

    return value === undefined ? [] : [[key, value] as [MeasurementKey, number]];
  });
}

function emptyResult(
  reason: EmptyClothingSizeResult["reason"],
  message: string,
  suggestion: string,
): EmptyClothingSizeResult {
  return {
    ok: false,
    reason,
    message,
    suggestion,
  };
}

function degradeConfidence(confidence: ConfidenceLevel): ConfidenceLevel {
  if (confidence === "alta") {
    return "media";
  }

  return "baja";
}

function normalizeSizeLabel(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "");
}

function cmToIn(value: number): number {
  return value / 2.54;
}

function formatNumber(value: number, maximumFractionDigits: number): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}
