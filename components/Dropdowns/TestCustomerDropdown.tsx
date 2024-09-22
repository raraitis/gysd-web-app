"use client";

import { clsxm } from "@/utils/clsxm";
import clsx from "clsx";
import { Field, FieldProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import useClickOutside from "@/utils/use-click-outside";
import { Customer, CustormerResponseData } from "@/types/types";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { config } from "@/lib/api/config";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";

type Props = {
  form: FieldProps["form"];
  field: FieldProps["field"];
  initialCustomer?: Customer;
  label: string;
  name: string;
  onBlur?: () => void;
  error: string | undefined;
};

export const TestCustomerDropdown = ({
  form,
  field,
  initialCustomer,
  label,
  name,
  onBlur,
  error,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    initialCustomer?.first_name && initialCustomer?.last_name
      ? `${initialCustomer?.first_name} ${initialCustomer?.last_name}`
      : ""
  );

  const debouncedSearchInput = useDebounceNew(inputValue, 400);

  const url =
    debouncedSearchInput &&
    debouncedSearchInput.trim().length > 0 &&
    `${config.clientList}?query=${debouncedSearchInput}`;

  function handleInputChange(e: any) {
    if (!dropdownOpen) setDropdownOpen(true);
    setInputValue(e.target.value);
  }

  const {
    data: customersData,
    error: customersError,
    isLoading: isCustomersLoading,
  } = useSWR<CustormerResponseData>(url, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setDropdownOpen(false);
  });

  return (
    <div role="group" ref={dropdownRef} className="relative pb-2">
      <label
        className={clsxm([
          `${error ? "text-danger" : " text-black dark:text-white"}`,
          "font-medium",
        ])}
      >
        {label + " " + `${error ?? ""}`}
      </label>
      <input
        className={clsxm(
          "w-full",
          "flex",
          "justify-between",
          "rounded",
          "border-[1.5px]",
          "border-stroke",
          "bg-transparent",
          "px-5",
          "py-3",
          "text-left",
          "font-medium",
          "outline-none",
          "transition",
          "focus:border-primary",
          "active:border-primary",
          "disabled:cursor-default",
          "disabled:bg-whiter",
          "dark:border-form-strokedark",
          "dark:bg-form-input",
          "dark:focus:border-primary"
        )}
        placeholder="Search a customer..."
        value={inputValue}
        onClick={() => {
          setDropdownOpen(true);
        }}
        onFocus={() => {
          form.setFieldTouched(name, true);
        }}
        onBlur={() => {
          form.handleBlur(name);
        }}
        onChange={handleInputChange}
      />

      {dropdownOpen && (
        <div
          className={clsxm(
            "absolute",
            "z-10",
            "left-0",
            "w-full",
            "rounded",
            "border-[1.5px]",
            "border-stroke",
            "bg-white",
            "px-3",
            "py-3",
            "text-left",
            "font-medium",
            "outline-none",
            "transition",
            "focus:border-primary",
            "active:border-primary",
            "disabled:cursor-default",
            "disabled:bg-whiter",
            "dark:border-form-strokedark",
            "dark:bg-form-input",
            "dark:focus:border-primary"
          )}
        >
          {customersData?.data?.count !== 0 &&
            customersData?.data?.customers.length !== 0 &&
            customersData?.data?.customers.map((customer: Customer) => {
              return (
                <div
                  key={customer.id}
                  className={clsx(
                    "block",
                    "hover:bg-zinc-200",
                    "dark:hover:bg-meta-4",
                    field.value === customer.id ? "bg-meta-4" : null,
                    "flex",
                    "items-center",
                    "gap-2",
                    "cursor-pointer",
                    "w-full"
                  )}
                >
                  <label
                    htmlFor={customer.id}
                    className={clsx(
                      "ml-3",
                      "w-full",
                      "py-2",
                      "text-sm",
                      "font-medium",
                      "text-gray-900",
                      "dark:text-gray-300",
                      "cursor-pointer"
                    )}
                  >
                    <Field
                      {...field}
                      id={customer.id}
                      type="radio"
                      value={customer.id}
                      onClick={() => {
                        setInputValue(
                          `${customer.first_name} ${customer.last_name}`
                        );
                        form.setValues(
                          {
                            ...form.values,
                            customer_id: customer.id,
                            email: customer.email,
                            phone: customer.mobile_number,
                          },
                          false
                        );
                        setDropdownOpen(false);
                      }}
                      name="customer_id"
                      className="hidden h-4 w-4 cursor-pointer "
                    />
                    <p className="font-md">
                      {customer.first_name} {customer.last_name}
                    </p>
                  </label>
                </div>
              );
            })}
          {customersData?.data?.customers.length === 0 && (
            <div className="text-center">No customers found</div>
          )}
          {customersError && <div>Failed to load</div>}
          {isCustomersLoading && (
            <div>
              <LoadingIndicatorSmall />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
