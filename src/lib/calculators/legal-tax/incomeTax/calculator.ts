import { calculateMarginalTax } from "../core/brackets";
import { roundMoney } from "../core/money";
import type { CalculationResult } from "../types";
import { INCOME_TAX_RULE_SETS, PAYROLL_RULE_SETS, type CreditRule, type IncomeTaxProfile, type PayrollFrequency } from "./rules";

export interface IncomeTaxInput { ruleSetId: string; profileId: string; annualIncome: number }
export interface TaxComponentResult { id: string; label: string; amount: number; beforeCredit: number; credit: number; marginalRate: number }
export interface IncomeTaxResult extends CalculationResult { grossIncome: number; allowance: number; taxableIncome: number; tax: number; effectiveRate: number; marginalRate: number; components: TaxComponentResult[] }

const allowanceFor = (income: number, profile: IncomeTaxProfile) => {
  const rule = profile.allowance;
  if (rule.kind === "fixed") return Math.min(income, rule.amount);
  const reduction = Math.max(0, income - (rule.taperStartsAt ?? 0)) * (rule.taperRate ?? 0);
  return Math.min(income, Math.max(0, rule.amount - reduction));
};

const creditFor = (income: number, credit?: CreditRule) => {
  if (!credit) return 0;
  if (credit.kind === "fixed") return credit.amount ?? 0;
  const maximum = credit.maximum ?? 0;
  const minimum = credit.minimum ?? maximum;
  const start = credit.taperStartsAt ?? Number.POSITIVE_INFINITY;
  const end = credit.taperEndsAt ?? start;
  const base = income <= start ? maximum : income >= end ? minimum : maximum - (maximum - minimum) * ((income - start) / (end - start));
  return base * (credit.rate ?? 0);
};

export function calculateAnnualIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  if (!Number.isFinite(input.annualIncome) || input.annualIncome < 0) throw new RangeError("Annual income must be finite and non-negative.");
  const ruleSet = INCOME_TAX_RULE_SETS.find((item) => item.id === input.ruleSetId);
  if (!ruleSet) throw new Error("Income-tax rule set is not available.");
  const profile = ruleSet.rules.profiles.find((item) => item.id === input.profileId);
  if (!profile) throw new Error("Select a supported filing, region or assessment profile.");
  const allowance = allowanceFor(input.annualIncome, profile);
  const taxableIncome = Math.max(0, input.annualIncome - allowance);
  const components = profile.components.map((component) => {
    const marginal = calculateMarginalTax(taxableIncome, component.brackets);
    const credit = Math.min(marginal.tax, creditFor(input.annualIncome, component.credit));
    return { id: component.id, label: component.label, amount: roundMoney(Math.max(0, marginal.tax - credit), ruleSet.rounding), beforeCredit: marginal.tax, credit, marginalRate: marginal.marginalRate };
  });
  const tax = roundMoney(components.reduce((sum, item) => sum + item.amount, 0), ruleSet.rounding);
  return { ruleSetId: ruleSet.id, marketId: ruleSet.marketId, jurisdictionCode: profile.jurisdictionCode, periodId: ruleSet.periodId, currency: ruleSet.currency, coverage: ruleSet.coverage, grossIncome: input.annualIncome, allowance, taxableIncome, tax, effectiveRate: input.annualIncome ? tax / input.annualIncome : 0, marginalRate: Math.max(0, ...components.map((item) => item.marginalRate)), components, rows: components.map((item) => ({ id: item.id, amount: item.amount, status: "calculated", ruleRefs: profile.components.find((component) => component.id === item.id)?.sourceRefs ?? [] })), warnings: ["Annual estimate based on the selected profile; it is not an assessment or exact payroll withholding."], missingConcepts: ruleSet.missingConcepts };
}

const periods: Record<PayrollFrequency, number> = { annual: 1, monthly: 12, biweekly: 26, weekly: 52 };
export interface PayrollInput extends IncomeTaxInput { payrollRuleSetId: string; frequency: PayrollFrequency; annualPostTaxDeductions?: number; contributionVariantId?: string }
export interface PayrollResult extends CalculationResult { grossAnnual: number; incomeTax: number; contributions: Array<{ id: string; label: string; amount: number }>; deductions: number; netAnnual: number; netPerPeriod: number; periodsPerYear: number }

export function calculateTakeHomePay(input: PayrollInput): PayrollResult {
  const payroll = PAYROLL_RULE_SETS.find((item) => item.id === input.payrollRuleSetId);
  if (!payroll || payroll.rules.taxRuleSetRef !== input.ruleSetId) throw new Error("Payroll and income-tax rule sets are not compatible.");
  if (!payroll.rules.frequencies.includes(input.frequency)) throw new Error("Pay frequency is not supported.");
  const deductions = input.annualPostTaxDeductions ?? 0;
  if (!Number.isFinite(deductions) || deductions < 0) throw new RangeError("Deductions must be finite and non-negative.");
  const tax = calculateAnnualIncomeTax(input);
  const gross = input.annualIncome;
  const rule = payroll.rules.contributionRule;
  const contributions: PayrollResult["contributions"] = [];

  if (rule.kind === "us-fica") {
    contributions.push({ id: "social-security", label: "Employee Social Security", amount: Math.min(gross, rule.socialSecurityCap) * rule.socialSecurityRate });
    contributions.push({ id: "medicare", label: "Employee Medicare", amount: gross * rule.medicareRate });
    contributions.push({ id: "additional-medicare", label: "Additional Medicare withholding", amount: Math.max(0, gross - rule.additionalMedicareThreshold) * rule.additionalMedicareRate });
  } else if (rule.kind === "uk-ni-a") {
    const main = Math.max(0, Math.min(gross, rule.upperEarningsLimit) - rule.primaryThreshold) * rule.mainRate;
    const upper = Math.max(0, gross - rule.upperEarningsLimit) * rule.upperRate;
    contributions.push({ id: "national-insurance", label: "Employee National Insurance — category A projection", amount: main + upper });
  } else if (rule.kind === "ca-cpp-ei") {
    contributions.push({ id: "cpp", label: "CPP base and first additional", amount: Math.min(Math.max(0, Math.min(gross, rule.ympe) - rule.basicExemption) * rule.cppRate, 4_230.45) });
    contributions.push({ id: "cpp2", label: "CPP second additional", amount: Math.min(Math.max(0, Math.min(gross, rule.yampe) - rule.ympe) * rule.cpp2Rate, 416) });
    contributions.push({ id: "ei", label: "Employment Insurance", amount: Math.min(gross, rule.eiCap) * rule.eiRate });
  } else if (rule.kind === "au-medicare") {
    contributions.push({ id: "medicare-levy", label: "Medicare levy projection (full rate)", amount: gross * rule.rate });
  } else if (rule.kind === "nz-acc") {
    contributions.push({ id: "acc-earners-levy", label: "ACC earners' levy", amount: Math.min(gross, rule.cap) * rule.rate });
  } else {
    const usc = calculateMarginalTax(gross, rule.uscBrackets).tax;
    const variant = rule.prsiVariants.find((item) => item.id === input.contributionVariantId);
    if (!variant) throw new Error("Select the 2026 PRSI pay-date phase.");
    const weekly = gross / 52;
    const weeklyCredit = weekly > 352 && weekly <= 424 ? Math.max(0, 12 - (weekly - 352.01) / 6) : 0;
    const prsi = weekly <= 352 ? 0 : Math.max(0, weekly * variant.employeeRate - weeklyCredit) * 52;
    contributions.push({ id: "usc", label: "Universal Social Charge", amount: usc });
    contributions.push({ id: "prsi", label: `Employee PRSI Class A — ${variant.label}`, amount: prsi });
  }

  contributions.forEach((item) => { item.amount = roundMoney(item.amount, payroll.rounding); });
  const contributionTotal = contributions.reduce((sum, item) => sum + item.amount, 0);
  const netAnnual = roundMoney(Math.max(0, gross - tax.tax - contributionTotal - deductions), payroll.rounding);
  const periodsPerYear = periods[input.frequency];
  return { ruleSetId: payroll.id, marketId: payroll.marketId, jurisdictionCode: tax.jurisdictionCode, periodId: payroll.periodId, currency: payroll.currency, coverage: "partial", grossAnnual: gross, incomeTax: tax.tax, contributions, deductions, netAnnual, netPerPeriod: roundMoney(netAnnual / periodsPerYear, payroll.rounding), periodsPerYear, rows: [{ id: "income-tax", amount: tax.tax, status: "calculated", ruleRefs: [tax.ruleSetId] }, ...contributions.map((item) => ({ id: item.id, amount: item.amount, status: "calculated" as const, ruleRefs: [payroll.sources[0].id] })), { id: "post-tax-deductions", amount: deductions, status: deductions ? "manual" : "not-applicable", ruleRefs: [] }], warnings: ["Partial take-home pay projection; annual liability is divided by pay periods and is not exact payroll withholding."], missingConcepts: payroll.missingConcepts };
}
