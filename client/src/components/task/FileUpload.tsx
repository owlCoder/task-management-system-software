import React, { useState } from "react";
import { FileUploadProps } from "../../types/props";

export const FileUpload: React.FC<FileUploadProps> = ({
  setFile,
  uploadedFileName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-[11px] uppercase tracking-wider text-white/50 mb-3">
        Attachment
      </h3>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="relative cursor-pointer group">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
                setFile(e.target.files[0]);
              }
            }}
          />

          <span
            className="
              px-5 py-2.5
              text-sm font-semibold
              rounded-full
              bg-gradient-to-br from-blue-500 to-blue-600
              text-white
              shadow-lg shadow-blue-600/30
              group-hover:from-blue-400 group-hover:to-blue-500
              group-hover:scale-[1.04]
              transition-all duration-200
            "
          >
            Choose file
          </span>
        </label>

        <span className="text-xs text-white/70 truncate max-w-[240px]">
          {uploadedFileName
            ? `Uploaded: ${uploadedFileName}`
            : selectedFile
            ? selectedFile.name
            : "No file selected"}
        </span>
      </div>
    </div>
  );
};
