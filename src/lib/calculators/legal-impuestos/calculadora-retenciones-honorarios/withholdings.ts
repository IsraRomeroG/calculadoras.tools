import {
  MEXICO_HONORARIOS_2026,
  type HonorariosRegime,
} from "./rules/mexico/2026";

export type PayerType = "individual" | "legal-entity" | "undefined";
export type IvaTreatment = "unconfirmed" | "standard" | "zero-or-exempt" | "manual";
export type PersonalServiceStatus = "yes" | "no" | "unknown";

export interface WithholdingRateInputs {
  transferredTaxPercent: number;
  incomeTaxWithholdingPercent: number;
  ivaWithholdingPercentOfTransferredTax: number;
}

export interface OtherConcept {
  label: string;
  amount: number;
}

export interface WithholdingInput extends WithholdingRateInputs {
  period: string;
  subtotal: number;
  regime: HonorariosRegime;
  payerType: PayerType;
  ivaTreatment: IvaTreatment;
  personalService: PersonalServiceStatus;
  otherConcepts?: OtherConcept[];
  manuallyEditedRateIds?: string[];
}

export interface WithholdingResult {
  subtotal: number;
  transferredTax: number;
  incomeTaxWithheld: number;
  ivaWithheld: number;
  totalInvoiced: number;
  totalWithheld: number;
  otherConceptsTotal: number;
  netToReceive: number;
  totalWithheldRate: number;
  rates: WithholdingRateInputs;
  manualRateIds: string[];
  warnings: string[];
  breakdown: Array<{ id: string; label: string; amount: number; note?: string }>;
}

export function isMexicoHonorariosPresetCurrent(): boolean {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  return MEXICO_HONORARIOS_2026.status === "current" &&
    today >= MEXICO_HONORARIOS_2026.effectiveFrom &&
    today <= MEXICO_HONORARIOS_2026.effectiveTo;
}

export function getDefaultWithholdingRates(options: {
  period: string;
  regime: HonorariosRegime;
  payerType: PayerType;
  ivaTreatment: IvaTreatment;
  personalService: PersonalServiceStatus;
}): WithholdingRateInputs {
  if (options.period !== MEXICO_HONORARIOS_2026.period || !isMexicoHonorariosPresetCurrent()) {
    return { transferredTaxPercent: 0, incomeTaxWithholdingPercent: 0, ivaWithholdingPercentOfTransferredTax: 0 };
  }

  const payerIsLegalEntity = options.payerType === "legal-entity";
  return {
    transferredTaxPercent: options.ivaTreatment === "standard"
      ? MEXICO_HONORARIOS_2026.defaultTransferredTaxPercent
      : 0,
    incomeTaxWithholdingPercent: payerIsLegalEntity && options.regime !== "undefined"
      ? MEXICO_HONORARIOS_2026.incomeTaxWithholdingPercent[options.regime]
      : 0,
    ivaWithholdingPercentOfTransferredTax: payerIsLegalEntity && options.personalService === "yes"
      ? MEXICO_HONORARIOS_2026.ivaWithholdingShareOfTransferredTax * 100
      : 0,
  };
}

export function calculateHonorariosWithholdings(input: WithholdingInput): WithholdingResult {
  const rates = [input.transferredTaxPercent, input.incomeTaxWithholdingPercent, input.ivaWithholdingPercentOfTransferredTax];
  if (!Number.isFinite(input.subtotal) || input.subtotal < 0) {
    throw new RangeError("El subtotal debe ser un importe válido y no negativo.");
  }
  if (rates.some((rate) => !Number.isFinite(rate) || rate < 0)) {
    throw new RangeError("Las tasas deben ser válidas y no negativas.");
  }
  for (const concept of input.otherConcepts ?? []) {
    if (!Number.isFinite(concept.amount) || concept.amount < 0) {
      throw new RangeError("Los otros conceptos deben ser válidos y no negativos.");
    }
  }

  const subtotal = roundCurrency(input.subtotal);
  const transferredTax = roundCurrency(subtotal * input.transferredTaxPercent / 100);
  const incomeTaxWithheld = roundCurrency(subtotal * input.incomeTaxWithholdingPercent / 100);
  const ivaWithheld = roundCurrency(transferredTax * input.ivaWithholdingPercentOfTransferredTax / 100);
  const totalInvoiced = roundCurrency(subtotal + transferredTax);
  const otherConcepts = (input.otherConcepts ?? []).map((concept) => ({
    label: concept.label.trim() || "Otro concepto",
    amount: roundCurrency(concept.amount),
  }));
  const otherConceptsTotal = roundCurrency(otherConcepts.reduce((total, concept) => total + concept.amount, 0));
  const totalWithheld = roundCurrency(incomeTaxWithheld + ivaWithheld);
  const netToReceive = roundCurrency(totalInvoiced - totalWithheld - otherConceptsTotal);
  const defaults = getDefaultWithholdingRates({
    period: input.period,
    regime: input.regime,
    payerType: input.payerType,
    ivaTreatment: input.ivaTreatment,
    personalService: input.personalService,
  });
  const differentFromPreset = (Object.keys(defaults) as Array<keyof WithholdingRateInputs>)
    .filter((key) => Math.abs(defaults[key] - input[key]) > 0.0000001);
  const manualRateIds = [...new Set([...differentFromPreset, ...(input.manuallyEditedRateIds ?? [])])];

  const warnings = [
    "Estimación aritmética: no determina el tratamiento fiscal de la actividad, residencia, régimen o comprobante.",
    "La retención de IVA requiere confirmar que el servicio es personal independiente y calcularse sobre el IVA efectivamente pagado.",
    ...(manualRateIds.length ? ["Una o más tasas fueron modificadas manualmente; revísalas con la fuente aplicable."] : []),
    ...(input.ivaTreatment === "manual" ? ["La tasa de IVA trasladado es manual y no representa un tratamiento fiscal determinado."] : []),
    ...(input.ivaTreatment === "unconfirmed" ? ["No se agrega IVA trasladado hasta que confirmes el tratamiento aplicable a tu servicio."] : []),
  ];

  return {
    subtotal,
    transferredTax,
    incomeTaxWithheld,
    ivaWithheld,
    totalInvoiced,
    totalWithheld,
    otherConceptsTotal,
    netToReceive,
    totalWithheldRate: subtotal > 0 ? totalWithheld / subtotal * 100 : 0,
    rates: {
      transferredTaxPercent: input.transferredTaxPercent,
      incomeTaxWithholdingPercent: input.incomeTaxWithholdingPercent,
      ivaWithholdingPercentOfTransferredTax: input.ivaWithholdingPercentOfTransferredTax,
    },
    manualRateIds,
    warnings,
    breakdown: [
      { id: "subtotal", label: "Subtotal de honorarios", amount: subtotal },
      { id: "transferred-tax", label: "Impuesto trasladado", amount: transferredTax, note: `${formatRate(input.transferredTaxPercent)} sobre el subtotal.` },
      { id: "total-invoiced", label: "Total facturado estimado", amount: totalInvoiced },
      { id: "income-tax-withheld", label: "Retención estimada de ISR", amount: incomeTaxWithheld, note: `${formatRate(input.incomeTaxWithholdingPercent)} sobre el subtotal.` },
      { id: "iva-withheld", label: "Retención estimada de IVA", amount: ivaWithheld, note: `${formatRate(input.ivaWithholdingPercentOfTransferredTax)} del IVA trasladado.` },
      ...otherConcepts.map((concept, index) => ({ id: `other-${index}`, label: concept.label, amount: concept.amount })),
      { id: "net", label: "Neto estimado a recibir", amount: netToReceive },
    ],
  };
}

export type ParsedNumber =
  | { ok: true; value: number }
  | { ok: false; error: "required" | "invalid" | "negative" | "too_many_decimals" };

export function parseNonNegativeNumber(value: string, required = false): ParsedNumber {
  const trimmed = value.trim();
  if (!trimmed) return required ? { ok: false, error: "required" } : { ok: true, value: 0 };
  if (/[-−]/.test(trimmed)) return { ok: false, error: "negative" };
  const cleaned = trimmed.replace(/[$%\s]/g, "");
  if (!cleaned || /[^0-9.,]/.test(cleaned)) return { ok: false, error: "invalid" };
  const normalized = normalizeSeparators(cleaned);
  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) return { ok: false, error: "invalid" };
  const decimals = normalized.split(".")[1];
  if (decimals && decimals.length > 4) return { ok: false, error: "too_many_decimals" };
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? { ok: true, value: numeric } : { ok: false, error: "invalid" };
}

export function formatHonorariosMoney(value: number, locale = "es-MX"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatRate(value: number, locale = "es-MX"): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value)}%`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizeSeparators(value: string): string {
  const comma = value.lastIndexOf(",");
  const dot = value.lastIndexOf(".");
  if (comma !== -1 && dot !== -1) {
    const decimal = comma > dot ? "," : ".";
    const thousands = decimal === "," ? "." : ",";
    return value.replaceAll(thousands, "").replace(decimal, ".");
  }
  if (comma !== -1) return normalizeSingleSeparator(value, ",");
  if (dot !== -1) return normalizeSingleSeparator(value, ".");
  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);
  if (parts.length === 2) {
    const [integer, fraction] = parts;
    if (!integer || !fraction) return value;
    return fraction.length === 3 && integer.length <= 3 ? `${integer}${fraction}` : `${integer}.${fraction}`;
  }
  if (parts.length > 2 && parts.every(Boolean) && parts.slice(1).every((part) => part.length === 3)) return parts.join("");
  return value;
}
