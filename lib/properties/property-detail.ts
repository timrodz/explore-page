import { z } from "zod";
import { AREAS, type Area } from "@/lib/domain/area";

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const propertyDetailSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  area: z.enum(AREAS),
  pricePerNightPence: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  hostName: z.string().min(1),
  start: dateStringSchema,
  end: dateStringSchema,
});

export type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  area: Area;
  pricePerNightPence: number;
  imageUrl: string | null;
  hostName: string;
  start: string;
  end: string;
};

export function parsePropertyDetail(row: unknown): PropertyDetail {
  return propertyDetailSchema.parse(row);
}
