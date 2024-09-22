import EmployeeForm from "@/components/Forms/EmployeeForm";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
const SuperAdmin = () => {
  return (
    <>
      <Breadcrumb pageName="Create Employee" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10">
          <EmployeeForm />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default SuperAdmin;
