import { z } from "zod";
import { AREAS } from "@/lib/domain/area";
import type { SearchPropertiesInput } from "@/lib/search/search-properties";

const AREA_FILTERS = ["any", ...AREAS] as const;

const poundsField = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") {
      return true;
    }
    const pounds = Number(value);
    return Number.isFinite(pounds) && pounds >= 0;
  }, "Enter a nightly cost in pounds.")
  .transform((value) =>
    value === "" ? undefined : Math.round(Number(value) * 100),
  );

const dateField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Enter a stay date.",
  )
  .transform((value) => (value === "" ? undefined : value));

const exploreFormSchema = z.object({
  minPricePounds: poundsField,
  maxPricePounds: poundsField,
  area: z.enum(AREA_FILTERS),
  checkIn: dateField,
  checkOut: dateField,
});

export type ExploreFormResult =
  | { ok: true; input: SearchPropertiesInput }
  | { ok: false; error: string };

export function parseExploreForm(formData: FormData): ExploreFormResult {
  const parsed = exploreFormSchema.safeParse({
    minPricePounds: String(formData.get("minPricePounds") ?? ""),
    maxPricePounds: String(formData.get("maxPricePounds") ?? ""),
    area: String(formData.get("area") ?? "any"),
    checkIn: String(formData.get("checkIn") ?? ""),
    checkOut: String(formData.get("checkOut") ?? ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the nightly cost and stay dates.",
    };
  }

  return {
    ok: true,
    input: {
      minPricePence: parsed.data.minPricePounds,
      maxPricePence: parsed.data.maxPricePounds,
      area: parsed.data.area === "any" ? null : parsed.data.area,
      checkIn: parsed.data.checkIn,
      checkOut: parsed.data.checkOut,
    },
  };
}
