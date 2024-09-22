import CommonInputFieldNew from "@/components/Input/CommonInputFieldNew";
import { postUrl } from "@/lib/api/common";
import { config } from "@/lib/api/config";
import { CommonResponse } from "@/types/responses";
import { useDebounceNew } from "@/utils/use-debounce-new";
import { formatToDollar } from "@/utils/utils";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

type PayloadFloor = {
  price: string;
  footage: string;
};

type PayloadData = {
  floor1?: PayloadFloor;
  floor2?: PayloadFloor;
  floor3?: PayloadFloor;
};

type Props = {
  isEdit?: boolean;
  data?: any;
  jobType: string;
  onDismiss?: () => void;
  onSubmit: (price: string, data: any) => void;
  itemsTotal: string;
};

const QuoteGutterCleaningForm = (props: Props) => {
  const [price1, setPrice1] = useState<string | undefined>();
  const [price2, setPrice2] = useState<string | undefined>();
  const [price3, setPrice3] = useState<string | undefined>();
  const [total, setTotal] = useState(0);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    isValid,
  } = useFormik({
    initialValues: {
      footage1: props.data?.floor1?.footage ?? "",
      footage2: props.data?.floor2?.footage ?? "",
      footage3: props.data?.floor3?.footage ?? "",
    },
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    validationSchema: Yup.object().shape({
      id: Yup.string().optional(),
      footage1: Yup.string()
        .min(1)
        .max(9999)
        .required("Please add footage to atleast one floor."),
      footage2: Yup.string().min(1).max(9999).optional(),
      footage3: Yup.string().min(1).max(9999).optional(),
    }),
    validateOnMount: true,
    validateOnChange: true,
  });

  const debouncedFootage1 = useDebounceNew(values.footage1, 500);
  const debouncedFootage2 = useDebounceNew(values.footage2, 500);
  const debouncedFootage3 = useDebounceNew(values.footage3, 500);

  const floorTotal = useMemo(() => {
    let sum = 0;
    if (price1) sum += Number(price1);
    if (price2) sum += Number(price2);
    if (price3) sum += Number(price3);
    return sum;
  }, [price1, price2, price3]);

  useEffect(() => {
    const calculateTotal = () => {
      setTotal(Number(props.itemsTotal) + floorTotal);
    };
    calculateTotal();
  }, [props.itemsTotal, floorTotal]);

  const add = async () => {
    if (!price1 && !price2 && !price3) {
      alert("Please add footage to atleast one floor.");
      return;
    }

    let dataObj: PayloadData = {};

    if (price1) {
      dataObj = {
        ...dataObj,
        floor1: {
          price: price1,
          footage: values.footage1,
        },
      };
      console.log("dataObj", dataObj);
    }

    if (price2) {
      dataObj = {
        ...dataObj,
        floor2: {
          price: price2,
          footage: values.footage2,
        },
      };
      console.log("dataObj 1", dataObj);
    }

    if (price3) {
      dataObj = {
        ...dataObj,
        floor3: {
          price: price3,
          footage: values.footage3,
        },
      };
      console.log("dataObj 1", dataObj);
    }

    props.onSubmit(total.toString(), {
      ...dataObj,
    });
  };

  useEffect(() => {
    if (!debouncedFootage1 || debouncedFootage1 === "0") {
      setPrice1(undefined);
      return;
    }
    (async () => {
      const result = await calcJobPrice({
        job: props.jobType,
        footage: Number(debouncedFootage1),
        story: 1,
      });
      if (result?.data?.price) {
        console.log("setting price2", result);
        setPrice1(result.data.price);
      }
    })();
    console.log(price1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.jobType, debouncedFootage1]);

  useEffect(() => {
    if (!debouncedFootage2 || debouncedFootage2 === "0") {
      setPrice2(undefined);
      return;
    }
    (async () => {
      const result = await calcJobPrice({
        job: props.jobType,
        footage: Number(debouncedFootage2),
        story: 2,
      });
      if (result?.data?.price) {
        setPrice2(result.data.price);
      }
    })();
    console.log(price2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.jobType, debouncedFootage2]);

  useEffect(() => {
    if (!debouncedFootage3 || debouncedFootage3 === "0") {
      setPrice3(undefined);
      return;
    }
    (async () => {
      const result = await calcJobPrice({
        job: props.jobType,
        footage: Number(debouncedFootage3),
        story: 3,
      });
      if (result?.data?.price) {
        setPrice3(result.data.price);
      }
    })();
    console.log(price3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.jobType, debouncedFootage3]);

  async function calcJobPrice(payload: {
    job: string;
    footage: number;
    story: number;
  }) {
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
      {/* <pre>
        <code>{JSON.stringify(values, null, 2)}</code>
      </pre> */}
      <div>
        <CommonInputFieldNew
          name="footage1"
          id="footage1"
          label="Footage 1"
          value={values.footage1}
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={errors.footage1 as string}
          type="number"
          disabled={!props.isEdit}
        />
        <CommonInputFieldNew
          name="footage2"
          id="footage2"
          label="Footage 2"
          value={values.footage2}
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={errors.footage2 as string}
          type="number"
          disabled={!props.isEdit}
        />
        <CommonInputFieldNew
          name="footage3"
          id="footage3"
          label="Footage 3"
          value={values.footage3}
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={errors.footage3 as string}
          type="number"
          disabled={!props.isEdit}
        />
        <CommonInputFieldNew
          name="total"
          id="total"
          label="Total"
          value={Number(total)}
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={""}
          type="number"
          disabled={!props.isEdit}
        />

        {props.isEdit && (
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={() => add()}
            disabled={!isValid || !props.isEdit}
          >
            Submit
          </button>
        )}
      </div>
    </>
  );
};

type PriceViewProps = {
  footage: number;
  type: string;
  story: number;
};

const PriceView = (values: PriceViewProps) => {
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

export default QuoteGutterCleaningForm;
