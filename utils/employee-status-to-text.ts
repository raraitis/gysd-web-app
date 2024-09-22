import { EmployeeStatus } from "@/types/types"; // Adjust the import path based on your project structure

export const getReadableStatus = (type: EmployeeStatus): string => {
  switch (type) {
    case EmployeeStatus.PENDING:
      return "Pending";
    case EmployeeStatus.CONFIRMED:
      return "Confirmed";
    case EmployeeStatus.DEACTIVATED:
      return "Deactivated";
    default:
      return "Unknown Type";
  }
};
