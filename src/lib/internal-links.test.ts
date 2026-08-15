import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const sourcePaths = [
  join(process.cwd(), "src", "components"),
  join(process.cwd(), "src", "content"),
  join(process.cwd(), "src", "pages"),
  join(process.cwd(), "src", "lib", "constants", "calculators.ts"),
  join(process.cwd(), "src", "lib", "constants", "menu.ts"),
  join(process.cwd(), "src", "lib", "i18n"),
];

const supportedExtensions = new Set([".astro", ".md", ".ts"]);
const localizedPilotRoutes = [
  "/en",
  "/en/math",
  "/en/math/percentage-calculator",
  "/en/math/rule-of-three-calculator",
  "/en/math/gcd-lcm-calculator",
  "/en/math/quadratic-equation-calculator",
  "/en/math/linear-system-2x2-calculator",
  "/en/math/basic-statistics-calculator",
  "/en/math/gpa-calculator",
  "/en/math/minimum-grade-calculator",
  "/en/math/weighted-grade-calculator",
  "/en/math/study-hours-calculator",
  "/en/math/attendance-percentage-calculator",
  "/en/blog",
  "/en/blog/math",
  "/en/blog/math/how-to-calculate-percentages",
  "/en/about",
  "/en/contact",
  "/en/corrections",
  "/en/methodology",
  "/en/editorial-policy",
  "/en/privacy",
  "/en/notices/financial-tax",
  "/en/notices/health",
  "/en/finance",
  "/en/finance/compound-interest-calculator",
  "/en/finance/inflation-purchasing-power-calculator",
  "/en/finance/simple-interest-calculator",
  "/en/finance/loan-calculator",
  "/en/finance/debt-payoff-calculator",
  "/en/finance/savings-goal-calculator",
  "/en/finance/roi-calculator",
  "/en/finance/margin-markup-calculator",
  "/en/finance/break-even-calculator",
  "/en/finance/freelance-hourly-rate-calculator",
  "/en/finance/freelance-project-pricing-calculator",
  "/en/finance/dca-average-cost-calculator",
  "/en/real-estate",
  "/en/real-estate/mortgage-calculator",
  "/en/real-estate/home-affordability-calculator",
  "/en/real-estate/rent-vs-buy-calculator",
  "/en/real-estate/cap-rate-calculator",
  "/en/real-estate/closing-costs-calculator",
  "/en/real-estate/property-appreciation-calculator",
  "/en/real-estate/price-per-area-calculator",
  "/en/legal-tax",
  "/en/legal-tax/vat-calculator",
  "/en/legal-tax/income-tax-calculator",
  "/en/legal-tax/net-salary-calculator",
  "/en/probability-statistics",
  "/en/programming",
  "/en/geometry",
  "/en/geometry/area-perimeter-calculator",
  "/en/geometry/pythagorean-theorem-calculator",
  "/en/health",
  "/en/health/bmi-calculator",
  "/en/health/body-fat-percentage-calculator",
  "/en/health/tdee-calculator",
  "/en/health/exercise-calories-burned-calculator",
  "/en/health/macro-calculator",
  "/en/health/daily-protein-calculator",
  "/en/health/calorie-deficit-calculator",
  "/en/health/pregnancy-due-date-calculator",
  "/en/health/ovulation-calculator",
  "/en/health/maximum-heart-rate-calculator",
  "/en/health/heart-rate-zones-calculator",
  "/en/health/daily-water-intake-calculator",
  "/en/health/one-rep-max-calculator",
  "/en/health/vo2-max-calculator",
  "/en/health/running-pace-calculator",
  "/en/health/race-time-predictor",
  "/en/date-time",
  "/en/date-time/age-calculator",
  "/en/date-time/date-difference-calculator",
  "/en/date-time/deadline-countdown-calculator",
  "/en/date-time/work-hours-calculator",
  "/en/date-time/pomodoro-timer",
  "/en/date-time/meeting-cost-calculator",
  "/en/date-time/reading-time-calculator",
  "/en/converters",
  "/en/converters/area-converter",
  "/en/converters/weight-converter",
  "/en/converters/temperature-converter",
  "/en/converters/volume-converter",
  "/en/converters/clothing-size-converter",
  "/en/converters/kilometers-to-miles",
  "/en/converters/liters-to-gallons",
  "/en/pets",
  "/en/pets/pet-age-calculator",
  "/en/pets/pet-calorie-calculator",
  "/en/cooking",
  "/en/cooking/cooking-measurement-converter",
  "/en/cooking/oven-temperature-converter",
  "/en/cooking/cooking-time-by-weight-calculator",
  "/en/cooking/recipe-scaler",
  "/en/events",
  "/en/events/wedding-budget-calculator",
  "/en/events/event-cost-per-person-calculator",
  "/en/restaurants",
  "/en/vehicles",
  "/en/construction",
  "/en/construction/concrete-volume-calculator",
  "/en/construction/brick-calculator",
  "/en/construction/tile-calculator",
  "/en/construction/renovation-budget-calculator",
  "/en/construction/paint-calculator",
  "/en/blog/converters",
  "/en/blog/converters/how-to-convert-kilometers-to-miles",
  "/en/blog/converters/how-to-convert-kilometers-to-miles-in-excel",
  "/en/blog/converters/kilometers-vs-miles",
  "/en/blog/converters/statute-mile-vs-nautical-mile",
  "/en/blog/converters/pace-per-kilometer-vs-mile",
  "/en/blog/converters/kilometers-to-miles-table",
  "/en/blog/finance",
  "/en/blog/real-estate",
  "/en/blog/legal-tax",
  "/en/blog/health",
];
const unpublishedEnglishRoutes = new Set([
  "/en/blog/pagina",
]);
const internalLinkPatterns = [
  /\bhref\s*=\s*["'](\/[^"']*)["']/g,
  /\b(?:href|relatedHref|slug):\s*["'](\/[^"']*)["']/g,
  /\bcanonical\s*[:=]\s*["'](\/[^"']*)["']/g,
  /\]\((\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  /new URL\(\s*["'](\/[^"']*)["']/g,
];

const getSourceFiles = (path: string): string[] => {
  if (!statSync(path).isDirectory()) {
    return [path];
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name);

    if (entry.isDirectory()) {
      return getSourceFiles(entryPath);
    }

    return supportedExtensions.has(extname(entry.name)) ? [entryPath] : [];
  });
};

const hasTrailingSlash = (url: string) => {
  const path = url.split(/[?#]/, 1)[0];

  return path !== "/" && path.endsWith("/") && !extname(path);
};

const isUnpublishedEnglishRoute = (url: string) => {
  const path = url.split(/[?#]/, 1)[0];

  return [...unpublishedEnglishRoutes].some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
};

const collectInternalLinks = () =>
  sourcePaths.flatMap(getSourceFiles).flatMap((filePath) => {
    const content = readFileSync(filePath, "utf8");

    return internalLinkPatterns.flatMap((pattern) =>
      Array.from(content.matchAll(pattern)).map((match) => ({
        filePath,
        url: match[1],
      })),
    );
  });

describe("internal links", () => {
  it("points literal page links to URLs without trailing slashes", () => {
    const violations = collectInternalLinks()
      .filter(({ url }) => hasTrailingSlash(url))
      .map(
        ({ filePath, url }) =>
          `${relative(process.cwd(), filePath)}: remove trailing slash from ${url}`,
      );

    expect(violations).toEqual([]);
  });

  it("keeps localized pilot routes canonical without trailing slashes", () => {
    localizedPilotRoutes.forEach((route) => {
      expect(hasTrailingSlash(route)).toBe(false);
    });
  });

  it("does not link to unpublished English routes", () => {
    const violations = collectInternalLinks()
      .filter(({ url }) => isUnpublishedEnglishRoute(url))
      .map(
        ({ filePath, url }) =>
          `${relative(process.cwd(), filePath)}: remove unpublished English link ${url}`,
      );

    expect(violations).toEqual([]);
  });
});
