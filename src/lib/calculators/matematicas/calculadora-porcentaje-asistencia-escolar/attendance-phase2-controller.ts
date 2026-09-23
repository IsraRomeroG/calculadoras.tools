import * as es from "./attendance";
import * as en from "./attendance.en";
import type { AttendanceProjection } from "./attendance-core";
import type { AttendanceResult } from "./attendance-presenter";
import {
  ATTENDANCE_CONTEXT_EVENT,
  getAttendanceContext,
  publishAttendanceContext,
  type AttendanceCalculatorContext,
  type AttendanceContextPresentation,
} from "./attendance-context";
import {
  addAttendanceSubject,
  appendAttendanceHistory,
  buildAttendanceCsv,
  calculatePolicyAttendance,
  calculatePolicyRecovery,
  clearAttendanceHistory,
  createAttendanceHistorySnapshot,
  createAttendanceSubject,
  createStableId,
  deleteAttendanceHistoryForSubject,
  deleteAttendanceHistorySnapshot,
  downloadAttendanceCsv,
  normalizeAttendancePolicy,
  prepareAttendanceRestore,
  policyAttendanceToCsvRow,
  readAttendanceHistory,
  isAttendanceHistoryCurrent,
  removeAttendanceSubject,
  removeCalendarEvent,
  renameAttendanceSubject,
  summarizeCalendar,
  upsertCalendarEvent,
  validateCalendarEvent,
  ATTENDANCE_SUBJECTS_KEY,
  ATTENDANCE_PHASE2_RULES_VERSION,
  DEFAULT_ATTENDANCE_POLICY,
  validateAttendanceHistorySnapshot,
  type AttendanceCalendarEvent,
  type AttendanceEventStatus,
  type AttendanceHistorySnapshot,
  type AttendancePolicy,
  type AttendanceSource,
  type AttendanceSubject,
  type HistoryReadResult,
  type HistorySaveResult,
  type ManualAttendanceValues,
  type PolicyAttendanceResult,
} from "./attendance-phase2";

type Locale = "es" | "en";
type Adapter = typeof es;

const TEXT = {
  es: {
    initial: "Introduce datos válidos para calcular.",
    calendarEmpty: "Registra al menos una clase impartida antes de usar el calendario.",
    invalid: "Revisa los datos de esta materia.",
    sourceConfirm: "Cambiar el origen reemplazará los datos que alimentan el cálculo. ¿Deseas continuar?",
    noSubject: "Sin materia seleccionada",
    subjectPrompt: "Escribe el nombre de la materia.",
    subjectLimit: "Alcanzaste el límite de 20 materias por sesión.",
    renamePrompt: "Escribe el nuevo nombre de la materia.",
    deleteConfirm: "¿Eliminar esta materia, sus datos y sus resultados guardados? Esta acción no se puede deshacer.",
    deleted: "Materia eliminada.",
    cleared: "Formulario limpio.",
    saved: "Resultado guardado en esta sesión.",
    historyFull: "El historial alcanzó 50 instantáneas. Borra alguna antes de guardar otra.",
    historyUnavailable: "No se pudo guardar en esta sesión; el cálculo sigue disponible.",
    historySaveInvalid: "No se guardó la instantánea porque sus datos no son válidos.",
    historyCorrupt: "El historial no está disponible porque los datos guardados están dañados.",
    historyIgnored: (count: number) => count === 1
      ? "Se ignoró 1 instantánea inválida."
      : `Se ignoraron ${count} instantáneas inválidas.`,
    restored: "Entradas restauradas y recalculadas con las reglas actuales.",
    deletedHistory: "Instantánea eliminada.",
    clearedHistory: "Historial borrado.",
    csv: "CSV generado.",
    noSaved: "No hay un resultado válido para guardar.",
    noExport: "No hay un resultado válido para exportar.",
    noClasses: "Sin clases computables",
    undefined: "Indefinido",
    eventStatuses: {
      attended: "Asistida",
      absence: "Falta",
      justified: "Justificada",
      tardy: "Retardo",
      scheduled: "Programada",
      cancelled: "Cancelada",
    },
    actualPercent: "Real",
    evaluatedPercent: "evaluado",
    finalActualPercent: "Máximo final real",
    effectiveAttendance: "Asistencia efectiva",
    meets: "Cumples actualmente",
    below: "Por debajo del mínimo actual",
    unknown: "Proyección pendiente",
    finishedMeets: "Curso terminado: mínimo alcanzado",
    finishedBelow: "Curso terminado: mínimo no alcanzado",
    impossible: "No es posible dentro del calendario",
    guaranteed: "Cumplimiento final asegurado",
    possible: "Cumplimiento final posible",
    originManual: "Totales manuales",
    originCalendar: "Registro de clases",
    eventDelete: "Eliminar",
    eventEdit: "Editar",
    restore: "Restaurar",
    viewSavedResult: "Consultar resultado guardado",
    savedWithRules: (version: string) => `Resultado guardado con reglas ${version}`,
    historyComparison: "Comparación con el resultado guardado",
    savedResultLabel: "Resultado guardado",
    recalculatedResultLabel: "Recalculado con reglas actuales",
    historyNumbersChanged: "Cambiaron las cifras.",
    historyStatusChanged: "Cambió el estado.",
    historyNoChanges: "No cambiaron las cifras ni el estado.",
    historyCurrent: "Asistencia actual",
    historyProjection: "Proyección final",
    historyMinimumFinal: "Asistencias mínimas al final",
    historyAvailableAbsences: "Faltas disponibles",
    historyNeededAttendances: "Asistencias necesarias",
    historyMaximumFinal: "Porcentaje máximo final",
    historyInvalid: "No se pudo restaurar esta instantánea.",
    policy: "Política utilizada",
    justifiedCount: "Faltas justificadas (J)",
    tardyCount: "Clases con retardo (L)",
    tardyPenalty: "Asistencias descontadas por retardos",
    tardyRemainder: "Retardos restantes tras conversión",
    tardyUnconverted: "Retardos sin convertir",
    optionalCountHelp: (max: string, unit: string) => `Opcional; vacío equivale a 0. Límite: 0 a ${max} ${unit}.`,
    policyCountNegative: "No se permiten valores negativos.",
    policyCountRange: (max: number, unit: string) => `Usa un entero entre 0 y ${max} ${unit}.`,
  },
  en: {
    initial: "Enter valid data to calculate.",
    calendarEmpty: "Register at least one completed class before using the calendar.",
    invalid: "Check this subject's data.",
    sourceConfirm: "Changing the source replaces the data that feeds the calculation. Continue?",
    noSubject: "No subject selected",
    subjectPrompt: "Enter the subject name.",
    subjectLimit: "You reached the 20-subject session limit.",
    renamePrompt: "Enter the new subject name.",
    deleteConfirm: "Delete this subject, its data, and its saved results? This cannot be undone.",
    deleted: "Subject deleted.",
    cleared: "Inputs cleared.",
    saved: "Result saved in this session.",
    historyFull: "The history has 50 snapshots. Delete one before saving another.",
    historyUnavailable: "This session could not save the result; the calculation is still available.",
    historySaveInvalid: "The snapshot was not saved because its data is invalid.",
    historyCorrupt: "History is unavailable because its stored data is corrupt.",
    historyIgnored: (count: number) => count === 1
      ? "1 invalid snapshot was ignored."
      : `${count} invalid snapshots were ignored.`,
    restored: "Inputs restored and recalculated with the current rules.",
    deletedHistory: "Snapshot deleted.",
    clearedHistory: "History deleted.",
    csv: "CSV generated.",
    noSaved: "There is no valid result to save.",
    noExport: "There is no valid result to export.",
    noClasses: "No computable classes",
    undefined: "Undefined",
    eventStatuses: {
      attended: "Attended",
      absence: "Absence",
      justified: "Justified",
      tardy: "Tardy",
      scheduled: "Scheduled",
      cancelled: "Cancelled",
    },
    actualPercent: "Actual",
    evaluatedPercent: "evaluated",
    finalActualPercent: "Final maximum actual",
    effectiveAttendance: "Effective attendance",
    meets: "Currently meets the minimum",
    below: "Below the current minimum",
    unknown: "Projection pending",
    finishedMeets: "Course finished: minimum reached",
    finishedBelow: "Course finished: minimum not reached",
    impossible: "Not possible within the schedule",
    guaranteed: "Final requirement secured",
    possible: "Final requirement is possible",
    originManual: "Manual totals",
    originCalendar: "Class register",
    eventDelete: "Delete",
    eventEdit: "Edit",
    restore: "Restore",
    viewSavedResult: "View saved result",
    savedWithRules: (version: string) => `Saved result under rules ${version}`,
    historyComparison: "Comparison with saved result",
    savedResultLabel: "Saved result",
    recalculatedResultLabel: "Recalculated with current rules",
    historyNumbersChanged: "The figures changed.",
    historyStatusChanged: "The status changed.",
    historyNoChanges: "The figures and status did not change.",
    historyCurrent: "Current attendance",
    historyProjection: "Final projection",
    historyMinimumFinal: "Minimum final attendances",
    historyAvailableAbsences: "Available absences",
    historyNeededAttendances: "Required attendances",
    historyMaximumFinal: "Maximum final percentage",
    historyInvalid: "This snapshot could not be restored.",
    policy: "Policy used",
    justifiedCount: "Justified absences (J)",
    tardyCount: "Tardy classes (L)",
    tardyPenalty: "Attendances deducted for tardies",
    tardyRemainder: "Tardy remainder after conversion",
    tardyUnconverted: "Unconverted tardies",
    optionalCountHelp: (max: string, unit: string) => `Optional; blank means 0. Limit: 0 to ${max} ${unit}.`,
    policyCountNegative: "Negative values are not allowed.",
    policyCountRange: (max: number, unit: string) => `Use a whole number from 0 to ${max} ${unit}.`,
  },
} as const;

export function initAttendancePhase2Calculators(): void {
  document
    .querySelectorAll<HTMLElement>("[data-attendance-calculator]")
    .forEach((root) => {
      if (root.dataset.phase2Initialized === "true") return;
      root.dataset.phase2Initialized = "true";
      initAttendancePhase2Calculator(root);
    });
}

function initAttendancePhase2Calculator(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === "en" ? "en" : "es";
  const adapter: Adapter = locale === "en" ? en : es;
  const text = TEXT[locale];
  let subjects = loadSubjects();
  let emptyStart = subjects !== null && subjects.length === 0;
  if (subjects === null) subjects = [createAttendanceSubject(locale === "en" ? "Subject 1" : "Materia 1")];
  let subject = subjects[0] ?? createAttendanceSubject(locale === "en" ? "Subject 1" : "Materia 1");
  let source: AttendanceSource = subject.source;
  let events = [...subject.events];
  let syncing = false;
  let editingEventId: string | null = null;
  let history: HistoryReadResult | HistorySaveResult = readAttendanceHistory(getSessionStorage());

  const query = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const queryAll = <T extends Element>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const field = (name: string) => query<HTMLInputElement>(`[data-field="${name}"]`);
  const value = (name: string) => field(name)?.value ?? "";
  const setValue = (name: string, next: string) => {
    const element = field(name);
    if (element) element.value = next;
  };
  const status = query<HTMLElement>("[data-action-status]");
  const initial = query<HTMLElement>("[data-initial-result]");
  const results = query<HTMLElement>("[data-results]");
  const saveButton = query<HTMLButtonElement>("[data-save-result]");
  const exportButton = query<HTMLButtonElement>("[data-export-csv]");
  const historyPanel = query<HTMLElement>("[data-history-panel]");
  const historyNote = query<HTMLElement>("[data-history-note]");
  const historyList = query<HTMLElement>("[data-history-list]");
  const historyComparison = query<HTMLElement>("[data-history-comparison]");
  const calendarError = query<HTMLElement>("[data-calendar-error]");
  queryAll<HTMLElement>("[data-requires-js]").forEach((element) => element.removeAttribute("disabled"));
  root.addEventListener(ATTENDANCE_CONTEXT_EVENT, () => {
    const valid = getAttendanceContext(root)?.valid === true;
    saveButton?.toggleAttribute("disabled", !valid);
    exportButton?.toggleAttribute("disabled", !valid);
  });

  function update(): void {
    if (syncing) return;
    historyComparison?.classList.add("hidden");
    updateManualPolicyCountHelp();
    if (source !== "manual") clearManualPolicyCountErrors();
    saveSubjectDraft();
    const result = readActiveInput();
    const presentation = result ? createPresentation(result) : null;
    const draft = {
      subject: { id: subject.id, name: subject.name },
      source,
      mode: source === "manual" ? getManualMode() : subject.manual.mode,
      calendarMode: getCalendarMode(),
      input: source === "manual"
        ? { kind: "manual", values: { ...subject.manual } }
        : { kind: "calendar", events: [...events], calendarComplete: subject.calendarComplete },
      policy: result?.policy ?? readPolicySafe(),
      result,
      presentation,
      summary: null as string | null,
      valid: result !== null && presentation !== null,
    };
    draft.summary = presentation ? buildSummary(draft) : null;
    const context = publishAttendanceContext(root, draft);
    saveButton?.toggleAttribute("disabled", !context.valid);
    exportButton?.toggleAttribute("disabled", !context.valid);
    if (!context.valid || !result || !presentation) {
      const isEmptyCalendar = source === "calendar" && summarizeCalendar(events, subject.calendarComplete).completedClasses === 0;
      showInitial(isEmptyCalendar ? text.calendarEmpty : text.invalid);
      renderSubjectUi();
      return;
    }
    if (presentation.kind === "base") renderBaseResult(presentation.result, context);
    else renderPhase2Result(context);
    renderSubjectUi();
  }

  function readActiveInput(): PolicyAttendanceResult | null {
    try {
      const policy = readPolicy();
      if (source === "calendar") {
        const counts = summarizeCalendar(events, subject.calendarComplete);
        if (counts.completedClasses === 0) return null;
        return calculatePolicyAttendance({
          totalClasses: counts.completedClasses,
          attendedClasses: counts.attendedClasses,
          justifiedAbsences: counts.justifiedAbsences,
          tardyClasses: counts.tardyClasses,
          requiredPercent: readRequiredPercent(),
          remainingClasses: counts.remainingClasses,
          policy,
        });
      }
      const total = adapter.parseAttendanceInteger(value("totalClasses"), { allowZero: false, max: 1000 });
      const percent = adapter.parseAttendancePercent(value("requiredPercent"));
      const calendar = total.ok ? readManualCalendar(total.value) : { ok: false as const };
      const mode = getManualMode();
      const active = adapter.parseAttendanceInteger(value(mode === "attended" ? "attendedClasses" : "absences"), {
        allowZero: true,
        max: total.ok ? total.value : 1000,
      });
      if (!total.ok || !active.ok) {
        clearManualPolicyCountErrors();
        return null;
      }
      const attended = mode === "attended" ? active.value : total.value - active.value;
      const absences = total.value - attended;
      const justifiedAbsences = readOptionalManualPolicyCount("justifiedAbsences", absences, "absences");
      const tardyClasses = readOptionalManualPolicyCount("tardyClasses", attended, "attendances");
      if (justifiedAbsences === null || tardyClasses === null) return null;
      if (!percent.ok || !calendar.ok) return null;
      return calculatePolicyAttendance({
        totalClasses: total.value,
        attendedClasses: attended,
        justifiedAbsences,
        tardyClasses,
        requiredPercent: percent,
        remainingClasses: calendar.value,
        policy,
      });
    } catch {
      return null;
    }
  }

  function readRequiredPercent(): number {
    const parsed = adapter.parseAttendancePercent(value("requiredPercent"));
    if (!parsed.ok) throw new RangeError("Invalid minimum.");
    return parsed.value;
  }

  function readOptionalManualPolicyCount(
    name: "justifiedAbsences" | "tardyClasses",
    max: number,
    unit: "absences" | "attendances",
  ): number | null {
    const raw = value(name).trim();
    const parsed = raw
      ? adapter.parseAttendanceInteger(raw, { allowZero: true, max })
      : { ok: true as const, value: 0, normalized: "" };
    const input = field(name);
    const error = query<HTMLElement>(`[data-error-for="${name}"]`);
    if (!parsed.ok) {
      input?.setAttribute("aria-invalid", "true");
      if (error) {
        error.textContent = parsed.error === "negative"
          ? text.policyCountNegative
          : text.policyCountRange(max, unit === "absences"
            ? locale === "en" ? "absences" : "faltas"
            : locale === "en" ? "attendances" : "asistencias");
        error.classList.remove("hidden");
      }
      return null;
    }
    input?.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
      error.classList.add("hidden");
    }
    return parsed.value;
  }

  function updateManualPolicyCountHelp(): void {
    const total = adapter.parseAttendanceInteger(value("totalClasses"), { allowZero: false, max: 1_000 });
    let maxAbsences: number | null = null;
    let maxAttendances: number | null = null;
    if (total.ok) {
      const mode = getManualMode();
      const active = adapter.parseAttendanceInteger(
        value(mode === "attended" ? "attendedClasses" : "absences"),
        { allowZero: true, max: total.value },
      );
      if (active.ok) {
        maxAttendances = mode === "attended" ? active.value : total.value - active.value;
        maxAbsences = total.value - maxAttendances;
      }
    }
    const justifiedHelp = query<HTMLElement>('[data-policy-count-help="justifiedAbsences"]');
    const tardyHelp = query<HTMLElement>('[data-policy-count-help="tardyClasses"]');
    if (justifiedHelp) justifiedHelp.textContent = text.optionalCountHelp(
      maxAbsences === null ? "F" : String(maxAbsences),
      locale === "en" ? "absences" : "faltas",
    );
    if (tardyHelp) tardyHelp.textContent = text.optionalCountHelp(
      maxAttendances === null ? "A" : String(maxAttendances),
      locale === "en" ? "attendances" : "asistencias",
    );
  }

  function clearManualPolicyCountErrors(): void {
    for (const name of ["justifiedAbsences", "tardyClasses"] as const) {
      field(name)?.removeAttribute("aria-invalid");
      const error = query<HTMLElement>(`[data-error-for="${name}"]`);
      if (error) {
        error.textContent = "";
        error.classList.add("hidden");
      }
    }
  }

  function readPolicy(): AttendancePolicy {
    const justified = query<HTMLSelectElement>("[data-policy-justified]")?.value ?? "absence";
    const tardyValue = query<HTMLSelectElement>("[data-policy-tardy]")?.value ?? "";
    const roundingValue = query<HTMLSelectElement>("[data-policy-rounding]")?.value ?? "exact";
    return normalizeAttendancePolicy({
      justified: justified as AttendancePolicy["justified"],
      tardyConversion: tardyValue ? Number(tardyValue) : null,
      rounding: roundingValue === "exact"
        ? "exact"
        : { mode: "half-up", decimals: Number(roundingValue) as 0 | 1 | 2 },
    });
  }

  function getManualMode(): "attended" | "absences" {
    return queryAll<HTMLButtonElement>("[data-mode-button]").find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.modeButton === "absences"
      ? "absences"
      : "attended";
  }

  function getCalendarMode(): "remaining" | "total" {
    return queryAll<HTMLButtonElement>("[data-calendar-mode-button]").find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.calendarModeButton === "total"
      ? "total"
      : "remaining";
  }

  function readManualCalendar(total: number):
    | { ok: true; value: number | null }
    | { ok: false } {
    if (getCalendarMode() === "remaining") {
      const remaining = adapter.parseAttendanceRemaining(value("remainingClasses"));
      return remaining.ok ? { ok: true, value: remaining.value } : { ok: false };
    }
    if (!value("courseTotalClasses").trim()) return { ok: true, value: null };
    const courseTotal = adapter.parseAttendanceInteger(value("courseTotalClasses"), { allowZero: true, max: 2000 });
    if (!courseTotal.ok || courseTotal.value === 0 || courseTotal.value < total || courseTotal.value - total > 1000) {
      return { ok: false };
    }
    return { ok: true, value: courseTotal.value - total };
  }

  function createPresentation(result: PolicyAttendanceResult): AttendanceContextPresentation {
    const baseResult = createBaseResult(result, getManualMode());
    if (source === "manual" && isDefaultPolicy(result.policy) && baseResult) {
      return { kind: "base", result: baseResult };
    }
    return { kind: "policy", fields: createPolicyPresentation(result, baseResult) };
  }

  function createBaseResult(
    result: PolicyAttendanceResult,
    mode: "attended" | "absences",
  ): AttendanceResult | null {
    if (
      result.currentPercent === null ||
      result.currentStatus === "undefined" ||
      result.projection.status === "undefined"
    ) {
      return null;
    }
    const projection: AttendanceProjection = result.projection.status === "unknown"
      ? { status: "unknown", remainingClasses: null }
      : {
          status: result.projection.status,
          remainingClasses: result.projection.remainingClasses,
          finalTotalClasses: result.projection.finalTotalClasses,
          minimumAttendancesFinal: result.projection.minimumAttendancesFinal,
          maximumFinalAbsences: result.projection.maximumFinalAbsences,
          availableAbsences: result.projection.availableAbsences,
          exceededAbsences: result.projection.exceededAbsences,
          requiredAttendancesFromRemaining: result.projection.requiredAttendancesFromRemaining,
          maxPossiblePercent: result.projection.maxPossiblePercent,
        };
    const coreResult = {
      inputMode: mode,
      totalClasses: result.totalClasses,
      attendedClasses: result.attendedClasses,
      currentAbsences: result.originalAbsences,
      requiredPercent: result.requiredPercent,
      requiredPercentScaled: result.requiredPercentScaled,
      requiredPercentText: String(result.requiredPercent),
      currentPercent: result.currentPercent,
      currentStatus: result.currentStatus,
      marginPoints: (100 * (
        result.effectiveAttendedClasses * 1_000_000 -
        result.effectiveTotalClasses * result.requiredPercentScaled
      )) / (result.effectiveTotalClasses * 1_000_000),
      projection,
      consecutiveClassesToRecover: calculatePolicyRecovery(result).classes,
    };
    return { ...coreResult, presentation: adapter.presentAttendance(coreResult) };
  }

  function createPolicyPresentation(
    result: PolicyAttendanceResult,
    baseResult: AttendanceResult | null,
  ): Record<string, string> {
    const projection = result.projection;
    const base = baseResult?.presentation;
    const labels: Record<string, string> = {
      unknown: text.unknown,
      undefined: text.noClasses,
      finished_meets: text.finishedMeets,
      finished_below: text.finishedBelow,
      impossible: text.impossible,
      guaranteed: text.guaranteed,
      possible: text.possible,
    };
    const rounding = result.policy.rounding === "exact" || result.currentPercent === null
      ? ""
      : `${text.actualPercent}: ${formatPercent(result.currentPercent)} · ${text.evaluatedPercent}: ` +
        formatPercent(result.currentEvaluatedPercent ?? result.currentPercent);
    const finalRounding = projection.status !== "unknown" && projection.status !== "undefined" && result.policy.rounding !== "exact"
      ? `${text.finalActualPercent}: ${formatPercent(projection.maxPossiblePercent)} · ${text.evaluatedPercent}: ` +
        formatPercent(projection.finalEvaluatedPercent)
      : "";
    const condition = [
      base?.conditionMessage,
      base?.currentRoundingNotice,
      base?.finalRoundingNotice,
      finalRounding,
    ].filter(Boolean).join(" ");
    const unknownProjection = projection.status === "unknown" || projection.status === "undefined";
    const adapterSummary = baseResult ? adapter.buildAttendanceSummary(baseResult) : "";
    const contextSummary = source === "calendar"
      ? adapterSummary.split("\n").filter((_, index) => index !== 1).join("\n")
      : adapterSummary;
    const currentRoundingSummary = rounding && result.currentPercent !== null
      ? `${text.actualPercent}: ${formatPercent(result.currentPercent)} · ${text.evaluatedPercent}: ` +
        formatPercent(result.currentEvaluatedPercent ?? result.currentPercent)
      : "";
    const summary = baseResult
      ? [
          contextSummary,
          `${text.effectiveAttendance}: ${result.effectiveTotalClasses === 0 ? text.noClasses : `${formatCount(result.effectiveAttendedClasses)}/${formatCount(result.effectiveTotalClasses)}`}`,
          currentRoundingSummary,
          finalRounding,
        ].filter(Boolean).join("\n")
      : "";
    return {
      percent: result.currentPercent === null ? text.undefined : formatPercent(result.currentPercent),
      currentStatus: base?.currentStatusLabel ?? (
        result.currentStatus === "meets"
          ? text.meets
          : result.currentStatus === "below"
            ? text.below
            : text.noClasses
      ),
      rounding,
      projection: base?.projectionLabel ?? labels[projection.status] ?? text.noClasses,
      action: base?.actionMessage ?? (projection.status === "unknown" ? text.unknown : text.noClasses),
      condition,
      available: base?.availabilityLabel ?? "—",
      needed: base?.neededLabel ?? "—",
      total: formatCount(result.totalClasses),
      attended: formatCount(result.attendedClasses),
      absences: formatCount(result.originalAbsences),
      minimum: adapter.formatRequiredAttendancePercent(result.requiredPercent),
      margin: base?.marginLabel ?? (
        result.currentPercent === null
          ? "—"
          : formatSignedPercent(result.currentPercent - result.requiredPercent)
      ),
      recovery: base?.recoveryLabel ?? text.noClasses,
      remaining: projection.status === "unknown"
        ? (locale === "en" ? "Not provided" : "No indicadas")
        : formatCount(projection.remainingClasses),
      finalTotal: unknownProjection ? "" : formatCount(projection.finalTotalClasses),
      maxAbsences: unknownProjection ? "" : formatCount(projection.maximumFinalAbsences),
      maxFinal: unknownProjection ? "" : formatPercent(projection.maxPossiblePercent),
      excess: unknownProjection ? "" : formatCount(projection.exceededAbsences),
      summary,
      policy: text.policy + ": " + formatPolicy(result.policy),
      origin: (locale === "en" ? "Origin: " : "Origen: ") +
        (source === "manual" ? text.originManual : text.originCalendar),
      effective: result.effectiveTotalClasses === 0
        ? text.noClasses
        : formatCount(result.effectiveAttendedClasses) + "/" + formatCount(result.effectiveTotalClasses),
      currentColor: result.currentStatus === "meets" ? "text-emerald-300" : "text-amber-300",
      projectionColor: projection.status === "impossible" || projection.status === "finished_below"
        ? "text-red-300"
        : projection.status === "unknown" || projection.status === "possible"
          ? "text-amber-300"
          : "text-emerald-300",
    };
  }

  function buildSummary(
    context: Pick<AttendanceCalculatorContext, "subject" | "source" | "mode" | "policy" | "presentation" | "result">,
  ): string {
    const presentation = context.presentation;
    if (!presentation || !context.result) return "";
    const english = locale === "en";
    const subject = (english ? "Subject: " : "Materia: ") + context.subject.name;
    const origin = (english ? "Origin: " : "Origen: ") +
      (context.source === "manual" ? text.originManual : text.originCalendar);
    const policy = text.policy + ": " + formatPolicy(context.policy);
    const policyCounts = formatManualPolicyCounts(context.result);
    if (presentation.kind === "base") {
      return [subject, origin, policy, ...policyCounts, adapter.buildAttendanceSummary(presentation.result)].join("\n");
    }
    const fields = presentation.fields;
    return [
      subject,
      origin,
      policy,
      ...policyCounts,
      fields.summary || [
        english ? "School attendance summary" : "Resumen de asistencia escolar",
        (english ? "Input mode: " : "Modo de captura: ") +
        (context.mode === "attended"
            ? (english ? "Attendances" : "Asistencias")
            : (english ? "Absences" : "Faltas")),
        (english ? "Minimum: " : "Mínimo: ") + fields.minimum,
        (english ? "Classes held: " : "Clases impartidas: ") + fields.total,
        (english ? "Attended: " : "Asistidas: ") + fields.attended,
        (english ? "Accumulated absences: " : "Faltas acumuladas: ") + fields.absences,
        (english ? "Effective attendance: " : "Asistencia efectiva: ") + fields.effective,
        (english ? "Current attendance: " : "Asistencia actual: ") + fields.percent,
        (english ? "Current status: " : "Estado actual: ") + fields.currentStatus,
        (english ? "Margin: " : "Margen: ") + fields.margin,
        (english ? "Remaining classes: " : "Clases restantes: ") + fields.remaining,
        (english ? "Final projection: " : "Proyección final: ") + fields.projection,
        (english ? "Future absences available: " : "Faltas futuras disponibles: ") + fields.available,
        (english ? "Required attendances: " : "Asistencias necesarias: ") + fields.needed,
        (english ? "Recovery: " : "Recuperación: ") + fields.recovery,
        fields.action,
        fields.condition,
      ].filter(Boolean).join("\n"),
    ].filter(Boolean).join("\n");
  }

  function formatManualPolicyCounts(result: PolicyAttendanceResult): string[] {
    const remainderLabel = result.policy.tardyConversion === null
      ? text.tardyUnconverted
      : text.tardyRemainder;
    return [
      `${text.justifiedCount}: ${formatCount(result.justifiedAbsences)}`,
      `${text.tardyCount}: ${formatCount(result.tardyClasses)}`,
      `${text.tardyPenalty}: ${formatCount(result.tardyPenalty)}`,
      `${remainderLabel}: ${formatCount(result.tardyRemainder)}`,
    ];
  }

  function renderManualPolicyCounts(result: PolicyAttendanceResult | null): void {
    if (!result) return;
    setText("[data-detail-justified]", formatCount(result.justifiedAbsences));
    setText("[data-detail-tardy]", formatCount(result.tardyClasses));
    setText("[data-detail-tardy-penalty]", formatCount(result.tardyPenalty));
    setText("[data-detail-tardy-remainder]", formatCount(result.tardyRemainder));
    setText("[data-detail-tardy-remainder-label]", result.policy.tardyConversion === null
      ? text.tardyUnconverted
      : text.tardyRemainder);
  }

  function renderBaseResult(
    result: AttendanceResult,
    context: AttendanceCalculatorContext,
  ): void {
    initial?.classList.add("hidden");
    results?.classList.remove("hidden");
    setText("[data-result-percent]", adapter.formatAttendancePercent(result.currentPercent));
    setText("[data-result-current-status]", result.presentation.currentStatusLabel);
    setText("[data-result-rounding]", result.presentation.currentRoundingNotice);
    setText("[data-result-projection]", result.presentation.projectionLabel);
    setText("[data-result-action]", result.presentation.actionMessage);
    setText("[data-result-condition]", [result.presentation.conditionMessage, result.presentation.finalRoundingNotice].filter(Boolean).join(" "));
    setText("[data-result-available]", result.presentation.availabilityLabel);
    setText("[data-result-needed]", result.presentation.neededLabel);
    setText("[data-detail-total]", adapter.formatAttendanceCount(result.totalClasses));
    setText("[data-detail-attended]", adapter.formatAttendanceCount(result.attendedClasses));
    setText("[data-detail-absences]", adapter.formatAttendanceCount(result.currentAbsences));
    setText("[data-detail-minimum]", adapter.formatRequiredAttendancePercent(result));
    setText("[data-detail-margin]", result.presentation.marginLabel);
    setText("[data-detail-recovery]", result.presentation.recoveryLabel);
    setText("[data-result-policy]", text.policy + ": " + formatPolicy(context.policy));
    setText("[data-result-origin]", (locale === "en" ? "Origin: " : "Origen: ") + text.originManual);
    setText("[data-detail-effective]", formatCount(context.result?.effectiveAttendedClasses ?? 0) + "/" + formatCount(context.result?.effectiveTotalClasses ?? 0));
    const known = result.projection.status !== "unknown";
    queryAll<HTMLElement>("[data-known-detail]").forEach((element) => element.classList.toggle("hidden", !known));
    setText("[data-detail-remaining]", known
      ? adapter.formatAttendanceCount(result.projection.remainingClasses)
      : (locale === "en" ? "Not provided" : "No indicadas"));
    if (known) {
      setText("[data-detail-final-total]", adapter.formatAttendanceCount(result.projection.finalTotalClasses));
      setText("[data-detail-max-absences]", adapter.formatAttendanceCount(result.projection.maximumFinalAbsences));
      setText("[data-detail-excess]", result.presentation.exceededLabel);
      setText("[data-detail-max-final]", adapter.formatAttendancePercent(result.projection.maxPossiblePercent));
    }
    renderManualPolicyCounts(context.result);
    queryAll<HTMLElement>("[data-excess-detail]").forEach((element) => element.classList.toggle("hidden", !known || !result.presentation.exceededLabel));
    const currentColor = result.currentStatus === "meets" ? "text-emerald-300" : "text-amber-300";
    const projectionColor = result.projection.status === "impossible" || result.projection.status === "finished_below"
      ? "text-red-300"
      : result.projection.status === "unknown" || result.projection.status === "possible"
        ? "text-amber-300"
        : "text-emerald-300";
    setColor(query("[data-result-current-status]"), currentColor);
    setColor(query("[data-result-projection]"), projectionColor);
    setColor(query("[data-result-action]"), projectionColor);
  }

  function renderPhase2Result(context: AttendanceCalculatorContext): void {
    if (!context.result || context.presentation?.kind !== "policy") return;
    const fields = context.presentation.fields;
    setText("[data-result-percent]", fields.percent);
    setText("[data-result-current-status]", fields.currentStatus);
    setText("[data-result-rounding]", fields.rounding);
    setText("[data-result-projection]", fields.projection);
    setText("[data-result-action]", fields.action);
    setText("[data-result-condition]", fields.condition);
    setText("[data-result-available]", fields.available);
    setText("[data-result-needed]", fields.needed);
    setText("[data-result-policy]", fields.policy);
    setText("[data-result-origin]", fields.origin);
    setText("[data-detail-effective]", fields.effective);
    setText("[data-detail-total]", fields.total);
    setText("[data-detail-attended]", fields.attended);
    setText("[data-detail-absences]", fields.absences);
    setText("[data-detail-minimum]", fields.minimum);
    setText("[data-detail-remaining]", fields.remaining);
    setText("[data-detail-margin]", fields.margin);
    setText("[data-detail-recovery]", fields.recovery);
    setText("[data-detail-final-total]", fields.finalTotal);
    setText("[data-detail-max-absences]", fields.maxAbsences);
    setText("[data-detail-excess]", fields.excess);
    setText("[data-detail-max-final]", fields.maxFinal);
    renderManualPolicyCounts(context.result);
    const known = context.result.projection.status !== "unknown" && context.result.projection.status !== "undefined";
    queryAll<HTMLElement>("[data-known-detail]").forEach((element) => element.classList.toggle("hidden", !known));
    queryAll<HTMLElement>("[data-excess-detail]").forEach((element) => element.classList.toggle("hidden", !known || !context.result?.projection.exceededAbsences));
    setColor(query("[data-result-current-status]"), fields.currentColor);
    setColor(query("[data-result-projection]"), fields.projectionColor);
    setColor(query("[data-result-action]"), fields.projectionColor);
  }

  function saveSubjectDraft(): void {
    if (syncing) return;
    subject.source = source;
    subject.events = [...events];
    subject.policy = readPolicySafe();
    subject.manual = {
      totalClasses: value("totalClasses"),
      mode: getManualMode(),
      attendedClasses: value("attendedClasses"),
      absences: value("absences"),
      requiredPercent: value("requiredPercent"),
      remainingClasses: value("remainingClasses"),
      justifiedAbsences: value("justifiedAbsences"),
      tardyClasses: value("tardyClasses"),
      calendarMode: getCalendarMode(),
      courseTotalClasses: value("courseTotalClasses"),
    };
    if (emptyStart) {
      const hasManualData = [
        subject.manual.totalClasses,
        subject.manual.attendedClasses,
        subject.manual.absences,
        subject.manual.remainingClasses,
        subject.manual.courseTotalClasses,
        subject.manual.justifiedAbsences,
        subject.manual.tardyClasses,
      ].some(Boolean) || (subject.manual.requiredPercent !== "" && subject.manual.requiredPercent !== "80");
      if (!hasManualData && events.length === 0 && !subject.calendarComplete && isDefaultPolicy(subject.policy)) return;
      emptyStart = false;
      subjects = [subject];
    } else {
      const exists = subjects.some((item) => item.id === subject.id);
      subjects = exists
        ? subjects.map((item) => item.id === subject.id ? subject : item)
        : [...subjects, subject];
    }
    persistSubjects(subjects);
  }

  function readPolicySafe(): AttendancePolicy {
    try { return readPolicy(); } catch { return { ...DEFAULT_ATTENDANCE_POLICY }; }
  }

  function renderSubjectUi(): void {
    const select = query<HTMLSelectElement>("[data-subject-select]");
    if (select) {
      const options = subjects.map((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        option.selected = item.id === subject.id;
        return option;
      });
      if (!subjects.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = text.noSubject;
        option.selected = true;
        option.disabled = true;
        options.push(option);
      }
      select.replaceChildren(...options);
      select.disabled = subjects.length === 0;
    }
    query<HTMLButtonElement>("[data-rename-subject]")?.toggleAttribute("disabled", subjects.length === 0);
    query<HTMLButtonElement>("[data-delete-subject]")?.toggleAttribute("disabled", subjects.length === 0);
    queryAll<HTMLButtonElement>("[data-source-button]").forEach((button) => {
      const active = button.dataset.sourceButton === source;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("border-amber-400", active);
      button.classList.toggle("text-amber-300", active);
    });
    queryAll<HTMLElement>("[data-manual-source-fields], [data-manual-only]").forEach((element) => element.classList.toggle("hidden", source !== "manual"));
    query<HTMLElement>("[data-calendar-panel]")?.classList.toggle("hidden", source !== "calendar");
    renderEvents();
    renderHistory();
  }

  function renderEvents(): void {
    const list = query<HTMLElement>("[data-event-list]");
    if (!list) return;
    list.replaceChildren(...events.map((event) => {
      const item = document.createElement("li");
      item.className = "flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-800 p-3";
      const label = document.createElement("span");
      label.className = "min-w-0 break-words";
      label.textContent = `${event.date} · ${text.eventStatuses[event.status]}${event.label ? ` · ${event.label}` : ""}`;
      const actions = document.createElement("span");
      actions.className = "flex shrink-0 gap-2";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "min-h-11 rounded-lg border border-gray-700 px-3 text-xs";
      edit.textContent = text.eventEdit;
      edit.dataset.eventEdit = event.id;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "min-h-11 rounded-lg border border-gray-700 px-3 text-xs";
      remove.textContent = text.eventDelete;
      remove.dataset.eventDelete = event.id;
      actions.append(edit, remove);
      item.append(label, actions);
      return item;
    }));
  }

  function renderHistory(): void {
    const list = historyList;
    if (!list) return;
    const snapshots = history.snapshots;
    const ignoredCount = history.ignoredCount ?? 0;
    historyPanel?.classList.toggle("hidden", snapshots.length === 0 && history.ok && ignoredCount === 0);
    const note = history.ok
      ? snapshots.length ? `${snapshots.length}/50` : text.noSaved
      : history.reason === "corrupt"
        ? text.historyCorrupt
        : history.reason === "full"
          ? text.historyFull
          : history.reason === "serialization"
            ? text.historySaveInvalid
            : text.historyUnavailable;
    historyNote?.replaceChildren(document.createTextNode(ignoredCount ? `${text.historyIgnored(ignoredCount)} ${note}` : note));
    list.replaceChildren(...snapshots.map((snapshot) => {
      const item = document.createElement("li");
      item.className = "flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-800 p-3";
      const label = document.createElement("span");
      label.className = "min-w-0 break-words";
      const versionNote = isAttendanceHistoryCurrent(snapshot) ? "" : ` · ${locale === "en" ? "historical rules" : "reglas históricas"}`;
      const origin = snapshot.source === "manual" ? text.originManual : text.originCalendar;
      label.textContent = `${snapshot.subject.name} · ${new Date(snapshot.savedAt).toLocaleString(locale === "en" ? "en-US" : "es-MX")} · ${origin} · ${formatPolicy(snapshot.policy)} · ${snapshot.rulesVersion}${versionNote}`;
      const actions = document.createElement("span");
      actions.className = "flex shrink-0 gap-2";
      const view = document.createElement("details");
      view.className = "basis-full rounded-md border border-gray-800 p-3";
      const viewSummary = document.createElement("summary");
      viewSummary.className = "cursor-pointer font-medium text-gray-200";
      viewSummary.textContent = text.viewSavedResult;
      const viewResult = document.createElement("p");
      viewResult.className = "mt-2 whitespace-pre-line break-words text-sm text-gray-300";
      viewResult.textContent = text.savedWithRules(snapshot.rulesVersion) + "\n" + formatHistoryResult(snapshot.result as PolicyAttendanceResult);
      view.append(viewSummary, viewResult);
      const restore = document.createElement("button");
      restore.type = "button";
      restore.className = "min-h-11 rounded-lg border border-gray-700 px-3 text-xs";
      restore.textContent = text.restore;
      restore.dataset.historyRestore = snapshot.id;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "min-h-11 rounded-lg border border-gray-700 px-3 text-xs";
      remove.textContent = text.eventDelete;
      remove.dataset.historyDelete = snapshot.id;
      actions.append(restore, remove);
      item.append(label, actions, view);
      return item;
    }));
  }

  function selectSubject(id: string): void {
    saveSubjectDraft();
    const next = subjects.find((item) => item.id === id);
    if (!next) return;
    subject = next;
    source = subject.source;
    events = [...subject.events];
    syncSubjectToForm();
    update();
  }

  function syncSubjectToForm(): void {
    syncing = true;
    setValue("totalClasses", subject.manual.totalClasses);
    setValue("attendedClasses", subject.manual.attendedClasses);
    setValue("absences", subject.manual.absences);
    setValue("requiredPercent", subject.manual.requiredPercent || "80");
    setValue("remainingClasses", subject.manual.remainingClasses);
    setValue("courseTotalClasses", subject.manual.courseTotalClasses ?? "");
    setValue("justifiedAbsences", subject.manual.justifiedAbsences ?? "");
    setValue("tardyClasses", subject.manual.tardyClasses ?? "");
    const targetMode = query<HTMLButtonElement>(`[data-mode-button="${subject.manual.mode}"]`);
    targetMode?.click();
    const targetCalendarMode = query<HTMLButtonElement>(`[data-calendar-mode-button="${subject.manual.calendarMode ?? "remaining"}"]`);
    targetCalendarMode?.click();
    setValue("totalClasses", subject.manual.totalClasses);
    setValue("attendedClasses", subject.manual.attendedClasses);
    setValue("absences", subject.manual.absences);
    setValue("requiredPercent", subject.manual.requiredPercent || "80");
    setValue("remainingClasses", subject.manual.remainingClasses);
    setValue("courseTotalClasses", subject.manual.courseTotalClasses ?? "");
    const justified = query<HTMLSelectElement>("[data-policy-justified]");
    const tardy = query<HTMLSelectElement>("[data-policy-tardy]");
    const rounding = query<HTMLSelectElement>("[data-policy-rounding]");
    if (justified) justified.value = subject.policy.justified;
    if (tardy) tardy.value = subject.policy.tardyConversion ? String(subject.policy.tardyConversion) : "";
    if (rounding) rounding.value = subject.policy.rounding === "exact" ? "exact" : String(subject.policy.rounding.decimals);
    const complete = query<HTMLInputElement>("[data-calendar-complete]");
    if (complete) complete.checked = subject.calendarComplete;
    syncing = false;
  }

  function addEvent(): void {
    try {
      const date = query<HTMLInputElement>("[data-event-date]")?.value ?? "";
      const label = query<HTMLInputElement>("[data-event-label]")?.value ?? "";
      const statusValue = (query<HTMLSelectElement>("[data-event-status]")?.value ?? "attended") as AttendanceEventStatus;
      const event = validateCalendarEvent({ id: editingEventId ?? createStableId("event"), date, label, status: statusValue });
      events = upsertCalendarEvent(events, event);
      editingEventId = null;
      if (calendarError) { calendarError.textContent = ""; calendarError.classList.add("hidden"); }
      const labelInput = query<HTMLInputElement>("[data-event-label]");
      if (labelInput) labelInput.value = "";
      update();
    } catch (error) {
      if (calendarError) {
        calendarError.textContent = error instanceof Error ? error.message : text.invalid;
        calendarError.classList.remove("hidden");
      }
    }
  }

  function saveResult(): void {
    const context = getAttendanceContext(root);
    if (!context?.valid || !context.result || !context.summary) { setStatus(text.noSaved, "error"); return; }
    const snapshot = createAttendanceHistorySnapshot({
      subject: context.subject,
      input: context.input.kind === "manual"
        ? { ...context.input.values }
        : {
            events: [...context.input.events],
            calendarComplete: context.input.calendarComplete,
            requiredPercent: value("requiredPercent"),
          },
      policy: context.policy,
      source: context.source,
      result: context.result,
    });
    const stored = appendAttendanceHistory(getSessionStorage(), snapshot);
    history = stored;
    if (stored.ok) setStatus(text.saved, "success");
    else setStatus(
      stored.reason === "full"
        ? text.historyFull
        : stored.reason === "corrupt"
          ? text.historyCorrupt
          : stored.reason === "serialization"
            ? text.historySaveInvalid
            : text.historyUnavailable,
      "error",
    );
    renderHistory();
  }

  function exportResult(): void {
    const context = getAttendanceContext(root);
    if (!context?.valid || !context.result) { setStatus(text.noExport, "error"); return; }
    const csv = buildAttendanceCsv([policyAttendanceToCsvRow(context.subject.name, context.source, context.result)]);
    downloadAttendanceCsv(csv, "attendance-" + context.subject.id + ".csv");
    setStatus(text.csv, "success");
  }

  function restoreSnapshot(value: unknown): void {
    let snapshot: AttendanceHistorySnapshot | null = null;
    let recalculated: PolicyAttendanceResult | null = null;
    let prepared: ReturnType<typeof prepareAttendanceRestore> | null = null;
    try {
      snapshot = validateAttendanceHistorySnapshot(value);
      recalculated = recalculateSnapshot(snapshot);
      const subjectExists = subjects.some((item) => item.id === snapshot.subject.id);
      if (!subjectExists && subjects.length >= 20) {
        setStatus(text.subjectLimit, "error");
        return;
      }
      prepared = prepareAttendanceRestore(subjects, snapshot);
    } catch {
      setStatus(text.historyInvalid, "error");
      return;
    }
    if (!snapshot || !recalculated || !prepared) {
      setStatus(text.historyInvalid, "error");
      return;
    }

    subjects = prepared.subjects;
    emptyStart = false;
    subject = prepared.subject;
    source = subject.source;
    events = subject.events.map((event) => ({ ...event }));
    editingEventId = null;
    persistSubjects(subjects);
    syncSubjectToForm();
    update();
    setStatus(text.restored, "success");
    showHistoryComparison(snapshot, recalculated);
  }

  function recalculateSnapshot(snapshot: AttendanceHistorySnapshot): PolicyAttendanceResult {
    if (snapshot.source === "manual") {
      const input = snapshot.input as ManualAttendanceValues;
      const total = adapter.parseAttendanceInteger(input.totalClasses, { allowZero: false, max: 1_000 });
      const minimum = adapter.parseAttendancePercent(input.requiredPercent);
      if (!total.ok || !minimum.ok) throw new RangeError("Invalid restored manual inputs.");
      const mode = input.mode;
      const active = adapter.parseAttendanceInteger(
        mode === "attended" ? input.attendedClasses : input.absences,
        { allowZero: true, max: total.value },
      );
      if (!active.ok) throw new RangeError("Invalid restored attendance count.");
      const attendedClasses = mode === "attended" ? active.value : total.value - active.value;
      const justifiedInput = input.justifiedAbsences ?? "";
      const tardyInput = input.tardyClasses ?? "";
      const justifiedAbsences = justifiedInput.trim()
        ? adapter.parseAttendanceInteger(justifiedInput, { allowZero: true, max: total.value - attendedClasses })
        : { ok: true as const, value: 0 };
      const tardyClasses = tardyInput.trim()
        ? adapter.parseAttendanceInteger(tardyInput, { allowZero: true, max: attendedClasses })
        : { ok: true as const, value: 0 };
      if (!justifiedAbsences.ok || !tardyClasses.ok) throw new RangeError("Invalid restored policy counts.");
      let remainingClasses: number | null;
      if ((input.calendarMode ?? "remaining") === "remaining") {
        const remaining = adapter.parseAttendanceRemaining(input.remainingClasses);
        if (!remaining.ok) throw new RangeError("Invalid restored remaining classes.");
        remainingClasses = remaining.value;
      } else {
        const courseTotal = adapter.parseAttendanceInteger(input.courseTotalClasses ?? "", { allowZero: true, max: 2_000 });
        if (!courseTotal.ok || courseTotal.value === 0 || courseTotal.value < total.value || courseTotal.value - total.value > 1_000) {
          if (input.courseTotalClasses?.trim()) throw new RangeError("Invalid restored course total.");
          remainingClasses = null;
        } else {
          remainingClasses = courseTotal.value - total.value;
        }
      }
      return calculatePolicyAttendance({
        totalClasses: total.value,
        attendedClasses,
        justifiedAbsences: justifiedAbsences.value,
        tardyClasses: tardyClasses.value,
        requiredPercent: minimum,
        remainingClasses,
        policy: snapshot.policy,
      });
    }

    const input = snapshot.input as {
      events: AttendanceCalendarEvent[];
      calendarComplete: boolean;
      requiredPercent?: string;
    };
    const counts = summarizeCalendar(input.events, input.calendarComplete);
    const minimum = adapter.parseAttendancePercent(
      input.requiredPercent ?? String((snapshot.result as PolicyAttendanceResult).requiredPercent),
    );
    if (!minimum.ok || counts.completedClasses < 1) throw new RangeError("Invalid restored calendar inputs.");
    return calculatePolicyAttendance({
      totalClasses: counts.completedClasses,
      attendedClasses: counts.attendedClasses,
      justifiedAbsences: counts.justifiedAbsences,
      tardyClasses: counts.tardyClasses,
      requiredPercent: minimum,
      remainingClasses: counts.remainingClasses,
      policy: snapshot.policy,
    });
  }

  function setStatus(message: string, kind: "success" | "error"): void {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("text-emerald-300", kind === "success");
    status.classList.toggle("text-red-300", kind === "error");
  }

  function showInitial(message: string): void {
    initial?.classList.remove("hidden");
    results?.classList.add("hidden");
    if (initial) initial.textContent = message;
  }

  function setText(selector: string, content: string): void {
    const element = query<HTMLElement>(selector);
    if (element) element.textContent = content;
  }

  function setColor(element: Element | null, color: string): void {
    element?.classList.remove("text-white", "text-emerald-300", "text-amber-300", "text-red-300");
    element?.classList.add(color);
  }

  function formatCount(value: number): string {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", { maximumFractionDigits: 0 }).format(value);
  }

  function formatPercent(value: number): string {
    return `${new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", { maximumFractionDigits: 2 }).format(value)}%`;
  }

  function formatSignedPercent(value: number): string {
    const formatted = formatPercent(Math.abs(value));
    return `${value < 0 ? "-" : "+"}${formatted}`;
  }

  function formatPolicy(policy: AttendancePolicy): string {
    const justified = policy.justified === "absence" ? (locale === "en" ? "justified=absence" : "justificadas=falta") : policy.justified === "exclude" ? (locale === "en" ? "justified=excluded" : "justificadas=excluidas") : (locale === "en" ? "justified=credit" : "justificadas=asistencia");
    const tardy = policy.tardyConversion ? `k=${policy.tardyConversion}` : (locale === "en" ? "tardies=none" : "retardos=ninguno");
    const rounding = policy.rounding === "exact" ? (locale === "en" ? "rounding=exact" : "redondeo=exacto") : `${locale === "en" ? "rounding" : "redondeo"}=${policy.rounding.decimals}`;
    return `${justified}; ${tardy}; ${rounding}`;
  }

  function formatHistoryResult(result: PolicyAttendanceResult): string {
    const projection = result.projection;
    const statusLabels: Record<string, string> = {
      unknown: text.unknown,
      undefined: text.noClasses,
      finished_meets: text.finishedMeets,
      finished_below: text.finishedBelow,
      impossible: text.impossible,
      guaranteed: text.guaranteed,
      possible: text.possible,
    };
    const lines = [
      text.historyCurrent + ": " +
        (result.currentPercent === null ? text.noClasses : formatPercent(result.currentPercent)) +
        " · " + (result.currentStatus === "meets" ? text.meets : result.currentStatus === "below" ? text.below : text.noClasses),
      `${text.justifiedCount}: ${formatCount(result.justifiedAbsences)}`,
      `${text.tardyCount}: ${formatCount(result.tardyClasses)}`,
      `${text.tardyPenalty}: ${formatCount(result.tardyPenalty)}`,
      `${result.policy.tardyConversion === null ? text.tardyUnconverted : text.tardyRemainder}: ${formatCount(result.tardyRemainder)}`,
      text.historyProjection + ": " + (statusLabels[projection.status] ?? projection.status),
    ];
    if (projection.status !== "unknown" && projection.status !== "undefined") {
      lines.push(
        text.historyMinimumFinal + ": " + formatCount(projection.minimumAttendancesFinal),
        text.historyAvailableAbsences + ": " + formatCount(projection.availableAbsences),
        text.historyNeededAttendances + ": " + formatCount(projection.requiredAttendancesFromRemaining),
        text.historyMaximumFinal + ": " + formatPercent(projection.maxPossiblePercent),
      );
    }
    lines.push(text.policy + ": " + formatPolicy(result.policy));
    return lines.join("\n");
  }

  function showHistoryComparison(
    snapshot: AttendanceHistorySnapshot,
    recalculated: PolicyAttendanceResult,
  ): void {
    if (isAttendanceHistoryCurrent(snapshot)) {
      historyComparison?.classList.add("hidden");
      return;
    }
    const saved = snapshot.result as PolicyAttendanceResult;
    setText("[data-history-comparison-heading]", text.historyComparison + " · " + snapshot.subject.name);
    setText("[data-history-saved-label]", text.savedResultLabel + " · " + snapshot.rulesVersion);
    setText("[data-history-recalculated-label]", text.recalculatedResultLabel + " · " + ATTENDANCE_PHASE2_RULES_VERSION);
    setText("[data-history-saved-result]", formatHistoryResult(saved));
    setText("[data-history-recalculated-result]", formatHistoryResult(recalculated));
    const statusChanged = saved.currentStatus !== recalculated.currentStatus ||
      saved.projection.status !== recalculated.projection.status;
    const numbersChanged = JSON.stringify(historyResultNumbers(saved)) !== JSON.stringify(historyResultNumbers(recalculated));
    const changes = [
      ...(statusChanged ? [text.historyStatusChanged] : []),
      ...(numbersChanged ? [text.historyNumbersChanged] : []),
    ];
    setText("[data-history-differences]", changes.length ? changes.join(" ") : text.historyNoChanges);
    historyComparison?.classList.remove("hidden");
  }

  function historyResultNumbers(result: PolicyAttendanceResult): unknown[] {
    const projection = result.projection;
    return [
      result.totalClasses,
      result.attendedClasses,
      result.originalAbsences,
      result.justifiedAbsences,
      result.tardyClasses,
      result.requiredPercentScaled,
      result.effectiveTotalClasses,
      result.effectiveAttendedClasses,
      result.effectiveAbsences,
      result.tardyPenalty,
      result.tardyRemainder,
      result.currentPercent,
      result.currentEvaluatedPercent,
      projection.status === "unknown" ? null : projection.remainingClasses,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.finalTotalClasses,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.minimumAttendancesFinal,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.maximumFinalAbsences,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.availableAbsences,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.exceededAbsences,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.requiredAttendancesFromRemaining,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.maxPossiblePercent,
      projection.status === "unknown" || projection.status === "undefined" ? null : projection.finalEvaluatedPercent,
    ];
  }

  query<HTMLSelectElement>("[data-subject-select]")?.addEventListener("change", (event) => selectSubject((event.target as HTMLSelectElement).value));
  query<HTMLButtonElement>("[data-add-subject]")?.addEventListener("click", () => {
    const name = window.prompt(text.subjectPrompt, locale === "en" ? `Subject ${subjects.length + 1}` : `Materia ${subjects.length + 1}`);
    if (!name) return;
    try {
      saveSubjectDraft();
      subjects = addAttendanceSubject(subjects, name);
      subject = subjects[subjects.length - 1];
      emptyStart = false;
      source = subject.source;
      events = [];
      syncSubjectToForm();
      persistSubjects(subjects);
      update();
    } catch { setStatus(text.subjectLimit, "error"); }
  });
  query<HTMLButtonElement>("[data-rename-subject]")?.addEventListener("click", () => {
    const name = window.prompt(text.renamePrompt, subject.name);
    if (!name) return;
    try { subjects = renameAttendanceSubject(subjects, subject.id, name); subject = subjects.find((item) => item.id === subject.id) ?? subject; persistSubjects(subjects); renderSubjectUi(); }
    catch { setStatus(text.invalid, "error"); }
  });
  query<HTMLButtonElement>("[data-delete-subject]")?.addEventListener("click", () => {
    if (!subjects.some((item) => item.id === subject.id) || !window.confirm(text.deleteConfirm)) return;
    if (history.snapshots.some((snapshot) => snapshot.subject.id === subject.id)) {
      const remainingHistory = deleteAttendanceHistoryForSubject(getSessionStorage(), subject.id);
      if (!remainingHistory.ok) { setStatus(text.historyUnavailable, "error"); return; }
      history = remainingHistory;
    }
    subjects = removeAttendanceSubject(subjects, subject.id);
    emptyStart = subjects.length === 0;
    subject = subjects[0] ?? createAttendanceSubject(locale === "en" ? "Subject 1" : "Materia 1");
    source = subject.source;
    events = [...subject.events];
    persistSubjects(subjects);
    syncSubjectToForm();
    showInitial(text.deleted);
    update();
    setStatus(text.deleted, "success");
  });
  queryAll<HTMLButtonElement>("[data-source-button]").forEach((button) => button.addEventListener("click", () => {
    const next = button.dataset.sourceButton === "calendar" ? "calendar" : "manual" as AttendanceSource;
    if (next === source) return;
    const hasData = source === "calendar"
      ? events.length > 0
      : [subject.manual.totalClasses, subject.manual.attendedClasses, subject.manual.absences, subject.manual.remainingClasses].some(Boolean);
    if (hasData && !window.confirm(text.sourceConfirm)) return;
    saveSubjectDraft();
    source = next;
    subject.source = source;
    events = [...subject.events];
    persistSubjects(subjects);
    update();
  }));
  query<HTMLButtonElement>("[data-add-event]")?.addEventListener("click", addEvent);
  query<HTMLInputElement>("[data-calendar-complete]")?.addEventListener("change", (event) => { subject.calendarComplete = (event.target as HTMLInputElement).checked; update(); });
  query<HTMLElement>("[data-event-list]")?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const editId = target.dataset.eventEdit;
    const deleteId = target.dataset.eventDelete;
    if (editId) {
      const item = events.find((eventItem) => eventItem.id === editId);
      if (!item) return;
      editingEventId = item.id;
      const date = query<HTMLInputElement>("[data-event-date]");
      const label = query<HTMLInputElement>("[data-event-label]");
      const eventStatus = query<HTMLSelectElement>("[data-event-status]");
      if (date) date.value = item.date;
      if (label) label.value = item.label;
      if (eventStatus) eventStatus.value = item.status;
    }
    if (deleteId) { events = removeCalendarEvent(events, deleteId); update(); }
  });
  queryAll<Element>("[data-policy-justified], [data-policy-tardy], [data-policy-rounding]").forEach((element) => element.addEventListener("change", update));
  queryAll<HTMLInputElement>("[data-field]").forEach((element) => element.addEventListener("input", update));
  queryAll<HTMLButtonElement>("[data-mode-button]").forEach((button) => button.addEventListener("click", () => { if (!syncing) window.setTimeout(update, 0); }));
  queryAll<HTMLButtonElement>("[data-calendar-mode-button]").forEach((button) => button.addEventListener("click", () => { if (!syncing) window.setTimeout(update, 0); }));
  queryAll<HTMLButtonElement>("[data-example-id]").forEach((button) => button.addEventListener("click", () => window.setTimeout(update, 0)));
  query<HTMLButtonElement>("[data-clear]")?.addEventListener("click", () => {
    window.setTimeout(() => {
      if (source === "calendar") { events = []; subject.events = []; subject.calendarComplete = false; }
      else subject.manual = { totalClasses: "", mode: "attended", attendedClasses: "", absences: "", requiredPercent: "80", remainingClasses: "", justifiedAbsences: "", tardyClasses: "", calendarMode: "remaining", courseTotalClasses: "" };
      saveSubjectDraft();
      update();
      setStatus(text.cleared, "success");
    }, 0);
  });
  saveButton?.addEventListener("click", saveResult);
  exportButton?.addEventListener("click", exportResult);
  query<HTMLButtonElement>("[data-delete-history]")?.addEventListener("click", () => {
    history = clearAttendanceHistory(getSessionStorage());
    renderHistory();
    setStatus(history.ok ? text.clearedHistory : text.historyUnavailable, history.ok ? "success" : "error");
  });
  historyList?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const restoreId = target.dataset.historyRestore;
    const deleteId = target.dataset.historyDelete;
    if (restoreId && history.ok) {
      const snapshot = history.snapshots.find((item) => item.id === restoreId);
      if (snapshot) restoreSnapshot(snapshot);
    }
    if (deleteId) {
      history = deleteAttendanceHistorySnapshot(getSessionStorage(), deleteId);
      renderHistory();
      setStatus(history.ok ? text.deletedHistory : history.reason === "corrupt" ? text.historyCorrupt : text.historyUnavailable, history.ok ? "success" : "error");
    }
  });

  syncSubjectToForm();
  renderSubjectUi();
  update();
}

function loadSubjects(): AttendanceSubject[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ATTENDANCE_SUBJECTS_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 20) return null;
    if (parsed.length === 0) return [];
    const valid = parsed.filter(isSubject);
    if (!valid.length) return null;
    return valid.map((item) => ({
      ...item,
      manual: {
        ...item.manual,
        justifiedAbsences: typeof item.manual.justifiedAbsences === "string" ? item.manual.justifiedAbsences : "",
        tardyClasses: typeof item.manual.tardyClasses === "string" ? item.manual.tardyClasses : "",
      },
      policy: normalizeAttendancePolicy(item.policy),
      events: item.events.filter((event) => { try { validateCalendarEvent(event); return true; } catch { return false; } }),
    }));
  } catch { return null; }
}

function isSubject(value: unknown): value is AttendanceSubject {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<AttendanceSubject>;
  return typeof item.id === "string" && typeof item.name === "string" &&
    (item.source === "manual" || item.source === "calendar") && Array.isArray(item.events) &&
    typeof item.manual === "object" && item.manual !== null && typeof item.policy === "object" && item.policy !== null;
}

function persistSubjects(subjects: readonly AttendanceSubject[]): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(ATTENDANCE_SUBJECTS_KEY, JSON.stringify(subjects)); } catch { /* A blocked local store must not block calculation. */ }
}

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage; } catch { return null; }
}

function isDefaultPolicy(policy: AttendancePolicy): boolean {
  return policy.justified === DEFAULT_ATTENDANCE_POLICY.justified &&
    policy.tardyConversion === DEFAULT_ATTENDANCE_POLICY.tardyConversion &&
    policy.rounding === DEFAULT_ATTENDANCE_POLICY.rounding;
}
