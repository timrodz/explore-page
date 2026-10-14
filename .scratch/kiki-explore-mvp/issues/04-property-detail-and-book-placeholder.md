# 04: Property detail view and Book placeholder

**What to build:** From explore (or direct navigation), a guest opens a single **property** by UUID: title, description, price per night, **area**, optional image, and **host** name. **Book** triggers a browser alert with `booked!` only—no booking API or persistence. Detail data is loaded on the server and mapped through **Zod** into app-layer types (aligned with the explore boundary from ticket 03). Missing or unknown property id shows a sensible not-found experience.

**Blocked by:** 01: PostgreSQL schema, migrations, and seed; 03: Explore page, search, and filters

**Status:** ready-for-agent

## Glossary

Use this vocabulary on the detail page and in types (`GLOSSARY.md` is canonical).

| Term | Meaning | Avoid |
|------|---------|--------|
| **Host** | Person who owns one or more **properties** on the platform; show the **host** name on the detail page | Owner, landlord, supplier |
| **Property** | Bookable place in London: title, description, nightly price, neighbourhood **area** | Listing, stay, rental, accommodation |
| **Property listing** | Date window when a **property** is available; a guest **stay** must fit entirely inside one window (detail page does not edit listings in MVP) | Availability block, calendar entry, reservation |
| **Area** | London neighbourhood label shown on the detail page | City, location (when meaning only “London”), postcode |
| **Stay** | Check-in/check-out filter concept (check-out exclusive); not shown as a “booking” on this page | Booking, trip, reservation |

The **Book** control is intentional MVP placeholder feedback only—it does not create a **stay** record or reservation.

- [ ] Detail route uses opaque property UUID; page shows full descriptive fields and host name from the database.
- [ ] Zod schemas validate detail payloads at the DB-to-app boundary (reuse or extend list schemas as appropriate).
- [ ] Book control shows `booked!` via browser alert; no auth required.
- [ ] Not-found handling for invalid ids without breaking the rest of the app.
