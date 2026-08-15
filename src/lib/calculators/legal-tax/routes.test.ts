import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LEGAL_TAX_LEGACY_REDIRECTS, PUBLISHED_LEGAL_TAX_ROUTES } from "./routes";

const routeFile = (route: string) => join(process.cwd(), "src", "pages", `${route.slice(1)}.astro`);

describe("legal-tax canonical route migration", () => {
  const htaccess = readFileSync(join(process.cwd(), "public", ".htaccess"), "utf8");

  it("has one direct permanent Apache redirect for every legacy route", () => {
    Object.entries(LEGAL_TAX_LEGACY_REDIRECTS).forEach(([source, target]) => {
      const escapedSource = source.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matches = htaccess.match(new RegExp(`RewriteRule \\^${escapedSource}/\\?\\$ ${target} \\[R=301,L,NE\\]`, "g"));
      expect(matches, source).toHaveLength(1);
      expect(Object.keys(LEGAL_TAX_LEGACY_REDIRECTS)).not.toContain(target);
    });
  });

  it("removes every legacy Astro source and keeps every published target", () => {
    Object.keys(LEGAL_TAX_LEGACY_REDIRECTS).forEach((route) => expect(existsSync(routeFile(route)), route).toBe(false));
    PUBLISHED_LEGAL_TAX_ROUTES.forEach((route) => expect(existsSync(routeFile(route)), route).toBe(true));
  });

  it("does not duplicate the redirect rules in the localized htaccess", () => {
    const localized = readFileSync(join(process.cwd(), "public", "en", ".htaccess"), "utf8");
    Object.keys(LEGAL_TAX_LEGACY_REDIRECTS).forEach((route) => expect(localized).not.toContain(route.slice(1)));
  });
});
