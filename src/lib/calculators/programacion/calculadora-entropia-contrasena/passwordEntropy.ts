export const MAX_PASSWORD_LENGTH = 256;
export const ASCII_SYMBOLS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
export const UNICODE_OTHER_BUCKET_SIZE = 100;

const LOG10_2 = Math.log10(2);
const SECONDS_PER_YEAR = 31_557_600;

export const ATTACK_SCENARIOS = [
  {
    id: "online-limited",
    label: "Online con limite",
    attemptsPerSecond: 10 / 60,
    description: "10 intentos por minuto con bloqueo o rate limit.",
  },
  {
    id: "slow-hash",
    label: "Hash lento",
    attemptsPerSecond: 1e5,
    description: "bcrypt, Argon2 o similar con costo alto.",
  },
  {
    id: "fast-hash",
    label: "Hash rapido filtrado",
    attemptsPerSecond: 1e9,
    description: "Hash filtrado con hardware comun.",
  },
  {
    id: "gpu-farm",
    label: "GPU/farm agresiva",
    attemptsPerSecond: 1e12,
    description: "Ataque offline con hardware especializado.",
  },
] as const;

export const DEFAULT_ATTACK_SCENARIO_ID = "fast-hash";

export type AttackScenario = (typeof ATTACK_SCENARIOS)[number];
export type AttackScenarioId = AttackScenario["id"];

export type StrengthLevel =
  | "empty"
  | "very-weak"
  | "weak"
  | "acceptable"
  | "strong"
  | "very-strong";

export type SignalSeverity = "positive" | "info" | "warning" | "danger";

export type PasswordSignalId =
  | "empty"
  | "length-short"
  | "length-medium"
  | "length-good"
  | "length-strong"
  | "variety-low"
  | "variety-good"
  | "common-password"
  | "common-word"
  | "strong-repetition"
  | "sequence"
  | "keyboard-pattern"
  | "probable-date"
  | "obvious-substitution"
  | "unicode-detected";

export interface CharacterSets {
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  spaces: boolean;
  unicodeOther: boolean;
}

export interface PasswordSignal {
  id: PasswordSignalId;
  label: string;
  detail: string;
  severity: SignalSeverity;
}

export interface AttackTimeEstimate {
  attemptsPerSecond: number;
  worstCaseSecondsLog10: number;
  averageSecondsLog10: number;
  worstCaseLabel: string;
  averageLabel: string;
}

export interface PasswordEntropyResult {
  length: number;
  characterSets: CharacterSets;
  characterSetSize: number;
  entropyBits: number;
  entropyLabel: string;
  searchSpaceLabel: string;
  strengthLevel: StrengthLevel;
  strengthLabel: string;
  strengthSummary: string;
  score: number;
  signals: PasswordSignal[];
  recommendations: string[];
  attack: AttackTimeEstimate;
}

export interface AnalyzePasswordOptions {
  attemptsPerSecond?: number;
}

const COMMON_PASSWORD_VALUES = [
  "password",
  "password1",
  "password1!",
  "123456",
  "123456789",
  "12345678",
  "111111",
  "000000",
  "qwerty",
  "qwerty123",
  "abc123",
  "admin",
  "admin123",
  "letmein",
  "welcome",
  "contraseña",
  "contrasena",
  "contrasena1",
  "contrasena1!",
  "contrasena123",
  "mexico",
  "mexico123",
  "guadalajara",
  "monterrey",
];

const COMMON_PASSWORDS = buildCommonPasswordSet(COMMON_PASSWORD_VALUES);

const COMMON_WORDS = [
  "password",
  "contrasena",
  "admin",
  "letmein",
  "welcome",
  "mexico",
  "guadalajara",
  "monterrey",
  "qwerty",
];

const KEYBOARD_PATTERNS = [
  "qwerty",
  "asdf",
  "zxcv",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const STRENGTH_METADATA: Record<
  StrengthLevel,
  { label: string; summary: string }
> = {
  empty: {
    label: "Sin calculo",
    summary: "Escribe una contraseña para estimar su fortaleza.",
  },
  "very-weak": {
    label: "Muy debil",
    summary: "Muy facil de adivinar o presente en patrones comunes.",
  },
  weak: {
    label: "Debil",
    summary: "Tiene poca longitud o patrones que reducen su resistencia.",
  },
  acceptable: {
    label: "Aceptable",
    summary: "Puede servir en contextos de bajo riesgo si es unica.",
  },
  strong: {
    label: "Fuerte",
    summary: "Buena resistencia teorica y pocas señales de prediccion.",
  },
  "very-strong": {
    label: "Muy fuerte",
    summary: "Muy buena longitud y espacio de busqueda teorico.",
  },
};

export function analyzePassword(
  password: string,
  options: AnalyzePasswordOptions = {},
): PasswordEntropyResult {
  const codePoints = Array.from(password);
  const length = codePoints.length;
  const characterSets = detectCharacterSets(codePoints);
  const characterSetSize = getCharacterSetSize(characterSets);
  const entropyBits =
    length === 0 || characterSetSize === 0
      ? 0
      : length * Math.log2(characterSetSize);
  const attemptsPerSecond = normalizeAttemptsPerSecond(
    options.attemptsPerSecond,
  );
  const attack = estimateAttackTime(entropyBits, attemptsPerSecond);

  if (length === 0) {
    return {
      length,
      characterSets,
      characterSetSize,
      entropyBits,
      entropyLabel: formatEntropyBits(entropyBits),
      searchSpaceLabel: "1",
      strengthLevel: "empty",
      strengthLabel: STRENGTH_METADATA.empty.label,
      strengthSummary: STRENGTH_METADATA.empty.summary,
      score: 0,
      signals: [
        {
          id: "empty",
          label: "Sin contraseña",
          detail: "El calculo empieza cuando escribes un valor.",
          severity: "info",
        },
      ],
      recommendations: [
        "Usa una contraseña larga y unica, o una frase de varias palabras.",
      ],
      attack,
    };
  }

  const normalized = normalizeForMatching(password);
  const compact = normalized.replace(/[^a-z0-9]/g, "");
  const substitutionSource = normalized.replace(/[^a-z0-9@$!]/g, "");
  const deLeeted = normalizeLeet(substitutionSource);
  const commonPassword = isCommonPassword(normalized, compact, deLeeted);
  const commonWord = findCommonWord(compact, deLeeted);
  const strongRepetition = hasStrongRepetition(codePoints, compact);
  const sequence = hasSequentialPattern(compact);
  const keyboardPattern = hasKeyboardPattern(compact);
  const probableDate = hasProbableDate(normalized);
  const obviousSubstitution = hasObviousSubstitution(
    substitutionSource,
    deLeeted,
  );
  const signals = buildSignals({
    length,
    characterSets,
    commonPassword,
    commonWord,
    strongRepetition,
    sequence,
    keyboardPattern,
    probableDate,
    obviousSubstitution,
  });
  const score = calculatePracticalScore({
    entropyBits,
    length,
    commonPassword,
    commonWord: Boolean(commonWord),
    strongRepetition,
    sequence,
    keyboardPattern,
    probableDate,
    obviousSubstitution,
  });
  const strengthLevel = scoreToStrengthLevel(score);
  const metadata = STRENGTH_METADATA[strengthLevel];

  return {
    length,
    characterSets,
    characterSetSize,
    entropyBits,
    entropyLabel: formatEntropyBits(entropyBits),
    searchSpaceLabel: formatSearchSpace(entropyBits),
    strengthLevel,
    strengthLabel: metadata.label,
    strengthSummary: metadata.summary,
    score,
    signals,
    recommendations: buildRecommendations({
      length,
      commonPassword,
      commonWord,
      strongRepetition,
      sequence,
      keyboardPattern,
      probableDate,
      obviousSubstitution,
      strengthLevel,
    }),
    attack,
  };
}

export function detectCharacterSets(codePoints: string[]): CharacterSets {
  return codePoints.reduce<CharacterSets>(
    (sets, character) => {
      if (/^[a-z]$/.test(character)) {
        sets.lowercase = true;
      } else if (/^[A-Z]$/.test(character)) {
        sets.uppercase = true;
      } else if (/^[0-9]$/.test(character)) {
        sets.digits = true;
      } else if (character === " ") {
        sets.spaces = true;
      } else if (isAscii(character) && ASCII_SYMBOLS.includes(character)) {
        sets.symbols = true;
      } else {
        sets.unicodeOther = true;
      }

      return sets;
    },
    {
      lowercase: false,
      uppercase: false,
      digits: false,
      symbols: false,
      spaces: false,
      unicodeOther: false,
    },
  );
}

export function getCharacterSetSize(characterSets: CharacterSets): number {
  return (
    (characterSets.lowercase ? 26 : 0) +
    (characterSets.uppercase ? 26 : 0) +
    (characterSets.digits ? 10 : 0) +
    (characterSets.symbols ? ASCII_SYMBOLS.length : 0) +
    (characterSets.spaces ? 1 : 0) +
    (characterSets.unicodeOther ? UNICODE_OTHER_BUCKET_SIZE : 0)
  );
}

export function getAttackScenario(id: string): AttackScenario {
  return (
    ATTACK_SCENARIOS.find((scenario) => scenario.id === id) ??
    ATTACK_SCENARIOS.find(
      (scenario) => scenario.id === DEFAULT_ATTACK_SCENARIO_ID,
    ) ??
    ATTACK_SCENARIOS[0]
  );
}

export function parseAttemptsPerSecond(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function formatAttemptsPerSecond(value: number): string {
  if (value < 1) {
    return `${formatDecimal(value * 60)} intentos/min`;
  }

  if (value >= 1e6) {
    const exponent = Math.floor(Math.log10(value));
    const coefficient = value / 10 ** exponent;

    return `${formatDecimal(coefficient)}e${exponent} intentos/s`;
  }

  return `${formatDecimal(value)} intentos/s`;
}

export function formatEntropyBits(bits: number): string {
  return `${formatDecimal(bits)} bits`;
}

export function formatSearchSpace(entropyBits: number): string {
  if (entropyBits <= 0) {
    return "1";
  }

  const log10Combinations = entropyBits * LOG10_2;

  if (log10Combinations < 15) {
    return Math.round(2 ** entropyBits).toLocaleString("es-MX");
  }

  return formatScientificLog10(log10Combinations);
}

export function estimateAttackTime(
  entropyBits: number,
  attemptsPerSecond: number,
): AttackTimeEstimate {
  const safeAttempts = normalizeAttemptsPerSecond(attemptsPerSecond);
  const worstCaseSecondsLog10 = entropyBits * LOG10_2 - Math.log10(safeAttempts);
  const averageSecondsLog10 = worstCaseSecondsLog10 - LOG10_2;

  return {
    attemptsPerSecond: safeAttempts,
    worstCaseSecondsLog10,
    averageSecondsLog10,
    worstCaseLabel: formatDurationFromLog10Seconds(worstCaseSecondsLog10),
    averageLabel: formatDurationFromLog10Seconds(averageSecondsLog10),
  };
}

function buildSignals(input: {
  length: number;
  characterSets: CharacterSets;
  commonPassword: boolean;
  commonWord?: string;
  strongRepetition: boolean;
  sequence: boolean;
  keyboardPattern: boolean;
  probableDate: boolean;
  obviousSubstitution: boolean;
}): PasswordSignal[] {
  const signals: PasswordSignal[] = [];
  const varietyCount = Object.values(input.characterSets).filter(Boolean).length;

  if (input.length < 8) {
    signals.push({
      id: "length-short",
      label: "Longitud corta",
      detail: "Menos de 8 caracteres deja poco margen ante ataques de fuerza bruta.",
      severity: "danger",
    });
  } else if (input.length < 12) {
    signals.push({
      id: "length-medium",
      label: "Longitud mejorable",
      detail: "Subir a 12-15 caracteres suele aportar mas que cambiar letras por simbolos.",
      severity: "warning",
    });
  } else if (input.length >= 15) {
    signals.push({
      id: "length-strong",
      label: "Buena longitud",
      detail: "La longitud ayuda mucho si la contraseña tambien es unica.",
      severity: "positive",
    });
  } else {
    signals.push({
      id: "length-good",
      label: "Longitud aceptable",
      detail: "Tiene al menos 12 caracteres.",
      severity: "info",
    });
  }

  signals.push(
    varietyCount <= 1
      ? {
          id: "variety-low",
          label: "Variedad baja",
          detail: "Usa un solo tipo de caracter.",
          severity: "warning",
        }
      : {
          id: "variety-good",
          label: "Variedad detectada",
          detail: `Combina ${varietyCount} tipos de caracteres.`,
          severity: "info",
        },
  );

  if (input.commonPassword) {
    signals.push({
      id: "common-password",
      label: "Contrasena comun",
      detail: "Aparece en una lista local de contrasenas frecuentes.",
      severity: "danger",
    });
  }

  if (input.commonWord) {
    signals.push({
      id: "common-word",
      label: "Palabra comun",
      detail: `Incluye "${input.commonWord}", una palabra facil de probar.`,
      severity: "warning",
    });
  }

  if (input.strongRepetition) {
    signals.push({
      id: "strong-repetition",
      label: "Repeticion fuerte",
      detail: "Repite caracteres o grupos de forma predecible.",
      severity: "danger",
    });
  }

  if (input.sequence) {
    signals.push({
      id: "sequence",
      label: "Secuencia",
      detail: "Incluye patrones como abc, 123 o sus reversos.",
      severity: "warning",
    });
  }

  if (input.keyboardPattern) {
    signals.push({
      id: "keyboard-pattern",
      label: "Patron de teclado",
      detail: "Incluye una fila o fragmento comun del teclado.",
      severity: "danger",
    });
  }

  if (input.probableDate) {
    signals.push({
      id: "probable-date",
      label: "Fecha probable",
      detail: "Contiene un año o fecha que un atacante podria priorizar.",
      severity: "warning",
    });
  }

  if (input.obviousSubstitution) {
    signals.push({
      id: "obvious-substitution",
      label: "Sustitucion obvia",
      detail: "Cambios como a por @ u o por 0 suelen probarse rapido.",
      severity: "warning",
    });
  }

  if (input.characterSets.unicodeOther) {
    signals.push({
      id: "unicode-detected",
      label: "Unicode detectado",
      detail: "Algunos servicios normalizan o tratan estos caracteres de forma distinta.",
      severity: "info",
    });
  }

  return signals;
}

function calculatePracticalScore(input: {
  entropyBits: number;
  length: number;
  commonPassword: boolean;
  commonWord: boolean;
  strongRepetition: boolean;
  sequence: boolean;
  keyboardPattern: boolean;
  probableDate: boolean;
  obviousSubstitution: boolean;
}): number {
  if (input.commonPassword) {
    return 1;
  }

  let score = getBaseScoreFromEntropy(input.entropyBits);

  if (input.length < 8) {
    score -= 2;
  } else if (input.length < 12) {
    score -= 1;
  } else if (input.length >= 15) {
    score += 1;
  }

  if (input.strongRepetition) {
    score -= 3;
  }

  if (input.keyboardPattern) {
    score -= 2;
  }

  if (input.sequence) {
    score -= 1;
  }

  if (input.commonWord) {
    score -= 1;
  }

  if (input.probableDate) {
    score -= 1;
  }

  if (input.obviousSubstitution) {
    score -= 1;
  }

  return clamp(score, 1, 5);
}

function getBaseScoreFromEntropy(bits: number): number {
  if (bits < 28) {
    return 1;
  }

  if (bits < 36) {
    return 2;
  }

  if (bits < 60) {
    return 3;
  }

  if (bits < 80) {
    return 4;
  }

  return 5;
}

function scoreToStrengthLevel(score: number): StrengthLevel {
  if (score <= 1) {
    return "very-weak";
  }

  if (score === 2) {
    return "weak";
  }

  if (score === 3) {
    return "acceptable";
  }

  if (score === 4) {
    return "strong";
  }

  return "very-strong";
}

function buildRecommendations(input: {
  length: number;
  commonPassword: boolean;
  commonWord?: string;
  strongRepetition: boolean;
  sequence: boolean;
  keyboardPattern: boolean;
  probableDate: boolean;
  obviousSubstitution: boolean;
  strengthLevel: StrengthLevel;
}): string[] {
  const recommendations: string[] = [];

  if (input.commonPassword) {
    recommendations.push(
      "Evita contrasenas comunes o pequenas variaciones de ellas.",
    );
  }

  if (input.length < 15) {
    recommendations.push(
      "Hazla mas larga: apunta a 15 o mas caracteres si debe ser memorable.",
    );
  }

  if (input.strongRepetition) {
    recommendations.push("Evita repetir el mismo caracter o grupo varias veces.");
  }

  if (input.sequence || input.keyboardPattern) {
    recommendations.push(
      "Cambia secuencias como 123, abc o qwerty por palabras no relacionadas.",
    );
  }

  if (input.commonWord || input.obviousSubstitution) {
    recommendations.push(
      "No dependas de cambiar letras por simbolos: esas sustituciones se prueban rapido.",
    );
  }

  if (input.probableDate) {
    recommendations.push("Evita anos o fechas asociables a ti o a la cuenta.");
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Mantenla unica para este servicio y guardala en un gestor de contrasenas.",
    );
  }

  if (input.strengthLevel === "strong" || input.strengthLevel === "very-strong") {
    recommendations.push("Para cuentas importantes, combina esto con MFA o passkeys.");
  }

  return recommendations.slice(0, 5);
}

function normalizeAttemptsPerSecond(value?: number): number {
  return Number.isFinite(value) && value > 0
    ? value
    : getAttackScenario(DEFAULT_ATTACK_SCENARIO_ID).attemptsPerSecond;
}

function buildCommonPasswordSet(values: string[]): Set<string> {
  return new Set(
    values.flatMap((value) => {
      const normalized = normalizeForMatching(value);
      const compact = normalized.replace(/[^a-z0-9]/g, "");

      return [normalized, compact, normalizeLeet(compact)];
    }),
  );
}

function isCommonPassword(
  normalized: string,
  compact: string,
  deLeeted: string,
): boolean {
  return (
    COMMON_PASSWORDS.has(normalized) ||
    COMMON_PASSWORDS.has(compact) ||
    COMMON_PASSWORDS.has(deLeeted)
  );
}

function findCommonWord(compact: string, deLeeted: string): string | undefined {
  return COMMON_WORDS.find(
    (word) => compact.includes(word) || deLeeted.includes(word),
  );
}

function hasStrongRepetition(codePoints: string[], compact: string): boolean {
  if (codePoints.length >= 3 && new Set(codePoints).size === 1) {
    return true;
  }

  if (compact.length >= 8) {
    const diversity = new Set(compact).size / compact.length;

    if (diversity <= 0.25) {
      return true;
    }
  }

  return hasRepeatedGroup(compact);
}

function hasRepeatedGroup(value: string): boolean {
  if (value.length < 6) {
    return false;
  }

  for (let size = 2; size <= Math.floor(value.length / 2); size += 1) {
    if (value.length % size !== 0) {
      continue;
    }

    const group = value.slice(0, size);

    if (group.repeat(value.length / size) === value) {
      return true;
    }
  }

  return false;
}

function hasSequentialPattern(value: string): boolean {
  return hasSequentialWindow(value, "abcdefghijklmnopqrstuvwxyz", 3) ||
    hasSequentialWindow(value, "zyxwvutsrqponmlkjihgfedcba", 3) ||
    hasSequentialWindow(value, "0123456789", 3) ||
    hasSequentialWindow(value, "9876543210", 3);
}

function hasSequentialWindow(
  value: string,
  sequence: string,
  minimumLength: number,
): boolean {
  for (let index = 0; index <= value.length - minimumLength; index += 1) {
    const window = value.slice(index, index + minimumLength);

    if (sequence.includes(window)) {
      return true;
    }
  }

  return false;
}

function hasKeyboardPattern(value: string): boolean {
  return KEYBOARD_PATTERNS.some((pattern) => {
    const reversed = Array.from(pattern).reverse().join("");

    return value.includes(pattern) || value.includes(reversed);
  });
}

function hasProbableDate(value: string): boolean {
  return (
    /(?:19|20)\d{2}/.test(value) ||
    /\b\d{1,2}[-/.]?\d{1,2}[-/.]?(?:\d{2}|\d{4})\b/.test(value)
  );
}

function hasObviousSubstitution(source: string, deLeeted: string): boolean {
  return /[@$!013457]/.test(source) && Boolean(findCommonWord("", deLeeted));
}

function normalizeForMatching(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeLeet(value: string): string {
  return value
    .replaceAll("@", "a")
    .replaceAll("4", "a")
    .replaceAll("0", "o")
    .replaceAll("1", "i")
    .replaceAll("!", "i")
    .replaceAll("3", "e")
    .replaceAll("$", "s")
    .replaceAll("5", "s")
    .replaceAll("7", "t");
}

function isAscii(character: string): boolean {
  return character.charCodeAt(0) <= 127;
}

function formatScientificLog10(log10Value: number): string {
  const exponent = Math.floor(log10Value);
  const coefficient = 10 ** (log10Value - exponent);

  return `${coefficient.toFixed(2)} × 10^${exponent}`;
}

function formatDurationFromLog10Seconds(log10Seconds: number): string {
  if (log10Seconds < 0) {
    return "menos de 1 segundo";
  }

  if (log10Seconds < 8) {
    return formatDuration(10 ** log10Seconds);
  }

  const yearsLog10 = log10Seconds - Math.log10(SECONDS_PER_YEAR);

  if (yearsLog10 < 6) {
    return `${formatDecimal(10 ** yearsLog10)} años`;
  }

  const exponent = Math.floor(yearsLog10);
  const coefficient = 10 ** (yearsLog10 - exponent);

  return `${coefficient.toFixed(2)} × 10^${exponent} años`;
}

function formatDuration(seconds: number): string {
  if (seconds < 1) {
    return "menos de 1 segundo";
  }

  if (seconds < 60) {
    return `${formatDecimal(seconds)} segundos`;
  }

  if (seconds < 3_600) {
    return `${formatDecimal(seconds / 60)} minutos`;
  }

  if (seconds < 86_400) {
    return `${formatDecimal(seconds / 3_600)} horas`;
  }

  if (seconds < SECONDS_PER_YEAR) {
    return `${formatDecimal(seconds / 86_400)} dias`;
  }

  return `${formatDecimal(seconds / SECONDS_PER_YEAR)} años`;
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
