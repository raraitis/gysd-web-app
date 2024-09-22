import useSWR from "swr";
import { QuoteDetails } from "./QuoteDetails";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import { Customer, Quote } from "@/types/types";

export interface QuoteByIdResponse {
  success: boolean;
  data: QuoteByIdData;
}

type SalesRep = {
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export interface QuoteByIdData {
  id: string;
  customer_id: string;
  jobType: string;
  description: string;
  address: string;
  geoHash: string;
  status: string;
  quote: number;
  data?: any;
  created_at: Date;
  updated_at: Date;
  customer: Customer;
  sales_rep: SalesRep;
}

type QuoteProps = {
  id: string;
};
const QuotePage = ({ id }: QuoteProps) => {
  const { data, isLoading, error } = useSWR<QuoteByIdResponse>(
    config.quote + `/${id}`,
    fetcher
  );

  return (
    <div className="no-scrollbar rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="no-scrollbar max-w-full overflow-x-auto">
        {isLoading && <LoadingIndicatorSmall />}
        {data?.data && (
          <QuoteDetails
            quote={data.data}
            delete={() => console.log("delete")}
          />
        )}
      </div>
    </div>
  );
};

export default QuotePage;
