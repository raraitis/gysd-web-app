import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import useClipboard from "../common/Buttons/CopyButton";
import { QuoteByIdData } from "./QuoteDetailsPage";
import { Card } from "../common/Cards/CompoundCard";
import { Quote } from "@/types/types";

type CustomerDetailsCardProps = {
  quote: QuoteByIdData | Quote;
  className?: string[];
  onClick?: () => void;
};

export default function CustomerDetailsCard({
  quote,
}: Readonly<CustomerDetailsCardProps>) {
  const { CopyButton } = useClipboard();

  return (
    <Card>
      <Card.Title>Customer</Card.Title>
      <Card.Header>
        <Card.Image url={quote.customer.avatar_url} alt="Image of a customer" />
        <Card.FieldRow
          value={`${quote.customer?.first_name} ${quote.customer?.last_name}`}
        />
      </Card.Header>
      {quote.customer.lead_source && (
        <Card.FieldRow
          label={"Lead source"}
          value={quote.customer.lead_source}
        />
      )}
      <Card.FieldRow
        label={"Address"}
        value={quote.customer.address}
        icon={<MapPinIcon height={18} width={18} />}
        ClipboardBtn={<CopyButton value={quote.customer.address} />}
      />

      <Card.FieldRow
        label={"Email"}
        value={quote.customer.email}
        icon={<EnvelopeIcon height={18} />}
        ClipboardBtn={<CopyButton value={quote.customer.email} />}
      />

      <Card.FieldRow
        label={"Phone number"}
        value={quote.customer.mobile_number}
        icon={<PhoneIcon height={18} />}
        ClipboardBtn={<CopyButton value={quote.customer.mobile_number} />}
      />
    </Card>
  );
}
