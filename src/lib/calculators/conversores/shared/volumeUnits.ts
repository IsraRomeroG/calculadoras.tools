export const LITERS_PER_MILLILITER = 0.001;
export const LITERS_PER_CUBIC_CENTIMETER = 0.001;
export const LITERS_PER_CUBIC_METER = 1_000;
export const LITERS_PER_US_FLUID_OUNCE = 0.0295735295625;
export const LITERS_PER_US_PINT = 0.473176473;
export const LITERS_PER_US_QUART = 0.946352946;
export const LITERS_PER_US_GALLON = 3.785411784;
export const LITERS_PER_IMPERIAL_FLUID_OUNCE = 0.0284130625;
export const LITERS_PER_IMPERIAL_PINT = 0.56826125;
export const LITERS_PER_IMPERIAL_QUART = 1.1365225;
export const LITERS_PER_IMPERIAL_GALLON = 4.54609;

export const VOLUME_UNITS = [
  "ml",
  "l",
  "cm3",
  "m3",
  "us_fl_oz",
  "us_pt",
  "us_qt",
  "us_gal",
  "imp_fl_oz",
  "imp_pt",
  "imp_qt",
  "imp_gal",
] as const;

export type VolumeUnit = (typeof VOLUME_UNITS)[number];
export type VolumeSystem = "metric" | "us" | "imperial";

export interface VolumeUnitMetadata {
  label: string;
  singularLabel: string;
  symbol: string;
  liters: number;
  system: VolumeSystem;
  systemLabel: string;
}

export const VOLUME_UNIT_METADATA = {
  ml: {
    label: "Mililitros",
    singularLabel: "mililitro",
    symbol: "ml",
    liters: LITERS_PER_MILLILITER,
    system: "metric",
    systemLabel: "métrico",
  },
  l: {
    label: "Litros",
    singularLabel: "litro",
    symbol: "L",
    liters: 1,
    system: "metric",
    systemLabel: "métrico",
  },
  cm3: {
    label: "Centímetros cúbicos",
    singularLabel: "centímetro cúbico",
    symbol: "cm³",
    liters: LITERS_PER_CUBIC_CENTIMETER,
    system: "metric",
    systemLabel: "métrico",
  },
  m3: {
    label: "Metros cúbicos",
    singularLabel: "metro cúbico",
    symbol: "m³",
    liters: LITERS_PER_CUBIC_METER,
    system: "metric",
    systemLabel: "métrico",
  },
  us_fl_oz: {
    label: "Onzas líquidas estadounidenses",
    singularLabel: "onza líquida estadounidense",
    symbol: "fl oz US",
    liters: LITERS_PER_US_FLUID_OUNCE,
    system: "us",
    systemLabel: "líquido US",
  },
  us_pt: {
    label: "Pintas estadounidenses",
    singularLabel: "pinta estadounidense",
    symbol: "pt US",
    liters: LITERS_PER_US_PINT,
    system: "us",
    systemLabel: "líquido US",
  },
  us_qt: {
    label: "Cuartos estadounidenses",
    singularLabel: "cuarto estadounidense",
    symbol: "qt US",
    liters: LITERS_PER_US_QUART,
    system: "us",
    systemLabel: "líquido US",
  },
  us_gal: {
    label: "Galones estadounidenses",
    singularLabel: "galón estadounidense",
    symbol: "gal US",
    liters: LITERS_PER_US_GALLON,
    system: "us",
    systemLabel: "líquido US",
  },
  imp_fl_oz: {
    label: "Onzas líquidas imperiales",
    singularLabel: "onza líquida imperial",
    symbol: "fl oz imperial",
    liters: LITERS_PER_IMPERIAL_FLUID_OUNCE,
    system: "imperial",
    systemLabel: "imperial",
  },
  imp_pt: {
    label: "Pintas imperiales",
    singularLabel: "pinta imperial",
    symbol: "pt imperial",
    liters: LITERS_PER_IMPERIAL_PINT,
    system: "imperial",
    systemLabel: "imperial",
  },
  imp_qt: {
    label: "Cuartos imperiales",
    singularLabel: "cuarto imperial",
    symbol: "qt imperial",
    liters: LITERS_PER_IMPERIAL_QUART,
    system: "imperial",
    systemLabel: "imperial",
  },
  imp_gal: {
    label: "Galones imperiales",
    singularLabel: "galón imperial",
    symbol: "gal imperial",
    liters: LITERS_PER_IMPERIAL_GALLON,
    system: "imperial",
    systemLabel: "imperial",
  },
} as const satisfies Record<VolumeUnit, VolumeUnitMetadata>;

export const VOLUME_UNIT_GROUPS = [
  {
    id: "metric",
    label: "Métrico",
    units: ["ml", "l", "cm3", "m3"],
  },
  {
    id: "us",
    label: "Líquido US",
    units: ["us_fl_oz", "us_pt", "us_qt", "us_gal"],
  },
  {
    id: "imperial",
    label: "Imperial",
    units: ["imp_fl_oz", "imp_pt", "imp_qt", "imp_gal"],
  },
] as const satisfies readonly {
  id: VolumeSystem;
  label: string;
  units: readonly VolumeUnit[];
}[];
