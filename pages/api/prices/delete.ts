import { NextApiRequest, NextApiResponse } from "next";
import { remove } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { Price } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { mainClient } from "@/lib/api";

export type DeletePriceResponseData = {
  data: {
    data: Price;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<DeletePriceResponseData>>
) {
  const { id } = req.body;

  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await remove<CommonResponse<DeletePriceResponseData>>({
    client: mainClient,
    url: `/api/v1/price`,
    config: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data: { id },
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
