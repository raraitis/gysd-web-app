import type { NextApiRequest, NextApiResponse } from "next";
import { EditPricesResponseData } from "@/types/types";
import { patch } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EditPricesResponseData>>
) {
  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  const payload = req.body;

  await patch<CommonResponse<EditPricesResponseData>>({
    client: mainClient,
    url: `/api/v1/price`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: payload,
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
