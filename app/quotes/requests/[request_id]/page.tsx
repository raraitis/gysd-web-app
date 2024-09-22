"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuoteDetailsPage from "@/components/Quotes/QuoteDetailsPage";

const Page = ({ params }: { params: { request_id: string } }) => {
  return (
    <div>
      <Breadcrumb pageName="Quote Request" />
      <QuoteDetailsPage id={params.request_id} />
    </div>
  );
};

export default Page;
