import React from "react";
import { EmployeeStatus, PastelColors } from "@/types/types";
import { getReadableStatus } from "@/utils/employee-status-to-text";

type AdminTypeChipProps = {
  type: EmployeeStatus;
};

const pastelColors: PastelColors = {
  info: "bg-[#0052CC]/20", // Blue for PENDING
  success: "bg-[#36B37E]/20", // Green for CONFIRMED
  primary: "bg-[#6E76FF]/20", // Purple for DEACTIVATED
  warning: "bg-[#FFAB00]/20", // Yellow for another status (adjust as needed)
  error: "bg-[#FF5630]/20", // Red for another status (adjust as needed)
  default: "bg-[#42526E]/20", // Default color (a muted blue-gray)
};

const EmployeeStatusChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  const getTypeColor = (employeeStatus: EmployeeStatus): keyof PastelColors => {
    switch (employeeStatus) {
      case EmployeeStatus.PENDING:
        return "info";
      case EmployeeStatus.CONFIRMED:
        return "success";
      case EmployeeStatus.DEACTIVATED:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="flex gap-2">
      <div
        className={`font-sans relative grid select-none items-center whitespace-nowrap rounded-md ${
          pastelColors[getTypeColor(type)]
        } px-2 py-1 text-xs font-bold uppercase text-green-900`}
      >
        <span className="dark:text-white/90">{getReadableStatus(type)}</span>
      </div>
    </div>
  );
};

export default EmployeeStatusChip;
