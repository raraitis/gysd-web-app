"use client";
import React, { useMemo } from "react";
import CardDataStats from "../CardDataStats";
import { fetcher } from "@/lib/httpClient";
import { CommonResponse } from "@/types/responses";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { Customer } from "@/types/types";
import Loader from "../common/Loader";

const getFacebookLeadCount = (data: Customer[]): number => {
  return data.filter((item) => item.lead_source === "Facebook").length;
};

const LeadCount: React.FC = () => {
  const {
    data: ClientData,
    error,
    isValidating,
    isLoading,
  } = useSWR<CommonResponse<{ count: number; customers: Customer[] }>>(
    config.clientList,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <Loader />;

  const loadingNoData = !ClientData || isLoading || isValidating;

  let fbLeadCount = 0;
  if (ClientData && ClientData.data) {
    fbLeadCount = getFacebookLeadCount(ClientData.data.customers);
  }

  return (
    <CardDataStats
      title="Facebook Lead Count"
      total={fbLeadCount.toString()}
      rate=""
    >
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 fill-primary dark:fill-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
          />
        </svg>
      </>
    </CardDataStats>
  );
};

export default LeadCount;
