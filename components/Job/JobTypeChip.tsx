import React from "react";

type AdminTypeChipProps = {
  type: string;
};

const RoleChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  return (
    <div className="flex gap-2">
      <div
        className={`font-sans relative grid select-none items-center whitespace-nowrap rounded-md bg-zinc-500  px-2 py-1 text-xs font-bold uppercase `}
      >
        <span className="text-white">{type}</span>
      </div>
    </div>
  );
};

export default RoleChip;
