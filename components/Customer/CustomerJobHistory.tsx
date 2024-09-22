import React, { FC, useState } from "react";
import {
  Customer,
  CustomerJob,
  CustomerJobResponseData,
  EmployeeData,
  JobStatus,
} from "@/types/types";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import dayjs from "dayjs";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { CommonResponse } from "@/types/responses";
import { jobTypeToText } from "@/utils/job-type-to-text";
import { JobStatusChip } from "../Job/JobChip";

type Props = {
  customer?: Customer;
  onSubmit?: (values: EmployeeData) => void;
};

const CustomerJobHistory: FC<Props> = ({ customer }) => {
  const router = useRouter();

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const url = `${config.customerJobList}?id=${customer?.id}&direction=${sortDirection}`;

  const {
    data: jobs,
    error,
    mutate,
    isLoading,
  } = useSWR<CommonResponse<CustomerJobResponseData>>(url, fetcher);

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  if (!jobs || error) return <div>{"No Data"}</div>;
  if (isLoading) return <Loader />;

  const headers = [
    "Description",
    "Address",
    "Start date",
    "Status",
    "Type",
    "Amount",
  ];

  return (
    <div className="w-full rounded-md bg-white p-4 shadow-md dark:bg-boxdark">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col">
          {jobs.data &&
            jobs.data.count !== undefined &&
            jobs.data.count !== 0 && (
              <div className="flex w-full flex-row justify-between px-2">
                {headers.map((header, index) => (
                  <div key={index} className={`flex flex-1 font-semibold`}>
                    {header}
                  </div>
                ))}
              </div>
            )}
          <div className="no-scrollbar flex h-[100%] flex-col gap-3 overflow-y-auto">
            {jobs && jobs.data && jobs?.data.jobs && jobs?.data.count > 0 ? (
              jobs?.data.jobs.map((job: CustomerJob, key: number) => (
                <div
                  key={key}
                  onClick={() => router.replace(`/job/${job.id}`)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md border px-1 py-2"
                >
                  {headers.map((header, index) => (
                    <div
                      key={index}
                      className={`mx-1 flex flex-1 ${
                        index === 0
                          ? "max-w-[200px] truncate  font-semibold"
                          : index === 5
                          ? "max-w-[200px] truncate"
                          : "max-w-[200px] truncate"
                      }`}
                    >
                      {header === "Start date" ? (
                        dayjs(job.scheduled_start).format("MMMM DD, YYYY")
                      ) : header === "Amount" ? (
                        `$${job.amount}`
                      ) : header === "Status" ? (
                        <JobStatusChip status={job.status as JobStatus} />
                      ) : header === "Type" ? (
                        jobTypeToText(job.type)
                      ) : header === "Address" ? (
                        <p className="max-w-[200px] truncate">{job.address}</p>
                      ) : (
                        job[header.toLowerCase()] ?? null
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex w-full items-center justify-center rounded-md border p-2">
                <EyeSlashIcon className="h-6 w-8" />
                <div className="flex px-2">NO DATA</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobHistory;
