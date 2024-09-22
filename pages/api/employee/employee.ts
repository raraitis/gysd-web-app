// pages/api/employee.ts
import { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { EmployeeType } from "@/types/types";
import { CommonResponse } from "@/types/responses";

export interface EmployeeApiResponse {
  data: EmployeeType;
}

export interface ErrorResponse {
  error: string;
}

export type CustomApiResponse<T> = T extends { data: infer U }
  ? { data: U }
  : ErrorResponse;

export type NextApiSuccessResponse<T> = NextApiResponse<CustomApiResponse<T>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeeApiResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);
  const jwt = session?.user?.accessToken;

  await get<CommonResponse<EmployeeApiResponse>>({
    client: mainClient,
    url: `/api/v1/employee`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onResponse: ({ data }) => {
      console.log(data?.data, "DATA");
      return res.status(200).send({ success: true, data: data?.data });
    },
    onError: ({ response }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
