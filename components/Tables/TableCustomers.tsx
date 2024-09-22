import { FC, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import {
  Customer,
  CustomerStatus,
  CustomerType,
  CustormerResponseData,
  TabProps,
} from "@/types/types";
import PaginationRow from "../Pagination/PaginationRow";
import {
  EyeSlashIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import useLocalStorage from "@/hooks/useLocalStorage";
import { config } from "@/lib/api/config";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/httpClient";
import Loader from "../common/Loader";
import useModal from "../common/modal/modal";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import CustomerStatusChip from "../Customer/CustomerStatusChip";
import CustomerTypeChip from "../Customer/CustomerTypeChip";

dayjs.extend(utc);
dayjs.extend(timezone);

const tabs: TabProps[] = [
  { label: "All", value: "" },
  { label: "Home owner", value: CustomerType.HOMEOWNER },
  { label: "Business", value: CustomerType.BUSINESS },
  { label: "Deactivated", value: CustomerStatus.DEACTIVATED },
];

export const customerActionModal = (action: CustomerStatus) => {
  const text = action === CustomerStatus.ACTIVATED ? "deactivate" : "activate";

  return (
    <div>
      <p className="text-md font-semibold">
        {`Do you really want to ${text} this customer?`}
      </p>
    </div>
  );
};

export interface TableCustomersProps {
  header: React.ReactNode;
  input: string;
}

const TableCustomers: FC<TableCustomersProps> = ({ header, input }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatusFilter, setSelectedType] = useLocalStorage(
    "selectedType",
    ""
  );
  const { openModal, closeModal, ModalWrapper } = useModal();
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    status: CustomerStatus;
  } | null>(null);

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Address",
    "Type",
    "Status",
    "Actions",
  ];

  const pageLength = 10;

  const constructUrl = (
    selectedTab: string,
    searchInput: string | undefined,
    page: number
  ): string => {
    let url = `${config.clientList}?`;

    if (input && input.trim().length > 0) {
      url += `query=${input}&`;
    }

    if (selectedTab !== "") {
      if (selectedTab === CustomerStatus.DEACTIVATED) {
        url += `status=${selectedTab}&`;
      } else {
        url += `type=${selectedTab}&`;
      }
    }

    url += `limit=${pageLength}&offset=${(page - 1) * pageLength}`;

    return url;
  };

  const url = constructUrl(selectedTab, input, currentPage);

  const {
    data: clientsData,
    error: clientsError,
    isLoading: isClientsLoading,
    mutate,
  } = useSWR<CustormerResponseData>(url, fetcher, {
    keepPreviousData: true,
  });

  const handleTabChange = (tabType: string) => {
    setCurrentPage(1);
    setSelectedTab(tabType);
    setSelectedType(tabType);

    const newUrl = constructUrl(tabType, input, 1);

    mutate(newUrl);
  };

  if (clientsError) return <div>Failed to load</div>;

  const totalPages = Math.ceil(
    (clientsData && clientsData.data?.count / 10) ?? 0
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newUrl = constructUrl(selectedTab, input, page);

    mutate(newUrl);
  };

  const nextPage = () => {
    if (!clientsData) {
      return;
    }

    if (currentPage + 1 >= totalPages + 1) {
      return;
    }

    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedTab, input, newPage);
    mutate(newUrl);
  };

  const prevPage = () => {
    if (!clientsData) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const newUrl = constructUrl(selectedTab, input, newPage);
    mutate(newUrl);
  };

  const onDelete = (customer: Customer) => {
    setSelectedCustomer({
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      status: customer.status as CustomerStatus,
    });
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await postUrl<any>({
        url: config.deactivateCustomer,
        config: {
          method: "PATCH",
        },
        data: {
          id,
        },

        onError: (error) => {
          toast.error(error.message);
          closeModal();
        },
        onResponse: ({ data, status }) => {
          closeModal();
          toast.success(`Employee deactivated successfully`);
          mutate(url);
        },
      });
    } catch (error) {
      closeModal();
      toast.error("Failed to deactivate employee!");
    } finally {
      closeModal();
      mutate(url);
    }
  };

  return (
    <div className="no-scrollbar  rounded-sm bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex w-full justify-between">
        <div className="mb-4 flex space-x-4">
          {tabs.map((tab: TabProps, index: number) => (
            <button
              key={index}
              className={`rounded bg-blue-500 px-4 py-2 text-white ${
                selectedTab === tab.value ? "bg-opacity-70" : "bg-opacity-30"
              }`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="flex w-10 cursor-pointer"
          onClick={() => router.push("/client/create")}
        >
          <UserPlusIcon width={30} />
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
            {clientsData &&
              !isClientsLoading &&
              clientsData.data &&
              clientsData.data.customers &&
              clientsData.data.customers.length > 0 &&
              clientsData.data.customers.map(
                (customer: Customer, key: number) => (
                  <tr
                    key={key}
                    onClick={() => {
                      router.push(`/client/${customer.id}`);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {headers.map((header, index) => (
                      <td
                        key={index}
                        className={`border-b border-[#eee] px-4 py-5 text-black  dark:border-strokedark dark:text-white ${
                          index === 0 ? "font-semibold" : ""
                        }`}
                      >
                        {header === "Address" ? (
                          <span>
                            <p className="max-w-[150px] truncate">
                              {customer.address}
                            </p>
                          </span>
                        ) : header === "Name" ? (
                          `${customer.first_name} ${customer.last_name}`
                        ) : header === "Email" ? (
                          customer.email
                        ) : header === "Type" ? (
                          <CustomerTypeChip
                            type={customer.type as CustomerType}
                          />
                        ) : header === "Phone" ? (
                          customer.mobile_number
                        ) : header === "Status" ? (
                          <CustomerStatusChip
                            type={customer.status as CustomerStatus}
                          />
                        ) : (
                          <div className="flex items-center justify-center space-x-3.5">
                            <PencilSquareIcon
                              onClick={() =>
                                router.push(`/client/${customer.id}`)
                              }
                              className="h-6 w-6"
                            />
                            {customer &&
                              customer.status !==
                                CustomerStatus.DEACTIVATED && (
                                <TrashIcon
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(customer);
                                  }}
                                />
                              )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            <tr>
              <td colSpan={12} className="text-center">
                {isClientsLoading && <Loader />}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {clientsData && clientsData?.data.count === 0 && (
        <div className="flex py-4 hover:cursor-pointer">
          <div className="flex items-center rounded-md border p-2">
            <EyeSlashIcon className="h-6 w-8" />
            <div className="flex px-2">NO DATA</div>
          </div>
        </div>
      )}
      {(!clientsData || isClientsLoading) && <Loader />}
      <ModalWrapper
        title={`Deactivate ${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`}
        type="warning"
        content={customerActionModal(
          selectedCustomer?.status as CustomerStatus
        )}
        onOk={() => handleDelete(selectedCustomer?.id ?? "")}
        onClose={closeModal}
      />
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{
          totalEntries: clientsData?.data.count ?? 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default TableCustomers;
