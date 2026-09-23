import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("attendance calculator source contracts", () => {
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
      'const description = "Calcula tu porcentaje de asistencia escolar y, si conoces las clases restantes o el total del curso, estima las faltas disponibles y las asistencias necesarias."',
    );
    for (const phrase of [
      "Asistencia actual = asistidas ÷ clases impartidas hasta hoy × 100",
      "Total del curso = impartidas hasta hoy + restantes; si conoces el total, restantes = total del curso − impartidas hasta hoy",
      "techo(total del curso × mínimo ÷ 100)",
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
      "Current attendance = attended ÷ classes held so far × 100",
      "Course total = held so far + remaining; if you know the total, remaining = course total − held so far",
      "ceiling(course total × minimum ÷ 100)",
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

  it("keeps form order and accessibility hooks in the component source", () => {
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
    expect(component).toContain('excess: "Excedente de faltas"');
    expect(component).toContain('excess: "Excess absences"');
    expect(component).toContain("attended-help");
    expect(component).toContain("absences-help");
    expect(component).toContain("0 a 100 con hasta 4 decimales");
    expect(component).toContain("0 to 100 with up to 4 decimals");
    expect(component).toContain('data-field="totalClasses"');
    expect(component).toContain('data-field="requiredPercent"');
    expect(component).toContain('data-field="remainingClasses"');
    expect(component).toContain('for={`${prefix}-total`}');
    expect(component).toContain('for={`${prefix}-minimum`}');
    expect(component).toContain('for={`${prefix}-remaining`}');
    expect(component).toContain("min-h-11");
    const noScriptButtons = component.match(/<button[^>]*data-requires-js[^>]*>/g) ?? [];
    expect(noScriptButtons.length).toBeGreaterThan(0);
    expect(noScriptButtons.every((button) => button.includes("disabled"))).toBe(true);
  });

  it("scopes selectors and binds asynchronous copy to the active context", () => {
    const controller = read(
      "src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-controller.ts",
    );

    expect(controller).toContain("root.querySelector");
    expect(controller).toContain('copied = document.execCommand("copy")');
    expect(controller).toContain("current.version === version && current.summary === summary");
    expect(controller).toContain("getAttendanceContext(root)");
    expect(controller).not.toContain("currentSummary");
    expect(controller).not.toContain("currentResult");
    expect(controller).not.toContain("calculateAttendance(");
    expect(controller).toContain('button.removeAttribute("disabled")');
    expect(controller).toContain('manualCopy.classList.remove("hidden")');
    expect(controller).toContain('manualCopyText.focus()');
    expect(controller).toContain('setStatus(text.copyFailed, "error", false)');
    expect(controller).toContain("textarea.remove()");
    expect(controller).toContain("restoreFocus?.focus()");
    expect(controller).toContain('input.setAttribute("aria-invalid", "true")');
    expect(controller).toContain('field("totalClasses")?.focus()');
    expect(controller).toContain('setStatus(text.cleared, "success")');
    expect(controller).toContain('if (root.dataset.initialized === "true") return');
  });

  it("shares one versioned result context across display, copy, history and CSV", () => {
    const context = read(
      "src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-context.ts",
    );
    const base = read(
      "src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-controller.ts",
    );
    const phase2 = read(
      "src/lib/calculators/matematicas/calculadora-porcentaje-asistencia-escolar/attendance-phase2-controller.ts",
    );

    expect(context).toContain("version: number");
    expect(context).toContain("result: PolicyAttendanceResult | null");
    expect(context).toContain("presentation: AttendanceContextPresentation | null");
    expect(context).toContain("summary: string | null");
    expect(context).toContain("invalidateAttendanceContext");
    expect(base).toContain("invalidateAttendanceContext(root)");
    expect(phase2).toContain("publishAttendanceContext(root");
    expect(phase2).toContain("renderPhase2Result(context)");
    expect(phase2).toContain("renderBaseResult(presentation.result, context)");
    expect(phase2).toContain("getAttendanceContext(root)");
    expect(phase2).not.toContain("let currentResult:");
    expect(phase2).not.toContain("let currentSummary");
    expect(phase2).toContain("policyAttendanceToCsvRow(context.subject.name, context.source, context.result)");
    expect(phase2).toContain("result: context.result");
    expect(phase2).toContain("draft.summary = presentation ? buildSummary(draft) : null");
    expect(phase2).toContain("const baseResult = source === \"manual\" && isDefaultPolicy(result.policy)");
    expect(phase2).toContain("if (syncing) return;");
  });

  it("keeps the acceptance paths and localization boundaries intact", () => {
    const spanish = read(
      "src/pages/matematicas/calculadora-porcentaje-asistencia-escolar.astro",
    );
    const english = read(
      "src/pages/en/math/attendance-percentage-calculator.astro",
    );

    expect(spanish).toContain("buildAlternateLinks({ es: canonical, en: englishCanonical }");
    expect(english).toContain("buildAlternateLinks({ es: spanishCanonical, en: canonical }");
    expect(spanish).toContain('breadcrumbs={[{ label: "Inicio"');
    expect(english).toContain('breadcrumbs={[{ label: "Home"');
    expect(english).not.toMatch(/\b(Calculadora|faltas|asistencias|mínimo)\b/);
    expect(spanish).not.toContain("MVP");
    expect(english).not.toContain("MVP");
  });
});
