"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import JobRequestPage from "@/components/Quotes/QuoteDetailsPage";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Breadcrumb pageName="Quote" />
      <div className="flex h-full w-full flex-col">
        <JobRequestPage id={params.id} />
      </div>
    </>
  );
};

export default Page;
