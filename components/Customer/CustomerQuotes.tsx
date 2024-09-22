import React, { FC } from "react";
import {
  Customer,
  CustomerJob,
  EmployeeData,
  QuoteStatus,
} from "@/types/types";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { CommonResponse } from "@/types/responses";
import QuotesStatusChip from "../Quotes/QuotesStatusChip";

type Props = {
  customer?: Customer;
  onSubmit?: (values: EmployeeData) => void;
};

const CustomerQuotes: FC<Props> = ({ customer }) => {
  const router = useRouter();

  const url = `${config.quotesList}?customer_id=${customer?.id}`;

  const {
    data: quotes,
    error,
    mutate,
    isLoading,
  } = useSWR<CommonResponse<any>>(url, fetcher);

  if (!quotes || error) return <div>{"No Data"}</div>;
  if (isLoading) return <Loader />;

  const headers = ["Description", "Address", "Status"];

  return (
    <div className="w-full rounded-md bg-white p-4 shadow-md dark:bg-boxdark">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col">
          <div className="flex w-full">
            {headers.map((header, index) => (
              <div
                key={index}
                className={`flex flex-1  px-2 ${
                  index === 0 && "min-w-[50%] font-semibold"
                } font-semibold`}
              >
                {header}
              </div>
            ))}
          </div>
          <div className="no-scrollbar flex h-[100%] flex-col gap-3 overflow-y-auto">
            {quotes.data.quotes.length !== 0 ? (
              quotes.data.quotes.map((job: CustomerJob, key: number) => (
                <div
                  key={key}
                  onClick={() => router.replace(`/quotes/${job.id}`)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-2 py-2"
                >
                  {headers.map((header, index) => (
                    <span
                      key={index}
                      className={`flex flex-1  ${
                        index === 0 && "min-w-[50%] font-semibold"
                      } `}
                    >
                      <p className="truncate">
                        {header === "Status" ? (
                          <QuotesStatusChip type={"ASSIGNED" as QuoteStatus} />
                        ) : (
                          job[header.toLowerCase()] ?? null
                        )}
                      </p>
                    </span>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex w-full items-center justify-center rounded-md border p-2">
                <EyeSlashIcon className="h-6 w-8" />
                <div className="flex px-2">NO DATA</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuotes;
