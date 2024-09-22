import { Field } from "formik";
import { FC } from "react";
import { clsxm } from "@/utils/clsxm";

type Props = {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  value: string | number | undefined;
  type: "text" | "password" | "number" | "email" | "textarea" | "select";
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  onFocus?: (e: React.FocusEvent<any>) => void;
  error?: string;
  min?: any;
  step?: any;
  rows?: number;
  onKeyPress?: any;
};
const CommonInputField: FC<Props> = ({
  id,
  label,
  name,
  placeholder,
  value,
  type,
  handleBlur,
  handleChange,
  onFocus,
  error,
  min,
  step,
  rows,
  onKeyPress,
}) => {
  const inputStyle = clsxm("w-full mb-2");

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
      {type === "textarea" ? (
        <textarea
          className="bg-gray w-full rounded border border-stroke py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          name={name}
          id={id}
          rows={rows ?? 10}
          placeholder={placeholder ?? ""}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <Field
          className={
            "w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary"
          }
          placeholder={placeholder ?? ""}
          type={type !== "number" ? type : "text"}
          inputMode={type === "number" ? "numeric" : undefined}
          name={name}
          id={id}
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={onFocus ?? undefined}
          step={step}
          min={min}
          onKeyPress={onKeyPress}
        />
      )}
    </div>
  );
};

export default CommonInputField;
