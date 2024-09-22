import type { NextApiRequest, NextApiResponse } from "next";
import { EmployeeResponseData } from "@/types/types";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeeResponseData>>
) {
  const { id } = req.query;

  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await get<CommonResponse<EmployeeResponseData>>({
    client: mainClient,
    url: `/api/v1/employee`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
      data: { id },
    },
    onResponse: (data) => {
      return res.status(200).send({ success: true, data: data?.data?.data });
    },
    onError: ({ response }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
