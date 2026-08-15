export const LEGAL_TAX_LEGACY_REDIRECTS = {
  "/en/legal-tax/vat-calculator": "/en/legal-tax/indirect-tax-calculator",
  "/en/legal-tax/income-tax-calculator": "/en/legal-tax/mexico-income-tax-calculator",
  "/en/legal-tax/net-salary-calculator": "/en/legal-tax/mexico-net-salary-calculator",
  "/en/legal-tax/proportional-vacation-calculator": "/en/legal-tax/mexico-proportional-vacation-calculator",
  "/en/legal-tax/termination-pay-calculator": "/en/legal-tax/mexico-termination-pay-calculator",
} as const;

export const PUBLISHED_LEGAL_TAX_ROUTES = [
  "/en/legal-tax/indirect-tax-calculator",
  "/en/legal-tax/mexico-income-tax-calculator",
  "/en/legal-tax/mexico-net-salary-calculator",
  "/en/legal-tax/mexico-proportional-vacation-calculator",
  "/en/legal-tax/mexico-termination-pay-calculator",
  "/en/legal-tax/us-sales-tax-calculator",
  "/en/legal-tax/uk-vat-calculator",
  "/en/legal-tax/canada-gst-hst-calculator",
  "/en/legal-tax/australia-gst-calculator",
  "/en/legal-tax/new-zealand-gst-calculator",
  "/en/legal-tax/ireland-vat-calculator",
] as const;
