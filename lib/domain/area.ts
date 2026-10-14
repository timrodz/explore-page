export const AREAS = [
  "Shoreditch",
  "Camden",
  "Greenwich",
  "Clapham",
  "Notting Hill",
  "Canary Wharf",
] as const;

export type Area = (typeof AREAS)[number];
