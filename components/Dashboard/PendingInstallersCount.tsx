"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import {
  EmployeeData,
  EmployeeStatus,
  EmployeesResponseData,
} from "@/types/types";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const PendingInstallersCount: React.FC = () => {
  const {
    data: employees,
    error,
    isValidating,
    isLoading,
  } = useSWR<EmployeesResponseData>(config.employeesList, fetcher);

  if (error) return <div>Failed to load</div>;

  const loadingNoData = !employees || isLoading || isValidating;
  const pendingCount = loadingNoData
    ? "Loading"
    : employees.data
    ? employees.data.employees
        .filter(
          (employee: EmployeeData) => employee.status === EmployeeStatus.PENDING
        )
        .length.toString()
    : "0";

  const total = pendingCount ?? "0";
  return (
    <>
      <CardDataStats title="Pending Installers" total={total} rate="">
        <UserGroupIcon className="h-6 w-6" />
      </CardDataStats>
    </>
  );
};

export default PendingInstallersCount;
