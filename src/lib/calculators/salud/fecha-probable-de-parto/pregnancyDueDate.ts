import {
  addCalendarDays,
  comparePlainDates,
  diffTotalDays,
  formatFullPlainDate,
  formatNumber,
  formatPlainDate,
  isValidDateParts,
  parseDateParts,
  todayInLocalTimeZone,
  type PlainDateParts,
  type ParseDatePartsInput,
  type ParseDatePartsResult,
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export type {
  PlainDateParts,
  ParseDatePartsInput,
  ParseDatePartsResult,
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export { todayInLocalTimeZone } from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export type DueDateMethod =
  | "lmp"
  | "ovulation"
  | "ultrasound"
  | "ivf"
  | "official";

export type ConfidenceLevel = "Alta" | "Media" | "Baja";

export type ConceptionSource =
  | "ovulation"
  | "fertilization"
  | "intercourse"
  | "insemination";

export type AssistedReproductionKind = "fertilization" | "transfer" | "iui";

export interface GestationalAge {
  totalDays: number;
  weeks: number;
  days: number;
}

export interface PregnancyStatus {
  kind: "upcoming" | "near" | "today" | "recentlyPassed" | "passed";
  message: string;
  daysUntilDueDate: number;
}

export interface TermWindow {
  label: string;
  gestationalRange: string;
  startDate: PlainDateParts;
  endDate?: PlainDateParts;
}

export interface PregnancyMilestone {
  label: string;
  gestationalRange: string;
  startDate: PlainDateParts;
  endDate?: PlainDateParts;
}

export interface DueDateResult {
  method: DueDateMethod;
  methodLabel: string;
  dueDate: PlainDateParts;
  estimatedLmp: PlainDateParts;
  gestationalAge: GestationalAge;
  daysUntilDueDate: number;
  trimester: string;
  progressPercent: number;
  confidence: ConfidenceLevel;
  confidenceMessage: string;
  status: PregnancyStatus;
  termWindows: TermWindow[];
  milestones: PregnancyMilestone[];
  warnings: string[];
}

export interface MethodComparison {
  method: DueDateMethod;
  methodLabel: string;
  dueDate: PlainDateParts;
  differenceDays: number;
  confidence: ConfidenceLevel;
}

export interface LmpInput {
  lmpDate: PlainDateParts;
  cycleLength?: number;
  lutealPhase?: number;
  today?: PlainDateParts;
}

export interface OvulationInput {
  conceptionDate: PlainDateParts;
  source?: ConceptionSource;
  today?: PlainDateParts;
}

export interface UltrasoundInput {
  scanDate: PlainDateParts;
  weeks: number;
  days?: number;
  today?: PlainDateParts;
}

export interface AssistedReproductionInput {
  date: PlainDateParts;
  kind: AssistedReproductionKind;
  embryoAgeDays?: 3 | 5 | 6;
  today?: PlainDateParts;
}

export interface OfficialDueDateInput {
  dueDate: PlainDateParts;
  today?: PlainDateParts;
}

export const DEFAULT_LOCALE = "es-MX";
export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_LUTEAL_PHASE = 14;
export const MIN_CYCLE_LENGTH = 20;
export const MAX_CYCLE_LENGTH = 45;
export const MIN_LUTEAL_PHASE = 10;
export const MAX_LUTEAL_PHASE = 17;
export const PREGNANCY_DAYS = 280;
export const CONCEPTION_TO_DUE_DAYS = 266;

export function calculateFromLmp({
  lmpDate,
  cycleLength = DEFAULT_CYCLE_LENGTH,
  lutealPhase,
  today = todayInLocalTimeZone(),
}: LmpInput): DueDateResult {
  assertValidDate(lmpDate);
  assertRange(cycleLength, MIN_CYCLE_LENGTH, MAX_CYCLE_LENGTH, "cycleLength");

  const warnings: string[] = [];
  let dueDate: PlainDateParts;

  if (typeof lutealPhase === "number") {
    assertRange(
      lutealPhase,
      MIN_LUTEAL_PHASE,
      MAX_LUTEAL_PHASE,
      "lutealPhase",
    );

    const ovulationDate = addCalendarDays(lmpDate, cycleLength - lutealPhase);
    dueDate = addCalendarDays(ovulationDate, CONCEPTION_TO_DUE_DAYS);
  } else {
    dueDate = addCalendarDays(
      lmpDate,
      PREGNANCY_DAYS + (cycleLength - DEFAULT_CYCLE_LENGTH),
    );
  }

  if (cycleLength < 21 || cycleLength > 35) {
    warnings.push(
      "Con ciclos muy irregulares la FPP puede ser menos precisa. Una ecografía temprana suele orientar mejor la fecha.",
    );
  }

  return buildDueDateResult({
    method: "lmp",
    methodLabel: "FUM",
    dueDate,
    estimatedLmp: addCalendarDays(dueDate, -PREGNANCY_DAYS),
    today,
    confidence: cycleLength >= 21 && cycleLength <= 35 ? "Media" : "Baja",
    confidenceMessage:
      cycleLength >= 21 && cycleLength <= 35
        ? "Buena estimación si tus ciclos son regulares."
        : "Estimación orientativa: con ciclos muy irregulares conviene confirmar con tu profesional de salud.",
    warnings,
  });
}

export function calculateFromOvulation({
  conceptionDate,
  source = "ovulation",
  today = todayInLocalTimeZone(),
}: OvulationInput): DueDateResult {
  assertValidDate(conceptionDate);

  const dueDate = addCalendarDays(conceptionDate, CONCEPTION_TO_DUE_DAYS);
  const isIntercourse = source === "intercourse";
  const sourceLabel =
    source === "intercourse"
      ? "relación sexual"
      : source === "insemination"
        ? "inseminación"
        : source === "fertilization"
          ? "fecundación"
          : "ovulación";

  return buildDueDateResult({
    method: "ovulation",
    methodLabel: `Ovulación/concepción (${sourceLabel})`,
    dueDate,
    estimatedLmp: addCalendarDays(conceptionDate, -14),
    today,
    confidence: isIntercourse ? "Baja" : "Media",
    confidenceMessage: isIntercourse
      ? "La fecha de relación sexual no siempre coincide con la fecundación real."
      : "Buena estimación si la fecha de ovulación o fecundación es confiable.",
    warnings: isIntercourse
      ? [
          "Los espermatozoides pueden vivir varios días; por eso esta fecha es aproximada.",
        ]
      : [],
  });
}

export function calculateFromUltrasound({
  scanDate,
  weeks,
  days = 0,
  today = todayInLocalTimeZone(),
}: UltrasoundInput): DueDateResult {
  assertValidDate(scanDate);
  assertRange(weeks, 4, 42, "weeks");
  assertRange(days, 0, 6, "days");

  const ageAtScanDays = weeks * 7 + days;
  const dueDate = addCalendarDays(scanDate, PREGNANCY_DAYS - ageAtScanDays);
  const estimatedLmp = addCalendarDays(scanDate, -ageAtScanDays);
  const confidence =
    weeks < 14 ? "Alta" : weeks >= 28 ? "Baja" : "Media";
  const warnings =
    weeks >= 28
      ? [
          "En el tercer trimestre la ecografía suele ser menos precisa para fechar la FPP.",
        ]
      : weeks < 6
        ? [
            "Las ecografías muy tempranas pueden cambiar cuando se repite la medición.",
          ]
        : [];

  return buildDueDateResult({
    method: "ultrasound",
    methodLabel: `Ecografía ${weeks}+${days}`,
    dueDate,
    estimatedLmp,
    today,
    confidence,
    confidenceMessage:
      confidence === "Alta"
        ? "La ecografía temprana suele ser una referencia de alta confianza."
        : confidence === "Media"
          ? "Estimación útil, aunque la precisión baja conforme avanza el embarazo."
          : "Estimación orientativa; confirma la FPP oficial con tu profesional de salud.",
    warnings,
  });
}

export function calculateFromAssistedReproduction({
  date,
  kind,
  embryoAgeDays = 5,
  today = todayInLocalTimeZone(),
}: AssistedReproductionInput): DueDateResult {
  assertValidDate(date);

  if (kind === "transfer" && ![3, 5, 6].includes(embryoAgeDays)) {
    throw new RangeError("La edad del embrión debe ser día 3, día 5 o día 6.");
  }

  const dueDate =
    kind === "transfer"
      ? addCalendarDays(date, CONCEPTION_TO_DUE_DAYS - embryoAgeDays)
      : addCalendarDays(date, CONCEPTION_TO_DUE_DAYS);
  const confidence = kind === "iui" ? "Media" : "Alta";
  const methodLabel =
    kind === "transfer"
      ? `Transferencia embrionaria día ${embryoAgeDays}`
      : kind === "iui"
        ? "Inseminación intrauterina"
        : "FIV/ICSI";

  return buildDueDateResult({
    method: "ivf",
    methodLabel,
    dueDate,
    estimatedLmp: addCalendarDays(dueDate, -PREGNANCY_DAYS),
    today,
    confidence,
    confidenceMessage:
      kind === "iui"
        ? "Buena estimación si la fecha de inseminación fue indicada por la clínica."
        : "Estimación de alta confianza si la fecha de fecundación o transferencia es correcta.",
    warnings: [
      "Si tu clínica te dio una FPP oficial, usa esa fecha como referencia principal.",
    ],
  });
}

export function calculateFromOfficialDueDate({
  dueDate,
  today = todayInLocalTimeZone(),
}: OfficialDueDateInput): DueDateResult {
  assertValidDate(dueDate);

  return buildDueDateResult({
    method: "official",
    methodLabel: "FPP oficial",
    dueDate,
    estimatedLmp: addCalendarDays(dueDate, -PREGNANCY_DAYS),
    today,
    confidence: "Alta",
    confidenceMessage:
      "Usa esta fecha como referencia principal porque fue indicada por tu equipo de salud.",
    warnings: [],
  });
}

export function buildMethodComparisons(
  principal: DueDateResult,
  results: DueDateResult[],
): MethodComparison[] {
  return results.map((result) => ({
    method: result.method,
    methodLabel: result.methodLabel,
    dueDate: result.dueDate,
    differenceDays: diffTotalDays(principal.dueDate, result.dueDate),
    confidence: result.confidence,
  }));
}

export function parseIsoDate(value: string): PlainDateParts | null {
  const trimmed = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const [year, month, day] = trimmed.split("-").map(Number);
  const date = { year, month, day };

  return isValidDateParts(date) ? date : null;
}

export function formatIsoDate(date: PlainDateParts): string {
  return [
    String(date.year).padStart(4, "0"),
    String(date.month).padStart(2, "0"),
    String(date.day).padStart(2, "0"),
  ].join("-");
}

export function parsePregnancyDateParts(
  input: ParseDatePartsInput,
): ParseDatePartsResult {
  return parseDateParts(input);
}

export function formatGestationalAge(age: GestationalAge): string {
  return `${formatNumber(age.weeks)} semanas y ${formatNumber(age.days)} días`;
}

export function formatRelativeDays(daysUntilDueDate: number): string {
  if (daysUntilDueDate > 0) {
    return `Faltan ${formatNumber(daysUntilDueDate)} días`;
  }

  if (daysUntilDueDate < 0) {
    return `Pasaron ${formatNumber(Math.abs(daysUntilDueDate))} días`;
  }

  return "Hoy";
}

export function formatPregnancyDate(date: PlainDateParts): string {
  return formatPlainDate(date, DEFAULT_LOCALE);
}

export function formatFullPregnancyDate(date: PlainDateParts): string {
  return formatFullPlainDate(date, DEFAULT_LOCALE);
}

export function buildDueDateCopyText(result: DueDateResult): string {
  return [
    "Calculadora de Fecha Probable de Parto - calculadoras.tools",
    `FPP: ${formatFullPregnancyDate(result.dueDate)}`,
    `Edad gestacional: ${formatGestationalAge(result.gestationalAge)}`,
    `Método: ${result.methodLabel}`,
    `Confianza: ${result.confidence}`,
  ].join("\n");
}

function buildDueDateResult({
  method,
  methodLabel,
  dueDate,
  estimatedLmp,
  today,
  confidence,
  confidenceMessage,
  warnings,
}: {
  method: DueDateMethod;
  methodLabel: string;
  dueDate: PlainDateParts;
  estimatedLmp: PlainDateParts;
  today: PlainDateParts;
  confidence: ConfidenceLevel;
  confidenceMessage: string;
  warnings: string[];
}): DueDateResult {
  assertValidDate(dueDate);
  assertValidDate(estimatedLmp);
  assertValidDate(today);

  const gestationalAge = buildGestationalAge(estimatedLmp, today);
  const daysUntilDueDate = diffTotalDays(today, dueDate);

  return {
    method,
    methodLabel,
    dueDate,
    estimatedLmp,
    gestationalAge,
    daysUntilDueDate,
    trimester: getTrimester(gestationalAge.totalDays),
    progressPercent: clamp(
      Math.round((gestationalAge.totalDays / PREGNANCY_DAYS) * 100),
      0,
      100,
    ),
    confidence,
    confidenceMessage,
    status: buildPregnancyStatus(daysUntilDueDate),
    termWindows: buildTermWindows(estimatedLmp),
    milestones: buildMilestones(estimatedLmp, dueDate),
    warnings: buildGeneralWarnings({
      gestationalAge,
      warnings,
      daysUntilDueDate,
    }),
  };
}

function buildGestationalAge(
  estimatedLmp: PlainDateParts,
  today: PlainDateParts,
): GestationalAge {
  const totalDays = diffTotalDays(estimatedLmp, today);
  const nonNegativeDays = Math.max(totalDays, 0);

  return {
    totalDays,
    weeks: Math.floor(nonNegativeDays / 7),
    days: nonNegativeDays % 7,
  };
}

function getTrimester(totalDays: number): string {
  if (totalDays < 0) {
    return "Aún no inicia según esta fecha";
  }

  if (totalDays < 14 * 7) {
    return "Primer trimestre";
  }

  if (totalDays < 28 * 7) {
    return "Segundo trimestre";
  }

  return "Tercer trimestre";
}

function buildPregnancyStatus(daysUntilDueDate: number): PregnancyStatus {
  if (daysUntilDueDate > 14) {
    return {
      kind: "upcoming",
      daysUntilDueDate,
      message: `Faltan ${formatNumber(daysUntilDueDate)} días para tu fecha probable de parto.`,
    };
  }

  if (daysUntilDueDate > 0) {
    return {
      kind: "near",
      daysUntilDueDate,
      message:
        "Ya falta poco. Tu bebé podría llegar en cualquier momento dentro de las próximas semanas.",
    };
  }

  if (daysUntilDueDate === 0) {
    return {
      kind: "today",
      daysUntilDueDate,
      message:
        "Hoy es tu fecha probable de parto. Sigue las indicaciones de tu equipo médico.",
    };
  }

  if (daysUntilDueDate >= -6) {
    return {
      kind: "recentlyPassed",
      daysUntilDueDate,
      message: `Tu fecha probable de parto fue hace ${formatNumber(
        Math.abs(daysUntilDueDate),
      )} días. Es frecuente que el bebé no llegue exactamente en esa fecha.`,
    };
  }

  return {
    kind: "passed",
    daysUntilDueDate,
    message: `Han pasado ${formatNumber(
      Math.abs(daysUntilDueDate),
    )} días desde tu fecha probable de parto. Mantén contacto con tu médico o matrona.`,
  };
}

function buildTermWindows(estimatedLmp: PlainDateParts): TermWindow[] {
  return [
    {
      label: "Parto prematuro tardío",
      gestationalRange: "34+0 a 36+6",
      startDate: gestationalDate(estimatedLmp, 34, 0),
      endDate: gestationalDate(estimatedLmp, 36, 6),
    },
    {
      label: "A término temprano",
      gestationalRange: "37+0 a 38+6",
      startDate: gestationalDate(estimatedLmp, 37, 0),
      endDate: gestationalDate(estimatedLmp, 38, 6),
    },
    {
      label: "A término completo",
      gestationalRange: "39+0 a 40+6",
      startDate: gestationalDate(estimatedLmp, 39, 0),
      endDate: gestationalDate(estimatedLmp, 40, 6),
    },
    {
      label: "A término tardío",
      gestationalRange: "41+0 a 41+6",
      startDate: gestationalDate(estimatedLmp, 41, 0),
      endDate: gestationalDate(estimatedLmp, 41, 6),
    },
    {
      label: "Postérmino",
      gestationalRange: "Desde 42+0",
      startDate: gestationalDate(estimatedLmp, 42, 0),
    },
  ];
}

function buildMilestones(
  estimatedLmp: PlainDateParts,
  dueDate: PlainDateParts,
): PregnancyMilestone[] {
  return [
    {
      label: "Fin del primer trimestre",
      gestationalRange: "13+6",
      startDate: gestationalDate(estimatedLmp, 13, 6),
    },
    {
      label: "Ecografía anatómica orientativa",
      gestationalRange: "18+0 a 22+0",
      startDate: gestationalDate(estimatedLmp, 18, 0),
      endDate: gestationalDate(estimatedLmp, 22, 0),
    },
    {
      label: "Inicio del tercer trimestre",
      gestationalRange: "28+0",
      startDate: gestationalDate(estimatedLmp, 28, 0),
    },
    {
      label: "A término temprano",
      gestationalRange: "37+0",
      startDate: gestationalDate(estimatedLmp, 37, 0),
    },
    {
      label: "Fecha probable de parto",
      gestationalRange: "40+0",
      startDate: dueDate,
    },
    {
      label: "Postérmino",
      gestationalRange: "42+0",
      startDate: gestationalDate(estimatedLmp, 42, 0),
    },
  ];
}

function gestationalDate(
  estimatedLmp: PlainDateParts,
  weeks: number,
  days: number,
): PlainDateParts {
  return addCalendarDays(estimatedLmp, weeks * 7 + days);
}

function buildGeneralWarnings({
  gestationalAge,
  warnings,
  daysUntilDueDate,
}: {
  gestationalAge: GestationalAge;
  warnings: string[];
  daysUntilDueDate: number;
}): string[] {
  const result = [...warnings];

  if (gestationalAge.totalDays > 42 * 7) {
    result.push(
      "Esta fecha sugiere más de 42 semanas de embarazo. Confirma el dato y consulta con tu médico si aún no has dado a luz.",
    );
  }

  if (gestationalAge.totalDays < 0) {
    result.push(
      "La fecha probable de parto queda a más de 40 semanas desde hoy. Revisa si ingresaste la fecha correcta.",
    );
  }

  if (daysUntilDueDate < -7) {
    result.push(
      "Si aún no has dado a luz, esta situación requiere seguimiento médico.",
    );
  }

  return [...new Set(result)];
}

function assertValidDate(date: PlainDateParts) {
  if (!isValidDateParts(date)) {
    throw new RangeError("La fecha no es válida.");
  }
}

function assertRange(
  value: number,
  min: number,
  max: number,
  field: string,
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${field} está fuera de rango.`);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
