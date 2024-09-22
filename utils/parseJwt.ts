import { RoleType } from "@/types/types";
import { useSession } from "next-auth/react";

export function parseJwt(token: string) {
  try {
    // console.log(JSON.parse(atob(token.split(".")[1])));
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function useRole(roles?: RoleType[]) {
  const { data } = useSession();
  if (!data?.user?.accessToken) return null;
  const role = parseJwt(data?.user?.accessToken)?.role;
  if (!roles) return role;
  return roles.includes(role);
}
