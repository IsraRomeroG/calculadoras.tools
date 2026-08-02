import * as base from "./pomodoro";
import type {
  PomodoroErrorCode,
  PomodoroPlanInput,
  PomodoroPlanResult,
} from "./pomodoro";

export type {
  ParsePomodoroNumberResult,
  PomodoroBlock,
  PomodoroBlockType,
  PomodoroDeadlineResult,
  PomodoroErrorCode,
  PomodoroMode,
  PomodoroPlanInput,
  PomodoroPlanResult,
  PomodoroPreset,
  PomodoroWarning,
  PomodoroWarningCode,
} from "./pomodoro";

export const PomodoroValidationError = base.PomodoroValidationError;
export const POMODORO_PRESETS = {
  classic: { ...base.POMODORO_PRESETS.classic, label: "Classic" },
  long: { ...base.POMODORO_PRESETS.long, label: "Long" },
  deep: { ...base.POMODORO_PRESETS.deep, label: "Deep focus" },
} as const;
export const MIN_POMODOROS = base.MIN_POMODOROS;
export const MAX_POMODOROS = base.MAX_POMODOROS;
export const MIN_FOCUS_MINUTES = base.MIN_FOCUS_MINUTES;
export const MAX_FOCUS_MINUTES = base.MAX_FOCUS_MINUTES;
export const MIN_BREAK_MINUTES = base.MIN_BREAK_MINUTES;
export const MAX_SHORT_BREAK_MINUTES = base.MAX_SHORT_BREAK_MINUTES;
export const MAX_LONG_BREAK_MINUTES = base.MAX_LONG_BREAK_MINUTES;
export const MIN_LONG_BREAK_EVERY = base.MIN_LONG_BREAK_EVERY;
export const MAX_LONG_BREAK_EVERY = base.MAX_LONG_BREAK_EVERY;
export const MIN_AVAILABLE_MINUTES = base.MIN_AVAILABLE_MINUTES;
export const MAX_AVAILABLE_MINUTES = base.MAX_AVAILABLE_MINUTES;
export const MINUTES_PER_DAY = base.MINUTES_PER_DAY;
export const parseClockTime = base.parseClockTime;
export const differenceBetweenClockTimes = base.differenceBetweenClockTimes;
export const formatClockTime = base.formatClockTime;
export const parsePomodoroNumber = base.parsePomodoroNumber;

export function calculatePomodoroPlan(input: PomodoroPlanInput): PomodoroPlanResult {
  try {
    const result = base.calculatePomodoroPlan(input);
    return {
      ...result,
      blocks: result.blocks.map((block) => ({
        ...block,
        label:
          block.type === "focus"
            ? `Focus ${block.pomodoroNumber}`
            : block.type === "long-break"
              ? `Long break ${block.pomodoroNumber}`
              : `Short break ${block.pomodoroNumber}`,
      })),
    };
  } catch (error) {
    if (error instanceof base.PomodoroValidationError) {
      throw new base.PomodoroValidationError(error.code, pomodoroErrorMessage(error.code));
    }
    throw error;
  }
}

export function formatPomodoroDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes < 0) throw new RangeError("Duration must be finite and non-negative.");
  return base.formatPomodoroDuration(minutes);
}

export function buildPomodoroSummary(result: PomodoroPlanResult) {
  if (result.pomodoros === 0) {
    return `Pomodoro plan: a complete ${result.focusMinutes}-minute focus block does not fit into ${formatPomodoroDuration(result.availableMinutes ?? 0)} with these settings.`;
  }
  const lines = [
    `Pomodoro plan: ${result.pomodoros} ${result.pomodoros === 1 ? "pomodoro" : "pomodoros"} of ${result.focusMinutes} min, ${result.shortBreakMinutes}-minute short breaks, and a ${result.longBreakMinutes}-minute long break every ${result.longBreakEvery} pomodoros.`,
  ];
  if (result.mode === "time" && result.availableMinutes !== undefined) {
    lines.push(`${result.pomodoros} complete ${result.pomodoros === 1 ? "pomodoro fits" : "pomodoros fit"} into ${formatPomodoroDuration(result.availableMinutes)}.`);
    lines.push(`Unused time: ${formatPomodoroDuration(result.unusedMinutes ?? 0)}.`);
  }
  lines.push(`Total duration: ${formatPomodoroDuration(result.totalMinutes)}.`);
  if (result.startTime) lines.push(`Start: ${result.startTime}.`);
  if (result.endTime) lines.push(`Estimated finish: ${result.endTime}.`);
  if (result.deadline) {
    lines.push(result.deadline.status === "on_time"
      ? `Finishes on time with ${formatPomodoroDuration(result.deadline.differenceMinutes)} available.`
      : `Runs over by ${formatPomodoroDuration(Math.abs(result.deadline.differenceMinutes))}.`);
  }
  return lines.join(" ");
}

function pomodoroErrorMessage(code: PomodoroErrorCode): string {
  const messages: Record<PomodoroErrorCode, string> = {
    invalid_mode: "Select a valid calculation mode.",
    invalid_pomodoros: `Pomodoros must be between ${MIN_POMODOROS} and ${MAX_POMODOROS}.`,
    invalid_focus_minutes: `Focus minutes must be between ${MIN_FOCUS_MINUTES} and ${MAX_FOCUS_MINUTES}.`,
    invalid_short_break_minutes: `Short breaks must be between ${MIN_BREAK_MINUTES} and ${MAX_SHORT_BREAK_MINUTES} minutes.`,
    invalid_long_break_minutes: `Long breaks must be between ${MIN_BREAK_MINUTES} and ${MAX_LONG_BREAK_MINUTES} minutes.`,
    invalid_long_break_every: `Long-break frequency must be between ${MIN_LONG_BREAK_EVERY} and ${MAX_LONG_BREAK_EVERY}.`,
    invalid_available_minutes: `Available time must be between ${MIN_AVAILABLE_MINUTES} and ${MAX_AVAILABLE_MINUTES} minutes.`,
    invalid_start_time: "Start time must use HH:mm format.",
    invalid_deadline_time: "Deadline time must use HH:mm format.",
  };
  return messages[code];
}
