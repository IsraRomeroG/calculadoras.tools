export const BILL_SPLIT_CURRENCIES = [
  "MXN",
  "USD",
  "EUR",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "BRL",
  "OTHER",
] as const;

export type BillSplitCurrency = (typeof BILL_SPLIT_CURRENCIES)[number];
export type TipInput =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number };
export type RoundingIncrement = 1 | 5 | 10 | "minimum";

export type ParseMoneyResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface ExactCentAdjustment {
  minorUnit: number;
  totalUnits: number;
  lowPayment: number;
  highPayment: number;
  lowPaymentCount: number;
  highPaymentCount: number;
  totalCollected: number;
  difference: number;
  payments: Array<{
    count: number;
    amount: number;
  }>;
}

export interface RoundingResult {
  increment: number;
  roundedPayment: number;
  totalCollected: number;
  difference: number;
}

export interface BillSplitInput {
  bill: number;
  people: number;
  tip: TipInput;
  additionalCharges?: number;
  currency?: BillSplitCurrency;
  exactCentAdjustment?: boolean;
  rounding?: {
    enabled: boolean;
    increment: RoundingIncrement;
  };
}

export interface BillSplitResult {
  bill: number;
  people: number;
  tipAmount: number;
  tipLabel: string;
  additionalCharges: number;
  total: number;
  exactIndividualPayment: number;
  basePerPerson: number;
  tipPerPerson: number;
  chargesPerPerson: number;
  currency: BillSplitCurrency;
  minorUnit: number;
  exactAdjustment?: ExactCentAdjustment;
  rounding?: RoundingResult;
}

const MONEY_MAX_DECIMALS = 4;
const SUPPORTED_CURRENCY_CODES = new Set(BILL_SPLIT_CURRENCIES);

export function calculateTipAmount(bill: number, tipInput: TipInput): number {
  validateFiniteNonNegative(bill, "bill");
  validateFiniteNonNegative(tipInput.value, "tip");

  if (tipInput.type === "percentage") {
    return bill * (tipInput.value / 100);
  }

  return tipInput.value;
}

export function calculateEqualBillSplit(
  input: BillSplitInput,
): BillSplitResult {
  const additionalCharges = input.additionalCharges ?? 0;
  const currency = input.currency ?? "MXN";

  validateFiniteNonNegative(input.bill, "bill");
  validateFiniteNonNegative(additionalCharges, "additionalCharges");
  validatePeople(input.people);

  if (!SUPPORTED_CURRENCY_CODES.has(currency)) {
    throw new RangeError("The currency is not supported.");
  }

  const minorUnit = getCurrencyMinorUnit(currency);
  const tipAmount = calculateTipAmount(input.bill, input.tip);
  const total = input.bill + tipAmount + additionalCharges;
  const exactIndividualPayment = total / input.people;
  const result: BillSplitResult = {
    bill: input.bill,
    people: input.people,
    tipAmount,
    tipLabel:
      input.tip.type === "percentage"
        ? `${formatDecimal(input.tip.value)}%`
        : "monto fijo",
    additionalCharges,
    total,
    exactIndividualPayment,
    basePerPerson: input.bill / input.people,
    tipPerPerson: tipAmount / input.people,
    chargesPerPerson: additionalCharges / input.people,
    currency,
    minorUnit,
  };

  if (input.exactCentAdjustment ?? true) {
    result.exactAdjustment = calculateExactCentAdjustment(
      total,
      input.people,
      minorUnit,
    );
  }

  if (input.rounding?.enabled) {
    const increment =
      input.rounding.increment === "minimum"
        ? minorUnit
        : input.rounding.increment;
    const roundedPayment = roundIndividualPaymentUp(
      exactIndividualPayment,
      increment,
    );

    result.rounding = {
      increment,
      roundedPayment,
      totalCollected: roundedPayment * input.people,
      difference: calculateRoundingDifference(
        total,
        roundedPayment,
        input.people,
      ),
    };
  }

  return result;
}

export function calculateExactCentAdjustment(
  total: number,
  people: number,
  minorUnit = 0.01,
): ExactCentAdjustment {
  validateFiniteNonNegative(total, "total");
  validatePeople(people);

  if (!Number.isFinite(minorUnit) || minorUnit <= 0) {
    throw new RangeError("The smallest unit must be positive.");
  }

  const totalUnits = Math.round(total / minorUnit);
  const baseUnits = Math.floor(totalUnits / people);
  const remainingUnits = totalUnits - baseUnits * people;
  const lowPayment = baseUnits * minorUnit;
  const highPayment = (baseUnits + 1) * minorUnit;
  const lowPaymentCount = people - remainingUnits;
  const highPaymentCount = remainingUnits;
  const payments = [
    ...(lowPaymentCount > 0
      ? [{ count: lowPaymentCount, amount: roundToMinorUnit(lowPayment, minorUnit) }]
      : []),
    ...(highPaymentCount > 0
      ? [{ count: highPaymentCount, amount: roundToMinorUnit(highPayment, minorUnit) }]
      : []),
  ];
  const totalCollected = roundToMinorUnit(
    payments.reduce((sum, payment) => sum + payment.count * payment.amount, 0),
    minorUnit,
  );

  return {
    minorUnit,
    totalUnits,
    lowPayment: roundToMinorUnit(lowPayment, minorUnit),
    highPayment: roundToMinorUnit(highPayment, minorUnit),
    lowPaymentCount,
    highPaymentCount,
    totalCollected,
    difference: roundToMinorUnit(totalCollected - total, minorUnit),
    payments,
  };
}

export function roundIndividualPaymentUp(
  amount: number,
  increment: number,
): number {
  validateFiniteNonNegative(amount, "amount");

  if (!Number.isFinite(increment) || increment <= 0) {
    throw new RangeError("The increment must be positive.");
  }

  return Math.ceil((amount - Number.EPSILON) / increment) * increment;
}

export function calculateRoundingDifference(
  total: number,
  roundedPayment: number,
  people: number,
): number {
  validateFiniteNonNegative(total, "total");
  validateFiniteNonNegative(roundedPayment, "roundedPayment");
  validatePeople(people);

  return roundedPayment * people - total;
}

export function getCurrencyMinorUnit(currency: BillSplitCurrency): number {
  if (currency === "CLP" || currency === "COP") {
    return 1;
  }

  return 0.01;
}

export function parseMoneyInput(value: string): ParseMoneyResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownMoneyAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeMoneySeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > MONEY_MAX_DECIMALS) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatMoney(
  value: number,
  currency: BillSplitCurrency = "MXN",
  locale = "en-US",
): string {
  const minorUnit = getCurrencyMinorUnit(currency);
  const fractionDigits = minorUnit >= 1 ? 0 : 2;
  const roundedValue = roundToMinorUnit(value, minorUnit);

  if (currency === "OTHER") {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(roundedValue);
  }

  return `${new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(roundedValue)} ${currency}`;
}

export function buildShareText(result: BillSplitResult): string {
  const lines = [
    "Split bill:",
    `Total: ${formatMoney(result.total, result.currency)}`,
    `People: ${result.people}`,
  ];

  if (result.rounding) {
    lines.push(
      `Each person pays: ${formatMoney( result.rounding.roundedPayment, result.currency, )}`,
      `Total reunido: ${formatMoney(
        result.rounding.totalCollected,
        result.currency,
      )}`,
      `Rounding surplus: ${formatMoney( result.rounding.difference, result.currency, )}`,
    );
  } else if (
    result.exactAdjustment &&
    result.exactAdjustment.payments.length > 1
  ) {
    result.exactAdjustment.payments.forEach((payment) => {
      lines.push(
        `${payment.count} ${payment.count === 1 ? "person pays" : "people pay"}: ${formatMoney( payment.amount, result.currency, )}`,
      );
    });
    lines.push(
      `Diferencia: ${formatMoney(
        result.exactAdjustment.difference,
        result.currency,
      )}`,
    );
  } else {
    const payment =
      result.exactAdjustment?.payments[0]?.amount ?? result.exactIndividualPayment;

    lines.push(`Each person pays: ${formatMoney(payment, result.currency)}`);
  }

  lines.push(`Included tip: ${formatMoney(result.tipAmount, result.currency)}`);

  return lines.join("\n");
}

function removeKnownMoneyAffixes(value: string): string {
  return value
    .replace(
      /\b(MXN|USD|EUR|COP|ARS|CLP|PEN|BRL|Otra|OTHER)\b/gi,
      "",
    )
    .replace(/S\/|R\$|[$€£¥₡Q%\s]/gi, "");
}

function normalizeMoneySeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
): string | undefined {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return undefined;
    }

    if (
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
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

  return undefined;
}

function validateFiniteNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite nonnegative number.`);
  }
}

function validatePeople(value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError("People must be an integer greater than or equal to 1.");
  }
}

function roundToMinorUnit(value: number, minorUnit: number) {
  const units = Math.round((value + Number.EPSILON) / minorUnit);

  return roundToDecimals(units * minorUnit, getMinorUnitDecimals(minorUnit));
}

function getMinorUnitDecimals(minorUnit: number) {
  if (minorUnit >= 1) {
    return 0;
  }

  const text = minorUnit.toString();

  if (text.includes("e-")) {
    return Number(text.split("e-")[1]);
  }

  return text.split(".")[1]?.length ?? 0;
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}
