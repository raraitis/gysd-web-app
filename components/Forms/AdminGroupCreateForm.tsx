"use client";

import * as Yup from "yup";
import { Formik } from "formik";
// import { Translations } from "../../get-dictionary";
import { useState } from "react";
import CommonInputField from "../Input/CommontInputField";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { postUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";

export type FormData = {
  account_id: string;
  owner_id: string;
};

const AdminGroupCreateForm = () => {
  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormData = {
    account_id: "",
    owner_id: "",
  };

  const validationSchema = Yup.object().shape({
    account_id: Yup.string()
      .min(4, "Code too short.")
      .max(4, "Code too long")
      .required("4 digit code required"),
    owner_id: Yup.string()
      .min(4, "Code too short.")
      .max(4, "Code too long")
      .required("4 digit code required"),
  });

  const handleSubmit = async (values: FormData) => {
    if (isLoading) {
      return;
    }

    setIsError(undefined);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      return await postUrl<CommonResponse>({
        url: config.adminGroupCreate,
        data: {
          account_id: values.account_id,
          owner_id: values.owner_id,
        },
        onResponse: ({ data, error }) => {
          if (data && !!data.success) {
            setIsLoading(false);
            setIsSuccess(true);
            return true;
          } else {
            setIsLoading(false);
            setIsSuccess(false);
            setIsError(error?.message ?? "Something went wrong.");
          }
        },
        onError: (error: any) => {
          setIsError(error?.response?.data?.error ?? "Something went wrong.");
          setIsLoading(false);
          setIsSuccess(false);
        },
      });
    } catch (error: any) {
      setIsError(error?.message ?? "Something went wrong.");
      setIsLoading(false);
      setIsSuccess(false);
    }

    return false;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const success = await handleSubmit(values);

          if (!!success) {
            resetForm();
          }
        } catch (err) {
          console.log(err);
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
        <div>
          <div>
            <CommonInputField
              id="account_id"
              placeholder={"Account ID"}
              label={"Account ID"}
              type="text"
              name={"account_id"}
              value={values.account_id}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.account_id ? errors.account_id : undefined}
            />

            <CommonInputField
              id="owner_id"
              placeholder={"Owner ID"}
              label={"Owner ID"}
              type="text"
              name={"owner_id"}
              value={values.owner_id}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.owner_id ? errors.owner_id : undefined}
            />

            {!!isError && (
              <div className="error-message text-danger">{isError}</div>
            )}
            {isSuccess && (
              <div className="success-message">{"New group created."}</div>
            )}
          </div>
          <div
            className="my-5 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            onClick={() => {
              if (isValid) {
                handleSubmit();
              }
            }}
          >
            {isLoading ? <LoadingIndicatorSmall /> : "Add new group"}
          </div>
        </div>
      )}
    </Formik>
  );
};

export default AdminGroupCreateForm;
