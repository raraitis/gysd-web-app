import DropdownCustom from "@/components/Dropdowns/DropdownCustom";
import DropdownCustomNew from "@/components/Dropdowns/DropdownCustomNew";
import CommonInputFieldNew from "@/components/Input/CommonInputFieldNew";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { CommonResponse } from "@/types/responses";
import { Option, Quote } from "@/types/types";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { QuoteByIdData } from "@/components/Quotes/QuoteDetailsPage";

const validationSchema = Yup.object().shape({
  footage: Yup.number().required("Required"),
  downSpoutsFootage: Yup.number().required("Required"),
  elbowsAmount: Yup.number().required("Required"),
  insideMiterCount: Yup.number().required("Required"),
  outsideMiterCount: Yup.number().required("Required"),
  bayInsideMitterCount: Yup.number().required("Required"),
  bayOutsideMitterCount: Yup.number().required("Required"),
});

const COLOR_FINISH = [
  { id: "1", name: "White", value: "White" },
  { id: "2", name: "Cream", value: "Cream" },
  { id: "3", name: "Black", value: "Black" },
  { id: "4", name: "Musket Brown", value: "Musket Brown" },
  { id: "5", name: "Antique Ivory", value: "Antique Ivory" },
];

const MITER_TYPE = [
  { id: "1", name: "Strip Miter", value: "Strip Miter" },
  { id: "2", name: "Hand Cut Miter", value: "Hand Cut Miter" },
  { id: "3", name: "Box Miter", value: "Box Miter" },
  { id: "4", name: "Bay Box Miter", value: "Bay Box Miter" },
];

const GUTTER_SIZE = [
  { id: "1", name: "6 inch" },
  { id: "2", name: "7 inch" },
];

type Props = {
  jobType: string;
  onDismiss?: () => void;
  onSubmit: (price: string, data: any) => void;
  isEdit?: boolean;
  quote?: Quote | QuoteByIdData;
  itemsTotal: string;
};

const QuoteGutterSystemsForm = ({
  jobType,
  onDismiss,
  onSubmit,
  isEdit,
  quote,
  itemsTotal,
}: Props) => {
  const [price, setPrice] = useState<string>("0");
  const [total, setTotal] = useState<number>(0);
  // NEW
  const [gutterSize, setGutterSize] = useState<Option | undefined>();
  const [colorFinish, setColorFinish] = useState<Option | undefined>();
  const [insideMiterType, setInsideMiterType] = useState<Option | undefined>();
  const [outsideMiterType, setOutsideMiterType] = useState<
    Option | undefined
  >();
  const [bayInsideMiterType, setBayInsideMiterType] = useState<
    Option | undefined
  >();
  const [bayOutsideMiterType, setBayOutsideMiterType] = useState<
    Option | undefined
  >();
  const handleClick = async () => {
    await add();
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {
      footage: quote?.data?.footage ?? "",
      gutterSize: quote?.data?.gutterSize ?? "",
      colorFinish: quote?.data?.colorFinish ?? "",
      downSpoutsFootage: quote?.data?.downSpoutsFootage ?? "",
      elbowsAmount: quote?.data?.elbowsAmount ?? "",
      insideMiterType: quote?.data?.insideMiterType ?? "",
      outsideMiterType: quote?.data?.outsideMiterType ?? "",
      bayInsideMiterType: quote?.data?.bayInsideMiterType ?? "",
      bayOutsideMiterType: quote?.data?.bayOutsideMiterType ?? "",
      insideMiterCount: quote?.data?.insideMiterCount ?? "",
      outsideMiterCount: quote?.data?.outsideMiterCount ?? "",
      bayInsideMitterCount: quote?.data?.bayInsideMitterCount ?? "",
      bayOutsideMitterCount: quote?.data?.bayOutsideMitterCount ?? "",
    },
    validateOnMount: true,
    validationSchema,
    onSubmit: handleClick,
  });

  const debouncedFootage = useDebounceNew(values.footage, 500);

  useEffect(() => {
    setTotal(Number(itemsTotal) + Number(price));
  }, [itemsTotal, price]);

  const add = async () => {
    // if (!gutterSize) {
    //   toast.error("Please add gutter size.");
    //   return;
    // }
    // if (!colorFinish) {
    //   toast.error("Please add color finish.");
    //   return;
    // }
    // if (!insideMiterType) {
    //   toast.error("Please add inside miter type.");
    //   return;
    // }
    // if (!outsideMiterType) {
    //   toast.error("Please add outside miter type.");
    //   return;
    // }
    // if (!bayInsideMiterType) {
    //   toast.error("Please add bay inside miter type.");
    //   return;
    // }
    // if (!bayOutsideMiterType) {
    //   toast.error("Please add bay outside miter type.");
    //   return;
    // }

    if (!price) {
      toast.error("Please add footage.");
      return;
    }

    onSubmit(price, {
      ...values,
      gutterSize,
      colorFinish,
      insideMiterType,
      outsideMiterType,
      bayInsideMiterType,
      bayOutsideMiterType,
    });
  };

  const handleCancel = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  useEffect(() => {
    if (!debouncedFootage || debouncedFootage === "0") {
      setPrice("0");
      return;
    }
    (async () => {
      const result = await calcJobPrice({
        job: jobType,
        footage: Number(debouncedFootage),
      });

      if (result?.data?.price) {
        setPrice(result.data.price);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobType, debouncedFootage]);

  useEffect(() => {
    if (!quote) {
      return;
    }

    if (quote?.data?.gutterSize) {
      setGutterSize(GUTTER_SIZE.find((f) => f.id === quote.data.gutterSize.id));
    }

    if (quote?.data?.colorFinish) {
      setColorFinish(
        COLOR_FINISH.find((f) => f.id === quote.data.colorFinish.id)
      );
    }
    if (quote?.data?.insideMiterType) {
      setInsideMiterType(
        MITER_TYPE.find((f) => f.id === quote?.data?.insideMiterType.id)
      );
    }

    if (quote?.data?.outsideMiterType) {
      setOutsideMiterType(
        MITER_TYPE.find((f) => f.id === quote?.data?.outsideMiterType.id)
      );
    }
    if (quote.data.bayInsideMiterType) {
      setBayInsideMiterType(
        MITER_TYPE.find((f) => f.id === quote?.data?.bayInsideMiterType.id)
      );
    }

    if (quote?.data?.bayOutsideMiterType) {
      setBayOutsideMiterType(
        MITER_TYPE.find((f) => f.id === quote?.data?.bayOutsideMiterType.id)
      );
    }
  }, [quote]);

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
    <div>
      <div>
        {/* <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre> */}

        <DropdownCustomNew
          label="Gutter Size"
          name="gutterSize"
          options={GUTTER_SIZE}
          value={
            GUTTER_SIZE.find((item) => item.id === values.insideMiterType.id)
              ?.name as string
          }
          onOptionSelect={(option) => {
            setGutterSize(option);
            setFieldValue("gutterSize", option);
          }}
          placeholder="5 inch"
          disabled={!isEdit}
        />

        <div>
          <DropdownCustomNew
            label="Color Finish"
            name="colorFinish"
            options={COLOR_FINISH}
            value={
              COLOR_FINISH.find((item) => item.id === values.colorFinish.id)
                ?.name as string
            }
            onOptionSelect={(option) => {
              setColorFinish(option);
              setFieldValue("colorFinish", option);
            }}
            placeholder="Color Finish"
            disabled={!isEdit}
          />

          <CommonInputFieldNew
            id="footage"
            name="footage"
            label="Footage"
            placeholder="100"
            value={values.footage}
            handleChange={handleChange}
            handleBlur={handleBlur}
            type="number"
            error={touched.footage ? (errors.footage as string) : undefined}
            disabled={!isEdit}
          />

          <div className="flex gap-2">
            <CommonInputFieldNew
              id="downSpoutsFootage"
              name="downSpoutsFootage"
              label="Footage of downspouts"
              placeholder="100"
              value={values.downSpoutsFootage}
              handleChange={handleChange("downSpoutsFootage")}
              handleBlur={handleBlur("downSpoutsFootage")}
              type="number"
              error={
                touched.downSpoutsFootage
                  ? (errors.downSpoutsFootage as string)
                  : undefined
              }
              disabled={!isEdit}
            />
            <CommonInputFieldNew
              id="elbowsAmount"
              name="elbowsAmount"
              label="Amount of elbows"
              placeholder="100"
              value={values.elbowsAmount}
              handleChange={handleChange("elbowsAmount")}
              handleBlur={handleBlur("elbowsAmount")}
              type="number"
              error={
                touched.elbowsAmount
                  ? (errors.elbowsAmount as string)
                  : undefined
              }
              disabled={!isEdit}
            />
          </div>

          <div className="flex gap-2">
            <DropdownCustomNew
              label="Inside Miter Type"
              name="insideMiterType"
              options={MITER_TYPE}
              value={
                MITER_TYPE.find((item) => item.id === values.insideMiterType.id)
                  ?.name as string
              }
              onOptionSelect={(option) => {
                setInsideMiterType(option);
                setFieldValue("insideMiterType", option);
              }}
              placeholder="Inside Miter Type"
              disabled={!isEdit}
            />
            <CommonInputFieldNew
              id="insideMiterCount"
              name="insideMiterCount"
              label="Inside Miter Count"
              placeholder="Inside Miter Count"
              value={values.insideMiterCount}
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="number"
              error={
                touched.insideMiterCount
                  ? (errors.insideMiterCount as string)
                  : undefined
              }
              disabled={!isEdit}
            />
          </div>
          <div className="flex gap-2">
            <DropdownCustomNew
              label="Outside Miter Type"
              name="outsideMiterType"
              options={MITER_TYPE}
              value={
                MITER_TYPE.find(
                  (item) => item.id === values.outsideMiterType.id
                )?.name as string
              }
              onOptionSelect={(option) => {
                setOutsideMiterType(option);
                setFieldValue("outsideMiterType", option);
              }}
              placeholder="Outside Miter Type"
              disabled={!isEdit}
            />
            <CommonInputFieldNew
              id="outsideMiterCount"
              name="outsideMiterCount"
              label="Outside Miter Count"
              placeholder="Outside Miter Count"
              value={values.outsideMiterCount}
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="number"
              error={
                touched.outsideMiterCount
                  ? (errors.outsideMiterCount as string)
                  : undefined
              }
              disabled={!isEdit}
            />
          </div>

          <div className="flex gap-2">
            <DropdownCustomNew
              label="Bay Inside Miter Type"
              name="bayInsideMiterType"
              options={MITER_TYPE}
              value={
                MITER_TYPE.find(
                  (item) => item.id === values.bayInsideMiterType.id
                )?.name as string
              }
              onOptionSelect={(option) => {
                setBayInsideMiterType(option);
                setFieldValue("bayInsideMiterType", option);
              }}
              placeholder="Bay Inside Miter Type"
              disabled={!isEdit}
            />
            <CommonInputFieldNew
              id="bayInsideMitterCount"
              name="bayInsideMitterCount"
              label="Bay Inside Miter Count"
              placeholder="Bay Inside Miter Count"
              value={values.bayInsideMitterCount}
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="number"
              error={
                touched.bayInsideMitterCount
                  ? (errors.bayInsideMitterCount as string)
                  : undefined
              }
              disabled={!isEdit}
            />
          </div>

          <div className="flex gap-2">
            <DropdownCustomNew
              label="Bay Outside Miter Type"
              name="bayOutsideMiterType"
              options={MITER_TYPE}
              value={
                MITER_TYPE.find(
                  (item) => item.id === values.bayOutsideMiterType.id
                )?.name as string
              }
              onOptionSelect={(option) => {
                setBayOutsideMiterType(option);
                setFieldValue("bayOutsideMiterType", option);
              }}
              placeholder="Bay Outside Miter Type"
              disabled={!isEdit}
            />
            <CommonInputFieldNew
              id="bayOutsideMitterCount"
              name="bayOutsideMitterCount"
              label="Bay Outside Miter Count"
              placeholder="Bay Outside Miter Count"
              value={values.bayOutsideMitterCount}
              handleChange={handleChange}
              handleBlur={handleBlur}
              type="number"
              error={
                touched.bayOutsideMitterCount
                  ? (errors.bayOutsideMitterCount as string)
                  : undefined
              }
              disabled={!isEdit}
            />
          </div>
        </div>

        <CommonInputFieldNew
          name="total"
          id="total"
          label="Total"
          value={total || 0}
          handleChange={handleChange}
          handleBlur={handleBlur}
          type="number"
          disabled={true}
        />
      </div>

      <div>
        {isEdit && (
          <button
            type="button"
            className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={() => {
              handleSubmit();
            }}
            disabled={!isValid || !isEdit}
          >
            Submit
          </button>
        )}

        {/* <div style={styles.flexBtn}>
          <ButtonWithGradient
            title={"Confirm"}
            onClick={handleSubmit}
            disabled={!isValid}
            loading={isLoading}
          />
        </div> */}
      </div>
    </div>
  );
};

export default QuoteGutterSystemsForm;
