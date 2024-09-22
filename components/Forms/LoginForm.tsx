"use client";

import * as Yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { signIn } from "next-auth/react";
import CommonInputField from "../Input/CommontInputField";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import useQueryParams from "@/utils/useQueryParams";

export type FormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { queryParams } = useQueryParams();

  const initialValues: FormData = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
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
      const result = await signIn("admin_auth", {
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });

      if (result && result.ok) {
        setIsLoading(false);
        setIsSuccess(true);

        return true;
      }
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
          await handleSubmit(values);
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
        <div className="flex w-full flex-col">
          {!isLoading && queryParams && (
            <div className="error-message mb-1 ml-5 mt-5 items-center text-center text-danger">
              {queryParams.get("error")}
            </div>
          )}

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
            type="password"
            name={"password"}
            value={values.password}
            handleBlur={handleBlur}
            handleChange={handleChange}
            error={touched.password ? errors.password : undefined}
          />

          <div
            className="mb-3 mt-3 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            onClick={() => {
              if (isValid) {
                handleSubmit();
              }
            }}
          >
            {isLoading ? <LoadingIndicatorSmall /> : "Login"}
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
