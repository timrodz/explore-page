const nightlyPriceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatNightlyPrice(pricePerNightPence: number): string {
  return nightlyPriceFormatter.format(pricePerNightPence / 100);
}
