import type { LegalSource, MarketId, RuleSetEnvelope } from "../types";

export type IndirectTaxSystem = "vat" | "gst" | "gst-hst" | "sales-tax" | "iva";
export type IndirectTaxClassification = "standard" | "reduced" | "zero";

export interface IndirectTaxRate {
  id: string;
  label: string;
  value: number;
  classification: IndirectTaxClassification;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceRefs: string[];
}

export interface IndirectTaxComponentRule {
  id: string;
  label: string;
  authorityLevel: "national" | "state" | "province" | "local";
  calculation: "additive" | "compound";
  rates: IndirectTaxRate[];
}

export interface IndirectTaxRuleSet {
  system: IndirectTaxSystem;
  jurisdictionLabel: string;
  placeOfSupplyRequired: boolean;
  transactionScope: string;
  components: IndirectTaxComponentRule[];
  excludedComponents: string[];
  allowManualAdditionalRate: boolean;
  officialHelpUrl: string;
}

const accessedAt = "2026-08-15";
const rounding = { mode: "half-up", precision: 2, stage: "component" } as const;

const source = (value: Omit<LegalSource, "accessedAt" | "primary">): LegalSource => ({
  ...value,
  accessedAt,
  primary: true,
});

const makeEnvelope = (
  definition: Omit<RuleSetEnvelope<IndirectTaxRuleSet>, "familyId" | "publishedAt" | "reviewedAt" | "reviewDueAt" | "status" | "rounding" | "officialFixtures">,
): RuleSetEnvelope<IndirectTaxRuleSet> => ({
  ...definition,
  familyId: "indirect-tax",
  publishedAt: "2026-08-15",
  reviewedAt: "2026-08-15",
  reviewDueAt: "2026-11-30",
  status: "current",
  rounding,
  officialFixtures: [{
    id: `${definition.id}-published-rate-arithmetic`,
    sourceId: definition.sources[0].id,
    periodId: definition.periodId,
    description: "Independent arithmetic fixture derived from the authority's published rate.",
  }],
});

const rate = (
  id: string,
  label: string,
  percent: number,
  classification: IndirectTaxClassification,
  sourceId: string,
  effectiveFrom = "2026-01-01",
): IndirectTaxRate => ({ id, label, value: percent / 100, classification, effectiveFrom, sourceRefs: [sourceId] });

const caSource = source({
  id: "ca-cra-gst-hst-2026",
  authority: "Canada Revenue Agency",
  title: "Charge and collect the GST/HST",
  url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html",
  sourceVersion: "Page updated 2026-04-08",
  effectiveFrom: "2026-01-01",
  appliesTo: ["gst", "hst", "place-of-supply"],
});

const caRuleSet = (
  jurisdictionCode: string,
  jurisdictionLabel: string,
  taxId: "gst" | "hst",
  percent: number,
  excludedComponents: string[] = [],
) => makeEnvelope({
  id: `ca-${jurisdictionCode.slice(3).toLowerCase()}-${taxId}-2026`,
  marketId: "ca",
  countryCode: "CA",
  jurisdictionCode,
  regimeId: "domestic-simple-supply",
  periodId: "2026",
  currency: "CAD",
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  coverage: excludedComponents.length ? "partial" : "complete",
  missingConcepts: excludedComponents,
  assumptions: ["The user has already determined the place and type of supply.", "The selected supply is taxable at the chosen rate."],
  sources: [caSource],
  rules: {
    system: "gst-hst",
    jurisdictionLabel,
    placeOfSupplyRequired: true,
    transactionScope: "Simple domestic taxable supply; classification and special cases are not determined.",
    components: [{
      id: taxId,
      label: taxId === "hst" ? "HST" : "GST",
      authorityLevel: "national",
      calculation: "additive",
      rates: [
        rate(`${taxId}-standard`, `${taxId.toUpperCase()} ${percent}%`, percent, "standard", caSource.id),
        rate(`${taxId}-zero`, "Zero-rated supply 0%", 0, "zero", caSource.id),
      ],
    }],
    excludedComponents,
    allowManualAdditionalRate: false,
    officialHelpUrl: caSource.url,
  },
});

export const INDIRECT_TAX_RULE_SETS: RuleSetEnvelope<IndirectTaxRuleSet>[] = [
  makeEnvelope({
    id: "us-ca-sales-tax-2026-h2",
    marketId: "us",
    countryCode: "US",
    jurisdictionCode: "US-CA",
    regimeId: "domestic-simple-sale",
    periodId: "2026-H2",
    currency: "USD",
    effectiveFrom: "2026-07-01",
    effectiveTo: "2026-12-31",
    coverage: "partial",
    missingConcepts: ["California district tax determined by address", "Other US states and localities", "Product taxability"],
    assumptions: ["The sale is taxable in California.", "The 7.25% statewide rate applies before any district tax."],
    sources: [
      source({ id: "us-ca-cdtfa-sales-tax-2026-h2", authority: "California Department of Tax and Fee Administration", title: "California City & County Sales & Use Tax Rate Information", url: "https://cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates.htm", sourceVersion: "Rates effective July 1, 2026", effectiveFrom: "2026-07-01", appliesTo: ["california-statewide-rate", "district-rate-warning"] }),
      source({ id: "us-usa-gov-state-taxes-2025", authority: "USAGov", title: "How to pay and get help with state and local taxes", url: "https://www.usa.gov/state-taxes", sourceVersion: "Updated 2025-12-11", appliesTo: ["no-national-rate", "state-local-variation"] }),
    ],
    rules: {
      system: "sales-tax",
      jurisdictionLabel: "California — statewide base only",
      placeOfSupplyRequired: true,
      transactionScope: "California taxable sale; district rate must be looked up by address and entered separately.",
      components: [{ id: "ca-statewide", label: "California statewide sales and use tax", authorityLevel: "state", calculation: "additive", rates: [rate("ca-statewide-standard", "Statewide base 7.25%", 7.25, "standard", "us-ca-cdtfa-sales-tax-2026-h2", "2026-07-01")] }],
      excludedComponents: ["District tax unless entered manually", "Product-specific exemptions and rates"],
      allowManualAdditionalRate: true,
      officialHelpUrl: "https://maps.cdtfa.ca.gov/",
    },
  }),
  makeEnvelope({
    id: "gb-vat-2026",
    marketId: "gb",
    countryCode: "GB",
    jurisdictionCode: "GB-VAT",
    regimeId: "domestic-simple-supply",
    periodId: "2026",
    currency: "GBP",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    coverage: "complete",
    missingConcepts: [],
    assumptions: ["The user selects the legally applicable classification.", "Northern Ireland and cross-border special rules are outside scope."],
    sources: [source({ id: "gb-hmrc-vat-rates", authority: "HM Revenue & Customs", title: "VAT rates", url: "https://www.gov.uk/vat-rates", effectiveFrom: "2011-01-04", appliesTo: ["vat-standard", "vat-reduced", "vat-zero"] })],
    rules: {
      system: "vat",
      jurisdictionLabel: "United Kingdom — domestic simple supply",
      placeOfSupplyRequired: false,
      transactionScope: "Domestic simple supply; the calculator does not classify goods or services.",
      components: [{ id: "vat", label: "VAT", authorityLevel: "national", calculation: "additive", rates: [rate("vat-standard", "Standard 20%", 20, "standard", "gb-hmrc-vat-rates"), rate("vat-reduced", "Reduced 5%", 5, "reduced", "gb-hmrc-vat-rates"), rate("vat-zero", "Zero rate 0%", 0, "zero", "gb-hmrc-vat-rates")] }],
      excludedComponents: ["Exempt supplies", "Northern Ireland and cross-border special rules"],
      allowManualAdditionalRate: false,
      officialHelpUrl: "https://www.gov.uk/vat-rates",
    },
  }),
  caRuleSet("CA-AB", "Alberta", "gst", 5),
  caRuleSet("CA-BC", "British Columbia", "gst", 5, ["British Columbia PST"]),
  caRuleSet("CA-MB", "Manitoba", "gst", 5, ["Manitoba RST"]),
  caRuleSet("CA-NB", "New Brunswick", "hst", 15),
  caRuleSet("CA-NL", "Newfoundland and Labrador", "hst", 15),
  caRuleSet("CA-NS", "Nova Scotia", "hst", 14),
  caRuleSet("CA-NT", "Northwest Territories", "gst", 5),
  caRuleSet("CA-NU", "Nunavut", "gst", 5),
  caRuleSet("CA-ON", "Ontario", "hst", 13),
  caRuleSet("CA-PE", "Prince Edward Island", "hst", 15),
  caRuleSet("CA-QC", "Quebec", "gst", 5, ["Quebec QST"]),
  caRuleSet("CA-SK", "Saskatchewan", "gst", 5, ["Saskatchewan PST"]),
  caRuleSet("CA-YT", "Yukon", "gst", 5),
  makeEnvelope({
    id: "au-gst-2026",
    marketId: "au",
    countryCode: "AU",
    jurisdictionCode: "AU-GST",
    regimeId: "domestic-simple-supply",
    periodId: "2026",
    currency: "AUD",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    coverage: "complete",
    missingConcepts: [],
    assumptions: ["The user determines whether the sale is taxable or GST-free."],
    sources: [source({ id: "au-ato-gst-act-9-75", authority: "Australian Taxation Office", title: "A New Tax System (Goods and Services Tax) Act 1999 — section 9-75", url: "https://www.ato.gov.au/law/view/document?locid=%27PAC%2F19990055%2F9-75%281%29%27", appliesTo: ["gst-standard", "gst-inclusive-formula"] })],
    rules: {
      system: "gst",
      jurisdictionLabel: "Australia — domestic simple supply",
      placeOfSupplyRequired: false,
      transactionScope: "Domestic simple supply; the calculator does not determine whether a sale is GST-free or input taxed.",
      components: [{ id: "gst", label: "GST", authorityLevel: "national", calculation: "additive", rates: [rate("gst-standard", "Taxable sale 10%", 10, "standard", "au-ato-gst-act-9-75"), rate("gst-zero", "GST-free 0%", 0, "zero", "au-ato-gst-act-9-75")] }],
      excludedComponents: ["Input-taxed sales", "Registration and tax credits"],
      allowManualAdditionalRate: false,
      officialHelpUrl: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst",
    },
  }),
  makeEnvelope({
    id: "nz-gst-2026-27",
    marketId: "nz",
    countryCode: "NZ",
    jurisdictionCode: "NZ-GST",
    regimeId: "domestic-simple-supply",
    periodId: "2026-27",
    currency: "NZD",
    effectiveFrom: "2026-04-01",
    effectiveTo: "2027-03-31",
    coverage: "complete",
    missingConcepts: [],
    assumptions: ["The user determines whether the supply is standard-rated, zero-rated or exempt."],
    sources: [source({ id: "nz-ird-charging-gst-2026", authority: "Inland Revenue", title: "Charging GST", url: "https://www.ird.govt.nz/gst/charging-gst", sourceVersion: "Updated 2026-04-01", effectiveFrom: "2026-04-01", appliesTo: ["gst-standard", "gst-zero", "gst-inclusive-formula"] })],
    rules: {
      system: "gst",
      jurisdictionLabel: "New Zealand — domestic simple supply",
      placeOfSupplyRequired: false,
      transactionScope: "Domestic simple supply; exempt and special supplies are not calculated.",
      components: [{ id: "gst", label: "GST", authorityLevel: "national", calculation: "additive", rates: [rate("gst-standard", "Standard 15%", 15, "standard", "nz-ird-charging-gst-2026", "2026-04-01"), rate("gst-zero", "Zero-rated 0%", 0, "zero", "nz-ird-charging-gst-2026", "2026-04-01")] }],
      excludedComponents: ["Exempt and special supplies"],
      allowManualAdditionalRate: false,
      officialHelpUrl: "https://www.ird.govt.nz/gst/charging-gst",
    },
  }),
  makeEnvelope({
    id: "ie-vat-2026",
    marketId: "ie",
    countryCode: "IE",
    jurisdictionCode: "IE-VAT",
    regimeId: "domestic-simple-supply",
    periodId: "2026",
    currency: "EUR",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    coverage: "complete",
    missingConcepts: [],
    assumptions: ["The user selects the legally applicable VAT category."],
    sources: [source({ id: "ie-revenue-vat-rates-2026", authority: "Revenue", title: "What are VAT rates?", url: "https://www.revenue.ie/en/vat/vat-rates/what-are-vat-rates/index.aspx", sourceVersion: "Published 2026-05-26", appliesTo: ["vat-standard", "vat-reduced", "vat-second-reduced", "vat-livestock", "vat-zero"] })],
    rules: {
      system: "vat",
      jurisdictionLabel: "Ireland — domestic simple supply",
      placeOfSupplyRequired: false,
      transactionScope: "Domestic simple supply; the calculator does not classify the item or determine exemptions.",
      components: [{ id: "vat", label: "VAT", authorityLevel: "national", calculation: "additive", rates: [rate("vat-standard", "Standard 23%", 23, "standard", "ie-revenue-vat-rates-2026"), rate("vat-reduced", "Reduced 13.5%", 13.5, "reduced", "ie-revenue-vat-rates-2026"), rate("vat-second-reduced", "Second reduced 9%", 9, "reduced", "ie-revenue-vat-rates-2026"), rate("vat-livestock", "Livestock 4.8%", 4.8, "reduced", "ie-revenue-vat-rates-2026"), rate("vat-zero", "Zero rate 0%", 0, "zero", "ie-revenue-vat-rates-2026")] }],
      excludedComponents: ["Exempt supplies", "Flat-rate farmer addition"],
      allowManualAdditionalRate: false,
      officialHelpUrl: "https://www.revenue.ie/en/vat/vat-rates/what-are-vat-rates/index.aspx",
    },
  }),
  makeEnvelope({
    id: "mx-iva-2026",
    marketId: "mx-en",
    countryCode: "MX",
    jurisdictionCode: "MX-IVA",
    regimeId: "domestic-simple-supply",
    periodId: "2026",
    currency: "MXN",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    coverage: "partial",
    missingConcepts: ["Eligibility for the border-region tax credit", "Exempt activities and withholding"],
    assumptions: ["The user selects the legally applicable IVA treatment."],
    sources: [
      source({ id: "mx-sat-iva-article-1", authority: "Servicio de Administración Tributaria", title: "Ley del IVA — Artículo 1", url: "https://wwwmat.sat.gob.mx/articulo/19848/articulo-1", appliesTo: ["iva-standard"] }),
      source({ id: "mx-sat-border-iva", authority: "Servicio de Administración Tributaria", title: "Estímulos fiscales para la región fronteriza — IVA", url: "https://www.sat.gob.mx/minisitio/EstimulosFiscalesFronteraNorteSur/region_fronteriza_norte_iva/en_que_consiste.html", sourceVersion: "Decrees updated through 2025-12-31", appliesTo: ["iva-border"] }),
    ],
    rules: {
      system: "iva",
      jurisdictionLabel: "Mexico — domestic simple transaction",
      placeOfSupplyRequired: false,
      transactionScope: "Simple domestic transaction; the user must confirm whether a zero rate or border-region credit applies.",
      components: [{ id: "iva", label: "IVA", authorityLevel: "national", calculation: "additive", rates: [rate("iva-standard", "Standard 16%", 16, "standard", "mx-sat-iva-article-1"), rate("iva-border", "Border-region credit resulting in 8%", 8, "reduced", "mx-sat-border-iva"), rate("iva-zero", "Zero rate 0%", 0, "zero", "mx-sat-iva-article-1")] }],
      excludedComponents: ["Eligibility determination", "Exempt activities and withholding"],
      allowManualAdditionalRate: false,
      officialHelpUrl: "https://wwwmat.sat.gob.mx/articulo/19848/articulo-1",
    },
  }),
];

export const INDIRECT_TAX_MARKET_ORDER: MarketId[] = ["us", "gb", "ca", "au", "nz", "ie", "mx-en"];
