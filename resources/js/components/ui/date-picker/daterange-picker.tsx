import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (date: DateRange) => void;
  label?: string;
  disabledDate?: (date: Date) => boolean;
  numberOfMonths: number
}

export function DateRangePicker({
  value,
  onChange,
  label,
  disabledDate,
  numberOfMonths = 2
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col">
      {label && <label>{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="pl-3 text-left font-normal"
          >
            {value?.from && value?.to ? (
              <>
                {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            disabled={disabledDate}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
