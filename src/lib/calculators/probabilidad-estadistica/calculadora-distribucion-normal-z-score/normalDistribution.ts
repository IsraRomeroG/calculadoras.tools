export type NormalMode = "locate" | "probability" | "inverse";
export type NormalScale = "x" | "z";
export type NormalProbabilityType =
  | "less"
  | "greater"
  | "between"
  | "outside";

export type NormalInputField =
  | "value"
  | "mean"
  | "standardDeviation"
  | "lower"
  | "upper"
  | "percentile";

export interface NormalRawInput {
  mode: NormalMode;
  scale: NormalScale;
  probabilityType: NormalProbabilityType;
  value: string;
  mean: string;
  standardDeviation: string;
  lower: string;
  upper: string;
  percentile: string;
  decimals?: number;
}

export interface NormalInputError {
  field: NormalInputField;
  message: string;
}

export interface NormalSummaryItem {
  label: string;
  value: string;
}

export interface NormalGraph {
  region: NormalProbabilityType;
  leftZ?: number;
  rightZ?: number;
  markerZ?: number;
  mean: number;
  standardDeviation: number;
  scale: NormalScale;
  description: string;
}

export interface NormalCalculation {
  mode: NormalMode;
  scale: NormalScale;
  probabilityType: NormalProbabilityType;
  primary: string;
  title: string;
  notation: string;
  interpretation: string;
  formula: string;
  substitution: string;
  steps: string[];
  summary: NormalSummaryItem[];
  copyText: string;
  graph: NormalGraph;
  probability: number;
}

export type NormalCalculationResult =
  | { ok: true; calculation: NormalCalculation }
  | { ok: false; errors: NormalInputError[] };

export interface NormalExample {
  id: string;
  label: string;
  description: string;
  input: NormalRawInput;
}

const MAX_ABSOLUTE_INPUT = 1e100;
const MIN_STANDARD_DEVIATION = 1e-100;
const DEFAULT_DECIMALS = 4;
const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);

export const NORMAL_DISTRIBUTION_CANONICAL_PATH =
  "/probabilidad-estadistica/calculadora-distribucion-normal-z-score";

export const NORMAL_EXAMPLES: NormalExample[] = [
  {
    id: "score",
    label: "Valor 85",
    description: "Ubica 85 cuando la media es 70 y la desviación es 10.",
    input: {
      mode: "locate",
      scale: "x",
      probabilityType: "less",
      value: "85",
      mean: "70",
      standardDeviation: "10",
      lower: "",
      upper: "",
      percentile: "",
      decimals: 4,
    },
  },
  {
    id: "z-196",
    label: "Z = 1.96",
    description: "Calcula la probabilidad acumulada para Z = 1.96.",
    input: {
      mode: "probability",
      scale: "z",
      probabilityType: "less",
      value: "1.96",
      mean: "",
      standardDeviation: "",
      lower: "",
      upper: "",
      percentile: "",
      decimals: 4,
    },
  },
  {
    id: "central",
    label: "Entre −1 y 1",
    description: "Mide el área central entre una desviación a cada lado.",
    input: {
      mode: "probability",
      scale: "z",
      probabilityType: "between",
      value: "",
      mean: "",
      standardDeviation: "",
      lower: "-1",
      upper: "1",
      percentile: "",
      decimals: 4,
    },
  },
  {
    id: "outside",
    label: "Fuera de ±1.96",
    description: "Calcula las dos colas fuera del intervalo de 95%.",
    input: {
      mode: "probability",
      scale: "z",
      probabilityType: "outside",
      value: "",
      mean: "",
      standardDeviation: "",
      lower: "-1.96",
      upper: "1.96",
      percentile: "",
      decimals: 4,
    },
  },
  {
    id: "percentile",
    label: "Percentil 90",
    description: "Encuentra el valor del percentil 90 con media 70 y desviación 10.",
    input: {
      mode: "inverse",
      scale: "x",
      probabilityType: "less",
      value: "",
      mean: "70",
      standardDeviation: "10",
      lower: "",
      upper: "",
      percentile: "90",
      decimals: 4,
    },
  },
];

export function calculateZScore(
  value: number,
  mean: number,
  standardDeviation: number,
): number {
  assertFinite(value, "El valor");
  assertFinite(mean, "La media");
  assertPositiveStandardDeviation(standardDeviation);

  return normalizeNegativeZero((value - mean) / standardDeviation);
}

export function convertZToValue(
  z: number,
  mean: number,
  standardDeviation: number,
): number {
  assertFinite(z, "El Z-score");
  assertFinite(mean, "La media");
  assertPositiveStandardDeviation(standardDeviation);

  return normalizeNegativeZero(mean + z * standardDeviation);
}

export function standardNormalPdf(z: number): number {
  assertFinite(z, "El Z-score");
  return Math.exp(-0.5 * z * z) / SQRT_TWO_PI;
}

/**
 * Standard normal CDF evaluated through the regularized incomplete gamma
 * representation of erfc. This avoids cancellation in the negative tail.
 */
export function standardNormalCdf(z: number): number {
  assertFinite(z, "El Z-score");

  if (z === 0) return 0.5;
  if (z <= -38) return 0;
  if (z >= 9) return 1;

  const halfErfc = 0.5 * regularizedGammaQHalf((z * z) / 2);

  return clampProbability(z < 0 ? halfErfc : 1 - halfErfc);
}

export function standardNormalSurvival(z: number): number {
  return standardNormalCdf(-z);
}

export function probabilityBetween(lowerZ: number, upperZ: number): number {
  assertOrderedBounds(lowerZ, upperZ);
  return clampProbability(
    standardNormalCdf(upperZ) - standardNormalCdf(lowerZ),
  );
}

export function probabilityOutside(lowerZ: number, upperZ: number): number {
  assertOrderedBounds(lowerZ, upperZ);
  return clampProbability(
    standardNormalCdf(lowerZ) + standardNormalSurvival(upperZ),
  );
}

/**
 * Inverse standard normal CDF using Peter J. Acklam's rational approximation.
 */
export function inverseStandardNormalCdf(probability: number): number {
  assertFinite(probability, "La probabilidad");

  if (probability <= 0 || probability >= 1) {
    throw new RangeError("La probabilidad debe estar entre 0 y 1.");
  }

  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];
  const lowerBreakPoint = 0.02425;
  const upperBreakPoint = 1 - lowerBreakPoint;
  let result: number;

  if (probability < lowerBreakPoint) {
    const q = Math.sqrt(-2 * Math.log(probability));
    result =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q +
        c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (probability <= upperBreakPoint) {
    const q = probability - 0.5;
    const r = q * q;
    result =
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r +
        a[5]) *
      q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r +
        1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - probability));
    result =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q +
        c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  return normalizeNegativeZero(result);
}

export function parseNormalNumber(
  rawValue: string,
):
  | { ok: true; value: number; normalized: string }
  | { ok: false; message: string } {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, message: "Completa este campo." };
  }

  if (trimmed.includes(",") && trimmed.includes(".")) {
    return {
      ok: false,
      message: "No combines coma y punto decimal en el mismo número.",
    };
  }

  if (/^[+-]?\d{1,3}[.,]\d{3}$/.test(trimmed)) {
    return {
      ok: false,
      message: "No uses separadores de miles.",
    };
  }

  const normalized = trimmed.replace(",", ".");

  if (!/^[+-]?(?:\d+|\d*\.\d+)$/.test(normalized)) {
    return { ok: false, message: "Ingresa un número válido." };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_INPUT) {
    return {
      ok: false,
      message: "El valor es demasiado grande para calcularlo con precisión.",
    };
  }

  return {
    ok: true,
    value: normalizeNegativeZero(value),
    normalized: String(normalizeNegativeZero(value)),
  };
}

export function calculateNormalDistribution(
  input: NormalRawInput,
): NormalCalculationResult {
  const decimals = normalizeDecimals(input.decimals);
  const distribution = parseDistribution(input);

  if (!distribution.ok) return distribution;

  if (input.mode === "locate") {
    return calculateLocate(input, distribution.mean, distribution.standardDeviation, decimals);
  }

  if (input.mode === "inverse") {
    return calculateInverse(input, distribution.mean, distribution.standardDeviation, decimals);
  }

  return calculateProbability(
    input,
    distribution.mean,
    distribution.standardDeviation,
    decimals,
  );
}

function calculateLocate(
  input: NormalRawInput,
  mean: number,
  standardDeviation: number,
  decimals: number,
): NormalCalculationResult {
  const parsedValue = parseField(input.value, "value");

  if (!parsedValue.ok) return { ok: false, errors: [parsedValue.error] };

  const z =
    input.scale === "x"
      ? calculateZScore(parsedValue.value, mean, standardDeviation)
      : parsedValue.value;
  const value =
    input.scale === "x"
      ? parsedValue.value
      : convertZToValue(z, mean, standardDeviation);
  const probability = standardNormalCdf(z);
  const rightTail = standardNormalSurvival(z);
  const subject = input.scale === "x" ? formatNumber(value, decimals) : `Z = ${formatNumber(z, decimals)}`;
  const direction =
    Math.abs(z) < 1e-12
      ? "en la media"
      : z > 0
        ? "por encima de la media"
        : "por debajo de la media";
  const notation = input.scale === "x"
    ? `P(X ≤ ${formatNumber(value, decimals)})`
    : `P(Z ≤ ${formatNumber(z, decimals)})`;
  const formula =
    input.scale === "x" ? "z = (x − μ) / σ" : "Percentil = Φ(z)";
  const substitution =
    input.scale === "x"
      ? `z = (${formatFlexible(value)} − ${formatFlexible(mean)}) / ${formatFlexible(standardDeviation)} = ${formatNumber(z, decimals)}`
      : `Φ(${formatFlexible(z)}) = ${formatProbabilityDecimal(probability)}`;
  const interpretation = `${subject} está ${formatNumber(Math.abs(z), decimals)} desviaciones estándar ${direction} y se encuentra aproximadamente en el percentil ${formatPercentile(probability)}.`;
  const summary = [
    { label: "Z-score", value: formatNumber(z, decimals) },
    { label: "Percentil", value: formatPercentile(probability) },
    { label: "Cola izquierda", value: formatProbabilityPercentage(probability, decimals) },
    { label: "Cola derecha", value: formatProbabilityPercentage(rightTail, decimals) },
  ];

  return successCalculation({
    input,
    probability,
    primary: formatProbabilityPercentage(probability, decimals),
    title: `${formatProbabilityPercentage(probability, decimals)} de los valores está por debajo`,
    notation,
    interpretation,
    formula,
    substitution,
    steps: [
      substitution,
      `Φ(${formatNumber(z, decimals)}) = ${formatProbabilityDecimal(probability)}`,
      `Percentil = ${formatProbabilityPercentage(probability, decimals)}`,
    ],
    summary,
    graph: {
      region: "less",
      markerZ: z,
      rightZ: z,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con el área a la izquierda de ${subject} sombreada.`,
    },
  });
}

function calculateProbability(
  input: NormalRawInput,
  mean: number,
  standardDeviation: number,
  decimals: number,
): NormalCalculationResult {
  const interval =
    input.probabilityType === "between" ||
    input.probabilityType === "outside";
  const errors: NormalInputError[] = [];
  let lowerValue: number;
  let upperValue: number;

  if (interval) {
    const lower = parseField(input.lower, "lower");
    const upper = parseField(input.upper, "upper");
    if (!lower.ok) errors.push(lower.error);
    if (!upper.ok) errors.push(upper.error);
    if (errors.length > 0 || !lower.ok || !upper.ok) {
      return { ok: false, errors };
    }
    lowerValue = lower.value;
    upperValue = upper.value;
    if (lowerValue >= upperValue) {
      return {
        ok: false,
        errors: [
          {
            field: "lower",
            message: "El límite inferior debe ser menor que el límite superior.",
          },
        ],
      };
    }
  } else {
    const value = parseField(input.value, "value");
    if (!value.ok) return { ok: false, errors: [value.error] };
    lowerValue = value.value;
    upperValue = value.value;
  }

  const lowerZ =
    input.scale === "x"
      ? calculateZScore(lowerValue, mean, standardDeviation)
      : lowerValue;
  const upperZ =
    input.scale === "x"
      ? calculateZScore(upperValue, mean, standardDeviation)
      : upperValue;
  const variable = input.scale === "x" ? "X" : "Z";
  let probability: number;
  let notation: string;
  let title: string;
  let interpretation: string;
  let formula: string;
  let substitution: string;
  let graph: NormalGraph;

  if (input.probabilityType === "less") {
    probability = standardNormalCdf(upperZ);
    notation = `P(${variable} ≤ ${formatNumber(upperValue, decimals)})`;
    title = `Probabilidad de que ${variable} sea menor o igual`;
    interpretation = `Aproximadamente ${formatProbabilityPercentage(probability, decimals)} de los valores está en o por debajo de ${formatNumber(upperValue, decimals)}.`;
    formula = "P(Z ≤ z) = Φ(z)";
    substitution = `Φ(${formatNumber(upperZ, decimals)}) = ${formatProbabilityDecimal(probability)}`;
    graph = {
      region: "less",
      rightZ: upperZ,
      markerZ: upperZ,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con la cola izquierda hasta ${formatNumber(upperValue, decimals)} sombreada.`,
    };
  } else if (input.probabilityType === "greater") {
    probability = standardNormalSurvival(lowerZ);
    notation = `P(${variable} ≥ ${formatNumber(lowerValue, decimals)})`;
    title = `Probabilidad de que ${variable} sea mayor o igual`;
    interpretation = `Aproximadamente ${formatProbabilityPercentage(probability, decimals)} de los valores está en o por encima de ${formatNumber(lowerValue, decimals)}.`;
    formula = "P(Z ≥ z) = Φ(−z)";
    substitution = `Φ(${formatNumber(-lowerZ, decimals)}) = ${formatProbabilityDecimal(probability)}`;
    graph = {
      region: "greater",
      leftZ: lowerZ,
      markerZ: lowerZ,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con la cola derecha desde ${formatNumber(lowerValue, decimals)} sombreada.`,
    };
  } else if (input.probabilityType === "between") {
    probability = probabilityBetween(lowerZ, upperZ);
    notation = `P(${formatNumber(lowerValue, decimals)} ≤ ${variable} ≤ ${formatNumber(upperValue, decimals)})`;
    title = `Probabilidad entre los dos límites`;
    interpretation = `Aproximadamente ${formatProbabilityPercentage(probability, decimals)} de los valores está entre ${formatNumber(lowerValue, decimals)} y ${formatNumber(upperValue, decimals)}.`;
    formula = "P(a ≤ Z ≤ b) = Φ(b) − Φ(a)";
    substitution = `Φ(${formatNumber(upperZ, decimals)}) − Φ(${formatNumber(lowerZ, decimals)}) = ${formatProbabilityDecimal(probability)}`;
    graph = {
      region: "between",
      leftZ: lowerZ,
      rightZ: upperZ,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con el área central entre ${formatNumber(lowerValue, decimals)} y ${formatNumber(upperValue, decimals)} sombreada.`,
    };
  } else {
    probability = probabilityOutside(lowerZ, upperZ);
    notation = `P(${variable} ≤ ${formatNumber(lowerValue, decimals)} o ${variable} ≥ ${formatNumber(upperValue, decimals)})`;
    title = `Probabilidad fuera del intervalo`;
    interpretation = `Aproximadamente ${formatProbabilityPercentage(probability, decimals)} de los valores está fuera del intervalo de ${formatNumber(lowerValue, decimals)} a ${formatNumber(upperValue, decimals)}.`;
    formula = "P(Z ≤ a o Z ≥ b) = Φ(a) + Φ(−b)";
    substitution = `Φ(${formatNumber(lowerZ, decimals)}) + Φ(${formatNumber(-upperZ, decimals)}) = ${formatProbabilityDecimal(probability)}`;
    graph = {
      region: "outside",
      leftZ: lowerZ,
      rightZ: upperZ,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con las dos colas fuera de ${formatNumber(lowerValue, decimals)} y ${formatNumber(upperValue, decimals)} sombreadas.`,
    };
  }

  const summary: NormalSummaryItem[] = [
    { label: "Decimal", value: formatProbabilityDecimal(probability) },
    {
      label: "Complemento",
      value: formatProbabilityPercentage(1 - probability, decimals),
    },
  ];

  if (interval) {
    summary.push(
      { label: "Z inferior", value: formatNumber(lowerZ, decimals) },
      { label: "Z superior", value: formatNumber(upperZ, decimals) },
      { label: "Percentil inferior", value: formatPercentile(standardNormalCdf(lowerZ)) },
      { label: "Percentil superior", value: formatPercentile(standardNormalCdf(upperZ)) },
    );
  } else {
    summary.push(
      { label: "Z-score", value: formatNumber(lowerZ, decimals) },
      { label: "Percentil del límite", value: formatPercentile(standardNormalCdf(lowerZ)) },
    );
  }

  const steps =
    input.scale === "x"
      ? [
          interval
            ? `z inferior = (${formatFlexible(lowerValue)} − ${formatFlexible(mean)}) / ${formatFlexible(standardDeviation)} = ${formatNumber(lowerZ, decimals)}`
            : `z = (${formatFlexible(lowerValue)} − ${formatFlexible(mean)}) / ${formatFlexible(standardDeviation)} = ${formatNumber(lowerZ, decimals)}`,
          ...(interval
            ? [
                `z superior = (${formatFlexible(upperValue)} − ${formatFlexible(mean)}) / ${formatFlexible(standardDeviation)} = ${formatNumber(upperZ, decimals)}`,
              ]
            : []),
          substitution,
        ]
      : [substitution];

  return successCalculation({
    input,
    probability,
    primary: formatProbabilityPercentage(probability, decimals),
    title,
    notation,
    interpretation,
    formula,
    substitution,
    steps,
    summary,
    graph,
  });
}

function calculateInverse(
  input: NormalRawInput,
  mean: number,
  standardDeviation: number,
  decimals: number,
): NormalCalculationResult {
  const parsedPercentile = parseField(input.percentile, "percentile");

  if (!parsedPercentile.ok) {
    return { ok: false, errors: [parsedPercentile.error] };
  }

  if (parsedPercentile.value <= 0 || parsedPercentile.value >= 100) {
    return {
      ok: false,
      errors: [
        {
          field: "percentile",
          message: "El percentil debe ser mayor que 0% y menor que 100%.",
        },
      ],
    };
  }

  const probability = parsedPercentile.value / 100;
  const z = inverseStandardNormalCdf(probability);
  const value =
    input.scale === "x"
      ? convertZToValue(z, mean, standardDeviation)
      : z;
  const variable = input.scale === "x" ? "X" : "Z";
  const primary = formatNumber(value, decimals);
  const notation = `${variable} para P(${variable} ≤ x) = ${formatProbabilityDecimal(probability)}`;
  const formula =
    input.scale === "x"
      ? "x = μ + Φ⁻¹(p) × σ"
      : "z = Φ⁻¹(p)";
  const substitution =
    input.scale === "x"
      ? `x = ${formatFlexible(mean)} + ${formatNumber(z, decimals)} × ${formatFlexible(standardDeviation)} = ${primary}`
      : `z = Φ⁻¹(${formatProbabilityDecimal(probability)}) = ${primary}`;
  const interpretation =
    input.scale === "x"
      ? `El valor ${primary} deja aproximadamente ${formatProbabilityPercentage(probability, decimals)} de la distribución a su izquierda.`
      : `El Z-score ${primary} corresponde aproximadamente al percentil ${formatPercentile(probability)}.`;

  return successCalculation({
    input,
    probability,
    primary,
    title: input.scale === "x" ? "Valor correspondiente" : "Z-score crítico",
    notation,
    interpretation,
    formula,
    substitution,
    steps: [
      `p = ${formatFlexible(parsedPercentile.value)} / 100 = ${formatProbabilityDecimal(probability)}`,
      `z = Φ⁻¹(${formatProbabilityDecimal(probability)}) = ${formatNumber(z, decimals)}`,
      ...(input.scale === "x" ? [substitution] : []),
    ],
    summary: [
      { label: "Z-score crítico", value: formatNumber(z, decimals) },
      { label: "Percentil", value: formatPercentile(probability) },
      {
        label: "Cola izquierda",
        value: formatProbabilityPercentage(probability, decimals),
      },
      {
        label: "Cola derecha",
        value: formatProbabilityPercentage(1 - probability, decimals),
      },
    ],
    graph: {
      region: "less",
      rightZ: z,
      markerZ: z,
      mean,
      standardDeviation,
      scale: input.scale,
      description: `Campana normal con el área acumulada hasta el percentil ${formatPercentile(probability)} sombreada.`,
    },
  });
}

function successCalculation({
  input,
  probability,
  primary,
  title,
  notation,
  interpretation,
  formula,
  substitution,
  steps,
  summary,
  graph,
}: Omit<NormalCalculation, "mode" | "scale" | "probabilityType" | "copyText"> & {
  input: NormalRawInput;
}): NormalCalculationResult {
  const copyText = [
    "Calculadora de distribución normal y Z-score",
    title,
    "",
    `Resultado: ${primary}`,
    `Notación: ${notation}`,
    ...summary.map((item) => `${item.label}: ${item.value}`),
    "",
    interpretation,
    "",
    `Fórmula: ${formula}`,
    `Sustitución: ${substitution}`,
    "",
    "Calculado en calculadoras.tools",
  ].join("\n");

  return {
    ok: true,
    calculation: {
      mode: input.mode,
      scale: input.scale,
      probabilityType: input.probabilityType,
      primary,
      title,
      notation,
      interpretation,
      formula,
      substitution,
      steps,
      summary,
      copyText,
      graph,
      probability,
    },
  };
}

function parseDistribution(
  input: NormalRawInput,
):
  | { ok: true; mean: number; standardDeviation: number }
  | { ok: false; errors: NormalInputError[] } {
  if (input.scale === "z") {
    return { ok: true, mean: 0, standardDeviation: 1 };
  }

  const mean = parseField(input.mean, "mean");
  const standardDeviation = parseField(
    input.standardDeviation,
    "standardDeviation",
  );
  const errors: NormalInputError[] = [];

  if (!mean.ok) errors.push(mean.error);
  if (!standardDeviation.ok) errors.push(standardDeviation.error);

  if (errors.length > 0 || !mean.ok || !standardDeviation.ok) {
    return { ok: false, errors };
  }

  if (standardDeviation.value <= 0) {
    return {
      ok: false,
      errors: [
        {
          field: "standardDeviation",
          message: "La desviación estándar debe ser mayor que cero.",
        },
      ],
    };
  }

  if (standardDeviation.value < MIN_STANDARD_DEVIATION) {
    return {
      ok: false,
      errors: [
        {
          field: "standardDeviation",
          message:
            "La desviación estándar es demasiado pequeña para calcularla con precisión.",
        },
      ],
    };
  }

  return {
    ok: true,
    mean: mean.value,
    standardDeviation: standardDeviation.value,
  };
}

function parseField(
  value: string,
  field: NormalInputField,
):
  | { ok: true; value: number }
  | { ok: false; error: NormalInputError } {
  const parsed = parseNormalNumber(value);

  return parsed.ok
    ? { ok: true, value: parsed.value }
    : { ok: false, error: { field, message: parsed.message } };
}

function assertOrderedBounds(lower: number, upper: number) {
  assertFinite(lower, "El límite inferior");
  assertFinite(upper, "El límite superior");

  if (lower >= upper) {
    throw new RangeError(
      "El límite inferior debe ser menor que el límite superior.",
    );
  }
}

function regularizedGammaQHalf(x: number) {
  if (x < 0 || !Number.isFinite(x)) {
    throw new RangeError("El argumento de gamma debe ser finito y no negativo.");
  }

  if (x === 0) return 1;

  const a = 0.5;
  const logGammaHalf = Math.log(Math.sqrt(Math.PI));
  const epsilon = 3e-14;
  const maxIterations = 200;
  const minimum = 1e-300;

  if (x < a + 1) {
    let ap = a;
    let term = 1 / a;
    let sum = term;

    for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
      ap += 1;
      term *= x / ap;
      sum += term;

      if (Math.abs(term) < Math.abs(sum) * epsilon) break;
    }

    const regularizedP =
      sum * Math.exp(-x + a * Math.log(x) - logGammaHalf);
    return clampProbability(1 - regularizedP);
  }

  let b = x + 1 - a;
  let c = 1 / minimum;
  let d = 1 / b;
  let fraction = d;

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const coefficient = -iteration * (iteration - a);
    b += 2;
    d = coefficient * d + b;
    if (Math.abs(d) < minimum) d = minimum;
    c = b + coefficient / c;
    if (Math.abs(c) < minimum) c = minimum;
    d = 1 / d;
    const delta = d * c;
    fraction *= delta;

    if (Math.abs(delta - 1) < epsilon) break;
  }

  return clampProbability(
    Math.exp(-x + a * Math.log(x) - logGammaHalf) * fraction,
  );
}

function assertPositiveStandardDeviation(standardDeviation: number) {
  assertFinite(standardDeviation, "La desviación estándar");

  if (standardDeviation <= 0) {
    throw new RangeError("La desviación estándar debe ser mayor que cero.");
  }
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} debe ser un número finito.`);
  }
}

function clampProbability(value: number) {
  return Math.min(1, Math.max(0, value));
}

function normalizeDecimals(decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(decimals)) return DEFAULT_DECIMALS;
  return Math.min(6, Math.max(2, Math.trunc(decimals)));
}

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function formatNumber(value: number, decimals: number) {
  const normalized = normalizeNegativeZero(value);
  return new Intl.NumberFormat("es-MX", {
    useGrouping: false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(normalized);
}

function formatFlexible(value: number) {
  return new Intl.NumberFormat("es-MX", {
    useGrouping: false,
    maximumFractionDigits: 10,
  }).format(normalizeNegativeZero(value));
}

export function formatProbabilityDecimal(value: number) {
  if (value > 0 && value < 0.0000005) return "< 0.000001";
  if (value < 1 && value > 0.9999995) return "> 0.999999";

  return new Intl.NumberFormat("es-MX", {
    useGrouping: false,
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  }).format(clampProbability(value));
}

export function formatProbabilityPercentage(
  value: number,
  decimals = 2,
): string {
  const safeDecimals = normalizeDecimals(decimals);
  const percentage = clampProbability(value) * 100;
  const threshold = 10 ** -safeDecimals;

  if (percentage > 0 && percentage < threshold) {
    return `< ${formatNumber(threshold, safeDecimals)}%`;
  }

  if (percentage < 100 && percentage > 100 - threshold) {
    return `> ${formatNumber(100 - threshold, safeDecimals)}%`;
  }

  return `${formatNumber(percentage, safeDecimals)}%`;
}

function formatPercentile(value: number) {
  return new Intl.NumberFormat("es-MX", {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(clampProbability(value) * 100);
}
