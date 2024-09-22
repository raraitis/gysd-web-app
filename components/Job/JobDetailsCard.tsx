import dayjs from "dayjs";
import { JobStatusChip } from "./JobChip";
import { Job } from "@/types/types";
import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { FieldRow } from "./FieldRow";
import { formatToDollar } from "@/utils/utils";
import useClipboard from "../common/Buttons/CopyButton";
import { Card } from "../common/Cards/CompoundCard";

type JobDetailsCardProps = {
  job: Job;
  className?: string[];
};

export default function JobDetailsCard({ job }: Readonly<JobDetailsCardProps>) {
  const { CopyButton } = useClipboard();
  return (
    <Card>
      <Card.Title>
        {"Job"} <FieldRow value={<JobStatusChip status={job.status} />} row />
      </Card.Title>
      <Card.FieldRow value={job.description} valueSize="text-lg font-bold" />
      <Card.FieldRow label="Amount" value={formatToDollar(job.amount)} />
      <Card.FieldRow label="Job type" value={job.type} />

      <Card.FieldRow
        label={"Address"}
        value={job.address}
        icon={<MapPinIcon height={18} />}
        ClipboardBtn={<CopyButton value={job.address} />}
      />

      <Card.FieldRow
        label={"Scheduled"}
        value={dayjs(job.scheduled_start).format("DD/MM/YYYY")}
        icon={<CalendarIcon height={18} />}
      />
      <Card.FieldRow
        label={"Time"}
        value={dayjs(job.scheduled_start).format("h:mm A")}
        icon={<CalendarIcon height={18} />}
      />
      <Card.FieldRow
        label={"Email"}
        value={job.email}
        icon={<EnvelopeIcon height={18} />}
        ClipboardBtn={<CopyButton value={job.email} />}
      />

      <Card.FieldRow
        label={"Phone number"}
        value={job.mobile_number}
        icon={<PhoneIcon height={18} />}
        ClipboardBtn={<CopyButton value={job.mobile_number} />}
      />

      <Card.FieldRow
        label={"ID"}
        value={job.id}
        ClipboardBtn={<CopyButton value={job.id} />}
      />
    </Card>
  );
}
