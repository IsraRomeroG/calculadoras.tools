import * as base from "./dca";

export * from "./dca";

export function formatDcaCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(value) > 0 && Math.abs(value) < 0.01 ? 12 : 2,
  }).format(value);
}

export function formatDcaNumber(value: number, maximumFractionDigits = 8): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatDcaPercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export const calculateDca = base.calculateDca;
export const parseDcaNumber = base.parseDcaNumber;
export const simulateNextPurchase = base.simulateNextPurchase;
