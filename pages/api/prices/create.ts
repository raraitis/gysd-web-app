import type { NextApiRequest, NextApiResponse } from "next";
import { CreatePriceResponse } from "@/types/types";
import { post } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CreatePriceResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  console.log(payload, "payload");

  let url = `/api/v1/price`;

  await post<CommonResponse<CreatePriceResponse>>({
    client: mainClient,
    url,

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
