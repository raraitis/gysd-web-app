import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React, { FC } from "react";

interface Props {
  onWidgetClick: () => void;
}

const SmallCalendarWidget: FC<Props> = ({ onWidgetClick }) => {
  const currentDate = dayjs().format("DD MMMM YYYY");

  return (
    <div
      className="flex cursor-pointer flex-row justify-start gap-4 rounded-sm border border-orange-300 bg-orange-200 p-4 px-5 transition duration-300 hover:bg-blue-300"
      onClick={onWidgetClick}
    >
      <div className="flex-start">
        <CalendarDaysIcon className="h-12 w-12" />
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-bold text-black">{currentDate}</p>
        <p className="text-sm text-gray-500">Click to view full calendar</p>
      </div>
    </div>
  );
};

export default SmallCalendarWidget;
