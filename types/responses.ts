export type CommonResponse<T = {}> = {
  data?: T;
  success: boolean;
  error?: string;
  message?: string;
};

export type BaseResponseType<T = {}> = {
  error?: any;
  data: T;
};

export type BalancesResponseType = {
  balances: Balance[];
};

export type Balance = {
  currency_code: string;
  id: number;
  type: string;
  user_id: number;
};


export type Pagination = {
  totalPages: number;
  totalEntries: number;
};
