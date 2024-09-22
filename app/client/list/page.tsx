import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CustomerList from "@/components/Tables/CustomerList";


const ClientsListPage = async () => {
  return (
    <>
      <Breadcrumb pageName="Customer List" />
      <div className="flex flex-col gap-10">
        <CustomerList />
      </div>
    </>
  );
};

export default ClientsListPage;
