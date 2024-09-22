// nextauth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { RoleType } from "./types/user";
// common interface for JWT and Session
interface IUser extends DefaultUser {
  accessToken: string;
  refreshToken: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
