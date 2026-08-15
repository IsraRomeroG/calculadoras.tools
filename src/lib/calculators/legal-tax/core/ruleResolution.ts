import { MARKET_DEFINITIONS } from "../markets";
import type { MarketContext, RuleResolution, RuleSetEnvelope } from "../types";

export function resolveRuleSet<T>(
  context: MarketContext,
  ruleSets: RuleSetEnvelope<T>[],
  today = new Date().toISOString().slice(0, 10),
): RuleResolution<T> {
  const market = MARKET_DEFINITIONS[context.marketId];
  if (context.countryCode !== market.countryCode || context.currency !== market.currency) {
    return { status: "unsupported", reasonCode: "market-context-mismatch" };
  }

  const jurisdictionSets = ruleSets.filter((ruleSet) =>
    ruleSet.marketId === context.marketId &&
    ruleSet.countryCode === context.countryCode &&
    ruleSet.currency === context.currency &&
    ruleSet.jurisdictionCode === context.jurisdictionCode &&
    ruleSet.regimeId === context.regimeId,
  );
  const exact = jurisdictionSets.find((ruleSet) => ruleSet.periodId === context.periodId);

  if (!exact) {
    return jurisdictionSets.length
      ? { status: "expired", availablePeriods: [...new Set(jurisdictionSets.map((item) => item.periodId))].sort() }
      : { status: "unsupported", reasonCode: "jurisdiction-or-regime-not-supported" };
  }

  if (["draft", "independently-reviewed", "suspended"].includes(exact.status)) {
    return { status: "unsupported", reasonCode: `rule-set-${exact.status}` };
  }
  if (exact.status === "expired" || today < exact.effectiveFrom || (exact.effectiveTo && today > exact.effectiveTo)) {
    return { status: "expired", availablePeriods: [...new Set(jurisdictionSets.map((item) => item.periodId))].sort() };
  }
  if (exact.coverage === "partial") return { status: "partial", ruleSet: exact, missing: exact.missingConcepts };
  return { status: "ready", ruleSet: exact };
}
