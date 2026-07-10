export interface SafeTemperatureEntry {
  food: string;
  detail: string;
  temperatureF: number | null;
  temperatureC: number | null;
  restTime: string;
  note: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedAt: string;
  editorialReviewedAt: string;
}

export const SAFE_TEMPERATURE_SOURCE = {
  name: "FoodSafety.gov: Cook to a Safe Minimum Internal Temperature",
  url: "https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures",
  sourceReviewedAt: "2024-11-21",
  editorialReviewedAt: "2026-07-10",
} as const;

const sourceFields = {
  sourceName: SAFE_TEMPERATURE_SOURCE.name,
  sourceUrl: SAFE_TEMPERATURE_SOURCE.url,
  sourceReviewedAt: SAFE_TEMPERATURE_SOURCE.sourceReviewedAt,
  editorialReviewedAt: SAFE_TEMPERATURE_SOURCE.editorialReviewedAt,
} as const;

export const SAFE_TEMPERATURES: SafeTemperatureEntry[] = [
  {
    food: "Aves",
    detail: "Pollo, pavo y otras aves; piezas, ave entera, carne molida, menudencias y relleno dentro del ave.",
    temperatureF: 165,
    temperatureC: 74,
    restTime: "No indicado",
    note: "Mide en la parte mas gruesa y evita tocar hueso.",
    ...sourceFields,
  },
  {
    food: "Carne molida y salchicha",
    detail: "Res, bisonte, ternera, cabra, cordero y cerdo molidos o en salchicha.",
    temperatureF: 160,
    temperatureC: 71,
    restTime: "No indicado",
    note: "La molienda distribuye bacterias de superficie por toda la mezcla.",
    ...sourceFields,
  },
  {
    food: "Cortes enteros",
    detail: "Bistecs, asados y chuletas de res, cerdo, ternera, cordero, cabra o bisonte.",
    temperatureF: 145,
    temperatureC: 63,
    restTime: "3 minutos",
    note: "El reposo permite que las partes internas terminen de alcanzar una coccion segura.",
    ...sourceFields,
  },
  {
    food: "Pescado",
    detail: "Pescado entero o filete, como salmon, atun, tilapia, bacalao o trucha.",
    temperatureF: 145,
    temperatureC: 63,
    restTime: "No indicado",
    note: "Tambien puede cocinarse hasta que la carne no este translucida y se separe facilmente con tenedor.",
    ...sourceFields,
  },
  {
    food: "Guisos y cazuelas",
    detail: "Con carne, aves o sin carne.",
    temperatureF: 165,
    temperatureC: 74,
    restTime: "No indicado",
    note: "Verifica el centro del platillo, no solo la superficie.",
    ...sourceFields,
  },
  {
    food: "Sobras recalentadas",
    detail: "Cualquier tipo de sobra.",
    temperatureF: 165,
    temperatureC: 74,
    restTime: "No indicado",
    note: "Recalienta de forma uniforme y mide la temperatura interna.",
    ...sourceFields,
  },
  {
    food: "Huevos crudos",
    detail: "Huevos cocidos solos.",
    temperatureF: null,
    temperatureC: null,
    restTime: "No indicado",
    note: "Cocina hasta que yema y clara esten firmes.",
    ...sourceFields,
  },
  {
    food: "Platillos con huevo",
    detail: "Frittata, quiche y preparaciones similares.",
    temperatureF: 160,
    temperatureC: 71,
    restTime: "No indicado",
    note: "Verifica el centro del platillo.",
    ...sourceFields,
  },
];
