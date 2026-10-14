import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/book-button";
import { buttonVariants } from "@/components/ui/button";
import { getProperty } from "@/lib/properties/get-property";

function formatNightlyPrice(pricePerNightPence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pricePerNightPence / 100);
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      {property.imageUrl ? (
        // Remote seed images are not configured for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={property.imageUrl}
          alt=""
          className="h-64 w-full rounded-lg object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{property.title}</h1>
        <p className="text-zinc-600">{property.area}</p>
        <p className="text-lg">{formatNightlyPrice(property.pricePerNightPence)} per night</p>
        <p>Host: {property.hostName}</p>
      </div>
      <p className="leading-7">{property.description}</p>
      <div className="flex flex-col gap-3">
        <BookButton />
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back to explore
        </Link>
      </div>
    </main>
  );
}
