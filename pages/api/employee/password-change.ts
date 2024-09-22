import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { patch } from "@/lib/api/common";
import { mainClient } from "@/lib/api";

export type PswChangeResponse = {
  data: {};
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<PswChangeResponse>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  await patch<CommonResponse<PswChangeResponse>>({
    client: mainClient,
    url: "/api/v1/admin/password",
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: payload,
    onError: ({ response }) => {
      console.log(response, response?.statusText, "SERVER ERROR");
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
  });
}
