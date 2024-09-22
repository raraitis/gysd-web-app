import React from "react";
import CommonInputFieldNew from "@/components/Input/CommonInputFieldNew";

type Props = {
  name: string;
  label: string;
  fields: any[];
  setFieldValue: (field: string, value: any) => void;
  handleBlur?: (e: React.FocusEvent<any>) => void;
  errors?: { [key: string]: any };
  touched?: {
    [key: string]: any;
  };
  disabled?: boolean;
};

const FormArray: React.FC<Props> = ({
  name,
  label,
  fields,
  setFieldValue,
  handleBlur,
  errors,
  touched,
  disabled,
}) => {
  const updateField = (
    index: number,
    fieldName: keyof any,
    value: string
  ) => {
    const newFields: any[] = [...fields];
    newFields[index] = {
      ...newFields[index],
      [fieldName]: value,
    };
    setFieldValue(`${name}`, newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFieldValue(`${name}`, newFields);
  };

  const addField = () => {
    const newField: any = {
      id: Date.now().toString(),
      text: "",
      price: "",
    };
    setFieldValue(`${name}`, [...fields, newField]);
  };
  return (
    <div className="flex flex-col py-4">
      <label className="mb-4 text-xl">{label}</label>

      {fields?.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-center gap-2">
            <CommonInputFieldNew
              id={`${name}.${index}.text`}
              handleChange={(e) => updateField(index, "text", e.target.value)}
              name={`${name}.${index}.description`}
              value={field.text}
              handleBlur={handleBlur}
              error={field.text === "" ? " is required" : ""}
              label="Description"
              type="text"
              disabled={disabled}
            />
            <CommonInputFieldNew
              id={`${name}.${index}.price`}
              handleChange={(e) => updateField(index, "price", e.target.value)}
              name={`${name}.${index}.price`}
              value={field.price}
              label="Price"
              type="number"
              error={field.price === "" ? " is required" : ""}
              handleBlur={handleBlur}
              disabled={disabled}
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeField(index)}
                className="mt-3 rounded bg-red-200 px-4 py-2 text-white"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      {!disabled && (
        <button
          type="button"
          onClick={addField}
          disabled={disabled}
          className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-zinc-200"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default FormArray;
