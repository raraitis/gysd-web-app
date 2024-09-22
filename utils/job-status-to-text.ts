import { JobStatus } from "@/types/types";
import { Option } from "@/types/types";

export const JobStatusToText = (status?: JobStatus | string) => {
  if (!status) {
    return "";
  }

  switch (status) {
    case JobStatus.LEAD:
      return "Lead";
    case JobStatus.SCHEDULED:
      return "Scheduled";
    case JobStatus.DECLINED:
      return "Declined";
    case JobStatus.DRIVING:
      return "Driving";
    case JobStatus.ARRIVED:
      return "Arrived";
    case JobStatus.STARTED:
      return "Started";
    case JobStatus.CANCELED:
      return "Cancelled";
    case JobStatus.PENDING_REVIEW:
      return "Pending Review";
    case JobStatus.PENDING_PAYMENT:
      return "Pending Payment";
    case JobStatus.FIX_REQUIRED:
      return "Fix Required";
    case JobStatus.FIXING:
      return "Fix In Progress";
    case JobStatus.DONE:
      return "Completed";
    case JobStatus.REQUEST:
      return "Request";
    case JobStatus.IN_REVIEW:
      return "In Review";
    case JobStatus.INSPECTION_REQUIRED:
      return "Inspection Required";
    case JobStatus.REVIEWING:
      return "Reviewing";
    default:
      return status;
  }
};

export const tabs: Option[] = [
  { id: "0", name: "All", value: "" },
  { id: "1", name: "Lead", value: JobStatus.LEAD },
  { id: "2", name: "Requested", value: JobStatus.REQUEST },
  { id: "3", name: "Scheduled", value: JobStatus.SCHEDULED },
  { id: "4", name: "Declined", value: JobStatus.DECLINED },
  { id: "5", name: "Driving", value: JobStatus.DRIVING },
  { id: "6", name: "Arrived", value: JobStatus.ARRIVED },
  { id: "7", name: "Started", value: JobStatus.STARTED },
  { id: "8", name: "Canceled", value: JobStatus.CANCELED },
  { id: "9", name: "Pending review", value: JobStatus.PENDING_REVIEW },
  { id: "10", name: "Pending payment", value: JobStatus.PENDING_PAYMENT },
  { id: "11", name: "Reviewing", value: JobStatus.IN_REVIEW },
  { id: "12", name: "Fix Required", value: JobStatus.FIX_REQUIRED },
  { id: "13", name: "Fixing", value: JobStatus.FIXING },
  { id: "14", name: "Completed", value: JobStatus.DONE },
  { id: "15", name: "Inspection Required", value: JobStatus.INSPECTION_REQUIRED },
];
