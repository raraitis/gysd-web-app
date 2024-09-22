import React, { FC, useState } from "react";
import {
  EmployeeComissionEditResponse,
  EmployeeData,
  RoleType,
} from "@/types/types";
import { config } from "@/lib/api/config";
import { useRole } from "@/utils/parseJwt";
import { formatToDollar } from "@/utils/utils";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import { Button } from "../Ui/Button";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type Props = {
  employee: EmployeeData;
  submit: () => void;
  commissions?: number;
};

const CommissionCard: FC<Props> = ({ employee, submit, commissions }) => {
  const [commission, setCommission] = useState<string>("");
  const [isSetCommission, setIsSetCommission] = useState(false);

  const isSalesInspectorAdminOrSuper = useRole([
    RoleType.SUPER,
    RoleType.ADMIN,
  ]);

  async function handleSetCommission() {
    try {
      await postUrl<EmployeeComissionEditResponse>({
        url: config.adminEditEmployeeCommision,
        config: {
          method: "PATCH",
        },
        data: {
          id: employee.id,
          commission,
        },

        onError: (error) => {
          toast.error(error.message);
        },
        onResponse: ({ data, status }) => {
          toast.success(`Commission set successfully`);
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      submit();
      setIsSetCommission(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-col items-start">
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            <h2 className=" font-semibold text-gray-600">{"Commission"}</h2>
            <div className="flex items-center justify-center gap-3">
              {!isSetCommission && (
                <p className="whitespace-nowrap">{employee.commission} %</p>
              )}
              {!isSetCommission && isSalesInspectorAdminOrSuper && (
                <div className="flex">
                  <div
                    className="flex h-8 w-15 cursor-pointer justify-center rounded-md bg-primary p-1 text-white transition hover:bg-opacity-90"
                    onClick={() => setIsSetCommission(true)}
                  >
                    Edit
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isSetCommission && isSalesInspectorAdminOrSuper && (
          <div className="flex flex-row gap-2">
            <input
              className="flex h-8 w-20 rounded-md border border-stroke px-1 py-1 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              inputMode="numeric"
              value={commission}
              placeholder={`${employee.commission}`}
              onChange={(e) => setCommission(e.target.value)}
            />
            <div
              className="flex h-8 w-15 cursor-pointer items-center justify-center rounded-md bg-primary px-2 py-1 text-white transition hover:bg-opacity-90"
              onClick={handleSetCommission}
            >
              <h5 className="text-gray-50">Set</h5>
            </div>
            <div
              className="flex h-8 w-20 cursor-pointer items-center justify-center rounded-md border-2 px-2 py-1 text-black shadow-sm transition hover:bg-opacity-90 dark:border-gray-100 "
              onClick={() => setIsSetCommission(false)}
            >
              <h5 className="text-gray-600 dark:text-gray-300">Cancel</h5>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <div>
          <p className="whitespace-nowrap font-semibold text-gray-600">
            {"Commission total"}
          </p>
          <div className="flex flex-row gap-2">
            <CurrencyDollarIcon width={20} />
            <p className="text-lg">{formatToDollar(commissions || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionCard;
