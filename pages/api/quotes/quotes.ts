import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { Quote } from "@/types/types";

export type QuotesResponse = {
  data: {
    count: number;
    quotes: Quote[];
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<QuotesResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const {
    offset = 0,
    limit = 10,
    status,
    query,
    sort,
    direction = "asc",
    customer_id,
  } = req.query;

  let url = `/api/v1/quote?limit=${limit}&offset=${offset}`;

  if (query) {
    url += `&searchDescription=${query}`;
  }

  if (customer_id) {
    url += `&customer_id=${customer_id}`;
  }

  if (status) url += `&status=${status}`;


  url += `&sort=created_at`;
  url += `&direction=desc`;

  await get<CommonResponse<any>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onError: ({ response, statusText }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: statusText,
      });
    },
    onResponse: (data) => {
      return res.status(200).send({ success: true, data: data?.data?.data });
    },
  });
}
