import React, { useEffect, useState } from "react";
import { UserRole } from "../../enums/UserRole";

interface FilePreviewProps {
  file: File | undefined;
  isUpload: () => void;
  setClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isUpload,
  setClose,
}) => {
  const [isValid, setIsValid] = useState(false);
  const role = UserRole.ANIMATION_WORKER ?? UserRole.AUDIO_MUSIC_STAGIST;
  //const role = localStorage.getItem("role");

  const isImage = file?.type.startsWith("image/");
  const isVideo = file?.type.startsWith("video/");
  const isAudio = file?.type.startsWith("audio/");

  useEffect(() => {
    if (!file) {
      setIsValid(false);
      return;
    }

    if (
      role === UserRole.ANIMATION_WORKER &&
      (isImage || isVideo)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [file, role]);

  if (!file) return null;

  return (
  <div
    className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/20 backdrop-blur-sm
    "
  >
    <div
      className="
        w-full max-w-md
        rounded-2xl
        bg-gradient-to-br from-[#1f2a37]/80 to-[#111827]/80
        border border-white/20
        shadow-2xl
        p-5
        text-white
      "
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-wide">
          File Preview
        </h3>
      </div>

      <div
        className="
          h-44 mb-4
          flex items-center justify-center
          rounded-xl
          bg-white/10
          border border-white/20
          overflow-hidden
        "
      >
        {isImage && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="max-h-full object-contain"
          />
        )}

        {isVideo && (
          <video
            controls
            src={URL.createObjectURL(file)}
            className="max-h-full object-contain"
          />
        )}

        {isAudio && (
          <audio controls className="w-full px-4" />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`
            px-3 py-1.5
            rounded-lg
            text-xs font-medium
            ${
              isValid
                ? "bg-green-500/15 text-green-300 border border-green-400/30"
                : "bg-red-500/15 text-red-300 border border-red-400/30"
            }
          `}
        >
          {isValid ? "✔ Valid file type" : "✖ Invalid file type"}
        </div>

        <div className="flex gap-2">
          <button
            onClick={setClose}
            className="
              px-4 py-2
              rounded-lg
              text-xs font-medium
              bg-white/10
              border border-white/20
              text-white/80
              hover:bg-white/20
              transition
            "
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={isUpload}
            className={`
              px-5 py-2
              rounded-lg
              text-xs font-semibold
              transition-all
              ${
                isValid
                  ? "bg-gradient-to-t from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/30"
                  : "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
              }
            `}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
);
};