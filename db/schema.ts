import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

const areaCheck = check(
  "properties_area_check",
  sql`"area" IN ('Shoreditch', 'Camden', 'Greenwich', 'Clapham', 'Notting Hill', 'Canary Wharf')`,
);

export const hosts = pgTable("hosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostId: uuid("host_id")
      .notNull()
      .references(() => hosts.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    area: text("area").notNull(),
    pricePerNight: integer("price_per_night").notNull(),
    imageUrl: text("image_url"),
  },
  (table) => [areaCheck],
);

export const propertyListings = pgTable("property_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  availableFrom: date("available_from").notNull(),
  availableTo: date("available_to").notNull(),
});
