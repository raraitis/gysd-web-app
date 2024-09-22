import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { EmployeeComissionResponse } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeeComissionResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const id = req.query.id as string;

  await get<CommonResponse<EmployeeComissionResponse>>({
    client: mainClient,
    url: `/api/v1/employee/commission/total?id=${id}`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response, statusText }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: statusText,
      });
    },
  });
}
