import { NextApiRequest, NextApiResponse } from "next";
import { remove } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import axios from "axios";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<any>>
) {
  const { id } = req.body;

  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (sess) => sess?.user?.accessToken
  );

  await remove<CommonResponse<any>>({
    client: mainClient,
    url: `/api/v1/admin/category`,
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
