import { MARKET_DEFINITIONS } from "./markets";
import type { CalculatorMarketVariant, RuleSetEnvelope } from "./types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class LegalTaxRegistry {
  private readonly ruleSetsById = new Map<string, RuleSetEnvelope>();
  private readonly variantsById = new Map<string, CalculatorMarketVariant>();

  constructor(ruleSets: RuleSetEnvelope[] = [], variants: CalculatorMarketVariant[] = []) {
    ruleSets.forEach((ruleSet) => this.registerRuleSet(ruleSet));
    variants.forEach((variant) => this.registerVariant(variant));
  }

  registerRuleSet(ruleSet: RuleSetEnvelope) {
    if (this.ruleSetsById.has(ruleSet.id)) throw new Error(`Duplicate rule-set id: ${ruleSet.id}`);
    validateRuleSet(ruleSet);
    const overlaps = [...this.ruleSetsById.values()].some((other) =>
      other.familyId === ruleSet.familyId && other.marketId === ruleSet.marketId &&
      other.jurisdictionCode === ruleSet.jurisdictionCode && other.regimeId === ruleSet.regimeId &&
      rangesOverlap(other.effectiveFrom, other.effectiveTo, ruleSet.effectiveFrom, ruleSet.effectiveTo),
    );
    if (overlaps) throw new Error(`Overlapping rule-set period: ${ruleSet.id}`);
    this.ruleSetsById.set(ruleSet.id, ruleSet);
  }

  registerVariant(variant: CalculatorMarketVariant) {
    if (this.variantsById.has(variant.variantId)) throw new Error(`Duplicate variant id: ${variant.variantId}`);
    if (!variant.canonicalPath.startsWith("/en/legal-tax/")) throw new Error(`Invalid canonical path: ${variant.variantId}`);
    const referenced = variant.ruleSetIds.map((id) => this.ruleSetsById.get(id));
    if (referenced.some((item) => !item)) throw new Error(`Variant ${variant.variantId} references an unknown rule set.`);
    if (referenced.some((item) => item?.marketId !== variant.marketId || item?.familyId !== variant.familyId)) {
      throw new Error(`Variant ${variant.variantId} references a rule set from another market or family.`);
    }
    if (variant.publicationStatus === "published" && referenced.some((item) => !["current", "historical"].includes(item?.status ?? ""))) {
      throw new Error(`Published variant ${variant.variantId} references a non-publishable rule set.`);
    }
    this.variantsById.set(variant.variantId, variant);
  }

  getRuleSet(id: string) { return this.ruleSetsById.get(id); }
  getVariant(id: string) { return this.variantsById.get(id); }
  getRuleSets() { return [...this.ruleSetsById.values()]; }
  getVariants() { return [...this.variantsById.values()]; }
  getPublishedVariants() { return this.getVariants().filter((variant) => variant.publicationStatus === "published"); }
}

export function validateRuleSet(ruleSet: RuleSetEnvelope) {
  const market = MARKET_DEFINITIONS[ruleSet.marketId];
  if (ruleSet.countryCode !== market.countryCode || ruleSet.currency !== market.currency) {
    throw new Error(`Market, country, and currency mismatch: ${ruleSet.id}`);
  }
  [ruleSet.effectiveFrom, ruleSet.effectiveTo, ruleSet.reviewedAt, ruleSet.reviewDueAt, ruleSet.publishedAt]
    .filter((value): value is string => Boolean(value))
    .forEach((value) => { if (!ISO_DATE.test(value)) throw new Error(`Invalid ISO date in ${ruleSet.id}: ${value}`); });
  if (ruleSet.effectiveTo && ruleSet.effectiveFrom > ruleSet.effectiveTo) throw new Error(`Invalid effective range: ${ruleSet.id}`);
  if (ruleSet.reviewedAt > ruleSet.reviewDueAt) throw new Error(`Invalid review range: ${ruleSet.id}`);
  if (ruleSet.status === "current") {
    if (!ruleSet.publishedAt) throw new Error(`Current rule set lacks publishedAt: ${ruleSet.id}`);
    if (!ruleSet.sources.some((source) => source.primary)) throw new Error(`Current rule set lacks a primary source: ${ruleSet.id}`);
    if (ruleSet.officialFixtures.length === 0) throw new Error(`Current rule set lacks fixtures: ${ruleSet.id}`);
  }
  if (ruleSet.coverage === "complete" && ruleSet.missingConcepts.length > 0) {
    throw new Error(`Complete rule set lists missing concepts: ${ruleSet.id}`);
  }
  const sourceIds = new Set(ruleSet.sources.map((source) => source.id));
  if (sourceIds.size !== ruleSet.sources.length) throw new Error(`Duplicate source id in ${ruleSet.id}`);
  ruleSet.officialFixtures.forEach((fixture) => {
    if (!sourceIds.has(fixture.sourceId)) throw new Error(`Fixture ${fixture.id} has an unknown source in ${ruleSet.id}`);
    if (fixture.periodId !== ruleSet.periodId) throw new Error(`Fixture ${fixture.id} uses another period in ${ruleSet.id}`);
  });
}

function rangesOverlap(aFrom: string, aTo: string | undefined, bFrom: string, bTo: string | undefined) {
  return aFrom <= (bTo ?? "9999-12-31") && bFrom <= (aTo ?? "9999-12-31");
}

export const legalTaxRegistry = new LegalTaxRegistry();
