import { describe, expect, it } from "vitest";
import { getMenuItems } from "@lib/constants/menu";
import {
  getFooterLinks,
  getPrivacyPath,
  isAdConsentEnabled,
} from "./shell";

describe("localized shell configuration", () => {
  it("keeps the Spanish menu routes unchanged", () => {
    expect(getMenuItems("es")).toEqual([
      expect.objectContaining({ id: "home", name: "Inicio", slug: "/" }),
      expect.objectContaining({ id: "blog", name: "Blog", slug: "/blog" }),
      expect.objectContaining({
        id: "contact",
        name: "Contacto",
        slug: "/contacto",
      }),
    ]);
  });

  it("shows only published English navigation routes", () => {
    expect(getMenuItems("en")).toEqual([
      expect.objectContaining({ id: "home", name: "Home", slug: "/en" }),
      expect.objectContaining({ id: "blog", name: "Blog", slug: "/en/blog" }),
      expect.objectContaining({
        id: "contact",
        name: "Contact",
        slug: "/en/contact",
      }),
    ]);
  });

  it("links published English institutional pages from the footer", () => {
    expect(getFooterLinks("en").map((link) => link.href)).toEqual([
      "/en/privacy",
      "/en/contact",
      "/en/about",
      "/en/methodology",
      "/en/editorial-policy",
      "/en/corrections",
    ]);
    expect(getFooterLinks("es").map((link) => link.href)).toEqual([
      "/privacidad",
      "/contacto",
      "/acerca-de",
      "/metodologia",
      "/politica-editorial",
      "/correcciones",
    ]);
  });

  it("enables ad consent only when the locale has a privacy page", () => {
    expect(getPrivacyPath("es")).toBe("/privacidad");
    expect(getPrivacyPath("en")).toBe("/en/privacy");
    expect(isAdConsentEnabled("es")).toBe(true);
    expect(isAdConsentEnabled("en")).toBe(true);
  });
});
