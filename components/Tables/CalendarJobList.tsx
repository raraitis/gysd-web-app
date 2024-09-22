import React, { useState } from "react";
import clsx from "clsx";
import { Job, JobStatus } from "@/types/types";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { JobStatusChip } from "../Job/JobChip";
import useClipboard from "../common/Buttons/CopyButton";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { remove } from "@/lib/api/common";
import axios from "axios";
import { config } from "@/lib/api/config";
import toast from "react-hot-toast";
import useModal from "../common/modal/modal";
import { modalDeleteContent } from "./JobsTable";

interface JobTableProps {
  data: Job[];
  onEdit: (id: string) => void;
  selectedDate: string;
  onMutate: () => void;
}

const columns = [
  "Description",
  "Customer",
  "Address",
  "Status",
  "Type",
  "Scheduled Start",
];

const CalendarJobList: React.FC<JobTableProps> = ({
  data,
  onEdit,
  selectedDate,
  onMutate,
}) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // [

  const router = useRouter();
  const { CopyButton } = useClipboard();
  const { openModal, closeModal, ModalWrapper } = useModal();
  const dateFormatted = dayjs(selectedDate).format("MMM DD YYYY");

  const onDelete = (e: any, job: Job) => {
    setSelectedJob(job);
    openModal();
  };

  const deleteJob = async () => {
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
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
      onMutate();
      setSelectedJob(null);
    }
  };

  return (
    <div className="flex max-h-[100%] min-h-[100%] min-w-[100%] flex-col py-4 shadow-default dark:border-strokedark dark:text-white ">
      <div className="flex w-full items-center justify-between pb-3 pt-4">
        <div className="flex w-full py-4">
          <p className="text-xl font-semibold">Scheduled jobs</p>
        </div>
        <div
          className="flex w-10 cursor-pointer py-4"
          onClick={() => router.push("/job/create")}
        >
          <PlusIcon width={30} />
        </div>
      </div>
      <div className="min-h-[100% no-scrollbar flex max-h-[100%] min-w-[100%] overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left font-semibold dark:bg-meta-4">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="min-w-[120px] px-4 py-4 font-semibold text-black dark:text-white"
                >
                  {column}
                </th>
              ))}
              <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((job: Job, key: number) => (
              <tr
                key={key}
                onClick={() => router.push(`/job/${job.id}`)}
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
                {columns.map((column: string, index: number) => (
                  <td
                    key={index}
                    className="max-w-[300px] overflow-hidden whitespace-nowrap border-b border-[#eee] px-4 py-5 dark:border-strokedark "
                  >
                    {column === "Customer" ? (
                      <p className="text-black dark:text-white">
                        {`${job.customer.first_name} ${job.customer.last_name}`}
                      </p>
                    ) : column === "Status" ? (
                      <JobStatusChip
                        status={job[column.toLowerCase()] as JobStatus}
                      />
                    ) : column === "Description" ? (
                      <p className="w-full truncate">{job.description}</p>
                    ) : column === "Address" ? (
                      <div>
                        {`${job[column.toLowerCase()]}`}
                        <CopyButton value={job.address} />
                      </div>
                    ) : column === "Scheduled Start" ? (
                      <div className="text-black dark:text-white">
                        {dateFormatted}
                      </div>
                    ) : (
                      <p className="text-black dark:text-white">
                        {`${job[column.toLowerCase()]}`}
                      </p>
                    )}
                  </td>
                ))}
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex flex-row gap-2">
                    <PencilSquareIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(job.id);
                      }}
                      className="h-6 w-6"
                    />
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e, job);
                      }}
                      className="h-6 w-6"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedJob && (
        <ModalWrapper
          title={`Delete ${selectedJob?.description}`}
          type="warning"
          content={modalDeleteContent()}
          onOk={deleteJob}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CalendarJobList;
