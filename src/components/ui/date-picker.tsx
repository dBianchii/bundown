"use client";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { format } from "date-fns"


export function DatePicker({
  date,
  setDate,
  disabledDate,
  disabledPopover,
  onDayClick,
  className,
  size,
  id,
}: {
  id?: string;
  date?: Date | undefined;
  setDate?: (newDate: Date | undefined) => void;
  disabledDate?: (date: Date) => boolean;
  disabledPopover?: boolean;
  onDayClick?: (date: Date | undefined) => void;
  className?: string;
  size?: "default" | "sm";
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
          disabled={disabledPopover}
          size={size}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDate}
          onDayClick={onDayClick}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
