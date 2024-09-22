import { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { EmployeeType } from "@/types/types";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";

export type NextApiSuccessResponse<T> = NextApiResponse<CommonResponse<T>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiSuccessResponse<EmployeeType>
) {
  const session = await getServerSession(req, res, nextauthOptions);
  const jwt = session?.user?.accessToken;
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing email parameter", success: false });
  }

  await get<CommonResponse<EmployeeType>>({
    client: mainClient,
    url: `/api/v1/employee/find?email=${email}`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onResponse: ({ data }) => {
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
