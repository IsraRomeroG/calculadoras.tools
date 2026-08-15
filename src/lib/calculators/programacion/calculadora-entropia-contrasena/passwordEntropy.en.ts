export const MAX_PASSWORD_LENGTH = 256;
export const ASCII_SYMBOLS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
export const UNICODE_OTHER_BUCKET_SIZE = 100;

const LOG10_2 = Math.log10(2);
const SECONDS_PER_YEAR = 31_557_600;

export const ATTACK_SCENARIOS = [
  {
    id: "online-limited",
    label: "Rate-limited online",
    attemptsPerSecond: 10 / 60,
    description: "10 attempts per minute with lockout or rate limiting.",
  },
  {
    id: "slow-hash",
    label: "Slow hash",
    attemptsPerSecond: 1e5,
    description: "bcrypt, Argon2 or similar with a high cost.",
  },
  {
    id: "fast-hash",
    label: "Leaked fast hash",
    attemptsPerSecond: 1e9,
    description: "Leaked hash with common hardware.",
  },
  {
    id: "gpu-farm",
    label: "Aggressive GPU farm",
    attemptsPerSecond: 1e12,
    description: "Offline attack with specialized hardware.",
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
  "password",
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
    label: "No calculation",
    summary: "Enter a password to estimate its strength.",
  },
  "very-weak": {
    label: "Very weak",
    summary: "Very easy to guess or present in common patterns.",
  },
  weak: {
    label: "Weak",
    summary: "It is short or contains patterns that reduce its strength.",
  },
  acceptable: {
    label: "Acceptable",
    summary: "May be suitable in low-risk contexts if it is unique.",
  },
  strong: {
    label: "Strong",
    summary: "Good theoretical resistance and few predictability signals.",
  },
  "very-strong": {
    label: "Very strong",
    summary: "Very good length and theoretical search space.",
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
          label: "No password",
          detail: "The calculation starts when you enter a value.",
          severity: "info",
        },
      ],
      recommendations: [
        "Use a long, unique password or a phrase made of several words.",
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
    return Math.round(2 ** entropyBits).toLocaleString("en-US");
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
      label: "Short length",
      detail: "Fewer than 8 characters offer little resistance to brute-force attacks.",
      severity: "danger",
    });
  } else if (input.length < 12) {
    signals.push({
      id: "length-medium",
      label: "Length could be improved",
      detail: "Increasing to 12–15 characters usually helps more than replacing letters with symbols.",
      severity: "warning",
    });
  } else if (input.length >= 15) {
    signals.push({
      id: "length-strong",
      label: "Good length",
      detail: "Length helps greatly when the password is also unique.",
      severity: "positive",
    });
  } else {
    signals.push({
      id: "length-good",
      label: "Acceptable length",
      detail: "It has at least 12 characters.",
      severity: "info",
    });
  }

  signals.push(
    varietyCount <= 1
      ? {
          id: "variety-low",
          label: "Low variety",
          detail: "It uses only one character type.",
          severity: "warning",
        }
      : {
          id: "variety-good",
          label: "Variety detected",
          detail: `Combines ${varietyCount} character types.`,
          severity: "info",
        },
  );

  if (input.commonPassword) {
    signals.push({
      id: "common-password",
      label: "Common password",
      detail: "It appears in a local list of common passwords.",
      severity: "danger",
    });
  }

  if (input.commonWord) {
    signals.push({
      id: "common-word",
      label: "Common word",
      detail: `It includes "${input.commonWord}", an easy word to guess.`,
      severity: "warning",
    });
  }

  if (input.strongRepetition) {
    signals.push({
      id: "strong-repetition",
      label: "Strong repetition",
      detail: "Repeats characters or groups in a predictable pattern.",
      severity: "danger",
    });
  }

  if (input.sequence) {
    signals.push({
      id: "sequence",
      label: "Sequence",
      detail: "It includes patterns such as abc, 123 or their reverses.",
      severity: "warning",
    });
  }

  if (input.keyboardPattern) {
    signals.push({
      id: "keyboard-pattern",
      label: "Keyboard pattern",
      detail: "It includes a common keyboard row or fragment.",
      severity: "danger",
    });
  }

  if (input.probableDate) {
    signals.push({
      id: "probable-date",
      label: "Likely date",
      detail: "Contains a year or date that an attacker might prioritize.",
      severity: "warning",
    });
  }

  if (input.obviousSubstitution) {
    signals.push({
      id: "obvious-substitution",
      label: "Obvious substitution",
      detail: "Changes such as a to @ or o to 0 are usually tested quickly.",
      severity: "warning",
    });
  }

  if (input.characterSets.unicodeOther) {
    signals.push({
      id: "unicode-detected",
      label: "Unicode detected",
      detail: "Some services normalize or handle these characters differently.",
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
      "Avoid common passwords and small variations of them.",
    );
  }

  if (input.length < 15) {
    recommendations.push(
      "Make it longer: aim for 15 or more characters if it needs to be memorable.",
    );
  }

  if (input.strongRepetition) {
    recommendations.push("Avoid repeating the same character or group several times.");
  }

  if (input.sequence || input.keyboardPattern) {
    recommendations.push(
      "Replace sequences such as 123, abc or qwerty with unrelated words.",
    );
  }

  if (input.commonWord || input.obviousSubstitution) {
    recommendations.push(
      "Do not rely on replacing letters with symbols: those substitutions are tested quickly.",
    );
  }

  if (input.probableDate) {
    recommendations.push("Avoid years or dates associated with you or the account.");
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Keep it unique to this service and store it in a password manager.",
    );
  }

  if (input.strengthLevel === "strong" || input.strengthLevel === "very-strong") {
    recommendations.push("For important accounts, combine this with MFA or passkeys.");
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
    return "less than 1 second";
  }

  if (log10Seconds < 8) {
    return formatDuration(10 ** log10Seconds);
  }

  const yearsLog10 = log10Seconds - Math.log10(SECONDS_PER_YEAR);

  if (yearsLog10 < 6) {
    return `${formatDecimal(10 ** yearsLog10)} years`;
  }

  const exponent = Math.floor(yearsLog10);
  const coefficient = 10 ** (yearsLog10 - exponent);

  return `${coefficient.toFixed(2)} × 10^${exponent} years`;
}

function formatDuration(seconds: number): string {
  if (seconds < 1) {
    return "less than 1 second";
  }

  if (seconds < 60) {
    return `${formatDecimal(seconds)} seconds`;
  }

  if (seconds < 3_600) {
    return `${formatDecimal(seconds / 60)} minutes`;
  }

  if (seconds < 86_400) {
    return `${formatDecimal(seconds / 3_600)} hours`;
  }

  if (seconds < SECONDS_PER_YEAR) {
    return `${formatDecimal(seconds / 86_400)} days`;
  }

  return `${formatDecimal(seconds / SECONDS_PER_YEAR)} years`;
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
