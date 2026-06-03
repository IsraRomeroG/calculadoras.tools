import {
  addCalendarDays,
  comparePlainDates,
  diffTotalDays,
  formatFullPlainDate,
  formatNumber,
  formatPlainDate,
  isValidDateParts,
  todayInLocalTimeZone,
  type PlainDateParts,
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export type { PlainDateParts } from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export { addCalendarDays, comparePlainDates, diffTotalDays, todayInLocalTimeZone };

export type OvulationMode = "standard" | "history" | "range" | "detected";
export type ConfidenceLevel = "Alta" | "Media" | "Baja";
export type CycleIntent = "conceive" | "track" | "avoid";
export type OvulationSource =
  | "lh"
  | "bbt"
  | "mucus"
  | "ultrasound"
  | "clinical"
  | "other";

export type FertilityLevel =
  | "Baja"
  | "Baja-media"
  | "Media"
  | "Media-alta"
  | "Alta"
  | "Muy alta"
  | "Margen bajo";

export interface DateRange {
  start: PlainDateParts;
  end: PlainDateParts;
}

export interface CycleRangeSummary {
  shortest: number;
  longest: number;
  average: number;
  variability: number;
  cycleCount: number;
  spread: number;
}

export interface FertilityDay {
  date: PlainDateParts;
  cycleDay: number;
  relation: string;
  level: FertilityLevel;
  description: string;
  isOvulationEstimate: boolean;
  isObservationMargin: boolean;
}

export interface ProbabilityReferenceRow {
  relation: string;
  reference: string;
  level: FertilityLevel;
}

export interface CycleTodayStatus {
  kind:
    | "before-cycle"
    | "menstruation"
    | "follicular"
    | "fertile"
    | "ovulation"
    | "margin"
    | "luteal"
    | "period-due"
    | "overdue";
  cycleDay?: number;
  phase: string;
  fertilityLabel: string;
  message: string;
  daysUntilOvulation?: number;
  daysUntilNextPeriod?: number;
}

export interface OvulationResult {
  mode: OvulationMode;
  modeLabel: string;
  lmpDate: PlainDateParts;
  periodLength: number;
  periodEndDate: PlainDateParts;
  lutealPhase: number;
  cycleLength?: number;
  cycleRange?: CycleRangeSummary;
  nextPeriodDate: PlainDateParts;
  nextPeriodRange?: DateRange;
  ovulationStart: PlainDateParts;
  ovulationEnd: PlainDateParts;
  fertileStart: PlainDateParts;
  fertileEnd: PlainDateParts;
  peakStart: PlainDateParts;
  peakEnd: PlainDateParts;
  observationEnd: PlainDateParts;
  confidence: ConfidenceLevel;
  confidenceMessage: string;
  warnings: string[];
  todayStatus: CycleTodayStatus;
  fertilityRows: FertilityDay[];
  probabilityRows: ProbabilityReferenceRow[];
}

export interface StandardCycleInput {
  lmpDate: PlainDateParts;
  cycleLength?: number;
  periodLength?: number;
  lutealPhase?: number;
  today?: PlainDateParts;
  intent?: CycleIntent;
}

export interface CycleHistoryInput {
  lmpDate: PlainDateParts;
  previousPeriodStartDates: PlainDateParts[];
  periodLength?: number;
  lutealPhase?: number;
  today?: PlainDateParts;
  intent?: CycleIntent;
}

export interface CycleRangeInput {
  lmpDate: PlainDateParts;
  shortestCycle: number;
  longestCycle: number;
  periodLength?: number;
  lutealPhase?: number;
  today?: PlainDateParts;
  intent?: CycleIntent;
}

export interface DetectedOvulationInput {
  ovulationDate: PlainDateParts;
  source?: OvulationSource;
  periodLength?: number;
  lutealPhase?: number;
  today?: PlainDateParts;
  intent?: CycleIntent;
}

export const DEFAULT_LOCALE = "es-MX";
export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
export const DEFAULT_LUTEAL_PHASE = 14;
export const MIN_CYCLE_LENGTH = 21;
export const MAX_CYCLE_LENGTH = 45;
export const TYPICAL_CYCLE_MIN = 21;
export const TYPICAL_CYCLE_MAX = 35;
export const MIN_PERIOD_LENGTH = 2;
export const MAX_PERIOD_LENGTH = 10;
export const MIN_LUTEAL_PHASE = 10;
export const MAX_LUTEAL_PHASE = 16;

export const PROBABILITY_REFERENCE_ROWS: ProbabilityReferenceRow[] = [
  { relation: "5 días antes", reference: "~10%", level: "Baja-media" },
  { relation: "4 días antes", reference: "~14%", level: "Media" },
  { relation: "3 días antes", reference: "~16%", level: "Media" },
  { relation: "2 días antes", reference: "~27%", level: "Alta" },
  { relation: "1 día antes", reference: "~31%", level: "Muy alta" },
  { relation: "Día de ovulación", reference: "~33%", level: "Muy alta" },
  { relation: "1 día después", reference: "Margen bajo", level: "Margen bajo" },
  { relation: "2+ días después", reference: "Muy baja", level: "Baja" },
];

export function calculateStandardCycle({
  lmpDate,
  cycleLength = DEFAULT_CYCLE_LENGTH,
  periodLength = DEFAULT_PERIOD_LENGTH,
  lutealPhase = DEFAULT_LUTEAL_PHASE,
  today = todayInLocalTimeZone(),
  intent = "conceive",
}: StandardCycleInput): OvulationResult {
  validateSharedInputs({ lmpDate, periodLength, lutealPhase, today });
  assertNotFuture(lmpDate, today, "La FUM no puede ser futura.");
  assertCycleLength(cycleLength);

  const nextPeriodDate = addCalendarDays(lmpDate, cycleLength);
  const ovulationDate = addCalendarDays(nextPeriodDate, -lutealPhase);
  const confidence: ConfidenceLevel =
    cycleLength >= TYPICAL_CYCLE_MIN && cycleLength <= TYPICAL_CYCLE_MAX
      ? "Media"
      : "Baja";

  return buildOvulationResult({
    mode: "standard",
    modeLabel: "Ciclo regular",
    lmpDate,
    periodLength,
    lutealPhase,
    cycleLength,
    nextPeriodDate,
    ovulationStart: ovulationDate,
    ovulationEnd: ovulationDate,
    today,
    intent,
    confidence,
    confidenceMessage:
      confidence === "Media"
        ? "Estimación orientativa basada en tu duración habitual del ciclo."
        : "Con ciclos fuera del rango habitual, la ovulación puede ser menos predecible.",
  });
}

export function calculateFromCycleHistory({
  lmpDate,
  previousPeriodStartDates,
  periodLength = DEFAULT_PERIOD_LENGTH,
  lutealPhase = DEFAULT_LUTEAL_PHASE,
  today = todayInLocalTimeZone(),
  intent = "conceive",
}: CycleHistoryInput): OvulationResult {
  validateSharedInputs({ lmpDate, periodLength, lutealPhase, today });
  assertNotFuture(lmpDate, today, "La FUM no puede ser futura.");

  const previousDates = previousPeriodStartDates
    .filter(Boolean)
    .map((date) => {
      assertValidDate(date);
      if (comparePlainDates(date, lmpDate) >= 0) {
        throw new RangeError(
          "Las menstruaciones anteriores deben ser previas a la FUM actual.",
        );
      }
      return date;
    })
    .sort(comparePlainDates);

  if (previousDates.length < 2) {
    throw new RangeError(
      "Agrega al menos dos fechas anteriores para estimar ciclos variables.",
    );
  }

  const cycleLengths = [...previousDates, lmpDate].slice(1).map((date, index) => {
    const length = diffTotalDays([...previousDates, lmpDate][index], date);
    if (length < MIN_CYCLE_LENGTH || length > MAX_CYCLE_LENGTH) {
      throw new RangeError(
        "Las fechas ingresadas generan ciclos fuera del rango de 21 a 45 días.",
      );
    }
    return length;
  });
  const cycleRange = summarizeCycleLengths(cycleLengths);

  return buildRangeResult({
    mode: "history",
    modeLabel: "Ciclo variable por historial",
    lmpDate,
    periodLength,
    lutealPhase,
    cycleRange,
    today,
    intent,
  });
}

export function calculateFromCycleRange({
  lmpDate,
  shortestCycle,
  longestCycle,
  periodLength = DEFAULT_PERIOD_LENGTH,
  lutealPhase = DEFAULT_LUTEAL_PHASE,
  today = todayInLocalTimeZone(),
  intent = "conceive",
}: CycleRangeInput): OvulationResult {
  validateSharedInputs({ lmpDate, periodLength, lutealPhase, today });
  assertNotFuture(lmpDate, today, "La FUM no puede ser futura.");
  assertCycleLength(shortestCycle);
  assertCycleLength(longestCycle);

  if (shortestCycle > longestCycle) {
    throw new RangeError("El ciclo más corto no puede ser mayor que el más largo.");
  }

  const cycleRange = summarizeCycleLengths([shortestCycle, longestCycle]);

  if (shortestCycle === longestCycle) {
    return calculateStandardCycle({
      lmpDate,
      cycleLength: shortestCycle,
      periodLength,
      lutealPhase,
      today,
      intent,
    });
  }

  return buildRangeResult({
    mode: "range",
    modeLabel: "Ciclo variable por rango",
    lmpDate,
    periodLength,
    lutealPhase,
    cycleRange,
    today,
    intent,
  });
}

export function calculateFromDetectedOvulation({
  ovulationDate,
  source = "lh",
  periodLength = DEFAULT_PERIOD_LENGTH,
  lutealPhase = DEFAULT_LUTEAL_PHASE,
  today = todayInLocalTimeZone(),
  intent = "conceive",
}: DetectedOvulationInput): OvulationResult {
  assertValidDate(ovulationDate);
  validateSharedInputs({
    lmpDate: addCalendarDays(ovulationDate, -(DEFAULT_CYCLE_LENGTH - lutealPhase)),
    periodLength,
    lutealPhase,
    today,
  });
  assertNotFuture(ovulationDate, today, "La fecha de ovulación no puede ser futura.");

  const nextPeriodDate = addCalendarDays(ovulationDate, lutealPhase);
  const estimatedLmp = addCalendarDays(ovulationDate, -(DEFAULT_CYCLE_LENGTH - lutealPhase));
  const confidence = getDetectedOvulationConfidence(source);

  return buildOvulationResult({
    mode: "detected",
    modeLabel: `Ovulación detectada (${getOvulationSourceLabel(source)})`,
    lmpDate: estimatedLmp,
    periodLength,
    lutealPhase,
    cycleLength: DEFAULT_CYCLE_LENGTH,
    nextPeriodDate,
    ovulationStart: ovulationDate,
    ovulationEnd: ovulationDate,
    today,
    intent,
    confidence,
    confidenceMessage: getDetectedOvulationConfidenceMessage(source),
  });
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

export function formatOvulationDate(date: PlainDateParts): string {
  return formatPlainDate(date, DEFAULT_LOCALE);
}

export function formatFullOvulationDate(date: PlainDateParts): string {
  return formatFullPlainDate(date, DEFAULT_LOCALE);
}

export function formatOvulationDateRange(
  start: PlainDateParts,
  end: PlainDateParts,
): string {
  if (comparePlainDates(start, end) === 0) {
    return formatPlainDate(start, DEFAULT_LOCALE);
  }

  if (start.year === end.year && start.month === end.month) {
    return `${formatDay(start)} al ${formatPlainDate(end, DEFAULT_LOCALE)}`;
  }

  if (start.year === end.year) {
    return `${formatDayMonth(start)} al ${formatPlainDate(end, DEFAULT_LOCALE)}`;
  }

  return `${formatPlainDate(start, DEFAULT_LOCALE)} al ${formatPlainDate(
    end,
    DEFAULT_LOCALE,
  )}`;
}

export function getCycleDay(lmpDate: PlainDateParts, date: PlainDateParts): number {
  return diffTotalDays(lmpDate, date) + 1;
}

export function buildOvulationCopyText(result: OvulationResult): string {
  return [
    "Calculadora de ovulación - calculadoras.tools",
    `Ventana fértil estimada: ${formatOvulationDateRange(
      result.fertileStart,
      result.fertileEnd,
    )}`,
    `Ovulación estimada: ${formatOvulationDateRange(
      result.ovulationStart,
      result.ovulationEnd,
    )}`,
    `Próxima menstruación estimada: ${formatOvulationDateRange(
      result.nextPeriodRange?.start ?? result.nextPeriodDate,
      result.nextPeriodRange?.end ?? result.nextPeriodDate,
    )}`,
    `Confianza: ${result.confidence}`,
  ].join("\n");
}

function buildRangeResult({
  mode,
  modeLabel,
  lmpDate,
  periodLength,
  lutealPhase,
  cycleRange,
  today,
  intent,
}: {
  mode: "history" | "range";
  modeLabel: string;
  lmpDate: PlainDateParts;
  periodLength: number;
  lutealPhase: number;
  cycleRange: CycleRangeSummary;
  today: PlainDateParts;
  intent: CycleIntent;
}): OvulationResult {
  const nextPeriodRange = {
    start: addCalendarDays(lmpDate, cycleRange.shortest),
    end: addCalendarDays(lmpDate, cycleRange.longest),
  };
  const nextPeriodDate = addCalendarDays(lmpDate, Math.round(cycleRange.average));
  const ovulationStart = addCalendarDays(nextPeriodRange.start, -lutealPhase);
  const ovulationEnd = addCalendarDays(nextPeriodRange.end, -lutealPhase);
  const confidence = getRangeConfidence(cycleRange);

  return buildOvulationResult({
    mode,
    modeLabel,
    lmpDate,
    periodLength,
    lutealPhase,
    cycleRange,
    nextPeriodDate,
    nextPeriodRange,
    ovulationStart,
    ovulationEnd,
    today,
    intent,
    confidence,
    confidenceMessage:
      confidence === "Alta"
        ? "Buena estimación si tus ciclos recientes mantienen este patrón."
        : confidence === "Media"
          ? "Estimación útil, aunque la variación del ciclo amplía la ventana fértil."
          : "Con ciclos variables, la ovulación es menos predecible y conviene usar esta fecha como rango amplio.",
  });
}

function buildOvulationResult({
  mode,
  modeLabel,
  lmpDate,
  periodLength,
  lutealPhase,
  cycleLength,
  cycleRange,
  nextPeriodDate,
  nextPeriodRange,
  ovulationStart,
  ovulationEnd,
  today,
  intent,
  confidence,
  confidenceMessage,
}: {
  mode: OvulationMode;
  modeLabel: string;
  lmpDate: PlainDateParts;
  periodLength: number;
  lutealPhase: number;
  cycleLength?: number;
  cycleRange?: CycleRangeSummary;
  nextPeriodDate: PlainDateParts;
  nextPeriodRange?: DateRange;
  ovulationStart: PlainDateParts;
  ovulationEnd: PlainDateParts;
  today: PlainDateParts;
  intent: CycleIntent;
  confidence: ConfidenceLevel;
  confidenceMessage: string;
}): OvulationResult {
  const fertileStart = addCalendarDays(ovulationStart, -5);
  const fertileEnd = ovulationEnd;
  const peakStart =
    comparePlainDates(ovulationStart, ovulationEnd) === 0
      ? addCalendarDays(ovulationStart, -2)
      : ovulationStart;
  const peakEnd = ovulationEnd;
  const observationEnd = addCalendarDays(ovulationEnd, 1);
  const periodEndDate = addCalendarDays(lmpDate, periodLength - 1);
  const partialResult = {
    mode,
    modeLabel,
    lmpDate,
    periodLength,
    periodEndDate,
    lutealPhase,
    cycleLength,
    cycleRange,
    nextPeriodDate,
    nextPeriodRange,
    ovulationStart,
    ovulationEnd,
    fertileStart,
    fertileEnd,
    peakStart,
    peakEnd,
    observationEnd,
    confidence,
    confidenceMessage,
  };
  const warnings = buildWarnings({
    lmpDate,
    today,
    cycleLength,
    cycleRange,
    periodLength,
    lutealPhase,
    nextPeriodDate,
    nextPeriodRange,
    intent,
  });
  const result = {
    ...partialResult,
    warnings,
    todayStatus: buildTodayStatus({ ...partialResult, today }),
    fertilityRows: buildFertilityRows({
      lmpDate,
      fertileStart,
      observationEnd,
      ovulationStart,
      ovulationEnd,
    }),
    probabilityRows: PROBABILITY_REFERENCE_ROWS,
  };

  return result;
}

function buildFertilityRows({
  lmpDate,
  fertileStart,
  observationEnd,
  ovulationStart,
  ovulationEnd,
}: {
  lmpDate: PlainDateParts;
  fertileStart: PlainDateParts;
  observationEnd: PlainDateParts;
  ovulationStart: PlainDateParts;
  ovulationEnd: PlainDateParts;
}): FertilityDay[] {
  const rows: FertilityDay[] = [];
  let current = fertileStart;

  while (comparePlainDates(current, observationEnd) <= 0) {
    rows.push(buildFertilityDay(current, lmpDate, ovulationStart, ovulationEnd));
    current = addCalendarDays(current, 1);
  }

  return rows;
}

function buildFertilityDay(
  date: PlainDateParts,
  lmpDate: PlainDateParts,
  ovulationStart: PlainDateParts,
  ovulationEnd: PlainDateParts,
): FertilityDay {
  const isOvulationEstimate = isBetween(date, ovulationStart, ovulationEnd);
  const isObservationMargin = comparePlainDates(date, addCalendarDays(ovulationEnd, 1)) === 0;
  const daysToOvulationStart = diffTotalDays(date, ovulationStart);
  const cycleDay = getCycleDay(lmpDate, date);

  if (isOvulationEstimate) {
    return {
      date,
      cycleDay,
      relation:
        comparePlainDates(ovulationStart, ovulationEnd) === 0
          ? "O"
          : "Ovulación posible",
      level: "Muy alta",
      description: "Ovulación estimada o posible dentro del rango.",
      isOvulationEstimate,
      isObservationMargin,
    };
  }

  if (isObservationMargin) {
    return {
      date,
      cycleDay,
      relation: "O + 1",
      level: "Margen bajo",
      description: "Margen por incertidumbre del cálculo, no pico principal.",
      isOvulationEstimate,
      isObservationMargin,
    };
  }

  const relation = `O - ${daysToOvulationStart}`;
  const level = getPreOvulationLevel(daysToOvulationStart);

  return {
    date,
    cycleDay,
    relation,
    level,
    description:
      daysToOvulationStart <= 2
        ? "Uno de los días con mayor probabilidad relativa."
        : daysToOvulationStart === 5
          ? "Inicio de la ventana fértil estimada."
          : "Fertilidad estimada en aumento.",
    isOvulationEstimate,
    isObservationMargin,
  };
}

function buildTodayStatus({
  lmpDate,
  periodEndDate,
  fertileStart,
  fertileEnd,
  ovulationStart,
  ovulationEnd,
  observationEnd,
  nextPeriodDate,
  nextPeriodRange,
  cycleLength,
  cycleRange,
  today,
}: Pick<
  OvulationResult,
  | "lmpDate"
  | "periodEndDate"
  | "fertileStart"
  | "fertileEnd"
  | "ovulationStart"
  | "ovulationEnd"
  | "observationEnd"
  | "nextPeriodDate"
  | "nextPeriodRange"
  | "cycleLength"
  | "cycleRange"
> & { today: PlainDateParts }): CycleTodayStatus {
  if (comparePlainDates(today, lmpDate) < 0) {
    return {
      kind: "before-cycle",
      phase: "Antes del ciclo registrado",
      fertilityLabel: "Sin estimar",
      message: "La fecha de inicio ingresada todavía no ocurre.",
    };
  }

  const cycleDay = getCycleDay(lmpDate, today);
  const daysUntilNextPeriod = diffTotalDays(today, nextPeriodDate);
  const nextPeriodEnd = nextPeriodRange?.end ?? nextPeriodDate;
  const nextPeriodStart = nextPeriodRange?.start ?? nextPeriodDate;

  if (comparePlainDates(today, nextPeriodEnd) > 0) {
    return {
      kind: "overdue",
      cycleDay,
      phase: "Menstruación estimada atrasada",
      fertilityLabel: "No estimable",
      message:
        "La menstruación estimada ya debió llegar. Si tu ciclo suele ser regular, puede ser momento de hacer un test de embarazo o actualizar la FUM.",
      daysUntilNextPeriod,
    };
  }

  if (isBetween(today, nextPeriodStart, nextPeriodEnd)) {
    return {
      kind: "period-due",
      cycleDay,
      phase: "Menstruación estimada",
      fertilityLabel: "Baja",
      message: "Estás dentro del rango estimado para la próxima menstruación.",
      daysUntilNextPeriod,
    };
  }

  if (comparePlainDates(today, periodEndDate) <= 0) {
    return {
      kind: "menstruation",
      cycleDay,
      phase: "Menstruación",
      fertilityLabel: "Baja",
      message: `Hoy estás en el día ${formatNumber(cycleDay)} del ciclo estimado.`,
      daysUntilOvulation: diffTotalDays(today, ovulationStart),
      daysUntilNextPeriod,
    };
  }

  if (isBetween(today, ovulationStart, ovulationEnd)) {
    return {
      kind: "ovulation",
      cycleDay,
      phase: "Ovulación estimada",
      fertilityLabel: "Muy alta",
      message: `Hoy estás en el rango de ovulación estimada, día ${formatNumber(cycleDay)} del ciclo.`,
      daysUntilOvulation: 0,
      daysUntilNextPeriod,
    };
  }

  if (isBetween(today, fertileStart, fertileEnd)) {
    return {
      kind: "fertile",
      cycleDay,
      phase: "Ventana fértil estimada",
      fertilityLabel: "Alta",
      message: `Hoy estás dentro de la ventana fértil estimada, día ${formatNumber(cycleDay)} del ciclo.`,
      daysUntilOvulation: Math.max(diffTotalDays(today, ovulationStart), 0),
      daysUntilNextPeriod,
    };
  }

  if (comparePlainDates(today, observationEnd) === 0) {
    return {
      kind: "margin",
      cycleDay,
      phase: "Margen de observación",
      fertilityLabel: "Baja",
      message: "Hoy es el margen posterior a la ovulación estimada.",
      daysUntilNextPeriod,
    };
  }

  if (comparePlainDates(today, fertileStart) < 0) {
    return {
      kind: "follicular",
      cycleDay,
      phase: "Fase folicular",
      fertilityLabel: "Baja",
      message: `Hoy estás en el día ${formatNumber(cycleDay)} del ciclo. La ventana fértil estimada aún no inicia.`,
      daysUntilOvulation: diffTotalDays(today, ovulationStart),
      daysUntilNextPeriod,
    };
  }

  const estimatedCycleLength = cycleLength ?? Math.round(cycleRange?.average ?? DEFAULT_CYCLE_LENGTH);
  const nextOvulation = addCalendarDays(ovulationEnd, estimatedCycleLength);

  return {
    kind: "luteal",
    cycleDay,
    phase: "Fase lútea",
    fertilityLabel: "Baja",
    message: `Hoy estás en el día ${formatNumber(cycleDay)} del ciclo estimado. La ovulación estimada ya pasó.`,
    daysUntilOvulation: diffTotalDays(today, nextOvulation),
    daysUntilNextPeriod,
  };
}

function buildWarnings({
  lmpDate,
  today,
  cycleLength,
  cycleRange,
  periodLength,
  lutealPhase,
  nextPeriodDate,
  nextPeriodRange,
  intent,
}: {
  lmpDate: PlainDateParts;
  today: PlainDateParts;
  cycleLength?: number;
  cycleRange?: CycleRangeSummary;
  periodLength: number;
  lutealPhase: number;
  nextPeriodDate: PlainDateParts;
  nextPeriodRange?: DateRange;
  intent: CycleIntent;
}): string[] {
  const warnings: string[] = [];
  const latestNextPeriod = nextPeriodRange?.end ?? nextPeriodDate;

  if (intent === "avoid") {
    warnings.push(
      "Esta calculadora no es un método anticonceptivo. Si quieres evitar un embarazo, usa un método anticonceptivo confiable.",
    );
  }

  if (cycleLength && cycleLength > TYPICAL_CYCLE_MAX) {
    warnings.push("Los ciclos largos pueden hacer menos precisa la predicción.");
  }

  if (cycleRange && cycleRange.spread > 7) {
    warnings.push(
      "Con ciclos variables, la ventana fértil es más amplia y menos predecible.",
    );
  }

  if (periodLength > 7) {
    warnings.push(
      "Sangrados de más de 7 días pueden ameritar consulta si son habituales.",
    );
  }

  if (lutealPhase < 12) {
    warnings.push(
      "Si tu fase lútea suele ser menor de 12 días, coméntalo con tu profesional de salud.",
    );
  }

  if (comparePlainDates(today, latestNextPeriod) > 0) {
    warnings.push(
      "La menstruación estimada ya debió llegar. Si tu ciclo suele ser regular y no llegó, puede ser buen momento para hacer un test de embarazo.",
    );
  }

  if (diffTotalDays(lmpDate, today) > 70) {
    warnings.push(
      "Los datos guardados parecen pertenecer a un ciclo anterior. Actualiza la FUM si ya tuviste otra menstruación.",
    );
  }

  return [...new Set(warnings)];
}

function summarizeCycleLengths(cycleLengths: number[]): CycleRangeSummary {
  const shortest = Math.min(...cycleLengths);
  const longest = Math.max(...cycleLengths);
  const average =
    Math.round(
      (cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length) *
        10,
    ) / 10;
  const variance =
    cycleLengths.reduce((sum, length) => sum + (length - average) ** 2, 0) /
    cycleLengths.length;
  const variability = Math.ceil(Math.sqrt(variance));

  return {
    shortest,
    longest,
    average,
    variability,
    cycleCount: cycleLengths.length,
    spread: longest - shortest,
  };
}

function getRangeConfidence(cycleRange: CycleRangeSummary): ConfidenceLevel {
  const withinTypical =
    cycleRange.shortest >= TYPICAL_CYCLE_MIN &&
    cycleRange.longest <= TYPICAL_CYCLE_MAX;

  if (cycleRange.cycleCount >= 3 && cycleRange.spread <= 3 && withinTypical) {
    return "Alta";
  }

  if (cycleRange.spread <= 7 && withinTypical) {
    return "Media";
  }

  return "Baja";
}

function getDetectedOvulationConfidence(source: OvulationSource): ConfidenceLevel {
  if (source === "ultrasound" || source === "clinical") {
    return "Alta";
  }

  if (source === "bbt") {
    return "Alta";
  }

  if (source === "lh") {
    return "Media";
  }

  return "Baja";
}

function getDetectedOvulationConfidenceMessage(source: OvulationSource): string {
  if (source === "ultrasound" || source === "clinical") {
    return "Estimación de alta confianza si la fecha fue indicada por seguimiento clínico.";
  }

  if (source === "bbt") {
    return "La temperatura basal puede confirmar que la ovulación ya ocurrió si el registro es consistente.";
  }

  if (source === "lh") {
    return "El test LH anticipa la ovulación, pero no la confirma por sí solo.";
  }

  return "Estimación orientativa según la señal ingresada.";
}

function getOvulationSourceLabel(source: OvulationSource): string {
  const labels: Record<OvulationSource, string> = {
    lh: "test LH",
    bbt: "temperatura basal",
    mucus: "moco cervical",
    ultrasound: "ecografía",
    clinical: "seguimiento clínico",
    other: "otra señal",
  };

  return labels[source];
}

function getPreOvulationLevel(daysToOvulation: number): FertilityLevel {
  if (daysToOvulation <= 1) return "Muy alta";
  if (daysToOvulation === 2) return "Alta";
  if (daysToOvulation === 3) return "Media-alta";
  if (daysToOvulation === 4) return "Media";
  return "Baja-media";
}

function validateSharedInputs({
  lmpDate,
  periodLength,
  lutealPhase,
  today,
}: {
  lmpDate: PlainDateParts;
  periodLength: number;
  lutealPhase: number;
  today: PlainDateParts;
}) {
  assertValidDate(lmpDate);
  assertValidDate(today);
  assertIntegerRange(periodLength, MIN_PERIOD_LENGTH, MAX_PERIOD_LENGTH, "periodLength");
  assertIntegerRange(lutealPhase, MIN_LUTEAL_PHASE, MAX_LUTEAL_PHASE, "lutealPhase");
}

function assertValidDate(date: PlainDateParts) {
  if (!isValidDateParts(date)) {
    throw new RangeError("La fecha no es válida.");
  }
}

function assertNotFuture(
  date: PlainDateParts,
  today: PlainDateParts,
  message: string,
) {
  if (comparePlainDates(date, today) > 0) {
    throw new RangeError(message);
  }
}

function assertCycleLength(value: number) {
  assertIntegerRange(value, MIN_CYCLE_LENGTH, MAX_CYCLE_LENGTH, "cycleLength");
}

function assertIntegerRange(
  value: number,
  min: number,
  max: number,
  field: string,
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${field} está fuera de rango.`);
  }
}

function isBetween(
  date: PlainDateParts,
  start: PlainDateParts,
  end: PlainDateParts,
): boolean {
  return comparePlainDates(date, start) >= 0 && comparePlainDates(date, end) <= 0;
}

function formatDay(date: PlainDateParts): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

function formatDayMonth(date: PlainDateParts): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

function toUtcDate(date: PlainDateParts): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}
