export interface VacationPremiumSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

export interface VacationPremiumRuleSet {
  id: string;
  country: "MX";
  jurisdiction: "federal";
  employmentRegime: "lft-private-sector-general";
  currency: "MXN";
  locale: "es-MX";
  ruleVersion: string;
  supportedFrom: string;
  supportedTo?: string;
  status: "current" | "expired" | "draft";
  minimumPremiumRate: number;
  premiumBase: "ordinary-vacation-wages";
  vacationDayUnit: "working-days";
  salaryDivisors: Record<"daily" | "weekly" | "biweekly" | "monthly", number>;
  sources: VacationPremiumSource[];
  reviewedAt: string;
}

export const MEXICO_VACATION_PREMIUM_RULE_2023: VacationPremiumRuleSet = {
  id: "mx-lft-general-vacation-premium-2023-coverage",
  country: "MX",
  jurisdiction: "federal",
  employmentRegime: "lft-private-sector-general",
  currency: "MXN",
  locale: "es-MX",
  ruleVersion: "2023-current-review",
  supportedFrom: "2023-01-01",
  status: "current",
  minimumPremiumRate: 0.25,
  premiumBase: "ordinary-vacation-wages",
  vacationDayUnit: "working-days",
  salaryDivisors: {
    daily: 1,
    weekly: 7,
    biweekly: 15,
    monthly: 30,
  },
  sources: [
    {
      title: "Ley Federal del Trabajo vigente",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf",
      articles: ["76", "79", "80"],
      accessedAt: "2026-08-14",
    },
    {
      title: "PROFEDET - Prima vacacional",
      url: "https://www.profedet.gob.mx/micrositio/index.php/prima-vacacional",
      accessedAt: "2026-08-14",
    },
    {
      title: "PROFEDET - Vacaciones",
      url: "https://www.profedet.gob.mx/micrositio/index.php/vacaciones",
      accessedAt: "2026-08-14",
    },
  ],
  reviewedAt: "2026-08-14",
};
