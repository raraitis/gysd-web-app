import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = (value: string, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIsCopied(true);
        toast.success("Copied!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Unable to copy to clipboard", error);
      });
  };

  const CopyButton = ({ value }: { value: string }) => (
    <button
      className="text-blue-500 "
      onClick={(e) => handleCopyClick(value, e)}
    >
      <div className="mx-1 flex items-center justify-center text-black dark:text-gray-500">
        <DocumentDuplicateIcon height={20} width={20} />
      </div>
    </button>
  );

  return { isCopied, handleCopyClick, CopyButton };
};

export default useClipboard;
