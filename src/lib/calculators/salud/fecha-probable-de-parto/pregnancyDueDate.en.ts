import {
  buildMethodComparisons as buildMethodComparisonsBase,
  calculateFromAssistedReproduction as calculateFromAssistedReproductionBase,
  calculateFromLmp as calculateFromLmpBase,
  calculateFromOfficialDueDate as calculateFromOfficialDueDateBase,
  calculateFromOvulation as calculateFromOvulationBase,
  calculateFromUltrasound as calculateFromUltrasoundBase,
  type AssistedReproductionInput,
  type ConfidenceLevel,
  type DueDateResult,
  type LmpInput,
  type MethodComparison,
  type OfficialDueDateInput,
  type OvulationInput,
  type PlainDateParts,
  type UltrasoundInput,
} from "./pregnancyDueDate";
import {
  formatFullPlainDate,
  formatPlainDate,
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export {
  CONCEPTION_TO_DUE_DAYS,
  DEFAULT_CYCLE_LENGTH,
  DEFAULT_LUTEAL_PHASE,
  MAX_CYCLE_LENGTH,
  MAX_LUTEAL_PHASE,
  MIN_CYCLE_LENGTH,
  MIN_LUTEAL_PHASE,
  PREGNANCY_DAYS,
  formatIsoDate,
  parseIsoDate,
  parsePregnancyDateParts,
  todayInLocalTimeZone,
} from "./pregnancyDueDate";

export type {
  AssistedReproductionInput,
  AssistedReproductionKind,
  ConceptionSource,
  DueDateMethod,
  DueDateResult,
  GestationalAge,
  LmpInput,
  MethodComparison,
  OfficialDueDateInput,
  OvulationInput,
  ParseDatePartsInput,
  ParseDatePartsResult,
  PlainDateParts,
  PregnancyMilestone,
  PregnancyStatus,
  TermWindow,
  UltrasoundInput,
} from "./pregnancyDueDate";

export const DEFAULT_LOCALE = "en-US";

const CONFIDENCE = {
  Alta: "High",
  Media: "Medium",
  Baja: "Low",
} as const;

const WARNING_TRANSLATIONS: Record<string, string> = {
  "Con ciclos muy irregulares la FPP puede ser menos precisa. Una ecografía temprana suele orientar mejor la fecha.":
    "With very irregular cycles, the due date may be less precise. An early ultrasound usually provides better dating.",
  "Los espermatozoides pueden vivir varios días; por eso esta fecha es aproximada.":
    "Sperm can survive for several days, so this date is approximate.",
  "En el tercer trimestre la ecografía suele ser menos precisa para fechar la FPP.":
    "Third-trimester ultrasound is generally less precise for pregnancy dating.",
  "Las ecografías muy tempranas pueden cambiar cuando se repite la medición.":
    "Very early ultrasound dating may change when the measurement is repeated.",
  "Si tu clínica te dio una FPP oficial, usa esa fecha como referencia principal.":
    "If your clinic provided an official due date, use it as your primary reference.",
  "Esta fecha sugiere más de 42 semanas de embarazo. Confirma el dato y consulta con tu médico si aún no has dado a luz.":
    "This date suggests more than 42 weeks of pregnancy. Confirm the information and contact your clinician if you have not yet given birth.",
  "La fecha probable de parto queda a más de 40 semanas desde hoy. Revisa si ingresaste la fecha correcta.":
    "The estimated due date is more than 40 weeks from today. Check that you entered the correct date.",
  "Si aún no has dado a luz, esta situación requiere seguimiento médico.":
    "If you have not yet given birth, this situation requires medical follow-up.",
};

export function calculateFromLmp(input: LmpInput): DueDateResult {
  const result = calculateFromLmpBase(input);
  const regular = (input.cycleLength ?? 28) >= 21 && (input.cycleLength ?? 28) <= 35;
  return translateResult(result, {
    methodLabel: "LMP",
    confidenceMessage: regular
      ? "A good estimate when your cycles are regular."
      : "A general estimate; with very irregular cycles, confirm the official date with your healthcare professional.",
  });
}

export function calculateFromOvulation(input: OvulationInput): DueDateResult {
  const result = calculateFromOvulationBase(input);
  const source = input.source ?? "ovulation";
  const sourceLabel = {
    intercourse: "sexual intercourse",
    insemination: "insemination",
    fertilization: "fertilization",
    ovulation: "ovulation",
  }[source];
  return translateResult(result, {
    methodLabel: `Ovulation/conception (${sourceLabel})`,
    confidenceMessage: source === "intercourse"
      ? "The date of intercourse does not always match the actual date of fertilization."
      : "A good estimate when the ovulation or fertilization date is reliable.",
  });
}

export function calculateFromUltrasound(input: UltrasoundInput): DueDateResult {
  const result = calculateFromUltrasoundBase(input);
  const confidenceMessage = input.weeks < 14
    ? "An early ultrasound is generally a high-confidence dating reference."
    : input.weeks < 28
      ? "A useful estimate, although dating precision decreases as pregnancy advances."
      : "A general estimate; confirm the official due date with your healthcare professional.";
  return translateResult(result, {
    methodLabel: `Ultrasound ${input.weeks}+${input.days ?? 0}`,
    confidenceMessage,
  });
}

export function calculateFromAssistedReproduction(input: AssistedReproductionInput): DueDateResult {
  const result = calculateFromAssistedReproductionBase(input);
  const methodLabel = input.kind === "transfer"
    ? `Day-${input.embryoAgeDays ?? 5} embryo transfer`
    : input.kind === "iui"
      ? "Intrauterine insemination"
      : "IVF/ICSI";
  return translateResult(result, {
    methodLabel,
    confidenceMessage: input.kind === "iui"
      ? "A good estimate when the insemination date was documented by the clinic."
      : "A high-confidence estimate when the fertilization or transfer date is correct.",
  });
}

export function calculateFromOfficialDueDate(input: OfficialDueDateInput): DueDateResult {
  return translateResult(calculateFromOfficialDueDateBase(input), {
    methodLabel: "Official due date",
    confidenceMessage: "Use this as the primary reference because it was provided by your healthcare team.",
  });
}

export function buildMethodComparisons(
  principal: DueDateResult,
  results: DueDateResult[],
): MethodComparison[] {
  return buildMethodComparisonsBase(principal, results);
}

export function formatGestationalAge(age: { weeks: number; days: number }): string {
  return `${formatNumber(age.weeks)} weeks and ${formatNumber(age.days)} days`;
}

export function formatRelativeDays(daysUntilDueDate: number): string {
  if (daysUntilDueDate > 0) return `${formatNumber(daysUntilDueDate)} days remaining`;
  if (daysUntilDueDate < 0) return `${formatNumber(Math.abs(daysUntilDueDate))} days have passed`;
  return "Today";
}

export function formatPregnancyDate(date: PlainDateParts): string {
  return formatPlainDate(date, DEFAULT_LOCALE);
}

export function formatFullPregnancyDate(date: PlainDateParts): string {
  return formatFullPlainDate(date, DEFAULT_LOCALE);
}

export function buildDueDateCopyText(result: DueDateResult): string {
  return [
    "Pregnancy due date calculator - calculadoras.tools",
    `Estimated due date: ${formatFullPregnancyDate(result.dueDate)}`,
    `Gestational age: ${formatGestationalAge(result.gestationalAge)}`,
    `Method: ${result.methodLabel}`,
    `Confidence: ${result.confidence}`,
  ].join("\n");
}

function translateResult(
  result: DueDateResult,
  labels: { methodLabel: string; confidenceMessage: string },
): DueDateResult {
  const days = result.daysUntilDueDate;
  const statusMessage = days > 14
    ? `${formatNumber(days)} days remain until your estimated due date.`
    : days > 0
      ? "Your due date is approaching. Your baby could arrive at any time over the next few weeks."
      : days === 0
        ? "Today is your estimated due date. Follow your healthcare team's guidance."
        : days >= -6
          ? `Your estimated due date was ${formatNumber(Math.abs(days))} days ago. It is common for a baby not to arrive on that exact date.`
          : `${formatNumber(Math.abs(days))} days have passed since your estimated due date. Stay in contact with your physician or midwife.`;

  const trimester = result.gestationalAge.totalDays < 0
    ? "Not started yet based on this date"
    : result.gestationalAge.totalDays < 14 * 7
      ? "First trimester"
      : result.gestationalAge.totalDays < 28 * 7
        ? "Second trimester"
        : "Third trimester";

  const termLabels = [
    ["Late preterm", "34+0 to 36+6"],
    ["Early term", "37+0 to 38+6"],
    ["Full term", "39+0 to 40+6"],
    ["Late term", "41+0 to 41+6"],
    ["Postterm", "From 42+0"],
  ];
  const milestoneLabels = [
    "End of the first trimester",
    "Typical anatomy ultrasound window",
    "Start of the third trimester",
    "Early term",
    "Estimated due date",
    "Postterm",
  ];

  return {
    ...result,
    methodLabel: labels.methodLabel,
    confidence: (CONFIDENCE[result.confidence as keyof typeof CONFIDENCE] ?? result.confidence) as ConfidenceLevel,
    confidenceMessage: labels.confidenceMessage,
    trimester,
    status: { ...result.status, message: statusMessage },
    termWindows: result.termWindows.map((row, index) => ({
      ...row,
      label: termLabels[index][0],
      gestationalRange: termLabels[index][1],
    })),
    milestones: result.milestones.map((row, index) => ({
      ...row,
      label: milestoneLabels[index],
      gestationalRange: row.gestationalRange.replace(" a ", " to "),
    })),
    warnings: result.warnings.map((warning) => WARNING_TRANSLATIONS[warning] ?? warning),
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
