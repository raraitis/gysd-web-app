"use client";

const CalendarHead: React.FC = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <thead>
      <tr className="grid grid-cols-7 rounded-t-sm bg-orange-400/90 text-white">
        {daysOfWeek.map((day, index) => (
          <th
            key={index}
            className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5"
          >
            <span className="hidden lg:block">{day}</span>
            <span className="block lg:hidden">{day.slice(0, 3)}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default CalendarHead;
