"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useAdminOnly } from "@/utils/use-admin-only";
import { RoleType } from "@/types/user";
import { redirect } from "next/navigation";
import Link from "next/link";

const SelectedGroupSection: React.FC = () => {
  const isSuperAdmin = useAdminOnly({
    redirect: false,
    blockRoles: [RoleType.ADMIN],
  });
  const { data: session, update } = useSession();

  const hasSessionAccountId = session && session.user && session.user.id;
  const sessionAccountId = session?.user?.id;
  const canPerformAction =
    isSuperAdmin && hasSessionAccountId && sessionAccountId !== "0001";

  if (!canPerformAction) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center gap-x-3">
      <Link href={"/admin/group/list"}>
        <div className="justify-star flex items-center gap-x-2 rounded-sm border border-stroke bg-white p-2 shadow-default hover:cursor-pointer dark:border-strokedark dark:bg-boxdark">
          <div className="text-title-sm font-bold text-black dark:text-white">
            {sessionAccountId}
          </div>
          <div className="text-sm font-medium">{"Selected Group"}</div>
        </div>
      </Link>
      <div
        className="flex h-10 w-20 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-25"
        onClick={async () => {
          await update({ account_id: "0001" });
          window.location.reload();
        }}
      >
        {"Reset"}
      </div>
    </div>
  );
};

export default SelectedGroupSection;
