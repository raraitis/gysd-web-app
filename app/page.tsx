import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RHINO | Admin",
  description: "Administration page for RHINO employees.",
  // other metadata
};

export default async function Home() {
  return (
    <>
      <Breadcrumb pageName="Dashboard" />
      <div className="pb-10">
        <MainDashboard />
      </div>
    </>
  );
}
