"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { EmployeesResponseData } from "@/types/types";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const DashEmployeeCount: React.FC = () => {
  const {
    data: employees,
    error,
    isValidating,
    isLoading,
  } = useSWR<EmployeesResponseData>(config.employeesList, fetcher);

  if (error) return <div>Failed to load</div>;

  const loadingNoData = !employees || isLoading || isValidating;
  const total = loadingNoData
    ? "Loading"
    : employees.data?.count.toString() ?? "0";

  return (
    <>
      <CardDataStats title="Employees" total={total} rate="">
        <UserGroupIcon className="h-6 w-6" />
      </CardDataStats>
    </>
  );
};

export default DashEmployeeCount;
