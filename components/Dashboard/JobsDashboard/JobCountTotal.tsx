"use client";
import React from "react";
import CardDataStats from "../../CardDataStats";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { JobsResponseData } from "@/types/types";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";

const JobCountTotal: React.FC = ({}) => {
  const {
    data: jobsData,
    error,
    isLoading,
    isValidating,
  } = useSWR<JobsResponseData>(config.jobList + "?limit=0", fetcher, {
    revalidateOnFocus: false,
  });

  if (!jobsData?.data?.jobs && error) return <div>{"No Data"}</div>;

  if (error) return <div>Failed to load</div>;

  const loadingNoData = !jobsData || isLoading || isValidating;
  const total = loadingNoData
    ? "Loading"
    : jobsData?.data && jobsData?.data?.count
    ? jobsData.data.count.toString()
    : "0";

  return (
    <CardDataStats title="Jobs total count" total={total} rate="">
      <BriefcaseIcon className="h-8 w-8" />
    </CardDataStats>
  );
};

export default JobCountTotal;
