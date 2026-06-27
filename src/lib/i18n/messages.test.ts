import { describe, expect, it } from "vitest";
import { LOCALES } from "./config";
import { messages, t } from "./messages";

describe("i18n messages", () => {
  it("keeps the same message keys for every locale", () => {
    const defaultKeys = Object.keys(messages.es).sort();

    LOCALES.forEach((locale) => {
      expect(Object.keys(messages[locale]).sort()).toEqual(defaultKeys);
    });
  });

  it("interpolates named params", () => {
    expect(
      t("en", "home.resultsFor", {
        count: 2,
        resultLabel: "results",
        query: "tax",
      }),
    ).toBe('2 results for "tax".');
  });

  it("localizes breadcrumb overflow text", () => {
    expect(t("es", "breadcrumbs.showIntermediate")).toBe(
      "Mostrar niveles intermedios",
    );
    expect(t("en", "breadcrumbs.showIntermediate")).toBe(
      "Show intermediate levels",
    );
  });

  it("localizes category titles", () => {
    expect(t("es", "category.title", { category: "matematicas" })).toBe(
      "Calculadoras de matematicas",
    );
    expect(t("en", "category.title", { category: "Math" })).toBe(
      "Math calculators",
    );
  });
});
