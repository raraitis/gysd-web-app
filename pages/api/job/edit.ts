import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { patch } from "@/lib/api/common";

export type EditJobResponseData = {
  data: Job;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EditJobResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const payload = req.body;

  console.log(payload);

  await patch<CommonResponse<EditJobResponseData>>({
    client: mainClient,
    url: `/api/v1/job`,
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
