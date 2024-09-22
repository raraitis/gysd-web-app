"use client";
import dayjs from "dayjs";
import { Job, JobsResponseData } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobForm from "../Forms/JobForm";
import CalendarJobList from "../Tables/CalendarJobList";
import ModalWithOverlay from "../common/modal/ModalWithOverlay";
import { jobTypeToStyle } from "@/utils/calendar-event-chip-colors";

type GridDate = { day: number; month: number; year: number };
interface Props {
  jobData: JobsResponseData | undefined;
  onMutate: () => void;
  currentDate: any;
  isLoading: boolean;
}

const CalendarBody: React.FC<Props> = ({
  jobData,
  onMutate,
  currentDate,
  isLoading,
}) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [jobListModalOpen, setJobListModalOpen] = useState(false);

  const openModal = (date: string, events?: Job[]) => {
    setSelectedDate(date);

    if (!events) {
      setIsModalOpen(true);
    } else {
      setJobListModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setIsModalOpen(false);
    setJobListModalOpen(false);
  };

  const eventsFromJobs: Job[] =
    jobData?.data?.jobs.map((job: Job) => job) || [];

  const allEvents = [...eventsFromJobs];
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const numberOfDays = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const handleDateClick = (
    clickedDate: string | null,
    e: React.MouseEvent,
    events?: Job[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (clickedDate && e.target instanceof HTMLElement) {
      if (!events || events.length === 0) {
        openModal(clickedDate);
      } else if (events && events.length !== 0) {
        openModal(clickedDate, events);
      }
    }
  };

  const previousMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, index) => {
      const prev = dayjs()
        .year(currentYear)
        .month(currentMonth)
        .startOf("month")
        .subtract(firstDayOfWeek - index, "day");

      return prev;
    }
  );

  const currentMonthDays = Array.from({ length: numberOfDays }, (_, index) =>
    dayjs()
      .year(currentYear)
      .month(currentMonth)
      .startOf("month")
      .add(index, "day")
  );

  const nextMonthDays = Array.from(
    { length: 7 - ((firstDayOfWeek + numberOfDays) % 7) },
    (_, index) =>
      dayjs()
        .year(currentYear)
        .month(currentMonth + 1)
        .startOf("month")
        .add(index, "day")
  );

  const allDays = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  let calendarGrid: (GridDate | null)[][] = [];
  let week: (GridDate | null)[] = [];

  allDays.forEach((day) => {
    week.push(
      day
        ? ({
            day: day.date(),
            month: day.month(),
            year: day.year(),
          } as GridDate)
        : null
    );
    if (week.length === 7) {
      calendarGrid.push(week);
      week = [];
    }
  });

  while (week.length === 7) {
    week.push(null);
  }
  calendarGrid.push(week);

  const dayEvents = allEvents.filter((event: Job) => {
    const eventDate = dayjs(event.scheduled_start);
    return (
      dayjs(eventDate).date() === dayjs(selectedDate)?.date() &&
      dayjs(eventDate).month() === dayjs(selectedDate)?.month()
    );
  });

  return (
    <>
      <tbody>
        {calendarGrid.map((week, rowIndex) => (
          <tr key={rowIndex} className="grid grid-cols-7">
            {week.map((day, colIndex) => {
              const currentDay = dayjs()
                .year(day?.year || currentDate.year())
                .month(day?.month || currentDate.month())
                .date(
                  day && typeof day === "number" ? day : (day && day.day) || 1
                );

              const dayEvents = allEvents.filter((event: Job) => {
                const eventDate = dayjs(event.scheduled_start);
                return (
                  dayjs(eventDate).date() === day?.day &&
                  dayjs(eventDate).month() === day?.month
                );
              });

              return (
                <td
                  key={colIndex}
                  className={`ease hover:bg-gray relative z-1 h-20 cursor-pointer border border-stroke transition duration-500 dark:border-strokedark dark:hover:bg-meta-4 md:h-25  xl:h-31 ${
                    day ? "" : "bg-gray"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDateClick(
                      currentDay.format("YYYY-MM-DD"),
                      e,
                      dayEvents
                    );
                  }}
                >
                  {day && (
                    <span className="z-2 flex flex-col">
                      <span className="pl-3 pt-3 font-medium text-black dark:text-white">
                        {day.day}
                      </span>
                      <span className="no-scrollbar mx-1 flex cursor-pointer flex-col gap-1 overflow-auto sm:h-8 md:h-10 lg:h-10 xl:h-20">
                        {dayEvents.map((event: Job, index) => (
                          <span
                            key={index}
                            onClick={(e) => {
                              handleDateClick(
                                currentDay.format("YYYY-MM-DD"),
                                e,
                                dayEvents
                              );
                            }}
                            className={`event ${
                              jobTypeToStyle(event.type).border
                            } ${
                              jobTypeToStyle(event.type).background
                            } event-name z-10 flex items-center whitespace-nowrap rounded-sm border-l-[3px] px-1 text-left text-xs font-semibold text-black opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-white/20 dark:text-white/70 md:opacity-100`}
                          >
                            <p className="z-11 truncate text-xs">
                              {event.description}
                            </p>
                          </span>
                        ))}
                      </span>
                    </span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <ModalWithOverlay
        isOpen={jobListModalOpen ? jobListModalOpen : isModalOpen}
        onClose={closeModal}
        type={jobListModalOpen ? "list" : "form"}
      >
        {jobListModalOpen ? (
          <CalendarJobList
            data={dayEvents || []}
            onEdit={(id: string) => router.push(`/job/edit/${id}`)}
            selectedDate={selectedDate ?? ""}
            onMutate={onMutate}
          />
        ) : (
          <JobForm calendarDate={selectedDate ?? ""} />
        )}
      </ModalWithOverlay>
    </>
  );
};

export default CalendarBody;
