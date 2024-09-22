"use client";

import useSWR from "swr";
import { Withdrawal, WithdrawalResponseData } from "@/types/types";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import Loader from "@/components/common/Loader";
import { ReactNode, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/Ui/Button";
import useModal from "@/components/common/modal/modal";
import toast from "react-hot-toast";
import { postUrl } from "@/lib/api/common";
import dayjs from "dayjs";
import { formatToDollar } from "@/utils/utils";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

const modalApproveContent = (): ReactNode => {
  return (
    <div>
      <p>{"Approve this withdrawal?"}</p>
    </div>
  );
};

const DashWithdrawals = () => {
  const url = `${config.adminWithdrawals}?&approved=false`;
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal>();

  const {
    data: withdrawalsData,
    error: withdrawalsError,
    mutate: withdrawalsMutate,
    isLoading: withdrawalsIsLoading,
  } = useSWR<WithdrawalResponseData>(url, fetcher, {
    revalidateOnFocus: true,
  });

  const { openModal, closeModal, ModalWrapper } = useModal();

  function onApprove(withdrawal: Withdrawal) {
    setSelectedWithdrawal(withdrawal);
    openModal();
  }

  async function approveWithdrawal(id: string) {
    toast.success("Approving withdrawal...");

    try {
      await postUrl<{ data: Withdrawal }>({
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
          console.log(data);
          toast.success(`Withdrawal approved successfully`);
        },
      });
    } catch (error) {
      toast.error("Failed to approve withdrawal");
    } finally {
      withdrawalsMutate(url);
    }
  }

  // if (!withdrawalsData?.data?.withdrawals && !withdrawalsIsLoading) {
  //   return <div>No Data</div>;
  // }
  // if (
  //   withdrawalsData?.data?.withdrawals.length === 0 &&
  //   !withdrawalsIsLoading
  // ) {
  //   return <div>No Data</div>;
  // }

  if (withdrawalsIsLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  function noData() {
    return (
      <div className="flex items-center justify-center w-full p-2 border rounded-md">
        <EyeSlashIcon className="w-8 h-6" />
        <div className="flex px-2">NO DATA</div>
      </div>
    );
  }

  return (
    <div className="flex w-full overflow-y-auto">
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
          "overflow-x-auto",
          "h-[100%]",
          "w-[100%]"
        )}
      >
        <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Pending withdrawals
        </h3>
        <div className="max-w-full">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-2 dark:bg-meta-4">
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Approved
                </th>

                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Requested date
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Employee
                </th>

                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
              {withdrawalsData?.data.withdrawals.length !== 0 &&
                withdrawalsData &&
                withdrawalsData?.data?.withdrawals.map(
                  (withdrawal: Withdrawal) => {
                    return (
                      <tr
                        className="cursor-pointer dark:bg-boxdarkdark border-gray-1 dark:border-stroke dark:text-white"
                        key={withdrawal.id}
                      >
                        <td className="border-b border-[#eee] px-4 py-5 font-semibold dark:border-strokedark">
                          {formatToDollar(withdrawal.amount)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {withdrawal.approved ? "Yes" : "No"}
                        </td>

                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {dayjs(withdrawal.created_at).toDate().toDateString()}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {withdrawal.withdrawer.first_name}{" "}
                          {withdrawal.withdrawer.last_name}
                        </td>

                        <td className=" flex justify-end border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <Button
                            onClick={() => onApprove(withdrawal)}
                            size="xs"
                            className="w-20"
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              {(withdrawalsData?.data.withdrawals.length === 0 ||
                !withdrawalsData?.data?.withdrawals) && (
                <tr className="cursor-pointer dark:bg-boxdarkdark border-gray-1 dark:border-stroke dark:text-white">
                  <td
                    colSpan={6}
                    className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                  >
                    No withdrawals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedWithdrawal && (
          <ModalWrapper
            title={`Approve withdrawal ${selectedWithdrawal.amount}`}
            content={modalApproveContent()}
            onOk={() => {
              approveWithdrawal(selectedWithdrawal.id);
              closeModal();
            }}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default DashWithdrawals;
