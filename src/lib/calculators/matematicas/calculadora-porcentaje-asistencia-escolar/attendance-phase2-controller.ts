import * as es from "./attendance";
import * as en from "./attendance.en";
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
  deleteAttendanceHistorySnapshot,
  downloadAttendanceCsv,
  normalizeAttendancePolicy,
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
  DEFAULT_ATTENDANCE_POLICY,
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
    subjectPrompt: "Escribe el nombre de la materia.",
    subjectLimit: "Alcanzaste el límite de 20 materias por sesión.",
    renamePrompt: "Escribe el nuevo nombre de la materia.",
    deleteConfirm: "¿Eliminar esta materia y sus datos? Esta acción no se puede deshacer.",
    deleted: "Materia eliminada.",
    saved: "Resultado guardado en esta sesión.",
    historyFull: "El historial alcanzó 50 instantáneas. Borra alguna antes de guardar otra.",
    historyUnavailable: "No se pudo guardar en esta sesión; el cálculo sigue disponible.",
    historyCorrupt: "Se ignoraron datos guardados incompatibles.",
    restored: "Entradas restauradas y recalculadas con las reglas actuales.",
    deletedHistory: "Instantánea eliminada.",
    clearedHistory: "Historial borrado.",
    csv: "CSV generado.",
    noSaved: "No hay un resultado válido para guardar.",
    noExport: "No hay un resultado válido para exportar.",
    noClasses: "Sin clases computables",
    undefined: "Indefinido",
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
    historyInvalid: "No se pudo restaurar esta instantánea.",
    policy: "Política utilizada",
  },
  en: {
    initial: "Enter valid data to calculate.",
    calendarEmpty: "Register at least one completed class before using the calendar.",
    invalid: "Check this subject's data.",
    sourceConfirm: "Changing the source replaces the data that feeds the calculation. Continue?",
    subjectPrompt: "Enter the subject name.",
    subjectLimit: "You reached the 20-subject session limit.",
    renamePrompt: "Enter the new subject name.",
    deleteConfirm: "Delete this subject and its data? This cannot be undone.",
    deleted: "Subject deleted.",
    saved: "Result saved in this session.",
    historyFull: "The history has 50 snapshots. Delete one before saving another.",
    historyUnavailable: "This session could not save the result; the calculation is still available.",
    historyCorrupt: "Incompatible saved data was ignored.",
    restored: "Inputs restored and recalculated with the current rules.",
    deletedHistory: "Snapshot deleted.",
    clearedHistory: "History deleted.",
    csv: "CSV generated.",
    noSaved: "There is no valid result to save.",
    noExport: "There is no valid result to export.",
    noClasses: "No computable classes",
    undefined: "Undefined",
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
    historyInvalid: "This snapshot could not be restored.",
    policy: "Policy used",
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
  if (!subjects.length) subjects = [createAttendanceSubject(locale === "en" ? "Subject 1" : "Materia 1")];
  let subject = subjects[0];
  let source: AttendanceSource = subject.source;
  let events = [...subject.events];
  let syncing = false;
  let editingEventId: string | null = null;
  let currentResult: PolicyAttendanceResult | null = null;
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
  const calendarError = query<HTMLElement>("[data-calendar-error]");
  queryAll<HTMLElement>("[data-requires-js]").forEach((element) => element.removeAttribute("disabled"));

  function update(): void {
    if (syncing) return;
    saveSubjectDraft();
    const parsed = readActiveInput();
    currentResult = parsed;
    saveButton?.toggleAttribute("disabled", !parsed);
    exportButton?.toggleAttribute("disabled", !parsed);
    if (!parsed) {
      if (source === "calendar" && summarizeCalendar(events, subject.calendarComplete).completedClasses === 0) {
        showInitial(text.calendarEmpty);
      }
      renderSubjectUi();
      return;
    }
    renderPhase2Result(parsed);
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
      if (!total.ok || !percent.ok || !calendar.ok || !active.ok) return null;
      const attended = mode === "attended" ? active.value : total.value - active.value;
      return calculatePolicyAttendance({
        totalClasses: total.value,
        attendedClasses: attended,
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

  function renderPhase2Result(result: PolicyAttendanceResult): void {
    initial?.classList.add("hidden");
    results?.classList.remove("hidden");
    const usesExtendedModel = source === "calendar" || !isDefaultPolicy(result.policy);
    if (!usesExtendedModel) {
      setText("[data-result-policy]", `${text.policy}: ${formatPolicy(result.policy)}`);
      setText("[data-result-origin]", `${locale === "en" ? "Origin" : "Origen"}: ${text.originManual}`);
      setText("[data-detail-effective]", `${result.effectiveAttendedClasses}/${result.effectiveTotalClasses}`);
      return;
    }
    const currentPercent = result.currentPercent === null ? text.undefined : formatPercent(result.currentPercent);
    setText("[data-result-percent]", currentPercent);
    setText("[data-result-current-status]", result.currentStatus === "meets" ? text.meets : result.currentStatus === "below" ? text.below : text.noClasses);
    setText("[data-result-rounding]", result.policy.rounding === "exact" || result.currentPercent === null
      ? ""
      : `${locale === "en" ? "Real" : "Real"}: ${formatPercent(result.currentPercent)} · ${locale === "en" ? "evaluated" : "evaluado"}: ${formatPercent(result.currentEvaluatedPercent ?? result.currentPercent)}`);
    setText("[data-result-policy]", `${text.policy}: ${formatPolicy(result.policy)}`);
    setText("[data-result-origin]", `${locale === "en" ? "Origin" : "Origen"}: ${source === "manual" ? text.originManual : text.originCalendar}`);
    setText("[data-detail-effective]", result.effectiveTotalClasses === 0
      ? text.noClasses
      : `${result.effectiveAttendedClasses}/${result.effectiveTotalClasses}`);
    setText("[data-detail-total]", formatCount(result.totalClasses));
    setText("[data-detail-attended]", formatCount(result.attendedClasses));
    setText("[data-detail-absences]", formatCount(result.originalAbsences));
    setText("[data-detail-minimum]", formatPercent(result.requiredPercent));
    setText("[data-detail-remaining]", result.projection.status === "unknown" ? (locale === "en" ? "Not provided" : "No indicadas") : formatCount(result.projection.remainingClasses));
    const projection = result.projection;
    const known = projection.status !== "unknown";
    setText("[data-result-condition]", projection.status !== "unknown" && projection.status !== "undefined" && result.policy.rounding !== "exact"
      ? `${locale === "en" ? "Final maximum real" : "Máximo final real"}: ${formatPercent(projection.maxPossiblePercent)} · ${locale === "en" ? "evaluated" : "evaluado"}: ${formatPercent(projection.finalEvaluatedPercent)}`
      : "");
    queryAll<HTMLElement>("[data-known-detail]").forEach((element) => element.classList.toggle("hidden", !known));
    if (known && projection.status !== "undefined") {
      setText("[data-detail-final-total]", formatCount(projection.finalTotalClasses));
      setText("[data-detail-max-absences]", formatCount(projection.maximumFinalAbsences));
      setText("[data-detail-max-final]", formatPercent(projection.maxPossiblePercent));
      setText("[data-detail-excess]", projection.exceededAbsences ? formatCount(projection.exceededAbsences) : "0");
    }
    const labels: Record<string, string> = {
      unknown: text.unknown,
      undefined: text.noClasses,
      finished_meets: text.finishedMeets,
      finished_below: text.finishedBelow,
      impossible: text.impossible,
      guaranteed: text.guaranteed,
      possible: text.possible,
    };
    setText("[data-result-projection]", labels[projection.status] ?? projection.status);
    setText("[data-result-action]", buildActionMessage(result));
    setText("[data-result-available]", projection.status === "unknown" || projection.status === "undefined" ? "—" : formatCount(projection.availableAbsences));
    setText("[data-result-needed]", projection.status === "unknown" || projection.status === "undefined" ? "—" : formatCount(projection.requiredAttendancesFromRemaining));
    setText("[data-detail-recovery]", formatRecovery(result));
    setText("[data-detail-margin]", result.currentPercent === null ? "—" : formatSignedPercent((result.currentPercent - result.requiredPercent)));
  }

  function buildActionMessage(result: PolicyAttendanceResult): string {
    const projection = result.projection;
    if (projection.status === "unknown") return text.unknown;
    if (projection.status === "undefined") return text.noClasses;
    if (projection.status === "finished_meets") return text.finishedMeets;
    if (projection.status === "finished_below") return text.finishedBelow;
    if (projection.status === "impossible") return `${text.impossible}: ${formatCount(projection.requiredAttendancesFromRemaining)} / ${formatCount(projection.remainingClasses)}`;
    if (projection.status === "guaranteed") return text.guaranteed;
    return `${text.possible}: ${formatCount(projection.requiredAttendancesFromRemaining)} / ${formatCount(projection.remainingClasses)}`;
  }

  function formatRecovery(result: PolicyAttendanceResult): string {
    const recovery = calculatePolicyRecovery(result);
    if (recovery.status === "undefined") return text.noClasses;
    if (recovery.status === "impossible") return locale === "en" ? "100% cannot be recovered with recorded absences." : "El 100% no se puede recuperar con faltas registradas.";
    if (recovery.classes === 0) return locale === "en" ? "Already meets the current minimum." : "Ya alcanzas el mínimo actual.";
    return `${formatCount(recovery.classes)} ${locale === "en" ? "consecutive attendance(s)" : "clase(s) seguidas"}`;
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
      calendarMode: getCalendarMode(),
      courseTotalClasses: value("courseTotalClasses"),
    };
    subjects = subjects.map((item) => item.id === subject.id ? subject : item);
    persistSubjects(subjects);
  }

  function readPolicySafe(): AttendancePolicy {
    try { return readPolicy(); } catch { return { ...DEFAULT_ATTENDANCE_POLICY }; }
  }

  function renderSubjectUi(): void {
    const select = query<HTMLSelectElement>("[data-subject-select]");
    if (select) {
      select.replaceChildren(...subjects.map((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        option.selected = item.id === subject.id;
        return option;
      }));
    }
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
      label.textContent = `${event.date} · ${event.status}${event.label ? ` · ${event.label}` : ""}`;
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
    const snapshots = history.ok ? history.snapshots : [];
    historyPanel?.classList.toggle("hidden", snapshots.length === 0 && history.ok);
    historyNote?.replaceChildren(document.createTextNode(history.ok ? (snapshots.length ? `${snapshots.length}/50` : text.noSaved) : text.historyCorrupt));
    list.replaceChildren(...snapshots.map((snapshot) => {
      const item = document.createElement("li");
      item.className = "flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-800 p-3";
      const label = document.createElement("span");
      label.className = "min-w-0 break-words";
      const versionNote = isAttendanceHistoryCurrent(snapshot) ? "" : ` · ${locale === "en" ? "historical rules" : "reglas históricas"}`;
      label.textContent = `${snapshot.subject.name} · ${new Date(snapshot.savedAt).toLocaleString(locale === "en" ? "en-US" : "es-MX")} · ${formatPolicy(snapshot.policy)}${versionNote}`;
      const actions = document.createElement("span");
      actions.className = "flex shrink-0 gap-2";
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
      item.append(label, actions);
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
    const targetMode = query<HTMLButtonElement>(`[data-mode-button="${subject.manual.mode}"]`);
    targetMode?.click();
    const targetCalendarMode = query<HTMLButtonElement>(`[data-calendar-mode-button="${subject.manual.calendarMode ?? "remaining"}"]`);
    targetCalendarMode?.click();
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
    if (!currentResult) { setStatus(text.noSaved, "error"); return; }
    saveSubjectDraft();
    const snapshot = createAttendanceHistorySnapshot({
      subject: { id: subject.id, name: subject.name },
      input: source === "manual"
        ? { ...subject.manual }
        : { events: [...events], calendarComplete: subject.calendarComplete },
      policy: currentResult.policy,
      source,
      result: currentResult,
    });
    const stored = appendAttendanceHistory(getSessionStorage(), snapshot);
    history = stored;
    if (stored.ok) setStatus(text.saved, "success");
    else setStatus(stored.reason === "full" ? text.historyFull : text.historyUnavailable, "error");
    renderHistory();
  }

  function exportResult(): void {
    if (!currentResult) { setStatus(text.noExport, "error"); return; }
    const csv = buildAttendanceCsv([policyAttendanceToCsvRow(subject.name, source, currentResult)]);
    downloadAttendanceCsv(csv, `attendance-${subject.id}.csv`);
    setStatus(text.csv, "success");
  }

  function restoreSnapshot(snapshot: AttendanceHistorySnapshot): void {
    const target = subjects.find((item) => item.id === snapshot.subject.id);
    if (target) subject = target;
    else if (subjects.length < 20) {
      subject = createAttendanceSubject(snapshot.subject.name, snapshot.subject.id);
      subjects = [...subjects, subject];
    } else {
      setStatus(text.subjectLimit, "error");
      return;
    }
    source = snapshot.source;
    subject.source = source;
    subject.policy = snapshot.policy;
    if (source === "manual") subject.manual = { ...(snapshot.input as ManualAttendanceValues) };
    else {
      const calendar = snapshot.input as { events: AttendanceCalendarEvent[]; calendarComplete: boolean };
      events = [...calendar.events];
      subject.events = [...events];
      subject.calendarComplete = calendar.calendarComplete;
    }
    subjects = subjects.map((item) => item.id === subject.id ? subject : item);
    persistSubjects(subjects);
    syncSubjectToForm();
    setStatus(text.restored, "success");
    update();
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

  query<HTMLSelectElement>("[data-subject-select]")?.addEventListener("change", (event) => selectSubject((event.target as HTMLSelectElement).value));
  query<HTMLButtonElement>("[data-add-subject]")?.addEventListener("click", () => {
    const name = window.prompt(text.subjectPrompt, locale === "en" ? `Subject ${subjects.length + 1}` : `Materia ${subjects.length + 1}`);
    if (!name) return;
    try {
      saveSubjectDraft();
      subjects = addAttendanceSubject(subjects, name);
      subject = subjects[subjects.length - 1];
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
    if (subjects.length === 1) { subject = createAttendanceSubject(subject.name); subjects = [subject]; }
    else if (window.confirm(text.deleteConfirm)) {
      subjects = removeAttendanceSubject(subjects, subject.id);
      subject = subjects[0];
    } else return;
    source = subject.source; events = [...subject.events]; persistSubjects(subjects); syncSubjectToForm(); showInitial(text.deleted); update(); setStatus(text.deleted, "success");
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
  queryAll<HTMLButtonElement>("[data-mode-button]").forEach((button) => button.addEventListener("click", () => window.setTimeout(update, 0)));
  queryAll<HTMLButtonElement>("[data-calendar-mode-button]").forEach((button) => button.addEventListener("click", () => window.setTimeout(update, 0)));
  queryAll<HTMLButtonElement>("[data-example-id]").forEach((button) => button.addEventListener("click", () => window.setTimeout(update, 0)));
  query<HTMLButtonElement>("[data-clear]")?.addEventListener("click", () => {
    window.setTimeout(() => {
      if (source === "calendar") { events = []; subject.events = []; subject.calendarComplete = false; }
      else subject.manual = { totalClasses: "", mode: "attended", attendedClasses: "", absences: "", requiredPercent: "80", remainingClasses: "", calendarMode: "remaining", courseTotalClasses: "" };
      saveSubjectDraft();
      update();
    }, 0);
  });
  saveButton?.addEventListener("click", saveResult);
  exportButton?.addEventListener("click", exportResult);
  query<HTMLButtonElement>("[data-delete-history]")?.addEventListener("click", () => { history = clearAttendanceHistory(getSessionStorage()); renderHistory(); setStatus(text.clearedHistory, "success"); });
  historyList?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const restoreId = target.dataset.historyRestore;
    const deleteId = target.dataset.historyDelete;
    if (restoreId && history.ok) {
      const snapshot = history.snapshots.find((item) => item.id === restoreId);
      if (snapshot) restoreSnapshot(snapshot);
    }
    if (deleteId) { history = deleteAttendanceHistorySnapshot(getSessionStorage(), deleteId); renderHistory(); setStatus(text.deletedHistory, "success"); }
  });

  syncSubjectToForm();
  renderSubjectUi();
  update();
}

function loadSubjects(): AttendanceSubject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ATTENDANCE_SUBJECTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 20) return [];
    return parsed.filter(isSubject).map((item) => ({
      ...item,
      policy: normalizeAttendancePolicy(item.policy),
      events: item.events.filter((event) => { try { validateCalendarEvent(event); return true; } catch { return false; } }),
    }));
  } catch { return []; }
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
