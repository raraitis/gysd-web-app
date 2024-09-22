import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { post } from "@/lib/api/common";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<any>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await post<CommonResponse<any>>({
    client: mainClient,
    url: `/api/v1/employee/avatar`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: {
      id: req.body.id,
      image: req.body.image,
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response }) => {
      console.log(response, response?.statusText, "SERVER ERROR");
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
