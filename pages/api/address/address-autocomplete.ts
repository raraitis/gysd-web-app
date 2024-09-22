import type { NextApiRequest, NextApiResponse } from "next";
import { getUrl } from "@/lib/api/common";

export interface Prediction {
  description: string;
  id: string;
  place_id: string;
}

export interface AutocompleteResponse {
  predictions: Prediction[];
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { input } = req.query;

    if (!input || Array.isArray(input)) {
      return res.status(400).json({ error: "Invalid input parameter" });
    }

    const response = await getUrl<AutocompleteResponse>({
      url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?",
      config: {
        params: {
          input,
          key: "AIzaSyAu34ySpxPw9VO2AU9Lmk91gdKeKv0uvBY",
        },
      },
    });

    if (response.data && response.data.status === "ZERO_RESULTS") {
      return res.status(200).json({ error: "No results found for the input" });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
 