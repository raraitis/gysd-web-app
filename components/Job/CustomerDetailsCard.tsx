import { CustomerStatus, CustomerType, Job } from "@/types/types";
import { useRouter } from "next/navigation";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import CustomerStatusChip from "../Customer/CustomerStatusChip";
import CustomerTypeChip from "../Customer/CustomerTypeChip";
import React from "react";
import useClipboard from "../common/Buttons/CopyButton";
import { Card } from "../common/Cards/CompoundCard";

type CustomerDetailsCardProps = {
  job: Job;
  className?: string[];
  onClick?: () => void;
};

export default function CustomerDetailsCard({
  job,
}: Readonly<CustomerDetailsCardProps>) {
  const router = useRouter();
  const { CopyButton } = useClipboard();
  return (
    <Card
      onClick={() => {
        router.push(`/client/${job.customer.id}`);
      }}
    >
      <Card.Title>Customer</Card.Title>
      <Card.Header>
        <Card.Image url={job.customer.avatar_url} alt="Image of a customer" />
        <Card.FieldRow
          value={`${job.customer?.first_name} ${job.customer?.last_name}`}
        />
        <div className="flex flex-row gap-3">
          {job.customer.status && (
            <CustomerStatusChip type={job.customer?.status as CustomerStatus} />
          )}
          <CustomerTypeChip type={job.customer?.type as CustomerType} />
        </div>
      </Card.Header>
      {job.customer.lead_source && (
        <Card.FieldRow label={"Lead source"} value={job.customer.lead_source} />
      )}
      <Card.FieldRow
        label={"Address"}
        value={job.customer.address}
        icon={<MapPinIcon height={18} width={18} />}
        ClipboardBtn={<CopyButton value={job.customer.address} />}
      />

      <Card.FieldRow
        label={"Email"}
        value={job.customer.email}
        icon={<EnvelopeIcon height={18} />}
        ClipboardBtn={<CopyButton value={job.customer.email} />}
      />

      <Card.FieldRow
        label={"Phone number"}
        value={job.customer.mobile_number}
        icon={<PhoneIcon height={18} />}
        ClipboardBtn={<CopyButton value={job.customer.mobile_number} />}
      />
    </Card>
  );
}
