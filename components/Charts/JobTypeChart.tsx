"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";
import { Job, JobsResponseData } from "@/types/types";
import Loader from "../common/Loader";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { jobTypeToText } from "@/utils/job-type-to-text";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface JobTypeChartState {
  series: { data: number[] }[];
}

const JobTypeChart: React.FC = () => {
  const {
    data: jobsData,
    error: jobsError,
    mutate: jobsMutate,
    isLoading: jobsIsLoading,
    isValidating: jobsIsValidating,
  } = useSWR<JobsResponseData>(config.jobList + "?limit=0", fetcher, {
    revalidateOnFocus: false,
  });

  if (jobsError) return;

  if (!jobsData || jobsIsLoading || jobsIsValidating) return;

  const transformJobType = (type: string): string => {
    return jobTypeToText(type);
  };

  const jobTypeCounts: { [key: string]: number } = {};

  jobsData.data.jobs.forEach((job: Job) => {
    const transformedType = transformJobType(job.type);
    jobTypeCounts[transformedType] = (jobTypeCounts[transformedType] || 0) + 1;
  });

  const categories = Object.keys(jobTypeCounts);
  const counts = Object.values(jobTypeCounts);

  const state: JobTypeChartState = {
    series: [{ data: counts }],
  };

  const options: ApexOptions = {
    colors: ["#3C50E0"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "inter",
      markers: {
        radius: 99,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
    },
  };

  return (
    <div className="flex h-100 w-full flex-col items-center justify-center border bg-white shadow-2">
      <div className="flex w-full items-center justify-center">
        <h5 className="font-semibold"> Job type distribution</h5>
      </div>
      <div className="mb-2">
        <div id="JobTypeChart" className="-ml-5">
          {jobsData && jobsData.data && jobsData.data.jobs ? (
            <ApexCharts
              options={options}
              series={state.series}
              type="bar"
              width={"100%"}
              height={200}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTypeChart;
