import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EmployeeList from "@/components/Tables/EmployeeList";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth";

const AdminUsersList = async () => {
  const session = await getServerSession(nextauthOptions);

  return (
    <>
      <Breadcrumb pageName="Employees List" />
      <div className="flex flex-col gap-10">
        <EmployeeList />
      </div>
    </>
  );
};

export default AdminUsersList;
