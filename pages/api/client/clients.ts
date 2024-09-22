import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { CustormerResponseData } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CustormerResponseData>>
) {
  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (session) => session?.user?.accessToken
  );

  const {
    offset = "0",
    limit = undefined,
    query,
    type,
    status,
  } = req.query as {
    offset: string;
    limit?: string;
    query?: string;
    type?: string;
    status?: string;
  };

  let url = `/api/v1/customer/all`;

  const addQueryParam = (param: string, value: string | undefined) => {
    if (value && value !== "") {
      url += `${url.includes("?") ? "&" : "?"}${param}=${value}`;
    }
  };

  addQueryParam("limit", limit);
  addQueryParam("type", type);
  addQueryParam("offset", offset);
  addQueryParam("searchFirstName", query);
  addQueryParam("status", status);
  addQueryParam("sort", "created_at");
  addQueryParam("direction", "desc");

  await get<CommonResponse<CustormerResponseData>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    onError: ({ response }) => {
      console.log(response.status, response?.statusText, "SERVER ERROR");
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
