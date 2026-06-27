import { describe, expect, it } from "vitest";
import {
  buildAlternateLinks,
  buildCanonicalUrl,
  getLocaleFromPathname,
  normalizePath,
  prefixLocalePath,
} from "./routing";

const site = "https://calculadoras.tools";

describe("i18n routing helpers", () => {
  it("detects the locale from the pathname", () => {
    expect(getLocaleFromPathname("/")).toBe("es");
    expect(getLocaleFromPathname("/matematicas")).toBe("es");
    expect(getLocaleFromPathname("/en")).toBe("en");
    expect(getLocaleFromPathname("/en/math")).toBe("en");
  });

  it("normalizes paths without trailing slashes except for root", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/en/")).toBe("/en");
    expect(normalizePath("en/math/")).toBe("/en/math");
  });

  it("prefixes locale paths while keeping Spanish at the root", () => {
    expect(prefixLocalePath("es", "/matematicas")).toBe("/matematicas");
    expect(prefixLocalePath("en", "/math")).toBe("/en/math");
    expect(prefixLocalePath("en", "/")).toBe("/en");
  });

  it("keeps English pilot paths without trailing slashes", () => {
    expect(prefixLocalePath("en", "/")).toBe("/en");
    expect(prefixLocalePath("en", "/math/")).toBe("/en/math");
  });

  it("builds absolute canonical URLs without trailing slashes", () => {
    expect(buildCanonicalUrl("/en/math/", site)).toBe(
      "https://calculadoras.tools/en/math",
    );
    expect(buildCanonicalUrl("/", site)).toBe("https://calculadoras.tools/");
  });

  it("builds alternates for published locale paths and x-default", () => {
    expect(
      buildAlternateLinks({ es: "/matematicas", en: "/en/math" }, site),
    ).toEqual([
      {
        locale: "es",
        hreflang: "es-MX",
        href: "https://calculadoras.tools/matematicas",
      },
      {
        locale: "en",
        hreflang: "en",
        href: "https://calculadoras.tools/en/math",
      },
      {
        locale: "x-default",
        hreflang: "x-default",
        href: "https://calculadoras.tools/matematicas",
      },
    ]);
  });

  it("omits alternates for locales without a published path", () => {
    expect(buildAlternateLinks({ es: "/matematicas" }, site)).toEqual([
      {
        locale: "es",
        hreflang: "es-MX",
        href: "https://calculadoras.tools/matematicas",
      },
      {
        locale: "x-default",
        hreflang: "x-default",
        href: "https://calculadoras.tools/matematicas",
      },
    ]);
  });
});
