"use client";

import * as Yup from "yup";
import { Formik } from "formik";
import { FC, useState } from "react";
import CommonInputField from "../Input/CommontInputField";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { putUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";
import { useRouter } from "next/navigation";

export type FormData = {
  bank_name: string;
  account_name: string;
  account_number: string;
};

type Props = {
  id?: string;
};

const UpdateUserBankDetailsForm: FC<Props> = ({ id }) => {
  const router = useRouter();

  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormData = {
    bank_name: "",
    account_name: "",
    account_number: "",
  };

  const validationSchema = Yup.object().shape({
    bank_name: Yup.string().required("Required"),
    account_name: Yup.string().required("Required"),
    account_number: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormData) => {
    if (isLoading) {
      return;
    }

    setIsError(undefined);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      if (!id) {
        setIsError("No id provided.");
        setIsLoading(false);
        setIsSuccess(false);
        return;
      }

      const data = {
        id: id,
        bank_name: values.bank_name,
        account_name: values.account_name,
        account_number: values.account_number,
      };
      return await putUrl<CommonResponse>({
        url: config.userBankUpdate,
        data: {
          ...data,
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
            router.push("/user/view/" + id);
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
              id="bank_name"
              placeholder={"Bank Name"}
              label={"Bank Name"}
              type="text"
              name={"bank_name"}
              value={values.bank_name}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.bank_name ? errors.bank_name : undefined}
            />
            <CommonInputField
              id="account_name"
              placeholder={"Account Name"}
              label={"Account Name"}
              type="text"
              name={"account_name"}
              value={values.account_name}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.account_name ? errors.account_name : undefined}
            />
            <CommonInputField
              id="account_number"
              placeholder={"Account Number"}
              label={"Account Number"}
              type="text"
              name={"account_number"}
              value={values.account_number}
              handleBlur={handleBlur}
              handleChange={handleChange}
              error={touched.account_number ? errors.account_number : undefined}
            />

            {!!isError && (
              <div className="error-message text-danger">{isError}</div>
            )}
            {isSuccess && (
              <div className="success-message">
                {"Successfully updated user's bank details."}
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
            {isLoading ? <LoadingIndicatorSmall /> : "Confirm"}
          </div>
        </div>
      )}
    </Formik>
  );
};

export default UpdateUserBankDetailsForm;
