"use client";
import React, { FC } from "react";
import CardRow from "../CardRow";
import { WalletIcon } from "@heroicons/react/24/outline";

type Props = {
  total?: number;
};
const DashTotalTransactions: FC<Props> = ({ total }) => {
  const endString = !!total ? total.toLocaleString("en-US") : "0";
  return (
    <CardRow title="Total (Deposits/Withdrawals)" total={`${endString} ₩`}>
      <div className="h-6 w-6">
        <WalletIcon />
      </div>
    </CardRow>
  );
};

export default DashTotalTransactions;
