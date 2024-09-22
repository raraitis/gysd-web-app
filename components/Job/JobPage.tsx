"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { JobResponseData } from "@/types/types";
import { config } from "@/lib/api/config";
import { remove } from "@/lib/api/common";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useModal from "../common/modal/modal";
import { JobDetails } from "./JobDetails";
import InvoiceCard from "./InvoiceCard";

const JobPage = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR<JobResponseData>(
    config.job + `/${id}`,
    fetcher
  );

  const { openModal, closeModal, ModalWrapper } = useModal();

  function onDelete() {
    openModal();
  }

  async function deleteJob() {
    await remove({
      client: axios,
      url: config.deleteJob,
      config: {
        data: {
          id: id,
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
  }

  const modalDeleteContent = () => (
    <div>
      <p>{"Do you really want to delete this job?"}</p>
    </div>
  );

  if (error) return <div>Failed to load</div>;

  return (
    <div className="no-scrollbar rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="no-scrollbar max-w-full overflow-x-auto">
        {data?.data && (
          <JobDetails
            onAssign={() => mutate(config.job + `/${id}`)}
            job={data?.data}
            delete={onDelete}
          />
        )}
        {!data?.data && !isLoading && (
          <div className="dark:bg-boxdarkdark no-scrollbar dark:border-string-stroke flex cursor-pointer dark:text-white">
            <div className="px-4 py-4 text-black dark:text-white">
              No data found
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex w-full items-center justify-center py-4">
            <LoadingIndicatorSmall />
          </div>
        )}

        <ModalWrapper
          title={`Delete ${data?.data?.description || ""}`}
          content={modalDeleteContent()}
          type="warning"
          onOk={() => {
            deleteJob();
            closeModal();
          }}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default JobPage;
