"use client";
import { JobsResponseData } from "@/types/types";
import CalendarBody from "./CalendarBody";
import CalendarHead from "./CalendarHead";

interface Props {
  jobData: JobsResponseData | undefined;
  onMutate: () => void;
  currentDate: any;
  isLoading: boolean;
}

const CalendarGrid: React.FC<Props> = ({
  jobData,
  onMutate,
  currentDate,
  isLoading,
}) => {
  return (
    <div
      className={`mt-2 w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
    >
      <table className="w-full shadow-lg">
        <CalendarHead />
        <CalendarBody
          currentDate={currentDate}
          onMutate={onMutate}
          jobData={jobData}
          isLoading={isLoading}
        />
      </table>
    </div>
  );
};

export default CalendarGrid;
