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
    ]);
    expect(getMenuItems("en").map((item) => item.id)).not.toContain("blog");
    expect(getMenuItems("en").map((item) => item.id)).not.toContain(
      "contact",
    );
  });

  it("keeps English footer links empty until localized legal pages exist", () => {
    expect(getFooterLinks("en")).toEqual([]);
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
    expect(getPrivacyPath("en")).toBeNull();
    expect(isAdConsentEnabled("es")).toBe(true);
    expect(isAdConsentEnabled("en")).toBe(false);
  });
});
