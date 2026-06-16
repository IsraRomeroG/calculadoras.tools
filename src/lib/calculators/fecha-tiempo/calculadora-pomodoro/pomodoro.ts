export type PomodoroMode = "pomodoros" | "time";

export type PomodoroBlockType = "focus" | "short-break" | "long-break";

export type PomodoroWarningCode =
  | "long_session"
  | "very_long_session"
  | "unrealistic_session"
  | "no_complete_pomodoro";

export type PomodoroErrorCode =
  | "invalid_mode"
  | "invalid_pomodoros"
  | "invalid_available_minutes"
  | "invalid_focus_minutes"
  | "invalid_short_break_minutes"
  | "invalid_long_break_minutes"
  | "invalid_long_break_every"
  | "invalid_start_time"
  | "invalid_deadline_time";

export interface PomodoroPreset {
  label: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery: number;
}

export interface PomodoroPlanInput {
  mode: PomodoroMode;
  pomodoros?: number;
  availableMinutes?: number;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery: number;
  startTime?: string;
  deadlineTime?: string;
}

export interface PomodoroBlock {
  type: PomodoroBlockType;
  label: string;
  pomodoroNumber: number;
  durationMinutes: number;
  elapsedStartMinutes: number;
  elapsedEndMinutes: number;
  startTime?: string;
  endTime?: string;
}

export interface PomodoroDeadlineResult {
  availableMinutes: number;
  status: "on_time" | "exceeded";
  differenceMinutes: number;
}

export interface PomodoroWarning {
  code: PomodoroWarningCode;
}

export interface PomodoroPlanResult {
  mode: PomodoroMode;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery: number;
  pomodoros: number;
  totalMinutes: number;
  focusTotalMinutes: number;
  breakTotalMinutes: number;
  shortBreaks: number;
  longBreaks: number;
  availableMinutes?: number;
  unusedMinutes?: number;
  startTime?: string;
  endTime?: string;
  deadlineTime?: string;
  deadline?: PomodoroDeadlineResult;
  blocks: PomodoroBlock[];
  warnings: PomodoroWarning[];
}

export type ParsePomodoroNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export class PomodoroValidationError extends RangeError {
  code: PomodoroErrorCode;

  constructor(code: PomodoroErrorCode, message: string) {
    super(message);
    this.name = "PomodoroValidationError";
    this.code = code;
  }
}

export const POMODORO_PRESETS = {
  classic: {
    label: "Clasico",
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 20,
    longBreakEvery: 4,
  },
  long: {
    label: "Largo",
    focusMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 30,
    longBreakEvery: 4,
  },
  deep: {
    label: "Profundo",
    focusMinutes: 90,
    shortBreakMinutes: 15,
    longBreakMinutes: 30,
    longBreakEvery: 3,
  },
} as const satisfies Record<string, PomodoroPreset>;

export const MIN_POMODOROS = 1;
export const MAX_POMODOROS = 50;
export const MIN_FOCUS_MINUTES = 1;
export const MAX_FOCUS_MINUTES = 120;
export const MIN_BREAK_MINUTES = 0;
export const MAX_SHORT_BREAK_MINUTES = 60;
export const MAX_LONG_BREAK_MINUTES = 120;
export const MIN_LONG_BREAK_EVERY = 1;
export const MAX_LONG_BREAK_EVERY = 20;
export const MIN_AVAILABLE_MINUTES = 1;
export const MAX_AVAILABLE_MINUTES = 720;
export const MINUTES_PER_DAY = 1440;

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function calculatePomodoroPlan(
  input: PomodoroPlanInput,
): PomodoroPlanResult {
  const settings = validateInput(input);
  const startClockMinutes =
    settings.startTime === undefined ? undefined : parseClockTime(settings.startTime);
  const deadlineClockMinutes =
    settings.deadlineTime === undefined
      ? undefined
      : parseClockTime(settings.deadlineTime);

  const availableFromDeadline =
    startClockMinutes !== undefined && deadlineClockMinutes !== undefined
      ? differenceBetweenClockTimes(startClockMinutes, deadlineClockMinutes)
      : undefined;

  const base =
    settings.mode === "pomodoros"
      ? buildPlanForPomodoroCount(settings, startClockMinutes)
      : buildPlanForAvailableTime(
          {
            ...settings,
            availableMinutes:
              availableFromDeadline ?? settings.availableMinutes ?? Number.NaN,
          },
          startClockMinutes,
        );

  const deadline =
    availableFromDeadline === undefined
      ? undefined
      : buildDeadlineResult(base.totalMinutes, availableFromDeadline);

  return {
    ...base,
    startTime: settings.startTime,
    endTime:
      startClockMinutes === undefined
        ? undefined
        : formatClockTime(startClockMinutes + base.totalMinutes),
    deadlineTime: settings.deadlineTime,
    deadline,
    warnings: buildWarnings(base.totalMinutes, base.pomodoros),
  };
}

export function parseClockTime(value: string): number | null {
  const match = timePattern.exec(value.trim());

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

export function differenceBetweenClockTimes(
  startMinutes: number,
  endMinutes: number,
): number {
  let difference = endMinutes - startMinutes;

  if (difference <= 0) {
    difference += MINUTES_PER_DAY;
  }

  return difference;
}

export function formatClockTime(totalMinutes: number): string {
  const normalized =
    ((Math.round(totalMinutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatPomodoroDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) {
    throw new RangeError("La duracion debe ser finita y no negativa.");
  }

  const roundedMinutes = Math.round(minutes);
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${String(remainingMinutes).padStart(2, "0")} min`;
}

export function parsePomodoroNumber(
  value: string,
  options: { integer?: boolean; optional?: boolean } = {},
): ParsePomodoroNumberResult {
  const { integer = true, optional = false } = options;
  const trimmed = value.trim();

  if (!trimmed) {
    return optional
      ? { ok: true, value: 0, normalized: "" }
      : { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const normalized = trimmed.replace(/\s/g, "").replace(",", ".");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPlaces = normalized.split(".")[1]?.length ?? 0;

  if (integer && decimalPlaces > 0) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function buildPomodoroSummary(result: PomodoroPlanResult): string {
  if (result.pomodoros === 0) {
    const available = result.availableMinutes ?? 0;

    return `Plan Pomodoro: en ${formatPomodoroDuration(available)} no cabe un bloque completo de foco de ${result.focusMinutes} min con esta configuracion.`;
  }

  const baseSettings =
    `${result.pomodoros} ${result.pomodoros === 1 ? "pomodoro" : "pomodoros"} ` +
    `de ${result.focusMinutes} min, descansos cortos de ${result.shortBreakMinutes} min ` +
    `y descanso largo de ${result.longBreakMinutes} min cada ${result.longBreakEvery} pomodoros.`;
  const timing = [
    `Duracion total: ${formatPomodoroDuration(result.totalMinutes)}.`,
  ];

  if (result.mode === "time" && result.availableMinutes !== undefined) {
    timing.unshift(
      `En ${formatPomodoroDuration(result.availableMinutes)} caben ${result.pomodoros} ${result.pomodoros === 1 ? "pomodoro completo" : "pomodoros completos"}.`,
    );
    timing.push(
      `Tiempo libre: ${formatPomodoroDuration(result.unusedMinutes ?? 0)}.`,
    );
  }

  if (result.startTime) timing.push(`Inicio: ${result.startTime}.`);
  if (result.endTime) timing.push(`Fin estimado: ${result.endTime}.`);

  if (result.deadline) {
    timing.push(
      result.deadline.status === "on_time"
        ? `Termina a tiempo, con ${formatPomodoroDuration(result.deadline.differenceMinutes)} disponibles.`
        : `Se pasa por ${formatPomodoroDuration(Math.abs(result.deadline.differenceMinutes))}.`,
    );
  }

  return `Plan Pomodoro: ${baseSettings} ${timing.join(" ")}`;
}

function validateInput(input: PomodoroPlanInput): PomodoroPlanInput {
  if (input.mode !== "pomodoros" && input.mode !== "time") {
    throw new PomodoroValidationError(
      "invalid_mode",
      "Selecciona un modo de calculo valido.",
    );
  }

  validateIntegerRange(
    input.focusMinutes,
    MIN_FOCUS_MINUTES,
    MAX_FOCUS_MINUTES,
    "invalid_focus_minutes",
    `Los minutos de foco deben estar entre ${MIN_FOCUS_MINUTES} y ${MAX_FOCUS_MINUTES}.`,
  );
  validateIntegerRange(
    input.shortBreakMinutes,
    MIN_BREAK_MINUTES,
    MAX_SHORT_BREAK_MINUTES,
    "invalid_short_break_minutes",
    `El descanso corto debe estar entre ${MIN_BREAK_MINUTES} y ${MAX_SHORT_BREAK_MINUTES} minutos.`,
  );
  validateIntegerRange(
    input.longBreakMinutes,
    MIN_BREAK_MINUTES,
    MAX_LONG_BREAK_MINUTES,
    "invalid_long_break_minutes",
    `El descanso largo debe estar entre ${MIN_BREAK_MINUTES} y ${MAX_LONG_BREAK_MINUTES} minutos.`,
  );
  validateIntegerRange(
    input.longBreakEvery,
    MIN_LONG_BREAK_EVERY,
    MAX_LONG_BREAK_EVERY,
    "invalid_long_break_every",
    `La frecuencia de descanso largo debe estar entre ${MIN_LONG_BREAK_EVERY} y ${MAX_LONG_BREAK_EVERY}.`,
  );

  if (input.mode === "pomodoros") {
    validateIntegerRange(
      input.pomodoros,
      MIN_POMODOROS,
      MAX_POMODOROS,
      "invalid_pomodoros",
      `Los pomodoros deben estar entre ${MIN_POMODOROS} y ${MAX_POMODOROS}.`,
    );
  } else if (
    input.availableMinutes !== undefined &&
    input.deadlineTime === undefined
  ) {
    validateIntegerRange(
      input.availableMinutes,
      MIN_AVAILABLE_MINUTES,
      MAX_AVAILABLE_MINUTES,
      "invalid_available_minutes",
      `El tiempo disponible debe estar entre ${MIN_AVAILABLE_MINUTES} y ${MAX_AVAILABLE_MINUTES} minutos.`,
    );
  }

  if (input.startTime !== undefined && parseClockTime(input.startTime) === null) {
    throw new PomodoroValidationError(
      "invalid_start_time",
      "La hora de inicio debe tener formato HH:mm.",
    );
  }

  if (
    input.deadlineTime !== undefined &&
    parseClockTime(input.deadlineTime) === null
  ) {
    throw new PomodoroValidationError(
      "invalid_deadline_time",
      "La hora limite debe tener formato HH:mm.",
    );
  }

  return input;
}

function buildPlanForPomodoroCount(
  input: PomodoroPlanInput,
  startClockMinutes?: number,
): PomodoroPlanResult {
  const pomodoros = input.pomodoros ?? 0;
  const counters = createCounters(input.mode, input);
  let elapsedMinutes = 0;

  for (let pomodoroNumber = 1; pomodoroNumber <= pomodoros; pomodoroNumber += 1) {
    counters.blocks.push(
      buildBlock(
        "focus",
        pomodoroNumber,
        input.focusMinutes,
        elapsedMinutes,
        startClockMinutes,
      ),
    );
    counters.focusTotalMinutes += input.focusMinutes;
    elapsedMinutes += input.focusMinutes;

    if (pomodoroNumber < pomodoros) {
      const breakType = getBreakType(pomodoroNumber, input.longBreakEvery);
      const durationMinutes =
        breakType === "long-break"
          ? input.longBreakMinutes
          : input.shortBreakMinutes;

      addBreak(counters, breakType, pomodoroNumber, durationMinutes, elapsedMinutes, startClockMinutes);
      elapsedMinutes += durationMinutes;
    }
  }

  return finalizePlan(counters, elapsedMinutes, pomodoros);
}

function buildPlanForAvailableTime(
  input: PomodoroPlanInput & { availableMinutes: number },
  startClockMinutes?: number,
): PomodoroPlanResult {
  validateIntegerRange(
    input.availableMinutes,
    MIN_AVAILABLE_MINUTES,
    input.deadlineTime === undefined ? MAX_AVAILABLE_MINUTES : MINUTES_PER_DAY,
    "invalid_available_minutes",
    "El tiempo disponible debe ser un numero entero de minutos valido.",
  );

  const counters = createCounters(input.mode, input);
  let elapsedMinutes = 0;
  let pomodoros = 0;

  while (elapsedMinutes + input.focusMinutes <= input.availableMinutes) {
    const pomodoroNumber = pomodoros + 1;

    counters.blocks.push(
      buildBlock(
        "focus",
        pomodoroNumber,
        input.focusMinutes,
        elapsedMinutes,
        startClockMinutes,
      ),
    );
    counters.focusTotalMinutes += input.focusMinutes;
    elapsedMinutes += input.focusMinutes;
    pomodoros = pomodoroNumber;

    const breakType = getBreakType(pomodoroNumber, input.longBreakEvery);
    const durationMinutes =
      breakType === "long-break"
        ? input.longBreakMinutes
        : input.shortBreakMinutes;

    if (
      elapsedMinutes + durationMinutes + input.focusMinutes <=
      input.availableMinutes
    ) {
      addBreak(counters, breakType, pomodoroNumber, durationMinutes, elapsedMinutes, startClockMinutes);
      elapsedMinutes += durationMinutes;
    } else {
      break;
    }
  }

  return {
    ...finalizePlan(counters, elapsedMinutes, pomodoros),
    availableMinutes: input.availableMinutes,
    unusedMinutes: input.availableMinutes - elapsedMinutes,
  };
}

function createCounters(
  mode: PomodoroMode,
  input: PomodoroPlanInput,
): Omit<
  PomodoroPlanResult,
  | "pomodoros"
  | "totalMinutes"
  | "unusedMinutes"
  | "endTime"
  | "deadline"
  | "warnings"
> {
  return {
    mode,
    focusMinutes: input.focusMinutes,
    shortBreakMinutes: input.shortBreakMinutes,
    longBreakMinutes: input.longBreakMinutes,
    longBreakEvery: input.longBreakEvery,
    focusTotalMinutes: 0,
    breakTotalMinutes: 0,
    shortBreaks: 0,
    longBreaks: 0,
    availableMinutes: input.availableMinutes,
    startTime: input.startTime,
    deadlineTime: input.deadlineTime,
    blocks: [],
  };
}

function addBreak(
  counters: ReturnType<typeof createCounters>,
  type: "short-break" | "long-break",
  pomodoroNumber: number,
  durationMinutes: number,
  elapsedMinutes: number,
  startClockMinutes?: number,
): void {
  if (type === "long-break") {
    counters.longBreaks += 1;
  } else {
    counters.shortBreaks += 1;
  }

  counters.breakTotalMinutes += durationMinutes;

  if (durationMinutes > 0) {
    counters.blocks.push(
      buildBlock(
        type,
        pomodoroNumber,
        durationMinutes,
        elapsedMinutes,
        startClockMinutes,
      ),
    );
  }
}

function finalizePlan(
  counters: ReturnType<typeof createCounters>,
  totalMinutes: number,
  pomodoros: number,
): PomodoroPlanResult {
  return {
    ...counters,
    pomodoros,
    totalMinutes,
    warnings: [],
  };
}

function buildBlock(
  type: PomodoroBlockType,
  pomodoroNumber: number,
  durationMinutes: number,
  elapsedStartMinutes: number,
  startClockMinutes?: number,
): PomodoroBlock {
  const elapsedEndMinutes = elapsedStartMinutes + durationMinutes;

  return {
    type,
    label: getBlockLabel(type, pomodoroNumber),
    pomodoroNumber,
    durationMinutes,
    elapsedStartMinutes,
    elapsedEndMinutes,
    startTime:
      startClockMinutes === undefined
        ? undefined
        : formatClockTime(startClockMinutes + elapsedStartMinutes),
    endTime:
      startClockMinutes === undefined
        ? undefined
        : formatClockTime(startClockMinutes + elapsedEndMinutes),
  };
}

function getBlockLabel(
  type: PomodoroBlockType,
  pomodoroNumber: number,
): string {
  if (type === "focus") return `Foco ${pomodoroNumber}`;
  if (type === "long-break") return `Descanso largo ${pomodoroNumber}`;

  return `Descanso corto ${pomodoroNumber}`;
}

function getBreakType(
  pomodoroNumber: number,
  longBreakEvery: number,
): "short-break" | "long-break" {
  return pomodoroNumber % longBreakEvery === 0 ? "long-break" : "short-break";
}

function buildDeadlineResult(
  totalMinutes: number,
  availableMinutes: number,
): PomodoroDeadlineResult {
  const differenceMinutes = availableMinutes - totalMinutes;

  return {
    availableMinutes,
    status: differenceMinutes >= 0 ? "on_time" : "exceeded",
    differenceMinutes,
  };
}

function buildWarnings(
  totalMinutes: number,
  pomodoros: number,
): PomodoroWarning[] {
  const warnings: PomodoroWarning[] = [];

  if (pomodoros === 0) {
    warnings.push({ code: "no_complete_pomodoro" });
  }

  if (totalMinutes > 12 * 60) {
    warnings.push({ code: "unrealistic_session" });
  } else if (totalMinutes > 8 * 60) {
    warnings.push({ code: "very_long_session" });
  } else if (totalMinutes > 4 * 60) {
    warnings.push({ code: "long_session" });
  }

  return warnings;
}

function validateIntegerRange(
  value: unknown,
  min: number,
  max: number,
  code: PomodoroErrorCode,
  message: string,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new PomodoroValidationError(code, message);
  }
}
