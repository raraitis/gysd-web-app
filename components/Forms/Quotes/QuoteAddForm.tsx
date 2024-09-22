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
import CustomerDropdownNew from "@/components/Dropdowns/CustomerDropdownNew";
import { useEffect, useMemo, useState } from "react";
import AddressAutocomplete from "../AddressAutocomplete";
import { Results } from "@/pages/api/address/search-place";
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
import DropdownCustomNew from "@/components/Dropdowns/DropdownCustomNew";
import FormArray from "./FormArray";

type IItem = {
  id: string;
  text: string;
  price: string;
};

interface IForm {
  description: string;
  address: string;
  customer_id: string;
  mobile_number: string;
  geoHash: string;
  jobType: string;
  email: string;
  items: IItem[];
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  customer_id: Yup.string().required("Required"),
  mobile_number: Yup.string()
    // .min(10, "Phone needs to be exactly 10 digits.")
    // .max(10, "Phone needs to be exactly 10 digits.")
    .required("Required"),
  email: Yup.string().email("Incorrect email.").required("Required"),
  // quote: Yup.number(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().required("Required"),
        price: Yup.string().required("Required"),
      })
    )
    .min(1, "Required"),
});

type AddressSearch = {
  address: string;
  lat: number | null;
  lng: number | null;
};

const QuoteAddForm = () => {
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
    touched,
    isValid,
  } = useFormik<IForm>({
    initialValues: {
      description: "",
      address: "",
      geoHash: "",
      customer_id: "",
      jobType: "",
      email: customer?.email || "",
      mobile_number: customer?.mobile_number || "",
      items: [],
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

    let quoteId: string | undefined;

    const result = await postQuote({
      address: values.address,
      customer_id: values.customer_id,
      description: data?.description || values.description,
      geoHash: values.geoHash,
      jobType: values.jobType,
      quote: Number(total) + Number(price),
    });

    if (result.status === 200 && result.data?.data && result.data.data.id) {
      quoteId = result.data.data.id;
    }

    if (!quoteId) {
      setIsLoading(false);
      return;
    }

    await patchQuote(quoteId, total, {
      ...data,
      description: values.description,
      items: values.items,
    });

    toast.success("Quote sent successfully");

    router.push(`/quotes/${quoteId}`);
    setIsLoading(false);
  };

  async function postQuote(quote: Partial<Quote>) {
    return await post<CommonResponse<any>>({
      url: config.postQuote,
      client: mainClient,
      data: quote,
      onResponse: ({ data }) => {
        if (data && data.success === true) {
          console.log(data);
          return data?.data?.price;
        }
      },
      onError: (e) => {
        console.log("error in Post quote", e);
      },
    });
  }

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

  async function calcJobPrice(payload: { job: string; footage: number }) {
    const result = await postUrl<CommonResponse<{ price: string }>>({
      url: config.jobCalcPrice,
      data: payload,
      onResponse: ({ data }) => {
        if (data && data.success === true) {
          return data?.data?.price;
        }
      },
    });
    return result.data;
  }

  return (
    <>
      <form className="col-span-10 flex h-full flex-col items-center justify-center rounded-sm bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
        <div className="w-full max-w-xl">
          {!isLoading && (
            <>
              <>
                <CustomerDropdownNew
                  setCustomer={setCustomer}
                  customer={customer}
                  onSelect={(customer: Customer) => {
                    setFieldValue("customer_id", customer.id);
                    setFieldValue("email", customer.email);
                    setFieldValue("mobile_number", customer.mobile_number);
                    setFieldValue("address", customer.address);
                  }}
                  disabled={false}
                />
                <CommonInputFieldNew
                  id="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  type="email"
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  error={touched.email ? errors.email : undefined}
                  disabled={false}
                />
                <CommonInputFieldNew
                  id="mobile_number"
                  label="Mobile Number"
                  name="mobile_number"
                  placeholder="Mobile Number"
                  value={values.mobile_number}
                  type="number"
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  error={
                    touched.mobile_number ? errors.mobile_number : undefined
                  }
                  disabled={false}
                />
                <AddressAutocomplete
                  name="address"
                  initialValues={{
                    address: addressSearch.address,
                    lat: addressSearch.lat,
                    lng: addressSearch.lng,
                  }}
                  reset={false}
                  onSelectLocation={(res: Results) => {
                    setAddressSearch({
                      ...values,
                      address: res.description,
                      lat:
                        res.coordinates?.result.geometry.location.lat || null,
                      lng:
                        res.coordinates?.result.geometry.location.lng || null,
                    });
                  }}
                  disabled={false}
                />
                {!priceDataLoading && (
                  <DropdownCustomNew
                    label={"Job Type"}
                    name="type"
                    placeholder="Select Job Type"
                    value={values?.jobType}
                    onOptionSelect={(option) => {
                      setFieldValue("jobType", option.value);
                    }}
                    options={
                      priceData?.data.prices.map((price) => ({
                        id: price.id,
                        name: price.job,
                        value: price.job,
                      })) ?? []
                    }
                    disabled={false}
                  />
                )}
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
                  disabled={false}
                />
              </>

              <FormArray
                name="items"
                label={"Extra items"}
                fields={values.items}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={false}
              />

              {values?.jobType
                .toString()
                .toLowerCase()
                .includes("gutter cleaning") && (
                <QuoteGutterCleaningForm
                  isEdit={true}
                  onSubmit={submitQuote}
                  jobType={values.jobType}
                  itemsTotal={price}
                />
              )}
              {values?.jobType
                .toString()
                .toLowerCase()
                .includes("gutter system") && (
                <QuoteGutterSystemsForm
                  isEdit={true}
                  onSubmit={submitQuote}
                  jobType={values.jobType}
                  itemsTotal={price}
                />
              )}
              <div>
                {!(
                  values.jobType.toLowerCase().includes("gutter cleaning") ||
                  values.jobType.toLowerCase().includes("gutter system")
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
                    <button
                      disabled={!isValid}
                      type="submit"
                      className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                      onClick={() => submitQuote("0", undefined)}
                    >
                      Submit
                    </button>
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

export default QuoteAddForm;
