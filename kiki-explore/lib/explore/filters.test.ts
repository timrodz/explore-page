import { describe, expect, it } from "vitest";
import {
  matchesAreaFilter,
  matchesPriceFilter,
  propertyMatchesExploreFilters,
  shouldApplyStayFilter,
  stayFitsAnyListing,
  stayFitsListing,
  type ExploreFilters,
  type PropertyListingWindow,
} from "@/lib/explore/filters";

const property = { area: "Camden" as const, pricePerNightPence: 10_000 };

describe("stayFitsListing", () => {
  it.each([
    {
      name: "stay exactly fills the listing window",
      checkIn: "2026-06-01",
      checkOut: "2026-06-05",
      from: "2026-06-01",
      to: "2026-06-05",
      expected: true,
    },
    {
      name: "one-night stay inside a longer window",
      checkIn: "2026-06-02",
      checkOut: "2026-06-03",
      from: "2026-06-01",
      to: "2026-06-10",
      expected: true,
    },
    {
      name: "check-out equals available_to (exclusive end)",
      checkIn: "2026-06-01",
      checkOut: "2026-06-05",
      from: "2026-06-01",
      to: "2026-06-05",
      expected: true,
    },
    {
      name: "check-out after available_to",
      checkIn: "2026-06-01",
      checkOut: "2026-06-06",
      from: "2026-06-01",
      to: "2026-06-05",
      expected: false,
    },
    {
      name: "check-in before available_from",
      checkIn: "2026-05-31",
      checkOut: "2026-06-02",
      from: "2026-06-01",
      to: "2026-06-10",
      expected: false,
    },
  ] as const)(
    "$name",
    ({ checkIn, checkOut, from, to, expected }) => {
      expect(stayFitsListing(checkIn, checkOut, from, to)).toBe(expected);
    },
  );
});

describe("stayFitsAnyListing", () => {
  it.each([
    {
      name: "does not stitch across two listings that together cover the stay",
      listings: [
        { availableFrom: "2026-06-01", availableTo: "2026-06-04" },
        { availableFrom: "2026-06-04", availableTo: "2026-06-08" },
      ],
      checkIn: "2026-06-01",
      checkOut: "2026-06-07",
      expected: false,
    },
    {
      name: "matches when one of two listings fully contains the stay",
      listings: [
        { availableFrom: "2026-06-01", availableTo: "2026-06-04" },
        { availableFrom: "2026-06-04", availableTo: "2026-06-15" },
      ],
      checkIn: "2026-06-05",
      checkOut: "2026-06-08",
      expected: true,
    },
  ])("$name", ({ listings, checkIn, checkOut, expected }) => {
    expect(
      stayFitsAnyListing(checkIn, checkOut, [...listings]),
    ).toBe(expected);
  });
});

describe("shouldApplyStayFilter", () => {
  it.each([
    { checkIn: "2026-06-01", checkOut: undefined, expected: false },
    { checkIn: undefined, checkOut: "2026-06-05", expected: false },
    { checkIn: "2026-06-05", checkOut: "2026-06-05", expected: false },
    { checkIn: "2026-06-05", checkOut: "2026-06-04", expected: false },
    { checkIn: "2026-06-01", checkOut: "2026-06-05", expected: true },
  ] as const)(
    "checkIn=$checkIn checkOut=$checkOut → $expected",
    ({ checkIn, checkOut, expected }) => {
      expect(shouldApplyStayFilter(checkIn, checkOut)).toBe(expected);
    },
  );
});

describe("matchesPriceFilter", () => {
  it.each([
    { price: 10_000, min: 5_000, max: 15_000, expected: true },
    { price: 10_000, min: 10_000, max: undefined, expected: true },
    { price: 10_000, min: undefined, max: 10_000, expected: true },
    { price: 9_000, min: 10_000, max: undefined, expected: false },
    { price: 11_000, min: undefined, max: 10_000, expected: false },
    { price: 10_000, min: undefined, max: undefined, expected: true },
  ] as const)(
    "price=$price min=$min max=$max → $expected",
    ({ price, min, max, expected }) => {
      expect(matchesPriceFilter(price, min, max)).toBe(expected);
    },
  );
});

describe("matchesAreaFilter", () => {
  it.each([
    { area: "Camden" as const, selected: undefined, expected: true },
    { area: "Camden" as const, selected: null, expected: true },
    { area: "Camden" as const, selected: "Camden" as const, expected: true },
    { area: "Camden" as const, selected: "Shoreditch" as const, expected: false },
  ] as const)(
    "area=$area selected=$selected → $expected",
    ({ area, selected, expected }) => {
      expect(matchesAreaFilter(area, selected)).toBe(expected);
    },
  );
});

describe("propertyMatchesExploreFilters", () => {
  const listings: PropertyListingWindow[] = [
    { availableFrom: "2026-06-01", availableTo: "2026-06-10" },
  ];

  it.each([
    {
      name: "ignores availability when only check-in is set",
      filters: { checkIn: "2026-12-01" },
      expected: true,
    },
    {
      name: "ignores availability when only check-out is set",
      filters: { checkOut: "2026-12-05" },
      expected: true,
    },
    {
      name: "ignores availability when check-out is not after check-in",
      filters: { checkIn: "2026-06-05", checkOut: "2026-06-05" },
      expected: true,
    },
    {
      name: "combined price, area, and stay pass",
      filters: {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        minPricePence: 5_000,
        maxPricePence: 15_000,
        area: "Camden",
      },
      expected: true,
    },
    {
      name: "wrong area fails",
      filters: {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        area: "Shoreditch",
      },
      expected: false,
    },
    {
      name: "price above max fails",
      filters: {
        checkIn: "2026-06-02",
        checkOut: "2026-06-03",
        maxPricePence: 9_000,
      },
      expected: false,
    },
    {
      name: "stay outside listing window fails",
      filters: {
        checkIn: "2026-06-09",
        checkOut: "2026-06-12",
      },
      expected: false,
    },
  ] as const)("$name", ({ filters, expected }) => {
    expect(
      propertyMatchesExploreFilters(property, listings, filters as ExploreFilters),
    ).toBe(expected);
  });
});
