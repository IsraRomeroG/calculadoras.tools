import * as es from "./attendance";
import * as en from "./attendance.en";
import type { AttendanceInputMode, AttendancePercent } from "./attendance-core";
import type { AttendanceResult } from "./attendance-presenter";

type Locale = "es" | "en";
type FieldName =
  | "totalClasses"
  | "requiredPercent"
  | "attendedClasses"
  | "absences"
  | "remainingClasses";

const TEXT = {
  es: {
    integer: {
      required: "Campo obligatorio.",
      invalid: "Usa un entero entre 0 y 1000.",
      negative: "No se permiten valores negativos.",
      zero: "Usa un entero entre 1 y 1000.",
      too_large: "Usa un entero entre 0 y 1000.",
    },
    percent: {
      required: "Campo obligatorio.",
      invalid: "Usa un porcentaje de 0 a 100 con hasta 4 decimales. Escribe 0.5 en lugar de .5.",
      negative: "No se permiten porcentajes negativos.",
      too_large: "El porcentaje no puede superar 100.",
      too_many_decimals: "Usa un porcentaje de 0 a 100 con hasta 4 decimales.",
    },
    totalRange: "Usa un entero entre 1 y 1000.",
    remainingRange: "Usa un entero entre 0 y 1000.",
    tooManyAttended: (total: number) => `Las asistencias no pueden superar las ${total} clases realizadas.`,
    tooManyAbsences: (total: number) => `Las faltas no pueden superar las ${total} clases realizadas.`,
    incomplete: "Completa los campos obligatorios con valores válidos.",
    remainingInvalid: "Revisa las clases restantes.",
    updated: "Resultado actualizado.",
    example: "Ejemplo cargado.",
    cleared: "Formulario limpio.",
    copied: "Resumen copiado.",
    copyFailed: "No se pudo copiar automáticamente.",
    noSummary: "No hay un resumen válido para copiar.",
    unknown: "No indicadas",
  },
  en: {
    integer: {
      required: "This field is required.",
      invalid: "Use a whole number from 0 to 1000.",
      negative: "Negative values are not allowed.",
      zero: "Use a whole number from 1 to 1000.",
      too_large: "Use a whole number from 0 to 1000.",
    },
    percent: {
      required: "This field is required.",
      invalid: "Use a percentage from 0 to 100 with up to 4 decimals. Write 0.5 instead of .5.",
      negative: "Negative percentages are not allowed.",
      too_large: "The percentage cannot exceed 100.",
      too_many_decimals: "Use a percentage from 0 to 100 with up to 4 decimals.",
    },
    totalRange: "Use a whole number from 1 to 1000.",
    remainingRange: "Use a whole number from 0 to 1000.",
    tooManyAttended: (total: number) => `Attendances cannot exceed the ${total} completed classes.`,
    tooManyAbsences: (total: number) => `Absences cannot exceed the ${total} completed classes.`,
    incomplete: "Complete the required fields with valid values.",
    remainingInvalid: "Check the remaining classes.",
    updated: "Result updated.",
    example: "Example loaded.",
    cleared: "Form cleared.",
    copied: "Summary copied.",
    copyFailed: "Could not copy automatically.",
    noSummary: "There is no valid summary to copy.",
    unknown: "Not provided",
  },
} as const;

export function initAttendanceCalculators(): void {
  document
    .querySelectorAll<HTMLElement>("[data-attendance-calculator]")
    .forEach((root) => {
      if (root.dataset.initialized === "true") return;
      root.dataset.initialized = "true";
      initAttendanceCalculator(root);
    });
}

function initAttendanceCalculator(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === "en" ? "en" : "es";
  const adapter = locale === "es" ? es : en;
  const text = TEXT[locale];
  let mode: AttendanceInputMode = "attended";
  let currentSummary = "";
  let currentResult: AttendanceResult | null = null;
  let resultVersion = 0;
  let statusTimer = 0;

  const query = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const queryAll = <T extends Element>(selector: string) =>
    Array.from(root.querySelectorAll<T>(selector));
  const field = (name: FieldName) =>
    query<HTMLInputElement>(`[data-field="${name}"]`);
  const value = (name: FieldName) => field(name)?.value ?? "";
  const setValue = (name: FieldName, nextValue: string) => {
    const input = field(name);
    if (input) input.value = nextValue;
  };

  const modeButtons = queryAll<HTMLButtonElement>("[data-mode-button]");
  const copyButton = query<HTMLButtonElement>("[data-copy-summary]");
  const clearButton = query<HTMLButtonElement>("[data-clear]");
  const status = query<HTMLElement>("[data-action-status]");
  const initialResult = query<HTMLElement>("[data-initial-result]");
  const results = query<HTMLElement>("[data-results]");
  const manualCopy = query<HTMLElement>("[data-manual-copy]");
  const manualCopyText = query<HTMLTextAreaElement>("[data-manual-copy-text]");

  function updateCalculator(announce = false): void {
    resultVersion += 1;
    clearStatus();
    hideManualCopy();
    updateModeUi();
    const parsed = readInput();

    if (!parsed.ok) {
      currentResult = null;
      currentSummary = "";
      showInitial(parsed.message);
      copyButton?.setAttribute("disabled", "");
      return;
    }

    try {
      const result = adapter.calculateAttendance(parsed.input);
      currentResult = result;
      currentSummary = adapter.buildAttendanceSummary(result);
      renderResult(result);
      copyButton?.removeAttribute("disabled");
      syncAlternateField(result);
      if (announce) setStatus(text.updated, "success");
    } catch (error) {
      currentResult = null;
      currentSummary = "";
      showInitial(error instanceof Error ? error.message : text.incomplete);
      copyButton?.setAttribute("disabled", "");
    }
  }

  function readInput():
    | {
        ok: true;
        input: {
          totalClasses: number;
          mode: AttendanceInputMode;
          attendedClasses?: number;
          absences?: number;
          requiredPercent: AttendancePercent;
          remainingClasses: number | null;
        };
      }
    | { ok: false; message: string } {
    clearCurrentErrors();
    const total = parseIntegerField(
      "totalClasses",
      false,
      1000,
      undefined,
      text.totalRange,
    );
    const percent = adapter.parseAttendancePercent(value("requiredPercent"));
    if (!percent.ok) setError("requiredPercent", text.percent[percent.error]);

    const remaining = adapter.parseAttendanceRemaining(value("remainingClasses"));
    if (!remaining.ok) {
      setError(
        "remainingClasses",
        remaining.error === "negative"
          ? text.integer.negative
          : text.remainingRange,
      );
    }
    const activeName: FieldName = mode === "attended" ? "attendedClasses" : "absences";
    const active = parseIntegerField(
      activeName,
      true,
      total.ok ? total.value : 1000,
      total.ok
        ? mode === "attended"
          ? text.tooManyAttended(total.value)
          : text.tooManyAbsences(total.value)
        : undefined,
    );

    if (!total.ok || !percent.ok || !active.ok || !remaining.ok) {
      return {
        ok: false,
        message: !remaining.ok ? text.remainingInvalid : text.incomplete,
      };
    }

    return {
      ok: true,
      input: {
        totalClasses: total.value,
        mode,
        ...(mode === "attended"
          ? { attendedClasses: active.value }
          : { absences: active.value }),
        requiredPercent: percent,
        remainingClasses: remaining.value,
      },
    };
  }

  function parseIntegerField(
    name: FieldName,
    allowZero: boolean,
    max: number,
    tooLargeMessage?: string,
    rangeMessage?: string,
  ) {
    const parsed = adapter.parseAttendanceInteger(value(name), {
      allowZero,
      max,
    });
    if (!parsed.ok) {
      setError(
        name,
        parsed.error === "too_large" && tooLargeMessage
          ? tooLargeMessage
          : rangeMessage &&
              (parsed.error === "invalid" ||
                parsed.error === "zero" ||
                parsed.error === "too_large")
            ? rangeMessage
          : text.integer[parsed.error],
      );
    }
    return parsed;
  }

  function renderResult(result: AttendanceResult): void {
    initialResult?.classList.add("hidden");
    results?.classList.remove("hidden");
    setText("[data-result-percent]", adapter.formatAttendancePercent(result.currentPercent));
    setText("[data-result-current-status]", result.presentation.currentStatusLabel);
    setText("[data-result-rounding]", result.presentation.currentRoundingNotice);
    setText("[data-result-projection]", result.presentation.projectionLabel);
    setText("[data-result-action]", result.presentation.actionMessage);
    setText(
      "[data-result-condition]",
      [result.presentation.conditionMessage, result.presentation.finalRoundingNotice]
        .filter(Boolean)
        .join(" "),
    );
    setText("[data-result-available]", result.presentation.availabilityLabel);
    setText("[data-result-needed]", result.presentation.neededLabel);
    setText("[data-detail-total]", adapter.formatAttendanceCount(result.totalClasses));
    setText("[data-detail-attended]", adapter.formatAttendanceCount(result.attendedClasses));
    setText("[data-detail-absences]", adapter.formatAttendanceCount(result.currentAbsences));
    setText("[data-detail-minimum]", adapter.formatRequiredAttendancePercent(result));
    setText("[data-detail-margin]", result.presentation.marginLabel);
    setText("[data-detail-recovery]", result.presentation.recoveryLabel);

    const projection = result.projection;
    const isKnown = projection.status !== "unknown";
    queryAll<HTMLElement>("[data-known-detail]").forEach((element) =>
      element.classList.toggle("hidden", !isKnown),
    );
    setText(
      "[data-detail-remaining]",
      isKnown ? adapter.formatAttendanceCount(projection.remainingClasses) : text.unknown,
    );
    if (isKnown) {
      setText("[data-detail-final-total]", adapter.formatAttendanceCount(projection.finalTotalClasses));
      setText("[data-detail-max-absences]", adapter.formatAttendanceCount(projection.maximumFinalAbsences));
      setText("[data-detail-excess]", adapter.formatAttendanceCount(projection.exceededAbsences));
      setText("[data-detail-max-final]", adapter.formatAttendancePercent(projection.maxPossiblePercent));
    }

    const currentColor = result.currentStatus === "meets" ? "text-emerald-300" : "text-amber-300";
    const projectionColor =
      projection.status === "impossible" || projection.status === "finished_below"
        ? "text-red-300"
        : projection.status === "unknown" || projection.status === "possible"
          ? "text-amber-300"
          : "text-emerald-300";
    setColor(query("[data-result-current-status]"), currentColor);
    setColor(query("[data-result-projection]"), projectionColor);
    setColor(query("[data-result-action]"), projectionColor);
  }

  function showInitial(message: string): void {
    results?.classList.add("hidden");
    initialResult?.classList.remove("hidden");
    if (initialResult) initialResult.textContent = message;
  }

  function setMode(nextMode: string | undefined): void {
    const normalized: AttendanceInputMode = nextMode === "absences" ? "absences" : "attended";
    if (normalized === mode) return;
    const total = adapter.parseAttendanceInteger(value("totalClasses"), {
      allowZero: false,
      max: 1000,
    });
    const sourceName: FieldName = mode === "attended" ? "attendedClasses" : "absences";
    const targetName: FieldName = normalized === "attended" ? "attendedClasses" : "absences";
    const source = total.ok
      ? adapter.parseAttendanceInteger(value(sourceName), { allowZero: true, max: total.value })
      : { ok: false as const };
    setValue(targetName, total.ok && source.ok ? String(total.value - source.value) : "");
    clearError(targetName);
    mode = normalized;
    updateCalculator(true);
  }

  function updateModeUi(): void {
    modeButtons.forEach((button) => {
      const active = button.dataset.modeButton === mode;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("bg-amber-400", active);
      button.classList.toggle("text-gray-950", active);
      button.classList.toggle("text-gray-300", !active);
    });
    query<HTMLElement>("[data-attended-wrapper]")?.classList.toggle("hidden", mode !== "attended");
    query<HTMLElement>("[data-absences-wrapper]")?.classList.toggle("hidden", mode !== "absences");
  }

  function syncAlternateField(result: AttendanceResult): void {
    setValue(
      mode === "attended" ? "absences" : "attendedClasses",
      String(mode === "attended" ? result.currentAbsences : result.attendedClasses),
    );
  }

  function loadExample(id: string | undefined, trigger: HTMLButtonElement): void {
    const example = adapter.ATTENDANCE_EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    mode = example.values.mode;
    (Object.keys(example.values) as Array<keyof typeof example.values>).forEach((name) => {
      if (name !== "mode") setValue(name, example.values[name]);
    });
    clearAllErrors();
    updateCalculator();
    trigger.focus();
    setStatus(text.example, "success");
  }

  function clearCalculator(): void {
    resultVersion += 1;
    clearStatus();
    mode = "attended";
    setValue("totalClasses", "");
    setValue("attendedClasses", "");
    setValue("absences", "");
    setValue("requiredPercent", "80");
    setValue("remainingClasses", "");
    currentResult = null;
    currentSummary = "";
    clearAllErrors();
    hideManualCopy();
    updateModeUi();
    showInitial(text.incomplete);
    copyButton?.setAttribute("disabled", "");
    field("totalClasses")?.focus();
    setStatus(text.cleared, "success");
  }

  async function copySummary(): Promise<void> {
    if (!currentSummary || !currentResult) {
      setStatus(text.noSummary, "error");
      return;
    }
    const summary = currentSummary;
    const version = resultVersion;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (version !== resultVersion || summary !== currentSummary) return;
    if (!copied) copied = tryLegacyCopy(summary, activeElement);
    if (copied) {
      setStatus(text.copied, "success");
      return;
    }
    if (manualCopy && manualCopyText) {
      manualCopyText.value = summary;
      manualCopy.classList.remove("hidden");
      manualCopyText.focus();
      manualCopyText.select();
    }
    setStatus(text.copyFailed, "error", false);
  }

  function tryLegacyCopy(summary: string, restoreFocus: HTMLElement | null): boolean {
    const textarea = document.createElement("textarea");
    textarea.value = summary;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    let copied = false;
    try {
      textarea.select();
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    } finally {
      textarea.remove();
      restoreFocus?.focus();
    }
    return copied;
  }

  function setError(name: FieldName, message: string): void {
    const input = field(name);
    if (input?.dataset.touched !== "true") return;
    const error = query<HTMLElement>(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = message;
      error.classList.remove("hidden");
    }
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(name: FieldName): void {
    const error = query<HTMLElement>(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = "";
      error.classList.add("hidden");
    }
    field(name)?.removeAttribute("aria-invalid");
  }

  function clearCurrentErrors(): void {
    (Object.keys({ totalClasses: 0, requiredPercent: 0, attendedClasses: 0, absences: 0, remainingClasses: 0 }) as FieldName[]).forEach(clearError);
  }

  function clearAllErrors(): void {
    clearCurrentErrors();
    queryAll<HTMLInputElement>("[data-field]").forEach((input) => delete input.dataset.touched);
  }

  function hideManualCopy(): void {
    manualCopy?.classList.add("hidden");
    if (manualCopyText) manualCopyText.value = "";
  }

  function setText(selector: string, content: string): void {
    const element = query<HTMLElement>(selector);
    if (element) element.textContent = content;
  }

  function setColor(element: Element | null, color: string): void {
    element?.classList.remove("text-white", "text-emerald-300", "text-amber-300", "text-red-300");
    element?.classList.add(color);
  }

  function setStatus(message: string, kind: "success" | "error", clear = true): void {
    if (!status) return;
    window.clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.toggle("text-emerald-300", kind === "success");
    status.classList.toggle("text-red-300", kind === "error");
    if (clear) statusTimer = window.setTimeout(() => (status.textContent = ""), 3000);
  }

  function clearStatus(): void {
    window.clearTimeout(statusTimer);
    if (status) status.textContent = "";
  }

  queryAll<HTMLInputElement>("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") input.dataset.touched = "true";
      updateCalculator();
    });
    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      updateCalculator(true);
    });
  });
  modeButtons.forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.modeButton)),
  );
  queryAll<HTMLButtonElement>("[data-example-id]").forEach((button) =>
    button.addEventListener("click", () => loadExample(button.dataset.exampleId, button)),
  );
  copyButton?.addEventListener("click", copySummary);
  clearButton?.addEventListener("click", clearCalculator);
  updateModeUi();
  showInitial(text.incomplete);
}
