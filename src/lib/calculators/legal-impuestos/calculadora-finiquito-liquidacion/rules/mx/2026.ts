import { MEXICO_TERMINATION_RULE_2025 } from "./2025";

export type MinimumWageArea = "general" | "northern-border";

export interface LegalSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

export interface TerminationRuleSet {
  id: string;
  country: "MX";
  currency: "MXN";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: "current" | "expired" | "draft";
  annualBonusMinimumDays: number;
  vacationPremiumMinimumRate: number;
  seniorityPremiumDaysPerYear: number;
  seniorityVoluntaryMinimumYears: number;
  seniorityPartialYearPolicy: "proportional";
  minimumWageByArea: Record<MinimumWageArea, number>;
  sources: LegalSource[];
  reviewedAt: string;
}

export const MEXICO_TERMINATION_RULE_2026: TerminationRuleSet = {
  id: "mx-lft-general-2026",
  country: "MX",
  currency: "MXN",
  employmentRegime: "lft-private-sector-general",
  ruleVersion: "2026-01",
  effectiveFrom: "2026-01-01",
  status: "current",
  annualBonusMinimumDays: 15,
  vacationPremiumMinimumRate: 0.25,
  seniorityPremiumDaysPerYear: 12,
  seniorityVoluntaryMinimumYears: 15,
  seniorityPartialYearPolicy: "proportional",
  minimumWageByArea: {
    general: 315.04,
    "northern-border": 440.87,
  },
  sources: [
    {
      title: "Ley Federal del Trabajo vigente",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      articles: ["33", "48", "49", "50", "76", "79", "80", "84", "87", "89", "162", "485", "486"],
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Derechos en caso de renuncia o despido",
      url: "https://www.gob.mx/profedet/articulos/conoce-tus-derechos-en-caso-de-renuncia-o-despido?idiom=es",
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Renuncia voluntaria",
      url: "https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria",
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Despido",
      url: "https://profedet.gob.mx/profedet/micrositio/index.php/despido",
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Rescisión",
      url: "https://profedet.gob.mx/profedet/micrositio/index.php/rescision",
      accessedAt: "2026-08-13",
    },
    {
      title: "CONASAMI - Salarios mínimos por área geográfica",
      url: "https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales-y-profesionales-por-areas-geograficas",
      accessedAt: "2026-08-13",
    },
  ],
  reviewedAt: "2026-08-13",
};

export function getMexicoTerminationRule(endDate: string): TerminationRuleSet {
  if (endDate >= MEXICO_TERMINATION_RULE_2026.effectiveFrom) {
    return MEXICO_TERMINATION_RULE_2026;
  }
  if (endDate >= MEXICO_TERMINATION_RULE_2025.effectiveFrom) {
    return MEXICO_TERMINATION_RULE_2025;
  }
  throw new RangeError("No termination rule covers this date");
}
