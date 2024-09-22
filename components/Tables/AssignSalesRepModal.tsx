import { EmployeeData, EmployeesResponseData, RoleType } from "@/types/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import RoleChip from "../Employees/RoleChip";
import Loader from "../common/Loader";

type AssignSalesRepModalProps = {
  onClose: () => void;
  onAssign: (salesRepId: string) => void;
};

export const AssignSalesRepModal = ({
  onClose,
  onAssign,
}: AssignSalesRepModalProps) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  const url =
    debouncedSearchInput && debouncedSearchInput.trim().length > 0
      ? `${config.employeesList}?role=SALES_REP&query=${debouncedSearchInput}`
      : `${config.employeesList}?role=SALES_REP`;
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useSWR<EmployeesResponseData>(url, fetcher);

  if (employeeLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (employeeError) return <div>Failed to load withdrawals</div>;

  return (
    <div
      style={{ zIndex: 5 }}
      className="fixed inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 "
    >
      <div className="max-h-4xl absolute w-1/2 flex-row overflow-y-auto rounded-md bg-white p-8 shadow-md dark:bg-meta-4">
        <div className="flex justify-between">
          <h2 className="mb-4 text-lg font-semibold">Sales Representatives </h2>
          <button onClick={onClose} className="text-md cursor-pointer">
            Close
          </button>
        </div>

        <div className="relative mb-5 mt-1">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-bodydark" />
          </button>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <pre className="text-black"></pre>
        <div className="flex w-full flex-col">
          {/* Header */}
          <div className="mb-4 flex bg-gray-200 p-2 dark:bg-gray-800">
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Employee</p>
            </div>
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Status</p>
            </div>
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Email</p>
            </div>
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Role</p>
            </div>
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Action</p>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="no-scrollbar flex max-h-100 w-full flex-col overflow-y-auto overflow-x-hidden">
            {employeeData?.data &&
              employeeData?.data?.employees
                ?.filter(
                  (employee: EmployeeData) =>
                    employee.role === RoleType.SALES_REP
                )
                .map((employee: EmployeeData) => (
                  <div
                    key={employee.id}
                    className="mb-4 flex cursor-pointer items-center rounded-md border py-1.5 shadow hover:cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {/* Employee */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate ">
                      <p className="text-md truncate font-semibold text-gray-400">
                        {employee?.first_name} {employee?.last_name}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate ">
                      <EmployeeStatusChip type={employee.status} />
                    </div>

                    {/* Email */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate ">
                      {employee.email}
                    </div>

                    {/* Role */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate ">
                      <RoleChip type={employee.role} />
                    </div>

                    {/* Assign Button */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate  ">
                      <div
                        className="flex max-w-[80px] items-center justify-center rounded-md bg-primary px-3 py-1 text-center text-white transition hover:bg-opacity-90"
                        onClick={() => {
                          console.log("ello");
                          onAssign(employee.id);
                        }}
                      >
                        <p>Assign</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
