import React, { FC, useState } from "react";
import { EmployeeData } from "@/types/types";
import clsx from "clsx";
import useClipboard from "../common/Buttons/CopyButton";
import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import CommissionCard from "../Forms/CommissionCard";
import { FieldRow } from "../Job/FieldRow";

type Props = {
  user: EmployeeData | any;
  notifications?: boolean;
  commissions?: boolean;
  submit?: () => void;
  amount?: number;
};

const UserPageDetails: FC<Props> = ({
  user,
  notifications,
  commissions,
  submit,
  amount,
}) => {
  const { CopyButton } = useClipboard();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user.notifications_enabled
  );

  const handleToggle = async () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="flex w-full flex-col justify-between gap-3">
      <div className="flex items-center justify-center">
        <FieldRow
          value={user.address}
          icon={<MapPinIcon height={18} />}
          ClipboardBtn={<CopyButton value={user.address} />}
        />
      </div>
      <div className="flex w-full flex-col justify-between gap-3 ">
        <FieldRow
          label="Employee ID"
          value={user.id}
          ClipboardBtn={<CopyButton value={user.id} />}
        />

        <FieldRow
          label="Email"
          icon={<EnvelopeIcon height={18} />}
          value={user.email}
          ClipboardBtn={<CopyButton value={user.email} />}
        />

        <FieldRow
          label="Mobile number"
          icon={<PhoneIcon height={18} />}
          value={user.mobile_number}
          ClipboardBtn={<CopyButton value={user.mobile_number} />}
        />

        <FieldRow
          label=" Date joined"
          icon={<CalendarIcon height={18} />}
          value={dayjs(user.created_at).format("YYYY MMMM DD")}
        />

        <FieldRow
          label="Date updated"
          icon={<CalendarIcon height={18} />}
          value={dayjs(user.updated_at).format("YYYY MMMM DD")}
        />

        {commissions && submit && (
          <div className="flex-1">
            <CommissionCard
              employee={user}
              submit={submit}
              commissions={amount}
            />
          </div>
        )}
        {/* {notifications && (
          <div key="Notifications" className="flex flex-col">
            <p className={"float-left h-fit w-fit text-gray-400"}>
              Notifications:
            </p>
            <div className="flex cursor-pointer items-center">
              <div
                className={clsx(
                  "relative",
                  "inline-block",
                  "w-12",
                  "h-6",
                  "rounded-full",
                  "bg-gray-300",
                  "transition-colors",
                  "duration-300",
                  { "bg-orange-500": notificationsEnabled }
                )}
                onClick={handleToggle}
              >
                <div
                  className={clsx(
                    "absolute",
                    "left-1",
                    "top-1",
                    "w-4",
                    "h-4",
                    "bg-white",
                    "rounded-full",
                    "shadow-md",
                    "transition-transform",
                    "duration-300",
                    { "translate-x-6 transform": notificationsEnabled }
                  )}
                />
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserPageDetails;
