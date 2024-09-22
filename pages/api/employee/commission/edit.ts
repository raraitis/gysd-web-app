import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { EmployeeComissionEditResponse } from "@/types/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { patch } from "@/lib/api/common";
import { getServerSession } from "next-auth";

import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeeComissionEditResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await patch<CommonResponse<EmployeeComissionEditResponse>>({
    client: mainClient,
    url: `/api/v1/admin/commission`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: {
      id: req.body.id,
      commission: String(req.body.commission),
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response }) => {
      console.log(response, response?.statusText, "SERVER ERROR");
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
