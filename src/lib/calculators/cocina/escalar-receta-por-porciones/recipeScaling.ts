export const RECIPE_SCALING_MAX_INGREDIENTS = 50;

export const RECIPE_QUANTITY_FORMAT_MODES = [
  "fraction",
  "decimal",
  "both",
] as const;

export type RecipeQuantityFormatMode =
  (typeof RECIPE_QUANTITY_FORMAT_MODES)[number];

export interface RecipeIngredient {
  quantity: string;
  unit: string;
  name: string;
}

export type ParseRecipeQuantityResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      interpretation?: string;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid";
    };

export interface CookingFractionApproximation {
  text: string;
  value: number;
  whole: number;
  numerator: number;
  denominator: number;
  approximate: boolean;
}

export interface RecipeIngredientValidation {
  valid: boolean;
  errors: string[];
  isTasteOnly: boolean;
}

export interface PracticalWarning {
  term: string;
  message: string;
}

export interface PastedIngredientsResult {
  ingredients: RecipeIngredient[];
  emptyLines: number;
  truncatedCount: number;
}

const DEFAULT_DECIMALS = 4;
const MAX_ADAPTIVE_DECIMALS = 10;
const FRACTION_DENOMINATORS = [2, 3, 4, 6, 8, 12, 16] as const;
const EXACT_TOLERANCE = 1e-10;
const PRACTICAL_TOLERANCE = 1 / 48;

const UNIT_ALIASES = new Set([
  "unidad",
  "unidades",
  "g",
  "gr",
  "gramo",
  "gramos",
  "kg",
  "kilo",
  "kilos",
  "kilogramo",
  "kilogramos",
  "ml",
  "mililitro",
  "mililitros",
  "l",
  "litro",
  "litros",
  "taza",
  "tazas",
  "cucharada",
  "cucharadas",
  "cda",
  "cdas",
  "cucharadita",
  "cucharaditas",
  "cdta",
  "cdtas",
  "oz",
  "onza",
  "onzas",
  "lb",
  "libra",
  "libras",
  "pieza",
  "piezas",
  "paquete",
  "paquetes",
  "pizca",
  "pizcas",
  "lata",
  "latas",
  "ramita",
  "ramitas",
  "diente",
  "dientes",
  "unit",
  "units",
  "gram",
  "grams",
  "kilogram",
  "kilograms",
  "liter",
  "liters",
  "litre",
  "litres",
  "milliliter",
  "milliliters",
  "millilitre",
  "millilitres",
  "cup",
  "cups",
  "tablespoon",
  "tablespoons",
  "tbsp",
  "teaspoon",
  "teaspoons",
  "tsp",
  "ounce",
  "ounces",
  "pound",
  "pounds",
  "piece",
  "pieces",
  "package",
  "packages",
  "pinch",
  "pinches",
  "can",
  "cans",
  "sprig",
  "sprigs",
  "clove",
  "cloves",
]);

const PRACTICAL_WARNING_RULES = [
  {
    term: "huevo",
    pattern: /\bhuevos?\b/i,
    message: "Revisa antes de redondear huevos o piezas enteras.",
  },
  {
    term: "levadura",
    pattern: /\blevadura\b/i,
    message: "La levadura puede requerir ajuste practico segun la receta.",
  },
  {
    term: "polvo para hornear",
    pattern: /\bpolvo\s+para\s+hornear\b/i,
    message: "Los leudantes conviene revisarlos antes de escalar.",
  },
  {
    term: "bicarbonato",
    pattern: /\bbicarbonato\b/i,
    message: "Los leudantes conviene revisarlos antes de escalar.",
  },
  {
    term: "sal",
    pattern: /\bsal\b/i,
    message: "La sal puede necesitar ajuste al gusto.",
  },
  {
    term: "especia",
    pattern: /\bespecias?\b|\bcanela\b|\bpimienta\b|\bcomino\b|\boregano\b/i,
    message: "Las especias pueden sentirse mas intensas al escalar.",
  },
  {
    term: "molde",
    pattern: /\bmoldes?\b/i,
    message: "El tamano del molde puede cambiar el grosor y la coccion.",
  },
  {
    term: "horno",
    pattern: /\bhorno\b/i,
    message: "El tiempo de horno no siempre escala de forma lineal.",
  },
] as const;

const PRACTICAL_WARNING_RULES_EN = [
  {
    term: "egg",
    pattern: /\beggs?\b/i,
    message: "Review the amount before rounding eggs or whole pieces.",
  },
  {
    term: "yeast",
    pattern: /\byeast\b/i,
    message: "Yeast may need a practical adjustment depending on the recipe.",
  },
  {
    term: "baking powder",
    pattern: /\bbaking\s+powder\b/i,
    message: "Review leavening ingredients before scaling.",
  },
  {
    term: "baking soda",
    pattern: /\bbaking\s+soda\b/i,
    message: "Review leavening ingredients before scaling.",
  },
  {
    term: "salt",
    pattern: /\bsalt\b/i,
    message: "Salt may need to be adjusted to taste.",
  },
  {
    term: "spice",
    pattern: /\bspices?\b|\bcinnamon\b|\bpepper\b|\bcumin\b|\boregano\b/i,
    message: "Spices can taste more intense when a recipe is scaled.",
  },
  {
    term: "pan",
    pattern: /\bpans?\b|\btins?\b/i,
    message: "Pan size can change the thickness and cooking time.",
  },
  {
    term: "oven",
    pattern: /\boven\b/i,
    message: "Oven time does not always scale linearly.",
  },
] as const;

export function calculateRecipeScaleFactor(
  originalServings: number,
  desiredServings: number,
): number {
  validatePositiveFiniteServings(originalServings, "originalServings");
  validatePositiveFiniteServings(desiredServings, "desiredServings");

  return desiredServings / originalServings;
}

export function scaleIngredientQuantity(
  quantity: string | number,
  factor: number,
): number {
  if (!Number.isFinite(factor)) {
    throw new RangeError("El factor debe ser un numero finito.");
  }

  if (typeof quantity === "number") {
    if (!Number.isFinite(quantity) || quantity < 0) {
      throw new RangeError("La cantidad debe ser un numero finito no negativo.");
    }

    return quantity * factor;
  }

  const parsed = parseRecipeQuantity(quantity);

  if (!parsed.ok) {
    throw new RangeError("La cantidad no se pudo interpretar.");
  }

  return parsed.value * factor;
}

export function parseRecipeQuantity(
  rawValue: string,
  locale: "es" | "en" = "es",
): ParseRecipeQuantityResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteRecipeInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  if (/^\+/.test(trimmed) || /-/.test(trimmed)) {
    return { ok: false, error: "invalid" };
  }

  const fraction = parseFractionInput(trimmed);

  if (fraction) {
    if (fraction.denominator === 0) {
      return { ok: false, error: "invalid" };
    }

    const value = fraction.whole + fraction.numerator / fraction.denominator;

    return {
      ok: true,
      value,
      normalized: formatDecimal(value),
    };
  }

  const normalized = normalizeLocalizedNumber(trimmed, locale);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalized.value);

  if (!Number.isFinite(value) || value < 0) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: formatDecimal(value),
    ...(normalized.interpretation
      ? { interpretation: normalized.interpretation }
      : {}),
  };
}

export function formatRecipeQuantity(
  value: number,
  mode: RecipeQuantityFormatMode = "fraction",
): string {
  validateFiniteNonNegative(value);

  const decimal = formatDecimal(value);
  const fraction = approximateCookingFraction(value);

  if (mode === "decimal" || !fraction) {
    return decimal;
  }

  const fractionText = `${fraction.approximate ? "≈ " : ""}${fraction.text}`;

  if (mode === "both") {
    return `${decimal} (${fractionText})`;
  }

  return fractionText;
}

export function approximateCookingFraction(
  value: number,
): CookingFractionApproximation | undefined {
  validateFiniteNonNegative(value);

  const whole = Math.floor(value);
  const fraction = value - whole;

  if (fraction <= EXACT_TOLERANCE) {
    return undefined;
  }

  let best = {
    denominator: 1,
    numerator: 0,
    difference: Number.POSITIVE_INFINITY,
    candidate: whole,
  };

  FRACTION_DENOMINATORS.forEach((denominator) => {
    const numerator = Math.round(fraction * denominator);

    if (numerator === 0 || numerator >= denominator) {
      return;
    }

    const candidate = whole + numerator / denominator;
    const difference = Math.abs(value - candidate);

    if (difference < best.difference) {
      best = {
        denominator,
        numerator,
        difference,
        candidate,
      };
    }
  });

  if (best.numerator === 0 || best.difference > PRACTICAL_TOLERANCE) {
    return undefined;
  }

  const simplified = simplifyFraction(best.numerator, best.denominator);
  const text = formatMixedFraction(whole, simplified.numerator, simplified.denominator);

  return {
    text,
    value: best.candidate,
    whole,
    numerator: simplified.numerator,
    denominator: simplified.denominator,
    approximate: best.difference > EXACT_TOLERANCE,
  };
}

export function validateRecipeIngredient(
  ingredient: RecipeIngredient,
  locale: "es" | "en" = "es",
): RecipeIngredientValidation {
  const errors: string[] = [];
  const name = ingredient.name.trim();
  const unit = ingredient.unit.trim();
  const quantity = ingredient.quantity.trim();
  const isTasteOnly = isTasteOnlyIngredient(ingredient);

  if (!name) {
    errors.push(
      locale === "en" ? "Enter the ingredient." : "Escribe el ingrediente.",
    );
  }

  if (!quantity && !isTasteOnly) {
    errors.push(
      locale === "en"
        ? "Enter an amount or mark the row as to taste."
        : "Escribe la cantidad o marca la fila como al gusto.",
    );
  }

  if (quantity) {
    const parsed = parseRecipeQuantity(quantity, locale);

    if (!parsed.ok) {
      errors.push(
        locale === "en"
          ? "The amount could not be interpreted."
          : "La cantidad no se pudo interpretar.",
      );
    }
  }

  if (
    !name &&
    ["al gusto", "to taste"].includes(unit.toLowerCase())
  ) {
    errors.push(
      locale === "en"
        ? "Enter which ingredient is added to taste."
        : "Escribe que ingrediente es al gusto.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    isTasteOnly,
  };
}

export function parsePastedIngredientLine(
  line: string,
  locale: "es" | "en" = "es",
): RecipeIngredient {
  const normalizedLine = line.trim().replace(/\s+/g, " ");

  if (!normalizedLine) {
    return { quantity: "", unit: "", name: "" };
  }

  const tasteOnly = parseTasteOnlyLine(normalizedLine, locale);

  if (tasteOnly) {
    return tasteOnly;
  }

  const tokens = normalizedLine.split(" ");

  for (const tokenCount of [3, 2, 1]) {
    const quantityCandidate = tokens.slice(0, tokenCount).join(" ");
    const parsed = parseRecipeQuantity(quantityCandidate);

    if (!parsed.ok) {
      continue;
    }

    const rest = tokens.slice(tokenCount);

    if (rest.length === 0) {
      return {
        quantity: quantityCandidate,
        unit: "",
        name: "",
      };
    }

    const firstRestToken = normalizeText(rest[0]);

    if (UNIT_ALIASES.has(firstRestToken) && rest.length > 1) {
      return {
        quantity: quantityCandidate,
        unit: rest[0],
        name: stripLeadingConnector(rest.slice(1).join(" "), locale),
      };
    }

    return {
      quantity: quantityCandidate,
      unit: "",
      name: rest.join(" "),
    };
  }

  return {
    quantity: "",
    unit: "",
    name: normalizedLine,
  };
}

export function parsePastedIngredients(
  text: string,
  maxIngredients = RECIPE_SCALING_MAX_INGREDIENTS,
  locale: "es" | "en" = "es",
): PastedIngredientsResult {
  const safeMax = Math.max(0, Math.trunc(maxIngredients));
  const parsedLines = text.split(/\r?\n/).map((line) => ({
    raw: line,
    ingredient: parsePastedIngredientLine(line, locale),
  }));
  const nonEmptyLines = parsedLines.filter(({ raw }) => raw.trim());
  const ingredients = nonEmptyLines
    .slice(0, safeMax)
    .map(({ ingredient }) => ingredient);

  return {
    ingredients,
    emptyLines: parsedLines.length - nonEmptyLines.length,
    truncatedCount: Math.max(0, nonEmptyLines.length - ingredients.length),
  };
}

export function detectPracticalWarnings(
  ingredient: RecipeIngredient | string,
  locale: "es" | "en" = "es",
): PracticalWarning[] {
  const text =
    typeof ingredient === "string"
      ? ingredient
      : `${ingredient.unit} ${ingredient.name}`;
  const matches = new Map<string, PracticalWarning>();

  const rules: readonly {
    term: string;
    pattern: RegExp;
    message: string;
  }[] =
    locale === "en" ? PRACTICAL_WARNING_RULES_EN : PRACTICAL_WARNING_RULES;

  rules.forEach((rule) => {
    if (rule.pattern.test(text)) {
      matches.set(rule.term, {
        term: rule.term,
        message: rule.message,
      });
    }
  });

  return [...matches.values()];
}

function validatePositiveFiniteServings(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser un numero positivo.`);
  }
}

function validateFiniteNonNegative(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("La cantidad debe ser un numero finito no negativo.");
  }
}

function parseFractionInput(value: string):
  | {
      whole: number;
      numerator: number;
      denominator: number;
    }
  | undefined {
  const match = value.match(/^(\d+)?(?:\s+)?(\d+)\s*\/\s*(\d+)$/);

  if (!match) {
    return undefined;
  }

  return {
    whole: match[1] ? Number(match[1]) : 0,
    numerator: Number(match[2]),
    denominator: Number(match[3]),
  };
}

function isIncompleteRecipeInput(value: string) {
  return /^[+-]?(?:[.,])?$/.test(value) || /^[+-]?\d+[\d.,\s]*[.,]$/.test(value);
}

function normalizeLocalizedNumber(
  rawValue: string,
  locale: "es" | "en",
): { value: string; interpretation?: string } | undefined {
  const value = rawValue.replace(/\s/g, "");
  const lastComma = value.lastIndexOf(",");
  const lastPoint = value.lastIndexOf(".");
  const hasComma = lastComma !== -1;
  const hasPoint = lastPoint !== -1;

  if (!/^[\d.,]+$/.test(value)) {
    return undefined;
  }

  if (hasComma && hasPoint) {
    const decimalSeparator = lastComma > lastPoint ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return {
      value: `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`,
    };
  }

  if (hasComma || hasPoint) {
    const separator = hasComma ? "," : ".";
    const parts = value.split(separator);

    if (parts.length > 2) {
      if (!isValidGroupedInteger(value, separator)) {
        return undefined;
      }

      const interpreted = stripGrouping(value, separator);

      return {
        value: interpreted,
        interpretation:
          locale === "en"
            ? `Interpreted as ${interpreted}`
            : `Interpretado como ${interpreted}`,
      };
    }

    const [integerPart, decimalPart] = parts;

    if (!decimalPart) {
      return undefined;
    }

    if (
      decimalPart.length === 3 &&
      integerPart.length >= 1 &&
      isValidGroupedInteger(value, separator)
    ) {
      const interpreted = stripGrouping(value, separator);

      return {
        value: interpreted,
        interpretation:
          locale === "en"
            ? `Interpreted as ${interpreted}`
            : `Interpretado como ${interpreted}`,
      };
    }

    return {
      value: `${integerPart || "0"}.${decimalPart}`,
    };
  }

  return /^\d+$/.test(value) ? { value } : undefined;
}

function parseTasteOnlyLine(
  line: string,
  locale: "es" | "en",
): RecipeIngredient | undefined {
  const normalized = normalizeText(line);
  const tastePhrase = locale === "en" ? "to taste" : "al gusto";

  if (
    !(locale === "en"
      ? /\bto taste\b/.test(normalized)
      : /\bal gusto\b/.test(normalized))
  ) {
    return undefined;
  }

  const name = line
    .replace(
      locale === "en" ? /\bto taste\b/i : /\bal gusto\b/i,
      "",
    )
    .trim();

  return {
    quantity: "",
    unit: tastePhrase,
    name: name || line,
  };
}

function stripLeadingConnector(value: string, locale: "es" | "en") {
  return value
    .replace(locale === "en" ? /^of\s+/i : /^de\s+/i, "")
    .trim();
}

function isTasteOnlyIngredient(ingredient: RecipeIngredient) {
  return /\b(?:al gusto|to taste)\b/i.test(
    `${ingredient.unit} ${ingredient.name}`,
  );
}

function formatDecimal(value: number, decimals = DEFAULT_DECIMALS) {
  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const adaptiveDecimals = getAdaptiveDecimals(normalizedValue, decimals);

  return roundToDecimals(normalizedValue, adaptiveDecimals)
    .toFixed(adaptiveDecimals)
    .replace(/\.?0+$/, "");
}

function getAdaptiveDecimals(value: number, decimals: number) {
  if (Number.isInteger(value)) {
    return 0;
  }

  if (roundToDecimals(value, decimals) !== 0) {
    return decimals;
  }

  for (
    let candidate = decimals + 1;
    candidate <= MAX_ADAPTIVE_DECIMALS;
    candidate += 1
  ) {
    if (roundToDecimals(value, candidate) !== 0) {
      return Math.min(candidate + 1, MAX_ADAPTIVE_DECIMALS);
    }
  }

  return MAX_ADAPTIVE_DECIMALS;
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatMixedFraction(
  whole: number,
  numerator: number,
  denominator: number,
) {
  if (whole <= 0) {
    return `${numerator}/${denominator}`;
  }

  return `${whole} ${numerator}/${denominator}`;
}

function simplifyFraction(numerator: number, denominator: number) {
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);

  while (right) {
    const next = left % right;

    left = right;
    right = next;
  }

  return left || 1;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
