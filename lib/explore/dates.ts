/** Calendar date as `YYYY-MM-DD` (UTC). */
export type DateString = string;

export function parseDateString(value: DateString): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`Invalid date string: ${value}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day));
}

export function compareDateStrings(a: DateString, b: DateString): number {
  return parseDateString(a).getTime() - parseDateString(b).getTime();
}
