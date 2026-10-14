"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function dateStringToLocalDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function localDateToDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

type DatePickerProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Inclusive lower bound for selectable dates. */
  fromDate?: Date;
  /** Inclusive upper bound for selectable dates. */
  toDate?: Date;
};

function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = dateStringToLocalDate(value);

  function isDateDisabled(date: Date) {
    if (fromDate !== undefined) {
      const start = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
      );
      if (date < start) {
        return true;
      }
    }
    if (toDate !== undefined) {
      const end = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
      );
      if (date > end) {
        return true;
      }
    }
    return false;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {name ? (
        <input type="hidden" name={name} value={value} readOnly />
      ) : null}
      <PopoverTrigger
        id={id}
        disabled={disabled}
        render={
          <Button
            variant="outline"
            className={cn(
              "h-8 w-full justify-start gap-1.5 px-2.5 text-left font-normal",
              !selected && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0" />
        {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? localDateToDateString(date) : "");
            setOpen(false);
          }}
          disabled={isDateDisabled}
          defaultMonth={selected}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, dateStringToLocalDate, localDateToDateString };
