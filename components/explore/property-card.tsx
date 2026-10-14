import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PropertySummary } from "@/lib/search/property-summary";

function formatNightlyPrice(pricePerNightPence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pricePerNightPence / 100);
}

export function PropertyCard({
  property,
  imageLoading = "lazy",
}: {
  property: PropertySummary;
  imageLoading?: "eager" | "lazy";
}) {
  return (
    <Card className="h-full pt-0 transition-colors hover:bg-muted/40">
      <Link
        href={`/properties/${property.id}`}
        className="flex h-full flex-col gap-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {property.imageUrl ? (
          <div className="relative aspect-[3/2] overflow-hidden rounded-t-xl bg-muted">
            <Image
              src={property.imageUrl}
              alt=""
              fill
              loading={imageLoading}
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-t-xl bg-muted text-muted-foreground">
            <ImageOff className="size-6" aria-hidden />
            <span className="text-sm">No image</span>
          </div>
        )}
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
          <CardDescription>{property.area}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <p>
            <span className="font-medium">
              {formatNightlyPrice(property.pricePerNightPence)}
            </span>{" "}
            <span className="text-muted-foreground">per night</span>
          </p>
          <p className="text-sm text-muted-foreground">
            from {property.start} to {property.end}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
