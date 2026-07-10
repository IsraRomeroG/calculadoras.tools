export const GAS_MARKS = [
  { mark: "1/4", celsius: 110, fahrenheit: 225 },
  { mark: "1/2", celsius: 130, fahrenheit: 250 },
  { mark: "1", celsius: 140, fahrenheit: 275 },
  { mark: "2", celsius: 150, fahrenheit: 300 },
  { mark: "3", celsius: 160, fahrenheit: 325 },
  { mark: "4", celsius: 180, fahrenheit: 350 },
  { mark: "5", celsius: 190, fahrenheit: 375 },
  { mark: "6", celsius: 200, fahrenheit: 400 },
  { mark: "7", celsius: 220, fahrenheit: 425 },
  { mark: "8", celsius: 230, fahrenheit: 450 },
  { mark: "9", celsius: 240, fahrenheit: 475 },
] as const;

export type GasMarkEntry = (typeof GAS_MARKS)[number];
export type GasMark = GasMarkEntry["mark"];

export function isGasMark(value: string): value is GasMark {
  return GAS_MARKS.some((entry) => entry.mark === value);
}

export function getGasMarkEntry(mark: GasMark): GasMarkEntry {
  return GAS_MARKS.find((entry) => entry.mark === mark) ?? GAS_MARKS[0];
}

export function normalizeGasMark(rawValue: string): GasMark | undefined {
  const normalized = rawValue.trim().toLowerCase().replace(",", ".");

  if (normalized === "0.25") {
    return "1/4";
  }

  if (normalized === "0.5") {
    return "1/2";
  }

  return isGasMark(normalized) ? normalized : undefined;
}

export function findClosestGasMark(celsius: number): GasMarkEntry | null {
  if (!Number.isFinite(celsius)) {
    return null;
  }

  const first = GAS_MARKS[0];
  const last = GAS_MARKS[GAS_MARKS.length - 1];

  if (celsius < first.celsius || celsius > last.celsius) {
    return null;
  }

  return GAS_MARKS.reduce<GasMarkEntry>((best, entry) => {
    const bestDistance = Math.abs(celsius - best.celsius);
    const entryDistance = Math.abs(celsius - entry.celsius);

    return entryDistance < bestDistance ? entry : best;
  }, first);
}

