"use client";

import { Button } from "@/components/ui/button";

export function BookButton() {
  return (
    <Button type="button" size="lg" onClick={() => alert("booked!")}>
      Book
    </Button>
  );
}
