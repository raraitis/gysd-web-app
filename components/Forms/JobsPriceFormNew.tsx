"use client";

import { Field, FieldProps, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import CommonInputField from "../Input/CommontInputField";
import { useState } from "react";
import {
  CreatePriceResponse,
  JobsCategoriesResponse,
  Price,
  Option,
} from "@/types/types";
import { Button } from "@/components/Ui/Button";
import { postUrl, remove } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";
import toast from "react-hot-toast";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { clsxm } from "@/utils/clsxm";
import useSWR from "swr";
import { fetcher } from "@/lib/httpClient";
import DropdownCustom from "../Dropdowns/DropdownCustom";
import axios from "axios";
import FileInput from "../Input/FileInput";

type Props = {
  price?: Price;
  mutate: () => void;
};

const JobsPriceForm = ({ price, mutate }: Props) => {
  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExternal, setIsExternal] = useState(price?.isExternal ?? false);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    mutate: categoriesMutate,
    isValidating: isCategoriesValidating,
  } = useSWR<JobsCategoriesResponse>(config.adminJobCategories, fetcher);

  const validationSchema = Yup.object().shape({
    job: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    isExternal: Yup.boolean().optional(),
  });

  const initialValues = {
    job: price?.job ?? "",
    category: price?.categories[0]?.category_id ?? "",
    isExternal: isExternal,
  };

  async function handleCreate(values: typeof initialValues) {
    const data = await postUrl<CommonResponse<CreatePriceResponse>>({
      url: config.adminJobPriceCreate,
      data: {
        job: values.job,
        category: values.category,
        isExternal,
      },
      config: {
        method: "POST",
      },
      onResponse: ({ data }) => {
        if (data && !!data.success) {
          setIsLoading(false);
          setIsSuccess(true);
          toast.success("Changes saved successfuly");
          mutate();
          return data.success;
        }
      },
      onError: (error: any) => {
        setIsError(error?.response?.data?.error ?? "Something went wrong.");
        setIsLoading(false);
        setIsSuccess(false);
        toast.error(error?.response?.data?.error ?? "Something went wrong.");
        return false;
      },
    });

    return data;
  }

  async function handleUpdate(values: typeof initialValues, id: string) {
    let valuesChanged;
    if (price) {
      valuesChanged = compareObjects(
        {
          job: values.job,
          category: values.category,
          isExternal: values.isExternal,
        },
        {
          job: price.job,
          category: price?.categories[0]?.category_id,
          isExternal: price.isExternal,
        }
      );

      if (valuesChanged.includes("category")) {
        await handleDeleteCategoryFromPrice();
        await handleCategoryAssign(price.id, values.category);
      }
      if (
        valuesChanged?.length === 0 ||
        (valuesChanged.includes("category") && valuesChanged?.length === 1)
      )
        return { data: { data: price } };
    }

    const data = await postUrl<CreatePriceResponse>({
      url: config.adminJobPriceUpdate,
      data: {
        id,
        job: valuesChanged?.includes("job") ? values.job : undefined,
        category: valuesChanged?.includes("category") ? values.category : "",
        isExternal,
      },
      config: {
        method: "PATCH",
      },
      onResponse: ({ data }) => {
        if (data) {
          setIsLoading(false);
          setIsSuccess(true);
          toast.success("Changes saved successfuly");
          mutate();
          return data.data;
        }
      },
      onError: (error: any) => {
        setIsError(error?.response?.data?.error ?? "Something went wrong.");
        setIsLoading(false);
        setIsSuccess(false);
        toast.error(error?.response?.data?.error ?? "Something went wrong.");
        return null;
      },
    });

    return data;
  }

  async function handleCategoryAssign(priceId: string, categoryId: string) {
    const data = await postUrl<CreatePriceResponse>({
      url: config.assignCategory,
      data: {
        price_id: priceId,
        category_id: categoryId,
      },
      config: {
        method: "POST",
      },
      onResponse: ({ data }) => {
        if (data) {
          setIsLoading(false);
          setIsSuccess(true);
          toast.success("Changes saved successfuly");
          mutate();
          return data.data;
        }
      },
      onError: (error: any) => {
        if (error.response.status === 409) {
          toast.error("Category already assigned to this job");
        } else {
          toast.error(error?.response?.data?.error ?? "Something went wrong.");
        }
        setIsLoading(false);
        setIsError(error?.response?.data?.error ?? "Something went wrong.");
        setIsSuccess(false);
        return null;
      },
    });

    return data;
  }

  async function handleDeleteCategoryFromPrice() {
    try {
      await remove({
        client: axios,
        url: config.removeCategoryFromPrice,
        config: {
          data: {
            price_id: price?.id,
            category_id: price?.categories[0].category_id,
          },
        },
        onError: (error) => {
          toast.error(error.message);
          return false;
        },
        onResponse: ({ data, status }) => {
          return true;
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      mutate();
    }
  }

  async function handleSubmit(values: typeof initialValues) {
    let data: any;
    console.log("values", values);
    if (price) {
      setIsLoading(true);
      await handleUpdate(values, price.id);

      return true;
    } else {
      setIsLoading(true);
      data = await handleCreate(values);
      if (data) {
        console.log("data", data);
        await handleCategoryAssign(data.data.data.id, values.category);
        return true;
      }
    }
    return false;
  }

  const handleAvatarChange = (
    file: File | null,
    formikProps: FormikProps<any>
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        const base64Data = base64String.split(",")[1];

        formikProps.setFieldValue("avatar_url", base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      formikProps.setFieldValue("avatar_url", "");
    }
  };

  return (
    <div
      className={clsxm([
        "w-full",
        "rounded-sm",
        "bg-white",
        "shadow-default",
        "dark:border-strokedark",
        "dark:bg-boxdark",
        "sm:px-7.5",
        "xl:pb-1",
      ])}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            setSubmitting(true);
            const success = await handleSubmit(values);

            if (success) {
              setSubmitting(false);
              resetForm();
            }
          } catch (err) {
            setSubmitting(false);
            console.log("Price Form Error from Formik", err);
          }
        }}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isValid,
            dirty,
            isSubmitting,
          } = formikProps;
          return (
            <div className="flex flex-col">
              {/* <pre>
                {JSON.stringify(
                  values,

                  null,
                  2
                )}
              </pre> */}
              <CommonInputField
                id={"job"}
                label={`Job name`}
                type="text"
                name={"job"}
                placeholder="Enter job name"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.job}
                error={touched.job ? errors.job : undefined}
              />
              <Field name="category">
                {(fieldProps: FieldProps) => {
                  return (
                    <DropdownCustom
                      fieldProps={fieldProps}
                      label={"Category"}
                      name={"category"}
                      placeholder="Select category"
                      value={values.category}
                      handleBlur={handleBlur}
                      setFieldValue={(option: Option) => {
                        setFieldValue("category", option.value);
                      }}
                      options={
                        categoriesData?.data?.categories.map((category) => ({
                          id: category.id,
                          name: category.category,
                          value: category.id,
                        })) ?? []
                      }
                    />
                  );
                }}
              </Field>
              <div>
                <h5 className="mb-2.5 font-medium text-black dark:text-white">
                  Acceptance
                </h5>
                <div className="flex flex-row gap-2">
                  <div
                    onClick={() => {
                      setFieldValue("isExternal", true);
                      setIsExternal(true);
                    }}
                    className={`flex w-1/2 cursor-pointer items-center justify-center rounded-md p-2 text-center shadow-default ${
                      isExternal ? "bg-amber-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    External
                  </div>
                  <div
                    onClick={() => {
                      setFieldValue("isExternal", false);
                      setIsExternal(false);
                    }}
                    className={`flex w-1/2 cursor-pointer items-center justify-center rounded-md p-2 text-center shadow-default ${
                      !isExternal ? "bg-amber-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Internal
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 flex w-full cursor-pointer rounded-lg border border-primary bg-primary p-[14px] text-white transition hover:bg-opacity-90"
                disabled={!dirty || !isValid}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {isSubmitting ? <LoadingIndicatorSmall /> : "Save"}
              </Button>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

type AnyObject = Record<string, any>;

function compareObjects(obj1: AnyObject, obj2: AnyObject): string[] {
  const changedProperties: string[] = [];

  // Iterate through properties of obj1
  for (const key in obj1) {
    if (Object.hasOwn(obj1, key)) {
      // Check if the property exists in obj2
      if (key in obj2) {
        // Compare values
        if (obj1[key] !== obj2[key]) {
          // Values are different, add the property to the list of changed properties
          changedProperties.push(key);
        }
      } else {
        // Property does not exist in obj2
        changedProperties.push(key);
      }
    }
  }

  // Iterate through properties of obj2 to find any additional properties
  for (const key in obj2) {
    if (Object.hasOwn(obj2, key) && !(key in obj1)) {
      // Property exists in obj2 but not in obj1
      changedProperties.push(key);
    }
  }

  return changedProperties;
}

export default JobsPriceForm;
