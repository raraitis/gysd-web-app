import type { NextApiRequest, NextApiResponse } from "next";
import { post } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { config } from "@/lib/api/config";

type CalculateJobPriceResponse = {
  price: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CalculateJobPriceResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  let url = config.calculateJobPrice;

  await post<CommonResponse<CalculateJobPriceResponse>>({
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
