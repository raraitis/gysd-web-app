import { NextApiRequest, NextApiResponse } from "next";
import { remove } from "@/lib/api/common";
import { CommonResponse } from "@/types/responses";
import { Job } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { mainClient } from "@/lib/api";

export type DeleteJobResponseData = {
  data: {
    data: Job;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<DeleteJobResponseData>>
) {
  const { id } = req.body;

  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  await remove<CommonResponse<DeleteJobResponseData>>({
    client: mainClient,
    url: `/api/v1/job`,
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
