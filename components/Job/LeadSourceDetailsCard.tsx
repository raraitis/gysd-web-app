import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { EmployeeData, EmployeeResponseData } from "@/types/types";
import { clsxm } from "@/utils/clsxm";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import useSWR from "swr";
import { FieldRow } from "./FieldRow";
import { useRouter } from "next/navigation";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import RoleChip from "../Employees/RoleChip";
import React from "react";
import useClipboard from "../common/Buttons/CopyButton";
import { Card } from "../common/Cards/CompoundCard";

type LeadSourceDetailsCardProps = {
  leadSource: string;
  className?: string[];
  onClick?: () => void;
};

export type EmployesResponseData = {
  data: { count: number; employees: EmployeeData };
};

export default function LeadSourceDetailsCard({
  leadSource,
  className,
  onClick,
}: Readonly<LeadSourceDetailsCardProps>) {
  const [imageError, setImageError] = React.useState(false);
  const navigation = useRouter();
  const { CopyButton } = useClipboard();
  const {
    data: leadSourceData,
    error,
    isLoading,
  } = useSWR<EmployeeResponseData>(
    config.findEmployeeByEmail + leadSource,
    fetcher
  );
  return (
    <>
      <Card>
        {leadSourceData && (
          <>
            <Card.Title>
              {"Lead source"}{" "}
              <FieldRow
                value={
                  <EmployeeStatusChip type={leadSourceData?.data.status} />
                }
                row
              />
            </Card.Title>
            <Card.Header>
              <Card.Image
                url={leadSourceData?.data.avatar_url}
                alt="User avatar"
              />
              <Card.FieldRow
                value={`${leadSourceData?.data?.first_name} ${leadSourceData?.data?.last_name}`}
              />
              <div className="flex flex-row gap-3">
                <RoleChip type={leadSourceData?.data.role} />
                <EmployeeStatusChip type={leadSourceData?.data.status} />
              </div>
            </Card.Header>
            <Card.FieldRow
              label={"Address"}
              value={leadSourceData?.data.address}
              icon={<MapPinIcon height={18} width={18} />}
              ClipboardBtn={<CopyButton value={leadSourceData?.data.address} />}
            />

            <Card.FieldRow
              label={"Email"}
              value={leadSourceData?.data.email}
              icon={<EnvelopeIcon height={18} />}
              ClipboardBtn={<CopyButton value={leadSourceData?.data.email} />}
            />

            <Card.FieldRow
              label={"Phone number"}
              value={leadSourceData?.data.mobile_number}
              icon={<PhoneIcon height={18} />}
              ClipboardBtn={
                <CopyButton value={leadSourceData?.data.mobile_number} />
              }
            />

            <Card.FieldRow
              label={"Commission"}
              value={`${leadSourceData?.data.commission}%`}
            />
          </>
        )}
        {!leadSourceData && <div>No Data</div>}
        {error && <div>An Error occured</div>}
      </Card>
    </>
  );
}
