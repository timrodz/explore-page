"use server";

import { parseExploreForm } from "@/lib/search/explore-form";
import { searchProperties } from "@/lib/search/search-properties";
import type { PropertySummary } from "@/lib/search/property-summary";

export type ExploreSearchState = {
  properties: PropertySummary[];
  error: string | null;
};

export async function searchExploreProperties(
  previous: ExploreSearchState,
  formData: FormData,
): Promise<ExploreSearchState> {
  const parsed = parseExploreForm(formData);
  if (!parsed.ok) {
    return { properties: previous.properties, error: parsed.error };
  }

  const properties = await searchProperties(parsed.input);
  return { properties, error: null };
}
