"use client";

import { config } from "@/lib/api/config";
import { JobsResponseData, Option } from "@/types/types";
import { useRouter } from "next/navigation";
import PaginationRow from "../Pagination/PaginationRow";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import DropdownCustom from "../Dropdowns/DropdownCustom";
import { useDebounceNew } from "@/utils/use-debounce-new";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { tabs } from "@/utils/job-status-to-text";
import JobsList from "./JobsList";
import Loader from "../common/Loader";

const JobsListPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useLocalStorage(
    "selectedTab",
    ""
  );
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);
  const [currentPage, setCurrentPage] = useState(1);

  const pageLength = 10;

  const url = constructUrl(
    selectedStatusFilter,
    debouncedSearchInput,
    currentPage
  );

  function constructUrl(
    statusFilter: string,
    searchInput: string,
    page: number
  ): string {
    let url = `${config.jobList}?`;

    if (searchInput && searchInput.trim().length > 0) {
      url += `query=${searchInput}&`;
    }

    if (statusFilter && statusFilter.trim().length > 0) {
      url += `status=${statusFilter}&`;
    }

    url += `limit=${pageLength}&offset=${(page - 1) * pageLength}`;

    return url;
  }

  const { data, error, isLoading, mutate } = useSWR<JobsResponseData>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newUrl =
      debouncedSearchInput && debouncedSearchInput.trim().length > 0
        ? `${
            config.jobList
          }?query=${debouncedSearchInput}&limit=${pageLength}&offset=${
            (page - 1) * pageLength
          }`
        : `${config.jobList}?limit=${pageLength}&offset=${
            (page - 1) * pageLength
          }`;

    mutate(newUrl);
  };

  if (error && !data) {
    return <div>{error.message}</div>;
  }

  const totalPages = data?.data.count ? Math.ceil(data?.data.count / 10) : 0;

  const nextPage = () => {
    if (!data) {
      return;
    }

    if (currentPage + 1 >= totalPages + 1) {
      return;
    }

    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedStatusFilter, searchInput, newPage);
    mutate(newUrl);
  };

  const prevPage = () => {
    if (!data) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedStatusFilter, searchInput, newPage);
    mutate(newUrl);
  };

  return (
    <div
      className={clsx(
        "rounded-sm",
        "bg-white",
        "px-5",
        "pb-2.5",
        "pt-6",
        "shadow-default",
        "dark:border-strokedark",
        "dark:bg-boxdark",
        "sm:px-7.5",
        "xl:pb-1",
        // "overflow-x-auto",
        "no-scrollbar",
        "h-[100%]"
      )}
    >
      <div className="flex w-full justify-between">
        <div className="z-10 w-[250px]">
          <DropdownCustom
            value={selectedStatusFilter}
            placeholder="All Jobs"
            options={tabs || []}
            onOptionSelect={(option: Option) => {
              setSelectedStatusFilter(option.value as string);
              setCurrentPage(1);
            }}
          />
        </div>
        <div
          className="flex w-10 cursor-pointer"
          onClick={() => router.push("/job/create")}
        >
          <PlusIcon width={30} />
        </div>
      </div>
      <div className="relative mb-5 mt-1 flex">
        <button className="absolute left-0 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </button>
        <input
          type="text"
          placeholder="Type to search..."
          className="flex-1 bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div className="no-scrollbar w-full overflow-x-auto">
        {data ? (
          <JobsList
            data={data?.data.jobs}
            count={data?.data.count}
            onMutate={mutate}
          />
        ) : (
          <Loader />
        )}
      </div>
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{
          totalEntries: data?.data.count ?? 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default JobsListPage;
