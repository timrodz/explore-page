"use client";

import { useState, useTransition } from "react";
import { useActionState } from "react";
import { searchExploreProperties } from "@/app/actions/search-properties";
import { PropertyCard } from "@/components/explore/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AREAS } from "@/lib/domain/area";
import type { PropertySummary } from "@/lib/search/property-summary";

const areaItems = [
  { value: "any", label: "Any area" },
  ...AREAS.map((area) => ({ value: area, label: area })),
];

export function ExploreBrowser({
  initialProperties,
}: {
  initialProperties: PropertySummary[];
}) {
  const [state, formAction, isPending] = useActionState(
    searchExploreProperties,
    { properties: initialProperties, error: null },
  );
  const [isClearing, startClear] = useTransition();
  const pending = isPending || isClearing;

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [area, setArea] = useState("any");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setArea("any");
    setCheckIn("");
    setCheckOut("");

    const formData = new FormData();
    formData.set("area", "any");
    startClear(() => {
      formAction(formData);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="minPricePounds">Minimum nightly cost (GBP)</Label>
            <Input
              id="minPricePounds"
              name="minPricePounds"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Any"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="maxPricePounds">Maximum nightly cost (GBP)</Label>
            <Input
              id="maxPricePounds"
              name="maxPricePounds"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Any"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="area">Area</Label>
            <Select
              name="area"
              value={area}
              items={areaItems}
              onValueChange={(value) => setArea(value ?? "any")}
            >
              <SelectTrigger id="area" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {areaItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkIn">Check-in</Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkOut">Check-out</Label>
            <Input
              id="checkOut"
              name="checkOut"
              type="date"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Searching…" : "Search"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
        {state.error ? (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
      </form>

      {state.properties.length === 0 ? (
        <p className="text-muted-foreground">
          No properties match these filters. Try a wider nightly cost, any
          area, or different stay dates.
        </p>
      ) : (
        <ul
          aria-busy={pending}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {state.properties.map((property) => (
            <li key={property.id}>
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
