"use client";

import { config } from "@/lib/api/config";
import { Job, JobStatus, Option } from "@/types/types";
import { useRouter } from "next/navigation";
import PaginationRow from "../Pagination/PaginationRow";
import {
  EyeSlashIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { remove } from "@/lib/api/common";
import toast from "react-hot-toast";
import useModal from "../common/modal/modal";
import clsx from "clsx";
import { JobStatusChip } from "../Job/JobChip";
import { useState } from "react";
import JobTypeChip from "../Job/JobTypeChip";
import useClipboard from "../common/Buttons/CopyButton";
import DropdownCustom from "../Dropdowns/DropdownCustom";

const tabs: Option[] = [
  { id: "0", name: "All", value: "" },
  { id: "1", name: "Lead", value: JobStatus.LEAD },
  { id: "2", name: "Requested", value: JobStatus.REQUEST },
  { id: "3", name: "Scheduled", value: JobStatus.SCHEDULED },
  { id: "4", name: "Declined", value: JobStatus.DECLINED },
  { id: "5", name: "Driving", value: JobStatus.DRIVING },
  { id: "6", name: "Arrived", value: JobStatus.ARRIVED },
  { id: "7", name: "Started", value: JobStatus.STARTED },
  { id: "8", name: "Canceled", value: JobStatus.CANCELED },
  { id: "9", name: "Pending review", value: JobStatus.PENDING_REVIEW },
  { id: "10", name: "Pending payment", value: JobStatus.PENDING_PAYMENT },
  { id: "11", name: "Reviewing", value: JobStatus.IN_REVIEW },
  { id: "12", name: "Fix Required", value: JobStatus.FIX_REQUIRED },
  { id: "13", name: "Fixing", value: JobStatus.FIXING },
  { id: "14", name: "Completed", value: JobStatus.DONE },
];

interface TableJobsProps {
  data: Job[];
  header: React.ReactNode;
  count: number;
  onPageChange: (page: number) => void;
  currentPage: number;
  onSelectStatusFilter: (status: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  mutate: () => void;
}

export const modalDeleteContent = () => (
  <div>
    <p>{"Do you really want to delete this job?"}</p>
  </div>
);

const JobsTable = ({
  data,
  header,
  count,
  onPageChange,
  currentPage,
  onSelectStatusFilter,
  selectedTab,
  setSelectedTab,
  mutate,
}: TableJobsProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // [
  const router = useRouter();

  function onDelete(job: Job) {
    setSelectedJob(job);
    openModal();
  }

  const { openModal, closeModal, ModalWrapper } = useModal();

  const totalPages = Math.ceil(count / 10);

  const nextPage = () => {
    if (!data) {
      return;
    }

    const totalPageCount = totalPages;

    if (currentPage + 1 >= totalPageCount + 1) {
      return;
    }

    onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    if (!data) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    onPageChange(currentPage - 1);
  };

  const onPage = (page: number) => {
    if (currentPage === page) {
      return;
    }

    onPageChange(page);
  };

  const { CopyButton } = useClipboard();

  async function deleteJob() {
    try {
      await remove({
        client: axios,
        url: config.deleteJob,
        config: {
          data: {
            id: selectedJob?.id,
          },
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onResponse: ({ data, status }) => {
          toast.success("Job deleted successfully");
          router.push("/job/jobs");
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
      mutate();
    }
  }

  return (
    <>
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
          "no-scrollbar",
          "h-[100%]"
        )}
      >
        <div className="flex w-full justify-between">
          <div className="z-10 w-[250px]">
            <DropdownCustom
              value={selectedTab}
              options={tabs}
              onOptionSelect={(option) => {
                setSelectedTab(option.value as string);
                onPageChange(1);
              }}
            />
          </div>
          <div
            className="flex w-10 cursor-pointer"
            onClick={() => router.push("/job/create")}
          >
            <PlusIcon width={30} />
          </div>
        </div>

        {header}
        <div
          className={`no-scrollbar flex max-w-full flex-col ${
            count === 0 ? "items-center" : "items-start"
          } justify-center overflow-x-auto`}
        >
          <table className="no-scrollbar w-full table-auto ">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Customer
                </th>
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Address
                </th>
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Statuss
                </th>
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="min-w-[120px] max-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                  Scheduled start
                </th>
                <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                  Edit
                </th>
                <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.length > 0 &&
                data.map((job: Job) => (
                  <tr
                    key={job.id}
                    className={clsx(
                      "dark:bg-boxdarkdark",
                      "border-gray-1",
                      "max-h-90",
                      "cursor-pointer",
                      "overflow-hidden",
                      "dark:border-stroke",
                      "dark:text-white",
                      "md:max-h-90"
                    )}
                  >
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <p className="text-black dark:text-white">
                        {`${job.customer?.first_name} ${job.customer?.last_name}`}
                      </p>
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <h5 className="max-w-[200px] truncate text-black dark:text-white">
                        {job.description}
                      </h5>
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <span className="text-black dark:text-white">
                        {`${job.address}`} <CopyButton value={job.address} />
                      </span>
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <JobStatusChip status={job.status} />
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <p className="text-black dark:text-white">
                        {<JobTypeChip type={job.type} />}
                      </p>
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/job/${job.id}`);
                      }}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      <p className="text-black dark:text-white">
                        {job.scheduled_start &&
                          new Date(job.scheduled_start).toDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <PencilSquareIcon
                        onClick={() => router.push(`/job/edit/${job.id}`)}
                        className="h-6 w-6"
                      />
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <TrashIcon
                        onClick={() => onDelete(job)}
                        className="h-6 w-6"
                      />
                    </td>
                  </tr>
                ))}

              {selectedJob && (
                <ModalWrapper
                  title={`Delete ${selectedJob.description}`}
                  type="warning"
                  content={modalDeleteContent()}
                  onOk={deleteJob}
                  onClose={closeModal}
                />
              )}
            </tbody>
          </table>

          {count === 0 && (
            <div className="flex py-4 hover:cursor-pointer">
              <div className="flex items-center rounded-md border p-2">
                <EyeSlashIcon className="h-6 w-8" />
                <div className="flex px-2">NO DATA</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{ totalEntries: count, totalPages: totalPages }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={onPage}
      />
    </>
  );
};

export default JobsTable;
