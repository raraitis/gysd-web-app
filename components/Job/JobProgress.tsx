"use client";

import { Job, JobStatus } from "@/types/types";
import { JobStatusToText } from "@/utils/job-status-to-text";
import {
  BellIcon,
  PowerIcon,
  TrophyIcon,
  TruckIcon,
} from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  CheckBadgeIcon,
  EyeIcon,
  PencilIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";

const jobSteps = [
  { name: JobStatus.SCHEDULED, icon: <CalendarIcon className="h-6 w-6" /> },
  { name: JobStatus.DRIVING, icon: <TruckIcon className="h-6 w-6" /> },
  { name: JobStatus.ARRIVED, icon: <BellIcon className="h-6 w-6" /> },
  { name: JobStatus.STARTED, icon: <PowerIcon className="h-6 w-6" /> },
  { name: JobStatus.FIX_REQUIRED, icon: <PencilIcon className="h-6 w-6" /> },
  { name: JobStatus.FIXING, icon: <PencilIcon className="h-6 w-6" /> },
  { name: JobStatus.PENDING_REVIEW, icon: <WalletIcon className="h-6 w-6" /> },
  {
    name: JobStatus.INSPECTION_REQUIRED,
    icon: <EyeIcon className="h-6 w-6" />,
  },
  { name: JobStatus.REVIEWING, icon: <TrophyIcon className="h-6 w-6" /> },
  { name: JobStatus.DONE, icon: <CheckBadgeIcon className="h-6 w-6" /> },
];

type Props = {
  job: Job;
  showFixRequired?: boolean;
  showFixing?: boolean;
  showPendingReview?: boolean;
};

const JobProgress: FC<Props> = ({
  job,
  showFixRequired,
  showFixing,
  showPendingReview,
}) => {
  const currentIndex = jobSteps.findIndex((step) => step.name === job.status);

  const filteredSteps = jobSteps.filter((step) => {
    if (step.name === JobStatus.FIX_REQUIRED && !showFixRequired) return false;
    if (step.name === JobStatus.FIXING && !showFixing) return false;
    if (step.name === JobStatus.PENDING_REVIEW && !showPendingReview)
      return false;
    return true;
  });

  {
    /* {JSON.stringify(reportsData, null, 2)} */
  }

  return (
    <div className="flex w-full flex-col p-3">
      <div className="flex w-full">
        {filteredSteps.map((step, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <div
              className={`flex w-full items-center ${
                index < currentIndex
                  ? "text-green-600 after:inline-block after:h-1 after:w-full after:border-b after:border-green-100 after:content-[''] dark:after:border-green-800"
                  : index === currentIndex
                  ? "text-blue-600 after:inline-block after:h-1 after:w-full after:border-b after:border-blue-100 after:content-[''] dark:after:border-blue-800"
                  : "text-gray-600 after:inline-block after:h-1 after:w-full after:border-b after:border-gray-100 after:content-[''] dark:after:border-gray-800"
              } ${index === filteredSteps.length - 1 && "after:border-none"}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  index < currentIndex
                    ? "bg-green-100 dark:bg-green-800"
                    : index === currentIndex
                    ? "bg-blue-100 dark:bg-blue-800"
                    : "bg-gray-100 dark:bg-gray-800"
                } lg:h-12 lg:w-12`}
              >
                {step.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full">
        {filteredSteps.map((step, index) => (
          <div key={index} className="ml-1 flex flex-1 justify-start">
            <span className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-300">
              {JobStatusToText(step.name)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobProgress;
