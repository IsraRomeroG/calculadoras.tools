export interface CalculatorCategoryMetadata {
  slug: string;
  label: string;
  description: string;
}

export const CALCULATOR_CATEGORIES = {
  finanzas: {
    slug: "finanzas",
    label: "Finanzas",
    description:
      "Calculadoras para estimar préstamos, intereses y escenarios de inversión antes de comprometer tu dinero.",
  },
  inmuebles: {
    slug: "inmuebles",
    label: "Inmuebles",
    description:
      "Herramientas para estimar pagos, financiamiento y escenarios relacionados con vivienda e inmuebles.",
  },
  "legal-impuestos": {
    slug: "legal-impuestos",
    label: "Legal e impuestos",
    description:
      "Herramientas para agregar o desglosar impuestos, revisar montos con IVA y preparar cifras útiles para facturas o presupuestos.",
  },
  matematicas: {
    slug: "matematicas",
    label: "Matemáticas",
    description:
      "Calculadoras para porcentajes, proporciones y reglas de tres, con resultados directos para tareas, compras y trabajo.",
  },
  salud: {
    slug: "salud",
    label: "Salud",
    description:
      "Calculadoras de referencia para revisar indicadores personales y entender mejor tus resultados de bienestar.",
  },
  "fecha-tiempo": {
    slug: "fecha-tiempo",
    label: "Fecha y tiempo",
    description:
      "Herramientas para calcular edades, intervalos, cumpleaños y fechas importantes con claridad.",
  },
} as const satisfies Record<string, CalculatorCategoryMetadata>;

export type CalculatorCategorySlug = keyof typeof CALCULATOR_CATEGORIES;
