import React, { useState } from "react";
import { AssignJobResponse, Job, JobStatus } from "@/types/types";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import Loader from "../common/Loader";
import dayjs from "dayjs";
import { JobStatusChip } from "../Job/JobChip";
import { postUrl } from "@/lib/api/common";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface AssignJobModalProps {
  onClose: () => void;
  employeeId: string;
}

export const AssignJobModal: React.FC<AssignJobModalProps> = ({
  onClose,
  employeeId,
}) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);
  const { data: session } = useSession();

  const url =
    debouncedSearchInput && debouncedSearchInput.trim().length > 0
      ? `${config.jobList}?status=LEAD&query=${debouncedSearchInput}`
      : `${config.jobList}?status=LEAD`;

  const {
    data: jobData,
    error,
    isLoading,
    isValidating,
  } = useSWR<any>(url, fetcher, {
    revalidateOnMount: true,
  });

  if (isLoading || isValidating) return <Loader />;
  if (error) return <div>{"Failed to load"}</div>;

  const assignEmployeeToJob = async (jobId: string, employeeId: string) => {
    const response = await postUrl<AssignJobResponse>({
      url: `https://api.therhino.com/api/v1/job/assign`,
      data: { jobId, id: employeeId },
      token: session?.user?.accessToken,
    });

    if (response.status === 200) {
      onClose();
      toast.success("Job assigned!");
    } else {
      toast.error(response.error || "Failed to assign job");
    }
  };

  return (
    <div
      style={{ zIndex: 5 }}
      className="fixed inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 "
    >
      <div
        style={{ zIndex: 3 }}
        className="max-h-2xl absolute max-w-4xl flex-row overflow-y-auto rounded-md bg-white p-8 shadow-md"
      >
        <div className="flex justify-between">
          <h2 className="mb-4 text-lg font-semibold">Leads: </h2>
          <button onClick={onClose} className="text-md cursor-pointer">
            Close
          </button>
        </div>
        <div className="relative mb-5 mt-1">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-bodydark" />
          </button>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <div className="no-scrollbar max-h-96 w-full max-w-4xl overflow-y-auto overflow-x-hidden">
          {jobData?.data?.jobs.map((job: Job) => {
            return (
              <div
                key={job.id}
                className="mb-4 flex cursor-pointer items-center rounded-md border"
              >
                <div className="mx-4 w-60 px-4 py-2">
                  <p className="pb-1 text-gray-600">Job description:</p>
                  <p className="text-lg font-semibold">{job.description}</p>
                </div>
                <div className="mx-4 w-60 px-4 py-2">
                  <p className="pb-1 text-gray-600 ">Created date :</p>
                  <p className="text-lg font-semibold">
                    {dayjs(job.created_at).format("MMM DD YYYY")}
                  </p>
                </div>
                <div className="mx-4 px-4 py-2">
                  <JobStatusChip status={job.status as JobStatus} />
                </div>
                <button
                  onClick={() => assignEmployeeToJob(job.id, employeeId)}
                  className="mr-4 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                >
                  {"Assign"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
