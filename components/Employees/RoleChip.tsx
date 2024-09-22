import React from "react";
import { PastelColors, RoleType } from "@/types/types";
import { getReadableRole } from "@/utils/role-to-text";

type AdminTypeChipProps = {
  type: RoleType;
};

const pastelColors: PastelColors = {
  info: "bg-[#5C92B3]/20",
  success: "bg-[#6FAF5F]/20",
  primary: "bg-[#8367A2]/20",
  warning: "bg-[#B38856]/20",
  error: "bg-[#B87474]/20",
  default: "bg-[#7F7F99]/20",
};

const RoleChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  const getTypeColor = (adminType: RoleType): keyof PastelColors => {
    switch (adminType) {
      case RoleType.FIELD_TECH:
        return "info";
      case RoleType.OFFICE_STAFF:
        return "success";
      case RoleType.SUPER:
        return "primary";
      case RoleType.INSTALLER:
        return "warning";
      case RoleType.SALES_REP:
        return "error";
      case RoleType.INSPECTOR:
        return "info";
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
        <span className="dark:text-white/70">{getReadableRole(type)}</span>
      </div>
    </div>
  );
};

export default RoleChip;
