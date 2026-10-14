import { describe, expect, it } from "vitest";
import { parsePropertyDetail } from "@/lib/properties/property-detail";

const validRow = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Shoreditch Loft",
  description: "Bright open-plan loft near Brick Lane.",
  area: "Shoreditch",
  pricePerNightPence: 18_500,
  imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  hostName: "Host A",
  start: "2026-06-01",
  end: "2026-07-20",
};

describe("parsePropertyDetail", () => {
  it("maps a database row into a property detail with host name", () => {
    expect(parsePropertyDetail(validRow)).toEqual({
      id: "11111111-1111-4111-8111-111111111111",
      title: "Shoreditch Loft",
      description: "Bright open-plan loft near Brick Lane.",
      area: "Shoreditch",
      pricePerNightPence: 18_500,
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      hostName: "Host A",
      start: "2026-06-01",
      end: "2026-07-20",
    });
  });

  it("allows a property with no image", () => {
    expect(parsePropertyDetail({ ...validRow, imageUrl: null }).imageUrl).toBeNull();
  });

  it("rejects an area that is not a London neighbourhood", () => {
    expect(() => parsePropertyDetail({ ...validRow, area: "Paris" })).toThrow();
  });
});
