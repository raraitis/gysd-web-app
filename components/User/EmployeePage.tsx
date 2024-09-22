"use client";

import { FC } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import { EmployeesResponseData, RoleType } from "@/types/types";
import Loader from "../common/Loader";
import EmployeeCard from "../Forms/EmployeeCard";
import EmployeJobHistory from "../Employees/EmployeJobHistory";
import EmployeeWithdrawals from "../Employees/EmployeeWithdrawals";
import { useRole } from "@/utils/parseJwt";
import PasswordChangeModal from "./PasswordChangeModal";

type Props = {
  id: string;
};

const EmployeePage: FC<Props> = ({ id }) => {
  const isAdminInstaller = useRole([RoleType.INSTALLER, RoleType.ADMIN]);
  const {
    data: employees,
    error,
    isLoading,
    mutate,
  } = useSWR<EmployeesResponseData>(config.employeesList, fetcher);

  isLoading && <Loader />;
  error && <div>{"Error loading data. Please try again later."}</div>;

  const employee = employees?.data?.employees.find((emp) => emp.id === id);

  return (
    <div className="flex w-full">
      {employee ? (
        <div className="w-full items-center justify-center">
          <Breadcrumb
            pageName={`${employee?.first_name} ${employee.last_name}`}
          />
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="w-full items-center justify-center">
              <EmployeeCard
                employee={employee}
                onSubmit={() => mutate(config.employeesList)}
                onMutate={mutate}
              />
            </div>
            <div className="flex w-full flex-col gap-10">
              <EmployeJobHistory employee={employee} />
              {isAdminInstaller && <EmployeeWithdrawals employee={employee} />}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EmployeePage;
