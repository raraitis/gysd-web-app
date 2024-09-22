import type { NextApiRequest, NextApiResponse } from "next";
import { PricesByCategoryResponse } from "@/types/types";

import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { get } from "@/lib/api/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<PricesByCategoryResponse>>
) {
  const { category } = req.query;

  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  console.log(jwt);

  await get<CommonResponse<PricesByCategoryResponse>>({
    client: mainClient,
    url: `/api/v1/price/category?category=${category}`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onResponse: (data) => {
      return res.status(200).send({ success: true, data: data?.data?.data });
    },
    onError: ({ response, statusText }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: statusText,
      });
    },
  });
}
