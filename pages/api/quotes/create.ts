import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { post } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export type CreateJobResponseData = {
  data: Job;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CreateJobResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  await post<CommonResponse<CreateJobResponseData>>({
    client: mainClient,
    url: `${process.env.API_URL}/api/v1/job`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    data: payload,
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response, statusText }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: statusText,
      });
    },
  });
}
