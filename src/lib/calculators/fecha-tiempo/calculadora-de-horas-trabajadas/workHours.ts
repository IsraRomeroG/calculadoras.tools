export interface WorkShiftInput {
  label: string;
  start: string;
  end: string;
  breakMinutes: number;
}

export interface WorkHoursInput {
  shifts: WorkShiftInput[];
  regularHoursLimit: number;
  overtimeMultiplier: number;
  hourlyRate?: number;
}

export interface WorkShiftResult extends WorkShiftInput {
  startMinutes: number;
  adjustedEndMinutes: number;
  crossesMidnight: boolean;
  grossMinutes: number;
  netMinutes: number;
}

export type WorkHoursWarningCode =
  | "overnight_shift"
  | "long_day"
  | "long_break"
  | "zero_regular_limit"
  | "zero_rate"
  | "legal_estimate";

export interface WorkHoursWarning {
  code: WorkHoursWarningCode;
  shiftIndexes?: number[];
}

export interface WorkHoursPayment {
  hourlyRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
}

export interface WorkHoursResult {
  shifts: WorkShiftResult[];
  grossMinutes: number;
  breakMinutes: number;
  netMinutes: number;
  decimalHours: number;
  regularMinutes: number;
  overtimeMinutes: number;
  differenceFromRegularLimitMinutes: number;
  payment?: WorkHoursPayment;
  warnings: WorkHoursWarning[];
}

export type WorkHoursErrorCode =
  | "no_shifts"
  | "too_many_shifts"
  | "label_too_long"
  | "invalid_time"
  | "equal_times"
  | "invalid_break"
  | "break_too_long"
  | "overlap"
  | "invalid_regular_limit"
  | "invalid_overtime_multiplier"
  | "invalid_hourly_rate";

export type ParseWorkNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export class WorkHoursValidationError extends RangeError {
  code: WorkHoursErrorCode;
  shiftIndexes: number[];

  constructor(
    code: WorkHoursErrorCode,
    message: string,
    shiftIndexes: number[] = [],
  ) {
    super(message);
    this.name = "WorkHoursValidationError";
    this.code = code;
    this.shiftIndexes = shiftIndexes;
  }
}

export const MAX_SHIFTS = 20;
export const MAX_LABEL_LENGTH = 40;
export const MINUTES_PER_DAY = 1440;
export const DEFAULT_LOCALE = "es-MX";
export const DEFAULT_CURRENCY = "MXN";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function calculateWorkHours(input: WorkHoursInput): WorkHoursResult {
  validateSettings(input);

  if (!input.shifts.length) {
    throw new WorkHoursValidationError(
      "no_shifts",
      "Agrega al menos un turno completo.",
    );
  }

  if (input.shifts.length > MAX_SHIFTS) {
    throw new WorkHoursValidationError(
      "too_many_shifts",
      `La jornada admite un máximo de ${MAX_SHIFTS} turnos.`,
    );
  }

  const shifts = input.shifts.map(buildShiftResult);
  assertNoOverlaps(shifts);

  const grossMinutes = sum(shifts.map((shift) => shift.grossMinutes));
  const breakMinutes = sum(shifts.map((shift) => shift.breakMinutes));
  const netMinutes = sum(shifts.map((shift) => shift.netMinutes));
  const regularLimitMinutes = Math.round(input.regularHoursLimit * 60);
  const regularMinutes = Math.min(netMinutes, regularLimitMinutes);
  const overtimeMinutes = Math.max(0, netMinutes - regularLimitMinutes);
  const payment =
    input.hourlyRate === undefined
      ? undefined
      : buildPayment(
          regularMinutes,
          overtimeMinutes,
          input.hourlyRate,
          input.overtimeMultiplier,
        );

  return {
    shifts,
    grossMinutes,
    breakMinutes,
    netMinutes,
    decimalHours: netMinutes / 60,
    regularMinutes,
    overtimeMinutes,
    differenceFromRegularLimitMinutes: netMinutes - regularLimitMinutes,
    payment,
    warnings: buildWarnings(input, shifts, netMinutes, overtimeMinutes),
  };
}

export function parseTimeToMinutes(value: string): number | null {
  const match = timePattern.exec(value.trim());

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

export function parseWorkNumber(
  value: string,
  options: { maxDecimals?: number; integer?: boolean; optional?: boolean } = {},
): ParseWorkNumberResult {
  const { maxDecimals = 2, integer = false, optional = false } = options;
  const trimmed = value.trim();

  if (!trimmed) {
    return optional
      ? { ok: true, value: 0, normalized: "" }
      : { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed.replace(/[$\s]/g, "").replace(",", ".");

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const decimals = cleaned.split(".")[1] ?? "";

  if (decimals.length > maxDecimals || (integer && decimals.length > 0)) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(cleaned);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized: cleaned };
}

export function formatDuration(minutes: number): string {
  validateNonNegativeFinite(minutes, "duración");

  const roundedMinutes = Math.round(minutes);
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  return `${hours} h ${String(remainingMinutes).padStart(2, "0")} min`;
}

export function formatDecimalHours(
  hours: number,
  locale = DEFAULT_LOCALE,
): string {
  validateNonNegativeFinite(hours, "horas decimales");

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(hours);
}

export function formatWorkCurrency(
  value: number,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY,
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("El importe debe ser finito.");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundToPrecision(value, 2));
}

export function buildWorkHoursSummary(result: WorkHoursResult): string {
  const shiftLines = result.shifts.map((shift) => {
    const nextDay = shift.crossesMidnight ? " día siguiente" : "";

    return `${shift.label}: ${shift.start}-${shift.end}${nextDay} · descanso ${shift.breakMinutes} min · neto ${formatDuration(shift.netMinutes)}`;
  });
  const lines = [
    "Resumen de jornada",
    "",
    ...shiftLines,
    "",
    `Tiempo bruto: ${formatDuration(result.grossMinutes)}`,
    `Descansos: ${formatDuration(result.breakMinutes)}`,
    `Total trabajado: ${formatDuration(result.netMinutes)} (${formatDecimalHours(result.decimalHours)} h)`,
    `Horas normales: ${formatDuration(result.regularMinutes)}`,
    `Horas extra estimadas: ${formatDuration(result.overtimeMinutes)}`,
  ];

  if (result.payment) {
    lines.push(`Pago total estimado: ${formatWorkCurrency(result.payment.totalPay)}`);
  }

  lines.push(
    "",
    "Estimación basada en la configuración ingresada.",
    "Calculado en calculadoras.tools",
  );

  return lines.join("\n");
}

function buildShiftResult(
  shift: WorkShiftInput,
  index: number,
): WorkShiftResult {
  const label = shift.label.trim() || `Turno ${index + 1}`;

  if (label.length > MAX_LABEL_LENGTH) {
    throw new WorkHoursValidationError(
      "label_too_long",
      `El nombre del turno ${index + 1} debe tener máximo ${MAX_LABEL_LENGTH} caracteres.`,
      [index],
    );
  }

  const startMinutes = parseTimeToMinutes(shift.start);
  const endMinutes = parseTimeToMinutes(shift.end);

  if (startMinutes === null || endMinutes === null) {
    throw new WorkHoursValidationError(
      "invalid_time",
      `Completa horas válidas para ${label}.`,
      [index],
    );
  }

  if (startMinutes === endMinutes) {
    throw new WorkHoursValidationError(
      "equal_times",
      `La entrada y la salida de ${label} no pueden ser iguales.`,
      [index],
    );
  }

  if (!Number.isInteger(shift.breakMinutes) || shift.breakMinutes < 0) {
    throw new WorkHoursValidationError(
      "invalid_break",
      `El descanso de ${label} debe ser un número entero de minutos.`,
      [index],
    );
  }

  const crossesMidnight = endMinutes < startMinutes;
  const adjustedEndMinutes = crossesMidnight
    ? endMinutes + MINUTES_PER_DAY
    : endMinutes;
  const grossMinutes = adjustedEndMinutes - startMinutes;

  if (shift.breakMinutes >= grossMinutes) {
    throw new WorkHoursValidationError(
      "break_too_long",
      `El descanso de ${label} debe ser menor que la duración del turno.`,
      [index],
    );
  }

  return {
    ...shift,
    label,
    startMinutes,
    adjustedEndMinutes,
    crossesMidnight,
    grossMinutes,
    netMinutes: grossMinutes - shift.breakMinutes,
  };
}

function assertNoOverlaps(shifts: WorkShiftResult[]): void {
  for (let leftIndex = 0; leftIndex < shifts.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < shifts.length;
      rightIndex += 1
    ) {
      const left = shifts[leftIndex];
      const right = shifts[rightIndex];
      const overlaps =
        left.startMinutes < right.adjustedEndMinutes &&
        right.startMinutes < left.adjustedEndMinutes;

      if (overlaps) {
        throw new WorkHoursValidationError(
          "overlap",
          `${left.label} y ${right.label} se solapan. Ajusta las horas para no contar tiempo dos veces.`,
          [leftIndex, rightIndex],
        );
      }
    }
  }
}

function buildPayment(
  regularMinutes: number,
  overtimeMinutes: number,
  hourlyRate: number,
  overtimeMultiplier: number,
): WorkHoursPayment {
  const regularPay = (regularMinutes / 60) * hourlyRate;
  const overtimePay =
    (overtimeMinutes / 60) * hourlyRate * overtimeMultiplier;

  return {
    hourlyRate,
    regularPay,
    overtimePay,
    totalPay: regularPay + overtimePay,
  };
}

function buildWarnings(
  input: WorkHoursInput,
  shifts: WorkShiftResult[],
  netMinutes: number,
  overtimeMinutes: number,
): WorkHoursWarning[] {
  const warnings: WorkHoursWarning[] = [];
  const overnightIndexes = indexesMatching(
    shifts,
    (shift) => shift.crossesMidnight,
  );
  const longBreakIndexes = indexesMatching(
    shifts,
    (shift) => shift.breakMinutes > shift.grossMinutes / 2,
  );

  if (overnightIndexes.length) {
    warnings.push({ code: "overnight_shift", shiftIndexes: overnightIndexes });
  }
  if (netMinutes > 16 * 60) warnings.push({ code: "long_day" });
  if (longBreakIndexes.length) {
    warnings.push({ code: "long_break", shiftIndexes: longBreakIndexes });
  }
  if (input.regularHoursLimit === 0) {
    warnings.push({ code: "zero_regular_limit" });
  }
  if (input.hourlyRate === 0) warnings.push({ code: "zero_rate" });
  if (input.hourlyRate !== undefined || overtimeMinutes > 0) {
    warnings.push({ code: "legal_estimate" });
  }

  return warnings;
}

function validateSettings(input: WorkHoursInput): void {
  if (
    !Number.isFinite(input.regularHoursLimit) ||
    input.regularHoursLimit < 0 ||
    input.regularHoursLimit > 24
  ) {
    throw new WorkHoursValidationError(
      "invalid_regular_limit",
      "El límite de horas normales debe estar entre 0 y 24.",
    );
  }

  if (
    !Number.isFinite(input.overtimeMultiplier) ||
    input.overtimeMultiplier < 1 ||
    input.overtimeMultiplier > 5
  ) {
    throw new WorkHoursValidationError(
      "invalid_overtime_multiplier",
      "El multiplicador de horas extra debe estar entre 1 y 5.",
    );
  }

  if (
    input.hourlyRate !== undefined &&
    (!Number.isFinite(input.hourlyRate) || input.hourlyRate < 0)
  ) {
    throw new WorkHoursValidationError(
      "invalid_hourly_rate",
      "La tarifa por hora debe ser igual o mayor que cero.",
    );
  }
}

function indexesMatching<T>(
  values: T[],
  predicate: (value: T) => boolean,
): number[] {
  return values.flatMap((value, index) => (predicate(value) ? [index] : []));
}

function validateNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`La ${label} debe ser finita y no negativa.`);
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function roundToPrecision(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
