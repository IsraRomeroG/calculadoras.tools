import * as base from "./loan";

export * from "./loan";

export const LOAN_TYPES = base.LOAN_TYPES.map((loanType) => ({
  ...loanType,
  label: {
    "personal-bank": "Bank personal loan",
    payroll: "Payroll loan",
    auto: "Auto financing",
    "credit-card": "Credit card",
    private: "Private loan",
    microcredit: "Microloan / fintech",
  }[loanType.value] ?? loanType.label,
  typicalTerm: loanType.typicalTerm.replace("meses", "months"),
}));

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(base.roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(base.roundCurrency(value))}%`;
}

export function formatDuration(months: number): string {
  if (!Number.isFinite(months)) return "Not achievable";
  const roundedMonths = Math.max(Math.round(months), 0);
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (remainingMonths > 0 || parts.length === 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`);
  }
  return parts.join(" ");
}
