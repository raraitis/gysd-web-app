export type Option = {
  id: string;
  name: string;
  value?: string | number | boolean;
};

export type IHaveID = {
  _id: string;
};

export type IHaveAccountID = {
  account_id: string;
};

export interface IIdentifiable {
  id: string;
}
export type AdminGroup = {
  owner_id: string;
  created_at: number;
  updated_at: number;
} & IHaveID &
  IHaveAccountID;

export type CommonResponse = {
  data: {
    access_token: string;
    refresh_token: string;
  };
};

export interface TabProps {
  label: string;
  value: string;
  color?: string;
}

export type AdminResponseType = {
  data: {
    id: string;
    email: string;
    username: string;
    type: string;
    firebaseToken: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export enum RoleType {
  FIELD_TECH = "FIELD_TECH",
  OFFICE_STAFF = "OFFICE_STAFF",
  SUPER = "SUPER",
  EMPTY = "Role",
  INSTALLER = "INSTALLER",
  SALES_REP = "SALES_REP",
  INSPECTOR = "INSPECTOR",
  ADMIN = "ADMIN",
}

export enum EmployeeStatus {
  CONFIRMED = "CONFIRMED",
  DEACTIVATED = "DEACTIVATED",
  PENDING = "PENDING",
}

export enum CustomerStatus {
  ACTIVATED = "ACTIVATED",
  DEACTIVATED = "DEACTIVATED",
  PENDING = "PENDING",
}

export enum CustomerType {
  HOMEOWNER = "HOMEOWNER",
  BUSINESS = "BUSINESS",
  EMPTY = "",
}

export enum QuoteStatus {
  ASSIGNED = "ASSIGNED",
  REQUESTED = "REQUESTED",
  DECLINED = "DECLINED",
  ACCEPTED = "ACCEPTED",
  SENT = "SENT",
}

type SalesRep = {
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type Quote = {
  id?: string;
  customer_id: string;
  jobType: string;
  address: string;
  geoHash: string;
  status?: QuoteStatus;
  data?: any;
  customer: Customer;

  sales_rep: SalesRep;
  quote: number;
  created_at?: string;
  updated_at?: string;
  description?: string;
};

export interface IQuoteRequest {
  id: string;
  customer_id: string;
  jobType: string;
  address: string;
  geoHash: string;
  status: QuoteStatus;
  quote: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IQuoteRequestSingle {
  id: string;
  customer_id: string;
  jobType: string;
  description: string;
  address: string;
  geoHash: string;
  status: QuoteStatus;
  quote: number;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    geoHash: string;
    mobile_number: string;
    avatar_url: string;
    lead_source: string;
    created_at: string;
    updated_at: string;
  };
  sales_rep?: IQuoteSalesRep | null;
  data: IQuoteGutterSystems | IQuoteGutterCleaning;
}

interface IQuoteSalesRep {
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export enum ClientType {
  HomeOwner = "HOMEOWNER",
  Business = "BUSINESS",
}

export interface INameWithID {
  id: string;
  name: string;
  value: string;
}

export interface IQuoteGutterSystems {
  footage: string;
  gutterSize: INameWithID;
  colorFinish: INameWithID;
  description: string;
  elbowsAmount: string;
  insideMiterType: INameWithID;
  insideMiterCount: string;
  outsideMiterType: INameWithID;
  downSpoutsFootage: string;
  outsideMiterCount: string;
  bayInsideMiterType: INameWithID;
  bayOutsideMiterType: INameWithID;
  bayInsideMitterCount: string;
  bayOutsideMitterCount: string;
}

export interface IQuoteGutterCleaning {
  floor1?: Floor;
  floor2?: Floor;
  floor3?: Floor;
  description: string;
}

export interface Floor {
  price: number;
  footage: string;
}

export type CustomerUpdatePayload = {
  first_name?: string;
  last_name?: string;
  address?: string;
  type?: ClientType;
  mobile_number?: string;
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
  company_name?: string;
  company_reg?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
};

export type EmployeeType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  color_hex: string;
  avatar_url: string;
  address: string;
  role: string;
  status?: EmployeeStatus;
  permissions: Record<string, any>;
  company_name: string;
  company_id: string;
  firebase_token: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Permissions = {
  is_admin: boolean;
  can_share_job: boolean;
  can_edit_settings: boolean;
  can_see_customers: boolean;
  can_see_reporting: boolean;
  can_see_future_jobs: boolean;
  is_point_of_contact: boolean;
  can_add_and_edit_job: boolean;
  can_be_booked_online: boolean;
  can_see_full_schedule: boolean;
  can_chat_with_customers: boolean;
  can_see_street_view_data: boolean;
  can_delete_and_cancel_job: boolean;
  can_edit_message_on_invoice: boolean;
  can_see_marketing_campaigns: boolean;
  can_take_payment_see_prices: boolean;
  can_call_and_text_with_customers: boolean;
};

export type EmployeeData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  color_hex?: string;
  avatar_url: string;
  role: RoleType;
  company_name?: string;
  status: EmployeeStatus;
  company_id?: string;
  firebase_token?: string | null;
  created_at?: string;
  updated_at?: string;
  password: string;
  address: string;
  commission?: number;
  geoHash?: string;
  latitude: number | null;
  longitude: number | null;
  [key: string]:
    | string
    | number
    | null
    | string[]
    | RoleType
    | boolean
    | undefined
    | EmployeeStatus;
};

export type EmployeeResponseType = {
  data: EmployeeData[];
  success?: boolean;
  message?: string;
  error?: string;
};

export type Address = {
  type?: string;
  street: string;
  street_line_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type CustormerResponseData = {
  data: { count: number; customers: Customer[] };
};

export type JobResponseData = {
  data: Job;
};

export type JobReport = {
  id: string;
  reporter: string;
  content: string;
  image_url: string;
  created_at: string;
};

export type JobImages = {
  id: string;
  job_id: string;
  image_url: string;
  created_at: string;
};

export type JobImagesResponseData = {
  success: boolean;
  data: {
    count: number;
    images: JobImages[];
  };
};

export type JobReportResponseData = {
  success: boolean;
  data: {
    count: number;
    reports: JobReport[];
  };
};

export type JobStatuse =
  | "LEAD"
  | "SCHEDULED"
  | "DECLINED"
  | "DRIVING"
  | "ARRIVED"
  | "STARTED"
  | "DONE"
  | "CANCELED"
  | "FIX_REQUIRED"
  | "FIXING";

export enum JobStatus {
  REQUEST = "REQUEST",
  LEAD = "LEAD",
  SCHEDULED = "SCHEDULED",
  DECLINED = "DECLINED",
  DRIVING = "DRIVING",
  ARRIVED = "ARRIVED",
  STARTED = "STARTED",
  CANCELED = "CANCELED",
  INSPECTION_REQUIRED = "INSPECTION_REQUIRED",
  PENDING_REVIEW = "PENDING_REVIEW",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  IN_REVIEW = "IN_REVIEW",
  FIX_REQUIRED = "FIX_REQUIRED",
  FIXING = "FIXING",
  DONE = "DONE",
  REVIEWING = "REVIEWING",
}

export enum JobCategories {
  RESTORATION = "Restoration",
  PAVERS = "Pavers",
  CLEANING = "Cleaning",
  GUTTERS = "Gutters",
}

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
};

export type AssignedEmployee = {
  employee_id: string;
  job_id: string;
  created_at: string;
  employee: Employee;
  address: string;
};

export type CalcInput = {
  job: string;
  footage: number;
  story: number;
  isPro: boolean;
};

export type Receipt = {
  image_url: string;
  job_id: string;
};

export type Job = {
  id: string;
  description: string;
  customer_id: string;
  email: string;
  mobile_number: string;
  address: string;
  scheduled_start: string | null;
  type: string;
  status: JobStatus;
  isExternal: boolean;
  customer: Customer;
  latitude: number;
  longitude: number;
  amount: number;
  assigned_employees: AssignedEmployee[];
  created_at: string;
  updated_at: string;
  receipt?: Receipt | null;
  geoHash?: string;
  story?: number;
  footage?: number;
  calcInput: CalcInput;
  [key: string]:
    | string
    | number
    | Customer
    | null
    | Date
    | string[]
    | boolean
    | undefined
    | AssignedEmployee[]
    | CalcInput
    | Receipt;
};

export type CostMultiplier = {
  [key: string]: number;
};

export type Price = {
  id: string;
  job: string;
  isExternal: boolean;
  costPerFeet: number;
  costPerFeetPro: number;
  costMultiplier: CostMultiplier;
  categories: {
    price_id: string;
    category_id: string;
    assigned_at: string;
    category: Category;
  }[];
  image_url?: string;
  created_at?: string;
};

export type Category = {
  id: string;
  category: string;
};

export type JobsCategoriesResponse = {
  data: {
    count: number;
    categories: Category[];
  };
};

export type PricesByCategoryResponse = {
  count: number;
  price_categories: {
    price_id: string;
    category_id: string;
    price: Price;
  }[];
};

export type CreateCategoryResponse = {
  data: Category;
};

export type JobsResponseData = {
  data: {
    count: number;
    jobs: Job[];
  };
};

export type JobsPrices = Price[];

export type JobsPricesResponseData = {
  data: { prices: JobsPrices; count: number };
};

export type CreatePriceResponse = {
  data: Price;
};

export type EditPricesResponseData = {
  data: Price;
};

export type EmployeesResponseData = {
  data: { count: number; employees: EmployeeData[] };
};

export type EmployeeResponseData = {
  data: EmployeeData;
};

export type ClientsResponseData = {
  success: boolean;
  message?: string;
  data?: CustormerResponseData;
  error?: string;
};

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  home_number?: string;
  work_number?: string;
  company?: string;
  lead_source?: string;
  notes?: string;
  status?: string;
  type: CustomerType;
  address: string;
  avatar_url: string;
  password: string;
  notifications_enabled: boolean;
  tags?: string[];
  latitude: number;
  longitude: number;
  geoHash: string;
  [key: string]:
    | string
    | number
    | string[]
    | boolean
    | undefined
    | CustomerType;
};

export type ClientCreationResponseType =
  | {
      data: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
        home_number: string;
        work_number: string;
        company: string;
        notifications_enabled: null | any;
        notes: string;
        firebase_token: null | string;
        created_at: string;
        updated_at: string;
      };
      status: string;
    }
  | {
      message: string[];
      error: string;
      statusCode: number;
    };

export type AssignJobResponse = {
  employee_id: string;
  job_id: string;
  created_at: string;
  job: {
    id: string;
    description: string;
    address: string;
    status: string;
    type: string;
    amount: any;
    scheduled_start: string;
    created_at: string;
    updated_at: string;
  };
};

export type Withdrawal = {
  id: string;
  amount: number;
  approved: string;
  approved_by: string;
  employee_id: string;
  created_at: string;
  updated_at: string;
  withdrawer: {
    first_name: string;
    last_name: string;
  };
};

export type WithdrawalResponseData = {
  data: { count: number; withdrawals: Withdrawal[] };
};

export type CustomerJob = {
  id: string;
  description: string;
  address: string;
  status: JobStatus;
  type: string;
  amount: number;
  scheduled_start: string;
  created_at: string;
  updated_at: string;
  [key: string]: string | number; // Index signature
};

export type CustomerJobResponseData = {
  count: number;
  jobs: CustomerJob[];
};

export type CustomerJobResponse = {
  data: CustomerJobResponseData;
};
export type Jobe = {
  id: string;
  description: string;
  address: string;
  status: JobStatus;
  type: string;
  amount: number;
  scheduled_start: string;
  created_at: string;
  updated_at: string;
  [key: string]: string | number;
};

export type EmployeeJob = {
  employee_id: string;
  job_id: string;
  created_at: string;
  job: Jobe;
};

export type EmployeeScheduleResponse = {
  count: number;
  employeeJobs: EmployeeJob[];
};

export type EmployeeComissionResponse = {
  data: {
    commission: number;
  };
};

export type EmployeeComissionEditResponse = {
  data: EmployeeData;
};

export type MarkerCoordinates = {
  latitude: number;
  longitude: number;
  data: any;
};

export type AdminTypeChipProps = {
  type: CustomerType;
};

export type PastelColors = {
  info?: string;
  success?: string;
  primary?: string;
  warning?: string;
  error?: string;
  default?: string;
};

// #region JOB TYPES

export type CategoryPrices = {
  category_id: string;
  price: Price;
  price_id: string;
};

export type JobCategory = {
  assigned_at: string;
  category: CategoryType;
  category_id: string;
  price_id: string;
};

export type CategoryType = {
  id: string;
  category: JobCategories;
};

export type JobType = {
  categories: JobCategory[];
  category_id: string;
  price_id: string;
  created_at: string;
  id: string;
  image_url: string | null;
  isExternal: boolean;
  job: string;
  price: number;
};

export type JobEntity = {
  job: string;
  costPerFeet: number;
  costPerFeetPro: number;
  costMultiplier: any;
  isExternal: boolean;
  categories: ICategory[];
} & IIdentifiable;

export interface ICategory {
  price_id: string;
  category_id: string;
  assigned_at: string;
  category: {
    id: string;
    category: string;
  };
}

export enum JobOrigin {
  EXTERNAL = "External",
  INTERNAL = "Internal",
}

export interface ICalcParams {
  job: string;
  footage: number;
  isPro?: boolean;
  story?: number;
}

// #startregion JOB TYPES

export type IClient = {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  type: ClientType;
  geoHash: string;
  mobile_number: string;
  avatar_url: string;
  lead_source?: string;
  firebase_token: string;
  company?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  customerImages: IClientImg[];
} & IIdentifiable;

export interface IClientImg {
  id: string;
  customer_id: string;
  image_url: string;
  created_at: string;
}
