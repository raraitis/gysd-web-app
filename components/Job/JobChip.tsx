import { JobStatus, PastelColors } from "@/types/types";
import { JobStatusToText } from "@/utils/job-status-to-text";

type Props = {
  label?: string;
  status: JobStatus;
};

const pastelColors: PastelColors = {
  info: "bg-[#2684FF]",
  success: "bg-[#36B37E]",
  primary: "bg-[#6E76FF]",
  warning: "bg-[#6E76FF]",
  error: "bg-[#FF5630]",
  default: "bg-[#6E76FF]",
};

export const JobStatusChip = ({ label, status }: Props) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.LEAD:
        return "info";
      case JobStatus.SCHEDULED:
        return "success";
      case JobStatus.DECLINED:
        return "error";
      case JobStatus.DRIVING:
        return "info";
      case JobStatus.ARRIVED:
        return "info";
      case JobStatus.STARTED:
        return "info";
      case JobStatus.DONE:
        return "success";
      case JobStatus.CANCELED:
        return "warning";
      case JobStatus.FIX_REQUIRED:
        return "warning";
      case JobStatus.FIXING:
        return "info";
      default:
        return "default"; // Default color
    }
  };

  return (
    <span className="flex gap-2">
      <span
        className={`font-sans relative grid select-none items-center whitespace-nowrap rounded-md ${
          pastelColors[getStatusColor(status)]
        } px-2 py-1 text-xs font-bold uppercase`}
      >
        <span className="text-white ">{JobStatusToText(status)}</span>
      </span>
    </span>
  );
};
