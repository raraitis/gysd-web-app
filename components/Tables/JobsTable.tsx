"use client";

import { config } from "@/lib/api/config";
import { Job } from "@/types/types";
import { useRouter } from "next/navigation";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { remove } from "@/lib/api/common";
import toast from "react-hot-toast";
import useModal from "../common/modal/modal";
import clsx from "clsx";
import { JobStatusChip } from "../Job/JobChip";
import { FC, useState } from "react";
import JobTypeChip from "../Job/JobTypeChip";
import { mainClient } from "@/lib/api";

export const modalDeleteContent = () => (
  <div>
    <div>{"Do you really want to delete this job?"}</div>
  </div>
);

interface Props {
  onMutate: () => void;
  data: Job[];
  count: number;
}

const JobsTable: FC<Props> = ({ onMutate, data, count }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const router = useRouter();

  const { openModal, closeModal, ModalWrapper } = useModal();

  function onDelete(e: any, job: Job) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedJob(job);
    openModal();
  }

  async function deleteJob() {
    try {
      await remove({
        client: mainClient,
        url: config.deleteJob,
        config: {
          data: {
            id: selectedJob?.id,
          },
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.message);
          } else {
            toast.error(error);
          }
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
      onMutate();
    }
  }

  return (
    <table className="w-full table-auto ">
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
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="">
        {data &&
          data.length > 0 &&
          data.map((job: Job) => (
            <tr
              key={job.id}
              onClick={() => {
                router.push(`/job/${job.id}`);
              }}
              className={clsx(
                "dark:bg-boxdarkdark",
                "border-gray-1",
                "max-h-90",
                "cursor-pointer",
                "overflow-hidden",
                "dark:border-stroke",
                "dark:text-white",
                "md:max-h-90",
                "justify-center",
                "items-center"
              )}
            >
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <div className="max-w-[200px] truncate text-black dark:text-white">
                  {`${job.customer?.first_name} ${job.customer?.last_name}`}
                </div>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <h5 className="max-w-[200px] truncate text-black dark:text-white">
                  {job.description}
                </h5>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <div className="max-w-[200px] truncate text-black dark:text-white">
                  {job.address}
                </div>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <JobStatusChip status={job.status} />
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <div className="text-black dark:text-white">
                  {<JobTypeChip type={job.type} />}
                </div>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <div className="max-w-[200px] truncate text-black dark:text-white">
                  {job.scheduled_start &&
                    new Date(job.scheduled_start).toDateString()}
                </div>
              </td>
              <td className="mt-[20%] flex justify-center gap-2">
                <PencilSquareIcon
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/job/edit/${job.id}`);
                  }}
                  className="w-6"
                />
                <TrashIcon className="w-6" onClick={(e) => onDelete(e, job)} />
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
  );
};

export default JobsTable;
