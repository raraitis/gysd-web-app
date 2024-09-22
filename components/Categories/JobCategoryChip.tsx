import React from "react";
import { JobCategories, PastelColors } from "@/types/types";

type AdminTypeChipProps = {
  type: JobCategories;
};

const pastelColors: PastelColors = {
  info: "bg-[#0052CC]/20",
  success: "bg-[#36B37E]/20",
  primary: "bg-[#6E76FF]/20",
  warning: "bg-[#FFAB00]/20",
  error: "bg-[#FF5630]/20",
  default: "bg-[#42526E]/20",
};

const JobCategoryChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  const getTypeColor = (employeeStatus: JobCategories): keyof PastelColors => {
    switch (employeeStatus) {
      case JobCategories.CLEANING:
        return "info";
      case JobCategories.GUTTERS:
        return "success";
      case JobCategories.PAVERS:
        return "error";
      case JobCategories.RESTORATION:
        return "warning";
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
        <span className="dark:text-white/70">{type}</span>
      </div>
    </div>
  );
};

export default JobCategoryChip;
