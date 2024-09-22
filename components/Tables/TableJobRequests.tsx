import { Quote } from "@/types/types";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PaginationRow from "../Pagination/PaginationRow";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { QuotesResponse } from "@/pages/api/quotes/quotes";
import JobReqTableRow from "./JobReqTableRow";
import Loader from "../common/Loader";

type TableJobRequestsProps = {
  input: string;
  header?: JSX.Element;
  title?: string;
};

const TableJobRequests = ({ input, header, title }: TableJobRequestsProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);

  const pageLength = 10;

  const url = constructUrl(debouncedSearchInput, currentPage);

  function constructUrl(searchInput: string, page: number): string {
    let url = `${config.quotesList}?`;

    if (searchInput && searchInput.trim().length > 0) {
      url += `query=${searchInput}&`;
    }

    url += `status=REQUESTED&`;

    url += `limit=${pageLength}&offset=${(page - 1) * pageLength}`;

    return url;
  }

  const { data, error, mutate, isLoading } = useSWR<QuotesResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <div>Failed to load withdrawals</div>;

  const headers = ["Description", "Address", "Job", "Status", "Actions"];

  const totalPages = Math.ceil(
    (data && data.data && data.data.count && data.data.count / 10) ?? 0
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (!data) {
      return;
    }

    if (currentPage + 1 >= totalPages + 1) {
      return;
    }

    const newPage = currentPage + 1;
    setCurrentPage(newPage);
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
  };

  return (
    <div className="no-scrollbar  rounded-sm bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {header}
      {title && (
        <div className=" py-1 dark:border-strokedark dark:bg-boxdark">
          <h1 className="mb-1 text-xl font-semibold text-black dark:text-white">
            {title}
          </h1>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-auto ">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {headers.map((header: string, index: number) => (
                <th
                  key={index}
                  className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"
                >
                  {header !== "Actions" ? (
                    <span> {header}</span>
                  ) : (
                    <span className="flex justify-center"> {header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.data &&
              data.data.quotes &&
              data.data.quotes.length !== 0 &&
              data.data.quotes.map((request: Quote, key: number) => (
                <JobReqTableRow
                  key={request.id}
                  request={request}
                  mutate={() => mutate(url)}
                />
              ))}
          </tbody>
        </table>
      </div>
      {data && data?.data?.quotes.length === 0 && (
        <div className="flex justify-center py-4 hover:cursor-pointer">
          <div className="flex items-center rounded-md  border p-2">
            <EyeSlashIcon className="h-6 w-8" />
            <div className="flex px-2">NO DATA</div>
          </div>
        </div>
      )}
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{
          totalEntries: data?.data?.quotes.length ?? 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default TableJobRequests;
