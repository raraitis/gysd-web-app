"use client";

import { FC, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import {
  Customer,
  CustomerStatus,
  CustormerResponseData,
  IClient,
} from "@/types/types";
import Loader from "../common/Loader";
import CustomerForm from "../Forms/CustomerForm";
import CustomerDetails from "./CustomerDetails";
import CustomerJobHistory from "../Customer/CustomerJobHistory";
import { postUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import toast from "react-hot-toast";
import useModal from "../common/modal/modal";
import { customerActionModal } from "../Tables/TableCustomers";
import { getReadableCustomerStatus } from "@/utils/customer-status-to-text";
import CustomerQuotes from "../Customer/CustomerQuotes";
import PasswordChangeModal from "./PasswordChangeModal";
import JobImageGallery from "../Job/JobImageGallery";

type Props = {
  id: string;
};

export const getCustomerById = (
  customers: Customer[],
  id: string
): Customer | undefined => {
  return customers.find((customer) => customer.id === id);
};

const CustomerPage: FC<Props> = ({ id }) => {
  const { openModal, closeModal, ModalWrapper } = useModal();
  const [activeButton, setActiveButton] = useState("jobs");

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const {
    data: clientData,
    error: clientsError,
    isLoading: isClientsLoading,
    mutate: mutateClients,
  } = useSWR<CustormerResponseData>(config.clientList, fetcher);

  const { data: iclient } = useSWR<{ data: IClient }>(
    `${config.clientGet}?id=${id}`,
    fetcher
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const customer = getCustomerById(clientData?.data?.customers || [], id);

  const handleEditSubmit = async (
    customerId: string,
    updatedClient: Partial<Customer>
  ) => {
    const editedData = {
      id: customerId,
      ...updatedClient,
    };

    try {
      const response = await postUrl<CommonResponse>({
        url: config.editCustomer,
        data: editedData,
        config: { method: "PATCH" },
        onResponse: ({ data }) => {
          if (data && data.success) {
            toast.success("Changes saved successfully!");
            return data.success;
          } else {
            toast.error("Failed to save changes.");
          }
        },
        onError: (error: any) => {
          toast.error("An error occurred while saving changes.");
        },
      });

      if (!response) {
        return false;
      }
    } catch (error) {
      toast.error("An error occurred while saving changes.");
      return false;
    } finally {
      setIsEditMode(false);
    }

    const updatedClients = clientData?.data?.customers.map((c) =>
      c.id === id ? { ...c, ...updatedClient } : c
    );
    mutateClients({ data: { customers: updatedClients } }, false);
    setIsEditMode(false);
  };

  const handleCustomerStatus = async (
    customerStatus: CustomerStatus,
    id: string
  ) => {
    const url =
      customerStatus === CustomerStatus.ACTIVATED
        ? config.deactivateCustomer
        : config.reactivateCustomer;
    try {
      await postUrl<any>({
        url: url,
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
          toast.success(
            `Employee ${getReadableCustomerStatus(customerStatus)} successfully`
          );
          mutateClients();
        },
      });
    } catch (error) {
      closeModal();
      toast.error(
        `Failed to ${getReadableCustomerStatus(customerStatus)} employee!`
      );
    } finally {
      closeModal();
      mutateClients();
    }
  };

  const buttons = [
    {
      id: "jobs",
      label: "Jobs",
      component: <CustomerJobHistory customer={customer} />,
    },
    {
      id: "quotes",
      label: "Quotes",
      component: <CustomerQuotes customer={customer} />,
    },
  ];

  return (
    <div className="flex flex-col">
      {isClientsLoading ? (
        <Loader />
      ) : clientsError ? (
        <div>{"Error loading data. Please try again later."}</div>
      ) : customer ? (
        <>
          <Breadcrumb pageName={`Customer: ${customer.first_name}`} />
          <div className="flex flex-col gap-6 ">
            {isEditMode ? (
              <div>
                <div className="flex w-full cursor-pointer justify-end bg-white py-2 pr-5">
                  <span onClick={() => setIsEditMode(false)}>Close</span>
                </div>
                <CustomerForm customer={customer} onSubmit={handleEditSubmit} />
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4">
                <div className="w-full rounded-md bg-white p-4 shadow-md dark:border-strokedark dark:bg-boxdark">
                  <div className="flex items-center justify-end gap-3">
                    {customer.status === CustomerStatus.DEACTIVATED && (
                      <button
                        className="ml-4 cursor-pointer rounded-md bg-green-600/80 px-4 py-2 text-white transition hover:bg-opacity-90"
                        onClick={openModal}
                      >
                        Reactivate
                      </button>
                    )}
                    {customer.status === CustomerStatus.ACTIVATED && (
                      <button
                        className="ml-4 cursor-pointer rounded-md bg-red-600/80 px-4 py-2 text-white transition hover:bg-opacity-90"
                        onClick={openModal}
                      >
                        <p className="opacity-1">Deactivate</p>
                      </button>
                    )}
                    <button
                      className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                      onClick={() => setIsEditMode(true)}
                    >
                      {"Edit"}
                    </button>
                    <div>
                      <PasswordChangeModal
                        id={customer.id}
                        isEmployee={false}
                      />
                    </div>
                  </div>
                  <CustomerDetails
                    client={customer}
                    images={iclient?.data?.customerImages.map((f) => ({
                      id: f.id,
                      url: f.image_url,
                    }))}
                  />
                </div>
                <div className="w-full">
                  <div className="w-full bg-white p-3">
                    <div className="flex flex-row gap-3">
                      {buttons.map((button) => (
                        <div
                          key={button.id}
                          className={`flex w-20 items-center justify-center rounded-md ${
                            activeButton === button.id
                              ? "bg-primary"
                              : "bg-gray-300"
                          } cursor-pointer px-4 py-2`}
                          onClick={() => handleButtonClick(button.id)}
                        >
                          <h5 className="font-semibold text-white">
                            {button.label}
                          </h5>
                        </div>
                      ))}
                    </div>
                  </div>
                  {
                    buttons.find((button) => button.id === activeButton)
                      ?.component
                  }
                </div>
              </div>
            )}
            {customer && customer.id && (
              <>
                {customer && (
                  <ModalWrapper
                    title={`Reactivate ${customer.first_name} ${customer.last_name}`}
                    type="warning"
                    content={customerActionModal(
                      customer.status as CustomerStatus
                    )}
                    onOk={() =>
                      handleCustomerStatus(
                        customer.status as CustomerStatus,
                        customer?.id
                      )
                    }
                    onClose={closeModal}
                  />
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div>{"No client found with the provided ID."}</div>
      )}
    </div>
  );
};

export default CustomerPage;
