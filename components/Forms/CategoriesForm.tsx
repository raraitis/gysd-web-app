"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import CommonInputField from "@/components/Input/CommontInputField";
import { FC, useState } from "react";
import LoadingIndicatorSmall from "@/components/Indicators/LoadingIndicatorSmall";
import { postUrl } from "@/lib/api/common";
import { Category, CreateCategoryResponse } from "@/types/types";
import { config } from "@/lib/api/config";
import toast from "react-hot-toast";
import { CommonResponse } from "@/types/responses";
import { useRouter } from "next/navigation";
import { Button } from "../Ui/Button";

interface Props {
  category?: Category | null;
  onMutate?: () => void;
  close?: () => void;
}

const CategoriesForm: FC<Props> = ({ category, onMutate, close }) => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    id: Yup.string(),
    category: Yup.string(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const initialValues: Category = {
    id: "",
    category: category ? category.category : "",
  };

  const handleSubmitForm = async (values: Category) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const data = {
      category: values.category,
    };

    if (!category) {
      await postUrl<CommonResponse<CreateCategoryResponse>>({
        url: config.adminAddCategory,
        data: data,
        onResponse: ({ data }) => {
          if (data && !!data.success) {
            onMutate ? onMutate() : null;
            setIsLoading(false);
            toast.success("Changes saved successfully");
            return data.success;
          }
        },
        onError: (error: any) => {
          setIsLoading(false);
          toast.error(
            `Oops! Something went wrong: ${error.message || "Unknown error"}`
          );
          return false;
        },
      });
    } else {
      try {
        await postUrl({
          url: config.updateCategory,
          config: {
            method: "PATCH",
          },
          data: {
            id: category.id,
            category: values.category,
          },

          onError: (error) => {
            toast.error(error.message);
          },
          onResponse: ({ data, status }) => {
            toast.success(`Category has updated successfully`);
          },
        });
      } catch (error) {
        toast.error("Failed to update category");
      } finally {
        close ? close() : null;
        onMutate ? onMutate() : null;
        setIsLoading(false);
      }
    }
    return true;
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-white p-5 dark:border-strokedark dark:bg-boxdark">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const success = await handleSubmitForm(values);

            if (success) {
              resetForm();
              router.push("/categories/list");
            }
          } catch (err) {
            console.log(err);
          } finally {
            setIsLoading(false);
            resetForm();
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex w-100">
              <CommonInputField
                id="category"
                placeholder={"Category name"}
                label={""}
                type="text"
                name={"category"}
                value={values.category}
                handleBlur={handleBlur}
                handleChange={handleChange}
                error={touched.category ? errors.category : undefined}
              />
            </div>
            <div className="flex w-full items-center justify-center ">
              <Button
                className="mx-auto w-1/5 cursor-pointer  items-center justify-center rounded-lg border border-primary bg-primary py-1.5 text-center text-white transition hover:bg-opacity-90"
                disabled={!dirty}
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {isLoading ? <LoadingIndicatorSmall /> : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CategoriesForm;
