import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ComboBox, ComboBoxOption } from "@/components/ui/combobox";
import { searchEmployees } from "../api/search-employee";
import { Employee } from "@/types/api";

type SearchEmployeeComboBoxProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  defaultValue?: string; /* Use Employee Code */
};

export const SearchEmployeeComboBox = ({
  value,
  onChange,
  placeholder = "Select employee...",
  defaultValue
}: SearchEmployeeComboBoxProps) => {
  const [query, setQuery] = React.useState("");
  const { data: employees = [], isPending, isError } = useQuery<Employee[]>(
    {
      queryKey: ["search-employees", query],
      queryFn: () => searchEmployees(query),
      enabled: query.trim().length > 0, 
    }
  );

  React.useEffect(() => {
    if(defaultValue) setQuery(defaultValue);
  },[ defaultValue])

  const options: ComboBoxOption[] = employees.map((employee: Employee) => ({
    value: employee.id,
    label: `${employee.name}${
      employee.jobPosition ? ` [${employee.jobGrade? `${employee.jobGrade.name}` : ''} ${employee.jobPosition.name + (employee.jobPosition.department ? `- ${employee.jobPosition.department.name}` : '')}]` : ""
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

SearchEmployeeComboBox.displayName = "SearchEmployeeComboBox";
