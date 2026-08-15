export interface VacationSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

export interface VacationEntitlement {
  serviceYearFrom: number;
  serviceYearTo?: number;
  workingDays: number;
}

export interface VacationRuleSet {
  id: string;
  country: "MX";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: "current" | "expired" | "draft";
  entitlementUnit: "working-days";
  prorationBasis: "calendar-days-between-anniversaries";
  entitlementByServiceYear: VacationEntitlement[];
  sources: VacationSource[];
  reviewedAt: string;
}

export const MEXICO_VACATION_RULE_2023: VacationRuleSet = {
  id: "mx-lft-general-2023",
  country: "MX",
  employmentRegime: "lft-private-sector-general",
  ruleVersion: "2023",
  effectiveFrom: "2023-01-01",
  status: "current",
  entitlementUnit: "working-days",
  prorationBasis: "calendar-days-between-anniversaries",
  entitlementByServiceYear: [
    { serviceYearFrom: 1, serviceYearTo: 1, workingDays: 12 },
    { serviceYearFrom: 2, serviceYearTo: 2, workingDays: 14 },
    { serviceYearFrom: 3, serviceYearTo: 3, workingDays: 16 },
    { serviceYearFrom: 4, serviceYearTo: 4, workingDays: 18 },
    { serviceYearFrom: 5, serviceYearTo: 5, workingDays: 20 },
    { serviceYearFrom: 6, serviceYearTo: 10, workingDays: 22 },
    { serviceYearFrom: 11, serviceYearTo: 15, workingDays: 24 },
    { serviceYearFrom: 16, serviceYearTo: 20, workingDays: 26 },
    { serviceYearFrom: 21, serviceYearTo: 25, workingDays: 28 },
    { serviceYearFrom: 26, serviceYearTo: 30, workingDays: 30 },
  ],
  sources: [
    {
      title: "Ley Federal del Trabajo vigente",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      articles: ["76", "77", "78", "79", "80", "81"],
      accessedAt: "2026-08-12",
    },
    {
      title: "PROFEDET - Vacaciones",
      url: "https://profedet.gob.mx/micrositio/index.php/vacaciones",
      accessedAt: "2026-08-12",
    },
    {
      title: "PROFEDET - Renuncia voluntaria",
      url: "https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria",
      accessedAt: "2026-08-12",
    },
  ],
  reviewedAt: "2026-08-12",
};

export function getMexicoLegalVacationDays(serviceYear: number): number {
  if (!Number.isInteger(serviceYear) || serviceYear < 1) {
    throw new RangeError("serviceYear must be a positive integer");
  }

  if (serviceYear <= 5) {
    return 10 + 2 * serviceYear;
  }

  return 20 + 2 * Math.ceil((serviceYear - 5) / 5);
}
