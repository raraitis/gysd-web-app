import type { NextApiRequest, NextApiResponse } from "next";
import { JobsPricesResponseData } from "@/types/types";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<JobsPricesResponseData>>
) {
  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  const { offset = 0, limit = 1000 } = req.query;

  // Construct the URL with the query parameter
  let url = `/api/v1/price/all?limit=${limit}&offset=${offset}`;

  await get<CommonResponse<JobsPricesResponseData>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onError: ({ response }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
    onResponse: (data) => {
      return res.status(200).send({ success: true, data: data?.data?.data });
    },
  });
}
