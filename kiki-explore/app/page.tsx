import { Suspense } from "react";
import { connection } from "next/server";
import { ExploreBrowser } from "@/components/explore/explore-browser";
import { searchProperties } from "@/lib/search/search-properties";

export const metadata = {
  title: "Explore · Kiki",
  description: "Find a property in London.",
};

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Explore</h1>
        <p className="text-muted-foreground">Find a property in London.</p>
      </header>
      <Suspense
        fallback={
          <p className="text-muted-foreground">Loading properties…</p>
        }
      >
        <ExploreResults />
      </Suspense>
    </main>
  );
}

async function ExploreResults() {
  await connection();
  const properties = await searchProperties({});
  return <ExploreBrowser initialProperties={properties} />;
}
