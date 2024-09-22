import type { NextApiRequest, NextApiResponse } from "next";
import { post } from "@/lib/api/common";
import { mainClient } from "@/lib/api";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  if (!session || !session.user || !session.user.accessToken) {
    return res.status(401).send({ success: false, error: "Unauthorised" });
  }

  if (req.method !== "POST") {
    return res.status(500).send({ success: false });
  }

  try {
    const jwt = session.user.accessToken;
    const { jobId, images } = req.body;

    if (!jobId || !images || (!!images && images.length === 0)) {
      return res
        .status(410)
        .send({ success: false, error: "Invalid payload." });
    }

    const result = await post<CommonResponse>({
      client: mainClient,
      url: `${process.env.API_URL}/api/v1/job/image`,
      config: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
      data: {
        id: jobId,
        images: images.map((f: any) => ({ image: f })),
      },
    });

    console.log("RESULT :: " + JSON.stringify(result, null, 4));

    return res.status(200).send({ success: !!result.data });
  } catch (error: any) {
    return res.status(500).send({ success: false, error: error?.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "200mb",
    },
  },
};
