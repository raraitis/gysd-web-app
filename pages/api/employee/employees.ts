import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { EmployeesResponseData } from "@/types/types";
import { mainClient } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeesResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const {
    offset = "0",
    limit = undefined,
    query,
    role,
    status,
  } = req.query as {
    offset: string;
    limit?: string;
    query?: string;
    role?: string;
    status?: string;
  };

  let url = `/api/v1/employee/all`;

  const addQueryParam = (param: string, value: string | undefined) => {
    if (value && value !== "") {
      url += `${url.includes("?") ? "&" : "?"}${param}=${value}`;
    }
  };

  addQueryParam("limit", limit);
  addQueryParam("role", role);
  addQueryParam("offset", offset);
  addQueryParam("searchFirstName", query);
  addQueryParam("status", status);
  addQueryParam("sort", "created_at");
  addQueryParam("direction", "desc");
  
  await get<CommonResponse<EmployeesResponseData>>({
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
