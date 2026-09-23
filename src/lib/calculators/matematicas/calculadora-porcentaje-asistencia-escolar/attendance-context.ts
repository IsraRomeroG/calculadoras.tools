import type { AttendanceResult } from "./attendance-presenter";
import type {
  AttendanceCalendarEvent,
  AttendancePolicy,
  AttendanceSource,
  AttendanceSubject,
  ManualAttendanceValues,
  PolicyAttendanceResult,
} from "./attendance-phase2";

export const ATTENDANCE_CONTEXT_EVENT = "attendancecontextchange";

export type AttendanceContextPresentation =
  | { kind: "base"; result: AttendanceResult }
  | { kind: "policy"; fields: Record<string, string> };

export type AttendanceContextInput =
  | { kind: "manual"; values: ManualAttendanceValues }
  | { kind: "calendar"; events: AttendanceCalendarEvent[]; calendarComplete: boolean };

export interface AttendanceCalculatorContext {
  version: number;
  subject: Pick<AttendanceSubject, "id" | "name">;
  source: AttendanceSource;
  mode: "attended" | "absences";
  calendarMode: "remaining" | "total";
  input: AttendanceContextInput;
  policy: AttendancePolicy;
  result: PolicyAttendanceResult | null;
  presentation: AttendanceContextPresentation | null;
  summary: string | null;
  valid: boolean;
}

type ContextDraft = Omit<AttendanceCalculatorContext, "version">;

const contexts = new WeakMap<HTMLElement, AttendanceCalculatorContext>();
const versions = new WeakMap<HTMLElement, number>();

export function getAttendanceContext(
  root: HTMLElement,
): AttendanceCalculatorContext | null {
  return contexts.get(root) ?? null;
}

export function publishAttendanceContext(
  root: HTMLElement,
  draft: ContextDraft,
): AttendanceCalculatorContext {
  const version = (versions.get(root) ?? 0) + 1;
  versions.set(root, version);
  const context: AttendanceCalculatorContext = { ...draft, version };
  contexts.set(root, context);
  root.dispatchEvent(new CustomEvent<AttendanceCalculatorContext | null>(ATTENDANCE_CONTEXT_EVENT, {
    detail: context,
  }));
  return context;
}

export function invalidateAttendanceContext(root: HTMLElement): void {
  versions.set(root, (versions.get(root) ?? 0) + 1);
  contexts.delete(root);
  root.dispatchEvent(new CustomEvent<AttendanceCalculatorContext | null>(ATTENDANCE_CONTEXT_EVENT, {
    detail: null,
  }));
}
