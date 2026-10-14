# Local database

PostgreSQL holds **hosts**, **properties**, and **property listings** (availability windows per [ADR-0001](./adr/0001-property-listings-for-availability.md)).

## Setup

1. Create a database (example):

   ```bash
   createdb kiki_explore
   ```

2. Set `DATABASE_URL`:

   ```bash
   export DATABASE_URL=postgresql://localhost:5432/kiki_explore
   ```

3. Apply migrations and seed:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

Availability for explore search is read only from `property_listings` (`available_from` inclusive, `available_to` exclusive). A stay matches when one row fully contains the guest check-in and check-out dates.
