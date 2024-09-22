"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { DocumentIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const QuoteRequestCount: React.FC = () => {
  const {
    data: quotes,
    error,
    isValidating,
    isLoading,
  } = useSWR<any>(`${config.quotesList}?status=REQUESTED`, fetcher);

  if (error) return <div>Failed to load</div>;

  const loadingNoData = !quotes || isLoading || isValidating;
  const total = loadingNoData
    ? "Loading"
    : quotes.data?.count.toString() ?? "0";

  return (
    <>
      <CardDataStats title="Unassigned quote requests" total={total} rate="">
        <DocumentIcon className="h-6 w-6" />
      </CardDataStats>
    </>
  );
};

export default QuoteRequestCount;
