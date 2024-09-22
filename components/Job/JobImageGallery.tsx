import { JobImages } from "@/types/types";
import { FC, useState } from "react";

type Props = {
  images?: { id: string; url: string }[];
};

const JobImageGallery: FC<Props> = ({ images }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);

  const openImage = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImage = () => {
    setExpandedImage(null);
  };

  return (
    <div className="mb-3 flex flex-col gap-4">
      <span className="text-xl font-bold">IMAGES</span>
      <div className="grid w-full grid-cols-3 gap-4">
        {images &&
          images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.url}
                alt="Report Image"
                className="h-50 w-auto cursor-pointer rounded-lg"
                onClick={() => openImage(image.url)}
              />
            </div>
          ))}
      </div>
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage}
        >
          <div
            className="relative p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the image container
          >
            <button
              onClick={closeImage}
              className="absolute right-3 top-3 m-2 bg-white p-1 text-xs text-black"
            >
              Close
            </button>
            <img
              src={expandedImage}
              alt="Expanded"
              className="h-auto max-h-150 w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobImageGallery;
