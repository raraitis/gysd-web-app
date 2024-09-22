"use client";

import {
  Formik,
  Form,
  Field,
  FieldProps,
  FormikProps,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import CommonInputField from "../Input/CommontInputField";
import { useEffect, useState } from "react";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import DropdownCustom from "../Dropdowns/DropdownCustom";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "@/components/Ui/Button";
import { CommonResponse } from "@/types/responses";
import { config } from "@/lib/api/config";
import { postUrl } from "@/lib/api/common";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { fetcher } from "@/lib/httpClient";
import useSWR from "swr";
import { JobStatusToText } from "@/utils/job-status-to-text";
import { Results } from "@/pages/api/address/search-place";
import {
  CalcInput,
  Job,
  JobStatus,
  JobsPricesResponseData,
} from "@/types/types";
import { decodeGeoHash } from "@/utils/decodeGeo";
import { formatToDollar } from "@/utils/utils";
import AddressAutocomplete from "./AddressAutocomplete";
import { TestCustomerDropdown } from "../Dropdowns/TestCustomerDropdown";
import CheckboxOne from "../Checkboxes/CheckboxOne";
import { Option } from "@/types/types";
import { useDebounceNew } from "@/utils/use-debounce-new";
import FileInput from "../Input/FileInput";
import DropzoneUpload, { IImage } from "../common/DropzoneUpload";
import { IFileWithMeta } from "react-dropzone-uploader";

const jobStatusArray = Object.values(JobStatus)
  .map((status, index) => ({
    id: 1 + index.toString(),
    name: JobStatusToText(status),
    value: status,
  }))
  .filter((f) => f.value === JobStatus.LEAD || f.value === JobStatus.REQUEST);

type JobFormProps = {
  job?: Job;
  calendarDate?: string;
  mutate?: () => void;
};

type FormData = {
  id: string;
  description: string;
  customer_id: string;
  email: string;
  phone: string;
  address: string;
  scheduled_start: string;
  type: string;
  status: JobStatus;
  isExternal: boolean;
  latitude: number;
  longitude: number;
  footage: number | undefined;
  story: number | undefined;
  calcInput?: CalcInput;
};

// TODO REFACTOR TO USE FORMIK HOOK
const JobForm = ({ job, calendarDate, mutate }: JobFormProps) => {
  const router = useRouter();
  const [images, setImages] = useState<IFileWithMeta[]>([]);

  const [initialValues, setInitialValues] = useState<FormData>({
    id: job?.id ?? "",
    description: job?.description ?? "",
    customer_id: job?.customer?.id ?? "",
    email: job?.customer?.email ?? "",
    phone: job?.customer?.mobile_number
      ? String(job?.customer?.mobile_number)
      : "",
    address: job?.address ?? "",
    scheduled_start:
      job?.scheduled_start && !calendarDate
        ? job?.scheduled_start
        : calendarDate
        ? calendarDate
        : dayjs().toISOString(),
    type: job?.type ?? "",
    status: job?.status ?? JobStatus.LEAD,
    isExternal: job?.isExternal !== undefined ? job?.isExternal : false,
    latitude: job?.geoHash ? decodeGeoHash(job.geoHash).latitude : 0,
    longitude: job?.geoHash ? decodeGeoHash(job.geoHash).longitude : 0,
    footage: job?.footage ?? undefined,
    story: job?.story ?? undefined,
  });

  const { data: priceData, error: priceError } = useSWR<JobsPricesResponseData>(
    config.jobsPrices,
    fetcher
  );

  const validationSchema = Yup.object().shape({
    id: Yup.string().optional(),
    description: Yup.string().min(3).max(1000).required("Required"),
    customer_id: Yup.string().min(3).max(120).required("Required"),
    email: Yup.string().email().required("Required"),
    phone: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
    isExternal: Yup.boolean().required("Required"),
    type: Yup.string().required("Required"),
    scheduled_start: Yup.string().required("Required"),
    longitude: Yup.number(),
    latitude: Yup.number(),
    footage: Yup.number(),
    story: Yup.number(),
    isPro: Yup.boolean(),
  });

  const [isError, setIsError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetAddressSearch, setResetAddressSearch] = useState(false);

  const handlePatchRequest = async (values: FormData) => {
    try {
      await postUrl<CommonResponse>({
        url: config.editJob,
        data: {
          id: values.id,
          description: values.description,
          customer_id: values.customer_id,
          email: values.email,
          mobile_number: values.phone,
          address: values.address,
          scheduled_start: values.scheduled_start,
          status: values.status,
          longitude: values.longitude,
          latitude: values.latitude,
          isExternal: values.isExternal,
          calcInput: {
            job: values.type,
            footage: Number(values.footage),
            story: values.story,
            isPro: false,
          },
        },
        config: {
          method: "PATCH",
        },
        onResponse: ({ data }) => {
          if (data && !!data.success) {
            setIsLoading(false);
            setIsSuccess(true);
            toast.success("Changes saved successfully");
            if (mutate) mutate();
            return data.success;
          }
        },
        onError: (error: any) => {
          setIsError(error?.response?.data?.error ?? "Something went wrong.");
          setIsLoading(false);
          setIsSuccess(false);
          return false;
        },
      });
    } catch (e) {
      console.log("JobForm Error from handlePatchRequest ::", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostRequest = async (values: FormData) => {
    const result = await postUrl<CommonResponse<Job>>({
      url: config.createJob,
      data: {
        description: values.description,
        customer_id: values.customer_id,
        email: values.email,
        mobile_number: values.phone,
        address: values.address,
        scheduled_start: values.scheduled_start,
        status: values.status,
        longitude: values.longitude,
        latitude: values.latitude,
        isExternal: values.isExternal,
        calcInput: {
          job: values.type,
          footage: Number(values.footage),
          story: values.story,
          isPro: false,
        },
      },
    });

    if (result.data && result.data.data && result.data.success === true) {
      return {
        id: result.data.data.id,
        success: true,
      };
    }

    return {
      id: null,
      success: true,
    };
  };

  const uploadImages = async (jobId: string) => {
    let base64Array: string[] = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const element = images[i];
        const imgReaderPromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target) {
              const result = event.target.result as string;
              const base64 = result.split(",")[1];

              resolve(base64);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(element.file);
        });

        const base64 = await imgReaderPromise;
        base64Array.push(base64);
      }
    } catch (error: any) {
      toast.error("Failed to read provided images.");
      return;
    }

    if (base64Array.length === 0) {
      console.log("NO IMG TO UPLOAD");
      return;
    }

    const result = await postUrl<CommonResponse<Job>>({
      url: config.jobImageUpload,
      data: {
        jobId: jobId,
        images: base64Array,
      },
    });

    if (result.data && result.data.data && result.data.success === true) {
      return {
        id: result.data.data.id,
        success: true,
      };
    }

    return {
      id: null,
      success: true,
    };
  };
  const handleSubmit = async (values: FormData): Promise<boolean> => {
    if (job) {
      try {
        await handlePatchRequest(values);

        setIsLoading(false);
        setIsSuccess(true);
        toast.success("Changes saved successfully");

        return true;
      } catch (error) {
        setIsError("Something went wrong.");
        setIsLoading(false);
        setIsSuccess(false);
        return false;
      }
    }

    setIsError(undefined);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const result = await handlePostRequest(values);

      if (!!result.id && result.success === true) {
        // TODO HANDLE IMAGE UPLOAD HERE
        if (images.length > 0) {
          await uploadImages(result.id);
        }

        toast.success("Job created successfully");
      } else {
        setIsError("Something went wrong.");
      }

      setIsLoading(false);
      setIsSuccess(result.success);

      return result.success;
    } catch (error) {
      setIsError("Something went wrong.");
      setIsLoading(false);
      setIsSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  function buttonText() {
    if (isLoading) {
      return <LoadingIndicatorSmall />;
    } else if (job) {
      return "Save Changes";
    } else {
      return "Create Job";
    }
  }

  function numberCount(): Option[] {
    const options: Option[] = [];
    for (let i = 1; i <= 100; i++) {
      const option: Option = {
        id: `option_${i}`,
        name: `${i}`,
        value: i,
      };
      options.push(option);
    }
    return options;
  }
  const optionsArray: Option[] = numberCount();

  // #region image handling
  const onImageAdd = (images: IFileWithMeta[]) => {
    setImages(images);
  };

  const onImageRemove = (id: string) => {
    const find = images.find((f) => f.meta.id === id);

    if (find) {
      setImages(images.filter((f) => f.meta.id !== id));
    }
  };
  // #endregion image handling

  return (
    <div className="flex h-full w-full items-center justify-center rounded-sm bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const success = await handleSubmit(values);
            if (success) {
              router.push("/job/jobs");
              resetForm();
            }
          } catch (err) {
            console.log("Job Form Error from Formik", err);
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
            dirty,
            setFieldValue,
            isSubmitting,
          } = formikProps;

          return (
            <Form id="myForm">
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
              <div className="grid w-full max-w-xl grid-cols-2 gap-4 pt-5">
                <div className="col-span-1" />

                <div className="col-span-2 ">
                  <Field name="customer_id">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <TestCustomerDropdown
                          form={form}
                          field={field}
                          initialCustomer={job?.customer}
                          name="customer_id"
                          label="Customer"
                          error={meta.touched ? meta.error : undefined}
                        />
                      );
                    }}
                  </Field>

                  <div className="col-span-2">
                    <CommonInputField
                      id="email"
                      placeholder={"Email"}
                      label={"Email"}
                      type="email"
                      name={"email"}
                      value={values.email}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      error={touched.email ? errors.email : undefined}
                    />
                  </div>

                  <Field name="address">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <AddressAutocomplete
                          field={field}
                          form={form}
                          name="address"
                          initialValues={{
                            address: values.address,
                            lat: values.latitude,
                            lng: values.longitude,
                          }}
                          validate={() => {
                            form.setFieldTouched("address", false, true);
                          }}
                          reset={resetAddressSearch}
                          onSelectLocation={(res: Results) => {
                            setFieldValue("address", res.description);
                            setFieldValue(
                              "latitude",
                              res.coordinates?.result.geometry.location.lat
                            );
                            setFieldValue(
                              "longitude",
                              res.coordinates?.result.geometry.location.lng
                            );
                          }}
                          error={meta.touched ? meta.error : undefined}
                        />
                      );
                    }}
                  </Field>

                  <div className="flex gap-2 pb-1">
                    <CommonInputField
                      id="phone"
                      placeholder={"Phone"}
                      label={"Phone"}
                      type="number"
                      name={"phone"}
                      value={values.phone}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      error={touched.phone ? errors.phone : undefined}
                    />

                    <div className="w-full">
                      <div className="font-medium text-black dark:text-white">
                        {"Schedule"}
                      </div>
                      <Datepicker
                        inputClassName="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary"
                        placeholder={
                          dayjs(values.scheduled_start)
                            .toDate()
                            .toDateString() ?? "Select date"
                        }
                        asSingle={true}
                        value={{
                          startDate: values.scheduled_start,
                          endDate: null,
                        }}
                        onChange={(newDate) => {
                          if (newDate?.startDate) {
                            setFieldValue(
                              "scheduled_start",
                              new Date(newDate.startDate).toISOString()
                            );
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Field name="status">
                      {(fieldProps: FieldProps) => {
                        return (
                          <DropdownCustom
                            label={"Status"}
                            name="status"
                            fieldProps={fieldProps}
                            value={values.status}
                            handleBlur={handleBlur}
                            setFieldValue={(option: Option) =>
                              setFieldValue("status", option.value)
                            }
                            error={touched.status ? errors.status : undefined}
                            options={jobStatusArray}
                          />
                        );
                      }}
                    </Field>

                    <Field name="type">
                      {(fieldProps: FieldProps) => {
                        return (
                          <DropdownCustom
                            fieldProps={fieldProps}
                            label={"Type"}
                            name="type"
                            placeholder="Select Job Type"
                            value={values.type}
                            handleBlur={handleBlur}
                            setFieldValue={(option: Option) => {
                              setFieldValue("type", option.value);
                            }}
                            error={touched.type ? errors.type : undefined}
                            options={
                              priceData?.data.prices.map((price) => ({
                                id: price.id,
                                name: price.job,
                                value: price.job,
                              })) ?? []
                            }
                          />
                        );
                      }}
                    </Field>
                  </div>
                  {values.type !== "" && (
                    <div className="flex flex-row gap-2">
                      <div className="flex w-1/2">
                        <Field name="Floors">
                          {(fieldProps: FieldProps) => {
                            return (
                              <DropdownCustom
                                fieldProps={fieldProps}
                                label={"Floors"}
                                name="story"
                                placeholder="Number of story"
                                value={values.story}
                                handleBlur={handleBlur}
                                setFieldValue={(option: Option) => {
                                  setFieldValue("story", option.value);
                                }}
                                error={touched.story ? errors.story : undefined}
                                options={optionsArray}
                              />
                            );
                          }}
                        </Field>
                      </div>
                      <div className="flex w-1/2">
                        <CommonInputField
                          id="footage"
                          placeholder={"Square feet"}
                          label={"Square feet"}
                          type="number"
                          name={"footage"}
                          value={values.footage}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          onKeyPress={(
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            const allowedCharacters = /[0-9.]/;
                            if (
                              !allowedCharacters.test(e.key) ||
                              (e.key === "." &&
                                e.currentTarget.value.includes("."))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          error={touched.footage ? errors.footage : undefined}
                        />
                      </div>
                    </div>
                  )}

                  <div className="my-3 flex flex-col gap-2">
                    <div className="font-medium text-black dark:text-white">
                      {"Acceptance"}
                    </div>
                    <CheckboxOne
                      name="isExternal"
                      label="Is External"
                      value={values.isExternal}
                      handleChange={handleChange}
                    />
                  </div>

                  <CommonInputField
                    id="description"
                    placeholder={"Description"}
                    label={"Description"}
                    type="textarea"
                    name={"description"}
                    value={values.description}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    error={touched.description ? errors.description : undefined}
                  />
                </div>
                <div className="col-span-1" />

                {!!isError && (
                  <div className="error-message text-danger">{isError}</div>
                )}
                {isSuccess && (
                  <div className="success-message">{"Job Sheduled."}</div>
                )}
              </div>
              <PriceView />

              <div>
                <label
                  className={"mb-2.5 font-medium text-black dark:text-white"}
                >
                  {"Images"}
                </label>
                <DropzoneUpload
                  onAddFiles={onImageAdd}
                  onRemoveFile={onImageRemove}
                />
              </div>

              <Button
                className="mx-auto w-[170px] cursor-pointer  items-center justify-center rounded-lg border border-primary bg-primary py-1.5 text-center text-white transition hover:bg-opacity-90"
                disabled={
                  // !isValid ||
                  !dirty || isSubmitting
                }
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {buttonText()}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const PriceView = () => {
  const { values, submitForm } = useFormikContext<any>();
  const [price, setPrice] = useState<string>("0");
  const debouncedSqft = useDebounceNew(values.footage, 500);

  useEffect(() => {
    if (!values.type || !debouncedSqft) {
      setPrice("0");
      return;
    }

    if (debouncedSqft === 0) {
      setPrice("0");
      return;
    }

    (async () => {
      const result = await postUrl<CommonResponse<{ price: string }>>({
        url: config.jobCalcPrice,
        data: {
          job: values.type,
          footage: Number(debouncedSqft),
          story: values.story,
          isPro: false,
        },
        onResponse: ({ data }) => {
          if (data && data.success === true) {
            return data.success;
          }
        },
      });

      if (result.data?.data?.price) {
        setPrice(result.data.data.price);
      } else {
        setPrice("0");
      }
    })();
  }, [debouncedSqft, values.story, values.type]);

  return (
    <div className="mt-2 flex w-full items-center justify-center">
      <span className="mr-2 dark:text-white">{"Cost: "}</span>
      <p className="font-bold dark:text-white">{formatToDollar(price)}</p>
    </div>
  );
};

export default JobForm;
