import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import JobForm from "@/components/Forms/JobForm";

const JobFormPage = () => {
  return (
    <>
      <Breadcrumb pageName="Add Job" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10">
          <JobForm />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default JobFormPage;
