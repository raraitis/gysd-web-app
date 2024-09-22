"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import JobPage from "@/components/Job/JobPage";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Breadcrumb pageName="Job" />
      <JobPage id={params.id} />
    </>
  );
};

export default Page;
