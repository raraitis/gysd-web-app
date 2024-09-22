"use client";

import { fetcher } from "@/lib/httpClient";
import useSWR from "swr";
import Loader from "../common/Loader";
import { config } from "@/lib/api/config";
import {
  EmployeeStatus,
  EmployeesResponseData,
  RoleType,
  TabProps,
} from "@/types/types";
import { useRouter } from "next/navigation";
import PaginationRow from "../Pagination/PaginationRow";
import { FC, useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import {
  EyeSlashIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AdminTypes } from "../Forms/EmployeeForm";
import clsx from "clsx";
import useModal from "../common/modal/modal";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import EmployeesTable, { Employee } from "./EmployeesTable";

const adminTypesWithAll: TabProps[] = [
  { value: "", label: "All" } as TabProps,
  ...AdminTypes,
  { value: EmployeeStatus.DEACTIVATED, label: "Deactivated" } as TabProps,
];
export const EmployeeStatuses: TabProps[] = [
  { value: EmployeeStatus.CONFIRMED, label: "Confirmed" },
  { value: EmployeeStatus.DEACTIVATED, label: "Deactivated" },
];

export const emoloyeeActionModal = (action: EmployeeStatus) => {
  const text = action === EmployeeStatus.CONFIRMED ? "deactivate" : "activate";

  return (
    <div>
      <p className="text-md font-semibold">
        {`Do you really want to ${text} this customer?`}
      </p>
    </div>
  );
};

const EmployeeList: FC = ({}) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedRole, setSelectedRole] = useLocalStorage("selectedRole", "");
  const { openModal, closeModal, ModalWrapper } = useModal();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const pageLength = 10;
  const router = useRouter();

  const constructUrl = (selectedTab: string, page: number): string => {
    let url = `${config.employeesList}?`;

    if (debouncedSearchInput && debouncedSearchInput.trim().length > 0) {
      url += `query=${debouncedSearchInput}&`;
    }

    if (selectedTab !== "") {
      if (selectedTab === EmployeeStatus.DEACTIVATED) {
        url += `status=${selectedTab}&`;
      } else {
        url += `role=${selectedTab}&`;
      }
    }

    url += `limit=${pageLength}&offset=${(page - 1) * pageLength}`;

    return url;
  };

  const url = constructUrl(selectedTab, currentPage);

  const {
    data: employees,
    error,
    isValidating,
    isLoading,
    mutate,
  } = useSWR<EmployeesResponseData>(url, fetcher);

  const handleTabChange = (tabType: RoleType | string) => {
    if (isLoading) {
      return;
    }

    setCurrentPage(1);
    setSelectedTab(tabType);
    setSelectedRole(tabType as RoleType);

    const newUrl = constructUrl(tabType as RoleType, 1);

    mutate(newUrl);
  };

  if (error && !isLoading && !isValidating) return <div>Failed to load</div>;

  const totalPages = employees ? Math.ceil(employees.data?.count / 10) : 1;

  const handlePageChange = (page: number) => {
    if (isLoading) {
      return;
    }
    setCurrentPage(page);
    const newUrl = constructUrl(selectedTab, page);

    mutate(newUrl);
  };

  const nextPage = () => {
    if (isLoading) {
      return;
    }

    if (!employees) {
      return;
    }

    if (currentPage + 1 >= totalPages + 1) {
      return;
    }

    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedTab, newPage);
    mutate(newUrl);
  };

  const prevPage = () => {
    if (isLoading) {
      return;
    }

    if (!employees) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedTab, newPage);
    mutate(newUrl);
  };

  const onDelete = (item: Employee) => {
    setSelectedEmployee(item);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await postUrl<any>({
        url: config.deactivateEmployee,
        config: {
          method: "PATCH",
        },
        data: {
          id,
        },

        onError: (error) => {
          toast.error(error.message);
          closeModal();
        },
        onResponse: ({ data, status }) => {
          closeModal();
          toast.success(`Employee deactivated successfully`);
          mutate();
        },
      });
    } catch (error) {
      closeModal();
      toast.error("Failed to deactivate employee!");
    } finally {
      closeModal();
      mutate();
    }
  };

  return (
    <div
      className={clsx(
        "rounded-sm",
        "bg-white",
        "px-5",
        "pb-2.5",
        "pt-6",
        "shadow-default",
        "dark:border-strokedark",
        "dark:bg-boxdark",
        "sm:px-7.5",
        "xl:pb-1",
        "no-scrollbar",
        "overflow-x-auto",
        "h-[100%]"
      )}
    >
      <div className="flex flex-wrap gap-4 pb-4">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            {adminTypesWithAll.map((adminType: TabProps, index: number) => (
              <button
                key={index}
                className={`rounded bg-blue-500 px-4 py-2 text-white shadow-1 ${
                  selectedTab === adminType.value
                    ? "bg-opacity-100"
                    : "bg-opacity-70"
                }`}
                onClick={() => handleTabChange(adminType.value)}
              >
                {adminType.label}
              </button>
            ))}
          </div>
          <div
            className="flex w-10 cursor-pointer"
            onClick={() => router.push("/super/create")}
          >
            <UserPlusIcon width={30} />
          </div>
        </div>
      </div>
      <div
        className={`flex max-w-full flex-col ${
          employees?.data?.count === 0 ? "items-center" : "items-start"
        } no-scrollbar justify-center overflow-x-auto`}
      >
        <div className="relative mb-5 mt-1 w-full">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon width={20} height={20} />
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
        <div className="flex w-full items-center justify-center">
          {!employees || isLoading || isValidating ? (
            <Loader />
          ) : (
            <EmployeesTable
              employees={employees}
              onDelete={(item: Employee) => onDelete(item)}
            />
          )}
        </div>
        {employees?.data?.count === 0 && (
          <div className="flex py-4 hover:cursor-pointer">
            <div className="flex items-center rounded-md border p-2">
              <EyeSlashIcon className="h-6 w-8" />
              <div className="flex px-2">NO DATA</div>
            </div>
          </div>
        )}
        <ModalWrapper
          title={`Deactivate ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`}
          type="warning"
          content={emoloyeeActionModal(
            selectedEmployee?.status as EmployeeStatus
          )}
          onOk={() => handleDelete(selectedEmployee?.id ?? "")}
          onClose={closeModal}
        />
      </div>
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{
          totalEntries: employees?.data?.count || 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default EmployeeList;
