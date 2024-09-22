import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CustomerForm from "@/components/Forms/CustomerForm";

const CreateClientPage = () => {
  return (
    <>
      <Breadcrumb pageName="Add Customer" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10">
          <CustomerForm />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default CreateClientPage;
