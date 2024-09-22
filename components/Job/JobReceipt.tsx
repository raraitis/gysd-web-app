import { FC, useState } from "react";
import { Job } from "@/types/types";

type Props = {
  job: Job;
};

export const JobReceipt: FC<Props> = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="my-2 flex w-full cursor-pointer py-4"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {job && job.receipt && job.receipt.image_url && (
        <div className="flex flex-col rounded-md px-5 py-3 shadow-2">
          <span className="text-xs font-medium">{"Receipt"}</span>

          <div className="mt-2 flex w-full items-start justify-start ">
            <img
              src={job.receipt.image_url}
              alt="Job related"
              className={`rounded-lg transition-all duration-300 ${
                isExpanded
                  ? "fixed inset-0 z-50 m-auto flex h-4/5 max-h-full w-auto max-w-full items-center justify-center"
                  : "h-5 w-50"
              }`}
            />
            {isExpanded && (
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={() => setIsExpanded(false)}
              ></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
