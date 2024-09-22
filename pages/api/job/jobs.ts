import type { NextApiRequest, NextApiResponse } from "next";
import { JobsResponseData } from "@/types/types";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<JobsResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const {
    offset = 0,
    limit = 10,
    status,
    query,
    sort,
    direction = "asc",
  } = req.query;

  // Construct the URL with the query parameter
  let url = `/api/v1/job/all?limit=${limit}&offset=${offset}`;

  // Include the searchFirstName parameter only if query is not empty
  if (query) {
    url += `&searchDescription=${query}`;
  }

  if (status) url += `&status=${status}`;

  url += `&sort=created_at`;
  url += `&direction=desc`;

  await get<CommonResponse<JobsResponseData>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onError: ({ response, statusText }) => {
      return res.status(response?.status || 500).send({
        success: false,
        message: statusText,
      });
    },
    onResponse: (data) => {
      return res.status(200).send({ success: true, data: data?.data?.data });
    },
  });
}
