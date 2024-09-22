"use client";

import { useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import TableCustomers from "./TableCustomers";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CustomerList = () => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  return (
    <TableCustomers
      input={debouncedSearchInput ?? ""}
      header={
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
      }
    />
  );
};

export default CustomerList;
