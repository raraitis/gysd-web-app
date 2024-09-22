"use client";

import QuoteGutterCleaningForm from "./QuoteGutterCleaningForm";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Customer,
  JobsPricesResponseData,
  Quote,
  QuoteStatus,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import CommonInputFieldNew from "@/components/Input/CommonInputFieldNew";
import ngeohash from "ngeohash";
import { patch, post, postUrl } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import QuoteGutterSystemsForm from "./QuoteGutterSystemsForm";
import FormArray from "./FormArray";
import { QuoteByIdData } from "@/components/Quotes/QuoteDetailsPage";

type IItem = {
  id: string;
  text: string;
  price: string;
};

interface IForm {
  description: string;
  items: IItem[];
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required("Required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().required("Required"),
        price: Yup.string().required("Required"),
      })
    )
    .min(1, "Required"),
});

type Props = {
  quote?: Quote | QuoteByIdData;
  isEdit?: boolean;
};

type AddressSearch = {
  address: string;
  lat: number | null;
  lng: number | null;
};

const QuoteForm = ({ quote, isEdit = true }: Props) => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: priceData,
    error: priceError,
    isLoading: priceDataLoading,
  } = useSWR<JobsPricesResponseData>(config.jobsPrices, fetcher);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const [addressSearch, setAddressSearch] = useState<AddressSearch>({
    address: "",
    lat: null,
    lng: null,
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    touched,
    isValid,
  } = useFormik<IForm>({
    initialValues: {
      description: quote?.data?.description || "",
      items: quote?.data?.items || [],
    },
    onSubmit: (values) => {},
    validateOnMount: true,
    validationSchema: validationSchema,
  });

  const price = useMemo(() => {
    let totalPrice = 0;

    for (let i = 0; i < values.items.length; i++) {
      const item = values.items[i];
      totalPrice += Number(item.price);
    }

    return totalPrice.toFixed(2);
  }, [values.items]);

  useEffect(() => {
    if (addressSearch.lat && addressSearch.lng) {
      setFieldValue(
        "geoHash",
        ngeohash.encode(addressSearch.lat, addressSearch.lng)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressSearch.lat, addressSearch.lng]);

  const submitQuote = async (total: string, data?: any) => {
    setIsLoading(true);

    let quoteId = quote?.id;

    if (!quoteId) {
      setIsLoading(false);
      return;
    }

    await patchQuote(quoteId, total, { ...data, ...values });

    toast.success("Quote sent successfully");

    router.push(`/quotes/${quoteId}`);
    setIsLoading(false);
  };

  async function patchQuote(id: string, total: string, data: any) {
    setIsLoading(true);

    return await patch<CommonResponse>({
      client: mainClient,
      url: config.patchQuote,
      data: {
        quote_id: id,
        quote: Number(total) + Number(price),
        data: data,
        status: QuoteStatus.SENT,
      },
      onResponse: ({ status }) => {
        if (status === 200) {
          setIsSuccess(true);
        }
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  }

  return (
    <>
      <form className="col-span-10 flex h-full w-full flex-col items-center justify-center rounded-sm bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
        <div className="w-full max-w-xl">
          {!isLoading && (
            <>
              <CommonInputFieldNew
                id="description"
                name="description"
                label="Description"
                placeholder={"Add detailed infomation about the conditions."}
                value={values.description}
                handleChange={handleChange}
                handleBlur={handleBlur}
                type="textarea"
                error={touched.description ? errors.description : undefined}
                disabled={!isEdit}
              />

              <FormArray
                name="items"
                label={"Extra items"}
                fields={values.items}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={!isEdit}
              />

              {quote?.jobType
                .toString()
                .toLowerCase()
                .includes("gutter cleaning") && (
                <QuoteGutterCleaningForm
                  isEdit={isEdit}
                  data={quote?.data}
                  onSubmit={submitQuote}
                  jobType={quote.jobType}
                  itemsTotal={price}
                />
              )}
              {quote?.jobType
                .toString()
                .toLowerCase()
                .includes("gutter system") && (
                <QuoteGutterSystemsForm
                  isEdit={isEdit}
                  onSubmit={submitQuote}
                  jobType={quote?.jobType}
                  quote={quote}
                  itemsTotal={price}
                />
              )}
              <div>
                {!(
                  quote?.jobType.toLowerCase().includes("gutter cleaning") ||
                  quote?.jobType.toLowerCase().includes("gutter system")
                ) && (
                  <>
                    <CommonInputFieldNew
                      name="total"
                      id="total"
                      label="Total"
                      handleChange={handleChange}
                      value={Number(price) || 0}
                      type="number"
                      disabled={true}
                    />
                    {isEdit && (
                      <button
                        disabled={!isValid}
                        className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                        onClick={() => submitQuote("0", null)}
                      >
                        Submit
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          {isLoading && <Loader />}
        </div>
      </form>
    </>
  );
};

export default QuoteForm;
