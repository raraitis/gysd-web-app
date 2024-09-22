"use client";
import React, { FC } from "react";
import CardRow from "../CardRow";
import { WalletIcon } from "@heroicons/react/24/outline";

type Props = {
  data?: { total: number };
  error: any;
  isValidating: boolean;
  isLoading: boolean;
};
const DashTotalDeposits: FC<Props> = ({
  data,
  error,
  isValidating,
  isLoading,
}) => {
  // if (error) return <div>Failed to load</div>;

  // const loadingNoData = isLoading || isValidating;
  // const total = loadingNoData ? "Loading" : data?.total.toLocaleString("en-US") ?? "0";

  return (
    <CardRow title="Total Deposits" total={`${"2"} ₩`}>
      <div className="h-6 w-6">
        <WalletIcon />
      </div>
    </CardRow>
  );
};

export default DashTotalDeposits;
