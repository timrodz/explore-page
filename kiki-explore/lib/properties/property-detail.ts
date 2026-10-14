import { z } from "zod";
import { AREAS, type Area } from "@/lib/domain/area";

export const propertyDetailSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  area: z.enum(AREAS),
  pricePerNightPence: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  hostName: z.string().min(1),
});

export type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  area: Area;
  pricePerNightPence: number;
  imageUrl: string | null;
  hostName: string;
};

export function parsePropertyDetail(row: unknown): PropertyDetail {
  return propertyDetailSchema.parse(row);
}
