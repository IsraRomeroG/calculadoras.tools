import * as base from "./sizeCharts";
import type {
  ClothingSizeResult,
  SizeConversionInput,
  SizeEstimationInput,
} from "./sizeCharts";

export {
  CLOTHING_GARMENTS,
  CLOTHING_PROFILES,
  CLOTHING_REGIONS,
  MEASUREMENT_UNITS,
  getAvailableSizes,
  getRelevantMeasurementKeys,
  isClothingDestination,
  isClothingGarment,
  isClothingProfile,
  isClothingRegion,
  isFitPreference,
  isMeasurementUnit,
} from "./sizeCharts";
export type {
  ClothingGarment,
  ClothingProfile,
  ClothingRegion,
} from "./sizeCharts";

export const PROFILE_METADATA = {
  mujer: { label: "Women", description: "Women's commercial sizing system" },
  hombre: { label: "Men", description: "Men's commercial sizing system" },
};

export const GARMENT_METADATA = {
  top: { label: "Shirt / top", shortLabel: "Top" },
  pantalon: { label: "Pants", shortLabel: "Pants" },
  vestido: { label: "Dress", shortLabel: "Dress" },
};

export const REGION_METADATA = {
  international: { label: "International", shortLabel: "Int." },
  us: { label: "United States", shortLabel: "US" },
  eu: { label: "Europe", shortLabel: "EU" },
  uk: { label: "United Kingdom", shortLabel: "UK" },
  mx: { label: "Mexico", shortLabel: "MX" },
};

export const DESTINATION_METADATA = {
  ...REGION_METADATA,
  all: { label: "View all regions", shortLabel: "All" },
};

export const MEASUREMENT_METADATA = {
  chest: { label: "Chest", help: "Around the fullest part of the torso." },
  waist: { label: "Waist", help: "Around the area where the garment sits." },
  hip: { label: "Hips", help: "Around the fullest part of the hips." },
  inseam: { label: "Inseam", help: "From the crotch to the desired pant length." },
};

export const FIT_METADATA = {
  ajustado: "Fitted",
  regular: "Regular",
  holgado: "Relaxed",
};

export function convertClothingSize(input: SizeConversionInput): ClothingSizeResult {
  return localizeResult(base.convertClothingSize(input));
}

export function estimateClothingSize(input: SizeEstimationInput): ClothingSizeResult {
  return localizeResult(base.estimateClothingSize(input));
}

export function formatAllRegionLabels(
  labels: Parameters<typeof base.formatAllRegionLabels>[0],
) {
  return base.CLOTHING_REGIONS.flatMap((region) => {
    const label = labels[region];
    return label ? [`${REGION_METADATA[region].shortLabel} ${label}`] : [];
  }).join(" · ");
}

function localizeResult(result: ClothingSizeResult): ClothingSizeResult {
  if (!result.ok) {
    return {
      ...result,
      message: translate(result.message),
      suggestion: translate(result.suggestion),
    };
  }

  const record = {
    ...result.record,
    sourceNote: "Approximate editorial chart for guidance between commercial sizing systems.",
    ...(result.record.editorialNote
      ? { editorialNote: translate(result.record.editorialNote) }
      : {}),
    ...(result.record.fitNotes ? { fitNotes: translate(result.record.fitNotes) } : {}),
  };
  const localized = {
    ...result,
    record,
    measurements: result.measurements.map((measurement) => ({
      ...measurement,
      label: MEASUREMENT_METADATA[measurement.key].label,
    })),
    confidenceReason: translate(result.confidenceReason),
    guide: translate(result.guide),
    warning:
      "Sizes vary by brand, cut, fabric and season. Use this result as a starting point and confirm it with the brand's chart.",
  };

  return {
    ...localized,
    copyText: [
      `Approximate size: ${localized.primaryLabel}`,
      `Equivalents: ${formatAllRegionLabels(localized.allLabels)}`,
      `Measurements: ${localized.measurements.map((measurement) => `${measurement.label} ${measurement.value}`).join(", ")}`,
      `Confidence: ${localized.confidence === "alta" ? "high" : localized.confidence === "media" ? "medium" : "low"}`,
      `Editorial review: ${localized.record.revisedAt}`,
      localized.warning,
    ].join("\n"),
  };
}

function translate(value: string) {
  const replacements: Array<[string, string]> = [
    ["Elige una talla de origen para ver la equivalencia.", "Choose a source size to view the equivalent."],
    ["Selecciona una talla disponible para esa prenda, región y sistema comercial.", "Select an available size for that garment, region and sizing system."],
    ["No tenemos una equivalencia confiable para esa talla de origen.", "No reliable equivalent is available for that source size."],
    ["Prueba con otra región de origen o compara directamente con la tabla de la marca.", "Try another source region or compare directly with the brand chart."],
    ["Ingresa al menos una medida para estimar una talla aproximada.", "Enter at least one measurement to estimate an approximate size."],
    ["Tus medidas no caen dentro de los rangos disponibles para esta tabla.", "Your measurements do not fall within the ranges in this chart."],
    ["No vamos a inventar una talla fuera de la tabla. Compara tus medidas con la guía de la marca.", "No size will be guessed outside the chart. Compare your measurements with the brand guide."],
    ["Esta tabla no tiene una equivalencia confiable para la región destino.", "This chart has no reliable equivalent for the destination region."],
    ["Hay equivalencia directa y rangos completos para esta prenda.", "A direct equivalent and complete measurement ranges are available."],
    ["Hay equivalencia directa, pero las tallas pueden solaparse entre marcas.", "A direct equivalent is available, but sizes may overlap between brands."],
    ["La tabla es parcial o la equivalencia está menos estandarizada; confirma con la marca.", "The chart is partial or the equivalent is less standardized; confirm with the brand."],
    ["Empieza por ", "Start with "],
    [" y revisa la tabla de la marca antes de comprar.", " and check the brand chart before buying."],
    ["Si prefieres más amplitud o la prenda es slim, revisa también ", "If you prefer more room or the garment is slim, also check "],
    ["pero compara ", "but compare "],
    [" con la marca: está cerca del límite superior del rango.", " with the brand chart: it is near the upper end of the range."],
    ["Pecho", "Chest"],
    ["Cintura", "Waist"],
    ["Cadera", "Hips"],
    ["Entrepierna", "Inseam"],
  ];
  return replacements.reduce((text, [from, to]) => text.replaceAll(from, to), value);
}
