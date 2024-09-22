// api/v1/job/report/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { JobImagesResponseData } from "@/types/types";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<JobImagesResponseData>>
) {
  const { id } = req.query;

  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await get<CommonResponse<JobImagesResponseData>>({
    client: mainClient,
    url: `${process.env.API_URL}/api/v1/job/images?id=${id}`,
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
