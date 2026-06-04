export const PET_SPECIES = ["perro", "gato"] as const;
export const DOG_SIZES = ["pequena", "mediana", "grande", "muy-grande"] as const;

export type PetSpecies = (typeof PET_SPECIES)[number];
export type DogSize = (typeof DOG_SIZES)[number];
export type PetAgeInputMethod = "edad" | "fecha";

export interface PlainDateParts {
  year: number;
  month: number;
  day: number;
}

export interface PetAgeInput {
  species: PetSpecies;
  years?: number;
  months?: number;
  birthDate?: PlainDateParts;
  today?: PlainDateParts;
  dogSize?: DogSize | "no-se" | "";
}

export interface PetAgeAnchor {
  ageInMonths: number;
  humanAge: number | null;
}

export interface PetHumanAgeSuccess {
  status: "ok";
  species: PetSpecies;
  dogSize?: DogSize;
  ageInMonths: number;
  realAgeLabel: string;
  humanAge: number;
  displayHumanAge: string;
  lowerAnchor: PetAgeAnchor;
  upperAnchor: PetAgeAnchor;
  interpolated: boolean;
  tableLabel: string;
  copyText: string;
}

export interface PetHumanAgeMessage {
  status:
    | "empty"
    | "invalid"
    | "missing-dog-size"
    | "unknown-dog-size"
    | "below-range"
    | "above-range";
  message: string;
  nearestAnchor?: PetAgeAnchor;
}

export type PetHumanAgeResult = PetHumanAgeSuccess | PetHumanAgeMessage;

export type PetAgeValidationResult =
  | { ok: true; ageInMonths: number }
  | {
      ok: false;
      status: PetHumanAgeMessage["status"];
      message: string;
    };

export const DOG_SIZE_LABELS: Record<DogSize, string> = {
  pequena: "pequeño",
  mediana: "mediano",
  grande: "grande",
  "muy-grande": "muy grande",
};

export const DOG_SIZE_TABLE_LABELS: Record<DogSize, string> = {
  pequena: "Perro pequeño",
  mediana: "Perro mediano",
  grande: "Perro grande",
  "muy-grande": "Perro muy grande",
};

export const PET_SOURCE_LABEL = "tabla veterinaria alojada por AAHA";

const CAT_TABLE: PetAgeAnchor[] = [
  { ageInMonths: 6, humanAge: 10 },
  { ageInMonths: 12, humanAge: 15 },
  { ageInMonths: 24, humanAge: 24 },
  { ageInMonths: 36, humanAge: 28 },
  { ageInMonths: 48, humanAge: 32 },
  { ageInMonths: 60, humanAge: 36 },
  { ageInMonths: 72, humanAge: 40 },
  { ageInMonths: 84, humanAge: 44 },
  { ageInMonths: 96, humanAge: 48 },
  { ageInMonths: 108, humanAge: 52 },
  { ageInMonths: 120, humanAge: 56 },
  { ageInMonths: 132, humanAge: 60 },
  { ageInMonths: 144, humanAge: 64 },
  { ageInMonths: 156, humanAge: 68 },
  { ageInMonths: 168, humanAge: 72 },
  { ageInMonths: 180, humanAge: 76 },
  { ageInMonths: 192, humanAge: 80 },
  { ageInMonths: 204, humanAge: 84 },
  { ageInMonths: 216, humanAge: 88 },
  { ageInMonths: 228, humanAge: 92 },
  { ageInMonths: 240, humanAge: 96 },
  { ageInMonths: 252, humanAge: 100 },
];

const DOG_TABLES: Record<DogSize, PetAgeAnchor[]> = {
  pequena: [
    { ageInMonths: 12, humanAge: 15 },
    { ageInMonths: 24, humanAge: 24 },
    { ageInMonths: 36, humanAge: 28 },
    { ageInMonths: 48, humanAge: 32 },
    { ageInMonths: 60, humanAge: 36 },
    { ageInMonths: 72, humanAge: 40 },
    { ageInMonths: 84, humanAge: 44 },
    { ageInMonths: 96, humanAge: 48 },
    { ageInMonths: 108, humanAge: 52 },
    { ageInMonths: 120, humanAge: 56 },
    { ageInMonths: 132, humanAge: 60 },
    { ageInMonths: 144, humanAge: 64 },
    { ageInMonths: 156, humanAge: 68 },
    { ageInMonths: 168, humanAge: 72 },
    { ageInMonths: 180, humanAge: 76 },
    { ageInMonths: 192, humanAge: 80 },
    { ageInMonths: 204, humanAge: 84 },
    { ageInMonths: 216, humanAge: 88 },
    { ageInMonths: 228, humanAge: 92 },
    { ageInMonths: 240, humanAge: 96 },
  ],
  mediana: [
    { ageInMonths: 12, humanAge: 15 },
    { ageInMonths: 24, humanAge: 24 },
    { ageInMonths: 36, humanAge: 28 },
    { ageInMonths: 48, humanAge: 33 },
    { ageInMonths: 60, humanAge: 37 },
    { ageInMonths: 72, humanAge: 42 },
    { ageInMonths: 84, humanAge: 47 },
    { ageInMonths: 96, humanAge: 51 },
    { ageInMonths: 108, humanAge: 56 },
    { ageInMonths: 120, humanAge: 60 },
    { ageInMonths: 132, humanAge: 65 },
    { ageInMonths: 144, humanAge: 69 },
    { ageInMonths: 156, humanAge: 74 },
    { ageInMonths: 168, humanAge: 78 },
    { ageInMonths: 180, humanAge: 83 },
    { ageInMonths: 192, humanAge: 87 },
    { ageInMonths: 204, humanAge: 92 },
    { ageInMonths: 216, humanAge: 96 },
    { ageInMonths: 228, humanAge: 101 },
    { ageInMonths: 240, humanAge: 105 },
  ],
  grande: [
    { ageInMonths: 12, humanAge: 15 },
    { ageInMonths: 24, humanAge: 24 },
    { ageInMonths: 36, humanAge: 30 },
    { ageInMonths: 48, humanAge: 35 },
    { ageInMonths: 60, humanAge: 40 },
    { ageInMonths: 72, humanAge: 45 },
    { ageInMonths: 84, humanAge: 50 },
    { ageInMonths: 96, humanAge: 55 },
    { ageInMonths: 108, humanAge: 61 },
    { ageInMonths: 120, humanAge: 66 },
    { ageInMonths: 132, humanAge: 72 },
    { ageInMonths: 144, humanAge: 77 },
    { ageInMonths: 156, humanAge: 82 },
    { ageInMonths: 168, humanAge: 88 },
    { ageInMonths: 180, humanAge: 93 },
    { ageInMonths: 192, humanAge: 99 },
    { ageInMonths: 204, humanAge: 104 },
    { ageInMonths: 216, humanAge: 109 },
    { ageInMonths: 228, humanAge: 115 },
    { ageInMonths: 240, humanAge: 120 },
  ],
  "muy-grande": [
    { ageInMonths: 12, humanAge: 15 },
    { ageInMonths: 24, humanAge: 24 },
    { ageInMonths: 36, humanAge: 32 },
    { ageInMonths: 48, humanAge: 37 },
    { ageInMonths: 60, humanAge: 42 },
    { ageInMonths: 72, humanAge: 49 },
    { ageInMonths: 84, humanAge: 56 },
    { ageInMonths: 96, humanAge: 64 },
    { ageInMonths: 108, humanAge: 71 },
    { ageInMonths: 120, humanAge: 78 },
    { ageInMonths: 132, humanAge: 86 },
    { ageInMonths: 144, humanAge: 93 },
    { ageInMonths: 156, humanAge: 101 },
    { ageInMonths: 168, humanAge: 108 },
    { ageInMonths: 180, humanAge: 115 },
    { ageInMonths: 192, humanAge: 123 },
  ],
};

export function isPetSpecies(value: string): value is PetSpecies {
  return PET_SPECIES.includes(value as PetSpecies);
}

export function isDogSize(value: string): value is DogSize {
  return DOG_SIZES.includes(value as DogSize);
}

export function getPetAgeTable(
  species: PetSpecies,
  dogSize?: DogSize,
): PetAgeAnchor[] {
  if (species === "gato") {
    return CAT_TABLE;
  }

  if (!dogSize) {
    return [];
  }

  return DOG_TABLES[dogSize];
}

export function validatePetAgeInput(input: PetAgeInput): PetAgeValidationResult {
  if (input.birthDate) {
    const today = input.today ?? todayInLocalTimeZone();

    if (!isValidPlainDate(input.birthDate)) {
      return {
        ok: false,
        status: "invalid",
        message: "Ingresa una fecha de nacimiento válida.",
      };
    }

    if (comparePlainDates(input.birthDate, today) > 0) {
      return {
        ok: false,
        status: "invalid",
        message: "La fecha de nacimiento no puede estar en el futuro.",
      };
    }

    return {
      ok: true,
      ageInMonths: calculateAgeInCompleteMonthsFromBirthDate(
        input.birthDate,
        today,
      ),
    };
  }

  const hasYears = typeof input.years === "number";
  const hasMonths = typeof input.months === "number";

  if (!hasYears && !hasMonths) {
    return {
      ok: false,
      status: "empty",
      message: "Ingresa la edad de tu mascota para ver la equivalencia.",
    };
  }

  const years = input.years ?? 0;
  const months = input.months ?? 0;

  if (!Number.isInteger(years) || years < 0) {
      return {
        ok: false,
        status: "invalid",
        message: "Los años deben ser un entero igual o mayor que 0.",
      };
  }

  if (!Number.isInteger(months) || months < 0 || months > 11) {
      return {
        ok: false,
        status: "invalid",
      message: "Los meses deben ser un entero entre 0 y 11.",
    };
  }

  return {
    ok: true,
    ageInMonths: years * 12 + months,
  };
}

export function getPetHumanAge(
  species: PetSpecies,
  ageInMonths: number,
  dogSize?: DogSize | "no-se" | "",
): PetHumanAgeResult {
  if (!Number.isInteger(ageInMonths) || ageInMonths < 0) {
    return {
      status: "invalid",
      message: "Ingresa una edad válida en años y meses.",
    };
  }

  if (species === "perro") {
    if (!dogSize) {
      return {
        status: "missing-dog-size",
        message: "Elige la talla adulta de tu perro antes de calcular.",
      };
    }

    if (dogSize === "no-se") {
      return {
        status: "unknown-dog-size",
        message:
          "Usa la talla adulta aproximada. Si tu perro aún crece, elige la talla esperada de adulto.",
      };
    }
  }

  const table =
    species === "gato" ? CAT_TABLE : DOG_TABLES[dogSize as DogSize];
  const first = table[0];
  const last = table[table.length - 1];

  if (ageInMonths < first.ageInMonths) {
    return {
      status: "below-range",
      message:
        species === "gato"
          ? "La tabla de referencia inicia en 6 meses para gatos."
          : "La tabla de referencia inicia en 1 año para perros.",
      nearestAnchor: first,
    };
  }

  if (ageInMonths > last.ageInMonths) {
    return {
      status: "above-range",
      message:
        species === "perro" && dogSize === "muy-grande"
          ? "La tabla publicada para perros muy grandes llega hasta 16 años. No extrapolamos más allá de ese punto."
          : `La tabla publicada llega hasta ${formatRealAgeLabel(last.ageInMonths)}. No extrapolamos más allá de ese punto.`,
      nearestAnchor: last,
    };
  }

  const exactAnchor = table.find((anchor) => anchor.ageInMonths === ageInMonths);

  if (exactAnchor) {
    return buildSuccessResult({
      species,
      dogSize: species === "perro" ? (dogSize as DogSize) : undefined,
      ageInMonths,
      humanAge: exactAnchor.humanAge ?? 0,
      lowerAnchor: exactAnchor,
      upperAnchor: exactAnchor,
      interpolated: false,
    });
  }

  const upperIndex = table.findIndex((anchor) => anchor.ageInMonths > ageInMonths);
  const lowerAnchor = table[upperIndex - 1];
  const upperAnchor = table[upperIndex];

  if (!lowerAnchor || !upperAnchor) {
    return {
      status: "above-range",
      message: "La edad queda fuera de la tabla publicada.",
      nearestAnchor: lowerAnchor ?? upperAnchor,
    };
  }

  return buildSuccessResult({
    species,
    dogSize: species === "perro" ? (dogSize as DogSize) : undefined,
    ageInMonths,
    humanAge: interpolatePetAge(lowerAnchor, upperAnchor, ageInMonths),
    lowerAnchor,
    upperAnchor,
    interpolated: true,
  });
}

export function calculatePetHumanAge(input: PetAgeInput): PetHumanAgeResult {
  const validation = validatePetAgeInput(input);

  if (!validation.ok) {
    return {
      status: validation.status,
      message: validation.message,
    };
  }

  return getPetHumanAge(input.species, validation.ageInMonths, input.dogSize);
}

export function interpolatePetAge(
  lowerAnchor: PetAgeAnchor,
  upperAnchor: PetAgeAnchor,
  ageInMonths: number,
): number {
  if (lowerAnchor.humanAge === null || upperAnchor.humanAge === null) {
    throw new RangeError("No hay datos suficientes para interpolar.");
  }

  if (upperAnchor.ageInMonths === lowerAnchor.ageInMonths) {
    return lowerAnchor.humanAge;
  }

  const proportion =
    (ageInMonths - lowerAnchor.ageInMonths) /
    (upperAnchor.ageInMonths - lowerAnchor.ageInMonths);

  return roundToOneDecimal(
    lowerAnchor.humanAge +
      proportion * (upperAnchor.humanAge - lowerAnchor.humanAge),
  );
}

export function calculateAgeInCompleteMonthsFromBirthDate(
  birthDate: PlainDateParts,
  today: PlainDateParts,
): number {
  if (!isValidPlainDate(birthDate) || !isValidPlainDate(today)) {
    throw new RangeError("Las fechas deben ser válidas.");
  }

  if (comparePlainDates(birthDate, today) > 0) {
    throw new RangeError("La fecha de nacimiento no puede estar en el futuro.");
  }

  let months = (today.year - birthDate.year) * 12 + today.month - birthDate.month;

  if (today.day < birthDate.day) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function parsePetAgeSearchParams(
  searchParams: URLSearchParams,
  today: PlainDateParts = todayInLocalTimeZone(),
): {
  species: PetSpecies;
  dogSize?: DogSize | "no-se" | "";
  years?: number;
  months?: number;
  birthDate?: PlainDateParts;
  method: PetAgeInputMethod;
  hadInvalidParams: boolean;
} {
  let hadInvalidParams = false;
  const rawSpecies = searchParams.get("especie") ?? "perro";
  const species = isPetSpecies(rawSpecies) ? rawSpecies : "perro";

  if (!isPetSpecies(rawSpecies)) {
    hadInvalidParams = true;
  }

  const rawDogSize = searchParams.get("talla") ?? "";
  const dogSize =
    rawDogSize === "no-se" || rawDogSize === ""
      ? rawDogSize
      : isDogSize(rawDogSize)
        ? rawDogSize
        : "";

  if (rawDogSize && rawDogSize !== "no-se" && !isDogSize(rawDogSize)) {
    hadInvalidParams = true;
  }

  const rawDate = searchParams.get("fecha");
  const birthDate = rawDate ? parseIsoDate(rawDate) : undefined;

  if (rawDate && (!birthDate || comparePlainDates(birthDate, today) > 0)) {
    hadInvalidParams = true;
  }

  if (birthDate && comparePlainDates(birthDate, today) <= 0) {
    return {
      species,
      dogSize,
      birthDate,
      method: "fecha",
      hadInvalidParams,
    };
  }

  const years = parseOptionalInteger(searchParams.get("anos"));
  const months = parseOptionalInteger(searchParams.get("meses"));

  if (
    (searchParams.has("anos") && years === undefined) ||
    (searchParams.has("meses") && months === undefined)
  ) {
    hadInvalidParams = true;
  }

  return {
    species,
    dogSize,
    years,
    months,
    method: "edad",
    hadInvalidParams,
  };
}

export function buildPetAgeShareUrl(
  input: {
    species: PetSpecies;
    dogSize?: DogSize;
    years?: number;
    months?: number;
    birthDate?: PlainDateParts;
  },
  basePath = "/mascotas/edad-de-mascota-en-anos-humanos",
): string {
  const params = new URLSearchParams();

  params.set("especie", input.species);

  if (input.species === "perro" && input.dogSize) {
    params.set("talla", input.dogSize);
  }

  if (input.birthDate) {
    params.set("fecha", formatIsoDate(input.birthDate));
  } else {
    params.set("anos", String(input.years ?? 0));
    params.set("meses", String(input.months ?? 0));
  }

  return `${basePath}?${params.toString()}`;
}

export function buildPetAgeCopyText(result: PetHumanAgeSuccess): string {
  const petLabel =
    result.species === "perro" && result.dogSize
      ? `perro ${DOG_SIZE_LABELS[result.dogSize]}`
      : "gato";

  return [
    "Edad de mascota en años humanos - calculadoras.tools",
    `Mascota: ${petLabel}`,
    `Edad real: ${result.realAgeLabel}`,
    `Estimación: ${result.displayHumanAge} años humanos`,
    `Referencia: ${PET_SOURCE_LABEL}`,
    "Es una referencia orientativa. La raza, la talla, el peso, la salud y el estilo de vida pueden cambiar cómo envejece una mascota.",
  ].join("\n");
}

export function formatPetAgeResult(result: PetHumanAgeSuccess): string {
  const petLabel =
    result.species === "perro" && result.dogSize
      ? `perro ${DOG_SIZE_LABELS[result.dogSize]}`
      : "gato";

  return `Tu ${petLabel} de ${result.realAgeLabel} equivale aproximadamente a ${result.displayHumanAge} años humanos.`;
}

export function formatRealAgeLabel(ageInMonths: number): string {
  if (ageInMonths === 6) {
    return "6 meses";
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "año" : "años"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mes" : "meses"}`);
  }

  return parts.join(" y ") || "0 meses";
}

export function formatHumanAge(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);
}

export function todayInLocalTimeZone(): PlainDateParts {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function comparePlainDates(
  left: PlainDateParts,
  right: PlainDateParts,
): number {
  if (left.year !== right.year) {
    return Math.sign(left.year - right.year);
  }

  if (left.month !== right.month) {
    return Math.sign(left.month - right.month);
  }

  return Math.sign(left.day - right.day);
}

export function parseIsoDate(value: string): PlainDateParts | undefined {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return undefined;
  }

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  return isValidPlainDate(date) ? date : undefined;
}

export function formatIsoDate(date: PlainDateParts): string {
  return [
    String(date.year).padStart(4, "0"),
    String(date.month).padStart(2, "0"),
    String(date.day).padStart(2, "0"),
  ].join("-");
}

function buildSuccessResult({
  species,
  dogSize,
  ageInMonths,
  humanAge,
  lowerAnchor,
  upperAnchor,
  interpolated,
}: {
  species: PetSpecies;
  dogSize?: DogSize;
  ageInMonths: number;
  humanAge: number;
  lowerAnchor: PetAgeAnchor;
  upperAnchor: PetAgeAnchor;
  interpolated: boolean;
}): PetHumanAgeSuccess {
  const roundedHumanAge = roundToOneDecimal(humanAge);
  const realAgeLabel = formatRealAgeLabel(ageInMonths);
  const result: PetHumanAgeSuccess = {
    status: "ok",
    species,
    dogSize,
    ageInMonths,
    realAgeLabel,
    humanAge: roundedHumanAge,
    displayHumanAge: formatHumanAge(roundedHumanAge),
    lowerAnchor,
    upperAnchor,
    interpolated,
    tableLabel:
      species === "gato"
        ? "Gato"
        : DOG_SIZE_TABLE_LABELS[dogSize ?? "mediana"],
    copyText: "",
  };

  result.copyText = buildPetAgeCopyText(result);

  return result;
}

function isValidPlainDate(date: PlainDateParts): boolean {
  return (
    Number.isInteger(date.year) &&
    Number.isInteger(date.month) &&
    Number.isInteger(date.day) &&
    date.year >= 1 &&
    date.month >= 1 &&
    date.month <= 12 &&
    date.day >= 1 &&
    date.day <= daysInMonth(date.year, date.month)
  );
}

function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    return 0;
  }

  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function parseOptionalInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  if (!/^\d+$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}
