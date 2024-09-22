import React, { FC } from "react";
import { Customer, CustomerStatus, CustomerType } from "@/types/types";
import LeadSourceBlock from "./LeadSourceBlock";
import { UserIcon } from "@heroicons/react/24/outline";
import CustomerStatusChip from "../Customer/CustomerStatusChip";
import UserPageDetails from "./UserPageDetails";
import CustomerTypeChip from "../Customer/CustomerTypeChip";
import SmallMaps from "./SmallMaps";
import JobImageGallery from "../Job/JobImageGallery";

type Props = {
  client: Customer;
  hideLeadCard?: boolean;
  images?: { id: string; url: string }[];
};

const CustomerDetails: FC<Props> = ({ client, hideLeadCard, images }) => {
  return (
    <div className="flex w-full flex-col py-2">
      <div className="flex w-full flex-row gap-3">
        <h2 className="w-1/2 text-lg font-semibold">Customer information</h2>
        {!hideLeadCard && client.lead_source && (
          <h2 className="w-1/2 text-lg font-semibold">Lead source</h2>
        )}
      </div>
      <div className="flex w-full flex-row gap-3">
        <div className="flex w-1/2 flex-col   ">
          <div className="flex min-h-[100%] flex-col justify-around rounded-md border-2 border-gray-200  p-3 shadow-md">
            <div className="flex w-full items-center justify-center p-3">
              <div className="rounded-3xl border-2 border-gray-200 p-3 opacity-80 shadow-2">
                <UserIcon width={60} />
              </div>
            </div>
            <div className="flex w-full flex-col items-center ">
              <h2 className="text-grey-900 font-semibold dark:text-white">
                {client?.first_name} {client?.last_name}
              </h2>
              <div className="flex flex-row gap-3 py-1">
                <CustomerStatusChip type={client?.status as CustomerStatus} />
                <CustomerTypeChip type={client.type as CustomerType} />
              </div>
              {client && <UserPageDetails user={client} notifications={true} />}
            </div>
          </div>
        </div>

        {!hideLeadCard && client.lead_source ? (
          <div className="flex w-1/2 flex-col">
            <LeadSourceBlock email={client.lead_source} />
          </div>
        ) : (
          <div className="flex w-1/2 items-center justify-center overflow-hidden rounded-md border-2 border-gray-200">
            <SmallMaps hash={client?.geoHash} />
          </div>
        )}
      </div>
      {!!images && images.length > 0 && (
        <div className="flex w-full py-3">
          <JobImageGallery
            images={images.map((f) => ({
              id: f.id,
              url: f.url,
            }))}
          />
        </div>
      )}
      {!hideLeadCard && client.lead_source && (
        <div className="flex w-full items-center justify-center rounded-md">
          <SmallMaps hash={client?.geoHash} />
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
