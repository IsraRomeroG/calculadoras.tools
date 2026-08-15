import { roundMoney } from "../core/money";
import type { CalculationResult, EmploymentComponentStatus } from "../types";
import { EMPLOYMENT_RULE_SETS } from "./rules";

export interface EmploymentComponent {
  id: string;
  label: string;
  status: EmploymentComponentStatus;
  amount?: number;
  quantity?: number;
  unit?: "hours" | "days" | "weeks";
  formula: string;
  sourceRefs: string[];
}

export interface EmploymentCalculationResult extends CalculationResult {
  jurisdictionLabel: string;
  coverageStatement: string;
  components: EmploymentComponent[];
}

export interface EmploymentCalculationInput {
  ruleSetId: string;
  values: Record<string, string | number | boolean | undefined>;
}

const numberValue = (values: EmploymentCalculationInput["values"], key: string, options: { minimum?: number; maximum?: number; optional?: boolean } = {}) => {
  const raw = values[key];
  if ((raw === undefined || raw === "") && options.optional) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < (options.minimum ?? 0) || (options.maximum !== undefined && value > options.maximum)) {
    throw new RangeError(`${key} is outside the supported range.`);
  }
  return value;
};
const stringValue = (values: EmploymentCalculationInput["values"], key: string) => String(values[key] ?? "");
const component = (definition: EmploymentComponent): EmploymentComponent => definition;

export function redundancyWeightForAge(age: number) {
  if (age < 22) return 0.5;
  if (age < 41) return 1;
  return 1.5;
}

export function australiaNesRedundancyWeeks(completedYears: number) {
  if (completedYears < 1) return 0;
  return ({ 1: 4, 2: 6, 3: 7, 4: 8, 5: 10, 6: 11, 7: 13, 8: 14, 9: 16, 10: 12 } as Record<number, number>)[Math.min(Math.floor(completedYears), 10)];
}

export function calculateEmployment(input: EmploymentCalculationInput): EmploymentCalculationResult {
  const envelope = EMPLOYMENT_RULE_SETS.find((item) => item.id === input.ruleSetId);
  if (!envelope || envelope.status !== "current") throw new Error("Employment rule set is not available.");
  const rule = envelope.rules.rules;
  const sourceRefs = envelope.sources.map((item) => item.id);
  const money = (value: number) => roundMoney(Math.max(0, value), envelope.rounding);
  let components: EmploymentComponent[] = [];
  const warnings = ["This estimate applies only to the stated jurisdiction, employment regime and rule period."];

  if (rule.kind === "us-contractual-pto") {
    const annualGrant = numberValue(input.values, "annualGrantHours", { maximum: 10_000 })!;
    const elapsedDays = numberValue(input.values, "elapsedDays", { maximum: 366 })!;
    const opening = numberValue(input.values, "openingBalanceHours", { maximum: 10_000 })!;
    const used = numberValue(input.values, "usedHours", { maximum: 10_000 })!;
    const accrued = annualGrant * elapsedDays / 365;
    components = [
      component({ id: "contractual-accrual", label: "PTO accrued under the entered policy", status: "calculated-contractual", quantity: money(accrued), unit: "hours", formula: `${annualGrant} annual hours × ${elapsedDays}/365`, sourceRefs }),
      component({ id: "contractual-balance", label: "Contractual PTO balance", status: "calculated-contractual", quantity: money(opening + accrued - used), unit: "hours", formula: `${opening} opening + accrued − ${used} used`, sourceRefs }),
      component({ id: "legal-entitlement", label: "Federal statutory vacation entitlement", status: "not-determined", formula: "No general FLSA vacation entitlement; state/local law and the policy were not determined.", sourceRefs }),
    ];
  } else if (rule.kind === "gb-holiday") {
    const daysPerWeek = numberValue(input.values, "daysPerWeek", { minimum: 0.1, maximum: 7 })!;
    const employmentDays = numberValue(input.values, "employmentDaysInLeaveYear", { maximum: 366 })!;
    const daysInYear = numberValue(input.values, "daysInLeaveYear", { minimum: 365, maximum: 366 })!;
    const used = numberValue(input.values, "usedDays", { maximum: 366 })!;
    const carried = numberValue(input.values, "carriedDays", { maximum: 366 })!;
    const annual = Math.min(daysPerWeek * rule.weeksPerYear, rule.maximumDays);
    const accrued = annual * Math.min(employmentDays, daysInYear) / daysInYear;
    components = [
      component({ id: "statutory-entitlement", label: "Prorated statutory holiday", status: "calculated-official", quantity: money(accrued), unit: "days", formula: `min(${daysPerWeek} × ${rule.weeksPerYear}, ${rule.maximumDays}) × ${employmentDays}/${daysInYear}`, sourceRefs }),
      component({ id: "holiday-balance", label: "Holiday balance including entered carry", status: "calculated-official", quantity: money(accrued + carried - used), unit: "days", formula: `prorated entitlement + ${carried} carried − ${used} used`, sourceRefs }),
    ];
  } else if (rule.kind === "gb-redundancy") {
    const genuineRedundancy = stringValue(input.values, "genuineRedundancy");
    const completedYears = Math.floor(numberValue(input.values, "completedYears", { maximum: 80 })!);
    const ageAtTermination = numberValue(input.values, "ageAtTermination", { minimum: 16, maximum: 100 })!;
    const weeklyPay = numberValue(input.values, "weeklyPay", { maximum: 1_000_000 })!;
    if (genuineRedundancy !== "yes") {
      components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: genuineRedundancy === "no" ? "not-applicable" : "out-of-scope", formula: "A supported Great Britain redundancy must be confirmed before calculation.", sourceRefs })];
    } else if (completedYears < rule.minimumYears) {
      components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: "not-applicable", formula: `Fewer than ${rule.minimumYears} completed years of service.`, sourceRefs })];
    } else {
      const countedYears = Math.min(completedYears, rule.maximumYears);
      let redundancyWeeks = 0;
      for (let offset = 0; offset < countedYears; offset += 1) redundancyWeeks += redundancyWeightForAge(ageAtTermination - offset - 1);
      const cappedWeeklyPay = Math.min(weeklyPay, rule.weeklyPayCap);
      components = [
        component({ id: "redundancy-weeks", label: "Weighted redundancy weeks", status: "calculated-official", quantity: redundancyWeeks, unit: "weeks", formula: `${countedYears} most recent completed years weighted by age during each year`, sourceRefs }),
        component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: "calculated-official", amount: money(redundancyWeeks * cappedWeeklyPay), formula: `${redundancyWeeks} weeks × min(${weeklyPay}, ${rule.weeklyPayCap})`, sourceRefs }),
      ];
    }
  } else if (rule.kind === "ca-federal-vacation") {
    const federal = stringValue(input.values, "federalRegulated");
    const completedYears = Math.floor(numberValue(input.values, "completedYears", { maximum: 80 })!);
    const grossEarnings = numberValue(input.values, "grossEarnings", { maximum: 100_000_000 })!;
    if (federal !== "yes") {
      components = [component({ id: "federal-vacation", label: "Federal vacation entitlement", status: "out-of-scope", formula: "Federal coverage was not confirmed; province or territory rules are required.", sourceRefs })];
    } else {
      const tier = [...rule.tiers].reverse().find((item) => completedYears >= item.years);
      components = tier ? [
        component({ id: "vacation-weeks", label: "Federal annual vacation", status: "calculated-official", quantity: tier.weeks, unit: "weeks", formula: `${completedYears} completed years selects the ${tier.weeks}-week tier`, sourceRefs }),
        component({ id: "vacation-pay", label: "Federal vacation pay", status: "calculated-official", amount: money(grossEarnings * tier.payRate), formula: `${grossEarnings} × ${tier.payRate * 100}%`, sourceRefs }),
      ] : [component({ id: "federal-vacation", label: "Federal annual vacation", status: "not-applicable", formula: "The first completed year threshold has not been reached.", sourceRefs })];
    }
  } else if (rule.kind === "ca-federal-termination") {
    const federal = stringValue(input.values, "federalRegulated");
    const eligibleReason = stringValue(input.values, "eligibleReason");
    const serviceMonths = Math.floor(numberValue(input.values, "serviceMonths", { maximum: 960 })!);
    const weeklyPay = numberValue(input.values, "weeklyPay", { maximum: 1_000_000 })!;
    if (federal !== "yes") {
      components = [component({ id: "federal-termination", label: "Federal termination components", status: "out-of-scope", formula: "Federal coverage was not confirmed; province or territory rules are required.", sourceRefs })];
    } else if (eligibleReason !== "yes") {
      components = [component({ id: "federal-termination", label: "Federal termination components", status: eligibleReason === "no" ? "not-applicable" : "out-of-scope", formula: "A supported employer-initiated termination without just cause was not confirmed.", sourceRefs })];
    } else {
      const fullYears = Math.floor(serviceMonths / 12);
      const noticeWeeks = serviceMonths < 3 ? 0 : fullYears < 3 ? 2 : Math.min(fullYears, rule.maximumNoticeWeeks);
      components = [component({ id: "notice-pay", label: "Minimum notice or wages in lieu", status: noticeWeeks === 0 ? "not-applicable" : "calculated-official", ...(noticeWeeks > 0 ? { amount: money(noticeWeeks * weeklyPay), quantity: noticeWeeks, unit: "weeks" as const } : {}), formula: `${serviceMonths} months selects ${noticeWeeks} notice weeks`, sourceRefs })];
      if (serviceMonths < rule.minimumSeveranceMonths) {
        components.push(component({ id: "severance-pay", label: "Federal severance pay", status: "not-applicable", formula: `Fewer than ${rule.minimumSeveranceMonths} months of service.`, sourceRefs }));
      } else {
        const severanceDays = Math.max(fullYears * 2, 5);
        components.push(component({ id: "severance-pay", label: "Federal severance pay", status: "calculated-official", amount: money(severanceDays * weeklyPay / 5), quantity: severanceDays, unit: "days", formula: `max(2 days × ${fullYears} completed years, 5 days) × weekly pay/5`, sourceRefs }));
      }
    }
  } else if (rule.kind === "au-nes-leave") {
    const covered = stringValue(input.values, "nesCovered");
    const employmentType = stringValue(input.values, "employmentType");
    const ordinaryHours = numberValue(input.values, "ordinaryHoursPerWeek", { maximum: 168 })!;
    const serviceDays = numberValue(input.values, "serviceDays", { maximum: 30_000 })!;
    const usedHours = numberValue(input.values, "usedHours", { maximum: 100_000 })!;
    if (covered !== "yes") components = [component({ id: "nes-leave", label: "NES annual leave", status: "out-of-scope", formula: "National workplace relations system coverage was not confirmed.", sourceRefs })];
    else if (employmentType === "casual") components = [component({ id: "nes-leave", label: "NES annual leave", status: "not-applicable", formula: "Casual employees are excluded from this NES annual-leave calculation.", sourceRefs })];
    else {
      const accrued = ordinaryHours * rule.weeksPerYear * serviceDays / 365.2425;
      components = [
        component({ id: "leave-accrued", label: "NES annual leave accrued", status: "calculated-official", quantity: money(accrued), unit: "hours", formula: `${ordinaryHours} ordinary hours × ${rule.weeksPerYear} × ${serviceDays}/365.2425`, sourceRefs }),
        component({ id: "leave-balance", label: "NES annual leave balance", status: "calculated-official", quantity: money(accrued - usedHours), unit: "hours", formula: `accrued hours − ${usedHours} used`, sourceRefs }),
      ];
    }
  } else if (rule.kind === "au-nes-redundancy") {
    const covered = stringValue(input.values, "nesCovered");
    const genuine = stringValue(input.values, "genuineRedundancy");
    const smallBusiness = stringValue(input.values, "smallBusiness");
    const awardScheme = stringValue(input.values, "awardSpecificScheme");
    const completedYears = Math.floor(numberValue(input.values, "completedYears", { maximum: 80 })!);
    const weeklyBasePay = numberValue(input.values, "weeklyBasePay", { maximum: 1_000_000 })!;
    if (covered !== "yes" || awardScheme !== "no") components = [component({ id: "nes-redundancy", label: "NES redundancy pay", status: "out-of-scope", formula: "NES coverage without an award-specific scheme must be confirmed.", sourceRefs })];
    else if (genuine !== "yes" || smallBusiness === "yes") components = [component({ id: "nes-redundancy", label: "NES redundancy pay", status: "not-applicable", formula: genuine !== "yes" ? "A legal redundancy was not confirmed." : "The entered small-business exemption excludes this NES table.", sourceRefs })];
    else {
      const weeks = rule.weeksByCompletedYears[Math.min(completedYears, 10)] ?? 0;
      components = [component({ id: "nes-redundancy", label: "NES redundancy pay", status: weeks ? "calculated-official" : "not-applicable", ...(weeks ? { amount: money(weeks * weeklyBasePay), quantity: weeks, unit: "weeks" as const } : {}), formula: `${completedYears} completed years selects ${weeks} NES weeks × base weekly pay`, sourceRefs })];
    }
  } else if (rule.kind === "nz-holiday-pay") {
    const serviceMonths = numberValue(input.values, "serviceMonths", { maximum: 960 })!;
    const unusedWeeks = numberValue(input.values, "unusedWeeks", { maximum: 100 })!;
    const ordinaryWeeklyPay = numberValue(input.values, "ordinaryWeeklyPay", { maximum: 1_000_000 })!;
    const averageWeeklyEarnings = numberValue(input.values, "averageWeeklyEarnings", { maximum: 1_000_000 })!;
    if (serviceMonths < 12) components = [component({ id: "annual-holiday-pay", label: "Annual holiday pay", status: "not-applicable", formula: "The supported four-week entitlement begins after 12 months; use the final-pay route for a part year.", sourceRefs })];
    else {
      const weeklyRate = Math.max(ordinaryWeeklyPay, averageWeeklyEarnings);
      components = [component({ id: "annual-holiday-pay", label: "Unused annual holiday pay", status: "calculated-official", amount: money(unusedWeeks * weeklyRate), quantity: unusedWeeks, unit: "weeks", formula: `${unusedWeeks} weeks × max(${ordinaryWeeklyPay} OWP, ${averageWeeklyEarnings} AWE)`, sourceRefs })];
    }
  } else if (rule.kind === "nz-final-pay") {
    const grossEarnings = numberValue(input.values, "grossSinceAnniversary", { maximum: 100_000_000 })!;
    const holidayPayPaid = numberValue(input.values, "holidayPayAlreadyPaid", { maximum: 100_000_000 })!;
    const contractualRedundancy = numberValue(input.values, "contractualRedundancyAmount", { maximum: 100_000_000, optional: true });
    components = [
      component({ id: "part-year-holiday-pay", label: "Part-year holiday pay", status: "calculated-official", amount: money(grossEarnings * rule.partYearRate - holidayPayPaid), formula: `${grossEarnings} × ${rule.partYearRate * 100}% − ${holidayPayPaid} already paid`, sourceRefs }),
      component({ id: "public-holiday-extension", label: "Public/alternative holiday extension", status: "not-determined", formula: "Dates and otherwise-working-day status require a separate determination.", sourceRefs }),
      contractualRedundancy === undefined
        ? component({ id: "contractual-redundancy", label: "Contractual redundancy", status: "not-determined", formula: "No contractual redundancy amount entered.", sourceRefs })
        : component({ id: "contractual-redundancy", label: "Contractual redundancy scenario", status: "manual-scenario", amount: money(contractualRedundancy), formula: "User-entered employment-agreement amount; not a statutory calculation.", sourceRefs: [] }),
    ];
  } else if (rule.kind === "ie-annual-leave") {
    const hoursWorked = numberValue(input.values, "hoursWorked", { maximum: 20_000 })!;
    const hoursPerWeek = numberValue(input.values, "hoursPerWeek", { minimum: 0.1, maximum: 168 })!;
    const qualifyingMonths = numberValue(input.values, "qualifyingMonths", { maximum: 12 })!;
    const changedEmployment = stringValue(input.values, "changedEmployment");
    const methods = [
      { id: "method-1", label: "1,365-hour method", hours: hoursWorked >= rule.qualifyingHours && changedEmployment === "no" ? rule.fullWeeks * hoursPerWeek : 0, compatible: hoursWorked >= rule.qualifyingHours && changedEmployment === "no", formula: `${rule.fullWeeks} working weeks after ${rule.qualifyingHours} hours` },
      { id: "method-2", label: "Qualifying-month method", hours: qualifyingMonths * hoursPerWeek / 3, compatible: true, formula: `${qualifyingMonths} qualifying months × 1/3 working week` },
      { id: "method-3", label: "8% hours method", hours: Math.min(hoursWorked * rule.hoursRate, rule.fullWeeks * hoursPerWeek), compatible: true, formula: `min(${rule.hoursRate * 100}% × ${hoursWorked} hours, ${rule.fullWeeks} working weeks)` },
    ];
    const maximum = Math.max(...methods.filter((item) => item.compatible).map((item) => item.hours));
    components = [
      ...methods.map((item) => component({ id: item.id, label: item.label, status: item.compatible ? "calculated-official" : "not-applicable", ...(item.compatible ? { quantity: money(item.hours), unit: "hours" as const } : {}), formula: item.formula, sourceRefs })),
      component({ id: "annual-leave-entitlement", label: "Greatest compatible annual-leave entitlement", status: "calculated-official", quantity: money(maximum), unit: "hours", formula: "Maximum of the compatible statutory methods shown above.", sourceRefs }),
    ];
  } else if (rule.kind === "ie-redundancy") {
    const actualRedundancy = stringValue(input.values, "actualRedundancy");
    const fullyInsurable = stringValue(input.values, "fullyInsurable");
    const age = numberValue(input.values, "age", { maximum: 100 })!;
    const serviceWeeks = Math.floor(numberValue(input.values, "serviceWeeks", { maximum: 5_000 })!);
    const weeklyPay = numberValue(input.values, "weeklyPay", { maximum: 1_000_000 })!;
    if (actualRedundancy !== "yes") components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: actualRedundancy === "no" ? "not-applicable" : "out-of-scope", formula: "An actual legal redundancy must be confirmed.", sourceRefs })];
    else if (fullyInsurable !== "yes") components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: "out-of-scope", formula: "Fully insurable employment was not confirmed.", sourceRefs })];
    else if (age < rule.minimumAge || serviceWeeks < rule.minimumServiceWeeks) components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: "not-applicable", formula: `Requires age ${rule.minimumAge}+ and ${rule.minimumServiceWeeks} weeks of continuous service.`, sourceRefs })];
    else {
      const fullYears = Math.floor(serviceWeeks / 52);
      const cappedWeeklyPay = Math.min(weeklyPay, rule.weeklyPayCap);
      const payableWeeks = fullYears * rule.weeksPerYear + rule.bonusWeeks;
      components = [component({ id: "statutory-redundancy", label: "Statutory redundancy pay", status: "calculated-official", amount: money(payableWeeks * cappedWeeklyPay), quantity: payableWeeks, unit: "weeks", formula: `(${rule.weeksPerYear} weeks × ${fullYears} completed years + ${rule.bonusWeeks} bonus week) × min(${weeklyPay}, ${rule.weeklyPayCap})`, sourceRefs })];
    }
  }

  return {
    ruleSetId: envelope.id,
    marketId: envelope.marketId,
    jurisdictionCode: envelope.jurisdictionCode,
    jurisdictionLabel: envelope.rules.jurisdictionLabel,
    coverageStatement: envelope.rules.coverageStatement,
    periodId: envelope.periodId,
    currency: envelope.currency,
    coverage: envelope.coverage,
    components,
    rows: components.filter((item) => item.amount !== undefined).map((item) => ({ id: item.id, amount: item.amount!, status: item.status === "manual-scenario" ? "manual" : item.status === "not-applicable" ? "not-applicable" : "calculated", ruleRefs: item.sourceRefs })),
    warnings,
    missingConcepts: envelope.missingConcepts,
  };
}
