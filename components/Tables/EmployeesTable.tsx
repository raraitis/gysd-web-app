"use client";
import {
  EmployeeData,
  EmployeeStatus,
  EmployeesResponseData,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import RoleChip from "../Employees/RoleChip";
import clsx from "clsx";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  status: EmployeeStatus;
};

const headers = ["Name", "Email", "Address", "Role", "Status", "Actions"];

interface Props {
  employees: EmployeesResponseData;
  onDelete: (item: Employee) => void;
}

const EmployeesTable: FC<Props> = ({ employees, onDelete }) => {
  const router = useRouter();

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          {headers.map((header: string, index: number) => (
            <th
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"
              key={index}
            >
              {header !== "Actions" ? (
                <p className="flex w-full">{header}</p>
              ) : (
                <p className="flex w-full justify-center">{header}</p>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {employees &&
          employees?.data &&
          employees?.data?.employees &&
          employees?.data?.employees.map((user: EmployeeData) => (
            <tr
              className={clsx(
                "dark:bg-boxdarkdark",
                "border-gray-1",
                "max-h-90",
                "cursor-pointer",
                "overflow-hidden",
                "dark:border-stroke",
                "dark:text-white",
                "md:max-h-90"
              )}
              key={user.id}
            >
              {headers.map((header, index) => (
                <td
                  key={index}
                  onClick={() => {
                    if (header !== "Actions") {
                      router.push(`/super/${user.id}`);
                    }
                    router.push(`/super/${user.id}`);
                  }}
                  className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                    index === 0 ? "font-semibold" : ""
                  }`}
                >
                  {header === "Name" ? (
                    <p className="text-black dark:text-white">
                      {user.first_name} {user.last_name}
                    </p>
                  ) : header === "Email" ? (
                    <p className="text-black dark:text-white">{user.email}</p>
                  ) : header === "Address" ? (
                    <p className="max-w-[200px] truncate text-black dark:text-white">
                      {user.address}
                      {/* <CopyButton value={user.address} /> */}
                    </p>
                  ) : header === "Role" ? (
                    <RoleChip type={user.role} />
                  ) : header === "Status" ? (
                    <EmployeeStatusChip type={user.status as EmployeeStatus} />
                  ) : header === "Actions" ? (
                    <div className="flex items-center justify-end space-x-3.5">
                      <PencilSquareIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/super/${user.id}`);
                        }}
                        className="h-6 w-6"
                      />
                      {user &&
                        user.id &&
                        user.status !== EmployeeStatus.DEACTIVATED && (
                          <TrashIcon
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              user.id &&
                                onDelete({
                                  id: user.id,
                                  first_name: user.first_name,
                                  last_name: user.last_name,
                                  status: user.status as EmployeeStatus,
                                } as Employee);
                            }}
                          />
                        )}
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EmployeesTable;
