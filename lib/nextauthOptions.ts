// lib/nextauthOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { getUrl, postUrl } from "@/lib/api/common";
import { config } from "./api/config";
import { signOut } from "next-auth/react";

type ResponseAuth = {
  data: Tokens;
};

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export const nextauthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin_auth",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email.toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        const result = await postUrl<ResponseAuth>({
          url: process.env.API_URL + config.login,
          data: {
            email: email,
            password: password,
          },
        });

        if (result.data && result.data.data) {
          const resData = result.data.data;

          return {
            id: "",
            accessToken: resData.access_token,
            refreshToken: resData.refresh_token,
          };
        } else if (!!result.error) {
          throw new Error(
            result?.error?.response?.data?.error ?? "Something went wrong."
          );
        } else {
          throw new Error(result?.error ?? "Login failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      if (
        token &&
        token.exp &&
        typeof token.exp === "number" &&
        Date.now() < token.exp * 1000
      ) {
        return token;
      }

      try {
        const result = await getUrl<ResponseAuth>({
          url: process.env.API_URL + config.refreshToken,
          config: {
            headers: {
              Authorization: `Bearer ${token.refreshToken}`,
            },
          },
        });

        if (
          result &&
          result.data &&
          result.data.data.access_token &&
          result.data.data.refresh_token
        ) {
          token.accessToken = result.data.data.access_token;
          token.refreshToken = result.data.data.refresh_token;
          return token;
        } else {
          token.accessToken = "";
          token.refreshToken = "";
          return token;
        }
      } catch (error) {
        token.accessToken = "";
        token.refreshToken = "";
        return token;
      }
    },

    session({ session, token, user }) {
      if (token && session.user) {
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/api/v1/auth/login/employee",
    signOut: "/api/v1/auth/logout/employee",
    error: "/api/v1/auth/logout/employee", // Error code passed in query string as ?error=
    // error: "/auth/error",
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
