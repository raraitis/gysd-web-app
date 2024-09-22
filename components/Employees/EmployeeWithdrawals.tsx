"use client";

import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { EmployeeData, RoleType, WithdrawalResponseData } from "@/types/types";
import useSWR from "swr";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRole } from "@/utils/parseJwt";
import { postUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { Button } from "../Ui/Button";

interface TabProps {
  label: string;
  type: boolean;
}

const tabs: TabProps[] = [
  { label: "Approved", type: true },
  { label: "Pending", type: false },
];

type Props = {
  employee: EmployeeData;
};

const EmployeeWithdrawals = ({ employee }: Props) => {
  const [approved, setApproved] = useState<boolean>(true);

  const isAdminSuper = useRole([RoleType.SUPER, RoleType.ADMIN]);

  let url = `${config.employeeWithdrawals}?approved=${approved}&id=${employee.id}`;

  const {
    data: employeeWithdrawals,
    error,
    isLoading: isWithdrawalsLoading,
    mutate: mutateWithdrawals,
  } = useSWR<WithdrawalResponseData>(url, fetcher, {
    revalidateOnFocus: false,
  });

  function onApprove(val: boolean) {
    setApproved(val);
    let newUrl = `${config.employeeWithdrawals}?approved=${val}`;
    mutateWithdrawals(newUrl);
  }
  if (error) {
    toast.error(error);

    return <div>Error loading data. Please try again later.</div>;
  }

  async function approveWithdrawal(id: string) {
    toast.success("Approving withdrawal...");

    try {
      await postUrl<CommonResponse>({
        url: config.adminApproveWithdrawal,
        config: {
          method: "PATCH",
        },
        data: {
          id,
        },

        onError: (error) => {
          toast.error(error.message);
        },
        onResponse: ({ data, status }) => {
          toast.success(`Withdrawal approved successfully`);
          mutateWithdrawals();
        },
      });
    } catch (error) {
      toast.error("Failed to approve withdrawal");
    } finally {
      mutateWithdrawals(config.employeeWithdrawals + "?limit=0");
    }
  }

  return (
    <div className="w-full rounded-md bg-white p-4 shadow-md dark:bg-boxdark">
      <h2 className="mb-2 text-lg font-semibold">Withdrawals</h2>
      <div className="flex flex-wrap gap-2 pb-4">
        {employeeWithdrawals?.data?.withdrawals.length !== 0 &&
          tabs.map((tab) => (
            <button
              key={tab.label}
              className={`md:text-md flex-nowrap truncate rounded px-4 py-2 text-white sm:py-2 ${
                tab.type === true ? "bg-green-500" : "bg-blue-500"
              } lg:text-lg  ${
                approved === tab.type ? "bg-opacity-70" : "bg-opacity-30"
              }`}
              onClick={() => {
                onApprove(tab.type);
              }}
            >
              {tab.label}
            </button>
          ))}
      </div>
      <div className="no-scrollbar flex max-h-[25rem] w-full flex-col items-start overflow-y-auto">
        <div className="flex w-full flex-col gap-3">
          {employeeWithdrawals?.data?.withdrawals && (
            <div className="flex w-full flex-row justify-between">
              <div className="flex flex-1 font-semibold">{"Status"}</div>
              <div className="flex flex-1 font-semibold">{"Requested at"}</div>
              <div className="flex flex-1 font-semibold">{"Aproved by"}</div>
              <div className="flex flex-1 font-semibold"></div>
            </div>
          )}
          <div className="flex w-full flex-col gap-3 ">
            {employeeWithdrawals?.data?.withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex w-full items-center justify-between rounded-md border p-2"
              >
                <div
                  className={`mx-1 flex flex-1 font-semibold ${
                    withdrawal.approved ? "text-green-500" : "text-blue-500"
                  }`}
                >
                  {withdrawal.approved ? "Approved" : "Pending"}
                </div>
                <div className="mx-1 flex flex-1 ">
                  {dayjs(withdrawal.created_at).format("MMMM DD, YYYY")}
                </div>
                <div className="mx-1 flex flex-1 ">
                  {withdrawal.approved_by ? withdrawal.approved_by : "N/A"}
                </div>
                <div className="mx-1 flex flex-1 justify-end">
                  {isAdminSuper &&
                    !approved &&
                    !error &&
                    !isWithdrawalsLoading && (
                      <Button
                        className="w-[100px]"
                        onClick={() => approveWithdrawal(withdrawal.id)}
                        size="xs"
                      >
                        Approve
                      </Button>
                    )}
                </div>
              </div>
            ))}
            {(!employeeWithdrawals?.data?.withdrawals ||
              employeeWithdrawals?.data?.withdrawals.length === 0) && (
              <div className="flex w-full items-center justify-center rounded-md border p-2">
                <EyeSlashIcon className="h-6 w-8" />
                <div className="flex px-2">NO DATA</div>
              </div>
            )}
            {isWithdrawalsLoading && <LoadingIndicatorSmall />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWithdrawals;
