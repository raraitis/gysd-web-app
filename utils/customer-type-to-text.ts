import { CustomerType } from "@/types/types";

export const getReadableCustomerType = (type: CustomerType): string => {
  switch (type) {
    case CustomerType.HOMEOWNER:
      return "Homeowner";
    case CustomerType.BUSINESS:
      return "Business";
    default:
      return "Unknown Type";
  }
};
