import {
  calculateFromCycleHistory as calculateFromCycleHistoryBase,
  calculateFromCycleRange as calculateFromCycleRangeBase,
  calculateFromDetectedOvulation as calculateFromDetectedOvulationBase,
  calculateStandardCycle as calculateStandardCycleBase,
  formatIsoDate,
  type OvulationResult,
} from "./ovulation";

export type * from "./ovulation";
export {
  addCalendarDays,
  comparePlainDates,
  diffTotalDays,
  formatIsoDate,
  parseIsoDate,
  todayInLocalTimeZone,
} from "./ovulation";

const warningTranslations = new Map([
  ["Esta calculadora no es un método anticonceptivo. Si quieres evitar un embarazo, usa un método anticonceptivo confiable.", "This calculator is not a method of contraception. If you want to avoid pregnancy, use a reliable contraceptive method."],
  ["Los ciclos largos pueden hacer menos precisa la predicción.", "Long cycles can make the prediction less precise."],
  ["Con ciclos variables, la ventana fértil es más amplia y menos predecible.", "With variable cycles, the fertile window is wider and less predictable."],
  ["Sangrados de más de 7 días pueden ameritar consulta si son habituales.", "Periods lasting more than 7 days may warrant medical advice if this is typical for you."],
  ["Si tu fase lútea suele ser menor de 12 días, coméntalo con tu profesional de salud.", "If your luteal phase is usually shorter than 12 days, discuss it with your healthcare professional."],
  ["La menstruación estimada ya debió llegar. Si tu ciclo suele ser regular y no llegó, puede ser buen momento para hacer un test de embarazo.", "Your estimated period is overdue. If your cycle is usually regular, this may be a good time to take a pregnancy test."],
  ["Los datos guardados parecen pertenecer a un ciclo anterior. Actualiza la FUM si ya tuviste otra menstruación.", "The saved information appears to belong to an earlier cycle. Update the first day of your last period if another period has started."],
]);

const modeLabels = {
  standard: "Regular cycle",
  history: "Variable cycle using history",
  range: "Variable cycle using a range",
  detected: "Detected ovulation",
} as const;

const sourceLabels = {
  lh: "LH test",
  bbt: "basal body temperature",
  mucus: "cervical mucus",
  ultrasound: "ultrasound",
  clinical: "clinical monitoring",
  other: "other sign",
} as const;

function localizeResult(result: OvulationResult): OvulationResult {
  const confidence = result.confidence === "Alta" ? "High" : result.confidence === "Media" ? "Medium" : "Low";
  const modeLabel = result.mode === "detected"
    ? `Detected ovulation (${sourceLabels[(result.modeLabel.match(/\(([^)]+)\)/)?.[1] ?? "other") as keyof typeof sourceLabels] ?? "reported sign"})`
    : modeLabels[result.mode];

  const fertilityRows = result.fertilityRows.map((row) => ({
    ...row,
    relation: row.relation === "Ovulación posible" ? "Possible ovulation" : row.relation,
    level: ({ "Baja": "Low", "Baja-media": "Low–medium", "Media": "Medium", "Media-alta": "Medium–high", "Alta": "High", "Muy alta": "Very high", "Margen bajo": "Low-probability margin" }[row.level] ?? row.level) as typeof row.level,
    description: row.isOvulationEstimate
      ? "Estimated or possible ovulation within this range."
      : row.isObservationMargin
        ? "Uncertainty margin for the estimate, not the main peak."
        : row.relation === "O - 5"
          ? "Start of the estimated fertile window."
          : Number(row.relation.replace("O - ", "")) <= 2
            ? "One of the days with the highest relative probability."
            : "Estimated fertility is increasing.",
  }));

  const todayStatus = localizeTodayStatus(result.todayStatus);

  return {
    ...result,
    modeLabel,
    confidence: confidence as typeof result.confidence,
    confidenceMessage: confidence === "High"
      ? "The estimate is based on information that provides a relatively narrow ovulation range."
      : confidence === "Medium"
        ? "The estimate is useful for general guidance, but ovulation may vary by several days."
        : "The estimate has substantial uncertainty; use cycle signs or clinical guidance for greater precision.",
    warnings: result.warnings.map((warning) => warningTranslations.get(warning) ?? warning),
    todayStatus,
    fertilityRows,
  };
}

function localizeTodayStatus(status: OvulationResult["todayStatus"]): OvulationResult["todayStatus"] {
  const day = status.cycleDay;
  const messages = {
    "before-cycle": ["Before the recorded cycle", "Not estimated", "The start date you entered has not occurred yet."],
    overdue: ["Estimated period overdue", "Not estimable", "Your estimated period is overdue. If your cycle is usually regular, consider taking a pregnancy test or updating the first day of your last period."],
    "period-due": ["Estimated period", "Low", "You are within the estimated range for your next period."],
    menstruation: ["Period", "Low", `Today is day ${day} of your estimated cycle.`],
    ovulation: ["Estimated ovulation", "Very high", `Today falls within the estimated ovulation range, on day ${day} of your cycle.`],
    fertile: ["Estimated fertile window", "High", `Today falls within the estimated fertile window, on day ${day} of your cycle.`],
    margin: ["Observation margin", "Low", "Today is the uncertainty margin following estimated ovulation."],
    follicular: ["Follicular phase", "Low", `Today is day ${day} of your cycle. The estimated fertile window has not started yet.`],
    luteal: ["Luteal phase", "Low", `Today is day ${day} of your estimated cycle. Estimated ovulation has already passed.`],
  } as const;
  const [phase, fertilityLabel, message] = messages[status.kind];
  return { ...status, phase, fertilityLabel, message };
}

export function calculateStandardCycle(input: Parameters<typeof calculateStandardCycleBase>[0]) {
  return localizeResult(calculateStandardCycleBase(input));
}

export function calculateFromCycleHistory(input: Parameters<typeof calculateFromCycleHistoryBase>[0]) {
  return localizeResult(calculateFromCycleHistoryBase(input));
}

export function calculateFromCycleRange(input: Parameters<typeof calculateFromCycleRangeBase>[0]) {
  return localizeResult(calculateFromCycleRangeBase(input));
}

export function calculateFromDetectedOvulation(input: Parameters<typeof calculateFromDetectedOvulationBase>[0]) {
  const result = calculateFromDetectedOvulationBase(input);
  const localized = localizeResult(result);
  return { ...localized, modeLabel: `Detected ovulation (${sourceLabels[input.source]})` };
}

function toDate(date: { year: number; month: number; day: number }) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function formatOvulationDate(date: { year: number; month: number; day: number }): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(toDate(date));
}

export function formatFullOvulationDate(date: { year: number; month: number; day: number }): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(toDate(date));
}

export function formatOvulationDateRange(start: { year: number; month: number; day: number }, end: { year: number; month: number; day: number }): string {
  return formatIsoDate(start) === formatIsoDate(end)
    ? formatOvulationDate(start)
    : `${formatOvulationDate(start)}–${formatOvulationDate(end)}`;
}

export function buildOvulationCopyText(result: OvulationResult): string {
  return [
    "Ovulation Calculator - calculadoras.tools",
    `Estimated fertile window: ${formatOvulationDateRange(result.fertileStart, result.fertileEnd)}`,
    `Estimated ovulation: ${formatOvulationDateRange(result.ovulationStart, result.ovulationEnd)}`,
    `Estimated next period: ${formatOvulationDateRange(result.nextPeriodRange?.start ?? result.nextPeriodDate, result.nextPeriodRange?.end ?? result.nextPeriodDate)}`,
    `Confidence: ${result.confidence}`,
  ].join("\n");
}
