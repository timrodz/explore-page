import { eq, max, min } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { hosts, properties, propertyListings } from "@/db/schema";
import { parsePropertyDetail, type PropertyDetail } from "@/lib/properties/property-detail";

export async function getProperty(id: string): Promise<PropertyDetail | null> {
  if (!z.string().uuid().safeParse(id).success) {
    return null;
  }

  const db = getDb();
  const [row] = await db
    .select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      area: properties.area,
      pricePerNightPence: properties.pricePerNight,
      imageUrl: properties.imageUrl,
      hostName: hosts.name,
      start: min(propertyListings.availableFrom),
      end: max(propertyListings.availableTo),
    })
    .from(properties)
    .innerJoin(hosts, eq(properties.hostId, hosts.id))
    .innerJoin(propertyListings, eq(propertyListings.propertyId, properties.id))
    .where(eq(properties.id, id))
    .groupBy(
      properties.id,
      properties.title,
      properties.description,
      properties.area,
      properties.pricePerNight,
      properties.imageUrl,
      hosts.name,
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return parsePropertyDetail(row);
}
