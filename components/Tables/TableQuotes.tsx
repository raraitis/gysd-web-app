import { FC, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { Quote, QuoteStatus, TabProps } from "@/types/types";
import PaginationRow from "../Pagination/PaginationRow";
import {
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import Loader from "../common/Loader";
import useModal from "../common/modal/modal";
import toast from "react-hot-toast";
import CustomerTypeChip from "../Customer/CustomerTypeChip";
import QuotesStatusChip from "../Quotes/QuotesStatusChip";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { QuotesResponse } from "@/pages/api/quotes/quotes";
import { formatToDollar } from "@/utils/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const tabs: TabProps[] = [
  { label: "All", value: "", color: "blue-500" },
  { label: "Sent", value: QuoteStatus.SENT, color: "yellow-500" },
  { label: "Accepted", value: QuoteStatus.ACCEPTED, color: "green-500" },
  { label: "Declined", value: QuoteStatus.DECLINED, color: "red-500" },
];

export const customerActionModal = (action: QuoteStatus) => {
  return (
    <div>
      <p className="text-md font-semibold">
        {`Do you really want to delete this quote?`}
      </p>
    </div>
  );
};

export interface TableQuotesProps {
  header: React.ReactNode;
  input: string;
}

const TableQuotes: FC<TableQuotesProps> = ({ header, input }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("");
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
    let url = `${config.quotesList}?`;

    if (searchInput && searchInput.trim().length > 0) {
      url += `query=${searchInput}&`;
    }

    if (statusFilter && statusFilter.trim().length > 0) {
      url += `status=${statusFilter}&`;
    }

    url += `limit=${pageLength}&offset=${(page - 1) * pageLength}`;

    return url;
  }

  const {
    data: quotesData,
    error,
    isLoading,
    mutate,
  } = useSWR<QuotesResponse>(url, fetcher, {
    revalidateOnFocus: false,
  });

  if (!quotesData && !isLoading) return <div>Failed to load</div>;

  if (error && !quotesData) {
    return <div>{error.message}</div>;
  }

  const handleTabChange = (tabType: string) => {
    setCurrentPage(1);
    setSelectedStatusFilter(tabType);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newUrl =
      debouncedSearchInput && debouncedSearchInput.trim().length > 0
        ? `${
            config.quotesList
          }?query=${debouncedSearchInput}&limit=${pageLength}&offset=${
            (page - 1) * pageLength
          }`
        : `${config.quotesList}?limit=${pageLength}&offset=${
            (page - 1) * pageLength
          }`;

    mutate(newUrl);
  };

  const totalPages = quotesData?.data?.count
    ? Math.ceil(quotesData?.data?.count / 10)
    : 0;

  const nextPage = () => {
    if (!quotesData) {
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
    if (!quotesData) {
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

  const headers = ["Description", "Address", "Status", "Price"];

  const requestedQuotes = quotesData?.data.quotes.filter(
    (quote) => quote.status !== QuoteStatus.REQUESTED
  );

  return (
    <div className="no-scrollbar  rounded-sm bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex w-full justify-between">
        <div className="mb-4 flex space-x-4">
          {tabs.map((tab: TabProps, index: number) => (
            <button
              key={index}
              className={`rounded bg-${tab.color} px-4 py-2 text-white ${
                selectedStatusFilter === tab.value
                  ? "bg-opacity-90"
                  : "bg-opacity-50"
              }`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {header}
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
            {quotesData &&
              requestedQuotes &&
              requestedQuotes.map((quote: Quote, key: number) => (
                <tr
                  key={key}
                  onClick={() => {
                    router.push(`/quotes/${quote.id}`);
                  }}
                  className="hover:cursor-pointer"
                >
                  {headers.map((header, index) => (
                    <td
                      key={index}
                      className={`truncate border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white ${
                        index === 0 ? "font-semibold" : ""
                      }`}
                    >
                      {header === "Address" ? (
                        <span>
                          <p className="max-w-[150px] truncate">
                            {quote.address}
                          </p>
                        </span>
                      ) : header === "Description" ? (
                        <p className="max-w-[350px] truncate">
                          {quote.description}
                        </p>
                      ) : header === "Status" ? (
                        <QuotesStatusChip type={quote.status as QuoteStatus} />
                      ) : header === "Price" ? (
                        `${formatToDollar(quote.quote)}`
                      ) : (
                        <div className="flex items-center justify-center space-x-3.5">
                          {/* {quote && quote.status !== QuoteStatus.DECLINED && (
                            <TrashIcon
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                // onDelete(quote);
                              }}
                            />
                          )} */}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            <tr>
              <td colSpan={12} className="text-center">
                {false && <Loader />}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {quotesData && quotesData?.data.count === 0 && (
        <div className="flex w-full items-center justify-center  py-4 hover:cursor-pointer">
          <div className="flex items-center justify-center rounded-md border p-2">
            <EyeSlashIcon className="h-6 w-8" />
            <div className="flex px-2">NO DATA</div>
          </div>
        </div>
      )}
      {false && <Loader />}

      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{
          totalEntries: [].length ?? 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default TableQuotes;
