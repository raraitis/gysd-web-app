"use client";

import { FC, useState } from "react";

import TableJobRequests from "./TableJobRequests";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  search?: boolean;
  title?: string;
};

const JobRequestList: FC<Props> = ({ search, title }) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  const headerContent = search ? (
    <div className="relative mb-5 mt-1">
      <button className="absolute left-0 top-1/2 -translate-y-1/2">
        <MagnifyingGlassIcon width={20} height={20} />
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
  ) : undefined;

  return (
    <TableJobRequests
      input={debouncedSearchInput ?? ""}
      header={headerContent}
      title={title}
    />
  );
};

export default JobRequestList;
