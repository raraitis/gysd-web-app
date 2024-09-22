import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { GeocodeResponse, Result } from "@/pages/api/address/search-place";
import clsx from "clsx";
import { FieldProps } from "formik";
import { clsxm } from "@/utils/clsxm";

type OnSelectFunction = (location: { lat: number; lng: number }) => void;

type LocationInfo = {
  address?: string;
  lat: number | null | undefined;
  lng: number | null | undefined;
};

interface AddressSearchProps {
  onSelectLocation: (location: Result) => void;
  reset: boolean;
  onSelect?: OnSelectFunction;
  initialValues?: LocationInfo;
  form?: FieldProps["form"];
  name?: string;
  error?: FieldProps["meta"]["error"];
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onSelectLocation,
  reset,
  initialValues,
  onSelect,
  form,
  name,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (reset) {
      setInputValue("");
      setShowDropdown(false);
    }
    if (initialValues?.address && initialValues !== undefined) {
      setInputValue(initialValues?.address);
    }
  }, [reset, initialValues]);

  const { data: suggestedLocations, error: geoCodeError } =
    useSWR<GeocodeResponse>(
      inputValue
        ? `/api/address/address-autocomplete?address=${encodeURIComponent(
            inputValue
          )}`
        : null,
      fetcher
    );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setShowDropdown(true);
  };

  const handleLocationSelect = (selectedOption: Result) => {
    setInputValue(selectedOption.formatted_address);
    onSelectLocation(selectedOption);
    if (onSelect) {
      onSelect({
        lat: selectedOption.geometry.location.lat,
        lng: selectedOption.geometry.location.lng,
      });
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative flex w-full flex-col">
      <div
        className={
          (clsxm("mb-2.5 block w-full font-medium text-black "),
          `${error ? "text-danger" : "dark:text-white"}`)
        }
      >
        {"Address" + " " + `${error ? error : ""}`}
      </div>
      <div>
        <input
          className={clsx(
            "flex",
            "min-w-full",
            "rounded",
            "border-[1.5px]",
            "border-stroke",
            "bg-transparent",
            "px-5",
            "py-3",
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
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter address..."
          onBlur={() => {
            form?.handleBlur(name);
            form?.validateForm();
            form?.setFieldTouched(name ? name : "", true);
          }}
        />
      </div>
      {showDropdown && (
        <div className="border-[1.5px]rounded absolute left-0 right-0 top-[70px] z-10 border-[1.5px] border-stroke bg-transparent bg-white font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary">
          {suggestedLocations && suggestedLocations.predictions ? (
            suggestedLocations.predictions.map((result: any, index: number) => (
              <div
                key={index}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => handleLocationSelect(result)}
              >
                {result.formatted_address}
              </div>
            ))
          ) : (
            <div className="p-2">No suggestions</div>
          )}
        </div>
      )}

      {geoCodeError && (
        <p className="absolute left-0 right-0 top-10 mt-1 bg-red-100 p-2">
          {geoCodeError.message}
        </p>
      )}
    </div>
  );
};

export default AddressSearch;
