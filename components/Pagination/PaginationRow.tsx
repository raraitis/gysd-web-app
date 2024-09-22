"use client";

import { Pagination } from "@/types/responses";
import { clsxm } from "@/utils/clsxm";
import generateNeighboringNumbers from "@/utils/generateNeighboringNumbers";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { FC, useMemo } from "react";

type Props = {
  pagination?: Pagination;
  perPage: number;
  page: number;
  onClickPage?: (page: number) => void;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
};

const PaginationRow: FC<Props> = ({
  pagination,
  perPage,
  page,
  onClickPage,
  onClickNext,
  onClickPrevious,
}) => {
  const currentRange = useMemo(() => {
    if (!pagination) {
      return {
        from: 0,
        to: 0,
      };
    }

    const to = perPage * page + perPage;

    return {
      from: perPage * page + 1,
      to: to > pagination.totalEntries ? pagination.totalEntries : to,
    };
  }, [page, pagination, perPage]);

  if (!pagination) {
    return null;
  }

  const numbers = generateNeighboringNumbers({
    input: page + 1,
    min: 1,
    max: pagination.totalPages + 1,
    maxStep: pagination.totalPages < 5 ? pagination.totalPages : 5,
  });

  // console.log("NUMBERS ::: :: :", numbers);

  return (
    <div className="flex items-center justify-between border-b border-t border-[#eee] bg-white px-4 py-3 dark:border-none dark:bg-meta-4 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <div
          className="relative inline-flex items-center rounded-md border border-b border-[#eee] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClickPrevious}
        >
          Previous
        </div>
        <div
          className="relative ml-3 inline-flex items-center rounded-md border border-b border-[#eee] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClickNext}
        >
          Next
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-white">
            Showing <span className="font-medium">{currentRange.from}</span> to{" "}
            <span className="font-medium">{currentRange.to}</span> of{" "}
            <span className="font-medium">{pagination.totalEntries}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-bodydark hover:cursor-pointer hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={onClickPrevious}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-bodydark hover:bg-gray-50 focus:outline-offset-0" */}
            {numbers.map((f) => {
              return (
                <div
                  key={f.value}
                  aria-current="page"
                  className={clsxm(
                    f.isCurrent
                      ? "relative z-1 inline-flex items-center bg-bodydark2 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-bodydark hover:cursor-pointer hover:bg-gray-300 focus:z-20 focus:outline-offset-0 dark:text-white"
                  )}
                  onClick={() => {
                    if (onClickPage && !f.isCurrent) {
                      onClickPage(f.value);
                    }
                  }}
                >
                  {f.value}
                </div>
              );
            })}
            <div
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-900 ring-1 ring-inset ring-bodydark hover:cursor-pointer hover:bg-gray-300 focus:z-20 focus:outline-offset-0 dark:text-gray-400"
              onClick={onClickNext}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationRow;
