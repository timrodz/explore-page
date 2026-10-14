import { and, eq, exists, gte, lte, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { properties, propertyListings } from "@/db/schema";
import type { Area } from "@/lib/domain/area";
import type { DateString } from "@/lib/explore/dates";
import { shouldApplyStayFilter } from "@/lib/explore/filters";
import {
  parsePropertySummaries,
  type PropertySummary,
} from "@/lib/search/property-summary";

export type { PropertySummary };

export type SearchPropertiesInput = {
  checkIn?: DateString;
  checkOut?: DateString;
  minPricePence?: number;
  maxPricePence?: number;
  area?: Area | null;
};

export async function searchProperties(
  input: SearchPropertiesInput,
): Promise<PropertySummary[]> {
  const db = getDb();
  const conditions = [];

  if (input.minPricePence !== undefined) {
    conditions.push(gte(properties.pricePerNight, input.minPricePence));
  }
  if (input.maxPricePence !== undefined) {
    conditions.push(lte(properties.pricePerNight, input.maxPricePence));
  }
  if (input.area) {
    conditions.push(eq(properties.area, input.area));
  }

  if (shouldApplyStayFilter(input.checkIn, input.checkOut)) {
    const checkIn = input.checkIn!;
    const checkOut = input.checkOut!;
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(propertyListings)
          .where(
            and(
              eq(propertyListings.propertyId, properties.id),
              lte(propertyListings.availableFrom, checkIn),
              gte(propertyListings.availableTo, checkOut),
            ),
          ),
      ),
    );
  }

  const rows = await db
    .select({
      id: properties.id,
      title: properties.title,
      area: properties.area,
      pricePerNightPence: properties.pricePerNight,
      imageUrl: properties.imageUrl,
    })
    .from(properties)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(properties.title);

  return parsePropertySummaries(rows);
}
