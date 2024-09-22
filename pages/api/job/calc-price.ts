import type { NextApiRequest, NextApiResponse } from "next";
import { ICalcParams } from "@/types/types";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { BaseResponseType, CommonResponse } from "@/types/responses";
import { mainClient } from "@/lib/api";
import { post } from "@/lib/api/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<{ price: string }>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  if (!session || !session.user) {
    return res.status(403).send({
      success: false,
      message: "Unauthenticated",
    });
  }

  const jwt = session.user.accessToken;

  const { job, footage, isPro = false, story = 1 }: ICalcParams = req.body;
  console.log(req.body);

  try {
    const result = await post<BaseResponseType<{ price: string }>>({
      client: mainClient,
      url: `/api/v1/price/calc`,
      data: {
        job,
        footage: Number(footage),
        isPro,
        story,
      },
      config: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    });

    if (result.data && result.status === 200) {
      return res.status(200).send({ success: true, data: result.data.data });
    }

    return res.status(500).send({
      success: false,
      message: result.error?.message ?? "Failed to get price.",
    });
  } catch (error: any) {
    return res.status(500).send({
      success: false,
      message: error?.message ?? "Failed to get price.",
    });
  }
}
