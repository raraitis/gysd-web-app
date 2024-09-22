import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { EmployeeApiResponse } from "@/pages/api/employee/employee";
import { EmployeeResponseType } from "@/types/types";
import { RoleType } from "@/types/user";
import { redirect } from "next/navigation";
import useSWR from "swr";

export const useAdminOnly = ({
  redirect: navigate,
  blockRoles = [RoleType.FIELD_TECH, RoleType.OFFICE_STAFF],
}: {
  redirect?: boolean;
  blockRoles?: RoleType[];
}) => {
  const {
    data,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useSWR<EmployeeApiResponse>(config.getEmployee, fetcher);

  if (employeeError) {
    console.error("Error fetching employee data:", employeeError);
  }

  if (
    !data ||
    !data.data ||
    !data.data.role ||
    blockRoles.includes(data?.data?.role as RoleType)
  ) {
    if (navigate) {
      redirect("/");
    }
    return false;
  }

  return true;
};
