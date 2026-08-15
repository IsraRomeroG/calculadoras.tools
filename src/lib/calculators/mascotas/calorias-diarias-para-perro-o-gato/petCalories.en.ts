export const PET_CALORIE_SPECIES = ["perro", "gato"] as const;
export const PET_WEIGHT_UNITS = ["kg", "lb"] as const;
export const PET_ADULT_PROFILES = [
  "esterilizado",
  "no-esterilizado",
  "inactivo",
] as const;
export const PET_WEIGHT_CONTEXTS = ["actual", "ideal", "no-se"] as const;
export const PET_BODY_CONDITIONS = [
  "delgado",
  "ideal",
  "sobrepeso",
  "no-se",
] as const;
export const PET_SPECIAL_CASES = [
  "cachorro",
  "gestacion-lactancia",
  "perdida-aumento",
  "enfermedad",
  "trabajo",
] as const;

export type PetCalorieSpecies = (typeof PET_CALORIE_SPECIES)[number];
export type PetWeightUnit = (typeof PET_WEIGHT_UNITS)[number];
export type PetAdultProfile = (typeof PET_ADULT_PROFILES)[number];
export type PetWeightContext = (typeof PET_WEIGHT_CONTEXTS)[number];
export type PetBodyCondition = (typeof PET_BODY_CONDITIONS)[number];
export type PetSpecialCase = (typeof PET_SPECIAL_CASES)[number];
export type PetIntakeComparisonStatus =
  | "below-range"
  | "within-range"
  | "above-range";

export interface PetCalorieRange {
  min: number;
  max: number;
}

export interface PetCaloriesInput {
  species: PetCalorieSpecies;
  weight?: number;
  unit: PetWeightUnit;
  profile: PetAdultProfile;
  weightContext: PetWeightContext;
  bodyCondition: PetBodyCondition;
  foodCalories?: number;
  treatCalories?: number;
  specialCases?: PetSpecialCase[];
}

export interface PetCurrentIntakeComparison {
  status: PetIntakeComparisonStatus;
  totalCalories: number;
  foodCalories: number;
  treatCalories: number;
  message: string;
}

export interface PetCaloriesSuccess {
  status: "ok";
  species: PetCalorieSpecies;
  weightKg: number;
  rer: number;
  merRange: PetCalorieRange;
  factorRange: PetCalorieRange;
  treatRange: PetCalorieRange;
  mainFoodRange: PetCalorieRange;
  warnings: string[];
  intakeComparison?: PetCurrentIntakeComparison;
  copyText: string;
}

export interface PetCaloriesMessage {
  status: "empty" | "invalid" | "review" | "out-of-scope";
  message: string;
  warnings?: string[];
}

export type PetCaloriesResult = PetCaloriesSuccess | PetCaloriesMessage;

export interface ParsedPetCaloriesSearchParams {
  species: PetCalorieSpecies;
  weight?: number;
  unit: PetWeightUnit;
  profile: PetAdultProfile;
  weightContext: PetWeightContext;
  bodyCondition: PetBodyCondition;
  foodCalories?: number;
  treatCalories?: number;
  specialCases: PetSpecialCase[];
  hadInvalidParams: boolean;
}

export const PET_PROFILE_LABELS: Record<PetAdultProfile, string> = {
  esterilizado: "Spayed or neutered",
  "no-esterilizado": "Not spayed or neutered",
  inactivo: "Inactive or prone to obesity",
};

export const PET_WEIGHT_CONTEXT_LABELS: Record<PetWeightContext, string> = {
  actual: "Current weight",
  ideal: "Ideal weight",
  "no-se": "I don\'t know",
};

export const PET_BODY_CONDITION_LABELS: Record<PetBodyCondition, string> = {
  delgado: "Underweight",
  ideal: "Ideal",
  sobrepeso: "Overweight",
  "no-se": "I don\'t know",
};

export const PET_SPECIAL_CASE_LABELS: Record<PetSpecialCase, string> = {
  cachorro: "Puppy or kitten",
  "gestacion-lactancia": "Pregnancy or lactation",
  "perdida-aumento": "Weight loss or gain goal",
  enfermedad: "Illness or therapeutic diet",
  trabajo: "Working dog or extreme activity",
};

const POUND_TO_KG = 0.45359237;
const SHARE_PATH = "/en/pets/pet-calorie-calculator";
const OUT_OF_SCOPE_MESSAGE =
  "This case requires an individual recommendation. Consult your veterinarian before changing your pet’s food intake.";

const FACTOR_RANGES: Record<
  PetCalorieSpecies,
  Record<PetAdultProfile, PetCalorieRange>
> = {
  gato: {
    esterilizado: { min: 1.2, max: 1.4 },
    "no-esterilizado": { min: 1.4, max: 1.6 },
    inactivo: { min: 1, max: 1 },
  },
  perro: {
    esterilizado: { min: 1.4, max: 1.6 },
    "no-esterilizado": { min: 1.6, max: 1.8 },
    inactivo: { min: 1, max: 1.2 },
  },
};

export function isPetCalorieSpecies(value: string): value is PetCalorieSpecies {
  return PET_CALORIE_SPECIES.includes(value as PetCalorieSpecies);
}

export function isPetWeightUnit(value: string): value is PetWeightUnit {
  return PET_WEIGHT_UNITS.includes(value as PetWeightUnit);
}

export function isPetAdultProfile(value: string): value is PetAdultProfile {
  return PET_ADULT_PROFILES.includes(value as PetAdultProfile);
}

export function isPetWeightContext(value: string): value is PetWeightContext {
  return PET_WEIGHT_CONTEXTS.includes(value as PetWeightContext);
}

export function isPetBodyCondition(value: string): value is PetBodyCondition {
  return PET_BODY_CONDITIONS.includes(value as PetBodyCondition);
}

export function isPetSpecialCase(value: string): value is PetSpecialCase {
  return PET_SPECIAL_CASES.includes(value as PetSpecialCase);
}

export function parsePetDecimalInput(value: string): number | undefined {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
    return Number.NaN;
  }

  return Number(normalized);
}

export function convertPetWeightToKg(value: number, unit: PetWeightUnit): number {
  return unit === "lb" ? value * POUND_TO_KG : value;
}

export function calculatePetRer(weightKg: number): number {
  return 70 * weightKg ** 0.75;
}

export function getPetMerFactorRange(
  species: PetCalorieSpecies,
  profile: PetAdultProfile,
): PetCalorieRange {
  return FACTOR_RANGES[species][profile];
}

export function calculatePetMerRange(
  rer: number,
  factorRange: PetCalorieRange,
): PetCalorieRange {
  return {
    min: rer * factorRange.min,
    max: rer * factorRange.max,
  };
}

export function calculatePetTreatRange(merRange: PetCalorieRange): PetCalorieRange {
  return multiplyRange(merRange, 0.1);
}

export function calculatePetMainFoodRange(
  merRange: PetCalorieRange,
): PetCalorieRange {
  return multiplyRange(merRange, 0.9);
}

export function calculateCurrentPetIntake(
  foodCalories?: number,
  treatCalories?: number,
): number | undefined {
  const hasFoodCalories = typeof foodCalories === "number";
  const hasTreatCalories = typeof treatCalories === "number";

  if (!hasFoodCalories && !hasTreatCalories) {
    return undefined;
  }

  return (foodCalories ?? 0) + (treatCalories ?? 0);
}

export function comparePetIntakeWithMer(
  currentIntake: number,
  merRange: PetCalorieRange,
): PetIntakeComparisonStatus {
  if (currentIntake < merRange.min) {
    return "below-range";
  }

  if (currentIntake > merRange.max) {
    return "above-range";
  }

  return "within-range";
}

export function validatePetCurrentIntakeInput(input: {
  foodCalories?: number;
  treatCalories?: number;
}): PetCaloriesMessage | null {
  const values = [input.foodCalories, input.treatCalories];

  if (values.some((value) => typeof value === "number" && !Number.isFinite(value))) {
    return {
      status: "invalid",
      message: "Enter valid current calorie amounts.",
    };
  }

  if (values.some((value) => typeof value === "number" && value < 0)) {
    return {
      status: "invalid",
      message: "Current calorie amounts cannot be negative.",
    };
  }

  return null;
}

export function validatePetCaloriesInput(
  input: PetCaloriesInput,
): PetCaloriesMessage | null {
  if (input.specialCases?.length) {
    return {
      status: "out-of-scope",
      message: OUT_OF_SCOPE_MESSAGE,
    };
  }

  if (typeof input.weight !== "number") {
    return {
      status: "empty",
      message: "Enter your pet’s weight to view the estimate.",
    };
  }

  if (!Number.isFinite(input.weight)) {
    return {
      status: "invalid",
      message: "Enter a valid weight.",
    };
  }

  if (input.weight <= 0) {
    return {
      status: "invalid",
      message: "Weight must be greater than 0.",
    };
  }

  const weightKg = convertPetWeightToKg(input.weight, input.unit);

  if (weightKg < 0.5) {
    return {
      status: "review",
      message:
        "Check whether the weight belongs to an adult pet and whether the value is correct.",
    };
  }

  if (input.species === "gato" && weightKg > 25) {
    return {
      status: "review",
      message: "Check that you entered the cat’s weight and unit correctly.",
    };
  }

  if (input.species === "perro" && weightKg > 150) {
    return {
      status: "review",
      message: "Check that you entered the dog’s weight and unit correctly.",
    };
  }

  return validatePetCurrentIntakeInput(input);
}

export function calculatePetCalories(
  input: PetCaloriesInput,
): PetCaloriesResult {
  const validation = validatePetCaloriesInput(input);

  if (validation) {
    return validation;
  }

  const weightKg = convertPetWeightToKg(input.weight as number, input.unit);
  const rer = calculatePetRer(weightKg);
  const factorRange = getPetMerFactorRange(input.species, input.profile);
  const merRange = calculatePetMerRange(rer, factorRange);
  const treatRange = calculatePetTreatRange(merRange);
  const mainFoodRange = calculatePetMainFoodRange(merRange);
  const warnings = getPetContextWarnings(input);
  const currentIntake = calculateCurrentPetIntake(
    input.foodCalories,
    input.treatCalories,
  );
  const intakeComparison =
    typeof currentIntake === "number"
      ? buildCurrentIntakeComparison(currentIntake, input, merRange)
      : undefined;

  const result: PetCaloriesSuccess = {
    status: "ok",
    species: input.species,
    weightKg,
    rer,
    merRange,
    factorRange,
    treatRange,
    mainFoodRange,
    warnings,
    intakeComparison,
    copyText: "",
  };

  result.copyText = buildPetCaloriesCopyText(result, input);

  return result;
}

export function getPetContextWarnings(input: PetCaloriesInput): string[] {
  const warnings: string[] = [];

  if (input.weightContext === "actual") {
    warnings.push(
      "If your pet is not at an ideal body condition, current weight may not be the best starting point for estimating calories.",
    );
  }

  if (input.weightContext === "ideal") {
    warnings.push(
      "Using ideal weight can be more useful when a pet is overweight, but it should be confirmed with your veterinarian.",
    );
  }

  if (input.weightContext === "no-se") {
    warnings.push(
      "If you do not know the ideal weight, use this result only as an initial reference.",
    );
  }

  if (input.bodyCondition === "sobrepeso") {
    warnings.push(
      "This calculator does not create a weight-loss plan. Consult your veterinarian before reducing portions.",
    );
  }

  if (input.bodyCondition === "delgado") {
    warnings.push(
      "If your pet is below its ideal body condition, consult your veterinarian before increasing food.",
    );
  }

  if (input.profile === "inactivo") {
    warnings.push(
      "The low end of the range is often more prudent for sedentary pets, but it should be adjusted through monitoring.",
    );
  }

  return warnings;
}

export function formatPetCalories(value: number): string {
  return String(Math.round(value));
}

export function formatPetCalorieRange(range: PetCalorieRange): string {
  const min = formatPetCalories(range.min);
  const max = formatPetCalories(range.max);

  return min === max ? min : `${min}-${max}`;
}

export function formatPetFactorRange(range: PetCalorieRange): string {
  return range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`;
}

export function buildPetCaloriesCopyText(
  result: PetCaloriesSuccess,
  input: PetCaloriesInput,
): string {
  const lines = [
    `Daily calories for your ${input.species === "perro" ? "dog" : "cat"}`,
    `Weight used: ${roundTo(result.weightKg, 2)} kg (${PET_WEIGHT_CONTEXT_LABELS[input.weightContext]})`,
    `Estimated maintenance: ${formatPetCalorieRange(result.merRange)} kcal/day`,
    `Estimated RER: ${formatPetCalories(result.rer)} kcal/day`,
    `Applied factor: ${formatPetFactorRange(result.factorRange)} × RER`,
    `Treats/snacks: up to ${formatPetCalorieRange(result.treatRange)} kcal/day`,
    "This estimate is a starting point, not a prescription. Actual intake should be adjusted for weight, body condition, activity and health with guidance from your veterinarian.",
  ];

  if (result.intakeComparison) {
    lines.splice(
      6,
      0,
      `Reported current intake: ${formatPetCalories(result.intakeComparison.totalCalories)} kcal/day`,
      `Comparison: ${result.intakeComparison.message}`,
    );
  }

  return lines.join("\n");
}

export function buildPetCaloriesShareUrl(
  input: PetCaloriesInput,
  basePath = SHARE_PATH,
): string {
  const params = new URLSearchParams();

  params.set("species", input.species);
  params.set("unit", input.unit);
  params.set("profile", input.profile);
  params.set("weightType", input.weightContext);
  params.set("condition", input.bodyCondition);

  if (typeof input.weight === "number" && Number.isFinite(input.weight)) {
    params.set("weight", trimNumber(input.weight));
  }

  if (typeof input.foodCalories === "number" && Number.isFinite(input.foodCalories)) {
    params.set("foodCalories", trimNumber(input.foodCalories));
  }

  if (
    typeof input.treatCalories === "number" &&
    Number.isFinite(input.treatCalories)
  ) {
    params.set("treatCalories", trimNumber(input.treatCalories));
  }

  input.specialCases?.forEach((specialCase) => {
    params.append("specialCase", specialCase);
  });

  const query = params.toString();

  return query ? `${basePath}?${query}` : basePath;
}

export function parsePetCaloriesSearchParams(
  params: URLSearchParams,
): ParsedPetCaloriesSearchParams {
  let hadInvalidParams = false;
  const species = readParam(params, "species", isPetCalorieSpecies, "perro");
  const unit = readParam(params, "unit", isPetWeightUnit, "kg");
  const profile = readParam(
    params,
    "profile",
    isPetAdultProfile,
    "esterilizado",
  );
  const weightContext = readParam(
    params,
    "weightType",
    isPetWeightContext,
    "actual",
  );
  const bodyCondition = readParam(
    params,
    "condition",
    isPetBodyCondition,
    "no-se",
  );

  const parsedWeight = parseOptionalQueryNumber(params.get("weight"));
  const parsedFoodCalories = parseOptionalQueryNumber(params.get("foodCalories"));
  const parsedTreatCalories = parseOptionalQueryNumber(params.get("treatCalories"));
  const specialCases = params
    .getAll("specialCase")
    .filter(isPetSpecialCase);

  if (
    hasInvalidRead(params, "species", species, "perro") ||
    hasInvalidRead(params, "unit", unit, "kg") ||
    hasInvalidRead(params, "profile", profile, "esterilizado") ||
    hasInvalidRead(params, "weightType", weightContext, "actual") ||
    hasInvalidRead(params, "condition", bodyCondition, "no-se") ||
    (params.has("weight") && typeof parsedWeight !== "number") ||
    (params.has("foodCalories") && typeof parsedFoodCalories !== "number") ||
    (params.has("treatCalories") && typeof parsedTreatCalories !== "number") ||
    params.getAll("specialCase").some((value) => !isPetSpecialCase(value))
  ) {
    hadInvalidParams = true;
  }

  return {
    species,
    weight: parsedWeight,
    unit,
    profile,
    weightContext,
    bodyCondition,
    foodCalories: parsedFoodCalories,
    treatCalories: parsedTreatCalories,
    specialCases,
    hadInvalidParams,
  };
}

function buildCurrentIntakeComparison(
  totalCalories: number,
  input: PetCaloriesInput,
  merRange: PetCalorieRange,
): PetCurrentIntakeComparison {
  const status = comparePetIntakeWithMer(totalCalories, merRange);
  const messages: Record<PetIntakeComparisonStatus, string> = {
    "below-range": "below the estimated range",
    "within-range": "within the estimated range",
    "above-range": "above the estimated range",
  };

  return {
    status,
    totalCalories,
    foodCalories: input.foodCalories ?? 0,
    treatCalories: input.treatCalories ?? 0,
    message: messages[status],
  };
}

function multiplyRange(range: PetCalorieRange, multiplier: number): PetCalorieRange {
  return {
    min: range.min * multiplier,
    max: range.max * multiplier,
  };
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

function trimNumber(value: number): string {
  const rounded = roundTo(value, 6);

  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  return String(rounded).replace(/0+$/, "").replace(/\.$/, "");
}

function parseOptionalQueryNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = parsePetDecimalInput(value);

  return typeof parsed === "number" && Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function readParam<T extends string>(
  params: URLSearchParams,
  key: string,
  guard: (value: string) => value is T,
  fallback: T,
): T {
  const value = params.get(key);

  return value && guard(value) ? value : fallback;
}

function hasInvalidRead<T extends string>(
  params: URLSearchParams,
  key: string,
  parsedValue: T,
  fallback: T,
): boolean {
  return params.has(key) && parsedValue === fallback && params.get(key) !== fallback;
}
