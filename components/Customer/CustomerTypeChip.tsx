import React from "react";
import { AdminTypeChipProps, CustomerType, PastelColors } from "@/types/types";
import { getReadableCustomerType } from "@/utils/customer-type-to-text";

const CustomerTypeChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  const getTypeColor = (employeeStatus: CustomerType): keyof PastelColors => {
    switch (employeeStatus) {
      case CustomerType.BUSINESS:
        return "info";
      case CustomerType.HOMEOWNER:
        return "warning";
      default:
        return "default";
    }
  };

  const pastelColors: PastelColors = {
    info: "bg-[#0052CC]/20", // Blue for PENDING
    warning: "bg-warning/20", // Yellow for another status (adjust as needed)
    default: "bg-[#42526E]/20", // Default color (a muted blue-gray)
  };

  return (
    <div className="flex gap-2">
      <div
        className={`font-sans relative grid select-none items-center whitespace-nowrap rounded-md ${
          pastelColors[getTypeColor(type)]
        } px-2 py-1 text-xs font-bold uppercase text-green-900`}
      >
        <span className="dark:text-white/70">
          {getReadableCustomerType(type)}
        </span>
      </div>
    </div>
  );
};

export default CustomerTypeChip;
