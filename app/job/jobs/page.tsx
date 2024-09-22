"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import JobsListPage from "@/components/Tables/JobsListPage";

const JobsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Job List" />
      <JobsListPage />
    </>
  );
};

export default JobsPage;
