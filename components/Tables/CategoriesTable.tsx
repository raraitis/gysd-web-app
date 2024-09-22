"use client";
import { Category } from "@/types/types";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const headers = ["Name", "Actions"];

interface Props {
  categories: Category[];
  onDelete: (category: Category) => void;
  onEdit: (category: Category) => void;
}

const CategoriesTable: FC<Props> = ({ categories, onDelete, onEdit }) => {
  const router = useRouter();

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          {headers.map((header: string, index: number) => (
            <th
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white"
              key={index}
            >
              {header !== "Actions" ? (
                <p className="flex w-full">{header}</p>
              ) : (
                <p className="flex w-full justify-end">{header}</p>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories?.map((category: Category) => (
          <tr
            className={clsx(
              "dark:bg-boxdarkdark",
              "border-gray-1",
              "max-h-90",
              "cursor-pointer",
              "overflow-hidden",
              "dark:border-stroke",
              "dark:text-white",
              "md:max-h-90",
              "hover:bg-gray-50/40"
            )}
            key={category.id}
          >
            {headers.map((header, index) => (
              <td
                key={index}
                className={`cursor-pointer border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                  index === 0 ? "font-semibold" : ""
                }`}
              >
                {header === "Name" ? (
                  <p
                    className="text-black dark:text-white"
                    onClick={() => {
                      router.push(`/categories/${category.category}`);
                    }}
                  >
                    {category.category}
                  </p>
                ) : header === "Actions" ? (
                  <div className="flex items-center justify-end space-x-3.5">
                    <PencilSquareIcon
                      className="h-6 w-6"
                      onClick={(e) => {
                        onEdit(category);
                      }}
                    />
                    {category && category.id && (
                      <TrashIcon
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          category.id && onDelete(category);
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriesTable;
