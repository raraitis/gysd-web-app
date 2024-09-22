import React, { FC, ChangeEvent, useState } from "react";
import { clsxm } from "@/utils/clsxm";

type FileInputProps = {
  id: string;
  label: string;
  name: string;
  handleChange: (file: File | null, e: ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  onFocus?: (e: React.FocusEvent<any>) => void;
  error?: string;
};
const FileInput: FC<FileInputProps> = ({
  id,
  label,
  name,
  handleChange,
  onBlur,
  onFocus,
  error,
}) => {
  const inputStyle = clsxm("w-full mb-2 flex flex-col", error && "input-error");
  const buttonStyle = clsxm(
    "bg-amber-500 hover:bg-amber-700 text-white h-10  font-bold py-2 px-2 text-sm rounded cursor-pointer",
    error && "bg-red-500"
  );
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange(file, e);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className={inputStyle}>
      <label
        className={clsxm(
          "mb-2.5 font-medium text-black",
          `${error ? "text-danger" : "dark:text-white"}`
        )}
      >
        {label + " " + `${error ?? ""}`}
      </label>
      <div className="flex flex-row items-start gap-2">
        <input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange}
          onBlur={onBlur}
          onFocus={onFocus}
          accept="image/*"
          value={undefined}
          className="sr-only"
        />
        <label htmlFor={id} className={buttonStyle}>
          Choose File
        </label>
        {preview && (
          <div className="">
            <img
              src={preview}
              alt="Preview"
              style={{ width: "fit-content", maxWidth: "100px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
