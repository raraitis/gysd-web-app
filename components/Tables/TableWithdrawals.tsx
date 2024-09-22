"use client";

import {
  CommonResponse,
  EmployeeData,
  EmployeesResponseData,
  Withdrawal,
} from "@/types/types";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { Button } from "../Ui/Button";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import toast from "react-hot-toast";
import { postUrl } from "@/lib/api/common";
import PaginationRow from "../Pagination/PaginationRow";
import useModal from "@/components/common/modal/modal";
import { useState } from "react";
import { formatToDollar } from "@/utils/utils";

type Props = {
  withdrawals: Withdrawal[];
  count: number;
  header?: JSX.Element;
  onPageChange: (page: number) => void;
  currentPage: number;
  mutateWithdrawals: () => void;
  withdrawalsValidating: boolean;
  approved: boolean;
};

const TableWithdrawals = ({
  withdrawals,
  count,
  header,
  onPageChange,
  currentPage,
  mutateWithdrawals,
  withdrawalsValidating,
  approved,
}: Props) => {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal>();
  const { openModal, closeModal, ModalWrapper } = useModal();
  const {
    data: employees,
    error,
    isLoading: isEmployeesLoading,
    mutate,
  } = useSWR<EmployeesResponseData>(config.employeesList + "?limit=0", fetcher);

  function onApprove(withdrawal: Withdrawal) {
    setSelectedWithdrawal(withdrawal);
    openModal();
  }
  const modalApproveContent = () => (
    <div>
      <p>{"Approve this withdrawal?"}</p>
    </div>
  );
  const totalPages = Math.ceil(count / 10);

  const nextPage = () => {
    if (!withdrawals) {
      return;
    }

    const totalPageCount = totalPages;

    if (currentPage + 1 >= totalPageCount + 1) {
      return;
    }

    onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    if (!withdrawals) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    onPageChange(currentPage - 1);
  };

  const onPage = (page: number) => {
    if (currentPage === page) {
      return;
    }

    onPageChange(page);
  };

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
      mutate(config.employeesList + "?limit=0");
    }
  }

  return (
    <>
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
          "h-[100%]"
        )}
      >
        {header}
        <div className="max-w-full">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Approved
                </th>
                {approved && (
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Approved by
                  </th>
                )}
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Requested date
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Employee
                </th>
                {!approved && (
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {withdrawalsValidating && (
                <tr className="dark:bg-boxdarkdark border-gray-1 cursor-pointer dark:border-stroke dark:text-white">
                  <td
                    colSpan={6}
                    className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                  >
                    <LoadingIndicatorSmall />
                  </td>
                </tr>
              )}
              {withdrawals.map((withdrawal: Withdrawal) => {
                const employee = employees?.data?.employees.find(
                  (employee) => employee.id === withdrawal.employee_id
                );
                return (
                  <TableRow
                    key={withdrawal.id}
                    {...{
                      withdrawal,
                      employee,
                      isEmployeesLoading,
                      onApprove,
                      approved,
                    }}
                  />
                );
              })}
              {withdrawals.length === 0 && (
                <tr className="dark:bg-boxdarkdark border-gray-1 cursor-pointer dark:border-stroke dark:text-white">
                  <td
                    colSpan={6}
                    className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                  >
                    No withdrawals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!approved && selectedWithdrawal && (
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
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{ totalEntries: count, totalPages: totalPages }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={onPage}
      />
    </>
  );
};

type TableRowProps = {
  withdrawal: Withdrawal;
  employee?: EmployeeData;
  isEmployeesLoading: boolean;
  onApprove: (withdrawal: Withdrawal) => void;
  approved: boolean;
};

const TableRow = ({
  withdrawal,
  employee,
  isEmployeesLoading,
  onApprove,
  approved,
}: TableRowProps) => {
  return (
    <tr
      className="dark:bg-boxdarkdark border-gray-1 cursor-pointer dark:border-stroke dark:text-white"
      key={withdrawal.id}
    >
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {formatToDollar(withdrawal.amount)}
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {withdrawal.approved ? "Yes" : "No"}
      </td>
      {approved && (
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          {withdrawal.approved_by}
        </td>
      )}
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {dayjs(withdrawal.created_at).toDate().toDateString()}
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {isEmployeesLoading ? (
          <LoadingIndicatorSmall />
        ) : (
          employee && `${employee?.first_name} ${employee?.last_name}`
        )}
      </td>
      {!approved && (
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <Button onClick={() => onApprove(withdrawal)} size="xs">
            Approve
          </Button>
        </td>
      )}
    </tr>
  );
};

export default TableWithdrawals;
