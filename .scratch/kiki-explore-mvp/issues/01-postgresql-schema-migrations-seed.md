# 01: PostgreSQL schema, migrations, and seed

**What to build:** A reproducible local database for the explore MVP: **hosts**, **properties**, and **property listings** with UUID keys, area CHECK constraint for the six London neighbourhoods, integer pence pricing, and optional `image_url`. Running the documented flow applies schema and loads seed data—four **hosts** (A–D) with 1, 2, 4, and 5 **properties** (12 total), varied prices and areas, mix of null and public image URLs, and **property listing** windows that are disjoint per property (some properties with multiple windows). No app UI or search yet; a developer can verify rows exist in PostgreSQL.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

## Glossary

Use this vocabulary in schema names, seed copy, and docs (`GLOSSARY.md` is canonical).

| Term | Meaning | Avoid |
|------|---------|--------|
| **Host** | Person who owns one or more **properties** on the platform | Owner, landlord, supplier |
| **Property** | Bookable place in London: title, description, nightly price, neighbourhood **area** | Listing, stay, rental, accommodation |
| **Property listing** | Date window when a **property** is available; a guest **stay** must fit entirely inside one window | Availability block, calendar entry, reservation |
| **Area** | London neighbourhood filter label: Shoreditch, Camden, Greenwich, Clapham, Notting Hill, or Canary Wharf | City, location (when meaning only “London”), postcode |
| **Stay** | Guest check-in and check-out used to filter (check-out day is exclusive) | Booking, trip, reservation |

- [ ] Tables `hosts`, `properties`, and `property_listings` match the spec (FKs, inclusive `available_from`, exclusive `available_to`, area CHECK).
- [ ] Migrations (or equivalent) are versioned and apply cleanly on a fresh database.
- [ ] Seed inserts all hosts, properties, and at least one listing per property with realistic windows for date-filter demos later.
- [ ] Documented single flow (command or short steps) to create DB, migrate, and seed locally.
