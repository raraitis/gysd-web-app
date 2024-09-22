import { patch } from "./common";

const config = {
  login: "/api/v1/auth/login/employee",
  refreshToken: "/api/v1/auth/refresh/employee",
  addAdmin: "/api/v1/super/employee",
  createClient: "/api/v1/customer",

  adminGroupList: "/api/admin/group/list",
  adminGroupCreate: "/api/admin/group/create",

  adminRequestCount: "/api/admin/request/count",
  adminTransactionCount: "/api/admin/transactions/count",

  adminUserCreate: "/api/admin/user/create",
  adminUserDelete: "/api/admin/user/delete",
  adminUserList: "/api/admin/user/list",
  adminUserCount: "/api/admin/user/count",

  transactionList: "/api/transaction/list",
  transactionNew: "/api/transaction/new",
  transactionAcknowledge: "/api/transaction/acknowledge",
  transactionTotalDeposit: "/api/transaction/total/deposit",
  transactionTotalWithdrawal: "/api/transaction/total/withdrawal",

  userList: "/api/user/list",
  userCount: "/api/user/count",
  userFindById: "/api/user/find-by-id",
  userVerifyId: "/api/user/verify-id",
  userVerifyPhone: "/api/user/verify-phone",
  userToggleBanned: "/api/user/toggle-banned",
  userPendingCount: "/api/user/pending-count",
  userPendingList: "/api/user/pending-list",
  userBankUpdate: "/api/user/update/bank",

  clientList: "/api/client/clients",
  clientGet: "/api/client/get",
  getEmployee: "/api/employee/employee",
  customerJobList: "/api/client/customer-jobs", //:id
  editCustomer: "/api/client/edit",
  editEmployee: "/api/employee/edit",
  employeeJobList: "/api/employee/employee-jobs", //:id
  findEmployeeByEmail: "/api/employee/find", //:email

  jobList: "/api/job/jobs",
  job: "/api/job", // /:id
  jobReport: "/api/job/jobs-report", // /:id
  jobImages: "/api/job/jobs-images", // /:id
  createJob: "/api/job/create",
  jobImageUpload: "/api/job/image/upload",
  jobCalcPrice: "/api/job/calc-price",
  deleteJob: "/api/job/delete",
  editJob: "/api/job/edit",
  pswChange: "/api/employee/password-change",
  deactivateEmployee: "/api/employee/delete", //:id
  reactivateEmployee: "/api/employee/reactivate", //:id
  deactivateCustomer: "/api/client/delete",
  reactivateCustomer: "/api/client/reactivate",
  // Job Categories and Prices
  jobsPrices: "/api/prices/prices",
  adminJobPriceUpdate: "/api/prices/update",
  adminJobPriceCreate: "/api/prices/create",
  adminJobPriceDelete: "/api/prices/delete",
  adminJobCategories: "/api/prices/categories",
  assignCategory: "/api/prices/assign-category",
  removeCategoryFromPrice: "/api/prices/remove-category",
  jobPricesByCategory: "/api/prices/prices-by-category",

  employeesList: "/api/employee/employees",
  employeeWithdrawals: "/api/employee/employee-withdrawals",
  employeeCommisionTotal: "/api/employee/commission/total",
  employeeCommisionTotalById: "/api/employee/commission/", //:id
  adminEditEmployeeCommision: "/api/employee/commission/edit",
  uploadAvatar: "/api/employee/avatar",

  adminWithdrawals: "/api/employee/admin-withdrawals",
  adminApproveWithdrawal: "/api/employee/admin-approve-withdrawal",

  schedule: "/api/employee/schedule",

  deleteCategory: "/api/categories/delete",
  adminAddCategory: "/api/categories/create",
  updateCategory: "/api/categories/update",

  updateNotifications: "/api/notifications/edit",
  quotesList: "/api/quotes/quotes",
  quote: "/api/quotes", //:id,
  assignQuoteToSalesRep: "/api/quotes/assign",
  postQuote: "/api/quotes/postQuote",
  patchQuote: "/api/quotes/patchQuote",

  calculateJobPrice: "/api/v1/price/calc",
};

export { config };
