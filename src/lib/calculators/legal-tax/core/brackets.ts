export interface MarginalBracket {
  lower: number;
  upper?: number;
  rate: number;
}

export interface MarginalBracketResult {
  tax: number;
  marginalRate: number;
  bracketIndex: number | null;
  rows: Array<{ bracketIndex: number; taxable: number; rate: number; tax: number }>;
}

export function validateMarginalBrackets(brackets: MarginalBracket[]) {
  if (brackets.length === 0 || brackets[0].lower !== 0) {
    throw new Error("Marginal brackets must start at zero.");
  }

  brackets.forEach((bracket, index) => {
    if (bracket.lower < 0 || bracket.rate < 0 || (bracket.upper !== undefined && bracket.upper <= bracket.lower)) {
      throw new Error(`Invalid marginal bracket at index ${index}.`);
    }
    const next = brackets[index + 1];
    if (next && bracket.upper !== next.lower) {
      throw new Error(`Marginal brackets have a gap or overlap at index ${index}.`);
    }
    if (!next && bracket.upper !== undefined) {
      throw new Error("The final marginal bracket must be open-ended.");
    }
  });
}

export function calculateMarginalTax(amount: number, brackets: MarginalBracket[]): MarginalBracketResult {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("Taxable amount must be finite and non-negative.");
  validateMarginalBrackets(brackets);

  let tax = 0;
  let marginalRate = 0;
  let bracketIndex: number | null = null;
  const rows: MarginalBracketResult["rows"] = [];

  brackets.forEach((bracket, index) => {
    const upper = bracket.upper ?? Number.POSITIVE_INFINITY;
    const taxable = Math.max(0, Math.min(amount, upper) - bracket.lower);
    if (taxable > 0) {
      const bracketTax = taxable * bracket.rate;
      tax += bracketTax;
      marginalRate = bracket.rate;
      bracketIndex = index;
      rows.push({ bracketIndex: index, taxable, rate: bracket.rate, tax: bracketTax });
    }
  });

  return { tax, marginalRate, bracketIndex, rows };
}
