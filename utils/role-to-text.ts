import { RoleType } from "@/types/types"; // Adjust the import path based on your project structure

export const getReadableRole = (type: RoleType): string => {
  switch (type) {
    case RoleType.FIELD_TECH:
      return "Field Technician";
    case RoleType.ADMIN:
      return "Admin";
    case RoleType.OFFICE_STAFF:
      return "Office Staff";
    case RoleType.SUPER:
      return "Super Admin";
    case RoleType.INSTALLER:
      return "Installer";
    case RoleType.SALES_REP:
      return "Sales Representative";
    case RoleType.INSPECTOR:
      return "Inspector";
    default:
      return "Unknown Role";
  }
};
