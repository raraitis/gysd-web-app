import { FC, useState } from "react";
import { JobReport } from "@/types/types";

type Props = {
  reports: JobReport[];
};

const JobNotes: FC<Props> = ({ reports }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="flex w-1/2 flex-col">
      <span className="mb-4 text-xl font-bold">NOTES</span>
      <div className="flex w-full flex-col gap-4 rounded-md border-2 p-3 shadow-md">
        {reports &&
          reports.map((report: JobReport, index: number) => (
            <div key={index} className="flex w-full items-start border-b-2 p-2">
              <div className="mr-4 h-16 w-16 flex-shrink-0">
                <img
                  src={report?.image_url}
                  alt="Thumbnail"
                  className="h-full w-full cursor-pointer object-cover"
                  onClick={() => openModal(report.image_url)}
                />
              </div>
              <div>
                <div className="text-md mb-2 font-bold">{report.reporter}</div>
                <div className="mb-2 text-sm text-gray-500">
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <div className="content font-small whitespace-pre-wrap text-sm">
                  {report.content}
                </div>
              </div>
            </div>
          ))}
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-h-full max-w-full rounded bg-white p-4 shadow-lg">
            <button
              onClick={closeModal}
              className="absolute right-0 top-0 bg-white p-1 text-black"
            >
              Close
            </button>
            <img
              src={selectedImage}
              alt="Expanded"
              className="max-h-screen max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobNotes;
