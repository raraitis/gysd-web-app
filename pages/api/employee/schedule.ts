import { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { EmployeeScheduleResponse } from "@/types/types";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    CommonResponse<EmployeeScheduleResponse> | { error: string }
  >
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const {
    offset = 0,
    limit = undefined,
    query,
  } = req.query as {
    offset?: number;
    limit?: number;
    query?: string;
  };

  let url = `/api/v1/employee/schedule`;

  if (limit !== undefined) {
    url += `?limit=${limit}`;
  }
  if (offset !== undefined) {
    url += `${limit !== undefined ? "&" : "?"}offset=${offset}`;
  }

  if (query) {
    url += `&search=${query}`;
  }

  await get<CommonResponse<EmployeeScheduleResponse>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onError: ({ response }) => {
      return res
        .status(response?.status || 500)
        .send({ success: false, error: response?.statusText });
    },
    onResponse: ({ data }) => {
      if (data) {
        return res.status(200).send({ success: true, data: data.data });
      }
    },
  });
}
