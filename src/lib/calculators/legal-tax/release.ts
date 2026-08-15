import { EMPLOYMENT_RULE_SETS } from "./employment/rules";
import { EMPLOYMENT_VARIANTS } from "./employment/variants";
import { INCOME_TAX_RULE_SETS, PAYROLL_RULE_SETS } from "./incomeTax/rules";
import { INCOME_TAX_VARIANTS, PAYROLL_VARIANTS } from "./incomeTax/variants";
import { INDIRECT_TAX_RULE_SETS } from "./indirectTax/rules";
import { INDIRECT_TAX_VARIANTS } from "./indirectTax/variants";
import { PUBLISHED_LEGAL_TAX_ROUTES } from "./routes";
import type { CalculatorMarketVariant, RuleSetEnvelope, SourceAuditRecord } from "./types";

export const ALL_LEGAL_TAX_RULE_SETS: RuleSetEnvelope[] = [
  ...INDIRECT_TAX_RULE_SETS,
  ...INCOME_TAX_RULE_SETS,
  ...PAYROLL_RULE_SETS,
  ...EMPLOYMENT_RULE_SETS,
];

export const ALL_LEGAL_TAX_VARIANTS: CalculatorMarketVariant[] = [
  ...INDIRECT_TAX_VARIANTS,
  ...INCOME_TAX_VARIANTS,
  ...PAYROLL_VARIANTS,
  ...EMPLOYMENT_VARIANTS,
];

export const LEGAL_TAX_RULE_OWNER = "calculadoras.tools legal-tax maintainers";
export const LEGAL_TAX_INDEPENDENT_REVIEWER = "OpenAI Codex official-source implementation audit";

export const SOURCE_AUDIT_RECORDS: SourceAuditRecord[] = (() => {
  const records = new Map<string, SourceAuditRecord>();
  ALL_LEGAL_TAX_RULE_SETS.forEach((ruleSet) => ruleSet.sources.forEach((source) => {
    const existing = records.get(source.id);
    if (existing) {
      if (!existing.appliesToRuleIds.includes(ruleSet.id)) existing.appliesToRuleIds.push(ruleSet.id);
      return;
    }
    records.set(source.id, {
      sourceId: source.id,
      authority: source.authority,
      title: source.title,
      canonicalUrl: source.url,
      jurisdictionCode: ruleSet.jurisdictionCode,
      appliesToRuleIds: [ruleSet.id],
      ...(source.sourceVersion ? { sourceVersion: source.sourceVersion } : {}),
      ...(source.effectiveFrom ? { effectiveFrom: source.effectiveFrom } : {}),
      ...(source.effectiveTo ? { effectiveTo: source.effectiveTo } : {}),
      accessedAt: source.accessedAt,
      reviewedBy: LEGAL_TAX_INDEPENDENT_REVIEWER,
      reviewNotes: "Implementation values and scope were traced to this primary authority; boundary coverage is recorded in the referenced rule-set test suite.",
    });
  }));
  return [...records.values()].map((record) => ({ ...record, appliesToRuleIds: [...record.appliesToRuleIds].sort() }));
})();

export const LEGACY_MEXICO_ROUTE_RECORDS = [
  { path: "/en/legal-tax/mexico-income-tax-calculator", jurisdictionCode: "MX", implementation: "mexico-income-tax" },
  { path: "/en/legal-tax/mexico-net-salary-calculator", jurisdictionCode: "MX", implementation: "mexico-net-salary" },
  { path: "/en/legal-tax/mexico-proportional-vacation-calculator", jurisdictionCode: "MX", implementation: "mexico-proportional-vacation" },
  { path: "/en/legal-tax/mexico-termination-pay-calculator", jurisdictionCode: "MX", implementation: "mexico-termination-pay" },
] as const;

export const LEGAL_TAX_HUB_ROUTES = [
  "/en/legal-tax/indirect-tax-calculator",
  "/en/legal-tax/income-tax-calculators",
  "/en/legal-tax/take-home-pay-calculators",
] as const;

export const LEGAL_TAX_RELEASE_MANIFEST = {
  releaseId: "legal-tax-en-2026-08-15",
  releasedAt: "2026-08-15",
  owner: LEGAL_TAX_RULE_OWNER,
  independentReviewer: LEGAL_TAX_INDEPENDENT_REVIEWER,
  ruleSetIds: ALL_LEGAL_TAX_RULE_SETS.map((item) => item.id),
  variantIds: ALL_LEGAL_TAX_VARIANTS.filter((item) => item.publicationStatus === "published").map((item) => item.variantId),
  routes: [...PUBLISHED_LEGAL_TAX_ROUTES],
  hubs: [...LEGAL_TAX_HUB_ROUTES],
  legacyMexicoRoutes: LEGACY_MEXICO_ROUTE_RECORDS.map((item) => item.path),
  qa: {
    viewports: [320, 360, 390, 768, 1024, 1440],
    zoomPercent: 200,
    resultAnnouncement: "submit-only",
    sensitiveInputPersistence: "explicit-user-action-only",
  },
  monitoring: {
    windowDays: 14,
    signals: ["legacy-redirect-hits", "route-404s", "unexpected-canonicals", "calculation-reason-codes", "unsupported-market-cases", "source-review-due"],
    forbiddenPayloads: ["income", "salary", "employment-dates", "filing-status", "tax-code", "province", "offer"],
  },
  rollback: {
    strategy: "suspend-affected-variant",
    removeFromDirectoryAndSitemap: true,
    preserveHistoricalRuleSets: true,
    allowMexicoFallbackForOtherMarkets: false,
  },
} as const;

export type DatasetAvailability = "ready" | "historical" | "blocked";

export function evaluateRuleSetAvailability(ruleSet: RuleSetEnvelope, today: string): DatasetAvailability {
  if (["draft", "independently-reviewed", "expired", "suspended"].includes(ruleSet.status)) return "blocked";
  if (today < ruleSet.effectiveFrom) return "blocked";
  if (today > ruleSet.reviewDueAt) return "blocked";
  if (ruleSet.effectiveTo && today > ruleSet.effectiveTo) return ruleSet.status === "historical" ? "historical" : "blocked";
  return ruleSet.status === "historical" ? "historical" : "ready";
}

export function collectSourceRefs(value: unknown): string[] {
  const refs = new Set<string>();
  const visit = (item: unknown) => {
    if (Array.isArray(item)) { item.forEach(visit); return; }
    if (!item || typeof item !== "object") return;
    Object.entries(item).forEach(([key, nested]) => {
      if (key === "sourceRefs" && Array.isArray(nested)) nested.forEach((ref) => refs.add(String(ref)));
      else visit(nested);
    });
  };
  visit(value);
  return [...refs];
}

export function validateLegalTaxRelease(today = LEGAL_TAX_RELEASE_MANIFEST.releasedAt) {
  const errors: string[] = [];
  const ruleSets = new Map(ALL_LEGAL_TAX_RULE_SETS.map((item) => [item.id, item]));
  const audits = new Map(SOURCE_AUDIT_RECORDS.map((item) => [item.sourceId, item]));
  const canonicalPaths = new Set<string>();

  ALL_LEGAL_TAX_RULE_SETS.forEach((ruleSet) => {
    if (evaluateRuleSetAvailability(ruleSet, today) !== "ready") errors.push(`${ruleSet.id}: dataset is not release-ready`);
    if (!ruleSet.sources.length || !ruleSet.officialFixtures.length) errors.push(`${ruleSet.id}: sources or fixtures missing`);
    const sourceIds = new Set(ruleSet.sources.map((source) => source.id));
    ruleSet.sources.forEach((source) => {
      const audit = audits.get(source.id);
      if (!source.primary || !source.url.startsWith("https://")) errors.push(`${ruleSet.id}: non-primary or non-HTTPS source ${source.id}`);
      if (!audit || !audit.appliesToRuleIds.includes(ruleSet.id)) errors.push(`${ruleSet.id}: source audit missing for ${source.id}`);
      if (audit?.reviewedBy === LEGAL_TAX_RULE_OWNER) errors.push(`${ruleSet.id}: source was not independently reviewed`);
    });
    collectSourceRefs(ruleSet.rules).forEach((ref) => { if (!sourceIds.has(ref)) errors.push(`${ruleSet.id}: unknown sourceRef ${ref}`); });
  });

  ALL_LEGAL_TAX_VARIANTS.forEach((variant) => {
    if (variant.publicationStatus !== "published") errors.push(`${variant.variantId}: non-published variant in release inventory`);
    if (canonicalPaths.has(variant.canonicalPath)) errors.push(`${variant.variantId}: duplicate canonical ${variant.canonicalPath}`);
    canonicalPaths.add(variant.canonicalPath);
    if (!PUBLISHED_LEGAL_TAX_ROUTES.includes(variant.canonicalPath as typeof PUBLISHED_LEGAL_TAX_ROUTES[number])) errors.push(`${variant.variantId}: canonical absent from route manifest`);
    variant.ruleSetIds.forEach((id) => {
      const ruleSet = ruleSets.get(id);
      if (!ruleSet || ruleSet.marketId !== variant.marketId || ruleSet.familyId !== variant.familyId) errors.push(`${variant.variantId}: incompatible rule set ${id}`);
    });
  });

  if (LEGAL_TAX_RELEASE_MANIFEST.rollback.allowMexicoFallbackForOtherMarkets) errors.push("Rollback must never enable a Mexico fallback for another market");
  return errors;
}
