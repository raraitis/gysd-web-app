"use client";

import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { ChangeEvent, FC, useState } from "react";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import CommonDropdownField from "../Dropdowns/CommonDropdownField";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { useSession } from "next-auth/react";
import {
  AdminResponseType,
  RoleType,
  EmployeeData,
  TabProps,
  EmployeeStatus,
} from "@/types/types";
import CommonInputField from "../Input/CommontInputField";
import toast from "react-hot-toast";
import { clsxm } from "@/utils/clsxm";
import { Results } from "@/pages/api/address/search-place";
import { decodeGeoHash } from "@/utils/decodeGeo";
import AddressAutocomplete, { LocationInfo } from "./AddressAutocomplete";
import FileInput from "../Input/FileInput";

export const AdminTypes: TabProps[] = [
  { value: RoleType.SUPER, label: "Super" },
  { value: RoleType.ADMIN, label: "Admin" },
  { value: RoleType.INSTALLER, label: "Installer" },
  { value: RoleType.SALES_REP, label: "Sales Representative" },
  { value: RoleType.INSPECTOR, label: "Inspector" },
];

type Props = {
  employee?: EmployeeData;
  onEdit?: () => void;
  commission?: number;
  onSubmit?: (
    employeeId: string,
    updatedEmployee: Partial<EmployeeData>
  ) => void;
};

const EmployeeForm: FC<Props> = ({
  employee,
  onEdit,
  onSubmit,
  commission,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<Results | null>(null);
  const [resetAddressSearch, setResetAddressSearch] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Required"),
    role: Yup.string().required("Required"),
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    mobile_number: Yup.string().required("Required"),
    avatar_url: Yup.string(),
    address: Yup.string().required("Required"),
    longitude: Yup.number(),
    latitude: Yup.number(),
  });

  const handleSelectLocation = (
    selectedLocation: Results,
    formikProps: FormikProps<EmployeeData>
  ) => {
    setLocationData(selectedLocation);

    formikProps.setFieldValue("address", selectedLocation.description);
    formikProps.setFieldValue(
      "latitude",
      selectedLocation.coordinates?.result.geometry.location.lat
    );
    formikProps.setFieldValue(
      "longitude",
      selectedLocation.coordinates?.result.geometry.location.lng
    );
  };

const handleAvatarChange = (
  file: File | null,
  formikProps: FormikProps<EmployeeData>
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

const decodedLocation = decodeGeoHash(employee?.geoHash ?? "");

const initialValues: EmployeeData = {
  id: employee?.id ?? "",
  email: employee?.email || "",
  password: "",
  first_name: employee?.first_name || "",
  last_name: employee?.last_name || "",
  mobile_number: employee?.mobile_number || "",
  avatar_url: employee?.avatar_url || "",
  role: employee?.role || ("" as RoleType),
  status: employee ? employee?.status : EmployeeStatus.PENDING,
  address: employee?.address || "",
  longitude: decodedLocation.longitude || null,
  latitude: decodedLocation.latitude || null,
  commission: employee?.commission || 0,
};

const handleFormSubmit = async (values: EmployeeData) => {
  if (employee && onSubmit) {
    const changedValues: Partial<EmployeeData> = {};

    Object.keys(values).forEach((key) => {
      if (key === "password") {
        return;
      }

      if (values[key] !== employee[key]) {
        changedValues[key] = values[key];
      }
    });

    if (values.address !== employee.address) {
      changedValues.address = locationData?.description;
      changedValues.latitude =
        locationData?.coordinates?.result.geometry.location.lat;
      changedValues.longitude = changedValues.latitude =
        locationData?.coordinates?.result.geometry.location.lng;
    }

    if (Object.keys(changedValues).length > 0 && employee.id) {
      onSubmit(employee.id, changedValues as EmployeeData);
      setResetAddressSearch(true);
    }

    return;
  }

  if (isLoading) {
    return;
  }

  const email = values.email.toLowerCase();
  const password = values.password;
  const role = values.role;

  if (!email || !password || !role) {
    toast.error("Oops! Something went wrong.");
  }

  setIsLoading(true);

  if (!employee) {
    const result = await postUrl<AdminResponseType>({
      url: `https://api.therhino.com${config.addAdmin}`,
      data: {
        email: email,
        password: password,
        first_name: values.first_name,
        last_name: values.last_name,
        mobile_number: values.mobile_number,
        role: values.role,
        address: values.address,
        longitude: values.longitude,
        latitude: values.latitude,
      },
      token: session?.user?.accessToken,
    });

    if (result.data) {
      setResetAddressSearch(true);

      try {
        // await postUrl({
        //   url: config.uploadAvatar,
        //   data: {
        //     id: result.data.data.id,
        //     image: values.avatar_url,
        //   },

        //   onError: (error) => {
        //     toast.error(error.message);
        //   },
        //   onResponse: ({ data, status }) => {
        //     console.log(data);
        //   },
        // });
      } catch (error) {
        console.log(error);
      } finally {
        toast.success(
          `User ${email} successfully created!`
        );
        setIsLoading(false);
      }
       setIsLoading(false);
    } else if (!!result.error) {
      toast.error("Oops! Something went wrong.");
      setIsLoading(false);
    } else {
      toast.error("Oops! Something went wrong.");
    }
  }

  return true;
};

  return (
    <div className="flex h-full w-full items-center justify-center rounded-sm bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const success = await handleFormSubmit(values);

            if (success) {
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
              <div>
                <div className="flex justify-center">
                  {/* First Column */}
                  <div className="w-1/2 p-4">
                    {!employee && (
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
                    )}
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
                            employee && !locationData
                              ? {
                                  address: employee.address,
                                  lat: employee.latitude,
                                  lng: employee.longitude,
                                }
                              : ({
                                  address: locationData?.description,
                                  lat: locationData?.coordinates?.result
                                    .geometry.location.lat,
                                  lng: locationData?.coordinates?.result
                                    .geometry.location.lng,
                                } as LocationInfo)
                          }
                          reset={resetAddressSearch}
                          onSelectLocation={(res: Results) =>
                            handleSelectLocation(res, formikProps)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* Second Column */}
                  <div className="w-1/2 p-4">
                    {!employee && (
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
                    )}
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
                    <CommonDropdownField
                      id="role"
                      label={RoleType.EMPTY}
                      name={"role"}
                      placeholder={RoleType.EMPTY}
                      value={values.role}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      error={touched.role ? errors.role : undefined}
                      options={AdminTypes}
                      employee={employee}
                    />
                    <FileInput
                      id="avatar_url"
                      label="Add photo"
                      name="avatar_url"
                      handleChange={(file, e) =>
                        handleAvatarChange(file, formikProps)
                      }
                      onBlur={handleBlur}
                      error={touched.avatar_url ? errors.avatar_url : undefined}
                    />
                  </div>
                </div>
                <div className="my-5 flex w-full items-center justify-center">
                  <div
                    className="mx-auto w-1/6 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary p-1 text-center text-white transition hover:bg-opacity-90"
                    onClick={() => handleSubmit()}
                  >
                    {isLoading ? (
                      <LoadingIndicatorSmall />
                    ) : employee ? (
                      "Save"
                    ) : (
                      "Create"
                    )}
                  </div>
                  {employee && onEdit && (
                    <div className="my-3 flex justify-end">
                      <button
                        className="text-black-700 mr-2 text-opacity-30 transition hover:text-opacity-90"
                        onClick={() => onEdit()}
                      >
                        Close
                      </button>
                    </div>
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

export default EmployeeForm;
