"use client";

import { FC, useRef, useState } from "react";
import useClickOutside from "@/utils/use-click-outside";
import { clsxm } from "@/utils/clsxm";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { Option } from "@/types/types";

type Props = {
  label: string;
  name: string;
  onOptionSelect: (option: Option) => void;
  options: Option[] | [];
  value: string;
  error?: string;
  widthClassName?: string;
  placeholder?: string;
  classes?: string[];
  disabled?: boolean;
};

const DropdownCustom: FC<Props> = ({
  label,
  onOptionSelect,
  disabled,
  options,
  value,
  error,
  widthClassName,
  placeholder,
  classes,
}) => {
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options?.find((option) => option.name === value)
  );
  //

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

  return (
    <>
      <div ref={dropdownRef} className={inputStyle}>
        {label ? (
          <label
            className={clsxm(
              `${error ? "text-danger" : "text-gray dark:text-white"}`,
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
          disabled={disabled}
          className={clsxm(
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
          <p
            className={clsxm(
              selectedOption?.name ? "text-black" : "text-zinc-400"
            )}
          >
            {selectedOption?.name ?? placeholder}
          </p>
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
              {options?.map((option: Option) => {
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
                    onClick={() => {
                      onOptionSelect(option);
                      setSelectedOption(option);
                      toggleDropdown();
                    }}
                  >
                    <label
                      id={option.id}
                      className={clsxm(
                        "ml-3",
                        "w-full",
                        "py-2",
                        "text-sm",
                        "font-medium",
                        option.value === value ? "text-white" : "text-gray-900",
                        "dark:text-gray-300",
                        "cursor-pointer"
                      )}
                    >
                      {option.name}
                    </label>
                  </div>
                );
              })}
              {options?.length === 0 && (
                <div className="text-center">No options found</div>
              )}
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default DropdownCustom;
