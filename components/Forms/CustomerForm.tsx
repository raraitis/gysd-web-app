"use client";

import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import CommonInputField from "@/components/Input/CommontInputField";
import { FC, useState } from "react";
import LoadingIndicatorSmall from "@/components/Indicators/LoadingIndicatorSmall";
import { postUrl } from "@/lib/api/common";
import { useSession } from "next-auth/react";
import {
  ClientCreationResponseType,
  Customer,
  CustomerType,
} from "@/types/types";
import { config } from "@/lib/api/config";
import toast from "react-hot-toast";
import CommonDropdownField from "../Dropdowns/CommonDropdownField";
import { clsxm } from "@/utils/clsxm";
import AddressAutocomplete, { LocationInfo } from "./AddressAutocomplete";
import { Results } from "@/pages/api/address/search-place";
import DropzoneUpload from "../common/DropzoneUpload";
import { IFileWithMeta } from "react-dropzone-uploader";
import { useRouter } from "next/navigation";

export const CustomerTypes = [
  { value: CustomerType.HOMEOWNER, label: "Home owner" },
  { value: CustomerType.BUSINESS, label: "Business" },
];

interface Props {
  customer?: Customer;
  onSubmit?: (customerId: string, updatedClient: Partial<Customer>) => void;
}

const CustomerForm: FC<Props> = ({ customer, onSubmit }) => {
  const { data: session } = useSession();
  const [locationData, setLocationData] = useState<Results | null>(null);
  const [resetAddressSearch, setResetAddressSearch] = useState(false);
  const [images, setImages] = useState<IFileWithMeta[]>([]);
  const router = useRouter()

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("is required"),
    last_name: Yup.string().required("is required"),
    email: Yup.string().email("Invalid email").required("is required"),
    mobile_number: Yup.string().required("is required"),
    password: customer ? Yup.string() : Yup.string(),
    type: Yup.string().min(3).required("is required"),
    address: Yup.string().required("is required"),
    longitude: Yup.number(),
    latitude: Yup.number(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const initialValues: Customer = {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    type: CustomerType.EMPTY,
    address: "",
    longitude: 0,
    latitude: 0,
    geoHash: "",
    notifications_enabled: true,
  };

  const handleSelectLocation = (selectedLocation: Results) => {
    setLocationData(selectedLocation);
  };

  const handleSubmitForm = async (values: Customer) => {
    console.log(values);
    if (customer && onSubmit) {
      const changedValues: Partial<Customer> = {};

      Object.keys(values).forEach((key) => {
        if (values[key] !== customer[key]) {
          changedValues[key] = values[key];
        }
      });

      if (locationData?.description !== customer.address) {
        changedValues.address = locationData?.description;
        changedValues.latitude =
          locationData?.coordinates?.result?.geometry.location.lat;
        changedValues.longitude =
          locationData?.coordinates?.result.geometry.location.lng;
      }

      if (Object.keys(changedValues).length > 0) {
        onSubmit(customer.id, changedValues as Customer);
      }

      return;
    }
    if (isLoading) {
      return;
    }

    setIsLoading(true);

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

    if (!locationData) {
      return;
    }

    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      mobile_number: values.mobile_number,
      type: values.type,
      password: values.password,
      images: base64Array.map((f) => ({ image: f })),
      address: locationData?.description,
      latitude: locationData?.coordinates?.result.geometry.location.lat,
      longitude: locationData?.coordinates?.result.geometry.location.lng,
    };

    const result = await postUrl<ClientCreationResponseType>({
      url: `https://api.therhino.com${config.createClient}`,
      data: data,
      token: session?.user?.accessToken,
    });

    if (result.data) {
      toast.success(`Customer successfully added!`);
      setIsLoading(false);
      setLocationData(null);
      setResetAddressSearch(true);
      router.replace('/client/list')
    } else if (!!result.error) {
      setIsLoading(false);
      toast.error(`Oops! something went wrong!`);
    } else {
      toast.error(`Oops! something went wrong!`);
    }

    return true;
  };

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
        initialValues={customer ?? initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log("FORM");

          try {
            const success = await handleSubmitForm(values);

            if (!!success) {
              resetForm();
            }
          } catch (err) {
            console.log(err);
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
          } = formikProps;

          return (
            <form onSubmit={handleSubmit}>
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="max-w-md">
                  <CommonInputField
                    id="first_name"
                    placeholder={"First Name"}
                    label={"First Name"}
                    type="text"
                    name={"first_name"}
                    value={values.first_name}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    error={touched.first_name ? errors.first_name : undefined}
                  />
                </div>
                <div className="max-w-md">
                  <CommonInputField
                    id="last_name"
                    placeholder={"Last Name"}
                    label={"Last Name"}
                    type="text"
                    name={"last_name"}
                    value={values.last_name}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    error={touched.last_name ? errors.last_name : undefined}
                  />
                </div>
                <div className="max-w-md">
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
                </div>
                <div className="max-w-md">
                  <CommonInputField
                    id="mobile_number"
                    placeholder={"Mobile Number"}
                    label={"Mobile Number"}
                    type="text"
                    name={"mobile_number"}
                    value={values.mobile_number}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    error={
                      touched.mobile_number ? errors.mobile_number : undefined
                    }
                  />
                </div>
                <div className="max-w-md cursor-pointer">
                  <CommonDropdownField
                    id="type"
                    label={"Type"}
                    name={"type"}
                    placeholder={CustomerType.EMPTY}
                    value={values.type}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    error={touched.type ? errors.type : undefined}
                    options={CustomerTypes}
                  />
                </div>
                {!customer && !onSubmit && (
                  <div className="max-w-md">
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
                  </div>
                )}
                <div className="flex max-w-md flex-col">
                  <div
                    className={
                      (clsxm("mb-2.5 block font-medium text-black "),
                      `${
                        touched.address
                          ? errors.address
                          : undefined
                          ? "text-danger"
                          : "dark:text-white"
                      }`)
                    }
                  >
                    <AddressAutocomplete
                      initialValues={
                        customer && !locationData
                          ? {
                              address: customer.address,
                              lat: customer.latitude,
                              lng: customer.longitude,
                            }
                          : ({
                              address: locationData?.description,
                              lat: locationData?.coordinates?.result.geometry
                                .location.lat,
                              lng: locationData?.coordinates?.result.geometry
                                .location.lng,
                            } as LocationInfo)
                      }
                      reset={resetAddressSearch}
                      onSelectLocation={(res: Results) => {
                        handleSelectLocation(res);
                        setFieldValue("address", res.description);
                        setFieldValue(
                          "longitude",
                          res.coordinates?.result.geometry.location.lng
                        );
                        setFieldValue(
                          "latitude",
                          res.coordinates?.result.geometry.location.lat
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

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

              <div className="my-5 flex w-full items-center justify-center">
                <div
                  className="mx-auto w-1/6 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-1 text-center text-white transition hover:bg-opacity-90"
                  onClick={() => handleSubmit()}
                >
                  {isLoading ? (
                    <LoadingIndicatorSmall />
                  ) : customer ? (
                    "Save"
                  ) : (
                    "Add"
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CustomerForm;
