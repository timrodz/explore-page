import type { Area } from "@/lib/domain/area";
import { compareDateStrings, type DateString } from "@/lib/explore/dates";

export type PropertyListingWindow = {
  availableFrom: DateString;
  availableTo: DateString;
};

export type ExploreProperty = {
  area: Area;
  pricePerNightPence: number;
};

export type ExploreFilters = {
  checkIn?: DateString;
  checkOut?: DateString;
  minPricePence?: number;
  maxPricePence?: number;
  area?: Area | null;
};

/** Apply stay filtering only when both dates are present and check-out is after check-in. */
export function shouldApplyStayFilter(
  checkIn?: DateString,
  checkOut?: DateString,
): boolean {
  if (checkIn === undefined || checkOut === undefined) {
    return false;
  }
  return compareDateStrings(checkOut, checkIn) > 0;
}

/**
 * Stay [checkIn, checkOut) must fit inside listing [availableFrom, availableTo)
 * (inclusive start, exclusive end on both).
 */
export function stayFitsListing(
  checkIn: DateString,
  checkOut: DateString,
  availableFrom: DateString,
  availableTo: DateString,
): boolean {
  return (
    compareDateStrings(availableFrom, checkIn) <= 0 &&
    compareDateStrings(availableTo, checkOut) >= 0
  );
}

export function stayFitsAnyListing(
  checkIn: DateString,
  checkOut: DateString,
  listings: PropertyListingWindow[],
): boolean {
  return listings.some((listing) =>
    stayFitsListing(
      checkIn,
      checkOut,
      listing.availableFrom,
      listing.availableTo,
    ),
  );
}

export function matchesPriceFilter(
  pricePerNightPence: number,
  minPricePence?: number,
  maxPricePence?: number,
): boolean {
  if (minPricePence !== undefined && pricePerNightPence < minPricePence) {
    return false;
  }
  if (maxPricePence !== undefined && pricePerNightPence > maxPricePence) {
    return false;
  }
  return true;
}

export function matchesAreaFilter(
  area: Area,
  selectedArea?: Area | null,
): boolean {
  if (selectedArea === undefined || selectedArea === null) {
    return true;
  }
  return area === selectedArea;
}

export function propertyMatchesExploreFilters(
  property: ExploreProperty,
  listings: PropertyListingWindow[],
  filters: ExploreFilters,
): boolean {
  if (
    !matchesPriceFilter(
      property.pricePerNightPence,
      filters.minPricePence,
      filters.maxPricePence,
    )
  ) {
    return false;
  }

  if (!matchesAreaFilter(property.area, filters.area)) {
    return false;
  }

  if (shouldApplyStayFilter(filters.checkIn, filters.checkOut)) {
    return stayFitsAnyListing(
      filters.checkIn!,
      filters.checkOut!,
      listings,
    );
  }

  return true;
}
