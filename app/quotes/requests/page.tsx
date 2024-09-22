import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import JobRequestList from "@/components/Tables/JobRequestList";

const JobFormPage = () => {
  return (
    <>
      <Breadcrumb pageName="Quote requests" />
      <div className="flex flex-col gap-10">
        <JobRequestList />
      </div>
    </>
  );
};

export default JobFormPage;
