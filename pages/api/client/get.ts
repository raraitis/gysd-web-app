import { mainClient } from "@/lib/api";
import { get, post } from "@/lib/api/common";
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "@/lib/api/config";
import { BaseResponseType } from "@/types/responses";
import { IClient } from "@/types/types";
import { log } from "console";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth";

type ResponseData = {
  success: boolean;
  data?: IClient;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(500).send({ success: false });
  }

  const jwt = await getServerSession(req, res, nextauthOptions).then(
    (session) => session?.user?.accessToken
  );

  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .send({ success: false, error: "Invalid payload." });
    }

    const result = await get<BaseResponseType<IClient>>({
      client: mainClient,
      url: "/api/v1/customer",
      config: {
        params: {
          id,
        },
        headers: { Authorization: `Bearer ${jwt}` },
      },
    });

    console.log("result :: ", result.data?.data);

    if (result.data && result.data.data && result.status === 200) {
      return res.status(200).send({
        success: true,
        data: result.data.data,
      });
    }

    return res
      .status(409)
      .send({ success: false, error: "Failed to get client." });
  } catch (error: any) {
    return res.status(500).send({ success: false, error: error?.message });
  }
}
