import type { NextApiRequest, NextApiResponse } from "next";
import { patch } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";

type Responses = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<any>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const { id } = req.body;

  await patch<CommonResponse<Responses>>({
    client: mainClient,
    url: `/api/v1/admin/deactivate/employee`,

    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: { id },
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
