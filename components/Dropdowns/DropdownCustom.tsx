"use client";

import { FC, useEffect, useRef, useState } from "react";
import useClickOutside from "@/utils/use-click-outside";
import { clsxm } from "@/utils/clsxm";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Field, FieldProps } from "formik";
import { JobType, Option } from "@/types/types";

type Props = {
  label?: string;
  name?: string;
  fieldProps?: FieldProps;
  handleBlur?: (e: React.FocusEvent<any>) => void;
  setFieldValue?: (option: Option) => void;
  onOptionSelect?: (option: Option) => void;
  options: Option[] | [];
  value: string | boolean | number | undefined | JobType;
  error?: string;
  widthClassName?: string;
  placeholder?: string;
  classes?: string[];
};

const DropdownCustom: FC<Props> = ({
  label,
  name,
  fieldProps,
  handleBlur,
  setFieldValue,
  onOptionSelect,
  options,
  value,
  error,
  widthClassName,
  placeholder,
  classes,
}) => {
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options?.find((option) => option.value === value)
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setDropDownOpen(false);
  });

  const inputStyle = clsxm(
    widthClassName ?? "w-full",
    "mb-2",
    error && "input-error",
    classes ?? []
  );

  const toggleDropdown = () => {
    setDropDownOpen(!dropdownOpen);
  };

  useEffect(() => {
    setSelectedOption(
      options?.find((option) => {
        return option.value === value;
      })
    );
  }, [options, value]);

  const handleOptionClick = (option: Option) => {
    setFieldValue ? setFieldValue(option) : null;
    onOptionSelect ? onOptionSelect(option) : null;
  };

  return (
    // tslint:disable-next-line: react-a11y-role-has-required-aria-props
    <>
      <div ref={dropdownRef} className={inputStyle}>
        {label ? (
          <label
            className={clsxm(
              `${error ? "text-danger" : "text-black dark:text-white"}`,
              "font-medium"
            )}
          >
            {label + " " + `${error ?? ""}`}
          </label>
        ) : null}
        <button
          title={error ?? label}
          type="button"
          onClick={toggleDropdown}
          className={clsx(
            "relative",
            "inline-block",
            dropdownOpen ? "rounded-b-none " : "",
            "flex",
            "w-full",
            "justify-between",
            "rounded",
            "border-[1.5px]",
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
        >
          {selectedOption?.name ?? placeholder}
          {dropdownOpen ? (
            <ChevronUpIcon className="w-6 cursor-pointer" />
          ) : (
            <ChevronDownIcon className="w-6 cursor-pointer" />
          )}
          {dropdownOpen && (
            <div
              className={clsxm(
                "absolute",

                "z-10",
                "left-[-1.5px]",
                "right-[-1.5px]",
                "top-12",
                "w-full",
                "rounded",
                dropdownOpen ? "rounded-t-none" : "",
                "border-[1.5px]",
                "border-stroke",
                "bg-white",
                "max-h-50",
                "overflow-y-auto",
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
              {options?.map((option: Option, index) => {
                return (
                  <div
                    key={option.id}
                    className={clsx(
                      option.value === value
                        ? "bg-zinc-200 dark:bg-meta-4"
                        : null,
                      "block",
                      "hover:bg-zinc-200",
                      "dark:hover:bg-meta-4",
                      "flex",
                      "items-center",
                      "cursor-pointer",
                      "w-full",
                      "px-3",
                      "py-4"
                    )}
                    onClick={() => handleOptionClick(option)}
                  >
                    {fieldProps ? (
                      <Field
                        label={option.name}
                        checked={option.value === value}
                        {...fieldProps?.field}
                        id={option.id}
                        type="radio"
                        value={option.value}
                        onBlur={handleBlur}
                        onChange={() => handleOptionClick(option)}
                        name={name}
                        className="h-5 w-5 cursor-pointer border-gray-300 bg-gray-100 focus:border-primary focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:border-primary"
                      />
                    ) : null}

                    <label
                      htmlFor={option.id}
                      className="h-5 w-full cursor-pointer pl-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {option.name}
                    </label>
                  </div>
                );
              })}
              {options?.length === 0 && (
                <div className="text-center">No customers found</div>
              )}
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default DropdownCustom;
