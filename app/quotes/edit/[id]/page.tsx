"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import useSWR from "swr";

const Page = ({ params }: { params: { id: string } }) => {
  // const {
  //   data: jobData,
  //   error,
  //   isLoading,
  //   mutate: mutateJobs,
  // } = useSWR<JobResponseData>(config.job + `/${params.id}`, fetcher);

  // if (isLoading) return <Loader />;
  // if (error) return <div>{"No Data"}</div>;

  return (
    <>
      <Breadcrumb pageName="Edit Job" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10"></div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default Page;
