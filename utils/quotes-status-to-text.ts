import { QuoteStatus } from "@/types/types"; // Adjust the import path based on your project structure

export const getReadableQuotesStatus = (type: QuoteStatus): string => {
  switch (type) {
    case QuoteStatus.ASSIGNED:
      return "Assigned";
    case QuoteStatus.REQUESTED:
      return "Requested";
    case QuoteStatus.DECLINED:
      return "Declined";
    case QuoteStatus.SENT:
      return "Sent";
    case QuoteStatus.ACCEPTED:
      return "Accepted";
    default:
      return "Unknown Type";
  }
};
