export function formatNightlyPrice(pricePerNightPence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pricePerNightPence / 100);
}
