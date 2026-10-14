# Availability as `property_listings` windows

Guests filter by a stay date range; each property can have multiple rows in `property_listings`, each defining an inclusive `available_from` and exclusive `available_to`. A property matches the date filter only if one row fully contains the stay. Price and descriptive fields stay on `properties`; we did not model blocked dates on the property row or a real booking table for the MVP.
