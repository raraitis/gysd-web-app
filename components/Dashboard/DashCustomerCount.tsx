"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { CustormerResponseData } from "@/types/types";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const DashCustomerCount: React.FC = () => {
  const {
    data: clientData,
    error,
    isValidating,
    isLoading,
  } = useSWR<CustormerResponseData>(config.clientList, fetcher);

  if (error) return <div>Failed to load</div>;

  const loadingNoData = !clientData || isLoading || isValidating;
  const total = loadingNoData
    ? "Loading"
    : clientData.data && clientData.data.count
    ? clientData.data.count.toString()
    : "0";

  return (
    <CardDataStats title="Registered Customers" total={total} rate="">
      <UserGroupIcon className="h-6 w-6" />
    </CardDataStats>
  );
};

export default DashCustomerCount;
