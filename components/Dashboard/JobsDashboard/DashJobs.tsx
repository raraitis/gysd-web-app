import useSWR from "swr";
import { Job, JobStatus, JobsResponseData } from "@/types/types";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import Loader from "@/components/common/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { JobStatusChip } from "@/components/Job/JobChip";
import { Button } from "@/components/Ui/Button";
import AssignJobModal from "./AssignJobModal";
import JobTypeChip from "@/components/Job/JobTypeChip";

interface Tab {
  label: string;
  type: string;
}

const tabs: Tab[] = [
  { label: "All", type: "ALL" },
  { label: "Lead", type: JobStatus.LEAD },
  { label: "Declined", type: JobStatus.DECLINED },
  { label: "Requested", type: JobStatus.REQUEST },
  { label: "Scheduled", type: JobStatus.SCHEDULED },
];

const DashJobs = () => {
  const router = useRouter();
  const [selectedTabs, setSelectedTabs] = useState<Tab[]>([
    {
      label: "All",
      type: "ALL",
    },
  ]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAssignJobModalOpen, setIsAssignJobModalOpen] = useState(false);

  const {
    data: leadsData,
    error: leadsError,
    mutate: leadsMutate,
    isLoading: leadsIsLoading,
  } = useSWR<JobsResponseData>(
    `${config.jobList}?&status=LEAD&limit=0`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const {
    data: requestData,
    error: requestError,
    mutate: requestMutate,
    isLoading: requestIsLoading,
  } = useSWR<JobsResponseData>(
    `${config.jobList}?&status=REQUEST&limit=0`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const {
    data: declindedData,
    error: declindedError,
    mutate: declindedMutate,
    isLoading: declindedIsLoading,
  } = useSWR<JobsResponseData>(
    `${config.jobList}?&status=DECLINED&limit=0`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const {
    data: scheduledData,
    error: scheduledError,
    mutate: scheduledMutate,
    isLoading: scheduledIsLoading,
  } = useSWR<JobsResponseData>(
    `${config.jobList}?&status=SCHEDULED&limit=0`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const [data, setData] = useState<Job[] | []>([]);

  useEffect(() => {
    if (selectedTabs.length === 1 && selectedTabs[0].type === "ALL") {
      setData([
        ...(leadsData?.data?.jobs ?? []),
        ...(requestData?.data?.jobs ?? []),
        ...(declindedData?.data?.jobs ?? []),
        ...(scheduledData?.data?.jobs ?? []),
      ]);
      return;
    }
  }, [
    declindedData?.data?.jobs,
    leadsData?.data?.jobs,
    requestData?.data?.jobs,
    scheduledData?.data?.jobs,
    selectedTabs,
  ]);

  useEffect(() => {
    if (selectedTabs.length === 1 && selectedTabs[0].type === "ALL") {
      setData([
        ...(leadsData?.data?.jobs ?? []),
        ...(requestData?.data?.jobs ?? []),
        ...(declindedData?.data?.jobs ?? []),
        ...(scheduledData?.data?.jobs ?? []),
      ]);
      return;
    }
    const newData = [];
    for (let i = 0; i < selectedTabs.length; i++) {
      if (selectedTabs[i].type === JobStatus.LEAD) {
        newData.push(...(leadsData?.data?.jobs ?? []));
      }
      if (selectedTabs[i].type === JobStatus.REQUEST) {
        newData.push(...(requestData?.data?.jobs ?? []));
      }
      if (selectedTabs[i].type === JobStatus.DECLINED) {
        newData.push(...(declindedData?.data?.jobs ?? []));
      }
      if (selectedTabs[i].type === JobStatus.SCHEDULED) {
        newData.push(...(scheduledData?.data?.jobs ?? []));
      }
    }
    setData(newData);
  }, [selectedTabs]);

  const isLoading =
    leadsIsLoading ||
    requestIsLoading ||
    declindedIsLoading ||
    scheduledIsLoading;

  const isError =
    leadsError || requestError || declindedError || scheduledError;

  function toggleTabInSelectedTabs(tab: Tab) {
    const isTabSelected = selectedTabs.find((item) => item.type === tab.type);
    if (tab.type === "ALL") {
      setSelectedTabs([{ label: "All", type: "ALL" }]);
      return;
    }
    if (!isTabSelected) {
      const newSelectedTabs = selectedTabs.filter(
        (item) => item.type !== "ALL"
      );
      setSelectedTabs([...newSelectedTabs, tab]);
    }
    if (
      isTabSelected &&
      isTabSelected.type === "ALL" &&
      selectedTabs.length === 1
    ) {
      setSelectedTabs([tab]);
    }
    if (selectedTabs.includes(tab)) {
      if (selectedTabs.length === 1) {
        setSelectedTabs([{ label: "All", type: "ALL" }]);
      } else {
        setSelectedTabs(selectedTabs.filter((t) => t !== tab));
      }
    }
  }

  const toggleAssignJobModal = (job?: Job) => {
    if (!job) {
      setIsAssignJobModalOpen(!isAssignJobModalOpen);
      setSelectedJob(null);
      return;
    }
    setSelectedJob(job);
    setIsAssignJobModalOpen(!isAssignJobModalOpen);
  };

  function jobsMutate() {
    leadsMutate(`${config.jobList}?&status=LEAD&limit=0`);
    requestMutate(`${config.jobList}?&status=REQUEST&limit=0`);
    declindedMutate(`${config.jobList}?&status=DECLINED&limit=0`);
    scheduledMutate(`${config.jobList}?&status=SCHEDULED&limit=0`);
  }

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  return (
    <div className="flex overflow-y-auto">
      <div
        className={clsx(
          "rounded-sm",
          "bg-white",
          "px-5",
          "pb-2.5",
          "pt-6",
          "shadow-default",
          "dark:border-strokedark",
          "dark:bg-boxdark",
          "sm:px-7.5",
          "xl:pb-1",
          "overflow-x-auto",
          "h-[100%]",
          "w-[100%]"
        )}
      >
        <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Unassigned jobs
        </h3>
        <div className="flex flex-wrap gap-2 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              className={`md:text-md flex-nowrap truncate rounded bg-blue-500 px-4 py-2 text-white sm:py-2 lg:text-lg  ${
                selectedTabs.find((item) => item.type === tab.type)
                  ? "bg-opacity-70"
                  : "bg-opacity-30"
              }`}
              onClick={() => {
                toggleTabInSelectedTabs(tab);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <table className="w-full table-auto ">
          <thead className="w-full">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className=" max-w-[100%]  px-4 py-4 font-medium text-black dark:text-white">
                Description
              </th>
              <th className=" max-w-[100%] px-4 py-4 font-medium text-black dark:text-white">
                Customer
              </th>
              <th className=" max-w-[100%] px-4 py-4 font-medium text-black dark:text-white">
                Address
              </th>
              <th className=" max-w-[100%] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className=" max-w-[100%] px-4 py-4 font-medium text-black dark:text-white">
                Type
              </th>
              <th className=" max-w-[100%] px-4 py-4 font-medium text-black dark:text-white">
                Scheduled start
              </th>
              <th className=" min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                Assign
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((job: Job) => (
                <tr
                  key={job.id}
                  onClick={() => {
                    router.push(`/job/${job.id}`);
                  }}
                  className="dark:bg-boxdarkdark border-gray-1 w-[100%] cursor-pointer dark:border-stroke dark:text-white"
                >
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="max-w-[200px] truncate font-semibold text-black dark:text-white sm:max-w-[50px] md:max-w-[100px] lg:max-w-[200px]">
                      {job.description}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="max-w-[200px] truncate text-black dark:text-white sm:max-w-[50px] md:max-w-[100px] lg:max-w-[200px]">
                      {`${job?.customer?.first_name} ${job?.customer?.last_name}`}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="max-w-[200px] truncate text-black dark:text-white sm:max-w-[50px] md:max-w-[100px] lg:max-w-[200px]">
                      {`${job.address}`}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <JobStatusChip status={job.status as JobStatus} />
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="max-w-[200px] text-black dark:text-white">
                      <JobTypeChip type={job.type} />
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {job && job.scheduled_start && (
                      <p className="max-w-[200px]sm:max-w-[50px] truncate text-black dark:text-white md:max-w-[100px] lg:max-w-[200px]">
                        {new Date(job.scheduled_start).toDateString()}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="">
                      <Button
                        className="rounded-md"
                        size="xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleAssignJobModal(job);
                        }}
                      >
                        Assign
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {(data.length === 0 || isError) && (
              <tr className="dark:bg-boxdarkdark border-gray-1 cursor-pointer dark:border-stroke dark:text-white">
                <td
                  colSpan={6}
                  className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                >
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isAssignJobModalOpen && selectedJob && (
          <AssignJobModal
            job={selectedJob}
            onClose={() => toggleAssignJobModal()}
            fn={() => jobsMutate()}
          />
        )}
      </div>
    </div>
  );
};

export default DashJobs;
