const DAY_MS = 86_400_000;

export function parseCivilDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError("Civil date must use YYYY-MM-DD.");
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError("Civil date is invalid.");
  }
  return date;
}

export function inclusiveCivilDays(from: string, to: string) {
  const start = parseCivilDate(from).getTime();
  const end = parseCivilDate(to).getTime();
  if (end < start) throw new RangeError("End date cannot be before start date.");
  return Math.floor((end - start) / DAY_MS) + 1;
}

export function completedYears(from: string, to: string) {
  const start = parseCivilDate(from);
  const end = parseCivilDate(to);
  if (end < start) throw new RangeError("End date cannot be before start date.");
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  const anniversaryMonth = start.getUTCMonth();
  const anniversaryDay = start.getUTCDate();
  if (end.getUTCMonth() < anniversaryMonth || (end.getUTCMonth() === anniversaryMonth && end.getUTCDate() < anniversaryDay)) years -= 1;
  return years;
}
