import type { LegalSource, RuleSetEnvelope } from "../types";
import type { MarginalBracket } from "../core/brackets";

export interface AllowanceRule {
  kind: "fixed" | "uk-taper";
  amount: number;
  taperStartsAt?: number;
  taperRate?: number;
}

export interface CreditRule {
  kind: "fixed" | "canada-bpa";
  amount?: number;
  rate?: number;
  maximum?: number;
  minimum?: number;
  taperStartsAt?: number;
  taperEndsAt?: number;
}

export interface IncomeTaxComponentRule {
  id: string;
  label: string;
  brackets: MarginalBracket[];
  credit?: CreditRule;
  sourceRefs: string[];
}

export interface IncomeTaxProfile {
  id: string;
  label: string;
  jurisdictionCode: string;
  allowance: AllowanceRule;
  components: IncomeTaxComponentRule[];
}

export interface IncomeTaxRuleSet {
  taxPeriodLabel: string;
  inputLabel: string;
  profiles: IncomeTaxProfile[];
  excludedByDefault: string[];
}

export type PayrollFrequency = "annual" | "monthly" | "biweekly" | "weekly";

export type ContributionRule =
  | { kind: "us-fica"; socialSecurityRate: number; socialSecurityCap: number; medicareRate: number; additionalMedicareRate: number; additionalMedicareThreshold: number }
  | { kind: "uk-ni-a"; primaryThreshold: number; upperEarningsLimit: number; mainRate: number; upperRate: number }
  | { kind: "ca-cpp-ei"; basicExemption: number; ympe: number; yampe: number; cppRate: number; cpp2Rate: number; eiRate: number; eiCap: number }
  | { kind: "au-medicare"; rate: number }
  | { kind: "nz-acc"; rate: number; cap: number }
  | { kind: "ie-usc-prsi"; uscBrackets: MarginalBracket[]; prsiVariants: Array<{ id: string; label: string; employeeRate: number }> };

export interface PayrollRuleSet {
  taxRuleSetRef: string;
  frequencies: PayrollFrequency[];
  contributionRule: ContributionRule;
  optionalModules: string[];
  excludedByDefault: string[];
}

const accessedAt = "2026-08-15";
const rounding = { mode: "half-up", precision: 2, stage: "total" } as const;
const source = (value: Omit<LegalSource, "accessedAt" | "primary">): LegalSource => ({ ...value, accessedAt, primary: true });

const envelope = <T>(definition: Omit<RuleSetEnvelope<T>, "publishedAt" | "reviewedAt" | "reviewDueAt" | "status" | "rounding" | "officialFixtures">): RuleSetEnvelope<T> => ({
  ...definition,
  publishedAt: "2026-08-15",
  reviewedAt: "2026-08-15",
  reviewDueAt: "2026-11-30",
  status: "current",
  rounding,
  officialFixtures: [{ id: `${definition.id}-official-boundary`, sourceId: definition.sources[0].id, periodId: definition.periodId, description: "Boundary fixture derived from the authority's published table." }],
});

const usTaxSource = source({ id: "us-irs-2026-adjustments", authority: "Internal Revenue Service", title: "Tax year 2026 inflation adjustments", url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill", sourceVersion: "IR-2025-103 / Revenue Procedure 2025-32", effectiveFrom: "2026-01-01", appliesTo: ["federal-brackets", "standard-deduction"] });
const gbTaxSource = source({ id: "gb-hmrc-income-tax-2026-27", authority: "HM Revenue & Customs", title: "Income Tax rates and Personal Allowances", url: "https://www.gov.uk/income-tax-rates/current-rates-and-allowances", effectiveFrom: "2026-04-06", appliesTo: ["personal-allowance", "rest-of-uk-bands"] });
const gbScotlandSource = source({ id: "gb-scotland-income-tax-2026-27", authority: "Scottish Government / GOV.UK", title: "Scottish Income Tax current rates", url: "https://www.gov.uk/scottish-income-tax", effectiveFrom: "2026-04-06", appliesTo: ["scottish-bands"] });
const caTaxSource = source({ id: "ca-cra-rates-2026", authority: "Canada Revenue Agency", title: "Current year tax rates and income brackets (2026)", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html", sourceVersion: "Updated 2026-06-25", effectiveFrom: "2026-01-01", appliesTo: ["federal-brackets", "ontario-brackets"] });
const caPayrollSource = source({ id: "ca-cra-t4032-on-2026", authority: "Canada Revenue Agency", title: "T4032-ON Payroll Deductions Tables — January 2026", url: "https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/tx/bsnss/tpcs/pyrll/t4032/2026/t4032-on-1-26e.pdf", effectiveFrom: "2026-01-01", appliesTo: ["federal-bpa", "ontario-bpa", "payroll-method"] });
const auTaxSource = source({ id: "au-tax-rates-act-2026-27", authority: "Australian Taxation Office", title: "Treasury Laws Amendment (More Cost of Living Relief) Act 2025", url: "https://www.ato.gov.au/law/view/pdf/acts/20250028.pdf", effectiveFrom: "2026-07-01", appliesTo: ["resident-brackets"] });
const nzTaxSource = source({ id: "nz-ird-individual-rates", authority: "Inland Revenue", title: "Tax rates for individuals", url: "https://www.ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals", effectiveFrom: "2025-04-01", appliesTo: ["individual-brackets"] });
const ieTaxSource = source({ id: "ie-revenue-tax-2026", authority: "Revenue", title: "Tax rates, bands and reliefs", url: "https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx", effectiveFrom: "2026-01-01", appliesTo: ["income-tax-bands", "personal-credit", "employee-credit"] });

const usSingleBrackets: MarginalBracket[] = [
  { lower: 0, upper: 12_400, rate: 0.1 }, { lower: 12_400, upper: 50_400, rate: 0.12 },
  { lower: 50_400, upper: 105_700, rate: 0.22 }, { lower: 105_700, upper: 201_775, rate: 0.24 },
  { lower: 201_775, upper: 256_225, rate: 0.32 }, { lower: 256_225, upper: 640_600, rate: 0.35 },
  { lower: 640_600, rate: 0.37 },
];
const usJointBrackets: MarginalBracket[] = [
  { lower: 0, upper: 24_800, rate: 0.1 }, { lower: 24_800, upper: 100_800, rate: 0.12 },
  { lower: 100_800, upper: 211_400, rate: 0.22 }, { lower: 211_400, upper: 403_550, rate: 0.24 },
  { lower: 403_550, upper: 512_450, rate: 0.32 }, { lower: 512_450, upper: 768_700, rate: 0.35 },
  { lower: 768_700, rate: 0.37 },
];
const caFederal: MarginalBracket[] = [
  { lower: 0, upper: 58_523, rate: 0.14 }, { lower: 58_523, upper: 117_045, rate: 0.205 },
  { lower: 117_045, upper: 181_440, rate: 0.26 }, { lower: 181_440, upper: 258_482, rate: 0.29 },
  { lower: 258_482, rate: 0.33 },
];
const caOntario: MarginalBracket[] = [
  { lower: 0, upper: 53_891, rate: 0.0505 }, { lower: 53_891, upper: 107_785, rate: 0.0915 },
  { lower: 107_785, upper: 150_000, rate: 0.1116 }, { lower: 150_000, upper: 220_000, rate: 0.1216 },
  { lower: 220_000, rate: 0.1316 },
];

export const INCOME_TAX_RULE_SETS: RuleSetEnvelope<IncomeTaxRuleSet>[] = [
  envelope({
    id: "us-federal-income-tax-2026", familyId: "income-tax", marketId: "us", countryCode: "US", jurisdictionCode: "US-FED", regimeId: "individual-employment-income", periodId: "2026", currency: "USD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial",
    missingConcepts: ["State and local income tax", "Itemized and additional deductions", "Tax credits, AMT and special income"], assumptions: ["Employment income is the only income entered.", "The selected standard deduction is available."], sources: [usTaxSource],
    rules: { taxPeriodLabel: "2026 calendar tax year", inputLabel: "Annual gross employment income", profiles: [
      { id: "single", label: "Single — standard deduction", jurisdictionCode: "US-FED", allowance: { kind: "fixed", amount: 16_100 }, components: [{ id: "federal-income-tax", label: "Federal income tax", brackets: usSingleBrackets, sourceRefs: [usTaxSource.id] }] },
      { id: "married-joint", label: "Married filing jointly — standard deduction", jurisdictionCode: "US-FED", allowance: { kind: "fixed", amount: 32_200 }, components: [{ id: "federal-income-tax", label: "Federal income tax", brackets: usJointBrackets, sourceRefs: [usTaxSource.id] }] },
    ], excludedByDefault: ["State/local tax", "W-4 adjustments", "Credits and non-employment income"] },
  }),
  envelope({
    id: "gb-income-tax-2026-27", familyId: "income-tax", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB", regimeId: "employee-nsnd-income", periodId: "2026-27", currency: "GBP", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05", coverage: "partial",
    missingConcepts: ["Savings, dividend and property-specific treatment", "Blind Person's Allowance and other reliefs"], assumptions: ["Income is non-savings, non-dividend employment income.", "The standard Personal Allowance rules apply."], sources: [gbTaxSource, gbScotlandSource],
    rules: { taxPeriodLabel: "6 April 2026 to 5 April 2027", inputLabel: "Annual employment income", profiles: [
      { id: "rest-of-uk", label: "England, Wales or Northern Ireland", jurisdictionCode: "GB-RUK", allowance: { kind: "uk-taper", amount: 12_570, taperStartsAt: 100_000, taperRate: 0.5 }, components: [{ id: "income-tax", label: "Income Tax", brackets: [{ lower: 0, upper: 37_700, rate: 0.2 }, { lower: 37_700, upper: 125_140, rate: 0.4 }, { lower: 125_140, rate: 0.45 }], sourceRefs: [gbTaxSource.id] }] },
      { id: "scotland", label: "Scotland", jurisdictionCode: "GB-SCT", allowance: { kind: "uk-taper", amount: 12_570, taperStartsAt: 100_000, taperRate: 0.5 }, components: [{ id: "scottish-income-tax", label: "Scottish Income Tax", brackets: [{ lower: 0, upper: 3_967, rate: 0.19 }, { lower: 3_967, upper: 16_956, rate: 0.2 }, { lower: 16_956, upper: 31_092, rate: 0.21 }, { lower: 31_092, upper: 62_430, rate: 0.42 }, { lower: 62_430, upper: 125_140, rate: 0.45 }, { lower: 125_140, rate: 0.48 }], sourceRefs: [gbScotlandSource.id] }] },
    ], excludedByDefault: ["Savings/dividend income", "Student loans and pension adjustments"] },
  }),
  envelope({
    id: "ca-on-income-tax-2026", familyId: "income-tax", marketId: "ca", countryCode: "CA", jurisdictionCode: "CA-ON", regimeId: "individual-employment-income", periodId: "2026", currency: "CAD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial",
    missingConcepts: ["Ontario surtax and Ontario Health Premium", "Credits other than basic personal amounts", "Provinces and territories other than Ontario"], assumptions: ["Resident in Ontario on 31 December 2026.", "Maximum/basic personal amounts are applied using the published taper."], sources: [caTaxSource, caPayrollSource],
    rules: { taxPeriodLabel: "2026 calendar tax year", inputLabel: "Annual taxable employment income", profiles: [{ id: "ontario", label: "Ontario resident", jurisdictionCode: "CA-ON", allowance: { kind: "fixed", amount: 0 }, components: [
      { id: "federal-income-tax", label: "Federal income tax before other credits", brackets: caFederal, credit: { kind: "canada-bpa", rate: 0.14, maximum: 16_452, minimum: 14_829, taperStartsAt: 181_440, taperEndsAt: 258_482 }, sourceRefs: [caTaxSource.id, caPayrollSource.id] },
      { id: "ontario-income-tax", label: "Ontario income tax before surtax/health premium", brackets: caOntario, credit: { kind: "fixed", amount: 12_989 * 0.0505 }, sourceRefs: [caTaxSource.id, caPayrollSource.id] },
    ] }], excludedByDefault: ["Ontario surtax and Health Premium", "Other provincial/territorial rules"] },
  }),
  envelope({
    id: "au-income-tax-2026-27", familyId: "income-tax", marketId: "au", countryCode: "AU", jurisdictionCode: "AU", regimeId: "resident-individual", periodId: "2026-27", currency: "AUD", effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", coverage: "partial",
    missingConcepts: ["Offsets", "Medicare levy reduction/exemption and surcharge", "Study and training loan repayments"], assumptions: ["Australian resident for the full income year."], sources: [auTaxSource],
    rules: { taxPeriodLabel: "1 July 2026 to 30 June 2027", inputLabel: "Annual taxable income", profiles: [{ id: "resident", label: "Australian resident — full year", jurisdictionCode: "AU", allowance: { kind: "fixed", amount: 0 }, components: [{ id: "income-tax", label: "Income tax", brackets: [{ lower: 0, upper: 18_200, rate: 0 }, { lower: 18_200, upper: 45_000, rate: 0.15 }, { lower: 45_000, upper: 135_000, rate: 0.3 }, { lower: 135_000, upper: 190_000, rate: 0.37 }, { lower: 190_000, rate: 0.45 }], sourceRefs: [auTaxSource.id] }] }], excludedByDefault: ["Offsets", "Medicare adjustments", "HELP and other loans"] },
  }),
  envelope({
    id: "nz-income-tax-2026-27", familyId: "income-tax", marketId: "nz", countryCode: "NZ", jurisdictionCode: "NZ", regimeId: "resident-individual", periodId: "2026-27", currency: "NZD", effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", coverage: "partial",
    missingConcepts: ["Independent earner tax credit and other credits", "Secondary income and schedular-payment rules"], assumptions: ["Primary employment income is annualised."], sources: [nzTaxSource],
    rules: { taxPeriodLabel: "1 April 2026 to 31 March 2027", inputLabel: "Annual taxable income", profiles: [{ id: "resident-primary", label: "Resident individual — primary income", jurisdictionCode: "NZ", allowance: { kind: "fixed", amount: 0 }, components: [{ id: "income-tax", label: "Income tax", brackets: [{ lower: 0, upper: 15_600, rate: 0.105 }, { lower: 15_600, upper: 53_500, rate: 0.175 }, { lower: 53_500, upper: 78_100, rate: 0.3 }, { lower: 78_100, upper: 180_000, rate: 0.33 }, { lower: 180_000, rate: 0.39 }], sourceRefs: [nzTaxSource.id] }] }], excludedByDefault: ["Tax credits", "Secondary tax codes", "Investment income"] },
  }),
  envelope({
    id: "ie-income-tax-2026", familyId: "income-tax", marketId: "ie", countryCode: "IE", jurisdictionCode: "IE", regimeId: "paye-employee", periodId: "2026", currency: "EUR", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial",
    missingConcepts: ["Tax Credit Certificate adjustments", "Joint assessment with two incomes", "Reliefs beyond the included personal and employee credits"], assumptions: ["PAYE employment income only.", "The user selects the matching assessment profile."], sources: [ieTaxSource],
    rules: { taxPeriodLabel: "2026 calendar tax year", inputLabel: "Annual taxable pay", profiles: [
      { id: "single", label: "Single — standard credits", jurisdictionCode: "IE", allowance: { kind: "fixed", amount: 0 }, components: [{ id: "income-tax", label: "PAYE Income Tax", brackets: [{ lower: 0, upper: 44_000, rate: 0.2 }, { lower: 44_000, rate: 0.4 }], credit: { kind: "fixed", amount: 4_000 }, sourceRefs: [ieTaxSource.id] }] },
      { id: "married-one-income", label: "Married/civil partnership — one income", jurisdictionCode: "IE", allowance: { kind: "fixed", amount: 0 }, components: [{ id: "income-tax", label: "PAYE Income Tax", brackets: [{ lower: 0, upper: 53_000, rate: 0.2 }, { lower: 53_000, rate: 0.4 }], credit: { kind: "fixed", amount: 6_000 }, sourceRefs: [ieTaxSource.id] }] },
    ], excludedByDefault: ["TCC-specific bands/credits", "USC", "PRSI"] },
  }),
];

const payrollEnvelope = (definition: Omit<RuleSetEnvelope<PayrollRuleSet>, "publishedAt" | "reviewedAt" | "reviewDueAt" | "status" | "rounding" | "officialFixtures">) => envelope(definition);

export const PAYROLL_RULE_SETS: RuleSetEnvelope<PayrollRuleSet>[] = [
  payrollEnvelope({ id: "us-federal-paycheck-2026", familyId: "take-home-pay", marketId: "us", countryCode: "US", jurisdictionCode: "US-FED", regimeId: "employee-simplified", periodId: "2026", currency: "USD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Publication 15-T percentage method and complete Form W-4", "State/local withholding", "Pre-tax benefit tax treatment"], assumptions: ["Federal income tax is projected from annual liability, not exact withholding."], sources: [source({ id: "us-irs-pub15-2026", authority: "Internal Revenue Service", title: "Publication 15 (2026)", url: "https://www.irs.gov/publications/p15", effectiveFrom: "2026-01-01", appliesTo: ["fica", "payroll"] })], rules: { taxRuleSetRef: "us-federal-income-tax-2026", frequencies: ["annual", "monthly", "biweekly", "weekly"], contributionRule: { kind: "us-fica", socialSecurityRate: 0.062, socialSecurityCap: 184_500, medicareRate: 0.0145, additionalMedicareRate: 0.009, additionalMedicareThreshold: 200_000 }, optionalModules: [], excludedByDefault: ["Exact W-4 withholding", "State/local withholding"] } }),
  payrollEnvelope({ id: "gb-take-home-2026-27", familyId: "take-home-pay", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB", regimeId: "employee-category-a", periodId: "2026-27", currency: "GBP", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05", coverage: "partial", missingConcepts: ["Exact cumulative PAYE and non-standard tax codes", "Pension and student/postgraduate loans"], assumptions: ["Standard Personal Allowance treatment and NI category A."], sources: [source({ id: "gb-hmrc-employer-thresholds-2026-27", authority: "HM Revenue & Customs", title: "Rates and thresholds for employers 2026 to 2027", url: "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027", effectiveFrom: "2026-04-06", appliesTo: ["paye", "class-1-ni-category-a"] })], rules: { taxRuleSetRef: "gb-income-tax-2026-27", frequencies: ["annual", "monthly", "weekly"], contributionRule: { kind: "uk-ni-a", primaryThreshold: 12_570, upperEarningsLimit: 50_270, mainRate: 0.08, upperRate: 0.02 }, optionalModules: ["Pension salary sacrifice", "Student loan"], excludedByDefault: ["Non-standard tax codes", "Loans and pension"] } }),
  payrollEnvelope({ id: "ca-on-paycheck-2026", familyId: "take-home-pay", marketId: "ca", countryCode: "CA", jurisdictionCode: "CA-ON", regimeId: "employee-outside-quebec", periodId: "2026", currency: "CAD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Exact T4032 claim-code withholding", "Ontario surtax and Health Premium", "Quebec and other provinces/territories"], assumptions: ["Ontario employment outside Quebec.", "Annual liability is divided by pay periods."], sources: [caPayrollSource, source({ id: "ca-ei-2026", authority: "Employment and Social Development Canada", title: "2026 maximum insurable earnings and employee premium rates", url: "https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-employers/premium-reduction-program/2026-maximum-insurable-earnings.html", effectiveFrom: "2026-01-01", appliesTo: ["ei"] })], rules: { taxRuleSetRef: "ca-on-income-tax-2026", frequencies: ["annual", "monthly", "biweekly", "weekly"], contributionRule: { kind: "ca-cpp-ei", basicExemption: 3_500, ympe: 74_600, yampe: 85_000, cppRate: 0.0595, cpp2Rate: 0.04, eiRate: 0.0163, eiCap: 68_900 }, optionalModules: [], excludedByDefault: ["Claim-code exact withholding", "Provincial premium/surtax"] } }),
  payrollEnvelope({ id: "au-take-home-2026-27", familyId: "take-home-pay", marketId: "au", countryCode: "AU", jurisdictionCode: "AU", regimeId: "resident-employee", periodId: "2026-27", currency: "AUD", effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", coverage: "partial", missingConcepts: ["Exact PAYG schedule rounding", "Medicare levy reductions/exemptions/surcharge", "HELP and other study loans"], assumptions: ["Full 2% Medicare levy is selected as a projection."], sources: [source({ id: "au-ato-payg-2026", authority: "Australian Taxation Office", title: "2026 PAYG withholding tax tables", url: "https://softwaredevelopers.ato.gov.au/PAYGWTaxtables", effectiveFrom: "2026-07-01", appliesTo: ["payg"] }), auTaxSource], rules: { taxRuleSetRef: "au-income-tax-2026-27", frequencies: ["annual", "monthly", "biweekly", "weekly"], contributionRule: { kind: "au-medicare", rate: 0.02 }, optionalModules: ["HELP and study loans"], excludedByDefault: ["PAYG schedule-specific rounding", "Medicare adjustments", "Study loans"] } }),
  payrollEnvelope({ id: "nz-take-home-2026-27", familyId: "take-home-pay", marketId: "nz", countryCode: "NZ", jurisdictionCode: "NZ", regimeId: "employee-primary-m", periodId: "2026-27", currency: "NZD", effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", coverage: "partial", missingConcepts: ["Exact IR340/IR341 period rounding", "KiwiSaver and student loan", "Other tax codes"], assumptions: ["Primary employment under a standard M-style annual projection."], sources: [source({ id: "nz-ird-acc-2026-27", authority: "Inland Revenue", title: "ACC earners' levy rates", url: "https://www.ird.govt.nz/income-tax/income-tax-for-individuals/acc-clients-and-carers/acc-earners-levy-rates", effectiveFrom: "2026-04-01", appliesTo: ["acc-levy"] }), nzTaxSource], rules: { taxRuleSetRef: "nz-income-tax-2026-27", frequencies: ["annual", "monthly", "biweekly", "weekly"], contributionRule: { kind: "nz-acc", rate: 0.0175, cap: 156_641 }, optionalModules: ["KiwiSaver", "Student loan"], excludedByDefault: ["KiwiSaver", "Student loan", "Secondary tax codes"] } }),
  payrollEnvelope({ id: "ie-take-home-2026", familyId: "take-home-pay", marketId: "ie", countryCode: "IE", jurisdictionCode: "IE", regimeId: "paye-class-a", periodId: "2026", currency: "EUR", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Exact cumulative/Week 1 payroll basis", "TCC-specific credits and bands", "PRSI classes other than A"], assumptions: ["PRSI Class A and the selected 2026 pay-date phase apply."], sources: [source({ id: "ie-budget-2026-usc", authority: "Revenue", title: "Budget 2026 Summary", url: "https://www.revenue.ie/en/corporate/press-office/budget-information/previous-years/2026/budget-summary.pdf", effectiveFrom: "2026-01-01", appliesTo: ["usc"] }), source({ id: "ie-dsp-prsi-a-2026", authority: "Department of Social Protection", title: "PRSI Class A Rates", url: "https://www.gov.ie/en/department-of-social-protection/publications/prsi-class-a-rates/", effectiveFrom: "2026-01-01", appliesTo: ["prsi-class-a"] })], rules: { taxRuleSetRef: "ie-income-tax-2026", frequencies: ["annual", "monthly", "biweekly", "weekly"], contributionRule: { kind: "ie-usc-prsi", uscBrackets: [{ lower: 0, upper: 12_012, rate: 0.005 }, { lower: 12_012, upper: 28_700, rate: 0.02 }, { lower: 28_700, upper: 70_044, rate: 0.03 }, { lower: 70_044, rate: 0.08 }], prsiVariants: [{ id: "jan-sep", label: "Pay date through 30 September 2026", employeeRate: 0.042 }, { id: "oct-dec", label: "Pay date from 1 October 2026", employeeRate: 0.0435 }] }, optionalModules: [], excludedByDefault: ["Other PRSI classes", "Exact cumulative payroll basis"] } }),
];
