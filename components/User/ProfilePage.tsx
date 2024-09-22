"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient"; // Import postUrl function
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { EmployeeData } from "@/types/types";
import { CommonResponse } from "@/types/responses";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import RoleChip from "../Employees/RoleChip";
import UserPageDetails from "./UserPageDetails";
import { UserIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const {
    data: employee,
    error,
    isLoading,
    mutate,
  } = useSWR<CommonResponse<EmployeeData>>(config.getEmployee, fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoadingPasswordChange(true);
    try {
      await postUrl<CommonResponse>({
        url: config.pswChange,
        data: {
          id: "cbea2530-677e-4af2-8b0c-708094cdf920",
          password: newPassword,
          isEmployee: true,
        },
        config: { method: "PATCH" },
        onResponse: ({ data }) => {
          if (data && !!data.success) {
            setIsModalOpen(false);
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            toast.success("Password changed successfully");
            return data.success;
          }
        },
        onError: (error: any) => {
          setPasswordError(
            error?.response?.data?.error ?? "Something went wrong."
          );
          setIsLoadingPasswordChange(false);
          return false;
        },
      });
    } catch (e) {
      console.log("Password change error:", e);
      setPasswordError("An error occurred. Please try again.");
      return false;
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

  if (isLoading) return;
  if (error) return <div>{"No Data"}</div>;

  return (
    <div>
      <Breadcrumb pageName={"Profile information"} />
      <div className="flex max-h-full w-full justify-center gap-4">
        <div className="flex w-5/6 flex-col items-center justify-center rounded-md border-2 border-gray-200 p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-center p-3 ">
              <div className="rounded-3xl border-2 border-gray-200 p-3 opacity-80 shadow-2">
                <UserIcon width={60} />
              </div>
            </div>
            {employee && employee.data && (
              <div className="flex w-full flex-col items-center">
                <h2 className="text-grey-900 font-semibold dark:text-white">
                  {employee?.data?.first_name} {employee?.data?.last_name}
                </h2>
                <div className="flex flex-row gap-3">
                  <RoleChip type={employee?.data.role} />
                  <EmployeeStatusChip type={employee?.data?.status} />
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            {employee && employee.data && (
              <UserPageDetails user={employee?.data} />
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Change Password
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
            <input
              type="password"
              placeholder="New Password"
              className="mb-2 w-full rounded border p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="mb-2 w-full rounded border p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <div className="mb-2 text-red-500">{passwordError}</div>
            )}
            <button
              onClick={handlePasswordChange}
              className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              disabled={isLoadingPasswordChange}
            >
              {isLoadingPasswordChange ? "Loading..." : "Submit"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
