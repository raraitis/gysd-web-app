import React, { FC, useState } from "react";
import {
  EmployeeComissionResponse,
  EmployeeData,
  EmployeeStatus,
  RoleType,
} from "@/types/types";
import EmployeeForm from "./EmployeeForm";
import { AssignJobModal } from "../Employees/AssignJobModal";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import useSWR from "swr";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import SmallMaps from "../User/SmallMaps";
import { CommonResponse } from "@/types/responses";
import Loader from "../common/Loader";
import RoleChip from "../Employees/RoleChip";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import useModal from "../common/modal/modal";
import { emoloyeeActionModal } from "../Tables/EmployeeList";
import UserPageDetails from "../User/UserPageDetails";
import CommissionCard from "./CommissionCard";
import PasswordChangeModal from "../User/PasswordChangeModal";

type Props = {
  employee: EmployeeData;
  onSubmit: () => void;
  onMutate: () => void;
};

const EmployeeCard: FC<Props> = ({ employee, onSubmit, onMutate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAssignJobModalOpen, setIsAssignJobModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { openModal, closeModal, ModalWrapper } = useModal();
  const [imageError, setImageError] = React.useState(false);

  const {
    data: employeeCommision,
    error,
    isLoading: isEmployeeCommisionLoading,
  } = useSWR<EmployeeComissionResponse>(
    config.employeeCommisionTotalById + `${employee.id}`,
    fetcher,
    {
      refreshInterval(latestData) {
        if (!latestData) return 1000;
        return 0;
      },
    }
  );

  if (isEmployeeCommisionLoading) {
    return <Loader />;
  }

  const toggleAssignJobModal = () => {
    setIsAssignJobModalOpen(!isAssignJobModalOpen);
  };

  const propertyMap = {
    ID: employee.id,
    "First Name": employee.first_name,
    "Last Name": employee.last_name,
    Email: employee.email,
    Role: employee.role,
    Status: employee.status,
    Address: employee.address,
    Mobile: employee.mobile_number,
    "Created At": employee.created_at,
  };

  const showCommission =
    propertyMap.Role === RoleType.SALES_REP ||
    propertyMap.Role === RoleType.INSPECTOR ||
    propertyMap.Role === RoleType.INSTALLER;

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEditSubmit = async (
    employeeId: string,
    updatedEmployee: Partial<EmployeeData>
  ) => {
    const editedData = {
      id: employeeId,
      ...updatedEmployee,
    };

    try {
      const response = await postUrl<CommonResponse>({
        url: config.editEmployee,
        data: editedData,
        config: { method: "PATCH" },
        onResponse: ({ data }) => {
          if (data && data.success) {
            toast.success("Saved!");
            return data.success;
          } else {
            toast.error("Failed to save changes.");
          }
        },
        onError: (error: any) => {
          toast.error("An error occurred while saving changes.");
        },
      });

      if (!response) {
        return false;
      }
    } catch (error) {
      toast.error("An error occurred while saving changes.");
      return false;
    } finally {
      setIsEditMode(false);
    }
    onSubmit();
    setIsEditMode(false);
  };

  const handleReactivation = async (id: string) => {
    try {
      await postUrl<any>({
        url: config.reactivateEmployee,
        config: {
          method: "PATCH",
        },
        data: {
          id,
        },

        onError: (error) => {
          toast.error(error.message);
          closeModal();
        },
        onResponse: ({ data, status }) => {
          closeModal();
          toast.success(`Employee activated successfully`);
          onMutate();
        },
      });
    } catch (error) {
      closeModal();
      toast.error("Failed to activate employee!");
    } finally {
      closeModal();
      onMutate();
    }
  };

  const imageUrl = employee.avatar_url;
  console.log(imageUrl);

  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);

      return <img src={blobUrl} alt="Avatar" />;
    });

  return (
    <div className="flex items-center justify-center " style={{ zIndex: 2 }}>
      {isEditMode ? (
        <EmployeeForm
          employee={employee}
          commission={employeeCommision?.data.commission}
          onEdit={() => setIsEditMode(false)}
          onSubmit={(
            employeeId: string,
            updatedEmployee: Partial<EmployeeData>
          ) => handleEditSubmit(employeeId, updatedEmployee)}
        />
      ) : (
        <div
          className={`h-full w-full rounded-md bg-white p-4 shadow-md dark:bg-boxdark`}
          style={{
            maxHeight: isCollapsed ? "64px" : "none",
          }}
        >
          <div
            className="flex flex-row justify-between"
            style={{
              paddingBottom: isCollapsed ? "none" : "10px",
            }}
          >
            <h2 className="mb-2 text-lg font-semibold">Employee Information</h2>
            <button
              className="ml-2 rounded-md px-4 py-2 text-black transition hover:bg-opacity-90"
              onClick={handleCollapseToggle}
            >
              {isCollapsed ? (
                <ChevronDownIcon height={18} width={18} />
              ) : (
                <ChevronUpIcon height={18} width={18} />
              )}
            </button>
          </div>
          {!isCollapsed && (
            <div className="flex flex-1 flex-row gap-3">
              {isAssignJobModalOpen && employee.id && (
                <div style={{ zIndex: 5 }}>
                  <AssignJobModal
                    employeeId={employee.id}
                    onClose={toggleAssignJobModal}
                  />
                </div>
              )}
              <div className="flex w-1/2 flex-col rounded-md border-2 border-gray-200 p-3 shadow-md">
                <div className="flex w-full flex-row justify-end gap-2">
                  <div>
                    <PasswordChangeModal id={employee.id} isEmployee={true} />
                  </div>
                  <button
                    className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                  </button>
                  {!isEditMode &&
                  employee.status !== EmployeeStatus.DEACTIVATED ? (
                    <div className="flex flex-row gap-2">
                      <button
                        className="cursor-pointer rounded-md bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
                        onClick={toggleAssignJobModal}
                      >
                        Assign Job
                      </button>
                      <button
                        className="cursor-pointer rounded-md bg-red-600/80 px-4 py-1 text-white transition hover:bg-opacity-90"
                        onClick={openModal}
                      >
                        <div className="opacity-1">Deactivate</div>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="cursor-pointer rounded-md bg-green-600 px-4 py-1 text-white transition hover:bg-opacity-90"
                      onClick={openModal}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 py-4">
                  <div className="flex w-full items-center justify-center gap-2 p-3">
                    {/* <UserIcon width={60} /> */}
                    {/* <image href={imageUrl} /> */}
                    {imageUrl && !imageError ? (
                      <img
                        className="h-24 w-24 rounded-3xl border-2 border-gray-200 opacity-80 shadow-2"
                        src={imageUrl}
                        alt="User avatar"
                        onError={(e) => {
                          setImageError(true);
                        }}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-3xl border-2 border-gray-200 opacity-80 shadow-2">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                  {employee && (
                    <div className="flex w-full flex-col items-center gap-1">
                      <h2 className="text-grey-900 font-semibold dark:text-white">
                        {employee?.first_name} {employee?.last_name}
                      </h2>
                      <div className="flex flex-row gap-3">
                        <RoleChip type={employee.role} />
                        <EmployeeStatusChip type={employee?.status} />
                      </div>
                      <div className="flex w-full">
                        {employee && (
                          <UserPageDetails
                            user={employee}
                            commissions={true}
                            amount={employeeCommision?.data.commission}
                            submit={onSubmit}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {employee && employee.geoHash && !isCollapsed && (
                <div className="flex w-1/2 flex-1 flex-col rounded-md border-2 border-gray-200 shadow-md">
                  <SmallMaps hash={employee?.geoHash} />
                </div>
              )}
            </div>
          )}
          <ModalWrapper
            title={`Activate ${employee.first_name} ${employee.last_name}`}
            type="warning"
            content={emoloyeeActionModal(employee?.status as EmployeeStatus)}
            onOk={() => handleReactivation(employee?.id ?? "")}
            onClose={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
