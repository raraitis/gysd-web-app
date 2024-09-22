"use client";

import React, { FC, useState } from "react";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { CommonResponse } from "@/types/responses";
import toast from "react-hot-toast";

type Props = {
  id: string;
  isEmployee: boolean;
};

const PasswordChangeModal: FC<Props> = ({ id, isEmployee }) => {
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
          id: id,
          password: newPassword,
          isEmployee: isEmployee,
        },
        config: { method: "PATCH" },
        onResponse: ({ data }) => {
          if (data && !!data.success) {
            toast.success(JSON.stringify(data, null, 2));
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

  return (
    <div>
      <div className="flex max-h-full w-full justify-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
        >
          Change Password
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

export default PasswordChangeModal;
