"use client";
import React, { useEffect } from "react";
import { CommonResponse } from "@/types/responses";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import CardRow from "../CardRow";
import { eventEmitter, EventType } from "@/utils/events";

const DashPendingTransactions: React.FC = () => {
  // const { data, error, isValidating, isLoading, mutate } = useSWR<
  //   CommonResponse<{ count: number }>
  // >(config.adminTransactionCount, fetcher);

  // useEffect(() => {
  //   eventEmitter.subscribe(
  //     EventType.REFETCH_PENDING_TRANSACTIONS,
  //     "pending_transaction_table",
  //     () => {
  //       mutate();
  //     }
  //   );

  //   return () => {
  //     eventEmitter.unsubscribe(
  //       EventType.REFETCH_PENDING_TRANSACTIONS,
  //       "pending_transaction_table"
  //     );
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // if (error) return <div>Failed to load</div>;

  // const loadingNoData = !data || isLoading || isValidating;
  // const total = loadingNoData ? "Loading" : data.data?.count.toString() ?? "0";

  return (
    <CardRow title="Pending deposit/withdrawal requests" total={"2"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    </CardRow>
  );
};

export default DashPendingTransactions;
