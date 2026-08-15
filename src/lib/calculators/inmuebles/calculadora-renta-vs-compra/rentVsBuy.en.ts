export interface RentVsBuyInput {
  monthlyRent: number;
  annualRentIncreasePercent: number;
  propertyPrice: number;
  downPaymentPercent: number;
  annualMortgageRatePercent: number;
  mortgageTermYears: number;
  comparisonYears: number;
  purchaseCostPercent: number;
  sellingCostPercent: number;
  annualMaintenancePercent: number;
  annualPropertyTaxPercent: number;
  annualAppreciationPercent: number;
  annualAlternativeReturnPercent: number;
}

export interface RentVsBuyAnnualRow {
  year: number;
  monthlyRent: number;
  annualRent: number;
  propertyValue: number;
  mortgagePayment: number;
  principalPaid: number;
  interestPaid: number;
  maintenanceCost: number;
  propertyTaxCost: number;
  ownershipCashOut: number;
  flowDifference: number;
  alternativeCapital: number;
  remainingMortgageBalance: number;
  sellingCosts: number;
  rentNetWorth: number;
  buyNetWorth: number;
  netWorthDifference: number;
  netRentCost: number;
  netBuyCost: number;
}

export interface RentVsBuyResult {
  downPaymentAmount: number;
  purchaseCostAmount: number;
  initialCashRequired: number;
  loanAmount: number;
  monthlyMortgagePayment: number;
  initialMonthlyOwnershipCost: number;
  initialMonthlyDifference: number;
  totalRentPaid: number;
  totalMortgagePaid: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalMaintenancePaid: number;
  totalPropertyTaxPaid: number;
  totalOwnershipCashOut: number;
  finalPropertyValue: number;
  finalSellingCosts: number;
  finalMortgageBalance: number;
  rentNetWorth: number;
  buyNetWorth: number;
  netWorthDifference: number;
  netRentCost: number;
  netBuyCost: number;
  breakEvenYear: number | null;
  winner: "buy" | "rent" | "tie";
  annualRows: RentVsBuyAnnualRow[];
}

export type ParseRentVsBuyInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const balanceEpsilon = 0.005;

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const comparisonYears = Math.max(Math.round(input.comparisonYears), 1);
  const mortgageTermMonths = Math.max(
    Math.round(input.mortgageTermYears * 12),
    1,
  );
  const downPaymentAmount =
    input.propertyPrice * (input.downPaymentPercent / 100);
  const purchaseCostAmount =
    input.propertyPrice * (input.purchaseCostPercent / 100);
  const initialCashRequired = downPaymentAmount + purchaseCostAmount;
  const loanAmount = Math.max(input.propertyPrice - downPaymentAmount, 0);
  const monthlyMortgagePayment = calculateMonthlyMortgagePayment(
    loanAmount,
    input.annualMortgageRatePercent,
    input.mortgageTermYears,
  );
  const monthlyMortgageRate = input.annualMortgageRatePercent / 12 / 100;
  const rentIncreaseRate = input.annualRentIncreasePercent / 100;
  const maintenanceRate = input.annualMaintenancePercent / 100;
  const propertyTaxRate = input.annualPropertyTaxPercent / 100;
  const appreciationRate = input.annualAppreciationPercent / 100;
  const alternativeReturnRate = input.annualAlternativeReturnPercent / 100;
  const sellingCostRate = input.sellingCostPercent / 100;
  const initialMonthlyOwnershipCost =
    monthlyMortgagePayment +
    (input.propertyPrice * (maintenanceRate + propertyTaxRate)) / 12;
  const annualRows: RentVsBuyAnnualRow[] = [];
  let remainingMortgageBalance = loanAmount;
  let elapsedMortgageMonths = 0;
  let alternativeCapital = initialCashRequired;
  let totalRentPaid = 0;
  let totalMortgagePaid = 0;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  let totalMaintenancePaid = 0;
  let totalPropertyTaxPaid = 0;
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= comparisonYears; year += 1) {
    const monthlyRent =
      input.monthlyRent * Math.pow(1 + rentIncreaseRate, year - 1);
    const annualRent = monthlyRent * 12;
    const propertyValue =
      input.propertyPrice * Math.pow(1 + appreciationRate, year);
    const maintenanceCost = propertyValue * maintenanceRate;
    const propertyTaxCost = propertyValue * propertyTaxRate;
    let mortgagePayment = 0;
    let principalPaid = 0;
    let interestPaid = 0;

    for (let month = 1; month <= 12; month += 1) {
      if (
        remainingMortgageBalance <= balanceEpsilon ||
        elapsedMortgageMonths >= mortgageTermMonths
      ) {
        continue;
      }

      const interest =
        monthlyMortgageRate > 0
          ? remainingMortgageBalance * monthlyMortgageRate
          : 0;
      const principal =
        monthlyMortgageRate > 0
          ? Math.min(
              Math.max(monthlyMortgagePayment - interest, 0),
              remainingMortgageBalance,
            )
          : Math.min(monthlyMortgagePayment, remainingMortgageBalance);
      const payment = interest + principal;

      remainingMortgageBalance =
        remainingMortgageBalance - principal < balanceEpsilon
          ? 0
          : remainingMortgageBalance - principal;
      elapsedMortgageMonths += 1;
      mortgagePayment += payment;
      principalPaid += principal;
      interestPaid += interest;
    }

    const ownershipCashOut =
      mortgagePayment + maintenanceCost + propertyTaxCost;
    const flowDifference = ownershipCashOut - annualRent;

    alternativeCapital =
      alternativeCapital * (1 + alternativeReturnRate) + flowDifference;
    totalRentPaid += annualRent;
    totalMortgagePaid += mortgagePayment;
    totalPrincipalPaid += principalPaid;
    totalInterestPaid += interestPaid;
    totalMaintenancePaid += maintenanceCost;
    totalPropertyTaxPaid += propertyTaxCost;

    const sellingCosts = propertyValue * sellingCostRate;
    const buyNetWorth =
      propertyValue - remainingMortgageBalance - sellingCosts;
    const rentNetWorth = alternativeCapital;
    const netWorthDifference = buyNetWorth - rentNetWorth;
    const totalOwnershipCashOut =
      totalMortgagePaid + totalMaintenancePaid + totalPropertyTaxPaid;
    const netRentCost = totalRentPaid - rentNetWorth;
    const netBuyCost =
      initialCashRequired + totalOwnershipCashOut - buyNetWorth;

    if (breakEvenYear === null && netWorthDifference >= -balanceEpsilon) {
      breakEvenYear = year;
    }

    annualRows.push({
      year,
      monthlyRent,
      annualRent,
      propertyValue,
      mortgagePayment,
      principalPaid,
      interestPaid,
      maintenanceCost,
      propertyTaxCost,
      ownershipCashOut,
      flowDifference,
      alternativeCapital,
      remainingMortgageBalance,
      sellingCosts,
      rentNetWorth,
      buyNetWorth,
      netWorthDifference,
      netRentCost,
      netBuyCost,
    });
  }

  const lastRow = annualRows.at(-1);
  const rentNetWorth = lastRow?.rentNetWorth ?? initialCashRequired;
  const buyNetWorth =
    lastRow?.buyNetWorth ?? input.propertyPrice - loanAmount;
  const netWorthDifference = buyNetWorth - rentNetWorth;
  const finalPropertyValue =
    lastRow?.propertyValue ??
    input.propertyPrice * Math.pow(1 + appreciationRate, comparisonYears);
  const finalSellingCosts = finalPropertyValue * sellingCostRate;
  const totalOwnershipCashOut =
    totalMortgagePaid + totalMaintenancePaid + totalPropertyTaxPaid;
  const netRentCost = totalRentPaid - rentNetWorth;
  const netBuyCost =
    initialCashRequired + totalOwnershipCashOut - buyNetWorth;
  const winner =
    Math.abs(netWorthDifference) <= balanceEpsilon
      ? "tie"
      : netWorthDifference > 0
        ? "buy"
        : "rent";

  return {
    downPaymentAmount,
    purchaseCostAmount,
    initialCashRequired,
    loanAmount,
    monthlyMortgagePayment,
    initialMonthlyOwnershipCost,
    initialMonthlyDifference:
      initialMonthlyOwnershipCost - input.monthlyRent,
    totalRentPaid,
    totalMortgagePaid,
    totalPrincipalPaid,
    totalInterestPaid,
    totalMaintenancePaid,
    totalPropertyTaxPaid,
    totalOwnershipCashOut,
    finalPropertyValue,
    finalSellingCosts,
    finalMortgageBalance: remainingMortgageBalance,
    rentNetWorth,
    buyNetWorth,
    netWorthDifference,
    netRentCost,
    netBuyCost,
    breakEvenYear,
    winner,
    annualRows,
  };
}

export function calculateMonthlyMortgagePayment(
  principal: number,
  annualRatePercent: number,
  years: number,
): number {
  const months = Math.round(years * 12);

  if (principal <= 0) {
    return 0;
  }

  if (months <= 0 || annualRatePercent < 0) {
    return Number.NaN;
  }

  const monthlyRate = annualRatePercent / 12 / 100;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return (principal * monthlyRate * factor) / (factor - 1);
}

export function parseRentVsBuyInput(
  value: string,
  options: {
    maxDecimals?: number;
    preferDecimal?: boolean;
    allowNegative?: boolean;
  } = {},
): ParseRentVsBuyInputResult {
  const trimmed = value.trim();
  const maxDecimals = options.maxDecimals ?? 2;
  const preferDecimal = options.preferDecimal ?? false;
  const allowNegative = options.allowNegative ?? false;

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const isNegative = /^[-\u2212]/.test(trimmed);

  if (isNegative && !allowNegative) {
    return { ok: false, error: "negative" };
  }

  const unsignedValue = isNegative
    ? trimmed.replace(/^[-\u2212]\s*/, "")
    : trimmed;
  const cleaned = removeKnownAffixes(unsignedValue);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized) * (isNegative ? -1 : 1);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized: `${isNegative ? "-" : ""}${normalized}`,
  };
}

export function formatCurrency(value: number): string {
  return moneyFormatter.format(roundCurrency(value));
}

export function formatCompactCurrency(value: number): string {
  return compactMoneyFormatter.format(roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundTo(value, 2))}%`;
}

export function roundCurrency(value: number): number {
  return roundTo(value, 2);
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$%\s]/gi, "");
}

function normalizeSeparators(value: string, preferDecimal: boolean): string {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",", preferDecimal);
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".", preferDecimal);
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
  preferDecimal: boolean,
): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (
      !preferDecimal &&
      separator === "," &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return value;
}
