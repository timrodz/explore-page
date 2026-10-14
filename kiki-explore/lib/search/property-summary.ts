import { z } from "zod";
import { AREAS } from "@/lib/domain/area";

export const propertySummarySchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  area: z.enum(AREAS),
  pricePerNightPence: z.number().int().nonnegative(),
  imageUrl: z.url().nullable(),
});

export type PropertySummary = z.infer<typeof propertySummarySchema>;

export function parsePropertySummaries(rows: unknown): PropertySummary[] {
  return z.array(propertySummarySchema).parse(rows);
}
