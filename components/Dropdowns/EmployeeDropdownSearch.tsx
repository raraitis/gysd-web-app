import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import {
  EmployeeData,
  EmployeeResponseType,
  EmployeesResponseData,
} from "@/types/types";
import { clsxm } from "@/utils/clsxm";
import useClickOutside from "@/utils/use-click-outside";
import clsx from "clsx";
import { useRef, useState } from "react";
import useSWR from "swr";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { useDebounceNew } from "@/utils/use-debounce-new";

type EmployeeDropdownSearchProps = {
  label: string;
  name: string;
  value: string[];
  handleBlur: (e: React.FocusEvent<any>) => void;
  onOptionSelect: (value: string[]) => void;
};

const EmployeeDropdownSearch = ({
  label,
  name,
  value,
  handleBlur,
  onOptionSelect,
}: EmployeeDropdownSearchProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const debouncedSearchInput = useDebounceNew(inputValue, 1000);
  const url =
    debouncedSearchInput && debouncedSearchInput.trim().length > 0
      ? `${config.employeesList}?query=${debouncedSearchInput}`
      : `${config.employeesList}`;

  const {
    data: employeeData,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useSWR<EmployeeResponseType>(url, fetcher, {
    revalidateOnFocus: false,
  });

  const [selectedEmployees, setSelectedEmployees] = useState<
    EmployeeData[] | undefined
  >(
    value
      ? employeeData?.data.filter((employee: EmployeeData) => {
          employee && employee.id ? value.includes(employee.id) : undefined;
        })
      : undefined
  );

  const handleInputChange = (e: string) => {
    setInputValue(e);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    setInputValue(undefined);
  });

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (
      selectedEmployees?.find((emp: EmployeeData) => emp.id === employee.id)
    ) {
      setSelectedEmployees(
        selectedEmployees.filter((emp: EmployeeData) => emp.id !== employee.id)
      );
    } else {
      setSelectedEmployees([...(selectedEmployees || []), employee]);
    }

    onOptionSelect(
      selectedEmployees?.map((emp: EmployeeData) =>
        emp && emp.id ? emp.id : ""
      ) || []
    );
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx("mb-2 w-full", employeeError && "input-error")}
    >
      <label
        className={
          (clsxm("mb-2.5 block font-medium text-black "),
          `${employeeError ? "text-danger" : "dark:text-white"}`)
        }
      >
        {label + " " + `${employeeError ? employeeError : ""}`}
      </label>
      <input
        placeholder="Search for an employee"
        className={clsx(
          "relative",
          inputValue ? "rounded-b-none border-b-[1.5px]" : "",
          " flex w-full justify-between rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-left font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark  dark:bg-form-input dark:focus:border-primary "
        )}
        type="text"
        value={inputValue}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
      />
      {inputValue && employeeData && (
        <div
          className={
            inputValue && employeeData
              ? "absolute z-10 rounded rounded-t-none  border-[1.5px] border-t-[0px] border-stroke bg-transparent text-left font-medium  outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark  dark:bg-form-input dark:focus:border-primary"
              : "hidden"
          }
        >
          {employeeData?.data ? (
            employeeData.data.map((employee: EmployeeData) => (
              <div
                className={clsx(
                  employee.id ===
                    selectedEmployees?.find((emp) => emp.id === employee.id)?.id
                    ? "bg-zinc-200 dark:bg-meta-4"
                    : "",
                  "w-100 cursor-pointer px-5 py-3 hover:bg-zinc-200 dark:hover:bg-meta-4"
                )}
                key={employee.id}
                onClick={() => handleSelectEmployee(employee)}
                onBlur={handleBlur}
              >
                <label className="w-100 cursor-pointer">
                  {employee.first_name} {employee.last_name}
                </label>
              </div>
            ))
          ) : (
            <div className="w-100 cursor-pointer px-5 py-3 hover:bg-zinc-200 dark:hover:bg-meta-4">
              <label className="w-100 cursor-pointer">No employees found</label>
            </div>
          )}
        </div>
      )}
      <div>
        {selectedEmployees?.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between bg-zinc-200 px-5 py-3 dark:bg-meta-4"
          >
            {employee.first_name} {employee.last_name}
          </div>
        ))}
      </div>
      {isEmployeeLoading && <LoadingIndicatorSmall />}
    </div>
  );
};

export default EmployeeDropdownSearch;
