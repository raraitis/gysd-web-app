"use client";

import { FC } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { PricesByCategoryResponse } from "@/types/types";
import { CommonResponse } from "@/types/responses";
import { useParams } from "next/navigation";
import DetailedCategoryTable from "../Tables/DetailedCategoryTable";
import { clsxm } from "@/utils/clsxm";
import Loader from "../common/Loader";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { decodeUrlString } from "@/utils/utils";

type RouteParams = {
  category: string;
};

const CategoryPage: FC<RouteParams> = ({ category }) => {
  const params = useParams<RouteParams>();
  const { data, error, isLoading, mutate } = useSWR<
    CommonResponse<PricesByCategoryResponse>
  >(config.jobPricesByCategory + `?category=${params?.category}`, fetcher);

  const decodedString = decodeUrlString(params?.category || "");

  return (
    <div className="flex w-full flex-col">
      <Breadcrumb pageName={`Category: ${decodedString}`} />
      <div
        className={clsxm(
          "flex w-full flex-col",
          "rounded-sm",
          "bg-white",
          "shadow-default",
          "dark:border-strokedark",
          "dark:bg-boxdark",
          "sm:px-7.5",
          "xl:pb-1",
          "no-scrollbar",
          "overflow-x-auto",
          "items-center",
          "justify-center",
          "h-[100%]",
          "p-5"
        )}
      >
        <div className="m-5 flex w-full flex-col">
          {data?.data?.price_categories && !isLoading && (
            <DetailedCategoryTable categories={data.data} />
          )}
          {isLoading && <Loader />}
          {(!data?.data?.price_categories && !data && !isLoading) ||
            (data?.data?.price_categories.length === 0 && (
              <div className="flex w-full items-center justify-center rounded-md border p-2">
                <EyeSlashIcon className="h-6 w-8" />
                <div className="flex px-2">NO DATA</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
