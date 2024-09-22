import { clsxm } from "@/utils/clsxm";
import React from "react";

export const FieldRow = ({
  label,
  value,
  ClipboardBtn,
  row = false,
  labelSize = "text-sm",
  valueSize = "text-base",
  icon = null,
}: {
  label?: string;
  value: string | React.ReactNode;

  ClipboardBtn?: React.JSX.Element;
  row?: boolean;
  labelSize?: string;
  valueSize?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={clsxm(
        "overflow-elipsis flex flex-col",
        row && "flex-row gap-1"
      )}
    >
      <label
        className={clsxm(
          labelSize ?? "",
          "float-left h-fit w-fit text-gray-400"
        )}
      >
        {label ?? ""}
      </label>
      <span
        className={clsxm(
          "flex flex-row flex-wrap items-center",
          valueSize ?? "",
          "pb-2 text-black dark:text-white"
        )}
      >
        <div className="flex h-full w-full gap-1">
          <div className="pt-1">{icon ?? ""}</div>
          <div>
            {value}
            {ClipboardBtn && typeof value === "string" && ClipboardBtn}
          </div>
        </div>
      </span>{" "}
    </div>
  );
};
