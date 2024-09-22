"use client";

import { useState } from "react";

type Props = {
  name: string;
  label: string;
  value: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
};

const CheckboxOne = ({ name, value, label, handleChange }: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={name}
            className="sr-only"
            checked={value}
            onChange={handleChange}
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "bg-gray border-primary dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${value && "bg-primary"}`}
            ></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxOne;
