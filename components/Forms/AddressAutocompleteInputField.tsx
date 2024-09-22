import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import { GeocodeResponse, Results } from "@/pages/api/address/search-place";
import clsx from "clsx";
import { FieldProps } from "formik";
import LoaderXSmall from "../common/Loader/LoaderXSmall";

type OnSelectFunction = (location: { lat: number; lng: number }) => void;

interface AddressSearchProps {
  onSelectLocation: (location: Results) => void;
  reset: boolean;
  onSelect?: OnSelectFunction;
  initialValues?: any;
  validate?: () => void;
  form?: FieldProps["form"];
  name?: string;
  error?: string;
  field?: FieldProps["field"];
  isLoading?: boolean;
  disabled?: boolean;
}

const AddressAutocompleteInputField: React.FC<AddressSearchProps> = ({
  onSelectLocation,
  reset,
  initialValues,
  validate,
  onSelect,
  field,
  form,
  name,
  isLoading,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState(initialValues?.address ?? "");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: suggestedLocations, error: geoCodeError } =
    useSWR<GeocodeResponse>(
      inputValue
        ? `/api/address/address-autocomplete?input=${encodeURIComponent(
            inputValue
          )}`
        : null,
      fetcher
    );

  useEffect(() => {
    if (reset) {
      setInputValue("");
      setShowDropdown(false);
    }
  }, [reset]);

  const getLocationGeometry = async (id: string) => {
    try {
      const response = await fetch(`/api/address/search-place?place_id=${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setShowDropdown(true);
  };

  const handleLocationSelect = async (selectedOption: Results) => {
    setInputValue(selectedOption.description);
    setShowDropdown(false);

    if (selectedOption) {
      const coordinates = await getLocationGeometry(selectedOption.place_id);

      if (coordinates) {
        onSelectLocation({ ...selectedOption, coordinates });
      }
    }
    if (validate) validate();
  };

  return (
    <>
      <div>
        {isLoading ? (
          <div
            className={clsx(
              "flex",
              "min-w-full",
              "rounded",
              "border-[1.5px]",
              "border-stroke",
              "bg-transparent",
              "justify-center",
              "items-center",
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
          >
            <LoaderXSmall />
          </div>
        ) : (
          <input
            {...field}
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
            disabled={disabled}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter address..."
            onBlur={() => {
              form?.handleBlur(name);
              form?.validateForm();
              form?.setFieldTouched(name ?? "", true);
            }}
          />
        )}
      </div>
      {showDropdown && (
        <div
          className={`${
            disabled ? "cursor-not-allowed bg-whiter" : "bg-white"
          } border-[1.5px]rounded absolute left-0 right-0 top-[70px] z-10 border-[1.5px] border-stroke bg-transparent  font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary`}
        >
          {suggestedLocations && suggestedLocations.predictions ? (
            suggestedLocations.predictions.map(
              (result: Results, index: number) => (
                <div
                  key={result.place_id}
                  className={`cursor-pointer p-2 hover:bg-gray-200 `}
                  onClick={() => {
                    handleLocationSelect(result);
                  }}
                >
                  {result.description}
                </div>
              )
            )
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
    </>
  );
};

export default AddressAutocompleteInputField;
