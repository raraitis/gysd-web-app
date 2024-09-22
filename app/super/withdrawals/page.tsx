"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { WithdrawalResponseData } from "@/types/types";
import useSWR from "swr";
import TableWithdrawals from "@/components/Tables/TableWithdrawals";
import { useState } from "react";

interface TabProps {
  label: string;
  type: boolean;
}

const tabs: TabProps[] = [
  { label: "Approved", type: true },
  { label: "Pending", type: false },
];

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [approved, setApproved] = useState<boolean>(true);
  const pageLength = 10;

  const url = `${config.adminWithdrawals}?limit=${pageLength}&offset=${
    (currentPage - 1) * pageLength
  }&approved=${approved}`;

  const {
    data: withdrawals,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<WithdrawalResponseData>(url, fetcher, {
    revalidateOnFocus: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newUrl = `${config.adminWithdrawals}?limit=${pageLength}&offset=${
      (page - 1) * pageLength
    }`;
    // Log the new URL for debugging
    console.log("New URL: ", newUrl);

    // Trigger a re-fetch with the new URL
    mutate(newUrl);
  };

  function onApprove(val: boolean) {
    setApproved(val);
    let newUrl = `${config.adminWithdrawals}?approved=${val}`;
    mutate(newUrl);
  }

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <div>Failed to load withdrawals</div>;

  return (
    <div>
      <Breadcrumb pageName="Withdrawals" />

      {withdrawals?.data?.withdrawals && (
        <TableWithdrawals
          withdrawals={withdrawals.data.withdrawals}
          count={withdrawals.data.count}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          mutateWithdrawals={() => mutate(url)}
          withdrawalsValidating={isValidating}
          approved={approved}
          header={
            <div className="flex flex-wrap gap-2 pb-4">
              {tabs.map((tab) => (
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
          }
        />
      )}
    </div>
  );
};

export default Page;
