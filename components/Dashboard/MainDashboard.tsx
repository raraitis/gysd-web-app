"use client";

import React from "react";
import DashCustomerCount from "./DashCustomerCount";
import DashEmployeeCount from "./DashAdminUserCount";
import SmallCalendarWidget from "../Calender/SmallCalendarWidget";
import { useRouter } from "next/navigation";
import DashJobs from "./JobsDashboard/DashJobs";
import JobCountTotal from "./JobsDashboard/JobCountTotal";
import { useRole } from "@/utils/parseJwt";
import clsx from "clsx";
import DashWithdrawals from "./JobsDashboard/DashWithdrawals";
import { RoleType } from "@/types/types";
import PendingInstallersCount from "./PendingInstallersCount";
import JobRequestList from "../Tables/JobRequestList";
import QuoteRequestCount from "./QuoteRequestCount";

const MainDashboard: React.FC = () => {
  const isSalesAdminSuper = useRole([
    RoleType.SUPER,
    RoleType.ADMIN,
    RoleType.SALES_REP,
  ]);

  const isAdminSuper = useRole([RoleType.SUPER, RoleType.ADMIN]);

  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-row gap-3">
        <div className="flex-1">
          <SmallCalendarWidget onWidgetClick={() => router.push("/calendar")} />
        </div>
        {/* <div className="flex-1">
          <CustomerTypeChart />
        </div>
        <div className="flex-1">
          <JobTypeChart />
        </div> */}
      </div>
      <div className="grid w-full grid-cols-5 gap-2">
        <div
          className="col-span-1 cursor-pointer"
          onClick={() => router.push("/client/list")}
        >
          <DashCustomerCount />
        </div>
        <div
          className="col-span-1 cursor-pointer"
          onClick={() => router.push("/super/list")}
        >
          <DashEmployeeCount />
        </div>
        <div
          className="col-span-1 cursor-pointer"
          onClick={() => router.push("/quotes/requests")}
        >
          <QuoteRequestCount />
        </div>
        <div
          className="col-span-1 cursor-pointer"
          onClick={() => router.push("/job/jobs")}
        >
          <JobCountTotal />
        </div>
        <div className="col-span-1 ">
          <PendingInstallersCount />
        </div>
      </div>

      <div
        className={clsx(
          "grid",
          "sx:grid-cols-1 sm:grid-cols-1",
          "md:grid-cols-2",
          "lg:grid-cols-2",
          "xl:grid-cols-3",
          "gap-x-3 gap-y-3"
        )}
      >
        {isSalesAdminSuper && (
          <div className={clsx("col-span-3")}>
            <JobRequestList
              search={false}
              title={"Unassigned quote requests"}
            />
          </div>
        )}
        {isSalesAdminSuper && (
          <div className={clsx("col-span-3")}>
            <DashJobs />
          </div>
        )}
        {isAdminSuper && (
          <div className={clsx("col-span-3")}>
            <DashWithdrawals />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;
