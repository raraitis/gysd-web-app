import useClickOutside from "@/utils/use-click-outside";
import { useRef, useState } from "react";

type Option = {
  id: string;
  name: string;
  value: string | number | boolean;
};

type DropdownDefaultProps = {
  options: Option[];
};

const DropdownDefault: React.FC<DropdownDefaultProps> = ({ options }) => {
  const [openIndex, setOpenIndex] = useState<boolean | null>(null);
  const [selectedValue, setSelectedValue] = useState<
    string | number | boolean | null
  >(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setOpenIndex(false);
  });

  const toggleDropdown = () => {
    setOpenIndex(!openIndex);
  };

  const handleSelectedValue = (value: string | number | boolean | null) => {
    setSelectedValue(value);
    toggleDropdown();
  };

  const handleTriggerClick = () => {
    if (options.length > 0) {
      toggleDropdown();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleTriggerClick}
        className="flex rounded-md border px-2 py-1 dark:text-white"
      >
        {options.length > 0 ? (
          selectedValue !== null ? (
            <span>{selectedValue}</span>
          ) : (
            <span className="truncate">
              {options &&
                options[0] &&
                `${options[0].name} - ${options[0].value}`}
            </span>
          )
        ) : (
          <span className="truncate ">N/A</span>
        )}
      </div>
      {openIndex && (
        <div
          className={`absolute right-0 top-full z-40 w-25 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white`}
        >
          {options &&
            options.length > 0 &&
            options.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  toggleDropdown();
                  handleSelectedValue(option.value);
                }}
                className="flex items-center gap-2 rounded-sm px-1 py-1 text-left text-sm hover:bg-gray-100  dark:text-white dark:hover:bg-meta-4"
              >
                {option.name} - {option.value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownDefault;
