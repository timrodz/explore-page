import { describe, expect, it } from "vitest";
import {
  propertyMatchesExploreFilters,
  shouldApplyStayFilter,
  stayFitsAnyListing,
  stayFitsListing,
} from "@/lib/explore/filters";

const property = { area: "Camden" as const, pricePerNightPence: 10_000 };

describe("stayFitsListing", () => {
  it("matches when stay exactly fills the listing window", () => {
    expect(stayFitsListing("2026-06-01", "2026-06-05", "2026-06-01", "2026-06-05")).toBe(
      true,
    );
  });

  it("matches a one-night stay inside a longer window", () => {
    expect(stayFitsListing("2026-06-02", "2026-06-03", "2026-06-01", "2026-06-10")).toBe(
      true,
    );
  });

  it("does not match when check-out is after available_to", () => {
    expect(stayFitsListing("2026-06-01", "2026-06-06", "2026-06-01", "2026-06-05")).toBe(
      false,
    );
  });

  it("does not match when check-in is before available_from", () => {
    expect(stayFitsListing("2026-05-31", "2026-06-02", "2026-06-01", "2026-06-10")).toBe(
      false,
    );
  });
});

describe("stayFitsAnyListing", () => {
  it("does not stitch across two listings that together cover the stay", () => {
    const listings = [
      { availableFrom: "2026-06-01", availableTo: "2026-06-04" },
      { availableFrom: "2026-06-04", availableTo: "2026-06-08" },
    ];
    expect(stayFitsAnyListing("2026-06-01", "2026-06-07", listings)).toBe(false);
  });

  it("matches when one of two listings fully contains the stay", () => {
    const listings = [
      { availableFrom: "2026-06-01", availableTo: "2026-06-04" },
      { availableFrom: "2026-06-04", availableTo: "2026-06-15" },
    ];
    expect(stayFitsAnyListing("2026-06-05", "2026-06-08", listings)).toBe(true);
  });
});

describe("shouldApplyStayFilter", () => {
  it("is false when only check-in is provided", () => {
    expect(shouldApplyStayFilter("2026-06-01", undefined)).toBe(false);
  });

  it("is false when check-out is not after check-in", () => {
    expect(shouldApplyStayFilter("2026-06-05", "2026-06-05")).toBe(false);
    expect(shouldApplyStayFilter("2026-06-05", "2026-06-04")).toBe(false);
  });

  it("is true for a valid stay range", () => {
    expect(shouldApplyStayFilter("2026-06-01", "2026-06-05")).toBe(true);
  });
});

describe("propertyMatchesExploreFilters", () => {
  const listings = [{ availableFrom: "2026-06-01", availableTo: "2026-06-10" }];

  it("ignores availability when dates are partial", () => {
    expect(
      propertyMatchesExploreFilters(property, listings, {
        checkIn: "2026-12-01",
      }),
    ).toBe(true);
  });

  it("filters by price and area together with stay", () => {
    expect(
      propertyMatchesExploreFilters(property, listings, {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        minPricePence: 5_000,
        maxPricePence: 15_000,
        area: "Camden",
      }),
    ).toBe(true);

    expect(
      propertyMatchesExploreFilters(property, listings, {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        area: "Shoreditch",
      }),
    ).toBe(false);

    expect(
      propertyMatchesExploreFilters(property, listings, {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        maxPricePence: 9_000,
      }),
    ).toBe(false);
  });
});
