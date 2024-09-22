import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { CustomerJobResponseData } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CustomerJobResponseData>>
) {
  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (session) => session?.user?.accessToken
  );

  const { id, direction = "asc" } = req.query;

  if (!id || Array.isArray(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid ID parameter" });
  }

  await get<CommonResponse<CustomerJobResponseData>>({
    client: mainClient,
    url: `/api/v1/job/customer?id=${id}&direction=${direction}`,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
    onError: ({ response }) => {
      console.log(response.status, response?.statusText, "SERVER ERROR");
      return res.status(response?.status || 500).send({
        success: false,
        message: response?.statusText,
      });
    },
  });
}
