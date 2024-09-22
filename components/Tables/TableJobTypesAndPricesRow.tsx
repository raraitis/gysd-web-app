"use client";

import {
  JobOrigin,
  Price,
  JobCategories,
  CostMultiplier,
  Option,
} from "@/types/types";
import { clsxm } from "@/utils/clsxm";
import { formatToDollar } from "@/utils/utils";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import JobCategoryChip from "../Categories/JobCategoryChip";
import JobOriginChip from "../Categories/JobOriginChip";
import DropdownDefault from "../Dropdowns/DropdownDefault";

interface TableRowProps {
  price: Price;
  onDelete: () => void;
  onEdit: () => void;
}

const TableJobTypesAndPricesRow: FC<TableRowProps> = ({
  price,
  onDelete,
  onEdit,
}) => {

  return (
    <tr
      className={clsxm(
        "dark:bg-boxdarkdark",
        "border-gray-1",
        "max-h-90",
        "cursor-pointer",
        "overflow-x-auto",
        "dark:border-stroke",
        "dark:text-white",
        "md:max-h-90"
      )}
    >
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="text-black dark:text-white">{price.job}</div>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="text-black dark:text-white">
          {price?.categories && price && price.categories.length !== 0 && (
            <JobCategoryChip
              type={price.categories[0].category.category as JobCategories}
            />
          )}
        </div>
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="text-black dark:text-white">
          <JobOriginChip
            type={price.isExternal ? JobOrigin.EXTERNAL : JobOrigin.INTERNAL}
          />
        </div>
      </td>
      <td className="flex flex-row content-end items-center justify-end space-x-3.5 border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <PencilSquareIcon className="h-6 w-6" onClick={onEdit} />
        <TrashIcon className="h-6 w-6" onClick={onDelete} />
      </td>
    </tr>
  );
};

export default TableJobTypesAndPricesRow;
