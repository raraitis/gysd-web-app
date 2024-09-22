import ngeohash from "ngeohash";

interface GeoHashDecodeResult {
  latitude: number;
  longitude: number;
}

export const decodeGeoHash = (geoHash: string): GeoHashDecodeResult => {
  const decoded = ngeohash.decode(geoHash);
  return {
    latitude: decoded.latitude,
    longitude: decoded.longitude,
  };
};
