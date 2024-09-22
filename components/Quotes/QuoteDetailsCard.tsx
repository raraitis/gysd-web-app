import { QuoteStatus } from "@/types/types";
import { MapPinIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FieldRow } from "../Job/FieldRow";
import useClipboard from "../common/Buttons/CopyButton";
import { QuoteByIdData } from "./QuoteDetailsPage";
import QuotesStatusChip from "./QuotesStatusChip";
import { Card } from "../common/Cards/CompoundCard";
import JobTypeNameChip from "../Categories/JobTypeNameChip";

type JobDetailsCardProps = {
  quote: QuoteByIdData;
  className?: string[];
};

export default function JobDetailsCard({
  quote,
}: Readonly<JobDetailsCardProps>) {
  const { CopyButton } = useClipboard();
  return (
    <Card>
      <Card.Title>
        Quote Request
        <FieldRow
          value={<QuotesStatusChip type={quote.status as QuoteStatus} />}
          row
        />
        <FieldRow value={<JobTypeNameChip type={quote.jobType} />} row />
      </Card.Title>
      <Card.FieldRow
        value={quote.description}
        valueSize="text-md font-semibold"
      />

      <Card.FieldRow label="Job type" value={quote.jobType} />

      <Card.FieldRow
        label={"Address"}
        value={quote.address}
        icon={<MapPinIcon height={18} />}
        ClipboardBtn={<CopyButton value={quote.address} />}
      />
    </Card>
  );
}
