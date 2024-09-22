"use client";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import dayjs from "dayjs";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import { JobsResponseData } from "@/types/types";
import Loader from "../common/Loader";
import { useState } from "react";
import CalendarGrid from "./CalendarGrid";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, "month"));
    mutate();
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => prevDate.add(1, "month"));
    mutate();
  };

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<JobsResponseData>(config.jobList, fetcher, {
      revalidateOnMount: true,
    });
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <div>Failed to load</div>;

  const buttonNames = ["Previous Month", "Next Month"];

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[45%] gap-3">
          {buttonNames.map((buttonName, index) => (
            <div
              key={index}
              onClick={index === 0 ? goToPreviousMonth : goToNextMonth}
              className="w-[110px] cursor-pointer items-center justify-center rounded-md bg-primary/80 px-1 py-1 text-center text-sm text-white transition hover:bg-opacity-90"
            >
              {buttonName}
            </div>
          ))}
        </div>
        <div className="flex flex-1 font-semibold">
          {currentDate.format("MMMM YYYY")}
        </div>
      </div>
      <CalendarGrid
        isLoading={isLoading || isValidating}
        jobData={data}
        onMutate={mutate}
        currentDate={currentDate}
      />
    </>
  );
};

export default Calendar;
