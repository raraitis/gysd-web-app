import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

import React from "react";
import useClipboard from "../common/Buttons/CopyButton";
import { QuoteByIdData } from "./QuoteDetailsPage";
import { Card } from "../common/Cards/CompoundCard";
import { Quote } from "@/types/types";

type SalesRepDetailsCardProps = {
  quote: QuoteByIdData | Quote;
  className?: string[];
  onClick?: () => void;
};

export default function SalesRepDetailsCard({
  quote,
}: Readonly<SalesRepDetailsCardProps>) {
  const { CopyButton } = useClipboard();
  return (
    <Card>
      <Card.Title>Sales rep</Card.Title>
      <Card.Header>
        <Card.Image alt="Image of a sales rep" />
        <Card.FieldRow
          value={`${quote.sales_rep?.employee.first_name} ${quote.sales_rep?.employee.last_name}`}
        />
      </Card.Header>
      <Card.FieldRow
        label={"Email"}
        value={quote.sales_rep.employee.email}
        icon={<EnvelopeIcon height={18} />}
        ClipboardBtn={<CopyButton value={quote.sales_rep.employee.email} />}
      />

      <Card.FieldRow
        label={"Phone number"}
        value={quote.sales_rep.employee.email}
        icon={<PhoneIcon height={18} />}
        ClipboardBtn={<CopyButton value={quote.sales_rep.employee.email} />}
      />
    </Card>
  );
}
