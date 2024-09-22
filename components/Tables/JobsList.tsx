"use client";

import { Job } from "@/types/types";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import JobsTable from "./JobsTable";

interface Props {
  onMutate: () => void;
  data: Job[];
  count: number;
}

const JobsList: FC<Props> = ({ data, count, onMutate }) => {
  return (
    <>
      {data && <JobsTable data={data} count={count} onMutate={onMutate} />}
      {count === 0 && (
        <div className="flex py-4 hover:cursor-pointer">
          <div className="flex items-center rounded-md border p-2">
            <EyeSlashIcon className="h-6 w-8" />
            <div className="flex px-2">NO DATA</div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobsList;
