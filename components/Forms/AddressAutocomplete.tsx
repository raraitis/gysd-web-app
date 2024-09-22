import React from "react";
import { FieldProps } from "formik";
import { clsxm } from "@/utils/clsxm";
import AddressAutocompleteInputField from "./AddressAutocompleteInputField";
import { Results } from "@/pages/api/address/search-place";

type OnSelectFunction = (location: { lat: number; lng: number }) => void;

export interface LocationInfo {
  address: string;
  lat: number | null;
  lng: number | null;
}

interface AddressSearchProps {
  name?: string;
  onSelectLocation: (location: Results) => void;
  reset: boolean;
  onSelect?: OnSelectFunction;
  initialValues?: LocationInfo;
  field?: FieldProps["field"];
  validate?: () => void;
  form?: FieldProps["form"];
  error?: string;
  disabled?: boolean;
}

const AddressAutocomplete: React.FC<AddressSearchProps> = ({
  onSelectLocation,
  reset,
  initialValues,
  validate,
  onSelect,
  field,
  form,
  name,
  error,
  disabled,
}) => {
  const handleSelection = (res: Results) => {
    onSelectLocation(res);
  };

  return (
    <div className="relative mb-2 flex w-full flex-col">
      <div
        className={clsxm(
          "block w-full font-medium text-black ",
          `${error ? "text-danger" : "dark:text-white"}`
        )}
      >
        {"Address" + " " + `${error ?? ""}`}
      </div>
      <AddressAutocompleteInputField
        field={field}
        form={form}
        name={name}
        validate={validate}
        reset={reset}
        initialValues={initialValues}
        onSelectLocation={(address: Results) => {
          handleSelection(address);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default AddressAutocomplete;
