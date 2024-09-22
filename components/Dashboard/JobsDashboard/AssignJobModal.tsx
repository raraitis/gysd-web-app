import { Button } from "@/components/Ui/Button";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { CommonResponse } from "@/types/responses";
import {
  EmployeeData,
  EmployeesResponseData,
  Job,
  RoleType,
} from "@/types/types";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { clsxm } from "@/utils/clsxm";
import RoleChip from "@/components/Employees/RoleChip";
import EmployeeStatusChip from "@/components/Employees/EmployeeStatusChip";

interface AssignJobModalProps {
  onClose: () => void;
  job: Job;
  fn?: () => void;
  assigned?: () => void;
}

const AssignJobModal = ({
  onClose,
  job,
  fn,
  assigned,
}: AssignJobModalProps) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  const url =
    debouncedSearchInput && debouncedSearchInput.trim().length > 0
      ? `${config.employeesList}?role=INSTALLER&query=${debouncedSearchInput}`
      : `${config.employeesList}?role=INSTALLER`;
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useSWR<EmployeesResponseData>(url, fetcher);
  const { data: session } = useSession();

  const assignEmployeeToJob = async (employeeId?: string) => {
    try {
      await postUrl<CommonResponse>({
        url: `https://api.therhino.com/api/v1/job/assign`,
        data: { jobId: job.id, id: employeeId },
        token: session?.user?.accessToken,
      });
      toast.success("Job assigned to employee!");
      onClose();
    } catch (error) {
      console.error("Error assigning employee to job:", error);
    } finally {
      assigned ? assigned() : null;
      fn ? fn() : null;
    }
  };

  if (employeeError) return <div>{"Failed to load"}</div>;

  return (
    <div
      style={{ zIndex: 5 }}
      className="fixed inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 "
    >
      <div className="max-h-4xl absolute w-1/2 flex-row overflow-y-auto rounded-md bg-white p-8 shadow-md dark:bg-meta-4">
        <div className="flex justify-between">
          <h2 className="mb-4 text-lg font-semibold">Installers </h2>
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
        {employeeLoading && <Loader />}
        <div className="flex w-full flex-col">
          {/* Header */}
          <div className="mb-4 flex bg-gray-200 p-2 dark:bg-gray-700">
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Employee</p>
            </div>
            <div className="mx-4 flex max-w-[200px] flex-1 items-center justify-center ">
              <p className="text-gray-600">Status</p>
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
                    employee.role === RoleType.INSTALLER
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

                    {/* Role */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate ">
                      <RoleChip type={employee.role} />
                    </div>

                    {/* Assign Button */}
                    <div className="mx-4 flex max-w-[200px] flex-1 justify-center truncate  ">
                      <div
                        className="flex max-w-[80px] items-center justify-center rounded-md bg-primary px-3 py-1 text-center text-white transition hover:bg-opacity-90"
                        onClick={() => {
                          assignEmployeeToJob(employee?.id);
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

export default AssignJobModal;
