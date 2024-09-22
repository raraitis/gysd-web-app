import { Quote, QuoteStatus } from "@/types/types";
import { useRouter } from "next/navigation";
import { Button } from "../Ui/Button";
import useModal from "../common/modal/modal";
import { config } from "@/lib/api/config";
import QuotesStatusChip from "../Quotes/QuotesStatusChip";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import JobTypeNameChip from "../Categories/JobTypeNameChip";
import { AssignSalesRepModal } from "./AssignSalesRepModal";

const JobReqTableRow = ({
  request,
  mutate,
}: {
  request: Quote;
  mutate: () => void;
}) => {
  const { openModal, closeModal, ModalWrapper } = useModal();
  const router = useRouter();

  const handleRouting = (e: any, id: string) => {
    router.push(`/quotes/requests/${id}`);
  };

  const handleAssigning = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    openModal();
  };

  async function assignQuoteToSalesRep(salesRepId: string) {
    console.log("assignQuoteToSalesRep");
    await postUrl({
      url: config.assignQuoteToSalesRep,

      data: {
        quote_id: request.id,
        employee_id: salesRepId,
      },

      onError: (error) => {
        console.log("error from function");
        toast.error(error.message);
      },
      onResponse: ({ data, status }) => {
        toast.success("Job assigned successfully");
        router.push("/quotes/requests");
        mutate();
      },
    });
  }

  return (
    <>
      <tr
        className="hover:cursor-pointer"
        onClick={(e) => handleRouting(e, request.id)}
      >
        <td
          className={`truncate border-b border-[#eee] px-4 py-5  text-black  dark:border-strokedark dark:text-white `}
        >
          <span>
            <p className="max-w-[350px] truncate font-semibold">
              {request.description}
            </p>
          </span>
        </td>
        <td
          className={`truncate border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white `}
        >
          <span>
            <p className="max-w-[250px] truncate">{request.address}</p>
          </span>
        </td>
        <td
          className={`truncate border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white `}
        >
          <span className="max-w-[100px]">
            {<JobTypeNameChip type={request.jobType} />}
          </span>
        </td>
        <td
          className={`truncate border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white `}
        >
          <span className="max-w-[100px]">
            {<QuotesStatusChip type={request.status as QuoteStatus} />}
          </span>
        </td>
        <td
          className={`truncate border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white `}
        >
          <div className="flex items-center justify-end space-x-3.5">
            <Button
              variant={"primary"}
              size={"sm"}
              onClick={(e: any) => handleAssigning(e)}
            >
              Assign
            </Button>
          </div>
        </td>
      </tr>
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
    </>
  );
};

export default JobReqTableRow;
