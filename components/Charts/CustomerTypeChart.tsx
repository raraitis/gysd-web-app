import React from "react";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { CustormerResponseData, CustomerType } from "@/types/types";
import Loader from "../common/Loader";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartBarIcon, EyeIcon } from "@heroicons/react/24/outline";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CustomerTypeDistributionState {
  series: { data: number[] }[];
}

interface Props {
  title?: string;
  series?: string;
}

const CustomerTypeChart: React.FC<Props> = () => {
  const {
    data: clientData,
    error,
    isValidating,
    isLoading,
  } = useSWR<CustormerResponseData>(config.clientList, fetcher);

  if (error) return;

  if (!clientData || isLoading || isValidating) return;

  const transformJobType = (type: CustomerType): string => {
    switch (type) {
      case "HOMEOWNER":
        return "Home owner";
      case "BUSINESS":
        return "Business";
      default:
        return type;
    }
  };

  const customerTypeCounts: { [key: string]: number } = {};
  clientData.data.customers.forEach((customer) => {
    const type = customer.type as CustomerType;
    const transsformedType = transformJobType(type);
    customerTypeCounts[transsformedType] =
      (customerTypeCounts[transsformedType] || 0) + 1;
  });

  const categories = Object.keys(customerTypeCounts);
  const counts = Object.values(customerTypeCounts);

  const state: CustomerTypeDistributionState = {
    series: [{ data: counts }],
  };

  const options: ApexOptions = {
    colors: ["#3C50E0"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 350,
      width: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} customers`,
      },
    },
  };

  return (
    <div className="flex h-100 w-full flex-col items-center justify-center border bg-white shadow-2">
      <div className="flex w-full items-center justify-center">
        <h5 className="font-semibold">Customer type distribution</h5>
      </div>
      {clientData ? (
        <div>
          {!isLoading ? (
            <ApexCharts
              options={options}
              series={state.series}
              type="bar"
              width={"100%"}
              height={240}
            />
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <EyeIcon width={20} height={20} />
            <p>NO DATA</p>
          </div>
          <div className="flex w-1/2">
            <ChartBarIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTypeChart;
