import { IHaveAccountID, IHaveID } from "./types";

export type AdminUser = { username: string; role: RoleType } & IHaveID &
  IHaveAccountID;

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

export const roleToString = (role?: RoleType) => {
  if (!role) {
    return "";
  }

  switch (role) {
    case RoleType.SUPER:
      return "SUPER";
    case RoleType.FIELD_TECH:
      return "FIELD_TECH";
    case RoleType.OFFICE_STAFF:
      return "OFFICE_STAFF";
  }
};
