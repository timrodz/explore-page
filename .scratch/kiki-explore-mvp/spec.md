Status: ready-for-agent

# Kiki Explore MVP

## Problem Statement

Kiki is a property booking platform. For this MVP, guests need a way to discover London properties, narrow results by cost, stay dates, and neighbourhood, open a single property for more detail, and express intent to book—without real payments, accounts, or reservation storage. Today the app is a fresh Next.js scaffold with no domain data, database, or explore experience.

## Solution

Deliver a guest-facing **explore** flow backed by **PostgreSQL**: seeded **hosts** and **properties** (all in London), with **property listings** defining availability windows. Guests use filters on the explore page, browse matching **properties**, open a property detail page, and use a **Book** control that only shows a browser alert (`booked!`). Implementation proceeds in layers: schema and seed data, search/filter logic, then explore and detail pages.

## User Stories

1. As an anonymous guest, I want to open the explore page, so that I can start looking for a place to stay in London.
2. As a guest, I want to see a list of properties, so that I can compare options at a glance.
3. As a guest, I want each result to show a title, nightly price in GBP, and area, so that I can quickly judge fit.
4. As a guest, I want to see an image when a property has an `image_url`, so that results feel tangible.
5. As a guest, I want a sensible placeholder when a property has no image, so that the UI still looks complete.
6. As a guest, I want to filter by maximum nightly cost, so that I stay within budget.
7. As a guest, I want to filter by minimum nightly cost (if exposed in UI), so that I can narrow to a price band.
8. As a guest, I want to filter by area (Shoreditch, Camden, Greenwich, Clapham, Notting Hill, Canary Wharf), so that I can stay in a neighbourhood I prefer.
9. As a guest, I want an “any area” option, so that I am not forced to pick a neighbourhood.
10. As a guest, I want to filter by check-in and check-out dates, so that I only see properties available for my stay.
11. As a guest, I want date filtering to respect checkout as an exclusive end date, so that availability matches how stays are counted.
12. As a guest, I want a property to appear only if my entire stay fits inside one property listing window, so that I am not shown places that are only partly available.
13. As a guest, I want to combine cost, area, and date filters, so that I can refine search in one pass.
14. As a guest, I want to clear or change filters and see updated results, so that I can iterate on my search.
15. As a guest, I want to see an empty state when no properties match, so that I know the filters are too strict rather than the app being broken.
16. As a guest, I want to open a property detail page from a result, so that I can read the full description before deciding.
17. As a guest, I want the detail page to show title, description, price per night, area, optional image, and host name, so that I have enough context to choose.
18. As a guest, I want a Book button on the detail page, so that I can indicate I want the property.
19. As a guest, I want Book to show a browser alert saying `booked!`, so that I get immediate feedback without creating a real booking.
20. As a guest, I want every property to be located in London, UK, so that the product matches the London-only MVP scope.
21. As a developer, I want seed data for four hosts (A–D) with 1, 2, 4, and 5 properties respectively, so that list and filter behavior can be exercised realistically.
22. As a developer, I want each seeded property to have at least one property listing window (and some with several), so that date filtering is meaningful in dev and demos.
23. As a developer, I want seeded listing windows to be non-overlapping per property, so that test expectations stay simple even without a database overlap constraint.
24. As a developer, I want areas enforced at the database layer, so that invalid neighbourhood values cannot be inserted.
25. As a maintainer, I want migrations (or equivalent) for hosts, properties, and property listings, so that schema is reproducible.
26. As a maintainer, I want a single command or documented flow to apply schema and seed locally, so that onboarding is fast.
27. As a guest, I want filter choices to be reflected in the URL where practical, so that I can refresh or share a search (nice-to-have if low cost; otherwise defer).
28. As a guest, I want the explore UI to use the existing shadcn/Tailwind styling, so that the app feels cohesive with the starter design system.
29. As a guest, I should not need to sign in, so that the MVP stays browse-only.
30. As a guest, I should not see host dashboards or property management, so that scope stays guest-facing.

## Implementation Decisions

### Domain model (per glossary and ADR-0001)

- **Host**: UUID `id`, display `name` only (no auth profile).
- **Property**: UUID `id`, `host_id`, `title`, `description`, `area`, `price_per_night` (integer pence), optional nullable `image_url` (public URL only; no upload pipeline).
- **Property listing**: UUID `id`, `property_id`, `available_from` (inclusive date), `available_to` (exclusive date). Each row is an **available window**, not a reservation.
- **Stay filter semantics**: Guest supplies check-in `S` and check-out `E` (`E` exclusive). Property matches the date filter iff ∃ property listing with `available_from <= S` and `available_to >= E`. No stitching across multiple listings.
- **Area**: Text column with a **CHECK** constraint allowing only: Shoreditch, Camden, Greenwich, Clapham, Notting Hill, Canary Wharf.
- **Cost filter**: Compare guest min/max against `properties.price_per_night` (pence).
- **Location filter**: Equality on `area` when selected.
- **Availability**: Only on `property_listings`; no blocked-date columns on `properties`. No overlap constraint between listings in MVP.
- **Identifiers**: UUID primary keys on all three tables.
- **Property detail routing**: Opaque UUID in the path (e.g. `/properties/[id]`), not slugs.
- **Booking**: Client-side only; `alert('booked!')` (or equivalent); no booking table or API.

### Application stack

- **Next.js 16** App Router, React 19, TypeScript, existing shadcn/Base UI components.
- **PostgreSQL** as the system of record; choose a migration-friendly access layer (e.g. Drizzle or Prisma) consistent with Next server components / route handlers.
- **Explore page** as the primary entry (replace or redirect from the default home page as appropriate).
- **Data access** on the server for search and detail reads; no guest authentication.

### Seed content

- Four hosts named distinctly for demo (Host A–D or similar).
- Property counts per host: 1, 2, 4, 5 (12 properties total).
- Distribute the six areas across properties.
- Vary `price_per_night` across properties for cost filter demos.
- Mix of null and non-null `image_url` using stable public image URLs.
- Multiple property listing rows on some properties; windows disjoint per property in seed data.

### Search module contract (conceptual)

Expose one server-side operation used by the explore page, conceptually:

```
searchProperties({
  checkIn?: date,
  checkOut?: date,
  minPricePence?: number,
  maxPricePence?: number,
  area?: Area | null,
}) → PropertySummary[]
```

`PropertySummary` includes at least id, title, area, pricePerNightPence, imageUrl (nullable), and fields needed for list cards. Date filters omitted ⇒ do not filter by availability.

### Filter logic (unit-testable)

Extract **pure functions** (no I/O) that encode the business rules; the database layer calls these or mirrors the same rules in SQL. Minimum surface:

- `stayFitsListing(checkIn, checkOut, availableFrom, availableTo)` — exclusive checkout; window bounds inclusive start / exclusive end.
- `stayFitsAnyListing(checkIn, checkOut, listings[])` — true iff at least one listing fully contains the stay (no cross-listing stitch).
- `matchesPriceFilter(pricePerNightPence, min?, max?)` — inclusive bounds; omitted min/max means no bound on that side.
- `matchesAreaFilter(area, selectedArea?)` — true when no area selected or exact match.
- `propertyMatchesExploreFilters(property, listings, filters)` — composes the above for one property (good for table-driven unit tests).

Invalid or partial date input (e.g. check-out before check-in, only one of two dates set) should be handled explicitly in logic and covered by unit tests (reject or treat as “no date filter” — pick one behavior and test it).

### Pages and flows

- **Explore**: filter controls + result list; links to detail.
- **Property detail**: full fields + host name (join or denormalized read) + Book CTA.

## Testing Decisions

### What makes a good test here

- **Unit tests only** for MVP: fast, no database, no HTTP. Test inputs and outputs of pure filter logic.
- Assert **behavior** (match / no match), not implementation details (internal helper names, SQL shape).
- Cover **good paths** (stay inside window, price in band, area match, combined filters pass) and **bad paths** (stay too long, checkout on boundary wrong side, price outside band, wrong area, stay spans two listings but neither alone contains it, invalid date ranges).

### Primary seam (single highest seam)

**Pure explore filter logic** (`propertyMatchesExploreFilters` and the smaller functions it composes): table-driven unit tests with in-memory property + listing fixtures (plain objects/arrays, not ORM types required).

Example scenarios to include:

| Scenario | Expected |
| -------- | -------- |
| Stay exactly fills `[from, to)` | Match |
| Stay one night inside a longer window | Match |
| Check-out equals `available_to` | Match (exclusive end) |
| Check-out after `available_to` | No match |
| Check-in before `available_from` | No match |
| Two listings that together cover stay but neither alone does | No match |
| One of two listings fully contains stay | Match |
| Price below min / above max | No match |
| Area filter set and differs | No match |
| Area filter omitted | Match on area rule ignored |
| Only check-in or only check-out provided | Per chosen validation behavior |

### Out of scope for tests (MVP)

- Integration or end-to-end tests against PostgreSQL, migrations, or Next routes.
- Component or browser tests.

### Prior art

- None in the repo today. Add a minimal unit test runner (e.g. Vitest) and a `test` script; no test database setup required.

## Out of Scope

- Real bookings, payments, calendars, or inventory mutation when the guest clicks Book.
- User accounts, authentication, host onboarding, or host dashboards.
- Image uploads and blob storage (optional URL on property only).
- Amenities, bedrooms, guest counts, reviews, ratings, maps/geocoding (Leaflet in dependencies is not part of this spec unless explicitly added later).
- Cities other than London; geospatial search; free-text location search.
- Enforcing non-overlapping property listings in the database.
- Stitching a stay across multiple property listing rows.
- Per-listing pricing (price always from property).
- Email notifications, admin tools, analytics.
- Production deployment hardening beyond a documented local dev setup.
- Automated integration, E2E, and database-backed tests (manual QA via seed data is enough for persistence layer in MVP).

## Further Notes

- Vocabulary: use **Property**, **Host**, **Property listing**, **Area**, **Stay** per `GLOSSARY.md`; availability windows are documented in `docs/adr/0001-property-listings-for-availability.md`.
- Suggested implementation order: (1) pure filter logic + unit tests, (2) schema, migrations, seed, (3) server search wired to same rules, (4) explore and detail UI.
- Issue tracker config (`docs/agents/issue-tracker.md`) is not yet present in the repo; this spec is published under `.scratch/kiki-explore-mvp/spec.md` with `Status: ready-for-agent`. Run `/setup-matt-pocock-skills` to wire GitHub (or other) issue publishing for future specs.
