import { NextApiRequest, NextApiResponse } from "next";
import { remove } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";

export type RemoveCategoryFromPriceResponse = {
  data: {};
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<RemoveCategoryFromPriceResponse>>
) {
  const { price_id, category_id } = req.body;

  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  await remove<CommonResponse<RemoveCategoryFromPriceResponse>>({
    client: mainClient,
    url: `/api/v1/price/category`,
    config: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data: { price_id, category_id },
    },
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
