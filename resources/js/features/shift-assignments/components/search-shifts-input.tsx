import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ComboBox, ComboBoxOption } from "@/components/ui/combobox";
import { searchShifts } from "../api/search-shifts";
import { Shift } from "@/types/api";
import { formatDateTime, formatTime } from "@/lib/datetime";

type SearchShiftComboBoxProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  defaultValue?: string; /* Use Shift Code */
};

export const SearchShiftComboBox = ({
  value,
  onChange,
  placeholder = "Select shift...",
  defaultValue
}: SearchShiftComboBoxProps) => {
  const [query, setQuery] = React.useState("");
  const { data: shifts = [], isPending, isError } = useQuery<Shift[]>(
    {
      queryKey: ["search-shifts", query],
      queryFn: () => searchShifts(query),
      enabled: query.trim().length > 0, 
    }
  );

  React.useEffect(() => {
    if(defaultValue) setQuery(defaultValue);
  },[ defaultValue])

  const options: ComboBoxOption[] = shifts.map((shift: Shift) => ({
    value: shift.id,
    label: `${shift.name}${
      shift ? ` [${shift.start? `${formatTime(shift.start)}` : ''} ${shift.end ? formatTime(shift.end) : ""} ${shift.isFlexible? "Flexble" : ""}]` : ""
    }`,
  }));

  const handleSelect = (selectedOption: { value: string; label: string } | null) => {
    if (onChange) {
      onChange(selectedOption?.value || null);
    }
  };

  return (
    <ComboBox
      inputValue={query}
      onInputChange={(value) => setQuery(value)}
      isLoading={isPending}
      label={placeholder}
      options={options}
      selectedOption={options.find((o) => o.value === value) || null}
      onSelect={handleSelect}
      isError={isError}
    />
  );
};

SearchShiftComboBox.displayName = "SearchShiftComboBox";
