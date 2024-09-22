import React, { ReactNode, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ModalType = "warning" | "information";

type ModalProps = {
  type?: ModalType;
  title?: string;
  content?: ReactNode;
  onOk?: () => void;
  onClose?: () => void;
};

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const ModalWrapper: React.FC<ModalProps> = ({
    type,
    title,
    content: Content,
    onOk,
    onClose,
  }) => {
    if (!isModalOpen) {
      return null;
    }

    return (
      <tr
        style={{ zIndex: 3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "
      >
        <td className="w-full max-w-md rounded-md bg-white p-4 shadow-lg dark:bg-boxdark">
          <div className="flex w-full justify-end">
            <XMarkIcon
              className="h-6 w-6 cursor-pointer text-black dark:text-white"
              onClick={onClose ?? closeModal}
            />
          </div>
          <div className="mb-4 flex items-center justify-center">
            {title && (
              <h2
                className={`text-lg font-semibold ${
                  type === "warning" ? "text-yellow-500" : "text-blue-500"
                } text-center`}
              >
                {title}
              </h2>
            )}
          </div>
          <div className="m-4 flex justify-center">{Content && Content}</div>
          <div className="mt-4 flex justify-center gap-2">
            {onOk && (
              <button
                className={`mr-2 rounded-md ${
                  type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                } px-4 py-2 text-white transition hover:bg-opacity-90`}
                onClick={onOk}
              >
                OK
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return { openModal, closeModal, ModalWrapper };
};

export default useModal;
