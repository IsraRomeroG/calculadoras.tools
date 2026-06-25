export const SIZE_UNITS = [
  "KB",
  "MB",
  "GB",
  "TB",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
] as const;

export const SPEED_UNITS = [
  "Kbps",
  "Mbps",
  "Gbps",
  "KB/s",
  "MB/s",
  "GB/s",
  "KiB/s",
  "MiB/s",
  "GiB/s",
] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number];
export type SpeedUnit = (typeof SPEED_UNITS)[number];
export type OutputSpeedUnit = "Mbps" | "Gbps" | "MB/s" | "MiB/s";

export interface FileSizePreset {
  id: string;
  label: string;
  value: number;
  unit: SizeUnit;
}

export interface EfficiencyPreset {
  id: string;
  label: string;
  value: number;
}

export interface SpeedPreset {
  id: string;
  label: string;
  value: number;
  unit: SpeedUnit;
}

export interface DownloadTimeInput {
  sizeValue: number;
  sizeUnit: SizeUnit;
  speedValue: number;
  speedUnit: SpeedUnit;
  efficiencyPercent: number;
}

export interface RequiredSpeedInput {
  sizeValue: number;
  sizeUnit: SizeUnit;
  targetSeconds: number;
  efficiencyPercent: number;
  outputUnit?: OutputSpeedUnit;
}

export interface DownloadTimeResult {
  mode: "download-time";
  sizeValue: number;
  sizeUnit: SizeUnit;
  speedValue: number;
  speedUnit: SpeedUnit;
  efficiencyPercent: number;
  sizeBytes: number;
  sizeBits: number;
  nominalSpeedBps: number;
  effectiveSpeedBps: number;
  secondsEstimated: number;
  secondsIdeal: number;
}

export interface RequiredSpeedResult {
  mode: "required-speed";
  sizeValue: number;
  sizeUnit: SizeUnit;
  targetSeconds: number;
  efficiencyPercent: number;
  outputUnit: OutputSpeedUnit;
  sizeBytes: number;
  sizeBits: number;
  effectiveRequiredBps: number;
  nominalRequiredBps: number;
  suggestedPlan?: SpeedPreset;
}

export interface SpeedComparisonItem {
  id: string;
  label: string;
  value: number;
  unit: SpeedUnit;
  speedBps: number;
  effectiveSpeedBps: number;
  secondsEstimated: number;
}

export const DEFAULT_EFFICIENCY_PERCENT = 90;

export const FILE_SIZE_PRESETS = [
  { id: "package-small", label: "Paquete pequeño", value: 50, unit: "MB" },
  { id: "build-artifact", label: "Artefacto de build", value: 250, unit: "MB" },
  { id: "docker-image", label: "Imagen Docker", value: 1.5, unit: "GB" },
  { id: "database-backup", label: "Backup de BD", value: 5, unit: "GB" },
  { id: "dataset", label: "Dataset", value: 25, unit: "GB" },
  { id: "iso-vm", label: "ISO o VM", value: 80, unit: "GB" },
] as const satisfies readonly FileSizePreset[];

export const EFFICIENCY_PRESETS = [
  { id: "ideal", label: "Ideal 100%", value: 100 },
  { id: "wired", label: "Cable estable 90%", value: 90 },
  { id: "wifi", label: "Wi-Fi 75%", value: 75 },
  { id: "busy", label: "Red congestionada 50%", value: 50 },
] as const satisfies readonly EfficiencyPreset[];

export const COMMON_SPEED_PRESETS = [
  { id: "10-mbps", label: "10 Mbps", value: 10, unit: "Mbps" },
  { id: "50-mbps", label: "50 Mbps", value: 50, unit: "Mbps" },
  { id: "100-mbps", label: "100 Mbps", value: 100, unit: "Mbps" },
  { id: "300-mbps", label: "300 Mbps", value: 300, unit: "Mbps" },
  { id: "500-mbps", label: "500 Mbps", value: 500, unit: "Mbps" },
  { id: "1-gbps", label: "1 Gbps", value: 1, unit: "Gbps" },
] as const satisfies readonly SpeedPreset[];

const SIZE_UNIT_BYTES: Record<SizeUnit, number> = {
  KB: 1_000,
  MB: 1_000 ** 2,
  GB: 1_000 ** 3,
  TB: 1_000 ** 4,
  KiB: 1_024,
  MiB: 1_024 ** 2,
  GiB: 1_024 ** 3,
  TiB: 1_024 ** 4,
};

const SPEED_UNIT_BPS: Record<SpeedUnit, number> = {
  Kbps: 1_000,
  Mbps: 1_000 ** 2,
  Gbps: 1_000 ** 3,
  "KB/s": 1_000 * 8,
  "MB/s": 1_000 ** 2 * 8,
  "GB/s": 1_000 ** 3 * 8,
  "KiB/s": 1_024 * 8,
  "MiB/s": 1_024 ** 2 * 8,
  "GiB/s": 1_024 ** 3 * 8,
};

const DECIMAL_SIZE_FORMAT_UNITS = [
  { unit: "TB", factor: 1_000 ** 4 },
  { unit: "GB", factor: 1_000 ** 3 },
  { unit: "MB", factor: 1_000 ** 2 },
  { unit: "KB", factor: 1_000 },
  { unit: "B", factor: 1 },
] as const;

const BINARY_SIZE_FORMAT_UNITS = [
  { unit: "TiB", factor: 1_024 ** 4 },
  { unit: "GiB", factor: 1_024 ** 3 },
  { unit: "MiB", factor: 1_024 ** 2 },
  { unit: "KiB", factor: 1_024 },
  { unit: "B", factor: 1 },
] as const;

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_DAY = 86_400;
const SECONDS_PER_YEAR = 365 * SECONDS_PER_DAY;

export function parseLocalizedNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function isSizeUnit(unit: string): unit is SizeUnit {
  return SIZE_UNITS.includes(unit as SizeUnit);
}

export function isSpeedUnit(unit: string): unit is SpeedUnit {
  return SPEED_UNITS.includes(unit as SpeedUnit);
}

export function convertSizeToBytes(value: number, unit: SizeUnit): number {
  assertPositiveFinite(value, "El tamaño");

  return value * SIZE_UNIT_BYTES[unit];
}

export function convertSpeedToBps(value: number, unit: SpeedUnit): number {
  assertPositiveFinite(value, "La velocidad");

  return value * SPEED_UNIT_BPS[unit];
}

export function convertBpsToSpeed(bps: number, unit: SpeedUnit): number {
  assertPositiveFinite(bps, "La velocidad");

  return bps / SPEED_UNIT_BPS[unit];
}

export function estimateDownloadTime(
  input: DownloadTimeInput,
): DownloadTimeResult {
  const sizeBytes = convertSizeToBytes(input.sizeValue, input.sizeUnit);
  const nominalSpeedBps = convertSpeedToBps(
    input.speedValue,
    input.speedUnit,
  );
  const efficiencyFactor = normalizeEfficiency(input.efficiencyPercent);
  const effectiveSpeedBps = nominalSpeedBps * efficiencyFactor;
  const sizeBits = sizeBytes * 8;

  return {
    mode: "download-time",
    sizeValue: input.sizeValue,
    sizeUnit: input.sizeUnit,
    speedValue: input.speedValue,
    speedUnit: input.speedUnit,
    efficiencyPercent: input.efficiencyPercent,
    sizeBytes,
    sizeBits,
    nominalSpeedBps,
    effectiveSpeedBps,
    secondsEstimated: sizeBits / effectiveSpeedBps,
    secondsIdeal: sizeBits / nominalSpeedBps,
  };
}

export function estimateRequiredSpeed(
  input: RequiredSpeedInput,
): RequiredSpeedResult {
  const sizeBytes = convertSizeToBytes(input.sizeValue, input.sizeUnit);
  const targetSeconds = normalizeTargetSeconds(input.targetSeconds);
  const efficiencyFactor = normalizeEfficiency(input.efficiencyPercent);
  const sizeBits = sizeBytes * 8;
  const effectiveRequiredBps = sizeBits / targetSeconds;
  const nominalRequiredBps = effectiveRequiredBps / efficiencyFactor;

  return {
    mode: "required-speed",
    sizeValue: input.sizeValue,
    sizeUnit: input.sizeUnit,
    targetSeconds,
    efficiencyPercent: input.efficiencyPercent,
    outputUnit: input.outputUnit ?? "Mbps",
    sizeBytes,
    sizeBits,
    effectiveRequiredBps,
    nominalRequiredBps,
    suggestedPlan: getNearestPlan(nominalRequiredBps),
  };
}

export function buildSpeedComparison(
  input: Pick<DownloadTimeInput, "sizeValue" | "sizeUnit" | "efficiencyPercent">,
  speeds: readonly SpeedPreset[] = COMMON_SPEED_PRESETS,
): SpeedComparisonItem[] {
  const sizeBytes = convertSizeToBytes(input.sizeValue, input.sizeUnit);
  const sizeBits = sizeBytes * 8;
  const efficiencyFactor = normalizeEfficiency(input.efficiencyPercent);

  return speeds.map((speed) => {
    const speedBps = convertSpeedToBps(speed.value, speed.unit);
    const effectiveSpeedBps = speedBps * efficiencyFactor;

    return {
      id: speed.id,
      label: speed.label,
      value: speed.value,
      unit: speed.unit,
      speedBps,
      effectiveSpeedBps,
      secondsEstimated: sizeBits / effectiveSpeedBps,
    };
  });
}

export function buildCopyText(
  result: DownloadTimeResult | RequiredSpeedResult,
): string {
  const sizeLabel = `${formatPlainNumber(result.sizeValue)} ${result.sizeUnit}`;
  const efficiencyLabel = `${formatPlainNumber(result.efficiencyPercent)}%`;

  if (result.mode === "download-time") {
    const speedLabel =
      `${formatPlainNumber(result.speedValue)} ${result.speedUnit}`;

    return [
      `Descargar ${sizeLabel} a ${speedLabel} con ${efficiencyLabel} de eficiencia tarda aprox. ${formatDuration(result.secondsEstimated)}.`,
      `Velocidad efectiva: ${formatSpeed(result.effectiveSpeedBps, "Mbps")} (${formatSpeed(result.effectiveSpeedBps, "MB/s")}).`,
    ].join("\n");
  }

  return [
    `Descargar ${sizeLabel} en ${formatDuration(result.targetSeconds)} con ${efficiencyLabel} de eficiencia requiere aprox. ${formatSpeed(result.nominalRequiredBps, result.outputUnit)} nominales.`,
    `Velocidad efectiva requerida: ${formatSpeed(result.effectiveRequiredBps, "Mbps")} (${formatSpeed(result.effectiveRequiredBps, "MB/s")}).`,
  ].join("\n");
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new RangeError("La duración debe ser un número positivo.");
  }

  if (seconds === 0) {
    return "0 s";
  }

  if (seconds < 1) {
    return "menos de 1 s";
  }

  if (seconds >= SECONDS_PER_YEAR) {
    return `${formatDecimal(seconds / SECONDS_PER_YEAR)} años`;
  }

  const totalSeconds = Math.max(1, Math.round(seconds));
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
  const hours = Math.floor((totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const remainingSeconds = totalSeconds % SECONDS_PER_MINUTE;

  if (days > 0) {
    return hours > 0 ? `${days} d ${hours} h` : `${days} d`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  }

  if (minutes > 0) {
    return remainingSeconds > 0
      ? `${minutes} min ${remainingSeconds} s`
      : `${minutes} min`;
  }

  return `${remainingSeconds} s`;
}

export function formatSpeed(
  bps: number,
  unit: SpeedUnit | OutputSpeedUnit = getAutomaticSpeedUnit(bps),
): string {
  const value = convertBpsToSpeed(bps, unit);

  return `${formatDecimal(value)} ${unit}`;
}

export function formatSizeFromBytes(
  bytes: number,
  system: "decimal" | "binary" = "decimal",
): string {
  assertPositiveFinite(bytes, "El tamaño");

  const units =
    system === "decimal" ? DECIMAL_SIZE_FORMAT_UNITS : BINARY_SIZE_FORMAT_UNITS;
  const selected =
    units.find((item) => bytes >= item.factor) ?? units[units.length - 1];

  return `${formatDecimal(bytes / selected.factor)} ${selected.unit}`;
}

export function formatBytes(bytes: number): string {
  assertPositiveFinite(bytes, "El tamaño");

  return `${Math.round(bytes).toLocaleString("es-MX")} bytes`;
}

export function getRequiredSpeedSuggestion(result: RequiredSpeedResult): string {
  if (result.suggestedPlan) {
    return `Una conexión nominal de ${result.suggestedPlan.label} podría bastar con ${formatPlainNumber(result.efficiencyPercent)}% de eficiencia.`;
  }

  return "El objetivo requiere más de 1 Gbps nominal con la eficiencia elegida.";
}

function getNearestPlan(nominalRequiredBps: number): SpeedPreset | undefined {
  return COMMON_SPEED_PRESETS.find(
    (preset) => convertSpeedToBps(preset.value, preset.unit) >= nominalRequiredBps,
  );
}

function normalizeEfficiency(efficiencyPercent: number): number {
  if (
    !Number.isFinite(efficiencyPercent) ||
    efficiencyPercent < 1 ||
    efficiencyPercent > 100
  ) {
    throw new RangeError("La eficiencia debe estar entre 1 y 100.");
  }

  return efficiencyPercent / 100;
}

function normalizeTargetSeconds(seconds: number): number {
  assertPositiveFinite(seconds, "El tiempo objetivo");

  return seconds;
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function getAutomaticSpeedUnit(bps: number): SpeedUnit {
  if (bps >= SPEED_UNIT_BPS.Gbps) {
    return "Gbps";
  }

  if (bps >= SPEED_UNIT_BPS.Mbps) {
    return "Mbps";
  }

  return "Kbps";
}

function formatDecimal(value: number): string {
  const abs = Math.abs(value);
  const maximumFractionDigits = abs < 10 ? 2 : abs < 100 ? 1 : 0;

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

function formatPlainNumber(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(value);
}

