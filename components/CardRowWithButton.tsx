import React, { ReactNode } from "react";

interface Props {
  title: string;
  text: string;
  children: ReactNode;
  btnText: string;
  btnEnabled?: boolean;
  onClick?: () => void;
}

const CardRowWithButton: React.FC<Props> = ({
  title,
  text,
  children,
  btnText,
  btnEnabled,
  onClick,
}) => {
  return (
    <div className="flex w-full items-center justify-start gap-x-5 rounded-sm border border-stroke bg-white px-7.5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between flex-grow">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {text}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
      {!!btnEnabled && (
        <div
          className="flex h-10 min-w-20 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
          onClick={onClick}
        >
          {btnText}
        </div>
      )}
    </div>
  );
};

export default CardRowWithButton;
