import React, { useCallback, useMemo } from "react";
import { GoogleMap, Marker, MarkerF } from "@react-google-maps/api";
import { decodeGeoHash } from "@/utils/decodeGeo";
import { MarkerCoordinates } from "@/types/types";


interface GoogleMapProps {
  hash: string;
  markercoordinates?: MarkerCoordinates[];
}

const SmallMaps: React.FC<GoogleMapProps> = ({ hash, markercoordinates }) => {
  const decodedLocation = decodeGeoHash(hash);

  const center = useMemo(() => {
    return {
      lat: decodedLocation.latitude,
      lng: decodedLocation.longitude,
    };
  }, [decodedLocation]);

  const openGoogleMaps = useCallback(() => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

    window.open(mapsUrl, "_blank");
  }, [center]);

  const overlayViewStyle: React.CSSProperties = {
    zIndex: 0,
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col items-start gap-3 p-3">
      <div
        className="flex cursor-pointer items-center justify-center rounded-lg border bg-[#a0c8d5]/90 px-4 py-2 dark:text-boxdark"
        onClick={openGoogleMaps}
      >
        Get directions
      </div>
      <div className="flex h-full w-full" style={overlayViewStyle}>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            minHeight: 450,
            maxHeight: 600,
          }}
          center={center}
          zoom={15}
        >
          <MarkerF position={center} visible={true} />
          {markercoordinates && (
            <>
              {markercoordinates.map((marker, key) => {
                return (
                  <Marker
                    key={key}
                    position={{
                      lat: marker.latitude,
                      lng: marker.longitude,
                    }}
                    onClick={openGoogleMaps}
                  />
                );
              })}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default SmallMaps;
