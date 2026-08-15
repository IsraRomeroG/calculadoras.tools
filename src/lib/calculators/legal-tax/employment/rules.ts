import type { CalculatorFamilyId, EmploymentComponentStatus, LegalSource, RuleSetEnvelope } from "../types";

export type EmploymentRule =
  | { kind: "us-contractual-pto" }
  | { kind: "gb-holiday"; weeksPerYear: number; maximumDays: number }
  | { kind: "gb-redundancy"; minimumYears: number; maximumYears: number; weeklyPayCap: number }
  | { kind: "ca-federal-vacation"; tiers: Array<{ years: number; weeks: number; payRate: number }> }
  | { kind: "ca-federal-termination"; minimumSeveranceMonths: number; maximumNoticeWeeks: number }
  | { kind: "au-nes-leave"; weeksPerYear: number }
  | { kind: "au-nes-redundancy"; weeksByCompletedYears: Record<number, number> }
  | { kind: "nz-holiday-pay"; weeksPerYear: number }
  | { kind: "nz-final-pay"; partYearRate: number }
  | { kind: "ie-annual-leave"; fullWeeks: number; qualifyingHours: number; monthlyHours: number; hoursRate: number }
  | { kind: "ie-redundancy"; minimumAge: number; minimumServiceWeeks: number; weeklyPayCap: number; weeksPerYear: number; bonusWeeks: number };

export interface EmploymentRuleSet {
  jurisdictionLabel: string;
  coverageStatement: string;
  supportedStatuses: EmploymentComponentStatus[];
  rules: EmploymentRule;
}

const accessedAt = "2026-08-15";
const rounding = { mode: "half-up", precision: 2, stage: "component" } as const;
const source = (value: Omit<LegalSource, "accessedAt" | "primary">): LegalSource => ({ ...value, accessedAt, primary: true });

const usFlsa = source({ id: "us-dol-flsa-not-required", authority: "US Department of Labor", title: "What the FLSA does not require", url: "https://webapps.dol.gov/elaws/whd/flsa/screen6.asp", appliesTo: ["vacation-pay", "severance"], effectiveFrom: "2026-01-01" });
const gbHoliday = source({ id: "gb-gov-holiday-entitlement", authority: "GOV.UK", title: "Calculate leave entitlement", url: "https://www.gov.uk/holiday-entitlement-rights/calculate-leave-entitlement", appliesTo: ["statutory-holiday"], effectiveFrom: "2026-04-06" });
const gbRedundancy = source({ id: "gb-gov-redundancy-pay", authority: "GOV.UK", title: "Statutory redundancy pay", url: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", appliesTo: ["statutory-redundancy"], effectiveFrom: "2026-04-06" });
const caVacation = source({ id: "ca-federal-vacations-holidays", authority: "Employment and Social Development Canada", title: "Annual vacations and general holidays for federally regulated employees", url: "https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/vacations-holidays.html", appliesTo: ["federal-vacation"], effectiveFrom: "2026-01-01" });
const caTermination = source({ id: "ca-federal-termination", authority: "Employment and Social Development Canada", title: "Termination, layoff or dismissal", url: "https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/termination.html", appliesTo: ["federal-notice", "federal-severance"], effectiveFrom: "2026-01-01" });
const auLeave = source({ id: "au-fwo-annual-leave", authority: "Fair Work Ombudsman", title: "Annual leave", url: "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/annual-leave", appliesTo: ["nes-annual-leave"], effectiveFrom: "2026-07-01" });
const auRedundancy = source({ id: "au-fwo-redundancy", authority: "Fair Work Ombudsman", title: "Redundancy pay", url: "https://www.fairwork.gov.au/ending-employment/redundancy/redundancy-pay", appliesTo: ["nes-redundancy"], effectiveFrom: "2026-07-01" });
const nzHoliday = source({ id: "nz-employment-holiday-pay", authority: "Employment New Zealand", title: "Annual holiday pay", url: "https://www.employment.govt.nz/pay-and-hours/pay-and-wages/leave-and-holiday-pay/annual-holiday-pay", appliesTo: ["annual-holiday-pay"], effectiveFrom: "2026-04-01" });
const nzFinal = source({ id: "nz-employment-final-pay", authority: "Employment New Zealand", title: "Final pay", url: "https://www.employment.govt.nz/pay-and-hours/pay-and-wages/final-pay", appliesTo: ["part-year-holiday-pay", "final-pay"], effectiveFrom: "2026-04-01" });
const ieLeave = source({ id: "ie-wrc-annual-leave", authority: "Workplace Relations Commission", title: "Annual Leave", url: "https://www.workplacerelations.ie/en/what_you_should_know/leave/annual-leave/", appliesTo: ["statutory-annual-leave"], effectiveFrom: "2026-01-01" });
const ieRedundancy = source({ id: "ie-wrc-redundancy", authority: "Workplace Relations Commission", title: "Redundancy", url: "https://www.workplacerelations.ie/en/what_you_should_know/ending%20the%20employment%20relationship/redundancy/", appliesTo: ["statutory-redundancy"], effectiveFrom: "2026-01-01" });

interface EnvelopeDefinition {
  id: string;
  familyId: Extract<CalculatorFamilyId, "paid-leave" | "final-pay" | "redundancy">;
  marketId: RuleSetEnvelope["marketId"];
  countryCode: RuleSetEnvelope["countryCode"];
  jurisdictionCode: string;
  regimeId: string;
  periodId: string;
  currency: RuleSetEnvelope["currency"];
  effectiveFrom: string;
  effectiveTo?: string;
  coverage: RuleSetEnvelope["coverage"];
  missingConcepts: string[];
  assumptions: string[];
  sources: LegalSource[];
  rules: EmploymentRuleSet;
}

const envelope = (definition: EnvelopeDefinition): RuleSetEnvelope<EmploymentRuleSet> => ({
  ...definition,
  publishedAt: "2026-08-15",
  reviewedAt: "2026-08-15",
  reviewDueAt: "2026-11-30",
  status: "current",
  rounding,
  officialFixtures: [{ id: `${definition.id}-boundary`, sourceId: definition.sources[0].id, periodId: definition.periodId, description: "Boundary fixture derived from the authority guidance." }],
});

export const EMPLOYMENT_RULE_SETS: RuleSetEnvelope<EmploymentRuleSet>[] = [
  envelope({ id: "us-pto-contract-2026", familyId: "paid-leave", marketId: "us", countryCode: "US", jurisdictionCode: "US-FED-CONTRACT", regimeId: "employer-policy", periodId: "2026", currency: "USD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "manual-only", missingConcepts: ["State and local paid-leave rights", "State final-pay and PTO-payout rules", "Contractual severance terms"], assumptions: ["Accrual is a policy inventory, not a federal statutory entitlement."], sources: [usFlsa], rules: { jurisdictionLabel: "United States — contractual PTO only", coverageStatement: "The FLSA does not create a general federal vacation or severance entitlement.", supportedStatuses: ["calculated-contractual", "not-determined"], rules: { kind: "us-contractual-pto" } } }),
  envelope({ id: "gb-holiday-2026-27", familyId: "paid-leave", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB", regimeId: "regular-hours-worker", periodId: "2026-27", currency: "GBP", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05", coverage: "partial", missingConcepts: ["Irregular-hours and part-year 12.07% method", "Holiday-pay monetisation"], assumptions: ["Regular working pattern and a user-supplied portion of the leave year."], sources: [gbHoliday], rules: { jurisdictionLabel: "Great Britain — regular-hours statutory holiday", coverageStatement: "5.6 weeks, capped at 28 days for a five-or-more-day week, prorated for the supported leave year.", supportedStatuses: ["calculated-official", "out-of-scope"], rules: { kind: "gb-holiday", weeksPerYear: 5.6, maximumDays: 28 } } }),
  envelope({ id: "gb-redundancy-2026-27", familyId: "redundancy", marketId: "gb", countryCode: "GB", jurisdictionCode: "GB", regimeId: "statutory-redundancy", periodId: "2026-27", currency: "GBP", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05", coverage: "partial", missingConcepts: ["Northern Ireland", "Notice pay", "Holiday and final wages", "Tax treatment", "Suitable-alternative-work disputes"], assumptions: ["A genuine redundancy in Great Britain and no unsupported exclusion applies."], sources: [gbRedundancy], rules: { jurisdictionLabel: "Great Britain — statutory redundancy", coverageStatement: "Uses completed service years, age during each year, the 20-year limit and the 2026 weekly-pay cap.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "gb-redundancy", minimumYears: 2, maximumYears: 20, weeklyPayCap: 751 } } }),
  envelope({ id: "ca-federal-vacation-2026", familyId: "paid-leave", marketId: "ca", countryCode: "CA", jurisdictionCode: "CA-FED", regimeId: "canada-labour-code", periodId: "2026", currency: "CAD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Provincial and territorial employment standards", "Collective-agreement enhancements"], assumptions: ["The workplace is federally regulated under the Canada Labour Code."], sources: [caVacation], rules: { jurisdictionLabel: "Canada — federally regulated workplaces", coverageStatement: "Federal vacation weeks and vacation-pay percentages only; federal coverage must be confirmed first.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "ca-federal-vacation", tiers: [{ years: 1, weeks: 2, payRate: 0.04 }, { years: 5, weeks: 3, payRate: 0.06 }, { years: 10, weeks: 4, payRate: 0.08 }] } } }),
  envelope({ id: "ca-federal-termination-2026", familyId: "final-pay", marketId: "ca", countryCode: "CA", jurisdictionCode: "CA-FED", regimeId: "canada-labour-code", periodId: "2026", currency: "CAD", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Provincial and territorial rules", "Final wages", "Vacation pay", "Group-termination rules", "Tax treatment"], assumptions: ["The workplace is federally regulated and the employer-initiated termination is not for just cause."], sources: [caTermination], rules: { jurisdictionLabel: "Canada — federal individual termination", coverageStatement: "Federal individual notice/wages in lieu and severance are shown separately after scope gates.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "ca-federal-termination", minimumSeveranceMonths: 12, maximumNoticeWeeks: 8 } } }),
  envelope({ id: "au-nes-leave-2026-27", familyId: "paid-leave", marketId: "au", countryCode: "AU", jurisdictionCode: "AU-NES", regimeId: "national-workplace-relations", periodId: "2026-27", currency: "AUD", effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", coverage: "partial", missingConcepts: ["Confirmed shiftworker fifth week", "Annual-leave loading", "Award or agreement enhancements", "Long-service leave"], assumptions: ["Non-casual employee covered by the national workplace relations system."], sources: [auLeave], rules: { jurisdictionLabel: "Australia — National Employment Standards", coverageStatement: "Four weeks per year based on ordinary hours for covered non-casual employees.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "au-nes-leave", weeksPerYear: 4 } } }),
  envelope({ id: "au-nes-redundancy-2026-27", familyId: "redundancy", marketId: "au", countryCode: "AU", jurisdictionCode: "AU-NES", regimeId: "national-workplace-relations", periodId: "2026-27", currency: "AUD", effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", coverage: "partial", missingConcepts: ["Award-specific schemes", "Notice", "Unused leave", "Long-service leave", "Tax treatment"], assumptions: ["NES coverage, no small-business exemption, and no award-specific redundancy scheme."], sources: [auRedundancy], rules: { jurisdictionLabel: "Australia — NES redundancy", coverageStatement: "NES weeks multiplied by base weekly pay for ordinary hours after coverage and exemption gates.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "au-nes-redundancy", weeksByCompletedYears: { 1: 4, 2: 6, 3: 7, 4: 8, 5: 10, 6: 11, 7: 13, 8: 14, 9: 16, 10: 12 } } } }),
  envelope({ id: "nz-holiday-pay-2026-27", familyId: "paid-leave", marketId: "nz", countryCode: "NZ", jurisdictionCode: "NZ", regimeId: "holidays-act", periodId: "2026-27", currency: "NZD", effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", coverage: "partial", missingConcepts: ["Public and alternative holidays", "Pay-as-you-go eligibility", "Parental-leave special calculations"], assumptions: ["At least 12 months of continuous employment and annual holidays expressed in weeks."], sources: [nzHoliday], rules: { jurisdictionLabel: "New Zealand — annual holidays after 12 months", coverageStatement: "Pays unused weeks at the greater of ordinary weekly pay and average weekly earnings.", supportedStatuses: ["calculated-official", "not-applicable", "not-determined"], rules: { kind: "nz-holiday-pay", weeksPerYear: 4 } } }),
  envelope({ id: "nz-final-pay-2026-27", familyId: "final-pay", marketId: "nz", countryCode: "NZ", jurisdictionCode: "NZ", regimeId: "holidays-act", periodId: "2026-27", currency: "NZD", effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", coverage: "partial", missingConcepts: ["Public-holiday extensions", "Alternative holidays", "Notice and final wages", "Contract-specific redundancy formula"], assumptions: ["Gross earnings since the last anniversary are supplied and any holiday pay already paid is deducted."], sources: [nzFinal], rules: { jurisdictionLabel: "New Zealand — part-year holiday component of final pay", coverageStatement: "Calculates the supported 8% part-year component; redundancy remains contractual and separate.", supportedStatuses: ["calculated-official", "manual-scenario", "not-determined"], rules: { kind: "nz-final-pay", partYearRate: 0.08 } } }),
  envelope({ id: "ie-annual-leave-2026", familyId: "paid-leave", marketId: "ie", countryCode: "IE", jurisdictionCode: "IE", regimeId: "organisation-working-time", periodId: "2026", currency: "EUR", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Contractual enhancements", "Monetisation at termination", "Sick-leave interactions"], assumptions: ["Working week hours and qualifying months are supplied consistently."], sources: [ieLeave], rules: { jurisdictionLabel: "Ireland — statutory annual leave", coverageStatement: "Compares all three statutory methods and returns the greatest compatible entitlement.", supportedStatuses: ["calculated-official", "not-applicable"], rules: { kind: "ie-annual-leave", fullWeeks: 4, qualifyingHours: 1365, monthlyHours: 117, hoursRate: 0.08 } } }),
  envelope({ id: "ie-redundancy-2026", familyId: "redundancy", marketId: "ie", countryCode: "IE", jurisdictionCode: "IE", regimeId: "statutory-redundancy", periodId: "2026", currency: "EUR", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31", coverage: "partial", missingConcepts: ["Notice pay", "Unused annual leave", "Tax treatment", "Non-statutory employer enhancements"], assumptions: ["Actual redundancy, fully insurable employment and continuous service are confirmed."], sources: [ieRedundancy], rules: { jurisdictionLabel: "Ireland — statutory redundancy", coverageStatement: "Two capped weeks per completed year plus one capped bonus week after all eligibility gates.", supportedStatuses: ["calculated-official", "not-applicable", "out-of-scope"], rules: { kind: "ie-redundancy", minimumAge: 16, minimumServiceWeeks: 104, weeklyPayCap: 600, weeksPerYear: 2, bonusWeeks: 1 } } }),
];
