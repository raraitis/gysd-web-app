import { NextApiRequest, NextApiResponse } from "next";
import { getUrl } from "@/lib/api/common";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Bounds {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  bounds: Bounds;
  location: Location;
  location_type: string;
  viewport: {
    northeast: Location;
    southwest: Location;
  };
}

interface Location {
  lat: number;
  lng: number;
}

export interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

export type Results = {
  description: string;
  matched_substrings: Array<{ length: number; offset: number }>;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: Array<{ length: number; offset: number }>;
    secondary_text: string;
  };
  terms: Array<{ offset: number; value: string }>;
  types: Array<string>;
  coordinates?: LocationInfo;
};

export type LocationInfo = {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
};

export interface GeocodeResponse {
  predictions: Results[];
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { error: string }>
) {
  try {
    const { place_id } = req.query;

    if (!place_id || Array.isArray(place_id)) {
      return res.status(400).json({ error: "Invalid place_id parameter" });
    }

    const response = await getUrl<any>({
      url: `https://maps.googleapis.com/maps/api/place/details/json`,
      config: {
        params: {
          place_id: place_id as string,
          key: "AIzaSyAu34ySpxPw9VO2AU9Lmk91gdKeKv0uvBY",
        },
      },
    });

    if (!response.data) {
      return res
        .status(500)
        .json({ error: "No data received from the Places API" });
    }

    if (response.data.status === "ZERO_RESULTS") {
      return res
        .status(200)
        .json({ error: "No results found for the place_id" });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
