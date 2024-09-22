import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../Ui/Button";
import SmallMaps from "../User/SmallMaps";
import CustomerDetailsCard from "./QuoteCustomerDetailsCard";
import { clsxm } from "@/utils/clsxm";
import { QuoteByIdData } from "./QuoteDetailsPage";
import SalesRepDetailsCard from "./SalesRepDetailsCard";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import { config } from "@/lib/api/config";
import useModal from "../common/modal/modal";
import { AssignSalesRepModal } from "../Tables/AssignSalesRepModal";
import QuoteForm from "../Forms/Quotes/QuoteForm";
import { Quote } from "@/types/types";
import { FieldRow } from "../Job/FieldRow";
import {
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

type Props = {
  quote: QuoteByIdData | Quote;
  delete: () => void;
};

export const QuoteDetails: FC<Props> = ({ quote, delete: onDelete }) => {
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  const cardClasses = [
    "xl:col-span-2",
    "lg:col-span-3",
    "md:col-span-1",
    "sm:col-span-1",
    "w-full",
    "rounded-lg",
    "border",
    "border-gray-200",
    "p-6",
    "shadow",
    "hover:bg-gray-100",
    "hover:cursor-pointer",
    "dark:border-gray-700",
    "dark:bg-gray-800",
    "dark:hover:bg-gray-700",
  ];

  const gridClasses = [
    "grid",
    "gap-2",
    "xl:grid-cols-6",
    "lg:grid-cols-3",
    "md:grid-cols-1",
    "sm:grid-cols-1",
  ];

  async function assignQuoteToSalesRep(salesRepId: string) {
    await postUrl({
      url: config.assignQuoteToSalesRep,

      data: {
        quote_id: quote.id,
        employee_id: salesRepId,
      },

      onError: (error) => {
        console.log("error from function");
        toast.error(error.message);
      },
      onResponse: ({ data, status }) => {
        toast.success("Job assigned successfully");
        router.push("/quotes/requests");
      },
    });
  }
  const { openModal, closeModal, ModalWrapper } = useModal();

  return (
    <div className={clsxm("rounded-sm", "shadow-default", "dark:bg-boxdark")}>
      <div>
        <div className={clsxm(gridClasses)}>
          <CustomerDetailsCard
            quote={quote}
            className={cardClasses}
            onClick={() => router.push(`/client/${quote.customer.id}`)}
          />
          {quote.sales_rep ? (
            <SalesRepDetailsCard
              quote={quote}
              className={cardClasses}
              onClick={() =>
                router.push(`/super/${quote.sales_rep.employee.id}`)
              }
            />
          ) : (
            <div
              className={clsxm(
                cardClasses,
                "justify-center",
                "items-center",
                "flex"
              )}
            >
              <div className={clsxm("w-[200px]")}>
                <Button
                  size="sm"
                  onClick={() => {
                    openModal();
                  }}
                >
                  Assign Sales Rep
                </Button>
              </div>
            </div>
          )}
          <div
            className={clsxm(
              "xl:col-span-2",
              "lg:col-span-3",
              "md:col-span-1",
              "sm:col-span-1",
              "w-full",
              "rounded-lg",
              "border",
              "border-gray-200",
              "p-6",
              "shadow",
              "gap-2",
              "flex",
              "flex-col",
              "hover:bg-gray-100",
              "hover:cursor-pointer",
              "dark:border-gray-700",
              "dark:bg-gray-800",
              "dark:hover:bg-gray-700"
            )}
          >
            {quote?.geoHash && <SmallMaps hash={quote.geoHash} />}
          </div>
        </div>
        <div className={clsxm(gridClasses)}>
          <div
            className={clsxm(
              cardClasses,
              "justify-start",
              "items-start",
              "flex",
              "flex-col",
              "xl:col-span-2"
            )}
          >
            <div className="h-10 lg:h-20">
              <h3 className="text-md mb-1.5 flex justify-between font-semibold text-gray-400">
                {"Quote Details"}
              </h3>
            </div>
            <FieldRow
              label={"Job Type"}
              value={quote.jobType}
              icon={<WrenchScrewdriverIcon height={18} />}
            />
            <FieldRow
              label={"User Notes"}
              value={quote.description}
              icon={<ClipboardDocumentListIcon height={18} />}
            />
          </div>
          <div
            className={clsxm(
              cardClasses,
              "justify-center",
              "items-center",
              "flex",
              "flex-col",
              "xl:col-span-4",
              "space-y-2"
            )}
          >
            <button
              className={clsxm(
                "self-end rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              )}
              onClick={() => setEdit(!edit)}
            >
              Edit
            </button>
            <div className="flex w-full">
              {quote && <QuoteForm quote={quote} isEdit={edit} />}
            </div>
          </div>
        </div>
        <ModalWrapper
          title={`Assign Job to a Sales Rep`}
          type="information"
          content={
            <AssignSalesRepModal
              onClose={closeModal}
              onAssign={assignQuoteToSalesRep}
            />
          }
          onClose={closeModal}
        />
      </div>
    </div>
  );
};
