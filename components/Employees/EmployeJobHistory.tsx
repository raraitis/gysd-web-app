import React, { FC } from "react";
import { EmployeeData } from "@/types/types";
import useSWR from "swr";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import dayjs from "dayjs";
import { JobStatusChip } from "../Job/JobChip";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  EmployeeJob,
  EmployeeJobsResponseData,
} from "@/pages/api/employee/employee-jobs";
import useClipboard from "../common/Buttons/CopyButton";

type JobHeader =
  | "id"
  | "description"
  | "address"
  | "status"
  | "type"
  | "amount";

type Props = {
  employee: EmployeeData;
  onSubmit?: (values: EmployeeData) => void;
};

const EmployeJobHistory: FC<Props> = ({ employee }) => {
  const router = useRouter();
  const { CopyButton } = useClipboard();

  const url = `${config.employeeJobList}?id=${employee.id}`;

  const {
    data: jobs,
    error,
    isLoading,
  } = useSWR<CommonResponse<EmployeeJobsResponseData>>(url, fetcher);

  if (!jobs?.data?.employeeJobs || error) {
    return <div>{"No Data"}</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

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
      <h2 className="mb-2 text-lg font-semibold">Assigned jobs</h2>
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col gap-3">
          {jobs &&
            jobs.data.employeeJobs.length !== 0 &&
            jobs.data &&
            jobs.data?.count &&
            jobs.data?.count !== 0 && (
              <div className="flex w-full flex-row justify-between px-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex flex-1 font-semibold">
                    {header}
                  </div>
                ))}
              </div>
            )}
          <div className="no-scrollbar flex max-h-90 flex-col gap-3 overflow-y-auto">
            {jobs.data.employeeJobs.map((job: EmployeeJob, key: number) => (
              <div
                key={job.job_id}
                onClick={() => router.replace(`/job/${job.job_id}`)}
                className="flex w-full cursor-pointer items-center justify-between rounded-md border p-2"
              >
                {headers.map((header: string, index: number) => (
                  <div
                    key={index}
                    className={`mx-1 flex flex-1 ${
                      index === 0 ? "max-w-[200px] truncate font-semibold" : ""
                    }`}
                  >
                    {header === "Start date" ? (
                      dayjs(job.job.scheduled_start).format("MMMM DD, YYYY")
                    ) : header === "Status" ? (
                      <JobStatusChip status={job.job.status} />
                    ) : header === "Type" ? (
                      job.job.type
                    ) : header === "Address" ? (
                      <div className="max-w-[200px] truncate">
                        {job.job.address}
                      </div>
                    ) : (
                      job.job[header.toLowerCase() as JobHeader] ?? null
                    )}
                  </div>
                ))}
              </div>
            ))}
            {(!jobs.data || jobs.data?.count === 0) && (
              <div className="flex w-full items-center justify-center py-6">
                <div className="flex gap-2 rounded-md border-2 p-3">
                  <span>{"NO DATA"}</span>
                  <EyeSlashIcon height={24} width={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeJobHistory;
