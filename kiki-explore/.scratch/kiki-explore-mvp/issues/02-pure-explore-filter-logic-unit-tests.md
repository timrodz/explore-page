# 02: Pure explore filter logic and unit tests

**What to build:** Pure functions encoding **stay**, cost, and **area** filter rules (per glossary and ADR-0001): exclusive checkout, a **stay** must fit entirely inside one **property listing** window (no stitching), inclusive price bounds with omitted min/max meaning unbounded, and **area** equality when selected. A fast unit test suite (no database, no HTTP) with table-driven good and bad scenarios from the spec. Documented behavior when dates are partial or invalid: apply a **stay** date filter only when both check-in and check-out are present and check-out is after check-in; otherwise do not filter by availability.

**Blocked by:** 01: PostgreSQL schema, migrations, and seed

**Status:** ready-for-agent

## Glossary

Use this vocabulary in function names, test descriptions, and fixtures (`GLOSSARY.md` is canonical).

| Term | Meaning | Avoid |
|------|---------|--------|
| **Host** | Person who owns one or more **properties** on the platform | Owner, landlord, supplier |
| **Property** | Bookable place in London: title, description, nightly price, neighbourhood **area** | Listing, stay, rental, accommodation |
| **Property listing** | Date window when a **property** is available; a guest **stay** must fit entirely inside one window | Availability block, calendar entry, reservation |
| **Area** | London neighbourhood filter label: Shoreditch, Camden, Greenwich, Clapham, Notting Hill, or Canary Wharf | City, location (when meaning only “London”), postcode |
| **Stay** | Guest check-in and check-out used to filter (check-out day is exclusive) | Booking, trip, reservation |

Filter logic operates on in-memory **property** rows plus their **property listing** windows; **stay** dates drive availability, **area** and nightly price drive location and cost filters.

- [ ] `npm test` (or equivalent) runs unit tests only, with no test database.
- [ ] Stay scenarios pass: exact window fit, one night inside longer window, checkout on `available_to` (match), checkout after window, check-in before window, two listings that together cover but neither alone contains, one of two listings contains.
- [ ] Price and area scenarios pass, including combined filters on a single in-memory **property** + listings fixture.
- [ ] Partial or invalid date inputs follow the documented rule above and are covered by tests.
