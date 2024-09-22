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
  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  await patch<CommonResponse<any>>({
    client: mainClient,
    url: `/api/v1/admin/category`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: {
      id: req.body.id,
      category: req.body.category,
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response }) => {
      console.log(response, response?.status, "SERVER ERROR");
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
