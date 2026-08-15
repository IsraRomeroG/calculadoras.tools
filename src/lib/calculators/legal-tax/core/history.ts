import type { MarketContext, StoredCalculation } from "../types";

export function canRestoreCalculation(snapshot: StoredCalculation, context: MarketContext, variantId: string, ruleSetId: string) {
  return snapshot.schemaVersion === 1 &&
    snapshot.variantId === variantId &&
    snapshot.ruleSetId === ruleSetId &&
    snapshot.marketId === context.marketId &&
    snapshot.jurisdictionCode === context.jurisdictionCode &&
    snapshot.periodId === context.periodId;
}
