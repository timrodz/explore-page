import { getDb } from "@/db/client";
import { hosts, properties, propertyListings } from "@/db/schema";
import type { Area } from "@/lib/domain/area";

type SeedProperty = {
  title: string;
  description: string;
  area: Area;
  pricePerNight: number;
  imageUrl: string | null;
  listings: { availableFrom: string; availableTo: string }[];
};

const seedByHost: { hostName: string; properties: SeedProperty[] }[] = [
  {
    hostName: "Host A",
    properties: [
      {
        title: "Shoreditch Loft",
        description: "Bright open-plan loft near Brick Lane.",
        area: "Shoreditch",
        pricePerNight: 18_500,
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        listings: [
          { availableFrom: "2026-06-01", availableTo: "2026-06-15" },
          { availableFrom: "2026-07-01", availableTo: "2026-07-20" },
        ],
      },
    ],
  },
  {
    hostName: "Host B",
    properties: [
      {
        title: "Camden Canal Flat",
        description: "Quiet flat overlooking Regent's Canal.",
        area: "Camden",
        pricePerNight: 12_000,
        imageUrl: null,
        listings: [{ availableFrom: "2026-05-15", availableTo: "2026-09-01" }],
      },
      {
        title: "Camden Market Studio",
        description: "Compact studio a short walk from the market.",
        area: "Camden",
        pricePerNight: 9_500,
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        listings: [
          { availableFrom: "2026-06-01", availableTo: "2026-06-10" },
          { availableFrom: "2026-06-20", availableTo: "2026-07-05" },
        ],
      },
    ],
  },
  {
    hostName: "Host C",
    properties: [
      {
        title: "Greenwich Park View",
        description: "Victorian terrace with park views.",
        area: "Greenwich",
        pricePerNight: 14_000,
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        listings: [{ availableFrom: "2026-04-01", availableTo: "2026-12-01" }],
      },
      {
        title: "Clapham Common Room",
        description: "Sunny double room near the common.",
        area: "Clapham",
        pricePerNight: 8_000,
        imageUrl: null,
        listings: [
          { availableFrom: "2026-06-01", availableTo: "2026-06-08" },
          { availableFrom: "2026-06-15", availableTo: "2026-06-30" },
        ],
      },
      {
        title: "Notting Hill Mews",
        description: "Colourful mews house off Portobello Road.",
        area: "Notting Hill",
        pricePerNight: 22_000,
        imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
        listings: [{ availableFrom: "2026-08-01", availableTo: "2026-08-20" }],
      },
      {
        title: "Canary Wharf Apartment",
        description: "Modern high-rise with river views.",
        area: "Canary Wharf",
        pricePerNight: 16_500,
        imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        listings: [
          { availableFrom: "2026-05-01", availableTo: "2026-05-20" },
          { availableFrom: "2026-06-10", availableTo: "2026-07-01" },
        ],
      },
    ],
  },
  {
    hostName: "Host D",
    properties: [
      {
        title: "Shoreditch Courtyard",
        description: "Ground-floor flat with private courtyard.",
        area: "Shoreditch",
        pricePerNight: 11_000,
        imageUrl: null,
        listings: [{ availableFrom: "2026-06-05", availableTo: "2026-06-25" }],
      },
      {
        title: "Greenwich Riverside",
        description: "Walk to the Cutty Sark in minutes.",
        area: "Greenwich",
        pricePerNight: 13_500,
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        listings: [{ availableFrom: "2026-07-01", availableTo: "2026-07-31" }],
      },
      {
        title: "Clapham South Flat",
        description: "Family-friendly flat near the Northern line.",
        area: "Clapham",
        pricePerNight: 10_500,
        imageUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
        listings: [
          { availableFrom: "2026-06-01", availableTo: "2026-06-04" },
          { availableFrom: "2026-06-10", availableTo: "2026-06-20" },
        ],
      },
      {
        title: "Notting Hill Garden Flat",
        description: "Garden access and period features.",
        area: "Notting Hill",
        pricePerNight: 24_000,
        imageUrl: null,
        listings: [{ availableFrom: "2026-09-01", availableTo: "2026-09-15" }],
      },
      {
        title: "Canary Wharf Studio",
        description: "Efficient studio for business stays.",
        area: "Canary Wharf",
        pricePerNight: 15_000,
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        listings: [{ availableFrom: "2026-06-01", availableTo: "2026-10-01" }],
      },
    ],
  },
];

async function main() {
  const db = getDb();

  await db.delete(propertyListings);
  await db.delete(properties);
  await db.delete(hosts);

  for (const group of seedByHost) {
    const [host] = await db
      .insert(hosts)
      .values({ name: group.hostName })
      .returning();

    for (const property of group.properties) {
      const [row] = await db
        .insert(properties)
        .values({
          hostId: host.id,
          title: property.title,
          description: property.description,
          area: property.area,
          pricePerNight: property.pricePerNight,
          imageUrl: property.imageUrl,
        })
        .returning();

      await db.insert(propertyListings).values(
        property.listings.map((listing) => ({
          propertyId: row.id,
          availableFrom: listing.availableFrom,
          availableTo: listing.availableTo,
        })),
      );
    }
  }

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
