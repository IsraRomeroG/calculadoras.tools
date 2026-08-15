import type { TerminationRuleSet } from "./2026";

export const MEXICO_TERMINATION_RULE_2025: TerminationRuleSet = {
  id: "mx-lft-general-2025",
  country: "MX",
  currency: "MXN",
  employmentRegime: "lft-private-sector-general",
  ruleVersion: "2025-01",
  effectiveFrom: "2025-01-01",
  effectiveTo: "2025-12-31",
  status: "expired",
  annualBonusMinimumDays: 15,
  vacationPremiumMinimumRate: 0.25,
  seniorityPremiumDaysPerYear: 12,
  seniorityVoluntaryMinimumYears: 15,
  seniorityPartialYearPolicy: "proportional",
  minimumWageByArea: {
    general: 278.8,
    "northern-border": 419.88,
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
