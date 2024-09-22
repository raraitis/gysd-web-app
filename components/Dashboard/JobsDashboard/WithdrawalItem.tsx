import { Button } from "@/components/Ui/Button";
import { Withdrawal } from "@/types/types";
import { formatToDollar } from "@/utils/utils";
import { useRouter } from "next/navigation";

type Props = { withdrawal: Withdrawal; onApprove: () => void };

const WithdrawalItem = ({ withdrawal, onApprove }: Props) => {
  const router = useRouter();
  return (
    <div
      // onClick={() => router.push(`/super/${withdrawal.employee_id}`)}
      className="mb-2 flex w-full cursor-pointer items-center gap-2 rounded-md border px-4 hover:bg-bodydark"
    >
      <div className="w-full rounded-sm px-2 py-4 text-black hover:text-black-2 dark:text-white">
        <div className="flex w-full flex-row justify-start gap-4">
          <div className="flex ">
            <p className="text-lg font-bold">
              {formatToDollar(withdrawal?.amount)}
            </p>
          </div>
          <div className="flex">
            <p className="text-lg font-bold">{`${withdrawal?.withdrawer.first_name} ${withdrawal?.withdrawer.last_name}`}</p>
          </div>
        </div>
      </div>
      {!withdrawal.approved && (
        <div className="flex pl-4">
          <Button className="rounded-md" size="xs" onClick={onApprove}>
            Approve
          </Button>
        </div>
      )}
    </div>
  );
};

export default WithdrawalItem;
