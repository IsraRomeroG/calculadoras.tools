import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { LEGAL_TAX_MARKET_DIRECTORY_ITEMS } from "./catalog";
import { LegalTaxRegistry } from "./registry";
import {
  ALL_LEGAL_TAX_RULE_SETS,
  ALL_LEGAL_TAX_VARIANTS,
  collectSourceRefs,
  evaluateRuleSetAvailability,
  LEGACY_MEXICO_ROUTE_RECORDS,
  LEGAL_TAX_HUB_ROUTES,
  LEGAL_TAX_INDEPENDENT_REVIEWER,
  LEGAL_TAX_RELEASE_MANIFEST,
  LEGAL_TAX_RULE_OWNER,
  SOURCE_AUDIT_RECORDS,
  validateLegalTaxRelease,
} from "./release";
import { LEGAL_TAX_LEGACY_REDIRECTS, PUBLISHED_LEGAL_TAX_ROUTES } from "./routes";

const root = process.cwd();
const routeFile = (route: string) => join(root, "src", "pages", `${route.slice(1)}.astro`);
const officialHost = (hostname: string) => [
  ".gov", ".gov.uk", ".gov.au", ".govt.nz", ".gob.mx",
  "canada.ca", "gov.ie", "revenue.ie", "workplacerelations.ie",
].some((suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix));
const sourceFiles = (path: string): string[] => readdirSync(path).flatMap((name) => {
  const current = join(path, name);
  if (statSync(current).isDirectory()) return sourceFiles(current);
  return [".ts", ".astro"].includes(extname(current)) && !current.endsWith(".test.ts") ? [current] : [];
});

describe("legal-tax release gate", () => {
  it("registers every release rule set and published variant without overlap or fallback", () => {
    const registry = new LegalTaxRegistry(ALL_LEGAL_TAX_RULE_SETS, ALL_LEGAL_TAX_VARIANTS);
    expect(registry.getRuleSets()).toHaveLength(ALL_LEGAL_TAX_RULE_SETS.length);
    expect(registry.getPublishedVariants()).toHaveLength(ALL_LEGAL_TAX_VARIANTS.length);
    expect(validateLegalTaxRelease()).toEqual([]);
    expect(LEGAL_TAX_RELEASE_MANIFEST.rollback.allowMexicoFallbackForOtherMarkets).toBe(false);
    expect(LEGAL_TAX_RELEASE_MANIFEST.qa.viewports).toEqual([320, 360, 390, 768, 1024, 1440]);
    expect(LEGAL_TAX_RELEASE_MANIFEST.monitoring.forbiddenPayloads).toContain("salary");
  });

  it("keeps only published canonicals in the route manifest", () => {
    const accountedRoutes = new Set([
      ...ALL_LEGAL_TAX_VARIANTS.map((item) => item.canonicalPath),
      ...LEGAL_TAX_HUB_ROUTES,
      ...LEGACY_MEXICO_ROUTE_RECORDS.map((item) => item.path),
    ]);
    expect(accountedRoutes).toEqual(new Set(PUBLISHED_LEGAL_TAX_ROUTES));
    expect(new Set(LEGAL_TAX_RELEASE_MANIFEST.routes)).toEqual(new Set(PUBLISHED_LEGAL_TAX_ROUTES));
    expect(new Set(ALL_LEGAL_TAX_VARIANTS.map((item) => item.canonicalPath)).size).toBe(ALL_LEGAL_TAX_VARIANTS.length);
    PUBLISHED_LEGAL_TAX_ROUTES.forEach((route) => expect(existsSync(routeFile(route)), route).toBe(true));
  });

  it("retains five direct legacy redirects and no legacy source route", () => {
    expect(Object.keys(LEGAL_TAX_LEGACY_REDIRECTS)).toHaveLength(5);
    Object.entries(LEGAL_TAX_LEGACY_REDIRECTS).forEach(([source, target]) => {
      expect(existsSync(routeFile(source))).toBe(false);
      expect(PUBLISHED_LEGAL_TAX_ROUTES).toContain(target);
      expect(Object.keys(LEGAL_TAX_LEGACY_REDIRECTS)).not.toContain(target);
    });
  });

  it("audits every primary source and every material sourceRef", () => {
    const audits = new Map(SOURCE_AUDIT_RECORDS.map((item) => [item.sourceId, item]));
    expect(LEGAL_TAX_INDEPENDENT_REVIEWER).not.toBe(LEGAL_TAX_RULE_OWNER);
    ALL_LEGAL_TAX_RULE_SETS.forEach((ruleSet) => {
      const ids = new Set(ruleSet.sources.map((source) => source.id));
      expect(ruleSet.sources.length, ruleSet.id).toBeGreaterThan(0);
      expect(ruleSet.officialFixtures.length, ruleSet.id).toBeGreaterThan(0);
      ruleSet.sources.forEach((source) => {
        const parsed = new URL(source.url);
        expect(parsed.protocol, source.id).toBe("https:");
        expect(officialHost(parsed.hostname), `${source.id}: ${parsed.hostname}`).toBe(true);
        expect(source.primary, source.id).toBe(true);
        expect(source.accessedAt, source.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(audits.get(source.id), source.id).toMatchObject({ reviewedBy: LEGAL_TAX_INDEPENDENT_REVIEWER });
        expect(audits.get(source.id)?.appliesToRuleIds).toContain(ruleSet.id);
      });
      collectSourceRefs(ruleSet.rules).forEach((sourceRef) => expect(ids, `${ruleSet.id}: ${sourceRef}`).toContain(sourceRef));
      ruleSet.officialFixtures.forEach((fixture) => {
        expect(ids).toContain(fixture.sourceId);
        expect(fixture.periodId).toBe(ruleSet.periodId);
      });
    });
  });

  it("blocks unreleased, suspended, expired and overdue rule sets", () => {
    const current = ALL_LEGAL_TAX_RULE_SETS[0];
    expect(evaluateRuleSetAvailability(current, "2026-08-15")).toBe("ready");
    expect(evaluateRuleSetAvailability({ ...current, status: "draft" }, "2026-08-15")).toBe("blocked");
    expect(evaluateRuleSetAvailability({ ...current, status: "independently-reviewed" }, "2026-08-15")).toBe("blocked");
    expect(evaluateRuleSetAvailability({ ...current, status: "suspended" }, "2026-08-15")).toBe("blocked");
    expect(evaluateRuleSetAvailability({ ...current, status: "expired" }, "2026-08-15")).toBe("blocked");
    expect(evaluateRuleSetAvailability({ ...current, reviewDueAt: "2026-08-14" }, "2026-08-15")).toBe("blocked");
    expect(evaluateRuleSetAvailability({ ...current, status: "historical", effectiveTo: "2026-08-14", reviewDueAt: "2027-01-01" }, "2026-08-15")).toBe("historical");
  });

  it("has no imports from the legacy Mexico engines in non-Mexico rule modules", () => {
    [
      join(root, "src", "lib", "calculators", "legal-tax", "incomeTax"),
      join(root, "src", "lib", "calculators", "legal-tax", "employment"),
    ].flatMap(sourceFiles).forEach((file) => {
      const body = readFileSync(file, "utf8");
      expect(body, file).not.toMatch(/calculators\/legal-impuestos|MEXICO_|mexicoRules|fallback.*mx/i);
    });
    const combinations = new Set(ALL_LEGAL_TAX_RULE_SETS.map((item) => `${item.marketId}:${item.id}:${item.currency}`));
    expect(combinations.size).toBe(ALL_LEGAL_TAX_RULE_SETS.length);
  });

  it("blocks high-risk copy and client-side transmission of sensitive inputs", () => {
    const runtimeFiles = [
      join(root, "src", "components", "calculators", "legal-tax"),
      join(root, "src", "lib", "calculators", "legal-tax"),
      join(root, "src", "pages", "en", "legal-tax"),
    ].flatMap(sourceFiles);
    runtimeFiles.forEach((file) => {
      const body = readFileSync(file, "utf8");
      expect(body, file).not.toMatch(/you are legally owed|official result|all taxes included|\bUS VAT\b|\blegally owed\b|\brefund\b/i);
      expect(body, file).not.toMatch(/localStorage|sessionStorage|sendBeacon|dataLayer|fetch\s*\(/);
    });
  });

  it("groups all 36 directory entries by task and country", () => {
    expect(LEGAL_TAX_MARKET_DIRECTORY_ITEMS.every((item) => item.taskGroup && item.countryLabel)).toBe(true);
    const categorySource = readFileSync(join(root, "src", "components", "pages", "LegalTaxCategoryPage.astro"), "utf8");
    expect(categorySource).toContain("VAT, GST and sales tax");
    expect(categorySource).toContain("Income tax");
    expect(categorySource).toContain("Take-home pay");
    expect(categorySource).toContain("Paid leave, final pay and redundancy");
    expect(LEGAL_TAX_MARKET_DIRECTORY_ITEMS.length + LEGACY_MEXICO_ROUTE_RECORDS.length + 1).toBe(36);
  });

  it("keeps exact employment scope in metadata and JSON-LD", () => {
    const definitions = readFileSync(join(root, "src", "lib", "calculators", "legal-tax", "employment", "variants.ts"), "utf8");
    expect(definitions).toContain('title: "Great Britain holiday entitlement calculator"');
    expect(definitions).toContain('heading: "Canada federal termination pay calculator"');
    expect(definitions).toContain('heading: "Australia NES redundancy pay calculator"');
    const component = readFileSync(join(root, "src", "components", "calculators", "legal-tax", "EmploymentCalculatorPage.astro"), "utf8");
    expect(component).toContain("spatialCoverage: envelope.rules.jurisdictionLabel");
    expect(component).toContain('aria-live="polite"');
  });
});
