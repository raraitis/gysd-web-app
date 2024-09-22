"use client";

import * as Yup from "yup";
import { Formik } from "formik";
// import { Translations } from "../../get-dictionary";
import { FC, useState } from "react";
import CommonInputField from "../Input/CommontInputField";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { postUrl, putUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";

export type FormData = {
  email: string;
  password: string;
};

type Props = {
  userEmail?: string;
};
const UserPasswordResetForm: FC<Props> = ({ userEmail }) => {
  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormData = {
    email: userEmail ?? "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Incorect email. Please try again!")
      .required("Required"),
    password: Yup.string()
      .min(6, "Minimum 6 symbols")
      .max(20, "Maximum 20 symbols")
      .required("Required"),
  });

  const handleSubmit = async (values: FormData) => {
    if (isLoading) {
      return;
    }

    setIsError(undefined);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      return await putUrl<CommonResponse>({
        url: "",
        data: {
          email: values.email,
          password: btoa(values.password),
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
              id="email"
              placeholder={"Email"}
              label={"Email"}
              type="text"
              name={"email"}
              value={values.email}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.email ? errors.email : undefined}
            />

            <CommonInputField
              id="password"
              placeholder={"Password"}
              label={"Password"}
              type="text"
              name={"password"}
              value={values.password}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.password ? errors.password : undefined}
            />

            {!!isError && (
              <div className="error-message text-danger">{isError}</div>
            )}
            {isSuccess && (
              <div className="success-message">
                {"Password set successfully."}
              </div>
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
            {isLoading ? <LoadingIndicatorSmall /> : "Update password"}
          </div>
        </div>
      )}
    </Formik>
  );
};

export default UserPasswordResetForm;
