"use client";

import { Customer, CustormerResponseData } from "@/types/types";
import { useRef, useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { config } from "@/lib/api/config";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import useClickOutside from "@/utils/use-click-outside";
import { clsxm } from "@/utils/clsxm";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";

type Props = {
  customer?: Customer;
  setCustomer: (value: Customer) => void;
  onSelect?: (customer: Customer) => void;
  disabled?: boolean;
};

const CustomerDropdownNew = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    props.customer?.first_name && props.customer?.last_name
      ? `${props.customer?.first_name} ${props.customer?.last_name}`
      : ""
  );

  const debouncedSearchInput = useDebounceNew(inputValue, 400);

  const url =
    debouncedSearchInput &&
    debouncedSearchInput.trim().length > 0 &&
    `${config.clientList}?query=${encodeURIComponent(debouncedSearchInput)}`;

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
      <label className={clsxm(["text-black dark:text-white", "font-medium"])}>
        Search customer...
      </label>
      <input
        type="text"
        placeholder="search customer..."
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
        value={inputValue}
        onClick={() => {
          setDropdownOpen(true);
        }}
        onChange={handleInputChange}
        disabled={props.disabled}
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
                  className={clsxm(
                    "block",
                    "hover:bg-zinc-200",
                    "dark:hover:bg-meta-4",
                    props.customer === customer ? "bg-meta-4" : null,
                    "flex",
                    "items-center",
                    "gap-2",
                    "cursor-pointer",
                    "w-full"
                  )}
                >
                  <label
                    htmlFor={customer.id}
                    className={clsxm(
                      "ml-3",
                      "w-full",
                      "py-2",
                      "text-sm",
                      "font-medium",
                      props.customer === customer
                        ? "text-white"
                        : "text-gray-900",
                      "dark:text-gray-300",
                      "cursor-pointer"
                    )}
                  >
                    <p
                      className="font-md"
                      onClick={() => {
                        props.setCustomer(customer);
                        props.onSelect && props.onSelect(customer);
                        setInputValue(
                          `${customer.first_name} ${customer.last_name}`
                        );
                      }}
                    >
                      {props.customer
                        ? props.customer.first_name
                        : customer.first_name}{" "}
                      {props.customer
                        ? props.customer.last_name
                        : customer.last_name}
                    </p>
                  </label>
                </div>
              );
            })}
          {customersData?.data?.customers.length === 0 && !props.customer && (
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

export default CustomerDropdownNew;
