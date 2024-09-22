import type { NextApiRequest, NextApiResponse } from "next";
import { Job, QuoteStatus } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { patch } from "@/lib/api/common";

export type EditQuoteResponseData = {
  data: Job;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EditQuoteResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  await patch<CommonResponse<EditQuoteResponseData>>({
    client: mainClient,
    url: `/api/v1/quote`,
    config: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    data: {
      quote_id: payload.quote_id,
      quote: Number(payload.quote),
      data: payload.data,
      status: QuoteStatus.SENT,
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: (err: any) => {
      return res.status(err?.response?.status || 500).send({
        success: false,
        message: err?.response?.statusText,
      });
    },
  });
}
