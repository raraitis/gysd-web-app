import { CustomerStatus } from "@/types/types"; // Adjust the import path based on your project structure

export const getReadableCustomerStatus = (type: CustomerStatus): string => {
  switch (type) {
    case CustomerStatus.PENDING:
      return "Pending";
    case CustomerStatus.ACTIVATED:
      return "Activated";
    case CustomerStatus.DEACTIVATED:
      return "Deactivated";
    default:
      return "Unknown Type";
  }
};
