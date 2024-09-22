import { UserIcon } from "@heroicons/react/24/outline";
import React from "react";

type CardImageProps = {
  url?: string;
  alt: string;
};

export const CardImage = ({ url }: CardImageProps) => {
  const [imageError, setImageError] = React.useState(false);
  return (
    <>
      {url && !imageError ? (
        <img
          className="h-24 w-24 rounded-3xl border-2 border-gray-200 opacity-80 shadow-2"
          src={`${url}`}
          alt="User avatar"
          onError={(e) => {
            setImageError(true);
          }}
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="h-24 w-24 rounded-3xl border-2 border-gray-200 opacity-80 shadow-2">
          <UserIcon />
        </div>
      )}
    </>
  );
};
