"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuotesList from "@/components/Tables/QuotesList";

const JobsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Quotes List" />
      <div className="flex flex-col gap-10">
        <QuotesList />
      </div>
    </>
  );
};

export default JobsPage;
