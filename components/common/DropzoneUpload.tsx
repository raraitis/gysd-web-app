"use client";

import "react-dropzone-uploader/dist/styles.css";
import Dropzone, { IFileWithMeta, StatusValue } from "react-dropzone-uploader";
import toast from "react-hot-toast";
import { niceBytes } from "@/utils/utils";

export interface IImage {
  id: string;
  base64: string;
}

type Props = {
  onAddFiles: (images: IFileWithMeta[]) => void;
  onRemoveFile: (id: string) => void;
};

const DropzoneUpload = ({ onAddFiles, onRemoveFile }: Props) => {
  const handleChangeStatus = (
    file: IFileWithMeta,
    status: StatusValue,
    allFiles: IFileWithMeta[]
  ) => {
    const { meta } = file;

    let totalSize = 0;

    allFiles.forEach((element) => {
      if (status === "done") {
        totalSize += element.meta.size;
      }
    });

    const sizeInMb = totalSize / 1024 ** 2;

    switch (status) {
      case "removed":
        onRemoveFile(meta.id);
        break;

      case "rejected_file_type":
        toast.error("Unsupported file type.");
        break;
    }

    onAddFiles(allFiles.filter((f) => f.meta.status === "done"));
  };

  // const handleSubmit = (
  //   successFiles: IFileWithMeta[],
  //   allFiles: IFileWithMeta[]
  // ) => {
  //   console.log(successFiles.map((f) => f.meta));
  //   allFiles.forEach((f) => f.remove());
  // };

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      maxSizeBytes={1.5e7}
      inputContent="Click or drop images"
      accept="image/*"
    />
  );
};

export default DropzoneUpload;
