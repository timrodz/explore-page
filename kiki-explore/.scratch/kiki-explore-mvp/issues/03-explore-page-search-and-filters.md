# 03: Explore page, search, and filters

**What to build:** Guest-facing **explore** as the main entry: filter controls (max nightly cost, min nightly cost if shown in UI, **area** including “any”, check-in and check-out for a **stay**), server-side search over seeded **properties**, and a result list with title, nightly price in GBP, **area**, and image or placeholder. Results respect the same rules as ticket 02. Empty state when nothing matches; changing filters updates the list. Data read from PostgreSQL is parsed through **Zod** schemas into app-layer types before rendering (invalid rows fail at the boundary, not in components). No URL query parameters for filters in this MVP.

**Blocked by:** 01: PostgreSQL schema, migrations, and seed; 02: Pure explore filter logic and unit tests

**Status:** ready-for-agent

## Glossary

Use this vocabulary in UI copy, types, and Zod schema names (`GLOSSARY.md` is canonical).

| Term | Meaning | Avoid |
|------|---------|--------|
| **Host** | Person who owns one or more **properties** on the platform | Owner, landlord, supplier |
| **Property** | Bookable place in London: title, description, nightly price, neighbourhood **area** | Listing, stay, rental, accommodation |
| **Property listing** | Date window when a **property** is available; a guest **stay** must fit entirely inside one window | Availability block, calendar entry, reservation |
| **Area** | London neighbourhood filter label: Shoreditch, Camden, Greenwich, Clapham, Notting Hill, or Canary Wharf | City, location (when meaning only “London”), postcode |
| **Stay** | Guest check-in and check-out used to filter (check-out day is exclusive) | Booking, trip, reservation |

Guests search **properties** (not “listings”); availability comes from **property listing** rows on the server. The explore UI collects a **stay** and optional **area** and price band.

- [ ] Server search accepts optional cost, **area**, and **stay** inputs and returns summaries for matching **properties** (omitted date pair ⇒ no availability filter).
- [ ] Zod validates and maps database shapes to app-layer list/summary types used by the explore page.
- [ ] Explore UI uses existing shadcn/Tailwind patterns; cards link to the property detail route by UUID.
- [ ] Combined filters, empty state, and image placeholder behavior match the spec user stories for browse and filter.
