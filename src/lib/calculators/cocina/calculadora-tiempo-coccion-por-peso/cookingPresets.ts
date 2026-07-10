import type { CookingRateUnit } from "./cookingTime";

export interface CookingPreset {
  id: string;
  label: string;
  food: string;
  method: string;
  rateUnit: CookingRateUnit;
  minMinutesPerUnit: number;
  maxMinutesPerUnit: number;
  restMinutesDefault?: number;
  ovenTemperature: string;
  sourceLabel: string;
  sourceUrl?: string;
  reviewedAt: string;
  note: string;
}

export const COOKING_PRESETS: CookingPreset[] = [
  {
    id: "pollo-entero-horno",
    label: "Pollo entero al horno",
    food: "Pollo entero",
    method: "Horno convencional, sin relleno",
    rateUnit: "min/lb",
    minMinutesPerUnit: 20,
    maxMinutesPerUnit: 27,
    restMinutesDefault: 15,
    ovenTemperature: "375 °F / 190 °C",
    sourceLabel: "Better Homes & Gardens Test Kitchen",
    sourceUrl:
      "https://www.bhg.com/recipes/how-to/handling-meat/cook-whole-chicken/",
    reviewedAt: "2026-07-10",
    note: "Referencia para pollo entero sin relleno. El tamaño, el molde y la temperatura inicial cambian el tiempo real.",
  },
  {
    id: "pavo-entero-sin-relleno",
    label: "Pavo entero sin relleno",
    food: "Pavo entero",
    method: "Horno convencional, sin relleno",
    rateUnit: "min/lb",
    minMinutesPerUnit: 15,
    maxMinutesPerUnit: 20,
    restMinutesDefault: 20,
    ovenTemperature: "325 °F / 165 °C",
    sourceLabel: "Butterball Turkey Talk-Line via Southern Living",
    sourceUrl:
      "https://www.southernliving.com/butterball-turkey-hotline-top-questions-8748943",
    reviewedAt: "2026-07-10",
    note: "Referencia general para pavo descongelado y sin relleno. Si esta relleno o parcialmente congelado, usa otra referencia.",
  },
  {
    id: "res-asada-horno",
    label: "Carne de res asada",
    food: "Asado de res",
    method: "Horno convencional",
    rateUnit: "min/lb",
    minMinutesPerUnit: 18,
    maxMinutesPerUnit: 22,
    restMinutesDefault: 20,
    ovenTemperature: "375 °F / 190 °C",
    sourceLabel: "Allrecipes",
    sourceUrl: "https://www.allrecipes.com/article/how-to-cook-roast-beef/",
    reviewedAt: "2026-07-10",
    note: "Referencia orientativa para cortes enteros de res. El punto deseado y el corte pueden cambiar mucho el tiempo.",
  },
  {
    id: "cerdo-lomo-asado",
    label: "Cerdo asado",
    food: "Lomo o roast de cerdo",
    method: "Horno convencional",
    rateUnit: "min/lb",
    minMinutesPerUnit: 23,
    maxMinutesPerUnit: 27,
    restMinutesDefault: 15,
    ovenTemperature: "350 °F / 175 °C",
    sourceLabel: "Allrecipes / National Pork Board",
    sourceUrl: "https://www.allrecipes.com/article/cooking-questions-pork/",
    reviewedAt: "2026-07-10",
    note: "Referencia para roast de cerdo. Usa termometro y deja reposar antes de cortar.",
  },
  {
    id: "pescado-entero-costra-sal",
    label: "Pescado entero al horno",
    food: "Pescado entero",
    method: "Horno alto o costra de sal",
    rateUnit: "min/lb",
    minMinutesPerUnit: 10,
    maxMinutesPerUnit: 12,
    restMinutesDefault: 0,
    ovenTemperature: "450 °F / 230 °C",
    sourceLabel: "The Wall Street Journal",
    sourceUrl:
      "https://www.wsj.com/recipes/whole-roasted-saltcrusted-fish-a4907dad",
    reviewedAt: "2026-07-10",
    note: "Metodo rapido para pescado entero. Verifica temperatura interna o que la carne se separe facilmente.",
  },
  {
    id: "verduras-asadas-bandeja",
    label: "Verduras asadas",
    food: "Verduras densas o mixtas",
    method: "Una bandeja sin amontonar",
    rateUnit: "min/kg",
    minMinutesPerUnit: 30,
    maxMinutesPerUnit: 45,
    restMinutesDefault: 0,
    ovenTemperature: "450 °F / 230 °C",
    sourceLabel: "Better Homes & Gardens",
    sourceUrl:
      "https://www.bhg.com/recipes/how-to/cooking-basics/how-to-roast-vegetables/",
    reviewedAt: "2026-07-10",
    note: "El peso no escala de forma lineal si llenas varias bandejas. Corta parejo y evita amontonar.",
  },
];

export function getCookingPreset(id: string): CookingPreset | undefined {
  return COOKING_PRESETS.find((preset) => preset.id === id);
}
