"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import LoadingIndicatorSmall from "@/components/Indicators/LoadingIndicatorSmall";
import TableJobTypesAndPrices from "@/components/Tables/TableJobTypesAndPrices";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { JobsPricesResponseData } from "@/types/types";
import { useState } from "react";
import useSWR from "swr";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageLength = 10;

  const url = `${config.jobsPrices}?limit=${pageLength}&offset=${
    (currentPage - 1) * pageLength
  }`;

  const {
    data: pricesData,
    error: pricesError,
    isLoading: isPricesLoading,
    mutate: pricesMutate,
  } = useSWR<JobsPricesResponseData>(url, fetcher);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newUrl = `${config.jobList}?limit=${pageLength}&offset=${
      (page - 1) * pageLength
    }`;
    pricesMutate(newUrl);
  };

  if (!pricesData?.data?.prices && !pricesError) return <div>No Data</div>;

  if (pricesError) return <div>No Data</div>;

  return (
    <>
      <div className="flex w-full flex-col">
        <Breadcrumb pageName="Job types" />
      </div>

      {pricesData?.data?.prices && pricesData?.data?.prices.length !== 0 && (
        <TableJobTypesAndPrices
          prices={pricesData.data.prices}
          count={pricesData.data.count}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          mutate={() => pricesMutate(url)}
        />
      )}

      {isPricesLoading && <LoadingIndicatorSmall />}
    </>
  );
};

export default Page;
