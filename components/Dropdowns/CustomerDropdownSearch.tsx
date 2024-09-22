"use client";

import { FC, useEffect, useRef, useState } from "react";
import useClickOutside from "@/utils/use-click-outside";
import { clsxm } from "@/utils/clsxm";
import clsx from "clsx";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { Customer, CustormerResponseData } from "@/types/types";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { FieldProps } from "formik";

type Props = {
  form: FieldProps["form"];
  field: FieldProps["field"];
  label: string;
  name: string;
  setFieldValue: (field: string, value: any) => void;
  validate: () => void;
  onBlur?: () => void;
  value: string | undefined;
  error?: string;
  customer?: Customer | null;
  serverError?: string;
  isLoading?: boolean;
  preRequisiteMsg?: string;
};

const CustomerDropdownSearch: FC<Props> = ({
  form,
  field,
  label,
  name,
  setFieldValue,
  validate,
  onBlur,
  value,
  error,
  customer,
  serverError,
  isLoading,
  preRequisiteMsg,
}) => {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(customer ?? undefined);
  const debouncedSearchInput = useDebounceNew(inputValue, 1000);

  useEffect(() => {
    return () => {
      setInputValue(undefined);
      setSelectedCustomer(undefined);
    };
  }, []);

  const url =
    debouncedSearchInput && debouncedSearchInput.trim().length > 0
      ? `${config.clientList}?query=${debouncedSearchInput}`
      : `${config.clientList}`;

  const {
    data: customersData,
    error: customersError,
    isLoading: isCustomersLoading,
  } = useSWR<CustormerResponseData>(url, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: string) => {
    setInputValue(e);
  };

  useClickOutside(dropdownRef, () => {
    setInputValue(undefined);
  });

  function handleSelectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setFieldValue(name, customer.id);
    validate();
    setFieldValue("email", customer.email);
    setFieldValue("phone", customer.mobile_number);

    setInputValue(undefined);
  }

  const inputStyle = clsxm("w-full mb-2", error && "input-error");

  return (
    <div ref={dropdownRef} className={inputStyle}>
      <label
        className={
          (clsxm("mb-2.5 block font-medium text-black "),
          `${error ? "text-danger" : "dark:text-white"}`)
        }
      >
        {label + " " + `${error ?? ""}`}
      </label>
      <input
        {...field}
        placeholder="Search for a customer"
        className={clsx(
          "relative",
          inputValue ? "rounded-b-none border-b-[1.5px]" : "",
          " flex w-full justify-between rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-left font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark  dark:bg-form-input dark:focus:border-primary "
        )}
        value={
          selectedCustomer?.first_name && selectedCustomer?.last_name
            ? `${selectedCustomer?.first_name} ${selectedCustomer?.last_name}`
            : inputValue
        }
        onBlur={() => {
          form.handleBlur(name);
          form.validateForm();
          form.setFieldTouched(name, true);
        }}
        onChange={(e) => {
          setSelectedCustomer(undefined);
          handleInputChange(e.target.value);
        }}
      />
      {inputValue && customersData && (
        <div
          className={
            inputValue && customersData
              ? "absolute z-10 rounded rounded-t-none  border-[1.5px] border-t-[0px] border-stroke bg-white text-left font-medium  outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark  dark:bg-form-input dark:focus:border-primary"
              : "hidden"
          }
        >
          {customersData?.data?.customers ? (
            customersData.data.customers.map((customer) => (
              <div
                className="w-100 cursor-pointer px-5 py-3 hover:bg-zinc-200 dark:hover:bg-meta-4"
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
              >
                <label className="w-100 cursor-pointer">
                  {customer.first_name} {customer.last_name}
                </label>
              </div>
            ))
          ) : (
            <div className="w-100 cursor-pointer px-5 py-3 hover:bg-zinc-200 dark:hover:bg-meta-4">
              <label className="w-100 cursor-pointer">No customers found</label>
            </div>
          )}
        </div>
      )}
      {isCustomersLoading && <LoadingIndicatorSmall />}
    </div>
  );
};

export default CustomerDropdownSearch;
