import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("attendance calculator integration", () => {
  it("keeps both public routes and their localized shared calculator", () => {
    const spanish = read(
      "src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro",
    );
    const english = read(
      "src/pages/en/math/attendance-percentage-calculator.astro",
    );

    expect(spanish).toContain('<AttendanceCalculator locale="es" />');
    expect(spanish).toContain(
      'const englishCanonical = "/en/math/attendance-percentage-calculator"',
    );
    expect(english).toContain('<AttendanceCalculator locale="en" />');
    expect(english).toContain(
      'const spanishCanonical = "/matematicas/calculadora-porcentaje-asistencia-escolar"',
    );
  });

  it("keeps SEO metadata and the required explanation in static HTML", () => {
    const spanish = read(
      "src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro",
    );
    const english = read(
      "src/pages/en/math/attendance-percentage-calculator.astro",
    );

    expect(spanish).toContain(
      'const title = "Calculadora de porcentaje de asistencia escolar"',
    );
    expect(spanish).toContain(
      'title="Calculadora de asistencia escolar"',
    );
    expect(spanish).toContain(
      'const description = "Calcula tu porcentaje de asistencia escolar y, si sabes cuántas clases quedan, estima las faltas disponibles y las asistencias necesarias."',
    );
    for (const phrase of [
      "Asistencia actual = asistidas ÷ realizadas × 100",
      "Total final = realizadas + restantes",
      "techo(total final × mínimo ÷ 100)",
      "Faltas máximas totales",
      "Faltas futuras disponibles",
      "Recuperación teórica",
      "el mínimo no está garantizado en cada punto intermedio",
    ]) {
      expect(spanish).toContain(phrase);
    }

    expect(english).toContain('const title = "School attendance percentage calculator"');
    expect(english).toContain('title="School attendance calculator"');
    for (const phrase of [
      "Current attendance = attended ÷ completed × 100",
      "Final total = completed + remaining",
      "ceiling(final total × minimum ÷ 100)",
      "Maximum total absences",
      "Future absences available",
      "Theoretical recovery",
      "the minimum is not guaranteed at every intermediate point",
    ]) {
      expect(english).toContain(phrase);
    }
    expect(english).not.toContain("Calculadora");
    expect(english).not.toContain("faltas");
    expect(english).not.toContain("¿");
  });

  it("uses one FAQ source for visible content and JSON-LD in both locales", () => {
    for (const path of [
      "src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro",
      "src/pages/en/math/attendance-percentage-calculator.astro",
    ]) {
      const page = read(path);
      expect(page.match(/\{ question:/g)?.length).toBe(8);
      expect(page).toContain("const faqJsonLd = buildFaqJsonLd(faqs)");
      expect(page).toContain("JSON.stringify(faqJsonLd)");
      expect(page).toContain("<FaqSection faqs={faqs} />");
    }
  });

  it("places the form before results and exposes accessible feedback", () => {
    const component = read("src/components/calculators/AttendanceCalculator.astro");

    const formOrder = [
      'data-field="totalClasses"',
      'data-mode-button="attended"',
      'data-field="attendedClasses"',
      'data-field="requiredPercent"',
      'data-field="remainingClasses"',
      "<aside",
    ].map((token) => component.indexOf(token));
    expect(formOrder.every((index) => index >= 0)).toBe(true);
    expect(formOrder).toEqual([...formOrder].sort((a, b) => a - b));
    expect(component).toContain('role="status"');
    expect(component).toContain('aria-live="polite"');
    expect(component).toContain("aria-describedby");
    expect(component).toContain("<noscript>");
    expect(component).toContain("data-manual-copy-text");
    expect(component).toContain("data-requires-js");
    expect(component).toContain("data-excess-detail");
    const noScriptButtons = component.match(/<button[^>]*data-requires-js[^>]*>/g) ?? [];
    expect(noScriptButtons.length).toBeGreaterThan(0);
    expect(noScriptButtons.every((button) => button.includes("disabled"))).toBe(true);
  });

  it("scopes selectors and checks the legacy clipboard result", () => {
    const controller = read(
      "src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-controller.ts",
    );

    expect(controller).toContain("root.querySelector");
    expect(controller).toContain('copied = document.execCommand("copy")');
    expect(controller).toContain(
      "version === resultVersion && summary === currentSummary",
    );
    expect(controller).toContain('button.removeAttribute("disabled")');
    expect(controller).toContain('manualCopy.classList.remove("hidden")');
    expect(controller).toContain("textarea.remove()");
    expect(controller).toContain("restoreFocus?.focus()");
  });
});
