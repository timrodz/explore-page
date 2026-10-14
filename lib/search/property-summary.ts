import { z } from "zod";
import { AREAS } from "@/lib/domain/area";

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const propertySummarySchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  area: z.enum(AREAS),
  pricePerNightPence: z.number().int().nonnegative(),
  imageUrl: z.url().nullable(),
  start: dateStringSchema,
  end: dateStringSchema,
});

export type PropertySummary = z.infer<typeof propertySummarySchema>;

export function parsePropertySummaries(rows: unknown): PropertySummary[] {
  return z.array(propertySummarySchema).parse(rows);
}
