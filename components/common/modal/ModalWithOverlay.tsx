import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  type: string;
}

const ModalWithOverlay: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  type,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{ zIndex: 30000 }}
      className="no-scrollbar fixed  inset-0 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div
        className={`no-scrollbar absolute max-h-[90%] min-h-[40%] overflow-y-auto rounded-lg bg-white p-8 opacity-100 dark:bg-boxdark-2 ${
          type === "form" ? "min-w-[40%]" : "max-w-[80%]"
        }`}
      >
        <button
          onClick={onClose}
          className="text-md absolute right-10 top-5 cursor-pointer"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalWithOverlay;
