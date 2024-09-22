"use client";

import { Withdrawal } from "@/types/types";
import clsx from "clsx";
import WithdrawalItem from "./WithdrawalItem";
import useModal from "@/components/common/modal/modal";
import toast from "react-hot-toast";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { useState } from "react";

type Props = {
  data?: Withdrawal[];
  isLoading: boolean;
  error?: any;
};

const DashWithdrawalsList = ({ data, isLoading, error }: Props) => {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal>();

  const { openModal, closeModal, ModalWrapper } = useModal();

  function onApprove(withdrawal: Withdrawal) {
    setSelectedWithdrawal(withdrawal);
    openModal();
  }

  const modalApproveContent = () => (
    <div>
      <p>{"Approve this withdrawal?"}</p>
    </div>
  );

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
    }
  }

  return (
    <div
      className={clsx(
        "w-full",
        "rounded-sm",
        "border",
        "border-stroke",
        "bg-white",
        "px-4",
        "py-6",
        "shadow-default",
        "dark:border-strokedark",
        "dark:bg-boxdark"
      )}
    >
      <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Withdrawals pending approval
      </h3>

      {data && (
        <div className="no-scrollbar max-h-100 overflow-y-auto ">
          {data?.map((withdrawal) => {
            return (
              <div key={withdrawal.id}>
                <WithdrawalItem
                  withdrawal={withdrawal}
                  onApprove={() => onApprove(withdrawal)}
                />
              </div>
            );
          })}
        </div>
      )}
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
  );
};

export default DashWithdrawalsList;
