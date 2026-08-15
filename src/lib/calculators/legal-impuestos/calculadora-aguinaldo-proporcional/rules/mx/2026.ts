export interface AnnualBonusSource {
  title: string;
  url: string;
  articles?: string[];
  accessedAt: string;
}

export interface AnnualBonusRuleSet {
  id: string;
  country: "MX";
  currency: "MXN";
  locale: "es-MX";
  employmentRegime: "lft-private-sector-general";
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  reviewedAt: string;
  status: "current" | "expired" | "draft";
  minimumDays: number;
  dateCountingPolicy: "inclusive-civil-days";
  accrualBasisPolicy: "calendar-days-in-period";
  salaryDivisors: Record<"daily" | "weekly" | "biweekly" | "monthly", number>;
  sources: AnnualBonusSource[];
}

export const MEXICO_ANNUAL_BONUS_RULE_2026: AnnualBonusRuleSet = {
  id: "mx-lft-general-annual-bonus-2026-review",
  country: "MX",
  currency: "MXN",
  locale: "es-MX",
  employmentRegime: "lft-private-sector-general",
  ruleVersion: "2026-review",
  effectiveFrom: "1976-01-01",
  reviewedAt: "2026-08-13",
  status: "current",
  minimumDays: 15,
  dateCountingPolicy: "inclusive-civil-days",
  accrualBasisPolicy: "calendar-days-in-period",
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
      articles: ["87", "89"],
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Preguntas frecuentes sobre aguinaldo 2025",
      url: "https://www.gob.mx/profedet/documentos/preguntas-frecuentes-aguinaldo-2025",
      accessedAt: "2026-08-13",
    },
    {
      title: "PROFEDET - Orientación sobre salario fijo y variable",
      url: "https://www.gob.mx/profedet/prensa/la-profedet-y-la-stps-invitan-a-las-empresas-a-cumplir-con-el-pago-del-aguinaldo",
      accessedAt: "2026-08-13",
    },
  ],
};
