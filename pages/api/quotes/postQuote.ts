import type { NextApiRequest, NextApiResponse } from "next";
import { Job, Quote } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import axios from "axios";
import { mainClient } from "@/lib/api";
import { post } from "@/lib/api/common";

export type PostQuoteResponseData = {
  data: Quote;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<PostQuoteResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  console.log("Payload::", payload);

  await post<CommonResponse<PostQuoteResponseData>>({
    client: mainClient,
    url: `/api/v1/quote`,
    config: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
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
