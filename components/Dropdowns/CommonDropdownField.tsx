import { FC, useState, useRef } from "react";
import { clsxm } from "@/utils/clsxm";
import useClickOutside from "@/utils/use-click-outside";
import { EmployeeData, TabProps } from "@/types/types";

type Props = {
  id: string;
  label: string;
  name: string;
  value: string;
  options: TabProps[];
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  placeholder: string;
  employee?: EmployeeData;
};

const CommonDropdownField: FC<Props> = ({
  id,
  label,
  name,
  value,
  options,
  handleBlur,
  handleChange,
  error,
  placeholder,
  employee,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const labelStyle = clsxm("block dark:text-white ", error && "text-danger");
  const dropdownStyle = clsxm("relative", error && "input-error", "pb-2");
  const selectStyle = clsxm(
    "w-full rounded border-[1.5px] border-stroke bg-white px-5 dark:text-white/70 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
    isFocused && "shadow-md",
    value === "Role" && !employee ? "py-3" : "py-3"
  );

  useClickOutside(dropdownRef, () => {
    setIsFocused(false);
  });

  return (
    <div ref={dropdownRef} className={dropdownStyle}>
      <div className={labelStyle}>{error ?? label}</div>
      <div className="relative ">
        <div className="relative inline-block w-full ">
          <div
            className={selectStyle}
            onClick={() => setIsFocused((prev) => !prev)}
          >
            {!value ? (
              <span className="text-gray-500 dark:text-white">{label}</span>
            ) : (
              <>
                {placeholder && !value ? (
                  <span className="text-gray-500 dark:text-white">
                    {placeholder}
                  </span>
                ) : (
                  options.find((option) => option.value === value)?.label
                )}
              </>
            )}
          </div>
          {isFocused && (
            <div className="absolute z-10 w-full bg-white shadow-md dark:bg-boxdark dark:text-white">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    handleChange({
                      target: { name, value: option.value },
                    } as React.ChangeEvent<any>);
                    setIsFocused(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4"
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonDropdownField;
