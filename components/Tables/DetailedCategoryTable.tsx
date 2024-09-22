"use client";
import {
  CategoryPrices,
  JobOrigin,
  PricesByCategoryResponse,
} from "@/types/types";
import { FC, useState } from "react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import dayjs from "dayjs";
import { formatToDollar } from "@/utils/utils";
import { useDebounceNew } from "@/utils/use-debounce-new";
import JobOriginChip from "../Categories/JobOriginChip";

const headers = [
  "Name",
  "Cost per Ft",
  "Cost per Ft pro",
  "Acceptance",
  "Created at",
];

interface Props {
  categories: PricesByCategoryResponse;
  onDelete?: (category: any) => void;
}

const DetailedCategoryTable: FC<Props> = ({ categories, onDelete }) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  return (
    <div className="m-2 flex w-full flex-col">
      <div className="relative mb-5 mt-1 flex flex-row">
        <button className="absolute left-0 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="h-5 w-5 text-bodydark" />
        </button>
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {headers.map((header: string, index: number) => (
              <th
                className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"
                key={index}
              >
                {header !== "Actions" ? (
                  <p className="flex w-full">{header}</p>
                ) : (
                  <p className="flex w-full justify-end">{header}</p>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories?.price_categories?.map(
            (category: CategoryPrices, index: number) => (
              <tr
                className={clsx(
                  "dark:bg-boxdarkdark",
                  "border-gray-1",
                  "max-h-90",
                  "cursor-pointer",
                  "overflow-hidden",
                  "dark:border-stroke",
                  "dark:text-white",
                  "md:max-h-90"
                )}
                key={index}
              >
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                      index === 0 ? "font-semibold" : ""
                    }`}
                  >
                    {header === "Name" ? (
                      <p className="font-medium text-black dark:text-white">
                        {category.price.job}
                      </p>
                    ) : header === "Cost per Ft" ? (
                      <p className="text-black dark:text-white">
                        {formatToDollar(category.price.costPerFeet)}
                      </p>
                    ) : header === "Cost per Ft pro" ? (
                      <p className="text-black dark:text-white">
                        {formatToDollar(category.price.costPerFeetPro)}
                      </p>
                    ) : header === "Acceptance" ? (
                      <div className="text-black dark:text-white">
                        <JobOriginChip
                          type={
                            category.price.isExternal
                              ? JobOrigin.EXTERNAL
                              : JobOrigin.INTERNAL
                          }
                        />
                      </div>
                    ) : header === "Created at" ? (
                      <p className="text-black dark:text-white">
                        {dayjs(category.price.created_at).format("YYYY MMM DD")}
                      </p>
                    ) : header === "Actions" ? (
                      <div className="flex items-center justify-end space-x-3.5">
                        {category && onDelete && (
                          <TrashIcon
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(category);
                            }}
                          />
                        )}
                      </div>
                    ) : null}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedCategoryTable;
