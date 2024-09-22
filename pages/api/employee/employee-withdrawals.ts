import type { NextApiRequest, NextApiResponse } from "next";
import { WithdrawalResponseData } from "@/types/types";
import { get } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<WithdrawalResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  const {
    offset = 0,
    limit = undefined,
    id,
  } = req.query as {
    offset?: number;
    limit?: number;
    id?: string;
  };

  let url = `/api/v1/employee/withdrawals`;

  let approved = req.query.approved;

  if (approved) {
    url += `?approved=${approved}`;
  }

  if (id) url += `&id=${id}`;

  if (offset) {
    url += `&offset=${offset}`;
  }

  if (limit) {
    url += `&limit=${limit}`;
  }

  await get<CommonResponse<WithdrawalResponseData>>({
    client: mainClient,
    url,
    config: {
      headers: { Authorization: `Bearer ${jwt}` },
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
