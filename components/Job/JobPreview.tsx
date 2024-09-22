import React, { FC, useEffect, useMemo, useRef, useState } from "react";

import dayjs from "dayjs";
import { Job, JobStatus } from "@/types/types";

const disabledStatuses = [
  JobStatus.CANCELED,
  JobStatus.DECLINED,
  JobStatus.PENDING_REVIEW,
  JobStatus.PENDING_PAYMENT,
  JobStatus.DONE,
];

const enabledEditStatuses = [JobStatus.LEAD, JobStatus.SCHEDULED];
const enabledDeclineStatuses = [JobStatus.LEAD, JobStatus.SCHEDULED];

type Props = {
  job: Job;
  jobImages: any[];
  jobReports: any[];
  onEdit: () => void;
};

const mockJob = {
  id: "1",
  status: JobStatus.SCHEDULED,
  address: "123 Main St, Springfield",
  email: "client@example.com",
  mobile_number: "1234567890",
  scheduled_start: new Date(),
  type: "Installation",
  amount: 200,
  description: "Install new equipment",
  geoHash: "abcdef",
  customer: {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    address: "123 Main St, Springfield",
    email: "john.doe@example.com",
    mobile_number: "1234567890",
  },
  inspector: {
    employee_id: "2",
    employee: {
      first_name: "Jane",
      last_name: "Smith",
      address: "456 Elm St, Springfield",
    },
  },
  assigned_employees: [
    {
      employee: {
        id: "3",
        first_name: "Bob",
        last_name: "Johnson",
        address: "789 Oak St, Springfield",
      },
    },
  ],
};

const mockImages: any[] = [
  { image_url: "https://via.placeholder.com/150", base64: "" },
];

const mockReports: any[] = [
  { id: "1", description: "Report 1", created_at: new Date() },
];

const JobPreview: FC<Props> = (job: any) => {
  const buttonText = useMemo(() => {
    switch (job.status) {
      case JobStatus.SCHEDULED:
        return "Drive To Location";
      case JobStatus.DRIVING:
        return "Arrived At Location";
      case JobStatus.ARRIVED:
        return "Start Job";
      case JobStatus.STARTED:
        return "Finish Job";
      case JobStatus.FIX_REQUIRED:
        return "Start Fixing";
      case JobStatus.FIXING:
        return "Finish Fixing";
      case JobStatus.PENDING_REVIEW:
        return "Take Job";
      case JobStatus.INSPECTION_REQUIRED:
        return "Start Inspection";
      case JobStatus.REVIEWING:
        return "Approve";
      default:
        return "";
    }
  }, [job.status]);

  const canDecline = useMemo(
    () => enabledDeclineStatuses.includes(job.status),
    [job]
  );
  const canEdit = useMemo(
    () => enabledEditStatuses.includes(job.status),
    [job]
  );
  const buttonDisabled = useMemo(
    () => disabledStatuses.includes(job.status),
    [job]
  );

  return (
    <div
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 1 }}>
        <div></div>
        <div style={{ flex: 1 }}></div>

        {job.description && <div></div>}
      </div>
      <div></div>
    </div>
  );
};
export default JobPreview;
