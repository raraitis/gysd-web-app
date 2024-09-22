import { useState } from "react";
import toast from "react-hot-toast";

const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = (value: string) => {
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

  return { isCopied, handleCopyClick };
};

export default useClipboard;
