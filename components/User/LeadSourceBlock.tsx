import React, { FC } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import Loader from "../common/Loader";
import { EmployeeStatus, EmployeeType, RoleType } from "@/types/types";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import UserPageDetails from "./UserPageDetails";
import RoleChip from "../Employees/RoleChip";

type Props = {
  email: string;
};

const LeadSourceBlock: FC<Props> = ({ email }) => {
  const router = useRouter();

  const {
    data: leadData,
    error: leadError,
    isLoading: isLeadLoading,
  } = useSWR<any>(`${config.findEmployeeByEmail}?email=${email}`, fetcher);

  if (leadError) {
    return <div>Error loading employee data</div>;
  }

  if (isLeadLoading) {
    return <Loader />;
  }

  if (!leadData) {
    return <div>No employee data found</div>;
  }

  const lead: EmployeeType = leadData.data;

  return (
    <div
      onClick={() => router.push(`/super/${lead.id}`)}
      className="flex min-h-[100%] flex-col rounded-md  border-2 border-gray-200 p-3 shadow-md"
    >
      <div className="m-3 flex w-full items-center justify-center">
        <div className="rounded-3xl border-2 border-gray-2 p-3 opacity-80 shadow-2">
          <UserIcon width={60} />
        </div>
      </div>
      <div className="flex w-full flex-col items-center ">
        <h2 className="text-grey-900 font-semibold dark:text-white">
          {lead?.first_name} {lead?.last_name}
        </h2>
        <div className="flex flex-row gap-3">
          <EmployeeStatusChip type={lead?.status as EmployeeStatus} />
          <RoleChip type={lead.role as RoleType} />
        </div>
        {lead && <UserPageDetails user={lead} />}
      </div>
    </div>
  );
};

export default LeadSourceBlock;
